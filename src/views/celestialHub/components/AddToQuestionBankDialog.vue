<template>
  <n-modal
      v-model:show="showDialog"
      :style="{ width: '90vw', maxWidth: '1200px' }"
      :title="t('course.question.addToQuestionBankTitle')"
      preset="card"
      size="huge"
  >
    <div class="add-to-bank-dialog">
      <!-- 步骤指示器 -->
      <div class="steps-container">
        <n-steps :current="currentStep">
          <n-step
              :status="currentStep === 0 ? 'process' : 'wait'"
              :title="t('course.question.selectCourse')"
          />
          <n-step
              :status="currentStep === 1 ? 'process' : 'wait'"
              :title="t('course.question.selectQuestionBank')"
          />
        </n-steps>
      </div>

      <!-- 步骤1: 选择课程 -->
      <div v-if="currentStep === 0" class="step-content">
        <div class="search-section">
          <CourseSearchForm
              v-model="courseSearchForm"
              @reset="handleResetCourseSearch"
              @search="handleCourseSearch"
          />
        </div>

        <div class="course-list-section">
          <LoadingSpinner
              v-if="courseLoading"
              :title="t('course.messages.loading')"
              min-height="200px"
          />
          <div v-else-if="courseList.length === 0" class="empty-state">
            <n-empty :description="t('course.empty.noData')"/>
          </div>
          <div v-else class="course-grid">
            <div
                v-for="course in courseList"
                :key="course.id"
                :class="['course-card-item', { selected: selectedCourse?.id === course.id }]"
                @click="handleSelectCourse(course)"
            >
              <div class="course-card-content">
                <div class="course-name">{{ course.courseName }}</div>
                <div v-if="course.teacherName" class="course-teacher">
                  {{ t('course.dialog.teacherName') }}: {{ course.teacherName }}
                </div>
                <div v-if="course.description" class="course-description">
                  {{ truncateText(course.description, 60) }}
                </div>
              </div>
            </div>
          </div>

          <!-- 分页 -->
          <div v-if="courseList.length > 0" class="pagination-container">
            <n-pagination
                v-model:page="coursePagination.pageNum"
                :item-count="coursePagination.total"
                :page-size="coursePagination.pageSize"
                :show-quick-jumper="true"
                @update:page="handleCoursePageChange"
            />
          </div>
        </div>
      </div>

      <!-- 步骤2: 选择题库 -->
      <div v-if="currentStep === 1" class="step-content">
        <div v-if="questionBankLoading" class="loading-state">
          <LoadingSpinner
              :title="t('course.messages.loading')"
              min-height="200px"
          />
        </div>
        <div v-else-if="questionBankList.length === 0" class="empty-state">
          <n-empty :description="t('course.questionBank.noBanks')"/>
        </div>
        <div v-else class="question-bank-list">
          <div
              v-for="bank in questionBankList"
              :key="bank.id"
              :class="['question-bank-item', { selected: selectedQuestionBank?.id === bank.id }]"
              @click="handleSelectQuestionBank(bank)"
          >
            <div class="bank-content">
              <div class="bank-name">{{ bank.bankName }}</div>
              <div v-if="bank.description" class="bank-description">
                {{ truncateText(bank.description, 80) }}
              </div>
              <div class="bank-meta">
                <n-tag v-if="bank.bankType !== null && bank.bankType !== undefined" size="small" type="info">
                  {{ getBankTypeText(bank.bankType) }}
                </n-tag>
                <n-tag v-if="bank.difficulty !== null && bank.difficulty !== undefined" size="small" type="warning">
                  {{ getDifficultyText(bank.difficulty) }}
                </n-tag>
                <span v-if="bank.questionCount !== null && bank.questionCount !== undefined" class="question-count">
                  {{ t('course.questionBank.questionCount') }}: {{ bank.questionCount }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <template #footer>
      <div class="dialog-footer">
        <n-space>
          <n-button @click="handleCancel">
            {{ t('common.cancel') }}
          </n-button>
          <n-button
              v-if="currentStep === 0"
              :disabled="!selectedCourse"
              type="primary"
              @click="handleNextStep"
          >
            {{ t('common.next') }}
          </n-button>
          <n-button
              v-if="currentStep === 1"
              type="primary"
              @click="handleBackStep"
          >
            {{ t('common.previous') }}
          </n-button>
          <n-button
              v-if="currentStep === 1"
              :disabled="!selectedQuestionBank"
              :loading="submitting"
              @click="handleSaveDraft"
          >
            {{ t('course.question.saveDraft') }}
          </n-button>
          <n-button
              v-if="currentStep === 1"
              :disabled="!selectedQuestionBank"
              :loading="submitting"
              type="primary"
              @click="handlePublish"
          >
            {{ t('course.question.publish') }}
          </n-button>
        </n-space>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import {computed, reactive, ref, watch} from 'vue'
import {NButton, NEmpty, NModal, NPagination, NSpace, NStep, NSteps, NTag} from 'naive-ui'
import {useI18n} from 'vue-i18n'
import {useUserStore} from '@/store'
import * as courseApi from '@/api/course'
import {listAllCourseQuestionBankByCourseId} from '@/api/course/courseQuestionBank'
import {addQuestion, getDefaultQuestionAddDTO} from '@/api/course/question'
import {getDefaultQuestionOptionDTO} from '@/api/course/questionOption'
import {getDefaultQuestionAnswerDTO} from '@/api/course/questionAnswer'
import type {CourseVO} from '@/types/course'
import type {CourseQuestionBankVO} from '@/types/course/courseQuestionBank'
import type {QuestionResponseDTO} from '@/types/celestialHub/question'
import type {QuestionOptionDTO} from '@/types/course/questionOption'
import type {QuestionAnswerDTO} from '@/types/course/questionAnswer'
import CourseSearchForm from '@/views/course/components/CourseSearchForm.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import {getQuestionBankTypeLabel} from '@/enum/course/questionBankTypeEnum'
import {getQuestionBankDifficultyLabel} from '@/enum/course/questionBankDifficultyEnum'
import {getDiscreteApi} from '@/utils/naiveUIHelper'

const {t, locale} = useI18n()
const {message} = getDiscreteApi()
const userStore = useUserStore()
const isEnLocale = computed(() => locale.value === 'en-US')

// Props
interface Props {
  show: boolean
  question: QuestionResponseDTO | null
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  question: null
})

