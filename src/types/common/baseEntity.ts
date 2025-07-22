/**
 * 基础实体类型定义
 * 包含系统通用的数据结构、分页参数和响应类型
 */
import type { SysPermissionVO } from '../system/permission'
import type { SysRoleVO } from '../system/role'

/**
 * 分页请求参数接口
 * 用于系统模块的分页查询请求
 */
export interface PageQuery {
  /** 起始时间 */
  startTime?: string
  /** 结束时间 */
  endTime?: string
  /** 当前记录起始索引 */
  pageNum?: number;
  /** 每页显示记录数 */
  pageSize?: number;
  /** 排序列 */
  orderByColumn?: string;
  /** 排序的方向, 可用值: asc, desc */
  isAsc?: 'asc' | 'desc';
  /** 分页参数合理化 */
  reasonable?: boolean;
}

/**
 * 分页响应数据接口
 * 用于接收系统模块的分页查询结果
 */
export interface PageResult<T> {
  /** 总记录数 */
  total: number;
  /** 列表数据 */
  data: T[];
  /** 消息状态码 */
  code: number;
  /** 消息内容 */
  msg: string;
}

/**
 * 系统模块通用标准响应接口
 */
export interface Result<T> {
  /** 请求是否成功 */
  success: boolean;
  /** 业务状态码 (200表示成功) */
  code: number;
  /** 响应消息 */
  message: string;
  /** 响应数据体 (泛型) */
  data: T;
}

/**
 * 表格数据结果接口
 * 用于接收表格分页数据
 */
export interface TableDataResult<T = any> {
  /** 总记录数 */
  total: number;
  /** 列表数据 */
  data: T[];
  /** 消息状态码 */
  code: number;
  /** 消息内容 */
  msg: string;
}

/**
 * 布尔类型结果
 */
export interface ResultBoolean extends Result<boolean> {}

/**
 * 整型结果
 */
export interface ResultInteger extends Result<number> {}

/**
 * 字符串结果
 */
export interface ResultString extends Result<string> {}

/**
 * Map类型结果
 */
export interface ResultMapStringString extends Result<Record<string, string>> {}

/**
 * 列表类型结果 - 权限
 */
export interface ResultListSysPermissionVO extends Result<SysPermissionVO[]> {}

/**
 * 列表类型结果 - 角色
 */
export interface ResultListSysRoleVO extends Result<SysRoleVO[]> {} 