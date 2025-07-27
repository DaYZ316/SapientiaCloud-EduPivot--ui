<script lang="ts" setup>
import {darkTheme} from 'naive-ui'
import {useThemeStore, useUserStore} from '@/store'
import {computed, onMounted} from 'vue'

const themeStore = useThemeStore()
const userStore = useUserStore()

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

// 在应用启动时检查登录状态并刷新用户信息
onMounted(async () => {
  if (userStore.token) {
    // 如果存在token，验证其有效性
    const isValid = await userStore.validateToken()
    if (isValid) {
      // 如果token有效，刷新用户信息
      await userStore.refreshUserInfo()
    }
  }
})
</script>

<template>
  <n-config-provider :theme="currentTheme" :theme-overrides="themeOverrides">
    <router-view/>
  </n-config-provider>
</template>

<style lang="scss">
@forward './assets/styles/global.scss';
</style>
