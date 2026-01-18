<template>
  <div v-if="isVisible" class="pip-live-window">
    <!-- 直播视频 -->
    <video
      v-if="hasVideoStream"
      ref="videoRef"
      class="pip-video"
      autoplay
      muted
      playsinline
    />

    <!-- 占位符 - 当没有视频流时显示 -->
    <div v-else class="pip-placeholder">
      <div class="pip-placeholder-icon">
        <n-icon size="48" color="var(--text-color-3)">
          <VideocamOffOutline />
        </n-icon>
      </div>
      <div class="pip-placeholder-text">{{ t('live.pip.noVideo') }}</div>
    </div>

    <!-- 控制栏 -->
    <div class="pip-controls">
      <div class="pip-info">
        <span class="pip-label">{{ t('live.pip.title') }}</span>
        <span class="pip-room">{{ roomId ? `房间: ${roomId}` : '' }}</span>
      </div>

      <div class="pip-actions">
        <n-button
          size="tiny"
          @click="restoreToFullscreen"
        >
          {{ t('live.pip.restore') }}
        </n-button>

        <n-button
          size="tiny"
          type="error"
          @click="endLive"
        >
          {{ t('live.pip.end') }}
        </n-button>
      </div>
    </div>

    <!-- 拖拽手柄 -->
    <div class="pip-drag-handle" @mousedown="startDrag">
      <n-icon size="16">
        <MenuOutline />
      </n-icon>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { NButton, NIcon } from 'naive-ui'
import { MenuOutline, VideocamOffOutline } from '@vicons/ionicons5'
import { useLivePiPStore } from '@/store'
import { useRouter } from 'vue-router'
import { attachTrackToVideoElement } from '@/views/live/LiveRoom/composables/mediaHelpers'
import { storeToRefs } from 'pinia'

const { t } = useI18n()
const router = useRouter()
const livePiPStore = useLivePiPStore()
const { activeSession } = storeToRefs(livePiPStore)

// Props
interface Props {
  roomId?: string
  isVisible?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  roomId: undefined,
  isVisible: false
})

// Refs
const videoRef = ref<HTMLVideoElement | null>(null)
const isDragging = ref<boolean>(false)
const dragOffset = ref({ x: 0, y: 0 })

// 计算属性
const isVisible = computed(() => {
  const visible = props.isVisible && livePiPStore.isInPiPMode
  console.log('PiP isVisible:', visible, 'props.isVisible:', props.isVisible, 'isInPiPMode:', livePiPStore.isInPiPMode)
  return visible
})
const hasVideoStream = computed(() => {
  const session = activeSession.value
  const hasStream = session && (session.videoStream || (session.connection && session.participantId))
  console.log('PiP hasVideoStream:', hasStream, 'session:', session)
  return hasStream
})

// 方法
/**
 * 恢复到全屏直播
 */
const restoreToFullscreen = (): void => {
  if (props.roomId) {
    // 退出画中画模式
    livePiPStore.exitPiPMode()

    // 导航到直播页面
    router.push(`/live/room/${props.roomId}`)
  }
}

/**
 * 结束直播
 */
const endLive = (): void => {
  // 强制断开直播连接
  livePiPStore.forceDisconnect()

  // 导航到首页
  router.push('/dashboard')
}

/**
 * 开始拖拽
 */
const startDrag = (event: MouseEvent): void => {
  isDragging.value = true
  const pipWindow = videoRef.value?.parentElement
  if (pipWindow) {
    const rect = pipWindow.getBoundingClientRect()
    dragOffset.value = {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    }

    document.addEventListener('mousemove', onDrag)
    document.addEventListener('mouseup', stopDrag)
  }
}

/**
 * 拖拽过程
 */
const onDrag = (event: MouseEvent): void => {
  if (!isDragging.value) return

  const pipWindow = videoRef.value?.parentElement
  if (pipWindow) {
    const newX = event.clientX - dragOffset.value.x
    const newY = event.clientY - dragOffset.value.y

    // 限制在视窗范围内
    const maxX = window.innerWidth - pipWindow.offsetWidth
    const maxY = window.innerHeight - pipWindow.offsetHeight

    pipWindow.style.left = `${Math.max(0, Math.min(newX, maxX))}px`
    pipWindow.style.top = `${Math.max(0, Math.min(newY, maxY))}px`
  }
}

/**
 * 停止拖拽
 */
const stopDrag = (): void => {
  isDragging.value = false
  document.removeEventListener('mousemove', onDrag)
  document.removeEventListener('mouseup', stopDrag)
}

// 生命周期
onMounted(() => {
  // 设置视频源
  nextTick(() => {
    const session = activeSession.value
    if (videoRef.value && session) {
      if (session.videoStream) {
        videoRef.value.srcObject = session.videoStream
      } else if (session.connection && session.participantId) {
        // 尝试从 connection 中找到对应 participant 的 video track 并 attach
        try {
          const room = session.connection as any
          const participantId = session.participantId
          let attached = false

          if (participantId === 'local') {
            const localParticipant: any = room.localParticipant
            const pubs: any[] = []
            if (localParticipant.videoTrackPublications && typeof localParticipant.videoTrackPublications.values === 'function') {
              pubs.push(...Array.from(localParticipant.videoTrackPublications.values()))
            }
            if (typeof localParticipant.getTrackPublications === 'function') {
              const mp = localParticipant.getTrackPublications()
              if (mp && typeof mp.values === 'function') pubs.push(...Array.from(mp.values()))
            }
            if (localParticipant.videoTracks && typeof localParticipant.videoTracks.values === 'function') {
              pubs.push(...Array.from(localParticipant.videoTracks.values()))
            }

            for (const pub of pubs) {
              const track = pub && (pub.track || pub)
              if (!track) continue
              attached = attachTrackToVideoElement(track, videoRef.value)
              if (attached) break
            }
          } else {
            const remoteParticipant = (room.remoteParticipants && room.remoteParticipants.get && room.remoteParticipants.get(participantId)) ||
                                      Array.from(room.remoteParticipants ? room.remoteParticipants.values() : []).find((p: any) => p.identity === participantId)
            if (remoteParticipant) {
              const videoPubs: any[] = Array.from(remoteParticipant.videoTrackPublications?.values?.() ?? [])
              for (const pub of videoPubs) {
                const track = pub && (pub.track || pub)
                if (!track) continue
                attached = attachTrackToVideoElement(track, videoRef.value)
                if (attached) break
              }
            }
          }

          // 注意：在PiP模式下，不应该从DOM中查找视频元素，因为页面已经跳转
          // 如果还未 attach，保持当前状态，等待后续的TrackSubscribed事件或session更新
          if (!attached) {
            console.warn('PiP: 无法从LiveKit连接中获取视频流，等待后续更新')
          }
        } catch (e) {
          // ignore
        }
      }
    }
  })
})

