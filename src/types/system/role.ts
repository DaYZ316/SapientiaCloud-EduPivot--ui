/**
 * 角色相关类型定义
 */
import type { SysPermissionVO } from './permission'
import type { PageQuery } from './baseEntity'

/**
 * 系统角色视图对象
 */
export interface SysRoleVO {
  /** 角色ID */
  id: string
  /** 角色名称 */
  role_name: string
  /** 角色标识 */
  role_key: string
  /** 权限列表 */
  permissions?: SysPermissionVO[]
  /** 排序 */
  sort: number
  /** 状态 (0=正常, 1=停用) */
  status: number
  /** 描述 */
  description: string
  /** 创建时间 */
  create_time: string
  /** 更新时间 */
  update_time: string
  /** 是否为管理员角色 */
  admin: boolean
}

/**
 * 角色添加DTO
 */
export interface SysRoleAddDTO {
  /** 角色名称 */
  roleName: string
  /** 角色标识 */
  roleKey: string
  /** 排序 */
  sort?: number
  /** 状态 (0=正常, 1=停用) */
  status?: number
  /** 描述 */
  description?: string
}

/**
 * 角色更新DTO
 */
export interface SysRoleDTO extends SysRoleAddDTO {
  /** 角色ID */
  id: string
  /** 是否为管理员角色 */
  admin?: boolean
}

/**
 * 角色查询参数接口
 */
export interface RolePageQuery extends PageQuery {
  /** 角色名称 */
  roleName?: string
  /** 角色标识 */
  roleKey?: string
  /** 状态 (0=正常, 1=停用) */
  status?: string | number
  /** 起始时间 */
  startTime?: string
  /** 结束时间 */
  endTime?: string
} 