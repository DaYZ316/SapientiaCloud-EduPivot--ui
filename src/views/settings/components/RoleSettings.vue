<template>
  <div class="role-settings-container">
    <n-card :title="t('settings.role.title')" size="small">
      <!-- 搜索表单 -->
      <n-form :model="searchForm" class="search-form" inline>
        <n-form-item :label="t('settings.role.searchForm.roleName')" path="roleName">
          <n-input v-model:value="searchForm.roleName" :placeholder="t('settings.role.searchForm.roleNamePlaceholder')"
                   clearable/>
        </n-form-item>
        <n-form-item :label="t('settings.role.searchForm.roleKey')" path="roleKey">
          <n-input v-model:value="searchForm.roleKey" :placeholder="t('settings.role.searchForm.roleKeyPlaceholder')"
                   clearable/>
        </n-form-item>
        <n-form-item :label="t('settings.role.searchForm.status')" path="status">
          <n-select
              v-model:value="searchForm.status"
              :options="statusOptions"
              :placeholder="t('settings.role.searchForm.status')"
              clearable
              style="min-width: 120px;"
          />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" @click="handleSearch">
            <template #icon>
              <Icon :component="SearchOutline"/>
            </template>
            {{ t('settings.role.searchForm.search') }}
          </n-button>
          <n-button class="ml-2" @click="resetSearch">
            <template #icon>
              <Icon :component="RefreshOutline"/>
            </template>
            {{ t('settings.role.searchForm.reset') }}
          </n-button>
        </n-form-item>
      </n-form>

      <!-- 操作按钮 -->
      <div class="table-actions">
        <n-button v-hasPermission="'system:role:add'" type="primary" @click="handleAdd">
          <template #icon>
            <Icon :component="AddOutline"/>
          </template>
          {{ t('settings.role.actions.add') }}
        </n-button>
      </div>

      <!-- 角色表格 -->
      <page-table
          ref="pageTableRef"
          :api-fn="sysRoleList"
          :auto-search="false"
          :columns="columns"
          :query-params="searchForm"
          size="small"
          @update:data="onDataUpdate"
      />
    </n-card>

    <!-- 添加角色对话框 -->
    <n-modal v-model:show="showAddModal" :title="t('settings.role.addRole.title')" preset="card" style="width: 600px">
      <n-form
          ref="addFormRef"
          :model="addRoleForm"
          :rules="roleFormRules"
          :style="{ maxWidth: '540px' }"
      >
        <n-form-item :label="t('settings.role.addRole.roleName')" path="roleName">
          <n-input
              v-model:value="addRoleForm.roleName"
              :placeholder="t('settings.role.addRole.roleNamePlaceholder')"
          />
        </n-form-item>

        <n-form-item :label="t('settings.role.addRole.roleKey')" path="roleKey">
          <n-input
              v-model:value="addRoleForm.roleKey"
              :placeholder="t('settings.role.addRole.roleKeyPlaceholder')"
          />
        </n-form-item>

        <n-form-item :label="t('settings.role.addRole.sort')" path="sort">
          <n-input-number
              v-model:value="addRoleForm.sort"
              :placeholder="t('settings.role.addRole.sortPlaceholder')"
          />
        </n-form-item>

        <n-form-item :label="t('settings.role.addRole.status')" path="status">
          <n-select
              v-model:value="addRoleForm.status"
              :options="statusOptions"
          />
        </n-form-item>

        <n-form-item :label="t('settings.role.addRole.description')" path="description">
          <n-input
              v-model:value="addRoleForm.description"
              :placeholder="t('settings.role.addRole.descriptionPlaceholder')"
              type="textarea"
          />
        </n-form-item>
      </n-form>

      <template #footer>
        <n-space justify="end">
          <n-button @click="closeAddModal">{{ t('settings.role.addRole.cancel') }}</n-button>
          <n-button :loading="submitting" type="primary" @click="submitAddRole">
            {{ t('settings.role.addRole.submit') }}
          </n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 编辑角色对话框 -->
    <n-modal v-model:show="showEditModal" :title="t('settings.role.updateRole.title')" preset="card"
             style="width: 600px">
      <n-form
          ref="editFormRef"
          :model="updateRoleForm"
          :rules="roleFormRules"
          :style="{ maxWidth: '540px' }"
      >
        <n-form-item :label="t('settings.role.updateRole.roleName')" path="roleName">
          <n-input
              v-model:value="updateRoleForm.roleName"
              :placeholder="t('settings.role.updateRole.roleNamePlaceholder')"
          />
        </n-form-item>

        <n-form-item :label="t('settings.role.updateRole.roleKey')" path="roleKey">
          <n-input
              v-model:value="updateRoleForm.roleKey"
              :placeholder="t('settings.role.updateRole.roleKeyPlaceholder')"
          />
        </n-form-item>

        <n-form-item :label="t('settings.role.updateRole.sort')" path="sort">
          <n-input-number
              v-model:value="updateRoleForm.sort"
              :placeholder="t('settings.role.updateRole.sortPlaceholder')"
          />
        </n-form-item>

        <n-form-item :label="t('settings.role.updateRole.status')" path="status">
          <n-select
              v-model:value="updateRoleForm.status"
              :disabled="updateRoleForm.admin"
              :options="statusOptions"
          />
        </n-form-item>

        <n-form-item :label="t('settings.role.updateRole.description')" path="description">
          <n-input
              v-model:value="updateRoleForm.description"
              :placeholder="t('settings.role.updateRole.descriptionPlaceholder')"
              type="textarea"
          />
        </n-form-item>
      </n-form>

      <template #footer>
        <n-space justify="end">
          <n-button @click="closeEditModal">{{ t('settings.role.updateRole.cancel') }}</n-button>
          <n-button :loading="submitting" type="primary" @click="submitUpdateRole">
            {{ t('settings.role.updateRole.submit') }}
          </n-button>
        </n-space>
      </template>
    </n-modal>

    <!-- 分配权限对话框 -->
    <n-modal v-model:show="showAssignModal" :title="t('settings.role.assignPermission.title')" preset="card"
             style="width: 600px">
      <div v-if="currentRole" class="assign-header">
        <p>{{ t('settings.role.assignPermission.role') }}: {{ currentRole.roleName }}</p>
      </div>

      <n-tree
          v-if="permissionTree.length"
          ref="permissionTreeRef"
          :checked-keys="checkedPermissions"
          :data="permissionTree"
          :default-expanded-keys="expandedKeys"
          :expand-on-click="true"
          :selectable="false"
          cascade
          checkable
          @update:checked-keys="handlePermissionCheck"
      />

      <template #footer>
        <n-space justify="end">
          <n-button @click="closeAssignModal">{{ t('settings.role.assignPermission.cancel') }}</n-button>
          <n-button :loading="submitting" type="primary" @click="submitAssignPermissions">
            {{ t('settings.role.assignPermission.submit') }}
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import {computed, h, reactive, ref} from 'vue'
import type {FormInst, FormRules} from 'naive-ui'
import {AddOutline, CreateOutline, KeyOutline, RefreshOutline, SearchOutline, TrashOutline} from '@vicons/ionicons5'
import {
  addRole,
  assignRolePermissions,
  getDefaultRoleQuery,
  getDefaultSysRoleAddDTO,
  getDefaultSysRoleDTO,
  getRoleDetail,
  removeRole,
  sysRoleList,
  updateRole
} from '@/api/system/role'
import {getPermissionTree} from '@/api/system/permission'
import type {RolePageQueryDTO, SysRoleAddDTO, SysRoleDTO, SysRoleVO} from '@/types/system/role'
import type {SysPermissionVO} from '@/types/system/permission'
import {useI18n} from 'vue-i18n'
import {StatusEnum} from '@/enum/common'
import StatusDisplay from '@/components/common/StatusDisplay.vue'
import Icon from '@/components/common/Icon.vue'
import {getDiscreteApi} from '@/utils/naiveUIHelper'
import {renderIcon} from '@/utils/iconUtil'


