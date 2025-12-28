<template>
  <div class="teacher-management-container">
    <PageHeader :title="t('teacher.title')"/>

    <n-card size="small">
      <!-- 搜索表单 -->
      <n-form :model="searchForm" class="search-form" inline>
        <n-form-item :label="t('teacher.searchForm.teacherCode')" path="teacherCode">
          <n-input v-model:value="searchForm.teacherCode" :placeholder="t('teacher.searchForm.teacherCodePlaceholder')"
                   clearable/>
        </n-form-item>
        <n-form-item :label="t('teacher.searchForm.teacherName')" path="realName">
          <n-input v-model:value="searchForm.realName" :placeholder="t('teacher.searchForm.teacherNamePlaceholder')"
                   clearable/>
        </n-form-item>
        <n-form-item :label="t('teacher.searchForm.department')" path="department">
          <n-input v-model:value="searchForm.department" :placeholder="t('teacher.searchForm.departmentPlaceholder')"
                   clearable/>
        </n-form-item>
        <n-form-item :label="t('teacher.searchForm.education')" path="education">
          <n-select
              v-model:value="searchForm.education"
              :options="educationOptions"
              :placeholder="t('teacher.searchForm.educationPlaceholder')"
              clearable
              style="min-width: 120px;"
          />
        </n-form-item>
        <n-form-item :label="t('teacher.searchForm.createTimeRange')" path="createTimeRange">
          <n-date-picker
              v-model:value="createTimeRange"
              :placeholder="t('teacher.searchForm.createTimeRangePlaceholder')"
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
          {{ t('teacher.actions.add') }}
        </n-button>
      </div>

      <!-- 教师表格 -->
      <page-table
          ref="pageTableRef"
          :api-fn="teacherApi.listTeacher"
          :auto-search="false"
          :columns="columns"
          :query-params="searchForm"
          size="small"
          @update:data="onDataUpdate"
      />
    </n-card>

    <!-- 添加教师对话框 -->
    <n-modal v-model:show="showAddModal" :title="t('teacher.dialog.addTitle')" preset="card" style="width: 600px">
      <n-form
          ref="addFormRef"
          :model="addTeacherForm"
          :style="{ maxWidth: '540px' }"
      >
        <n-form-item :label="t('teacher.dialog.teacherCode')" path="teacherCode">
          <n-input
              v-model:value="addTeacherForm.teacherCode"
              :placeholder="t('teacher.dialog.teacherCodePlaceholder')"
          />
        </n-form-item>

        <n-form-item :label="t('teacher.dialog.teacherName')" path="realName">
          <n-input
              v-model:value="addTeacherForm.realName"
              :placeholder="t('teacher.dialog.teacherNamePlaceholder')"
          />
        </n-form-item>


        <n-form-item :label="t('teacher.dialog.department')" path="department">
          <n-input
              v-model:value="addTeacherForm.department"
              :placeholder="t('teacher.dialog.departmentPlaceholder')"
          />
        </n-form-item>

        <n-form-item :label="t('teacher.dialog.education')" path="education">
          <n-select
              v-model:value="addTeacherForm.education"
              :options="educationOptions"
          />
        </n-form-item>

      </n-form>

      <template #footer>
        <n-space justify="end">
          <n-button @click="closeAddModal">{{ t('common.cancel') }}</n-button>
          <n-button :loading="submitting" type="primary" @click="submitAddTeacher">
            {{ t('common.submit') }}
          </n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 编辑教师对话框 -->
    <n-modal v-model:show="showEditModal" :title="t('teacher.dialog.editTitle')" preset="card" style="width: 600px">
      <n-form
          ref="editFormRef"
          :model="editTeacherForm"
          :style="{ maxWidth: '540px' }"
      >
        <n-form-item :label="t('teacher.dialog.teacherCode')" path="teacherCode">
          <n-input
              v-model:value="editTeacherForm.teacherCode"
              :placeholder="t('teacher.dialog.teacherCodePlaceholder')"
          />
        </n-form-item>

        <n-form-item :label="t('teacher.dialog.teacherName')" path="realName">
          <n-input
              v-model:value="editTeacherForm.realName"
              :placeholder="t('teacher.dialog.teacherNamePlaceholder')"
          />
        </n-form-item>


        <n-form-item :label="t('teacher.dialog.department')" path="department">
          <n-input
              v-model:value="editTeacherForm.department"
              :placeholder="t('teacher.dialog.departmentPlaceholder')"
          />
        </n-form-item>

        <n-form-item :label="t('teacher.dialog.education')" path="education">
          <n-select
              v-model:value="editTeacherForm.education"
              :options="educationOptions"
          />
        </n-form-item>

      </n-form>

      <template #footer>
        <n-space justify="end">
          <n-button @click="closeEditModal">{{ t('common.cancel') }}</n-button>
          <n-button :loading="submitting" type="primary" @click="submitEditTeacher">
            {{ t('common.submit') }}
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import {computed, h, reactive, ref} from 'vue'
import {AddOutline, CreateOutline, RefreshOutline, SearchOutline, TrashOutline} from '@vicons/ionicons5'
import * as teacherApi from '@/api/teacher'
import type * as teacherType from '@/types/teacher'
import {Education} from '@/types/teacher'
import {useI18n} from 'vue-i18n'
import Icon from '@/components/common/Icon.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import {getDiscreteApi} from '@/utils/naiveUIHelper'
import {renderIcon} from '@/utils/iconUtil'
import {handleDateRangeChange} from '@/utils/dateUtil'

