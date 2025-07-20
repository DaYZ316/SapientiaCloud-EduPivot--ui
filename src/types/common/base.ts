/**
 * 基础 HTTP 相关类型定义
 */

// 通用响应结构
export interface Result<T = any> {
  success: boolean
  code: number
  message: string
  data: T
}

// 分页信息
export interface PageInfo<T = any> {
  total: number
  list: T[]
  pageNum: number
  pageSize: number
  size: number
  startRow: number
  endRow: number
  pages: number
  prePage: number
  nextPage: number
  isFirstPage: boolean
  isLastPage: boolean
  hasPreviousPage: boolean
  hasNextPage: boolean
  navigatePages: number
  navigatepageNums: number[]
  navigateFirstPage: number
  navigateLastPage: number
}

// 分页查询参数
export interface PageQuery {
  pageNum?: number
  pageSize?: number
  [key: string]: any
}

// 登录参数
export interface LoginParams {
  username: string
  password: string
} 