<template>
  <div
      :class="['chat-message', messageRole]"
      :data-message-id="message.id || null"
  >
    <!-- 出题请求者消息 (role=3) -->
    <QuestionRequesterMessage
        v-if="message.role === 3"
        :message="message"
    />
    <!-- 出题者消息 (role=4) -->
    <QuestionGeneratorMessage
        v-else-if="message.role === 4"
        :is-active="isQuestionBubbleActive"
        :active-index="props.activeQuestionIndex ?? null"
        :message="message"
        @view-questions="handleViewQuestions"
    />
    <!-- 普通消息 -->
    <template v-else>
      <div class="message-text">
        <div v-if="isThinking" class="thinking-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div v-else-if="messageRole === 'user'" class="user-content">
          {{ message.content }}
        </div>
        <MarkdownRenderer
            v-else-if="messageRole === 'assistant'"
            :content="message.content || ''"
            class="ai-content"
        />
        <div v-else class="ai-content-empty">正在思考...</div>
      </div>
      <div v-if="messageRole === 'assistant' && !isThinking && !isStreaming" class="message-actions">
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
    </template>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import {NIcon, NTooltip, useMessage} from 'naive-ui'
import {CopyOutline, RefreshOutline, ThumbsDownOutline, ThumbsUpOutline} from '@vicons/ionicons5'
import {useI18n} from 'vue-i18n'
import type {ChatMessage} from '@/types/celestialHub/chatMessage'
import type {QuestionResponseDTO} from '@/types/celestialHub/question'
import {feedbackMessage} from '@/api/celestialHub/chatMessage'
import MarkdownRenderer from '@/components/common/MarkdownRenderer.vue'
import QuestionRequesterMessage from './QuestionRequesterMessage.vue'
import QuestionGeneratorMessage from './QuestionGeneratorMessage.vue'

// Props
const props = defineProps<{
  message: ChatMessage
  isStreaming?: boolean
  activeQuestionMessageId?: string | null
  activeQuestionIndex?: number | null
}>()

// Emits
const emit = defineEmits<{
  feedback: [messageId: string, feedback: number]
  copy: []
  resend: []
  'view-questions': [{
    messageId: string | null
    questions: QuestionResponseDTO[]
    activeIndex: number | null
  }]
}>()

// 国际化
const {t} = useI18n()

// 消息提示
const messageApi = useMessage()

// 计算属性
const messageRole = computed(() => {
  if (props.message.role === 0) return 'user'
  if (props.message.role === 1) return 'assistant'
  return 'system'
})

const isThinking = computed(() => {
  return !props.message.content && messageRole.value === 'assistant'
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

const isQuestionBubbleActive = computed(() => {
  if (!props.message.id) {
    return false
  }
  return props.activeQuestionMessageId === props.message.id
})

const handleViewQuestions = (payload: { messageId: string | null; questions: QuestionResponseDTO[]; activeIndex: number | null }) => {
  emit('view-questions', payload)
}

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

.chat-message {
  padding: 8px 16px;
  display: flex;
  flex-direction: column;

  &.user {
    align-items: flex-end;

    .message-text {
      display: flex;
      justify-content: flex-end;
      width: 100%;

      .user-content {
        max-width: 70%;
        padding: 12px 16px;
        background: var(--color-primary);
        color: white;
        border-radius: 16px 4px 16px 16px;
        white-space: pre-wrap;
        word-break: break-word;
        line-height: 1.6;
      }
    }
  }

  &.assistant {
    align-items: flex-start;

    .message-text {
      .ai-content {
        max-width: 100%;
        padding: 12px 16px;
        border-radius: 16px;
        color: var(--text-color);
        line-height: 1.6;
        display: inline-block;
      }

      .ai-content-empty {
        padding: 12px 16px;
        border-radius: 16px;
        color: var(--text-secondary-color);
        font-style: italic;
      }
    }
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

