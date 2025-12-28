<template>
  <div class="question-list">
    <!-- 面包屑导航 -->
    <CourseBreadcrumb
        v-if="courseInfo"
        :course-info="courseInfo"
        :current-page="$t('course.question.title')"
        :show-course-link="true"
        :show-question-bank-option="true"
    >
      <template #actions>
        <n-space>
          <n-button @click="toggleAnswerVisibility">
            {{ showAnswers ? t('course.question.hideAnswers') : t('course.question.showAnswers') }}
          </n-button>
          <n-button @click="toggleDraftFilter">
            {{ showDraft ? t('course.question.published') : t('course.question.myDraft') }}
          </n-button>
          <n-button type="primary" @click="handleAdd">
            <template #icon>
              <n-icon>
                <PlusOutlined/>
              </n-icon>
            </template>
            {{ $t('common.add') }}
          </n-button>
        </n-space>
      </template>
    </CourseBreadcrumb>

    <!-- 搜索和筛选区域 -->
    <div class="search-section">
      <div class="search-section-content">
        <n-form :model="searchForm" inline>
          <n-form-item :label="$t('course.question.questionTitle')">
            <n-input
                v-model:value="searchForm.questionTitle"
                :placeholder="$t('course.question.questionTitlePlaceholder')"
                clearable
                style="width: 200px"
            />
          </n-form-item>
          <n-form-item :label="$t('course.question.questionType')">
            <n-select
                v-model:value="searchForm.questionType"
                :options="questionTypeOptions"
                :placeholder="$t('course.question.questionTypePlaceholder')"
                clearable
                style="width: 180px"
            />
          </n-form-item>
          <n-form-item :label="$t('course.question.difficulty')">
            <n-select
                v-model:value="searchForm.difficulty"
                :options="difficultyOptions"
                :placeholder="$t('course.question.difficultyPlaceholder')"
                clearable
                style="width: 180px"
            />
          </n-form-item>
          <n-form-item>
            <n-space>
              <n-button type="primary" @click="handleSearch">
                <template #icon>
                  <n-icon>
                    <SearchOutlined/>
                  </n-icon>
                </template>
                {{ $t('common.search') }}
              </n-button>
              <n-button @click="handleReset">
                <template #icon>
                  <n-icon>
                    <ReloadOutlined/>
                  </n-icon>
                </template>
                {{ $t('common.reset') }}
              </n-button>
            </n-space>
          </n-form-item>
        </n-form>
        <button class="tianshu-question-button" @click="(e) => handleTianshuQuestion(e)">
          {{ $t('course.question.tianshuQuestion') }}
        </button>
      </div>
    </div>

    <!-- 题目内容区域 -->
    <div class="question-page-content">
      <!-- 题目列表 -->
      <div class="question-sidebar-container">
        <div class="question-sidebar-scroll">
          <QuestionSidebar
              :format-estimated-time="formatEstimatedTime"
              :get-difficulty-tag-type="getDifficultyTagType"
              :get-difficulty-text="getDifficultyText"
              :get-question-type-tag-type="getQuestionTypeTagType"
              :get-question-type-text="getQuestionTypeText"
              :has-more="hasMore"
              :is-loading-more="isLoadingMore"
              :loading="loading"
              :question-list="questionList"
              :selected-question-id="selectedQuestionId"
              @delete="handleDelete"
              @edit="handleEdit"
              @publish="handlePublish"
              @select="handleSelectQuestion"
              @load-more="handleLoadMore"
          >
            <template #empty-action>
              <n-button type="primary" @click="handleAdd">
                <template #icon>
                  <n-icon>
                    <PlusOutlined/>
                  </n-icon>
                </template>
                {{ $t('course.question.createFirst') }}
              </n-button>
            </template>
          </QuestionSidebar>
        </div>
      </div>

      <!-- 题目详情 -->
      <div class="question-detail-content">
        <n-card v-if="!selectedQuestion" class="no-selection-card">
          <n-empty
              :description="t('course.question.noData')"
          >
            <template #extra>
              <n-button type="primary" @click="handleAdd">
                <template #icon>
                  <n-icon>
                    <PlusOutlined/>
                  </n-icon>
                </template>
                {{ $t('course.question.createFirst') }}
              </n-button>
            </template>
          </n-empty>
        </n-card>

        <n-card v-else class="question-info-card">
          <n-spin :show="loading" size="large">
            <div class="detail-header">
              <div class="detail-meta">
                <div class="meta-item">
                  <div class="meta-label">{{ t('course.question.questionType') }}</div>
                  <div class="meta-value">{{ getQuestionTypeText(selectedQuestion.questionType) }}</div>
                </div>
                <div class="meta-item">
                  <div class="meta-label">{{ t('course.question.difficulty') }}</div>
                  <div class="meta-value">{{ getDifficultyText(selectedQuestion.difficulty) }}</div>
                </div>
                <div class="meta-item">
                  <div class="meta-label">{{ t('course.question.score') }}</div>
                  <div class="meta-value">{{ formatScore(selectedQuestion.score) }}</div>
                </div>
                <div class="meta-item">
                  <div class="meta-label">{{ t('course.question.estimatedTime') }}</div>
                  <div class="meta-value">{{ formatEstimatedTime(selectedQuestion.estimatedTime) }}</div>
                </div>
                <div v-if="selectedQuestion.createTime" class="meta-item">
                  <div class="meta-label">{{ t('common.createTime') }}</div>
                  <div class="meta-value">{{ selectedQuestion.createTime }}</div>
                </div>
                <div class="meta-item">
                  <div class="meta-label">{{ t('course.question.status') }}</div>
                  <div class="meta-value">{{ getQuestionStatusText(selectedQuestion.status) }}</div>
                </div>
              </div>
              <div v-if="selectedQuestion.tags && selectedQuestion.tags.length" class="detail-tags">
                <n-tag
                    v-for="tag in selectedQuestion.tags"
                    :key="tag"
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
                  <div v-if="selectedQuestion.questionTitle" class="detail-title">
                    <h2>{{ selectedQuestion.questionTitle }}</h2>
                  </div>
                  <div class="detail-content" v-html="selectedQuestion.questionContent"></div>
                </div>
              </div>

              <div
                  v-if="selectedQuestion.options && selectedQuestion.options.length > 0"
                  class="section-block"
              >
                <div class="detail-options">
                  <div
                      v-for="(option, optionIndex) in selectedQuestion.options"
                      :key="option.id ?? `option-${optionIndex}`"
                      :class="['option-item', {correct: showAnswers && option.isCorrect === 1}]"
                  >
                    <div class="option-main">
                      <div class="option-content">
                        <span class="option-label">
                          {{ option.optionLabel || String.fromCharCode(65 + optionIndex) }}
                        </span>
                        <div v-html="option.optionContent"></div>
                      </div>
                      <div
                          v-if="showAnswers && option.score !== null && option.score !== undefined"
                          class="option-score"
                      >
                        {{ option.score }} 分
                      </div>
                    </div>
                    <div
                        v-if="showAnswers && option.explanation"
                        class="option-explanation"
                    >
                      {{ option.explanation }}
                    </div>
                  </div>
                </div>
              </div>

              <div
                  v-if="shouldDisplayAnswersSection"
                  class="section-block"
              >
                <div class="detail-answers">
                  <div
                      v-for="(answer, answerIndex) in selectedQuestion.answers"
                      :key="answer.id ?? `answer-${answerIndex}`"
                      class="answer-item"
                  >
                    <div class="answer-main">
                      <div class="answer-index">
                        #{{ answer.sortOrder ?? answerIndex + 1 }}
                      </div>
                      <div class="answer-content">
                        <div v-if="showAnswers && answer.answerContent" v-html="answer.answerContent"></div>
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

          </n-spin>
        </n-card>
      </div>
    </div>

    <QuestionDialog
        ref="createDialogRef"
        v-model:answers="questionAnswers"
        v-model:form="createForm"
        v-model:loading="createLoading"
        v-model:options="questionOptions"
        v-model:show="showCreateDialog"
        :difficulty-options="difficultyOptions"
        :mode="'create'"
        :question-type-options="questionTypeOptions"
        :rules="createFormRules"
        @cancel="handleCancelCreate"
        @confirm="handleConfirmCreate"
        @error="handleCreateError"
        @success="handleCreateSuccess"
    />

    <QuestionDialog
        ref="editDialogRef"
        v-model:answers="editingAnswers"
        v-model:form="editForm"
        v-model:loading="editLoading"
        v-model:options="editingOptions"
        v-model:show="showEditDialog"
        :difficulty-options="difficultyOptions"
        :mode="'edit'"
        :question-type-options="questionTypeOptions"
        :rules="editFormRules"
        @cancel="cancelEdit"
        @save="saveEditQuestion"
    />
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRoute, useRouter} from 'vue-router'
import {PlusOutlined, ReloadOutlined, SearchOutlined} from '@vicons/antd'
import {useDialog, useMessage} from 'naive-ui'
import {getDefaultQuestionQuery, listQuestion} from '@/api/course'
import {
  getDefaultQuestionAddDTO,
  getDefaultQuestionDTO,
  getQuestionById,
  removeQuestionById,
  updateQuestion
} from '@/api/course/question'
import type {QuestionAddDTO, QuestionAnswerDTO, QuestionDTO, QuestionVO} from '@/types/course'
import type {QuestionOptionDTO} from '@/types/course/questionOption'
import {
  getQuestionBankDifficultyLabel,
  getQuestionBankDifficultyOptions,
  getQuestionTypeLabel,
  getQuestionTypeOptions
} from '@/enum/course'
import {QuestionStatusEnum} from '@/enum/course/questionStatusEnum'
import CourseBreadcrumb from '@/views/course/components/CourseBreadcrumb/CourseBreadcrumb.vue'
import {useCourseStore, useTransitionStore, useUserStore} from '@/store'
import {useQuestionAnswerToggle} from '@/composables/useQuestionAnswerToggle'
import {runViewTransition} from '@/utils/themeAnimation'
import QuestionDialog from './QuestionDialog.vue'
import QuestionSidebar from './QuestionSidebar.vue'

