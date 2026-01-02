<template>
  <div class="status-meta">
    <!-- 房间状态 -->
    <span class="status-chip">{{ roomStatusLabel }}</span>

    <!-- 在线人数 -->
    <span class="online-chip">
      {{ t('live.room.onlineCount') }}: {{ onlineCount }}
    </span>

    <!-- 当前用户角色 -->
    <span class="role-chip">{{ t('live.room.currentRole', { role: currentUserRoleLabel }) }}</span>

    <!-- 录制状态 -->
    <span v-if="recordingStatusLabel" :class="{ 'recording-active': isRecording }" class="recording-chip">
      {{ recordingStatusLabel }}
    </span>

    <!-- 连接状态 -->
    <n-text v-if="connectionStateLabel" :depth="3">
      {{ t('live.room.connectionState') }}: {{ connectionStateLabel }}
    </n-text>

    <!-- 连接错误 -->
    <n-text v-if="connectionError" :depth="3" style="color: var(--error-color);">
      {{ connectionError }}
    </n-text>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NText } from 'naive-ui'
import { getLiveRoomRoleLabel, getLiveRoomStatusLabel, LiveRoomRoleEnum, LiveRoomStatusEnum } from '@/enum/live'

interface Props {
  roomStatus: LiveRoomStatusEnum | null
  onlineCount: number
  currentUserRole: LiveRoomRoleEnum
  isRecording: boolean
  recordingStatusLabel: string | null
  connectionStateLabel: string
  connectionError: string | null
}

const props = defineProps<Props>()

const { t } = useI18n()

// 计算属性
const roomStatusLabel = computed(() => {
  if (!props.roomStatus && props.roomStatus !== 0) {
    return t('live.room.statusUnknown')
  }
  return getLiveRoomStatusLabel(props.roomStatus ?? LiveRoomStatusEnum.NOT_STARTED, false)
})

const currentUserRoleLabel = computed(() => getLiveRoomRoleLabel(props.currentUserRole))
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.status-meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.status-chip,
.online-chip,
.role-chip,
.token-chip,
.recording-chip {
  padding: 4px 12px;
  border-radius: 999px;
  background-color: var(--background-tertiary-color);
  font-size: 12px;
}

.recording-chip {
  &.recording-active {
    background-color: var(--error-color);
    color: var(--text-color);
    animation: recordingPulse 2s ease-in-out infinite;
  }
}

@keyframes recordingPulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}
</style>
