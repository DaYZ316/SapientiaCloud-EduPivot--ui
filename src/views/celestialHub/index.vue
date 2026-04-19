<template>
  <div class="celestial-hub-page">
    <div class="celestial-hub-container">
      <!-- 聊天侧边栏 (全局侧边栏展开时隐藏) -->
      <ChatSidebar
          v-if="shouldHideChatSidebar === false"
          ref="chatSidebarRef"
          :active-session-id="activeSessionId"
          @my-favorites="handleMyFavorites"
          @new-chat="newChat"
          @select-session="selectSessionWithAnimation"
      />

      <input
          ref="filePickerRef"
          class="chat-file-input"
          multiple
          type="file"
          @change="handleFileInputChange"
      />

      <!-- 主内容区域 -->
      <div :class="['main-content', { 'with-question-panel': isQuestionPanelActive || isQuestionToolsVisible }]">
        <!-- 聊天头部 -->
        <div v-if="currentSession" class="chat-header">
          <div class="chat-title">
            {{ currentSession.sessionTitle || t('chat.sidebar.newChat') }}
          </div>
          <div class="chat-actions">
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-icon
                    :component="DocumentsOutline"
                    class="header-icon"
                    size="20"
                    @click="handleShowSessionFiles"
                />
              </template>
              {{ t('chat.session.files') }}
            </n-tooltip>
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-icon
                    :class="{ active: currentSession.isPinned === 1 }"
                    :component="Pin"
                    class="header-icon"
                    size="20"
                    @click="handleTogglePin"
                />
              </template>
              {{ currentSession.isPinned === 1 ? t('chat.session.unpin') : t('chat.session.pin') }}
            </n-tooltip>
            <n-tooltip trigger="hover">
              <template #trigger>
                <n-icon
                    :class="{ active: currentSession.isFavorite === 1 }"
                    :component="Star"
                    class="header-icon"
                    size="20"
                    @click="handleToggleFavorite"
                />
              </template>
              {{ currentSession.isFavorite === 1 ? t('chat.session.unfavorite') : t('chat.session.favorite') }}
            </n-tooltip>
          </div>
        </div>

        <!-- 聊天内容 -->
        <transition
            mode="out-in"
            name="chat-switch"
        >
          <div
              v-if="currentSession"
              :key="activeSessionId ?? 'session'"
              class="chat-content-wrapper"
          >
            <div class="chat-main-column">
              <div ref="chatContentRef" class="chat-content">
                <!-- 消息列表容器 - Gemini风格 -->
                <div class="messages-wrapper">
                  <div class="messages-container">
                    <ChatMessage
                        v-for="(message, index) in displayMessages"
                        :key="message.id ?? `msg-${index}`"
                        :active-question-index="activeQuestionIndex"
                        :active-question-message-id="activeQuestionMessageId"
                        :audio-action-status="getAudioActionStatus(message)"
                        :is-streaming="getIsAssistantStreaming(message)"
                        :message="message"
                        @copy="handleCopy"
                        @feedback="handleFeedback"
                        @resend="handleResend(index)"
                        @virtual-teacher="handleVirtualTeacher"
                        @view-questions="handleViewQuestions"
                    />
                  </div>
                </div>
              </div>
              <!-- 输入区域（对话态） -->
              <div class="input-container">
                <div class="input-wrapper">
                  <ChatInputBox
                      v-model="input"
                      v-model:file-references="fileReferences"
                      v-model:use-rag="useRagSwitch"
                      :is-sending="isSending"
                      :is-uploading-files="isUploadingFiles"
                      :placeholder="t('chat.placeholder')"
                      :session-id="currentSession?.id ?? null"
                      @enter="sendMessage"
                      @send="sendMessage"
                      @stop="interruptStreaming"
                      @trigger-file-select="handleTriggerFileSelect"
                      @open-tools="handleToolsSelect"
                      @file-drop="handleFileDrop"
                  />
                </div>
              </div>
            </div>
            <div
                :class="{ 'is-visible': isQuestionPanelActive || isQuestionToolsVisible }"
                class="question-panel-wrapper"
            >
              <PreviewPanel
                  v-show="isQuestionPanelActive"
                  :key="`${activeQuestionMessageId || 'question'}-${activeQuestionIndex ?? 0}`"
                  v-model:active-index="activeQuestionIndex"
                  :mode="activeQuestionGenerationMode"
                  :close-label="t('common.cancel')"
                  :questions="questionPanelData"
                  :title="questionPanelTitle"
                  @close="handleCloseQuestionPanel"
              />
              <SmartQuestionModal
                  v-show="isQuestionToolsVisible && !isQuestionPanelActive"
                  v-model:show="isQuestionToolsVisible"
                  :mode="generationToolMode"
                  :session-id="currentSession?.id ?? null"
                  @question-request-success="handleQuestionRequestSuccess"
              />
            </div>
          </div>
          <!-- 空状态 - Gemini 风格 -->
          <div
              v-else
              :key="'empty'"
              class="empty-state-wrapper"
          >
            <div class="gemini-empty-state">
              <!-- AI名称 -->
              <div class="ai-name-container">
                <div class="ai-name-text">{{ t('chat.aiName') }}</div>
              </div>

              <!-- 内容区域 - 限制宽度 -->
              <div
                  :class="['greeting-wrapper', { 'slide-out-left': isQuestionToolsVisible, 'slide-in-left': !isQuestionToolsVisible && wasQuestionToolsVisible }]"
              >
                <!-- 问候语 -->
                <div class="greeting-text">{{ t('chat.greeting', {name: userDisplayName || 'Guest'}) }}</div>
              </div>
            </div>

            <!-- 输入区域 - 空状态下居中展示 -->
            <div
                :class="['input-container', { 'empty-state-input': true, 'slide-out-left': isQuestionToolsVisible, 'slide-in-left': !isQuestionToolsVisible && wasQuestionToolsVisible }]"
            >
              <div class="input-wrapper">
                <ChatInputBox
                    v-model="input"
                    v-model:use-rag="useRagSwitch"
                    :is-sending="isSending"
                    :is-uploading-files="isUploadingFiles"
                    :placeholder="t('chat.placeholder')"
                    @enter="sendMessage"
                    @send="sendMessage"
                    @stop="interruptStreaming"
                    @trigger-file-select="handleTriggerFileSelect"
                    @open-tools="handleToolsSelect"
                />
              </div>
            </div>

            <!-- SmartQuestionModal - 空状态下显示 -->
            <div
                :class="['smart-question-modal-container', { 'slide-in-right': isQuestionToolsVisible, 'slide-out-right': !isQuestionToolsVisible && wasQuestionToolsVisible }]"
            >
              <SmartQuestionModal
                  v-model:show="isQuestionToolsVisible"
                  :mode="generationToolMode"
                  :session-id="null"
                  @question-request-success="handleQuestionRequestSuccess"
              />
            </div>
          </div>
        </transition>
      </div>
    </div>
    <n-drawer
        v-model:show="isFileDrawerVisible"
        :width="380"
        placement="right"
    >
      <n-drawer-content :title="t('chat.session.filesTitle')" closable>
        <div class="session-files-drawer">
          <n-spin :show="isFileListLoading">
            <FileInfoList
                v-if="sessionFileInfos.length"
                :bucket-code="aiQaBucketCode"
                :file-infos="sessionFileInfos"
                :file-paths="[]"
                @dragstart="handleFileDragStart"
                @preview="handleFilePreview"
            />
            <n-empty v-else :description="t('chat.session.filesEmpty')"/>
          </n-spin>
        </div>
      </n-drawer-content>
    </n-drawer>
    <Live2DTeacherPanel
        v-if="teacherPanelMounted"
        :audio-url="teacherAudioUrl"
        :enabled="teacherPanelMounted"
        :visible="teacherPanelVisible"
        class="virtual-teacher-floating-panel"
        @ended="handleTeacherPlaybackEnded"
        @error="handleTeacherPlaybackError"
        @ready="handleTeacherPanelReady"
    />
  </div>
