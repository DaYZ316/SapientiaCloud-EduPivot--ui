<template>
  <div class="practice-detail">
    <n-card v-if="selectedPractice" class="practice-detail-card">
      <template #header>
        <div class="practice-detail-header">
          <div class="practice-detail-title">
            <span class="practice-number">{{ selectedPractice.publishOrder }}.</span>
            {{ selectedPractice.questionTitle || $t('course.classPractice.unnamedQuestion') }}
          </div>
          <div class="practice-time-info">
            <n-space>
              <n-text depth="3">
                <template #icon>
                  <n-icon size="16" color="#52c41a">
                    <CalendarOutline/>
                  </n-icon>
                </template>
                {{ $t('course.classPractice.startTime') }}: {{ formatTime(selectedPractice.startTime) }}
              </n-text>
              <n-text depth="3">
                <template #icon>
                  <n-icon size="16" color="#fa541c">
                    <CalendarOutline/>
                  </n-icon>
                </template>
                {{ $t('course.classPractice.endTime') }}: {{ formatTime(selectedPractice.endTime) }}
              </n-text>
            </n-space>
          </div>
          <n-tag
              :type="selectedPractice.isRequired === IsRequiredEnum.REQUIRED ? 'success' : 'default'"
              size="small"
              round
          >
            {{ getIsRequiredLabel(selectedPractice.isRequired, isEn) }}
          </n-tag>
        </div>
      </template>

      <div v-if="selectedClassroomInfo" class="practice-classroom-info">
        <n-text depth="3">{{ $t('course.classPractice.classroom') }}: {{ selectedClassroomInfo.courseName }}</n-text>
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
              <div class="meta-label">{{ $t('course.classPractice.questionType') }}</div>
              <div class="meta-value">{{ getQuestionTypeText(questionDetail.questionType) }}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">{{ $t('course.classPractice.difficulty') }}</div>
              <div class="meta-value">{{ getDifficultyText(questionDetail.difficulty) }}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">{{ $t('course.classPractice.score') }}</div>
              <div class="meta-value">{{ formatScore(questionDetail.score) }}</div>
            </div>
            <div class="meta-item">
              <div class="meta-label">{{ $t('course.classPractice.estimatedTime') }}</div>
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
                    {{ option.score }} {{ $t('course.classPractice.pointUnit') }}
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
                    {{ answer.score }} {{ $t('course.classPractice.pointUnit') }}
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

      <!-- 练习统计图表 -->
      <div class="practice-statistics-section">
        <PracticeStatisticsChart
          :statistics="practiceStatistics"
          :loading="loadingStatistics"
          @filter-change="handleFilterChange"
        />
      </div>

      <!-- 学生提交记录 -->
      <div class="student-submissions-section">
        <n-card class="submissions-table-card" :bordered="false" embedded>
          <template #header>
            <div class="section-title">{{ $t('course.classPractice.studentAnswers') }}</div>
          </template>
          <PageTable
            ref="pageTableRef"
            :columns="submissionColumns"
            :api-fn="fetchPracticeSubmissions"
            :query-params="queryParams"
            :auto-load="autoLoadTable"
            :auto-search="true"
            :show-size-picker="false"
            :show-quick-jumper="false"
            :page-sizes="[10, 20, 50]"
            size="small"
          />
        </n-card>
      </div>
    </n-card>

    <n-card v-else class="practice-empty-card">
      <n-empty :description="$t('course.classPractice.selectPractice')"/>
    </n-card>

    <!-- 答案详情弹窗 -->
    <AnswerDetailModal
      v-model:show="showAnswerDetail"
      :answer-detail="currentAnswerDetail"
      :question-score="questionDetail?.score"
      :answer-list="answerList"
      :current-index="currentAnswerIndex"
      @graded="handleAnswerGraded"
      @navigate="handleAnswerNavigate"
    />
  </div>
</template>