const {t, locale} = useI18n()
const route = useRoute()
const router = useRouter()
const message = useMessage()
const dialog = useDialog()
const courseStore = useCourseStore()
const userStore = useUserStore()
const transitionStore = useTransitionStore()

// 获取路由参数
const courseId = ref<string>(route.params.courseId as string)
const questionBankId = ref<string>(route.params.bankId as string)
const courseInfo = computed(() => courseStore.currentCourseInfo)
const questionList = ref<QuestionVO[]>([])
const selectedQuestion = ref<QuestionVO | null>(null)
const selectedQuestionId = computed(() => selectedQuestion.value?.id ?? null)
const loading = ref(false)
const isLoadingMore = ref(false)
const hasMore = ref(false)

const {showAnswers} = useQuestionAnswerToggle()

const showDraft = ref(false)

// 分页相关数据
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0
})

// 搜索表单数据
const searchForm = reactive({
  questionTitle: null as string | null,
  questionType: null as number | null,
  difficulty: null as number | null,
})

// 选项配置
const questionTypeOptions = getQuestionTypeOptions(t)
const difficultyOptions = getQuestionBankDifficultyOptions(t)

// 题目管理相关状态
const showCreateDialog = ref(false)
const showEditDialog = ref(false)
const createLoading = ref<boolean | null>(null)
const editLoading = ref<boolean | null>(null)
const editingQuestion = ref<QuestionVO | null>(null)

