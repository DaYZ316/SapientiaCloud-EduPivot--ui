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
        <n-button type="primary" @click="handleAdd">
          <template #icon>
            <n-icon>
              <PlusOutlined/>
            </n-icon>
          </template>
          {{ $t('common.add') }}
        </n-button>
      </template>
    </CourseBreadcrumb>

    <!-- 搜索和筛选区域 -->
    <div class="search-section">
      <div>
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
      </div>
    </div>

    <!-- 题目列表 -->
    <div class="question-list-content">
      <!-- 加载状态 -->
      <n-spin :show="loading" size="large">
        <n-list v-if="questionList.length > 0" bordered>
          <n-list-item v-for="question in questionList" :key="question.id">
            <n-thing>
              <template #header>
                <div class="question-header">
                  <div class="question-title-section">
                    <span class="question-title">{{ question.questionTitle }}</span>
                    <div class="question-stats">
                      <n-text depth="3" style="font-size: 12px;">
                        {{ $t('course.question.estimatedTime') }}: {{ question.estimatedTime || 0 }}
                        {{ $t('common.minutes') }}
                      </n-text>
                      <n-text depth="3" style="font-size: 12px; margin-left: 16px;">
                        {{ $t('course.question.viewCount') }}: {{ question.viewCount || 0 }}
                      </n-text>
                    </div>
                  </div>
                </div>
              </template>
              <template #header-extra>
                <div class="question-header-extra">
                  <div class="question-score">
                    <n-text strong type="primary">{{ question.score }} {{ $t('common.points') }}</n-text>
                  </div>
                  <div class="question-meta">
                    <n-tag :type="getQuestionTypeTagType(question.questionType) as any" size="small">
                      {{ getQuestionTypeText(question.questionType) }}
                    </n-tag>
                    <n-tag :type="getDifficultyTagType(question.difficulty) as any" size="small">
                      {{ getDifficultyText(question.difficulty) }}
                    </n-tag>
                  </div>
                </div>
              </template>
              <template #description>
                <div class="question-content" v-html="question.questionContent"></div>
                <div class="question-tags-actions">
                  <div v-if="question.tags && question.tags.length" class="question-tags">
                    <n-tag
                        v-for="tag in question.tags"
                        :key="tag"
                        size="tiny"
                        style="margin-right: 4px; margin-bottom: 2px;"
                        type="info"
                    >
                      {{ tag }}
                    </n-tag>
                  </div>
                  <div class="question-actions">
                    <n-space size="small">
                      <n-button
                          size="small"
                          text
                          type="primary"
                          @click="handleEdit(question)"
                      >
                        <template #icon>
                          <n-icon>
                            <EditOutlined/>
                          </n-icon>
                        </template>
                      </n-button>
                      <n-button
                          size="small"
                          text
                          type="error"
                          @click="handleDelete(question)"
                      >
                        <template #icon>
                          <n-icon>
                            <DeleteOutlined/>
                          </n-icon>
                        </template>
                      </n-button>
                      <n-button
                          size="small"
                          text
                          type="info"
                          @click="handleShare(question)"
                      >
                        <template #icon>
                          <n-icon>
                            <ShareAltOutlined/>
                          </n-icon>
                        </template>
                      </n-button>
                    </n-space>
                  </div>
                </div>
              </template>
            </n-thing>
          </n-list-item>
        </n-list>

        <!-- 空状态 -->
        <n-empty v-if="!loading && questionList.length === 0" :description="$t('course.question.noData')">
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
      </n-spin>
    </div>

    <!-- 分页组件 -->
    <div v-if="questionList.length > 0" class="pagination-section">
      <n-pagination
          v-model:page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="pagination.pageSizes"
          :show-size-picker="pagination.showSizePicker"
          :total="pagination.total"
          show-quick-jumper
          @update:page="handlePageChange"
          @update:page-size="handlePageSizeChange"
      />
    </div>

    <!-- 创建题目对话框 -->
    <n-modal
        v-model:show="showCreateDialog"
        :auto-focus="false"
        :bordered="false"
        :closable="true"
        :mask-closable="false"
        :style="{ width: '100vw', height: '100vh', maxWidth: 'none', maxHeight: 'none' }"
        :title="t('course.question.createQuestion')"
        preset="card"
        size="huge"
        transform-origin="center"
    >
      <div class="modal-content">
        <n-form
            ref="createFormRef"
            :model="createForm"
            :rules="createFormRules"
            class="fullscreen-form"
            label-placement="top"
            label-width="auto"
        >
          <!-- 标题和内容区域 -->
          <div class="form-main-content">
            <n-form-item :label="t('course.question.questionTitle')" class="title-item" path="questionTitle">
              <n-input
                  v-model:value="createForm.questionTitle"
                  :placeholder="t('course.question.questionTitlePlaceholder')"
                  size="large"
              />
            </n-form-item>

            <n-form-item :label="t('course.question.questionContent')" class="content-item" path="questionContent">
              <RichTextEditor
                  v-model="createQuestionContent"
                  :max-height="'400px'"
                  :min-height="'200px'"
                  :placeholder="t('course.question.questionContentPlaceholder')"
                  class="fullscreen-editor"
              />
            </n-form-item>
          </div>

          <!-- 其他设置区域 -->
          <div class="form-settings">
            <n-row :gutter="24">
              <n-col :span="8">
                <n-form-item :label="t('course.question.questionType')" path="questionType">
                  <n-select
                      v-model:value="createForm.questionType"
                      :options="questionTypeOptions"
                      :placeholder="t('course.question.questionTypePlaceholder')"
                      size="large"
                  />
                </n-form-item>
              </n-col>
              <n-col :span="8">
                <n-form-item :label="t('course.question.difficulty')" path="difficulty">
                  <n-select
                      v-model:value="createForm.difficulty"
                      :options="difficultyOptions"
                      :placeholder="t('course.question.difficultyPlaceholder')"
                      size="large"
                  />
                </n-form-item>
              </n-col>
              <n-col :span="8">
                <n-form-item :label="t('course.question.score')" path="score">
                  <n-input-number
                      v-model:value="createForm.score"
                      :max="100"
                      :min="0"
                      :placeholder="t('course.question.scorePlaceholder')"
                      size="large"
                      style="width: 100%"
                  />
                </n-form-item>
              </n-col>
            </n-row>

            <n-row :gutter="24">
              <n-col :span="8">
                <n-form-item :label="t('course.question.estimatedTime')">
                  <n-input-number
                      v-model:value="createForm.estimatedTime"
                      :max="120"
                      :min="1"
                      :placeholder="t('course.question.estimatedTimePlaceholder')"
                      size="large"
                      style="width: 100%"
                  />
                </n-form-item>
              </n-col>
              <n-col :span="8">
                <n-form-item :label="t('course.question.allowPartialCredit')">
                  <n-switch
                      v-model:value="createForm.allowPartialCredit as any"
                      :checked-value="1"
                      :unchecked-value="0"
                      size="large"
                  />
                </n-form-item>
              </n-col>
            </n-row>

            <n-form-item :label="t('course.question.tags')">
              <n-dynamic-tags
                  v-model:value="createForm.tags"
                  :placeholder="t('course.question.tagsPlaceholder')"
                  size="large"
              />
            </n-form-item>


          </div>

          <!-- 题目选项区域 -->
          <div v-if="createForm.questionType === 0 || createForm.questionType === 1" class="form-options">
            <div class="options-header">
              <h4>{{ t('course.question.options') }}</h4>
              <n-button type="primary" @click="addOption">
                <template #icon>
                  <n-icon>
                    <PlusOutlined/>
                  </n-icon>
                </template>
                {{ t('course.question.addOption') }}
              </n-button>
            </div>

            <div v-for="(option, index) in questionOptions" :key="index" class="option-item">
              <n-row :gutter="12" align="middle">
                <n-col :span="2">
                  <n-tag size="large" type="info">{{ option.optionLabel }}</n-tag>
                </n-col>
                <n-col :span="16">
                  <n-input
                      v-model:value="option.optionContent"
                      :placeholder="t('course.question.optionContentPlaceholder')"
                      size="large"
                  />
                </n-col>
                <n-col :span="4">
                  <n-switch
                      v-model:value="option.isCorrect as any"
                      :checked-value="1"
                      :unchecked-value="0"
                      size="large"
                  >
                    <template #checked>{{ t('course.question.correct') }}</template>
                    <template #unchecked>{{ t('course.question.incorrect') }}</template>
                  </n-switch>
                </n-col>
                <n-col :span="2">
                  <n-button
                      size="large"
                      type="error"
                      @click="removeOption(index)"
                  >
                    <template #icon>
                      <n-icon>
                        <DeleteOutlined/>
                      </n-icon>
                    </template>
                  </n-button>
                </n-col>
              </n-row>
            </div>
          </div>
        </n-form>

        <!-- 按钮区域 -->
        <div class="modal-actions">
          <n-space>
            <n-button @click="showCreateDialog = false">
              {{ t('common.cancel') }}
            </n-button>
            <n-button
                :loading="createLoading"
                type="primary"
                @click="createQuestion"
            >
              {{ t('common.confirm') }}
            </n-button>
          </n-space>
        </div>
      </div>
    </n-modal>

    <!-- 编辑题目对话框 -->
    <n-modal
        v-model:show="showEditDialog"
        :auto-focus="false"
        :bordered="false"
        :closable="true"
        :mask-closable="false"
        :style="{ width: '100vw', height: '100vh', maxWidth: 'none', maxHeight: 'none' }"
        :title="t('course.question.editQuestion')"
        preset="card"
        size="huge"
        transform-origin="center"
    >
      <div class="modal-content">
        <n-form
            ref="editFormRef"
            :model="editForm"
            :rules="editFormRules"
            class="fullscreen-form"
            label-placement="top"
            label-width="auto"
        >
          <!-- 标题和内容区域 -->
          <div class="form-main-content">
            <n-form-item :label="t('course.question.questionTitle')" class="title-item" path="questionTitle">
              <n-input
                  v-model:value="editForm.questionTitle"
                  :placeholder="t('course.question.questionTitlePlaceholder')"
                  size="large"
              />
            </n-form-item>

            <n-form-item :label="t('course.question.questionContent')" class="content-item" path="questionContent">
              <RichTextEditor
                  v-model="editQuestionContent"
                  :max-height="'400px'"
                  :min-height="'200px'"
                  :placeholder="t('course.question.questionContentPlaceholder')"
                  class="fullscreen-editor"
              />
            </n-form-item>
          </div>

          <!-- 其他设置区域 -->
          <div class="form-settings">
            <n-row :gutter="24">
              <n-col :span="8">
                <n-form-item :label="t('course.question.questionType')" path="questionType">
                  <n-select
                      v-model:value="editForm.questionType"
                      :options="questionTypeOptions"
                      :placeholder="t('course.question.questionTypePlaceholder')"
                      size="large"
                  />
                </n-form-item>
              </n-col>
              <n-col :span="8">
                <n-form-item :label="t('course.question.difficulty')" path="difficulty">
                  <n-select
                      v-model:value="editForm.difficulty"
                      :options="difficultyOptions"
                      :placeholder="t('course.question.difficultyPlaceholder')"
                      size="large"
                  />
                </n-form-item>
              </n-col>
              <n-col :span="8">
                <n-form-item :label="t('course.question.score')" path="score">
                  <n-input-number
                      v-model:value="editForm.score"
                      :max="100"
                      :min="0"
                      :placeholder="t('course.question.scorePlaceholder')"
                      size="large"
                      style="width: 100%"
                  />
                </n-form-item>
              </n-col>
            </n-row>

            <n-row :gutter="24">
              <n-col :span="8">
                <n-form-item :label="t('course.question.estimatedTime')">
                  <n-input-number
                      v-model:value="editForm.estimatedTime"
                      :max="120"
                      :min="1"
                      :placeholder="t('course.question.estimatedTimePlaceholder')"
                      size="large"
                      style="width: 100%"
                  />
                </n-form-item>
              </n-col>
              <n-col :span="8">
                <n-form-item :label="t('course.question.allowPartialCredit')">
                  <n-switch
                      v-model:value="editForm.allowPartialCredit as any"
                      :checked-value="1"
                      :unchecked-value="0"
                      size="large"
                  />
                </n-form-item>
              </n-col>
            </n-row>

            <n-form-item :label="t('course.question.tags')">
              <n-dynamic-tags
                  v-model:value="editForm.tags"
                  :placeholder="t('course.question.tagsPlaceholder')"
                  size="large"
              />
            </n-form-item>


          </div>

          <!-- 题目选项区域 -->
          <div v-if="editForm.questionType === 0 || editForm.questionType === 1" class="form-options">
            <div class="options-header">
              <h4>{{ t('course.question.options') }}</h4>
              <n-button type="primary" @click="addEditOption">
                <template #icon>
                  <n-icon>
                    <PlusOutlined/>
                  </n-icon>
                </template>
                {{ t('course.question.addOption') }}
              </n-button>
            </div>

            <div v-for="(option, index) in editingOptions" :key="index" class="option-item">
              <n-row :gutter="12" align="middle">
                <n-col :span="2">
                  <n-tag size="large" type="info">{{ option.optionLabel }}</n-tag>
                </n-col>
                <n-col :span="16">
                  <n-input
                      v-model:value="option.optionContent"
                      :placeholder="t('course.question.optionContentPlaceholder')"
                      size="large"
                  />
                </n-col>
                <n-col :span="4">
                  <n-switch
                      v-model:value="option.isCorrect as any"
                      :checked-value="1"
                      :unchecked-value="0"
                      size="large"
                  >
                    <template #checked>{{ t('course.question.correct') }}</template>
                    <template #unchecked>{{ t('course.question.incorrect') }}</template>
                  </n-switch>
                </n-col>
                <n-col :span="2">
                  <n-button
                      size="large"
                      type="error"
                      @click="removeEditOption(index)"
                  >
                    <template #icon>
                      <n-icon>
                        <DeleteOutlined/>
                      </n-icon>
                    </template>
                  </n-button>
                </n-col>
              </n-row>
            </div>
          </div>
        </n-form>

        <!-- 按钮区域 -->
        <div class="modal-actions">
          <n-space>
            <n-button :disabled="editLoading" @click="cancelEdit">
              {{ t('common.cancel') }}
            </n-button>
            <n-button
                :loading="editLoading"
                type="primary"
                @click="saveEditQuestion"
            >
              {{ t('common.save') }}
            </n-button>
          </n-space>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRoute} from 'vue-router'
