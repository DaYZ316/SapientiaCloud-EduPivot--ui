import type {RouteRecordRaw} from 'vue-router'
import {createRouter, createWebHistory} from 'vue-router'
import {useUserStore} from '@/store'

/**
 * 路由配置
 */
const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/Login.vue'),
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
router.beforeEach(async (to, from, next) => {
  // 设置页面标题
  document.title = to.meta.title ? `${to.meta.title} - SapientiaCloud` : 'SapientiaCloud'

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
        // 如果JWT存在并有效，直接重定向到主页
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
    next({ name: 'Login', query: { redirect: to.fullPath } })
  } else if (to.name === 'Login' && userStore.isLogin) {
    next({ name: 'Dashboard' })
  } else {
    next()
  }
})

export default router 