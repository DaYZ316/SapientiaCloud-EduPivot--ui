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
import {addChatSession, getUserSessions} from '@/api/celestialHub/chatSession'
import {useChatScroll} from '@/views/celestialHub/composables/useChatScroll'
import {useUserStore} from '@/store'

const RAG_PREFERENCE_STORAGE_KEY = 'celestialHub_useRag'

type StreamUpdateController = {
    append: (chunk: string) => void
    finish: () => void
    hasContent: () => boolean
    dispose: () => void
}

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
        scrollIntoViewInMessages,
        scrollToLastUserMessage,
        resetScrollState
    } = useChatScroll()
    const currentSSEController = ref<SSEController | null>(null)
    const currentRequestId = ref<string | null>(null)
    let activeStreamUpdater: StreamUpdateController | null = null

    const userStore = useUserStore()
    const useRag = ref<boolean | null>(null)
    const fileReferences = ref<FileReference[] | null>(null)

    const isAdmin = () => userStore.hasRole('ADMIN')

    if (isAdmin()) {
        useRag.value = resolveStoredUseRag()
    } else {
        useRag.value = true
    }

    watch(useRag, (value) => {
        if (typeof window === 'undefined' || value === null) {
            return
        }

        if (!isAdmin()) {
            useRag.value = true
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

    const createStreamUpdateController = (assistantIndex: number): StreamUpdateController => {
        let accumulatedContent = ''
        let pendingContent = ''
        let frameId: number | null = null

        const flush = () => {
            if (!pendingContent) {
                return
            }

            accumulatedContent += pendingContent
            pendingContent = ''

            const currentMessage = messages.value[assistantIndex]
            if (currentMessage) {
                messages.value[assistantIndex] = {
                    ...currentMessage,
                    content: accumulatedContent
                }
            }

            scrollToBottom('sync')
        }

        const cancelFrame = () => {
            if (frameId !== null) {
                window.cancelAnimationFrame(frameId)
                frameId = null
            }
        }

        return {
            append(chunk: string) {
                pendingContent += chunk
                if (frameId !== null) {
                    return
                }

                frameId = window.requestAnimationFrame(() => {
                    frameId = null
                    flush()
                })
            },
            finish() {
                cancelFrame()
                flush()
            },
            hasContent() {
                return accumulatedContent.length > 0 || pendingContent.length > 0
            },
            dispose() {
                cancelFrame()
                pendingContent = ''
            }
        }
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

    const closeEventSource = (shouldCancel = false) => {
        if (shouldCancel) {
            cancelActiveRequest()
        }

        if (activeStreamUpdater) {
            activeStreamUpdater.dispose()
            activeStreamUpdater = null
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

    const loadMessages = async (sessionId: string) => {
        isLoading.value = true
        const response = await listMessagesBySessionId(sessionId)

        if (response.data) {
            messages.value = response.data
            await nextTick()
            setTimeout(() => scrollToLastUserMessage(messages.value), 100)
            setTimeout(() => scrollToLastUserMessage(messages.value), 300)
            setTimeout(() => scrollToLastUserMessage(messages.value), 500)
        }

        isLoading.value = false
    }

    const startStreamRequest = async (messageContent: string, externalFileReferences: FileReference[] | null = null) => {
        if (!messageContent.trim() || isLoading.value) {
            return
        }

        closeEventSource(true)

        const content = messageContent.trim()
        isLoading.value = true

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

        const currentFileReferences = externalFileReferences ?? fileReferences.value

        const userMessage: ChatMessage = {
            role: 0,
            content,
            sessionId: activeSessionId.value,
            messageType: 0,
            metadata: currentFileReferences ? {fileReferences: currentFileReferences} : null
        }
        messages.value.push(userMessage)

        const assistantMessage: ChatMessage = {
            id: null,
            role: 1,
            content: '',
            sessionId: activeSessionId.value,
            messageType: 0
        }
        messages.value.push(assistantMessage)

        const assistantIndex = messages.value.length - 1
        scrollToBottomForce('settled')

        const chatRequest = getDefaultKafkaChatRequestDTO()
        chatRequest.sessionId = activeSessionId.value
        chatRequest.message = content
        chatRequest.sessionType = 0
        chatRequest.useRag = useRag.value === true
        chatRequest.stream = true
        chatRequest.fileReferences = currentFileReferences

        const requestId = createRequestId()
        chatRequest.requestId = requestId
        currentRequestId.value = requestId

        if (!externalFileReferences) {
            fileReferences.value = null
        }

        activeStreamUpdater = createStreamUpdateController(assistantIndex)

        try {
            const sseController = chatStreamKafka(chatRequest, {
                onMessage: (data: string) => {
                    if (data === '[DONE]') {
                        activeStreamUpdater?.finish()
                        closeEventSource()
                        isLoading.value = false
                        return
                    }

                    activeStreamUpdater?.append(data)
                },
                onOpen: () => {
                    // no-op
                },
                onError: () => {
                    const hasContent = activeStreamUpdater?.hasContent() === true

                    if (hasContent) {
                        activeStreamUpdater?.finish()
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
                    activeStreamUpdater?.finish()
                    closeEventSource()
                    isLoading.value = false
                }
            })

            currentSSEController.value = sseController
        } catch {
            if (messages.value[assistantIndex]) {
                messages.value.splice(assistantIndex, 1)
            }
            closeEventSource()
            isLoading.value = false
        }
    }

    const sendMessage = async () => {
        if (!input.value.trim() || isLoading.value) {
            return
        }

        const content = input.value.trim()
        input.value = ''
        await startStreamRequest(content)
    }

    const resendMessage = async (messageContent: string, externalFileReferences: FileReference[] | null = null) => {
        await startStreamRequest(messageContent, externalFileReferences)
    }

    const selectSession = async (session: ChatSessionVO) => {
        closeEventSource()
        resetScrollState()

        activeSessionId.value = session.id || null
        currentSession.value = session

        if (activeSessionId.value) {
            await loadMessages(activeSessionId.value)
        }
    }

    const autoSelectLastSession = async () => {
        try {
            const response = await getUserSessions()

            if (response.data && response.data.length > 0) {
                const sessions = response.data.sort((a, b) => {
                    const timeA = a.updateTime ? new Date(a.updateTime).getTime() : 0
                    const timeB = b.updateTime ? new Date(b.updateTime).getTime() : 0
                    return timeB - timeA
                })

                const lastSession = sessions[0]
                await selectSession(lastSession)
                return lastSession
            }
        } catch (error) {
            console.warn('Failed to auto-select last session:', error)
        }

        return null
    }

    const newChat = () => {
        closeEventSource()
        resetScrollState()
        activeSessionId.value = null
        currentSession.value = null
        messages.value = []
    }

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
        scrollToLastUserMessage,
        autoSelectLastSession,
        useRag,
        fileReferences
    }
}
