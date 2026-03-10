<template>
  <div
      class="absolute inset-0 w-full h-full overflow-hidden cursor-pointer"
      @click="handleClick"
  >


    <!-- Canvas Container -->
    <div ref="canvasContainer" class="absolute inset-0 w-full h-full"></div>
  </div>
</template>

<script lang="ts" setup>
import {computed, onBeforeUnmount, onMounted, ref} from 'vue'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js'
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer.js'
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass.js'
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass.js'

const canvasContainer = ref<HTMLElement | null>(null)

// 速度控制
const speedMultiplier = ref(1)
const MAX_SPEED_MULTIPLIER = 15
const SPEED_INCREMENT = 1.5
const OVERLOAD_THRESHOLD = 12
const isIncreasing = ref(true) // 方向标志：true为递增，false为递减

// 计算是否处于超载状态
const isOverloaded = computed(() => speedMultiplier.value >= OVERLOAD_THRESHOLD)

// 静态配置常量
const CONFIG = {
  baseSpeed: 0.5,
  bloomStrength: 1.5,
  colors: {
    core: 0x00ffff,
    innerRing: 0xffd700,
    outerRing: 0x4488ff,
  }
}

// 统一控制正交相机的可视范围尺寸
const FRUSTUM_SIZE = 20

let scene: THREE.Scene | null = null
let camera: THREE.OrthographicCamera | THREE.PerspectiveCamera | null = null
let renderer: THREE.WebGLRenderer | null = null
let controls: OrbitControls | null = null
let composer: EffectComposer | null = null
let bloomPass: UnrealBloomPass | null = null
let pivotGroup: THREE.Group | null = null
let rings: Array<{ mesh: THREE.Mesh; speed: { x: number; y: number; z: number } }> = []
let innerCore: THREE.Mesh | null = null
let coreMesh: THREE.Mesh | null = null
let coreLight: THREE.PointLight | null = null
let animationId: number | null = null
let clock: THREE.Clock | null = null
let resizeObserver: ResizeObserver | null = null

