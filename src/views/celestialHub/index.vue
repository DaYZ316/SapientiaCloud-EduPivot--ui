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
    <div class="main-content">
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
        <div ref="chatContentRef" class="chat-content">
          <!-- 消息列表容器 - Gemini风格 -->
          <div class="messages-wrapper">
            <div class="messages-container">
              <ChatMessage
                  v-for="(message, index) in messages"
                  :key="message.id ?? `msg-${index}`"
                  :is-streaming="isSending && message.role === 1 && index === messages.length - 1"
                  :message="message"
                  @copy="handleCopy"
                  @feedback="handleFeedback"
                  @resend="handleResend(index)"
              />
            </div>
          </div>

          <!-- 输入区域 - Gemini风格 -->
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
              />
            </div>
          </div>
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

          <!-- 输入区域 -->
          <div class="gemini-input-section">
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
            />
          </div>
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
  </div>
</template>

<script lang="ts" setup>
import {computed, nextTick, ref, watch} from 'vue'
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {NDrawer, NDrawerContent, NEmpty, NIcon, NSpin, NTooltip, useMessage} from 'naive-ui'
import {DocumentsOutline, Pin, Star} from '@vicons/ionicons5'
import ChatSidebar from './components/ChatSidebar.vue'
import ChatMessage from './components/ChatMessage.vue'
import ChatInputBox from './components/ChatInputBox.vue'
import {useUserStore} from '@/store'
import {useCelestialChat} from '@/views/celestialHub/composables/useCelestialChat'
import {addChatSession, favoriteSession, pinSession} from '@/api/celestialHub/chatSession'
import {getFilesBySessionId, uploadFiles} from '@/api/celestialHub/fileDocument'
import type {FileDocumentUploadOptions} from '@/types/celestialHub/fileDocument'
import FileInfoList from '@/components/common/FileInfoList.vue'
import type {FileInfoDTO} from '@/types/minIO/file'
import {BusinessBucketCodeEnum} from '@/enum/minIO'

// 状态
const chatSidebarRef = ref<InstanceType<typeof ChatSidebar> | null>(null)
const filePickerRef = ref<HTMLInputElement | null>(null)
const isUploadingFiles = ref(false)
const isFileDrawerVisible = ref(false)
const isFileListLoading = ref(false)
const sessionFileInfos = ref<FileInfoDTO[]>([])
const aiQaBucketCode = BusinessBucketCodeEnum.AI_QA_ASSET

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
  useRag
} = useCelestialChat()

// 用户store
const userStore = useUserStore()

// 国际化
const {t} = useI18n()
const router = useRouter()

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

watch(
    () => currentSession.value?.id,
    (newId, oldId) => {
      if (isFileDrawerVisible.value && newId && newId !== oldId) {
        loadSessionFiles()
      }
      if (!newId) {
        sessionFileInfos.value = []
      }
    }
)

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

// 处理重新提问
const handleResend = (messageIndex: number) => {
  // 找到当前AI消息对应的用户消息
  // 从当前消息往前找，找到最近的一条用户消息
  let userMessageContent = null
  for (let i = messageIndex - 1; i >= 0; i--) {
    if (messages.value[i].role === 0 && messages.value[i].content) {
      userMessageContent = messages.value[i].content
      break
    }
  }

  if (userMessageContent) {
    resendMessage(userMessageContent)
  }
}

// 重置文件选择器
const resetFilePicker = () => {
  if (filePickerRef.value) {
    filePickerRef.value.value = ''
  }
}

// 触发文件选择
const handleTriggerFileSelect = () => {
  if (isUploadingFiles.value) {
    return
  }
  filePickerRef.value?.click()
}

// 处理文件变更
const handleFileInputChange = (event: Event) => {
  const target = event.target as HTMLInputElement | null
  const fileList = target?.files ? Array.from(target.files) : []
  resetFilePicker()
  if (!fileList.length) {
    return
  }
  uploadSelectedFiles(fileList)
}

// 确保存在用于绑定文件的会话
const ensureSessionForUpload = async () => {
  if (activeSessionId.value) {
    return activeSessionId.value
  }

  return addChatSession({
    sessionType: 0,
    title: t('chat.sidebar.newChat'),
    courseId: null
  })
      .then((response) => {
        if (response.data) {
          activeSessionId.value = response.data.id || null
          currentSession.value = response.data
          chatSidebarRef.value?.loadSessions()
          return activeSessionId.value
        }
        return null
      })
      .catch(() => null)
}

// 上传文件
const uploadSelectedFiles = async (selectedFiles: File[]) => {
  if (!selectedFiles.length || isUploadingFiles.value) {
    return
  }

  const resolvedSessionId = await ensureSessionForUpload()
  if (!resolvedSessionId) {
    message.warning(t('common.fail'))
    return
  }

  isUploadingFiles.value = true
  const uploadOptions: FileDocumentUploadOptions = {
    courseId: null,
    sessionId: resolvedSessionId,
    autoVectorize: true
  }

  await uploadFiles(selectedFiles, uploadOptions)
      .then(() => {
        message.success(t('common.uploadSuccess'))
      })
      .catch(() => {
        message.warning(t('common.uploadFailed'))
      })
      .finally(() => {
        isUploadingFiles.value = false
      })
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

// 打开会话文件抽屉
const handleShowSessionFiles = async () => {
  if (!currentSession.value?.id) {
    message.warning(t('chat.session.filesNoSession'))
    return
  }
  isFileDrawerVisible.value = true
  await loadSessionFiles()
}

// 加载会话关联文件
const loadSessionFiles = async () => {
  if (!currentSession.value?.id) {
    sessionFileInfos.value = []
    return
  }

  isFileListLoading.value = true
  await getFilesBySessionId(String(currentSession.value.id))
      .then((response) => {
        sessionFileInfos.value = response.data ?? []
      })
      .catch(() => {
        sessionFileInfos.value = []
        message.warning(t('chat.session.filesLoadFailed'))
      })
      .finally(() => {
        isFileListLoading.value = false
      })
}

const handleFilePreview = (fileInfo: FileInfoDTO) => {
  router.push({
    name: 'FilePreview',
    query: {
      fileInfo: JSON.stringify(fileInfo),
      from: 'CelestialHub',
      sessionId: currentSession.value?.id ?? ''
    }
  })
}
</script>

<style lang="scss" scoped>
@use './index.scss' as *;
</style>
