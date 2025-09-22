import type {RouteRecordRaw} from 'vue-router'
import {createRouter, createWebHistory} from 'vue-router'
import {useLoadingBarStore, useUserStore} from '@/store'
import {TitleUtil} from '@/utils'

/**
 * 路由配置
 */
const routes: RouteRecordRaw[] = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/auth/index.vue'),
        meta: {
            title: '登录',
            requiresAuth: false
        }
    },
    {
        path: '/',
        name: 'Layout',
        component: () => import('@/components/layout/AppLayout.vue'),
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                name: 'Dashboard',
                component: () => import('@/views/dashboard/index.vue'),
                meta: {
                    title: '首页',
                    requiresAuth: true
                }
            },
            {
                path: 'profile',
                name: 'Profile',
                component: () => import('@/views/profile/index.vue'),
                meta: {
                    title: '个人资料',
                    requiresAuth: true
                }
            },
            {
                path: 'settings',
                name: 'Settings',
                component: () => import('@/views/settings/index.vue'),
                meta: {
                    title: '设置',
                    requiresAuth: true
                }
            },
            {
                path: 'system/user',
                name: 'User',
                component: () => import('@/views/system/user/index.vue'),
                meta: {
                    title: '用户管理',
                    requiresAuth: true
                }
            },
            {
                path: 'system/role',
                name: 'Role',
                component: () => import('@/views/system/role/index.vue'),
                meta: {
                    title: '角色管理',
                    requiresAuth: true
                }
            },
            {
                path: 'system/permission',
                name: 'Permission',
                component: () => import('@/views/system/permission/index.vue'),
                meta: {
                    title: '权限管理',
                    requiresAuth: true
                }
            },
            {
                path: 'info/teacher',
                name: 'Teacher',
                component: () => import('@/views/info/teacher/index.vue'),
                meta: {
                    title: '教师管理',
                    requiresAuth: true
                }
            },
            {
                path: 'info/student',
                name: 'Student',
                component: () => import('@/views/info/student/index.vue'),
                meta: {
                    title: '学生管理',
                    requiresAuth: true
                }
            },
            {
                path: 'course',
                name: 'CourseManagement',
                component: () => import('@/views/course/index.vue'),
                meta: {
                    title: '课程管理',
                    requiresAuth: true
                }
            },
            {
                path: 'course/my-courses',
                name: 'MyCourses',
                component: () => import('@/views/course/MyCourse/index.vue'),
                meta: {
                    title: '我的课程',
                    requiresAuth: true
                }
            },
            {
                path: 'course/detail/:courseId',
                name: 'CourseDetail',
                component: () => import('@/views/course/CourseDetail/index.vue'),
                meta: {
                    title: '课程详情',
                    requiresAuth: true
                }
            },
            {
                path: 'course/:courseId/students',
                name: 'CourseStudents',
                component: () => import('@/views/course/CourseStudents/index.vue'),
                meta: {
                    title: '课程学生',
                    requiresAuth: true
                }
            },
            {
                path: 'course/:courseId/forum',
                name: 'CourseForum',
                component: () => import('@/views/course/CourseForum/index.vue'),
                meta: {
                    title: '课程论坛',
                    requiresAuth: true
                }
            },
            {
                path: 'course/:courseId/chapters',
                name: 'CourseChapters',
                component: () => import('@/views/course/CourseChapters/index.vue'),
                meta: {
                    title: '课程章节',
                    requiresAuth: true
                }
            },
            {
                path: 'course/:courseId/classroom',
                name: 'CourseClassroom',
                component: () => import('@/views/course/CourseClassroom/index.vue'),
                meta: {
                    title: '在线课堂',
                    requiresAuth: true
                }
            },
            {
                path: 'teacher/profile/:teacherId',
                name: 'TeacherProfile',
                component: () => import('@/components/common/TeacherProfile.vue'),
                meta: {
                    title: '教师主页',
                    requiresAuth: true
                }
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/components/common/NotFound.vue'),
        meta: {
            title: '404',
            requiresAuth: false
        }
    }
]

/**
 * 创建路由实例
 */
const router = createRouter({
    history: createWebHistory(),
    routes
})

/**
 * 路由守卫
 */
router.beforeEach(async (to, _from, next) => {
    // 开始加载条
    const loadingBarStore = useLoadingBarStore()
    loadingBarStore.start()

    // 设置页面标题
    TitleUtil.setTitleByPath(to.path)

    // 检查是否需要登录权限
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const userStore = useUserStore()

    // 如果有token但用户信息不完整，尝试验证token
    if (userStore.token && !userStore.isLogin) {
        // 验证token有效性
        const isValid = await userStore.validateToken()
        if (isValid) {
            // 尝试恢复用户信息
            await userStore.refreshUserInfo()
        }
    }

    // 根路径特殊处理，检查JWT并重定向
    if (to.path === '/') {
        if (userStore.token) {
            // 验证token有效性
            const isValid = await userStore.validateToken()
            if (isValid) {
                // 如果JWT存在且有效，直接重定向到主页
                return next('/dashboard')
            } else {
                // 如果JWT无效，重定向到登录页
                return next('/login')
            }
        } else {
            // 如果JWT不存在，重定向到登录页
            return next('/login')
        }
    }

    if (requiresAuth && !userStore.isLogin) {
        next({name: 'Login', query: {redirect: to.fullPath}})
    } else if (to.name === 'Login' && userStore.isLogin) {
        next({name: 'Dashboard'})
    } else {
        next()
    }
})

/**
 * 路由后置守卫
 */
router.afterEach((_to, _from) => {
    // 完成加载条
    const loadingBarStore = useLoadingBarStore()
    loadingBarStore.finish()
})

export default router