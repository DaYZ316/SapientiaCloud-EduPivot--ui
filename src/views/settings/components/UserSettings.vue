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
          :api-fn="sysUserList"
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
          <n-input
              v-model:value="addUserForm.avatar"
              :placeholder="t('settings.user.addUser.avatarPlaceholder')"
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
import {AddOutline, PeopleOutline, RefreshOutline, SearchOutline, TrashOutline} from '@vicons/ionicons5'
import {
  addSysUser,
  assignUserRoles,
  getDefaultSysUserAdminDTO,
  getDefaultUserQuery,
  getUserById,
  removeUser,
  sysUserList,
  updateUser
} from '@/api/system/user'
import {getAllRoles} from '@/api/system/role'
import type {SysUserAdminDTO, SysUserVO, UserPageQueryDTO} from '@/types/system/user'
import type {SysRoleVO} from '@/types/system/role'
import {useI18n} from 'vue-i18n'
import {GenderEnum, getGenderLabel, StatusEnum} from '@/enum/common'
import StatusDisplay from '@/components/common/StatusDisplay.vue'
import Icon from '@/components/common/Icon.vue'
import {getDiscreteApi} from '@/utils/naiveUIHelper'
import {renderIcon} from '@/utils/iconUtil'
import {useUserStore} from '@/store'
import {useThemeStore} from '@/store'

const {message, dialog} = getDiscreteApi()
const {t, locale} = useI18n()
const userStore = useUserStore()

// Theme
const themeStore = useThemeStore()
const isDarkMode = computed(() => themeStore.isDarkMode)

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
const searchForm = reactive<UserPageQueryDTO>(getDefaultUserQuery())

// 用户列表数据
const userList = ref<SysUserVO[]>([])

// 分页表格引用
const pageTableRef = ref()

// 添加用户相关
const showAddModal = ref(false)
const submitting = ref(false)
const addFormRef = ref()

// 添加用户表单
const addUserForm = reactive<SysUserAdminDTO>(getDefaultSysUserAdminDTO())

// 分配角色相关
const showAssignModal = ref(false)
const currentUser = ref<SysUserVO | null>(null)
const availableRoles = ref<SysRoleVO[]>([])
const selectedRoleIds = ref<string[]>([])
const userRoles = ref<SysRoleVO[]>([])
const submittingRoles = ref(false)

// 更新用户状态
async function updateUserStatus(row: SysUserVO, value: boolean) {
  const newStatus = value ? StatusEnum.NORMAL : StatusEnum.DISABLED;
  const statusText = value ? 'enable' : 'disable';

  try {
    await updateUser({
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

// 表格列定义
const columns = computed(() => [
  {title: t('settings.user.table.username'), key: 'username'},
  {title: t('settings.user.table.nickname'), key: 'nickName'},
  {title: t('settings.user.table.email'), key: 'email'},
  {title: t('settings.user.table.mobile'), key: 'mobile'},
  {
    title: t('settings.user.table.gender'),
    key: 'gender',
    render(row: SysUserVO) {
      return getGenderLabel(row.gender as GenderEnum, isEnglish.value);
    }
  },
  {
    title: t('settings.user.table.status'),
    key: 'status',
    render(row: SysUserVO) {
      return h(StatusDisplay, {status: row.status, type: 'dot'})
    }
  },
  {title: t('settings.user.table.createTime'), key: 'createTime'},
  {title: t('settings.user.table.lastLoginTime'), key: 'lastLoginTime'},
  {
    title: t('settings.user.table.statusControl'),
    key: 'statusControl',
    render(row: SysUserVO) {
      return h(
          'n-switch',
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
    render(row: SysUserVO) {
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
  Object.assign(searchForm, getDefaultUserQuery())
  pageTableRef.value?.reset()
}

// 数据更新处理函数
function onDataUpdate(data: SysUserVO[]) {
  userList.value = data
}

// 删除用户
async function handleDelete(row: SysUserVO) {
  dialog.warning({
    title: t('settings.user.actions.delete'),
    content: t('settings.user.messages.deleteConfirm'),
    positiveText: t('settings.user.actions.delete'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      try {
        await removeUser(row.id)
        message.success(t('settings.user.messages.deleteSuccess'))
        pageTableRef.value?.fetchData()
      } catch (error) {
        message.error(t('settings.user.messages.deleteFail'))
      }
    }
  })
}

// 重置添加用户表单
function resetAddUserForm() {
  Object.assign(addUserForm, getDefaultSysUserAdminDTO())
}

// 关闭添加用户对话框
function closeAddModal() {
  showAddModal.value = false
  resetAddUserForm()
}

// 提交添加用户
async function submitAddUser() {
  submitting.value = true
  try {
    await addSysUser(addUserForm)
    message.success(t('settings.user.messages.addSuccess'))
    closeAddModal()
    pageTableRef.value?.fetchData()
  } catch (error) {
    message.error(t('settings.user.messages.addFail'))
  } finally {
    submitting.value = false
  }
}

// 新增用户
function handleAdd() {
  resetAddUserForm()
  showAddModal.value = true
}

// 处理分配角色
async function handleAssignRole(row: SysUserVO) {
  currentUser.value = row
  submittingRoles.value = true

  try {
    // 获取用户详情，包括已分配的角色
    const userDetail = await getUserById(row.id)
    userRoles.value = userDetail?.data?.roles || []

    // 获取所有角色列表
    const roleResult = await getAllRoles()
    availableRoles.value = roleResult?.data || []

    // 设置已选中的角色
    selectedRoleIds.value = userRoles.value.map((r: SysRoleVO) => r.id)

    // 显示分配角色对话框
    showAssignModal.value = true
  } catch (error) {
    console.error('获取角色数据失败:', error)
    message.error(t('settings.user.messages.getRoleFail'))
  } finally {
    submittingRoles.value = false
  }
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
  try {
    await assignUserRoles(currentUser.value.id, selectedRoleIds.value)
    message.success(t('settings.user.messages.assignSuccess'))
    closeAssignModal()
  } catch (error) {
    message.error(t('settings.user.messages.assignFail'))
  } finally {
    submittingRoles.value = false
  }
}


</script>

<style lang="scss" scoped>
.user-settings-container {
  .search-form {
    margin-bottom: 16px;
  }

  .table-actions {
    display: flex;
    justify-content: flex-start;
    margin-bottom: 8px;
  }

  .ml-2 {
    margin-left: 8px;
  }

  .pagination-container {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }

  .assign-header {
    margin-bottom: 16px;
    font-weight: bold;
  }
}
</style> 