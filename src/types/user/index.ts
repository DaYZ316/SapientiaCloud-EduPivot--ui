/**
 * 用户相关类型定义
 */
import type { SysPermissionVO } from '../system/permission'
import type { SysRoleVO } from '../system/role'

// 登录用户信息
export interface SysUserLoginVO {
  id: string
  username: string
  nickName: string
  email: string
  mobile: string
  gender: number
  avatar: string
  status: number
  lastLoginTime: string
  roles: SysRoleVO[]
  permissions: SysPermissionVO[]
  accessToken: string
  createTime?: string
  updateTime?: string
}

// 用户详情
export interface SysUserVO {
  id: string
  username: string
  nickName: string
  email: string
  mobile: string
  gender: number
  avatar: string
  roles: SysRoleVO[]
  status: number
  createTime: string
  updateTime: string
  lastLoginTime: string
}

// 用户注册参数
export interface RegisterParams {
  username: string
  password: string
  confirmPassword: string
  avatar?: string
  nickName: string
} 