import {
  DeleteOutlined,
  EditOutlined,
  PlusOutlined,
  ReloadOutlined,
  SearchOutlined,
  ShareAltOutlined
} from '@vicons/antd'
import {
  NButton,
  NCol,
  NDynamicTags,
  NEmpty,
  NForm,
  NFormItem,
  NIcon,
  NInput,
  NInputNumber,
  NList,
  NListItem,
  NModal,
  NPagination,
  NRow,
  NSelect,
  NSpace,
  NSpin,
  NSwitch,
  NTag,
  NText,
  NThing,
  useDialog,
  useMessage
} from 'naive-ui'
import {getCourseById, getDefaultQuestionQuery, listQuestion} from '@/api/course'
import {addQuestion, getDefaultQuestionDTO, removeQuestionById, updateQuestion} from '@/api/course/question'
import {addQuestionOptions, getDefaultQuestionOptionDTO} from '@/api/course/questionOption'
import type {CourseVO, QuestionDTO, QuestionVO} from '@/types/course'
import type {QuestionOptionDTO} from '@/types/course/questionOption'
import {
  getQuestionBankDifficultyLabel,
  getQuestionBankDifficultyOptions,
  getQuestionTypeLabel,
  getQuestionTypeOptions
} from '@/enum/course'
import CourseBreadcrumb from '@/views/course/components/CourseBreadcrumb/CourseBreadcrumb.vue'
import RichTextEditor from '@/components/common/RichTextEditor.vue'

