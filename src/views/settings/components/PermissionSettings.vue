<template>
  <div class="permission-settings-container">
    <n-card :title="$t('settings.permission.title')" size="small">
      <!-- 搜索表单 -->
      <n-form :model="searchForm" inline class="search-form">
        <n-form-item :label="$t('settings.permission.searchForm.permissionName')" path="permissionName">
          <n-input v-model:value="searchForm.permissionName" clearable :placeholder="$t('settings.permission.searchForm.permissionNamePlaceholder')" />
        </n-form-item>
        <n-form-item :label="$t('settings.permission.searchForm.permissionKey')" path="permissionKey">
          <n-input v-model:value="searchForm.permissionKey" clearable :placeholder="$t('settings.permission.searchForm.permissionKeyPlaceholder')" />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" @click="handleSearch">
            <template #icon><n-icon><search-outline /></n-icon></template>
            {{ $t('settings.permission.searchForm.search') }}
          </n-button>
          <n-button class="ml-2" @click="resetSearch">
            <template #icon><n-icon><refresh-outline /></n-icon></template>
            {{ $t('settings.permission.searchForm.reset') }}
          </n-button>
        </n-form-item>
      </n-form>

      <!-- 操作按钮 -->
      <div class="table-actions">
        <n-button type="primary" @click="handleAdd">
          <template #icon><n-icon><add-outline /></n-icon></template>
          {{ $t('settings.permission.actions.add') }}
        </n-button>
      </div>

      <!-- 权限表格 -->
      <page-table
        ref="pageTableRef"
        :columns="columns"
        :api-fn="sysPermissionList"
        :query-params="searchForm"
        :auto-search="false"
        size="small"
        @update:data="onDataUpdate"
      />
    </n-card>
    
    <!-- 添加权限对话框 -->
    <n-modal v-model:show="showAddModal" :title="$t('settings.permission.addPermission.title')" preset="card" style="width: 600px">
      <n-form
        ref="addFormRef"
        :model="addPermissionForm"
        :rules="permissionFormRules"
        :style="{ maxWidth: '540px' }"
      >
        <n-form-item :label="$t('settings.permission.addPermission.parentId')" path="parentId">
          <n-tree-select 
            v-model:value="addPermissionForm.parentId" 
            :options="permissionTreeOptions"
            :placeholder="$t('settings.permission.addPermission.parentIdPlaceholder')"
            filterable
            clearable
            :virtual-scroll="true"
            @scroll="handleTreeScroll"
          />
        </n-form-item>
        
        <n-form-item :label="$t('settings.permission.addPermission.permissionName')" path="permissionName">
          <n-input 
            v-model:value="addPermissionForm.permissionName" 
            :placeholder="$t('settings.permission.addPermission.permissionNamePlaceholder')"
          />
        </n-form-item>
        
        <n-form-item :label="$t('settings.permission.addPermission.permissionKey')" path="permissionKey">
          <n-input 
            v-model:value="addPermissionForm.permissionKey" 
            :placeholder="$t('settings.permission.addPermission.permissionKeyPlaceholder')"
          />
        </n-form-item>
        
        <n-form-item :label="$t('settings.permission.addPermission.sort')" path="sort">
          <n-input-number 
            v-model:value="addPermissionForm.sort" 
            :placeholder="$t('settings.permission.addPermission.sortPlaceholder')"
          />
        </n-form-item>
      </n-form>
      
      <template #footer>
        <n-space justify="end">
          <n-button @click="closeAddModal">{{ $t('settings.permission.addPermission.cancel') }}</n-button>
          <n-button type="primary" :loading="submitting" @click="submitAddPermission">
            {{ $t('settings.permission.addPermission.submit') }}
          </n-button>
        </n-space>
      </template>
    </n-modal>
    
    <!-- 编辑权限对话框 -->
    <n-modal v-model:show="showEditModal" :title="$t('settings.permission.updatePermission.title')" preset="card" style="width: 600px">
      <n-form
        ref="editFormRef"
        :model="updatePermissionForm"
        :rules="permissionFormRules"
        :style="{ maxWidth: '540px' }"
      >
        <n-form-item :label="$t('settings.permission.updatePermission.parentId')" path="parentId">
          <n-tree-select 
            v-model:value="updatePermissionForm.parentId" 
            :options="permissionTreeOptions"
            :placeholder="$t('settings.permission.updatePermission.parentIdPlaceholder')"
            filterable
            clearable
            :disabled="isParentPermissionDisabled"
            :virtual-scroll="true"
            @scroll="handleTreeScroll"
          />
        </n-form-item>
        
        <n-form-item :label="$t('settings.permission.updatePermission.permissionName')" path="permissionName">
          <n-input 
            v-model:value="updatePermissionForm.permissionName" 
            :placeholder="$t('settings.permission.updatePermission.permissionNamePlaceholder')"
          />
        </n-form-item>
        
        <n-form-item :label="$t('settings.permission.updatePermission.permissionKey')" path="permissionKey">
          <n-input 
            v-model:value="updatePermissionForm.permissionKey" 
            :placeholder="$t('settings.permission.updatePermission.permissionKeyPlaceholder')"
          />
        </n-form-item>
        
        <n-form-item :label="$t('settings.permission.updatePermission.sort')" path="sort">
          <n-input-number 
            v-model:value="updatePermissionForm.sort" 
            :placeholder="$t('settings.permission.updatePermission.sortPlaceholder')"
          />
        </n-form-item>
      </n-form>
      
      <template #footer>
        <n-space justify="end">
          <n-button @click="closeEditModal">{{ $t('settings.permission.updatePermission.cancel') }}</n-button>
          <n-button type="primary" :loading="submitting" @click="submitUpdatePermission">
            {{ $t('settings.permission.updatePermission.submit') }}
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, h, computed } from 'vue'
import { NIcon } from 'naive-ui'
import type { FormRules, FormInst, TreeSelectOption } from 'naive-ui'
import { SearchOutline, RefreshOutline, AddOutline, TrashOutline, CreateOutline } from '@vicons/ionicons5'
import { sysPermissionList, removePermission, getDefaultPermissionQuery, addPermission, getDefaultSysPermissionAddDTO, getDefaultSysPermissionDTO, updatePermission } from '@/api/system/permission'
import type { PermissionPageQueryDTO, SysPermissionVO, SysPermissionAddDTO, SysPermissionDTO } from '@/types/system/permission'
import { useI18n } from 'vue-i18n'
import { getMessageInstance, getDialogInstance } from '@/utils/http'