// 表单数据
const createForm = ref<QuestionAddDTO>(getDefaultQuestionAddDTO())
const editForm = ref<QuestionDTO>(getDefaultQuestionDTO())

// 对话框引用
const createDialogRef = ref<InstanceType<typeof QuestionDialog> | null>(null)
const editDialogRef = ref<InstanceType<typeof QuestionDialog> | null>(null)

// 题目选项管理
const questionOptions = ref<QuestionOptionDTO[]>([])
const editingOptions = ref<QuestionOptionDTO[]>([])
const questionAnswers = ref<QuestionAnswerDTO[]>([])
const editingAnswers = ref<QuestionAnswerDTO[]>([])

// 表单验证规则
const createFormRules = computed(() => ({
  questionTitle: [
    {required: true, message: t('course.question.questionTitleRequired'), trigger: 'blur'}
  ],
  questionContent: [
    {required: true, message: t('course.question.questionContentRequired'), trigger: 'blur'}
  ],
  questionType: [
    {required: true, type: 'number' as const, message: t('course.question.questionTypeRequired'), trigger: 'change'}
  ],
  difficulty: [
    {required: true, type: 'number' as const, message: t('course.question.difficultyRequired'), trigger: 'change'}
  ],
  score: [
    {required: true, type: 'number' as const, message: t('course.question.scoreRequired'), trigger: 'blur'}
  ]
}))

