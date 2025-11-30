import {nextTick, onUnmounted, ref, watch} from 'vue'
import type {ChatMessage} from '@/types/celestialHub/chatMessage'
import type {ChatSessionVO} from '@/types/celestialHub/chatSession'
import {
    cancelChatStreamKafka,
    chatStreamKafka,
    getDefaultCancelChatStreamKafkaDTO,
    getDefaultKafkaChatRequestDTO,
    listMessagesBySessionId,
    type SSEController
} from '@/api/celestialHub/chatMessage'
import {addChatSession} from '@/api/celestialHub/chatSession'

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
    const chatContentRef = ref<HTMLElement | null>(null)
    const currentSSEController = ref<SSEController | null>(null)
    const currentRequestId = ref<string | null>(null)
    // 是否使用RAG检索（开关）
    const useRag = ref<boolean | null>(null)
    useRag.value = resolveStoredUseRag()
    // 是否自动滚动到底（用户一旦上滚则置为false，回到底部再置true）
    const isAutoScroll = ref<boolean | null>(null)
    isAutoScroll.value = true
    // 消息容器元素引用
    let messagesWrapperEl: HTMLElement | null = null

    watch(useRag, (value) => {
        if (typeof window === 'undefined' || value === null) {
            return
        }
        window.localStorage.setItem(RAG_PREFERENCE_STORAGE_KEY, String(value))
    }, {immediate: true})

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

    // 计算是否接近底部
    const isNearBottom = (el: HTMLElement) => {
        const threshold = 12
        const distance = el.scrollHeight - el.scrollTop - el.clientHeight
        return distance <= threshold
    }

    // 绑定滚动监听（懒绑定）
    const ensureScrollListener = () => {
        if (!chatContentRef.value) {
            return
        }
        if (!messagesWrapperEl) {
            const el = chatContentRef.value.querySelector('.messages-wrapper') as HTMLElement | null
            if (el) {
                messagesWrapperEl = el
                messagesWrapperEl.addEventListener('scroll', handleWrapperScroll, {passive: true})
                // 初始化一次状态
                isAutoScroll.value = isNearBottom(messagesWrapperEl)
            }
        }
    }

    const handleWrapperScroll = () => {
        if (!messagesWrapperEl) {
            return
        }
        // 当用户未在底部时，关闭自动滚动；回到底部再开启
        isAutoScroll.value = isNearBottom(messagesWrapperEl)
    }

    // 滚动到底部
    const scrollToBottom = () => {
        ensureScrollListener()
        if (isAutoScroll.value === false) {
            return
        }
        if (messagesWrapperEl) {
            const container = messagesWrapperEl
            const scrollHeight = container.scrollHeight

            // 立即滚动一次
            container.scrollTop = scrollHeight

            // 使用 requestAnimationFrame 确保在下次重绘时滚动
            requestAnimationFrame(() => {
                container.scrollTop = scrollHeight
            })

            // 延迟再次滚动，确保DOM完全渲染
            setTimeout(() => {
                if (isAutoScroll.value !== false) {
                    container.scrollTop = container.scrollHeight
                }
            }, 100)

            // 再次延迟滚动，处理异步内容
            setTimeout(() => {
                if (isAutoScroll.value !== false) {
                    container.scrollTop = container.scrollHeight
                }
            }, 300)
        }
    }

    // 加载消息列表
    const loadMessages = async (sessionId: string) => {
        isLoading.value = true
        const response = await listMessagesBySessionId(sessionId)
        if (response.data) {
            messages.value = response.data
            // 加载完消息后滚动到底部
            await nextTick()
            // 使用更长的延迟确保DOM完全渲染
            setTimeout(() => {
                scrollToBottom()
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

        // 添加用户消息
        const userMessage: ChatMessage = {
            role: 0,
            content: content,
            sessionId: activeSessionId.value,
            messageType: 0
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

        // 发送流式请求
        const chatRequest = getDefaultKafkaChatRequestDTO()
        chatRequest.sessionId = activeSessionId.value
        chatRequest.message = content
        chatRequest.sessionType = 0
        chatRequest.useRag = useRag.value === true
        chatRequest.stream = true
        const requestId = createRequestId()
        chatRequest.requestId = requestId
        currentRequestId.value = requestId

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

        // 添加用户消息
        const userMessage: ChatMessage = {
            role: 0,
            content: content,
            sessionId: activeSessionId.value,
            messageType: 0
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

        // 发送流式请求
        const chatRequest = getDefaultKafkaChatRequestDTO()
        chatRequest.sessionId = activeSessionId.value
        chatRequest.message = content
        chatRequest.sessionType = 0
        chatRequest.useRag = useRag.value === true
        chatRequest.stream = true
        const requestId = createRequestId()
        chatRequest.requestId = requestId
        currentRequestId.value = requestId

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
            // 确保选择会话后也滚动到底部
            await nextTick()
            setTimeout(() => {
                scrollToBottom()
            }, 500)
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

    // 组件卸载时关闭连接
    onUnmounted(() => {
        closeEventSource()
        if (messagesWrapperEl) {
            messagesWrapperEl.removeEventListener('scroll', handleWrapperScroll)
            messagesWrapperEl = null
        }
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
        useRag
    }
}

