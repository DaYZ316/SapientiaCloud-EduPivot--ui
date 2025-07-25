<template>
  <n-layout class="app-layout">
    <!-- 顶部导航栏 -->
    <n-layout-header bordered class="header">
      <div class="header-left">
        <div class="logo">
          <h2>{{ $t('app.name') }}</h2>
        </div>
      </div>
      <div class="header-right">
        <n-space align="center">
          <!-- 用户头像下拉菜单 -->
          <n-dropdown :options="userMenuOptions" placement="bottom-end" @select="handleUserMenuSelect">
            <div class="user-avatar">
              <n-avatar round :src="userInfo?.avatar || ''" />
              <span class="nickname">{{ userInfo?.nickName || $t('common.user') }}</span>
              <n-icon><chevron-down-outline /></n-icon>
            </div>
          </n-dropdown>
        </n-space>
      </div>
    </n-layout-header>

    <!-- 主体布局 -->
    <n-layout position="absolute" style="top: 64px">
      <!-- 内容区域 -->
      <n-layout-content content-style="padding: 16px;">
        <n-card class="content-card">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </n-card>
      </n-layout-content>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import type {Component} from 'vue'
import {computed, h, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {ChevronDownOutline, LogOutOutline, PersonOutline, SettingsOutline} from '@vicons/ionicons5'
import {useThemeStore, useUserStore} from '@/store'
import {NIcon} from 'naive-ui'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const theme = useThemeStore()
const { t } = useI18n()

// 获取用户信息
const userInfo = computed(() => userStore.userInfo)

// 当前激活的菜单项
const activeKey = computed(() => route.name as string)

// 用户下拉菜单选项
const userMenuOptions = computed(() => [
  {
    key: 'profile',
    label: t('menu.profile'),
    icon: renderIcon(PersonOutline)
  },
  {
    key: 'settings',
    label: t('menu.settings'),
    icon: renderIcon(SettingsOutline)
  },
  {
    type: 'divider'
  },
  {
    key: 'logout',
    label: t('auth.logout'),
    icon: renderIcon(LogOutOutline)
  }
])

// 渲染图标的辅助函数
function renderIcon(icon: Component) {
  return () => h(NIcon, null, { default: () => h(icon) })
}

// 处理用户菜单选择
const handleUserMenuSelect = async (key: string) => {
  if (key === 'logout') {
    try {
      await userStore.logout();
      router.push('/login');
    } catch (error: any) {
      console.error(t('auth.logoutFail'), error);
      router.push('/login');
    }
  } else if (key === 'profile') {
    router.push('/profile');
  } else if (key === 'settings') {
    router.push('/settings');
  }
}

// 初始化主题和用户信息
onMounted(async () => {
  theme.initSettings()
  
  // 如果已登录，刷新用户信息
  if (userStore.isLogin) {
    await userStore.refreshUserInfo()
  }
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as vars;

.app-layout {
  height: 100vh;
  width: 100%;
}

.header {
  height: 64px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--component-background);
  border-bottom: 1px solid var(--border-color);
  z-index: 100;

  .header-left {
    display: flex;
    align-items: center;

    .logo {
      display: flex;
      align-items: center;
      margin-right: 24px;

      h2 {
        margin: 0;
        color: var(--primary-color);
        font-size: 20px;
      }
    }
  }

  .header-right {
    display: flex;
    align-items: center;
  }

  .user-avatar {
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 4px 8px;
    border-radius: 4px;
    transition: background-color 0.3s;

    &:hover {
      background-color: rgba(0, 0, 0, 0.06);
    }

    .nickname {
      margin: 0 8px;
      font-size: 14px;
    }
  }
}

.content-card {
  min-height: calc(100vh - 96px);
  background-color: var(--component-background);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> 