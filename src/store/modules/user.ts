import {defineStore} from 'pinia'
import {ref} from 'vue'
import type {SysPermissionVO, SysRoleVO, SysUserLoginVO} from '@/types'
import * as AuthApi from '@/api/auth/auth'

// 用于本地存储的键名
const TOKEN_KEY = 'token'

/**
 * 用户状态管理
 */
export const useUserStore = defineStore('user', () => {
    // 状态 - 仅从本地存储初始化token
    const token = ref<string | null>(localStorage.getItem(TOKEN_KEY))
    const userInfo = ref<SysUserLoginVO | null>(null)
    const permissions = ref<SysPermissionVO[]>([])
    const roles = ref<SysRoleVO[]>([])

    // 计算属性
    const isLogin = ref<boolean>(!!token.value)

    const hasRole = (roleKey: string): boolean =>
        roles.value.some((role: SysRoleVO) => role.roleKey === roleKey)

    /**
     * 检查一个权限是否是另一个权限的父权限
     */
    function isParentPermission(parentPerm: string, childPerm: string): boolean {
        // 如果完全相同，直接返回true
        if (parentPerm === childPerm) {
            return true
        }

        // 使用冒号拆分权限码
        const parentParts = parentPerm.split(':')
        const childParts = childPerm.split(':')

        // 父权限的部分必须少于或等于子权限的部分
        if (parentParts.length > childParts.length) {
            return false
        }

        // 检查父权限是否是子权限的前缀
        for (let i = 0; i < parentParts.length; i++) {
            if (parentParts[i] !== childParts[i]) {
                return false
            }
        }

        return true
    }

    // 检查用户是否具有指定权限
    const hasPermission = (permissionKey: string): boolean => {
        // 如果是ADMIN角色，直接放行
        for (let i = 0; i < roles.value.length; i++) {
            if (roles.value[i].roleKey === 'ADMIN') {
                return true
            }
        }

        // 检查是否有匹配的权限（包括父权限）
        for (let i = 0; i < permissions.value.length; i++) {
            const userPerm = permissions.value[i].permissionKey
            if (isParentPermission(userPerm, permissionKey)) {
                return true
            }
        }

        return false
    }

    /**
     * 登录
     */
    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            // 使用getDefaultSysUserLoginDTO函数创建DTO对象
            const loginDTO = AuthApi.getDefaultSysUserLoginDTO();
            loginDTO.username = username;
            loginDTO.password = password;

            const res = await AuthApi.login(loginDTO)
            if (res.success && res.data) {
                const userData = res.data

                // 仅保存token
                token.value = userData.accessToken
                localStorage.setItem(TOKEN_KEY, userData.accessToken)

                // 设置登录状态
                isLogin.value = true

                // 获取用户信息
                await refreshUserInfo()

                return true
            }
            return false
        } catch (error) {
            // HTTP错误已经在HTTP模块中处理，不需要在这里重复处理
            return false
        }
    }

    const register = async (username: string, password: string, confirmPassword: string): Promise<boolean> => {
        try {
            const registerDTO = AuthApi.getDefaultSysUserRegisterDTO();
            registerDTO.username = username;
            registerDTO.password = password;
            registerDTO.confirmPassword = confirmPassword;
            registerDTO.nickName = '默认用户'

            const res = await AuthApi.register(registerDTO)
            if (res.success && res.data) {
                const userData = res.data

                // 仅保存token
                token.value = userData.accessToken
                localStorage.setItem(TOKEN_KEY, userData.accessToken)

                // 获取用户信息
                await refreshUserInfo()

                return true
            }
            return false
        } catch (error) {
            return false
        }
    }

    /**
     * 登出
     */
    const logout = async (): Promise<void> => {
        try {
            if (token.value) {
                await AuthApi.logout()
            }
            // 无论API是否成功，都清除本地状态
            resetUserState()
        } catch (error) {
            resetUserState()
            throw error
        }
    }

    /**
     * 重置用户状态
     */
    const resetUserState = (): void => {
        token.value = null
        userInfo.value = null
        permissions.value = []
        roles.value = []
        isLogin.value = false

        // 清除本地存储中的token
        localStorage.removeItem(TOKEN_KEY)
    }

    /**
     * 验证令牌
     * @returns 令牌是否有效
     */
    const validateToken = async (): Promise<boolean> => {
        if (!token.value) return false

        try {
            const res = await AuthApi.validate(token.value)
            return (res.success && res.data)
        } catch (error) {
            resetUserState()
            return false
        }
    }

    /**
     * 刷新用户信息
     * @returns 是否成功获取用户信息
     */
    const refreshUserInfo = async (): Promise<boolean> => {
        if (!token.value) return false

        try {
            const res = await AuthApi.getCurrentUser()
            if (res.success && res.data) {
                const userData = res.data

                // 更新用户信息
                userInfo.value = userData

                // 更新角色和权限
                roles.value = userData.roles || []

                const userPermissions: SysPermissionVO[] = []

                // 合并所有权限
                if (userData.permissions && userData.permissions.length > 0) {
                    userPermissions.push(...userData.permissions)
                }

                // 合并角色中的权限
                if (userData.roles && userData.roles.length > 0) {
                    userData.roles.forEach((role: SysRoleVO) => {
                        if (role.permissions && role.permissions.length > 0) {
                            userPermissions.push(...role.permissions)
                        }
                    })
                }

                permissions.value = userPermissions
                return true
            }
            return false
        } catch (error) {
            return false
        }
    }

    return {
        // 状态
        token,
        userInfo,
        permissions,
        roles,
        isLogin,

        // 方法
        login,
        register,
        logout,
        resetUserState,
        validateToken,
        refreshUserInfo,
        hasRole,
        hasPermission
    }
}) 