<template>
  <div :class="['question-panel', { 'is-exporting': isExporting }]">
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
              :disabled="!canPrev || isExporting"
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
              :disabled="!canNext || isExporting"
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
              :disabled="isExporting"
              size="small"
          />
        </div>
        <div
            v-if="isPaperMode"
            class="answer-toggle"
        >
          <span class="answer-toggle-label">
            {{ t('chat.toolsMenu.exportWithAnswers') }}
          </span>
          <n-switch
              v-model:value="exportIncludeAnswers"
              :disabled="isExporting"
              size="small"
          />
        </div>
        <n-button
            v-if="isPaperMode"
            :disabled="isExporting"
            :loading="exportingPdf"
            class="export-button"
            size="small"
            tertiary
            @click="handleExportPdf"
        >
          {{ t('chat.toolsMenu.exportPdf') }}
        </n-button>
        <n-button
            v-if="isPaperMode"
            :disabled="isExporting"
            :loading="exportingWord"
            class="export-button"
            size="small"
            tertiary
            @click="handleExportWord"
        >
          {{ t('chat.toolsMenu.exportWord') }}
        </n-button>
        <n-button
            v-if="canAddToQuestionBank"
            :disabled="isExporting"
            :title="t('course.question.addToQuestionBank')"
            aria-label="add-to-question-bank"
            class="add-to-bank-button"
            size="small"
            type="primary"
            @click="handleAddToQuestionBank"
        >
          {{ t('course.question.addToQuestionBank') }}
        </n-button>
        <n-button
            :disabled="isExporting"
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
                    <QuestionExplanationRenderer
                        :content="option.explanation"
                        variant="explanation"
                    />
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
                      <QuestionExplanationRenderer
                          :content="answer.answerContent"
                          :auto-wrap-bare-latex="isCurrentQuestionFillBlank"
                          variant="answer"
                      />
                    </div>
                    <div v-if="answer.score !== null && answer.score !== undefined" class="answer-score">
                      {{ answer.score }} 分
                    </div>
                  </div>
                  <div v-if="answer.explanation" class="answer-explanation">
                    <QuestionExplanationRenderer
                        :content="answer.explanation"
                        variant="explanation"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
      <n-empty v-else class="question-panel-empty"/>
    </div>
    <div v-if="isExporting" class="export-overlay" aria-live="polite" aria-busy="true">
      <div class="export-overlay-card">
        <n-spin size="large"/>
        <div class="export-overlay-title">{{ exportingStatusText }}</div>
        <div class="export-overlay-description">导出期间已锁定当前面板，避免重复操作和状态变更。</div>
        <div class="export-overlay-progress" role="presentation">
          <span></span>
        </div>
      </div>
    </div>
    <AddToQuestionBankDialog
        v-model:show="showAddToBankDialog"
        :question="currentQuestion"
        @success="handleAddToBankSuccess"
    />
  </div>
</template>

<script lang="ts" setup>
import {computed, onBeforeUnmount, ref, toRefs, watch} from 'vue'
import {NButton, NEmpty, NIcon, NSpin, NSwitch, NTag, useMessage} from 'naive-ui'
import {ChevronBack, ChevronForward, CloseOutline} from '@vicons/ionicons5'
import {useI18n} from 'vue-i18n'
import {useUserStore} from '@/store'
import {useQuestionAnswerToggle} from '@/composables/useQuestionAnswerToggle'
import {exportPaperPdf, exportPaperWord} from '@/api/celestialHub/question'
import MarkdownRenderer from '@/components/common/MarkdownRenderer.vue'
import QuestionExplanationRenderer from '@/components/common/QuestionExplanationRenderer.vue'
import AddToQuestionBankDialog from './AddToQuestionBankDialog.vue'
import type {
  QuestionGenerationMode,
  QuestionOptionSimpleDTO,
  QuestionPaperExportRequestDTO,
  QuestionResponseDTO
} from '@/types/celestialHub/question'
import {getQuestionTypeLabel, QuestionTypeEnum} from '@/enum/course/questionTypeEnum'
import {getQuestionBankDifficultyLabel} from '@/enum/course/questionBankDifficultyEnum'