</template>

<script lang="ts" setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRoute, useRouter} from 'vue-router'
import {NDrawer, NDrawerContent, NEmpty, NIcon, NSpin, NTooltip, useMessage} from 'naive-ui'
import {DocumentsOutline, Pin, Star} from '@vicons/ionicons5'
import ChatSidebar from './components/ChatSidebar.vue'
import ChatMessage from './components/ChatMessage.vue'
import ChatInputBox from './components/ChatInputBox.vue'
import Live2DTeacherPanel from './components/Live2DTeacherPanel.vue'
import {useThemeStore, useUserStore} from '@/store'
import {useCelestialChat} from '@/views/celestialHub/composables/useCelestialChat'
import {useQuestionGeneration} from '@/views/celestialHub/composables/useQuestionGeneration'
import {useFileManagement} from '@/views/celestialHub/composables/useFileManagement'
import {favoriteSession, pinSession} from '@/api/celestialHub/chatSession'
import {generateMessageAudio, listMessagesBySessionId} from '@/api/celestialHub/chatMessage'
import FileInfoList from '@/components/common/FileInfoList.vue'
import SmartQuestionModal from '@/views/celestialHub/components/SmartQuestionModal.vue'
import type {ChatMessage as ChatMessageEntity} from '@/types/celestialHub/chatMessage'
import type {FileReference} from '@/types/celestialHub/knowledge'
import type {FileInfoDTO} from '@/types/minIO/file'
import PreviewPanel from '@/views/celestialHub/components/QuestionPreviewPanel.vue'
import eventBus from '@/utils/eventBus'
import type {ChatSessionVO} from '@/types/celestialHub/chatSession'

