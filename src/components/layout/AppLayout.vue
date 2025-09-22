<template>
  <div class="app-layout">
    <!-- 侧边栏 -->
    <div
        :class="{ 'sidebar-collapsed': collapsed }"
        class="sidebar"
    >
      <!-- Logo区域 -->
      <div class="sidebar-header">
        <div class="logo">
          <img
              alt="SapientiaCloud EduPivot"
              class="logo-image"
              src="/SapientiaCloud EduPivot Logo.svg"
          />
          <span v-if="!collapsed" :lang="locale" class="logo-text" v-html="displayAppName"></span>
        </div>
      </div>

      <!-- 菜单区域 -->
      <div class="sidebar-menu">
        <n-menu
            :collapsed="collapsed"
            :collapsed-icon-size="22"
            :collapsed-width="64"
            :default-expanded-keys="defaultExpandedKeys"
            :options="menuOptions"
            :value="currentRoute"
            @update:value="handleMenuSelect"
        />
      </div>

      <!-- 用户头像区域 -->
      <div class="sidebar-footer">
        <n-dropdown
            :options="userMenuOptions"
            :placement="collapsed ? 'top' : 'top-end'"
            trigger="click"
            @select="handleUserMenuSelect"
        >
          <div :class="{ 'user-info-collapsed': collapsed }" class="user-info">
            <AvatarDisplay
                :avatar-src="userStore.userInfo?.avatar"
                :nick-name="userStore.userInfo?.nickName"
                :size="collapsed ? 'medium' : 'small'"
                :student-real-name="userStore.studentInfo?.realName || undefined"
                :teacher-real-name="userStore.teacherInfo?.realName || undefined"
                :username="userStore.userInfo?.username"
                avatar-class="user-avatar"
            />
            <div v-if="!collapsed" class="user-details">
              <span class="username">
                {{
                  userStore.studentInfo?.realName || userStore.teacherInfo?.realName || userStore.userInfo?.nickName || userStore.userInfo?.username
                }}
              </span>
              <n-icon class="dropdown-icon">
                <ChevronDownOutline/>
              </n-icon>
            </div>
          </div>
        </n-dropdown>
      </div>
    </div>

    <!-- 主内容区域 -->
    <div :class="{ 'main-content-expanded': collapsed }" class="main-content">
      <!-- 页面内容 -->
      <div class="content">
        <router-view v-slot="{ Component }">
          <transition mode="out-in" name="fade">
            <component :is="Component"/>
          </transition>
        </router-view>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, onUnmounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useMenuStore, useThemeStore, useUserStore} from '@/store'
import {getMenuOptions, getUserMenuOptions, menuExpandMap, menuRouteMap} from '@/config/menu'
import {ChevronDownOutline} from '@vicons/ionicons5'
import {NDropdown, NIcon, NMenu, useDialog, useMessage} from 'naive-ui'
import AvatarDisplay from '@/components/common/AvatarDisplay.vue'

// 路由和国际化
const route = useRoute()
const router = useRouter()
const {t, locale} = useI18n()

// 对话框和消息提示
const dialog = useDialog()
const message = useMessage()

// 状态管理
const userStore = useUserStore()
const themeStore = useThemeStore()
const menuStore = useMenuStore()

// 计算属性
const collapsed = computed(() => themeStore.sidebarCollapsed)
const currentRoute = computed(() => route.name as string)
const menuOptions = computed(() => getMenuOptions(t, menuStore.getDynamicMenuItems) as any[])
const userMenuOptions = computed(() => getUserMenuOptions(t) as any[])
const displayAppName = computed(() =>
    locale.value === 'en-US' ? t('app.name').replace(' ', '<br>') : t('app.name')
)


const defaultExpandedKeys = computed(() =>
    menuExpandMap[currentRoute.value] || []
)

// 方法
const handleUserMenuSelect = (key: string) => {
  if (key === 'profile') {
    router.push('/profile')
  } else if (key === 'logout') {
    handleLogout()
  }
}

const handleLogout = async () => {
  dialog.warning({
    title: t('auth.logoutConfirm'),
    content: t('auth.logoutConfirmMessage'),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      try {
        await userStore.logout()
        message.success(t('auth.logoutSuccess'))
        router.push('/login')
      } catch {
        message.error(t('auth.logoutFail'))
      }
    }
  })
}

const checkScreenSize = () => {
  if (window.innerWidth < 768) {
    themeStore.setSidebarCollapsed(true)
  }
}

const handleMenuSelect = (key: string) => {
  const routePath = menuRouteMap[key]
  if (routePath) {
    // 如果是课程详情菜单项，需要保持当前路由
    if (key === 'CourseDetail') {
      // 不进行路由跳转，因为已经在课程详情页面
      return
    }
    router.push(routePath)
  }
}

// 生命周期
onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize)
})
</script>

<style lang="scss" scoped>
.app-layout {
  display: flex;
  height: 100vh;
  background-color: var(--background-color);
}

// 侧边栏样式
.sidebar {
  width: 240px;
  background-color: var(--background-secondary-color);
  border-right: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: width 0.3s ease;
  position: relative;
  z-index: 1000;
  box-shadow: 0 2px 8px var(--shadow-secondary-color);

  &.sidebar-collapsed {
    width: 64px;
  }
}

.sidebar-header {
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 64px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--color-primary);
  font-weight: 600;
  font-size: 18px;
  transition: color 0.3s ease;

  &:hover {
    color: var(--color-primary-light);
  }
}

.logo-image {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
}

.logo-text {
  white-space: nowrap;
  transition: opacity 0.3s ease;
  text-align: center;
  line-height: 1.2;
}

.sidebar-collapsed .logo-text {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

// 英文版本允许换行
.logo-text[lang="en-US"] {
  white-space: normal;
}

.sidebar-menu {
  flex: 1;
  padding: 8px 0;
  overflow-y: auto;
}

.sidebar-footer {
  padding: 16px;
  display: flex;
  justify-content: center;
  min-height: 80px;
  align-items: center;
}

// 主内容区域样式
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  width: 100%;
  justify-content: center;
  min-height: 48px;
  border: 1px solid transparent;


  &.user-info-collapsed {
    padding: 8px;

    .user-avatar {
      margin: 0;
    }
  }
}

.user-details {
  display: flex;
  align-items: center;
  gap: 4px;
  flex: 1;
  min-width: 0;
}

.username {
  font-size: 14px;
  color: var(--text-color);
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  flex: 1;
  font-weight: 500;
  transition: color 0.3s ease;
}

.user-avatar {
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.dropdown-icon {
  font-size: 12px;
  color: var(--text-secondary-color);
  transition: all 0.2s ease;
  flex-shrink: 0;

}

// 内容区域样式
.content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: var(--background-color);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--border-secondary-color), transparent);
  }
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}

.fade-enter-to,
.fade-leave-from {
  opacity: 1;
  transform: translateY(0);
}

// 响应式设计
@media (max-width: 768px) {
  .sidebar {
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 1001;
    transform: translateX(-100%);
    transition: transform 0.3s ease;
    box-shadow: 2px 0 8px var(--shadow-color);

    &:not(.sidebar-collapsed) {
      transform: translateX(0);
    }
  }

  .main-content {
    width: 100%;
  }

  .content {
    padding: 16px;
  }

  .user-details {
    display: none;
  }

  .user-info {
    padding: 8px;

    .user-avatar {
      margin: 0;
    }
  }

  .logo-text {
    font-size: 16px;
  }
}

// 滚动条样式
.sidebar-menu {
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--border-color);
    border-radius: 2px;
    transition: background 0.3s ease;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: var(--text-secondary-color);
  }
}
</style>
