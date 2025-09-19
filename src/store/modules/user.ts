import {defineStore} from 'pinia'
import {ref} from 'vue'
import type {StudentVO, SysPermissionVO, SysRoleVO, SysUserLoginVO, TeacherVO} from '@/types'
import * as AuthApi from '@/api/auth/auth'
import * as StudentApi from '@/api/student'
import * as TeacherApi from '@/api/teacher'

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
    const studentInfo = ref<StudentVO | null>(null)
    const teacherInfo = ref<TeacherVO | null>(null)

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
        if (roles.value.some(role => role.roleKey === 'ADMIN')) {
            return true
        }

        // 检查是否有匹配的权限（包括父权限）
        return permissions.value.some(perm =>
            isParentPermission(perm.permissionKey, permissionKey)
        )
    }

    /**
     * 设置登录状态和token
     */
    const setLoginState = (accessToken: string): void => {
        token.value = accessToken
        localStorage.setItem(TOKEN_KEY, accessToken)
        isLogin.value = true
        
        // 重置HTTP客户端的登录失效处理状态，确保下次登录失效时能正常弹出通知
        import('@/utils/http').then(({ default: httpClient }) => {
            httpClient.resetUnauthorizedHandling()
        })
    }

    /**
     * 登录
     */
    const login = async (username: string, password: string): Promise<boolean> => {
        try {
            const loginDTO = AuthApi.getDefaultSysUserLoginDTO()
            loginDTO.username = username
            loginDTO.password = password

            const res = await AuthApi.login(loginDTO)
            if (res.success && res.data) {
                setLoginState(res.data.accessToken)
                await refreshUserInfo()
                return true
            }
            return false
        } catch (error) {
            return false
        }
    }

    const register = async (username: string, password: string, confirmPassword: string): Promise<boolean> => {
        try {
            const registerDTO = AuthApi.getDefaultSysUserRegisterDTO()
            registerDTO.username = username
            registerDTO.password = password
            registerDTO.confirmPassword = confirmPassword
            registerDTO.nickName = '默认用户'

            const res = await AuthApi.register(registerDTO)
            if (res.success && res.data) {
                setLoginState(res.data.accessToken)
                await refreshUserInfo()
                return true
            }
            return false
        } catch (error) {
            return false
        }
    }

    /**
     * 验证码登录
     */
    const loginWithVerificationCode = async (mobile: string, verificationCode: string): Promise<boolean> => {
        try {
            const mobileLoginDTO = AuthApi.getDefaultSysUserMobileLoginDTO()
            mobileLoginDTO.mobile = mobile
            mobileLoginDTO.verificationCode = verificationCode

            const res = await AuthApi.mobileLogin(mobileLoginDTO)
            if (res.success && res.data) {
                setLoginState(res.data.accessToken)
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
        studentInfo.value = null
        teacherInfo.value = null
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
            const res = await AuthApi.validateToken(token.value)
            return (res.success && res.data)
        } catch (error) {
            resetUserState()
            return false
        }
    }

    /**
     * 根据用户ID查询学生和教师信息
     * @param sysUserId 系统用户ID
     */
    const fetchUserRoleInfo = async (sysUserId: string): Promise<void> => {
        try {
            // 直接查询学生和教师信息，不依赖角色判断
            // 这样可以确保在角色绑定完成后能立即获取到最新的信息
            const tasks = [
                StudentApi.getStudentByUserId(sysUserId),
                TeacherApi.getTeacherByUserId(sysUserId)
            ]

            // 并行查询
            const results = await Promise.allSettled(tasks)

            // 处理学生信息结果
            const studentRes = results[0]
            studentInfo.value = studentRes.status === 'fulfilled' &&
            studentRes.value.success && studentRes.value.data ?
                studentRes.value.data : null

            // 处理教师信息结果
            const teacherRes = results[1]
            teacherInfo.value = teacherRes.status === 'fulfilled' &&
            teacherRes.value.success && teacherRes.value.data ?
                teacherRes.value.data : null
        } catch (error) {
            studentInfo.value = null
            teacherInfo.value = null
        }
    }

    /**
     * 刷新用户信息
     * @returns 是否成功获取用户信息
     */
    const refreshUserInfo = async (): Promise<boolean> => {
        if (!token.value) return false

        try {
            const res = await AuthApi.getUserInfo()
            if (res.success && res.data) {
                const userData = res.data

                // 更新用户信息
                userInfo.value = userData

                // 更新角色和权限
                roles.value = userData.roles || []

                // 合并所有权限
                const userPermissions: SysPermissionVO[] = [
                    ...(userData.permissions || []),
                    ...(userData.roles || []).flatMap((role: SysRoleVO) => role.permissions || [])
                ]

                permissions.value = userPermissions

                // 查询学生和教师信息
                await fetchUserRoleInfo(userData.id)

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
        studentInfo,
        teacherInfo,
        isLogin,

        // 方法
        login,
        register,
        loginWithVerificationCode,
        logout,
        resetUserState,
        validateToken,
        refreshUserInfo,
        fetchUserRoleInfo,
        hasRole,
        hasPermission
    }
}) 