import request from '@/utils/http'
import type { 
  Result, 
  TableDataResult, 
  PermissionPageQuery, 
  SysPermissionVO,
  SysPermission,
  SysPermissionAddDTO,
  SysPermissionDTO
} from '@/types/system'

/**
 * 权限服务类
 */
export class PermissionService {
  /**
   * 分页查询权限列表
   * @param params 查询参数
   * @returns 权限列表分页数据
   */
  static getPermissionList(params: PermissionPageQuery) {
    return request.get<TableDataResult<SysPermissionVO>>('/system/permission/list', params)
  }

  /**
   * 获取权限详情
   * @param id 权限ID
   * @returns 权限详情
   */
  static getPermissionDetail(id: string) {
    return request.get<Result<SysPermission>>(`/system/permission/${id}`)
  }

  /**
   * 添加权限
   * @param data 权限信息
   * @returns 是否成功
   */
  static addPermission(data: SysPermissionAddDTO) {
    return request.post<Result<boolean>>('/system/permission', data)
  }

  /**
   * 更新权限
   * @param data 权限信息
   * @returns 是否成功
   */
  static updatePermission(data: SysPermissionDTO) {
    return request.put<Result<boolean>>('/system/permission', data)
  }

  /**
   * 删除权限
   * @param id 权限ID
   * @returns 是否成功
   */
  static deletePermission(id: string) {
    return request.delete<Result<boolean>>(`/system/permission/${id}`)
  }

  /**
   * 批量删除权限
   * @param ids 权限ID数组
   * @returns 删除数量
   */
  static batchDeletePermissions(ids: string[]) {
    return request.delete<Result<number>>('/system/permission', { data: ids })
  }
} 

export default PermissionService 