const message = getMessageInstance()
const dialog = getDialogInstance()
const { t, locale } = useI18n()

// 搜索表单
const searchForm = reactive<PermissionPageQueryDTO>(getDefaultPermissionQuery())

// 权限列表数据
const permissionList = ref<SysPermissionVO[]>([])

// 父级权限选项
const parentPermissionOptions = ref<{ label: string; value: string }[]>([])

// 权限树形选项
const permissionTreeOptions = ref<TreeSelectOption[]>([])

// 分页记录
const currentPage = ref(1)
const hasMoreData = ref(true)
const loadingMore = ref(false)
const allPermissions = ref<SysPermissionVO[]>([])

// 分页表格引用
const pageTableRef = ref()

// 添加权限相关
const showAddModal = ref(false)
const submitting = ref(false)
const addFormRef = ref<FormInst | null>(null)

// 添加权限表单
const addPermissionForm = reactive<SysPermissionAddDTO>(getDefaultSysPermissionAddDTO())

// 编辑权限相关
const showEditModal = ref(false)
const editFormRef = ref<FormInst | null>(null)
const updatePermissionForm = reactive<SysPermissionDTO>(getDefaultSysPermissionDTO())
const currentEditingPermissionId = ref<string | null>(null)
const isParentPermissionDisabled = computed(() => {
  // 禁用选择自己作为父级
  return !!currentEditingPermissionId.value
})

// 权限表单验证规则
const permissionFormRules = reactive<FormRules>({
  permissionName: [
    { required: true, message: t('settings.permission.rules.permissionNameRequired'), trigger: 'blur' },
    { min: 2, max: 30, message: t('settings.permission.rules.permissionNameLength'), trigger: 'blur' }
  ],
  permissionKey: [
    { required: true, message: t('settings.permission.rules.permissionKeyRequired'), trigger: 'blur' },
    { min: 2, max: 100, message: t('settings.permission.rules.permissionKeyLength'), trigger: 'blur' }
  ]
})

