<template>
  <div
    v-if="videoTrack"
    class="camera-floating-window"
    :class="{ 'is-editing': isEditing }"
    :style="containerStyle"
    @mouseenter="isHovered = true"
    @mouseleave="isHovered = false"
  >
    <!-- 视频元素 -->
    <video
      ref="videoRef"
      autoplay
      muted
      playsinline
      class="floating-video"
    />

    <!-- 悬浮时的控制栏 -->
    <transition name="fade">
      <div v-if="isHovered || isEditing" class="floating-controls">
        <!-- 编辑模式：显示调整大小手柄 -->
        <div v-if="isEditing" class="resize-handle resize-handle-se" @pointerdown="startResize">
          <n-icon :component="ResizeOutline" />
        </div>

        <!-- 切换编辑按钮 -->
        <n-button
          quaternary
          size="tiny"
          class="edit-btn"
          @click="toggleEdit"
        >
          <template #icon>
            <n-icon :component="isEditing ? CheckmarkOutline : SettingsOutline" />
          </template>
        </n-button>
      </div>
    </transition>

    <!-- 拖拽手柄（编辑模式下显示） -->
    <div
      v-if="isEditing"
      class="drag-handle"
      @pointerdown="startDrag"
    >
      <n-icon :component="MoveOutline" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { NButton, NIcon } from 'naive-ui'
import { SettingsOutline, CheckmarkOutline, MoveOutline, ResizeOutline } from '@vicons/ionicons5'

interface Props {
  videoTrack?: any | null
  initialPosition?: { x: number; y: number }
  initialSize?: { width: number; height: number }
  containerSelector?: string
}

const props = withDefaults(defineProps<Props>(), {
  initialPosition: () => ({ x: 20, y: 20 }),
  initialSize: () => ({ width: 180, height: 135 }),
  containerSelector: '.video-panel'
})

interface Emits {
  (e: 'update:position', position: { x: number; y: number }): void
  (e: 'update:size', size: { width: number; height: number }): void
}

const emit = defineEmits<Emits>()

const videoRef = ref<HTMLVideoElement | null>(null)
const isHovered = ref(false)
const isEditing = ref(false)
const isDragging = ref(false)
const isResizing = ref(false)

// 位置和大小状态
const position = ref({ ...props.initialPosition })
const size = ref({ ...props.initialSize })

// 拖拽/调整的起始状态
const dragStart = ref({ x: 0, y: 0 })
const resizeStart = ref({ width: 0, height: 0, x: 0, y: 0 })

// 容器边界
const containerBounds = ref({ width: 0, height: 0 })

// 计算样式
const containerStyle = computed(() => ({
  left: `${position.value.x}px`,
  bottom: `${position.value.y}px`,
  width: `${size.value.width}px`,
  height: `${size.value.height}px`
}))

const attachTrackToVideo = (track: any) => {
  if (!videoRef.value || !track) return

  if (typeof track.attach === 'function') {
    track.attach(videoRef.value)
    videoRef.value.play?.().catch(() => undefined)
    return
  }

  const mediaStreamTrack = track?.mediaStreamTrack || track?._mediaStreamTrack || null
  if (mediaStreamTrack instanceof MediaStreamTrack) {
    videoRef.value.srcObject = new MediaStream([mediaStreamTrack])
    videoRef.value.play?.().catch(() => undefined)
    return
  }

  if (track instanceof MediaStream) {
    videoRef.value.srcObject = track
    videoRef.value.play?.().catch(() => undefined)
    return
  }

  if (typeof track.kind === 'string') {
    videoRef.value.srcObject = new MediaStream([track])
    videoRef.value.play?.().catch(() => undefined)
  }
}

const detachTrackFromVideo = (track: any) => {
  if (!videoRef.value || !track) return
  if (typeof track.detach === 'function') {
    track.detach(videoRef.value)
  }
  videoRef.value.srcObject = null
}

// 获取容器边界
const updateContainerBounds = () => {
  const container = document.querySelector(props.containerSelector)
  if (container) {
    const rect = container.getBoundingClientRect()
    containerBounds.value = { width: rect.width, height: rect.height }
  }
}

// 切换编辑模式
const toggleEdit = () => {
  isEditing.value = !isEditing.value
  if (!isEditing.value) {
    // 退出编辑模式时保存状态
    saveState()
  }
}

// 开始拖拽
const startDrag = (e: PointerEvent) => {
  if (isResizing.value) return
  e.preventDefault()
  updateContainerBounds()
  const container = document.querySelector(props.containerSelector)
  const rect = container?.getBoundingClientRect()
  if (!rect) return

  const localX = e.clientX - rect.left
  const localY = e.clientY - rect.top
  const currentTop = containerBounds.value.height - position.value.y - size.value.height

  isDragging.value = true
  dragStart.value = {
    x: localX - position.value.x,
    y: localY - currentTop
  }

  document.addEventListener('pointermove', onDrag)
  document.addEventListener('pointerup', stopDrag)
  document.addEventListener('pointercancel', stopDrag)
}