type AudioActionStatus = 'idle' | 'generating' | 'playing' | 'failed'

// 路由
const route = useRoute()
const router = useRouter()

// 状态管理
const themeStore = useThemeStore()

// 状态
const chatSidebarRef = ref<InstanceType<typeof ChatSidebar> | null>(null)
const wasQuestionToolsVisible = ref(false)
const audioPollingTimer = ref<number | null>(null)
const activeTeacherMessageId = ref<string | null>(null)
const teacherAudioUrl = ref<string | null>(null)
const pendingTeacherAudioUrl = ref<string | null>(null)
const pendingTeacherMessageId = ref<string | null>(null)
const teacherPanelMounted = ref(false)
const teacherPanelVisible = ref(false)
const audioActionStatusMap = ref<Record<string, AudioActionStatus>>({})

// 计算属性：是否在全局侧边栏展开时隐藏ChatSidebar
const shouldHideChatSidebar = computed(() => {
  return !themeStore.sidebarCollapsed
})

// 使用聊天 composable
const {
  messages,
  input,
  isLoading: isSending,
  activeSessionId,
  currentSession,
  chatContentRef,
  sendMessage,
  resendMessage,
  interruptStreaming,
  selectSession,
  newChat,
  scrollToBottom,
  useRag,
  loadMessages,
  scrollIntoViewInMessages,
  fileReferences
} = useCelestialChat()

// 使用出题 composable
const {
  isQuestionToolsVisible,
  generationToolMode,
  activeQuestionMessageId,
  activeQuestionIndex,
  activeQuestionGenerationMode,
  questionPanelData,
  questionPanelTitle,
  isQuestionPanelActive,
  handleToolsSelect,
  handleViewQuestions,
  handleCloseQuestionPanel,
  handleQuestionRequestSuccess,
  getDisplayMessages
} = useQuestionGeneration(
    messages,
    currentSession,
    scrollToBottom,
    scrollIntoViewInMessages,
    loadMessages,
    selectSession
)

