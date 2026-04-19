import type {Ref} from 'vue'
import {computed, nextTick, onUnmounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useMessage} from 'naive-ui'
import {addChatSession} from '@/api/celestialHub/chatSession'
import type {SSEController} from '@/api/celestialHub/chatMessage'
import {generateQuestionsStream} from '@/api/celestialHub/question'
import type {
    QuestionGenerateRequestDTO,
    QuestionGenerationMode,
    QuestionGenerationStreamEvent,
    QuestionGenerationSuccessPayload,
    QuestionResponseDTO
} from '@/types/celestialHub/question'
import {resolveQuestionGenerationMode} from '@/types/celestialHub/question'
import type {ChatMessage as ChatMessageEntity} from '@/types/celestialHub/chatMessage'
import type {ChatSessionVO} from '@/types/celestialHub/chatSession'

interface PendingQuestionTask {
    id: string
    sessionId: string | null
    requestId?: string | null
    createdAt: number
    mode: QuestionGenerationMode
    paperName?: string | null
}

interface GenerationContext {
    mode: QuestionGenerationMode
    paperName: string | null
}

interface ViewQuestionsPayload {
    messageId: string | null
    questions: QuestionResponseDTO[]
    activeIndex: number | null
    panelTitle?: string | null
    mode?: QuestionGenerationMode | null
}

