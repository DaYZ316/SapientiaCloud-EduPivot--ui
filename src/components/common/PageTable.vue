<template>
  <div class="page-table-container">
    <!-- 表格组件 -->
    <n-data-table
      :loading="loading"
      :columns="processedColumns"
      :data="dataList"
      :bordered="bordered"
      :size="size"
      :max-height="maxHeight"
      :single-line="singleLine"
      :striped="striped"
    />
    
    <!-- 分页组件 -->
    <div class="pagination-container">
      <n-pagination
        v-model:page="pagination.pageNum"
        v-model:page-size="pagination.pageSize"
        :page-sizes="pageSizes"
        :show-size-picker="showSizePicker"
        :show-quick-jumper="showQuickJumper"
        :item-count="pagination.total"
        @update:page="onPageChange"
        @update:page-size="onSizeChange"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
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
  }
})

const emits = defineEmits(['update:data', 'page-change', 'update:loading'])

// 表格数据
const dataList = ref([]) as Ref<any[]>

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

// 分页状态
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

// 加载状态
const loading = ref(false)

/**
 * 解析API响应数据
 * @param res API响应数据
 * @returns 处理后的列表数据和总数
 */
function parseResponse<R>(res: any): { list: R[], total: number } {
  let list: R[] = []
  let total = 0

  if (!res) return { list, total }

  // 处理不同格式的响应
  if ('total' in res && 'data' in res) {
    // 格式1: TableDataResult 或 PageResult - { data: T[], total: number }
    list = Array.isArray(res.data) ? res.data : []
    total = typeof res.total === 'number' ? res.total : 0
  } else if ('data' in res && res.data && typeof res.data === 'object') {
    // 格式2: Result<TableDataResult> - { data: { data: T[], total: number } }
    const pageResult = res.data as any
    if ('data' in pageResult && 'total' in pageResult) {
      list = Array.isArray(pageResult.data) ? pageResult.data : []
      total = typeof pageResult.total === 'number' ? pageResult.total : 0
    }
  }

  return { list, total }
}

/**
 * 更新分页状态
 * @param total 总记录数
 */
function updatePagination(total: number): void {
  pagination.total = total
}

/**
 * 获取分页参数
 * @param params 基础查询参数
 * @returns 添加了分页参数的查询对象
 */
function getQueryParams<P extends PageEntity>(params: P): P {
  return {
    ...params,
    pageNum: pagination.pageNum,
    pageSize: pagination.pageSize
  } as P
}

/**
 * 执行分页查询
 * @returns 请求结果
 */
async function fetchData() {
  loading.value = true
  emits('update:loading', true)
  
  try {
    // 构建带分页参数的查询对象
    const queryParams = getQueryParams(props.queryParams)
    
    // 执行API请求
    const res = await props.apiFn(queryParams)
    
    if (res) {
      // 解析响应
      const { list, total } = parseResponse(res)
      
      // 更新数据和分页
      dataList.value = list
      updatePagination(total)
      emits('update:data', list)
      
      return res
    }
  } catch (error) {
    dataList.value = []
    updatePagination(0)
  } finally {
    loading.value = false
    emits('update:loading', false)
  }
}

/**
 * 处理页码变化
 * @param page 新页码
 */
function onPageChange(page: number): void {
  pagination.pageNum = page
  fetchData()
  emits('page-change', { pageNum: page, pageSize: pagination.pageSize })
}

/**
 * 处理页大小变化
 * @param size 新页大小
 */
function onSizeChange(size: number): void {
  pagination.pageNum = 1 // 切换页大小时重置为第一页
  pagination.pageSize = size
  fetchData()
  emits('page-change', { pageNum: 1, pageSize: size })
}

/**
 * 重置分页状态并重新加载数据
 */
function reset(): void {
  pagination.pageNum = 1
  pagination.pageSize = 10
  pagination.total = 0
  fetchData()
}

// 暴露给父组件的方法
defineExpose({
  pagination,
  loading,
  fetchData,
  reset
})

// 监听查询参数变化，重新加载数据
watch(() => props.queryParams, () => {
  if (props.autoSearch) {
    pagination.pageNum = 1 // 查询条件变化时重置为第一页
    fetchData()
  }
}, { deep: true })

// 组件挂载时，如果配置了自动加载则加载数据
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