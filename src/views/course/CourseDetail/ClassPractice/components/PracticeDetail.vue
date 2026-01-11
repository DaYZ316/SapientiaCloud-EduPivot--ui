<template>
  <div class="practice-detail">
    <n-card v-if="selectedPractice" class="practice-detail-card">
      <template #header>
        <div class="practice-detail-header">
          <div class="practice-detail-title">
            <span class="practice-number">{{ selectedPractice.publishOrder }}.</span>
            {{ selectedPractice.questionTitle || '未命名题目' }}
          </div>
          <div class="practice-time-info">
            <n-space>
              <n-text depth="3">
                <template #icon>
                  <n-icon size="16" color="#52c41a">
                    <CalendarOutline/>
                  </n-icon>
                </template>
                开始时间: {{ formatTime(selectedPractice.startTime) }}
              </n-text>
              <n-text depth="3">
                <template #icon>
                  <n-icon size="16" color="#fa541c">
                    <CalendarOutline/>
                  </n-icon>
                </template>
                截止时间: {{ formatTime(selectedPractice.endTime) }}
              </n-text>
            </n-space>
          </div>
          <n-tag
              :type="selectedPractice.isRequired === IsRequiredEnum.REQUIRED ? 'success' : 'default'"
              size="small"
              round
          >
            {{ selectedPractice.isRequired === IsRequiredEnum.REQUIRED ? '必答' : '选答' }}
          </n-tag>
        </div>
      </template>

      <div v-if="selectedClassroomInfo" class="practice-classroom-info">
        <n-text depth="3">课堂: {{ selectedClassroomInfo.courseName }}</n-text>
      </div>

      <!-- 题目详情 -->
      <div v-if="loadingQuestion" class="loading-container">
        <n-spin size="large" />
      </div>
      <div v-else-if="questionDetail" class="question-detail-content">
        <!-- 题目元信息 -->
        <div class="detail-header">
          <div class="detail-meta">
            <div class="meta-item">
              <div class="meta-label">题目类型</div>
              <div class="meta-value">{{ getQuestionTypeText(questionDetail.questionType) }}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">难度</div>
              <div class="meta-value">{{ getDifficultyText(questionDetail.difficulty) }}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">分数</div>
              <div class="meta-value">{{ formatScore(questionDetail.score) }}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">预计时间</div>
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
                    {{ option.score }} 分
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

      <!-- 旧的题目内容显示（向后兼容） -->
      <div v-else class="practice-content">
        <h3>题目内容</h3>
        <div v-if="(selectedPractice.questionVO as QuestionVO)?.questionContent" v-html="(selectedPractice.questionVO as QuestionVO).questionContent"></div>
        <div v-else class="no-content">暂无题目内容</div>
      </div>
    </n-card>

    <n-card v-else class="practice-empty-card">
      <n-empty description="请选择左侧的课堂练习查看详情"/>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import { CalendarOutline } from '@vicons/ionicons5'
import { computed, ref, watch } from 'vue'
import type { ClassroomQuestionVO } from '@/types/classroom'
import type { QuestionVO } from '@/types/course/question'
import { IsRequiredEnum } from '@/enum/classroom/isRequiredEnum'
import { getQuestionById } from '@/api/course/question'

// Props
interface Props {
  selectedPractice: ClassroomQuestionVO | null
  selectedClassroomInfo: any
}

const props = defineProps<Props>()

// 响应式数据
const fullQuestionDetail = ref<QuestionVO | null>(null)
const loadingQuestion = ref(false)

// 计算属性
const questionDetail = computed(() => {
  return fullQuestionDetail.value || (props.selectedPractice?.questionVO as QuestionVO | undefined)
})

// 获取完整题目详情
const loadFullQuestionDetail = async () => {
  if (!props.selectedPractice?.questionId) {
    fullQuestionDetail.value = null
    return
  }

  // 如果已有完整的 questionVO 数据，直接使用
  if (props.selectedPractice.questionVO &&
      props.selectedPractice.questionVO.questionContent &&
      props.selectedPractice.questionVO.questionTitle) {
    fullQuestionDetail.value = props.selectedPractice.questionVO as QuestionVO
    return
  }

  // 否则获取完整数据
  loadingQuestion.value = true
  try {
    const response = await getQuestionById(props.selectedPractice.questionId)
    if (response.success || response.code === 200) {
      fullQuestionDetail.value = response.data
    } else {
      fullQuestionDetail.value = props.selectedPractice.questionVO as QuestionVO || null
    }
  } catch (error) {
    console.error('获取题目详情失败:', error)
    fullQuestionDetail.value = props.selectedPractice.questionVO as QuestionVO || null
  } finally {
    loadingQuestion.value = false
  }
}

