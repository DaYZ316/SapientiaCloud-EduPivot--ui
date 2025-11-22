<template>
  <div class="celestial-hub-container">
    <!-- 聊天侧边栏 -->
    <ChatSidebar
        ref="chatSidebarRef"
        :active-session-id="activeSessionId"
        @my-favorites="handleMyFavorites"
        @new-chat="newChat"
        @select-session="selectSession"
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
              <div class="gemini-input-area">
                <div class="gemini-input-container">
                  <div class="gemini-input-wrapper">
                    <!-- 输入框 -->
                    <n-input
                        v-model:value="input"
                        :autosize="{ minRows: 1, maxRows: 8 }"
                        :disabled="isSending"
                        :placeholder="t('chat.placeholder')"
                        class="gemini-textarea"
                        type="textarea"
                        @keydown.enter="handleKeyDown"
                    />

                    <!-- 底部工具栏 -->
                    <div class="input-bottom-tools">
                      <div class="tool-button">
                        <n-icon :component="Add" size="18"/>
                      </div>
                      <div class="tool-text">{{ t('chat.tools') }}</div>
                      <div style="flex: 1"></div>
                      <div class="tool-item" style="gap: 8px;">
                        <span class="tool-text">{{ t('chat.useRag') }}</span>
                        <n-switch v-model:value="useRagSwitch" size="small"/>
                      </div>
                      <div class="tool-button">
                        <n-icon :component="MicOutline" size="18"/>
                      </div>
                      <n-button
                          :disabled="!input || isSending"
                          :loading="isSending"
                          class="send-button"
                          size="small"
                          type="primary"
                          @click="sendMessage"
                      >
                        <template #icon>
                          <n-icon :component="Send" size="16"/>
                        </template>
                      </n-button>
                    </div>
                  </div>
                </div>
              </div>
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
            <!-- 输入框 -->
            <div class="gemini-input-container" @click="focusInput">
              <div :class="['gemini-input-wrapper', { focused: isInputFocused }]">
                <input
                    ref="geminiInputRef"
                    v-model="input"
                    :placeholder="t('chat.placeholder')"
                    class="gemini-input"
                    @blur="handleInputBlur"
                    @focus="handleInputFocus"
                    @keydown.enter="handleKeyDown"
                />
              </div>
            </div>

            <!-- 工具图标区 -->
            <div class="gemini-tools-row">
              <div class="tools-left">
                <div class="tool-item">
                  <n-icon :component="Add" size="20"/>
                </div>
                <div class="tool-item">
                  <span class="tool-text">{{ t('chat.tools') }}</span>
                </div>
              </div>
              <div class="tools-right">
                <div class="tool-item">
                  <n-icon :component="MicOutline" size="20"/>
                </div>
                <div class="tool-item">
                  <span class="tool-text">{{ t('chat.useRag') }}</span>
                  <n-switch v-model:value="useRagSwitch" size="small"/>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, nextTick, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {NButton, NIcon, NInput, NTooltip, NSwitch, useMessage} from 'naive-ui'
import {Add, MicOutline, Pin, Send, Star} from '@vicons/ionicons5'
import ChatSidebar from './components/ChatSidebar.vue'
import ChatMessage from './components/ChatMessage.vue'
import {useUserStore} from '@/store'
import {useCelestialChat} from '@/views/celestialHub/composables/useCelestialChat'
import {favoriteSession, pinSession} from '@/api/celestialHub/chatSession'

// 状态
const geminiInputRef = ref<HTMLInputElement | null>(null)
const isInputFocused = ref(false)
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
  selectSession,
  newChat,
  scrollToBottom,
  useRag
} = useCelestialChat()

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

// 将可空的 useRag 转换为开关可用的布尔状态（默认关闭）
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

// 处理回车键
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    sendMessage()
  }
}

// 聚焦输入框
const focusInput = () => {
  geminiInputRef.value?.focus()
}

// 处理输入框聚焦
const handleInputFocus = () => {
  isInputFocused.value = true
}

// 处理输入框失焦
const handleInputBlur = () => {
  isInputFocused.value = false
}

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
@use '@/assets/styles' as *;

.celestial-hub-container {
  display: flex;
  height: 100vh;
  background-color: var(--background-color);
  margin: calc(-1 * 24px);
  padding: 0;
  overflow: hidden;
}

