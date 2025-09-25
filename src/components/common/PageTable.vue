<template>
  <div class="page-table-container">
    <!-- 表格组件 -->
    <n-data-table
        :bordered="bordered"
        :columns="processedColumns"
        :data="dataList"
        :loading="tableLoading"
        :max-height="maxHeight"
        :row-key="processedRowKey"
        :single-line="singleLine"
        :size="size"
        :striped="striped"
    />

    <!-- 分页组件 -->
    <div class="pagination-container">
      <n-pagination
          v-model:page="pagination.pageNum"
          v-model:page-size="pagination.pageSize"
          :item-count="pagination.total"
          :page-sizes="pageSizes"
          :show-quick-jumper="showQuickJumper"
          :show-size-picker="showSizePicker"
          @update:page="onPageChange"
          @update:page-size="onSizeChange"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type {Ref} from 'vue'
import {computed, onMounted, reactive, ref, watch} from 'vue'
import type {DataTableColumns} from 'naive-ui'
import type {PageEntity, PageResult, Result, TableDataResult} from '@/types/common/baseEntity'

const props = defineProps({
  // 表格列定义
  columns: {
    type: Array as () => DataTableColumns,
    required: true
  },
  // API请求函数
  apiFn: {
    type: Function as unknown as () => <T, P extends PageEntity>(params: P) => Promise<TableDataResult<T> | Result<PageResult<T> | T[]>>,
    required: true
  },
  // 查询参数
  queryParams: {
    type: Object as () => PageEntity,
    default: () => ({})
  },
  // 是否自动加载数据
  autoLoad: {
    type: Boolean,
    default: true
  },
  // 是否在查询参数变化时自动搜索
  autoSearch: {
    type: Boolean,
    default: false
  },
  // 表格边框
  bordered: {
    type: Boolean,
    default: false
  },
  // 表格大小
  size: {
    type: String,
    default: 'medium'
  },
  // 表格最大高度
  maxHeight: {
    type: [String, Number],
    default: null
  },
  // 单行模式
  singleLine: {
    type: Boolean,
    default: true
  },
  // 斑马纹
  striped: {
    type: Boolean,
    default: true
  },
  // 页面大小选项
  pageSizes: {
    type: Array as () => number[],
    default: () => [10, 20, 30, 50]
  },
  // 是否显示页大小选择器
  showSizePicker: {
    type: Boolean,
    default: true
  },
  // 是否显示快速跳转
  showQuickJumper: {
    type: Boolean,
    default: true
  },
  // 行键字段名
  rowKey: {
    type: [String, Function],
    default: 'id'
  }
})

const emits = defineEmits(['update:data', 'page-change'])

// 表格数据
const dataList = ref([]) as Ref<any[]>

// 表格loading状态
const tableLoading = ref(false)

// 处理表格列，添加居中对齐
const processedColumns = computed(() => {
  return props.columns.map((column) => {
    // 如果列已经定义了align属性，则保留原值，否则设置为center
    if (!column.align) {
      return {
        ...column,
        align: 'center'
      }
    }
    return column
  })
})

// 处理行键，将字符串转换为函数
const processedRowKey = computed(() => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey
  }
  // 如果是字符串，返回一个函数
  return (row: any) => row[props.rowKey as string]
})

// 分页状态
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})


/**
 * 解析API响应数据
 */
function parseResponse<R>(res: any): { list: R[], total: number } {
  if (!res) return {list: [], total: 0}

  // 处理不同格式的响应
  if ('total' in res && 'data' in res) {
    return {
      list: Array.isArray(res.data) ? res.data : [],
      total: typeof res.total === 'number' ? res.total : 0
    }
  }

  if ('data' in res && res.data && typeof res.data === 'object') {
    const pageResult = res.data
    if ('data' in pageResult && 'total' in pageResult) {
      return {
        list: Array.isArray(pageResult.data) ? pageResult.data : [],
        total: typeof pageResult.total === 'number' ? pageResult.total : 0
      }
    }
  }

  return {list: [], total: 0}
}

/**
 * 执行分页查询
 */
async function fetchData() {
  // 设置表格loading状态
  tableLoading.value = true

  const queryParams = {
    ...props.queryParams,
    pageNum: pagination.pageNum,
    pageSize: pagination.pageSize
  }

  const res = await props.apiFn(queryParams)
  if (res) {
    const {list, total} = parseResponse(res)
    dataList.value = list
    pagination.total = total
    emits('update:data', list)
    return res
  }
  // 确保loading状态被清除
  tableLoading.value = false
}

function onPageChange(page: number): void {
  pagination.pageNum = page
  fetchData()
  emits('page-change', {pageNum: page, pageSize: pagination.pageSize})
}

function onSizeChange(size: number): void {
  pagination.pageNum = 1
  pagination.pageSize = size
  fetchData()
  emits('page-change', {pageNum: 1, pageSize: size})
}

function reset(): void {
  pagination.pageNum = 1
  pagination.pageSize = 10
  pagination.total = 0
  fetchData()
}

// 暴露给父组件的方法
defineExpose({
  pagination,
  fetchData,
  reset
})

watch(() => props.queryParams, () => {
  if (props.autoSearch) {
    pagination.pageNum = 1
    fetchData()
  }
}, {deep: true})

onMounted(() => {
  if (props.autoLoad) {
    fetchData()
  }
})
</script>

<style scoped>
.page-table-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}
</style> 