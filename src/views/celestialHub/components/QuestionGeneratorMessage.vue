<template>
  <div
      :class="['question-generator-message', { 'is-active': isActive }]"
      :data-message-id="message.id || null"
  >
    <div class="message-text">
      <component
          :is="canViewTrace ? 'button' : 'div'"
          v-if="isPending"
          :class="['question-card', 'pending-card', { 'is-clickable': canViewTrace }]"
          :disabled="canViewTrace ? undefined : true"
          :tabindex="canViewTrace ? 0 : undefined"
          type="button"
          @click.stop="handlePendingCardClick"
          @mousedown.stop
          @keydown.enter.prevent="handlePendingCardClick"
          @keydown.space.prevent="handlePendingCardClick"
      >
        <div class="card-icon-shell is-loading" aria-hidden="true">
          <n-icon :component="DocumentTextOutline" class="card-icon" size="20"/>
          <span class="card-icon-loader"></span>
        </div>
        <div class="card-content">
          <transition mode="out-in" name="status-slide-fade">
            <div :key="pendingTitle" class="card-title">{{ pendingTitle }}</div>
          </transition>
          <div v-if="showPendingProgress" class="card-progress">
            <n-progress
                :color="'var(--color-primary)'"
                :percentage="pendingProgressPercentage"
                :show-indicator="false"
                class="card-progress-bar"
                type="line"
            />
          </div>
          <div v-else-if="pendingDescription" class="card-time">{{ pendingDescription }}</div>
        </div>
      </component>

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
import {NIcon, NProgress} from 'naive-ui'
import {useI18n} from 'vue-i18n'
import {DocumentTextOutline} from '@vicons/ionicons5'
import type {ChatMessage} from '@/types/celestialHub/chatMessage'
import type {QuestionGenerationMode, QuestionResponseDTO} from '@/types/celestialHub/question'
import {QuestionGenerationStageEnum} from '@/types/celestialHub/question'
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
  (e: 'view-trace', payload: {
    taskId: string | null
    requestId?: string | null
    sessionId?: string | null
    panelTitle?: string | null
    mode?: QuestionGenerationMode | null
  }): void
}>()

const {t, locale} = useI18n()

const generationMode = computed<QuestionGenerationMode>(() => {
  const metadata = props.message.metadata
  const mode = metadata?.generationMode
  if (mode === 'paper') {
    return 'paper'
  }
  if (
      metadata?.questionShowStageDetails === true
      || metadata?.questionCanViewTrace === true
      || (typeof metadata?.paperName === 'string' && metadata.paperName.trim())
  ) {
    return 'paper'
  }
  return 'question'
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

const pendingStage = computed(() => {
  const value = props.message.metadata?.questionStage
  if (typeof value === 'string' && value.trim()) {
    return value.trim()
  }
  return null
})

const showStageDetails = computed(() => {
  const value = props.message.metadata?.questionShowStageDetails
  if (typeof value === 'boolean') {
    return value
  }
  return generationMode.value === 'paper'
})

const canViewTrace = computed(() => {
  if (!isPending.value) {
    return false
  }
  if (generationMode.value === 'paper') {
    return true
  }
  const value = props.message.metadata?.questionCanViewTrace
  if (typeof value === 'boolean') {
    return value
  }
  return showStageDetails.value
})

const pendingTitle = computed(() => {
  if (showStageDetails.value && pendingStepMessage.value) {
    return pendingStepMessage.value
  }
  if (props.message.content) {
    return props.message.content
  }
  return generationMode.value === 'paper'
      ? t('chat.toolsMenu.generatingPaperTitle')
      : t('chat.toolsMenu.generatingTitle')
})

const pendingDescription = computed(() => {
  if (!canViewTrace.value) {
    return null
  }
  return t('chat.toolsMenu.generationTraceHint')
})

const showPendingProgress = computed(() => {
  return canViewTrace.value && generationMode.value === 'paper'
})

const stageProgressMap: Record<string, number> = {
  [QuestionGenerationStageEnum.RECEIVED]: 10,
  [QuestionGenerationStageEnum.CONTEXT_READY]: 22,
  [QuestionGenerationStageEnum.PLANNED]: 36,
  [QuestionGenerationStageEnum.GENERATED]: 62,
  [QuestionGenerationStageEnum.VALIDATED]: 78,
  [QuestionGenerationStageEnum.REPAIRED]: 88,
  [QuestionGenerationStageEnum.ASSEMBLED]: 96,
  [QuestionGenerationStageEnum.RESPONDED]: 100,
  [QuestionGenerationStageEnum.FAILED]: 100
}

const pendingProgressPercentage = computed(() => {
  if (!showPendingProgress.value) {
    return 0
  }

  const stage = pendingStage.value
  if (stage && stageProgressMap[stage] !== undefined) {
    return stageProgressMap[stage]
  }

  const traceEntryCount = props.message.metadata?.questionTraceEntryCount
  if (typeof traceEntryCount === 'number' && traceEntryCount > 0) {
    return Math.min(92, 12 + traceEntryCount * 8)
  }

  return 12
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
    return new Intl.DateTimeFormat(locale.value, {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    }).format(date)
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

const handlePendingCardClick = () => {
  if (!canViewTrace.value) {
    return
  }
  emit('view-trace', {
    taskId: props.message.id ?? null,
    requestId: props.message.requestId ?? null,
    sessionId: props.message.sessionId ?? null,
    panelTitle: paperName.value || t('chat.toolsMenu.generationTraceTitle'),
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
      width: 100%;
      text-align: left;
      font: inherit;

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

      .card-icon-shell {
        position: relative;
        width: 20px;
        height: 20px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        flex-shrink: 0;

        .card-icon-loader {
          position: absolute;
          inset: -4px;
          border: 2px solid transparent;
          border-top-color: var(--color-primary);
          border-radius: 999px;
          animation: card-icon-loader-spin 0.9s linear infinite;
          pointer-events: none;
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

      &.pending-card {
        max-width: 520px;
        cursor: default;
        appearance: none;
        outline: none;

        &:hover {
          background: var(--background-secondary-color);
          border-color: var(--border-color);
        }

        &.is-clickable {
          cursor: pointer;

          &:hover {
            background: var(--background-tertiary-color);
            border-color: var(--color-primary);
          }

          &:focus-visible {
            border-color: var(--color-primary);
            box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 16%, transparent);
          }
        }

        .card-progress {
          display: flex;
          flex-direction: column;
          margin-top: 2px;
          pointer-events: none;

          .card-progress-bar {
            :deep(.n-progress-rail) {
              background: color-mix(in srgb, var(--color-primary) 12%, var(--background-tertiary-color));
            }

            :deep(.n-progress-rail__fill) {
              background: var(--color-primary);
              box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-primary) 12%, transparent);
            }

            :deep(.n-progress-content) {
              margin: 0;
            }

            :deep(.n-progress-rail) {
              height: 7px;
              border-radius: 999px;
            }

            :deep(.n-progress-rail__fill) {
              border-radius: 999px;
            }
          }
        }
      }
    }
  }
}

.status-slide-fade-enter-active,
.status-slide-fade-leave-active {
  transition: opacity 0.28s ease, transform 0.28s ease;
}

@keyframes card-icon-loader-spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
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
