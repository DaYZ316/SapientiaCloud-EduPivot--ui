import type {Component} from 'vue'
import {
    BookOutline,
    ChatbubblesOutline,
    DocumentTextOutline,
    HomeOutline,
    KeyOutline,
    LibraryOutline,
    LogOutOutline,
    PeopleCircleOutline,
    PeopleOutline,
    PersonCircleOutline,
    PersonOutline,
    SchoolOutline,
    SettingsOutline,
    ShieldCheckmarkOutline,
    VideocamOutline
} from '@vicons/ionicons5'
import {createIcon} from '@/utils/iconUtil'

// 菜单项类型定义
export interface MenuOption {
    key: string
    label: string
    icon: () => Component
    children?: MenuOption[]
    dynamic?: boolean // 标记是否为动态菜单项
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

// 创建动态课程详情菜单项
export const createCourseDetailMenuOption = (t: (key: string) => string, courseName: string, courseId?: string): MenuOption => ({
    key: 'CourseDetail',
    label: courseName || t('menu.courseDetail'),
    icon: renderIcon(BookOutline),
    dynamic: true,
    children: courseId ? [
        {
            key: 'CourseOverview',
            label: t('menu.courseOverview'),
            icon: renderIcon(BookOutline)
        },
        {
            key: 'CourseChapters',
            label: t('menu.courseChapters'),
            icon: renderIcon(LibraryOutline)
        },
        {
            key: 'CourseForum',
            label: t('menu.courseForum'),
            icon: renderIcon(ChatbubblesOutline)
        },
        {
            key: 'CourseStudents',
            label: t('menu.courseStudents'),
            icon: renderIcon(PeopleCircleOutline)
        },
        {
            key: 'CourseClassroom',
            label: t('menu.courseClassroom'),
            icon: renderIcon(VideocamOutline)
        }
    ] : undefined
})

// 创建文件预览菜单项
export const createFilePreviewMenuOption = (t: (key: string) => string): MenuOption => ({
    key: 'FilePreview',
    label: t('menu.filePreview'),
    icon: renderIcon(DocumentTextOutline),
    dynamic: true
})

// 侧边栏菜单配置
export const getMenuOptions = (t: (key: string) => string, dynamicMenuItems: MenuOption[] = [], lastCourseName?: string, lastCourseId?: string): MenuOption[] => {
    const baseMenuOptions: MenuOption[] = [
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
                },
                // 课程详情菜单项 - 常态显示，显示最后访问的课程名称
                {
                    key: 'CourseDetail',
                    label: lastCourseName || t('menu.courseDetail'),
                    icon: renderIcon(BookOutline),
                    dynamic: true,
                    children: lastCourseId ? [
                        {
                            key: 'CourseOverview',
                            label: t('menu.courseOverview'),
                            icon: renderIcon(BookOutline)
                        },
                        {
                            key: 'CourseChapters',
                            label: t('menu.courseChapters'),
                            icon: renderIcon(LibraryOutline)
                        },
                        {
                            key: 'CourseForum',
                            label: t('menu.courseForum'),
                            icon: renderIcon(ChatbubblesOutline)
                        },
                        {
                            key: 'CourseStudents',
                            label: t('menu.courseStudents'),
                            icon: renderIcon(PeopleCircleOutline)
                        },
                        {
                            key: 'CourseClassroom',
                            label: t('menu.courseClassroom'),
                            icon: renderIcon(VideocamOutline)
                        }
                    ] : undefined
                },
                // 其他动态菜单项会在这里插入
                ...dynamicMenuItems.filter(item => item.key !== 'CourseDetail')
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

    // 将动态菜单项添加到基础菜单选项中
    return [...baseMenuOptions, ...dynamicMenuItems]
}

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
    'FilePreview': '/file/preview',
    'User': '/system/user',
    'Role': '/system/role',
    'Permission': '/system/permission',
    'Teacher': '/info/teacher',
    'Student': '/info/student',
    'CourseManagement': '/course',
    'MyCourses': '/course/my-courses',
    'CourseDetail': '/course/detail', // 课程详情路由前缀
    'CourseOverview': '/course/detail', // 课程概览
    'CourseChapters': '/course/detail', // 课程章节
    'CourseForum': '/course/detail', // 课程论坛
    'CourseStudents': '/course/detail', // 课程学生
    'CourseClassroom': '/course/detail' // 课程课堂
}

// 菜单展开配置映射
export const menuExpandMap: Record<string, string[]> = {
    'CourseManagement': ['Course'],
    'MyCourses': ['Course'],
    'CourseDetail': ['Course'], // 课程详情页面展开课程菜单
    'CourseOverview': ['Course', 'CourseDetail'], // 课程概览页面展开课程和课程详情菜单
    'CourseChapters': ['Course', 'CourseDetail'], // 课程章节页面展开课程和课程详情菜单
    'CourseForum': ['Course', 'CourseDetail'], // 课程论坛页面展开课程和课程详情菜单
    'CourseStudents': ['Course', 'CourseDetail'], // 课程学生页面展开课程和课程详情菜单
    'CourseClassroom': ['Course', 'CourseDetail'], // 课程课堂页面展开课程和课程详情菜单
    'Teacher': ['InfoManagement'],
    'Student': ['InfoManagement'],
    'User': ['system'],
    'Role': ['system'],
    'Permission': ['system'],
    'FilePreview': [] // 文件预览页面不需要展开任何菜单
}