const {t} = useI18n()
const route = useRoute()
const message = useMessage()
const dialog = useDialog()

// 获取路由参数
const courseId = ref<string>(route.params.courseId as string)
const questionBankId = ref<string>(route.params.bankId as string)
const courseInfo = ref<CourseVO | null>(null)
const questionList = ref<QuestionVO[]>([])
const loading = ref(false)

// 分页相关数据
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100]
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
const createLoading = ref(false)
const editLoading = ref(false)
const editingQuestion = ref<QuestionVO | null>(null)

// 表单数据
const createForm = ref<QuestionDTO>(getDefaultQuestionDTO())
const editForm = ref<QuestionDTO>(getDefaultQuestionDTO())

// 表单引用
const createFormRef = ref()
const editFormRef = ref()

// 题目选项管理
const questionOptions = ref<QuestionOptionDTO[]>([])
const editingOptions = ref<QuestionOptionDTO[]>([])

// 计算属性用于RichTextEditor
const createQuestionContent = computed({
  get: () => createForm.value.questionContent || '',
  set: (value: string) => {
    createForm.value.questionContent = value
  }
})

const editQuestionContent = computed({
  get: () => editForm.value.questionContent || '',
  set: (value: string) => {
    editForm.value.questionContent = value
  }
})


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
  try {
    const response = await getCourseById(courseId.value)
    courseInfo.value = response.data
  } catch (error) {
    message.error(t('common.loadError'))
  }
}

