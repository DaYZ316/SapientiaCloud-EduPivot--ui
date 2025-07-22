import http from '@/utils/http'
import type { 
  RolePageQueryDTO, 
  SysRoleAddDTO,
  SysRoleDTO
} from '@/types/system'

// 获取默认角色查询对象
export function getDefaultRoleQuery(): RolePageQueryDTO {
  return {
    roleName: undefined,
    roleKey: undefined,
    status: undefined,
    startTime: undefined,
    endTime: undefined,
    pageNum: 1,
    pageSize: 10,
    orderByColumn: 'create_time',
    isAsc: 'asc'
  }
}

// 分页查询角色列表
export function sysRoleList(params: RolePageQueryDTO) {
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
export function removeRole(id: string) {
  return http.delete(`/system/role/${id}`)
}

// 批量删除角色
export function removeRoles(ids: string[]) {
  return http.delete('/system/role', { data: ids })
}

// 分配角色权限
export function assignRolePermissions(roleId: string, permissionIds: string[]) {
  return http.post(`/system/role/${roleId}/permission`, permissionIds)
} 