<template>
  <div class="live2d-teacher-panel">
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
import {nextTick, onBeforeUnmount, ref, watch} from 'vue'
import * as PIXI from 'pixi.js'

declare global {
  interface Window {
    PIXI?: typeof PIXI
    Live2DCubismCore?: unknown
  }
}

const props = withDefaults(defineProps<{
  enabled: boolean
  audioUrl?: string | null
  modelUrl?: string
  cubismCoreUrl?: string
}>(), {
  audioUrl: null,
  modelUrl: '/teacher/kei_en/kei_vowels_pro/runtime/kei_vowels_pro.model3.json',
  cubismCoreUrl: '/teacher/live2dcubismcore.min.js'
})

const emit = defineEmits<{
  ended: []
  error: [message: string]
}>()

const stageRef = ref<HTMLDivElement | null>(null)
const isLoadingModel = ref(false)
const isSpeaking = ref(false)
const loadError = ref<string | null>(null)
const playbackError = ref<string | null>(null)
const mouthOpenValue = ref(0)

let app: PIXI.Application | null = null
let live2dModel: any | null = null
let audio: HTMLAudioElement | null = null
let audioContext: AudioContext | null = null
let analyser: AnalyserNode | null = null
let sourceNode: MediaElementAudioSourceNode | null = null
let animationFrameId: number | null = null
let fallbackMouthTimer: number | null = null

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
    return
  }

  const scale = Math.min(width / modelWidth * 0.92, height / modelHeight * 0.92)
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

const initLive2D = async () => {
  if (!stageRef.value || app || isLoadingModel.value) return

  isLoadingModel.value = true
  loadError.value = null

  try {
    window.PIXI = PIXI
    if (!window.Live2DCubismCore) {
      await loadScript(props.cubismCoreUrl)
    }
    if (!window.Live2DCubismCore) {
      throw new Error('缺少 live2dcubismcore.min.js')
    }

    await nextTick()
    if (!stageRef.value) return

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
    attachMouthDriver(live2dModel)
    live2dModel.anchor.set(0.5, 0.5)
    live2dModel.visible = false
    app.stage.addChild(live2dModel)
    resizeModel()
    window.requestAnimationFrame(resizeModel)
    window.setTimeout(resizeModel, 250)
    window.addEventListener('resize', resizeModel)
  } catch (error) {
    loadError.value = error instanceof Error
        ? error.message
        : 'Live2D 模型加载失败'
  } finally {
    isLoadingModel.value = false
  }
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
    const errorMessage = '语音播放失败'
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
}, {immediate: true})

watch(() => props.audioUrl, (audioUrl) => {
  if (!props.enabled || !audioUrl) return
  playAudio(audioUrl)
}, {immediate: true})

onBeforeUnmount(() => {
  destroyLive2D()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles' as *;

.live2d-teacher-panel {
  width: 280px;
  height: 326px;
  border-radius: 24px;
  overflow: hidden;
  background:
      radial-gradient(circle at 50% 16%, rgba(255, 213, 128, 0.22), transparent 34%),
      linear-gradient(155deg, rgba(16, 22, 34, 0.92), rgba(28, 39, 58, 0.88));
  border: 1px solid rgba(255, 255, 255, 0.16);
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.28);
  backdrop-filter: blur(18px);
  display: flex;
  flex-direction: column;
  pointer-events: auto;
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
  color: rgba(255, 255, 255, 0.84);
  font-size: 13px;
  line-height: 1.7;
  background: rgba(12, 17, 26, 0.42);

  &.error {
    color: #ffd4d4;
  }
}
</style>
