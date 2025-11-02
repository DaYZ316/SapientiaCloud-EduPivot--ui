/**
 * 认证模块相关类型定义
 */
import type {SysRoleVO} from '../system/role'
import type {SysPermissionVO} from '../system/permission'
import type {StudentAddDTO} from '../student'
import type {TeacherAddDTO} from '../teacher'

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
    nickName?: string | null
    /** 手机号码，用于接收短信验证码 */
    mobile: string | null
    /** 注册验证码（短信或邮件验证码） */
    verificationCode: string | null
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

/**
 * 手机验证码登录DTO
 */
export interface SysUserMobileLoginDTO {
    /** 手机号码 */
    mobile: string | null
    /** 手机验证码 */
    verificationCode: string | null
}

/**
 * 发送验证码DTO
 */
export interface SendVerificationCodeDTO {
    /** 手机号码，用于接收短信验证码 */
    mobile: string | null
}

/**
 * 身份选择DTO
 */
export interface SelectIdentityDTO {
    /** 身份类型 (student=学生, teacher=教师) */
    identityType: string | null
    /** 学生添加信息数据传输对象 */
    studentInfo?: StudentAddDTO | null
    /** 教师添加信息数据传输对象 */
    teacherInfo?: TeacherAddDTO | null
}

/**
 * 绑定手机号DTO
 */
export interface BindMobileDTO {
    /** 手机号码 */
    mobile: string | null
    /** 手机验证码 */
    verificationCode: string | null
    /** 用户ID（可选，如果不传则从当前登录用户获取，或用于第三方登录场景） */
    userId?: string | null
}

/**
 * 通过手机验证码修改密码DTO
 */
export interface SysUserMobilePasswordDTO {
    /** 手机号码 */
    mobile: string | null
    /** 手机验证码 */
    verificationCode: string | null
    /** 新密码 */
    newPassword: string | null
    /** 确认密码 */
    confirmPassword: string | null
}