const editFormRules = computed(() => ({
  questionTitle: [
    {required: true, message: t('course.question.questionTitleRequired'), trigger: 'blur'}
  ],
  questionContent: [
    {required: true, message: t('course.question.questionContentRequired'), trigger: 'blur'}
  ],
  questionType: [
    {required: true, type: 'number' as const, message: t('course.question.questionTypeRequired'), trigger: 'change'}
  ],
  difficulty: [
    {required: true, type: 'number' as const, message: t('course.question.difficultyRequired'), trigger: 'change'}
  ],
  score: [
    {required: true, type: 'number' as const, message: t('course.question.scoreRequired'), trigger: 'blur'}
  ]
}))

// 方法
const loadCourseInfo = async () => {
  await courseStore.setCurrentCourseId(courseId.value, true)
}

// 加载题目列表
const loadQuestionList = async (options?: { append?: boolean; showLoading?: boolean }) => {
  if (!questionBankId.value) return

  const append = options?.append ?? false
  const showLoading = options?.showLoading ?? true

  if (showLoading) {
    loading.value = true
  } else if (append) {
    isLoadingMore.value = true
  }
  try {
    const queryParams = getDefaultQuestionQuery()
    queryParams.questionBankId = questionBankId.value
    queryParams.questionTitle = searchForm.questionTitle
    queryParams.questionType = searchForm.questionType?.toString() || null
    queryParams.difficulty = searchForm.difficulty?.toString() || null
    queryParams.status = showDraft.value ? '0' : QuestionStatusEnum.PUBLISHED.toString()
    queryParams.sysUserId = showDraft.value ? (userStore.userInfo?.id || null) : null
    queryParams.pageNum = pagination.page
    queryParams.pageSize = pagination.pageSize

    const response = await listQuestion(queryParams)
    const currentData = response.data || []

    if (append && questionList.value.length > 0) {
      questionList.value = [...questionList.value, ...currentData]
    } else {
      questionList.value = currentData
    }
    updateSelectedQuestion(questionList.value)
    pagination.total = response.total || 0
    const currentCount = questionList.value.length
    hasMore.value = currentCount < pagination.total
  } catch (error) {
  } finally {
    if (showLoading) {
      loading.value = false
    }
    if (append) {
      isLoadingMore.value = false
    }
  }
}

const updateSelectedQuestion = (newList: QuestionVO[]) => {
  if (!newList || newList.length === 0) {
    selectedQuestion.value = null
    return
  }
  if (selectedQuestion.value) {
    const match = newList.find(item => item.id === selectedQuestion.value?.id)
    if (match) {
      selectedQuestion.value = match
      return
    }
  }
  selectedQuestion.value = newList[0]
}

const refreshQuestionList = async () => {
  pagination.page = 1
  await loadQuestionList()
}

const handleLoadMore = async () => {
  if (loading.value || isLoadingMore.value || !hasMore.value) {
    return
  }
  pagination.page += 1
  await loadQuestionList({append: true, showLoading: false})
}

// 搜索题目
const handleSearch = () => {
  refreshQuestionList()
}

