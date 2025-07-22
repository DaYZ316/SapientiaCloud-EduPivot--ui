import http from '@/utils/http'
import type { 
  RolePageQueryDTO, 
  SysRoleAddDTO,
  SysRoleDTO
} from '@/types/system'

// 分页查询角色列表
export function getRoleList(params: RolePageQueryDTO) {
  return http.get('/system/role/list', params)
}

// 获取角色详情
export function getRoleDetail(id: string) {
  return http.get(`/system/role/${id}`)
}

// 添加角色
export function addRole(data: SysRoleAddDTO) {
  return http.post('/system/role/add', data)
}

// 更新角色
export function updateRole(data: SysRoleDTO) {
  return http.put('/system/role', data)
}

// 删除角色
export function deleteRole(id: string) {
  return http.delete(`/system/role/${id}`)
}

// 批量删除角色
export function batchDeleteRoles(ids: string[]) {
  return http.delete('/system/role', { data: ids })
}

// 分配角色权限
export function assignRolePermissions(roleId: string, permissionIds: string[]) {
  return http.post(`/system/role/${roleId}/permission`, permissionIds)
} 