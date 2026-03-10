<template>
  <div v-show="!context.isFullscreen.value" class="room-status-bar">
    <connection-status
        :connection-error="context.connectionError.value"
        :connection-state-label="context.connectionStateLabel.value"
        :current-user-role="context.currentUserRole.value"
        :is-recording="context.recording.isRecording.value"
        :online-count="context.onlineCount.value"
        :recording-status-label="context.recording.recordingStatusLabel.value"
        :room-status="context.roomInfo.value?.status || null"
        :show-leave-button="context.connectionIsConnected.value"
        @leave="context.handleLeave()"
    />
    <n-space>
      <!-- 离开按钮已移至聊天面板上方 -->
    </n-space>
  </div>
</template>

<script lang="ts" setup>
import {NSpace} from 'naive-ui'
import ConnectionStatus from './ConnectionStatus.vue'
import {useLiveRoomContext} from '../composables/useLiveRoomContext'
// 使用注入的上下文
const context = useLiveRoomContext()
</script>
