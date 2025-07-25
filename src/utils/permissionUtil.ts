import type { DirectiveBinding } from 'vue'
import { useUserStore } from '@/store'

/**
 * 权限指令 v-hasPermission
 * 用法：v-hasPermission="'permission-key'" 或 v-hasPermission="['permission-key1', 'permission-key2']"
 * 如果用户没有权限，元素将被从DOM中移除
 */
export default {
  mounted(el: HTMLElement, binding: DirectiveBinding) {
    // 获取指令的值（单个权限字符串或权限数组）
    const permission = binding.value
    
    // 检查权限
    if (!hasPermission(permission)) {
      // 无权限，移除元素
      el.parentNode?.removeChild(el)
    }
  }
}

/**
 * 检查一个权限是否是另一个权限的父权限
 * 例如：'system:user' 是 'system:user:add' 的父权限
 * @param parentPermission 可能的父权限
 * @param childPermission 要检查的子权限
 * @returns 是否为父子权限关系
 */
function isParentPermission(parentPermission: string, childPermission: string): boolean {
  // 如果两个权限相同，直接返回true
  if (parentPermission === childPermission) {
    return true
  }
  
  // 使用冒号拆分权限码
  const parentParts = parentPermission.split(':')
  const childParts = childPermission.split(':')
  
  // 父权限的部分必须少于或等于子权限的部分
  if (parentParts.length > childParts.length) {
    return false
  }
  
  // 检查父权限是否是子权限的前缀
  for (let i = 0; i < parentParts.length; i++) {
    if (parentParts[i] !== childParts[i]) {
      return false
    }
  }
  
  return true
}

/**
 * 检查用户是否拥有指定权限
 * @param permission 单个权限字符串或权限数组
 * @returns 是否拥有权限
 */
export function hasPermission(permission: string | string[]): boolean {
  const userStore = useUserStore()
  
  // 如果未登录，直接返回false
  if (!userStore.isLogin) {
    return false
  }
  
  // 检查是否有ADMIN角色，如果有则直接放行
  for (let i = 0; i < userStore.roles.length; i++) {
    if (userStore.roles[i].roleKey === 'ADMIN') {
      return true
    }
  }
  
  // 如果传入的是单个权限字符串
  if (typeof permission === 'string') {
    return checkPermission(permission, userStore.permissions)
  }
  
  // 如果传入的是权限数组，检查是否拥有其中任意一个权限（OR关系）
  for (let i = 0; i < permission.length; i++) {
    if (checkPermission(permission[i], userStore.permissions)) {
      return true
    }
  }
  
  return false
}

/**
 * 检查权限列表中是否包含指定权限
 */
function checkPermission(targetPermission: string, permissionsList: Array<any>): boolean {
  // 遍历用户权限列表
  for (let i = 0; i < permissionsList.length; i++) {
    const userPerm = permissionsList[i].permissionKey
    // 检查是否有对应权限或父权限
    if (isParentPermission(userPerm, targetPermission)) {
      return true
    }
  }
  return false
}

/**
 * 检查用户是否拥有指定的所有权限
 * @param permissions 权限数组
 * @returns 是否拥有所有权限
 */
export function hasAllPermissions(permissions: string[]): boolean {
  const userStore = useUserStore()
  
  // 如果未登录，直接返回false
  if (!userStore.isLogin) {
    return false
  }
  
  // 检查是否有ADMIN角色，如果有则直接放行
  for (let i = 0; i < userStore.roles.length; i++) {
    if (userStore.roles[i].roleKey === 'ADMIN') {
      return true
    }
  }
  
  // 检查是否拥有所有权限（AND关系）
  for (let i = 0; i < permissions.length; i++) {
    if (!checkPermission(permissions[i], userStore.permissions)) {
      return false
    }
  }
  
  return true
} 