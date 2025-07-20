/**
 * 角色相关类型定义
 */
import type { SysPermissionVO } from './permission'

// 角色接口
export interface SysRoleVO {
  id: string
  roleName: string
  roleKey: string
  permissions?: SysPermissionVO[]
  sort: number
  status: number
  description: string
  createTime: string
  updateTime: string
  admin: boolean
} 