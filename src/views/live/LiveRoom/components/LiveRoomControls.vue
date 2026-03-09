<template>
  <div class="room-status-bar" v-show="!context.isFullscreen.value">
    <connection-status
      :room-status="context.roomInfo.value?.status || null"
      :online-count="context.onlineCount.value"
      :current-user-role="context.currentUserRole.value"
      :is-recording="context.recording.isRecording.value"
      :recording-status-label="context.recording.recordingStatusLabel.value"
      :connection-state-label="context.connectionStateLabel.value"
      :connection-error="context.connectionError.value"
      :show-leave-button="context.connectionIsConnected.value"
      @leave="context.handleLeave()"
    />
  <n-space>
    <!-- 离开按钮已移至聊天面板上方 -->
  </n-space>
  </div>
</template>

<script setup lang="ts">
import { NSpace } from 'naive-ui'
import ConnectionStatus from './ConnectionStatus.vue'
import { useLiveRoomContext } from '../composables/useLiveRoomContext'
// 使用注入的上下文
const context = useLiveRoomContext()
</script>
