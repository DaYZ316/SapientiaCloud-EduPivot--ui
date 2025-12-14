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

    <footer v-if="canSend" :class="['chat-panel__footer', {'chat-panel__footer--fixed': fixedFooter}]"
            :style="footerStyle">
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

const footerStyle = computed(() => {
  if (!props.fixedFooter) return {}
  return {
    position: 'absolute' as const,
    bottom: '0',
    left: '0',
    right: '0',
    width: '100%',
    zIndex: '1000',
    backgroundColor: 'var(--background-tertiary-color)',
    margin: '0',
    padding: '0',
    borderTop: '1px solid var(--border-color)'
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
    paddingBottom: '120px',
    boxSizing: 'border-box' as const
  }
})

watch(
    () => props.messages.length,
    () => {
      nextTick(() => {
        if (!listRef.value) return
        listRef.value.scrollTop = listRef.value.scrollHeight
      })
    }
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
  height: 100% !important;
  min-height: 0;
  max-height: 100%;
  gap: 0;
  overflow: hidden;
  padding: 0;
  padding-bottom: 0;
  box-sizing: border-box;
  position: relative !important;

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
    flex: 1 1 0;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    position: relative;
    padding-bottom: 0;
    margin-bottom: 0;
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
    padding-bottom: 80px; // 预留输入框高度，确保最后一条消息可见
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
    margin-top: 0;
  }

  &__footer {
    padding: 0 !important;
    margin: 0 !important;
    border-top: 1px solid var(--border-color);
    background-color: var(--background-tertiary-color);
    width: 100% !important;
    flex-shrink: 0;

    &--fixed {
      position: absolute !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      z-index: 1000 !important;
      margin: 0 !important;
      padding: 0 !important;
    }
  }

  &.chat-panel-fixed-footer {
    height: 100% !important;
    min-height: 0 !important;
    max-height: 100% !important;
    overflow: hidden !important;
    display: flex !important;
    flex-direction: column !important;
    position: relative !important;
    box-sizing: border-box !important;

    &__footer {
      position: absolute !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      z-index: 1000 !important;
      background-color: var(--background-tertiary-color) !important;
      margin: 0 !important;
      padding: 0 !important;
      flex-shrink: 0 !important;
    }

    &__footer--fixed {
      position: absolute !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      z-index: 1000 !important;
      margin: 0 !important;
      padding: 0 !important;
    }

    &__body {
      flex: 1 1 auto !important;
      min-height: 0 !important;
      max-height: 100% !important;
      overflow: hidden !important;
      display: flex !important;
      flex-direction: column !important;
      position: relative !important;
      padding-bottom: 0 !important;
      margin-bottom: 0 !important;
    }

    &__messages,
    &__loading {
      flex: 1 1 auto !important;
      min-height: 0 !important;
      max-height: 100% !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
      padding-bottom: 120px !important;
      box-sizing: border-box !important;
    }
  }

  &__footer-input-wrapper {
    position: relative;
    flex-shrink: 0;
    padding: 12px 16px;
    padding-bottom: 12px;
    margin: 0 !important;
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
}
</style>

<style lang="scss">
// 非 scoped 样式，用于在特定上下文中覆盖样式
.chat-panel-connected .chat-panel {
  height: 100% !important;
  min-height: 0 !important;
  max-height: 100% !important;
  overflow: hidden !important;
  display: flex !important;
  flex-direction: column !important;
  position: relative !important;
  box-sizing: border-box !important;
}

.chat-panel-connected .chat-panel__body {
  flex: 1 1 auto !important;
  min-height: 0 !important;
  max-height: 100% !important;
  overflow: hidden !important;
  display: flex !important;
  flex-direction: column !important;
  position: relative !important;
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;
}

.chat-panel-connected .chat-panel__messages,
.chat-panel-connected .chat-panel__loading {
  flex: 1 1 auto !important;
  min-height: 0 !important;
  max-height: 100% !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  padding-bottom: 100px !important;
  box-sizing: border-box !important;
}

.chat-panel-connected .chat-panel__footer {
  position: absolute !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  z-index: 100 !important;
  background-color: var(--background-tertiary-color) !important;
  margin: 0 !important;
  padding: 0 !important;
  flex-shrink: 0 !important;
  box-sizing: border-box !important;
}

/* 针对 fixedFooter prop 的全局样式 - 确保输入框固定在底部 */
.chat-panel-fixed-footer {
  height: 100% !important;
  min-height: 0 !important;
  max-height: 100% !important;
  overflow: hidden !important;
  display: flex !important;
  flex-direction: column !important;
  position: relative !important;
  box-sizing: border-box !important;
}

.chat-panel-fixed-footer {
  height: 100% !important;
  min-height: 0 !important;
  max-height: 100% !important;
  overflow: hidden !important;
  display: flex !important;
  flex-direction: column !important;
  position: relative !important;
  box-sizing: border-box !important;
}

.chat-panel-fixed-footer .chat-panel__footer,
.chat-panel__footer--fixed {
  position: absolute !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  z-index: 1000 !important;
  background-color: var(--background-tertiary-color) !important;
  margin: 0 !important;
  padding: 0 !important;
  border-top: 1px solid var(--border-color) !important;
  flex-shrink: 0 !important;
}

.chat-panel-fixed-footer .chat-panel__body {
  flex: 1 1 auto !important;
  min-height: 0 !important;
  max-height: 100% !important;
  overflow: hidden !important;
  display: flex !important;
  flex-direction: column !important;
  position: relative !important;
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;
}

.chat-panel-fixed-footer .chat-panel__messages,
.chat-panel-fixed-footer .chat-panel__loading {
  flex: 1 1 auto !important;
  min-height: 0 !important;
  max-height: 100% !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  padding-bottom: 120px !important;
  box-sizing: border-box !important;
}

.chat-panel-fixed-footer .chat-panel__body {
  flex: 1 1 auto !important;
  min-height: 0 !important;
  max-height: 100% !important;
  overflow: hidden !important;
  display: flex !important;
  flex-direction: column !important;
  position: relative !important;
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;
}

.chat-panel-fixed-footer .chat-panel__messages,
.chat-panel-fixed-footer .chat-panel__loading {
  flex: 1 1 auto !important;
  min-height: 0 !important;
  max-height: 100% !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  padding-bottom: 120px !important;
  box-sizing: border-box !important;
}
</style>