// 重置搜索
const handleReset = () => {
  Object.assign(searchForm, {
    questionTitle: null,
    questionType: null,
    difficulty: null
  })
  refreshQuestionList()
}

// 天枢出题
const handleTianshuQuestion = (e?: MouseEvent) => {
  transitionStore.show()
  const action = () => {
    router.push({
      path: '/ai',
      query: {
        openSmartQuestion: 'true'
      }
    })
  }
  runViewTransition(action, e)
}

// 获取题目类型文本
const getQuestionTypeText = (type?: number | null) => {
  if (type === null || type === undefined) {
    return t('common.unknown')
  }
  const isEnLocale = locale.value === 'en-US'
  return getQuestionTypeLabel(type, isEnLocale)
}

// 获取难度文本
const getDifficultyText = (difficulty?: number | null) => {
  if (difficulty === null || difficulty === undefined || difficulty === 0) {
    return t('common.unknown')
  }
  const isEnLocale = locale.value === 'en-US'
  return getQuestionBankDifficultyLabel(difficulty, isEnLocale)
}

const getQuestionStatusText = (status?: number | null) => {
  if (status === 0) {
    return t('course.question.draft')
  }
  if (status === 1) {
    return t('course.question.published')
  }
  if (status === 2) {
    return t('course.question.disabled')
  }
  return t('common.unknown')
}

const formatScore = (score?: number | null) => {
  if (score === null || score === undefined) {
    return t('course.question.score') + t('common.colon')
  }
  return `${score} ${t('common.points')}`
}

