<template>
  <div class="course-questions">
    <!-- 面包屑导航 -->
    <CourseBreadcrumb
        v-if="courseInfo"
        :course-info="courseInfo"
        :current-page="$t('course.navigation.questions')"
        :show-course-link="true"
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
          <n-form-item :label="$t('course.questionBank.bankName')">
            <n-input
                v-model:value="searchForm.bankName"
                :placeholder="$t('course.questionBank.bankNamePlaceholder')"
                clearable
                style="width: 200px"
            />
          </n-form-item>
          <n-form-item :label="$t('course.questionBank.bankType')">
            <n-select
                v-model:value="searchForm.bankType"
                :options="bankTypeOptions"
                :placeholder="$t('course.questionBank.bankTypePlaceholder')"
                clearable
                style="width: 180px"
            />
          </n-form-item>
          <n-form-item :label="$t('course.questionBank.difficulty')">
            <n-select
                v-model:value="searchForm.difficulty"
                :options="difficultyOptions"
                :placeholder="$t('course.questionBank.difficultyPlaceholder')"
                clearable
                style="width: 180px"
            />
          </n-form-item>
          <n-form-item :label="$t('course.questionBank.isPublic')">
            <n-select
                v-model:value="searchForm.isPublic"
                :options="isPublicOptions"
                :placeholder="$t('course.questionBank.isPublicPlaceholder')"
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

    <!-- 题库列表 -->
    <div class="question-bank-list">
      <!-- 加载状态 -->
      <n-spin :show="loading" size="large">
        <n-grid :cols="4" :x-gap="16" :y-gap="16">
          <n-gi v-for="bank in questionBankList" :key="bank.id">
            <QuestionBankCard
                :bank-data="bank"
                :clickable="true"
                @click="handleBankClick"
                @delete="handleDelete"
                @edit="handleEdit"
                @share="handleShare"
            />
          </n-gi>
        </n-grid>

        <!-- 空状态 -->
        <n-empty v-if="!loading && questionBankList.length === 0" :description="$t('course.questionBank.noData')">
          <template #extra>
            <n-button type="primary" @click="handleAdd">
              <template #icon>
                <n-icon>
                  <PlusOutlined/>
                </n-icon>
              </template>
              {{ $t('course.questionBank.createFirst') }}
            </n-button>
          </template>
        </n-empty>
      </n-spin>
    </div>

    <!-- 分页组件 -->
    <div v-if="questionBankList.length > 0" class="pagination-section">
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

    <!-- 添加/编辑题库对话框 -->
    <n-modal v-model:show="showModal" :title="modalTitle" preset="card" size="huge"
             style="width: 100vw; height: 100vh;">
      <n-form
          ref="formRef"
          :model="formData"
          :rules="formRules"
          label-placement="left"
          label-width="120px"
      >
        <n-form-item :label="$t('course.questionBank.bankName')" path="bankName">
          <n-input
              v-model:value="formData.bankName"
              :placeholder="$t('course.questionBank.bankNamePlaceholder')"
          />
        </n-form-item>
        <n-form-item :label="$t('course.questionBank.bankDescription')" path="description">
          <n-input
              v-model:value="formData.description"
              :placeholder="$t('course.questionBank.descriptionPlaceholder')"
              :rows="3"
              type="textarea"
          />
        </n-form-item>
        <n-form-item :label="$t('course.questionBank.bankType')" path="bankType">
          <n-select
              v-model:value="formData.bankType"
              :options="bankTypeOptions"
              :placeholder="$t('course.questionBank.bankTypePlaceholder')"
          />
        </n-form-item>
        <n-form-item :label="$t('course.questionBank.difficulty')" path="difficulty">
          <n-select
              v-model:value="formData.difficulty"
              :options="difficultyOptions"
              :placeholder="$t('course.questionBank.difficultyPlaceholder')"
          />
        </n-form-item>
        <n-form-item :label="$t('course.questionBank.tags')" path="tags">
          <n-dynamic-tags v-model:value="formData.tags as string[]"/>
        </n-form-item>
        <n-form-item :label="$t('course.questionBank.isPublic')" path="isPublic">
          <n-radio-group v-model:value="formData.isPublic">
            <n-radio
                v-for="option in isPublicOptions"
                :key="option.value"
                :value="option.value"
            >
              {{ option.label }}
            </n-radio>
          </n-radio-group>
        </n-form-item>
      </n-form>
      <template #action>
        <n-space justify="space-between" style="width: 100%;">
          <n-button @click="showModal = false">{{ $t('common.cancel') }}</n-button>
          <n-button type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRouter} from 'vue-router'
