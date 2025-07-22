import http from '@/utils/http'
import type { 
  PermissionPageQueryDTO, 
  SysPermissionAddDTO,
  SysPermissionDTO
} from '@/types/system'

// 获取默认权限查询对象
export function getDefaultPermissionQuery(): PermissionPageQueryDTO {
  return {
    permissionName: undefined,
    permissionKey: undefined,
    parentId: undefined,
    startTime: undefined,
    endTime: undefined,
    pageNum: 1,
    pageSize: 10,
    orderByColumn: 'create_time',
    isAsc: 'asc'
  }
}

// 分页查询权限列表
export function sysPermissionList(params: PermissionPageQueryDTO) {
  return http.get('/system/permission/list', params)
}

// 获取权限详情
export function getPermissionById(id: string) {
  return http.get(`/system/permission/${id}`)
}

// 添加权限
export function addPermission(data: SysPermissionAddDTO) {
  return http.post('/system/permission', data)
}

// 更新权限
export function updatePermission(data: SysPermissionDTO) {
  return http.put('/system/permission', data)
}

// 删除权限
export function removePermission(id: string) {
  return http.delete(`/system/permission/${id}`)
}

// 批量删除权限
export function removePermissions(ids: string[]) {
  return http.delete('/system/permission', { data: ids })
} 