const formatEstimatedTime = (time?: number | null) => {
  if (typeof time !== 'number' || time <= 0) {
    return t('course.question.unlimited')
  }
  return `${time} ${t('common.minutes')}`
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

const shouldDisplayAnswersSection = computed(() => {
  if (!selectedQuestion.value) {
    return false
  }
  if (!selectedQuestion.value.answers || selectedQuestion.value.answers.length === 0) {
    return false
  }
  return showAnswers.value
})

const toggleAnswerVisibility = () => {
  showAnswers.value = !showAnswers.value
}

const toggleDraftFilter = () => {
  showDraft.value = !showDraft.value
  refreshQuestionList()
}

// 题目管理方法
const handleAdd = () => {
  resetCreateForm()
  showCreateDialog.value = true
}

const handleSelectQuestion = async (question: QuestionVO) => {
  if (selectedQuestion.value && selectedQuestion.value.id === question.id) {
    return
  }
  try {
    const response = await getQuestionById(question.id)
    if (response.success || response.code === 200) {
      selectedQuestion.value = response.data
    }
  } catch (error) {
    selectedQuestion.value = question
  }
}

const handleEdit = async (question: QuestionVO) => {
  try {
    const response = await getQuestionById(question.id)
    if (response.success || response.code === 200) {
      const questionDetail = response.data
      selectedQuestion.value = questionDetail
      editingQuestion.value = questionDetail
      // 填充编辑表单
      editForm.value = {
        id: questionDetail.id,
        questionBankId: questionDetail.questionBankId,
        questionTitle: questionDetail.questionTitle,
        questionContent: questionDetail.questionContent,
        questionType: questionDetail.questionType,
        difficulty: questionDetail.difficulty,
        score: questionDetail.score,
        estimatedTime: questionDetail.estimatedTime || 0,
        tags: questionDetail.tags || [],
        imageUrls: questionDetail.imageUrls || null,
        allowPartialCredit: questionDetail.allowPartialCredit ?? 0,
        status: questionDetail.status || 0
      }

      // 如果有选项，填充选项数据
      if (questionDetail.options && questionDetail.options.length > 0) {
        editingOptions.value = questionDetail.options.map(option => ({
          id: option.id,
          questionId: option.questionId,
          optionContent: option.optionContent,
          optionLabel: option.optionLabel,
          isCorrect: option.isCorrect ?? 0,
          score: option.score || 0,
          imageUrls: option.imageUrls || null,
        }))
      } else {
        editingOptions.value = []
      }

      if (questionDetail.answers && questionDetail.answers.length > 0) {
        editingAnswers.value = questionDetail.answers.map((answer, index) => ({
          id: answer.id,
          questionId: answer.questionId,
          answerContent: answer.answerContent,
          explanation: answer.explanation ?? null,
          score: answer.score ?? null,
          sortOrder: answer.sortOrder ?? index + 1
        }))
      } else {
        editingAnswers.value = []
      }
      editForm.value.answers = editingAnswers.value.length > 0 ? [...editingAnswers.value] : null

      showEditDialog.value = true
    }
  } catch (error) {
    selectedQuestion.value = question
    editingQuestion.value = question
    // 填充编辑表单
    editForm.value = {
      id: question.id,
      questionBankId: question.questionBankId,
      questionTitle: question.questionTitle,
      questionContent: question.questionContent,
      questionType: question.questionType,
      difficulty: question.difficulty,
      score: question.score,
      estimatedTime: question.estimatedTime || 0,
      tags: question.tags || [],
      imageUrls: question.imageUrls || null,
      allowPartialCredit: question.allowPartialCredit ?? 0,
      status: question.status || 0
    }

    // 如果有选项，填充选项数据
    if (question.options && question.options.length > 0) {
      editingOptions.value = question.options.map(option => ({
        id: option.id,
        questionId: option.questionId,
        optionContent: option.optionContent,
        optionLabel: option.optionLabel,
        isCorrect: option.isCorrect ?? 0,
        score: option.score || 0,
        imageUrls: option.imageUrls || null,
      }))
    } else {
      editingOptions.value = []
    }

    if (question.answers && question.answers.length > 0) {
      editingAnswers.value = question.answers.map((answer, index) => ({
        id: answer.id,
        questionId: answer.questionId,
        answerContent: answer.answerContent,
        explanation: answer.explanation ?? null,
        score: answer.score ?? null,
        sortOrder: answer.sortOrder ?? index + 1
      }))
    } else {
      editingAnswers.value = []
    }
    editForm.value.answers = editingAnswers.value.length > 0 ? [...editingAnswers.value] : null

    showEditDialog.value = true
  }
}

const handleDelete = (question: QuestionVO) => {
  selectedQuestion.value = question
  dialog.warning({
    title: t('common.confirm'),
    content: t('course.question.confirmDelete'),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      try {
        await removeQuestionById(question.id)
        message.success(t('course.question.deleteSuccess'))
        await refreshQuestionList()
      } catch (error) {
      }
    }
  })
}

const handlePublish = async (question: QuestionVO) => {
  try {
    const questionDTO: QuestionDTO = {
      id: question.id,
      courseId: courseId.value,
      questionBankId: question.questionBankId,
      questionTitle: question.questionTitle,
      questionContent: question.questionContent,
      questionType: question.questionType,
      difficulty: question.difficulty,
      score: question.score,
      estimatedTime: question.estimatedTime || null,
      tags: question.tags,
      imageUrls: question.imageUrls || null,
      allowPartialCredit: question.allowPartialCredit ?? null,
      status: QuestionStatusEnum.PUBLISHED
    }
    await updateQuestion(questionDTO)
    message.success(t('course.question.publishSuccess'))
    await refreshQuestionList()
    if (selectedQuestion.value?.id === question.id) {
      const response = await getQuestionById(question.id)
      if (response.success || response.code === 200) {
        selectedQuestion.value = response.data
      }
    }
  } catch (error) {
  }
}