// 拖拽中
const onDrag = (e: PointerEvent) => {
  if (!isDragging.value) return

  updateContainerBounds()
  const container = document.querySelector(props.containerSelector)
  const rect = container?.getBoundingClientRect()
  if (!rect) return

  const localX = e.clientX - rect.left
  const localY = e.clientY - rect.top
  const maxLeft = containerBounds.value.width - size.value.width - 20
  const maxTop = containerBounds.value.height - size.value.height - 20

  const newLeft = Math.max(0, Math.min(localX - dragStart.value.x, maxLeft))
  const newTop = Math.max(0, Math.min(localY - dragStart.value.y, maxTop))
  const newBottom = containerBounds.value.height - newTop - size.value.height

  position.value = { x: newLeft, y: Math.max(0, newBottom) }
}

// 停止拖拽
const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('pointermove', onDrag)
  document.removeEventListener('pointerup', stopDrag)
  document.removeEventListener('pointercancel', stopDrag)
  saveState()
}

// 开始调整大小
const startResize = (e: PointerEvent) => {
  e.preventDefault()
  e.stopPropagation()
  updateContainerBounds()
  isResizing.value = true
  resizeStart.value = {
    width: size.value.width,
    height: size.value.height,
    x: e.clientX,
    y: e.clientY
  }

  document.addEventListener('pointermove', onResize)
  document.addEventListener('pointerup', stopResize)
  document.addEventListener('pointercancel', stopResize)
}

// 调整大小中
const onResize = (e: PointerEvent) => {
  if (!isResizing.value) return

  const deltaX = e.clientX - resizeStart.value.x
  const deltaY = e.clientY - resizeStart.value.y

  const newWidth = Math.max(120, Math.min(resizeStart.value.width + deltaX, containerBounds.value.width - position.value.x - 20))
  const newHeight = Math.max(90, Math.min(resizeStart.value.height + deltaY, containerBounds.value.height - position.value.y - 20))

  size.value = { width: newWidth, height: newHeight }
}

// 停止调整大小
const stopResize = () => {
  isResizing.value = false
  document.removeEventListener('pointermove', onResize)
  document.removeEventListener('pointerup', stopResize)
  document.removeEventListener('pointercancel', stopResize)
  saveState()
}

// 保存状态到 sessionStorage
const saveState = () => {
  emit('update:position', position.value)
  emit('update:size', size.value)

  try {
    sessionStorage.setItem('cameraFloatingWindow', JSON.stringify({
      position: position.value,
      size: size.value
    }))
  } catch (e) {
    // ignore
  }
}

// 从 sessionStorage 加载状态
const loadState = () => {
  try {
    const saved = sessionStorage.getItem('cameraFloatingWindow')
    if (saved) {
      const state = JSON.parse(saved)
      position.value = state.position || position.value
      size.value = state.size || size.value
    }
  } catch (e) {
    // ignore
  }
}

// 监听视频轨道变化，附加到 video 元素
watch(
  () => props.videoTrack,
  (track, prevTrack) => {
    if (prevTrack && prevTrack !== track) {
      detachTrackFromVideo(prevTrack)
    }
    if (track) {
      attachTrackToVideo(track)
    } else if (videoRef.value) {
      videoRef.value.srcObject = null
    }
  },
  { immediate: true }
)

watch(
  () => videoRef.value,
  (el) => {
    if (!el) return
    if (props.videoTrack) {
      attachTrackToVideo(props.videoTrack)
    }
  },
  { immediate: true }
)

// 窗口大小变化时更新边界
onMounted(() => {
  loadState()
  nextTick(() => {
    updateContainerBounds()
    if (props.videoTrack) {
      attachTrackToVideo(props.videoTrack)
    }
  })
  window.addEventListener('resize', updateContainerBounds)
})

onUnmounted(() => {
  detachTrackFromVideo(props.videoTrack)
  window.removeEventListener('resize', updateContainerBounds)
})
</script>

<style lang="scss" scoped>
.camera-floating-window {
  position: absolute;
  z-index: 100;
  background: #000;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 6px 16px rgba(0, 0, 0, 0.5);
  }

  &.is-editing {
    box-shadow: 0 0 0 2px #18a058;
  }

  .floating-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .floating-controls {
    position: absolute;
    top: 4px;
    right: 4px;
    display: flex;
    align-items: center;
    gap: 4px;
    z-index: 10;
  }

  .edit-btn {
    background: rgba(0, 0, 0, 0.5);
    color: #fff;

    &:hover {
      background: rgba(0, 0, 0, 0.7);
    }
  }

  .resize-handle {
    position: absolute;
    bottom: 0;
    right: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(24, 160, 88, 0.8);
    color: #fff;
    cursor: se-resize;
    border-top-left-radius: 4px;

    &:hover {
      background: rgba(24, 160, 88, 1);
    }
  }

  .drag-handle {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 24px;
    background: rgba(24, 160, 88, 0.6);
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: move;
    opacity: 0;
    transition: opacity 0.2s;

    .is-editing & {
      opacity: 1;
    }
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
