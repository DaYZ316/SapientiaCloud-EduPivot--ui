<template>
  <div class="advanced-table-container">
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
import {computed, h, onMounted, reactive, ref, watch} from 'vue'
import {NButton, NTag} from 'naive-ui'
import type {AdvancedTableProps} from '@/types/components'
import AvatarDisplay from './AvatarDisplay.vue'
import StatusDisplay from './StatusDisplay.vue'

const props = defineProps<AdvancedTableProps>()

const emits = defineEmits(['update:data', 'page-change', 'action-click'])

// 表格数据
const dataList = ref([]) as Ref<any[]>

// 表格loading状态
const tableLoading = ref(false)

// 处理表格列，添加居中对齐和高级列类型支持
const processedColumns = computed(() => {
  return (props.columns || []).map((column: any) => {
    const processedColumn = {
      ...column,
      align: column.align || 'center'
    }

    // 根据列类型处理渲染函数
    if (column.type) {
      switch (column.type) {
        case 'avatar':
          processedColumn.render = (row: any) => {
            return h(AvatarDisplay, {
              avatarSrc: row[column.avatarSrcField || 'avatar'],
              username: row[column.usernameField || 'username'],
              nickName: row[column.nickNameField || 'nickName'],
              studentRealName: row[column.studentRealNameField || 'studentRealName'],
              teacherRealName: row[column.teacherRealNameField || 'teacherRealName'],
              size: column.avatarSize || 'medium',
              round: column.avatarRound !== false
            })
          }
          break

        case 'status':
          processedColumn.render = (row: any) => {
            const statusValue = row[column.statusField || 'status']
            const statusMap = column.statusMap || {}
            const statusConfig = statusMap[statusValue]

            if (statusConfig) {
              return h(NTag, {
                type: statusConfig.type || 'default',
                size: column.statusSize || 'medium'
              }, () => statusConfig.label || statusValue)
            } else {
              return h(StatusDisplay, {
                status: statusValue,
                type: 'tag'
              })
            }
          }
          break

        case 'tag':
          processedColumn.render = (row: any) => {
            const value = row[column.field || column.key]
            const tagConfig = column.tagConfig || {}
            return h(NTag, {
              type: tagConfig.type || 'default',
              size: tagConfig.size || 'medium',
              round: tagConfig.round || false
            }, () => value)
          }
          break

        case 'action':
          processedColumn.render = (row: any) => {
            const actions = column.actions || []
            return h('div', {
              class: 'action-buttons-container',
              style: {
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '16px'
              }
            }, actions.map((action: any) =>
                h(NButton, {
                  type: action.type || 'default',
                  size: action.size || 'small',
                  text: action.text || false,
                  dashed: action.dashed || false,
                  disabled: action.disabled ? action.disabled(row) : false,
                  onClick: () => handleActionClick(action.key, row, action)
                }, () => action.label)
            ))
          }
          break

        case 'custom':
          if (column.render) {
            processedColumn.render = column.render
          }
          break
      }
    }

    return processedColumn
  })
})

// 处理行键，将字符串转换为函数
const processedRowKey = computed(() => {
  if (typeof props.rowKey === 'function') {
    return props.rowKey
  }
  // 如果是字符串，返回一个函数
  return (row: any) => row[props.rowKey as string || 'id']
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

  try {
    const queryParams = {
      ...(props.queryParams || {}),
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize
    }

    const res = await (props.apiFn || (() => Promise.resolve({})))(queryParams)
    if (res) {
      const {list, total} = parseResponse(res)
      dataList.value = list
      pagination.total = total
      emits('update:data', list)
    }
    return res
  } finally {
    // 确保loading状态被清除
    tableLoading.value = false
  }
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

/**
 * 处理操作按钮点击
 */
function handleActionClick(actionKey: string, row: any, action: any) {
  emits('action-click', {
    actionKey,
    row,
    action
  })
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

<style lang="scss" scoped>
.advanced-table-container {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.pagination-container {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

// 操作按钮容器样式
:deep(.action-buttons-container) {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  min-height: 32px;

  .n-button {
    flex-shrink: 0;
    white-space: nowrap;
  }
}
</style>