const {message, dialog} = getDiscreteApi()
const {t} = useI18n()

// 是否为英文环境 (暂时保留，可能用于后续功能)
// const isEnglish = computed(() => locale.value === 'en-US')

// 学历选项
const educationOptions = computed(() => [
  {label: t('teacher.education.COLLEGE'), value: Education.COLLEGE},
  {label: t('teacher.education.BACHELOR'), value: Education.BACHELOR},
  {label: t('teacher.education.MASTER'), value: Education.MASTER},
  {label: t('teacher.education.DOCTOR'), value: Education.DOCTOR}
])

// 搜索表单
const searchForm = reactive<teacherType.TeacherQueryParams>(teacherApi.getDefaultTeacherQuery())

// 日期范围选择器
const createTimeRange = ref<[number, number] | null>(null)

// 教师列表数据
const teacherList = ref<teacherType.TeacherVO[]>([])

// 分页表格引用
const pageTableRef = ref()

// 添加教师相关
const showAddModal = ref(false)
const submitting = ref(false)
const addFormRef = ref()

// 添加教师表单
const addTeacherForm = reactive<teacherType.TeacherAddDTO>(teacherApi.getDefaultTeacherAddDTO())

// 编辑教师相关
const showEditModal = ref(false)
const editFormRef = ref()
const editTeacherForm = reactive<teacherType.TeacherDTO>(teacherApi.getDefaultTeacherDTO())

// 表格列定义
const columns = computed(() => [
  {title: t('teacher.table.teacherCode'), key: 'teacherCode'},
  {title: t('teacher.table.teacherName'), key: 'realName'},
  {title: t('teacher.table.department'), key: 'department'},
  {
    title: t('teacher.table.education'),
    key: 'education',
    render(row: teacherType.TeacherVO) {
      return row.education !== null ? t(`teacher.education.${row.education}`) : '-'
    }
  },
  {title: t('teacher.table.createTime'), key: 'createTime', width: 180},
  {
    title: t('teacher.table.operation'),
    key: 'actions',
    width: 200,
    render(row: teacherType.TeacherVO) {
      return [
        h(
            'button',
            {
              class: 'n-button n-button--text action-btn',
              style: {marginRight: '8px'},
              onClick: () => handleEdit(row)
            },
            [
              renderIcon(CreateOutline)(),
              ' ' + t('teacher.actions.edit')
            ]
        ),
        h(
            'button',
            {
              class: 'n-button n-button--text action-btn',
              onClick: () => handleDelete(row)
            },
            [
              renderIcon(TrashOutline)(),
              ' ' + t('teacher.actions.delete')
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
  Object.assign(searchForm, teacherApi.getDefaultTeacherQuery())
  createTimeRange.value = null
  pageTableRef.value?.reset()
}

// 处理日期范围变化
function onDateRangeChange(value: [number, number] | null) {
  handleDateRangeChange(value, (startTime, endTime) => {
    searchForm.startTime = startTime || undefined
    searchForm.endTime = endTime || undefined
  })
}

// 数据更新处理函数
function onDataUpdate(data: teacherType.TeacherVO[]) {
  teacherList.value = data
}

// 删除教师
async function handleDelete(row: teacherType.TeacherVO) {
  dialog.warning({
    title: t('teacher.deleteConfirm.title'),
    content: t('teacher.deleteConfirm.content', {0: row.realName}),
    positiveText: t('teacher.deleteConfirm.confirmText'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      await teacherApi.removeTeacherById(row.id!)
      message.success(t('teacher.messages.deleteSuccess'))
      pageTableRef.value?.fetchData()
    }
  })
}

// 重置添加教师表单
function resetAddTeacherForm() {
  Object.assign(addTeacherForm, teacherApi.getDefaultTeacherAddDTO())
}

// 关闭添加教师对话框
function closeAddModal() {
  showAddModal.value = false
  resetAddTeacherForm()
}

// 提交添加教师
async function submitAddTeacher() {
  submitting.value = true
  await teacherApi.addTeacher(addTeacherForm)
  message.success(t('teacher.messages.addSuccess'))
  closeAddModal()
  pageTableRef.value?.fetchData()
  submitting.value = false
}

// 新增教师
function handleAdd() {
  resetAddTeacherForm()
  showAddModal.value = true
}

// 编辑教师
async function handleEdit(row: teacherType.TeacherVO) {
  const teacherDetail = await teacherApi.getTeacherById(row.id!)
  Object.assign(editTeacherForm, teacherDetail?.data)
  showEditModal.value = true
}

// 关闭编辑教师对话框
function closeEditModal() {
  showEditModal.value = false
  Object.assign(editTeacherForm, teacherApi.getDefaultTeacherDTO())
}

// 提交编辑教师
async function submitEditTeacher() {
  submitting.value = true
  await teacherApi.updateTeacher(editTeacherForm)
  message.success(t('teacher.messages.updateSuccess'))
  closeEditModal()
  pageTableRef.value?.fetchData()
  submitting.value = false
}
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