<script lang="ts" setup>
import { CalendarOutline } from '@vicons/ionicons5'
import { computed, ref, watch, h } from 'vue'
import { useI18n } from 'vue-i18n'
import type { ClassroomQuestionVO } from '@/types/classroom'
import type { QuestionVO } from '@/types/course/question'
import { IsRequiredEnum } from '@/enum/classroom/isRequiredEnum'
import { getQuestionById } from '@/api/course/question'
import { listPractice, getDefaultPracticeQuery } from '@/api/student/practice'
import { getAnswerStatusLabel, AnswerStatusEnum } from '@/enum/student/answerStatusEnum'
import { getPracticeStatistics } from '@/api/student/practice'
import { getQuestionBankDifficultyLabel } from '@/enum/course/questionBankDifficultyEnum'
import { getIsRequiredLabel } from '@/enum/classroom/isRequiredEnum'
import { getQuestionTypeLabel } from '@/enum/course/questionTypeEnum'
import PageTable from '@/components/common/PageTable.vue'
import PracticeStatisticsChart from './PracticeStatisticsChart.vue'
import AnswerDetailModal from './AnswerDetailModal.vue'

// Props
interface Props {
  selectedPractice: ClassroomQuestionVO | null
  selectedClassroomInfo: any
}

const props = defineProps<Props>()

// 国际化
const { locale, t: $t } = useI18n()
const isEn = computed(() => locale.value === 'en-US')

// 响应式数据
const fullQuestionDetail = ref<QuestionVO | null>(null)
const loadingQuestion = ref(false)
const practiceStatistics = ref<any>(null)
const loadingStatistics = ref(false)
const currentFilter = ref<number | null>(null)

// PageTable引用
const pageTableRef = ref()


// 答案详情弹窗
const showAnswerDetail = ref(false)
const currentAnswerDetail = ref<any>(null)
const currentAnswerIndex = ref<number>(-1)
const answerList = ref<any[]>([])

// 构建查询参数
const queryParams = computed(() => {
  const params = getDefaultPracticeQuery()
  if (props.selectedPractice) {
    params.practiceId = props.selectedPractice.id
    params.classroomId = props.selectedPractice.classroomId
    params.courseId = props.selectedPractice.courseId
    params.questionId = props.selectedPractice.questionId
  }
  if (currentFilter.value !== null) {
    params.isCorrect = currentFilter.value
  }
  return params
})

// 包装 API 函数以匹配 PageTable 期望的类型
const fetchPracticeSubmissions = async (params: any) => {
  return await listPractice(params) as any
}

// 处理统计图表过滤器变化
const handleFilterChange = (isCorrect: number | null) => {
  currentFilter.value = isCorrect
}


// 表格列定义
const submissionColumns = [
  {
    title: $t('course.classPractice.tableColumns.studentName'),
    key: 'studentRealName',
    width: 120,
    render: (row: any) => h('span', {
      style: { color: 'var(--text-color)' }
    }, row.studentRealName || '-')
  },
  {
    title: $t('course.classPractice.tableColumns.score'),
    key: 'score',
    width: 80,
    render: (row: any) => {
      if (row.score !== null && row.score !== undefined) {
        return h('span', {}, [
          h('span', {
            style: {
              color: 'var(--color-primary)',
              fontSize: '16px',
              fontWeight: '700'
             }
          }, row.score.toString()),
          h('span', {
            style: { color: 'var(--text-color)' }
          }, $t('course.classPractice.pointUnit'))
        ])
      }
      return h('span', {
        style: { color: 'var(--text-secondary-color)' }
      }, '-')
    }
  },
  {
    title: $t('course.classPractice.tableColumns.status'),
    key: 'isCorrect',
    width: 80,
    render: (row: any) => {
      const statusType = getStatusType(row.isCorrect)
      const statusLabel = getStatusLabel(row.isCorrect)

      return h('n-tag', {
        type: statusType,
        size: 'small',
        style: {
          color: getStatusColor(statusType),
          backgroundColor: 'transparent'
        }
      }, {
        default: () => statusLabel
      })
    }
  },
  {
    title: $t('course.classPractice.tableColumns.submitTime'),
    key: 'createTime',
    width: 160,
    render: (row: any) => h('span', {
      style: { color: 'var(--text-secondary-color)' }
    }, formatTime(row.createTime || ''))
  },
  {
    title: $t('course.classPractice.tableColumns.reviewTime'),
    key: 'updateTime',
    width: 160,
    render: (row: any) => h('span', {
      style: { color: 'var(--text-secondary-color)' }
    }, (row.isCorrect === null || row.isCorrect === undefined || row.isCorrect === 3) ? '-' : (row.updateTime ? formatTime(row.updateTime) : '-'))
  },
  {
    title: $t('course.classPractice.tableColumns.actions'),
    key: 'actions',
    width: 100,
    render: (row: any, index: number) => h('button', {
      class: 'n-button n-button--text action-btn',
      onClick: () => handleViewAnswerDetail(row, index)
    }, (row.isCorrect === null || row.isCorrect === undefined || row.isCorrect === AnswerStatusEnum.PENDING_REVIEW) ? $t('course.classPractice.grade') : $t('course.classPractice.viewDetails'))
  }
]