// 加载题目列表
const loadQuestionList = async (showLoading = true) => {
  if (!questionBankId.value) return

  if (showLoading) {
    loading.value = true
  }
  try {
    const queryParams = getDefaultQuestionQuery()
    queryParams.questionBankId = questionBankId.value
    queryParams.questionTitle = searchForm.questionTitle
    queryParams.questionType = searchForm.questionType?.toString() || null
    queryParams.difficulty = searchForm.difficulty?.toString() || null
    queryParams.pageNum = pagination.page
    queryParams.pageSize = pagination.pageSize

    const response = await listQuestion(queryParams)
    questionList.value = response.data || []
    pagination.total = response.total || 0
  } catch (error) {
    message.error(t('common.loadError'))
  } finally {
    if (showLoading) {
      loading.value = false
    }
  }
}

// 搜索题目
const handleSearch = () => {
  pagination.page = 1
  loadQuestionList()
}

// 重置搜索
const handleReset = () => {
  Object.assign(searchForm, {
    questionTitle: null,
    questionType: null,
    difficulty: null
  })
  pagination.page = 1
  loadQuestionList()
}

// 处理页码变化
const handlePageChange = (page: number) => {
  pagination.page = page
  loadQuestionList()
}

// 处理每页大小变化
const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.page = 1
  loadQuestionList()
}

