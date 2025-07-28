/**
 * 状态管理类型定义索引文件
 */
import type {SysPermissionVO, SysRoleVO, SysUserLoginVO} from '@/types'

// 用户存储类型定义
export interface UserStore {
    token: any
    userInfo: SysUserLoginVO | null
    permissions: SysPermissionVO[]
    roles: SysRoleVO[]
    isLogin: any
    login: (username: string, password: string) => Promise<boolean>
    logout: () => Promise<void>
    resetUserState: () => void
    validateToken: () => Promise<boolean>
    refreshUserInfo: () => Promise<boolean>
    hasRole: (roleKey: string) => boolean
    hasPermission: (permissionKey: string) => boolean
}

// 主题存储类型定义
export interface ThemeStore {
    themeMode: 'light' | 'dark'
    primaryColor: string
    defaultPrimaryColor: string
    locale: string
    defaultLocale: string
    isDarkMode: boolean
    setThemeMode: (mode: 'light' | 'dark') => void
    setPrimaryColor: (color: string) => void
    setLocale: (locale: string) => void
    resetSettings: () => void
    initSettings: () => void
} 