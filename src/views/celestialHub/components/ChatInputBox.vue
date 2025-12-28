<template>
  <div class="gemini-input-area">
    <div class="gemini-input-container">
      <div
          :class="{ 'drag-over': isDragOver }"
          class="gemini-input-wrapper"
          @click="focusInput"
          @dragleave="handleDragLeave"
          @dragover.prevent="handleDragOver"
          @drop.prevent="handleDrop"
      >
        <div v-if="fileReferences && fileReferences.length > 0" class="file-references-inline">
          <FileReferenceSelector
              :model-value="fileReferencesModel"
              :session-id="sessionId"
              @update:model-value="fileReferencesModel = $event"
          />
        </div>

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
              <n-icon :component="AttachOutline" size="18"/>
            </div>
            <n-dropdown
                :options="toolsOptions"
                placement="bottom-start"
                trigger="click"
                @select="handleToolsSelect"
            >
              <div class="tool-item">
                <span class="tool-text">{{ t('chat.tools') }}</span>
              </div>
            </n-dropdown>
          </div>
          <div class="tools-right">
            <div
                :class="['tool-item', 'mic-item', { 'recording': isRecording, 'error': speechError }]"
                @click.stop="handleMicClick"
            >
              <div class="mic-icon-wrapper">
                <n-icon :component="MicOutline" class="mic-icon" size="18"/>
                <div v-if="isRecording" class="mic-ripple"></div>
                <div v-if="isRecording" class="mic-ripple mic-ripple-delay"></div>
              </div>
            </div>
            <div v-if="isAdmin" class="tool-item rag-toggle">
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
                    :color="isSending ? '#000000' : undefined"
                    :component="isSending ? Stop : Send"
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
import {computed, onUnmounted, ref, watch} from 'vue'
import {NButton, NDropdown, NIcon, NInput, NSwitch, useMessage} from 'naive-ui'
import {AttachOutline, MicOutline, Send, Stop} from '@vicons/ionicons5'
import {useI18n} from 'vue-i18n'
import {useUserStore} from '@/store'
import {useSpeechRecognition} from '@/composables/useSpeechRecognition'
import FileReferenceSelector from './FileReferenceSelector.vue'
import type {FileReference} from '@/types/celestialHub/knowledge'

const props = withDefaults(defineProps<{
  modelValue: string
  placeholder?: string
  isSending?: boolean
  isUploadingFiles?: boolean
  useRag?: boolean
  fileReferences?: FileReference[] | null
  sessionId?: string | null
}>(), {
  modelValue: '',
  placeholder: '',
  isSending: false,
  isUploadingFiles: false,
  useRag: true,
  fileReferences: null,
  sessionId: null
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'update:useRag', value: boolean): void
  (e: 'update:fileReferences', value: FileReference[] | null): void
  (e: 'enter'): void
  (e: 'trigger-file-select'): void
  (e: 'send'): void
  (e: 'stop'): void
  (e: 'open-tools', key: string | number): void
  (e: 'file-drop', fileInfo: any): void
}>()

const fileReferencesModel = computed({
  get() {
    return props.fileReferences
  },
  set(value: FileReference[] | null) {
    emit('update:fileReferences', value)
  }
})

const {t} = useI18n()
const userStore = useUserStore()
const message = useMessage()

// 判断是否是admin
const isAdmin = computed(() => {
  return userStore.hasRole('ADMIN')
})

// 语音识别
const {
  isSupported: isSpeechSupported,
  isListening,
  isError: speechError,
  errorMessage: speechErrorMessage,
  transcript: speechTranscript,
  start: startSpeechRecognition,
  stop: stopSpeechRecognition,
  reset: resetSpeechRecognition
} = useSpeechRecognition({
  lang: 'zh-CN',
  continuous: true,
  interimResults: true
})

const isRecording = computed(() => isListening.value)

// 记录上次追加到输入框的文本长度
const appendedLength = ref(0)

// 监听语音识别结果，实时更新输入框
watch(speechTranscript, (newTranscript) => {
  if (newTranscript && isRecording.value) {
    // 计算新增的文本（从上次追加的位置开始）
    const newText = newTranscript.slice(appendedLength.value)
    if (newText) {
      innerValue.value = (innerValue.value || '') + newText
      appendedLength.value = newTranscript.length
    }
  }
})

// 监听录音状态
watch(isRecording, (recording) => {
  if (!recording) {
    // 停止录音时，确保所有识别结果都已追加
    const remainingText = speechTranscript.value.slice(appendedLength.value)
    if (remainingText) {
      innerValue.value = (innerValue.value || '') + remainingText
    }
    // 重置状态
    appendedLength.value = 0
    resetSpeechRecognition()
  } else {
    // 开始录音时重置追加长度
    appendedLength.value = 0
  }
})

