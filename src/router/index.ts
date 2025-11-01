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
                component: () => import('@/views/course/CourseDetail/CourseClassroom/index.vue'),
                meta: {
                    title: '在线课堂',
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
                name: 'QuestionList',
                component: () => import('@/views/course/CourseDetail/CourseQuestions/QuestionList.vue'),
                meta: {
                    title: '题目管理',
                    requiresAuth: true
                }
            },
            {
                path: '/course/detail/:courseId/questions/question/:questionId',
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
router.beforeEach(async (to, _from, next) => {
    // 开始加载条
    const loadingBarStore = useLoadingBarStore()
    loadingBarStore.start()

    // 设置页面标题
    TitleUtil.setTitleByPath(to.path)

    // 检查是否需要登录权限
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const userStore = useUserStore()

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
            // 如果JWT存在且有效，检查是否需要填写信息
            if (userStore.needsIdentityInfo) {
                return next('/info/select')
            }
            // 如果JWT存在且有效，直接重定向到主页
            return next('/dashboard')
        } else {
            // 如果JWT不存在或无效，重定向到登录页
            return next('/login')
        }
    }

    // 如果已登录且需要填写信息，拦截所有跳转（登录页面除外）
    if (userStore.token && userStore.isLogin && userStore.needsIdentityInfo) {
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
    } else if (to.name === 'Login' && userStore.isLogin && !userStore.needsIdentityInfo) {
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