<template>
  <div class="permission-settings-container">
    <n-card :title="t('settings.permission.title')" size="small">
      <!-- 搜索表单 -->
      <n-form :model="searchForm" class="search-form" inline>
        <n-form-item :label="t('settings.permission.searchForm.permissionName')" path="permissionName">
          <n-input v-model:value="searchForm.permissionName"
                   :placeholder="t('settings.permission.searchForm.permissionNamePlaceholder')"
                   clearable/>
        </n-form-item>
        <n-form-item :label="t('settings.permission.searchForm.permissionKey')" path="permissionKey">
          <n-input v-model:value="searchForm.permissionKey"
                   :placeholder="t('settings.permission.searchForm.permissionKeyPlaceholder')"
                   clearable/>
        </n-form-item>
        <n-form-item :label="t('settings.permission.searchForm.createTimeRange')" path="createTimeRange">
          <n-date-picker
              v-model:value="createTimeRange"
              :placeholder="t('settings.permission.searchForm.createTimeRangePlaceholder')"
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
            {{ t('settings.permission.searchForm.search') }}
          </n-button>
          <n-button class="ml-2" @click="resetSearch">
            <template #icon>
              <Icon :component="RefreshOutline"/>
            </template>
            {{ t('settings.permission.searchForm.reset') }}
          </n-button>
        </n-form-item>
      </n-form>

      <!-- 操作按钮 -->
      <div class="table-actions">
        <n-button type="primary" @click="handleAdd">
          <template #icon>
            <Icon :component="AddOutline"/>
          </template>
          {{ t('settings.permission.actions.add') }}
        </n-button>
      </div>

      <!-- 权限表格 -->
      <page-table
          ref="pageTableRef"
          :api-fn="permissionApi.sysPermissionList"
          :auto-search="false"
          :columns="columns"
          :query-params="searchForm"
          size="small"
          @update:data="onDataUpdate"
      />
    </n-card>

    <!-- 添加权限对话框 -->
    <n-modal v-model:show="showAddModal" :title="t('settings.permission.addPermission.title')" preset="card"
             style="width: 600px">
      <n-form
          ref="addFormRef"
          :model="addPermissionForm"
          :rules="permissionFormRules"
          :style="{ maxWidth: '540px' }"
      >
        <n-form-item :label="t('settings.permission.addPermission.parentId')" path="parentId">
          <n-tree-select
              v-model:value="addPermissionForm.parentId"
              :loading="treeLoading"
              :options="permissionTreeOptions"
              :placeholder="t('settings.permission.addPermission.parentIdPlaceholder')"
              :virtual-scroll="true"
              clearable
              filterable
          />
        </n-form-item>

        <n-form-item :label="t('settings.permission.addPermission.permissionName')" path="permissionName">
          <n-input
              v-model:value="addPermissionForm.permissionName"
              :placeholder="t('settings.permission.addPermission.permissionNamePlaceholder')"
          />
        </n-form-item>

        <n-form-item :label="t('settings.permission.addPermission.permissionKey')" path="permissionKey">
          <n-input
              v-model:value="addPermissionForm.permissionKey"
              :placeholder="t('settings.permission.addPermission.permissionKeyPlaceholder')"
          />
        </n-form-item>

        <n-form-item :label="t('settings.permission.addPermission.sort')" path="sort">
          <n-input-number
              v-model:value="addPermissionForm.sort"
              :placeholder="t('settings.permission.addPermission.sortPlaceholder')"
          />
        </n-form-item>
      </n-form>

      <template #footer>
        <n-space justify="end">
          <n-button @click="closeAddModal">{{ t('settings.permission.addPermission.cancel') }}</n-button>
          <n-button :loading="submitting" type="primary" @click="submitAddPermission">
            {{ t('settings.permission.addPermission.submit') }}
          </n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 编辑权限对话框 -->
    <n-modal v-model:show="showEditModal" :title="t('settings.permission.updatePermission.title')" preset="card"
             style="width: 600px">
      <n-form
          ref="editFormRef"
          :model="updatePermissionForm"
          :rules="permissionFormRules"
          :style="{ maxWidth: '540px' }"
      >
        <n-form-item :label="t('settings.permission.updatePermission.parentId')" path="parentId">
          <n-select
              v-model:value="updatePermissionForm.parentId"
              :disabled="isParentPermissionDisabled"
              :options="editParentOptions"
              :placeholder="t('settings.permission.updatePermission.parentIdPlaceholder')"
              clearable
              filterable
          />
        </n-form-item>

        <n-form-item :label="t('settings.permission.updatePermission.permissionName')" path="permissionName">
          <n-input
              v-model:value="updatePermissionForm.permissionName"
              :placeholder="t('settings.permission.updatePermission.permissionNamePlaceholder')"
          />
        </n-form-item>

        <n-form-item :label="t('settings.permission.updatePermission.permissionKey')" path="permissionKey">
          <n-input
              v-model:value="updatePermissionForm.permissionKey"
              :placeholder="t('settings.permission.updatePermission.permissionKeyPlaceholder')"
          />
        </n-form-item>

        <n-form-item :label="t('settings.permission.updatePermission.sort')" path="sort">
          <n-input-number
              v-model:value="updatePermissionForm.sort"
              :placeholder="t('settings.permission.updatePermission.sortPlaceholder')"
          />
        </n-form-item>
      </n-form>

      <template #footer>
        <n-space justify="end">
          <n-button @click="closeEditModal">{{ t('settings.permission.updatePermission.cancel') }}</n-button>
          <n-button :loading="submitting" type="primary" @click="submitUpdatePermission">
            {{ t('settings.permission.updatePermission.submit') }}
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import {computed, h, reactive, ref} from 'vue'
import type {FormInst, FormRules, TreeSelectOption} from 'naive-ui'
import {AddOutline, CreateOutline, RefreshOutline, SearchOutline, TrashOutline} from '@vicons/ionicons5'
import * as permissionApi from '@/api/system/permission'
import type * as permissionType from '@/types/system/permission'
import {useI18n} from 'vue-i18n'
import Icon from '@/components/common/Icon.vue'
import {getDiscreteApi} from '@/utils/naiveUIHelper'
import {renderIcon} from '@/utils/iconUtil'
import {handleDateRangeChange} from '@/utils/dateUtil'