onUnmounted(() => {
  if (isDragging.value) {
    stopDrag()
  }
})

// 监听会话变化
watch(activeSession, (newSession) => {
  if (!videoRef.value || !newSession) return

  if (newSession.videoStream) {
    videoRef.value.srcObject = newSession.videoStream
    return
  }

  if (newSession.connection && newSession.participantId) {
    // ???????videoStream???????
    tryAttachVideoFromConnection(newSession)
  }
}, { immediate: true })

// 尝试从connection实时提取视频
const tryAttachVideoFromConnection = (session: any) => {
  if (!videoRef.value || !session?.connection || !session?.participantId) return

  try {
    const room = session.connection as any
    const participantId = session.participantId
    let attached = false

    if (participantId === 'local') {
      const localParticipant: any = room.localParticipant
      const pubs: any[] = []
      if (localParticipant.videoTrackPublications && typeof localParticipant.videoTrackPublications.values === 'function') {
        pubs.push(...Array.from(localParticipant.videoTrackPublications.values()))
      }
      if (typeof localParticipant.getTrackPublications === 'function') {
        const mp = localParticipant.getTrackPublications()
        if (mp && typeof mp.values === 'function') pubs.push(...Array.from(mp.values()))
      }
      if (localParticipant.videoTracks && typeof localParticipant.videoTracks.values === 'function') {
        pubs.push(...Array.from(localParticipant.videoTracks.values()))
      }

      for (const pub of pubs) {
        const track = pub && (pub.track || pub)
        if (!track) continue
        attached = attachTrackToVideoElement(track, videoRef.value)
        if (attached) break
      }
    } else {
      const remoteParticipant = (room.remoteParticipants && room.remoteParticipants.get && room.remoteParticipants.get(participantId)) ||
                                Array.from(room.remoteParticipants ? room.remoteParticipants.values() : []).find((p: any) => p.identity === participantId)
      if (remoteParticipant) {
        const videoPubs: any[] = Array.from(remoteParticipant.videoTrackPublications?.values?.() ?? [])
        for (const pub of videoPubs) {
          const track = pub && (pub.track || pub)
          if (!track) continue
          attached = attachTrackToVideoElement(track, videoRef.value)
          if (attached) break
        }
      }
    }

    // 注意：在PiP模式下，不应该从DOM中查找视频元素，因为页面已经跳转
    // 如果还未 attach，保持当前状态，等待后续的TrackSubscribed事件或session更新
    if (!attached) {
      console.warn('PiP: 无法从LiveKit连接中实时获取视频流，等待后续更新')
    }
  } catch (e) {
    console.warn('PiP: 实时提取视频失败', e)
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.pip-live-window {
  position: fixed;
  top: 20px;
  right: 20px;
  width: 320px;
  height: 240px;
  background: var(--background-color);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border: 2px solid var(--border-color);
  z-index: 9999;
  overflow: hidden;
  display: flex;
  flex-direction: column;

  .pip-video {
    flex: 1;
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: var(--background-color);
    border-radius: 8px 8px 0 0;
  }

  .pip-placeholder {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background: var(--background-color);
    border-radius: 8px 8px 0 0;
    gap: 12px;

    .pip-placeholder-icon {
      opacity: 0.6;
    }

    .pip-placeholder-text {
      font-size: 12px;
      color: var(--text-color-3);
      text-align: center;
      padding: 0 16px;
    }
  }

  .pip-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 12px;
    background: var(--background-secondary-color);
    border-top: 1px solid var(--border-color);
    gap: 12px;

    .pip-info {
      display: flex;
      flex-direction: column;
      gap: 2px;
      min-width: 0;
      flex: 1;

      .pip-label {
        font-size: 12px;
        font-weight: 500;
        color: var(--text-color);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .pip-room {
        font-size: 10px;
        color: var(--text-color-3);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    .pip-actions {
      display: flex;
      gap: 6px;
      flex-shrink: 0;
    }
  }

  .pip-drag-handle {
    position: absolute;
    top: 8px;
    right: 8px;
    width: 24px;
    height: 24px;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: move;
    color: var(--text-color);
    opacity: 0.7;
    transition: opacity 0.2s ease;

    &:hover {
      opacity: 1;
      background: rgba(0, 0, 0, 0.8);
    }
  }

  &:hover .pip-drag-handle {
    opacity: 0.7;
  }
}

// 响应式调整
@media (max-width: 768px) {
  .pip-live-window {
    width: 280px;
    height: 200px;
    top: 10px;
    right: 10px;
  }
}

@media (max-width: 480px) {
  .pip-live-window {
    width: 240px;
    height: 160px;
  }
}
</style>
