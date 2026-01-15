<template>
  <n-modal
    :show="show"
    @update:show="$emit('update:show', $event)"
    preset="card"
    :title="t('course.classPractice.studentAnswerDetails')"
    size="huge"
    :bordered="false"
    :segmented="false"
    :mask-closable="false"
    style="width: 700px"
  >
    <div v-if="answerDetail" class="answer-detail-content">
      <div class="answer-info">
        <div class="info-item">
          <span class="label">{{ t('course.classPractice.studentName') }}：</span>
          <span class="value">{{ answerDetail.studentRealName || '未知' }}</span>
        </div>
        <div class="info-item">
          <span class="label">{{ t('course.classPractice.submissionTime') }}：</span>
          <span class="value">{{ formatTime(answerDetail.createTime || '') }}</span>
        </div>
        <div class="info-item">
          <span class="label">{{ t('course.classPractice.answerScore') }}：</span>
          <span class="value">{{ answerDetail.score !== null && answerDetail.score !== undefined ? `${answerDetail.score} ${t('course.classPractice.pointUnit')}` : t('course.classPractice.ungraded') }}</span>
        </div>
        <div class="info-item">
          <span class="label">{{ t('course.classPractice.status') }}：</span>
          <n-tag
            :type="getAnswerStatusType(answerDetail.score, props.questionScore)"
            size="small"
          >
            {{ getAnswerStatusText(answerDetail.score, props.questionScore) }}
          </n-tag>
        </div>
      </div>

      <div class="answer-content-section">
        <h3>{{ t('course.classPractice.studentAnswer') }}</h3>
        <div v-if="answerDetail.answer" class="answer-content">
          <div v-if="answerDetail.answer.content" class="content-item">
            <div class="content-label">{{ t('course.classPractice.textAnswer') }}：</div>
            <div class="content-value" v-html="answerDetail.answer.content"></div>
          </div>
          <div v-if="answerDetail.answer.options && answerDetail.answer.options.length > 0" class="content-item">
            <div class="content-label">{{ t('course.classPractice.choiceAnswer') }}：</div>
            <div class="content-value">{{ answerDetail.answer.options.join(', ') }}</div>
          </div>
          <div v-if="answerDetail.answer.blanks && answerDetail.answer.blanks.length > 0" class="content-item">
            <div class="content-label">{{ t('course.classPractice.fillBlankAnswer') }}：</div>
            <div class="content-value">
              <div v-for="(blank, index) in answerDetail.answer.blanks" :key="index" class="blank-item">
                {{ t('course.classPractice.fillBlankPrefix') }} {{ Number(index) + 1 }}: {{ blank }}
              </div>
            </div>
          </div>
        </div>
        <div v-else class="no-answer">
          {{ t('course.classPractice.noAnswerContent') }}
        </div>
      </div>

      <div class="grading-section">
        <h3>{{ t('course.classPractice.gradingAndScoring') }}</h3>
        <n-form :model="gradingForm" :rules="gradingRules" ref="gradingFormRef">
          <n-space vertical size="large">
            <n-form-item :label="t('course.classPractice.scoreLabel')" path="score">
              <n-input-number
                v-model:value="gradingForm.score"
                :min="0"
                :max="props.questionScore ?? undefined"
                :precision="1"
                :placeholder="props.questionScore ? `${t('course.classPractice.pleaseEnterScore')} (0-${props.questionScore})` : t('course.classPractice.pleaseEnterScore')"
                style="width: 200px"
              />
            </n-form-item>

            <n-space justify="space-between" align="center">
              <n-space>
                <n-button @click="handlePrevious" :disabled="!canGoPrevious">
                  <template #icon>
                    <n-icon><ChevronBackOutline /></n-icon>
                  </template>
                  {{ t('course.classPractice.previous') }}
                </n-button>
              </n-space>

              <n-text v-if="currentPosition" depth="3">{{ currentPosition }}</n-text>

              <n-space>
                <n-button type="primary" @click="handleSubmitGrading" :disabled="!scoreChanged">{{ hasExistingScore ? t('course.classPractice.modifyScore') : t('course.classPractice.submitGrading') }}</n-button>
                <n-button @click="handleNext" :disabled="!canGoNext">
                  {{ t('course.classPractice.next') }}
                  <template #icon>
                    <n-icon><ChevronForwardOutline /></n-icon>
                  </template>
                </n-button>
              </n-space>
            </n-space>
          </n-space>
        </n-form>
      </div>
    </div>
  </n-modal>
