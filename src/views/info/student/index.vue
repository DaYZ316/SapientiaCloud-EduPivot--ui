<template>
  <div class="student-management-container">
    <div class="page-header">
      <n-button circle quaternary @click="goBack">
        <template #icon>
          <Icon :component="ArrowBackOutline"/>
        </template>
      </n-button>
      <h1 class="page-title">{{ t('student.title') }}</h1>
    </div>

    <n-card size="small">
      <!-- 搜索表单 -->
      <n-form :model="searchForm" class="search-form" inline>
        <n-form-item :label="t('student.searchForm.studentCode')" path="studentCode">
          <n-input v-model:value="searchForm.studentCode" :placeholder="t('student.searchForm.studentCodePlaceholder')"
                   clearable/>
        </n-form-item>
        <n-form-item :label="t('student.searchForm.studentName')" path="realName">
          <n-input v-model:value="searchForm.realName" :placeholder="t('student.searchForm.studentNamePlaceholder')"
                   clearable/>
        </n-form-item>
        <n-form-item :label="t('student.searchForm.enrollmentYear')" path="admissionYear">
          <n-input-number
              v-model:value="searchForm.admissionYear"
              :placeholder="t('student.searchForm.enrollmentYearPlaceholder')"
              clearable
              style="min-width: 120px;"
          />
        </n-form-item>
        <n-form-item :label="t('student.searchForm.major')" path="major">
          <n-input v-model:value="searchForm.major" :placeholder="t('student.searchForm.majorPlaceholder')"
                   clearable/>
        </n-form-item>
        <n-form-item :label="t('student.searchForm.status')" path="academicStatus">
          <n-select
              v-model:value="searchForm.academicStatus"
              :options="academicStatusOptions"
              :placeholder="t('student.searchForm.statusPlaceholder')"
              clearable
              style="min-width: 120px;"
          />
        </n-form-item>
        <n-form-item :label="t('student.searchForm.createTimeRange')" path="createTimeRange">
          <n-date-picker
              v-model:value="createTimeRange"
              :placeholder="t('student.searchForm.createTimeRangePlaceholder')"
              clearable
              style="min-width: 300px;"
              type="datetimerange"
              @update:value="onDateRangeChange"
          />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" @click="handleSearch">
            <template #icon>
              <Icon :component="SearchOutline"/>
            </template>
            {{ t('common.search') }}
          </n-button>
          <n-button class="ml-2" @click="resetSearch">
            <template #icon>
              <Icon :component="RefreshOutline"/>
            </template>
            {{ t('common.reset') }}
          </n-button>
        </n-form-item>
      </n-form>

      <!-- 操作按钮 -->
      <div class="table-actions">
        <n-button type="primary" @click="handleAdd">
          <template #icon>
            <Icon :component="AddOutline"/>
          </template>
          {{ t('student.actions.add') }}
        </n-button>
      </div>

      <!-- 学生表格 -->
      <page-table
          ref="pageTableRef"
          :api-fn="studentApi.listStudent"
          :auto-search="false"
          :columns="columns"
          :query-params="searchForm"
          size="small"
          @update:data="onDataUpdate"
      />
    </n-card>

    <!-- 添加学生对话框 -->
    <n-modal v-model:show="showAddModal" :title="t('student.addStudent.title')" preset="card" style="width: 600px">
      <n-form
          ref="addFormRef"
          :model="addStudentForm"
          :style="{ maxWidth: '540px' }"
      >
        <n-form-item :label="t('student.addStudent.studentCode')" path="studentCode">
          <n-input
              v-model:value="addStudentForm.studentCode"
              :placeholder="t('student.addStudent.studentCodePlaceholder')"
          />
        </n-form-item>

        <n-form-item :label="t('student.addStudent.realName')" path="realName">
          <n-input
              v-model:value="addStudentForm.realName"
              :placeholder="t('student.addStudent.realNamePlaceholder')"
          />
        </n-form-item>

        <n-form-item :label="t('student.addStudent.birthDate')" path="birthDate">
          <n-date-picker
              v-model:value="addStudentForm.birthDate"
              :placeholder="t('student.addStudent.birthDatePlaceholder')"
              type="date"
          />
        </n-form-item>

        <n-form-item :label="t('student.addStudent.admissionYear')" path="admissionYear">
          <n-input-number
              v-model:value="addStudentForm.admissionYear"
              :placeholder="t('student.addStudent.admissionYearPlaceholder')"
          />
        </n-form-item>

        <n-form-item :label="t('student.addStudent.major')" path="major">
          <n-input
              v-model:value="addStudentForm.major"
              :placeholder="t('student.addStudent.majorPlaceholder')"
          />
        </n-form-item>

        <n-form-item :label="t('student.addStudent.academicStatus')" path="academicStatus">
          <n-select
              v-model:value="addStudentForm.academicStatus"
              :options="academicStatusOptions"
          />
        </n-form-item>

        <n-form-item :label="t('student.addStudent.description')" path="description">
          <n-input
              v-model:value="addStudentForm.description"
              :placeholder="t('student.addStudent.descriptionPlaceholder')"
              type="textarea"
          />
        </n-form-item>
      </n-form>

      <template #footer>
        <n-space justify="end">
          <n-button @click="closeAddModal">{{ t('student.addStudent.cancel') }}</n-button>
          <n-button :loading="submitting" type="primary" @click="submitAddStudent">
            {{ t('student.addStudent.submit') }}
          </n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 编辑学生对话框 -->
    <n-modal v-model:show="showEditModal" :title="t('student.editStudent.title')" preset="card" style="width: 600px">
      <n-form
          ref="editFormRef"
          :model="editStudentForm"
          :style="{ maxWidth: '540px' }"
      >
        <n-form-item :label="t('student.editStudent.studentCode')" path="studentCode">
          <n-input
              v-model:value="editStudentForm.studentCode"
              :placeholder="t('student.editStudent.studentCodePlaceholder')"
          />
        </n-form-item>

        <n-form-item :label="t('student.editStudent.realName')" path="realName">
          <n-input
              v-model:value="editStudentForm.realName"
              :placeholder="t('student.editStudent.realNamePlaceholder')"
          />
        </n-form-item>

        <n-form-item :label="t('student.editStudent.birthDate')" path="birthDate">
          <n-date-picker
              v-model:value="editStudentForm.birthDate"
              :placeholder="t('student.editStudent.birthDatePlaceholder')"
              type="date"
          />
        </n-form-item>

        <n-form-item :label="t('student.editStudent.admissionYear')" path="admissionYear">
          <n-input-number
              v-model:value="editStudentForm.admissionYear"
              :placeholder="t('student.editStudent.admissionYearPlaceholder')"
          />
        </n-form-item>

        <n-form-item :label="t('student.editStudent.major')" path="major">
          <n-input
              v-model:value="editStudentForm.major"
              :placeholder="t('student.editStudent.majorPlaceholder')"
          />
        </n-form-item>

        <n-form-item :label="t('student.editStudent.academicStatus')" path="academicStatus">
          <n-select
              v-model:value="editStudentForm.academicStatus"
              :options="academicStatusOptions"
          />
        </n-form-item>

        <n-form-item :label="t('student.editStudent.description')" path="description">
          <n-input
              v-model:value="editStudentForm.description"
              :placeholder="t('student.editStudent.descriptionPlaceholder')"
              type="textarea"
          />
        </n-form-item>
      </n-form>

      <template #footer>
        <n-space justify="end">
          <n-button @click="closeEditModal">{{ t('student.editStudent.cancel') }}</n-button>
          <n-button :loading="submitting" type="primary" @click="submitEditStudent">
            {{ t('student.editStudent.submit') }}
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import {computed, h, reactive, ref} from 'vue'
import {NEllipsis} from 'naive-ui'
import {
  AddOutline,
  ArrowBackOutline,
  CreateOutline,
  RefreshOutline,
  SearchOutline,
  TrashOutline
} from '@vicons/ionicons5'
import * as studentApi from '@/api/student'
import type * as studentType from '@/types/student'
import {AcademicStatus} from '@/types/student'
import {useI18n} from 'vue-i18n'
import {useRouter} from 'vue-router'
import Icon from '@/components/common/Icon.vue'
import {getDiscreteApi} from '@/utils/naiveUIHelper'
import {renderIcon} from '@/utils/iconUtil'
import {handleDateRangeChange} from '@/utils/dateUtil'