const {message, dialog} = getDiscreteApi()
const {t, locale} = useI18n()

// 状态选项
const statusOptions = [
  {label: t('settings.role.status.normal'), value: StatusEnum.NORMAL},
  {label: t('settings.role.status.disabled'), value: StatusEnum.DISABLED}
]

// 搜索表单
const searchForm = reactive<RolePageQueryDTO>(getDefaultRoleQuery())

// 角色列表数据
const roleList = ref<SysRoleVO[]>([])

// 分页表格引用
const pageTableRef = ref()

// 添加角色相关
const showAddModal = ref(false)
const submitting = ref(false)
const addFormRef = ref<FormInst | null>(null)

// 添加角色表单
const addRoleForm = reactive<SysRoleAddDTO>(getDefaultSysRoleAddDTO())

// 编辑角色相关
const showEditModal = ref(false)
const editFormRef = ref<FormInst | null>(null)
const updateRoleForm = reactive<SysRoleDTO>(getDefaultSysRoleDTO())
const currentEditingRoleId = ref<string | null>(null)

// 分配权限相关
const showAssignModal = ref(false)
const currentRole = ref<SysRoleVO | null>(null)
const permissionTree = ref<any[]>([])
const checkedPermissions = ref<string[]>([])
const expandedKeys = ref<string[]>([])
const permissionTreeRef = ref(null)