import {PlusOutlined, ReloadOutlined, SearchOutlined} from '@vicons/antd'
import type {FormInst, FormRules} from 'naive-ui'
import {
  NButton,
  NDynamicTags,
  NEmpty,
  NForm,
  NFormItem,
  NGi,
  NGrid,
  NIcon,
  NInput,
  NModal,
  NPagination,
  NRadio,
  NRadioGroup,
  NSelect,
  NSpace,
  NSpin,
  useDialog,
  useMessage
} from 'naive-ui'
import {
  addCourseQuestionBank,
  getDefaultCourseQuestionBankDTO,
  getDefaultCourseQuestionBankQuery,
  listCourseQuestionBank,
  removeCourseQuestionBankById,
  updateCourseQuestionBank
} from '@/api/course'
import type {CourseQuestionBankDTO, CourseQuestionBankVO} from '@/types/course'
import {getQuestionBankDifficultyOptions, getQuestionBankPublicOptions, getQuestionBankTypeOptions} from '@/enum/course'
import CourseBreadcrumb from '../../components/CourseBreadcrumb/CourseBreadcrumb.vue'
import QuestionBankCard from './QuestionBankCard.vue'
import {useCourseStore} from '@/store'

const {t} = useI18n()
const router = useRouter()
const message = useMessage()
const dialog = useDialog()
const courseStore = useCourseStore()

// 获取课程ID
const courseId = ref<string>(router.currentRoute.value.params.courseId as string)

// 响应式数据
const courseInfo = computed(() => courseStore.currentCourseInfo)
const showModal = ref(false)
const formRef = ref<FormInst | null>(null)
const isEdit = ref(false)
const currentEditBank = ref<CourseQuestionBankVO | null>(null)
const questionBankList = ref<CourseQuestionBankVO[]>([])
const loading = ref(false)

// 分页相关数据
const pagination = reactive({
  page: 1,
  pageSize: 12,
  total: 0,
  showSizePicker: true,
  pageSizes: [12, 24, 48, 96]
})


// 表单数据
const formData = reactive<CourseQuestionBankDTO>({
  id: null,
  courseId: null,
  bankName: null,
  description: null,
  bankType: null,
  tags: [],
  difficulty: null,
  isPublic: null
})

// 搜索表单数据
const searchForm = reactive({
  bankName: null,
  bankType: null,
  difficulty: null,
  isPublic: null
})


// 选项配置
const bankTypeOptions = getQuestionBankTypeOptions(t)
const difficultyOptions = getQuestionBankDifficultyOptions(t)
const isPublicOptions = getQuestionBankPublicOptions(t)


// 计算属性
const modalTitle = computed(() => isEdit.value ? t('common.edit') : t('common.add'))

// 表单验证规则
const formRules: FormRules = {
  bankName: [
    {required: true, message: t('course.questionBank.bankNameRequired'), trigger: 'blur'}
  ],
  bankType: [
    {required: true, type: 'number', message: t('course.questionBank.bankTypeRequired'), trigger: 'change'}
  ],
  difficulty: [
    {required: true, type: 'number', message: t('course.questionBank.difficultyRequired'), trigger: 'change'}
  ],
  isPublic: [
    {required: true, type: 'number', message: t('course.questionBank.isPublicRequired'), trigger: 'change'}
  ]
}


// 方法
const loadCourseInfo = async (courseId: string) => {
  await courseStore.setCurrentCourseId(courseId, true)
}

