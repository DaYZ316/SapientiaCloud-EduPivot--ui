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

        <div class="speaker-thumbs">
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
}

const props = withDefaults(defineProps<Props>(), {
  layoutMode: 'speaker',
  mainParticipantId: null
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
  if (props.mainParticipantId === 'local') {
    return true
  }
  if (props.mainParticipantId && props.mainParticipantId !== 'local') {
    return !mainRemoteParticipant.value
  }
  return videoParticipants.value.length === 0
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const shouldShowLocalThumbnail = computed(() => {
  if (!isSpeakerLayout.value) {
    return false
  }
  return !shouldShowLocalAsMain.value
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const thumbnailParticipants = computed(() => {
  const mainId = mainRemoteParticipant.value?.participantId
  return videoParticipants.value.filter(participant => participant.participantId !== mainId)
})

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const handleSelectMain = (participantId: string) => {
  emit('select-main', participantId)
}

// 视频元素引用
const localVideoRefs = ref<Set<HTMLVideoElement>>(new Set())
const lastLocalVideoTrack = ref<any>(null)
const remoteVideoRefs = ref<Map<string, HTMLVideoElement>>(new Map())

  // 设置本地视频元素引用（支持多个实例）
  const setLocalVideoRef = (el: HTMLVideoElement | null) => {
    if (el) {
      localVideoRefs.value.add(el)
      console.log('本地视频元素已注册:', el, '当前轨道:', lastLocalVideoTrack.value)
      if (lastLocalVideoTrack.value) {
        console.log('立即附加现有轨道到新元素')
        attachToElement(lastLocalVideoTrack.value, el)
      } else {
        console.log('没有现有轨道，等待轨道到达')
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
                      console.log('找到现有轨道，附加到新元素:', pub.track)
                      attachToElement(pub.track, el)
                    }
                  })
                }
              }
            })
          } catch (e) {
            console.log('查找现有轨道时出错:', e)
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
    // Attach logic is provided externally (event/provide/inject)
    return
  }
  remoteVideoRefs.value.delete(participantId)
}

// 通用的附加逻辑：支持 LiveKit Track、MediaStream、MediaStreamTrack 以及常见封装
const attachToElement = (trackOrStream: any, el: HTMLVideoElement | null) => {
  if (!el || !trackOrStream) return

  try {
    // 优先使用 LiveKit 的 attach 接口
    if (typeof trackOrStream.attach === 'function') {
      trackOrStream.attach(el)
      el.play?.().catch(() => {})
      return
    }

    // 如果已经是 MediaStream，直接设置 srcObject
    if (trackOrStream instanceof MediaStream) {
      el.srcObject = trackOrStream
      el.play?.().catch(() => {})
      return
    }

    // 如果是单独的 MediaStreamTrack，包装成 MediaStream
    if (typeof trackOrStream.kind === 'string' && typeof (trackOrStream as any).label === 'string') {
      try {
        const ms = new MediaStream([trackOrStream])
        el.srcObject = ms
        el.play?.().catch(() => {})
        return
      } catch (e) {
        // 忽略构造失败，继续尝试其他字段
      }
    }

    // 有些实现会把 stream 放在 mediaStream/stream 字段中
    if (trackOrStream.mediaStream instanceof MediaStream) {
      el.srcObject = trackOrStream.mediaStream
      el.play?.().catch(() => {})
      return
    }
    if (trackOrStream.stream instanceof MediaStream) {
      el.srcObject = trackOrStream.stream
      el.play?.().catch(() => {})
      return
    }
  } catch (e) {
    // 忽略 attach 错误以保持鲁棒性
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

  // 当 props.remoteParticipants 更新时，自动附加/分离轨道
  watch(() => props.remoteParticipants, (newList) => {
    // attach newly arrived video tracks
    newList.forEach((p: any) => {
      if (p && p.participantId && p.videoTrack) {
        const el = remoteVideoRefs.value.get(p.participantId)
        if (el) {
          try {
            p.videoTrack.attach(el)
            // 尝试播放视频（若浏览器拒绝则忽略）
            el.play?.().catch(() => {})
          } catch (e) {
            // ignore attach errors
          }
        }
      }
    })
  }, { deep: true, immediate: true })

  // 监听本地视频轨道变化，强制附加
  watch(() => lastLocalVideoTrack.value, (newTrack) => {
    if (newTrack) {
      console.log('检测到新的本地视频轨道，立即附加:', newTrack)
      localVideoRefs.value.forEach((videoEl) => {
        attachToElement(newTrack, videoEl)
      })
    }
  })

// 确保变量被使用（模板中使用）
void shouldShowLocalThumbnail
void thumbnailParticipants
void handleSelectMain
void setRemoteVideoRef
void setLocalVideoRef

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
  lastLocalVideoTrack.value = null
  localVideoRefs.value.forEach((videoEl) => {
    videoEl.srcObject = null
  })
}

// 在挂载时尝试将已存在的远程轨道附加到已挂载的视频元素（防止顺序问题导致无法附加）
onMounted(() => {
  nextTick(() => {
    try {
      props.remoteParticipants.forEach((p: any) => {
        if (p && p.participantId && p.videoTrack) {
          const el = remoteVideoRefs.value.get(p.participantId)
          if (el) {
            try {
              p.videoTrack.attach(el)
              el.play?.().catch(() => {})
            } catch (e) {
              // ignore attach errors
            }
          }
        }
      })
    } catch (e) {
      // ignore
    }
  })
})

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
  position: relative;

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
}

.speaker-main {
  flex: 1;
  min-width: 0;
  min-height: 0;
  display: flex;
}

.speaker-thumbs {
  width: 240px;
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
  min-height: 200px;

  video {
    width: 100%;
    height: 100%;
    object-fit: contain;
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
  aspect-ratio: auto;
  min-height: 0;
}

.video-item.thumb-video {
  cursor: pointer;
}

// 连接状态的样式
:deep(.is-connected) .video-panel {
  opacity: 1;
  transform: translateY(0);
}
</style>
