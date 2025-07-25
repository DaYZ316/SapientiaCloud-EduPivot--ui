/**
 * 认证模块相关类型定义
 */
import type {SysRoleVO} from '../system/role'
import type {SysPermissionVO} from '../system/permission'

/**
 * 系统用户登录请求DTO
 */
export interface SysUserLoginDTO {
  /** 用户名 */
  username: string | null
  /** 密码 */
  password: string | null
}

/**
 * 系统用户登录响应视图对象
 */
export interface SysUserLoginVO {
  /** 用户ID */
  id: string
  /** 用户名 */
  username: string
  /** 用户昵称 */
  nickName: string
  /** 邮箱 */
  email: string
  /** 手机号 */
  mobile: string
  /** 性别 (0=未知, 1=男, 2=女) */
  gender: number
  /** 用户头像URL */
  avatar: string
  /** 状态 (0=正常, 1=停用) */
  status: number
  /** 最后登录时间 */
  lastLoginTime: string
  /** 角色列表 */
  roles: SysRoleVO[]
  /** 权限列表 */
  permissions: SysPermissionVO[]
  /** 访问令牌 */
  accessToken: string
  /** 创建时间 */
  createTime?: string
  /** 更新时间 */
  updateTime?: string
}

/**
 * 系统用户内部视图对象
 */
export interface SysUserInternalVO {
  /** 用户ID */
  id: string
  /** 用户名 */
  username: string
  /** 用户昵称 */
  nickName: string
  /** 邮箱 */
  email: string
  /** 手机号 */
  mobile: string
  /** 性别 (0=未知, 1=男, 2=女) */
  gender: number
  /** 用户头像URL */
  avatar: string
  /** 状态 (0=正常, 1=停用) */
  status: number
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
  /** 最后登录时间 */
  lastLoginTime: string
  /** 角色列表 */
  roles?: SysRoleVO[]
  /** 权限列表 */
  permissions?: SysPermissionVO[]
}

/**
 * 用户注册DTO
 */
export interface SysUserRegisterDTO {
  /** 用户名，必须是4-20位的字母、数字或下划线 */
  username: string | null
  /** 密码，必须是6-20位的任意字符 */
  password: string | null
  /** 确认密码，必须与密码字段一致 */
  confirmPassword: string | null
  /** 用户头像URL */
  avatar?: string | null
  /** 用户昵称 */
  nickName: string | null
}

/**
 * 用户密码修改DTO
 */
export interface SysUserPasswordDTO {
  /** 当前密码 */
  currentPassword: string | null
  /** 新密码 */
  newPassword: string | null
  /** 确认密码 */
  confirmPassword: string | null
}