// 监听编辑对话框打开，自动获取最新数据
watch(showEditDialog, async (newVal) => {
  if (newVal && editingQuestion.value) {
    try {
      const response = await getQuestionById(editingQuestion.value.id)
      if (response.success || response.code === 200) {
        const questionDetail = response.data
        editingQuestion.value = questionDetail
        // 更新编辑表单
        editForm.value = {
          id: questionDetail.id,
          courseId: courseId.value,
          questionBankId: questionDetail.questionBankId,
          questionTitle: questionDetail.questionTitle,
          questionContent: questionDetail.questionContent,
          questionType: questionDetail.questionType,
          difficulty: questionDetail.difficulty,
          score: questionDetail.score,
          estimatedTime: questionDetail.estimatedTime || 0,
          tags: questionDetail.tags || [],
          imageUrls: questionDetail.imageUrls || null,
          allowPartialCredit: questionDetail.allowPartialCredit ?? 0,
          status: questionDetail.status || 0
        }

        // 更新选项数据
        if (questionDetail.options && questionDetail.options.length > 0) {
          editingOptions.value = questionDetail.options.map(option => ({
            id: option.id,
            questionId: option.questionId,
            optionContent: option.optionContent,
            optionLabel: option.optionLabel,
            isCorrect: option.isCorrect ?? 0,
            score: option.score || 0,
            imageUrls: option.imageUrls || null,
          }))
        } else {
          editingOptions.value = []
        }

        if (questionDetail.answers && questionDetail.answers.length > 0) {
          editingAnswers.value = questionDetail.answers.map((answer, index) => ({
            id: answer.id,
            questionId: answer.questionId,
            answerContent: answer.answerContent,
            explanation: answer.explanation ?? null,
            score: answer.score ?? null,
            sortOrder: answer.sortOrder ?? index + 1
          }))
        } else {
          editingAnswers.value = []
        }
        editForm.value.answers = editingAnswers.value.length > 0 ? [...editingAnswers.value] : null
      }
    } catch (error) {
      // 获取失败时保持原有数据
    }
  }
})

// 重置创建表单
const resetCreateForm = () => {
  createForm.value = getDefaultQuestionAddDTO()
  createForm.value.questionBankId = questionBankId.value
  createForm.value.status = 1 // 默认发布状态
  createForm.value.allowPartialCredit = 0
  questionOptions.value = []
  questionAnswers.value = []
  createForm.value.options = null
  createForm.value.answers = null
  createDialogRef.value?.restoreValidation()
}

// 取消创建
const handleCancelCreate = () => {
  showCreateDialog.value = false
}

// 确认创建（由 QuestionDialog 内部处理）
const handleConfirmCreate = () => {
  showCreateDialog.value = false
  createLoading.value = null
  resetCreateForm()
}

// 创建成功
const handleCreateSuccess = async () => {
  message.success(t('course.question.createSuccess'))
  await refreshQuestionList()
}

// 创建失败
const handleCreateError = () => {
  createLoading.value = null
}

// 保存编辑的题目
const saveEditQuestion = async () => {
  try {
    await editDialogRef.value?.validate()
    editLoading.value = true

    await updateQuestion(editForm.value)
    message.success(t('course.question.editSuccess'))

    // 关闭编辑对话框
    showEditDialog.value = false
    editingQuestion.value = null

    // 重新加载题目列表
    await refreshQuestionList()
  } catch (error) {
  } finally {
    editLoading.value = false
  }
}

