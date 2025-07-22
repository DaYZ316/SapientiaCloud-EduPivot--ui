import { reactive } from 'vue'
import type { PageEntity } from '@/types/common/baseEntity'

/**
 * 分页配置接口
 */
export interface PaginationConfig {
  page: number
  pageSize: number
  itemCount: number
  pageSizes: number[]
  showSizePicker: boolean
  onChange?: (page: number) => void
  onUpdatePageSize?: (pageSize: number) => void
  [key: string]: any
}

/**
 * 创建分页配置
 * @param options 自定义配置选项
 * @returns 分页配置对象
 */
export function createPagination(options?: Partial<PaginationConfig>) {
  const pagination = reactive({
    page: 1,
    pageSize: 10,
    itemCount: 0,
    pageSizes: [10, 20, 30, 50],
    showSizePicker: true,
    ...options
  })

  // 如果没有提供onChange，则使用默认实现
  if (!pagination.onChange) {
    pagination.onChange = (page: number) => {
      pagination.page = page
    }
  }

  // 如果没有提供onUpdatePageSize，则使用默认实现
  if (!pagination.onUpdatePageSize) {
    pagination.onUpdatePageSize = (pageSize: number) => {
      pagination.pageSize = pageSize
      pagination.page = 1
    }
  }

  return pagination
}

/**
 * 获取默认分页配置
 * @returns 默认分页配置对象
 */
export function getDefaultPagination() {
  return createPagination()
} 