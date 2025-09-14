<template>
  <div class="user-management-container">
    <div class="page-header">
      <n-button circle quaternary @click="goBack">
        <template #icon>
          <Icon :component="ArrowBackOutline"/>
        </template>
      </n-button>
      <h1 class="page-title">{{ t('menu.user') }}</h1>
    </div>

    <n-card size="small">
      <!-- 搜索表单 -->
      <n-form :model="searchForm" class="search-form" inline>
        <n-form-item :label="t('settings.user.searchForm.username')" path="username">
          <n-input v-model:value="searchForm.username" :placeholder="t('settings.personal.usernamePlaceholder')"
                   clearable/>
        </n-form-item>
        <n-form-item :label="t('settings.user.searchForm.nickname')" path="nickName">
          <n-input v-model:value="searchForm.nickName" :placeholder="t('settings.personal.nicknamePlaceholder')"
                   clearable/>
        </n-form-item>
        <n-form-item :label="t('settings.user.searchForm.gender')" path="gender">
          <n-select
              v-model:value="searchForm.gender"
              :options="genderOptions"
              :placeholder="t('settings.user.searchForm.gender')"
              clearable
              style="min-width: 120px;"
          />
        </n-form-item>
        <n-form-item :label="t('settings.user.searchForm.status')" path="status">
          <n-select
              v-model:value="searchForm.status"
              :options="statusOptions"
              :placeholder="t('settings.user.searchForm.status')"
              clearable
              style="min-width: 120px;"
          />
        </n-form-item>
        <n-form-item :label="t('settings.user.searchForm.createTimeRange')" path="createTimeRange">
          <n-date-picker
              v-model:value="createTimeRange"
              :placeholder="t('settings.user.searchForm.createTimeRangePlaceholder')"
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
            {{ t('settings.user.searchForm.search') }}
          </n-button>
          <n-button class="ml-2" @click="resetSearch">
            <template #icon>
              <Icon :component="RefreshOutline"/>
            </template>
            {{ t('settings.user.searchForm.reset') }}
          </n-button>
        </n-form-item>
      </n-form>

      <!-- 操作按钮 -->
      <div class="table-actions">
        <n-button type="primary" @click="handleAdd">
          <template #icon>
            <Icon :component="AddOutline"/>
          </template>
          {{ t('settings.user.actions.add') }}
        </n-button>
      </div>

      <!-- 用户表格 -->
      <page-table
          ref="pageTableRef"
          :api-fn="userApi.sysUserList"
          :auto-search="false"
          :columns="columns"
          :query-params="searchForm"
          size="small"
          @update:data="onDataUpdate"
      />
    </n-card>

    <!-- 添加用户对话框 -->
    <n-modal v-model:show="showAddModal" :title="t('settings.user.addUser.title')" preset="card" style="width: 600px">
      <n-form
          ref="addFormRef"
          :model="addUserForm"
          :style="{ maxWidth: '540px' }"
      >
        <n-form-item :label="t('settings.user.addUser.username')" path="username">
          <n-input
              v-model:value="addUserForm.username"
              :placeholder="t('settings.user.addUser.usernamePlaceholder')"
          />
        </n-form-item>

        <n-form-item :label="t('settings.user.addUser.nickname')" path="nickName">
          <n-input
              v-model:value="addUserForm.nickName"
              :placeholder="t('settings.user.addUser.nicknamePlaceholder')"
          />
        </n-form-item>

        <n-form-item :label="t('settings.user.addUser.email')" path="email">
          <n-input
              v-model:value="addUserForm.email"
              :placeholder="t('settings.user.addUser.emailPlaceholder')"
          />
        </n-form-item>

        <n-form-item :label="t('settings.user.addUser.mobile')" path="mobile">
          <n-input
              v-model:value="addUserForm.mobile"
              :placeholder="t('settings.user.addUser.mobilePlaceholder')"
          />
        </n-form-item>

        <n-form-item :label="t('settings.user.addUser.gender')" path="gender">
          <n-select
              v-model:value="addUserForm.gender"
              :options="genderOptions"
          />
        </n-form-item>

        <n-form-item :label="t('settings.user.addUser.status')" path="status">
          <n-select
              v-model:value="addUserForm.status"
              :options="statusOptions"
          />
        </n-form-item>

        <n-form-item :label="t('settings.user.addUser.avatar')" path="avatar">
          <ImageUpload
              v-model:model-value="addUserForm.avatar"
              :aspect-ratio="1"
              :round="true"
              :show-crop="true"
              :size="100"
              upload-dir="avatars"
          />
        </n-form-item>
      </n-form>

      <template #footer>
        <n-space justify="end">
          <n-button @click="closeAddModal">{{ t('settings.user.addUser.cancel') }}</n-button>
          <n-button :loading="submitting" type="primary" @click="submitAddUser">
            {{ t('settings.user.addUser.submit') }}
          </n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 角色分配对话框 -->
    <RoleAssignmentModal
        v-model:selected-role-ids="roleAssignment.selectedRoleIds.value"
        v-model:show="roleAssignment.showAssignModal.value"
        :available-roles="roleAssignment.availableRoles.value"
        :current-user="roleAssignment.currentUser.value"
        :submitting="roleAssignment.submittingRoles.value"
        :user-roles="roleAssignment.userRoles.value"
        @cancel="roleAssignment.closeAssignModal"
        @submit="(roleIds) => roleAssignment.submitAssignRoles(roleIds)"
    />

    <!-- 学生信息对话框 -->
    <InfoModal
        v-model:show="roleAssignment.showStudentInfoModal.value"
        :academic-status-options="academicStatusOptions"
        :form-data="roleAssignment.studentInfoForm"
        :submitting="roleAssignment.submittingStudent.value"
        mode="input"
        type="student"
        @cancel="() => roleAssignment.closeInfoModal('student')"
        @submit="handleInfoSubmit.student"
    />

    <!-- 学生信息展示对话框 -->
    <InfoModal
        v-model:show="roleAssignment.showStudentInfoDisplayModal.value"
        :academic-status-options="academicStatusOptions"
        :form-data="roleAssignment.studentInfoForm"
        :submitting="roleAssignment.submittingStudentUpdate.value"
        mode="display"
        type="student"
        @cancel="() => roleAssignment.closeInfoModal('student')"
        @submit="() => roleAssignment.confirmRoleAssignment('student')"
    />

    <!-- 教师信息对话框 -->
    <InfoModal
        v-model:show="roleAssignment.showTeacherInfoModal.value"
        :education-options="educationOptions"
        :form-data="roleAssignment.teacherInfoForm"
        :submitting="roleAssignment.submittingTeacher.value"
        mode="input"
        type="teacher"
        @cancel="() => roleAssignment.closeInfoModal('teacher')"
        @submit="handleInfoSubmit.teacher"
    />

    <!-- 教师信息展示对话框 -->
    <InfoModal
        v-model:show="roleAssignment.showTeacherInfoDisplayModal.value"
        :education-options="educationOptions"
        :form-data="roleAssignment.teacherInfoForm"
        :submitting="roleAssignment.submittingTeacherUpdate.value"
        mode="display"
        type="teacher"
        @cancel="() => roleAssignment.closeInfoModal('teacher')"
        @submit="() => roleAssignment.confirmRoleAssignment('teacher')"
    />
  </div>
