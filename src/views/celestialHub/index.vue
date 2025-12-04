<template>
  <div class="celestial-hub-page">
    <div class="celestial-hub-container">
    <!-- 聊天侧边栏 -->
    <ChatSidebar
        ref="chatSidebarRef"
        :active-session-id="activeSessionId"
        @my-favorites="handleMyFavorites"
        @new-chat="newChat"
        @select-session="selectSession"
    />

      <input
          ref="filePickerRef"
          class="chat-file-input"
          multiple
          type="file"
          @change="handleFileInputChange"
      />

    <!-- 主内容区域 -->
    <div :class="['main-content', { 'with-question-panel': isQuestionPanelActive }]">
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
      <div v-if="currentSession" class="chat-content-wrapper">
        <div class="chat-main-column">
          <div ref="chatContentRef" class="chat-content">
            <!-- 消息列表容器 - Gemini风格 -->
            <div class="messages-wrapper">
              <div class="messages-container">
                <ChatMessage
                    v-for="(message, index) in displayMessages"
                    :key="message.id ?? `msg-${index}`"
                    :is-streaming="getIsAssistantStreaming(message)"
                    :message="message"
                    :active-question-message-id="activeQuestionMessageId"
                    :active-question-index="activeQuestionIndex"
                    @copy="handleCopy"
                    @feedback="handleFeedback"
                    @resend="handleResend(index)"
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
        </div>
        <div
            class="question-panel-wrapper"
            :class="{ 'is-visible': isQuestionPanelActive }"
        >
          <PreviewPanel
              v-show="isQuestionPanelActive"
              :key="`${activeQuestionMessageId || 'question'}-${activeQuestionIndex ?? 0}`"
              :close-label="t('common.cancel')"
              :questions="questionPanelData"
              v-model:active-index="activeQuestionIndex"
              :title="questionPanelTitle"
              @close="handleCloseQuestionPanel"
          />
        </div>
      </div>

      <!-- 空状态 - Gemini 风格 -->
      <div v-else class="gemini-empty-state">
        <!-- AI名称 -->
        <div class="ai-name-container">
          <div class="ai-name-text">{{ t('chat.aiName') }}</div>
        </div>

        <!-- 内容区域 - 限制宽度 -->
        <div class="greeting-wrapper">
          <!-- 问候语 -->
          <div class="greeting-text">{{ t('chat.greeting', {name: userDisplayName || 'Guest'}) }}</div>
        </div>
      </div>

      <!-- 输入区域 - 空状态下居中展示 -->
      <div
          v-if="!currentSession"
          :class="['input-container', { 'empty-state-input': !currentSession }]"
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
                :file-paths="[]"
                :file-infos="sessionFileInfos"
                @preview="handleFilePreview"
            />
            <n-empty v-else :description="t('chat.session.filesEmpty')"/>
          </n-spin>
        </div>
      </n-drawer-content>
    </n-drawer>
    <SmartQuestionModal
        v-model:show="isQuestionToolsVisible"
        :session-id="currentSession?.id ?? null"
        @question-request-success="handleQuestionRequestSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
import {computed, nextTick, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {NDrawer, NDrawerContent, NEmpty, NIcon, NSpin, NTooltip, useMessage} from 'naive-ui'
import {DocumentsOutline, Pin, Star} from '@vicons/ionicons5'
import ChatSidebar from './components/ChatSidebar.vue'
import ChatMessage from './components/ChatMessage.vue'
import ChatInputBox from './components/ChatInputBox.vue'
import {useUserStore} from '@/store'
import {useCelestialChat} from '@/views/celestialHub/composables/useCelestialChat'
import {useQuestionGeneration} from '@/views/celestialHub/composables/useQuestionGeneration'
import {useFileManagement} from '@/views/celestialHub/composables/useFileManagement'
import {favoriteSession, pinSession} from '@/api/celestialHub/chatSession'
import FileInfoList from '@/components/common/FileInfoList.vue'
import SmartQuestionModal from '@/views/celestialHub/components/SmartQuestionModal.vue'
import type {ChatMessage as ChatMessageEntity} from '@/types/celestialHub/chatMessage'
import PreviewPanel from '@/views/celestialHub/components/QuestionPreviewPanel.vue'

// 状态
const chatSidebarRef = ref<InstanceType<typeof ChatSidebar> | null>(null)

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
  scrollIntoViewInMessages
} = useCelestialChat()

// 使用出题 composable
const {
  isQuestionToolsVisible,
  activeQuestionMessageId,
  activeQuestionIndex,
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
    chatSidebarRef
)

const getIsAssistantStreaming = (messageItem: ChatMessageEntity) => {
  if (messageItem.role !== 1) {
    return false
  }
  const lastAssistant = [...messages.value].reverse().find(msg => msg.role === 1)
  if (!lastAssistant) {
    return false
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


// 监听会话ID变化，创建新会话时刷新侧边栏
watch(activeSessionId, (newId, oldId) => {
  // 当从null变为有值时，说明创建了新会话，需要刷新侧边栏
  if (!oldId && newId) {
    chatSidebarRef.value?.loadSessions()
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

  if (!userMessageContent) {
    return
  }

  // 删除用户提问到当前AI回复之间的所有消息（包含两端）
  const deleteCount = messageIndex - userIndex + 1
  if (deleteCount > 0) {
    messages.value.splice(userIndex, deleteCount)
  }

  // 使用原始用户内容重新请求
  resendMessage(userMessageContent)
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
