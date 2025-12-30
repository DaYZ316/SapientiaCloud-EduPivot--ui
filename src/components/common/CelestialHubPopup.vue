<template>
  <div class="celestial-hub-popup">
    <!-- 头部区域 -->
    <div class="popup-header">
      <div class="header-left">
        <span class="header-title">{{ headerTitle }}</span>
      </div>
      <div class="header-right">
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button
              text
              size="small"
              @click="handleNewChat"
            >
              <n-icon :component="AddOutline" size="18" />
            </n-button>
          </template>
          <span>新对话</span>
        </n-tooltip>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button
              text
              size="small"
              @click="toggleHistoryView"
              :class="{ 'active': isHistoryView }"
            >
              <n-icon :component="Time" size="18" />
            </n-button>
          </template>
          <span>{{ isHistoryView ? '返回对话' : '历史记录' }}</span>
        </n-tooltip>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button text size="small" @click="handleMinimize">
              <n-icon :component="RemoveOutline" size="18" />
            </n-button>
          </template>
          <span>最小化</span>
        </n-tooltip>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button text size="small" @click="handleClose">
              <n-icon :component="CloseOutline" size="18" />
            </n-button>
          </template>
          <span>关闭</span>
        </n-tooltip>
      </div>
    </div>

    <!-- 历史记录视图 -->
    <div v-if="isHistoryView" class="history-view">
      <div class="history-list" ref="historyListRef" @scroll="handleHistoryScroll">
        <n-empty v-if="sessions.length === 0" description="暂无对话记录" />
        <div
          v-for="session in sessions"
          :key="session.id || Math.random()"
          :class="['history-item', { 'active': activeSessionId === session.id }]"
          @click="handleSwitchToSession(session)"
        >
          <div class="session-info">
            <div class="title-row">
              <div class="session-title">{{ session.sessionTitle || '未命名对话' }}</div>
              <div class="session-time">{{ formatTime(session.updateTime) }}</div>
            </div>
            <div class="preview-row">
              <div class="session-preview">{{ session.lastMessagePreview || '暂无消息' }}</div>
              <div class="message-count">{{ session.messageCount || 0 }} 条消息</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 聊天视图 -->
    <div v-else class="chat-view">
      <!-- 消息列表 -->
      <div ref="chatContentRef" class="messages-container">
        <div v-if="messages.length === 0" class="welcome-message">
          <div class="greeting-hero">
            <div class="greeting-name">
              {{ t('chat.greeting', { name: userDisplayName || t('common.guest') }) }}
            </div>
          </div>
        </div>
        <ChatMessageComponent
          v-for="message in messages"
          :key="message.id || Math.random()"
          :message="message"
          :is-streaming="isLoading"
          @feedback="handleFeedback"
          @copy="handleCopy"
          @resend="handleResend"
        />
      </div>

      <!-- 输入框 -->
      <div class="input-container">
        <ChatInputBox
          ref="chatInputRef"
          :model-value="input"
          :disabled="isLoading"
          :placeholder="t('chat.placeholder')"
          @update:model-value="input = $event"
          @send="handleSendMessage"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import {
  NButton,
  NIcon,
  NTooltip,
  NEmpty
} from 'naive-ui'
import {
  Time,
  RemoveOutline,
  CloseOutline,
  AddOutline,
} from '@vicons/ionicons5'
import { useI18n } from 'vue-i18n'
import { useUserStore } from '@/store'
import type { ChatSessionVO } from '@/types/celestialHub/chatSession'
import {
  listChatSession,
  getDefaultChatSessionQueryDTO
} from '@/api/celestialHub/chatSession'
import { useCelestialChat } from '@/views/celestialHub/composables/useCelestialChat'
import { useChatScroll } from '@/views/celestialHub/composables/useChatScroll'
import ChatMessageComponent from '@/views/celestialHub/components/ChatMessage.vue'
import ChatInputBox from '@/views/celestialHub/components/ChatInputBox.vue'

// Props
const props = defineProps<{
  isMinimized: boolean
  isHistoryView: boolean
}>()

// Emits
const emit = defineEmits<{
  minimize: []
  close: []
  'show-history': []
  'new-chat': []
}>()

