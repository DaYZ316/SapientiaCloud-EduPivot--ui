<template>
  <div class="user-settings-container">
    <n-card :title="t('settings.user.title')" size="small">
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

    <!-- 分配角色对话框 -->
    <n-modal v-model:show="showAssignModal" :title="t('settings.user.assignRole.title')" preset="card"
             style="width: 600px">
      <div v-if="currentUser" class="assign-header">
        <p>{{ t('settings.user.assignRole.user') }}: {{ currentUser.username }} ({{ currentUser.nickName }})</p>
      </div>

      <n-transfer
          v-model:value="selectedRoleIds"
          :options="availableRoles.map(role => ({
          label: role.roleName,
          value: role.id,
          disabled: role.admin && !selectedRoleIds.includes(role.id)
        }))"
      />

      <template #footer>
        <n-space justify="end">
          <n-button @click="closeAssignModal">{{ t('settings.user.assignRole.cancel') }}</n-button>
          <n-button :loading="submittingRoles" type="primary" @click="submitAssignRoles">
            {{ t('settings.user.assignRole.submit') }}
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import {computed, h, reactive, ref} from 'vue'
import {NEllipsis, NSwitch} from 'naive-ui'
import {AddOutline, PeopleOutline, RefreshOutline, SearchOutline, TrashOutline} from '@vicons/ionicons5'
import * as userApi from '@/api/system/user'
import {getAllRoles} from '@/api/system/role'
import type * as userType from '@/types/system/user'
import type {SysRoleVO} from '@/types/system/role'
import {useI18n} from 'vue-i18n'
import {GenderEnum, getGenderLabel, StatusEnum} from '@/enum/common'
import Icon from '@/components/common/Icon.vue'
import ImageUpload from '@/components/common/ImageUpload.vue'
import {getDiscreteApi} from '@/utils/naiveUIHelper'
import {renderIcon} from '@/utils/iconUtil'
import {handleDateRangeChange} from '@/utils/dateUtil'
import {useUserStore} from '@/store'

const {message, dialog} = getDiscreteApi()
const {t, locale} = useI18n()
const userStore = useUserStore()


// 是否为英文环境
const isEnglish = computed(() => locale.value === 'en-US')

// 性别选项
const genderOptions = [
  {label: t('settings.user.gender.unknown'), value: GenderEnum.UNKNOWN},
  {label: t('settings.user.gender.male'), value: GenderEnum.MALE},
  {label: t('settings.user.gender.female'), value: GenderEnum.FEMALE}
]

// 状态选项
const statusOptions = [
  {label: t('settings.user.status.normal'), value: StatusEnum.NORMAL},
  {label: t('settings.user.status.disabled'), value: StatusEnum.DISABLED}
]

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

// 分配角色相关
const showAssignModal = ref(false)
const currentUser = ref<userType.SysUserVO | null>(null)
const availableRoles = ref<SysRoleVO[]>([])
const selectedRoleIds = ref<string[]>([])
const userRoles = ref<SysRoleVO[]>([])
const submittingRoles = ref(false)

// 更新用户状态
async function updateUserStatus(row: userType.SysUserVO, value: boolean) {
  const newStatus = value ? StatusEnum.NORMAL : StatusEnum.DISABLED;
  const statusText = value ? 'enable' : 'disable';

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
}

// 表格列定义
const columns = computed(() => [
  {title: t('settings.user.table.username'), key: 'username'},
  {title: t('settings.user.table.nickname'), key: 'nickName'},
  {
    title: t('settings.user.table.email'),
    key: 'email',
    render(row: userType.SysUserVO) {
      return h(NEllipsis, {
        style: {maxWidth: '200px'}
      }, {
        default: () => row.email,
        tooltip: () => row.email
      })
    }
  },
  {title: t('settings.user.table.mobile'), key: 'mobile'},
  {
    title: t('settings.user.table.gender'),
    key: 'gender',
    render(row: userType.SysUserVO) {
      return getGenderLabel(row.gender as GenderEnum, isEnglish.value);
    }
  },
  {title: t('settings.user.table.createTime'), key: 'createTime', width: 180},
  {title: t('settings.user.table.lastLoginTime'), key: 'lastLoginTime', width: 180},
  {
    title: t('settings.user.table.statusControl'),
    key: 'statusControl',
    render(row: userType.SysUserVO) {
      return h(
          NSwitch,
          {
            value: row.status === StatusEnum.NORMAL,
            onUpdateValue: (value: boolean) => updateUserStatus(row, value),
            disabled: row.id === userStore.userInfo?.id
          }
      );
    }
  },
  {
    title: t('settings.user.table.actions'),
    key: 'actions',
    width: 200,
    render(row: userType.SysUserVO) {
      return [
        h(
            'button',
            {
              class: 'n-button n-button--tertiary n-button--small',
              style: {marginRight: '8px'},
              onClick: () => handleAssignRole(row)
            },
            [
              renderIcon(PeopleOutline)(),
              ' ' + t('settings.user.actions.assignRole')
            ]
        ),
        h(
            'button',
            {
              class: 'n-button n-button--error n-button--small',
              onClick: () => handleDelete(row)
            },
            [
              renderIcon(TrashOutline)(),
              ' ' + t('settings.user.actions.delete')
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
      await userApi.removeUser(row.id)
      message.success(t('settings.user.messages.deleteSuccess'))
      pageTableRef.value?.fetchData()
    }
  })
}

// 重置添加用户表单
function resetAddUserForm() {
  Object.assign(addUserForm, userApi.getDefaultSysUserAdminDTO())
}

// 关闭添加用户对话框
function closeAddModal() {
  showAddModal.value = false
  resetAddUserForm()
}

// 提交添加用户
async function submitAddUser() {
  submitting.value = true
  await userApi.addSysUser(addUserForm)
  message.success(t('settings.user.messages.addSuccess'))
  closeAddModal()
  pageTableRef.value?.fetchData()
  submitting.value = false
}

// 新增用户
function handleAdd() {
  resetAddUserForm()
  showAddModal.value = true
}

// 处理分配角色
async function handleAssignRole(row: userType.SysUserVO) {
  currentUser.value = row
  submittingRoles.value = true

  // 获取用户详情，包括已分配的角色
  const userDetail = await userApi.getUserById(row.id)
  userRoles.value = userDetail?.data?.roles || []

  // 获取所有角色列表
  const roleResult = await getAllRoles()
  availableRoles.value = roleResult?.data || []

  // 设置已选中的角色
  selectedRoleIds.value = userRoles.value.map((r: SysRoleVO) => r.id)

  // 显示分配角色对话框
  showAssignModal.value = true
  submittingRoles.value = false
}

// 关闭分配角色对话框
function closeAssignModal() {
  showAssignModal.value = false
  currentUser.value = null
  selectedRoleIds.value = []
}

// 提交分配角色
async function submitAssignRoles() {
  if (!currentUser.value) return

  submittingRoles.value = true
  await userApi.assignUserRoles(currentUser.value.id, selectedRoleIds.value)
  message.success(t('settings.user.messages.assignSuccess'))
  closeAssignModal()
  submittingRoles.value = false
}


</script>

<style lang="scss" scoped>
@use './UserSettings.scss';
</style> 