// 处理文件上传成功后的回调，自动添加到文件引用列表
const handleFilesUploaded = (newFileReferences: FileReference[]) => {
  if (!fileReferences.value) {
    fileReferences.value = []
  }
  // 合并新上传的文件到文件引用列表（避免重复）
  const existingIds = new Set(fileReferences.value.map(f => f.id).filter(Boolean))
  const newFiles = newFileReferences.filter(f => f.id && !existingIds.has(f.id))
  if (newFiles.length > 0) {
    fileReferences.value = [...fileReferences.value, ...newFiles]
  }
}

// 处理文件拖拽开始，关闭侧边栏以便拖放
const handleFileDragStart = () => {
  isFileDrawerVisible.value = false
}

// 处理文件拖拽到输入框，直接使用拖拽的 FileInfoDTO 生成文件引用
const handleFileDrop = (fileInfo: FileInfoDTO) => {
  if (!currentSession.value?.id) {
    return
  }

  const fileReference: FileReference = {
    id: (fileInfo as { id?: string | null }).id ?? null,
    fileName: fileInfo.fileName ?? null,
    fileType: (fileInfo as { fileType?: number | null }).fileType ?? null,
    fileSize: (fileInfo as { fileSize?: number | null; size?: number | null }).fileSize
        ?? (fileInfo as { size?: number | null }).size
        ?? null,
    mimeType: fileInfo.contentType ?? null,
    storagePath: fileInfo.objectName ?? null,
    bucketCode: (fileInfo as { bucketCode?: string | null }).bucketCode ?? null,
    sysUserId: (fileInfo as { sysUserId?: string | null }).sysUserId ?? null,
    courseId: (fileInfo as { courseId?: string | null }).courseId ?? null,
    sessionId: currentSession.value.id ?? null,
    isVectorized: (fileInfo as { isVectorized?: boolean | null }).isVectorized ?? null,
    vectorCount: (fileInfo as { vectorCount?: number | null }).vectorCount ?? null
  }

  if (!fileReferences.value) {
    fileReferences.value = []
  }

  const hasDuplicateById = fileReference.id !== null
      ? fileReferences.value.some(item => item.id === fileReference.id)
      : false
  const hasDuplicateByPath = fileReference.storagePath !== null
      ? fileReferences.value.some(item => item.storagePath === fileReference.storagePath)
      : false

  if (!hasDuplicateById && !hasDuplicateByPath) {
    fileReferences.value = [...fileReferences.value, fileReference]
  }
}

// 使用文件管理 composable
const {
  filePickerRef,
  isUploadingFiles,
  isFileDrawerVisible,
  isFileListLoading,
  sessionFileInfos,
  aiQaBucketCode,
  handleTriggerFileSelect,
  handleFileInputChange,
  handleShowSessionFiles,
  handleFilePreview
} = useFileManagement(
    activeSessionId,
    currentSession,
    chatSidebarRef,
    handleFilesUploaded
)

const getIsAssistantStreaming = (messageItem: ChatMessageEntity) => {
  if (messageItem.role !== 1) {
    return false
  }
  if (!isSending.value) {
    return false
  }
  const lastAssistant = [...messages.value].reverse().find(msg => msg.role === 1)
  if (!lastAssistant) {
    return false
  }
  if (messageItem.id && lastAssistant.id) {
    return messageItem.id === lastAssistant.id
  }
  return messageItem === lastAssistant && isSending.value
}

const displayMessages = computed<ChatMessageEntity[]>(() => {
  const sessionId = currentSession.value?.id || null
  return getDisplayMessages(sessionId)
})

// 用户store
const userStore = useUserStore()

// 国际化
const {t} = useI18n()

// 消息提示
const message = useMessage()


