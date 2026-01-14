<template>
  <div :class="['chat-panel', {'chat-panel-fixed-footer': fixedFooter}]" :style="panelStyle">
    <header v-if="showHeader" class="chat-panel__header">
      <div class="chat-panel__titles">
        <h3 class="chat-panel__title">{{ title }}</h3>
        <p v-if="subTitle" class="chat-panel__subtitle">
          {{ subTitle }}
        </p>
      </div>
      <div v-if="extra" class="chat-panel__extra">
        {{ extra }}
      </div>
    </header>

    <main :style="bodyStyle" class="chat-panel__body">
      <div v-if="loading" :style="messagesStyle" class="chat-panel__loading">
        <n-skeleton :repeat="4" text/>
      </div>
      <div v-else ref="listRef" :style="messagesStyle" class="chat-panel__messages">
        <div
            v-for="item in messages"
            :key="item.id"
            :class="['chat-panel__message', {'chat-panel__message--own': item.isOwn}]"
        >
          <div class="chat-panel__message-header">
            <span class="chat-panel__message-sender">{{ item.sender }}</span>
            <span class="chat-panel__message-time">{{ item.timestamp }}</span>
          </div>
          <div class="chat-panel__message-content">
            {{ item.content }}
          </div>
        </div>
        <div
            v-if="!messages.length"
            class="chat-panel__empty"
        >
          {{ emptyText }}
        </div>
      </div>
    </main>

    <footer v-if="canSend" :class="['chat-panel__footer', {'chat-panel__footer--fixed': fixedFooter}]">
      <div class="chat-panel__footer-input-wrapper">
        <n-input
            v-model:value="inputValue"
            :autosize="{ minRows: 2, maxRows: 4 }"
            :placeholder="placeholder"
            type="textarea"
            @keyup.enter.exact.prevent="handleSend"
        />
        <div class="chat-panel__footer-actions">
          <n-button
              :disabled="!trimmedValue"
              size="small"
              type="primary"
              @click="handleSend"
          >
            {{ sendText }}
          </n-button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script lang="ts" setup>
