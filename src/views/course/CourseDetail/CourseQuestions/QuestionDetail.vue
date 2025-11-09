<template>
  <div class="question-detail-content">
    <n-card v-if="!question" class="no-selection-card">
      <n-empty :description="t('course.question.selectQuestionToView')">
        <template #icon>
          <Icon :component="ListOutline"/>
        </template>
      </n-empty>
    </n-card>

    <n-card v-else class="question-info-card">

      <!-- 题目标题和基本信息 -->
      <div class="question-header">
        <div class="question-title-section">
          <h2 class="question-title">{{ question.questionTitle }}</h2>
          <!-- 题目描述 -->
          <div class="question-meta-info">
            <div class="question-type-info">
              <n-tag :type="getQuestionTypeTagType(question.questionType)" size="medium">
                {{ getQuestionTypeText(question.questionType) }}
              </n-tag>
            </div>
            <div class="question-difficulty-info">
              <n-tag :type="getDifficultyTagType(question.difficulty)" size="medium">
                <span>{{ getDifficultyText(question.difficulty) }}</span>
              </n-tag>
            </div>
            <div class="question-score-info">
              <span class="score-label">{{ $t('course.question.score') }}:</span>
              <span class="score-value">{{ question.score }} {{ $t('common.points') }}</span>
            </div>
            <div v-if="question.estimatedTime" class="question-time-info">
              <span class="time-label">{{ $t('course.question.estimatedTime') }}:</span>
              <span class="time-value">{{ question.estimatedTime }} {{ $t('common.minutes') }}</span>
            </div>
            <div v-if="question.viewCount !== undefined" class="question-view-info">
              <span class="view-label">{{ $t('course.question.viewCount') }}:</span>
              <span class="view-value">{{ question.viewCount || 0 }} {{ $t('common.times') }}</span>
            </div>
            <div class="question-status-info">
              <n-tag :type="question.status === 1 ? 'success' : 'default'" size="medium">
                {{ getStatusText(question.status) }}
              </n-tag>
            </div>
          </div>
        </div>
        <!-- 操作按钮区域 -->
        <div v-if="canEditQuestion" class="question-actions">
          <n-button
              v-if="question.status === 1"
              :title="t('course.question.unpublish')"
              circle
              quaternary
              size="small"
              type="warning"
              @click="handleUnpublish"
          >
              <template #icon>
                <Icon :component="CloseCircleOutline"/>
              </template>
          </n-button>
          <n-button
              v-else
              :title="t('course.question.publish')"
              circle
              quaternary
              size="small"
              type="success"
              @click="handlePublish"
          >
              <template #icon>
                <Icon :component="CheckmarkCircleOutline"/>
              </template>
          </n-button>
          <n-button
              :title="t('common.edit')"
              circle
              quaternary
              size="small"
              @click="handleEdit"
          >
            <template #icon>
              <Icon :component="CreateOutline"/>
            </template>
          </n-button>
          <n-button
              :title="t('common.delete')"
              circle
              quaternary
              size="small"
              type="error"
              @click="handleDelete"
          >
            <template #icon>
              <Icon :component="TrashOutline"/>
            </template>
          </n-button>
        </div>
      </div>

      <!-- 题目内容 -->
      <div v-if="question.questionContent" class="question-content">
        <h3 class="section-title">{{ $t('course.question.questionContent') }}</h3>
        <div class="content-body" v-html="question.questionContent"></div>

        <div v-if="question.tags && question.tags.length" class="tags-section">
          <h4>{{ $t('course.question.tags') }}</h4>
          <n-tag
              v-for="tag in question.tags"
              :key="tag"
              size="small"
              style="margin-right: 8px; margin-bottom: 4px;"
              type="info"
          >
            {{ tag }}
          </n-tag>
        </div>
      </div>

      <!-- 题目选项 -->
      <div v-if="showOptions" class="question-options">
        <h3 class="section-title">{{ $t('course.question.options') }}</h3>
        <div class="options-list">
          <div
              v-for="option in optionsList"
              :key="option.id"
              :class="{ 'correct-option': option.isCorrect === 1 }"
              class="option-item"
          >
            <div class="option-wrapper">
              <n-tag :type="option.isCorrect === 1 ? 'success' : 'default'" size="large" class="option-label-tag">
                {{ option.optionLabel }}
              </n-tag>
              <div class="option-content">{{ option.optionContent }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 题目答案 -->
      <div v-if="showAnswers && answersList.length > 0" class="question-answers">
        <h3 class="section-title">{{ $t('course.question.answers') }}</h3>
        <div class="content-body">
          <div
              v-for="answer in answersList"
              :key="answer.id"
              class="answer-display-item"
          >
            <div class="answer-text-content">{{ answer.answerText || answer.answerContent }}</div>
          </div>
        </div>
      </div>

    </n-card>


    <!-- 选项编辑对话框 -->
    <n-modal v-model:show="showOptionModal" :title="optionModalTitle" preset="dialog">
      <n-form
          ref="optionFormRef"
          :model="optionFormData"
          :rules="optionFormRules"
          label-placement="left"
          label-width="100px"
      >
        <n-form-item :label="$t('course.question.optionLabel')" path="optionLabel">
          <n-input
              v-model:value="optionFormData.optionLabel"
              :placeholder="$t('course.question.optionLabelPlaceholder')"
          />
        </n-form-item>
        <n-form-item :label="$t('course.question.optionContent')" path="optionContent">
          <n-input
              v-model:value="optionFormData.optionContent"
              :placeholder="$t('course.question.optionContentPlaceholder')"
              :rows="3"
              type="textarea"
          />
        </n-form-item>
        <n-form-item :label="$t('course.question.isCorrect')" path="isCorrect">
          <n-radio-group v-model:value="optionFormData.isCorrect">
            <n-radio :value="0">{{ $t('common.no') }}</n-radio>
            <n-radio :value="1">{{ $t('common.yes') }}</n-radio>
          </n-radio-group>
        </n-form-item>
        <n-form-item :label="$t('course.question.optionScore')" path="score">
          <n-input-number
              v-model:value="optionFormData.score"
              :min="0"
              :placeholder="$t('course.question.optionScorePlaceholder')"
              :precision="1"
              style="width: 100%"
          />
        </n-form-item>
      </n-form>
      <template #action>
        <n-space>
          <n-button @click="showOptionModal = false">{{ $t('common.cancel') }}</n-button>
          <n-button type="primary" @click="handleSubmitOption">{{ $t('common.confirm') }}</n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 答案编辑对话框 -->
    <n-modal v-model:show="showAnswerModal" :title="answerModalTitle" preset="dialog">
      <n-form
          ref="answerFormRef"
          :model="answerFormData"
          :rules="answerFormRules"
          label-placement="left"
          label-width="100px"
      >
        <n-form-item :label="$t('course.question.answerContent')" path="answerContent">
          <n-input
              v-model:value="answerFormData.answerContent"
              :placeholder="$t('course.question.answerContentPlaceholder')"
              :rows="3"
              type="textarea"
          />
        </n-form-item>
        <n-form-item :label="$t('course.question.answerText')" path="answerText">
          <n-input
              v-model:value="answerFormData.answerText"
              :placeholder="$t('course.question.answerTextPlaceholder')"
          />
        </n-form-item>
        <n-form-item :label="$t('course.question.isCorrect')" path="isCorrect">
          <n-select
              v-model:value="answerFormData.isCorrect"
              :options="answerCorrectnessOptions"
              :placeholder="$t('course.question.isCorrectPlaceholder')"
          />
        </n-form-item>
        <n-form-item :label="$t('course.question.answerScore')" path="score">
          <n-input-number
              v-model:value="answerFormData.score"
              :min="0"
              :placeholder="$t('course.question.answerScorePlaceholder')"
              :precision="1"
              style="width: 100%"
          />
        </n-form-item>
      </n-form>
      <template #action>
        <n-space>
          <n-button @click="showAnswerModal = false">{{ $t('common.cancel') }}</n-button>
          <n-button type="primary" @click="handleSubmitAnswer">{{ $t('common.confirm') }}</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import {computed, nextTick, onMounted, reactive, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRouter} from 'vue-router'
import {AddOutline, CreateOutline, ListOutline, TrashOutline, CheckmarkCircleOutline, CloseCircleOutline} from '@vicons/ionicons5'
import type {FormInst, FormRules} from 'naive-ui'
import {
  NButton,
  NCard,
  NEmpty,
  NForm,
  NFormItem,
  NInput,
  NInputNumber,
  NModal,
  NRadio,
  NRadioGroup,
  NSelect,
  NSpace,
  NTag,
  useMessage
} from 'naive-ui'
import {
  addQuestionAnswer,
  addQuestionOption,
  getDefaultQuestionAnswerDTO,
  getDefaultQuestionOptionDTO,
  getQuestionById,
  listAllQuestionAnswerByQuestionId,
  listAllQuestionOptionByQuestionId,
  publishQuestion,
  removeQuestionAnswerById,
  removeQuestionOptionById,
  unpublishQuestion,
  updateQuestionAnswer,
  updateQuestionOption,
  viewQuestion
} from '@/api/course'
import type {
  QuestionAnswerDTO,
  QuestionAnswerVO,
  QuestionOptionDTO,
  QuestionOptionVO,
  QuestionVO
} from '@/types/course'
import {QuestionStatusEnum, getQuestionStatusLabel} from '@/enum/course/questionStatusEnum'
import Icon from '@/components/common/Icon.vue'
import {getDiscreteApi} from '@/utils/naiveUIHelper'
import {useUserStore} from '@/store/modules/user'

interface Props {
  question: QuestionVO | null
  courseId: string
}

interface Emits {
  (e: 'delete', question: QuestionVO): void
  (e: 'edit', question: QuestionVO): void
  (e: 'update'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const {t} = useI18n()
const {dialog, message} = getDiscreteApi()
const router = useRouter()
const userStore = useUserStore()

// 响应式数据
const optionsList = ref<QuestionOptionVO[]>([])
const answersList = ref<QuestionAnswerVO[]>([])
const showOptionModal = ref(false)
const showAnswerModal = ref(false)
const optionFormRef = ref<FormInst | null>(null)
const answerFormRef = ref<FormInst | null>(null)
const isEditOption = ref(false)
const isEditAnswer = ref(false)
const viewCountCache = ref<Map<string, number>>(new Map())

// 权限检查
const canEditQuestion = computed(() => {
  return userStore.hasRole('ADMIN') || userStore.hasRole('TEACHER')
})

// 选项表单数据
const optionFormData = reactive<QuestionOptionDTO>({
  id: null,
  questionId: null,
  optionContent: null,
  optionLabel: null,
  isCorrect: null,
  score: null,
  imageUrls: null,
})

// 答案表单数据
const answerFormData = reactive<QuestionAnswerDTO>({
  id: null,
  questionId: null,
  answerContent: null,
  answerText: null,
  isCorrect: null,
  score: null
})

// 答案正确性选项
const answerCorrectnessOptions = [
  {label: t('course.question.incorrect'), value: 0},
  {label: t('course.question.correct'), value: 1},
  {label: t('course.question.partiallyCorrect'), value: 2}
]

const optionModalTitle = computed(() => isEditOption.value ? t('common.edit') : t('common.add'))
const answerModalTitle = computed(() => isEditAnswer.value ? t('common.edit') : t('common.add'))

// 表单验证规则
const optionFormRules: FormRules = {
  optionLabel: [
    {required: true, message: t('course.question.optionLabelRequired'), trigger: 'blur'}
  ],
  optionContent: [
    {required: true, message: t('course.question.optionContentRequired'), trigger: 'blur'}
  ],
  isCorrect: [
    {required: true, type: 'number', message: t('course.question.isCorrectRequired'), trigger: 'change'}
  ]
}

const answerFormRules: FormRules = {
  answerContent: [
    {required: true, message: t('course.question.answerContentRequired'), trigger: 'blur'}
  ],
  isCorrect: [
    {required: true, type: 'number', message: t('course.question.isCorrectRequired'), trigger: 'change'}
  ],
  score: [
    {required: true, type: 'number', message: t('course.question.answerScoreRequired'), trigger: 'blur'}
  ]
}

// 计算属性
const showOptions = computed(() => {
  return props.question?.questionType === 0 || props.question?.questionType === 1
})

const showAnswers = computed(() => {
  return props.question?.questionType === 2 || props.question?.questionType === 3 || props.question?.questionType === 4
})

// 获取题目类型文本
const getQuestionTypeText = (type: number) => {
  const typeMap = {
    0: t('course.question.singleChoice'),
    1: t('course.question.multipleChoice'),
    2: t('course.question.trueFalse'),
    3: t('course.question.fillBlank'),
    4: t('course.question.shortAnswer')
  }
  return typeMap[type as keyof typeof typeMap] || '-'
}

// 获取题目类型标签类型
const getQuestionTypeTagType = (type: number) => {
  const typeMap = {
    0: 'info',    // 单选题
    1: 'success', // 多选题
    2: 'warning', // 判断题
    3: 'error',   // 填空题
    4: 'default'  // 简答题
  }
  return typeMap[type as keyof typeof typeMap] || 'default'
}

const getDifficultyText = (difficulty: number) => {
  const difficultyMap = {
    1: t('common.easy'),
    2: t('common.medium'),
    3: t('common.hard')
  }
  return difficultyMap[difficulty as keyof typeof difficultyMap] || '-'
}

// 获取难度标签类型
const getDifficultyTagType = (difficulty: number) => {
  const difficultyMap = {
    1: 'success', // 简单
    2: 'warning', // 中等
    3: 'error'    // 困难
  }
  return difficultyMap[difficulty as keyof typeof difficultyMap] || 'default'
}

// 获取状态文本
const getStatusText = (status?: number) => {
  if (status === undefined || status === null) {
    return t('course.question.draft')
  }
  return getQuestionStatusLabel(status, false)
}

// 处理编辑
const handleEdit = () => {
  if (props.question) {
    emit('edit', props.question)
  }
}

// 处理删除
const handleDelete = () => {
  if (!props.question) return

  dialog.warning({
    title: t('common.delete'),
    content: t('course.question.deleteConfirmContent'),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: () => {
      emit('delete', props.question!)
    }
  })
}

// 处理发布
const handlePublish = () => {
  if (!props.question) return

  dialog.warning({
    title: t('common.confirm'),
    content: t('course.question.confirmPublish'),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      try {
        await publishQuestion(props.question!.id)
        message.success(t('course.question.publishSuccess'))
        emit('update')
      } catch (error) {
        message.error(t('course.question.publishFailed'))
      }
    }
  })
}

// 处理取消发布
const handleUnpublish = () => {
  if (!props.question) return

  dialog.warning({
    title: t('common.confirm'),
    content: t('course.question.confirmUnpublish'),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      try {
        await unpublishQuestion(props.question!.id)
        message.success(t('course.question.unpublishSuccess'))
        emit('update')
      } catch (error) {
        message.error(t('course.question.unpublishFailed'))
      }
    }
  })
}

// 增加浏览次数
const incrementViewCount = async (questionId: string) => {
  // 检查缓存，10分钟内不重复调用
  const cacheKey = `view_${questionId}`
  const cachedTime = viewCountCache.value.get(cacheKey)
  const now = Date.now()
  const cacheDuration = 10 * 60 * 1000 // 10分钟

  if (cachedTime && (now - cachedTime) < cacheDuration) {
    return // 10分钟内已调用过，不重复调用
  }

  try {
    await viewQuestion(questionId)
    viewCountCache.value.set(cacheKey, now)
    // 更新本地显示
    if (props.question && props.question.id === questionId) {
      props.question.viewCount = (props.question.viewCount || 0) + 1
    }
  } catch (error) {
    // 静默失败，不影响用户体验
  }
}

const loadOptions = async (questionId: string) => {
  try {
    const response = await listAllQuestionOptionByQuestionId(questionId)
    optionsList.value = response.data || []
  } catch (error) {
    message.error(t('common.loadError'))
  }
}

const loadAnswers = async (questionId: string) => {
  try {
    const response = await listAllQuestionAnswerByQuestionId(questionId)
    answersList.value = response.data || []
  } catch (error) {
    message.error(t('common.loadError'))
  }
}

const handleAddOption = () => {
  if (!props.question) return
  isEditOption.value = false
  Object.assign(optionFormData, getDefaultQuestionOptionDTO())
  optionFormData.questionId = props.question.id
  showOptionModal.value = true
}

const handleEditOption = (option: QuestionOptionVO) => {
  isEditOption.value = true
  Object.assign(optionFormData, {
    id: option.id,
    questionId: option.questionId,
    optionContent: option.optionContent,
    optionLabel: option.optionLabel,
    isCorrect: option.isCorrect,
    score: option.score,
    imageUrls: option.imageUrls,
  })
  showOptionModal.value = true
}

const handleDeleteOption = async (option: QuestionOptionVO) => {
  try {
    await removeQuestionOptionById(option.id)
    message.success(t('common.deleteSuccess'))
    if (props.question) {
      loadOptions(props.question.id)
      emit('update')
    }
  } catch (error) {
    message.error(t('common.deleteError'))
  }
}

const handleSubmitOption = async () => {
  if (!optionFormRef.value) return

  try {
    await optionFormRef.value.validate()

    if (isEditOption.value) {
      await updateQuestionOption(optionFormData)
      message.success(t('common.updateSuccess'))
    } else {
      await addQuestionOption(optionFormData)
      message.success(t('common.addSuccess'))
    }

    showOptionModal.value = false
    if (props.question) {
      loadOptions(props.question.id)
      emit('update')
    }
  } catch (error) {
    message.error(t('common.submitError'))
  }
}

const handleAddAnswer = () => {
  if (!props.question) return
  isEditAnswer.value = false
  Object.assign(answerFormData, getDefaultQuestionAnswerDTO())
  answerFormData.questionId = props.question.id
  showAnswerModal.value = true
}

const handleEditAnswer = (answer: QuestionAnswerVO) => {
  isEditAnswer.value = true
  Object.assign(answerFormData, {
    id: answer.id,
    questionId: answer.questionId,
    answerContent: answer.answerContent,
    answerText: answer.answerText,
    isCorrect: answer.isCorrect,
    score: answer.score
  })
  showAnswerModal.value = true
}

const handleDeleteAnswer = async (answer: QuestionAnswerVO) => {
  try {
    await removeQuestionAnswerById(answer.id)
    message.success(t('common.deleteSuccess'))
    if (props.question) {
      loadAnswers(props.question.id)
      emit('update')
    }
  } catch (error) {
    message.error(t('common.deleteError'))
  }
}

const handleSubmitAnswer = async () => {
  if (!answerFormRef.value) return

  try {
    await answerFormRef.value.validate()

    if (isEditAnswer.value) {
      await updateQuestionAnswer(answerFormData)
      message.success(t('common.updateSuccess'))
    } else {
      await addQuestionAnswer(answerFormData)
      message.success(t('common.addSuccess'))
    }

    showAnswerModal.value = false
    if (props.question) {
      loadAnswers(props.question.id)
      emit('update')
    }
  } catch (error) {
    message.error(t('common.submitError'))
  }
}

// 监听题目变化，重新加载选项和答案
watch(() => props.question, (newQuestion) => {
  if (newQuestion) {
    loadOptions(newQuestion.id)
    loadAnswers(newQuestion.id)
    // 页面加载完成后自动增加浏览次数
    nextTick(() => {
      incrementViewCount(newQuestion.id)
    })
  } else {
    optionsList.value = []
    answersList.value = []
  }
}, {immediate: true})
</script>

<style lang="scss" scoped>
.question-detail-content {
  height: 100%;
  overflow: hidden;

  .no-selection-card {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    box-shadow: none;
  }

  .question-info-card {
    height: 100%;
    overflow: auto;
    border: none;
    box-shadow: none;

    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }


    .question-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border-color);

      .question-title-section {
        flex: 1;
        margin-right: 16px;

        .question-title {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-color);
          margin: 0 0 8px 0;
          line-height: 1.3;
        }

        .question-meta-info {
          display: flex;
          gap: 16px;
          align-items: center;
          flex-wrap: wrap;
          margin-top: 12px;

          .question-type-info,
          .question-difficulty-info,
          .question-score-info,
          .question-time-info,
          .question-view-info,
          .question-status-info {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 14px;
            color: var(--text-secondary-color);

            .score-label,
            .time-label,
            .view-label {
              color: var(--text-secondary-color);
            }

            .score-value {
              font-weight: 600;
              color: var(--primary-color);
            }

            .time-value,
            .view-value {
              color: var(--text-color);
            }
          }
        }
      }

      .question-actions {
        display: flex;
        gap: 8px;
        flex-shrink: 0;
      }
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-color);
      margin: 0 0 12px 0;
      padding-bottom: 8px;
      border-bottom: 2px solid var(--color-primary);
    }

    .question-content {
      margin-bottom: 24px;

      .content-body {
        font-size: 15px;
        line-height: 1.6;
        color: var(--text-color);
        margin-bottom: 16px;

        :deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
          color: var(--text-color);
          margin-top: 16px;
          margin-bottom: 8px;
        }

        :deep(p) {
          margin-bottom: 12px;
        }

        :deep(ul), :deep(ol) {
          padding-left: 20px;
          margin-bottom: 12px;
        }

        :deep(li) {
          margin-bottom: 4px;
        }

        :deep(blockquote) {
          border-left: 4px solid var(--color-primary);
          padding-left: 16px;
          margin: 16px 0;
          color: var(--text-secondary-color);
        }

        :deep(code) {
          background: var(--background-secondary-color);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
        }

        :deep(pre) {
          background: var(--background-secondary-color);
          padding: 12px;
          border-radius: 6px;
          overflow-x: auto;
          margin: 12px 0;
        }
      }

      .tags-section {
        margin-top: 16px;

        h4 {
          margin: 0 0 8px 0;
          color: var(--text-color);
          font-size: 14px;
          font-weight: 600;
        }
      }
    }

    .question-options {
      margin-bottom: 24px;

      .options-list {
        .option-item {
          margin-bottom: 16px;
          padding: 16px;
          background: var(--background-secondary-color);
          border: 1px solid var(--border-color);
          border-radius: 8px;
          transition: all 0.3s ease;

          &:hover {
            border-color: var(--primary-color);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          &.correct-option {
            border-color: var(--success-color);
            background: color-mix(in srgb, var(--success-color) 5%, var(--background-secondary-color));
          }

          .option-wrapper {
            display: flex;
            align-items: flex-start;
            gap: 12px;

            .option-label-tag {
              flex-shrink: 0;
              min-width: 40px;
              text-align: center;
              font-weight: 600;
              font-size: 16px;
            }

            .option-content {
              flex: 1;
              line-height: 1.6;
              color: var(--text-color);
              font-size: 15px;
              padding-top: 2px;
            }
          }
        }
      }
    }

    .question-answers {
      margin-bottom: 24px;

      .content-body {
        font-size: 15px;
        line-height: 1.6;
        color: var(--text-color);
        background: var(--background-secondary-color);
        padding: 16px;
        border-radius: 8px;
        border: 1px solid var(--border-color);
        margin-bottom: 16px;
      }

      .answer-display-item {
        margin-bottom: 12px;

        .answer-text-content {
          font-size: 15px;
          line-height: 1.6;
          color: var(--text-color);
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .question-detail-content {
    .question-info-card {
      .question-header {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;

        .question-title-section {
          margin-right: 0;

          .question-title {
            font-size: 20px;
          }

          .question-meta-info {
            gap: 12px;
            font-size: 13px;
          }
        }

        .question-actions {
          justify-content: flex-end;
        }
      }

      .section-title {
        font-size: 16px;
      }

      .question-content {
        .content-body {
          font-size: 14px;
          padding: 12px;
        }
      }

      .question-options,
      .question-answers {
        .options-list,
        .answers-list {
          .option-item,
          .answer-item {
            .option-wrapper {
              gap: 8px;

              .option-label-tag {
                min-width: 36px;
                font-size: 14px;
              }

              .option-content {
                font-size: 14px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
