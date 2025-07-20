import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { SysUserLoginVO, SysPermissionVO, SysRoleVO } from '@/types'
import AuthApi from '@/api/auth'

// 用于本地存储的键名
const USER_INFO_KEY = 'user_info'
const PERMISSIONS_KEY = 'user_permissions'
const ROLES_KEY = 'user_roles'

/**
 * 从本地存储获取JSON数据
 */
const getStorageData = <T>(key: string): T | null => {
  const data = localStorage.getItem(key)
  if (data) {
    try {
      return JSON.parse(data) as T
    } catch (e) {
      return null
    }
  }
  return null
}

/**
 * 用户状态管理
 */
export const useUserStore = defineStore('user', () => {
  // 状态 - 从本地存储初始化
  const token = ref<string | null>(localStorage.getItem('token'))
  const userInfo = ref<SysUserLoginVO | null>(getStorageData<SysUserLoginVO>(USER_INFO_KEY))
  const permissions = ref<SysPermissionVO[]>(getStorageData<SysPermissionVO[]>(PERMISSIONS_KEY) || [])
  const roles = ref<SysRoleVO[]>(getStorageData<SysRoleVO[]>(ROLES_KEY) || [])

  // 计算属性
  const isLogin = ref<boolean>(!!token.value && !!userInfo.value)
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
        
        // 保存token
        token.value = userData.accessToken
        localStorage.setItem('token', userData.accessToken)
        
        // 保存用户信息
        userInfo.value = userData
        localStorage.setItem(USER_INFO_KEY, JSON.stringify(userData))
        
        // 保存角色和权限
        roles.value = userData.roles || []
        localStorage.setItem(ROLES_KEY, JSON.stringify(userData.roles || []))
        
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
        localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(userPermissions))
        
        isLogin.value = true
        
        return true
      }
      return false
    } catch (error) {
      console.error('登录失败:', error)
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
      // 移除路由跳转逻辑，由调用组件处理
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
    
    // 清除本地存储
    localStorage.removeItem('token')
    localStorage.removeItem(USER_INFO_KEY)
    localStorage.removeItem(PERMISSIONS_KEY)
    localStorage.removeItem(ROLES_KEY)
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
      // 如果token有效但用户信息不存在或不完整，通过API获取最新用户信息
      const res = await AuthApi.getCurrentUser()
      if (res.success && res.data) {
        const userData = res.data
        
        // 更新用户信息
        userInfo.value = userData
        localStorage.setItem(USER_INFO_KEY, JSON.stringify(userData))
        
        // 更新角色和权限
        roles.value = userData.roles || []
        localStorage.setItem(ROLES_KEY, JSON.stringify(userData.roles || []))
        
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
        localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(userPermissions))
        
        isLogin.value = true
        return true
      }
      return false
    } catch (error) {
      // 如果获取用户信息失败但本地存储中有信息，尝试使用本地存储的数据
      if (userInfo.value) {
        return true
      }
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