<template>
  <div class="question-panel">
    <div class="question-panel-header">
      <div class="question-panel-title">
        <span
            v-if="currentQuestionOrder !== null"
            class="question-panel-count"
        >
          {{ currentQuestionOrder }}
        </span>
        <span class="question-panel-text">
          {{ title }}
        </span>
      </div>
      <div class="question-panel-actions">
        <div
            v-if="hasQuestions"
            class="question-panel-navigation"
        >
          <n-button
              :disabled="!canPrev"
              :title="t('common.previous')"
              aria-label="previous-question"
              circle
              class="nav-button"
              size="small"
              tertiary
              @click="handlePrev"
          >
            <template #icon>
              <n-icon :component="ChevronBack" size="16"/>
            </template>
          </n-button>
          <n-button
              :disabled="!canNext"
              :title="t('common.next')"
              aria-label="next-question"
              circle
              class="nav-button"
              size="small"
              tertiary
              @click="handleNext"
          >
            <template #icon>
              <n-icon :component="ChevronForward" size="16"/>
            </template>
          </n-button>
        </div>
        <div
            v-if="hasSolutions"
            class="answer-toggle"
        >
          <span class="answer-toggle-label">
            {{ t('course.question.answers') }}
          </span>
          <n-switch
              v-model:value="showAnswers"
              size="small"
          />
        </div>
        <n-button
            :title="closeLabel"
            aria-label="close"
            circle
            class="question-panel-close"
            size="small"
            tertiary
            @click="handleClose"
        >
          <template #icon>
            <n-icon :component="CloseOutline" size="16"/>
          </template>
        </n-button>
      </div>
    </div>
    <div class="question-panel-body">
      <template v-if="hasQuestions && currentQuestion">
        <div class="question-panel-detail">
          <div class="detail-header">
            <div class="detail-meta">
              <div class="meta-item">
                <div class="meta-label">{{ t('course.question.questionType') }}</div>
                <div class="meta-value">{{ getQuestionTypeText(currentQuestion.questionType) }}</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">{{ t('course.question.difficulty') }}</div>
                <div class="meta-value">{{ getDifficultyText(currentQuestion.difficulty) }}</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">{{ t('course.tasks.points') }}</div>
                <div class="meta-value">{{ formatScore(currentQuestion.score) }}</div>
              </div>
              <div class="meta-item">
                <div class="meta-label">{{ t('course.question.estimatedTime') }}</div>
                <div class="meta-value">{{ formatEstimatedTime(currentQuestion.estimatedTime) }}</div>
              </div>
            </div>
            <div v-if="currentQuestion.tags?.length" class="detail-tags">
              <n-tag
                  v-for="tag in currentQuestion.tags"
                  :key="`${tag}`"
                  size="small"
                  type="info"
              >
                {{ tag }}
              </n-tag>
            </div>
          </div>

          <div class="detail-section">
            <div class="section-block">
              <div class="section-body">
                <MarkdownRenderer
                    :content="currentQuestion.questionContent || currentQuestion.questionTitle || ''"
                />
              </div>
            </div>

            <div
                v-if="hasOptions"
                class="section-block"
            >
              <div class="detail-options">
                <div
                    v-for="(option, optionIndex) in currentQuestion.options"
                    :key="option.id ?? `option-${optionIndex}`"
                    :class="['option-item', {correct: showAnswers && option?.isCorrect === 1}]"
                >
                  <div class="option-main">
                    <div class="option-content">
                      <span class="option-label">
                        {{ getOptionLabel(option ?? null, optionIndex) }}
                      </span>
                      <MarkdownRenderer :content="option?.optionContent || ''"/>
                    </div>
                    <div
                        v-if="showAnswers && option?.score !== null && option?.score !== undefined"
                        class="option-score"
                    >
                      {{ option.score }} 分
                    </div>
                  </div>
                  <div
                      v-if="showAnswers && option?.explanation"
                      class="option-explanation"
                  >
                    {{ option.explanation }}
                  </div>
                </div>
              </div>
            </div>

            <div
                v-if="hasVisibleAnswers"
                class="section-block"
            >
              <div class="detail-answers">
                <div
                    v-for="(answer, answerIndex) in currentQuestion.answers"
                    :key="answer.id ?? `answer-${answerIndex}`"
                    class="answer-item"
                >
                  <div class="answer-main">
                    <div class="answer-index">
                      #{{ answer.sortOrder ?? answerIndex + 1 }}
                    </div>
                    <div class="answer-content">
                      <MarkdownRenderer :content="answer.answerContent || ''"/>
                    </div>
                    <div v-if="answer.score !== null && answer.score !== undefined" class="answer-score">
                      {{ answer.score }} 分
                    </div>
                  </div>
                  <div v-if="answer.explanation" class="answer-explanation">
                    {{ answer.explanation }}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <n-empty v-else class="question-panel-empty"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, toRefs, watch} from 'vue'