// 获取用户显示名称（优先级：真名 > 昵称 > 用户名）
const userDisplayName = computed(() => {
  const studentInfo = userStore.studentInfo
  const teacherInfo = userStore.teacherInfo
  const userInfo = userStore.userInfo

  // 优先使用真名（学生或教师）
  if (studentInfo?.realName) {
    return studentInfo.realName
  }
  if (teacherInfo?.realName) {
    return teacherInfo.realName
  }

  // 其次使用昵称
  if (studentInfo?.nickName) {
    return studentInfo.nickName
  }
  if (teacherInfo?.nickName) {
    return teacherInfo.nickName
  }
  if (userInfo?.nickName) {
    return userInfo.nickName
  }

  // 最后使用用户名
  if (studentInfo?.username) {
    return studentInfo.username
  }
  if (teacherInfo?.username) {
    return teacherInfo.username
  }
  if (userInfo?.username) {
    return userInfo.username
  }

  // 如果都没有，返回默认值
  return ''
})

// 将可空的 useRag 转换为开关可用的布尔状态（默认开启）
const useRagSwitch = computed<boolean>({
  get() {
    return useRag.value === true
  },
  set(v: boolean) {
    useRag.value = v
  }
})

// 监听消息变化，自动滚动到底部
watch(messages, () => {
  nextTick(() => {
    scrollToBottom()
  })
}, {deep: true})

const stopAudioPolling = () => {
  if (audioPollingTimer.value !== null) {
    window.clearInterval(audioPollingTimer.value)
    audioPollingTimer.value = null
  }
}

const setAudioActionStatus = (
    messageId: string,
    status: AudioActionStatus
) => {
  audioActionStatusMap.value = {
    ...audioActionStatusMap.value,
    [messageId]: status
  }
}

const updateMessageInList = (updatedMessage: ChatMessageEntity) => {
  if (!updatedMessage.id) {
    return
  }
  const targetIndex = messages.value.findIndex(item => item.id === updatedMessage.id)
  if (targetIndex >= 0) {
    messages.value[targetIndex] = {
      ...messages.value[targetIndex],
      ...updatedMessage
    }
  }
}

const isAudioGenerationPending = (audioStatus?: number | null) => {
  return audioStatus === 1 || audioStatus === 2
}

const resolvePersistedAssistantMessage = async (messageItem: ChatMessageEntity) => {
  if (messageItem.id) {
    return messageItem
  }
  if (!activeSessionId.value || messageItem.role !== 1 || !messageItem.content) {
    return null
  }

  const response = await listMessagesBySessionId(activeSessionId.value)
  if (!response.data) {
    return null
  }

  messages.value = response.data
  const targetContent = messageItem.content.trim()
  return [...response.data].reverse().find(item => {
    return item.role === 1
        && Boolean(item.id)
        && (item.content ?? '').trim() === targetContent
  }) ?? null
}

const resetTeacherPanelState = () => {
  pendingTeacherMessageId.value = null
  pendingTeacherAudioUrl.value = null
  activeTeacherMessageId.value = null
  teacherAudioUrl.value = null
  teacherPanelVisible.value = false
  teacherPanelMounted.value = false
}

const stopTeacherPlayback = (status: AudioActionStatus = 'idle') => {
  stopAudioPolling()
  const messageId = activeTeacherMessageId.value ?? pendingTeacherMessageId.value
  if (messageId) {
    setAudioActionStatus(messageId, status)
  }
  resetTeacherPanelState()
}

const playTeacherAudio = (messageItem: ChatMessageEntity) => {
  if (!messageItem.id || !messageItem.audioUrl) {
    return
  }
  stopAudioPolling()
  pendingTeacherMessageId.value = messageItem.id
  pendingTeacherAudioUrl.value = messageItem.audioUrl
  activeTeacherMessageId.value = messageItem.id
  teacherAudioUrl.value = null
  teacherPanelVisible.value = false
  teacherPanelMounted.value = true
  setAudioActionStatus(messageItem.id, 'playing')
}

