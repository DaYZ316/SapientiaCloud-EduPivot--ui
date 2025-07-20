import http from '@/utils/http'
import type { LoginParams, SysUserLoginVO } from '@/types'
import type { RegisterParams } from '@/types/user'

/**
 * 认证相关API
 */
const AuthApi = {
  /**
   * 用户登录
   */
  login(params: LoginParams) {
    return http.post<SysUserLoginVO>('/auth/login', params)
  },

  /**
   * 用户注册
   */
  register(params: RegisterParams) {
    return http.post<boolean>('/system/user/register', params)
  },

  /**
   * 用户登出
   */
  logout() {
    return http.post<boolean>('/auth/logout')
  },

  /**
   * 验证令牌
   */
  validate(token: string) {
    return http.get<boolean>('/auth/validate', { token })
  },

  /**
   * 获取当前登录用户信息
   */
  getCurrentUser() {
    return http.get<SysUserLoginVO>('/auth/current-user')
  }
}

export default AuthApi 