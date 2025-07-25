/**
 * 角色相关类型定义
 */
import type {SysPermissionVO} from './permission'
import type {PageEntity} from '../common/baseEntity'

/**
 * 系统角色视图对象
 */
export interface SysRoleVO {
  /** 角色ID */
  id: string
  /** 角色名称 */
  roleName: string
  /** 角色标识 */
  roleKey: string
  /** 权限列表 */
  permissions?: SysPermissionVO[]
  /** 排序 */
  sort: number
  /** 状态 (0=正常, 1=停用) */
  status: number
  /** 描述 */
  description: string
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
  /** 是否为管理员角色 */
  admin: boolean
}

/**
 * 角色添加DTO
 */
export interface SysRoleAddDTO {
  /** 角色名称 */
  roleName: string | null
  /** 角色标识 */
  roleKey: string | null
  /** 排序 */
  sort?: number | null
  /** 状态 (0=正常, 1=停用) */
  status?: number | null
  /** 描述 */
  description?: string | null
}

/**
 * 角色更新DTO
 */
export interface SysRoleDTO {
  /** 角色ID */
  id: string | null
  /** 角色名称 */
  roleName: string | null
  /** 角色标识 */
  roleKey: string | null
  /** 排序 */
  sort?: number | null
  /** 状态 (0=正常, 1=停用) */
  status?: number | null
  /** 描述 */
  description?: string | null
  /** 是否为管理员角色 */
  admin?: boolean | null
}

/**
 * 角色查询参数接口
 */
export interface RolePageQueryDTO extends PageEntity {
  /** 角色名称 */
  roleName?: string | null
  /** 角色标识 */
  roleKey?: string | null
  /** 状态 (0=正常, 1=停用) */
  status?: number | null
} 