// 监听语音识别错误
watch(speechError, (hasError) => {
  if (hasError && speechErrorMessage.value) {
  }
})

// 处理麦克风点击
const handleMicClick = () => {
  if (!isSpeechSupported.value) {
    message.warning(t('chat.speech.notSupported'))
    return
  }

  if (isRecording.value) {
    stopSpeechRecognition()
  } else {
    startSpeechRecognition()
  }
}

// 组件卸载时停止语音识别
onUnmounted(() => {
  stopSpeechRecognition()
})

const isDragOver = ref(false)

const handleDragOver = () => {
  isDragOver.value = true
}

const handleDragLeave = () => {
  isDragOver.value = false
}

const handleDrop = (event: DragEvent) => {
  isDragOver.value = false
  if (event.dataTransfer) {
    try {
      const data = event.dataTransfer.getData('application/json')
      if (data) {
        const parsed = JSON.parse(data)
        if (parsed.type === 'file-reference' && parsed.fileInfo) {
          emit('file-drop', parsed.fileInfo)
        }
      }
    } catch (error) {
      // 忽略解析错误
    }
  }
}

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
    // 非admin用户始终返回true（默认开启）
    if (!isAdmin.value) {
      return true
    }
    return props.useRag ?? true
  },
  set(value: boolean) {
    // 非admin用户不允许修改，始终为true
    if (!isAdmin.value) {
      emit('update:useRag', true)
      return
    }
    emit('update:useRag', value)
  }
})

// 监听isAdmin变化，确保非admin用户的useRag始终为true
watch(isAdmin, (newIsAdmin) => {
  if (!newIsAdmin && props.useRag !== true) {
    emit('update:useRag', true)
  }
}, {immediate: true})

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

<style lang="scss" scoped>
@use '@/assets/styles' as *;

.gemini-input-area {
  width: 100%;

  .file-references-section {
    margin-bottom: 12px;
  }

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

      .file-references-inline {
        margin-bottom: 12px;
      }

      &.drag-over {
        border-color: var(--color-primary);
        background-color: color-mix(in srgb, var(--color-primary) 5%, var(--background-color));
      }

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

          &.mic-item {
            position: relative;
            overflow: visible;

            &.recording {
              background: linear-gradient(135deg,
                  color-mix(in srgb, var(--color-error) 20%, var(--background-color)) 0%,
                  color-mix(in srgb, var(--color-error) 15%, var(--background-color)) 100%);
              box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-error) 40%, transparent),
              0 4px 12px color-mix(in srgb, var(--color-error) 20%, transparent);
              animation: micPulse 2s ease-in-out infinite;

              .mic-icon {
                color: var(--color-error);
                filter: drop-shadow(0 0 4px color-mix(in srgb, var(--color-error) 50%, transparent));
                animation: micIconPulse 1.5s ease-in-out infinite;
              }
            }

            &.error {
              .mic-icon {
                color: var(--color-error);
              }
            }

            &:hover:not(.recording) {
              .mic-icon {
                color: var(--color-primary);
              }
            }

            .mic-icon-wrapper {
              position: relative;
              display: flex;
              align-items: center;
              justify-content: center;
              width: 18px;
              height: 18px;
            }

            .mic-icon {
              position: relative;
              z-index: 2;
              transition: all 0.3s ease;
            }

            .mic-ripple {
              position: absolute;
              top: 50%;
              left: 50%;
              width: 18px;
              height: 18px;
              border-radius: 50%;
              background: color-mix(in srgb, var(--color-error) 30%, transparent);
              transform: translate(-50%, -50%) scale(1);
              animation: micRipple 2s ease-out infinite;
              z-index: 1;
            }

            .mic-ripple-delay {
              animation-delay: 1s;
            }
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

@keyframes micPulse {
  0%, 100% {
    transform: scale(1);
    box-shadow: 0 0 0 0 color-mix(in srgb, var(--color-error) 40%, transparent),
    0 4px 12px color-mix(in srgb, var(--color-error) 20%, transparent);
  }
  50% {
    transform: scale(1.05);
    box-shadow: 0 0 0 4px color-mix(in srgb, var(--color-error) 20%, transparent),
    0 6px 16px color-mix(in srgb, var(--color-error) 30%, transparent);
  }
}

@keyframes micIconPulse {
  0%, 100% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.1);
    opacity: 0.9;
  }
}

@keyframes micRipple {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 0.8;
  }
  100% {
    transform: translate(-50%, -50%) scale(3);
    opacity: 0;
  }
}
</style>

