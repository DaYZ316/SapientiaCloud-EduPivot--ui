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
        :pagination="pagination"
        :bordered="false"
        size="small"
      />
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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, h, computed } from 'vue'
import { NIcon, useDialog } from 'naive-ui'
import { SearchOutline, RefreshOutline, AddOutline, TrashOutline, CreateOutline } from '@vicons/ionicons5'
import { sysUserList, removeUser, getDefaultUserQuery, addSysUser } from '@/api/system/user'
import type { UserPageQueryDTO, SysUserVO, SysUserAdminDTO } from '@/types/system/user'
import { useI18n } from 'vue-i18n'
import { GenderEnum, StatusEnum, getGenderLabel } from '@/enum/common'
import StatusDisplay from '@/components/common/StatusDisplay.vue'
import { createPagination } from '@/utils/pagination'
import { getMessageInstance } from '@/utils/http'

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

// 表格数据相关
const loading = ref(false)
const userList = ref<SysUserVO[]>([])

// 添加用户相关
const showAddModal = ref(false)
const submitting = ref(false)
const addFormRef = ref()

// 添加用户表单
const addUserForm = reactive<SysUserAdminDTO>({
  username: '',
  nickName: '',
  email: '',
  mobile: '',
  gender: GenderEnum.UNKNOWN,
  avatar: '',
  status: StatusEnum.NORMAL
})

// 分页配置
const pagination = createPagination({
  onChange: (page: number) => {
    searchForm.pageNum = page
    fetchUserList()
  },
  onUpdatePageSize: (pageSize: number) => {
    searchForm.pageSize = pageSize
    searchForm.pageNum = 1
    fetchUserList()
  }
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
  searchForm.pageNum = 1
  pagination.page = 1
  fetchUserList()
}

// 重置搜索
function resetSearch() {
  Object.assign(searchForm, getDefaultUserQuery())
  pagination.page = 1
  fetchUserList()
}

// 获取用户列表数据
async function fetchUserList() {
  loading.value = true
  
  try {
    const res = await sysUserList({ ...searchForm })
    
    // 统一处理不同格式的响应
    if ((res?.code === 200 && res?.data) || (res && 'data' in res)) {
      userList.value = res.data || []
      // 设置分页总数
      pagination.itemCount = 'total' in res ? Number(res.total) || 0 : 0
    } else {
      throw new Error(t('settings.user.messages.fetchFail'))
    }
  } catch (error) {
    console.error('获取用户列表出错:', error)
    message.error(t('settings.user.messages.fetchFail'))
    userList.value = []
    pagination.itemCount = 0
  } finally {
    loading.value = false
  }
}

// 编辑用户
function handleEdit(row: SysUserVO) {
  message.info(t('settings.user.messages.editNotImplemented'))
  console.log('编辑用户:', row)
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
  addUserForm.username = ''
  addUserForm.nickName = ''
  addUserForm.email = ''
  addUserForm.mobile = ''
  addUserForm.gender = GenderEnum.UNKNOWN
  addUserForm.avatar = ''
  addUserForm.status = StatusEnum.NORMAL
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
}
</style> 