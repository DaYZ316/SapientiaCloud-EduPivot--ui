<template>
  <div class="system-message">
    <div class="system-message-content">
      <n-icon :component="InformationCircleOutline" class="system-icon" size="20"/>
      <div class="system-text">{{ message.content }}</div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {NIcon} from 'naive-ui'
import {InformationCircleOutline} from '@vicons/ionicons5'
import type {ChatMessage} from '@/types/celestialHub/chatMessage'

defineProps<{
  message: ChatMessage
}>()
</script>

<style lang="scss" scoped>
@use '@/assets/styles' as *;

.system-message {
  display: flex;
  justify-content: center;
  margin: 12px 0;
  padding: 0 16px;

  .system-message-content {
    display: flex;
    align-items: center;
    gap: 8px;
    max-width: 80%;
    padding: 8px 12px;
    background: var(--background-tertiary-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    color: var(--text-secondary-color);
    font-size: 14px;
    line-height: 1.5;

    .system-icon {
      color: var(--warning-color);
      flex-shrink: 0;
    }

    .system-text {
      flex: 1;
      word-break: break-word;
    }
  }
}
</style>