const handleTeacherPanelReady = () => {
  if (!teacherPanelMounted.value || !pendingTeacherMessageId.value || !pendingTeacherAudioUrl.value) {
    return
  }
  activeTeacherMessageId.value = pendingTeacherMessageId.value
  teacherPanelVisible.value = true
  teacherAudioUrl.value = pendingTeacherAudioUrl.value
  pendingTeacherMessageId.value = null
  pendingTeacherAudioUrl.value = null
}

const startAudioPolling = (messageId: string) => {
  if (!activeSessionId.value) return
  stopAudioPolling()

  let attempts = 0
  audioPollingTimer.value = window.setInterval(async () => {
    if (!activeSessionId.value) {
      stopAudioPolling()
      return
    }

    attempts += 1
    const response = await listMessagesBySessionId(activeSessionId.value)
    if (response.data) {
      messages.value = response.data
    }

    const targetMessage = response.data?.find(item => item.id === messageId)
    if (targetMessage?.audioStatus === 3 && targetMessage.audioUrl) {
      playTeacherAudio(targetMessage)
      return
    }

    if (targetMessage?.audioStatus === 4) {
      stopAudioPolling()
      setAudioActionStatus(messageId, 'failed')
      message.error(targetMessage.audioErrorMessage || '语音生成失败')
      return
    }

    if (attempts >= 20) {
      stopAudioPolling()
      setAudioActionStatus(messageId, 'failed')
      message.error('语音生成超时，请稍后重试')
    }
  }, 1500)
}

const getAudioActionStatus = (messageItem: ChatMessageEntity): AudioActionStatus => {
  if (!messageItem.id) {
    return 'idle'
  }
  const status = audioActionStatusMap.value[messageItem.id]
  if (status) {
    return status
  }
  if (messageItem.audioStatus === 1 || messageItem.audioStatus === 2) {
    return 'generating'
  }
  if (messageItem.audioStatus === 4) {
    return 'failed'
  }
  return 'idle'
}

const handleVirtualTeacher = async (messageItem: ChatMessageEntity) => {
  if (messageItem.role !== 1) {
    return
  }

  if ((activeTeacherMessageId.value === messageItem.id || pendingTeacherMessageId.value === messageItem.id)
      && teacherPanelMounted.value) {
    stopTeacherPlayback('idle')
    return
  }

  if (teacherPanelMounted.value) {
    stopTeacherPlayback('idle')
  }

  let targetMessage: ChatMessageEntity | null = null
  try {
    targetMessage = await resolvePersistedAssistantMessage(messageItem)
  } catch (error) {
    message.error('获取消息状态失败，请稍后重试')
    return
  }

  if (!targetMessage?.id) {
    message.warning('消息仍在保存中，请稍后再试')
    return
  }

  if (getAudioActionStatus(targetMessage) === 'generating') {
    return
  }

  if (targetMessage.audioStatus === 3 && targetMessage.audioUrl) {
    playTeacherAudio(targetMessage)
    return
  }

  setAudioActionStatus(targetMessage.id, 'generating')
  try {
    const response = await generateMessageAudio(targetMessage.id)
    if (response.data) {
      updateMessageInList(response.data)
      if (response.data.audioStatus === 3 && response.data.audioUrl) {
        playTeacherAudio(response.data)
        return
      }
      if (response.data.audioStatus === 4 || response.data.audioStatus === 5 || !isAudioGenerationPending(response.data.audioStatus)) {
        setAudioActionStatus(targetMessage.id, 'failed')
        message.error(response.data.audioErrorMessage || '语音生成未开始，请稍后重试')
        return
      }
    }
    startAudioPolling(targetMessage.id)
  } catch (error) {
    setAudioActionStatus(targetMessage.id, 'failed')
    message.error('语音生成请求失败，请稍后重试')
  }
}

const handleTeacherPlaybackEnded = () => {
  stopTeacherPlayback('idle')
}

