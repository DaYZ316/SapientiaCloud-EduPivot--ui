<template>
  <section :class="['video-panel', { 'is-connected': isConnectedComputed }]" :style="isConnectedComputed ? { opacity: 1, transform: 'translateY(0)' } : {}">
    <!-- 全屏按钮 -->
    <!-- 连接状态 -->
    <template v-if="connecting">
      <div class="connecting-state">
        <n-spin size="large" />
        <div class="connecting-text">{{ connectionStateLabel || t('live.room.connecting') }}</div>
      </div>
    </template>

    <!-- 已连接状态 -->
    <template v-else-if="isConnected">
      <div v-if="isSpeakerLayout" class="speaker-layout">
        <div class="speaker-main">
          <div v-if="shouldShowLocalAsMain" class="video-item main-video local-video" :class="{ 'is-speaking': localSpeakingState?.isSpeaking }">
            <video
              :ref="(el) => setLocalVideoRef(el as HTMLVideoElement | null)"
              autoplay
              muted
              playsinline
            />
            <div class="video-label">{{ t('live.room.localVideo') }}</div>
            <!-- 说话指示器 -->
            <div v-if="localSpeakingState?.isSpeaking" class="speaking-indicator">
              <div class="speaking-bar" :style="{ height: `${localSpeakingState.volumeLevel * 100}%` }"></div>
            </div>
          </div>
          <div v-else-if="mainRemoteParticipant" class="video-item main-video" :class="{ 'is-speaking': getParticipantSpeakingState(mainRemoteParticipant.participantId)?.isSpeaking }">
            <video
              :ref="(el) => mainRemoteParticipant?.participantId && setRemoteVideoRef(el as HTMLVideoElement | null, mainRemoteParticipant.participantId)"
              autoplay
              playsinline
            />
            <div class="video-label">{{ mainRemoteParticipant?.displayName || mainRemoteParticipant?.participantId }}</div>
          </div>
          <div v-else class="video-item main-video local-video" :class="{ 'is-speaking': localSpeakingState?.isSpeaking }">
            <video
              :ref="(el) => setLocalVideoRef(el as HTMLVideoElement | null)"
              autoplay
              muted
              playsinline
            />
            <div class="video-label">{{ t('live.room.localVideo') }}</div>
          </div>
        </div>

        <div v-if="hasThumbnails" class="speaker-thumbs">
          <div
            v-if="shouldShowLocalThumbnail"
            class="video-item thumb-video local-video"
            :class="{ 'is-speaking': localSpeakingState?.isSpeaking }"
            @click="handleSelectMain('local')"
          >
            <video
              :ref="(el) => setLocalVideoRef(el as HTMLVideoElement | null)"
              autoplay
              muted
              playsinline
            />
            <div class="video-label">{{ t('live.room.localVideo') }}</div>
          </div>
          <div
            v-for="participant in thumbnailParticipants"
            :key="participant.participantId"
            class="video-item thumb-video"
            :class="{ 'is-speaking': getParticipantSpeakingState(participant.participantId)?.isSpeaking }"
            @click="handleSelectMain(participant.participantId)"
          >
            <video
              :ref="(el) => setRemoteVideoRef(el as HTMLVideoElement | null, participant.participantId)"
              autoplay
              playsinline
            />
            <div class="video-label">{{ participant.displayName || participant.participantId }}</div>
          </div>
        </div>
      </div>

      <div v-else class="video-grid">
        <div class="video-item local-video" :class="{ 'is-speaking': localSpeakingState?.isSpeaking }">
          <video
            :ref="(el) => setLocalVideoRef(el as HTMLVideoElement | null)"
            autoplay
            muted
            playsinline
          />
          <div class="video-label">{{ t('live.room.localVideo') }}</div>
        </div>

        <div
          v-for="participant in videoParticipants"
          :key="participant.participantId"
          class="video-item"
          :class="{ 'is-speaking': getParticipantSpeakingState(participant.participantId)?.isSpeaking }"
        >
          <video
            :ref="(el) => setRemoteVideoRef(el as HTMLVideoElement | null, participant.participantId)"
            autoplay
            playsinline
          />
          <div class="video-label">{{ participant.displayName || participant.participantId }}</div>
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
    <div class="remote-audio">
      <audio
        v-for="participant in audioParticipants"
        :key="participant.participantId"
        :ref="(el) => setRemoteAudioRef(el as HTMLAudioElement | null, participant.participantId)"
        autoplay
        playsinline
      />
    </div>
  </section>
