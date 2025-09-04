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
            <n-avatar
                :fallback-src="defaultAvatar"
                :size="collapsed ? 'medium' : 'small'"
                :src="userStore.userInfo?.avatar"
                class="user-avatar"
                round
            />
            <div v-if="!collapsed" class="user-details">
              <span class="username">
                {{ userStore.userInfo?.nickName || userStore.userInfo?.username }}
              </span>
              <n-icon class="dropdown-icon">
                <component :is="ChevronDownOutline"/>
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
import {useThemeStore, useUserStore} from '@/store'
import {getMenuOptions, getUserMenuOptions, menuRouteMap} from '@/config/menu'
import {ChevronDownOutline} from '@vicons/ionicons5'
import {NAvatar, NDropdown, NIcon, NMenu} from 'naive-ui'
import defaultAvatar from '@/assets/image/default-avatar.png'

// 路由和国际化
const route = useRoute()
const router = useRouter()
const {t, locale} = useI18n()

// 计算属性：处理项目名显示
const displayAppName = computed(() => {
  const appName = t('app.name')
  // 如果是英文，分成两行显示
  if (locale.value === 'en-US') {
    return appName.replace(' ', '<br>')
  }
  return appName
})

// 状态管理
const userStore = useUserStore()
const themeStore = useThemeStore()

// 响应式状态
const collapsed = computed(() => themeStore.sidebarCollapsed)

// 计算属性
const currentRoute = computed(() => route.name as string)

// 菜单选项
const menuOptions = computed(() => getMenuOptions(t) as any[])
const userMenuOptions = computed(() => getUserMenuOptions(t) as any[])


// 方法

const handleMenuSelect = (key: string) => {
  const routePath = menuRouteMap[key]
  if (routePath) {
    router.push(routePath)
  }
}

const handleUserMenuSelect = (key: string) => {
  switch (key) {
    case 'profile':
      router.push('/profile')
      break
    case 'logout':
      handleLogout()
      break
  }
}


const handleLogout = async () => {
  try {
    await userStore.logout()
    router.push('/login')
  } catch (error) {
    console.error('登出失败:', error)
  }
}

// 检查屏幕尺寸并自动收起侧边栏
const checkScreenSize = () => {
  if (window.innerWidth < 768) {
    themeStore.setSidebarCollapsed(true)
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

  &.sidebar-collapsed {
    width: 64px;
  }
}

.sidebar-header {
  padding: 16px;
  border-bottom: 1px solid var(--border-color);
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 64px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 12px;
  color: var(--text-color);
  font-weight: 600;
  font-size: 18px;
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
  border-top: 1px solid var(--border-color);
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
  margin-left: 0;
  transition: margin-left 0.3s ease;
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

  &:hover {
    background-color: var(--background-secondary-color);
  }

  &.user-info-collapsed {
    padding: 8px;
    justify-content: center;
    min-height: 48px;

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
}

.user-avatar {
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.dropdown-icon {
  font-size: 12px;
  color: var(--text-secondary-color);
  transition: transform 0.2s ease;
  flex-shrink: 0;
}

// 内容区域样式
.content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  background-color: var(--background-color);
}

// 过渡动画
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
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

    &:not(.sidebar-collapsed) {
      transform: translateX(0);
    }
  }

  .main-content {
    margin-left: 0 !important;
  }


  .content {
    padding: 16px;
  }

  .user-details {
    display: none;
  }

  .user-info {
    padding: 8px;
    min-height: 48px;
  }

  .user-avatar {
    margin: 0;
  }
}

// 暗色主题适配
.dark {
  .sidebar {
    background-color: var(--background-secondary-color);
    border-right-color: var(--border-color);
  }

  .content {
    background-color: var(--background-color);
  }
}

// 滚动条样式
.sidebar-menu::-webkit-scrollbar {
  width: 4px;
}

.sidebar-menu::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-menu::-webkit-scrollbar-thumb {
  background: var(--border-color);
  border-radius: 2px;
}

.sidebar-menu::-webkit-scrollbar-thumb:hover {
  background: var(--text-secondary-color);
}
</style>
