<template>
  <div class="user-settings-container">
    <n-card :title="$t('settings.user.title')" size="small">
      <!-- 搜索表单 -->
      <n-form :model="searchForm" inline class="search-form">
        <n-form-item :label="$t('settings.user.searchForm.username')" path="username">
          <n-input v-model:value="searchForm.username" clearable :placeholder="$t('settings.personal.usernamePlaceholder')" />
        </n-form-item>
        <n-form-item :label="$t('settings.user.searchForm.nickname')" path="nickName">
          <n-input v-model:value="searchForm.nickName" clearable :placeholder="$t('settings.personal.nicknamePlaceholder')" />
        </n-form-item>
        <n-form-item :label="$t('settings.user.searchForm.gender')" path="gender">
          <n-select
            v-model:value="searchForm.gender"
            clearable
            :placeholder="$t('settings.user.searchForm.gender')"
            :options="genderOptions"
            style="min-width: 120px;"
          />
        </n-form-item>
        <n-form-item :label="$t('settings.user.searchForm.status')" path="status">
          <n-select
            v-model:value="searchForm.status"
            clearable
            :placeholder="$t('settings.user.searchForm.status')"
            :options="statusOptions"
            style="min-width: 120px;"
          />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" @click="handleSearch">
            <template #icon><n-icon><search-outline /></n-icon></template>
            {{ $t('settings.user.searchForm.search') }}
          </n-button>
          <n-button class="ml-2" @click="resetSearch">
            <template #icon><n-icon><refresh-outline /></n-icon></template>
            {{ $t('settings.user.searchForm.reset') }}
          </n-button>
        </n-form-item>
      </n-form>

      <!-- 操作按钮 -->
      <div class="table-actions">
        <n-button type="primary" @click="handleAdd">
          <template #icon><n-icon><add-outline /></n-icon></template>
          {{ $t('settings.user.actions.add') }}
        </n-button>
      </div>

      <!-- 用户表格 -->
      <n-data-table
        :loading="loading"
        :columns="columns"
        :data="userList"
        :bordered="false"
        size="small"
      />
      
      <!-- 分页组件 -->
      <div class="pagination-container">
        <n-pagination
          v-model:page="pagination.pageNum"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 30, 50]"
          show-size-picker
          show-quick-jumper
          :item-count="pagination.total"
          @update:page="handlePageChange"
          @update:page-size="handleSizeChange"
        />
      </div>
    </n-card>
    
    <!-- 添加用户对话框 -->
    <n-modal v-model:show="showAddModal" :title="$t('settings.user.addUser.title')" preset="card" style="width: 600px">
      <n-form
        ref="addFormRef"
        :model="addUserForm"
        :style="{ maxWidth: '540px' }"
      >
        <n-form-item :label="$t('settings.user.addUser.username')" path="username">
          <n-input 
            v-model:value="addUserForm.username" 
            :placeholder="$t('settings.user.addUser.usernamePlaceholder')"
          />
        </n-form-item>
        
        <n-form-item :label="$t('settings.user.addUser.nickname')" path="nickName">
          <n-input 
            v-model:value="addUserForm.nickName" 
            :placeholder="$t('settings.user.addUser.nicknamePlaceholder')"
          />
        </n-form-item>
        
        <n-form-item :label="$t('settings.user.addUser.email')" path="email">
          <n-input 
            v-model:value="addUserForm.email" 
            :placeholder="$t('settings.user.addUser.emailPlaceholder')"
          />
        </n-form-item>
        
        <n-form-item :label="$t('settings.user.addUser.mobile')" path="mobile">
          <n-input 
            v-model:value="addUserForm.mobile" 
            :placeholder="$t('settings.user.addUser.mobilePlaceholder')"
          />
        </n-form-item>
        
        <n-form-item :label="$t('settings.user.addUser.gender')" path="gender">
          <n-select 
            v-model:value="addUserForm.gender" 
            :options="genderOptions"
          />
        </n-form-item>
        
        <n-form-item :label="$t('settings.user.addUser.status')" path="status">
          <n-select 
            v-model:value="addUserForm.status" 
            :options="statusOptions"
          />
        </n-form-item>
        
        <n-form-item :label="$t('settings.user.addUser.avatar')" path="avatar">
          <n-input 
            v-model:value="addUserForm.avatar" 
            :placeholder="$t('settings.user.addUser.avatarPlaceholder')"
          />
        </n-form-item>
      </n-form>
      
      <template #footer>
        <n-space justify="end">
          <n-button @click="closeAddModal">{{ $t('settings.user.addUser.cancel') }}</n-button>
          <n-button type="primary" :loading="submitting" @click="submitAddUser">
            {{ $t('settings.user.addUser.submit') }}
          </n-button>
        </n-space>
      </template>
    </n-modal>
    
    <!-- 编辑用户对话框 -->
    <n-modal v-model:show="showEditModal" :title="$t('settings.user.updateUser.title')" preset="card" style="width: 600px">
      <n-form
        ref="editFormRef"
        :model="updateUserForm"
        :rules="userFormRules"
        :style="{ maxWidth: '540px' }"
      >
        <n-form-item :label="$t('settings.user.updateUser.username')" path="username">
          <n-input 
            v-model:value="updateUserForm.username" 
            :placeholder="$t('settings.user.updateUser.usernamePlaceholder')"
            disabled
          />
        </n-form-item>
        
        <n-form-item :label="$t('settings.user.updateUser.nickname')" path="nickName">
          <n-input 
            v-model:value="updateUserForm.nickName" 
            :placeholder="$t('settings.user.updateUser.nicknamePlaceholder')"
          />
        </n-form-item>
        
        <n-form-item :label="$t('settings.user.updateUser.email')" path="email">
          <n-input 
            v-model:value="updateUserForm.email" 
            :placeholder="$t('settings.user.updateUser.emailPlaceholder')"
          />
        </n-form-item>
        
        <n-form-item :label="$t('settings.user.updateUser.mobile')" path="mobile">
          <n-input 
            v-model:value="updateUserForm.mobile" 
            :placeholder="$t('settings.user.updateUser.mobilePlaceholder')"
          />
        </n-form-item>
        
        <n-form-item :label="$t('settings.user.updateUser.gender')" path="gender">
          <n-select 
            v-model:value="updateUserForm.gender" 
            :options="genderOptions"
          />
        </n-form-item>
        
        <n-form-item :label="$t('settings.user.updateUser.status')" path="status">
          <n-select 
            v-model:value="updateUserForm.status" 
            :options="statusOptions"
          />
        </n-form-item>
        
        <n-form-item :label="$t('settings.user.updateUser.avatar')" path="avatar">
          <n-input 
            v-model:value="updateUserForm.avatar" 
            :placeholder="$t('settings.user.updateUser.avatarPlaceholder')"
          />
        </n-form-item>
      </n-form>
      
      <template #footer>
        <n-space justify="end">
          <n-button @click="closeEditModal">{{ $t('settings.user.updateUser.cancel') }}</n-button>
          <n-button type="primary" :loading="submitting" @click="submitupdateUser">
            {{ $t('settings.user.updateUser.submit') }}
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, h, computed } from 'vue'
import { NIcon, useDialog } from 'naive-ui'
import type { FormRules, FormInst } from 'naive-ui'
import { SearchOutline, RefreshOutline, AddOutline, TrashOutline, CreateOutline } from '@vicons/ionicons5'
import { sysUserList, removeUser, getDefaultUserQuery, addSysUser, getDefaultSysUserAdminDTO, updateUser } from '@/api/system/user'
import type { UserPageQueryDTO, SysUserVO, SysUserAdminDTO } from '@/types/system/user'
import { useI18n } from 'vue-i18n'
import { GenderEnum, StatusEnum, getGenderLabel } from '@/enum/common'
import StatusDisplay from '@/components/common/StatusDisplay.vue'
import { getMessageInstance } from '@/utils/http'
import { usePageUtil } from '@/utils/pageUtil'

