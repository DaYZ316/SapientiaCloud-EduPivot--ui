import http from '@/utils/http'
import type { 
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

// 用户登录
export function login(params: LoginParams) {
  return http.post('/auth/login', params)
}

// 用户注册
export function register(params: SysUserRegisterDTO) {
  return http.post('/system/user/internal/register', params)
}

// 用户登出
export function logout() {
  return http.post('/auth/logout')
}

// 验证令牌
export function validate(token: string) {
  return http.get('/auth/validate', { token })
}

// 获取当前登录用户信息
export function getCurrentUser() {
  return http.get('/auth/info')
} 