const {message, dialog} = getDiscreteApi()
const {t, locale} = useI18n()

// 搜索表单
const searchForm = reactive<permissionType.PermissionPageQueryDTO>(permissionApi.getDefaultPermissionQuery())

// 日期范围选择器
const createTimeRange = ref<[number, number] | null>(null)

// 权限列表数据
const permissionList = ref<permissionType.SysPermissionVO[]>([])

// 父级权限选项
const parentPermissionOptions = ref<{ label: string; value: string }[]>([])

// 编辑选择器父级选项（专用于编辑对话框）
const editParentOptions = ref<{ label: string; value: string }[]>([])

// 权限树形选项
const permissionTreeOptions = ref<TreeSelectOption[]>([])

// 树形选择器加载状态
const treeLoading = ref(false)

// 所有权限数据
const allPermissions = ref<permissionType.SysPermissionVO[]>([])

// 分页表格引用
const pageTableRef = ref()

// 添加权限相关
const showAddModal = ref(false)
const submitting = ref(false)
const addFormRef = ref<FormInst | null>(null)

// 添加权限表单
const addPermissionForm = reactive<permissionType.SysPermissionAddDTO>(permissionApi.getDefaultSysPermissionAddDTO())

// 编辑权限相关
const showEditModal = ref(false)
const editFormRef = ref<FormInst | null>(null)
const updatePermissionForm = reactive<permissionType.SysPermissionDTO>(permissionApi.getDefaultSysPermissionDTO())
const currentEditingPermissionId = ref<string | null>(null)
const isParentPermissionDisabled = computed(() => {
  // 禁用选择自己作为父级
  return !!currentEditingPermissionId.value
})

// 权限表单验证规则
const permissionFormRules = reactive<FormRules>({
  permissionName: [
    {required: true, message: t('settings.permission.rules.permissionNameRequired'), trigger: 'blur'},
    {min: 2, max: 30, message: t('settings.permission.rules.permissionNameLength'), trigger: 'blur'}
  ],
  permissionKey: [
    {required: true, message: t('settings.permission.rules.permissionKeyRequired'), trigger: 'blur'},
    {min: 2, max: 100, message: t('settings.permission.rules.permissionKeyLength'), trigger: 'blur'}
  ]
})

