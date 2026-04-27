import type {Ref} from 'vue'
import {computed, nextTick, onUnmounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useMessage} from 'naive-ui'
import {addChatSession} from '@/api/celestialHub/chatSession'
import type {SSEController} from '@/api/celestialHub/chatMessage'
import {checkQuestionRequestStatus, generateQuestionsStream} from '@/api/celestialHub/question'
import type {
    QuestionGenerateRequestDTO,
    QuestionGenerationMode,
    QuestionGenerationStage,
    QuestionGenerationStreamEvent,
    QuestionGenerationSuccessPayload,
    QuestionResponseDTO
} from '@/types/celestialHub/question'
import {QuestionGenerationStageEnum, resolveQuestionGenerationMode} from '@/types/celestialHub/question'
import type {ChatMessage as ChatMessageEntity} from '@/types/celestialHub/chatMessage'
import type {ChatSessionVO} from '@/types/celestialHub/chatSession'

interface PendingQuestionTask {
    id: string
    sessionId: string | null
    requestId?: string | null
    createdAt: number
    updatedAt: number
    mode: QuestionGenerationMode
    showStageDetails?: boolean | null
    status: 'pending' | 'processing'
    stage?: QuestionGenerationStage | null
    progressMessage?: string | null
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
    const stageI18nKeys: Record<QuestionGenerationStageEnum, string> = {
        [QuestionGenerationStageEnum.RECEIVED]: 'chat.toolsMenu.stage.received',
        [QuestionGenerationStageEnum.CONTEXT_READY]: 'chat.toolsMenu.stage.contextReady',
        [QuestionGenerationStageEnum.PLANNED]: 'chat.toolsMenu.stage.planned',
        [QuestionGenerationStageEnum.GENERATED]: 'chat.toolsMenu.stage.generated',
        [QuestionGenerationStageEnum.VALIDATED]: 'chat.toolsMenu.stage.validated',
        [QuestionGenerationStageEnum.REPAIRED]: 'chat.toolsMenu.stage.repaired',
        [QuestionGenerationStageEnum.ASSEMBLED]: 'chat.toolsMenu.stage.assembled',
        [QuestionGenerationStageEnum.RESPONDED]: 'chat.toolsMenu.stage.responded',
        [QuestionGenerationStageEnum.FAILED]: 'chat.toolsMenu.stage.failed'
    }

    const resolveStageDescription = (stage?: QuestionGenerationStage | null) => {
        if (!stage) {
            return null
        }

        const key = stageI18nKeys[stage as QuestionGenerationStageEnum]
        if (!key) {
            return null
        }

        return t(key)
    }

    const isPaperTask = (task: Pick<PendingQuestionTask, 'mode'>) => task.mode === 'paper'
    const shouldShowDetailedProgress = (task: Pick<PendingQuestionTask, 'mode' | 'showStageDetails'>) => {
        if (typeof task.showStageDetails === 'boolean') {
            return task.showStageDetails
        }
        return isPaperTask(task)
    }

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
    const manuallyClosedStreamTaskIds = new Set<string>()
    const recoveringQuestionTaskIds = new Set<string>()
    const streamRecoveryRetryIntervalMs = 1500
    const streamRecoveryMaxAttempts = 16

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
            updatedAt: Date.now(),
            mode,
            showStageDetails: mode === 'paper',
            status: 'pending',
            stage: null,
            progressMessage: null,
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

    const resolveCurrentSessionId = () => currentSession.value?.id ? String(currentSession.value.id) : null

    const getPendingTaskById = (taskId: string | null) => {
        if (!taskId) {
            return null
        }
        return pendingQuestionTasks.value.find(task => task.id === taskId) ?? null
    }

    const getPendingTaskByRequestId = (requestId: string | null) => {
        if (!requestId) {
            return null
        }
        return pendingQuestionTasks.value.find(task => task.requestId === requestId) ?? null
    }

    const registerQuestionStream = (taskId: string, controller: SSEController) => {
        questionStreamControllers.set(taskId, controller)
    }

    const closeQuestionStream = (taskId: string | null, isManualClose = true) => {
        if (!taskId) {
            return
        }
        const controller = questionStreamControllers.get(taskId)
        if (controller) {
            if (isManualClose) {
                manuallyClosedStreamTaskIds.add(taskId)
            }
            controller.close()
            questionStreamControllers.delete(taskId)
        }
    }

    const closeAllQuestionStreams = () => {
        questionStreamControllers.forEach((controller, taskId) => {
            manuallyClosedStreamTaskIds.add(taskId)
            controller.close()
        })
        questionStreamControllers.clear()
    }

    const waitForRecoveryRetry = (delayMs: number) => new Promise<void>((resolve) => {
        window.setTimeout(resolve, delayMs)
    })

    const resolvePendingTaskByIdentifiers = (taskId: string, requestId: string | null) => {
        return getPendingTaskByRequestId(requestId) ?? getPendingTaskById(taskId)
    }

