<template>
  <div
      :style="panelStyle"
      class="live2d-teacher-panel"
  >
    <button
        class="teacher-drag-handle"
        type="button"
        @pointerdown="handleDragStart"
    >
      移动
    </button>
    <div class="teacher-stage">
      <div ref="stageRef" class="teacher-canvas"></div>
      <div v-if="loadError" class="teacher-overlay error">
        {{ loadError }}
      </div>
      <div v-else-if="isLoadingModel" class="teacher-overlay">
        正在加载虚拟教师...
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, nextTick, onBeforeUnmount, onMounted, ref, watch} from 'vue'
import type {CSSProperties} from 'vue'
import * as PIXI from 'pixi.js'

declare global {
  interface Window {
    PIXI?: typeof PIXI
    Live2DCubismCore?: unknown
  }
}

const props = withDefaults(defineProps<{
  enabled: boolean
  visible?: boolean
  audioUrl?: string | null
  modelUrl?: string
  cubismCoreUrl?: string
}>(), {
  visible: true,
  audioUrl: null,
  modelUrl: '/teacher/kei_en/kei_basic_free/runtime/kei_basic_free.model3.json',
  cubismCoreUrl: '/teacher/live2dcubismcore.min.js'
})

const emit = defineEmits<{
  ended: []
  error: [message: string]
  ready: []
}>()

const stageRef = ref<HTMLDivElement | null>(null)
const isLoadingModel = ref(false)
const isModelReady = ref(false)
const isSpeaking = ref(false)
const loadError = ref<string | null>(null)
const playbackError = ref<string | null>(null)
const mouthOpenValue = ref(0)
const offsetX = ref(0)
const offsetY = ref(0)

let app: PIXI.Application | null = null
let live2dModel: any | null = null
let audio: HTMLAudioElement | null = null
let audioContext: AudioContext | null = null
let analyser: AnalyserNode | null = null
let sourceNode: MediaElementAudioSourceNode | null = null
let animationFrameId: number | null = null
let fallbackMouthTimer: number | null = null
let dragPointerId: number | null = null
let dragStartX = 0
let dragStartY = 0
let dragOriginX = 0
let dragOriginY = 0
let initPromise: Promise<void> | null = null
let audioRequestToken = 0

const panelStyle = computed<CSSProperties>(() => ({
  transform: `translate(${offsetX.value}px, ${offsetY.value}px)`,
  opacity: props.visible ? 1 : 0,
  visibility: props.visible ? 'visible' : 'hidden',
  pointerEvents: props.visible ? 'auto' as const : 'none' as const
}))

const wait = (ms: number) => new Promise<void>((resolve) => {
  window.setTimeout(resolve, ms)
})