.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: var(--background-color);

  .chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-bottom: 1px solid var(--border-secondary-color);
    background-color: var(--background-secondary-color);

    .chat-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-color);
    }

    .chat-actions {
      display: flex;
      gap: 16px;
      margin-right: 16px;

      .header-icon {
        cursor: pointer;
        color: var(--text-secondary-color);
        transition: all 0.2s ease;

        &:hover {
          color: var(--color-primary);
        }

        &.active {
          color: var(--warning-color);
        }
      }
    }
  }

  .chat-content-wrapper {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }

  .chat-content {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;

    .loading-indicator {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }

    .messages-wrapper {
      flex: 1;
      overflow-y: auto;

      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-track {
        background: var(--background-tertiary-color);
      }

      &::-webkit-scrollbar-thumb {
        background: var(--border-color);
        border-radius: 4px;
        transition: background 0.3s ease;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: var(--text-secondary-color);
      }
    }

    .messages-container {
      width: 65%;
      margin: 0 auto;
      padding: 24px;
    }

    .input-container {
      padding: 24px;
      background-color: var(--background-color);

      .input-wrapper {
        width: 60%;
        margin: 0 auto;

        .gemini-input-area {
          .gemini-input-container {
            .gemini-input-wrapper {
              display: flex;
              flex-direction: column;
              background-color: var(--background-tertiary-color);
              border: 1px solid var(--border-color);
              border-radius: 24px;
              padding: 16px;
              transition: all 0.3s ease;

              :deep(.gemini-textarea) {
                margin-bottom: 8px;

                .n-input__textarea-el {
                  background: transparent;
                  border: none;
                  font-size: 16px;
                  color: var(--text-color);
                  resize: none;

                  &::placeholder {
                    color: var(--text-disabled-color);
                  }
                }
              }

              .input-bottom-tools {
                display: flex;
                align-items: center;
                gap: 12px;

                .tool-item {
                  display: flex;
                  align-items: center;
                  gap: 6px;
                  padding: 0 4px;
                }

                .tool-button {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 32px;
                  height: 32px;
                  border-radius: 8px;
                  cursor: pointer;
                  transition: all 0.2s ease;
                  color: var(--text-secondary-color);

                  &:hover {
                    background-color: var(--background-color);
                    color: var(--text-color);
                  }
                }

                .tool-text {
                  font-size: 14px;
                  color: var(--text-secondary-color);
                  cursor: pointer;
                  transition: color 0.2s ease;

                  &:hover {
                    color: var(--text-color);
                  }
                }

                .send-button {
                  border-radius: 8px;
                  padding: 8px 16px;
                }
              }
            }
          }
        }
      }
    }
  }

  .gemini-empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    padding: 48px 24px;
    background-color: var(--background-color);
    position: relative;

    .ai-name-container {
      position: absolute;
      top: 0;
      left: 0;
      z-index: 10;
      padding: 24px;
    }

    .greeting-wrapper {
      width: 60%;
      margin: 0 auto;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      flex: 1;
    }

    .ai-name-text {
      font-size: 32px;
      font-weight: 700;
      background: linear-gradient(
              90deg,
              #ffd700 0%,
              #ffb347 25%,
              #ff8c00 50%,
              #ffb347 75%,
              #ffd700 100%
      );
      background-size: 200% 100%;
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: goldenFlow 3s linear infinite;
      text-shadow: 0 0 20px rgba(255, 215, 0, 0.5);

      @keyframes goldenFlow {
        0% {
          background-position: 0% 50%;
        }
        100% {
          background-position: 200% 50%;
        }
      }
    }

    .greeting-text {
      font-size: 36px;
      font-weight: 500;
      color: var(--color-primary);
      margin-bottom: 48px;
      text-align: center;
      width: 100%;
    }

    .gemini-input-section {
      width: 100%;

      .gemini-input-container {
        width: 100%;
        cursor: text;
        margin-bottom: 16px;

        .gemini-input-wrapper {
          display: flex;
          align-items: center;
          background-color: var(--background-tertiary-color);
          border-radius: 28px;
          padding: 12px 16px;
          transition: all 0.3s ease;
          border: 1px solid var(--border-color);
          min-height: 60px;


          &.focused {
            background-color: var(--background-secondary-color);
            border-color: var(--color-primary);
            box-shadow: 0 4px 16px color-mix(in srgb, var(--color-primary) 15%, transparent);
          }

          .gemini-input {
            width: 100%;
            border: none;
            outline: none;
            background: transparent;
            font-size: 16px;
            color: var(--text-color);
            font-family: inherit;
            line-height: 1.5;

            &::placeholder {
              color: var(--text-disabled-color);
            }
          }
        }
      }

      .gemini-tools-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;

        .tools-left {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .tools-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .tool-item {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 8px 12px;
          border-radius: 16px;
          cursor: pointer;
          transition: all 0.2s ease;

          .n-icon {
            color: var(--text-secondary-color);
            transition: color 0.2s ease;
          }

          .tool-text {
            font-size: 14px;
            color: var(--text-secondary-color);
            transition: color 0.2s ease;
          }

          &:hover {
            background-color: var(--background-tertiary-color);

            .n-icon,
            .tool-text {
              color: var(--color-primary);
            }
          }
        }
      }
    }
  }
}
</style>
