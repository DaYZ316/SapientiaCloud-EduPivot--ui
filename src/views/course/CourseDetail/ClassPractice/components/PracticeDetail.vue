<template>
  <div class="practice-detail">
    <!-- 教师和管理员视图 -->
    <n-card v-if="selectedPractice" class="practice-detail-card">
      <template #header>
        <div class="practice-detail-header">
          <div class="practice-detail-title">
            <span class="practice-number">{{ selectedPractice.publishOrder }}.</span>
            {{ selectedPractice.questionTitle || t('course.classPractice.unnamedQuestion') }}
          </div>
          <div class="practice-time-info">
            <n-space>
              <n-text depth="3">
                <template #icon>
                  <n-icon size="16" color="#52c41a">
                    <CalendarOutline/>
                  </n-icon>
                </template>
                {{ t('course.classPractice.startTime') }}: {{ formatTime(selectedPractice.startTime) }}
              </n-text>
              <n-text depth="3">
                <template #icon>
                  <n-icon size="16" color="#fa541c">
                    <CalendarOutline/>
                  </n-icon>
                </template>
                {{ t('course.classPractice.endTime') }}: {{ formatTime(selectedPractice.endTime) }}
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
        <n-text depth="3">{{ t('course.classPractice.classroom') }}: {{ selectedClassroomInfo.courseName }}</n-text>
      </div>

      <!-- 题目详情 -->
      <QuestionDisplay
        :question-detail="questionDetail"
        :loading-question="loadingQuestion"
      />

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
            <div class="section-title">{{ t('course.classPractice.studentAnswers') }}</div>
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
import { getIsRequiredLabel } from '@/enum/classroom/isRequiredEnum'
import PageTable from '@/components/common/PageTable.vue'
import PracticeStatisticsChart from './PracticeStatisticsChart.vue'
import AnswerDetailModal from './AnswerDetailModal.vue'
import QuestionDisplay from './QuestionDisplay.vue'

// Props
interface Props {
  selectedPractice: ClassroomQuestionVO | null
  selectedClassroomInfo: any
}

const props = defineProps<Props>()

// 国际化
const { locale, t: t } = useI18n()
const isEn = computed(() => locale.value === 'en-US')

// 响应式数据
const fullQuestionDetail = ref<QuestionVO | null>(null)
const loadingQuestion = ref(false)
const practiceStatistics = ref<any>(null)
const loadingStatistics = ref(false)
const currentFilter = ref<number | null>(null)

// 缓存对象
const questionDetailCache = new Map<string, QuestionVO>()
const practiceStatisticsCache = new Map<string, any>()

// 清除缓存
const clearCache = (practiceId?: string | null, questionId?: string | null) => {
  if (questionId) {
    questionDetailCache.delete(questionId)
  }
  if (practiceId) {
    practiceStatisticsCache.delete(practiceId)
  }
}

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
    title: t('course.classPractice.tableColumns.studentName'),
    key: 'studentRealName',
    width: 120,
    render: (row: any) => h('span', {
      style: { color: 'var(--text-color)' }
    }, row.studentRealName || '-')
  },
  {
    title: t('course.classPractice.tableColumns.score'),
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
          }, t('course.classPractice.pointUnit'))
        ])
      }
      return h('span', {
        style: { color: 'var(--text-secondary-color)' }
      }, '-')
    }
  },
  {
    title: t('course.classPractice.tableColumns.status'),
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
    title: t('course.classPractice.tableColumns.submitTime'),
    key: 'createTime',
    width: 160,
    render: (row: any) => h('span', {
      style: { color: 'var(--text-secondary-color)' }
    }, formatTime(row.createTime || ''))
  },
  {
    title: t('course.classPractice.tableColumns.reviewTime'),
    key: 'updateTime',
    width: 160,
    render: (row: any) => h('span', {
      style: { color: 'var(--text-secondary-color)' }
    }, (row.isCorrect === null || row.isCorrect === undefined || row.isCorrect === 3) ? '-' : (row.updateTime ? formatTime(row.updateTime) : '-'))
  },
  {
    title: t('course.classPractice.tableColumns.actions'),
    key: 'actions',
    width: 100,
    render: (row: any, index: number) => h('button', {
      class: 'n-button n-button--text action-btn',
      onClick: () => handleViewAnswerDetail(row, index)
    }, (row.isCorrect === null || row.isCorrect === undefined || row.isCorrect === AnswerStatusEnum.PENDING_REVIEW) ? t('course.classPractice.grade') : t('course.classPractice.viewDetails'))
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

  // 检查缓存
  const cachedStatistics = practiceStatisticsCache.get(practiceId)
  if (cachedStatistics) {
    practiceStatistics.value = cachedStatistics
    return
  }

  loadingStatistics.value = true
  try {
    const response = await getPracticeStatistics(practiceId)
    const statisticsData = (response.success || response.code === 200)
      ? response.data
      : null

    if (statisticsData) {
      practiceStatisticsCache.set(practiceId, statisticsData)
    }

    practiceStatistics.value = statisticsData
  } catch (error) {
    practiceStatistics.value = null
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

  // 检查缓存
  const cachedQuestion = questionDetailCache.get(props.selectedPractice.questionId)
  if (cachedQuestion) {
    fullQuestionDetail.value = cachedQuestion
    return
  }

  // 如果已有完整的 questionVO 数据，直接使用并缓存
  if (props.selectedPractice.questionVO &&
      props.selectedPractice.questionVO.questionContent &&
      props.selectedPractice.questionVO.questionTitle) {
    const questionVO = props.selectedPractice.questionVO as QuestionVO
    fullQuestionDetail.value = questionVO
    questionDetailCache.set(props.selectedPractice.questionId, questionVO)
    return
  }

  // 否则获取完整数据
  loadingQuestion.value = true
  try {
    const response = await getQuestionById(props.selectedPractice.questionId)
    const questionData = (response.success || response.code === 200)
      ? response.data
      : (props.selectedPractice.questionVO as QuestionVO || null)

    if (questionData) {
      questionDetailCache.set(props.selectedPractice.questionId, questionData)
    }

    fullQuestionDetail.value = questionData
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
  // 清除练习统计缓存，确保下次加载时获取最新数据
  if (props.selectedPractice?.id) {
    clearCache(props.selectedPractice.id, null)
  }

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
  if (!time) return t('course.classPractice.notSet')
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

  }
}
</style>