// 表格列定义
const columns = computed(() => [
  {title: t('settings.permission.table.permissionName'), key: 'permissionName'},
  {title: t('settings.permission.table.permissionKey'), key: 'permissionKey'},
  {
    title: t('settings.permission.table.parentId'),
    key: 'parentId',
    render(row: permissionType.SysPermissionVO) {
      const parent = parentPermissionOptions.value.find(item => item.value === row.parentId)
      return parent ? parent.label : '-'
    }
  },
  {title: t('settings.permission.table.sort'), key: 'sort'},
  {title: t('settings.permission.table.createTime'), key: 'createTime'},
  {
    title: t('settings.permission.table.actions'),
    key: 'actions',
    width: 200,
    render(row: permissionType.SysPermissionVO) {
      return [
        h(
            'button',
            {
              class: 'n-button n-button--tertiary n-button--small',
              style: {marginRight: '8px'},
              onClick: () => handleEdit(row)
            },
            [
              renderIcon(CreateOutline)(),
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
              renderIcon(TrashOutline)(),
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
  Object.assign(searchForm, permissionApi.getDefaultPermissionQuery())
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
function onDataUpdate(data: permissionType.SysPermissionVO[]) {
  permissionList.value = data
  updateParentPermissionOptions()
}

// 更新父级权限选项
function updateParentPermissionOptions() {
  // 表格显示用的父级权限选项，包含所有权限
  parentPermissionOptions.value = permissionList.value
      .map(item => ({
        label: item.permissionName,
        value: item.id
      }))

  // 编辑对话框用的父级权限选项，过滤掉当前正在编辑的权限（不能选自己作为父级）
  editParentOptions.value = permissionList.value
      .filter(item => item.id !== currentEditingPermissionId.value)
      .map(item => ({
        label: item.permissionName,
        value: item.id
      }))
}

// 加载所有权限数据
async function loadAllPermissions() {
  try {
    treeLoading.value = true
    // 使用权限树API获取所有权限
    const response = await permissionApi.getPermissionTree()
    allPermissions.value = response?.data || []

    // 将扁平的权限列表转为树形选项
    permissionTreeOptions.value = convertToTreeSelectOptions(allPermissions.value)

    // 更新父级权限选项
    updateParentPermissionOptions()
  } catch (error) {
    console.error('加载权限数据失败:', error)
    message.error(t('settings.permission.messages.loadFail'))
  } finally {
    treeLoading.value = false
  }
}

// 将权限列表转换为树形选项
function convertToTreeSelectOptions(permissions: permissionType.SysPermissionVO[]): TreeSelectOption[] {
  // 简化版转换逻辑
  return permissions.map(perm => ({
    key: perm.id,
    label: perm.permissionName,
    value: perm.id,
    children: perm.children && perm.children.length > 0
        ? convertToTreeSelectOptions(perm.children)
        : []
  }))
}

// 编辑权限
function handleEdit(row: permissionType.SysPermissionVO) {
  currentEditingPermissionId.value = row.id
  Object.assign(updatePermissionForm, {
    id: row.id,
    parentId: row.parentId || null,
    permissionName: row.permissionName,
    permissionKey: row.permissionKey,
    sort: row.sort || 0
  })

  // 更新父级权限选项列表
  updateParentPermissionOptions()

  // 不在编辑对话框打开前加载权限树
  showEditModal.value = true
}

// 关闭编辑对话框
function closeEditModal() {
  showEditModal.value = false
  currentEditingPermissionId.value = null
  updateParentPermissionOptions() // 重新加载父级选项
}

// 提交编辑权限
async function submitUpdatePermission() {
  if (!currentEditingPermissionId.value) return

  try {
    // 表单验证
    await editFormRef.value?.validate()

    submitting.value = true
    try {
      await permissionApi.updatePermission(updatePermissionForm)
      message.success(t('settings.permission.messages.editSuccess'))
      closeEditModal()
      pageTableRef.value?.fetchData()

      // 编辑成功后清空树数据，下次打开对话框时重新加载
      allPermissions.value = []
      permissionTreeOptions.value = []
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
async function handleDelete(row: permissionType.SysPermissionVO) {
  dialog.warning({
    title: t('settings.permission.actions.delete'),
    content: t('settings.permission.messages.deleteConfirm'),
    positiveText: t('settings.permission.actions.delete'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      try {
        await permissionApi.removePermission(row.id)
        message.success(t('settings.permission.messages.deleteSuccess'))
        pageTableRef.value?.fetchData()

        // 删除成功后清空树数据，下次打开对话框时重新加载
        allPermissions.value = []
        permissionTreeOptions.value = []
      } catch (error) {
        console.error('删除权限出错:', error)
        message.error(t('settings.permission.messages.deleteFail'))
      }
    }
  })
}

// 重置添加权限表单
function resetAddPermissionForm() {
  Object.assign(addPermissionForm, permissionApi.getDefaultSysPermissionAddDTO())
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
      await permissionApi.addPermission(addPermissionForm)
      message.success(t('settings.permission.messages.addSuccess'))
      closeAddModal()
      pageTableRef.value?.fetchData()

      // 添加成功后清空树数据，下次打开对话框时重新加载
      allPermissions.value = []
      permissionTreeOptions.value = []
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
async function handleAdd() {
  resetAddPermissionForm()

  // 在对话框打开前加载权限树
  await loadAllPermissions()
  updateParentPermissionOptions() // 重新加载父级选项
  showAddModal.value = true
}


</script>

<style lang="scss" scoped>
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