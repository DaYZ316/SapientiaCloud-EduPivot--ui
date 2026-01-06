<template>
  <div class="app-layout">
    <!-- 侧边栏 -->
    <Sider/>

    <!-- 主内容区域 -->
    <div class="main-wrapper">

      <!-- 页面内容 -->
      <Main/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onMounted, onUnmounted} from 'vue'
import {useMenuStore, useThemeStore} from '@/store'
import Sider from './Sider.vue'
import Main from './Main.vue'

const themeStore = useThemeStore()
const menuStore = useMenuStore()

const checkScreenSize = () => {
  if (window.innerWidth < 768) {
    themeStore.setSidebarCollapsed(true)
  }
}

onMounted(() => {
  checkScreenSize()
  window.addEventListener('resize', checkScreenSize)
  menuStore.loadLastAccessedCourse()
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

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
</style>