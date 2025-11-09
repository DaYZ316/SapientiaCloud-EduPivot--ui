<template>
  <div class="course-questions">
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
    <div class="search-and-actions">
      <!-- 批量操作栏 -->
      <div v-if="selectedQuestionIds.length > 0" class="batch-actions-bar">
        <div class="batch-info">
          <span>{{ t('course.question.selectedCount', { count: selectedQuestionIds.length }) }}</span>
        </div>
        <n-button type="error" @click="handleBatchDelete">
          <template #icon>
            <n-icon>
              <DeleteOutlined/>
            </n-icon>
          </template>
          {{ t('course.question.batchDelete') }}
        </n-button>
      </div>
      <div class="search-section">
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

    <!-- 主要内容区域：左右分栏布局 -->
    <div class="main-content">
      <!-- 左侧题目列表 -->
      <n-card class="questions-sidebar">
        <div class="sidebar-header">
          <n-checkbox
              :checked="isAllSelected"
              :indeterminate="isIndeterminate"
              @update:checked="handleSelectAll"
          >
            {{ t('common.selectAll') }}
          </n-checkbox>
        </div>
        <QuestionListSidebar
            ref="sidebarRef"
            :loading="loading"
            :selected-question-id="selectedQuestionId"
            :questions="questionList"
            :pagination="sidebarPagination"
            @select="handleQuestionSelect"
            @page-change="handleSidebarPageChange"
            @selection-change="handleSelectionChange"
            @update="handleQuestionUpdate"
        />
      </n-card>

      <!-- 右侧题目详情 -->
      <n-card class="question-detail">
        <QuestionDetail
            :course-id="courseId"
            :question="selectedQuestion"
            @delete="handleQuestionDelete"
            @edit="handleQuestionEdit"
            @update="handleQuestionUpdate"
        />
      </n-card>
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

          <!-- 题目选项区域（选择题） -->
          <div v-if="createForm.questionType === 0 || createForm.questionType === 1" ref="formOptionsRef" class="form-options">
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

            <div v-for="(option, index) in questionOptions" :key="index" :ref="el => { if (el && index === questionOptions.length - 1) lastOptionItemRef = el as HTMLElement }" class="option-item">
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
                      @update:value="handleChoiceCorrectChange"
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
            <div v-if="choiceAnswerError" ref="choiceAnswerErrorRef" class="answer-error">
              <n-text type="error">{{ choiceAnswerError }}</n-text>
            </div>
          </div>

          <!-- 判断题答案录入区域 -->
          <div v-if="createForm.questionType === 2" class="form-answer">
            <div class="answer-header">
              <h4>{{ t('course.question.trueFalseAnswer') }}</h4>
            </div>
            <n-form-item :label="t('course.question.trueFalseAnswer')" path="trueFalseAnswer">
              <n-radio-group
                  v-model:value="trueFalseAnswer"
                  size="large"
                  @update:value="() => { trueFalseAnswerError = '' }"
              >
                <n-space>
                  <n-radio :value="true" :label="t('course.question.trueOption')">
                    {{ t('course.question.trueOption') }}
                  </n-radio>
                  <n-radio :value="false" :label="t('course.question.falseOption')">
                    {{ t('course.question.falseOption') }}
                  </n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
            <div v-if="trueFalseAnswerError" class="answer-error">
              <n-text type="error">{{ trueFalseAnswerError }}</n-text>
            </div>
          </div>

          <!-- 填空题答案录入区域 -->
          <div v-if="createForm.questionType === 3" ref="fillBlankAnswerRef" class="form-answer">
            <div class="answer-header">
              <h4>{{ t('course.question.fillBlankAnswer') }}</h4>
            </div>
            <n-form-item path="fillBlankAnswer">
              <n-input
                  v-model:value="fillBlankAnswer"
                  :placeholder="t('course.question.fillBlankAnswerPlaceholder')"
                  size="large"
                  type="textarea"
                  :rows="3"
                  @update:value="() => { fillBlankAnswerError = '' }"
              />
            </n-form-item>
            <div v-if="fillBlankAnswerError" class="answer-error">
              <n-text type="error">{{ fillBlankAnswerError }}</n-text>
            </div>
          </div>

          <!-- 简答题答案录入区域 -->
          <div v-if="createForm.questionType === 4" ref="shortAnswerRef" class="form-answer">
            <div class="answer-header">
              <h4>{{ t('course.question.shortAnswerContent') }}</h4>
            </div>
            <n-form-item path="shortAnswerContent">
              <n-input
                  v-model:value="shortAnswerContent"
                  :placeholder="t('course.question.shortAnswerContentPlaceholder')"
                  size="large"
                  type="textarea"
                  :rows="6"
                  @update:value="() => { shortAnswerError = '' }"
              />
            </n-form-item>
            <div v-if="shortAnswerError" class="answer-error">
              <n-text type="error">{{ shortAnswerError }}</n-text>
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

          <!-- 题目选项区域（选择题） -->
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

          <!-- 判断题答案录入区域 -->
          <div v-if="editForm.questionType === 2" class="form-answer">
            <div class="answer-header">
              <h4>{{ t('course.question.trueFalseAnswer') }}</h4>
            </div>
            <n-form-item path="editTrueFalseAnswer">
              <n-radio-group
                  v-model:value="editTrueFalseAnswer"
                  size="large"
                  @update:value="() => { editTrueFalseAnswerError = '' }"
              >
                <n-space>
                  <n-radio :value="true" :label="t('course.question.trueOption')">
                    {{ t('course.question.trueOption') }}
                  </n-radio>
                  <n-radio :value="false" :label="t('course.question.falseOption')">
                    {{ t('course.question.falseOption') }}
                  </n-radio>
                </n-space>
              </n-radio-group>
            </n-form-item>
            <div v-if="editTrueFalseAnswerError" class="answer-error">
              <n-text type="error">{{ editTrueFalseAnswerError }}</n-text>
            </div>
          </div>

          <!-- 题目答案区域（填空题、简答题） -->
          <div v-if="editForm.questionType === 3 || editForm.questionType === 4" class="form-answers">
            <div class="answers-header">
              <h4>{{ t('course.question.answers') }}</h4>
            </div>

            <div v-for="(answer, index) in editingAnswers" :key="index" class="answer-item">
              <n-form-item :label="t('course.question.answerContent')">
                <n-input
                    v-model:value="answer.answerContent"
                    :placeholder="t('course.question.answerContentPlaceholder')"
                    :rows="3"
                    size="large"
                    type="textarea"
                />
              </n-form-item>
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
import {computed, nextTick, onMounted, reactive, ref, watch} from 'vue'
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
  NCheckbox,
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
  NRadio,
  NRadioGroup,
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
import {addQuestion, getDefaultQuestionDTO, removeQuestionById, removeQuestionByIds, updateQuestion} from '@/api/course/question'
import {
  addQuestionOption,
  getDefaultQuestionOptionDTO,
  listAllQuestionOptionByQuestionId,
  removeQuestionOptionById,
  updateQuestionOption
} from '@/api/course/questionOption'
import {addQuestionAnswers, getDefaultQuestionAnswerDTO, listAllQuestionAnswerByQuestionId, updateQuestionAnswer, removeQuestionAnswerById} from '@/api/course/questionAnswer'
import type {CourseVO, QuestionDTO, QuestionVO} from '@/types/course'
import type {QuestionOptionDTO} from '@/types/course/questionOption'
import type {QuestionAnswerDTO} from '@/types/course/questionAnswer'
import {useUserStore} from '@/store'
import {
  getQuestionBankDifficultyLabel,
  getQuestionBankDifficultyOptions,
  getQuestionTypeLabel,
  getQuestionTypeOptions
} from '@/enum/course'
import CourseBreadcrumb from '@/views/course/components/CourseBreadcrumb/CourseBreadcrumb.vue'
import RichTextEditor from '@/components/common/RichTextEditor.vue'
import QuestionListSidebar from './QuestionListSidebar.vue'
import QuestionDetail from './QuestionDetail.vue'

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
const selectedQuestion = ref<QuestionVO | null>(null)
const selectedQuestionId = ref<string | null>(null)
const selectedQuestionIds = ref<string[]>([])
const sidebarRef = ref<InstanceType<typeof QuestionListSidebar> | null>(null)

