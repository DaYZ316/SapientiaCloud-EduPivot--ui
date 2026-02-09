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
    <div v-if="!hasVideoStream" class="pip-placeholder">
      <div class="pip-placeholder-icon">
        <n-icon size="48" color="var(--text-color-3)">
          <VideocamOffOutline />
        </n-icon>
      </div>
      <div class="pip-placeholder-text">{{ t('live.pip.noVideo') }}</div>
      <!-- 重试按钮 -->
      <n-button v-if="retryCount < 3" size="small" @click="retryAttachVideo">
        {{ t('live.pip.retry') }} ({{ 3 - retryCount }})
      </n-button>
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
import { useSpeakingDetectorStore } from '@/stores/speakingDetector'

const { t } = useI18n()
const router = useRouter()
const livePiPStore = useLivePiPStore()

// 直接从 store 获取，确保获取最新值
const getActiveSession = (): any => {
  return (livePiPStore as any).activeSession
}

const getIsInPiPMode = (): boolean => {
  return (livePiPStore as any).isInPiPMode || false
}

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
const retryCount = ref<number>(0)

// 计算属性
const isVisible = computed(() => {
  const visible = props.isVisible && getIsInPiPMode()
  console.log('PiP isVisible:', visible, 'props.isVisible:', props.isVisible, 'isInPiPMode:', getIsInPiPMode())
  return visible
})
const hasVideoStream = computed(() => {
  const session = getActiveSession()
  const hasStream = session && (session.videoStream || (session.connection && session.participantId))
  console.log('PiP hasVideoStream:', hasStream, 'session:', session)
  return hasStream
})

// 重试绑定视频
const retryAttachVideo = (): void => {
  if (retryCount.value >= 3) {
    return
  }
  retryCount.value++
  console.log(`PiP: 重试绑定视频 (${retryCount.value}/3)`)
  // 触发一次 attach
  tryAttachVideo()
}

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

// 尝试从 session 中绑定视频到 video 元素
const tryAttachVideo = (): void => {
  console.log('PiP: tryAttachVideo 被调用')
  console.log('PiP: videoRef:', !!videoRef.value)
  console.log('PiP: hasVideoStream:', hasVideoStream.value)
  
  const session = getActiveSession()
  console.log('PiP: activeSession:', session)
  console.log('PiP: isInPiPMode:', getIsInPiPMode())

  // 如果没有活跃会话，无需绑定
  if (!session) {
    console.log('PiP: 没有活跃会话，跳过绑定')
    return
  }

  // 如果 videoRef 还没准备好，等待下一帧
  if (!videoRef.value) {
    console.log('PiP: videoRef 未准备好，等待后重试')
    nextTick(() => {
      if (videoRef.value) {
        doAttachVideo()
      }
    })
    return
  }

  doAttachVideo()
}

// 实际执行视频绑定
const doAttachVideo = (): void => {
  const session = getActiveSession()
  if (!session || !videoRef.value) {
    console.log('PiP: 无法绑定视频，session 或 videoRef 为 null')
    return
  }

  console.log('PiP: 开始绑定视频')

  // 优先使用已保存的视频流
  if (session.videoStream) {
    console.log('PiP: 使用已保存的视频流')
    try {
      videoRef.value.srcObject = session.videoStream
      videoRef.value.muted = true
      videoRef.value.play().catch(() => {})
      console.log('PiP: 视频流绑定成功')
      return
    } catch (e) {
      console.warn('PiP: 设置视频流失败', e)
    }
  }

  // 如果没有视频流，尝试从 connection 中获取
  if (session.connection && session.participantId) {
    console.log('PiP: 尝试从 connection 获取视频流')
    try {
      const room = session.connection as any
      const participantId = session.participantId
      let attached = false

      if (participantId === 'local') {
        const localParticipant: any = room.localParticipant
        const pubs: any[] = []
        if (localParticipant?.videoTrackPublications && typeof localParticipant.videoTrackPublications.values === 'function') {
          pubs.push(...Array.from(localParticipant.videoTrackPublications.values()))
        }
        if (typeof localParticipant?.getTrackPublications === 'function') {
          const mp = localParticipant.getTrackPublications()
          if (mp && typeof mp.values === 'function') pubs.push(...Array.from(mp.values()))
        }
        if (localParticipant?.videoTracks && typeof localParticipant.videoTracks.values === 'function') {
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

      if (attached) {
        console.log('PiP: 成功从 connection 获取并绑定视频流')
      } else {
        console.warn('PiP: 无法从 connection 获取视频流')
      }
    } catch (e) {
      console.warn('PiP: 从 connection 获取视频流失败', e)
    }
  }
}

// 生命周期
// 使用全局 detector store，确保直播间页面和悬浮窗共享同一个 detector 实例
const speakingDetectorStore = useSpeakingDetectorStore()

onMounted(() => {
  console.log('PiP: 组件挂载')
  // 延迟执行，确保 DOM 就绪
  nextTick(() => {
    tryAttachVideo()

    // 连接说话检测器（如果存在活跃的 session）
    const session = getActiveSession()
    if (session?.connection) {
      console.log('PiP: 连接说话检测器')
      speakingDetectorStore.connect(session.connection)
    }
  })
})

onUnmounted(() => {
  if (isDragging.value) {
    stopDrag()
  }

  // 断开说话检测器（只断开检测，不清空 store，保留给 Classroom3D 使用）
  console.log('PiP: 断开说话检测器')
  speakingDetectorStore.disconnect()
})

// 监听 hasVideoStream 变化，尝试绑定视频
watch(hasVideoStream, (newVal) => {
  console.log('PiP: hasVideoStream 变化:', newVal)
  if (newVal) {
    nextTick(() => {
      tryAttachVideo()
    })
  }
}, { immediate: true })

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
