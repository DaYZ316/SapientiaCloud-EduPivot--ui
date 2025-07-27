import http from '@/utils/http'
import type {
  RegisterParams,
  SysUserAdminDTO,
  SysUserDTO,
  SysUserProfileDTO,
  UserPageQueryDTO
} from '@/types/system/user'

// 获取默认用户查询对象
export function getDefaultUserQuery(): UserPageQueryDTO {
  return {
    username: null,
    nickName: null,
    gender: null,
    status: null,
    mobile: null,
    email: null,
    startTime: null,
    endTime: null,
    pageNum: 1,
    pageSize: 10,
    orderByColumn: 'create_time',
    isAsc: 'asc'
  }
}

// 获取默认管理员添加用户对象
export function getDefaultSysUserAdminDTO(): SysUserAdminDTO {
  return {
    username: null,
    nickName: null,
    email: null,
    mobile: null,
    gender: 0,
    avatar: null,
    status: 0
  }
}

// 获取默认用户修改DTO
export function getDefaultSysUserDTO(): SysUserDTO {
  return {
    id: null,
    nickName: null,
    email: null,
    mobile: null,
    gender: 0,
    avatar: null,
    status: 0,
    lastLoginTime: null
  }
}

// 获取默认用户注册参数
export function getDefaultRegisterParams(): RegisterParams {
    return {
    username: null,
    password: null,
    confirmPassword: null,
    avatar: null,
    nickName: null
  }
}

// 获取默认用户个人信息DTO
export function getDefaultSysUserProfileDTO(): SysUserProfileDTO {
  return {
    username: null,
    nickName: null,
    email: null,
    mobile: null,
    gender: 0,
    avatar: null
  }
}

// 获取用户列表
export function sysUserList(params: UserPageQueryDTO) {
  return http.get('/system/user/list', params)
}

// 获取所有用户
export function getAllUsers() {
  return http.get('/system/user/all')
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

// 更新用户个人信息
export function updateUserProfile(data: SysUserProfileDTO) {
  return http.put('/system/user/profile', data)
}