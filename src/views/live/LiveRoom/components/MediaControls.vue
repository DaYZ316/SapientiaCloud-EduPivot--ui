<template>
  <div :class="['media-controls', { 'media-controls-overlay': props.isOverlay }]">
    <n-space align="center">
      <!-- 摄像头控制 -->
      <n-button
        quaternary
        size="small"
        :type="cameraEnabled ? 'default' : 'error'"
        @click="handleToggleCamera"
      >
        <template #icon>
          <n-icon :component="cameraEnabled ? VideocamOutline : VideocamOffOutline" />
        </template>
        <span v-if="!props.iconOnly">{{ cameraEnabled ? t('live.room.cameraOn') : t('live.room.cameraOff') }}</span>
      </n-button>

      <!-- 麦克风控制 -->
      <n-button
        quaternary
        size="small"
        :type="microphoneEnabled ? 'default' : 'error'"
        @click="handleToggleMicrophone"
      >
        <template #icon>
          <n-icon :component="microphoneEnabled ? MicOutline : MicOffOutline" />
        </template>
        <span v-if="!props.iconOnly">{{ microphoneEnabled ? t('live.room.microphoneOn') : t('live.room.microphoneOff') }}</span>
      </n-button>

      <!-- 屏幕共享控制（老师/助教可见） -->
      <n-button
        v-if="canShowScreenShare"
        quaternary
        size="small"
        :type="screenShareEnabled ? 'info' : 'default'"
        @click="handleToggleScreenShare"
      >
        <template #icon>
          <n-icon :component="screenShareEnabled ? TvOutline : TvOutline" />
        </template>
        <span v-if="!props.iconOnly">{{ screenShareEnabled ? t('live.room.stopScreenShare') : t('live.room.startScreenShare') }}</span>
      </n-button>

      <!-- 举手控制（仅学生可见） -->
      <n-button
        v-if="showHandRaise"
        quaternary
        size="small"
        :type="isHandRaised ? 'warning' : 'default'"
        :disabled="isHandRaiseDisabled"
        @click="handleRaiseHand"
      >
        <template #icon>
          <n-icon :component="HandLeftOutline" />
        </template>
        <span v-if="!props.iconOnly">{{ handRaiseText }}</span>
      </n-button>

      <!-- 录制控制 -->
      <n-button
        v-if="canShowRecording && props.showRecording"
        quaternary
        size="small"
        :disabled="!canRecord"
        :loading="recordingLoading"
        :type="isRecording ? 'error' : 'default'"
        @click="handleToggleRecording"
      >
        <template #icon>
          <n-icon :component="isRecording ? StopCircleOutline : RadioButtonOnOutline" />
        </template>
        <span v-if="!props.iconOnly">{{ isRecording ? t('live.room.stopRecording') : t('live.room.startRecording') }}</span>
      </n-button>

      <div class="volume-control">
        <n-icon :component="speakerVolume <= 0 ? VolumeMuteOutline : VolumeHighOutline" />
        <n-slider
          :value="speakerVolume"
          :step="5"
          :min="0"
          :max="100"
          style="width: 120px;"
          @update:value="handleSpeakerVolume"
        />
      </div>
    </n-space>
  </div>
</template>

<script lang="ts" setup>
import { computed, withDefaults } from 'vue'
import { useI18n } from 'vue-i18n'
import { NButton, NSpace, NIcon, NSlider } from 'naive-ui'
import {
  HandLeftOutline,
  MicOffOutline,
  MicOutline,
  TvOutline,
  RadioButtonOnOutline,
  StopCircleOutline,
  VideocamOffOutline,
  VideocamOutline,
  VolumeHighOutline,
  VolumeMuteOutline
} from '@vicons/ionicons5'
import { LiveRoomRoleEnum } from '@/enum/live'

interface Props {
  cameraEnabled: boolean
  microphoneEnabled: boolean
  screenShareEnabled: boolean
  canShareScreen: boolean
  isRecording: boolean
  recordingLoading: boolean
  currentUserRole: LiveRoomRoleEnum
  canRecord: boolean
  speakerVolume: number
  iconOnly?: boolean
  isOverlay?: boolean
  showRecording?: boolean
  isHandRaised?: boolean
  handRaiseCooldown?: number
}

const props = withDefaults(defineProps<Props>(), {
  iconOnly: false,
  isOverlay: false,
  showRecording: true,
  isHandRaised: false,
  handRaiseCooldown: 0
})

interface Emits {
  (e: 'toggle-camera'): void
  (e: 'toggle-microphone'): void
  (e: 'toggle-screen-share'): void
  (e: 'toggle-recording'): void
  (e: 'update-speaker-volume', value: number): void
  (e: 'raise-hand'): void
}

const emit = defineEmits<Emits>()

const { t } = useI18n()

// 计算属性
const canShowRecording = computed(() => {
  return props.currentUserRole === LiveRoomRoleEnum.TEACHER ||
         props.currentUserRole === LiveRoomRoleEnum.ASSISTANT
})

// 是否显示屏幕共享按钮（老师/助教可见）
const canShowScreenShare = computed(() => {
  return props.currentUserRole === LiveRoomRoleEnum.TEACHER ||
         props.currentUserRole === LiveRoomRoleEnum.ASSISTANT
})

// 是否显示举手按钮（仅学生可见）
const showHandRaise = computed(() => {
  return props.currentUserRole === LiveRoomRoleEnum.STUDENT
})

// 举手按钮是否禁用
const isHandRaiseDisabled = computed(() => {
  return props.handRaiseCooldown > 0 || props.isHandRaised
})

// 举手按钮文本
const handRaiseText = computed(() => {
  if (props.isHandRaised) {
    return t('live.room.handRaised')
  }
  if (props.handRaiseCooldown > 0) {
    return t('live.room.handRaiseCooldown', { seconds: props.handRaiseCooldown })
  }
  return t('live.room.raiseHand')
})

// 事件处理
const handleToggleCamera = () => {
  emit('toggle-camera')
}

const handleToggleMicrophone = () => {
  emit('toggle-microphone')
}

const handleToggleScreenShare = () => {
  emit('toggle-screen-share')
}

const handleToggleRecording = () => {
  emit('toggle-recording')
}

const handleSpeakerVolume = (value: number) => {
  emit('update-speaker-volume', value)
}

const handleRaiseHand = () => {
  if (!isHandRaiseDisabled.value) {
    emit('raise-hand')
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.media-controls {
  margin-top: 16px;
  padding-top: 16px;
  border-top: 1px solid var(--border-color);
  flex-shrink: 0;

  &.media-controls-overlay {
    margin-top: 0;
    padding: 0;
    border-top: none;
    background: transparent;

    :deep(.n-button) {
      color: var(--text-color);
    }

    .volume-control {
      padding-left: 0;
    }
  }

  .volume-control {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding-left: 4px;
  }
}
</style>
