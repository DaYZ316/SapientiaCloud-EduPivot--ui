import http from '@/utils/http'
import type { UserPageQueryDTO, SysUserDTO } from '@/types/system/user'

// 获取用户列表
export function getUserList(params: UserPageQueryDTO) {
  return http.get('/system/user/list', params)
}

// 根据ID获取用户
export function getUserById(id: string) {
  return http.get(`/system/user/${id}`)
}

// 更新用户
export function updateUser(data: SysUserDTO) {
  return http.put('/system/user', data)
}

// 删除用户
export function deleteUser(id: string) {
  return http.delete(`/system/user/${id}`)
}

// 批量删除用户
export function batchDeleteUsers(ids: string[]) {
  return http.delete('/system/user', { data: ids })
}

// 分配用户角色
export function assignUserRoles(userId: string, roleIds: string[]) {
  return http.post(`/system/user/${userId}/role`, roleIds)
} 