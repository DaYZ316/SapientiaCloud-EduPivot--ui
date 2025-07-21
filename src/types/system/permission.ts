/**
 * 权限相关类型定义
 */
import type { PageQuery } from './baseEntity'

/**
 * 系统权限视图对象
 */
export interface SysPermissionVO {
  /** 权限ID */
  id: string
  /** 父级权限ID */
  parent_id?: string
  /** 权限名称 */
  permission_name: string
  /** 权限标识 */
  permission_key: string
  /** 子权限列表 */
  children?: SysPermissionVO[]
  /** 排序 */
  sort: number
  /** 创建时间 */
  create_time?: string
  /** 更新时间 */
  update_time?: string
}

/**
 * 权限实体对象
 */
export interface SysPermission {
  /** 权限ID */
  id: string
  /** 父级权限ID */
  parent_id?: string
  /** 权限名称 */
  permission_name: string
  /** 权限标识 */
  permission_key: string
  /** 排序 */
  sort: number
  /** 创建时间 */
  create_time?: string
  /** 更新时间 */
  update_time?: string
}

/**
 * 权限添加DTO
 */
export interface SysPermissionAddDTO {
  /** 父级权限ID */
  parentId?: string
  /** 权限名称 */
  permissionName: string
  /** 权限标识 */
  permissionKey: string
  /** 排序 */
  sort?: number
}

/**
 * 权限更新DTO
 */
export interface SysPermissionDTO extends SysPermissionAddDTO {
  /** 权限ID */
  id: string
}

/**
 * 权限查询参数接口
 */
export interface PermissionPageQuery extends PageQuery {
  /** 权限名称 */
  permissionName?: string
  /** 权限标识 */
  permissionKey?: string
  /** 父级权限ID */
  parentId?: string
  /** 起始时间 */
  startTime?: string
  /** 结束时间 */
  endTime?: string
} 