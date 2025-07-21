import request from '@/utils/http'
import type { 
  Result, 
  TableDataResult, 
  UserPageQuery, 
  SysUserDTO, 
  SysUserVO, 
  SysUserRegisterDTO,
  SysUserInternalVO,
  SysPermissionVO,
  SysRoleVO
} from '@/types/system'

/**
 * 用户服务类
 */
export class UserService {
  /**
   * 分页查询用户列表
   * @param params 查询参数
   * @returns 用户列表分页数据
   */
  static getUserList(params: UserPageQuery) {
    return request.get<TableDataResult<SysUserVO>>('/system/user/list', params)
  }

  /**
   * 获取用户详情
   * @param id 用户ID
   * @returns 用户详情
   */
  static getUserDetail(id: string) {
    return request.get<Result<SysUserVO>>(`/system/user/${id}`)
  }

  /**
   * 更新用户
   * @param data 用户信息
   * @returns 是否成功
   */
  static updateUser(data: SysUserDTO) {
    return request.put<Result<boolean>>('/system/user', data)
  }

  /**
   * 删除用户
   * @param id 用户ID
   * @returns 是否成功
   */
  static deleteUser(id: string) {
    return request.delete<Result<boolean>>(`/system/user/${id}`)
  }

  /**
   * 批量删除用户
   * @param ids 用户ID数组
   * @returns 删除数量
   */
  static batchDeleteUsers(ids: string[]) {
    return request.delete<Result<number>>('/system/user', { data: ids })
  }

  /**
   * 分配用户角色
   * @param userId 用户ID
   * @param roleIds 角色ID数组
   * @returns 是否成功
   */
  static assignUserRoles(userId: string, roleIds: string[]) {
    return request.post<Result<boolean>>(`/system/user/${userId}/role`, roleIds)
  }

  /**
   * 注册用户 (内部接口)
   * @param data 注册信息
   * @returns 是否成功
   */
  static register(data: SysUserRegisterDTO) {
    return request.post<Result<boolean>>('/system/user/internal/register', data)
  }

  /**
   * 根据用户名获取用户信息 (内部接口)
   * @param username 用户名
   * @returns 用户信息
   */
  static getUserInfoByUsername(username: string) {
    return request.get<Result<SysUserInternalVO>>(`/system/user/internal/info/${username}`)
  }

  /**
   * 更新用户信息 (内部接口)
   * @param data 用户信息
   * @returns 是否成功
   */
  static updateUserInfo(data: SysUserDTO) {
    return request.put<Result<boolean>>('/system/user/internal/update', data)
  }

  /**
   * 获取用户权限列表 (内部接口)
   * @param userId 用户ID
   * @returns 权限列表
   */
  static getUserPermissions(userId: string) {
    return request.get<Result<SysPermissionVO[]>>(`/system/user/internal/${userId}/permission`)
  }

  /**
   * 获取用户角色列表 (内部接口)
   * @param userId 用户ID
   * @returns 角色列表
   */
  static getUserRoles(userId: string) {
    return request.get<Result<SysRoleVO[]>>(`/system/user/internal/${userId}/role`)
  }
} 

export default UserService 