</template>

<script lang="ts" setup>
import { computed, ref, type ComputedRef, watch, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { NIcon } from 'naive-ui'
import { VideocamOutline } from '@vicons/ionicons5'
import { Track } from 'livekit-client'
import type { RemoteParticipantMedia } from '@/types/live'
import { useLiveSpeakingStore } from '@/stores/liveSpeaking'

interface Props {
  isConnected: boolean
  connecting: boolean
  connectionStateLabel: string
  remoteParticipants: RemoteParticipantMedia[]
  layoutMode?: string
  mainParticipantId?: string | null
  speakerVolume?: number
  localVideoTrack?: any | null
  // 说话指示器相关
  speakingStates?: Map<string, { isSpeaking: boolean; volumeLevel: number }>
  sortedSpeakingIds?: ComputedRef<string[]>
  localParticipantIdentity?: string
}

const props = withDefaults(defineProps<Props>(), {
  layoutMode: 'speaker',
  mainParticipantId: null,
  speakerVolume: 100,
  localVideoTrack: null,
  speakingStates: () => new Map(),
  sortedSpeakingIds: () => computed(() => []),
  localParticipantIdentity: 'local'
})

interface Emits {
  (e: 'select-main', participantId: string): void
}

const emit = defineEmits<Emits>()

const { t } = useI18n()
const speakingStore = useLiveSpeakingStore()

// Template prop used for class binding
const isConnectedComputed = computed(() => props.isConnected)

const videoParticipants = computed(() => {
  return props.remoteParticipants.filter(participant => participant.videoTrack)
})

const audioParticipants = computed(() => {
  return props.remoteParticipants.filter(participant => participant.audioTrack)
})

const isSpeakerLayout = computed(() => props.layoutMode === 'speaker')

const mainRemoteParticipant = computed(() => {
  if (!props.mainParticipantId || props.mainParticipantId === 'local') {
    return null
  }
  return videoParticipants.value.find(participant => participant.participantId === props.mainParticipantId) || null
})

const shouldShowLocalAsMain = computed(() => {
  if (!isSpeakerLayout.value) {
    return false
  }
  const result = props.mainParticipantId === 'local' || (!props.mainParticipantId && videoParticipants.value.length === 0)
  return result
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const shouldShowLocalThumbnail = computed(() => {
  if (!isSpeakerLayout.value) {
    return false
  }
  // 只有当本地不是主视频且有远程视频参与者时，才在缩略图中显示本地视频
  return !shouldShowLocalAsMain.value && videoParticipants.value.length > 0
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const thumbnailParticipants = computed(() => {
  const mainId = mainRemoteParticipant.value?.participantId
  return videoParticipants.value.filter(participant => participant.participantId !== mainId)
})

const hasThumbnails = computed(() => {
  // 只有在有多个视频源时才显示缩略图区域
  return videoParticipants.value.length > 0 && (shouldShowLocalThumbnail.value || thumbnailParticipants.value.length > 0)
})

// 说话指示器辅助函数
/**
 * 获取参与者的说话状态
 */
const getParticipantSpeakingState = (participantId: string): { isSpeaking: boolean; volumeLevel: number } | null => {
  return speakingStore.getSpeakingState(participantId) || props.speakingStates.get(participantId) || null
}

/**
 * 本地用户的说话状态
 */
const localSpeakingState = computed(() => {
  // 使用 props.localParticipantIdentity 作为 key，与 speakingIndicator 保持一致
  const identity = props.localParticipantIdentity || 'local'
  return speakingStore.getSpeakingState(identity) || props.speakingStates.get(identity) || null
})

/**
 * 当前正在说话的人数
 */
const speakingCount = computed(() => {
  let count = 0
  props.speakingStates.forEach(state => {
    if (state.isSpeaking) count++
  })
  return count
})

// 暴露给父组件使用
void speakingCount

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleSelectMain = (participantId: string) => {
  emit('select-main', participantId)
}

// 视频元素引用
const localVideoRefs = ref<Set<HTMLVideoElement>>(new Set())
const lastLocalVideoTrack = ref<any>(null)
const remoteVideoRefs = ref<Map<string, HTMLVideoElement>>(new Map())
const remoteAudioRefs = ref<Map<string, HTMLAudioElement>>(new Map())

  // 设置本地视频元素引用（支持多个实例）
  const setLocalVideoRef = (el: HTMLVideoElement | null) => {
    if (el) {
      localVideoRefs.value.add(el)
      if (lastLocalVideoTrack.value) {
        attachToElement(lastLocalVideoTrack.value, el)
      } else {
        // 如果没有轨道，尝试查找页面上的 LiveKit 轨道并附件
        nextTick(() => {
          try {
            const vueInstances: any[] = []
            function findVueInstances(node: any) {
              if (node.__vue__) {
                vueInstances.push(node.__vue__)
              }
              if (node.children) {
                Array.from(node.children).forEach(findVueInstances)
              }
            }
            findVueInstances(document.body)

            vueInstances.forEach((vm: any) => {
              if (vm.$?.data?.room || vm.$?.props?.room || vm.$?.data?.connection?.room?.value) {
                const room = vm.$?.data?.room || vm.$?.props?.room || vm.$?.data?.connection?.room?.value
                if (room?.localParticipant) {
                  const videoPubs = Array.from(room.localParticipant.videoTrackPublications.values())
                  videoPubs.forEach((pub: any) => {
                    if (pub.track && pub.track.kind === 'video') {
                      attachToElement(pub.track, el)
                    }
                  })
                }
              }
            })
          } catch (e) {
          }
        })
      }
      return
    }
    localVideoRefs.value.forEach((videoEl) => {
      if (!videoEl.isConnected) {
        localVideoRefs.value.delete(videoEl)
      }
    })
  }

// 设置远程视频元素引用
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const setRemoteVideoRef = (el: HTMLVideoElement | null, participantId: string) => {
  if (el) {
    remoteVideoRefs.value.set(participantId, el)
    // Attach immediately if the track already exists but the element was created later.
    const participant = props.remoteParticipants.find(p => p.participantId === participantId)
    if (participant?.videoTrack) {
      attachToElement(participant.videoTrack, el)
    }
    return
  }
  remoteVideoRefs.value.delete(participantId)
}

// 通用的附件逻辑：支持 LiveKit Track、MediaStream、MediaStreamTrack 以及常见封装
const setRemoteAudioRef = (el: HTMLAudioElement | null, participantId: string) => {
  if (el) {
    remoteAudioRefs.value.set(participantId, el)
    const participant = props.remoteParticipants.find(p => p.participantId === participantId)
    if (participant?.audioTrack) {
      attachToElement(participant.audioTrack, el)
      applySpeakerVolume(props.speakerVolume)
    }
    return
  }
  remoteAudioRefs.value.delete(participantId)
}

const attachToElement = (trackOrStream: any, el: HTMLMediaElement | null) => {
  if (!el || !trackOrStream) return

  // 优先使用 LiveKit 的 attach 接口
  if (typeof trackOrStream.attach === 'function') {
    trackOrStream.attach(el)
    el.play?.()
    return
  }

  // 如果已经是 MediaStream，直接设置 srcObject
  if (trackOrStream instanceof MediaStream) {
    el.srcObject = trackOrStream
    el.play?.()
    return
  }

  // 如果是单独的 MediaStreamTrack，包装成 MediaStream
  if (typeof trackOrStream.kind === 'string' && typeof (trackOrStream as any).label === 'string') {
    const ms = new MediaStream([trackOrStream])
    el.srcObject = ms
    el.play?.()
    return
  }

  // 有些实现会把 stream 放在 mediaStream/stream 字段中
  if (trackOrStream.mediaStream instanceof MediaStream) {
    el.srcObject = trackOrStream.mediaStream
    el.play?.()
    return
  }
  if (trackOrStream.stream instanceof MediaStream) {
    el.srcObject = trackOrStream.stream
    el.play?.()
    return
  }
}

const attachLocalVideo = (track: any) => {
  lastLocalVideoTrack.value = track
  localVideoRefs.value.forEach((videoEl) => {
    attachToElement(track, videoEl)
  })
}

// 附加远程视频轨道
const attachRemoteVideo = (participantId: string, track: Track | any) => {
  const videoEl = remoteVideoRefs.value.get(participantId)
  if (videoEl) {
    attachToElement(track, videoEl)
  }
}

// 附加远程音频轨道（LiveKit音频轨道通常自动处理，此处提供空实现以保证接口一致性）
const attachRemoteAudio = (participantId: string, track: Track | any) => {
  const audioEl = remoteAudioRefs.value.get(participantId)
  if (audioEl) {
    attachToElement(track, audioEl)
    applySpeakerVolume(props.speakerVolume)
  }
}

const applySpeakerVolume = (value = 100) => {
  const normalized = Math.max(0, Math.min(1, value / 100))
  remoteAudioRefs.value.forEach((audioEl) => {
    audioEl.volume = normalized
    audioEl.muted = normalized <= 0
  })
}

  // 当 props.remoteParticipants 更新时，自动附加/分离轨道
  watch(() => props.remoteParticipants, (newList) => {

    // attach newly arrived video tracks
    newList.forEach((p: any) => {
      if (p && p.participantId && p.videoTrack) {
        const el = remoteVideoRefs.value.get(p.participantId)
        if (el) {
          attachToElement(p.videoTrack, el)
        } else {
        }
      }
    })

    // attach newly arrived audio tracks
    newList.forEach((p: any) => {
      if (p && p.participantId && p.audioTrack) {
        const el = remoteAudioRefs.value.get(p.participantId)
        if (el) {
          attachToElement(p.audioTrack, el)
          applySpeakerVolume(props.speakerVolume)
        }
      }
    })
  }, { deep: true, immediate: true })

  // 监听本地视频轨道变化，强力附加
  watch(() => lastLocalVideoTrack.value, (newTrack) => {
    if (newTrack) {
      localVideoRefs.value.forEach((videoEl) => {
        attachToElement(newTrack, videoEl)
      })
    }
  })

  // 监听主要参与者变化，重新附加轨道
  watch(() => props.mainParticipantId, (newMainId, oldMainId) => {
    if (newMainId !== oldMainId) {

      // 强制重新附加所有本地视频轨道
      if (lastLocalVideoTrack.value) {
        localVideoRefs.value.forEach((videoEl) => {
          attachToElement(lastLocalVideoTrack.value, videoEl)
        })
      }

      // 重新附加所有远程视频轨道，确保布局切换后视频正确显示
      props.remoteParticipants.forEach((participant) => {
        if (participant?.videoTrack) {
          const videoEl = remoteVideoRefs.value.get(participant.participantId)
          if (videoEl) {
            attachToElement(participant.videoTrack, videoEl)
          }
        }
      })
    }
  })

  watch(() => props.speakerVolume, (value) => {
    applySpeakerVolume(value ?? 100)
  }, { immediate: true })

  watch(() => props.localVideoTrack, (track) => {
    if (track) {
      lastLocalVideoTrack.value = track
      localVideoRefs.value.forEach((videoEl) => {
        attachToElement(track, videoEl)
      })
    }
  }, { immediate: true })

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

const cleanupRemoteAudios = () => {
  remoteAudioRefs.value.forEach((audioEl) => {
    audioEl.srcObject = null
  })
  remoteAudioRefs.value.clear()
}

// 清理本地视频
const cleanupLocalVideo = () => {
  lastLocalVideoTrack.value = null
  localVideoRefs.value.forEach((videoEl) => {
    videoEl.srcObject = null
  })
}

// 在挂载时尝试将已存在的远程视频轨道附加到已挂载的视频元素，（防止顺序问题导致无法附件）
onMounted(() => {
  nextTick(() => {
    props.remoteParticipants.forEach((p: any) => {
      if (p && p.participantId && p.videoTrack) {
        const el = remoteVideoRefs.value.get(p.participantId)
        if (el) {
          p.videoTrack.attach(el)
          el.play?.()
        }
      }
    })
    props.remoteParticipants.forEach((p: any) => {
      if (p && p.participantId && p.audioTrack) {
        const el = remoteAudioRefs.value.get(p.participantId)
        if (el) {
          p.audioTrack.attach(el)
          el.play?.()
          applySpeakerVolume(props.speakerVolume)
        }
      }
    })
  })
})

// 暴露方法给父组件
defineExpose({
  attachLocalVideo,
  attachRemoteVideo,
  attachRemoteAudio,
  detachRemoteVideo,
  cleanupRemoteVideos,
  cleanupRemoteAudios,
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
  position: relative;

  .remote-audio {
    position: absolute;
    width: 0;
    height: 0;
    overflow: hidden;
  }

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
  grid-template-columns: repeat(auto-fill, minmax(min(320px, 45vw), 1fr));
  gap: 16px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  align-content: start;
  /* 添加布局切换动画 */
  animation: gridFadeIn 0.3s ease;
}

@keyframes gridFadeIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.speaker-layout {
  display: flex;
  gap: 16px;
  flex: 1;
  min-height: 0;
  align-items: flex-start;
  /* 添加布局切换动画 */
  animation: speakerFadeIn 0.3s ease;
}

@keyframes speakerFadeIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.speaker-main {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
  transition: all 0.3s ease;
}

.speaker-thumbs {
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  padding-right: 4px;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.video-item {
  position: relative;
  background: var(--background-color);
  border-radius: 8px;
  border: 2px solid transparent;
  box-sizing: border-box;
  overflow: hidden;
  aspect-ratio: 16 / 9;
  min-height: 180px;
  max-height: none;

  video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    background: var(--background-color);
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
    z-index: 2;
  }
}

.video-item.main-video {
  flex: 1;
  width: 100%;
  height: 100%;
  aspect-ratio: auto;
  min-height: 0;
  max-height: none;
  /* 主视频区域添加井盖的边框高度 */
  box-shadow: 0 0 0 2px var(--primary-color-hover);
}

.video-item.thumb-video {
  cursor: pointer;
  min-height: 140px;
  max-height: 200px;
  flex-shrink: 0;
  /* 缩略图可点击的视觉反馈*/
  transition: all 0.2s ease;
  border: 2px solid transparent;

  &:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    transform: translateY(-2px);
    border-color: var(--primary-color);
  }

  &:active {
    transform: translateY(0);
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  }

  /* 点击时的波纹效果 */
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }

  &:active::after {
    opacity: 1;
  }

  /* 点击提示 */
  &::before {
    content: 'Set as main';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 6px 12px;
    background: rgba(0, 0, 0, 0.6);
    color: white;
    border-radius: 6px;
    font-size: 12px;
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
    white-space: nowrap;
    z-index: 10;
  }

  &:hover::before {
    opacity: 1;
  }
}

// 连接状态的样式
:deep(.is-connected) .video-panel {
  opacity: 1;
  transform: translateY(0);
}

/* ============================================
   说话指示器样式 - 优化版
   ============================================ */

.video-item.is-speaking {
  border-color: rgba(82, 196, 26, 0.98);
  box-shadow:
    inset 0 0 0 2px rgba(82, 196, 26, 0.72),
    0 0 10px rgba(82, 196, 26, 0.45);
  animation: speakingBorderGlow 0.9s ease-in-out infinite;
  will-change: border-color, box-shadow, filter;
}

.video-item.main-video.is-speaking {
  border-width: 3px;
  box-shadow:
    inset 0 0 0 2px rgba(82, 196, 26, 0.9),
    0 0 14px rgba(82, 196, 26, 0.55);
  animation: speakingBorderGlowMain 0.9s ease-in-out infinite;
}

@keyframes speakingBorderGlow {
  0%, 100% {
    border-color: rgba(82, 196, 26, 0.92);
    box-shadow:
      inset 0 0 0 2px rgba(82, 196, 26, 0.7),
      0 0 8px rgba(82, 196, 26, 0.4);
    filter: saturate(1);
  }
  50% {
    border-color: rgba(149, 222, 100, 1);
    box-shadow:
      inset 0 0 0 2px rgba(149, 222, 100, 0.95),
      0 0 14px rgba(82, 196, 26, 0.75);
    filter: saturate(1.05);
  }
}

@keyframes speakingBorderGlowMain {
  0%, 100% {
    border-color: rgba(82, 196, 26, 0.95);
    box-shadow:
      inset 0 0 0 2px rgba(82, 196, 26, 0.85),
      0 0 12px rgba(82, 196, 26, 0.5);
    filter: saturate(1);
  }
  50% {
    border-color: rgba(149, 222, 100, 1);
    box-shadow:
      inset 0 0 0 2px rgba(149, 222, 100, 1),
      0 0 18px rgba(82, 196, 26, 0.85);
    filter: saturate(1.08);
  }
}

// 说话中的标签栏背景（不需要太显眼）
.video-item.is-speaking .video-label {
  background: rgba(82, 196, 26, 0.7);
  color: white;
}
</style>