</template>

<script lang="ts" setup>
import type { QuestionStudentVO } from '@/types/student'
import { updatePractice, getDefaultQuestionStudentDTO } from '@/api/student/practice'
import { getAnswerStatusLabel } from '@/enum/student/answerStatusEnum'
import { getGlobalApis } from '@/utils/naiveUIHelper'
import { ChevronBackOutline, ChevronForwardOutline } from '@vicons/ionicons5'
import { NForm } from 'naive-ui'
import { reactive, ref, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'

interface Props {
  show: boolean
  answerDetail: QuestionStudentVO | null
  questionScore?: number | null
  answerList?: QuestionStudentVO[]
  currentIndex?: number
}

const props = defineProps<Props>()

// 国际化
const { locale, t: t } = useI18n()
const isEn = computed(() => locale.value === 'en-US')

const emits = defineEmits<{
  'update:show': [value: boolean]
  'graded': [answerDetail: QuestionStudentVO]
  'navigate': [index: number]
}>()

// 批阅表单
const gradingForm = reactive({
  score: null as number | null
})

// 批阅表单验证规则
const gradingRules = computed(() => {
  const maxScore = props.questionScore || 100
  return {
    score: [
      {
        required: true,
        validator: (_rule: any, value: number | null) => {
          if (value === null || value === undefined) {
            return new Error(t('course.classPractice.pleaseEnterScore'))
          }
          return true
        },
        trigger: 'blur' as const
      },
      { type: 'number' as const, min: 0, max: maxScore, message: `得分必须在0-${maxScore}之间`, trigger: 'blur' as const }
    ]
  }
})

// 表单引用
const gradingFormRef = ref<InstanceType<typeof NForm> | null>(null)

// 批阅中状态
const gradingLoading = ref(false)

// 是否已有分数
const hasExistingScore = computed(() => {
  return props.answerDetail?.score !== null && props.answerDetail?.score !== undefined
})

// 原始分数（打开对话框时的分数）
const originalScore = ref<number | null>(null)

// 分数是否发生变化
const scoreChanged = computed(() => {
  return gradingForm.score !== originalScore.value
})

// 是否可以导航到上一个
const canGoPrevious = computed(() => {
  return props.currentIndex !== undefined && props.currentIndex > 0
})

// 是否可以导航到下一个
const canGoNext = computed(() => {
  return props.currentIndex !== undefined &&
         props.answerList &&
         props.currentIndex < props.answerList.length - 1
})

// 当前位置显示
const currentPosition = computed(() => {
  if (props.currentIndex === undefined || !props.answerList) {
    return ''
  }
  return `${props.currentIndex + 1}/${props.answerList.length}`
})


// 格式化时间
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

// 初始化批阅表单
const initGradingForm = () => {
  gradingForm.score = props.answerDetail?.score ?? null
  originalScore.value = props.answerDetail?.score ?? null
}

// 根据分数计算答案状态
const calculateAnswerStatus = (score: number | null | undefined, maxScore: number | null | undefined): number => {
  if (score === null || score === undefined) return 0 // 默认错误

  // 如果没有设置最大分数，假设分数大于0就是正确
  if (maxScore === null || maxScore === undefined) {
    return score > 0 ? 1 : 0
  }

  if (score === 0) return 0 // 0分为错误
  if (score === maxScore) return 1 // 满分为正确
  return 2 // 其余为半对
}


// 导航到上一个答案
const handlePrevious = () => {
  if (canGoPrevious.value && props.currentIndex !== undefined) {
    const previousIndex = props.currentIndex - 1
    emits('navigate', previousIndex)
  }
}

// 导航到下一个答案
const handleNext = () => {
  if (canGoNext.value && props.currentIndex !== undefined) {
    const nextIndex = props.currentIndex + 1
    emits('navigate', nextIndex)
  }
}

// 提交批阅
const handleSubmitGrading = async () => {
  if (!props.answerDetail?.id) return

  try {
    await gradingFormRef.value?.validate()
  } catch {
    return
  }

  gradingLoading.value = true
  try {
    const isCorrect = calculateAnswerStatus(gradingForm.score, props.questionScore)

    const data = getDefaultQuestionStudentDTO()
    data.id = props.answerDetail.id
    data.studentId = props.answerDetail.studentId
    data.questionId = props.answerDetail.questionId
    data.classroomId = props.answerDetail.classroomId
    data.practiceId = props.answerDetail.practiceId
    data.courseId = props.answerDetail.courseId
    data.answer = props.answerDetail.answer // 保留原始答案数据
    data.isCorrect = isCorrect
    data.score = gradingForm.score

    await updatePractice(data)

    // 更新本地数据
    if (props.answerDetail) {
      props.answerDetail.isCorrect = isCorrect
      props.answerDetail.score = gradingForm.score
      emits('graded', props.answerDetail)
    }

    // 更新原始分数，用于按钮禁用判断
    originalScore.value = gradingForm.score

    // 显示成功消息
    const { message } = getGlobalApis()
    if (message) {
      message.success('批阅成功')
    }
  } finally {
    gradingLoading.value = false
  }
}

// 获取答案状态标签类型
const getAnswerStatusType = (score: number | null | undefined, maxScore: number | null | undefined) => {
  if (score === null || score === undefined) return 'info'
  const status = calculateAnswerStatus(score, maxScore)
  if (status === 1) return 'success'
  if (status === 2) return 'warning'
  return 'error'
}

// 获取答案状态文本
const getAnswerStatusText = (score: number | null | undefined, maxScore: number | null | undefined) => {
  if (score === null || score === undefined) return getAnswerStatusLabel(3, isEn.value)
  const status = calculateAnswerStatus(score, maxScore)
  return getAnswerStatusLabel(status, isEn.value)
}

// 监听显示状态变化，初始化表单
watch(() => props.show, (newShow: boolean) => {
  if (newShow) {
    initGradingForm()
  }
})

// 监听答案详情变化，重新初始化表单（用于导航时）
watch(() => props.answerDetail, () => {
  initGradingForm()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles' as *;

// 控制modal宽度
:deep(.n-modal) {
  width: 700px !important;
}

.answer-detail-content {
  .answer-info {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    padding: 16px;
    background: var(--background-secondary-color);
    border-radius: 8px;
    margin-bottom: 20px;

    .info-item {
      display: flex;
      align-items: center;
      gap: 8px;

      .label {
        font-weight: 600;
        color: var(--text-secondary-color);
        min-width: 70px;
      }

      .value {
        color: var(--text-color);
      }
    }
  }

  .answer-content-section {
    h3 {
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--text-color);
    }

    .answer-content {
      .content-item {
        margin-bottom: 16px;

        .content-label {
          font-weight: 600;
          color: var(--text-secondary-color);
          margin-bottom: 8px;
        }

        .content-value {
          padding: 12px;
          background: var(--background-secondary-color);
          border-radius: 6px;
          border: 1px solid var(--border-color);
          color: var(--text-color);
          line-height: 1.6;

          .blank-item {
            margin-bottom: 4px;

            &:last-child {
              margin-bottom: 0;
            }
          }
        }
      }
    }

    .no-answer {
      padding: 40px 20px;
      text-align: center;
      color: var(--text-secondary-color);
      background: var(--background-secondary-color);
      border-radius: 6px;
      border: 1px solid var(--border-color);
    }
  }

  .grading-section {
    margin-top: 24px;
    padding: 20px;
    background: var(--background-secondary-color);
    border-radius: 8px;

    h3 {
      margin: 0 0 16px 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--text-color);
    }

    .n-form-item-label {
      font-weight: 600;
      color: var(--text-secondary-color);
    }

    .n-input-number {
      width: 200px;
    }
  }
}
</style>
