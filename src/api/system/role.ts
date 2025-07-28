import http from '@/utils/http'
import type {RolePageQueryDTO, SysRoleAddDTO, SysRoleDTO} from '@/types/system'

// 获取默认角色查询对象
export function getDefaultRoleQuery(): RolePageQueryDTO {
    return {
        roleName: null,
        roleKey: null,
        status: null,
        startTime: null,
        endTime: null,
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'sort',
        isAsc: 'asc'
    }
}

// 获取默认角色添加DTO
export function getDefaultSysRoleAddDTO(): SysRoleAddDTO {
    return {
        roleName: null,
        roleKey: null,
        sort: null,
        status: null,
        description: null
    }
}

// 获取默认角色更新DTO
export function getDefaultSysRoleDTO(): SysRoleDTO {
    return {
        id: null,
        roleName: null,
        roleKey: null,
        sort: null,
        status: null,
        description: null,
        admin: null
    }
}

// 分页查询角色列表
export function sysRoleList(params: RolePageQueryDTO) {
    return http.get('/system/role/list', params)
}

// 获取所有角色
export function getAllRoles() {
    return http.get('/system/role/all')
}

// 获取角色详情
export function getRoleDetail(id: string) {
    return http.get(`/system/role/${id}`)
}

// 添加角色
export function addRole(data: SysRoleAddDTO) {
    return http.post('/system/role', data)
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
    return http.delete('/system/role', {data: ids})
}

// 分配角色权限
export function assignRolePermissions(roleId: string, permissionIds: string[]) {
    return http.post(`/system/role/${roleId}/permission`, permissionIds)
} 