const props = withDefaults(defineProps<{
  questions: QuestionResponseDTO[]
  title: string
  closeLabel: string
  activeIndex?: number | null
  mode?: QuestionGenerationMode | null
}>(), {
  questions: () => [],
  title: '',
  closeLabel: '',
  activeIndex: null,
  mode: 'question'
})

const {questions, title, closeLabel, activeIndex, mode} = toRefs(props)

// 国际化
const {t, locale} = useI18n()
const message = useMessage()
const isEnLocale = computed(() => locale.value === 'en-US')

// 用户角色
const userStore = useUserStore()
const canAddToQuestionBank = computed(() => {
  return userStore.hasRole('ADMIN') || userStore.hasRole('TEACHER')
})

// 加入题库对话框
const showAddToBankDialog = ref(false)
const exportingPdf = ref(false)
const exportingWord = ref(false)
const exportIncludeAnswers = ref(false)
const isExporting = computed(() => exportingPdf.value || exportingWord.value)
const exportingStatusText = computed(() => {
  if (exportingPdf.value) {
    return `正在导出 ${t('chat.toolsMenu.exportPdf')}`
  }
  if (exportingWord.value) {
    return `正在导出 ${t('chat.toolsMenu.exportWord')}`
  }
  return '正在导出'
})

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
const isPaperMode = computed(() => mode.value === 'paper' && hasQuestions.value)

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

const isCurrentQuestionFillBlank = computed(() =>
    Number(currentQuestion.value?.questionType) === QuestionTypeEnum.FILL_BLANK
)

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

const {showAnswers} = useQuestionAnswerToggle()

const hasVisibleAnswers = computed(() => hasAnswers.value && showAnswers.value)
const hasSolutions = computed(() => hasAnswers.value || hasOptions.value)

const emit = defineEmits<{
  (e: 'close'): void
  (e: 'update:activeIndex', value: number | null): void
  (e: 'export-state-change', payload: { exporting: boolean; text: string }): void
}>()

watch(
    [isExporting, exportingStatusText],
    ([exporting, statusText]) => {
      emit('export-state-change', {
        exporting,
        text: exporting ? statusText : ''
      })
    },
    {immediate: true}
)

onBeforeUnmount(() => {
  emit('export-state-change', {
    exporting: false,
    text: ''
  })
})

const handleClose = () => {
  if (isExporting.value) {
    return
  }
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
  if (isExporting.value || !questions.value?.length) {
    return
  }
  const index = getSafeActiveIndex()
  if (index === null || index <= 0) {
    return
  }
  emit('update:activeIndex', index - 1)
}

