<template>
  <div class="chat-panel">
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

    <main class="chat-panel__body">
      <div v-if="loading" class="chat-panel__loading">
        <n-skeleton :repeat="4" text/>
      </div>
      <div v-else ref="listRef" class="chat-panel__messages">
        <div
            v-for="item in messages"
            :key="item.id"
            class="chat-panel__message"
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

    <footer v-if="canSend" class="chat-panel__footer">
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
}

interface Props {
  messages: ChatMessage[]
  loading?: boolean
  showHeader?: boolean
  title?: string
  subTitle?: string
  extra?: string
  canSend?: boolean
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

const placeholder = computed(() => t('chat.placeholder'))
const sendText = computed(() => t('chat.send'))
const emptyText = computed(() => t('common.noData'))

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
  height: 100%;
  gap: 8px;

  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
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
    flex: 1;
    min-height: 0;
  }

  &__loading {
    padding: 8px 0;
  }

  &__messages {
    height: 100%;
    overflow-y: auto;
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding-right: 4px;
  }

  &__message {
    padding: 6px 8px;
    border-radius: 6px;
    background-color: var(--background-color);
  }

  &__message-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 2px;
  }

  &__message-sender {
    font-size: 12px;
    font-weight: 500;
  }

  &__message-time {
    font-size: 11px;
    color: var(--text-color-3);
  }

  &__message-content {
    font-size: 13px;
    white-space: pre-wrap;
    word-break: break-word;
  }

  &__empty {
    font-size: 12px;
    color: var(--text-color-3);
    text-align: center;
    margin-top: 16px;
  }

  &__footer {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  &__footer-actions {
    display: flex;
    justify-content: flex-end;
  }
}
</style>


