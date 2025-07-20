<template>
  <div class="settings-container">
    <h1 class="page-title">{{ $t('menu.settings') }}</h1>
    
    <n-tabs type="line" animated>
      <!-- 个人设置 -->
      <n-tab-pane name="personal" :tab="$t('settings.tabs.personal')">
        <personal-settings />
      </n-tab-pane>
      
      <!-- 系统设置 -->
      <n-tab-pane name="system" :tab="$t('settings.tabs.system')">
        <system-settings />
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

// 使用异步组件加载各个设置模块
const PersonalSettings = defineAsyncComponent(() => import('./components/PersonalSettings.vue'))
const SystemSettings = defineAsyncComponent(() => import('./components/SystemSettings.vue'))
</script>

<style scoped lang="scss">
.settings-container {
  .page-title {
    margin-bottom: 24px;
    font-weight: 500;
    font-size: 24px;
    color: var(--text-color-primary);
  }
}
</style> 