const initScene = () => {
  if (!canvasContainer.value) return

  // 初始化场景
  scene = new THREE.Scene()
  scene.background = null // 设置场景背景为透明

  // 获取容器实际尺寸，如果为0则使用默认值
  let width = canvasContainer.value.clientWidth || 800
  let height = canvasContainer.value.clientHeight || 600

  // 使用正交相机，保证画面比例在不同分辨率下更加统一
  const aspect = width / height
  camera = new THREE.OrthographicCamera(
      (-FRUSTUM_SIZE * aspect) / 2,
      (FRUSTUM_SIZE * aspect) / 2,
      FRUSTUM_SIZE / 2,
      -FRUSTUM_SIZE / 2,
      0.1,
      1000
  )
  camera.position.set(0, 0, 15)
  camera.lookAt(0, 0, 0)

  renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance'
  })
  renderer.setSize(width, height)
  renderer.setClearColor(0x000000, 0) // 设置清除色为透明
  // 限制像素比以提升性能
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.toneMapping = THREE.ReinhardToneMapping
  renderer.shadowMap.enabled = false // 禁用阴影以提升性能
  canvasContainer.value.appendChild(renderer.domElement)

  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  // 关闭视角自动旋转，保持相机固定
  controls.autoRotate = false
  controls.autoRotateSpeed = 0
  // 禁用所有鼠标交互
  controls.enableRotate = false
  controls.enableZoom = false
  controls.enablePan = false

  // 后期处理
  const renderScene = new RenderPass(scene, camera)
  bloomPass = new UnrealBloomPass(
      new THREE.Vector2(width, height),
      1.5,
      0.4,
      0.85
  )
  bloomPass.threshold = 0
  bloomPass.strength = CONFIG.bloomStrength
  bloomPass.radius = 0.5

  composer = new EffectComposer(renderer)
  composer.addPass(renderScene as any)
  composer.addPass(bloomPass as any)

  // 创建天枢结构（保持在场景中心）
  pivotGroup = new THREE.Group()
  pivotGroup.position.set(0, 0, 0)
  scene.add(pivotGroup)

  // 1. 核心能量球
  const coreGeo = new THREE.IcosahedronGeometry(1.5, 4)
  const coreMat = new THREE.MeshBasicMaterial({
    color: CONFIG.colors.core,
    wireframe: true,
    transparent: true,
    opacity: 0.3
  })
  coreMesh = new THREE.Mesh(coreGeo, coreMat)
  pivotGroup.add(coreMesh)

  // 内部实心高亮球
  const innerCoreGeo = new THREE.SphereGeometry(0.8, 32, 32)
  const innerCoreMat = new THREE.MeshBasicMaterial({color: 0xffffff})
  innerCore = new THREE.Mesh(innerCoreGeo, innerCoreMat)
  pivotGroup.add(innerCore)

  // 2. 光照与旋转环
  // 为金属材质提供基础光照
  const ambientLight = new THREE.AmbientLight(0x404040, 1.2)
  scene.add(ambientLight)

  coreLight = new THREE.PointLight(CONFIG.colors.core, 3.2, 60)
  coreLight.position.set(0, 0, 5)
  pivotGroup.add(coreLight)

  function createRing(
      radius: number,
      tube: number,
      color: number,
      speedX: number,
      speedY: number,
      speedZ: number
  ) {
    const geometry = new THREE.TorusGeometry(radius, tube, 16, 100)
    // 参照最外层光能环，将内部环也改为光能体风格
    const material = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: 0.22,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending
    })
    const mesh = new THREE.Mesh(geometry, material)

    mesh.rotation.set(
        Math.random() * Math.PI,
        Math.random() * Math.PI,
        Math.random() * Math.PI
    )
    pivotGroup!.add(mesh)

    return {
      mesh: mesh,
      speed: {x: speedX, y: speedY, z: speedZ}
    }
  }

  // 金色主环（彼此间距拉大）
  rings.push(createRing(2.8, 0.05, CONFIG.colors.innerRing, 0.02, 0.05, 0))
  rings.push(createRing(3.8, 0.02, CONFIG.colors.innerRing, 0.05, 0.01, 0.02))

  // 科技蓝外环（与金色主环拉开更大间距）
  rings.push(createRing(4.9, 0.08, CONFIG.colors.outerRing, -0.03, 0.02, 0.01))
  rings.push(createRing(5.9, 0.03, CONFIG.colors.outerRing, 0.01, -0.04, 0.02))

  // 最外层光能环（保持为标准圆形，整体再向外移动，呈现高亮能量体效果）
  // 使用 Torus 作为有厚度的能量环，配合 Bloom 与 AdditiveBlending 增强发光感
  const outerRingGeo = new THREE.TorusGeometry(6.8, 0.2, 32, 180)
  const outerRingMat = new THREE.MeshBasicMaterial({
    color: CONFIG.colors.outerRing,
    transparent: true,
    opacity: 0.06, // 降低整体亮度
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  })
  const outerRing = new THREE.Mesh(outerRingGeo, outerRingMat)

  // 线框外骨骼（围绕能量环的亮色线框）
  const outerWireGeo = new THREE.TorusGeometry(7.1, 0.03, 16, 120)
  const outerWireMat = new THREE.MeshBasicMaterial({
    color: 0x66ccff,
    wireframe: true,
    transparent: true,
    opacity: 0.35, // 降低线框亮度
    blending: THREE.AdditiveBlending
  })
  const outerWire = new THREE.Mesh(outerWireGeo, outerWireMat)
  outerRing.add(outerWire)

  outerRing.rotation.set(
      Math.random() * Math.PI,
      Math.random() * Math.PI,
      Math.random() * Math.PI
  )
  pivotGroup.add(outerRing)

  rings.push({
    mesh: outerRing,
    speed: {x: 0.02, y: 0.05, z: 0.02}
  })


  clock = new THREE.Clock()
  animate()
}

