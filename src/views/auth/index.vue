<template>
  <!-- 登录页面内容 -->
  <div class="login-container">
    <!-- 主题切换按钮 -->
    <div class="theme-toggle">
      <n-button quaternary circle size="small" @click="toggleTheme">
        <template #icon>
          <n-icon>
            <Icon :component="getThemeIcon()" />
          </n-icon>
        </template>
      </n-button>
    </div>
    
    <!-- 主内容区域 -->
    <main class="main-content">
      <!-- 项目名称 -->
      <div class="project-name">
        <h1 class="project-title">{{ $t('app.name') }}</h1>
      </div>

      <!-- 登录组件 -->
      <Login v-if="!isRegister" @switch-to-register="isRegister = true" />

      <!-- 注册组件 -->
      <Register v-else @switch-to-login="isRegister = false" />
    </main>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/store'
import { NButton, NIcon } from 'naive-ui'
import Icon from '@/components/common/Icon.vue'
import { Sunny, Moon, DesktopOutline } from '@vicons/ionicons5'
import Login from './Login/index.vue'
import Register from './Register/index.vue'

const { t } = useI18n()
const themeStore = useThemeStore()

// 控制显示登录还是注册
const isRegister = ref(false)

// 计算属性：是否为暗色模式
const isDarkMode = computed(() => themeStore.isDarkMode)

// 获取主题图标
const getThemeIcon = () => {
  switch (themeStore.themeMode) {
    case 'light':
      return Sunny
    case 'dark':
      return Moon
    case 'system':
      return DesktopOutline
    default:
      return Sunny
  }
}

// 切换主题
const toggleTheme = () => {
  // 循环切换：light -> dark -> system -> light
  const modes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system']
  const currentIndex = modes.indexOf(themeStore.themeMode)
  const nextIndex = (currentIndex + 1) % modes.length
  themeStore.setThemeMode(modes[nextIndex])
}
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
