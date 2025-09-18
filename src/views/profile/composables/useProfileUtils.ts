import {computed} from 'vue'
import {useI18n} from 'vue-i18n'
import {useUserStore} from '@/store'
import type {SysPermissionVO} from '@/types/system'

export function useProfileUtils() {
    const userStore = useUserStore()
    const {t} = useI18n()

    const userInfo = computed(() => userStore.userInfo)
    const userRoles = computed(() => userStore.userInfo?.roles || [])
    const studentInfo = computed(() => userStore.studentInfo)
    const teacherInfo = computed(() => userStore.teacherInfo)

    // 检查是否为admin角色
    const isAdmin = computed(() => {
        return userRoles.value.some(role => role.roleKey === 'ADMIN' || role.admin === true)
    })

    // 检查是否为学生角色
    const isStudent = computed(() => {
        return userStore.hasRole('STUDENT') && studentInfo.value
    })

    // 检查是否为教师角色
    const isTeacher = computed(() => {
        return userStore.hasRole('TEACHER') && teacherInfo.value
    })

    // 账户创建天数
    const accountAgeDays = computed(() => {
        if (!userInfo.value?.createTime) return 0

        const createDate = new Date(userInfo.value.createTime)
        const today = new Date()
        const diffTime = today.getTime() - createDate.getTime()
        return Math.floor(diffTime / (1000 * 60 * 60 * 24))
    })

    // 获取用户权限
    const userPermissions = computed(() => {
        // 如果userStore.permissions已经存在，则直接使用
        if (userStore.permissions && userStore.permissions.length > 0) {
            return userStore.permissions;
        }

        // 否则从用户信息中提取权限
        const allPermissions: SysPermissionVO[] = [];

        // 合并用户直接拥有的权�?
        if (userInfo.value && userInfo.value.permissions) {
            allPermissions.push(...userInfo.value.permissions);
        }

        // 合并角色中包含的权限
        if (userRoles.value && userRoles.value.length > 0) {
            userRoles.value.forEach(role => {
                if (role.permissions && role.permissions.length > 0) {
                    allPermissions.push(...role.permissions);
                }
            });
        }

        // 去重
        const uniquePermissions = new Map<string, SysPermissionVO>();
        allPermissions.forEach(perm => {
            if (!uniquePermissions.has(perm.id)) {
                uniquePermissions.set(perm.id, perm);
            }
        });

        return Array.from(uniquePermissions.values());
    })

    return {
        userInfo,
        userRoles,
        studentInfo,
        teacherInfo,
        isAdmin,
        isStudent,
        isTeacher,
        accountAgeDays,
        userPermissions
    }
}
