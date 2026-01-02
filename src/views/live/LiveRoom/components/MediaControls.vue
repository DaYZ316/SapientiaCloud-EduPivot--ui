<template>
  <div class="media-controls">
    <n-space>
      <!-- 摄像头控制 -->
      <n-button
        :type="cameraEnabled ? 'default' : 'error'"
        @click="handleToggleCamera"
      >
        <template #icon>
          <n-icon :component="cameraEnabled ? VideocamOutline : VideocamOffOutline" />
        </template>
        {{ cameraEnabled ? t('live.room.cameraOn') : t('live.room.cameraOff') }}
      </n-button>

      <!-- 麦克风控制 -->
      <n-button
        :type="microphoneEnabled ? 'default' : 'error'"
        @click="handleToggleMicrophone"
      >
        <template #icon>
          <n-icon :component="microphoneEnabled ? MicOutline : MicOffOutline" />
        </template>
        {{ microphoneEnabled ? t('live.room.microphoneOn') : t('live.room.microphoneOff') }}
      </n-button>

      <!-- 录制控制 -->
      <n-button
        v-if="canShowRecording"
        :disabled="!canRecord"
        :loading="recordingLoading"
        :type="isRecording ? 'error' : 'default'"
        @click="handleToggleRecording"
      >
        <template #icon>
          <n-icon :component="isRecording ? StopCircleOutline : RadioButtonOnOutline" />
        </template>
        {{ isRecording ? t('live.room.stopRecording') : t('live.room.startRecording') }}
      </n-button>
    </n-space>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { NButton, NSpace, NIcon } from 'naive-ui'
import {
  MicOffOutline,
  MicOutline,
  RadioButtonOnOutline,
  StopCircleOutline,
  VideocamOffOutline,
  VideocamOutline
} from '@vicons/ionicons5'
import { LiveRoomRoleEnum } from '@/enum/live'

interface Props {
  cameraEnabled: boolean
  microphoneEnabled: boolean
  isRecording: boolean
  recordingLoading: boolean
  currentUserRole: LiveRoomRoleEnum
  canRecord: boolean
}

const props = defineProps<Props>()

interface Emits {
  (e: 'toggle-camera'): void
  (e: 'toggle-microphone'): void
  (e: 'toggle-recording'): void
}

const emit = defineEmits<Emits>()

const { t } = useI18n()

// 计算属性
const canShowRecording = computed(() => {
  return props.currentUserRole === LiveRoomRoleEnum.TEACHER ||
         props.currentUserRole === LiveRoomRoleEnum.ASSISTANT
})

// 事件处理
const handleToggleCamera = () => {
  emit('toggle-camera')
}

const handleToggleMicrophone = () => {
  emit('toggle-microphone')
}

const handleToggleRecording = () => {
  emit('toggle-recording')
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.media-controls {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
  flex-shrink: 0;
}
</style>
