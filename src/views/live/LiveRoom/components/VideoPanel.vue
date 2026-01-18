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
          <div v-if="shouldShowLocalAsMain" class="video-item main-video local-video">
            <video
              :ref="(el) => setLocalVideoRef(el as HTMLVideoElement | null)"
              autoplay
              muted
              playsinline
            />
            <div class="video-label">{{ t('live.room.localVideo') }}</div>
          </div>
          <div v-else-if="mainRemoteParticipant" class="video-item main-video">
            <video
              :ref="(el) => mainRemoteParticipant?.participantId && setRemoteVideoRef(el as HTMLVideoElement | null, mainRemoteParticipant.participantId)"
              autoplay
              playsinline
            />
            <div class="video-label">{{ mainRemoteParticipant.displayName || mainRemoteParticipant.participantId }}</div>
          </div>
          <div v-else class="video-item main-video local-video">
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
        <div class="video-item local-video">
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
import { computed, ref, watch, onMounted, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { NIcon } from 'naive-ui'
import { VideocamOutline } from '@vicons/ionicons5'
import { Track } from 'livekit-client'
import type { RemoteParticipantMedia } from '@/types/live'

interface Props {
  isConnected: boolean
  connecting: boolean
  connectionStateLabel: string
  remoteParticipants: RemoteParticipantMedia[]
  layoutMode?: string
  mainParticipantId?: string | null
  speakerVolume?: number
  localVideoTrack?: any | null
}

const props = withDefaults(defineProps<Props>(), {
  layoutMode: 'speaker',
  mainParticipantId: null,
  speakerVolume: 100,
  localVideoTrack: null
})

interface Emits {
  (e: 'select-main', participantId: string): void
}

const emit = defineEmits<Emits>()

const { t } = useI18n()

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
        // 如果没有轨道，尝试查找页面上的 LiveKit 轨道并附加
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

// 通用的附加逻辑：支持 LiveKit Track、MediaStream、MediaStreamTrack 以及常见封装
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

// 附加远程音频轨道（LiveKit音频轨道通常自动处理，此处提供空实现以保持接口一致性）
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

  // 监听本地视频轨道变化，强制附加
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

      // 重新附加所有远程视频轨道，确保布局切换后轨道正确显示
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

void shouldShowLocalThumbnail
void thumbnailParticipants
void hasThumbnails
void handleSelectMain
void setRemoteVideoRef
void setLocalVideoRef
void setRemoteAudioRef

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

// 在挂载时尝试将已存在的远程轨道附加到已挂载的视频元素（防止顺序问题导致无法附加）
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
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 16px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  align-content: start;
}

.speaker-layout {
  display: flex;
  gap: 16px;
  flex: 1;
  min-height: 0;
  align-items: flex-start;
}

.speaker-main {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
}

.speaker-thumbs {
  width: 280px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow-y: auto;
  padding-right: 4px;
}

.video-item {
  position: relative;
  background: var(--background-color);
  border-radius: 8px;
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
  }
}

.video-item.main-video {
  flex: 1;
  width: 100%;
  height: 100%;
  aspect-ratio: auto;
  min-height: 0;
  max-height: none;
}

.video-item.thumb-video {
  cursor: pointer;
  min-height: 140px;
  max-height: 200px;
  flex-shrink: 0;
}

// 连接状态的样式
:deep(.is-connected) .video-panel {
  opacity: 1;
  transform: translateY(0);
}
</style>