    const touchPendingTaskDuringRecovery = (taskId: string) => {
        const task = getPendingTaskById(taskId)
        if (!task) {
            return
        }
        task.status = 'processing'
        task.updatedAt = Date.now()
    }

    const resolveMessageTimestamp = (targetMessage: ChatMessageEntity | null | undefined) => {
        if (!targetMessage?.createTime) {
            return 0
        }
        const timestamp = new Date(targetMessage.createTime).getTime()
        return Number.isFinite(timestamp) ? timestamp : 0
    }

    const syncCompletedQuestionResult = async (
        taskId: string,
        requestId: string | null,
        sessionId: string | null
    ) => {
        const currentSessionId = resolveCurrentSessionId()
        if (!sessionId || currentSessionId !== sessionId) {
            return false
        }

        await loadMessages(sessionId)
        await nextTick()
        scrollToBottom()

        const generatedMessage = findGeneratedMessage(requestId, sessionId)
        if (!generatedMessage) {
            return false
        }

        const pendingTask = resolvePendingTaskByIdentifiers(taskId, requestId)
        if (!requestId && pendingTask) {
            const generatedAt = resolveMessageTimestamp(generatedMessage)
            if (generatedAt > 0 && generatedAt + 500 < pendingTask.createdAt) {
                return false
            }
        }

        const questions = parseQuestionResponse(generatedMessage)
        if (!generatedMessage.id || questions.length === 0) {
            return false
        }

        processedGeneratorMessageIds.add(generatedMessage.id)
        handleViewQuestions({
            messageId: generatedMessage.id,
            questions,
            activeIndex: 0,
            panelTitle: generatedMessage.metadata?.paperName ?? null,
            mode: generatedMessage.metadata?.generationMode === 'paper' ? 'paper' : 'question'
        })

        if (requestId) {
            removePendingTaskByRequestId(requestId)
        } else {
            removePendingTaskById(taskId)
        }
        return true
    }

    const recoverQuestionStreamAfterDisconnect = (taskId: string) => {
        if (!taskId || recoveringQuestionTaskIds.has(taskId)) {
            return
        }
        if (!getPendingTaskById(taskId)) {
            return
        }

        recoveringQuestionTaskIds.add(taskId)
        touchPendingTaskDuringRecovery(taskId)

        void (async () => {
            try {
                for (let attempt = 0; attempt < streamRecoveryMaxAttempts; attempt++) {
                    const task = getPendingTaskById(taskId)
                    if (!task) {
                        return
                    }

                    const requestId = task.requestId ?? null
                    const sessionId = task.sessionId ?? null

                    const synced = await syncCompletedQuestionResult(taskId, requestId, sessionId)
                    if (synced) {
                        return
                    }

                    let isCompleted = false
                    if (requestId) {
                        try {
                            const statusResponse = await checkQuestionRequestStatus(requestId)
                            isCompleted = statusResponse.data === true
                        } catch {
                            isCompleted = false
                        }
                    }

                    if (isCompleted && sessionId && resolveCurrentSessionId() !== sessionId) {
                        removePendingTaskByRequestId(requestId)
                        return
                    }

                    if (isCompleted) {
                        const retriedSync = await syncCompletedQuestionResult(taskId, requestId, sessionId)
                        if (retriedSync) {
                            return
                        }
                    }

                    await waitForRecoveryRetry(streamRecoveryRetryIntervalMs)
                }
            } finally {
                recoveringQuestionTaskIds.delete(taskId)
            }
        })()
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
            generationMode: mode,
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
                        updatePendingTaskProgress(pendingTaskId, event)
                        return
                    }

