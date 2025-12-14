<template>
  <div
      :class="{ 'sidebar-collapsed': collapsed }"
      class="sidebar"
  >
    <!-- Logo区域 -->
    <div class="sidebar-header">
      <div class="logo" @click="handleLogoClick">
        <CelestailHub :is-active="isAIPage" class="logo-image"/>
        <span v-if="!collapsed" :class="{ 'logo-text-highlight': isAIPage }" :lang="locale" class="logo-text"
              v-html="displayAppName"></span>
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

    <!-- 分割线 (仅在AI页面且侧边栏展开时显示) -->
    <div v-if="isAIPage && !collapsed" class="ai-sessions-divider"></div>

    <!-- AI会话列表区域 (仅在AI页面且侧边栏展开时显示) -->
    <div v-if="isAIPage && !collapsed" class="sidebar-ai-sessions">
      <ChatSidebar
          :active-session-id="activeSessionId ?? undefined"
          :embedded-mode="true"
          @my-favorites="handleAIMyFavorites"
          @new-chat="handleAINewChat"
          @select-session="handleAISelectSession"
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
</template>

<script lang="ts" setup>
import {computed, onMounted, onUnmounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {ChevronDownOutline} from '@vicons/ionicons5'
import {NDropdown, NIcon, NMenu, useDialog, useMessage} from 'naive-ui'
import {useMenuStore, useThemeStore, useUserStore} from '@/store'
import {getMenuOptions, getUserMenuOptions, menuExpandMap, menuRouteMap} from '@/config/menu'
import AvatarDisplay from '@/components/common/AvatarDisplay.vue'
import {createCourseMenuHandler} from '@/utils/courseMenu'
import CelestailHub from '@/components/common/CelestialHub.vue'
import ChatSidebar from '@/views/celestialHub/components/ChatSidebar.vue'
import eventBus from '@/utils/eventBus'
import type {ChatSessionVO} from '@/types/celestialHub/chatSession'

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

// 课程菜单处理器
const courseMenuHandler = createCourseMenuHandler(router, menuStore)

// 计算属性
const collapsed = computed(() => themeStore.sidebarCollapsed)
const displayAppName = computed(() =>
    locale.value === 'en-US' ? t('app.name').replace(' ', '<br>') : t('app.name')
)

// 根据当前路由确定应该高亮的菜单项
const getCurrentMenuKey = (routeName: string): string => {
  if (routeName === 'ChapterControl') {
    return 'CourseChapters'
  }

  if (routeName === 'CourseDetail') {
    return 'CourseOverview'
  }

  if (routeName === 'ForumDetail') {
    return 'CourseForum'
  }

  if (routeName === 'PostDetail') {
    return 'CourseForum'
  }

  if (routeName === 'FilePreview') {
    return 'FilePreview'
  }

  return routeName
}

const currentRoute = computed(() => getCurrentMenuKey(route.name as string))
const dynamicMenuOptions = computed(() => menuStore.getDynamicMenuItems)
const isAIPage = computed(() => route.name === 'AI' || route.path === '/ai')

const menuOptions = computed(() => {
  const lastCourse = menuStore.getLastAccessedCourse
  const baseMenuOptions = getMenuOptions(t, lastCourse?.courseName, lastCourse?.courseId)
  if (!dynamicMenuOptions.value.length) {
    return baseMenuOptions as any[]
  }
  return [...baseMenuOptions, ...dynamicMenuOptions.value] as any[]
})
const userMenuOptions = computed(() => getUserMenuOptions(t) as any[])

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
      await userStore.logout()
      message.success(t('auth.logoutSuccess'))
      router.push('/login')
    }
  })
}

const handleMenuSelect = (key: string) => {
  if (courseMenuHandler.handleCourseMenuSelect(key)) {
    return
  }

  const routePath = menuRouteMap[key]
  if (routePath) {
    router.push(routePath)
  }
}

const handleLogoClick = () => {
  router.push('/ai')
}

// AI会话相关
const activeSessionId = ref<string | number | null>(null)

// 处理AI会话选择
const handleAISelectSession = (session: ChatSessionVO) => {
  eventBus.emit('aiSelectSession', session)
}

// 处理AI新建对话
const handleAINewChat = () => {
  eventBus.emit('aiNewChat')
}

// 处理AI我的收藏
const handleAIMyFavorites = () => {
  eventBus.emit('aiMyFavorites')
}

// 监听activeSessionId变化
onMounted(() => {
  eventBus.on('aiActiveSessionIdChanged', (id) => {
    activeSessionId.value = id
  })
})

onUnmounted(() => {
  eventBus.off('aiActiveSessionIdChanged')
})
</script>

<style lang="scss" scoped>
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
  cursor: pointer;
  user-select: none;

  &:hover {
    color: var(--color-primary-light);
  }
}

.logo-image {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-text {
  white-space: nowrap;
  transition: opacity 0.3s ease, color 0.3s ease;
  text-align: center;
  line-height: 1.2;

  &.logo-text-highlight {
    color: var(--color-primary-light);
  }
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
  min-height: 0;

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

.ai-sessions-divider {
  height: 1px;
  background-color: var(--border-secondary-color);
  margin: 8px 16px;
  flex-shrink: 0;
}

.sidebar-ai-sessions {
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  max-height: 50vh;
}

.sidebar-footer {
  padding: 16px;
  display: flex;
  justify-content: center;
  min-height: 80px;
  align-items: center;
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
</style>