const {message, dialog} = getDiscreteApi()
const {t} = useI18n()
const router = useRouter()

// 是否为英文环境 (暂时保留，可能用于后续功能)
// const isEnglish = computed(() => locale.value === 'en-US')

// 学籍状态选项
const academicStatusOptions = computed(() => [
  {label: t('student.status.ACTIVE'), value: AcademicStatus.ENROLLED},
  {label: t('student.status.SUSPENDED'), value: AcademicStatus.SUSPENDED},
  {label: t('student.status.DROPPED'), value: AcademicStatus.DROPPED},
  {label: t('student.status.GRADUATED'), value: AcademicStatus.GRADUATED}
])

// 搜索表单
const searchForm = reactive<studentType.StudentQueryParams>(studentApi.getDefaultStudentQuery())

// 日期范围选择器
const createTimeRange = ref<[number, number] | null>(null)

// 学生列表数据
const studentList = ref<studentType.StudentVO[]>([])

// 分页表格引用
const pageTableRef = ref()

// 添加学生相关
const showAddModal = ref(false)
const submitting = ref(false)
const addFormRef = ref()

// 添加学生表单
const addStudentForm = reactive<studentType.StudentAddDTO>(studentApi.getDefaultStudentAddDTO())

// 编辑学生相关
const showEditModal = ref(false)
const editFormRef = ref()
const editStudentForm = reactive<studentType.StudentDTO>(studentApi.getDefaultStudentDTO())

