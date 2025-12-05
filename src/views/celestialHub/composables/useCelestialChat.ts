import {nextTick, onUnmounted, ref, watch} from 'vue'
import type {ChatMessage} from '@/types/celestialHub/chatMessage'
import type {ChatSessionVO} from '@/types/celestialHub/chatSession'
import type {FileReference} from '@/types/celestialHub/knowledge'
import {
    cancelChatStreamKafka,
    chatStreamKafka,
    getDefaultCancelChatStreamKafkaDTO,
    getDefaultKafkaChatRequestDTO,
    listMessagesBySessionId,
    type SSEController
} from '@/api/celestialHub/chatMessage'
import {addChatSession} from '@/api/celestialHub/chatSession'
import {useChatScroll} from '@/views/celestialHub/composables/useChatScroll'
import {useUserStore} from '@/store'

const RAG_PREFERENCE_STORAGE_KEY = 'celestialHub_useRag'

const resolveStoredUseRag = (): boolean => {
    if (typeof window === 'undefined') {
        return true
    }
    const storedValue = window.localStorage.getItem(RAG_PREFERENCE_STORAGE_KEY)
    if (storedValue === null) {
        return true
    }
    return storedValue === 'true'
}

export function useCelestialChat() {
    const messages = ref<ChatMessage[]>([])
    const input = ref('')
    const isLoading = ref(false)
    const activeSessionId = ref<string | null>(null)
    const currentSession = ref<ChatSessionVO | null>(null)
    const {
        chatContentRef,
        scrollToBottom,
        scrollToBottomForce,
        scrollIntoViewInMessages
    } = useChatScroll()
    const currentSSEController = ref<SSEController | null>(null)
    const currentRequestId = ref<string | null>(null)
    const userStore = useUserStore()

    // 是否使用RAG检索（开关）
    const useRag = ref<boolean | null>(null)
    const isAdmin = () => userStore.hasRole('ADMIN')

    // 初始化useRag：非admin用户始终为true
    if (isAdmin()) {
        useRag.value = resolveStoredUseRag()
    } else {
        useRag.value = true
    }

    watch(useRag, (value) => {
        if (typeof window === 'undefined' || value === null) {
            return
        }
        // 非admin用户不允许修改，始终为true
        if (!isAdmin()) {
            useRag.value = true
            return
        }
        window.localStorage.setItem(RAG_PREFERENCE_STORAGE_KEY, String(value))
    }, {immediate: true})
    // 文件引用列表
    const fileReferences = ref<FileReference[] | null>(null)

    const createRequestId = () => {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID()
        }
        return `${Date.now()}-${Math.random().toString(16).slice(2)}`
    }

    const cancelActiveRequest = (reason: string | null = 'user_interrupt') => {
        if (!currentRequestId.value) {
            return
        }
        const cancelDTO = getDefaultCancelChatStreamKafkaDTO()
        cancelDTO.requestId = currentRequestId.value
        cancelDTO.reason = reason
        cancelChatStreamKafka(cancelDTO)
        currentRequestId.value = null
    }

    // 关闭当前的SSE连接
    const closeEventSource = (shouldCancel = false) => {
        if (shouldCancel) {
            cancelActiveRequest()
        }
        if (currentSSEController.value) {
            currentSSEController.value.close()
            currentSSEController.value = null
        }
        currentRequestId.value = null
    }

    const removePendingAssistantMessage = () => {
        const lastIndex = messages.value.length - 1
        if (lastIndex < 0) {
            return
        }
        const lastMessage = messages.value[lastIndex]
        if (lastMessage?.role === 1 && (!lastMessage.content || lastMessage.content.length === 0)) {
            messages.value.splice(lastIndex, 1)
        }
    }

    const interruptStreaming = () => {
        if (!isLoading.value) {
            return
        }
        closeEventSource(true)
        isLoading.value = false
        removePendingAssistantMessage()
    }

    // 加载消息列表
    const loadMessages = async (sessionId: string) => {
        isLoading.value = true
        const response = await listMessagesBySessionId(sessionId)
        if (response.data) {
            messages.value = response.data
            // 加载完消息后，滚动到最后一次用户发起的对话（包括出题请求）
            await nextTick()
            setTimeout(() => {
                const currentMessages = messages.value
                if (!currentMessages.length) {
                    scrollToBottom()
                    return
                }
                const lastUserLikeMessage = [...currentMessages]
                    .reverse()
                    .find((msg) => msg.role === 0 || msg.role === 3)
                if (lastUserLikeMessage?.id) {
                    scrollIntoViewInMessages(`.chat-message[data-message-id="${lastUserLikeMessage.id}"]`, 'start')
                } else {
                    scrollToBottom()
                }
            }, 200)
        }
        isLoading.value = false
    }

    // 发送消息并流式接收回复
    const sendMessage = async () => {
        if (!input.value.trim() || isLoading.value) {
            return
        }

        // 如果存在之前的连接，先关闭并取消
        closeEventSource(true)

        const content = input.value.trim()
        input.value = ''
        isLoading.value = true

        // 如果是新会话，先创建会话
        if (!activeSessionId.value) {
            const sessionResponse = await addChatSession({
                sessionType: 0,
                title: content.substring(0, 50),
                courseId: null
            })
            if (sessionResponse.data) {
                activeSessionId.value = sessionResponse.data.id || null
                currentSession.value = sessionResponse.data
            }
        }

        // 保存当前文件引用（发送前保存，发送后会清空）
        const currentFileReferences = fileReferences.value

        // 添加用户消息
        const userMessage: ChatMessage = {
            role: 0,
            content: content,
            sessionId: activeSessionId.value,
            messageType: 0,
            metadata: currentFileReferences ? {fileReferences: currentFileReferences} : null
        }
        messages.value.push(userMessage)

        // 创建AI助手消息占位符
        const assistantMessage: ChatMessage = {
            id: null,
            role: 1,
            content: '',
            sessionId: activeSessionId.value,
            messageType: 0
        }
        messages.value.push(assistantMessage)
        const assistantIndex = messages.value.length - 1
        scrollToBottomForce()

        // 发送流式请求
        const chatRequest = getDefaultKafkaChatRequestDTO()
        chatRequest.sessionId = activeSessionId.value
        chatRequest.message = content
        chatRequest.sessionType = 0
        chatRequest.useRag = useRag.value === true
        chatRequest.stream = true
        chatRequest.fileReferences = fileReferences.value
        const requestId = createRequestId()
        chatRequest.requestId = requestId
        currentRequestId.value = requestId

        // 清空文件引用（发送后清空）
        fileReferences.value = null

        // 累积的AI回复内容
        let accumulatedContent = ''

        try {
            // 创建SSE连接控制器
            const sseController = chatStreamKafka(chatRequest, {
                onMessage: (data: string) => {
                    // SSE数据格式：如果后端发送的是纯文本，event.data就是内容
                    // 如果后端发送的是JSON格式，需要解析
                    if (data === '[DONE]') {
                        // 流结束
                        closeEventSource()
                        isLoading.value = false
                        return
                    }

                    // 累积内容
                    accumulatedContent += data

                    // 更新消息内容
                    const currentMsg = messages.value[assistantIndex]
                    if (currentMsg) {
                        messages.value[assistantIndex] = {
                            ...currentMsg,
                            content: accumulatedContent
                        }
                    }

                    // 滚动到底部
                    scrollToBottom()
                },
                onOpen: () => {
                    // 连接打开
                },
                onError: () => {
                    const hasContent = accumulatedContent.length > 0

                    // 如果已经收到内容，可能是流正常结束（后端关闭连接）
                    // 不删除消息，保留已收到的内容
                    if (hasContent) {
                        closeEventSource()
                        isLoading.value = false
                        return
                    }

                    // 如果没有收到任何内容，才是真正的错误，删除消息
                    if (messages.value[assistantIndex]) {
                        messages.value.splice(assistantIndex, 1)
                    }
                    closeEventSource()
                    isLoading.value = false
                },
                onClose: () => {
                    // 连接关闭
                    closeEventSource()
                    isLoading.value = false
                }
            })

            // 保存SSE控制器实例
            currentSSEController.value = sseController
        } catch (error) {
            // 流式接收失败，删除最后一条消息
            if (messages.value[assistantIndex]) {
                messages.value.splice(assistantIndex, 1)
            }
            closeEventSource()
            isLoading.value = false
        }
    }

    // 重新发送消息（根据消息内容）
    const resendMessage = async (messageContent: string) => {
        if (!messageContent.trim() || isLoading.value) {
            return
        }

        // 如果存在之前的连接，先关闭并取消
        closeEventSource(true)

        const content = messageContent.trim()
        isLoading.value = true

        // 如果是新会话，先创建会话
        if (!activeSessionId.value) {
            const sessionResponse = await addChatSession({
                sessionType: 0,
                title: content.substring(0, 50),
                courseId: null
            })
            if (sessionResponse.data) {
                activeSessionId.value = sessionResponse.data.id || null
                currentSession.value = sessionResponse.data
            }
        }

        // 保存当前文件引用（发送前保存，发送后会清空）
        const currentFileReferences = fileReferences.value

        // 添加用户消息
        const userMessage: ChatMessage = {
            role: 0,
            content: content,
            sessionId: activeSessionId.value,
            messageType: 0,
            metadata: currentFileReferences ? {fileReferences: currentFileReferences} : null
        }
        messages.value.push(userMessage)

        // 创建AI助手消息占位符
        const assistantMessage: ChatMessage = {
            id: null,
            role: 1,
            content: '',
            sessionId: activeSessionId.value,
            messageType: 0
        }
        messages.value.push(assistantMessage)
        const assistantIndex = messages.value.length - 1
        scrollToBottomForce()

        // 发送流式请求
        const chatRequest = getDefaultKafkaChatRequestDTO()
        chatRequest.sessionId = activeSessionId.value
        chatRequest.message = content
        chatRequest.sessionType = 0
        chatRequest.useRag = useRag.value === true
        chatRequest.stream = true
        chatRequest.fileReferences = fileReferences.value
        const requestId = createRequestId()
        chatRequest.requestId = requestId
        currentRequestId.value = requestId

        // 清空文件引用（发送后清空）
        fileReferences.value = null

        // 累积的AI回复内容
        let accumulatedContent = ''

        try {
            // 创建SSE连接控制器
            const sseController = chatStreamKafka(chatRequest, {
                onMessage: (data: string) => {
                    if (data === '[DONE]') {
                        closeEventSource()
                        isLoading.value = false
                        return
                    }

                    accumulatedContent += data

                    const currentMsg = messages.value[assistantIndex]
                    if (currentMsg) {
                        messages.value[assistantIndex] = {
                            ...currentMsg,
                            content: accumulatedContent
                        }
                    }

                    scrollToBottom()
                },
                onOpen: () => {
                    // 连接打开
                },
                onError: () => {
                    const hasContent = accumulatedContent.length > 0

                    if (hasContent) {
                        closeEventSource()
                        isLoading.value = false
                        return
                    }

                    if (messages.value[assistantIndex]) {
                        messages.value.splice(assistantIndex, 1)
                    }
                    closeEventSource()
                    isLoading.value = false
                },
                onClose: () => {
                    closeEventSource()
                    isLoading.value = false
                }
            })

            currentSSEController.value = sseController
        } catch (error) {
            if (messages.value[assistantIndex]) {
                messages.value.splice(assistantIndex, 1)
            }
            closeEventSource()
            isLoading.value = false
        }
    }

    // 选择会话
    const selectSession = async (session: ChatSessionVO) => {
        // 关闭当前的连接但不触发取消接口
        closeEventSource()

        activeSessionId.value = session.id || null
        currentSession.value = session
        if (activeSessionId.value) {
            await loadMessages(activeSessionId.value)
        }
    }

    // 新建会话
    const newChat = () => {
        // 关闭当前的连接但不触发取消接口
        closeEventSource()

        activeSessionId.value = null
        currentSession.value = null
        messages.value = []
    }

    // 组件卸载时关闭连接（滚动监听的卸载由 useChatScroll 处理）
    onUnmounted(() => {
        closeEventSource()
    })

    return {
        messages,
        input,
        isLoading,
        activeSessionId,
        currentSession,
        chatContentRef,
        sendMessage,
        resendMessage,
        interruptStreaming,
        selectSession,
        newChat,
        loadMessages,
        scrollToBottom,
        scrollIntoViewInMessages,
        useRag,
        fileReferences
    }
}