const loadScript = (src: string) => {
  return new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`)
    if (existing) {
      if (existing.dataset.loaded === 'true') {
        resolve()
        return
      }
      existing.addEventListener('load', () => resolve(), {once: true})
      existing.addEventListener('error', () => reject(new Error(`无法加载 ${src}`)), {once: true})
      return
    }

    const script = document.createElement('script')
    script.src = src
    script.async = true
    script.dataset.loaded = 'false'
    script.onload = () => {
      script.dataset.loaded = 'true'
      resolve()
    }
    script.onerror = () => reject(new Error(`无法加载 ${src}`))
    document.head.appendChild(script)
  })
}

const getLoadErrorMessage = (error: unknown) => {
  if (error instanceof Error && error.message) {
    return error.message
  }
  if (typeof error === 'string' && error) {
    return error
  }
  return '虚拟教师加载失败'
}

const resizeModel = () => {
  if (!stageRef.value || !live2dModel) return

  const width = stageRef.value.clientWidth
  const height = stageRef.value.clientHeight
  if (!width || !height) return

  live2dModel.scale.set(1)
  const bounds = live2dModel.getLocalBounds?.()
  const modelWidth = Number.isFinite(bounds?.width) && bounds.width > 0 ? bounds.width : live2dModel.width
  const modelHeight = Number.isFinite(bounds?.height) && bounds.height > 0 ? bounds.height : live2dModel.height
  if (!Number.isFinite(modelWidth) || !Number.isFinite(modelHeight) || modelWidth <= 0 || modelHeight <= 0) {
    loadError.value = 'Live2D model size is invalid'
    return
  }

  const scale = Math.min(width / modelWidth * 0.92, height / modelHeight * 0.92)
  const modelX = Number.isFinite(bounds?.x) ? bounds.x : 0
  const modelY = Number.isFinite(bounds?.y) ? bounds.y : 0
  live2dModel.pivot?.set?.(modelX + modelWidth / 2, modelY + modelHeight / 2)
  live2dModel.scale.set(scale)
  live2dModel.position.set(width / 2, height / 2)
  live2dModel.visible = true
}

const applyMouthOpen = (value: number) => {
  mouthOpenValue.value = Math.max(0, Math.min(1, value))
}

const attachMouthDriver = (model: any) => {
  const internalModel = model.internalModel as any
  internalModel?.on?.('beforeModelUpdate', () => {
    const coreModel = internalModel?.coreModel
    if (coreModel?.setParameterValueById) {
      coreModel.setParameterValueById('ParamMouthOpenY', mouthOpenValue.value)
    }
  })
}

const patchCubismCore6RenderOrder = (model: any) => {
  const coreModel = model.internalModel?.coreModel
  const nativeModel = coreModel?.getModel?.()
  if (!coreModel || !nativeModel?.renderOrders || nativeModel?.drawables?.renderOrders) return

  coreModel.getDrawableRenderOrders = () => nativeModel.renderOrders
}

const handleDragMove = (event: PointerEvent) => {
  if (dragPointerId !== event.pointerId) return
  offsetX.value = dragOriginX + event.clientX - dragStartX
  offsetY.value = dragOriginY + event.clientY - dragStartY
}

const handleDragEnd = (event: PointerEvent) => {
  if (dragPointerId !== event.pointerId) return
  const currentTarget = event.currentTarget as HTMLElement | null
  currentTarget?.releasePointerCapture?.(event.pointerId)
  dragPointerId = null
  window.removeEventListener('pointermove', handleDragMove)
  window.removeEventListener('pointerup', handleDragEnd)
  window.removeEventListener('pointercancel', handleDragEnd)
}

const handleDragStart = (event: PointerEvent) => {
  if (event.button !== 0) return
  dragPointerId = event.pointerId
  dragStartX = event.clientX
  dragStartY = event.clientY
  dragOriginX = offsetX.value
  dragOriginY = offsetY.value
  const currentTarget = event.currentTarget as HTMLElement | null
  currentTarget?.setPointerCapture?.(event.pointerId)
  window.addEventListener('pointermove', handleDragMove)
  window.addEventListener('pointerup', handleDragEnd)
  window.addEventListener('pointercancel', handleDragEnd)
}

const initLive2D = async () => {
  if (app && live2dModel && !loadError.value) {
    isModelReady.value = true
    return
  }
  if (initPromise) {
    return initPromise
  }

  initPromise = (async () => {
    isLoadingModel.value = true
    isModelReady.value = false
    loadError.value = null

    try {
      await nextTick()
      if (!stageRef.value) return

      window.PIXI = PIXI
      if (!window.Live2DCubismCore) {
        await loadScript(props.cubismCoreUrl)
      }
      if (!window.Live2DCubismCore) {
        throw new Error('缺少 live2dcubismcore.min.js')
      }

      app = new PIXI.Application({
        resizeTo: stageRef.value,
        backgroundAlpha: 0,
        antialias: true,
        autoStart: true
      })
      stageRef.value.appendChild(app.view as HTMLCanvasElement)

      const {Live2DModel} = await import('pixi-live2d-display/cubism4')
      live2dModel = await Live2DModel.from(props.modelUrl, {
        autoInteract: true,
        autoUpdate: true
      })
      patchCubismCore6RenderOrder(live2dModel)
      attachMouthDriver(live2dModel)
      live2dModel.visible = false
      app.stage.addChild(live2dModel)
      resizeModel()
      window.requestAnimationFrame(resizeModel)
      window.setTimeout(resizeModel, 250)
      window.addEventListener('resize', resizeModel)
      await wait(180)

      if (!loadError.value && live2dModel) {
        isModelReady.value = true
        emit('ready')
      }
    } catch (error) {
      loadError.value = getLoadErrorMessage(error)
      isModelReady.value = false
      emit('error', loadError.value)
    } finally {
      isLoadingModel.value = false
      initPromise = null
    }
  })()

  return initPromise
}

const stopMouthAnimation = () => {
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
    animationFrameId = null
  }
  if (fallbackMouthTimer !== null) {
    window.clearInterval(fallbackMouthTimer)
    fallbackMouthTimer = null
  }
  applyMouthOpen(0)
}

const startAnalyserMouthAnimation = () => {
  if (!analyser) {
    startFallbackMouthAnimation()
    return
  }

  const dataArray = new Uint8Array(analyser.fftSize)
  const tick = () => {
    if (!isSpeaking.value || !analyser) {
      stopMouthAnimation()
      return
    }

    analyser.getByteTimeDomainData(dataArray)
    let sum = 0
    for (let i = 0; i < dataArray.length; i++) {
      const normalized = (dataArray[i] - 128) / 128
      sum += normalized * normalized
    }
    const rms = Math.sqrt(sum / dataArray.length)
    applyMouthOpen(Math.min(1, rms * 5.5))
    animationFrameId = requestAnimationFrame(tick)
  }
  tick()
}

const startFallbackMouthAnimation = () => {
  if (fallbackMouthTimer !== null) return
  fallbackMouthTimer = window.setInterval(() => {
    if (!isSpeaking.value) {
      stopMouthAnimation()
      return
    }
    applyMouthOpen(0.2 + Math.random() * 0.65)
  }, 90)
}

const cleanupAudio = () => {
  stopMouthAnimation()
  if (audio) {
    audio.pause()
    audio.removeAttribute('src')
    audio.load()
    audio = null
  }
  sourceNode?.disconnect()
  sourceNode = null
  analyser?.disconnect()
  analyser = null
  if (audioContext && audioContext.state !== 'closed') {
    audioContext.close()
  }
  audioContext = null
  isSpeaking.value = false
}

const playAudio = async (url: string) => {
  cleanupAudio()
  playbackError.value = null

  const nextAudio = new Audio()
  nextAudio.crossOrigin = 'anonymous'
  nextAudio.preload = 'auto'
  nextAudio.addEventListener('ended', () => {
    cleanupAudio()
    emit('ended')
  }, {once: true})
  nextAudio.addEventListener('error', () => {
    const errorMessage = '浏览器阻止自动播放，请重新点击虚拟教师'
    playbackError.value = errorMessage
    cleanupAudio()
    emit('error', errorMessage)
  }, {once: true})
  nextAudio.src = url

  audio = nextAudio

  try {
    await nextAudio.play()
    isSpeaking.value = true
  } catch (error) {
    const errorMessage = '浏览器阻止自动播放，请重新点击虚拟教师'
    playbackError.value = errorMessage
    cleanupAudio()
    emit('error', errorMessage)
    return
  }

  try {
    audioContext = new AudioContext()
    analyser = audioContext.createAnalyser()
    analyser.fftSize = 512
    sourceNode = audioContext.createMediaElementSource(nextAudio)
    sourceNode.connect(analyser)
    analyser.connect(audioContext.destination)
    await audioContext.resume()
  } catch (error) {
    analyser = null
  }

  startAnalyserMouthAnimation()
}

const destroyLive2D = () => {
  audioRequestToken += 1
  initPromise = null
  isModelReady.value = false
  if (dragPointerId !== null) {
    dragPointerId = null
    window.removeEventListener('pointermove', handleDragMove)
    window.removeEventListener('pointerup', handleDragEnd)
    window.removeEventListener('pointercancel', handleDragEnd)
  }
  cleanupAudio()
  window.removeEventListener('resize', resizeModel)
  if (live2dModel) {
    live2dModel.destroy()
    live2dModel = null
  }
  if (app) {
    app.destroy(true, {children: true, texture: false, baseTexture: false})
    app = null
  }
  if (stageRef.value) {
    stageRef.value.innerHTML = ''
  }
}

watch(() => props.enabled, (enabled) => {
  if (enabled) {
    initLive2D()
  } else {
    destroyLive2D()
  }
}, {immediate: true, flush: 'post'})

onMounted(() => {
  if (props.enabled) {
    initLive2D()
  }
})

watch(() => props.audioUrl, (audioUrl) => {
  if (!props.enabled || !audioUrl) return

  const currentToken = ++audioRequestToken
  ;(async () => {
    await initLive2D()
    if (!props.enabled || !audioUrl || currentToken !== audioRequestToken) return
    if (props.audioUrl !== audioUrl || !isModelReady.value || !live2dModel || loadError.value) return
    await playAudio(audioUrl)
  })()
}, {immediate: true})

onBeforeUnmount(() => {
  destroyLive2D()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles' as *;

.live2d-teacher-panel {
  --teacher-panel-highlight: color-mix(in srgb, var(--warning-color-light) 22%, transparent);
  --teacher-panel-surface-start: color-mix(in srgb, var(--background-color) 18%, var(--text-color) 82%);
  --teacher-panel-surface-end: color-mix(in srgb, var(--background-color) 28%, var(--text-color) 72%);
  --teacher-panel-border-color: color-mix(in srgb, var(--text-color) 16%, transparent);
  --teacher-panel-shadow-color: color-mix(in srgb, var(--shadow-color) 72%, transparent);
  --teacher-handle-border-color: color-mix(in srgb, var(--text-color) 18%, transparent);
  --teacher-handle-bg: color-mix(in srgb, var(--background-color) 18%, var(--text-color) 82%);
  --teacher-handle-text-color: color-mix(in srgb, var(--background-color) 8%, var(--text-color) 92%);
  --teacher-overlay-text-color: color-mix(in srgb, var(--background-color) 16%, var(--text-color) 84%);
  --teacher-overlay-bg: color-mix(in srgb, var(--background-color) 42%, var(--text-color) 58%);
  --teacher-overlay-error-color: color-mix(in srgb, var(--error-color) 78%, var(--background-color));
  position: relative;
  width: 280px;
  height: 326px;
  border-radius: 24px;
  overflow: hidden;
  background:
      radial-gradient(circle at 50% 16%, var(--teacher-panel-highlight), transparent 34%),
      linear-gradient(155deg, var(--teacher-panel-surface-start), var(--teacher-panel-surface-end));
  border: 1px solid var(--teacher-panel-border-color);
  box-shadow: 0 24px 80px var(--teacher-panel-shadow-color);
  backdrop-filter: blur(18px);
  display: flex;
  flex-direction: column;
  pointer-events: auto;
}

.teacher-drag-handle {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 3;
  min-width: 52px;
  height: 28px;
  padding: 0 10px;
  border: 1px solid var(--teacher-handle-border-color);
  border-radius: 8px;
  background: var(--teacher-handle-bg);
  color: var(--teacher-handle-text-color);
  font-size: 12px;
  line-height: 1;
  cursor: grab;
  user-select: none;
  touch-action: none;

  &:active {
    cursor: grabbing;
  }
}

.teacher-stage {
  position: relative;
  flex: 1;
  min-height: 0;
}

.teacher-canvas {
  position: absolute;
  inset: 0;

  :deep(canvas) {
    display: block;
    width: 100%;
    height: 100%;
  }
}

.teacher-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  text-align: center;
  color: var(--teacher-overlay-text-color);
  font-size: 13px;
  line-height: 1.7;
  background: var(--teacher-overlay-bg);

  &.error {
    color: var(--teacher-overlay-error-color);
  }
}
</style>