// 返回上一页
function goBack() {
  router.back()
}

// 表格列定义
const columns = computed(() => [
  {title: t('student.table.studentCode'), key: 'studentCode'},
  {title: t('student.table.realName'), key: 'realName'},
  {title: t('student.table.admissionYear'), key: 'admissionYear'},
  {title: t('student.table.major'), key: 'major'},
  {
    title: t('student.table.academicStatus'),
    key: 'academicStatus',
    render(row: studentType.StudentVO) {
      return row.academicStatus !== null ? t(`student.status.${row.academicStatus}`) : '-'
    }
  },
  {
    title: t('student.table.description'),
    key: 'description',
    render(row: studentType.StudentVO) {
      return h(NEllipsis, {
        style: {maxWidth: '200px'}
      }, {
        default: () => row.description || '-',
        tooltip: () => row.description || '-'
      })
    }
  },
  {title: t('student.table.createTime'), key: 'createTime', width: 180},
  {
    title: t('student.table.actions'),
    key: 'actions',
    width: 200,
    render(row: studentType.StudentVO) {
      return [
        h(
            'button',
            {
              class: 'n-button n-button--text',
              style: {marginRight: '8px'},
              onClick: () => handleEdit(row)
            },
            [
              renderIcon(CreateOutline)(),
              ' ' + t('student.actions.edit')
            ]
        ),
        h(
            'button',
            {
              class: 'n-button n-button--text',
              onClick: () => handleDelete(row)
            },
            [
              renderIcon(TrashOutline)(),
              ' ' + t('student.actions.delete')
            ]
        )
      ]
    }
  }
])

// 搜索处理
function handleSearch() {
  pageTableRef.value?.fetchData()
}

// 重置搜索
function resetSearch() {
  Object.assign(searchForm, studentApi.getDefaultStudentQuery())
  createTimeRange.value = null
  pageTableRef.value?.reset()
}

// 处理日期范围变化
function onDateRangeChange(value: [number, number] | null) {
  handleDateRangeChange(value, (startTime, endTime) => {
    searchForm.startTime = startTime
    searchForm.endTime = endTime
  })
}

// 数据更新处理函数
function onDataUpdate(data: studentType.StudentVO[]) {
  studentList.value = data
}

// 删除学生
async function handleDelete(row: studentType.StudentVO) {
  if (!row.id) {
    message.error(t('student.messages.invalidId'))
    return
  }

  dialog.warning({
    title: t('student.actions.delete'),
    content: t('student.messages.deleteConfirm'),
    positiveText: t('student.actions.delete'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      try {
        await studentApi.removeStudentById(row.id!)
        message.success(t('student.messages.deleteSuccess'))
        pageTableRef.value?.fetchData()
      } catch (error) {
        message.error(t('student.messages.deleteFail'))
      }
    }
  })
}

// 重置添加学生表单
function resetAddStudentForm() {
  Object.assign(addStudentForm, studentApi.getDefaultStudentAddDTO())
}

// 关闭添加学生对话框
function closeAddModal() {
  showAddModal.value = false
  resetAddStudentForm()
}

// 提交添加学生
async function submitAddStudent() {
  submitting.value = true
  try {
    await studentApi.addStudent(addStudentForm)
    message.success(t('student.messages.addSuccess'))
    closeAddModal()
    pageTableRef.value?.fetchData()
  } catch (error) {
    message.error(t('student.messages.addFail'))
  } finally {
    submitting.value = false
  }
}

// 新增学生
function handleAdd() {
  resetAddStudentForm()
  showAddModal.value = true
}

// 编辑学生
async function handleEdit(row: studentType.StudentVO) {
  if (!row.id) {
    message.error(t('student.messages.invalidId'))
    return
  }

  try {
    const studentDetail = await studentApi.getStudentById(row.id!)
    Object.assign(editStudentForm, studentDetail?.data)
    showEditModal.value = true
  } catch (error) {
    message.error(t('student.messages.getDetailFail'))
  }
}

// 关闭编辑学生对话框
function closeEditModal() {
  showEditModal.value = false
  Object.assign(editStudentForm, studentApi.getDefaultStudentDTO())
}

// 提交编辑学生
async function submitEditStudent() {
  submitting.value = true
  try {
    await studentApi.updateStudent(editStudentForm)
    message.success(t('student.messages.editSuccess'))
    closeEditModal()
    pageTableRef.value?.fetchData()
  } catch (error) {
    message.error(t('student.messages.editFail'))
  } finally {
    submitting.value = false
  }
}
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
