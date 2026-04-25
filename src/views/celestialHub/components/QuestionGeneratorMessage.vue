<template>
  <div
      :class="['question-generator-message', { 'is-active': isActive }]"
      :data-message-id="message.id || null"
  >
    <div class="message-text">
      <div
          v-if="isPending"
          :class="['question-card', 'pending-card']"
      >
        <n-icon :component="DocumentTextOutline" class="card-icon" size="20"/>
        <div class="card-content">
          <transition mode="out-in" name="status-slide-fade">
            <div :key="pendingTitle" class="card-title">{{ pendingTitle }}</div>
          </transition>
        </div>
        <n-spin class="card-loading" size="small"/>
      </div>

      <MarkdownRenderer
          v-else-if="message.content"
          :content="message.content"
          class="ai-content"
      />

      <div v-if="hasQuestions" class="question-card-group">
        <div class="result-label">
          {{ resultTitle }}
        </div>
        <div
            v-for="(questionItem, questionIndex) in questionList"
            :key="questionItem.id ?? `question-card-${questionIndex}`"
            :class="['question-card', { 'is-active': isActive && activeIndex === questionIndex }]"
            :data-question-index="questionIndex"
            @click="handleCardClick(questionIndex)"
        >
          <n-icon :component="DocumentTextOutline" class="card-icon" size="20"/>
          <div class="card-content">
            <div class="card-title">{{ getQuestionCardTitle(questionItem, questionIndex) }}</div>
            <div class="card-time">{{ formattedTime }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import {NIcon, NSpin} from 'naive-ui'
import {useI18n} from 'vue-i18n'
import {DocumentTextOutline} from '@vicons/ionicons5'
import type {ChatMessage} from '@/types/celestialHub/chatMessage'
import type {QuestionGenerationMode, QuestionResponseDTO} from '@/types/celestialHub/question'
import MarkdownRenderer from '@/components/common/MarkdownRenderer.vue'

const props = defineProps<{
  message: ChatMessage
  isActive?: boolean
  activeIndex?: number | null
}>()

const emit = defineEmits<{
  (e: 'view-questions', payload: {
    messageId: string | null
    questions: QuestionResponseDTO[]
    activeIndex: number | null
    panelTitle?: string | null
    mode?: QuestionGenerationMode | null
  }): void
}>()

const {t} = useI18n()

const generationMode = computed<QuestionGenerationMode>(() => {
  const mode = props.message.metadata?.generationMode
  return mode === 'paper' ? 'paper' : 'question'
})

const paperName = computed(() => {
  const value = props.message.metadata?.paperName
  return typeof value === 'string' && value.trim() ? value.trim() : null
})

const isPending = computed(() => {
  const status = props.message.metadata?.questionStatus
  return status === 'pending' || status === 'processing'
})

const pendingStepMessage = computed(() => {
  const value = props.message.metadata?.questionStepMessage
  if (typeof value === 'string' && value.trim()) {
    return value.trim()
  }
  return null
})

const pendingTitle = computed(() => {
  if (pendingStepMessage.value) {
    return pendingStepMessage.value
  }
  if (props.message.content) {
    return props.message.content
  }
  return generationMode.value === 'paper'
      ? t('chat.toolsMenu.generatingPaperTitle')
      : t('chat.toolsMenu.generatingTitle')
})

const questions = computed<QuestionResponseDTO[] | null>(() => {
  if (!props.message.questionResponse) {
    return null
  }
  try {
    return JSON.parse(props.message.questionResponse) as QuestionResponseDTO[]
  } catch {
    return null
  }
})

const questionList = computed<QuestionResponseDTO[]>(() => questions.value ?? [])
const hasQuestions = computed(() => questionList.value.length > 0)
const resultTitle = computed(() => {
  if (generationMode.value === 'paper') {
    return paperName.value || t('chat.toolsMenu.paperTitleFallback')
  }
  return t('chat.toolsMenu.questionResultTitle')
})

const formattedTime = computed(() => {
  if (!props.message.createTime) {
    return ''
  }
  try {
    const date = new Date(props.message.createTime)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = monthNames[date.getMonth()]
    const day = date.getDate()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    const displayMinutes = minutes.toString().padStart(2, '0')
    return `${month} ${day}, ${displayHours}:${displayMinutes} ${ampm}`
  } catch {
    return ''
  }
})

const getQuestionCardTitle = (question: QuestionResponseDTO, index: number) => {
  if (question.questionTitle) {
    return question.questionTitle
  }
  if (question.questionContent) {
    return question.questionContent
  }
  if (generationMode.value === 'paper') {
    return `${t('chat.toolsMenu.paperResultTitle')} ${index + 1}`
  }
  return `${t('chat.toolsMenu.questionResultTitle')} ${index + 1}`
}

const handleCardClick = (index: number) => {
  if (!questionList.value.length) {
    return
  }
  emit('view-questions', {
    messageId: props.message.id ?? null,
    questions: questionList.value,
    activeIndex: index,
    panelTitle: generationMode.value === 'paper' ? resultTitle.value : null,
    mode: generationMode.value
  })
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles' as *;

.question-generator-message {
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: background-color 0.2s ease;

  .message-text {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;

    .ai-content {
      max-width: 100%;
      padding: 0;
      color: var(--text-color);
      line-height: 1.6;
      display: inline-block;

      :deep(.markdown-renderer) {
        max-width: none;
        margin: 0;
      }

      :deep(.markdown-body) {
        margin: 0;
        background: transparent;
      }

      :deep(.markdown-body > *:last-child) {
        margin-bottom: 0;
      }
    }

    .question-card-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .result-label {
      font-size: 12px;
      font-weight: 600;
      color: var(--color-primary);
      letter-spacing: 0.04em;
    }

    .question-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: var(--background-secondary-color);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      max-width: 400px;

      &:hover {
        background: var(--background-tertiary-color);
        border-color: var(--color-primary);
      }

      &.is-active {
        border-color: var(--color-primary);
        box-shadow: 0 8px 20px var(--shadow-color);
        background: var(--background-color);

        .card-icon {
          color: var(--color-primary);
        }

        .card-content .card-title {
          color: var(--color-primary);
          font-weight: 600;
        }
      }

      .card-icon {
        color: var(--text-secondary-color);
        flex-shrink: 0;
        transition: color 0.2s ease;
      }

      .card-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;

        .card-title {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-color);
          line-height: 1.4;
        }

        .card-time {
          font-size: 12px;
          color: var(--text-secondary-color);
          line-height: 1.4;
        }
      }

      .card-loading {
        flex-shrink: 0;
      }

      &.pending-card {
        max-width: 520px;
        cursor: default;

        &:hover {
          background: var(--background-secondary-color);
          border-color: var(--border-color);
        }
      }
    }
  }
}

.status-slide-fade-enter-active,
.status-slide-fade-leave-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
}

.status-slide-fade-enter-from {
  opacity: 0;
  transform: translateX(-10px);
}

.status-slide-fade-leave-to {
  opacity: 0;
  transform: translateX(10px);
}

.status-slide-fade-enter-to,
.status-slide-fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