</template>

<script lang="ts" setup>
import {computed, h, reactive, ref} from 'vue'
import {NEllipsis, NSwitch} from 'naive-ui'
import {
  AddOutline,
  ArrowBackOutline,
  PeopleOutline,
  RefreshOutline,
  SearchOutline,
  TrashOutline
} from '@vicons/ionicons5'
import * as userApi from '@/api/system/user'
import type * as userType from '@/types/system/user'
import {useI18n} from 'vue-i18n'
import {useRouter} from 'vue-router'
import {GenderEnum, getGenderLabel, StatusEnum} from '@/enum/common'
import {getAcademicStatusOptions} from '@/enum/student'
import {getEducationOptions} from '@/enum/teacher'
import Icon from '@/components/common/Icon.vue'
import ImageUpload from '@/components/common/ImageUpload.vue'
import RoleAssignmentModal from './components/RoleAssignmentModal.vue'
import InfoModal from './components/InfoModal.vue'
import {useRoleAssignment} from './composables/useRoleAssignment'
import {getDiscreteApi} from '@/utils/naiveUIHelper'
import {renderIcon} from '@/utils/iconUtil'
import {handleDateRangeChange} from '@/utils/dateUtil'
import {useUserStore} from '@/store'

const {message, dialog} = getDiscreteApi()
const {t, locale} = useI18n()
const router = useRouter()
const userStore = useUserStore()

// 是否为英文环境
const isEnglish = computed(() => locale.value === 'en-US')

// 选项配置
const options = computed(() => ({
  gender: [
    {label: t('settings.user.gender.unknown'), value: GenderEnum.UNKNOWN},
    {label: t('settings.user.gender.male'), value: GenderEnum.MALE},
    {label: t('settings.user.gender.female'), value: GenderEnum.FEMALE}
  ],
  status: [
    {label: t('settings.user.status.normal'), value: StatusEnum.NORMAL},
    {label: t('settings.user.status.disabled'), value: StatusEnum.DISABLED}
  ],
  academicStatus: getAcademicStatusOptions(isEnglish.value),
  education: getEducationOptions(isEnglish.value)
}))

// 向后兼容的别名
const genderOptions = computed(() => options.value.gender)
const statusOptions = computed(() => options.value.status)
const academicStatusOptions = computed(() => options.value.academicStatus)
const educationOptions = computed(() => options.value.education)

// 搜索表单
const searchForm = reactive<userType.UserPageQueryDTO>(userApi.getDefaultUserQuery())

