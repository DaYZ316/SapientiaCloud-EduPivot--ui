<template>
  <div class="app-layout">
    <!-- 侧边栏 -->
    <Sider/>

    <!-- 主内容区域 -->
    <div class="main-wrapper">
      <!-- Dashboard Header (只在Dashboard页面显示) -->
      <transition mode="out-in" name="header-fade-slide">
        <Header v-if="isDashboardPage" key="header"/>
      </transition>

      <!-- 页面内容 -->
      <Main/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, onUnmounted} from 'vue'
import {useRoute} from 'vue-router'
import {useMenuStore, useThemeStore} from '@/store'
import Sider from './Sider.vue'
import Header from './Header.vue'
import Main from './Main.vue'

const route = useRoute()
const themeStore = useThemeStore()
const menuStore = useMenuStore()

const isDashboardPage = computed(() => route.name === 'Dashboard')

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
  background-color: var(--background);
}

.main-wrapper {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

// Header 进场出场动画
.header-fade-slide-enter-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.header-fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 1, 1);
}

.header-fade-slide-enter-from {
  opacity: 0;
  transform: translateY(-100%);
}

.header-fade-slide-enter-to {
  opacity: 1;
  transform: translateY(0);
}

.header-fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}

.header-fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-100%);
}
</style>