// 国际化
const { t } = useI18n()
// 用户信息（用于显示问候）
const userStore = useUserStore()
const userDisplayName = computed(() => {
  const studentInfo = userStore.studentInfo
  const teacherInfo = userStore.teacherInfo
  const userInfo = userStore.userInfo
  if (studentInfo?.realName) return studentInfo.realName
  if (teacherInfo?.realName) return teacherInfo.realName
  if (studentInfo?.nickName) return studentInfo.nickName
  if (teacherInfo?.nickName) return teacherInfo.nickName
  if (userInfo?.nickName) return userInfo.nickName
  if (userInfo?.username) return userInfo.username
  return 'Admin'
})

// 使用 useCelestialChat composable
const {
  messages,
  input,
  isLoading,
  activeSessionId,
  currentSession,
  sendMessage,
  interruptStreaming,
  selectSession,
  newChat
} = useCelestialChat()

// 使用 useChatScroll composable
const {
  chatContentRef
} = useChatScroll()

// 消息提示

// 状态
const sessions = ref<ChatSessionVO[]>([])
const chatInputRef = ref<InstanceType<typeof ChatInputBox> | null>(null)

// 计算属性
const isHistoryView = computed(() => props.isHistoryView)
const headerTitle = computed(() => {
  return isHistoryView.value ? '历史对话' : (currentSession.value?.sessionTitle || '新对话')
})

// 生命周期
onMounted(async () => {
  // 如果打开时已经在历史视图，则立即加载会话列表
  if (props.isHistoryView) {
    await loadSessions()
  }
})

// 监听历史视图切换：只有在切换到历史视图时才去加载会话列表，避免打开弹窗时调用查询 API
watch(() => props.isHistoryView, async (newVal) => {
  if (newVal) {
    await loadSessions()
  }
})

// 会话列表分页与加载状态
const loading = ref(false)
const queryParams = ref(getDefaultChatSessionQueryDTO())
queryParams.value.pageSize = 10 // 改为每页 10 条
const total = ref(0)
const loadingMore = ref(false)
const hasMore = ref(true)
const historyListRef = ref<HTMLElement | null>(null)

// 加载会话列表
const loadSessions = async () => {
  loading.value = true
  queryParams.value = { ...getDefaultChatSessionQueryDTO() }
  queryParams.value.pageNum = 1
  queryParams.value.pageSize = 10
  queryParams.value.sysUserId = userStore.userInfo?.id || null
  try {
    const response = await listChatSession(queryParams.value)
    if (response.data) {
      sessions.value = response.data
      total.value = response.total || 0
      hasMore.value = sessions.value.length < total.value
    } else {
      sessions.value = []
      total.value = 0
      hasMore.value = false
    }
  } catch (e) {
    sessions.value = []
    total.value = 0
    hasMore.value = false
  } finally {
    loading.value = false
  }
}

// 加载更多会话（翻页）
const loadMoreSessions = async () => {
  if (!hasMore.value || loadingMore.value) return
  loadingMore.value = true
  queryParams.value.pageNum = (queryParams.value.pageNum || 1) + 1
  queryParams.value.sysUserId = userStore.userInfo?.id || null
  try {
    const response = await listChatSession(queryParams.value)
    if (response.data && response.data.length > 0) {
      sessions.value = [...sessions.value, ...response.data]
      hasMore.value = sessions.value.length < total.value
    } else {
      hasMore.value = false
    }
  } catch (e) {
    hasMore.value = false
  } finally {
    loadingMore.value = false
  }
}

// 处理历史列表滚动，接近底部时加载更多
const handleHistoryScroll = (e: Event) => {
  const target = e.target as HTMLElement
  const scrollTop = target.scrollTop
  const scrollHeight = target.scrollHeight
  const clientHeight = target.clientHeight
  if (scrollHeight - scrollTop - clientHeight < 10) {
    loadMoreSessions()
  }
}

// 切换到指定会话
const handleSwitchToSession = async (session: ChatSessionVO) => {
  await selectSession(session)
  emit('show-history')
}

// 发送消息
const handleSendMessage = async () => {
  await sendMessage()
}