const animate = () => {
  if (!scene || !camera || !composer || !pivotGroup || !innerCore || !coreMesh || !clock || !bloomPass) return

  animationId = requestAnimationFrame(animate)

  const delta = clock.getDelta()
  const time = clock.getElapsedTime()
  const overloaded = isOverloaded.value

  // 超载状态视觉效果
  if (overloaded) {
    // 增强bloom效果
    bloomPass.strength = CONFIG.bloomStrength * 2.5

    // 改变核心颜色为红色/橙色（超载警告色）
    const overloadColor = 0xff4444 // 红色
    const overloadCoreColor = 0xff8844 // 橙红色
    ;(coreMesh.material as THREE.MeshBasicMaterial).color.setHex(overloadColor)
    ;(innerCore.material as THREE.MeshBasicMaterial).color.setHex(overloadCoreColor)

    // 改变光照颜色
    if (coreLight) {
      coreLight.color.setHex(overloadColor)
      coreLight.intensity = 5.0 // 增强光照强度
    }

    // 增强脉冲效果
    const overloadPulse = Math.sin(time * 8) * 0.2 + 1
    innerCore.scale.set(overloadPulse, overloadPulse, overloadPulse)
  } else {
    // 正常状态
    bloomPass.strength = CONFIG.bloomStrength
    ;(coreMesh.material as THREE.MeshBasicMaterial).color.setHex(CONFIG.colors.core)
    ;(innerCore.material as THREE.MeshBasicMaterial).color.setHex(0xffffff)

    if (coreLight) {
      coreLight.color.setHex(CONFIG.colors.core)
      coreLight.intensity = 3.2
    }

    const pulse = Math.sin(time * 3) * 0.1 + 1
    innerCore.scale.set(pulse, pulse, pulse)
  }

  // 1. 核心旋转
  const currentSpeed = CONFIG.baseSpeed * speedMultiplier.value
  coreMesh.rotation.y -= delta * 0.5 * currentSpeed
  coreMesh.rotation.z += delta * 0.2 * currentSpeed

  // 2. 环的旋转
  rings.forEach((ring) => {
    ring.mesh.rotation.x += ring.speed.x * currentSpeed * 0.4
    ring.mesh.rotation.y += ring.speed.y * currentSpeed * 0.4
    ring.mesh.rotation.z += ring.speed.z * currentSpeed * 0.4
  })

  // 3. 悬浮
  pivotGroup.position.y = Math.sin(time * 0.5) * 1


  controls?.update()
  composer.render()
}

// 点击处理函数
const handleClick = () => {
  if (isIncreasing.value) {
    // 递增模式
    speedMultiplier.value += SPEED_INCREMENT
    // 达到最大速度，切换为递减模式
    if (speedMultiplier.value >= MAX_SPEED_MULTIPLIER) {
      speedMultiplier.value = MAX_SPEED_MULTIPLIER
      isIncreasing.value = false
    }
  } else {
    // 递减模式
    speedMultiplier.value -= SPEED_INCREMENT
    // 达到最小速度，切换为递增模式
    if (speedMultiplier.value <= 1) {
      speedMultiplier.value = 1
      isIncreasing.value = true
    }
  }
}

// 防抖函数
const debounce = <T extends (...args: any[]) => void>(
    func: T,
    wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: ReturnType<typeof setTimeout> | null = null
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// 防抖的 resize 处理
const handleResize = debounce(() => {
  if (!canvasContainer.value || !camera || !renderer || !composer) return

  const width = canvasContainer.value.clientWidth || 800
  const height = canvasContainer.value.clientHeight || 600

  if (width > 0 && height > 0) {
    // 根据相机类型分别更新参数
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.aspect = width / height
    } else if (camera instanceof THREE.OrthographicCamera) {
      const aspect = width / height
      camera.left = (-FRUSTUM_SIZE * aspect) / 2
      camera.right = (FRUSTUM_SIZE * aspect) / 2
      camera.top = FRUSTUM_SIZE / 2
      camera.bottom = -FRUSTUM_SIZE / 2
    }
    camera.updateProjectionMatrix()
    renderer.setSize(width, height)
    composer.setSize(width, height)
  }
}, 100)

onMounted(() => {
  // 等待下一帧确保容器已渲染
  setTimeout(() => {
    initScene()

    // 使用 ResizeObserver 监听容器尺寸变化
    if (canvasContainer.value) {
      resizeObserver = new ResizeObserver((entries) => {
        for (const entry of entries) {
          if (entry.contentRect.width > 0 && entry.contentRect.height > 0) {
            handleResize()
          }
        }
      })
      resizeObserver.observe(canvasContainer.value)
    }

    // 同时监听窗口大小变化（作为备用）
    window.addEventListener('resize', handleResize)
  }, 0)
})

onBeforeUnmount(() => {
  if (animationId) {
    cancelAnimationFrame(animationId)
  }

  if (resizeObserver) {
    resizeObserver.disconnect()
    resizeObserver = null
  }

  window.removeEventListener('resize', handleResize)

  // 清理 Three.js 资源
  if (renderer && canvasContainer.value) {
    canvasContainer.value.removeChild(renderer.domElement)
  }

  if (scene) {
    scene.traverse((object: THREE.Object3D) => {
      if (object instanceof THREE.Mesh) {
        object.geometry.dispose()
        if (Array.isArray(object.material)) {
          object.material.forEach((mat: THREE.Material) => mat.dispose())
        } else {
          object.material.dispose()
        }
      }
    })
  }

  if (renderer) {
    renderer.dispose()
  }

  if (composer) {
    composer.dispose()
  }

  if (controls) {
    controls.dispose()
  }
})
</script>

<style scoped>
/* 淡入淡出过渡 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>