// 角色表单验证规则
const roleFormRules = reactive<FormRules>({
  roleName: [
    {required: true, message: t('settings.role.rules.roleNameRequired'), trigger: 'blur'},
    {min: 2, max: 30, message: t('settings.role.rules.roleNameLength'), trigger: 'blur'}
  ],
  roleKey: [
    {required: true, message: t('settings.role.rules.roleKeyRequired'), trigger: 'blur'},
    {min: 2, max: 100, message: t('settings.role.rules.roleKeyLength'), trigger: 'blur'}
  ],
  status: [
    {required: true, type: 'number', message: t('settings.role.rules.statusRequired'), trigger: ['blur', 'change']}
  ]
})

// 表格列定义
const columns = computed(() => [
  {title: t('settings.role.table.roleName'), key: 'roleName'},
  {title: t('settings.role.table.roleKey'), key: 'roleKey'},
  {title: t('settings.role.table.sort'), key: 'sort'},
  {
    title: t('settings.role.table.status'),
    key: 'status',
    render(row: SysRoleVO) {
      return h(StatusDisplay, {status: row.status, type: 'dot'})
    }
  },
  {title: t('settings.role.table.description'), key: 'description'},
  {title: t('settings.role.table.createTime'), key: 'createTime'},
  {
    title: t('settings.role.table.actions'),
    key: 'actions',
    width: 280,
    render(row: SysRoleVO) {
      return [
        h(
            'button',
            {
              class: 'n-button n-button--tertiary n-button--small',
              style: {marginRight: '8px'},
              onClick: () => handleEdit(row),
              directive: [
                {
                  name: 'hasPermission',
                  value: 'system:role:edit'
                }
              ]
            },
            [
              renderIcon(CreateOutline)(),
              ' ' + t('settings.role.actions.edit')
            ]
        ),
        h(
            'button',
            {
              class: 'n-button n-button--tertiary n-button--small',
              style: {marginRight: '8px'},
              disabled: row.admin,
              onClick: () => handleAssign(row),
              directive: [
                {
                  name: 'hasPermission',
                  value: 'system:role:assign'
                }
              ]
            },
            [
              renderIcon(KeyOutline)(),
              ' ' + t('settings.role.actions.assignPermission')
            ]
        ),
        h(
            'button',
            {
              class: 'n-button n-button--error n-button--small',
              disabled: row.admin,
              onClick: () => handleDelete(row),
              directive: [
                {
                  name: 'hasPermission',
                  value: 'system:role:delete'
                }
              ]
            },
            [
              renderIcon(TrashOutline)(),
              ' ' + t('settings.role.actions.delete')
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
  Object.assign(searchForm, getDefaultRoleQuery())
  pageTableRef.value?.reset()
}

// 数据更新处理函数
function onDataUpdate(data: SysRoleVO[]) {
  roleList.value = data
}

// 编辑角色
function handleEdit(row: SysRoleVO) {
  currentEditingRoleId.value = row.id
  Object.assign(updateRoleForm, {
    id: row.id,
    roleName: row.roleName,
    roleKey: row.roleKey,
    sort: row.sort,
    status: row.status,
    description: row.description,
    admin: row.admin
  })
  showEditModal.value = true
}

// 关闭编辑对话框
function closeEditModal() {
  showEditModal.value = false
  currentEditingRoleId.value = null
}

// 提交编辑角色
async function submitUpdateRole() {
  if (!currentEditingRoleId.value) return

  try {
    // 表单验证
    await editFormRef.value?.validate()

    submitting.value = true
    try {
      await updateRole(updateRoleForm)
      message.success(t('settings.role.messages.editSuccess'))
      closeEditModal()
      pageTableRef.value?.fetchData()
    } catch (error) {
      console.error('更新角色失败:', error)
      message.error(t('settings.role.messages.editFail'))
    } finally {
      submitting.value = false
    }
  } catch (err) {
    // 表单验证失败
    message.error(t('settings.role.messages.formInvalid'))
  }
}

// 删除角色
async function handleDelete(row: SysRoleVO) {
  dialog.warning({
    title: t('settings.role.actions.delete'),
    content: t('settings.role.messages.deleteConfirm'),
    positiveText: t('settings.role.actions.delete'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      try {
        await removeRole(row.id)
        message.success(t('settings.role.messages.deleteSuccess'))
        pageTableRef.value?.fetchData()
      } catch (error) {
        console.error('删除角色出错:', error)
        message.error(t('settings.role.messages.deleteFail'))
      }
    }
  })
}

// 重置添加角色表单
function resetAddRoleForm() {
  Object.assign(addRoleForm, getDefaultSysRoleAddDTO())
  addRoleForm.status = StatusEnum.NORMAL
  addRoleForm.sort = 0
}

// 关闭添加角色对话框
function closeAddModal() {
  showAddModal.value = false
  resetAddRoleForm()
}

// 提交添加角色
async function submitAddRole() {
  try {
    await addFormRef.value?.validate()

    submitting.value = true
    try {
      await addRole(addRoleForm)
      message.success(t('settings.role.messages.addSuccess'))
      closeAddModal()
      pageTableRef.value?.fetchData()
    } catch (error) {
      console.error('添加角色失败:', error)
      message.error(t('settings.role.messages.addFail'))
    } finally {
      submitting.value = false
    }
  } catch (err) {
    // 表单验证失败
    message.error(t('settings.role.messages.formInvalid'))
  }
}

// 新增角色
function handleAdd() {
  resetAddRoleForm()
  showAddModal.value = true
}

// 权限树相关类型
interface TreeNode {
  key: string;
  label: string;
  permissionKey: string;
  children: TreeNode[];
}

// 权限树处理
function buildPermissionTree(permissions: SysPermissionVO[]): TreeNode[] {
  // 创建树结构
  return permissions.map(permission => {
    const node: TreeNode = {
      key: permission.id,
      label: permission.permissionName,
      permissionKey: permission.permissionKey,
      children: []
    }

    // 如果有子节点，递归处理
    if (permission.children && permission.children.length > 0) {
      node.children = buildPermissionTree(permission.children)
    }

    return node
  })
}

// 处理分配权限
async function handleAssign(row: SysRoleVO) {
  currentRole.value = row
  submitting.value = true

  try {
    // 获取角色详情，包括已分配的权限
    const roleDetail = await getRoleDetail(row.id)
    const rolePermissions = roleDetail?.data?.permissions || []

    // 获取权限树结构
    const permResult = await getPermissionTree()
    const permissions: SysPermissionVO[] = permResult?.data || []

    // 构建权限树
    permissionTree.value = buildPermissionTree(permissions)

    // 设置已选中的权限
    checkedPermissions.value = rolePermissions.map((p: SysPermissionVO) => p.id)

    // 展开所有节点
    expandedKeys.value = permissions.map((p: SysPermissionVO) => p.id)

    // 显示分配权限对话框
    showAssignModal.value = true
  } catch (error) {
    console.error('获取权限数据失败:', error)
    message.error(t('settings.role.messages.getPermissionFail'))
  } finally {
    submitting.value = false
  }
}

// 处理权限选中状态变化
function handlePermissionCheck(keys: string[]) {
  checkedPermissions.value = keys
}

// 关闭分配权限对话框
function closeAssignModal() {
  showAssignModal.value = false
  currentRole.value = null
  checkedPermissions.value = []
}

// 提交分配权限
async function submitAssignPermissions() {
  if (!currentRole.value) return

  submitting.value = true
  try {
    await assignRolePermissions(currentRole.value.id, checkedPermissions.value)
    message.success(t('settings.role.messages.assignSuccess'))
    closeAssignModal()
  } catch (error) {
    console.error('分配权限失败:', error)
    message.error(t('settings.role.messages.assignFail'))
  } finally {
    submitting.value = false
  }
}


</script>

<style lang="scss" scoped>
.role-settings-container {
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