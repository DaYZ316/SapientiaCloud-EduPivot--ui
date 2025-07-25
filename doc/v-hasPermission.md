# SapientiaCloud-EduPivot 权限系统指令说明

## v-hasPermission 指令

### 功能介绍

`v-hasPermission` 是一个全局自定义指令，用于根据当前用户拥有的权限控制元素的显示或隐藏。当用户没有相应权限时，元素会被从 DOM 中完全移除，而不只是隐藏。

### 特性

- 支持单个权限字符串或权限数组进行检查
- ADMIN 角色用户自动拥有所有权限
- 自动处理权限验证失败的情况（移除元素）
- 轻量级实现，对性能影响小

### 实现原理

指令在元素挂载时（mounted）检查用户是否拥有指定权限，如果没有权限，则从 DOM 中移除该元素。权限判断逻辑如下：

1. 检查用户是否已登录
2. 检查用户是否拥有 ADMIN 角色，如有则自动拥有所有权限
3. 检查用户是否拥有指定的权限

## 基本用法

### 单个权限检查

```html
<n-button v-hasPermission="'system:user:add'">添加用户</n-button>
```

### 多权限检查（满足任一权限即可显示）

```html
<n-button v-hasPermission="['system:user:edit', 'system:user:update']">编辑</n-button>
```

## 高级用法

### 在渲染函数中使用

```js
// 在渲染函数中使用 v-hasPermission 指令
h('button', {
  class: 'n-button n-button--primary n-button--small',
  onClick: () => handleAdd(),
  directive: [
    {
      name: 'hasPermission',
      value: 'system:user:add'
    }
  ]
}, '添加用户')
```

### 在逻辑中使用权限检查函数

除了指令外，系统还提供了两个辅助函数用于在组件逻辑中进行权限检查：

```js
import { hasPermission, hasAllPermissions } from '@/utils'

// 在计算属性中使用
const canEdit = computed(() => hasPermission(['system:user:edit', 'system:user:update']))

// 检查是否同时拥有所有权限
const canManageAll = computed(() => hasAllPermissions(['system:user:list', 'system:user:edit']))

// 在方法中使用
function showEditDialog(row) {
  if (hasPermission('system:user:edit')) {
    // 显示编辑对话框
  } else {
    // 提示无权限
  }
}
```

## 最佳实践

### 1. 使用权限码常量

推荐将权限码定义为常量，避免字符串错误和提高可维护性：

```js
// 权限码常量定义
const PERMISSIONS = {
  USER_ADD: 'system:user:add',
  USER_EDIT: 'system:user:edit',
  USER_DELETE: 'system:user:delete',
  USER_VIEW: 'system:user:view'
}

// 使用常量
<n-button v-hasPermission="PERMISSIONS.USER_ADD">添加用户</n-button>
```

### 2. 权限组合

使用数组形式组合多个权限，满足其中任意一个即可显示元素：

```html
<n-button v-hasPermission="['system:user:add', 'system:user:edit']">操作</n-button>
```

### 3. 精细控制组件内容

可以对组件内容进行更精细的控制：

```html
<n-card title="用户管理">
  <template #header-extra>
    <n-button v-hasPermission="'system:user:add'" type="primary">添加用户</n-button>
  </template>
  
  <n-table>
    <!-- 表格内容 -->
    <template #action="{ row }">
      <n-button v-hasPermission="'system:user:edit'">编辑</n-button>
      <n-button v-hasPermission="'system:user:delete'">删除</n-button>
    </template>
  </n-table>
</n-card>
```

## 注意事项

1. **指令仅在元素挂载时进行权限检查**：如果权限发生动态变化（如用户角色被修改），需要重新渲染组件才能反映最新权限

2. **完全移除而非隐藏**：无权限时元素会被完全移除，不是简单的隐藏，所以不会占用空间或执行相关代码

3. **登录状态**：确保在用户登录后再进行权限检查，否则所有权限检查都将失败

4. **ADMIN 角色特殊处理**：拥有 'ADMIN' 角色的用户将自动拥有所有权限，无需额外配置

5. **性能考虑**：指令会在组件初始化时执行，对于大量元素的情况，可能会对初始渲染性能有一定影响

## 示例

### 1. 在导航菜单中使用

```html
<template>
  <n-menu>
    <n-menu-item v-hasPermission="'system:dashboard:view'">
      <template #icon><dashboard-icon /></template>
      <span>仪表板</span>
    </n-menu-item>
    
    <n-menu-item v-hasPermission="'system:user:view'">
      <template #icon><user-icon /></template>
      <span>用户管理</span>
    </n-menu-item>
    
    <n-menu-item v-hasPermission="'system:role:view'">
      <template #icon><role-icon /></template>
      <span>角色管理</span>
    </n-menu-item>
  </n-menu>
</template>
```

### 2. 在表格操作列中使用

```html
<template>
  <page-table :columns="columns" :api-fn="userList" :query-params="searchForm">
  </page-table>
</template>

<script setup>
import { h } from 'vue'

const columns = [
  { title: '用户名', key: 'username' },
  { title: '邮箱', key: 'email' },
  {
    title: '操作',
    key: 'actions',
    render(row) {
      return [
        h(
          'button',
          {
            class: 'n-button n-button--tertiary n-button--small',
            style: { marginRight: '8px' },
            onClick: () => handleEdit(row),
            directive: [
              {
                name: 'hasPermission',
                value: 'system:user:edit'
              }
            ]
          },
          '编辑'
        ),
        h(
          'button',
          {
            class: 'n-button n-button--error n-button--small',
            onClick: () => handleDelete(row),
            directive: [
              {
                name: 'hasPermission',
                value: 'system:user:delete'
              }
            ]
          },
          '删除'
        )
      ]
    }
  }
]
</script>
```

### 3. 配合条件渲染

```html
<template>
  <div>
    <div v-if="hasEditPermission">
      <n-alert type="info">您有编辑权限，可以修改内容</n-alert>
      <n-form>
        <!-- 编辑表单内容 -->
      </n-form>
    </div>
    <div v-else>
      <n-alert type="warning">您只有查看权限，无法编辑内容</n-alert>
      <!-- 只读内容展示 -->
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { hasPermission } from '@/utils'

const hasEditPermission = computed(() => hasPermission('system:content:edit'))
</script>
``` 