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
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, h, computed } from 'vue'
import { NIcon, useDialog } from 'naive-ui'
import { SearchOutline, RefreshOutline, AddOutline, TrashOutline, CreateOutline } from '@vicons/ionicons5'
import { sysUserList, removeUser, getDefaultUserQuery, addSysUser, getDefaultSysUserAdminDTO } from '@/api/system/user'
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