const handleTeacherPlaybackError = (errorMessage: string) => {
  stopTeacherPlayback('failed')
  message.warning(errorMessage)
}

watch(activeSessionId, () => {
  stopAudioPolling()
  handleTeacherPlaybackEnded()
})


// 包装 selectSession 以添加动画效果
const selectSessionWithAnimation = async (session: ChatSessionVO) => {
  // 如果点击的是当前已选中的会话，则不执行任何操作
  if (activeSessionId.value === session.id) {
    return
  }

  // 直接切换会话，transition 组件会自动处理动画
  await selectSession(session)
}

// 监听会话ID变化，创建新会话时刷新侧边栏
watch(activeSessionId, (newId, oldId) => {
  // 通知全局侧边栏activeSessionId变化
  eventBus.emit('aiActiveSessionIdChanged', newId)

  // 当从null变为有值时，说明创建了新会话，需要刷新侧边栏
  if (!oldId && newId) {
    chatSidebarRef.value?.loadSessions()
  }
  // 切换对话时关闭 SmartQuestionModal（包括切换到新会话和新建会话）
  if (oldId !== newId && isQuestionToolsVisible.value) {
    isQuestionToolsVisible.value = false
  }
})

// 监听来自全局侧边栏的事件
onMounted(() => {
  eventBus.on('aiSelectSession', async (session: ChatSessionVO) => {
    await selectSessionWithAnimation(session)
  })

  eventBus.on('aiNewChat', () => {
    newChat()
  })

  eventBus.on('aiMyFavorites', () => {
    handleMyFavorites()
  })
})

onUnmounted(() => {
  eventBus.off('aiSelectSession')
  eventBus.off('aiNewChat')
  eventBus.off('aiMyFavorites')
  stopAudioPolling()
  handleTeacherPlaybackEnded()
})

// 监听 isQuestionToolsVisible 变化，用于控制动画
watch(isQuestionToolsVisible, (newValue) => {
  if (newValue) {
    wasQuestionToolsVisible.value = true
  } else {
    // 延迟重置，确保动画完成
    setTimeout(() => {
      wasQuestionToolsVisible.value = false
    }, 400)
  }
})

// 标记是否需要打开出题模态框
const shouldOpenSmartQuestion = ref(false)

// 监听路由 query 参数，如果存在 openSmartQuestion 参数，则标记需要打开
watch(
    () => route.query.openSmartQuestion,
    (value) => {
      if (value === 'true') {
        shouldOpenSmartQuestion.value = true
        // 清除 query 参数
        router.replace({
          path: route.path,
          query: {
            ...route.query,
            openSmartQuestion: undefined
          }
        })
      }
    },
    {immediate: true}
)

// 监听 currentSession，确保在空状态时打开模态框
watch(
    () => [currentSession.value, shouldOpenSmartQuestion.value],
    ([session, shouldOpen]) => {
      if (shouldOpen && !session) {
        // 延迟打开，确保组件完全渲染
        nextTick(() => {
          nextTick(() => {
            setTimeout(() => {
              isQuestionToolsVisible.value = true
              shouldOpenSmartQuestion.value = false
            }, 600)
          })
        })
      }
    },
    {immediate: true}
)


// 组件挂载时检查 query 参数并自动选择会话
onMounted(async () => {
  if (route.query.openSmartQuestion === 'true') {
    shouldOpenSmartQuestion.value = true
    // 清除 query 参数
    router.replace({
      path: route.path,
      query: {
        ...route.query,
        openSmartQuestion: undefined
      }
    })
  }

  // 每次进入页面都执行滚动逻辑
  if (activeSessionId.value) {
    // 如果有活跃会话，重新加载消息并滚动到最后用户消息
    await loadMessages(activeSessionId.value)
  } else {
    // 如果没有活跃会话，默认进入“新对话”页面而不是自动选择历史会话
    newChat()
  }
})