// Emits
interface Emits {
  (e: 'update:show', value: boolean): void

  (e: 'success'): void
}

const emit = defineEmits<Emits>()

// 对话框显示状态
const showDialog = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value)
})

// 步骤状态
const currentStep = ref(0)

// 课程搜索表单
const courseSearchForm = ref(courseApi.getDefaultCourseQuery())

// 课程列表
const courseList = ref<CourseVO[]>([])
const courseLoading = ref(false)
const coursePagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

// 选中的课程
const selectedCourse = ref<CourseVO | null>(null)

// 题库列表
const questionBankList = ref<CourseQuestionBankVO[]>([])
const questionBankLoading = ref(false)

// 选中的题库
const selectedQuestionBank = ref<CourseQuestionBankVO | null>(null)

// 提交状态
const submitting = ref(false)

// 监听对话框显示，重置状态
watch(showDialog, (value) => {
  if (value) {
    resetDialog()
  }
})

// 监听选中的课程，加载题库列表
watch(selectedCourse, (course) => {
  if (course && currentStep.value === 1) {
    loadQuestionBankList(course.id)
  }
})

// 重置对话框
const resetDialog = () => {
  currentStep.value = 0
  selectedCourse.value = null
  selectedQuestionBank.value = null
  questionBankList.value = []
  courseSearchForm.value.courseName = null
  courseSearchForm.value.courseType = null
  courseSearchForm.value.status = null
  courseSearchForm.value.startTime = null
  courseSearchForm.value.endTime = null
  coursePagination.pageNum = 1
  coursePagination.pageSize = 10
  coursePagination.total = 0
  loadCourseData()
}