import {NButton, NEmpty, NIcon, NSwitch, NTag} from 'naive-ui'
import {ChevronBack, ChevronForward, CloseOutline} from '@vicons/ionicons5'
import {useI18n} from 'vue-i18n'
import MarkdownRenderer from '@/components/common/MarkdownRenderer.vue'
import type {QuestionOptionSimpleDTO, QuestionResponseDTO} from '@/types/celestialHub/question'
import {getQuestionTypeLabel} from '@/enum/course/questionTypeEnum'
import {getQuestionBankDifficultyLabel} from '@/enum/course/questionBankDifficultyEnum'

const props = withDefaults(defineProps<{
  questions: QuestionResponseDTO[]
  title: string
  closeLabel: string
  activeIndex?: number | null
}>(), {
  questions: () => [],
  title: '',
  closeLabel: '',
  activeIndex: null
})

const {questions, title, closeLabel, activeIndex} = toRefs(props)

// 国际化
const {t, locale} = useI18n()
const isEnLocale = computed(() => locale.value === 'en-US')

const getSafeActiveIndex = () => {
  if (!questions.value?.length) {
    return null
  }
  const index = activeIndex.value === null || activeIndex.value === undefined ? 0 : activeIndex.value
  if (index < 0 || index > questions.value.length - 1) {
    return 0
  }
  return index
}

const hasQuestions = computed(() => Boolean(questions.value?.length))

const currentQuestion = computed<QuestionResponseDTO | null>(() => {
  if (!questions.value?.length) {
    return null
  }
  const index = getSafeActiveIndex()
  if (index === null) {
    return null
  }
  return questions.value[index] ?? null
})

const currentQuestionOrder = computed<number | null>(() => {
  if (!questions.value?.length) {
    return null
  }
  const index = getSafeActiveIndex()
  if (index === null) {
    return 1
  }
  return index + 1
})

const hasOptions = computed(() => Boolean(currentQuestion.value?.options?.length))
const hasAnswers = computed(() => Boolean(currentQuestion.value?.answers?.length))

const ANSWER_TOGGLE_STORAGE_KEY = 'celestialHub_question_showAnswers'

const resolveStoredShowAnswers = (): boolean => {
  if (typeof window === 'undefined') {
    return false
  }
  const storedValue = window.localStorage.getItem(ANSWER_TOGGLE_STORAGE_KEY)
  if (storedValue === null) {
    return false
  }
  return storedValue === 'true'
}

const showAnswers = ref(resolveStoredShowAnswers())

watch(showAnswers, (value) => {
  if (typeof window === 'undefined') {
    return
  }
  window.localStorage.setItem(ANSWER_TOGGLE_STORAGE_KEY, String(value))
})

const hasVisibleAnswers = computed(() => hasAnswers.value && showAnswers.value)
const hasSolutions = computed(() => hasAnswers.value || hasOptions.value)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update:activeIndex', value: number | null): void
}>()

const handleClose = () => {
  emit('close')
}

const canPrev = computed(() => {
  if (!questions.value?.length) {
    return false
  }
  const index = getSafeActiveIndex()
  return index !== null && index > 0
})

const canNext = computed(() => {
  if (!questions.value?.length) {
    return false
  }
  const index = getSafeActiveIndex()
  if (index === null) {
    return false
  }
  return index < questions.value.length - 1
})

const handlePrev = () => {
  if (!questions.value?.length) {
    return
  }
  const index = getSafeActiveIndex()
  if (index === null || index <= 0) {
    return
  }
  emit('update:activeIndex', index - 1)
}

const handleNext = () => {
  if (!questions.value?.length) {
    return
  }
  const index = getSafeActiveIndex()
  if (index === null || index >= questions.value.length - 1) {
    return
  }
  emit('update:activeIndex', index + 1)
}

const getQuestionTypeText = (type?: number | null) => {
  if (type === null || type === undefined) {
    return t('common.unknown')
  }
  return getQuestionTypeLabel(type, isEnLocale.value)
}

const getDifficultyText = (difficulty?: number | null) => {
  if (difficulty === null || difficulty === undefined || difficulty === 0) {
    return t('chat.toolsMenu.difficultyRandom')
  }
  return getQuestionBankDifficultyLabel(difficulty, isEnLocale.value)
}

const formatScore = (score?: number | null) => {
  if (score === null || score === undefined) {
    return t('course.question.score') + t('common.colon')
  }
  return `${score} ${t('common.points')}`
}

