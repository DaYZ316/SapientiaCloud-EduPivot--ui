<template>
  <div class="question-detail">
    <!-- 面包屑导航 -->
    <CourseBreadcrumb
      v-if="courseInfo"
      :course-info="courseInfo"
      :current-page="questionInfo.questionTitle || $t('course.question.detail')"
      :show-course-link="true"
    >
      <template #actions>
        <n-button @click="handleBack">
          <template #icon>
            <n-icon><ArrowLeftOutlined /></n-icon>
          </template>
          {{ $t('common.back') }}
        </n-button>
      </template>
    </CourseBreadcrumb>

    <!-- 题目基本信息 -->
    <div class="question-info-section">
      <n-card :title="$t('course.question.basicInfo')" class="info-card">
        <n-descriptions :column="2" bordered>
          <n-descriptions-item :label="$t('course.question.questionTitle')">
            {{ questionInfo.questionTitle }}
          </n-descriptions-item>
          <n-descriptions-item :label="$t('course.question.questionType')">
            {{ getQuestionTypeText(questionInfo.questionType) }}
          </n-descriptions-item>
          <n-descriptions-item :label="$t('course.question.difficulty')">
            {{ getDifficultyText(questionInfo.difficulty) }}
          </n-descriptions-item>
          <n-descriptions-item :label="$t('course.question.score')">
            {{ questionInfo.score }}
          </n-descriptions-item>
          <n-descriptions-item :label="$t('course.question.status')">
            {{ getStatusText(questionInfo.status || 0) }}
          </n-descriptions-item>
          <n-descriptions-item :label="$t('course.question.estimatedTime')">
            {{ questionInfo.estimatedTime || 0 }} {{ $t('common.minutes') }}
          </n-descriptions-item>
        </n-descriptions>
      </n-card>
    </div>

    <!-- 题目内容 -->
    <div class="question-content-section">
      <n-card :title="$t('course.question.content')" class="content-card">
        <div class="question-content">
          <h4>{{ $t('course.question.questionContent') }}</h4>
          <div class="content-text" v-html="questionInfo.questionContent"></div>
          
          <div v-if="questionInfo.tags && questionInfo.tags.length" class="tags-section">
            <h4>{{ $t('course.question.tags') }}</h4>
            <n-tag
              v-for="tag in questionInfo.tags"
              :key="tag"
              type="info"
              size="small"
              style="margin-right: 8px; margin-bottom: 4px;"
            >
              {{ tag }}
            </n-tag>
          </div>
        </div>
      </n-card>
    </div>

    <!-- 题目选项 -->
    <div v-if="showOptions" class="question-options-section">
      <n-card :title="$t('course.question.options')" class="options-card">
        <div class="options-header">
          <n-button type="primary" @click="handleAddOption">
            <template #icon>
              <n-icon><PlusOutlined /></n-icon>
            </template>
            {{ $t('course.question.addOption') }}
          </n-button>
        </div>
        
        <div class="options-list">
          <div
            v-for="option in optionsList"
            :key="option.id"
            class="option-item"
            :class="{ 'correct-option': option.isCorrect === 1 }"
          >
            <div class="option-header">
              <span class="option-label">{{ option.optionLabel }}</span>
              <div class="option-actions">
                <n-button size="small" type="info" text @click="handleEditOption(option)">
                  {{ $t('common.edit') }}
                </n-button>
                <n-button size="small" type="error" text @click="handleDeleteOption(option)">
                  {{ $t('common.delete') }}
                </n-button>
              </div>
            </div>
            <div class="option-content">{{ option.optionContent }}</div>
          </div>
        </div>
      </n-card>
    </div>

    <!-- 题目答案 -->
    <div v-if="showAnswers" class="question-answers-section">
      <n-card :title="$t('course.question.answers')" class="answers-card">
        <div class="answers-header">
          <n-button type="primary" @click="handleAddAnswer">
            <template #icon>
              <n-icon><PlusOutlined /></n-icon>
            </template>
            {{ $t('course.question.addAnswer') }}
          </n-button>
        </div>
        
        <div class="answers-list">
          <div
            v-for="answer in answersList"
            :key="answer.id"
            class="answer-item"
            :class="{ 'correct-answer': answer.isCorrect === 1 }"
          >
            <div class="answer-header">
              <span class="answer-score">{{ answer.score }} {{ $t('common.points') }}</span>
              <div class="answer-actions">
                <n-button size="small" type="info" text @click="handleEditAnswer(answer)">
                  {{ $t('common.edit') }}
                </n-button>
                <n-button size="small" type="error" text @click="handleDeleteAnswer(answer)">
                  {{ $t('common.delete') }}
                </n-button>
              </div>
            </div>
            <div class="answer-content">{{ answer.answerContent }}</div>
            <div v-if="answer.answerText" class="answer-text">
              <strong>{{ $t('course.question.answerText') }}:</strong> {{ answer.answerText }}
            </div>
          </div>
        </div>
      </n-card>
    </div>


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
            type="textarea"
            :placeholder="$t('course.question.optionContentPlaceholder')"
            :rows="3"
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
            :placeholder="$t('course.question.optionScorePlaceholder')"
            :min="0"
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
            type="textarea"
            :placeholder="$t('course.question.answerContentPlaceholder')"
            :rows="3"
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
            :placeholder="$t('course.question.answerScorePlaceholder')"
            :min="0"
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

