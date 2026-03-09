import http from '@/utils/http'
import type {PermissionPageQueryDTO, SysPermissionAddDTO, SysPermissionDTO} from '@/types/system'

// 获取默认权限查询对象
export function getDefaultPermissionQuery(): PermissionPageQueryDTO {
    return {
        permissionName: null,
        permissionKey: null,
        parentId: null,
        startTime: null,
        endTime: null,
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'sort',
        isAsc: 'asc'
    }
}

// 获取默认权限添加DTO
export function getDefaultSysPermissionAddDTO(): SysPermissionAddDTO {
    return {
        parentId: null,
        permissionName: null,
        permissionKey: null,
        sort: 0
    }
}

// 获取默认权限更新DTO
export function getDefaultSysPermissionDTO(): SysPermissionDTO {
    return {
        id: null,
        parentId: null,
        permissionName: null,
        permissionKey: null,
        sort: 0
    }
}

// 分页查询权限列表
export function sysPermissionList(params: PermissionPageQueryDTO) {
    return http.getTableData('/system/permission/list', params)
}

// 查询权限树结构
export function getPermissionTree() {
    return http.get('/system/permission/tree')
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
    return http.delete('/system/permission', {data: ids})
} 