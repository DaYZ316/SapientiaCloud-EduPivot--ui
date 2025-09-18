import type {Component} from 'vue'
import {
    BookOutline,
    HomeOutline,
    KeyOutline,
    LogOutOutline,
    PeopleOutline,
    PersonCircleOutline,
    PersonOutline,
    SchoolOutline,
    SettingsOutline,
    ShieldCheckmarkOutline
} from '@vicons/ionicons5'
import {createIcon} from '@/utils/iconUtil'

// 菜单项类型定义
export interface MenuOption {
    key: string
    label: string
    icon: () => Component
    children?: MenuOption[]
}

export interface UserMenuOption {
    key: string
    label: string
    icon: () => Component
    type?: 'divider'
}

// 渲染图标的辅助函数
function renderIcon(icon: Component) {
    return () => createIcon(icon)
}

// 侧边栏菜单配置
export const getMenuOptions = (t: (key: string) => string): MenuOption[] => [
    {
        key: 'Dashboard',
        label: t('menu.dashboard'),
        icon: renderIcon(HomeOutline)
    },
    {
        key: 'Course',
        label: t('menu.course'),
        icon: renderIcon(BookOutline),
        children: [
            {
                key: 'MyCourses',
                label: t('menu.myCourses'),
                icon: renderIcon(BookOutline)
            },
            {
                key: 'CourseManagement',
                label: t('menu.courseManagement'),
                icon: renderIcon(BookOutline)
            }
        ]
    },
    {
        key: 'InfoManagement',
        label: t('menu.infoManagement'),
        icon: renderIcon(PeopleOutline),
        children: [
            {
                key: 'Teacher',
                label: t('menu.teacher'),
                icon: renderIcon(SchoolOutline)
            },
            {
                key: 'Student',
                label: t('menu.student'),
                icon: renderIcon(PersonCircleOutline)
            }
        ]
    },
    {
        key: 'system',
        label: t('menu.system'),
        icon: renderIcon(ShieldCheckmarkOutline),
        children: [
            {
                key: 'User',
                label: t('menu.user'),
                icon: renderIcon(PeopleOutline)
            },
            {
                key: 'Role',
                label: t('menu.role'),
                icon: renderIcon(KeyOutline)
            },
            {
                key: 'Permission',
                label: t('menu.permission'),
                icon: renderIcon(ShieldCheckmarkOutline)
            }
        ]
    },
    {
        key: 'Settings',
        label: t('menu.settings'),
        icon: renderIcon(SettingsOutline)
    }
]

// 用户下拉菜单选项
export const getUserMenuOptions = (t: (key: string) => string): UserMenuOption[] => [
    {
        key: 'profile',
        label: t('menu.profile'),
        icon: renderIcon(PersonOutline)
    },
    {
        key: 'logout',
        label: t('auth.logout'),
        icon: renderIcon(LogOutOutline)
    }
]

// 菜单路由映射
export const menuRouteMap: Record<string, string> = {
    'Dashboard': '/dashboard',
    'Profile': '/profile',
    'Settings': '/settings',
    'User': '/system/user',
    'Role': '/system/role',
    'Permission': '/system/permission',
    'Teacher': '/info/teacher',
    'Student': '/info/student',
    'CourseManagement': '/course',
    'MyCourses': '/course/my-courses'
}

// 菜单展开配置映射
export const menuExpandMap: Record<string, string[]> = {
    'CourseManagement': ['Course'],
    'MyCourses': ['Course'],
    'Teacher': ['InfoManagement'],
    'Student': ['InfoManagement'],
    'User': ['system'],
    'Role': ['system'],
    'Permission': ['system']
}