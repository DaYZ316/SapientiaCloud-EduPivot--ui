<template>
  <section class="video-panel">
    <!-- 连接状态 -->
    <template v-if="connecting">
      <div class="connecting-state">
        <n-spin size="large" />
        <div class="connecting-text">{{ connectionStateLabel || t('live.room.connecting') }}</div>
      </div>
    </template>

    <!-- 已连接状态 -->
    <template v-else-if="isConnected">
      <div class="video-grid">
        <!-- 本地视频 -->
        <div class="video-item local-video">
          <video
            ref="localVideoRef"
            autoplay
            muted
            playsinline
          />
          <div class="video-label">{{ t('live.room.localVideo') }}</div>
        </div>

        <!-- 远程参与者视频 -->
        <div
          v-for="participant in remoteParticipants"
          :key="participant.participantId"
          class="video-item"
        >
          <video
            :ref="(el) => setRemoteVideoRef(el as HTMLVideoElement | null, participant.participantId)"
            autoplay
            playsinline
          />
          <div class="video-label">{{ participant.participantId }}</div>
        </div>
      </div>
    </template>

    <!-- 未连接状态 -->
    <template v-else>
      <div class="video-placeholder">
        <n-icon size="48" color="var(--text-color-3)">
          <VideocamOutline />
        </n-icon>
        <div class="placeholder-text">{{ t('live.room.notConnected') }}</div>
      </div>
    </template>
  </section>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { NSpin, NIcon } from 'naive-ui'
import { VideocamOutline } from '@vicons/ionicons5'
import { Track } from 'livekit-client'
import type { RemoteParticipantMedia } from '@/types/live'

interface Props {
  isConnected: boolean
  connecting: boolean
  connectionStateLabel: string
  remoteParticipants: RemoteParticipantMedia[]
}

defineProps<Props>()

const { t } = useI18n()

// 视频元素引用
const localVideoRef = ref<HTMLVideoElement | null>(null)
const remoteVideoRefs = ref<Map<string, HTMLVideoElement>>(new Map())

// 设置远程视频元素引用
const setRemoteVideoRef = (el: HTMLVideoElement | null, participantId: string) => {
  if (el) {
    remoteVideoRefs.value.set(participantId, el)
    // 这里需要从外部传入轨道附加逻辑
    // 可以通过事件或provide/inject来处理
  } else {
    remoteVideoRefs.value.delete(participantId)
  }
}

// 附加本地视频轨道（由父组件调用）
const attachLocalVideo = (track: any) => {
  if (localVideoRef.value && track) {
    track.attach(localVideoRef.value)
  }
}

// 附加远程视频轨道
const attachRemoteVideo = (participantId: string, track: Track) => {
  if (track.kind === Track.Kind.Video) {
    const videoEl = remoteVideoRefs.value.get(participantId)
    if (videoEl) {
      track.attach(videoEl)
    }
  }
}

// 分离远程视频轨道
const detachRemoteVideo = (participantId: string, track: Track) => {
  if (track.kind === Track.Kind.Video) {
    const videoEl = remoteVideoRefs.value.get(participantId)
    if (videoEl) {
      track.detach(videoEl)
      videoEl.srcObject = null
    }
  }
}

// 清理所有远程视频
const cleanupRemoteVideos = () => {
  remoteVideoRefs.value.forEach((videoEl) => {
    videoEl.srcObject = null
  })
  remoteVideoRefs.value.clear()
}

// 清理本地视频
const cleanupLocalVideo = () => {
  if (localVideoRef.value) {
    localVideoRef.value.srcObject = null
  }
}

// 暴露方法给父组件
defineExpose({
  attachLocalVideo,
  attachRemoteVideo,
  detachRemoteVideo,
  cleanupRemoteVideos,
  cleanupLocalVideo
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.video-panel {
  flex: 1;
  background: var(--background-tertiary-color);
  border-radius: 12px;
  padding: 16px;
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  min-height: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%;

  .connecting-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 16px;
    color: var(--text-color-3);
    min-height: 260px;
    flex: 1;

    .connecting-text {
      font-size: 14px;
      text-align: center;
    }
  }

  .video-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: var(--text-color-3);
    min-height: 260px;
    flex: 1;

    svg {
      width: 48px;
      height: 48px;
    }

    .placeholder-text {
      font-size: 14px;
    }
  }
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  align-content: start;
}

.video-grid .local-video {
  grid-column: 1 / -1;
  min-height: 400px;
}

.video-item {
  position: relative;
  background: var(--background-color);
  border-radius: 8px;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  min-height: 200px;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .video-label {
    position: absolute;
    bottom: 8px;
    left: 8px;
    padding: 4px 8px;
    background: var(--shadow-color);
    color: var(--text-color);
    border-radius: 4px;
    font-size: 12px;
  }
}

.video-item.local-video {
  aspect-ratio: auto;
  min-height: 400px;
}

// 连接状态的样式
:deep(.is-connected) .video-panel {
  opacity: 1;
  transform: translateY(0);
}
</style>