// 计算属性
const questionDetail = computed(() => {
  return fullQuestionDetail.value || (props.selectedPractice?.questionVO as QuestionVO | undefined)
})

// PageTable 是否自动加载
const autoLoadTable = computed(() => {
  return !!props.selectedPractice?.id
})

// 获取练习统计数据
const loadPracticeStatistics = async (practiceId: string) => {
  if (!practiceId) {
    practiceStatistics.value = null
    return
  }

  loadingStatistics.value = true
  try {
    const response = await getPracticeStatistics(practiceId)
    practiceStatistics.value = (response.success || response.code === 200)
      ? response.data
      : null
  } catch (error) {
    practiceStatistics.value = null
    console.error('获取练习统计数据失败:', error)
  } finally {
    loadingStatistics.value = false
  }
}

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
    fullQuestionDetail.value = (response.success || response.code === 200)
      ? response.data
      : (props.selectedPractice.questionVO as QuestionVO || null)
  } catch (error) {
    fullQuestionDetail.value = props.selectedPractice.questionVO as QuestionVO || null
  } finally {
    loadingQuestion.value = false
  }
}

// 监听 selectedPractice 变化
watch(() => props.selectedPractice, (newPractice) => {
  if (newPractice) {
    // 切换练习时重置过滤条件
    currentFilter.value = null
    loadFullQuestionDetail()
    loadPracticeStatistics(newPractice.id)
    // PageTable 会通过 autoLoadTable 和 queryParams 的响应式变化自动重新加载
  } else {
    fullQuestionDetail.value = null
    practiceStatistics.value = null
  }
}, { immediate: true })

// 查看答案详情
const handleViewAnswerDetail = (row: any, index?: number) => {
  currentAnswerDetail.value = row
  currentAnswerIndex.value = index ?? -1

  // 获取当前页面的所有数据作为答案列表
  if (pageTableRef.value) {
    answerList.value = pageTableRef.value.getCurrentPageData() || []
  }

  showAnswerDetail.value = true
}

// 处理答案批阅完成
const handleAnswerGraded = (_gradedAnswer: any) => {
  // 刷新表格数据
  // PageTable 组件会自动重新加载数据
}

// 处理答案导航
const handleAnswerNavigate = (index: number) => {
  if (pageTableRef.value) {
    const pageData = pageTableRef.value.getCurrentPageData()
    if (pageData && pageData.length > index) {
      currentAnswerDetail.value = pageData[index]
      currentAnswerIndex.value = index
      // 更新答案列表
      answerList.value = pageData
    }
  }
}

// 方法
const formatTime = (time: string) => {
  if (!time) return $t('course.classPractice.notSet')
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
    return $t('common.unknown')
  }
  return getQuestionTypeLabel(type, isEn.value)
}

