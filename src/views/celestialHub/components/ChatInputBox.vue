<template>
  <div class="gemini-input-area">
    <div class="gemini-input-container">
      <div class="gemini-input-wrapper" @click="focusInput">
        <n-input
            ref="inputRef"
            v-model:value="innerValue"
            :autosize="{ minRows: 1, maxRows: 8 }"
            :disabled="isSending"
            :placeholder="placeholder"
            class="gemini-textarea"
            type="textarea"
            @keydown="handleKeyDown"
        />

        <div class="input-bottom-tools">
          <div class="tools-left">
            <div
                :class="['tool-item', { disabled: isUploadingFiles }]"
                @click.stop="handleTriggerFileSelect"
            >
              <n-icon :component="Add" size="18"/>
            </div>
            <n-dropdown
                placement="bottom-start"
                trigger="click"
                :options="toolsOptions"
                @select="handleToolsSelect"
            >
            <div class="tool-item">
              <span class="tool-text">{{ t('chat.tools') }}</span>
            </div>
            </n-dropdown>
          </div>
          <div class="tools-right">
            <div class="tool-item">
              <n-icon :component="MicOutline" size="18"/>
            </div>
            <div class="tool-item rag-toggle">
              <span class="tool-text">{{ t('chat.useRag') }}</span>
              <n-switch v-model:value="ragValue" size="small"/>
            </div>
            <n-button
                :disabled="isSendDisabled"
                class="send-button"
                size="small"
                type="primary"
                @click.stop="handleSendClick"
            >
              <template #icon>
                <n-icon
                    :component="isSending ? Stop : Send"
                    :color="isSending ? '#000000' : undefined"
                    size="16"
                />
              </template>
            </n-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue'
import {NButton, NDropdown, NIcon, NInput, NSwitch} from 'naive-ui'
import {Add, MicOutline, Send, Stop} from '@vicons/ionicons5'
import {useI18n} from 'vue-i18n'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  isSending?: boolean
  isUploadingFiles?: boolean
  useRag?: boolean
}>(), {
  modelValue: '',
  placeholder: '',
  isSending: false,
  isUploadingFiles: false,
  useRag: true
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'update:useRag', value: boolean): void
  (e: 'enter'): void
  (e: 'trigger-file-select'): void
  (e: 'send'): void
  (e: 'stop'): void
  (e: 'open-tools', key: string | number): void
}>()

const {t} = useI18n()

const toolsOptions = computed(() => [
  {
    label: t('chat.toolsMenu.smartQuestion'),
    key: 'smartQuestion'
  }
])

const inputRef = ref<InstanceType<typeof NInput> | null>(null)

const innerValue = computed({
  get() {
    return props.modelValue
  },
  set(value: string) {
    emit('update:modelValue', value ?? '')
  }
})

const ragValue = computed({
  get() {
    return props.useRag ?? true
  },
  set(value: boolean) {
    emit('update:useRag', value)
  }
})

const isSendDisabled = computed(() => {
  return !props.isSending && (!innerValue.value || innerValue.value.length === 0)
})

const focusInput = () => {
  inputRef.value?.focus()
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault()
    emit('enter')
  }
}

const handleTriggerFileSelect = () => {
  if (props.isUploadingFiles) {
    return
  }
  emit('trigger-file-select')
}

const handleSendClick = () => {
  if (props.isSending) {
    emit('stop')
    return
  }
  emit('send')
}

const handleToolsSelect = (key: string | number) => {
  emit('open-tools', key)
}
</script>

<style scoped lang="scss">
@use '@/assets/styles' as *;

.gemini-input-area {
  width: 100%;

  .gemini-input-container {
    width: 100%;
    cursor: text;

    .gemini-input-wrapper {
      display: flex;
      flex-direction: column;
      background-color: var(--background-color);
      border: 1px solid var(--border-color);
      border-radius: 24px;
      padding: 16px;
      transition: all 0.3s ease;
      box-shadow: none;

      &:hover {
        border-color: var(--color-primary);
        box-shadow: 0 4px 16px color-mix(in srgb, var(--color-primary) 15%, transparent);
      }

      &:focus-within {
        border-color: var(--color-primary);
        box-shadow: 0 4px 16px color-mix(in srgb, var(--color-primary) 25%, transparent);
      }

      :deep(.gemini-textarea) {
        background-color: transparent;
        border: none;
        box-shadow: none;
        margin-bottom: 8px;

        .n-input__border,
        .n-input__state-border {
          display: none;
        }

        .n-input__textarea-el {
          background: transparent;
          border: none;
          box-shadow: none;
          outline: none;
          font-size: 16px;
          color: var(--text-color);
          resize: none;

          &::placeholder {
            color: var(--text-disabled-color);
          }

          &:hover,
          &:focus,
          &:active {
            border: none;
            box-shadow: none;
            outline: none;
          }
        }
      }

      .input-bottom-tools {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 24px;

        .tools-left,
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

          &.disabled {
            cursor: not-allowed;
            opacity: 0.6;
            pointer-events: none;
          }
        }

        .send-button {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
        }
      }
    }
  }
}
</style>