// 分页相关数据（用于搜索区域，如果需要的话）
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100]
})

// 左侧栏分页相关数据（每页5条）
const sidebarPagination = reactive({
  page: 1,
  pageSize: 5,
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
const createLoading = ref(false)
const editLoading = ref(false)
const editingQuestion = ref<QuestionVO | null>(null)

// 表单数据
const createForm = ref<QuestionDTO>(getDefaultQuestionDTO())
const editForm = ref<QuestionDTO>(getDefaultQuestionDTO())

// 表单引用
const createFormRef = ref()
const editFormRef = ref()

// 区域引用（用于自动滚动）
const formOptionsRef = ref<HTMLElement | null>(null)
const fillBlankAnswerRef = ref<HTMLElement | null>(null)
const shortAnswerRef = ref<HTMLElement | null>(null)
const choiceAnswerErrorRef = ref<HTMLElement | null>(null)
const lastOptionItemRef = ref<HTMLElement | null>(null)

// 题目选项管理
const questionOptions = ref<QuestionOptionDTO[]>([])
const editingOptions = ref<QuestionOptionDTO[]>([])

// 题目答案管理
const editingAnswers = ref<QuestionAnswerDTO[]>([])

// 答案录入相关状态
// 判断题答案（创建题目用）
const trueFalseAnswer = ref<boolean>(true) // 默认为正确
const trueFalseAnswerError = ref<string>('')

// 判断题答案（编辑题目用）
const editTrueFalseAnswer = ref<boolean>(true) // 默认为正确
const editTrueFalseAnswerError = ref<string>('')

// 填空题答案
const fillBlankAnswer = ref<string>('')
const fillBlankAnswerError = ref<string>('')

// 简答题答案
const shortAnswerContent = ref<string>('')
const shortAnswerError = ref<string>('')

// 选择题答案错误提示
const choiceAnswerError = ref<string>('')

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
    // 使用左侧栏的分页参数
    queryParams.pageNum = sidebarPagination.page
    queryParams.pageSize = sidebarPagination.pageSize

    const response = await listQuestion(queryParams)
    questionList.value = response.data || []
    sidebarPagination.total = response.total || 0

    // 如果存在题目，自动选择第一个题目
    if (questionList.value.length > 0 && !selectedQuestion.value) {
      const firstQuestion = questionList.value[0]
      selectedQuestionId.value = firstQuestion.id
      selectedQuestion.value = firstQuestion
    }
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
  sidebarPagination.page = 1
  loadQuestionList()
}

// 重置搜索
const handleReset = () => {
  Object.assign(searchForm, {
    questionTitle: null,
    questionType: null,
    difficulty: null
  })
  sidebarPagination.page = 1
  loadQuestionList()
}

// 处理左侧栏页码变化
const handleSidebarPageChange = (page: number) => {
  sidebarPagination.page = page
  loadQuestionList()
}

// 处理页码变化（保留，以防其他地方使用）
const handlePageChange = (page: number) => {
  sidebarPagination.page = page
  loadQuestionList()
}

// 处理每页大小变化（保留，以防其他地方使用）
const handlePageSizeChange = (pageSize: number) => {
  sidebarPagination.pageSize = pageSize
  sidebarPagination.page = 1
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

// 题目选择处理
const handleQuestionSelect = (question: QuestionVO) => {
  selectedQuestionId.value = question.id
  selectedQuestion.value = question
}

// 题目更新处理
const handleQuestionUpdate = () => {
  // 重新加载题目列表
  loadQuestionList()
}

// 批量选择相关
const isAllSelected = computed(() => {
  return questionList.value.length > 0 && selectedQuestionIds.value.length === questionList.value.length
})

const isIndeterminate = computed(() => {
  return selectedQuestionIds.value.length > 0 && selectedQuestionIds.value.length < questionList.value.length
})

// 处理全选
const handleSelectAll = (checked: boolean) => {
  if (checked) {
    const allIds = questionList.value.map(q => q.id)
    selectedQuestionIds.value = allIds
    // 通知sidebar更新选择状态
    if (sidebarRef.value && sidebarRef.value.setSelection) {
      sidebarRef.value.setSelection(allIds)
    }
  } else {
    selectedQuestionIds.value = []
    // 通知sidebar清空选择
    if (sidebarRef.value && sidebarRef.value.clearSelection) {
      sidebarRef.value.clearSelection()
    }
  }
}

// 处理选择变化
const handleSelectionChange = (selectedIds: string[]) => {
  selectedQuestionIds.value = selectedIds
}

// 批量删除
const handleBatchDelete = () => {
  if (selectedQuestionIds.value.length === 0) return

  dialog.warning({
    title: t('common.confirm'),
    content: t('course.question.batchDeleteConfirm', { count: selectedQuestionIds.value.length }),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      try {
        await removeQuestionByIds(selectedQuestionIds.value)
        message.success(t('course.question.batchDeleteSuccess', { count: selectedQuestionIds.value.length }))
        selectedQuestionIds.value = []
        if (sidebarRef.value) {
          sidebarRef.value.clearSelection()
        }
        // 清空当前选中的题目
        selectedQuestion.value = null
        selectedQuestionId.value = null
        await loadQuestionList()
      } catch (error) {
        message.error(t('course.question.batchDeleteFailed'))
      }
    }
  })
}

// 题目编辑处理
const handleQuestionEdit = (question: QuestionVO) => {
  handleEdit(question)
}

// 题目删除处理
const handleQuestionDelete = async (question: QuestionVO) => {
  await handleDelete(question)
  // 清空当前选中的题目
  selectedQuestion.value = null
  selectedQuestionId.value = null
}

const handleEdit = async (question: QuestionVO) => {
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

  // 加载选项数据（选择题、判断题）
  if (question.questionType === 0 || question.questionType === 1 || question.questionType === 2) {
    try {
      // 如果题目对象中已有选项数据，直接使用
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
        // 如果没有选项数据，从 API 加载
        const optionsResponse = await listAllQuestionOptionByQuestionId(question.id)
        if (optionsResponse.data && optionsResponse.data.length > 0) {
          editingOptions.value = optionsResponse.data.map(option => ({
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
      }
    } catch (error) {
      message.error(t('common.loadError'))
      editingOptions.value = []
    }
  } else {
    editingOptions.value = []
  }

  // 加载答案数据（判断题、填空题、简答题）
  if (question.questionType === 2 || question.questionType === 3 || question.questionType === 4) {
    try {
      const response = await listAllQuestionAnswerByQuestionId(question.id)
      if (response.data && response.data.length > 0) {
        editingAnswers.value = response.data.map(answer => ({
          id: answer.id,
          questionId: answer.questionId,
          answerContent: answer.answerContent,
          answerText: answer.answerText,
          isCorrect: answer.isCorrect,
          score: answer.score
        }))
        
        // 如果是判断题，从答案中提取正确/错误值
        if (question.questionType === 2 && response.data.length > 0) {
          const firstAnswer = response.data[0]
          // 判断答案内容是"正确"还是"错误"
          const answerText = firstAnswer.answerText || firstAnswer.answerContent || ''
          const trueOptionText = t('course.question.trueOption')
          // 检查答案文本是否包含"正确"或等于"正确"
          editTrueFalseAnswer.value = answerText.includes(trueOptionText) || answerText === '正确' || answerText.trim() === trueOptionText
        }
      } else {
        // 如果没有答案，创建一个默认答案
        if (question.questionType === 2) {
          // 判断题默认答案为正确
          editTrueFalseAnswer.value = true
        } else {
          editingAnswers.value = [{
            id: null,
            questionId: question.id,
            answerContent: '',
            answerText: '',
            isCorrect: 1,
            score: question.score || 0
          }]
        }
      }
    } catch (error) {
      message.error(t('common.loadError'))
      if (question.questionType === 2) {
        editTrueFalseAnswer.value = true
      } else {
        editingAnswers.value = []
      }
    }
  } else {
    editingAnswers.value = []
  }

  showEditDialog.value = true
}

const handleDelete = (question: QuestionVO) => {
  dialog.warning({
    title: t('common.confirm'),
    content: t('course.question.deleteConfirmContent'),
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
  // 重置答案录入状态
  trueFalseAnswer.value = true
  trueFalseAnswerError.value = ''
  fillBlankAnswer.value = ''
  fillBlankAnswerError.value = ''
  shortAnswerContent.value = ''
  shortAnswerError.value = ''
  choiceAnswerError.value = ''
}

// 监听题型变化，重置答案录入状态
watch(() => createForm.value.questionType, (newType) => {
  // 切换题型时清空答案录入状态
  trueFalseAnswer.value = true
  trueFalseAnswerError.value = ''
  fillBlankAnswer.value = ''
  fillBlankAnswerError.value = ''
  shortAnswerContent.value = ''
  shortAnswerError.value = ''
  choiceAnswerError.value = ''
  questionOptions.value = []
})

// 选择题答案验证
const handleChoiceCorrectChange = () => {
  choiceAnswerError.value = ''
  const qt = Number(createForm.value.questionType)
  if (qt === 0 || qt === 1) {
    const validOptions = questionOptions.value.filter(opt => !!opt.optionLabel && !!opt.optionContent && opt.optionContent.trim())
    const correctOptions = validOptions.filter(opt => opt.isCorrect === 1)
    
    if (qt === 0 && correctOptions.length !== 1) {
      // 单选题必须有一个正确选项
      if (validOptions.length >= 2) {
        choiceAnswerError.value = t('course.question.singleChoiceMustHaveOneCorrect')
      }
    } else if (qt === 1 && correctOptions.length < 1) {
      // 多选题必须至少有一个正确选项
      if (validOptions.length >= 2) {
        choiceAnswerError.value = t('course.question.multipleChoiceMustHaveAtLeastOneCorrect')
      }
    }
  }
}

// 验证答案数据
const validateAnswer = async (): Promise<boolean> => {
  const qt = Number(createForm.value.questionType)
  
  // 清空所有错误提示
  choiceAnswerError.value = ''
  trueFalseAnswerError.value = ''
  fillBlankAnswerError.value = ''
  shortAnswerError.value = ''
  
  // 选择题验证
  if (qt === 0 || qt === 1) {
    const validOptions = questionOptions.value.filter(opt => !!opt.optionLabel && !!opt.optionContent && opt.optionContent.trim())
    if (validOptions.length < 2) {
      choiceAnswerError.value = t('course.question.optionsMinRequired')
      await nextTick()
      if (choiceAnswerErrorRef.value) {
        choiceAnswerErrorRef.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return false
    }
    
    const correctOptions = validOptions.filter(opt => opt.isCorrect === 1)
    if (qt === 0 && correctOptions.length !== 1) {
      choiceAnswerError.value = t('course.question.singleChoiceMustHaveOneCorrect')
      await nextTick()
      if (choiceAnswerErrorRef.value) {
        choiceAnswerErrorRef.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return false
    }
    if (qt === 1 && correctOptions.length < 1) {
      choiceAnswerError.value = t('course.question.multipleChoiceMustHaveAtLeastOneCorrect')
      await nextTick()
      if (choiceAnswerErrorRef.value) {
        choiceAnswerErrorRef.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return false
    }
  }
  
  // 判断题验证
  if (qt === 2) {
    // 判断题答案已默认设置，无需验证
  }
  
  // 填空题验证
  if (qt === 3) {
    if (!fillBlankAnswer.value || !fillBlankAnswer.value.trim()) {
      fillBlankAnswerError.value = t('course.question.fillBlankAnswerRequired')
      await nextTick()
      if (fillBlankAnswerRef.value) {
        fillBlankAnswerRef.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return false
    }
  }
  
  // 简答题验证
  if (qt === 4) {
    if (!shortAnswerContent.value || !shortAnswerContent.value.trim()) {
      shortAnswerError.value = t('course.question.shortAnswerContentRequired')
      await nextTick()
      if (shortAnswerRef.value) {
        shortAnswerRef.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
      return false
    }
  }
  
  return true
}

// 组装答案数据
const buildAnswerData = (questionId: string): QuestionAnswerDTO[] => {
  const qt = Number(createForm.value.questionType)
  const answers: QuestionAnswerDTO[] = []
  
  // 选择题答案
  if (qt === 0 || qt === 1) {
    const validOptions = questionOptions.value.filter(opt => !!opt.optionLabel && !!opt.optionContent && opt.optionContent.trim())
    const correctOptions = validOptions.filter(opt => opt.isCorrect === 1)
    
    correctOptions.forEach(option => {
      answers.push({
        id: null,
        questionId: questionId,
        answerContent: `${option.optionLabel}: ${option.optionContent}`,
        answerText: option.optionContent,
        isCorrect: 1,
        score: option.score ?? 0
      })
    })
  }
  
  // 判断题答案
  if (qt === 2) {
    const answerLabel = trueFalseAnswer.value ? t('course.question.trueOption') : t('course.question.falseOption')
    const answerText = answerLabel
    const answerContent = `${answerLabel}: ${answerText}`
    
    answers.push({
      id: null,
      questionId: questionId,
      answerContent: answerContent,
      answerText: answerText,
      isCorrect: 1,
      score: createForm.value.score ?? 0
    })
  }
  
  // 填空题答案
  if (qt === 3) {
    answers.push({
      id: null,
      questionId: questionId,
      answerContent: fillBlankAnswer.value.trim(),
      answerText: fillBlankAnswer.value.trim(),
      isCorrect: 1,
      score: createForm.value.score ?? 0
    })
  }
  
  // 简答题答案
  if (qt === 4) {
    answers.push({
      id: null,
      questionId: questionId,
      answerContent: shortAnswerContent.value.trim(),
      answerText: shortAnswerContent.value.trim(),
      isCorrect: 1, // 简答题默认为完全正确
      score: createForm.value.score ?? 0
    })
  }
  
  return answers
}

// 创建题目
const createQuestion = async () => {
  if (!createFormRef.value) return

  try {
    await createFormRef.value.validate()
    createLoading.value = true

    // 检查登录态并获取用户ID
    const userStore = useUserStore()
    if (!userStore.userInfo?.id) {
      await userStore.refreshUserInfo()
    }
    const sysUserId = userStore.userInfo?.id
    if (!sysUserId) {
      message.error(t('common.http.unauthorized'))
      return
    }

    // 富文本内容兜底校验
    if (!createForm.value.questionContent || !createForm.value.questionContent.trim()) {
      message.error(t('course.question.questionContentRequired'))
      createLoading.value = false
      return
    }

    const qt = Number(createForm.value.questionType)

    // 验证答案数据
    if (!(await validateAnswer())) {
      createLoading.value = false
      return
    }

    // 创建题目
    const payload: any = { ...createForm.value, sysUserId }
    
    // 选择题、判断题：将选项直接包含在 payload 中，后端会自动保存
    if (qt === 0 || qt === 1) {
      const optionsToCreate = questionOptions.value
        .filter(opt => !!opt.optionLabel && !!opt.optionContent && opt.optionContent.trim())
        .map(option => ({
          id: null,
          questionId: null, // 后端会自动设置
          optionContent: option.optionContent,
          optionLabel: option.optionLabel,
          isCorrect: option.isCorrect ?? 0,
          score: option.score ?? null,
          imageUrls: option.imageUrls && option.imageUrls.length ? option.imageUrls : null
        }))
      
      if (optionsToCreate.length > 0) {
        payload.options = optionsToCreate
      }
    } else if (qt === 2) {
      // 判断题：自动创建两个选项（正确、错误）
      const trueLabel = t('course.question.trueOption')
      const falseLabel = t('course.question.falseOption')
      payload.options = [
        {
          id: null,
          questionId: null, // 后端会自动设置
          optionContent: trueLabel,
          optionLabel: 'A',
          isCorrect: trueFalseAnswer.value ? 1 : 0,
          score: null,
          imageUrls: null
        },
        {
          id: null,
          questionId: null, // 后端会自动设置
          optionContent: falseLabel,
          optionLabel: 'B',
          isCorrect: trueFalseAnswer.value ? 0 : 1,
          score: null,
          imageUrls: null
        }
      ]
    }
    
    const response = await addQuestion(payload)
    if (response.code === 200) {
      const questionId = response.data?.id

      if (questionId !== undefined && questionId) {
        // 创建答案（所有题型都需要答案，多选题可能有多个答案）
        try {
          const answersToCreate = buildAnswerData(questionId)
          if (answersToCreate.length > 0) {
            await addQuestionAnswers(answersToCreate)
          }
        } catch (_) {
          message.warning(t('common.submitError'))
        }
      }

      message.success(t('course.question.createSuccess'))
      showCreateDialog.value = false
      resetCreateForm()
      await loadQuestionList()
      
      // 自动选中新创建的题目
      if (questionId !== undefined && questionId) {
        const newQuestion = questionList.value.find(q => q.id === questionId)
        if (newQuestion) {
          selectedQuestionId.value = newQuestion.id
          selectedQuestion.value = newQuestion
        }
      }
    } else {
      message.error(response.message || '提交失败')
    }
  } catch (error: any) {
    const errMsg = (error && (error.message || error.msg)) || '提交失败'
    message.error(errMsg)
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

    // 更新题目基本信息
    await updateQuestion(editForm.value)

    const questionId = editForm.value.id
    const qt = Number(editForm.value.questionType)

    // 保存选项数据（选择题、判断题）
    if (qt === 0 || qt === 1 || qt === 2) {
      try {
        // 获取现有的选项ID列表
        const existingOptionIds: string[] = []
        const optionsToUpdate: QuestionOptionDTO[] = []
        const optionsToCreate: QuestionOptionDTO[] = []

        editingOptions.value.forEach(option => {
          const optionData = {
            ...option,
            questionId: questionId
          }
          
          if (option.id) {
            // 更新现有选项
            existingOptionIds.push(option.id)
            optionsToUpdate.push(optionData)
          } else {
            // 创建新选项
            optionsToCreate.push({
              ...optionData,
              isCorrect: option.isCorrect ?? 0,
              score: option.score ?? null,
              imageUrls: option.imageUrls || null
            })
          }
        })

        // 更新现有选项
        for (const option of optionsToUpdate) {
          await updateQuestionOption(option)
        }

        // 创建新选项
        for (const option of optionsToCreate) {
          await addQuestionOption(option)
        }

        // 获取所有现有选项，删除不在编辑列表中的选项
        const allOptionsResponse = await listAllQuestionOptionByQuestionId(questionId)
        if (allOptionsResponse.data) {
          const optionsToDelete = allOptionsResponse.data
            .filter(option => !existingOptionIds.includes(option.id))
            .map(option => option.id!)
          
          if (optionsToDelete.length > 0) {
            await Promise.all(optionsToDelete.map(id => removeQuestionOptionById(id)))
          }
        }
      } catch (error) {
        message.warning(t('course.question.saveOptionsFailed'))
      }
    }

    // 保存答案数据（判断题、填空题、简答题）
    if (qt === 2 || qt === 3 || qt === 4) {
      try {
        if (qt === 2) {
          // 判断题：根据单选按钮的值保存答案
          const answerLabel = editTrueFalseAnswer.value ? t('course.question.trueOption') : t('course.question.falseOption')
          const answerText = answerLabel
          const answerContent = `${answerLabel}: ${answerText}`
          
          // 获取现有答案
          const allAnswersResponse = await listAllQuestionAnswerByQuestionId(questionId)
          const existingAnswers = allAnswersResponse.data || []
          
          if (existingAnswers.length > 0) {
            // 更新第一个答案
            const firstAnswer = existingAnswers[0]
            await updateQuestionAnswer({
              id: firstAnswer.id,
              questionId: questionId,
              answerContent: answerContent,
              answerText: answerText,
              isCorrect: 1,
              score: firstAnswer.score ?? editForm.value.score ?? 0
            })
            
            // 删除其他答案（如果有）
            if (existingAnswers.length > 1) {
              const answersToDelete = existingAnswers.slice(1).map(answer => answer.id!)
              if (answersToDelete.length > 0) {
                await Promise.all(answersToDelete.map(id => removeQuestionAnswerById(id)))
              }
            }
          } else {
            // 创建新答案
            await addQuestionAnswers([{
              id: null,
              questionId: questionId,
              answerContent: answerContent,
              answerText: answerText,
              isCorrect: 1,
              score: editForm.value.score ?? 0
            }])
          }
        } else {
          // 填空题、简答题：使用原有的答案保存逻辑
          if (editingAnswers.value.length > 0) {
            // 获取现有的答案ID列表
            const existingAnswerIds: string[] = []
            const answersToUpdate: QuestionAnswerDTO[] = []
            const answersToCreate: QuestionAnswerDTO[] = []

            editingAnswers.value.forEach(answer => {
              // 确保 answerText 有值（使用 answerContent 的值）
              const answerData = {
                ...answer,
                answerText: answer.answerText || answer.answerContent || '',
                questionId: questionId
              }
              
              if (answer.id) {
                // 更新现有答案
                existingAnswerIds.push(answer.id)
                answersToUpdate.push(answerData)
              } else {
                // 创建新答案
                answersToCreate.push({
                  ...answerData,
                  isCorrect: answer.isCorrect ?? 1,
                  score: answer.score ?? editForm.value.score ?? 0
                })
              }
            })

            // 更新现有答案
            for (const answer of answersToUpdate) {
              await updateQuestionAnswer(answer)
            }

            // 创建新答案
            if (answersToCreate.length > 0) {
              await addQuestionAnswers(answersToCreate)
            }

            // 获取所有现有答案，删除不在编辑列表中的答案
            const allAnswersResponse = await listAllQuestionAnswerByQuestionId(questionId)
            if (allAnswersResponse.data) {
              const answersToDelete = allAnswersResponse.data
                .filter(answer => !existingAnswerIds.includes(answer.id))
                .map(answer => answer.id!)
              
              if (answersToDelete.length > 0) {
                await Promise.all(answersToDelete.map(id => removeQuestionAnswerById(id)))
              }
            }
          }
        }
      } catch (error) {
        message.warning(t('course.question.saveAnswersFailed'))
      }
    }

    message.success(t('course.question.editSuccess'))

    // 关闭编辑对话框
    showEditDialog.value = false
    editingQuestion.value = null

    // 重新加载题目列表
    await loadQuestionList()
    
    // 如果当前选中的题目被编辑，更新选中的题目
    if (selectedQuestion.value && selectedQuestion.value.id === editForm.value.id) {
      const updatedQuestion = questionList.value.find(q => q.id === editForm.value.id)
      if (updatedQuestion) {
        selectedQuestion.value = updatedQuestion
      }
    }
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
  editingAnswers.value = []
  editTrueFalseAnswer.value = true
  editTrueFalseAnswerError.value = ''
}

// 添加选项
const addOption = async () => {
  const newOption = getDefaultQuestionOptionDTO()
  newOption.optionLabel = String.fromCharCode(65 + questionOptions.value.length) // A, B, C, D...
  questionOptions.value.push(newOption)
  
  // 自动滚动到新添加的选项
  await nextTick()
  if (lastOptionItemRef.value) {
    lastOptionItemRef.value.scrollIntoView({ behavior: 'smooth', block: 'center' })
  } else if (formOptionsRef.value) {
    formOptionsRef.value.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }
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
@use './QuestionList.scss';

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

      .answer-error {
        margin-top: 8px;
        padding: 8px 12px;
        background: var(--error-color-light);
        border-radius: 4px;
        border-left: 3px solid var(--error-color);
      }
    }

    .form-answers {
      border-top: 1px solid var(--border-color);
      padding-top: 24px;
      margin-top: 24px;

      .answers-header {
        margin-bottom: 16px;

        h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--text-color);
        }
      }

      .answer-item {
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

    .form-answer {
      border-top: 1px solid var(--border-color);
      padding-top: 24px;
      margin-top: 24px;

      .answer-header {
        margin-bottom: 16px;

        h4 {
          margin: 0;
          font-size: 16px;
          font-weight: 600;
          color: var(--text-color);
        }
      }

      .answer-error {
        margin-top: 8px;
        padding: 8px 12px;
        background: var(--error-color-light);
        border-radius: 4px;
        border-left: 3px solid var(--error-color);
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
