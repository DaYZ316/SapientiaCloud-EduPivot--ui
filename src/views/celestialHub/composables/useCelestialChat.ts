import {nextTick, onUnmounted, ref} from 'vue'
import type {ChatMessage} from '@/types/celestialHub/chatMessage'
import type {ChatSessionVO} from '@/types/celestialHub/chatSession'
import {
    chatStream,
    getDefaultChatRequestDTO,
    listMessagesBySessionId,
    type SSEController
} from '@/api/celestialHub/chatMessage'
import {addChatSession} from '@/api/celestialHub/chatSession'

export function useCelestialChat() {
    const messages = ref<ChatMessage[]>([])
    const input = ref('')
    const isLoading = ref(false)
    const activeSessionId = ref<string | null>(null)
    const currentSession = ref<ChatSessionVO | null>(null)
    const chatContentRef = ref<HTMLElement | null>(null)
    const currentSSEController = ref<SSEController | null>(null)

    // 关闭当前的SSE连接
    const closeEventSource = () => {
        if (currentSSEController.value) {
            currentSSEController.value.close()
            currentSSEController.value = null
        }
    }

    // 滚动到底部
    const scrollToBottom = () => {
        if (chatContentRef.value) {
            const container = chatContentRef.value.querySelector('.messages-wrapper')
            if (container) {
                const scrollHeight = container.scrollHeight

                // 立即滚动一次
                container.scrollTop = scrollHeight

                // 使用 requestAnimationFrame 确保在下次重绘时滚动
                requestAnimationFrame(() => {
                    container.scrollTop = scrollHeight
                })

                // 延迟再次滚动，确保DOM完全渲染
                setTimeout(() => {
                    container.scrollTop = container.scrollHeight
                }, 100)

                // 再次延迟滚动，处理异步内容
                setTimeout(() => {
                    container.scrollTop = container.scrollHeight
                }, 300)
            }
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

        // 如果存在之前的连接，先关闭
        closeEventSource()

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
        const chatRequest = getDefaultChatRequestDTO()
        chatRequest.sessionId = activeSessionId.value
        chatRequest.message = content
        chatRequest.sessionType = 0
        chatRequest.useRag = true
        chatRequest.stream = true

        // 累积的AI回复内容
        let accumulatedContent = ''

        try {
            // 创建SSE连接控制器
            const sseController = chatStream(chatRequest, {
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

        // 如果存在之前的连接，先关闭
        closeEventSource()

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
        const chatRequest = getDefaultChatRequestDTO()
        chatRequest.sessionId = activeSessionId.value
        chatRequest.message = content
        chatRequest.sessionType = 0
        chatRequest.useRag = true
        chatRequest.stream = true

        // 累积的AI回复内容
        let accumulatedContent = ''

        try {
            // 创建SSE连接控制器
            const sseController = chatStream(chatRequest, {
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
        // 关闭当前的连接
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
        // 关闭当前的连接
        closeEventSource()

        activeSessionId.value = null
        currentSession.value = null
        messages.value = []
    }

    // 组件卸载时关闭连接
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
        selectSession,
        newChat,
        loadMessages,
        scrollToBottom
    }
}