<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import { ArrowLeftOutlined, PlusOutlined } from '@vicons/antd'
import { NButton, NIcon, NCard, NDescriptions, NDescriptionsItem, NTag, NModal, NForm, NFormItem, NInput, NRadioGroup, NRadio, NInputNumber, NSelect, NSpace, useMessage } from 'naive-ui'
import type { FormInst, FormRules } from 'naive-ui'
import { 
  getQuestionById,
  listAllQuestionOptionByQuestionId,
  listAllQuestionAnswerByQuestionId,
  addQuestionOption,
  updateQuestionOption,
  removeQuestionOptionById,
  addQuestionAnswer,
  updateQuestionAnswer,
  removeQuestionAnswerById,
  getDefaultQuestionOptionDTO,
  getDefaultQuestionAnswerDTO,
  getCourseById
} from '@/api/course'
import type { QuestionVO, QuestionOptionVO, QuestionAnswerVO, QuestionOptionDTO, QuestionAnswerDTO, CourseVO } from '@/types/course'
import CourseBreadcrumb from '../../components/CourseBreadcrumb/CourseBreadcrumb.vue'

const { t } = useI18n()
const message = useMessage()
const route = useRoute()

// 获取题目ID参数
const questionId = ref<string>(route.params.questionId as string)
const courseId = ref<string>(route.params.courseId as string)

// 响应式数据
const questionInfo = ref<QuestionVO>({} as QuestionVO)
const courseInfo = ref<CourseVO | null>(null)
const optionsList = ref<QuestionOptionVO[]>([])
const answersList = ref<QuestionAnswerVO[]>([])
const showOptionModal = ref(false)
const showAnswerModal = ref(false)
const optionFormRef = ref<FormInst | null>(null)
const answerFormRef = ref<FormInst | null>(null)
const isEditOption = ref(false)
const isEditAnswer = ref(false)

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
  { label: t('course.question.incorrect'), value: 0 },
  { label: t('course.question.correct'), value: 1 },
  { label: t('course.question.partiallyCorrect'), value: 2 }
]

// 计算属性
const showOptions = computed(() => {
  return questionInfo.value.questionType === 0 || questionInfo.value.questionType === 1
})

const showAnswers = computed(() => {
  return questionInfo.value.questionType === 2 || questionInfo.value.questionType === 3 || questionInfo.value.questionType === 4
})

const optionModalTitle = computed(() => isEditOption.value ? t('common.edit') : t('common.add'))
const answerModalTitle = computed(() => isEditAnswer.value ? t('common.edit') : t('common.add'))

// 表单验证规则
const optionFormRules: FormRules = {
  optionLabel: [
    { required: true, message: t('course.question.optionLabelRequired'), trigger: 'blur' }
  ],
  optionContent: [
    { required: true, message: t('course.question.optionContentRequired'), trigger: 'blur' }
  ],
  isCorrect: [
    { required: true, type: 'number', message: t('course.question.isCorrectRequired'), trigger: 'change' }
  ]
}

const answerFormRules: FormRules = {
  answerContent: [
    { required: true, message: t('course.question.answerContentRequired'), trigger: 'blur' }
  ],
  isCorrect: [
    { required: true, type: 'number', message: t('course.question.isCorrectRequired'), trigger: 'change' }
  ],
  score: [
    { required: true, type: 'number', message: t('course.question.answerScoreRequired'), trigger: 'blur' }
  ]
}

// 方法
const loadCourseInfo = async (courseId: string) => {
  try {
    const response = await getCourseById(courseId)
    courseInfo.value = response.data
  } catch (error) {
    message.error(t('common.loadError'))
  }
}

const loadQuestionInfo = async (questionId: string) => {
  try {
    const response = await getQuestionById(questionId)
    questionInfo.value = response.data
  } catch (error) {
    message.error(t('common.loadError'))
  }
}

