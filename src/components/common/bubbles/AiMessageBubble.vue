<template>
  <div class="ai-message-bubble">
    <div v-if="isThinking" class="thinking-dots">
      <span></span>
      <span></span>
      <span></span>
    </div>
    <MarkdownRenderer
        v-else-if="!isThinking && !contentHasKatex"
        :content="message.content || ''"
        :streaming="isStreaming"
        class="ai-content"
    />
    <div v-else-if="!isThinking && contentHasKatex" class="ai-content" v-html="sanitizedContent"></div>
    <div v-else class="ai-content-empty">正在思考...</div>
    <div v-if="!isThinking && !isStreaming" class="message-actions">
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-icon
              :class="['action-icon', { 'feedback-active': isPositiveFeedback }]"
              :component="ThumbsUpOutline"
              size="16"
              @click="handleFeedback(1)"
          />
        </template>
        {{ t('chat.feedback.helpful') }}
      </n-tooltip>
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-icon
              :class="['action-icon', { 'feedback-negative': isNegativeFeedback }]"
              :component="ThumbsDownOutline"
              size="16"
              @click="handleFeedback(-1)"
          />
        </template>
        {{ t('chat.feedback.notHelpful') }}
      </n-tooltip>
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-icon :component="RefreshOutline" class="action-icon" size="16" @click="handleResend"/>
        </template>
        {{ t('chat.resend') }}
      </n-tooltip>
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-icon :component="CopyOutline" class="action-icon" size="16" @click="handleCopy"/>
        </template>
        {{ t('chat.copy') }}
      </n-tooltip>
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-icon
              :class="['action-icon', virtualTeacherIconClass]"
              :component="virtualTeacherIcon"
              size="16"
              @click="handleVirtualTeacher"
          />
        </template>
        {{ virtualTeacherTooltip }}
      </n-tooltip>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import {NIcon, NTooltip, useMessage} from 'naive-ui'
import {
  CopyOutline,
  PlayCircleOutline,
  RefreshOutline,
  SyncOutline,
  ThumbsDownOutline,
  ThumbsUpOutline,
  VolumeHighOutline
} from '@vicons/ionicons5'
import {useI18n} from 'vue-i18n'
import type {ChatMessage} from '@/types/celestialHub/chatMessage'
import {feedbackMessage} from '@/api/celestialHub/chatMessage'
import MarkdownRenderer from '@/components/common/MarkdownRenderer.vue'
import DOMPurify from 'dompurify'

const props = defineProps<{
  message: ChatMessage
  isStreaming?: boolean
  audioActionStatus?: 'idle' | 'generating' | 'playing' | 'failed'
}>()

const emit = defineEmits<{
  feedback: [messageId: string, feedback: number]
  copy: []
  resend: []
  'virtual-teacher': [message: ChatMessage]
}>()

// 国际化。
const {t} = useI18n()

// 全局消息提示。
const messageApi = useMessage()

// 计算消息的显示状态。
const isThinking = computed(() => {
  return !props.message.content
})

const isStreaming = computed(() => {
  return props.isStreaming ?? false
})

const isPositiveFeedback = computed(() => {
  return props.message.isFeedback === 1
})

const isNegativeFeedback = computed(() => {
  return props.message.isFeedback === -1
})

const resolvedAudioActionStatus = computed(() => {
  if (props.audioActionStatus) {
    return props.audioActionStatus
  }
  if (props.message.audioStatus === 1 || props.message.audioStatus === 2) {
    return 'generating'
  }
  return 'idle'
})

const virtualTeacherIcon = computed(() => {
  if (resolvedAudioActionStatus.value === 'generating') return SyncOutline
  if (resolvedAudioActionStatus.value === 'playing') return PlayCircleOutline
  return VolumeHighOutline
})

const virtualTeacherIconClass = computed(() => {
  return {
    'is-generating': resolvedAudioActionStatus.value === 'generating',
    'is-playing': resolvedAudioActionStatus.value === 'playing',
    'is-failed': resolvedAudioActionStatus.value === 'failed'
  }
})