export function useQuestionGeneration(
    messages: Ref<ChatMessageEntity[]>,
    currentSession: Ref<ChatSessionVO | null>,
    scrollToBottom: () => void,
    scrollIntoViewInMessages: (selector: string, align?: 'start' | 'center' | 'end') => void,
    loadMessages: (sessionId: string) => Promise<void>,
    selectSession: (session: ChatSessionVO) => Promise<void>
) {
    const {t} = useI18n()
    const message = useMessage()

    const isQuestionToolsVisible = ref(false)
    const generationToolMode = ref<QuestionGenerationMode>('question')

    const isQuestionPanelVisible = ref(false)
    const activeQuestionList = ref<QuestionResponseDTO[] | null>(null)
    const activeQuestionMessageId = ref<string | null>(null)
    const activeQuestionIndex = ref<number | null>(null)
    const activeQuestionPanelTitle = ref<string | null>(null)
    const activeQuestionGenerationMode = ref<QuestionGenerationMode>('question')

    const questionPanelData = computed<QuestionResponseDTO[]>(() => activeQuestionList.value ?? [])

    const questionPanelTitle = computed<string>(() => {
        if (activeQuestionPanelTitle.value) {
            return activeQuestionPanelTitle.value
        }

        const list = questionPanelData.value
        if (!list.length) {
            return ''
        }

        const index = activeQuestionIndex.value ?? 0
        const target = list[index] ?? list[0]
        return target.questionTitle || target.questionContent || ''
    })

    const isQuestionPanelActive = computed(() => isQuestionPanelVisible.value && questionPanelData.value.length > 0)

    const pendingQuestionTasks = ref<PendingQuestionTask[]>([])
    const processedGeneratorMessageIds = new Set<string>()
    const questionStreamControllers = new Map<string, SSEController>()

    const createPendingTaskId = () => {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID()
        }
        return `${Date.now()}-${Math.random().toString(16).slice(2)}`
    }

    const addPendingQuestionTask = (
        sessionId: string | null,
        mode: QuestionGenerationMode,
        paperName?: string | null
    ): string | null => {
        if (!sessionId) {
            return null
        }

        const id = createPendingTaskId()
        pendingQuestionTasks.value.push({
            id,
            sessionId,
            requestId: null,
            createdAt: Date.now(),
            mode,
            paperName: paperName ?? null
        })
        return id
    }

    const bindPendingTaskRequestId = (taskId: string | null, requestId: string | null) => {
        if (!taskId || !requestId) {
            return
        }
        const task = pendingQuestionTasks.value.find(item => item.id === taskId)
        if (task) {
            task.requestId = requestId
        }
    }

    const removePendingTaskById = (taskId: string | null) => {
        if (!taskId) {
            return
        }
        const index = pendingQuestionTasks.value.findIndex(task => task.id === taskId)
        if (index !== -1) {
            pendingQuestionTasks.value.splice(index, 1)
        }
    }

    const removePendingTaskByRequestId = (requestId: string | null) => {
        if (!requestId) {
            return
        }
        const index = pendingQuestionTasks.value.findIndex(task => task.requestId === requestId)
        if (index !== -1) {
            pendingQuestionTasks.value.splice(index, 1)
        }
    }

    const removePendingTaskBySession = (sessionId: string | null) => {
        if (!sessionId) {
            return
        }
        pendingQuestionTasks.value = pendingQuestionTasks.value.filter(task => task.sessionId !== sessionId)
    }

    const registerQuestionStream = (taskId: string, controller: SSEController) => {
        questionStreamControllers.set(taskId, controller)
    }

    const closeQuestionStream = (taskId: string | null) => {
        if (!taskId) {
            return
        }
        const controller = questionStreamControllers.get(taskId)
        if (controller) {
            controller.close()
            questionStreamControllers.delete(taskId)
        }
    }

    const closeAllQuestionStreams = () => {
        questionStreamControllers.forEach(controller => controller.close())
        questionStreamControllers.clear()
    }

    const handleToolsSelect = (key: string | number) => {
        if (key !== 'smartQuestion' && key !== 'smartPaper') {
            return
        }

        if (isQuestionPanelVisible.value) {
            isQuestionPanelVisible.value = false
            activeQuestionMessageId.value = null
            activeQuestionIndex.value = null
            activeQuestionPanelTitle.value = null
        }

        generationToolMode.value = key === 'smartPaper' ? 'paper' : 'question'
        isQuestionToolsVisible.value = true
    }

    const handleViewQuestions = (payload: ViewQuestionsPayload) => {
        if (isQuestionToolsVisible.value) {
            isQuestionToolsVisible.value = false
        }

        activeQuestionMessageId.value = payload.messageId
        activeQuestionList.value = (payload.questions ?? []).slice()
        activeQuestionPanelTitle.value = payload.panelTitle ?? null
        activeQuestionGenerationMode.value = payload.mode === 'paper' ? 'paper' : 'question'

        if (activeQuestionList.value.length) {
            if (payload.activeIndex !== null && payload.activeIndex >= 0 && payload.activeIndex < activeQuestionList.value.length) {
                activeQuestionIndex.value = payload.activeIndex
            } else {
                activeQuestionIndex.value = 0
            }
        } else {
            activeQuestionIndex.value = null
        }

        isQuestionPanelVisible.value = activeQuestionList.value.length > 0
    }

    const handleCloseQuestionPanel = () => {
        isQuestionPanelVisible.value = false
        activeQuestionMessageId.value = null
        activeQuestionIndex.value = null
        activeQuestionPanelTitle.value = null
        activeQuestionGenerationMode.value = 'question'
    }

    const handleQuestionRequestSuccess = async (payload: QuestionGenerationSuccessPayload) => {
        const {mode, request} = payload
        let targetSessionId = request.sessionId || currentSession.value?.id || null

        if (!targetSessionId) {
            const sessionResponse = await addChatSession({
                sessionType: 0,
                title: t('chat.sidebar.newChat'),
                courseId: null
            })
            if (!sessionResponse.data?.id) {
                return
            }
            targetSessionId = sessionResponse.data.id
            await selectSession(sessionResponse.data)
        }

        const resolvedSessionId = String(targetSessionId)
        const pendingTaskId = addPendingQuestionTask(resolvedSessionId, mode, request.paperName ?? null)

        await loadMessages(resolvedSessionId)

        const requestPayload: QuestionGenerateRequestDTO = {
            ...request,
            sessionId: resolvedSessionId
        }

        const requestMessage: ChatMessageEntity = {
            role: 3,
            content: requestPayload.requirement ?? '',
            sessionId: resolvedSessionId,
            messageType: 0,
            questionRequest: JSON.stringify(requestPayload),
            metadata: {
                generationMode: mode,
                paperName: requestPayload.paperName ?? null
            }
        }

        messages.value.push(requestMessage)
        nextTick(() => {
            scrollToBottom()
        })

        if (!pendingTaskId) {
            return
        }

        let settled = false
        try {
            const streamController = generateQuestionsStream(requestPayload, {
                onMessage: (event) => {
                    if (event.status === 'submitted') {
                        bindPendingTaskRequestId(pendingTaskId, event.requestId ?? null)
                        if (event.requestId) {
                            requestMessage.requestId = event.requestId
                        }
                        return
                    }

                    if (event.status === 'completed' || event.status === 'error') {
                        if (settled) {
                            return
                        }
                        settled = true
                        closeQuestionStream(pendingTaskId)
                        void finalizeQuestionStream(pendingTaskId, event)
                    }
                },
                onError: () => {
                    if (settled) {
                        return
                    }
                    settled = true
                    closeQuestionStream(pendingTaskId)
                    removePendingTaskById(pendingTaskId)
                    message.error(t('common.error'))
                },
                onClose: () => {
                    questionStreamControllers.delete(pendingTaskId)
                }
            })

            registerQuestionStream(pendingTaskId, streamController)
        } catch {
            closeQuestionStream(pendingTaskId)
            removePendingTaskById(pendingTaskId)
            message.error(t('common.error'))
        }
    }

    const finalizeQuestionStream = async (taskId: string, event: QuestionGenerationStreamEvent) => {
        const eventRequestId = event.requestId ?? null
        const eventSessionId = event.sessionId ?? getPendingTaskSessionId(taskId)

        if (eventRequestId) {
            removePendingTaskByRequestId(eventRequestId)
        } else {
            removePendingTaskById(taskId)
        }

        const currentSessionId = currentSession.value?.id ? String(currentSession.value.id) : null
        if (eventSessionId && currentSessionId === eventSessionId) {
            await loadMessages(eventSessionId)
            await nextTick()
            scrollToBottom()

            if (event.status === 'completed') {
                const generatedMessage = findGeneratedMessage(eventRequestId, eventSessionId)
                const questions = parseQuestionResponse(generatedMessage)
                if (generatedMessage?.id && questions.length > 0) {
                    if (generatedMessage.id) {
                        processedGeneratorMessageIds.add(generatedMessage.id)
                    }
                    handleViewQuestions({
                        messageId: generatedMessage.id,
                        questions,
                        activeIndex: 0,
                        panelTitle: generatedMessage.metadata?.paperName ?? null,
                        mode: generatedMessage.metadata?.generationMode === 'paper' ? 'paper' : 'question'
                    })
                }
            }
        }

        if (event.status === 'error') {
            message.error(event.message || t('common.error'))
        }
    }

    const getPendingTaskSessionId = (taskId: string | null) => {
        if (!taskId) {
            return null
        }
        return pendingQuestionTasks.value.find(task => task.id === taskId)?.sessionId ?? null
    }

    const findGeneratedMessage = (requestId: string | null, sessionId: string | null) => {
        const enrichedMessages = enrichGenerationMessages(messages.value)

        if (requestId) {
            const target = enrichedMessages.find(msg => msg.role === 4 && msg.requestId === requestId)
            if (target) {
                return target
            }
        }

        const fallbackMessages = enrichedMessages.filter(msg =>
            msg.role === 4
            && (!sessionId || msg.sessionId === sessionId)
        )
        return fallbackMessages[fallbackMessages.length - 1] ?? null
    }

    const parseQuestionResponse = (targetMessage: ChatMessageEntity | null | undefined) => {
        if (!targetMessage?.questionResponse) {
            return [] as QuestionResponseDTO[]
        }

        try {
            return JSON.parse(targetMessage.questionResponse) as QuestionResponseDTO[]
        } catch {
            return [] as QuestionResponseDTO[]
        }
    }

    const scrollToActiveQuestionMessage = () => {
        if (!activeQuestionMessageId.value) {
            return
        }
        if (activeQuestionIndex.value === null || activeQuestionIndex.value === undefined) {
            return
        }
        const selector = `.question-generator-message[data-message-id="${activeQuestionMessageId.value}"] .question-card[data-question-index="${activeQuestionIndex.value}"]`
        scrollIntoViewInMessages(selector, 'center')
    }

    const getDisplayMessages = (sessionId: string | null): ChatMessageEntity[] => {
        const pendingMessages: ChatMessageEntity[] = []

        if (sessionId) {
            pendingQuestionTasks.value
                .filter(task => task.sessionId === sessionId)
                .forEach((task) => {
                    const createTime = new Date(task.createdAt).toISOString()
                    pendingMessages.push({
                        id: task.id,
                        requestId: task.requestId ?? null,
                        role: 4,
                        content: task.mode === 'paper'
                            ? t('chat.toolsMenu.generatingPaperTitle')
                            : t('chat.toolsMenu.generatingTitle'),
                        sessionId,
                        createTime,
                        messageType: 0,
                        metadata: {
                            questionStatus: 'pending',
                            generationMode: task.mode,
                            paperName: task.paperName ?? null
                        },
                        questionResponse: null
                    })
                })
        }

        return enrichGenerationMessages([
            ...messages.value,
            ...pendingMessages
        ])
    }

    watch(
        currentSession,
        (newSession, oldSession) => {
            const newId = newSession?.id ?? null
            const oldId = oldSession?.id ?? null
            if (newId !== oldId) {
                isQuestionPanelVisible.value = false
                activeQuestionMessageId.value = null
                activeQuestionIndex.value = null
                activeQuestionList.value = null
                activeQuestionPanelTitle.value = null
                activeQuestionGenerationMode.value = 'question'
            }
        }
    )

    watch(isQuestionToolsVisible, (newValue) => {
        if (newValue && isQuestionPanelVisible.value) {
            isQuestionPanelVisible.value = false
            activeQuestionMessageId.value = null
            activeQuestionIndex.value = null
            activeQuestionPanelTitle.value = null
            activeQuestionGenerationMode.value = 'question'
        }
    })

    watch(isQuestionPanelVisible, (newValue) => {
        if (newValue && isQuestionToolsVisible.value) {
            isQuestionToolsVisible.value = false
        }
    })

    watch(messages, (newMessages) => {
        newMessages.forEach((msg) => {
            if (msg.role === 4 && msg.id) {
                processedGeneratorMessageIds.add(msg.id)
            }
        })
    }, {deep: true})

    watch(
        [activeQuestionMessageId, activeQuestionIndex, isQuestionPanelActive],
        () => {
            if (!isQuestionPanelActive.value) {
                return
            }
            nextTick(() => {
                scrollToActiveQuestionMessage()
            })
        }
    )

    onUnmounted(() => {
        closeAllQuestionStreams()
    })

    return {
        isQuestionToolsVisible,
        generationToolMode,
        isQuestionPanelVisible,
        activeQuestionList,
        activeQuestionMessageId,
        activeQuestionIndex,
        activeQuestionGenerationMode,
        questionPanelData,
        questionPanelTitle,
        isQuestionPanelActive,
        pendingQuestionTasks,
        handleToolsSelect,
        handleViewQuestions,
        handleCloseQuestionPanel,
        handleQuestionRequestSuccess,
        scrollToActiveQuestionMessage,
        getDisplayMessages,
        addPendingQuestionTask,
        removePendingTaskBySession
    }

    function enrichGenerationMessages(sourceMessages: ChatMessageEntity[]) {
        const requestContextByRequestId = new Map<string, GenerationContext>()
        const requestContextByIndex = new Map<number, GenerationContext>()

        sourceMessages.forEach((msg, index) => {
            if (msg.role !== 3) {
                return
            }
            const context = getGenerationContextFromRequestMessage(msg)
            if (!context) {
                return
            }
            requestContextByIndex.set(index, context)
            if (msg.requestId) {
                requestContextByRequestId.set(msg.requestId, context)
            }
        })

        return sourceMessages.map((msg, index) => {
            const metadata = typeof msg.metadata === 'object' && msg.metadata !== null
                ? {...msg.metadata as Record<string, unknown>}
                : {}

            if (msg.role === 3) {
                const context = requestContextByIndex.get(index)
                if (context) {
                    metadata.generationMode = context.mode
                    metadata.paperName = context.paperName
                }
                return {...msg, metadata}
            }

            if (msg.role === 4) {
                const context = msg.requestId
                    ? requestContextByRequestId.get(msg.requestId) ?? findNearestRequestContext(index, requestContextByIndex)
                    : findNearestRequestContext(index, requestContextByIndex)

                if (context) {
                    metadata.generationMode = metadata.generationMode ?? context.mode
                    metadata.paperName = metadata.paperName ?? context.paperName
                }
                return {...msg, metadata}
            }

            return msg
        })
    }

    function getGenerationContextFromRequestMessage(message: ChatMessageEntity): GenerationContext | null {
        if (!message.questionRequest) {
            return null
        }

        try {
            const request = JSON.parse(message.questionRequest) as QuestionGenerateRequestDTO
            return {
                mode: resolveQuestionGenerationMode(request),
                paperName: request.paperName?.trim() || null
            }
        } catch {
            return null
        }
    }

    function findNearestRequestContext(index: number, contextByIndex: Map<number, GenerationContext>) {
        for (let i = index - 1; i >= 0; i--) {
            const context = contextByIndex.get(i)
            if (context) {
                return context
            }
        }
        return null
    }
}
