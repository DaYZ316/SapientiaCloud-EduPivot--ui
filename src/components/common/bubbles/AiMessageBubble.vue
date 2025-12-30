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
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import {NIcon, NTooltip, useMessage} from 'naive-ui'
import {CopyOutline, RefreshOutline, ThumbsDownOutline, ThumbsUpOutline} from '@vicons/ionicons5'
import {useI18n} from 'vue-i18n'
import type {ChatMessage} from '@/types/celestialHub/chatMessage'
import {feedbackMessage} from '@/api/celestialHub/chatMessage'
import MarkdownRenderer from '@/components/common/MarkdownRenderer.vue'
import DOMPurify from 'dompurify'

// Props
const props = defineProps<{
  message: ChatMessage
  isStreaming?: boolean
}>()

// Emits
const emit = defineEmits<{
  feedback: [messageId: string, feedback: number]
  copy: []
  resend: []
}>()

// 国际化
const {t} = useI18n()

// 消息提示
const messageApi = useMessage()

// 计算属性
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

// 如果 message.content 已经包含 KaTeX 渲染后的 HTML（例如 <span class="katex">），
// 则避免再次通过 MarkdownRenderer 使用 markdown-it-katex 渲染，防止重复渲染。
const contentHasKatex = computed(() => {
  const content = props.message?.content || ''
  return /<span\s+class=(?:"|')katex(?:"|')|<katex\b/i.test(content)
})

const sanitizedContent = computed(() => {
  const content = props.message?.content || ''
  // 允许渲染 KaTeX 已生成的元素和常见标签，移除潜在危险内容
  return DOMPurify.sanitize(content, {
    ALLOWED_TAGS: ['p','br','strong','em','u','del','code','pre','blockquote','h1','h2','h3','h4','h5','h6','ul','ol','li','table','thead','tbody','tr','th','td','a','img','hr','span','div'],
    ALLOWED_ATTR: ['href','src','alt','title','class','id','data-*','aria-*'],
    KEEP_CONTENT: true
  })
})

// 处理反馈
const handleFeedback = async (feedbackType: number) => {
  if (!props.message.id) return

  await feedbackMessage(props.message.id, feedbackType)
  messageApi.success(t('chat.feedback.success'))
  emit('feedback', props.message.id, feedbackType)
}

// 复制内容
const handleCopy = () => {
  emit('copy')
}

// 重新提问
const handleResend = () => {
  emit('resend')
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles' as *;

.ai-message-bubble {
  .ai-content {
    max-width: 100%;
    padding: 12px 16px;
    border-radius: 16px;
    display: inline-block;
  }

  .ai-content-empty {
    padding: 12px 16px;
    border-radius: 16px;
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
    margin-top: 4px;
    display: flex;
    gap: 8px;

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

      &:hover {
        color: var(--color-primary);
        background-color: var(--background-tertiary-color);
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
</style>
