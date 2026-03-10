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
        :active-index="props.activeQuestionIndex ?? null"
        :is-active="isQuestionBubbleActive"
        :message="message"
        @view-questions="handleViewQuestions"
    />
    <!-- 系统消息 (role=2) -->
    <SystemMessageBubble
        v-else-if="message.role === 2"
        :message="message"
    />
    <!-- 普通消息 -->
    <template v-else>
      <div class="message-text">
        <!-- 用户消息 -->
        <UserMessageBubble
            v-if="messageRole === 'user'"
            :message="message"
        />
        <!-- AI消息 -->
        <AiMessageBubble
            v-else-if="messageRole === 'assistant'"
            :is-streaming="props.isStreaming"
            :message="message"
            @copy="handleCopy"
            @feedback="handleFeedback"
            @resend="handleResend"
        />
      </div>
    </template>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import type {ChatMessage} from '@/types/celestialHub/chatMessage'
import type {QuestionResponseDTO} from '@/types/celestialHub/question'
import QuestionRequesterMessage from './QuestionRequesterMessage.vue'
import QuestionGeneratorMessage from './QuestionGeneratorMessage.vue'
import {UserMessageBubble, AiMessageBubble, SystemMessageBubble} from '@/components/common/bubbles'

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

// 计算属性
const messageRole = computed(() => {
  if (props.message.role === 0) return 'user'
  if (props.message.role === 1) return 'assistant'
  return 'system'
})

const isQuestionBubbleActive = computed(() => {
  if (!props.message.id) {
    return false
  }
  return props.activeQuestionMessageId === props.message.id
})

const handleViewQuestions = (payload: {
  messageId: string | null;
  questions: QuestionResponseDTO[];
  activeIndex: number | null
}) => {
  emit('view-questions', payload)
}

// 处理反馈
const handleFeedback = (messageId: string, feedback: number) => {
  emit('feedback', messageId, feedback)
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

}

</style>

