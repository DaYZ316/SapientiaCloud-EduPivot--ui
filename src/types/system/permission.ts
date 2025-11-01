/**
 * 权限相关类型定义
 */
import type {PageEntity} from '../common/baseEntity'

/**
 * 系统权限视图对象
 */
export interface SysPermissionVO {
    /** 权限ID */
    id: string
    /** 父级权限ID */
    parentId?: string
    /** 权限名称 */
    permissionName: string
    /** 权限标识 */
    permissionKey: string
    /** 子权限列�?*/
    children?: SysPermissionVO[]
    /** 排序 */
    sort: number
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
}

/**
 * 权限实体对象
 */
export interface SysPermission {
    /** 权限ID */
    id: string
    /** 父级权限ID */
    parentId?: string
    /** 权限名称 */
    permissionName: string
    /** 权限标识 */
    permissionKey: string
    /** 排序 */
    sort: number
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
}

/**
 * 权限添加DTO
 */
export interface SysPermissionAddDTO {
    /** 父级权限ID */
    parentId?: string | null
    /** 权限名称 */
    permissionName: string | null
    /** 权限标识 */
    permissionKey: string | null
    /** 排序 */
    sort?: number | null
}

/**
 * 权限更新DTO
 */
export interface SysPermissionDTO extends SysPermissionAddDTO {
    /** 权限ID */
    id: string | null
}

/**
 * 权限查询参数接口
 */
export interface PermissionPageQueryDTO extends PageEntity {
    /** 权限名称 */
    permissionName?: string | null
    /** 权限标识 */
    permissionKey?: string | null
    /** 父级权限ID */
    parentId?: string | null
    /** 开始时�?*/
    startTime?: string | null
    /** 结束时间 */
    endTime?: string | null
} 