const handleNext = () => {
  if (isExporting.value || !questions.value?.length) {
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

const handleAddToQuestionBank = () => {
  if (isExporting.value) {
    return
  }
  showAddToBankDialog.value = true
}

const handleAddToBankSuccess = () => {
  showAddToBankDialog.value = false
}

const buildPaperExportRequest = (): QuestionPaperExportRequestDTO => {
  return {
    paperName: title.value?.trim() || t('chat.toolsMenu.paperTitleFallback'),
    questions: (questions.value ?? []).slice(),
    includeAnswers: exportIncludeAnswers.value
  }
}

const triggerDownload = (blob: Blob, fileName: string) => {
  const objectUrl = window.URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = objectUrl
  anchor.download = fileName
  document.body.appendChild(anchor)
  anchor.click()
  anchor.remove()
  window.URL.revokeObjectURL(objectUrl)
}

const handleExportPdf = async () => {
  if (!isPaperMode.value || isExporting.value) {
    return
  }

  exportingPdf.value = true
  try {
    const {blob, fileName} = await exportPaperPdf(buildPaperExportRequest())
    triggerDownload(blob, fileName)
  } catch (error) {
    message.error(
        error instanceof Error && error.message
            ? error.message
            : t('chat.toolsMenu.exportFailed')
    )
  } finally {
    exportingPdf.value = false
  }
}

const handleExportWord = async () => {
  if (!isPaperMode.value || isExporting.value) {
    return
  }

  exportingWord.value = true
  try {
    const {blob, fileName} = await exportPaperWord(buildPaperExportRequest())
    triggerDownload(blob, fileName)
  } catch (error) {
    message.error(
        error instanceof Error && error.message
            ? error.message
            : t('chat.toolsMenu.exportFailed')
    )
  } finally {
    exportingWord.value = false
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles' as *;

.question-panel {
  position: relative;
  display: flex;
  flex-direction: column;
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  background: var(--background-color);

  &.is-exporting {
    .question-panel-body {
      overflow: hidden;
    }
  }

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
      flex: 1;
      min-width: 0;

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
        flex-shrink: 0;
      }

      .question-panel-text {
        line-height: 1.2;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 1;
        min-width: 0;
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

      .add-to-bank-button {
        height: 28px;
        padding: 0 12px;
        font-size: 12px;
      }

      .export-button {
        height: 28px;
        padding: 0 12px;
        font-size: 12px;
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
      gap: 16px;
      padding: 20px;
      border-radius: 16px;
      background: var(--background-color);
      border: 1px solid var(--border-color);
    }

    .detail-meta {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
      gap: 16px;
    }

    .meta-item {
      display: flex;
      flex-direction: column;
      gap: 6px;
      align-items: center;
      text-align: center;
      padding: 12px;
      border-radius: 8px;
      background: var(--background-secondary-color);
      transition: background-color 0.2s ease;
      user-select: none;

      &:hover {
        background: color-mix(in srgb, var(--color-primary) 5%, var(--background-secondary-color));
      }

      .meta-label {
        font-size: 12px;
        color: var(--text-secondary-color);
        font-weight: 500;
        letter-spacing: 0.3px;
      }

      .meta-value {
        font-size: 15px;
        font-weight: 600;
        color: var(--text-color);
        line-height: 1.4;
      }
    }

    .detail-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      padding-top: 4px;
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

        .option-explanation {
          :deep(.question-explanation-renderer--explanation) {
            --color-primary: var(--success-color);
            --color-primary-dark: color-mix(in srgb, var(--success-color) 78%, var(--text-color));
            --markdown-link-color: color-mix(in srgb, var(--success-color) 82%, var(--text-color));
            --markdown-link-hover-color: var(--success-color);
            --question-renderer-text-color: color-mix(in srgb, var(--text-color) 78%, var(--success-color) 22%);
            --question-renderer-bg: color-mix(in srgb, var(--background-secondary-color) 74%, var(--success-color) 10%);
            --question-renderer-border-color: color-mix(in srgb, var(--success-color) 24%, var(--border-color));
            --question-renderer-katex-color: color-mix(in srgb, var(--text-color) 70%, var(--success-color) 30%);
          }
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
      margin-top: 2px;
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
      margin-top: 2px;
    }

    .question-panel-empty {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .export-overlay {
    position: absolute;
    inset: 0;
    z-index: 24;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: color-mix(in srgb, var(--background-color) 76%, transparent);
    backdrop-filter: blur(8px);
  }

  .export-overlay-card {
    width: min(360px, 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
    padding: 24px 22px 20px;
    border-radius: 20px;
    border: 1px solid color-mix(in srgb, var(--color-primary) 18%, var(--border-color));
    background: color-mix(in srgb, var(--background-color) 92%, var(--background-secondary-color));
    box-shadow: 0 20px 48px color-mix(in srgb, var(--shadow-secondary-color) 72%, transparent);
    text-align: center;
  }

  .export-overlay-title {
    color: var(--text-color);
    font-size: 16px;
    font-weight: 700;
    letter-spacing: 0.02em;
  }

  .export-overlay-description {
    color: var(--text-secondary-color);
    font-size: 13px;
    line-height: 1.6;
  }

  .export-overlay-progress {
    width: 100%;
    height: 6px;
    border-radius: 999px;
    overflow: hidden;
    background: color-mix(in srgb, var(--color-primary) 12%, var(--background-secondary-color));

    span {
      display: block;
      width: 42%;
      height: 100%;
      border-radius: inherit;
      background: linear-gradient(
        90deg,
        color-mix(in srgb, var(--color-primary-dark) 92%, transparent),
        color-mix(in srgb, var(--color-primary-light) 88%, transparent)
      );
      animation: export-progress-slide 1.15s ease-in-out infinite;
    }
  }
}

@keyframes export-progress-slide {
  0% {
    transform: translateX(-115%);
  }
  100% {
    transform: translateX(250%);
  }
}
</style>