// 日期范围选择器
const createTimeRange = ref<[number, number] | null>(null)

// 用户列表数据
const userList = ref<userType.SysUserVO[]>([])

// 分页表格引用
const pageTableRef = ref()

// 添加用户相关
const showAddModal = ref(false)
const submitting = ref(false)
const addFormRef = ref()

// 添加用户表单
const addUserForm = reactive<userType.SysUserAdminDTO>(userApi.getDefaultSysUserAdminDTO())

// 使用角色分配 composable
const roleAssignment = useRoleAssignment()

// 返回上一页
function goBack() {
  router.back()
}

// 更新用户状态
async function updateUserStatus(row: userType.SysUserVO, value: boolean) {
  const newStatus = value ? StatusEnum.NORMAL : StatusEnum.DISABLED;
  const statusText = value ? 'enable' : 'disable';

  try {
    await userApi.updateUser({
      id: row.id,
      status: newStatus,
      nickName: null,
      email: null,
      mobile: null
    })
    message.success(t(`settings.user.messages.${statusText}Success`))

    // 本地更新状态而不是重新获取整个列表
    row.status = newStatus;
  } catch (error) {
    message.error(t(`settings.user.messages.${statusText}Fail`))
  }
}

// 表格渲染函数
const renderEmail = (row: userType.SysUserVO) => {
  return h(NEllipsis, {
    style: {maxWidth: '200px'}
  }, {
    default: () => row.email,
    tooltip: () => row.email
  })
}

const renderGender = (row: userType.SysUserVO) => {
  return getGenderLabel(row.gender as GenderEnum, isEnglish.value)
}

const renderStatusControl = (row: userType.SysUserVO) => {
  return h(NSwitch, {
    value: row.status === StatusEnum.NORMAL,
    onUpdateValue: (value: boolean) => updateUserStatus(row, value),
    disabled: row.id === userStore.userInfo?.id
  })
}

const renderActions = (row: userType.SysUserVO) => {
  return [
    h('button', {
      class: 'n-button n-button--text',
      style: {marginRight: '8px'},
      onClick: () => roleAssignment.handleAssignRole(row)
    }, [
      renderIcon(PeopleOutline)(),
      ' ' + t('settings.user.actions.assignRole')
    ]),
    h('button', {
      class: 'n-button n-button--text',
      onClick: () => handleDelete(row)
    }, [
      renderIcon(TrashOutline)(),
      ' ' + t('settings.user.actions.delete')
    ])
  ]
}

// 表格列定义
const columns = computed(() => [
  {title: t('settings.user.table.username'), key: 'username'},
  {title: t('settings.user.table.nickname'), key: 'nickName'},
  {title: t('settings.user.table.email'), key: 'email', render: renderEmail},
  {title: t('settings.user.table.mobile'), key: 'mobile'},
  {title: t('settings.user.table.gender'), key: 'gender', render: renderGender},
  {title: t('settings.user.table.createTime'), key: 'createTime', width: 180},
  {title: t('settings.user.table.lastLoginTime'), key: 'lastLoginTime', width: 180},
  {title: t('settings.user.table.statusControl'), key: 'statusControl', render: renderStatusControl},
  {title: t('settings.user.table.actions'), key: 'actions', width: 200, render: renderActions}
])

// 搜索处理
function handleSearch() {
  pageTableRef.value?.fetchData()
}

// 重置搜索
function resetSearch() {
  Object.assign(searchForm, userApi.getDefaultUserQuery())
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
function onDataUpdate(data: userType.SysUserVO[]) {
  userList.value = data
}

// 删除用户
async function handleDelete(row: userType.SysUserVO) {
  dialog.warning({
    title: t('settings.user.actions.delete'),
    content: t('settings.user.messages.deleteConfirm'),
    positiveText: t('settings.user.actions.delete'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      try {
        await userApi.removeUser(row.id)
        message.success(t('settings.user.messages.deleteSuccess'))
        pageTableRef.value?.fetchData()
      } catch (error) {
        message.error(t('settings.user.messages.deleteFail'))
      }
    }
  })
}

// 添加用户相关函数
function resetAddUserForm() {
  Object.assign(addUserForm, userApi.getDefaultSysUserAdminDTO())
}

function closeAddModal() {
  showAddModal.value = false
  resetAddUserForm()
}

async function submitAddUser() {
  submitting.value = true
  try {
    await userApi.addSysUser(addUserForm)
    message.success(t('settings.user.messages.addSuccess'))
    closeAddModal()
    pageTableRef.value?.fetchData()
  } catch (error) {
    message.error(t('settings.user.messages.addFail'))
  } finally {
    submitting.value = false
  }
}

function handleAdd() {
  resetAddUserForm()
  showAddModal.value = true
}

// 通用信息提交处理
const handleInfoSubmit = {
  student: () => roleAssignment.submitInfo('student'),
  teacher: () => roleAssignment.submitInfo('teacher')
}
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
