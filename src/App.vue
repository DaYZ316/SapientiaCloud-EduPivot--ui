<script lang="ts" setup>
import {darkTheme} from 'naive-ui'
import {useThemeStore, useUserStore} from '@/store'
import {computed, nextTick, onMounted, ref} from 'vue'
import {setGlobalApis} from '@/utils/naiveUIHelper'

const themeStore = useThemeStore()
const userStore = useUserStore()


// Provider组件引用
const messageProviderRef = ref()
const dialogProviderRef = ref()
const notificationProviderRef = ref()
const loadingBarProviderRef = ref()

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

// 初始化全局API
const initGlobalApis = () => {
  const apis = {
    message: messageProviderRef.value,
    dialog: dialogProviderRef.value,
    notification: notificationProviderRef.value,
    loadingBar: loadingBarProviderRef.value
  }

  // 使用 setGlobalApis 函数统一设置
  setGlobalApis(apis)
}

// 在应用启动时检查登录状态并刷新用户信息
onMounted(async () => {
  try {
    if (userStore.token) {
      // 如果存在token，验证其有效性
      const isValid = await userStore.validateToken()
      if (isValid) {
        // 如果token有效，刷新用户信息
        await userStore.refreshUserInfo()
      }
    }

    // 确保DOM渲染完成后再设置全局API
    await nextTick()
    initGlobalApis()

    // 为了确保API可用，再次延迟设置
    setTimeout(initGlobalApis, 50)
  } catch (error) {
    // 处理初始化错误
    console.error('应用初始化失败:', error)
  }
})
</script>

<template>
  <n-config-provider :theme="currentTheme" :theme-overrides="themeOverrides">
    <n-message-provider ref="messageProviderRef">
      <n-dialog-provider ref="dialogProviderRef">
        <n-notification-provider ref="notificationProviderRef">
          <n-loading-bar-provider ref="loadingBarProviderRef">
            <router-view/>
          </n-loading-bar-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>
