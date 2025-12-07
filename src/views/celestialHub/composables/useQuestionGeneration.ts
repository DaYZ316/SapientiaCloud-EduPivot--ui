import type {Ref} from 'vue'
import {computed, nextTick, onUnmounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {addChatSession} from '@/api/celestialHub/chatSession'
import {listMessagesBySessionId} from '@/api/celestialHub/chatMessage'
import {generateQuestions} from '@/api/celestialHub/question'
import type {QuestionGenerateRequestDTO, QuestionResponseDTO} from '@/types/celestialHub/question'
import type {ChatMessage as ChatMessageEntity} from '@/types/celestialHub/chatMessage'
import type {ChatSessionVO} from '@/types/celestialHub/chatSession'

interface PendingQuestionTask {
    id: string
    sessionId: string | null
    createdAt: number
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

    // 出题工具弹窗状态
    const isQuestionToolsVisible = ref(false)

    // 题目预览面板状态
    const isQuestionPanelVisible = ref(false)
    const activeQuestionList = ref<QuestionResponseDTO[] | null>(null)
    const activeQuestionMessageId = ref<string | null>(null)
    const activeQuestionIndex = ref<number | null>(null)

    // 题目面板数据计算属性
    const questionPanelData = computed<QuestionResponseDTO[]>(() => activeQuestionList.value ?? [])

    const questionPanelTitle = computed<string>(() => {
        const list = questionPanelData.value
        if (!list.length) {
            return ''
        }
        const index = activeQuestionIndex.value ?? 0
        const target = list[index] ?? list[0]
        if (target.questionTitle) {
            return target.questionTitle
        }
        if (target.questionContent) {
            return target.questionContent
        }
        return ''
    })

    const isQuestionPanelActive = computed(() => isQuestionPanelVisible.value && questionPanelData.value.length > 0)

    // 待处理出题任务
    const pendingQuestionTasks = ref<PendingQuestionTask[]>([])
    const isQuestionPolling = ref(false)
    let questionPollingTimer: number | null = null
    const processedGeneratorMessageIds = new Set<string>()

    // 创建待处理任务ID
    const createPendingTaskId = () => {
        if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
            return crypto.randomUUID()
        }
        return `${Date.now()}-${Math.random().toString(16).slice(2)}`
    }

    // 停止轮询
    const stopQuestionPolling = () => {
        if (questionPollingTimer !== null && typeof window !== 'undefined') {
            window.clearInterval(questionPollingTimer)
            questionPollingTimer = null
        }
        isQuestionPolling.value = false
    }

    // 开始轮询
    const startQuestionPolling = () => {
        if (questionPollingTimer !== null || typeof window === 'undefined') {
            return
        }
        questionPollingTimer = window.setInterval(() => {
            if (isQuestionPolling.value) {
                return
            }
            if (!currentSession.value?.id) {
                return
            }
            isQuestionPolling.value = true
            const sessionId = String(currentSession.value.id)
            const currentPendingTasks = pendingQuestionTasks.value.filter(task => task.sessionId === sessionId)
            const hasPendingTasks = currentPendingTasks.length > 0

            listMessagesBySessionId(sessionId, undefined, {
                meta: {
                    hideLoading: true,
                    hideBusinessError: true,
                    hideHttpError: true
                }
            })
                .then((response) => {
                    if (!response.data) {
                        return
                    }
                    const newMessages = response.data

                    // 检查是否有新的出题消息（role === 4）
                    const newQuestionMessages = newMessages.filter(msg =>
                        msg.role === 4 &&
                        msg.id &&
                        !processedGeneratorMessageIds.has(msg.id)
                    )
                    const hasNewQuestionMessage = newQuestionMessages.length > 0

                    // 如果没有pending任务，说明是最后一次调用，需要更新页面
                    const isLastCall = !hasPendingTasks

                    // 只有当检测到新的出题消息，或者是最后一次调用时，才更新messages并渲染页面
                    if (hasNewQuestionMessage || isLastCall) {
                        messages.value = newMessages
                        // 更新已处理的消息ID集合
                        newQuestionMessages.forEach(msg => {
                            if (msg.id) {
                                processedGeneratorMessageIds.add(msg.id)
                            }
                        })
                        // 移除对应的pending任务
                        if (hasNewQuestionMessage) {
                            newQuestionMessages.forEach(msg => {
                                removePendingTaskBySession(msg.sessionId ?? null)
                            })
                        }
                        nextTick(() => {
                            scrollToBottom()
                            // 出题完成后默认打开第一题
                            if (hasNewQuestionMessage && newQuestionMessages.length > 0) {
                                const firstQuestionMessage = newQuestionMessages[0]
                                if (firstQuestionMessage.id && firstQuestionMessage.questionResponse) {
                                    try {
                                        const questions = JSON.parse(firstQuestionMessage.questionResponse) as QuestionResponseDTO[]
                                        if (questions && questions.length > 0) {
                                            handleViewQuestions({
                                                messageId: firstQuestionMessage.id,
                                                questions,
                                                activeIndex: 0
                                            })
                                        }
                                    } catch {
                                        // 解析失败时忽略
                                    }
                                }
                            }
                        })
                    }
                })
                .finally(() => {
                    isQuestionPolling.value = false
                })
        }, 4000)
    }

    // 添加待处理出题任务
    const addPendingQuestionTask = (sessionId: string | null) => {
        if (!sessionId) {
            return
        }
        pendingQuestionTasks.value.push({
            id: createPendingTaskId(),
            sessionId,
            createdAt: Date.now()
        })
    }

    // 移除待处理任务
    const removePendingTaskBySession = (sessionId: string | null) => {
        if (!sessionId) {
            return
        }
        const index = pendingQuestionTasks.value.findIndex(task => task.sessionId === sessionId)
        if (index !== -1) {
            pendingQuestionTasks.value.splice(index, 1)
        }
    }

    // 处理工具选择
    const handleToolsSelect = (key: string | number) => {
        if (key === 'smartQuestion') {
            // 如果 QuestionPreviewPanel 是打开的，先关闭它
            if (isQuestionPanelVisible.value) {
                isQuestionPanelVisible.value = false
                activeQuestionMessageId.value = null
                activeQuestionIndex.value = null
            }
            isQuestionToolsVisible.value = true
        }
    }

    // 查看题目
    const handleViewQuestions = (payload: {
        messageId: string | null;
        questions: QuestionResponseDTO[];
        activeIndex: number | null
    }) => {
        // 如果 SmartQuestionModal 是打开的，先关闭它
        if (isQuestionToolsVisible.value) {
            isQuestionToolsVisible.value = false
        }
        activeQuestionMessageId.value = payload.messageId
        activeQuestionList.value = (payload.questions ?? []).slice()
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

    // 关闭题目面板
    const handleCloseQuestionPanel = () => {
        isQuestionPanelVisible.value = false
        activeQuestionMessageId.value = null
        activeQuestionIndex.value = null
    }

    // 处理出题请求成功
    const handleQuestionRequestSuccess = async (request: QuestionGenerateRequestDTO) => {
        let targetSessionId = request.sessionId || currentSession.value?.id || null

        // 如果是在新对话页面发起出题请求，先创建对话
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
            // 跳转到新创建的对话页面
            await selectSession(sessionResponse.data)
        }

        addPendingQuestionTask(targetSessionId)
        await loadMessages(targetSessionId)
        const resolvedSessionId = String(targetSessionId)
        const requestPayload: QuestionGenerateRequestDTO = {
            ...request,
            sessionId: resolvedSessionId
        }
        const requestMessage: ChatMessageEntity = {
            role: 3,
            content: requestPayload.requirement ?? '',
            sessionId: resolvedSessionId,
            messageType: 0,
            questionRequest: JSON.stringify(requestPayload)
        }
        messages.value.push(requestMessage)
        nextTick(() => {
            scrollToBottom()
        })

        // 调用出题API
        generateQuestions(requestPayload, {
            meta: {
                hideLoading: true,
                hideBusinessError: true,
                hideHttpError: true
            }
        })
    }

    // 滚动到激活的题目消息
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

    // 获取显示的消息列表（包含待处理的出题消息）
    const getDisplayMessages = (sessionId: string | null): ChatMessageEntity[] => {
        if (!sessionId) {
            return messages.value
        }
        const pendingMessages: ChatMessageEntity[] = []
        pendingQuestionTasks.value
            .filter(task => task.sessionId === sessionId)
            .forEach((task) => {
                const createTime = new Date(task.createdAt).toISOString()
                pendingMessages.push({
                    id: task.id,
                    role: 4,
                    content: 'AI正在出题，请稍候...',
                    sessionId,
                    createTime,
                    messageType: 0,
                    metadata: {
                        questionStatus: 'pending'
                    },
                    questionResponse: null
                })
            })
        if (!pendingMessages.length) {
            return messages.value
        }
        return [...messages.value, ...pendingMessages]
    }

    // 监听当前会话变化：切换会话或关闭当前会话时关闭题目预览面板
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
            }
        }
    )

    // 监听两个面板状态，确保互斥
    watch(isQuestionToolsVisible, (newValue) => {
        if (newValue && isQuestionPanelVisible.value) {
            // 如果 SmartQuestionModal 打开，关闭 QuestionPreviewPanel
            isQuestionPanelVisible.value = false
            activeQuestionMessageId.value = null
            activeQuestionIndex.value = null
        }
    })

    watch(isQuestionPanelVisible, (newValue) => {
        if (newValue && isQuestionToolsVisible.value) {
            // 如果 QuestionPreviewPanel 打开，关闭 SmartQuestionModal
            isQuestionToolsVisible.value = false
        }
    })

    // 监听待处理任务数量变化
    watch(
        () => pendingQuestionTasks.value.length,
        (length) => {
            if (length > 0) {
                startQuestionPolling()
            } else {
                stopQuestionPolling()
            }
        }
    )

    // 监听消息变化，处理出题消息
    watch(messages, (newMessages) => {
        newMessages.forEach((msg) => {
            if (msg.role === 4 && msg.id && !processedGeneratorMessageIds.has(msg.id)) {
                processedGeneratorMessageIds.add(msg.id)
                removePendingTaskBySession(msg.sessionId ?? null)
            }
        })
    }, {deep: true})

    // 监听题目面板激活状态，自动滚动
    watch(
        () => [activeQuestionMessageId.value, activeQuestionIndex.value, isQuestionPanelActive.value],
        () => {
            if (!isQuestionPanelActive.value) {
                return
            }
            nextTick(() => {
                scrollToActiveQuestionMessage()
            })
        }
    )

    // 组件卸载时停止轮询
    onUnmounted(() => {
        stopQuestionPolling()
    })

    return {
        // 状态
        isQuestionToolsVisible,
        isQuestionPanelVisible,
        activeQuestionList,
        activeQuestionMessageId,
        activeQuestionIndex,
        questionPanelData,
        questionPanelTitle,
        isQuestionPanelActive,
        pendingQuestionTasks,

        // 方法
        handleToolsSelect,
        handleViewQuestions,
        handleCloseQuestionPanel,
        handleQuestionRequestSuccess,
        scrollToActiveQuestionMessage,
        getDisplayMessages,
        addPendingQuestionTask,
        removePendingTaskBySession
    }
}

