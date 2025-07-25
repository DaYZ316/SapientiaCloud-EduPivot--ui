# PageTable 分页表格组件

## 简介

PageTable是一个集成了NaiveUI数据表格和分页功能的组件，将usePageUtil的分页功能直接封装到组件内部，使用起来更加简便。组件自动处理列的居中对齐，无需在每个使用处单独设置。

## 特点

- 集成表格和分页
- 自动处理分页逻辑
- 自动处理API请求
- 自动解析不同格式的后端响应
- 支持查询参数变更自动刷新
- 自动处理列的居中对齐
- 响应式设计
- 全局组件，无需导入

## 使用示例

```vue
<template>
  <div class="user-settings-container">
    <!-- 搜索表单 -->
    <n-form :model="searchForm" inline>
      <n-form-item label="用户名">
        <n-input v-model:value="searchForm.username" />
      </n-form-item>
      <n-form-item>
        <n-button type="primary" @click="handleSearch">搜索</n-button>
        <n-button @click="resetSearch">重置</n-button>
      </n-form-item>
    </n-form>

    <!-- 分页表格组件 -->
    <page-table
      ref="pageTableRef"
      :columns="columns"
      :api-fn="userListApi"
      :query-params="searchForm"
      :auto-search="false"
      size="small"
      @update:data="onDataUpdate"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { userListApi } from '@/api/user'

// 搜索表单
const searchForm = reactive({
  username: null,
  status: null
})

// 表格数据
const userList = ref([])

// 分页表格引用
const pageTableRef = ref()

// 表格列定义
const columns = computed(() => [
  { title: '用户名', key: 'username' },
  { title: '邮箱', key: 'email' },
  { title: '状态', key: 'status' }
])

// 搜索处理
function handleSearch() {
  pageTableRef.value?.fetchData()
}

// 重置搜索
function resetSearch() {
  Object.assign(searchForm, { username: null, status: null })
  pageTableRef.value?.reset()
}

// 数据更新处理
function onDataUpdate(data) {
  userList.value = data
}
</script>

## Props

| 属性名          | 类型                | 默认值     | 说明                       |
|---------------|---------------------|-----------|--------------------------|
| columns       | DataTableColumns    | 必填      | 表格列定义                  |
| apiFn         | Function            | 必填      | API请求函数                |
| queryParams   | Object              | {}       | 查询参数                   |
| autoLoad      | Boolean             | true     | 是否自动加载数据            |
| autoSearch    | Boolean             | false    | 是否在查询参数变化时自动搜索   |
| bordered      | Boolean             | false    | 是否显示表格边框            |
| size          | String              | 'medium' | 表格大小                   |
| maxHeight     | String/Number       | null     | 表格最大高度               |
| singleLine    | Boolean             | true     | 单行模式                   |
| striped       | Boolean             | false    | 斑马纹                     |
| pageSizes     | Array               | [10,20,30,50] | 页面大小选项           |
| showSizePicker| Boolean             | true     | 是否显示页大小选择器        |
| showQuickJumper| Boolean            | true     | 是否显示快速跳转            |

## 事件

| 事件名         | 参数                      | 说明                 |
|--------------|--------------------------|---------------------|
| update:data  | (data: any[]) => void    | 数据更新时触发         |
| page-change  | ({ pageNum, pageSize }) => void | 页码或页大小变化时触发 |
| update:loading| (loading: boolean) => void | 加载状态变化时触发     |

## 方法

| 方法名          | 参数                | 返回值   | 说明                   |
|---------------|-------------------|---------|------------------------|
| fetchData     | 无                 | Promise | 加载数据                |
| reset         | 无                 | void    | 重置分页状态并重新加载数据  | 