// 获取难度文本
const getDifficultyText = (difficulty?: number | null) => {
  if (difficulty === null || difficulty === undefined || difficulty === 0) {
    return $t('common.unknown')
  }
  return getQuestionBankDifficultyLabel(difficulty, isEn.value)
}

const formatScore = (score?: number | null) => {
  if (score === null || score === undefined) {
    return $t('course.classPractice.score') + ': '
  }
  return `${score} ${$t('course.classPractice.pointUnit')}`
}

const formatEstimatedTime = (time?: number | null) => {
  if (typeof time !== 'number' || time <= 0) {
    return $t('course.classPractice.unlimitedTime')
  }
  return `${time} ${$t('course.classPractice.minuteUnit')}`
}

// 获取状态类型
const getStatusType = (isCorrect: number | null | undefined) => {
  if (isCorrect === null || isCorrect === undefined) return 'info'
  switch (isCorrect) {
    case 1: return 'success'  // 正确
    case 2: return 'warning'  // 半对
    case 3: return 'info'     // 待批阅
    default: return 'error'   // 错误或其他
  }
}

// 获取状态标签
const getStatusLabel = (isCorrect: number | null | undefined) => {
  if (isCorrect === null || isCorrect === undefined) return getAnswerStatusLabel(3, isEn.value) // 待批阅
  return getAnswerStatusLabel(isCorrect, isEn.value)
}

// 获取状态颜色
const getStatusColor = (type: string) => {
  const colorMap = {
    success: 'var(--success-color)',
    error: 'var(--error-color)',
    warning: 'var(--warning-color)',
    info: 'var(--info-color)'
  }
  return colorMap[type as keyof typeof colorMap] || 'var(--text-color)'
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

  .practice-statistics-section {
    margin-bottom: 20px;
  }

  .student-submissions-section {
    padding: 20px 0;
    border-top: 1px solid var(--border-color);

    .submissions-table-card {
      background-color: var(--background-color);
      border-radius: 12px;
      border: 1px solid var(--border-color);
      box-shadow: none;

      :deep(.n-card__content) {
        height: auto;
        overflow-y: visible;
        padding: 0 16px 16px 16px;
      }

      :deep(.n-card__header) {
        padding: 16px 16px 0 16px;
        border-bottom: none;
        background: transparent;
      }

      // 给表格添加圆角
      :deep(.n-data-table) {
        border-radius: 8px;
        overflow: hidden;
      }

      // 覆盖PageTable的分页样式，使其居中
      :deep(.pagination-container) {
        justify-content: center !important;
      }
    }

    .submissions-list {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .submission-item {
      border: 1px solid var(--border-color);
      border-radius: 8px;
      padding: 12px;
      background: var(--background-secondary-color);

      .submission-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 8px;
        gap: 12px;

        .submission-time {
          font-size: 13px;
          color: var(--text-secondary-color);
        }

        .submission-score {
          font-size: 14px;
          font-weight: 600;
          color: var(--color-primary);
        }
      }

      .submission-answer {
        .answer-content {
          font-size: 14px;
          color: var(--text-color);
          line-height: 1.5;

          :deep(p) {
            margin: 0;
          }
        }

        .answer-options,
        .answer-blanks {
          margin-top: 8px;
          padding: 8px;
          background: var(--background-color);
          border-radius: 4px;
          border: 1px solid var(--border-color);
        }
      }
    }
  }

  .practice-empty-card {
    background-color: var(--background-color);
    height: 100%;
    max-height: 100%;
    overflow: hidden;
    border-radius: 12px;
    border: 1px solid var(--border-color);
    box-shadow: none;
    display: flex;
    align-items: center;
    justify-content: center;

    :deep(.n-card__content) {
      height: 100%;
      overflow-y: auto;
      padding: 0 20px 20px 20px;
      display: flex;
      align-items: center;
      justify-content: center;

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
      display: none;
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
