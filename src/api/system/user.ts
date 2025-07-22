import http from '@/utils/http'
import type { UserPageQueryDTO, SysUserDTO, SysUserAdminDTO } from '@/types/system/user'

// 获取默认用户查询对象
export function getDefaultUserQuery(): UserPageQueryDTO {
  return {
    username: undefined,
    nickName: undefined,
    gender: undefined,
    status: undefined,
    mobile: undefined,
    email: undefined,
    startTime: undefined,
    endTime: undefined,
    pageNum: 1,
    pageSize: 10,
    orderByColumn: 'create_time',
    isAsc: 'asc'
  }
}

// 获取用户列表
export function sysUserList(params: UserPageQueryDTO) {
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
export function removeUser(id: string) {
  return http.delete(`/system/user/${id}`)
}

// 批量删除用户
export function removeUsers(ids: string[]) {
  return http.delete('/system/user', { data: ids })
}

// 分配用户角色
export function assignUserRoles(userId: string, roleIds: string[]) {
  return http.post(`/system/user/${userId}/role`, roleIds)
} 

// 管理员添加用户
export function addSysUser(data: SysUserAdminDTO) {
  return http.post('/system/user/add', data)
}