// 加载课程数据
const loadCourseData = async () => {
  courseLoading.value = true
  const queryParams = {
    ...courseSearchForm.value,
    pageNum: coursePagination.pageNum,
    pageSize: coursePagination.pageSize
  }

  // 非管理员根据用户角色设置查询条件
  if (!userStore.hasRole('ADMIN') && userStore.teacherInfo?.id) {
    queryParams.teacherId = userStore.teacherInfo.id
  }

  const result = await courseApi.listCourse(queryParams)
  const {data = [], total = 0} = (result as any) || {}
  courseList.value = data
  coursePagination.total = total
  courseLoading.value = false
}

// 搜索课程
const handleCourseSearch = () => {
  coursePagination.pageNum = 1
  loadCourseData()
}

// 重置课程搜索
const handleResetCourseSearch = () => {
  const defaultQuery = courseApi.getDefaultCourseQuery()
  Object.assign(courseSearchForm.value, defaultQuery)
  coursePagination.pageNum = 1
  loadCourseData()
}

// 课程分页变化
const handleCoursePageChange = (page: number) => {
  coursePagination.pageNum = page
  loadCourseData()
}

// 选择课程
const handleSelectCourse = (course: CourseVO) => {
  selectedCourse.value = course
}

// 下一步
const handleNextStep = () => {
  if (!selectedCourse.value) {
    return
  }
  currentStep.value = 1
  loadQuestionBankList(selectedCourse.value.id)
}

// 上一步
const handleBackStep = () => {
  currentStep.value = 0
  selectedQuestionBank.value = null
}

// 加载题库列表
const loadQuestionBankList = async (courseId: string) => {
  questionBankLoading.value = true
  questionBankList.value = []
  selectedQuestionBank.value = null

  const response = await listAllCourseQuestionBankByCourseId(courseId)
  if (response.success && response.data) {
    questionBankList.value = response.data
  }
  questionBankLoading.value = false
}

// 选择题库
const handleSelectQuestionBank = (bank: CourseQuestionBankVO) => {
  selectedQuestionBank.value = bank
}

// 添加题目（公共函数）
const addQuestionToBank = async (status: number) => {
  if (!selectedQuestionBank.value || !props.question) {
    return
  }

  const userInfo = userStore.userInfo
  if (!userInfo?.id) {
    return
  }

  submitting.value = true

  // 转换选项
  const options: QuestionOptionDTO[] | null = props.question.options?.map(option => {
    const optionDTO = getDefaultQuestionOptionDTO()
    optionDTO.optionContent = option.optionContent || null
    optionDTO.optionLabel = option.optionLabel || null
    optionDTO.isCorrect = option.isCorrect ?? null
    optionDTO.score = option.score ?? null
    optionDTO.explanation = option.explanation || null
    optionDTO.imageUrls = option.imageUrls || null
    return optionDTO
  }) || null

  // 转换答案
  const answers: QuestionAnswerDTO[] | null = props.question.answers?.map((answer, index) => {
    const answerDTO = getDefaultQuestionAnswerDTO()
    answerDTO.answerContent = answer.answerContent || null
    answerDTO.explanation = answer.explanation || null
    answerDTO.score = answer.score ?? null
    answerDTO.sortOrder = answer.sortOrder ?? (index + 1)
    return answerDTO
  }) || null

  // 构建题目数据
  const questionData = getDefaultQuestionAddDTO()
  questionData.courseId = selectedQuestionBank.value.courseId
  questionData.questionBankId = selectedQuestionBank.value.id
  questionData.sysUserId = userInfo.id
  questionData.questionTitle = props.question.questionTitle || null
  questionData.questionContent = props.question.questionContent || null
  questionData.questionType = props.question.questionType ?? null
  questionData.difficulty = props.question.difficulty ?? null
  questionData.score = props.question.score ?? null
  questionData.estimatedTime = props.question.estimatedTime ?? null
  questionData.tags = props.question.tags || []
  questionData.options = options
  questionData.answers = answers
  questionData.status = status
  questionData.celestialQuestionId = props.question.id || null

  const response = await addQuestion(questionData)
      .catch(() => {
        submitting.value = false
        return null
      })

  if (!response) {
    return
  }

  submitting.value = false

  if (response.success) {
    if (status === 0) {
      message.success(t('course.question.saveDraftSuccess'))
    } else {
      message.success(t('course.question.publishSuccess'))
    }
    emit('success')
    showDialog.value = false
  }
}

