/**
 * 权限相关类型定义
 */

// 权限接口
export interface SysPermissionVO {
  id: string
  parentId: string
  permissionName: string
  permissionKey: string
  children?: SysPermissionVO[]
  sort: number
  createTime: string
  updateTime: string
} 