// 获取题目类型文本
const getQuestionTypeText = (type: number) => {
  return getQuestionTypeLabel(type)
}

// 获取难度文本
const getDifficultyText = (difficulty: number) => {
  return getQuestionBankDifficultyLabel(difficulty)
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

// 题目管理方法
const handleAdd = () => {
  resetCreateForm()
  showCreateDialog.value = true
}

const handleEdit = (question: QuestionVO) => {
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

  showEditDialog.value = true
}

const handleDelete = (question: QuestionVO) => {
  dialog.warning({
    title: t('common.confirm'),
    content: t('course.question.confirmDelete'),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      try {
        await removeQuestionById(question.id)
        message.success(t('course.question.deleteSuccess'))
        await loadQuestionList()
      } catch (error) {
        message.error(t('course.question.deleteFailed'))
      }
    }
  })
}

const handleShare = (question: QuestionVO) => {
  // 生成分享链接
  const shareUrl = `${window.location.origin}/course/${courseId.value}/question-bank/${questionBankId.value}/question/${question.id}`

  // 复制到剪贴板
  navigator.clipboard.writeText(shareUrl).then(() => {
    message.success(t('course.question.shareLinkCopied'))
  }).catch(() => {
    // 如果复制失败，显示链接让用户手动复制
    dialog.info({
      title: t('course.question.shareQuestion'),
      content: t('course.question.shareLink') + ': ' + shareUrl,
      positiveText: t('common.confirm')
    })
  })
}

// 重置创建表单
const resetCreateForm = () => {
  createForm.value = getDefaultQuestionDTO()
  createForm.value.questionBankId = questionBankId.value
  createForm.value.status = 1 // 默认发布状态
  createForm.value.allowPartialCredit = 0
  questionOptions.value = []
}

// 创建题目
const createQuestion = async () => {
  if (!createFormRef.value) return

  try {
    await createFormRef.value.validate()
    createLoading.value = true

    // 创建题目
    const response = await addQuestion(createForm.value)
    if (response.code === 200) {
      const questionId = response.data?.id

      // 如果有选项，创建选项
      if (questionOptions.value.length > 0 && questionId) {
        const optionsToCreate = questionOptions.value.map(option => ({
          ...option,
          questionId: questionId
        }))
        await addQuestionOptions(optionsToCreate)
      }

      message.success(t('course.question.createSuccess'))
      showCreateDialog.value = false
      resetCreateForm()
      await loadQuestionList()
    } else {
      message.error(response.message || t('course.question.createFailed'))
    }
  } catch (error) {
    message.error(t('course.question.createFailed'))
  } finally {
    createLoading.value = false
  }
}