const virtualTeacherTooltip = computed(() => {
  if (resolvedAudioActionStatus.value === 'generating') return '语音生成中'
  if (resolvedAudioActionStatus.value === 'playing') return '虚拟教师正在讲解'
  if (resolvedAudioActionStatus.value === 'failed') return '语音生成失败，点击重试'
  if (props.message.audioStatus === 3 && props.message.audioUrl) return '播放虚拟教师讲解'
  return '虚拟教师'
})

// 如果内容已经是 KaTeX 渲染后的 HTML，就跳过 Markdown 二次渲染。
const contentHasKatex = computed(() => {
  const content = props.message?.content || ''
  return /<span\s+class=(?:"|')katex(?:"|')|<katex\b/i.test(content)
})

const sanitizedContent = computed(() => {
  const content = props.message?.content || ''
  // 允许 KaTeX 的必要标签和属性，同时过滤潜在的危险内容。
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p', 'br', 'strong', 'em', 'u', 'del', 'code', 'pre', 'blockquote', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'ul', 'ol', 'li', 'table', 'thead', 'tbody', 'tr', 'th', 'td', 'a', 'img', 'hr', 'span', 'div'],
    ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id', 'data-*', 'aria-*'],
    KEEP_CONTENT: true
  })
})

// 提交反馈。
const handleFeedback = async (feedbackType: number) => {
  if (!props.message.id) return

  await feedbackMessage(props.message.id, feedbackType)
  messageApi.success(t('chat.feedback.success'))
  emit('feedback', props.message.id, feedbackType)
}

// 复制消息。
const handleCopy = () => {
  emit('copy')
}

// 重新发送当前问答。
const handleResend = () => {
  emit('resend')
}

const handleVirtualTeacher = () => {
  if (resolvedAudioActionStatus.value === 'generating') {
    return
  }
  emit('virtual-teacher', props.message)
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles' as *;

.ai-message-bubble {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
  font-family: var(--markdown-font-family);

  .ai-content {
    max-width: 100%;
    padding: 16px 20px;
    border-radius: 24px 24px 24px 10px;
    display: inline-block;
    background: transparent;
    box-shadow: none;
    backdrop-filter: none;

    :deep(.markdown-renderer) {
      margin: 0;
      max-width: none;
    }

    :deep(.markdown-body) {
      margin: 0;
      background: transparent;
    }
  }

  .ai-content-empty {
    padding: 16px 20px;
    border-radius: 24px 24px 24px 10px;
    color: var(--text-secondary-color);
    background: transparent;
    border: 1px solid color-mix(in srgb, var(--border-color) 54%, transparent);
    letter-spacing: 0.01em;
  }

  .thinking-dots {
    display: flex;
    gap: 4px;
    padding: 8px 0;
    align-items: center;

    span {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--text-secondary-color);
      animation: thinking 1.4s infinite;

      &:nth-child(1) {
        animation-delay: 0s;
      }

      &:nth-child(2) {
        animation-delay: 0.2s;
      }

      &:nth-child(3) {
        animation-delay: 0.4s;
      }
    }
  }

  .message-actions {
    margin-top: 2px;
    display: flex;
    gap: 8px;
    padding-left: 6px;
    opacity: 0.88;

    .action-icon {
      cursor: pointer;
      color: var(--text-secondary-color);
      padding: 0;
      width: 28px;
      height: 28px;
      border-radius: 50%;
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--background-color) 84%, transparent);
      border: 1px solid transparent;
      backdrop-filter: blur(10px);

      &:hover {
        color: var(--color-primary);
        background-color: color-mix(in srgb, var(--background-tertiary-color) 88%, var(--background-color));
        border-color: color-mix(in srgb, var(--color-primary) 20%, transparent);
        transform: translateY(-1px);
      }

      &:active {
        transform: scale(0.95);
      }

      &.feedback-active {
        color: var(--color-primary);
      }

      &.feedback-negative {
        color: var(--error-color);
      }

      &.is-generating {
        color: var(--color-primary);
        animation: rotate 1s linear infinite;
      }

      &.is-playing {
        color: var(--color-primary);
      }

      &.is-failed {
        color: var(--error-color);
      }
    }
  }
}

@keyframes thinking {
  0%, 60%, 100% {
    opacity: 0.3;
    transform: translateY(0);
  }
  30% {
    opacity: 1;
    transform: translateY(-8px);
  }
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>