// 表格列定义
const columns = computed(() => [
  { title: t('settings.permission.table.permissionName'), key: 'permissionName' },
  { title: t('settings.permission.table.permissionKey'), key: 'permissionKey' },
  { 
    title: t('settings.permission.table.parentId'), 
    key: 'parentId',
    render(row: SysPermissionVO) {
      const parent = parentPermissionOptions.value.find(item => item.value === row.parentId)
      return parent ? parent.label : '-'
    }
  },
  { title: t('settings.permission.table.sort'), key: 'sort' },
  { title: t('settings.permission.table.createTime'), key: 'createTime' },
  {
    title: t('settings.permission.table.actions'),
    key: 'actions',
    width: 200,
    render(row: SysPermissionVO) {
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
            ' ' + t('settings.permission.actions.edit')
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
            ' ' + t('settings.permission.actions.delete')
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
  Object.assign(searchForm, getDefaultPermissionQuery())
  pageTableRef.value?.reset()
}

// 数据更新处理函数
function onDataUpdate(data: SysPermissionVO[]) {
  permissionList.value = data
  updateParentPermissionOptions()
}

// 更新父级权限选项
function updateParentPermissionOptions() {
  // 过滤掉当前正在编辑的权限（不能选自己作为父级）
  parentPermissionOptions.value = permissionList.value
    .filter(item => item.id !== currentEditingPermissionId.value)
    .map(item => ({
      label: item.permissionName,
      value: item.id
    }))
}

// 加载所有权限数据
async function loadAllPermissions(page = 1, pageSize = 100) {
  // 如果是第一页，则重置数据
  if (page === 1) {
    allPermissions.value = []
    hasMoreData.value = true
  }
  
  if (!hasMoreData.value || loadingMore.value) return

  loadingMore.value = true
  try {
    const response = await sysPermissionList({
      ...getDefaultPermissionQuery(),
      pageNum: page,
      pageSize: pageSize
    })

    const newData = response?.data || []
    
    if (newData.length === 0) {
      hasMoreData.value = false
      return
    }
    
    // 合并权限数据，确保不重复添加相同id的权限
    const existingIds = new Set(allPermissions.value.map(p => p.id))
    const uniqueNewData = newData.filter((p: SysPermissionVO) => !existingIds.has(p.id))
    
    if (uniqueNewData.length > 0) {
      allPermissions.value = [...allPermissions.value, ...uniqueNewData]
      updatePermissionTreeOptions()
    }
    
    // 更新当前页码
    currentPage.value = page
  } catch (error) {
    console.error('加载权限数据失败:', error)
    message.error(t('settings.permission.messages.loadFail'))
  } finally {
    loadingMore.value = false
  }
}

// 处理树形选择器滚动
function handleTreeScroll(e: Event) {
  const target = e.target as HTMLElement
  const { scrollTop, scrollHeight, clientHeight } = target
  
  // 当滚动到底部时加载更多数据
  if (scrollTop + clientHeight >= scrollHeight - 20) { // 留20px余量
    if (hasMoreData.value && !loadingMore.value) {
      loadAllPermissions(currentPage.value + 1)
    }
  }
}

// 重新加载所有权限数据（完全刷新）
async function reloadAllPermissions() {
  currentPage.value = 1
  allPermissions.value = []
  hasMoreData.value = true
  await loadAllPermissions(1)
}

// 将权限列表转换为树形结构
function updatePermissionTreeOptions() {
  // 过滤掉当前正在编辑的权限（不能选自己作为父级）
  const filteredPermissions = allPermissions.value
    .filter(item => item.id !== currentEditingPermissionId.value)
  
  // 构建树形结构
  const permissionMap = new Map<string, TreeSelectOption>()
  
  // 首先创建所有节点
  filteredPermissions.forEach(permission => {
    permissionMap.set(permission.id, {
      key: permission.id,
      label: permission.permissionName,
      value: permission.id,
      children: []
    })
  })
  
  // 记录所有有父节点的权限ID
  const childIds = new Set<string>()
  
  // 构建树形结构
  filteredPermissions.forEach(permission => {
    const currentNode = permissionMap.get(permission.id)
    if (!currentNode) return
    
    if (permission.parentId && permissionMap.get(permission.parentId)) {
      // 子节点，添加到父节点的children中
      const parentNode = permissionMap.get(permission.parentId)
      if (parentNode) {
        if (!parentNode.children) {
          parentNode.children = []
        }
        parentNode.children.push(currentNode)
        // 标记为子节点
        childIds.add(permission.id)
      }
    }
  })
  
  // 只将没有父节点或父节点不存在的权限作为根节点
  const rootNodes: TreeSelectOption[] = []
  filteredPermissions.forEach(permission => {
    // 如果不是子节点，则作为根节点
    if (!childIds.has(permission.id)) {
      const node = permissionMap.get(permission.id)
      if (node) {
        rootNodes.push(node)
      }
    }
  })
  
  permissionTreeOptions.value = rootNodes
}

// 编辑权限
function handleEdit(row: SysPermissionVO) {
  currentEditingPermissionId.value = row.id
  Object.assign(updatePermissionForm, {
    id: row.id,
    parentId: row.parentId || null,
    permissionName: row.permissionName,
    permissionKey: row.permissionKey,
    sort: row.sort || 0
  })
  // 更新选项以排除当前编辑的权限
  updatePermissionTreeOptions()
  showEditModal.value = true
}

// 关闭编辑对话框
function closeEditModal() {
  showEditModal.value = false
  currentEditingPermissionId.value = null
  updatePermissionTreeOptions()
}

// 提交编辑权限
async function submitUpdatePermission() {
  if (!currentEditingPermissionId.value) return
  
  try {
    // 表单验证
    await editFormRef.value?.validate()
    
    submitting.value = true
    try {
      await updatePermission(updatePermissionForm)
      message.success(t('settings.permission.messages.editSuccess'))
      closeEditModal()
      pageTableRef.value?.fetchData()
      
      // 重新加载所有权限
      await reloadAllPermissions()
    } catch (error) {
      console.error('更新权限失败:', error)
      message.error(t('settings.permission.messages.editFail'))
    } finally {
      submitting.value = false
    }
  } catch (err) {
    // 表单验证失败
    message.error(t('settings.permission.messages.formInvalid'))
  }
}

// 删除权限
async function handleDelete(row: SysPermissionVO) {
  dialog.warning({
    title: t('settings.permission.actions.delete'),
    content: t('settings.permission.messages.deleteConfirm'),
    positiveText: t('settings.permission.actions.delete'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      try {
        await removePermission(row.id)
        message.success(t('settings.permission.messages.deleteSuccess'))
        pageTableRef.value?.fetchData()
        
        // 重新加载所有权限
        await reloadAllPermissions()
      } catch (error) {
        console.error('删除权限出错:', error)
        message.error(t('settings.permission.messages.deleteFail'))
      }
    }
  })
}

// 重置添加权限表单
function resetAddPermissionForm() {
  Object.assign(addPermissionForm, getDefaultSysPermissionAddDTO())
}

// 关闭添加权限对话框
function closeAddModal() {
  showAddModal.value = false
  resetAddPermissionForm()
}

// 提交添加权限
async function submitAddPermission() {
  try {
    await addFormRef.value?.validate()
    
    submitting.value = true
    try {
      await addPermission(addPermissionForm)
      message.success(t('settings.permission.messages.addSuccess'))
      closeAddModal()
      pageTableRef.value?.fetchData()
      
      // 重新加载所有权限
      await reloadAllPermissions()
    } catch (error) {
      console.error('添加权限失败:', error)
      message.error(t('settings.permission.messages.addFail'))
    } finally {
      submitting.value = false
    }
  } catch (err) {
    // 表单验证失败
    message.error(t('settings.permission.messages.formInvalid'))
  }
}

// 新增权限
function handleAdd() {
  resetAddPermissionForm()
  updatePermissionTreeOptions()
  showAddModal.value = true
}

// 初始化加载
onMounted(() => {
  // 在PageTable组件中已经自动执行初始化加载
  // 初始化加载所有权限用于树形选择器
  loadAllPermissions()
})
</script>

<style scoped lang="scss">
.permission-settings-container {
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