const formatEstimatedTime = (minutes?: number | null) => {
  if (minutes === null || minutes === undefined) {
    return t('course.question.unlimited')
  }
  if (minutes < 1) {
    return t('course.question.lessThanOneMinute')
  }
  return `${minutes} ${t('common.minutes')}`
}

const getOptionLabel = (option: QuestionOptionSimpleDTO | null, index: number) => {
  if (option?.optionLabel) {
    return option.optionLabel
  }
  const alphabetCode = 65 + index
  return String.fromCharCode(alphabetCode)
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles' as *;

.question-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  background: var(--background-color);

  .question-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--border-color);

    .question-panel-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-color);
      display: flex;
      align-items: center;
      gap: 10px;

      .question-panel-count {
        min-width: 28px;
        height: 28px;
        border-radius: 999px;
        border: 1px solid var(--color-primary);
        display: inline-flex;
        align-items: center;
        justify-content: center;
        line-height: 1;
        font-size: 14px;
        font-weight: 600;
        color: var(--color-primary);
        background: var(--background-tertiary-color);
      }

      .question-panel-text {
        line-height: 1.2;
      }
    }

    .question-panel-actions {
      display: flex;
      align-items: center;
      gap: 8px;

      .question-panel-navigation {
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .nav-button {
        width: 28px;
        height: 28px;
        padding: 0;
      }

      .answer-toggle {
        display: flex;
        align-items: center;
        gap: 4px;

        .answer-toggle-label {
          font-size: 12px;
          color: var(--text-secondary-color);
        }
      }
    }

    .question-panel-close {
      width: 32px;
      height: 32px;
      padding: 0;
    }
  }

  .question-panel-body {
    flex: 1;
    min-height: 0;
    padding-top: 16px;
    overflow-y: auto;
    background: var(--background-color);

    .question-panel-detail {
      flex: 1;
      min-width: 0;
      padding-right: 6px;
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .detail-header {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 16px;
      border-radius: 16px;
      background: var(--background-color);
      border: 1px solid var(--border-color);
    }

    .detail-meta {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
      gap: 12px;
    }

    .meta-item {
      display: flex;
      flex-direction: column;
      gap: 4px;

      .meta-label {
        font-size: 12px;
        color: var(--text-secondary-color);
      }

      .meta-value {
        font-size: 14px;
        font-weight: 500;
        color: var(--text-color);
      }
    }

    .detail-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .detail-section {
      padding: 16px;
      border-radius: 16px;
      border: 1px solid var(--border-color);
      background: var(--background-color);
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .section-title {
      font-size: 15px;
      font-weight: 600;
      color: var(--text-color);
    }

    .section-block {
      display: flex;
      flex-direction: column;
      gap: 12px;

      & + .section-block {
        padding-top: 12px;
        border-top: 1px dashed var(--border-color);
      }
    }

    .detail-options {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .option-item {
      border: 1px solid var(--border-color);
      border-radius: 12px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      &.correct {
        border-color: var(--success-color);
        background: rgba(54, 179, 126, 0.08);

        :deep(.markdown-body.custom-markdown) {
          background-color: transparent;
        }

        .option-label {
          color: var(--success-color);
        }
      }
    }

    .option-main {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }

    .option-content {
      display: flex;
      align-items: flex-start;
      gap: 8px;
      flex: 1;

      :deep(p) {
        margin: 0;
      }
    }

    .option-label {
      font-size: var(--markdown-font-size);
      font-weight: 600;
      color: var(--color-primary);
      min-width: 8px;
    }

    .option-score {
      font-size: 13px;
      color: var(--text-secondary-color);
      white-space: nowrap;
      margin-left: 8px;
    }

    .option-explanation {
      font-size: 13px;
      color: var(--text-secondary-color);
      line-height: 1.5;
    }

    .detail-answers {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .answer-item {
      border: 1px dashed var(--border-color);
      border-radius: 12px;
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .answer-main {
      display: flex;
      align-items: flex-start;
      justify-content: space-between;
      gap: 8px;
    }

    .answer-index {
      font-size: var(--markdown-font-size);
      font-weight: 600;
      color: var(--color-primary);
      white-space: nowrap;
      margin-right: 8px;
    }

    .answer-content {
      flex: 1;

      :deep(p) {
        margin: 0;
      }
    }

    .answer-score {
      font-size: 13px;
      color: var(--text-secondary-color);
      white-space: nowrap;
      margin-left: 8px;
    }

    .answer-explanation {
      font-size: 13px;
      color: var(--text-secondary-color);
      line-height: 1.5;
    }

    .question-panel-empty {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>

