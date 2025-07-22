import http from '@/utils/http'
import type { 
  PermissionPageQueryDTO, 
  SysPermissionAddDTO,
  SysPermissionDTO
} from '@/types/system'

// 分页查询权限列表
export function getPermissionList(params: PermissionPageQueryDTO) {
  return http.get('/system/permission/list', params)
}

// 获取权限详情
export function getPermissionDetail(id: string) {
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
export function deletePermission(id: string) {
  return http.delete(`/system/permission/${id}`)
}

// 批量删除权限
export function batchDeletePermissions(ids: string[]) {
  return http.delete('/system/permission', { data: ids })
} 