// 监听 selectedPractice 变化
watch(() => props.selectedPractice, (newPractice) => {
  if (newPractice) {
    loadFullQuestionDetail()
  } else {
    fullQuestionDetail.value = null
  }
}, { immediate: true })

// 方法
const formatTime = (time: string) => {
  if (!time) return '未设置'
  try {
    return new Date(time).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return time
  }
}

// 获取题目类型文本
const getQuestionTypeText = (type?: number | null) => {
  if (type === null || type === undefined) {
    return '未知'
  }
  const typeMap = {
    0: '单选题',
    1: '多选题',
    2: '判断题',
    3: '填空题',
    4: '简答题'
  }
  return typeMap[type as keyof typeof typeMap] || '未知'
}

// 获取难度文本
const getDifficultyText = (difficulty?: number | null) => {
  if (difficulty === null || difficulty === undefined || difficulty === 0) {
    return '未知'
  }
  const difficultyMap = {
    1: '简单',
    2: '中等',
    3: '困难'
  }
  return difficultyMap[difficulty as keyof typeof difficultyMap] || '未知'
}

const formatScore = (score?: number | null) => {
  if (score === null || score === undefined) {
    return '分数: '
  }
  return `${score} 分`
}

const formatEstimatedTime = (time?: number | null) => {
  if (typeof time !== 'number' || time <= 0) {
    return '不限时'
  }
  return `${time} 分钟`
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles' as *;

.practice-detail {
  background-color: var(--background-color);
  max-height: 100vh;

  .practice-detail-card {
    background-color: var(--background-color);
    height: 100%;
    max-height: 100%;
    overflow: hidden;
    border-radius: 12px;
    border: 1px solid var(--border-color);
    box-shadow: none;

    :deep(.n-card__content) {
      height: 100%;
      overflow-y: auto;
      padding: 0 20px 20px 20px;

      &::-webkit-scrollbar {
        width: 4px;
      }

      &::-webkit-scrollbar-track {
        background: transparent;
      }

      &::-webkit-scrollbar-thumb {
        background: var(--border-color);
        border-radius: 2px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: var(--text-secondary-color);
      }
    }

    :deep(.n-card__header) {
      padding: 20px 20px 0 20px;
      border-bottom: none;
      background: transparent;
    }
  }

  .practice-number {
    color: var(--color-primary);
    margin-right: 8px;
    font-weight: 700;
  }

  .practice-detail-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;

    .practice-detail-title {
      font-size: 20px;
      font-weight: 600;
      color: var(--text-color);
      margin: 0;
      flex: 1;
    }
  }

  .practice-classroom-info {
    margin: 0;
    color: var(--text-secondary-color);
    font-size: 14px;
  }

  .practice-time-info {
    margin: 12px 0;

    :deep(.n-text) {
      font-size: 14px;
      color: var(--text-secondary-color);
    }
  }

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

    .detail-title {
      h2 {
        margin: 0;
        font-size: 20px;
        font-weight: 600;
        color: var(--text-color);
      }
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

  .practice-content {
    padding: 16px;
    border-radius: 16px;
    border: 1px solid var(--border-color);
    background: var(--background-color);

    h3 {
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--text-color);
    }

    .no-content {
      color: var(--text-secondary-color);
      text-align: center;
      padding: 40px 20px;
    }
  }

  .practice-empty-card {
    background-color: var(--background-color);
    border: none;
    box-shadow: none;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    :deep(.n-card__content) {
      padding: 0 40px 40px 40px;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .practice-detail {
    .practice-detail-card {
      :deep(.n-card__content) {
        padding: 16px;
      }

      :deep(.n-card__header) {
        padding: 16px 16px 0 16px;
      }
    }

    .practice-detail-header {
      flex-direction: column;
      align-items: flex-start;
      gap: 12px;

      .practice-detail-title {
        font-size: 18px;
      }
    }

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
        .detail-content {
          font-size: 15px;
        }
      }
    }

    .practice-content {
      padding: 12px;
    }
  }
}

@media (max-width: 480px) {
  .practice-detail {
    .practice-detail-card {
      :deep(.n-card__content) {
        padding: 12px;
      }

      :deep(.n-card__header) {
        padding: 12px 12px 0 12px;
      }
    }

    .practice-detail-header {
      .practice-detail-title {
        font-size: 16px;
      }
    }

    .detail-meta {
      grid-template-columns: 1fr !important;
    }

    .meta-item {
      padding: 10px !important;
    }
  }
}
</style>
