/**
 * 分页请求参数接口
 * 用于系统模块的分页查询请求
 */
export interface PageEntity {
  /** 起始时间 */
  startTime?: string | null
  /** 结束时间 */
  endTime?: string | null
  /** 当前记录起始索引 */
  pageNum?: number | null;
  /** 每页显示记录数 */
  pageSize?: number | null;
  /** 排序列 */
  orderByColumn?: string | null;
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
  total: number | null;
  /** 列表数据 */
  data: T[];
  /** 消息状态码 */
  code: number | null;
  /** 消息内容 */
  msg: string | null;
}

/**
 * 系统模块通用标准响应接口
 */
export interface Result<T> {
  /** 请求是否成功 */
  success: boolean | null;
  /** 业务状态码 (200表示成功) */
  code: number | null;
  /** 响应消息 */
  message: string | null;
  /** 响应数据体 (泛型) */
  data: T;
}

/**
 * 表格数据结果接口
 * 用于接收表格分页数据
 */
export interface TableDataResult<T = any> {
  /** 总记录数 */
  total: number | null;
  /** 列表数据 */
  data: T[];
  /** 消息状态码 */
  code: number | null;
  /** 消息内容 */
  msg: string | null;
}