/**
 * 分页工具类
 * 支持多种后端API格式，统一分页处理逻辑
 */
import { reactive, ref } from 'vue'
import type { Ref } from 'vue'
import type { PageEntity, TableDataResult, Result, PageResult } from '@/types/common/baseEntity'

/**
 * 分页工具类
 * @param config 分页配置
 * @returns 分页相关方法和状态
 */
export function usePageUtil<T = any, P extends PageEntity = PageEntity>() {
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
  function getQueryParams(params: P): P {
    return {
      ...params,
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize
    }
  }

  /**
   * 执行分页查询
   * @param apiFn API请求函数
   * @param params 基础查询参数
   * @param listRef 数据列表引用
   * @returns 请求结果
   */
  async function fetchPageData<R = T>(
    apiFn: (params: P) => Promise<TableDataResult<R> | Result<PageResult<R> | R[]>>,
    params: P,
    listRef: Ref<R[]>
  ): Promise<any> {
    loading.value = true
    
    try {
      // 构建带分页参数的查询对象
      const queryParams = getQueryParams(params)
      
      // 执行API请求
      const res = await apiFn(queryParams)
      
      if (res) {
        // 解析响应
        const { list, total } = parseResponse<R>(res)
        
        // 更新数据和分页
        listRef.value = list
        updatePagination(total)
        
        return res
      }
    } catch (error) {
      console.error('分页查询失败:', error)
      listRef.value = []
      updatePagination(0)
    } finally {
      loading.value = false
    }
  }

  /**
   * 处理页码变化
   * @param page 新页码
   */
  function handlePageChange(page: number): void {
    pagination.pageNum = page
  }

  /**
   * 处理页大小变化
   * @param size 新页大小
   */
  function handleSizeChange(size: number): void {
    pagination.pageNum = 1 // 切换页大小时重置为第一页
    pagination.pageSize = size
  }

  /**
   * 重置分页状态
   */
  function resetPagination(): void {
    pagination.pageNum = 1
    pagination.pageSize = 10
    pagination.total = 0
  }

  return {
    pagination,
    loading,
    parseResponse,
    getQueryParams,
    fetchPageData,
    handlePageChange,
    handleSizeChange,
    resetPagination,
    updatePagination
  }
} 