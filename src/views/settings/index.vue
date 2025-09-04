<template>
  <div class="settings-container">
    <div class="page-header">
      <n-button circle quaternary @click="goBack">
        <template #icon>
          <Icon :component="ArrowBackOutline"/>
        </template>
      </n-button>
      <h1 class="page-title">{{ t('menu.settings') }}</h1>
    </div>

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
import {defineAsyncComponent} from 'vue'
import {useRouter} from 'vue-router'
import {ArrowBackOutline} from '@vicons/ionicons5'
import Icon from '@/components/common/Icon.vue'
import {useI18n} from 'vue-i18n'

const {t} = useI18n()
const router = useRouter()

// 使用异步组件加载各个设置模块
const PersonalSettings = defineAsyncComponent(() => import('./components/PersonalSettings/index.vue'))
const SystemSettings = defineAsyncComponent(() => import('./components/SystemSettings.vue'))

// 返回上一页
function goBack() {
  router.back()
}
</script>

<style lang="scss" scoped>
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