// 存入草稿
const handleSaveDraft = () => {
  addQuestionToBank(0)
}

// 发布题目
const handlePublish = () => {
  addQuestionToBank(1)
}

// 取消
const handleCancel = () => {
  showDialog.value = false
}

// 工具函数
const truncateText = (text: string, maxLength: number) => {
  if (!text) return ''
  return text.length <= maxLength ? text : text.substring(0, maxLength) + '...'
}

const getBankTypeText = (type: number) => {
  return getQuestionBankTypeLabel(type, isEnLocale.value)
}

const getDifficultyText = (difficulty: number) => {
  return getQuestionBankDifficultyLabel(difficulty, isEnLocale.value)
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles' as *;

.add-to-bank-dialog {
  .steps-container {
    display: flex;
    justify-content: center;
    margin-bottom: 24px;
  }

  .step-content {
    margin-top: 24px;
    min-height: 400px;
  }

  .search-section {
    margin-bottom: 24px;
  }

  .course-list-section {
    margin-top: 16px;
  }

  .course-grid {
    display: grid;
    /* 固定为 5 列，配合分页 pageSize=10 显示两行五列 */
    grid-template-columns: repeat(5, minmax(0, 1fr));
    grid-auto-rows: minmax(120px, auto);
    gap: 16px;
    margin-bottom: 16px;
  }

  .course-card-item {
    padding: 16px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    background: var(--background-secondary-color);

    &:hover {
      border-color: var(--color-primary);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    &.selected {
      border-color: var(--color-primary);
      background: color-mix(in srgb, var(--color-primary) 10%, var(--background-color));
    }

    .course-card-content {
      .course-name {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-color);
        margin-bottom: 8px;
      }

      .course-teacher {
        font-size: 13px;
        color: var(--text-secondary-color);
        margin-bottom: 8px;
      }

      .course-description {
        font-size: 13px;
        color: var(--text-secondary-color);
        line-height: 1.5;
      }
    }
  }

  .question-bank-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .question-bank-item {
    padding: 16px;
    border: 1px solid var(--border-color);
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.2s;
    background: var(--background-secondary-color);

    &:hover {
      border-color: var(--color-primary);
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }

    &.selected {
      border-color: var(--color-primary);
      background: color-mix(in srgb, var(--color-primary) 10%, var(--background-color));
    }

    .bank-content {
      .bank-name {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-color);
        margin-bottom: 8px;
      }

      .bank-description {
        font-size: 13px;
        color: var(--text-secondary-color);
        margin-bottom: 8px;
        line-height: 1.5;
      }

      .bank-meta {
        display: flex;
        align-items: center;
        gap: 8px;
        flex-wrap: wrap;

        .question-count {
          font-size: 12px;
          color: var(--text-secondary-color);
        }
      }
    }
  }

  .empty-state {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 200px;
  }

  .pagination-container {
    display: flex;
    justify-content: center;
    margin-top: 16px;
  }

  .dialog-footer {
    display: flex;
    justify-content: flex-end;
  }
}
</style>

