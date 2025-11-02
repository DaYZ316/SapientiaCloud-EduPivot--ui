<template>
  <div class="settings-container">
    <PageHeader :title="t('menu.settings')"/>

    <n-tabs animated type="line">
      <!-- 个人设置 -->
      <n-tab-pane :tab="t('settings.tabs.personal')" name="personal">
        <personal-settings/>
      </n-tab-pane>

      <!-- 系统设置 -->
      <n-tab-pane :tab="t('settings.tabs.system')" name="system">
        <system-settings/>
      </n-tab-pane>
    </n-tabs>
  </div>
</template>

<script lang="ts" setup>
import {defineAsyncComponent, onMounted} from 'vue'
import {useI18n} from 'vue-i18n'
import {useUserStore} from '@/store'
import PageHeader from '@/components/common/PageHeader.vue'

const {t} = useI18n()
const userStore = useUserStore()

// 使用异步组件加载各个设置模块
const PersonalSettings = defineAsyncComponent(() => import('./components/PersonalSettings/index.vue'))
const SystemSettings = defineAsyncComponent(() => import('./components/SystemSettings.vue'))

// 确保页面加载时用户信息已准备好
onMounted(async () => {
  if (!userStore.userInfo) {
    await userStore.refreshUserInfo()
  }
})
</script>

<style lang="scss" scoped>
@use './index.scss';
</style> 