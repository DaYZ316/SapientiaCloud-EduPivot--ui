<script setup lang="ts">
import { darkTheme } from 'naive-ui'
import { useThemeStore } from '@/store'
import { computed } from 'vue'

const themeStore = useThemeStore()

// 初始化主题
themeStore.initSettings()

// 计算当前主题
const currentTheme = computed(() => {
  return themeStore.isDarkMode ? darkTheme : null
})

// 主题覆盖
const themeOverrides = computed(() => ({
  common: {
    primaryColor: themeStore.primaryColor,
    primaryColorHover: themeStore.primaryColor,
    primaryColorPressed: themeStore.primaryColor,
  }
}))
</script>

<template>
  <n-config-provider :theme="currentTheme" :theme-overrides="themeOverrides">
    <n-notification-provider>
      <n-dialog-provider>
        <n-message-provider>
          <router-view />
        </n-message-provider>
      </n-dialog-provider>
    </n-notification-provider>
  </n-config-provider>
</template>

<style lang="scss">
@forward './assets/styles/global.scss';
</style>