// 保存编辑的题目
const saveEditQuestion = async () => {
  if (!editFormRef.value) return

  try {
    await editFormRef.value.validate()
    editLoading.value = true

    await updateQuestion(editForm.value)
    message.success(t('course.question.editSuccess'))

    // 关闭编辑对话框
    showEditDialog.value = false
    editingQuestion.value = null

    // 重新加载题目列表
    await loadQuestionList()
  } catch (error) {
    message.error(t('course.question.editFailed'))
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
}

// 添加选项
const addOption = () => {
  const newOption = getDefaultQuestionOptionDTO()
  newOption.optionLabel = String.fromCharCode(65 + questionOptions.value.length) // A, B, C, D...
  questionOptions.value.push(newOption)
}

// 删除选项
const removeOption = (index: number) => {
  questionOptions.value.splice(index, 1)
  // 重新设置选项标签
  questionOptions.value.forEach((option, idx) => {
    option.optionLabel = String.fromCharCode(65 + idx)
  })
}

// 添加编辑选项
const addEditOption = () => {
  const newOption = getDefaultQuestionOptionDTO()
  newOption.optionLabel = String.fromCharCode(65 + editingOptions.value.length) // A, B, C, D...
  editingOptions.value.push(newOption)
}

// 删除编辑选项
const removeEditOption = (index: number) => {
  editingOptions.value.splice(index, 1)
  // 重新设置选项标签
  editingOptions.value.forEach((option, idx) => {
    option.optionLabel = String.fromCharCode(65 + idx)
  })
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
  loading.value = true
  try {
    await loadCourseInfo()
    if (questionBankId.value) {
      await loadQuestionList(false) // 不显示重复的loading
    }
  } finally {
    loading.value = false
  }
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.question-list {
  background-color: var(--background-color);
  min-height: 100vh;

  .search-section {
    margin-bottom: 24px;

    .n-form {
      .n-form-item {
        margin-bottom: 16px;
      }
    }
  }

  .question-list-content {
    margin-top: 24px;
    width: 30%;
    margin-right: auto;

    .question-header {
      display: flex;
      align-items: flex-start;
      margin-bottom: 8px;

      .question-title-section {
        flex: 1;

        .question-title {
          font-size: 16px;
          font-weight: 600;
          color: var(--text-color);
          display: block;
          margin-bottom: 4px;
        }

        .question-stats {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
        }
      }
    }

    .question-header-extra {
      display: flex;
      flex-direction: column;
      align-items: flex-end;
      gap: 8px;

      .question-score {
        margin-bottom: 4px;
      }

      .question-meta {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        justify-content: flex-end;
      }
    }

    .question-score {
      text-align: right;
    }

    .question-content {
      margin-bottom: 12px;
      line-height: 1.6;
      color: var(--text-color);
      max-height: 60px;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      line-clamp: 3;
      -webkit-box-orient: vertical;
    }

    .question-tags-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 8px;
    }

    .question-tags {
      flex: 1;
    }

    .question-actions {
      flex-shrink: 0;
      margin-left: 12px;
    }

  }

  .pagination-section {
    display: flex;
    justify-content: center;
    margin-top: 24px;
    width: 30%;
    margin-right: auto;
    padding: 16px 0;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .question-list {
    padding: 16px;

    .search-section {
      .n-form {
        .n-form-item {
          width: 100%;
          margin-bottom: 12px;
        }
      }
    }

    .question-list-content {
      width: 100%;
      margin-right: 0;

      .question-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;

        .question-title-section {
          margin-right: 0;
          width: 100%;

          .question-stats {
            margin-top: 4px;
          }
        }
      }

      .question-header-extra {
        align-items: flex-start;
        width: 100%;

        .question-meta {
          justify-content: flex-start;
        }
      }

      .question-tags-actions {
        flex-direction: column;
        align-items: flex-start;
      }

      .question-actions {
        margin-left: 0;
        margin-top: 8px;
        align-self: flex-end;
      }
    }

    .pagination-section {
      width: 100%;
      margin-right: 0;
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

    .form-options {
      border-top: 1px solid var(--border-color);
      padding-top: 24px;
      margin-top: 24px;

      .options-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 16px;

        h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--text-color);
        }
      }

      .option-item {
        margin-bottom: 16px;
        padding: 16px;
        background: var(--card-color);
        border-radius: 8px;
        border: 1px solid var(--border-color);

        &:hover {
          border-color: var(--primary-color);
        }
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