const loadOptions = async (questionId: string) => {
  try {
    const response = await listAllQuestionOptionByQuestionId(questionId)
    optionsList.value = response.data
  } catch (error) {
    message.error(t('common.loadError'))
  }
}

const loadAnswers = async (questionId: string) => {
  try {
    const response = await listAllQuestionAnswerByQuestionId(questionId)
    answersList.value = response.data
  } catch (error) {
    message.error(t('common.loadError'))
  }
}

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

const getDifficultyText = (difficulty: number) => {
  const difficultyMap = {
    1: t('common.easy'),
    2: t('common.medium'),
    3: t('common.hard')
  }
  return difficultyMap[difficulty as keyof typeof difficultyMap] || '-'
}

const getStatusText = (status: number) => {
  const statusMap = {
    0: t('course.question.draft'),
    1: t('course.question.published'),
    2: t('course.question.disabled')
  }
  return statusMap[status as keyof typeof statusMap] || '-'
}

const handleBack = () => {
  // 返回上一页
  // router.back()
}

const handleAddOption = () => {
  isEditOption.value = false
  Object.assign(optionFormData, getDefaultQuestionOptionDTO())
  optionFormData.questionId = questionInfo.value.id
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
    loadOptions(questionInfo.value.id)
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
    loadOptions(questionInfo.value.id)
  } catch (error) {
    message.error(t('common.submitError'))
  }
}

const handleAddAnswer = () => {
  isEditAnswer.value = false
  Object.assign(answerFormData, getDefaultQuestionAnswerDTO())
  answerFormData.questionId = questionInfo.value.id
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
    loadAnswers(questionInfo.value.id)
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
    loadAnswers(questionInfo.value.id)
  } catch (error) {
    message.error(t('common.submitError'))
  }
}

// 生命周期
onMounted(() => {
  // 从路由参数获取题目ID并加载数据
  if (questionId.value) {
    loadQuestionInfo(questionId.value)
    loadOptions(questionId.value)
    loadAnswers(questionId.value)
  }
  // 加载课程信息
  if (courseId.value) {
    loadCourseInfo(courseId.value)
  }
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.question-detail {
  padding: 24px;
  background-color: var(--background-color);
  min-height: 100vh;


  .question-info-section,
  .question-content-section,
  .question-options-section,
  .question-answers-section {
    margin-bottom: 24px;

    .info-card,
    .content-card,
    .options-card,
    .answers-card {
      border: 1px solid var(--border-secondary-color);
      border-radius: 8px;

      :deep(.n-card-header) {
        background: var(--background-tertiary-color);
        border-bottom: 1px solid var(--border-secondary-color);
      }
    }
  }

  .question-content {
    .content-text {
      margin-bottom: 16px;
      line-height: 1.6;
      color: var(--text-color);
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

  .options-header,
  .answers-header {
    margin-bottom: 16px;
    display: flex;
    justify-content: flex-end;
  }

  .options-list,
  .answers-list {
    .option-item,
    .answer-item {
      margin-bottom: 16px;
      padding: 16px;
      background: var(--background-secondary-color);
      border: 1px solid var(--border-secondary-color);
      border-radius: 8px;
      transition: all 0.3s ease;

      &:hover {
        border-color: var(--primary-color);
        box-shadow: 0 2px 8px var(--shadow-secondary-color);
      }

      &.correct-option,
      &.correct-answer {
        border-color: var(--success-color);
        background: color-mix(in srgb, var(--success-color) 5%, var(--background-secondary-color));
      }

      .option-header,
      .answer-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 8px;

        .option-label {
          font-weight: 600;
          color: var(--text-color);
        }

        .answer-score {
          font-weight: 600;
          color: var(--success-color);
        }

        .option-actions,
        .answer-actions {
          display: flex;
          gap: 8px;
        }
      }

      .option-content,
      .answer-content {
        margin-bottom: 8px;
        line-height: 1.6;
        color: var(--text-color);
      }

      .answer-text {
        font-size: 12px;
        color: var(--text-secondary-color);
        line-height: 1.4;

        strong {
          color: var(--text-color);
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .question-detail {
    padding: 16px;

    .page-header {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;

      .header-actions {
        justify-content: flex-end;
      }
    }

    .options-list,
    .answers-list {
      .option-item,
      .answer-item {
        .option-header,
        .answer-header {
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;

          .option-actions,
          .answer-actions {
            width: 100%;
            justify-content: flex-end;
          }
        }
      }
    }
  }
}
</style>
