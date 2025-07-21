import request from '@/utils/http'
import type { 
  Result, 
  TableDataResult, 
  RolePageQuery, 
  SysRoleVO,
  SysRoleAddDTO,
  SysRoleDTO
} from '@/types/system'

/**
 * 角色服务类
 */
export class RoleService {
  /**
   * 分页查询角色列表
   * @param params 查询参数
   * @returns 角色列表分页数据
   */
  static getRoleList(params: RolePageQuery) {
    return request.get<TableDataResult<SysRoleVO>>('/system/role/list', params)
  }

  /**
   * 获取角色详情
   * @param id 角色ID
   * @returns 角色详情
   */
  static getRoleDetail(id: string) {
    return request.get<Result<SysRoleVO>>(`/system/role/${id}`)
  }

  /**
   * 添加角色
   * @param data 角色信息
   * @returns 是否成功
   */
  static addRole(data: SysRoleAddDTO) {
    return request.post<Result<boolean>>('/system/role/add', data)
  }

  /**
   * 更新角色
   * @param data 角色信息
   * @returns 是否成功
   */
  static updateRole(data: SysRoleDTO) {
    return request.put<Result<boolean>>('/system/role', data)
  }

  /**
   * 删除角色
   * @param id 角色ID
   * @returns 是否成功
   */
  static deleteRole(id: string) {
    return request.delete<Result<boolean>>(`/system/role/${id}`)
  }

  /**
   * 批量删除角色
   * @param ids 角色ID数组
   * @returns 删除数量
   */
  static batchDeleteRoles(ids: string[]) {
    return request.delete<Result<number>>(`/system/role`, { data: ids })
  }

  /**
   * 分配角色权限
   * @param roleId 角色ID
   * @param permissionIds 权限ID数组
   * @returns 是否成功
   */
  static assignRolePermissions(roleId: string, permissionIds: string[]) {
    return request.post<Result<boolean>>(`/system/role/${roleId}/permission`, permissionIds)
  }
} 

export default RoleService 