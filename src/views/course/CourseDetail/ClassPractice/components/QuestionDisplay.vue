<template>
  <div v-if="questionDetail" class="question-display">
    <!-- 题目详情 -->
    <div v-if="loadingQuestion" class="loading-container">
      <n-spin size="large" />
    </div>
    <div v-else class="question-detail-content">
      <!-- 题目元信息 -->
      <div class="detail-header">
        <div class="detail-meta">
          <div class="meta-item">
            <div class="meta-label">{{ t('course.classPractice.questionType') }}</div>
            <div class="meta-value">{{ getQuestionTypeText(questionDetail.questionType) }}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">{{ t('course.classPractice.difficulty') }}</div>
            <div class="meta-value">{{ getDifficultyText(questionDetail.difficulty) }}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">{{ t('course.classPractice.score') }}</div>
            <div class="meta-value">{{ formatScore(questionDetail.score) }}</div>
          </div>
          <div class="meta-item">
            <div class="meta-label">{{ t('course.classPractice.estimatedTime') }}</div>
            <div class="meta-value">{{ formatEstimatedTime(questionDetail.estimatedTime) }}</div>
          </div>
        </div>
        <div v-if="questionDetail.tags && questionDetail.tags.length" class="detail-tags">
          <n-tag
              v-for="tag in questionDetail.tags"
              :key="tag"
              size="small"
              type="info"
          >
            {{ tag }}
          </n-tag>
        </div>
      </div>

      <!-- 题目内容 -->
      <div class="detail-section">
        <div class="section-block">
          <div class="section-body">
            <!-- 标题已移除，只展示题目内容 -->
            <div class="detail-content" v-html="questionDetail.questionContent"></div>
          </div>
        </div>

        <!-- 选项 -->
        <div
            v-if="questionDetail.options && questionDetail.options.length > 0"
            class="section-block"
        >
          <div class="detail-options">
            <div
                v-for="(option, optionIndex) in questionDetail.options"
                :key="option.id ?? `option-${optionIndex}`"
                :class="['option-item', {correct: option.isCorrect === 1}]"
            >
              <div class="option-main">
                <div class="option-content">
                  <span class="option-label">
                    {{ option.optionLabel || String.fromCharCode(65 + optionIndex) }}
                  </span>
                  <div v-html="option.optionContent"></div>
                </div>
                <div
                    v-if="option.score !== null && option.score !== undefined"
                    class="option-score"
                >
                  {{ option.score }} {{ t('course.classPractice.pointUnit') }}
                </div>
              </div>
              <div
                  v-if="option.explanation"
                  class="option-explanation"
              >
                {{ option.explanation }}
              </div>
            </div>
          </div>
        </div>

        <!-- 答案 -->
        <div
            v-if="questionDetail.answers && questionDetail.answers.length > 0"
            class="section-block"
        >
          <div class="detail-answers">
            <div
                v-for="(answer, answerIndex) in questionDetail.answers"
                :key="answer.id ?? `answer-${answerIndex}`"
                class="answer-item"
            >
              <div class="answer-main">
                <div class="answer-index">
                  #{{ answer.sortOrder ?? answerIndex + 1 }}
                </div>
                <div class="answer-content">
                  <div v-if="answer.answerContent" v-html="answer.answerContent"></div>
                </div>
                <div v-if="answer.score !== null && answer.score !== undefined" class="answer-score">
                  {{ answer.score }} {{ t('course.classPractice.pointUnit') }}
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
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { QuestionVO } from '@/types/course/question'
import { getQuestionBankDifficultyLabel } from '@/enum/course/questionBankDifficultyEnum'
import { getQuestionTypeLabel } from '@/enum/course/questionTypeEnum'

// Props
interface Props {
  questionDetail: QuestionVO | null | undefined
  loadingQuestion?: boolean
}

withDefaults(defineProps<Props>(), {
  loadingQuestion: false
})

// 国际化
const { t: t } = useI18n()
const isEn = computed(() => false) // 暂时设为false，后续可根据需要调整

// 获取题目类型文本
const getQuestionTypeText = (type?: number | null) => {
  if (type === null || type === undefined) {
    return t('common.unknown')
  }
  return getQuestionTypeLabel(type, isEn.value)
}

// 获取难度文本
const getDifficultyText = (difficulty?: number | null) => {
  if (difficulty === null || difficulty === undefined || difficulty === 0) {
    return t('common.unknown')
  }
  return getQuestionBankDifficultyLabel(difficulty, isEn.value)
}

const formatScore = (score?: number | null) => {
  if (score === null || score === undefined) {
    return t('course.classPractice.score') + ': '
  }
  return `${score} ${t('course.classPractice.pointUnit')}`
}

const formatEstimatedTime = (time?: number | null) => {
  if (typeof time !== 'number' || time <= 0) {
    return t('course.classPractice.unlimitedTime')
  }
  return `${time} ${t('course.classPractice.minuteUnit')}`
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles' as *;

.question-display {
  .loading-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
  }

  .question-detail-content {
    .detail-header {
      display: flex;
      flex-direction: column;
      gap: 16px;
      padding: 20px;
      border-radius: 16px;
      background: var(--background-color);
      border: 1px solid var(--border-color);
      margin-bottom: 16px;
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
      margin-bottom: 16px;
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

    .section-body {
      line-height: 1.7;
      color: var(--text-color);
    }

    .detail-content {
      line-height: 1.7;
      color: var(--text-color);
      font-size: 18px;
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
        background: color-mix(in srgb, var(--success-color) 8%, var(--background-color));

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
  }
}

// 响应式设计
@media (max-width: 768px) {
  .question-display {
    .detail-meta {
      grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)) !important;
      gap: 12px !important;
    }

    .question-detail-content {
      .detail-header {
        padding: 16px;
      }

      .detail-section {
        padding: 12px;
        .detail-content {
          font-size: 16px;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .question-display {
    .detail-meta {
      grid-template-columns: 1fr !important;
    }

    .meta-item {
      padding: 10px !important;
    }
  }
}
</style>
