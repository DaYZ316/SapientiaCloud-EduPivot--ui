<template>
  <div class="settings-container">
    <div class="page-header">
      <n-button quaternary circle @click="goBack">
        <template #icon>
          <n-icon><arrow-back-outline /></n-icon>
        </template>
      </n-button>
      <h1 class="page-title">{{ $t('menu.settings') }}</h1>
    </div>
    
    <n-tabs type="line" animated>
      <!-- 个人设置 -->
      <n-tab-pane name="personal" :tab="$t('settings.tabs.personal')">
        <personal-settings />
      </n-tab-pane>
      
      <!-- 用户设置 -->
      <n-tab-pane name="user" :tab="$t('settings.tabs.user')">
        <user-settings />
      </n-tab-pane>
      
      <!-- 角色设置 -->
      <n-tab-pane name="role" :tab="$t('settings.tabs.role')">
        <role-settings />
      </n-tab-pane>
      
      <!-- 权限设置 -->
      <n-tab-pane name="permission" :tab="$t('settings.tabs.permission')">
        <permission-settings />
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
import { useRouter } from 'vue-router'
import { NIcon, NButton } from 'naive-ui'
import { ArrowBackOutline } from '@vicons/ionicons5'

const router = useRouter()

// 使用异步组件加载各个设置模块
const PersonalSettings = defineAsyncComponent(() => import('./components/PersonalSettings.vue'))
const UserSettings = defineAsyncComponent(() => import('./components/UserSettings.vue'))
const RoleSettings = defineAsyncComponent(() => import('./components/RoleSettings.vue'))
const PermissionSettings = defineAsyncComponent(() => import('./components/PermissionSettings.vue'))
const SystemSettings = defineAsyncComponent(() => import('./components/SystemSettings.vue'))

// 返回上一页
function goBack() {
  router.back()
}
</script>

<style scoped lang="scss">
.settings-container {
  .page-header {
    display: flex;
    align-items: center;
    margin-bottom: 24px;
    
    .page-title {
      margin: 0 0 0 12px;
      font-weight: 500;
      font-size: 24px;
      color: var(--text-color-primary);
    }
  }
}
</style> 