// 处理反馈
const handleFeedback = (messageId: string, feedback: number) => {
  // 更新消息的反馈状态
  const message = messages.value.find(msg => msg.id === messageId)
  if (message) {
    message.isFeedback = feedback
  }
}

// 处理复制
const handleCopy = () => {
  // 收集所有消息内容
  const allContent = messages.value
      .filter(msg => msg.content)
      .map(msg => {
        if (msg.role === 0) {
          return `用户: ${msg.content}`
        } else if (msg.role === 1) {
          return `AI: ${msg.content}`
        }
        return msg.content
      })
      .join('\n\n')

  if (allContent) {
    navigator.clipboard.writeText(allContent)
    message.success(t('chat.copySuccess'))
  }
}

// 处理重新提问（删除对应用户提问和AI回复后再重新请求）
const handleResend = (messageIndex: number) => {
  // 安全检查：索引是否在当前消息列表范围内
  if (messageIndex < 0 || messageIndex >= messages.value.length) {
    return
  }

  const targetMessage = messages.value[messageIndex]
  // 仅对AI消息生效
  if (!targetMessage || targetMessage.role !== 1) {
    return
  }

  // 从当前AI消息往前找到最近的一条用户消息
  let userIndex = -1
  for (let i = messageIndex - 1; i >= 0; i--) {
    const msg = messages.value[i]
    if (msg.role === 0 && msg.content) {
      userIndex = i
      break
    }
  }

  if (userIndex === -1) {
    return
  }

  const userMessage = messages.value[userIndex]
  const userMessageContent = userMessage.content
  const userFileReferences = (() => {
    const metadataRefs = (userMessage.metadata as any)?.fileReferences as FileReference[] | null | undefined
    const messageRefs = userMessage.fileReferences as FileReference[] | null | undefined
    const merged = [...(metadataRefs || []), ...(messageRefs || [])]
    if (!merged.length) return null
    const seen = new Set<string>()
    return merged.filter((item) => {
      const key = item.id ?? `${item.fileName ?? ''}-${item.storagePath ?? ''}`
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  })()

  if (!userMessageContent) {
    return
  }

  // 删除用户提问到当前AI回复之间的所有消息（包含两端）
  const deleteCount = messageIndex - userIndex + 1
  if (deleteCount > 0) {
    messages.value.splice(userIndex, deleteCount)
  }

  // 使用原始用户内容重新请求
  resendMessage(userMessageContent, userFileReferences)
}


// 我的收藏
const handleMyFavorites = () => {
  // TODO: 实现我的收藏功能
}

// 处理置顶切换
const handleTogglePin = async () => {
  if (!currentSession.value?.id) {
    return
  }

  const newPinStatus = currentSession.value.isPinned === 1 ? false : true
  await pinSession(currentSession.value.id, newPinStatus)

  // 更新当前会话状态
  if (currentSession.value) {
    currentSession.value.isPinned = newPinStatus ? 1 : 0
  }

  // 刷新侧边栏会话列表
  chatSidebarRef.value?.loadSessions()

  // 显示成功提示
  message.success(newPinStatus ? `${t('chat.session.pin')}${t('common.success')}` : `${t('chat.session.unpin')}${t('common.success')}`)
}

// 处理收藏切换
const handleToggleFavorite = async () => {
  if (!currentSession.value?.id) {
    return
  }

  const newFavoriteStatus = currentSession.value.isFavorite === 1 ? false : true
  await favoriteSession(currentSession.value.id, newFavoriteStatus)

  // 更新当前会话状态
  if (currentSession.value) {
    currentSession.value.isFavorite = newFavoriteStatus ? 1 : 0
  }

  // 刷新侧边栏会话列表
  chatSidebarRef.value?.loadSessions()

  // 显示成功提示
  message.success(newFavoriteStatus ? `${t('chat.session.favorite')}${t('common.success')}` : `${t('chat.session.unfavorite')}${t('common.success')}`)
}

</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