import {computed, nextTick, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'

interface ChatMessage {
  id: string
  sender: string
  content: string
  timestamp: string
  isOwn?: boolean
}

interface Props {
  messages: ChatMessage[]
  loading?: boolean
  showHeader?: boolean
  title?: string
  subTitle?: string
  extra?: string
  canSend?: boolean
  placeholder?: string
  fixedFooter?: boolean
}

interface Emits {
  (e: 'send', content: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const {t} = useI18n()

const inputValue = ref('')
const listRef = ref<HTMLDivElement | null>(null)

const trimmedValue = computed(() => inputValue.value.trim())

const placeholder = computed(() => props.placeholder || t('chat.placeholder'))
const sendText = computed(() => t('chat.send'))
const emptyText = computed(() => t('common.noData'))

// 固定底部时的样式 - 强制使用内联样式
const panelStyle = computed(() => {
  if (!props.fixedFooter) return {}
  return {
    height: '100%',
    minHeight: '0',
    maxHeight: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const,
    position: 'relative' as const,
    boxSizing: 'border-box' as const
  }
})

const bodyStyle = computed(() => {
  if (!props.fixedFooter) return {}
  return {
    flex: '1 1 auto',
    minHeight: '0',
    maxHeight: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column' as const,
    position: 'relative' as const,
    paddingBottom: '0px',
    marginBottom: '0px'
  }
})

const messagesStyle = computed(() => {
  if (!props.fixedFooter) return {}
  return {
    flex: '1 1 auto',
    minHeight: '0',
    maxHeight: '100%',
    overflowY: 'auto' as const,
    overflowX: 'hidden' as const,
    boxSizing: 'border-box' as const
  }
})

// 自动滚动到底部
const scrollToBottom = () => {
  nextTick(() => {
    if (!listRef.value) return
    listRef.value.scrollTop = listRef.value.scrollHeight
  })
}

// 监听消息变化，自动滚动到底部
watch(
    () => props.messages.length,
    (newLength, oldLength) => {
      // 只有当消息数量增加时才滚动到底部
      if (newLength > oldLength) {
        scrollToBottom()
      }
    }
)

// 监听消息内容变化（用于实时消息更新）
watch(
    () => props.messages,
    (newMessages, oldMessages) => {
      if (newMessages && oldMessages && newMessages.length === oldMessages.length) {
        // 消息数量相同但内容可能更新，检查最后一条消息
        const lastNew = newMessages[newMessages.length - 1]
        const lastOld = oldMessages[oldMessages.length - 1]
        if (lastNew && lastOld && lastNew.id !== lastOld.id) {
          scrollToBottom()
        }
      }
    },
    { deep: true }
)

function handleSend() {
  const value = trimmedValue.value
  if (!value) return
  emit('send', value)
  inputValue.value = ''
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.chat-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  min-height: 0;
  max-height: 100%;
  overflow: hidden;
  padding: 0;
  box-sizing: border-box;
  position: relative;
  gap: 0;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px;
    flex-shrink: 0;
    border-bottom: 1px solid var(--border-color);
  }

  &__titles {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  &__title {
    margin: 0;
    font-size: 14px;
    font-weight: 600;
  }

  &__subtitle {
    margin: 0;
    font-size: 12px;
    color: var(--text-color-3);
  }

  &__extra {
    font-size: 12px;
    color: var(--text-color-3);
  }

  &__body {
    flex: 1 1 auto;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
  }

  &__loading {
    padding: 8px 16px;
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    -webkit-overflow-scrolling: touch;
  }

  &__messages {
    flex: 1;
    min-height: 0;
    overflow-y: auto;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 12px 16px;
    -webkit-overflow-scrolling: touch;
    align-items: flex-start;
    justify-content: flex-start;
  }

  &__message {
    max-width: 70%;
    min-width: 80px;
    padding: 8px 12px;
    border-radius: 8px;
    background-color: var(--background-color);
    position: relative;
    word-wrap: break-word;
    word-break: break-word;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

    &--own {
      align-self: flex-end;
      background-color: var(--primary-color);
      color: #ffffff;

      .chat-panel__message-sender {
        color: rgba(255, 255, 255, 0.9);
      }

      .chat-panel__message-time {
        color: rgba(255, 255, 255, 0.7);
      }

      .chat-panel__message-content {
        color: #ffffff;
      }
    }

    &:not(&--own) {
      align-self: flex-start;
    }
  }

  &__message-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 4px;
    gap: 8px;
  }

  &__message-sender {
    font-size: 12px;
    font-weight: 500;
    color: var(--text-color-2);
    flex-shrink: 0;
  }

  &__message-time {
    font-size: 11px;
    color: var(--text-color-3);
    flex-shrink: 0;
    white-space: nowrap;
  }

  &__message-content {
    font-size: 13px;
    white-space: pre-wrap;
    word-break: break-word;
    line-height: 1.5;
    overflow-wrap: break-word;
  }

  &__empty {
    font-size: 12px;
    color: var(--text-color-3);
    text-align: center;
    margin: 0;
    padding: 16px;
    flex-shrink: 0;
    width: 100%;
  }

  &__footer {
    border-top: 1px solid var(--border-color);
    background-color: var(--background-tertiary-color);
    flex-shrink: 0;
    margin-top: auto;

    &--fixed {
      width: 100%;
      border-bottom-left-radius: inherit;
      border-bottom-right-radius: inherit;
    }
  }

  &__footer-input-wrapper {
    position: relative;
    flex-shrink: 0;
    padding: 12px 16px;
    padding-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;

    :deep(.n-input) {
      flex: 1;
      padding-right: 70px;
    }

    :deep(.n-input__textarea-el) {
      padding-right: 70px;
    }
  }

  &__footer-actions {
    position: absolute;
    right: 24px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    flex-shrink: 0;
    display: flex;
    align-items: center;
  }

  // 固定底部样式
  &.chat-panel-fixed-footer {
    height: 100%;
    min-height: 0;
    max-height: 100%;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    position: relative;
    box-sizing: border-box;

    .chat-panel__body {
      flex: 1 1 auto;
      min-height: 0;
      max-height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      position: relative;
    }

    .chat-panel__messages,
    .chat-panel__loading {
      flex: 1 1 auto;
      min-height: 0;
      max-height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      box-sizing: border-box;
    }
  }
}
</style>


