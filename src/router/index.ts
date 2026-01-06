import type {RouteRecordRaw} from 'vue-router'
import {createRouter, createWebHistory} from 'vue-router'
import {useLoadingBarStore, useTransitionStore, useUserStore} from '@/store'
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
        path: '/api/auth/oauth2/callback/:provider',
        name: 'OAuthRedirect',
        component: () => import('@/views/auth/OAuthRedirect.vue'),
        meta: {
            title: 'OAuth回调',
            requiresAuth: false
        }
    },
    {
        path: '/',
        name: 'Layout',
        component: () => import('@/components/layout/AppLayout.vue'),
        redirect: '/login',
        children: [
            {
                path: '/dashboard',
                name: 'Dashboard',
                component: () => import('@/views/dashboard/index.vue'),
                meta: {
                    title: '首页',
                    requiresAuth: true
                }
            },
            {
                path: '/profile',
                name: 'Profile',
                component: () => import('@/views/profile/index.vue'),
                meta: {
                    title: '个人资料',
                    requiresAuth: true
                }
            },
            {
                path: '/ai',
                name: 'AI',
                component: () => import('@/views/celestialHub/index.vue'),
                meta: {
                    title: 'AI助手',
                    requiresAuth: true
                }
            },
            {
                path: '/settings',
                name: 'Settings',
                component: () => import('@/views/settings/index.vue'),
                meta: {
                    title: '设置',
                    requiresAuth: true
                }
            },
            {
                path: '/system/user',
                name: 'User',
                component: () => import('@/views/system/user/index.vue'),
                meta: {
                    title: '用户管理',
                    requiresAuth: true
                }
            },
            {
                path: '/system/role',
                name: 'Role',
                component: () => import('@/views/system/role/index.vue'),
                meta: {
                    title: '角色管理',
                    requiresAuth: true
                }
            },
            {
                path: '/system/permission',
                name: 'Permission',
                component: () => import('@/views/system/permission/index.vue'),
                meta: {
                    title: '权限管理',
                    requiresAuth: true
                }
            },
            {
                path: '/system/notification',
                name: 'Notification',
                component: () => import('@/views/notification/index.vue'),
                meta: {
                    title: '通知管理',
                    requiresAuth: true
                }
            },
            {
                path: '/info/teacher',
                name: 'Teacher',
                component: () => import('@/views/info/teacher/index.vue'),
                meta: {
                    title: '教师管理',
                    requiresAuth: true
                }
            },
            {
                path: '/info/student',
                name: 'Student',
                component: () => import('@/views/info/student/index.vue'),
                meta: {
                    title: '学生管理',
                    requiresAuth: true
                }
            },
            {
                path: '/course',
                name: 'CourseManagement',
                component: () => import('@/views/course/index.vue'),
                meta: {
                    title: '课程管理',
                    requiresAuth: true
                }
            },
            {
                path: '/course/my-courses',
                name: 'MyCourses',
                component: () => import('@/views/course/MyCourse/index.vue'),
                meta: {
                    title: '我的课程',
                    requiresAuth: true
                }
            },
            {
                path: '/course/detail/:courseId',
                name: 'CourseDetail',
                component: () => import('@/views/course/CourseDetail/index.vue'),
                meta: {
                    title: '课程详情',
                    requiresAuth: true
                }
            },
            {
                path: '/course/detail/:courseId/students',
                name: 'CourseStudents',
                component: () => import('@/views/course/CourseDetail/CourseStudents/index.vue'),
                meta: {
                    title: '课程学生',
                    requiresAuth: true
                }
            },
            {
                path: '/course/detail/:courseId/forum',
                name: 'CourseForum',
                component: () => import('@/views/course/CourseDetail/CourseForum/index.vue'),
                meta: {
                    title: '课程论坛',
                    requiresAuth: true
                }
            },
            {
                path: '/course/detail/:courseId/forum/:forumId',
                name: 'ForumDetail',
                component: () => import('@/views/course/CourseDetail/CourseForum/ForumDetail.vue'),
                meta: {
                    title: '论坛详情',
                    requiresAuth: true
                }
            },
            {
                path: '/course/detail/:courseId/forum/:forumId/post/:postId',
                name: 'PostDetail',
                component: () => import('@/views/course/CourseDetail/CourseForum/PostDetail.vue'),
                meta: {
                    title: '帖子详情',
                    requiresAuth: true
                }
            },
            {
                path: '/course/detail/:courseId/chapters',
                name: 'CourseChapters',
                component: () => import('@/views/course/CourseDetail/CourseChapters/index.vue'),
                meta: {
                    title: '课程章节',
                    requiresAuth: true
                }
            },
            {
                path: '/course/detail/:courseId/chapters/control',
                name: 'ChapterControl',
                component: () => import('@/views/course/CourseDetail/CourseChapters/ChapterControl.vue'),
                meta: {
                    title: '章节操作',
                    requiresAuth: true
                }
            },
            {
                path: '/course/detail/:courseId/classroom',
                name: 'CourseClassroom',
                component: () => import('@/views/classroom/ClassroomSelect.vue'),
                meta: {
                    title: '教室管理',
                    requiresAuth: true
                }
            },
            {
                path: '/course/:courseId/classroom/:courseRecordId',
                name: 'Classroom3D',
                component: () => import('@/views/classroom/Classroom3DDetail.vue'),
                meta: {
                    title: '在线课堂',
                    requiresAuth: true
                }
            },
            {
                path: '/live',
                name: 'Live',
                component: () => import('@/views/live/index.vue'),
                meta: {
                    title: '直播',
                    requiresAuth: true
                }
            },
            {
                path: '/live/room/:roomId',
                name: 'LiveRoom',
                component: () => import('@/views/live/LiveRoom/index.vue'),
                meta: {
                    title: '直播间',
                    requiresAuth: true
                }
            },
            {
                path: '/course/:courseId/classroom/:courseRecordId/live',
                name: 'CourseLive',
                component: () => import('@/views/live/index.vue'),
                meta: {
                    title: '直播',
                    requiresAuth: true
                }
            },
            {
                path: '/course/detail/:courseId/tasks',
                name: 'CourseTasks',
                component: () => import('@/views/course/CourseDetail/CourseTasks/index.vue'),
                meta: {
                    title: '课程任务',
                    requiresAuth: true
                }
            },
            {
                path: '/course/detail/:courseId/tasks/control',
                name: 'TaskControl',
                component: () => import('@/views/course/CourseDetail/CourseTasks/TaskControl.vue'),
                meta: {
                    title: '任务操作',
                    requiresAuth: true
                }
            },
            {
                path: '/course/detail/:courseId/questions',
                name: 'CourseQuestions',
                component: () => import('@/views/course/CourseDetail/CourseQuestions/index.vue'),
                meta: {
                    title: '课程题库',
                    requiresAuth: true
                }
            },
            {
                path: '/course/detail/:courseId/questions/banks',
                name: 'QuestionBankList',
                component: () => import('@/views/course/CourseDetail/CourseQuestions/index.vue'),
                meta: {
                    title: '题库管理',
                    requiresAuth: true
                }
            },
            {
                path: '/course/detail/:courseId/questions/bank/:bankId/questions',
                name: 'QuestionDetail',
                component: () => import('@/views/course/CourseDetail/CourseQuestions/QuestionDetail.vue'),
                meta: {
                    title: '题目详情',
                    requiresAuth: true
                }
            },
            {
                path: '/user/:userId',
                name: 'UserProfile',
                component: () => import('@/components/common/UserProfile.vue'),
                meta: {
                    title: '用户主页',
                    requiresAuth: true
                }
            },
        ]
    },
    {
        path: '/file/preview',
        name: 'FilePreview',
        component: () => import('@/views/file/index.vue'),
        meta: {
            title: '文件预览',
            requiresAuth: true
        }
    },
    {
        path: '/info/select',
        name: 'IdentitySelect',
        component: () => import('@/views/info/select/index.vue'),
        meta: {
            title: '身份选择',
            requiresAuth: true
        }
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
router.beforeEach(async (to, from, next) => {
    // 检测登录/登出操作和页面刷新
    const transitionStore = useTransitionStore()
    const userStore = useUserStore()

    // 检测是否是刷新页面：from.path等于to.path或from.path是根路径，且sessionStorage中已有该路径的记录
    const lastPath = sessionStorage.getItem('router:lastPath')
    const isPageRefresh = lastPath === to.path && (from.path === to.path || from.path === '/')

    // 检测路由切换（排除刷新和首次访问）
    const hasFromPath = from.path && from.path !== to.path && from.path !== '/'
    const isLoginTransition = hasFromPath && from.path === '/login' && to.path !== '/login'
    const isLogoutTransition = hasFromPath && from.path !== '/login' && to.path === '/login'

    // 检测刷新时的过渡动画：登录页刷新，或已登录用户在非登录页刷新
    const isLoginPageRefresh = isPageRefresh && to.path === '/login'
    const isAuthPageRefresh = isPageRefresh && to.path !== '/login' && userStore.isLogin

    if (isLoginTransition || isLogoutTransition || isLoginPageRefresh || isAuthPageRefresh) {
        transitionStore.show()
    }

    // 开始加载条
    const loadingBarStore = useLoadingBarStore()
    loadingBarStore.start()

    // 设置页面标题
    TitleUtil.setTitleByPath(to.path)

    // 检查是否需要登录权限
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

    // 如果有token，确保用户信息已加载
    if (userStore.token) {
        // 如果登录状态未设置或用户信息未加载，尝试验证并刷新用户信息
        if (!userStore.isLogin || !userStore.userInfo) {
            // 验证token有效性
            const isValid = await userStore.validateToken()
            if (isValid) {
                // 尝试刷新用户信息
                await userStore.refreshUserInfo()
            } else {
                // token无效，清除状态
                userStore.resetUserState()
            }
        }
    }

    // 根路径特殊处理，检查JWT并重定向
    if (to.path === '/') {
        if (userStore.token && userStore.isLogin) {
            // 如果是admin角色，直接重定向到主页，不拦截
            if (userStore.hasRole('ADMIN')) {
                return next('/dashboard')
            }
            // 如果JWT存在且有效，检查是否需要填写信息或没有手机号
            if (userStore.needsIdentityInfo || !userStore.userInfo?.mobile) {
                return next('/info/select')
            }
            // 如果JWT存在且有效，直接重定向到主页
            return next('/dashboard')
        } else {
            // 如果JWT不存在或无效，重定向到登录页
            return next('/login')
        }
    }

    // 如果已登录且需要填写信息或没有手机号，拦截所有跳转（登录页面除外）
    // admin角色用户不拦截
    if (userStore.token && userStore.isLogin && (userStore.needsIdentityInfo || !userStore.userInfo?.mobile) && !userStore.hasRole('ADMIN')) {
        // 允许访问登录页面（用于退出登录）
        if (to.name === 'Login') {
            next()
            return
        }
        // 如果目标页面就是身份选择页面，允许访问
        if (to.name === 'IdentitySelect') {
            next()
            return
        }
        // 拦截所有其他跳转，重定向到信息填写选择页面
        next('/info/select')
        return
    }

    if (requiresAuth && !userStore.isLogin) {
        next({name: 'Login', query: {redirect: to.fullPath}})
    } else if (to.name === 'Login' && userStore.isLogin && !userStore.needsIdentityInfo && userStore.userInfo?.mobile) {
        next({name: 'Dashboard'})
    } else {
        next()
    }
})

/**
 * 路由后置守卫
 */
router.afterEach((to, from) => {
    // 完成加载条
    const loadingBarStore = useLoadingBarStore()
    loadingBarStore.finish()

    // 记录当前路径到sessionStorage，用于下次判断是否是刷新（必须在检测之前保存）
    // 但我们需要在beforeEach中就能读取到刷新前的路径，所以这里保存的是新的路径
    // 在beforeEach中已经读取了刷新前的路径，所以这里可以更新了
    const lastPath = sessionStorage.getItem('router:lastPath')
    const wasPageRefresh = lastPath === to.path && (from.path === to.path || from.path === '/')
    sessionStorage.setItem('router:lastPath', to.path)

    // 检测登录/登出操作完成和页面刷新完成
    const transitionStore = useTransitionStore()
    const userStore = useUserStore()

    // 检测路由切换（排除刷新和首次访问）
    const hasFromPath = from.path && from.path !== to.path && from.path !== '/'
    const isLoginTransition = hasFromPath && from.path === '/login' && to.path !== '/login'
    const isLogoutTransition = hasFromPath && from.path !== '/login' && to.path === '/login'

    // 检测刷新时的过渡动画完成：登录页刷新，或已登录用户在非登录页刷新
    const isLoginPageRefresh = wasPageRefresh && to.path === '/login'
    const isAuthPageRefresh = wasPageRefresh && to.path !== '/login' && userStore.isLogin

    if (isLoginTransition || isLogoutTransition || isLoginPageRefresh || isAuthPageRefresh) {
        // 隐藏过渡动画，确保至少持续1秒
        transitionStore.hide(1250)
        return
    }

    // 处理其他通过全局过渡触发的路由跳转（例如3D教室进出）
    if (transitionStore.showTransition) {
        transitionStore.hide(800)
    }
})

export default router