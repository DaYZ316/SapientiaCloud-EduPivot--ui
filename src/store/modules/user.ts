import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SysUserLoginVO, SysPermissionVO, SysRoleVO } from '@/types'
import AuthApi from '@/api/auth'

// 用于本地存储的键名
const TOKEN_KEY = 'token'

/**
 * 用户状态管理
 */
export const useUserStore = defineStore('user', () => {
  // 状态 - 仅从本地存储初始化token
  const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
  const userInfo = ref<SysUserLoginVO | null>(null)
  const permissions = ref<SysPermissionVO[]>([])
  const roles = ref<SysRoleVO[]>([])

  // 计算属性
  const isLogin = ref<boolean>(!!token.value)
  const hasRole = (roleKey: string) => roles.value.some((role: SysRoleVO) => role.roleKey === roleKey)
  const hasPermission = (permissionKey: string) => permissions.value.some((permission: SysPermissionVO) => permission.permissionKey === permissionKey)

  // 方法
  /**
   * 登录
   */
  const login = async (username: string, password: string) => {
    try {
      const res = await AuthApi.login({ username, password })
      if (res.success && res.data) {
        const userData = res.data
        
        // 仅保存token
        token.value = userData.accessToken
        localStorage.setItem(TOKEN_KEY, userData.accessToken)
        
        // 设置登录状态
        isLogin.value = true
        
        // 获取用户信息
        await refreshUserInfo()
        
        return true
      }
      return false
    } catch (error) {
      // HTTP错误已经在HTTP模块中处理，不需要在这里重复处理
      return false
    }
  }

  /**
   * 登出
   */
  const logout = async () => {
    try {
      if (token.value) {
        await AuthApi.logout()
      }
      // 无论API是否成功，都清除本地状态
      resetUserState()
      return Promise.resolve()
    } catch (error) {
      console.error('登出API调用失败:', error)
      resetUserState()
      return Promise.reject(error)
    }
  }

  /**
   * 重置用户状态
   */
  const resetUserState = () => {
    token.value = null
    userInfo.value = null
    permissions.value = []
    roles.value = []
    isLogin.value = false
    
    // 清除本地存储中的token
    localStorage.removeItem(TOKEN_KEY)
  }

  /**
   * 验证令牌
   */
  const validateToken = async (): Promise<boolean> => {
    if (!token.value) return false
    
    try {
      const res = await AuthApi.validate(token.value)
      return res.success && res.data === true
    } catch (error) {
      resetUserState()
      return false
    }
  }

  /**
   * 刷新用户信息
   */
  const refreshUserInfo = async (): Promise<boolean> => {
    if (!token.value) return false
    
    try {
      const res = await AuthApi.getCurrentUser()
      if (res.success && res.data) {
        const userData = res.data
        
        // 更新用户信息
        userInfo.value = userData
        
        // 更新角色和权限
        roles.value = userData.roles || []
        
        const userPermissions: SysPermissionVO[] = []
        
        // 合并所有权限
        if (userData.permissions && userData.permissions.length > 0) {
          userPermissions.push(...userData.permissions)
        }
        
        // 合并角色中的权限
        if (userData.roles && userData.roles.length > 0) {
          userData.roles.forEach((role: SysRoleVO) => {
            if (role.permissions && role.permissions.length > 0) {
              userPermissions.push(...role.permissions)
            }
          })
        }
        
        permissions.value = userPermissions
        return true
      }
      return false
    } catch (error) {
      return false
    }
  }

  return {
    // 状态
    token,
    userInfo,
    permissions,
    roles,
    isLogin,
    
    // 方法
    login,
    logout,
    resetUserState,
    validateToken,
    refreshUserInfo,
    hasRole,
    hasPermission
  }
}) 