// 加载题库列表
const loadQuestionBankList = async () => {
  if (!courseId.value) return

  loading.value = true
  try {
    const queryParams = getDefaultCourseQuestionBankQuery()
    queryParams.courseId = courseId.value
    queryParams.bankName = searchForm.bankName
    queryParams.bankType = searchForm.bankType
    queryParams.difficulty = searchForm.difficulty
    queryParams.isPublic = searchForm.isPublic
    queryParams.pageNum = pagination.page
    queryParams.pageSize = pagination.pageSize

    const response = await listCourseQuestionBank(queryParams)
    questionBankList.value = response.data || []
    pagination.total = response.total || 0
  } catch (error) {
    message.error(t('common.loadError'))
  } finally {
    loading.value = false
  }
}

// 搜索题库
const handleSearch = () => {
  loadQuestionBankList()
}

// 重置搜索
const handleReset = () => {
  Object.assign(searchForm, {
    bankName: null,
    bankType: null,
    difficulty: null,
    isPublic: null
  })
  pagination.page = 1
  loadQuestionBankList()
}

// 处理题库卡片点击
const handleBankClick = (bankData: CourseQuestionBankVO) => {
  // 跳转到题目管理页面
  router.push(`/course/detail/${courseId.value}/questions/bank/${bankData.id}/questions`)
}

// 处理分享题库
const handleShare = (_bankData: CourseQuestionBankVO) => {
  // 功能待开发提示
  message.info(t('common.featureComingSoon'))
}

// 处理页码变化
const handlePageChange = (page: number) => {
  pagination.page = page
  loadQuestionBankList()
}

// 处理每页大小变化
const handlePageSizeChange = (pageSize: number) => {
  pagination.pageSize = pageSize
  pagination.page = 1
  loadQuestionBankList()
}


const handleAdd = () => {
  isEdit.value = false
  currentEditBank.value = null
  Object.assign(formData, getDefaultCourseQuestionBankDTO())
  formData.courseId = courseId.value
  showModal.value = true
}


// 处理编辑题库
const handleEdit = (bankData: CourseQuestionBankVO) => {
  isEdit.value = true
  currentEditBank.value = bankData

  // 填充表单数据
  Object.assign(formData, {
    id: bankData.id,
    courseId: bankData.courseId,
    bankName: bankData.bankName,
    description: bankData.description,
    bankType: bankData.bankType,
    tags: bankData.tags || [],
    difficulty: bankData.difficulty,
    isPublic: bankData.isPublic
  })

  showModal.value = true
}

// 处理删除题库
const handleDelete = async (bankData: CourseQuestionBankVO) => {
  dialog.warning({
    title: t('course.questionBank.deleteConfirm'),
    content: t('course.questionBank.deleteConfirmContent', {bankName: bankData.bankName}),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      try {
        const res = await removeCourseQuestionBankById(bankData.id)
        if (res.success || res.code === 200) {
          message.success(t('course.questionBank.deleteSuccess'))
          // 重新加载题库列表
          await loadQuestionBankList()
        }
      } catch (error) {
        message.error(t('course.questionBank.deleteFailed'))
      }
    }
  })
}

const handleSubmit = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()

    const submitData = {...formData}
    submitData.courseId = courseId.value

    if (isEdit.value) {
      await updateCourseQuestionBank(submitData)
      message.success(t('common.updateSuccess'))
    } else {
      await addCourseQuestionBank(submitData)
      message.success(t('common.addSuccess'))
    }

    showModal.value = false
    // 重新加载题库列表
    loadQuestionBankList()
  } catch (error) {
    message.error(t('common.submitError'))
  }
}


// 生命周期
onMounted(() => {
  // 加载课程信息
  if (courseId.value) {
    loadCourseInfo(courseId.value)
    loadQuestionBankList()
  }
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.course-questions {
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

  .question-bank-list {
    margin-top: 24px;
  }

  .pagination-section {
    display: flex;
    justify-content: center;
    margin-top: 24px;
    padding: 16px 0;
  }

}

// 响应式设计
@media (max-width: 768px) {
  .course-questions {
    padding: 16px;

    .page-header {
      flex-direction: column;
      gap: 16px;
      align-items: stretch;

      .header-actions {
        justify-content: flex-end;
      }
    }

    .search-section {
      .n-form {
        .n-form-item {
          width: 100%;
          margin-bottom: 12px;
        }
      }
    }

  }
}

@media (max-width: 480px) {
  .course-questions {
    padding: 12px;
  }
}
</style>