// 处理反馈
const handleFeedback = (messageId: string, feedback: number) => {
  // 更新消息的反馈状态
  const message = messages.value.find(m => m.id === messageId)
  if (message) {
    message.isFeedback = feedback
  }
}

// 复制消息
const handleCopy = () => {
  // 由ChatMessage组件处理
}

// 重新发送消息
const handleResend = () => {
  // 找到最后一条用户消息并重新发送
  const lastUserMessage = [...messages.value].reverse().find(m => m.role === 0)
  if (lastUserMessage?.content) {
    input.value = lastUserMessage.content
    sendMessage()
  }
}


// 新建对话
const handleNewChat = () => {
  newChat()
  emit('new-chat')
}

// 切换历史视图
const toggleHistoryView = () => {
  emit('show-history')
}

// 最小化
const handleMinimize = () => {
  emit('minimize')
}

// 关闭
const handleClose = () => {
  // 取消正在进行的流式输出
  interruptStreaming()
  emit('close')
}

// 格式化时间
const formatTime = (timeStr?: string | null) => {
  if (!timeStr) return ''

  const date = new Date(timeStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
  } else if (days === 1) {
    return '昨天'
  } else if (days < 7) {
    return `${days}天前`
  } else {
    return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles' as *;

.celestial-hub-popup {
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  background: var(--background-color);
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);

  .popup-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background: var(--background-color);
    border-bottom: 1px solid var(--border-color);
    flex-shrink: 0;

    .header-left {
      display: flex;
      align-items: center;
      gap: 8px;

      .header-title {
        font-size: 16px;
        font-weight: 500;
        color: var(--text-color);
      }
    }

    .header-right {
      display: flex;
      align-items: center;
      gap: 4px;

      .n-button {
        color: var(--text-secondary-color);
        transition: all 0.2s ease;

        &:hover {
          color: var(--color-primary);
          background-color: var(--background-tertiary-color);
        }

        &.active {
          color: var(--color-primary);
        }
      }
    }
  }

  .history-view {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .history-list {
      flex: 1;
      overflow-y: auto;
      padding: 8px 0;

      .history-item {
        padding: 12px 16px;
        border-bottom: 1px solid var(--border-tertiary-color);
        cursor: pointer;
        transition: background-color 0.2s ease;

        &:hover {
          background-color: var(--background-tertiary-color);
        }

        &.active {
          background-color: var(--background-tertiary-color);
        }

        .session-info {
          display: flex;
          flex-direction: column;
          gap: 6px;

          .title-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 8px;
          }

          .session-title {
            font-weight: 500;
            color: var(--text-color);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex: 1;
          }

          .session-time {
            font-size: 12px;
            color: var(--text-secondary-color);
            white-space: nowrap;
            margin-left: 8px;
          }

          .preview-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
          }

          .session-preview {
            font-size: 14px;
            color: var(--text-secondary-color);
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            flex: 1;
          }

          .message-count {
            font-size: 12px;
            color: var(--text-secondary-color);
            white-space: nowrap;
            margin-left: 8px;
            flex-shrink: 0;
          }
        }
      }
    }
  }

  .chat-view {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .messages-container {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .welcome-message {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;

        .greeting-hero {
          max-width: 400px;
        }

        .greeting-name {
          font-size: 32px;
          color: var(--color-primary);
          font-weight: 700;
          letter-spacing: 0.02em;
        }

        .greeting-username {
          margin-left: 6px;
          color: var(--color-primary);
        }
      }

    }

    .input-container {
      flex-shrink: 0;
      /* 移除顶部分割线以符合页面设计 */
      border-top: none;
      padding: 12px 16px;
      background: transparent;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 12px;
    }

    /* 调整内部 ChatInputBox 的宽度与布局，使输入条占满可用空间并保持圆角样式 */
    :deep(.gemini-input-area) {
      width: 100%;
      max-width: 100%;
    }

    :deep(.gemini-input-container) {
      width: 100%;
      max-width: 100%;
    }

    /* 让输入框容器和发送按钮在底部对齐 */
    :deep(.gemini-input-wrapper) {
      padding: 12px;
      border-radius: 24px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
  }
}
</style>