// 取消编辑
const cancelEdit = () => {
  showEditDialog.value = false
  editingQuestion.value = null
  editForm.value = getDefaultQuestionDTO()
  editingOptions.value = []
  editingAnswers.value = []
  editForm.value.answers = null
  editDialogRef.value?.restoreValidation()
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


// 生命周期
onMounted(async () => {
  await loadCourseInfo()
  if (!questionBankId.value) {
    return
  }
  await loadQuestionList()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles' as *;

.question-list {
  background-color: var(--background-color);
  max-height: 100vh;

  .search-section {
    margin-bottom: 16px;

    .search-section-content {
      padding-right: 16px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;

      .n-form {
        flex: 1;
      }

      .n-button {
        flex-shrink: 0;
      }
    }
  }

  .question-page-content {
    display: flex;
    gap: 24px;
    align-items: flex-start;
  }

  .question-sidebar-container {
    flex: 0 0 35%;
    min-width: 360px;
    max-width: 480px;
    display: flex;
    flex-direction: column;
    padding-top: 12px;
  }

  .question-sidebar-scroll {
    flex: 1;
    height: calc(100vh - 220px);
    overflow-y: auto;
    padding-right: 6px;

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

  .question-detail-content {
    flex: 1;
    min-width: 0;
    padding: 12px 12px 12px 0;
    display: flex;
    flex-direction: column;
    height: calc(100vh - 220px);
    max-height: calc(100vh - 220px);

    .no-selection-card {
      background-color: var(--background-color);
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border: none;
      box-shadow: none;
    }

    .question-info-card {
      flex: 1;
      display: flex;
      flex-direction: column;
      border: none;
      box-shadow: none;
      background: var(--background-color);
      height: 100%;
      max-height: 100%;
      overflow: hidden;

      :deep(.n-card__content) {
        flex: 1;
        display: flex;
        flex-direction: column;
        padding: 0;
        height: 100%;
        overflow: hidden;
      }

      :deep(.n-spin) {
        flex: 1;
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
      }

      :deep(.n-spin-container) {
        flex: 1;
        display: flex;
        flex-direction: column;
        height: 100%;
        overflow: hidden;
      }

      :deep(.n-spin-content) {
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow-y: auto;
        padding: 0 16px 16px 16px;
        gap: 16px;
        height: 100%;

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
  .question-list {
    padding: 16px;

    .question-page-content {
      flex-direction: column;
      gap: 16px;
    }

    .question-sidebar-container {
      flex: 1;
      min-width: 0;
      max-width: 100%;
    }

    .question-sidebar-scroll {
      height: auto;
      padding-right: 0;
    }

    .search-section {
      .search-section-content {
        flex-direction: column;
        gap: 16px;
      }

      .n-form {
        .n-form-item {
          width: 100%;
        }
      }
    }

    .question-detail-content {
      padding: 0 12px 12px 12px;

      .question-info-card {
        :deep(.n-card__content) {
          padding-bottom: 0;
        }

        :deep(.n-spin-content) {
          padding: 12px;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .question-list {
    padding: 12px;
  }
}

// 模态框内容样式
.modal-content {
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;

  .fullscreen-form {
    flex: 1;
    overflow-y: auto;
    padding: 0 24px;

    .form-main-content {
      margin-bottom: 32px;

      .title-item {
        margin-bottom: 24px;
      }

      .content-item {
        :deep(.n-card__content) {
          padding: 0;
          height: calc(100vh - 200px);
          overflow: hidden;
        }
      }

      .n-form-item-label {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-color);
        margin-bottom: 12px;
      }

      .fullscreen-editor {
        :deep(.editor-content) {
          background-color: var(--background-color);
        }

        :deep(.ProseMirror) {
          background-color: var(--background-color);
          border: none;
          border-radius: 0;
        }
      }
    }

    .form-settings {
      border-top: 1px solid var(--border-color);
      padding-top: 24px;

      .n-form-item-label {
        font-size: 14px;
        font-weight: 500;
        color: var(--text-color);
        margin-bottom: 8px;
      }

      .n-row {
        margin-bottom: 16px;
      }
    }

  }

  .modal-actions {
    padding: 16px 24px;
    border-top: 1px solid var(--border-color);
    background: var(--card-color);
    display: flex;
    justify-content: flex-end;

    .n-space {
      .n-button {
        min-width: 100px;
        height: 40px;
        font-size: 14px;
        font-weight: 500;
      }
    }
  }
}

// 全屏对话框的模态框样式覆盖
.n-modal {
  &.n-modal--fullscreen {
    .n-card {
      border-radius: 0;
      box-shadow: none;
      height: 100vh;
      max-height: 100vh;

      .n-card-header {
        padding: 24px 24px 16px 24px;
        border-bottom: 1px solid var(--border-color);
        background: var(--card-color);

        .n-card-header__main {
          font-size: 20px;
          font-weight: 600;
          color: var(--text-color);
        }
      }

      .n-card__content {
        padding: 0;
        height: calc(100vh - 80px);
        overflow: hidden;
      }
    }
  }
}
</style>

<style lang="scss">
@use './CelestialHubQuestionButton.scss';
</style>