const message = getMessageInstance()
const dialog = useDialog()
const { t, locale } = useI18n()

// 是否为英文环境
const isEnglish = computed(() => locale.value === 'en-US')

// 性别选项
const genderOptions = [
  { label: t('settings.user.gender.unknown'), value: GenderEnum.UNKNOWN },
  { label: t('settings.user.gender.male'), value: GenderEnum.MALE },
  { label: t('settings.user.gender.female'), value: GenderEnum.FEMALE }
]

// 状态选项
const statusOptions = [
  { label: t('settings.user.status.normal'), value: StatusEnum.NORMAL },
  { label: t('settings.user.status.disabled'), value: StatusEnum.DISABLED }
]

// 搜索表单
const searchForm = reactive<UserPageQueryDTO>(getDefaultUserQuery())

// 用户列表数据
const userList = ref<SysUserVO[]>([])

// 分页相关
const { 
  pagination, 
  loading, 
  fetchPageData, 
  handlePageChange: onPageChange,
  handleSizeChange: onSizeChange,
  resetPagination 
} = usePageUtil<SysUserVO, UserPageQueryDTO>()

// 添加用户相关
const showAddModal = ref(false)
const submitting = ref(false)
const addFormRef = ref()

// 添加用户表单
const addUserForm = reactive<SysUserAdminDTO>(getDefaultSysUserAdminDTO())

