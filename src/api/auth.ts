import request from '@/utils/http'
import type { 
  Result, 
  SysUserLoginVO, 
  SysUserRegisterDTO 
} from '@/types/system'

/**
 * 登录参数接口
 */
export interface LoginParams {
  /** 用户名 */
  username: string
  /** 密码 */
  password: string
  /** 记住我 */
  rememberMe?: boolean
}

/**
 * 认证服务类
 * 处理用户登录、注册、登出等认证相关操作
 */
export class AuthService {
  /**
   * 用户登录
   * @param params 登录参数
   * @returns 登录用户信息和token
   */
  static login(params: LoginParams) {
    return request.post<Result<SysUserLoginVO>>('/auth/login', params)
  }

  /**
   * 用户注册
   * @param params 注册参数
   * @returns 是否注册成功
   */
  static register(params: SysUserRegisterDTO) {
    return request.post<Result<boolean>>('/system/user/internal/register', params)
  }

  /**
   * 用户登出
   * @returns 是否登出成功
   */
  static logout() {
    return request.post<Result<boolean>>('/auth/logout')
  }

  /**
   * 验证令牌
   * @param token 访问令牌
   * @returns 是否有效
   */
  static validate(token: string) {
    return request.get<Result<boolean>>('/auth/validate', { params: { token } })
  }

  /**
   * 获取当前登录用户信息
   * @returns 当前登录用户信息
   */
  static getCurrentUser() {
    return request.get<Result<SysUserLoginVO>>('/auth/info')
  }
} 

export default AuthService 
