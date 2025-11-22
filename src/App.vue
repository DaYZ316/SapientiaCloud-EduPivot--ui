<script lang="ts" setup>
import {darkTheme} from 'naive-ui'
import {useThemeStore, useUserStore} from '@/store'
import {computed, nextTick, onBeforeMount, onMounted, ref} from 'vue'
import {setGlobalApis} from '@/utils/naiveUIHelper'
import AuthTransition from '@/components/common/AuthTransition.vue'
import {setThemeTransitionClass} from '@/utils/themeAnimation'

const themeStore = useThemeStore()
const userStore = useUserStore()


// Provider组件引用
const messageProviderRef = ref()
const dialogProviderRef = ref()
const notificationProviderRef = ref()
const loadingBarProviderRef = ref()

// 初始化主题
themeStore.initSettings()

// 提升暗黑主题下页面刷新视觉体验
onBeforeMount(() => {
  setThemeTransitionClass(true)
})

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
  // 提升暗黑主题下页面刷新视觉体验
  setThemeTransitionClass(false)

  // 首先确保DOM渲染完成并初始化全局API
  await nextTick()
  initGlobalApis()

  // 为了确保API可用，再次延迟设置
  setTimeout(initGlobalApis, 50)

  // 然后检查登录状态
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
    <n-message-provider ref="messageProviderRef">
      <n-dialog-provider ref="dialogProviderRef">
        <n-notification-provider ref="notificationProviderRef">
          <n-loading-bar-provider ref="loadingBarProviderRef">
            <AuthTransition/>
            <router-view v-slot="{ Component }">
              <transition mode="out-in" name="slide-fade">
                <component :is="Component"/>
              </transition>
            </router-view>
          </n-loading-bar-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<style lang="scss">
// 过渡动画 - 右渐出左渐进
.slide-fade-enter-active {
  transition: all 0.35s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s ease-in;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(-30px);
}

.slide-fade-enter-to {
  opacity: 1;
  transform: translateX(0);
}

.slide-fade-leave-from {
  opacity: 1;
  transform: translateX(0);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(30px);
}
</style>
