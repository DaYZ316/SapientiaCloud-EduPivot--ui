<template>
  <!-- 全局加载状态 -->
  <n-spin v-if="context.loadingState.hasAnyLoading" class="global-loading" size="large">
    <div class="loading-content">
      <n-icon :component="VideocamOutline" size="32"/>
      <div class="loading-text">{{
          context.loadingState.getLoadingMessage(context.loadingState.getLoadingStates()[0]) || t('live.common.processing')
        }}
      </div>
    </div>
  </n-spin>
</template>

<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {NIcon, NSpin} from 'naive-ui'
import {VideocamOutline} from '@vicons/ionicons5'
import {useLiveRoomContext} from '../composables/useLiveRoomContext'

const {t} = useI18n()

// 使用注入的上下文
const context = useLiveRoomContext()
</script>

<style scoped>
.global-loading {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 9999;

  .loading-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    padding: 32px;

    .loading-text {
      font-size: 14px;
      color: var(--text-secondary-color);
      text-align: center;
    }
  }
}
</style>