                    if (event.status === 'processing') {
                        updatePendingTaskProgress(pendingTaskId, event)
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
                    recoverQuestionStreamAfterDisconnect(pendingTaskId)
                },
                onClose: () => {
                    questionStreamControllers.delete(pendingTaskId)
                    const isManualClose = manuallyClosedStreamTaskIds.delete(pendingTaskId)
                    if (isManualClose || settled) {
                        return
                    }
                    settled = true
                    recoverQuestionStreamAfterDisconnect(pendingTaskId)
                }
            })

            registerQuestionStream(pendingTaskId, streamController)
        } catch {
            closeQuestionStream(pendingTaskId)
            if (getPendingTaskById(pendingTaskId)?.requestId) {
                recoverQuestionStreamAfterDisconnect(pendingTaskId)
            } else {
                removePendingTaskById(pendingTaskId)
            }
            message.error(t('common.error'))
        }
    }

    const finalizeQuestionStream = async (taskId: string, event: QuestionGenerationStreamEvent) => {
        const eventRequestId = event.requestId ?? getPendingTaskRequestId(taskId)
        const eventSessionId = event.sessionId ?? getPendingTaskSessionId(taskId)

        if (event.status === 'completed') {
            const synced = await syncCompletedQuestionResult(taskId, eventRequestId, eventSessionId)
            if (!synced) {
                recoverQuestionStreamAfterDisconnect(taskId)
            }
            return
        }

        if (event.status === 'error') {
            if (eventRequestId) {
                removePendingTaskByRequestId(eventRequestId)
            } else {
                removePendingTaskById(taskId)
            }
            message.error(event.message || t('common.error'))
            return
        }

        if (eventRequestId) {
            removePendingTaskByRequestId(eventRequestId)
        } else {
            removePendingTaskById(taskId)
        }
    }

    const getPendingTaskSessionId = (taskId: string | null) => {
        if (!taskId) {
            return null
        }
        return pendingQuestionTasks.value.find(task => task.id === taskId)?.sessionId ?? null
    }

    const getPendingTaskRequestId = (taskId: string | null) => {
        if (!taskId) {
            return null
        }
        return pendingQuestionTasks.value.find(task => task.id === taskId)?.requestId ?? null
    }

    const updatePendingTaskProgress = (taskId: string, event: QuestionGenerationStreamEvent) => {
        const byRequestId = event.requestId
            ? pendingQuestionTasks.value.find(item => item.requestId === event.requestId)
            : null
        const task = byRequestId ?? pendingQuestionTasks.value.find(item => item.id === taskId)
        if (!task) {
            return
        }

        if (event.requestId && !task.requestId) {
            task.requestId = event.requestId
        }
        if (event.generationMode) {
            task.mode = event.generationMode === 'paper' ? 'paper' : 'question'
        }
        if (typeof event.showStageDetails === 'boolean') {
            task.showStageDetails = event.showStageDetails
        }
        if (event.status === 'processing' || event.status === 'submitted') {
            task.status = 'processing'
        }
        if (event.stage) {
            task.stage = event.stage
        }
        if (event.message) {
            task.progressMessage = event.message
        }
        task.updatedAt = typeof event.timestamp === 'number' ? event.timestamp : Date.now()
    }

    const resolvePendingStepMessage = (task: PendingQuestionTask) => {
        if (!shouldShowDetailedProgress(task)) {
            return t('chat.toolsMenu.generatingTitle')
        }
        if (task.progressMessage) {
            return task.progressMessage
        }
        const stageDescription = resolveStageDescription(task.stage)
        if (stageDescription) {
            return stageDescription
        }
        return t('chat.toolsMenu.generatingPaperTitle')
    }

    const resolvePendingStepDescription = (task: PendingQuestionTask) => {
        if (!shouldShowDetailedProgress(task)) {
            return t('chat.toolsMenu.generatingSubTitle')
        }
        const stageDescription = resolveStageDescription(task.stage)
        if (stageDescription) {
            return stageDescription
        }
        return t('chat.toolsMenu.generatingPaperSubTitle')
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

    const cleanupResolvedPendingTasksInCurrentSession = () => {
        const currentSessionId = resolveCurrentSessionId()
        if (!currentSessionId || pendingQuestionTasks.value.length === 0) {
            return
        }

        const resolvedRequestIds = new Set<string>()
        enrichGenerationMessages(messages.value)
            .filter(msg =>
                msg.role === 4
                && msg.sessionId === currentSessionId
                && Boolean(msg.requestId)
            )
            .forEach((msg) => {
                if (msg.requestId && parseQuestionResponse(msg).length > 0) {
                    resolvedRequestIds.add(msg.requestId)
                }
            })

        if (resolvedRequestIds.size === 0) {
            return
        }

        const remainingTasks = pendingQuestionTasks.value.filter(task => {
            if (task.sessionId !== currentSessionId) {
                return true
            }
            if (!task.requestId) {
                return true
            }
            return !resolvedRequestIds.has(task.requestId)
        })

        if (remainingTasks.length === pendingQuestionTasks.value.length) {
            return
        }

        const remainingTaskIds = new Set(remainingTasks.map(task => task.id))
        recoveringQuestionTaskIds.forEach((taskId) => {
            if (!remainingTaskIds.has(taskId)) {
                recoveringQuestionTaskIds.delete(taskId)
            }
        })
        pendingQuestionTasks.value = remainingTasks
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
                    const createTime = new Date(task.updatedAt || task.createdAt).toISOString()
                    pendingMessages.push({
                        id: task.id,
                        requestId: task.requestId ?? null,
                        role: 4,
                        content: resolvePendingStepMessage(task),
                        sessionId,
                        createTime,
                        messageType: 0,
                        metadata: {
                            questionStatus: task.status ?? 'pending',
                            questionStage: task.stage ?? null,
                            questionStepMessage: shouldShowDetailedProgress(task) ? task.progressMessage ?? null : null,
                            questionStepDescription: resolvePendingStepDescription(task),
                            questionShowStageDetails: shouldShowDetailedProgress(task),
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
            cleanupResolvedPendingTasksInCurrentSession()
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
        cleanupResolvedPendingTasksInCurrentSession()
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
        manuallyClosedStreamTaskIds.clear()
        recoveringQuestionTaskIds.clear()
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
