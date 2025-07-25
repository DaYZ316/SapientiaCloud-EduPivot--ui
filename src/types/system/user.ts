/**
 * 用户相关类型定义
 */
import type {SysRoleVO} from './role'
import type {PageEntity} from '../common/baseEntity'

/**
 * 系统用户视图对象
 */
export interface SysUserVO {
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
  /** 角色列表 */
  roles?: SysRoleVO[]
  /** 状态 (0=正常, 1=停用) */
  status: number
  /** 创建时间 */
  createTime: string
  /** 更新时间 */
  updateTime: string
  /** 最后登录时间 */
  lastLoginTime: string
}

/**
 * 用户修改DTO
 */
export interface SysUserDTO {
  /** 用户ID */
  id: string | null
  /** 用户昵称 */
  nickName: string | null
  /** 邮箱 */
  email: string | null
  /** 手机号 */
  mobile: string | null
  /** 性别 (0=未知, 1=男, 2=女) */
  gender?: number | null
  /** 用户头像URL */
  avatar?: string | null
  /** 状态 (0=正常, 1=停用) */
  status?: number | null
  /** 最后登录时间 */
  lastLoginTime?: string | null
}

/**
 * 用户注册参数（兼容旧版API）
 */
export interface RegisterParams {
  /** 用户名 */
  username: string | null
  /** 密码 */
  password: string | null
  /** 确认密码 */
  confirmPassword: string | null
  /** 用户头像URL */
  avatar?: string | null
  /** 用户昵称 */
  nickName: string | null
}

/**
 * 用户查询参数接口
 */
export interface UserPageQueryDTO extends PageEntity {
  /** 用户名 */
  username?: string | null
  /** 用户昵称 */
  nickName?: string | null
  /** 性别 (0=未知, 1=男, 2=女) */
  gender?: number | null
  /** 状态 (0=正常, 1=停用) */
  status?: number | null
  /** 手机号码 */
  mobile?: string | null
  /** 邮箱 */
  email?: string | null
}

/**
 *  管理员添加用户DTO
 */
export interface SysUserAdminDTO {
  /** 用户名 */
  username: string | null
  /** 用户昵称 */
  nickName: string | null
  /** 邮箱 */
  email: string | null
  /** 手机号 */
  mobile: string | null
  /** 性别 (0=未知, 1=男, 2=女) */
  gender: number | null
  /** 用户头像URL */
  avatar: string | null
  /** 状态 */
  status: number | null
}

/**
 * 用户个人信息更新DTO
 */
export interface SysUserProfileDTO {
  username: string | null;
  nickName: string | null;
  email: string | null;
  mobile: string | null;
  gender?: number | null;
  avatar?: string | null;
}

/**
 * 用户密码修改DTO
 */
export interface SysUserPasswordDTO {
  currentPassword: string | null;
  newPassword: string | null;
  confirmPassword: string | null;
}