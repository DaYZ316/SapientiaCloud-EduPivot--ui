/**
 * 类型定义索引文件
 */

// 导出通用类型
export * from './common'

// 导出系统模块类型（优先）
export type {
  // 明确导出system模块的Result和PageQuery，覆盖common模块中的同名接口
  Result,
  PageQuery,
  
  // 导出system模块的其他接口
  PageResult,
  TableDataResult,
  
  // 用户相关
  SysUserVO,
  SysUserLoginVO,
  SysUserInternalVO,
  SysUserDTO,
  SysUserRegisterDTO,
  RegisterParams,
  UserPageQuery,
  
  // 角色相关
  SysRoleVO,
  
  // 权限相关
  SysPermissionVO
} from './system'

// 导出状态管理相关类型
export * from './store'

// 导出国际化相关类型
export * from './i18n' 