// 编辑用户相关
const showEditModal = ref(false)
const editFormRef = ref<FormInst | null>(null)
const updateUserForm = reactive<SysUserAdminDTO>(getDefaultSysUserAdminDTO())
const currentEditingUserId = ref<string | null>(null)

// 编辑用户表单验证规则
const userFormRules = reactive<FormRules>({
  username: [
    { required: true, message: t('settings.user.updateUser.usernameRequired'), trigger: 'blur' },
    { min: 2, max: 20, message: t('settings.user.updateUser.usernameLength'), trigger: 'blur' }
  ],
  nickName: [
    { required: true, message: t('settings.user.updateUser.nicknameRequired'), trigger: 'blur' }
  ],
  email: [
    { required: true, message: t('settings.user.updateUser.emailRequired'), trigger: 'blur' },
    { type: 'email', message: t('settings.user.updateUser.emailFormat'), trigger: 'blur' }
  ],
  mobile: [
    { required: true, message: t('settings.user.updateUser.mobileRequired'), trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: t('settings.user.updateUser.mobileFormat'), trigger: 'blur' }
  ],
  gender: [
    { required: true, type: 'number', message: t('settings.user.updateUser.genderRequired'), trigger: ['blur', 'change']  }
  ],
  status: [
    { required: true, type: 'number', message: t('settings.user.updateUser.statusRequired'), trigger: ['blur', 'change'] }
  ]
})

// 表格列定义
const columns = computed(() => [
  { title: t('settings.user.table.userId'), key: 'id' },
  { title: t('settings.user.table.username'), key: 'username' },
  { title: t('settings.user.table.nickname'), key: 'nickName' },
  { title: t('settings.user.table.email'), key: 'email' },
  { title: t('settings.user.table.mobile'), key: 'mobile' },
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
      return h(StatusDisplay, { status: row.status, type: 'dot' })
    }
  },
  { title: t('settings.user.table.createTime'), key: 'createTime' },
  { title: t('settings.user.table.lastLoginTime'), key: 'lastLoginTime' },
  {
    title: t('settings.user.table.actions'),
    key: 'actions',
    render(row: SysUserVO) {
      return [
        h(
          'button',
          {
            class: 'n-button n-button--tertiary n-button--small',
            style: { marginRight: '8px' },
            onClick: () => handleEdit(row)
          },
          [
            h(NIcon, null, { default: () => h(CreateOutline) }),
            ' ' + t('settings.user.actions.edit')
          ]
        ),
        h(
          'button',
          {
            class: 'n-button n-button--error n-button--small',
            onClick: () => handleDelete(row)
          },
          [
            h(NIcon, null, { default: () => h(TrashOutline) }),
            ' ' + t('settings.user.actions.delete')
          ]
        )
      ]
    }
  }
])

// 搜索处理
function handleSearch() {
  pagination.pageNum = 1
  fetchUserList()
}

// 重置搜索
function resetSearch() {
  Object.assign(searchForm, getDefaultUserQuery())
  resetPagination()
  fetchUserList()
}

// 获取用户列表数据
async function fetchUserList() {
  await fetchPageData(sysUserList, searchForm, userList)
}

// 处理页码变化
function handlePageChange(page: number) {
  onPageChange(page)
  fetchUserList()
}

// 处理每页条数变化
function handleSizeChange(pageSize: number) {
  onSizeChange(pageSize)
  fetchUserList()
}

// 编辑用户
function handleEdit(row: SysUserVO) {
  currentEditingUserId.value = row.id
  Object.assign(updateUserForm, {
    username: row.username,
    nickName: row.nickName,
    email: row.email,
    mobile: row.mobile,
    gender: row.gender,
    status: row.status,
    avatar: row.avatar
  })
  showEditModal.value = true
}

// 关闭编辑对话框
function closeEditModal() {
  showEditModal.value = false
  currentEditingUserId.value = null
}

// 提交编辑用户
async function submitupdateUser() {
  if (currentEditingUserId.value === null) return
  
  try {
    // 表单验证
    await editFormRef.value?.validate()
    
    submitting.value = true
    try {
      await updateUser({
        id: String(currentEditingUserId.value),
        ...updateUserForm
      })
      message.success(t('settings.user.messages.editSuccess'))
      closeEditModal()
      fetchUserList()
    } catch (error) {
      console.error('更新用户失败:', error)
      message.error(t('settings.user.messages.editFail'))
    } finally {
      submitting.value = false
    }
  } catch (err) {
    // 表单验证失败
    message.error(t('settings.user.messages.formInvalid'))
  }
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
        fetchUserList()
      } catch (error) {
        console.error('删除用户出错:', error)
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
    fetchUserList()
  } catch (error) {
    console.error('添加用户失败:', error)
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

// 初始化加载
onMounted(() => {
  fetchUserList()
})
</script>

<style scoped lang="scss">
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
}
</style> 