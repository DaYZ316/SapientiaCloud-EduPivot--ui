<template>
  <div ref="galaxyContainer" class="galaxy-background"></div>
</template>

<script setup>
import {onBeforeUnmount, onMounted, ref} from 'vue'
import * as THREE from 'three'
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls'

const galaxyContainer = ref(null)
let scene, renderer, camera, controls
let material, geometry, points
let spinDirection = 1
let animationFrameId = null
let regenerateTimer = null

// 星系参数配置范围
const paramRanges = {
  particleCount: {min: 50000, max: 120000},
  particleSize: {min: 0.02, max: 0.04},
  branches: {min: 3, max: 8},
  branchRadius: {min: 3, max: 8}, // 增加最大半径
  spin: {min: -0.6, max: 0.6}, // 增加旋转范围
  radialRandomness: {min: 0.8, max: 1.5}, // 大幅增加径向随机性
  verticalSpread: {min: 0.3, max: 0.8}, // 新增垂直分散参数
  randomParticleRatio: {min: 0.1, max: 0.3}, // 新增完全随机粒子比例
  innerColors: ['#ff812e', '#ff6b35', '#ff4757', '#ff3838', '#ff9ff3', '#54a0ff'],
  outerColors: ['#a668ff', '#5f27cd', '#00d2d3', '#ff9ff3', '#54a0ff', '#01a3a4']
}

// 当前星系参数
let params = {
  particleCount: null,
  particleSize: null,
  branches: null,
  branchRadius: null,
  spin: null,
  radialRandomness: null,
  verticalSpread: null, // 新增垂直分散参数
  randomParticleRatio: null, // 新增完全随机粒子比例
  innerColor: null,
  outerColor: null,
}

// 更新CSS变量以同步button颜色
const updateButtonColors = () => {
  const root = document.documentElement
  // 使用外层颜色作为button的渐变色
  root.style.setProperty('--button-gradient-color', params.outerColor)
  
  // 为hover状态生成稍微不同的颜色（降低亮度）
  const hoverColor = adjustColorBrightness(params.outerColor, -20)
  root.style.setProperty('--button-gradient-hover-color', hoverColor)
}

// 调整颜色亮度的辅助函数
const adjustColorBrightness = (hex, percent) => {
  // 移除#号
  const num = parseInt(hex.replace('#', ''), 16)
  const amt = Math.round(2.55 * percent)
  const R = (num >> 16) + amt
  const G = (num >> 8 & 0x00FF) + amt
  const B = (num & 0x0000FF) + amt
  
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1)
}

// 随机化星系参数
const randomizeParams = () => {
  params.particleCount = Math.floor(
    Math.random() * (paramRanges.particleCount.max - paramRanges.particleCount.min) + 
    paramRanges.particleCount.min
  )
  params.particleSize = Math.random() * (paramRanges.particleSize.max - paramRanges.particleSize.min) + 
    paramRanges.particleSize.min
  params.branches = Math.floor(
    Math.random() * (paramRanges.branches.max - paramRanges.branches.min) + 
    paramRanges.branches.min
  )
  params.branchRadius = Math.random() * (paramRanges.branchRadius.max - paramRanges.branchRadius.min) + 
    paramRanges.branchRadius.min
  params.spin = Math.random() * (paramRanges.spin.max - paramRanges.spin.min) + 
    paramRanges.spin.min
  params.radialRandomness = Math.random() * (paramRanges.radialRandomness.max - paramRanges.radialRandomness.min) + 
    paramRanges.radialRandomness.min
  params.verticalSpread = Math.random() * (paramRanges.verticalSpread.max - paramRanges.verticalSpread.min) + 
    paramRanges.verticalSpread.min
  params.randomParticleRatio = Math.random() * (paramRanges.randomParticleRatio.max - paramRanges.randomParticleRatio.min) + 
    paramRanges.randomParticleRatio.min
  params.innerColor = paramRanges.innerColors[Math.floor(Math.random() * paramRanges.innerColors.length)]
  params.outerColor = paramRanges.outerColors[Math.floor(Math.random() * paramRanges.outerColors.length)]
  
  // 同步更新button颜色
  updateButtonColors()
}

// 获取随机极坐标
const getRandomPolarCoordinate = (radius) => {
  const theta = Math.random() * Math.PI * 2
  const phi = Math.random() * Math.PI * 2
  const x = radius * Math.sin(theta) * Math.cos(phi)
  const y = radius * Math.sin(theta) * Math.sin(phi)
  const z = radius * Math.cos(theta)
  return {x, y, z}
}

// 初始化场景
const initializeScene = () => {
  // 创建场景
  scene = new THREE.Scene()

  // 创建相机
  camera = new THREE.PerspectiveCamera(
      35,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
  )
  camera.position.set(5.5, 2, 5.5)

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({antialias: true, alpha: true})
  renderer.setSize(window.innerWidth, window.innerHeight)

  if (galaxyContainer.value) {
    galaxyContainer.value.appendChild(renderer.domElement)
  }

  // 创建控制器
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.enabled = false // 禁用用户交互
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.2
  controls.update()
}

// 生成星系
const generateGalaxy = () => {
  // 移除旧粒子
  if (points) {
    geometry.dispose()
    material.dispose()
    scene.remove(points)
  }

  // 内联星星纹理（避免加载外部资源）
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const size = 64
  canvas.width = size
  canvas.height = size

  // 创建星星纹理
  const gradient = ctx.createRadialGradient(
      size / 2,
      size / 2,
      0,
      size / 2,
      size / 2,
      size / 2
  )
  gradient.addColorStop(0, 'rgba(255,255,255,1)')
  gradient.addColorStop(0.2, 'rgba(240,240,240,0.8)')
  gradient.addColorStop(0.4, 'rgba(200,200,200,0.4)')
  gradient.addColorStop(0.6, 'rgba(160,160,160,0.2)')
  gradient.addColorStop(1, 'rgba(0,0,0,0)')

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, size, size)

  const particleTexture = new THREE.CanvasTexture(canvas)

  // 创建新粒子
  const positions = new Float32Array(params.particleCount * 3)
  const colors = new Float32Array(params.particleCount * 3)
  const innerColor = new THREE.Color(params.innerColor)
  const outerColor = new THREE.Color(params.outerColor)

  // 计算每个分支的粒子数量，确保均匀分布
  const branchedParticleCount = Math.floor(params.particleCount * (1 - params.randomParticleRatio))
  const randomParticleCount = params.particleCount - branchedParticleCount
  const particlesPerBranch = Math.floor(branchedParticleCount / params.branches)
  let particleIndex = 0

  // 生成分支粒子（更随机的分布）
  for (let branchIndex = 0; branchIndex < params.branches; branchIndex++) {
    const branchAngle = (branchIndex / params.branches) * Math.PI * 2
    
    // 为当前分支生成粒子
    for (let j = 0; j < particlesPerBranch && particleIndex < branchedParticleCount; j++) {
      const i3 = particleIndex * 3

      // 使用更分散的径向分布
      const radius = params.branchRadius * Math.pow(Math.random(), 0.5) // 让更多粒子在外围
      const spinAngle = params.spin * radius * Math.PI * 2

      // 增加更强的随机扰动
      const randRadius = Math.random() * params.radialRandomness * radius * 1.5 // 增强随机扰动
      const {x: randX, y: randY, z: randZ} = getRandomPolarCoordinate(randRadius)

      // 添加额外的角度随机性
      const angleRandomness = (Math.random() - 0.5) * Math.PI * 0.3
      const finalAngle = branchAngle + spinAngle + angleRandomness

      positions[i3] = radius * Math.cos(finalAngle) + randX
      positions[i3 + 1] = randY + (Math.random() - 0.5) * params.verticalSpread * radius // 增加垂直随机性
      positions[i3 + 2] = radius * Math.sin(finalAngle) + randZ

      const mixedColor = innerColor.clone().lerp(outerColor, radius / params.branchRadius)
      colors[i3] = mixedColor.r
      colors[i3 + 1] = mixedColor.g
      colors[i3 + 2] = mixedColor.b
      
      particleIndex++
    }
  }

  // 处理剩余的分支粒子
  for (let i = particleIndex; i < branchedParticleCount; i++) {
    const i3 = i * 3
    const branchIndex = i % params.branches
    const branchAngle = (branchIndex / params.branches) * Math.PI * 2
    
    const radius = params.branchRadius * Math.pow(Math.random(), 0.5)
    const spinAngle = params.spin * radius * Math.PI * 2

    const randRadius = Math.random() * params.radialRandomness * radius * 1.5
    const {x: randX, y: randY, z: randZ} = getRandomPolarCoordinate(randRadius)

    const angleRandomness = (Math.random() - 0.5) * Math.PI * 0.3
    const finalAngle = branchAngle + spinAngle + angleRandomness

    positions[i3] = radius * Math.cos(finalAngle) + randX
    positions[i3 + 1] = randY + (Math.random() - 0.5) * params.verticalSpread * radius
    positions[i3 + 2] = radius * Math.sin(finalAngle) + randZ

    const mixedColor = innerColor.clone().lerp(outerColor, radius / params.branchRadius)
    colors[i3] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b
  }

  // 生成完全随机的粒子（不遵循分支结构）
  for (let i = branchedParticleCount; i < params.particleCount; i++) {
    const i3 = i * 3
    
    // 完全随机分布在球形空间内
    const randomRadius = params.branchRadius * Math.pow(Math.random(), 0.3)
    const {x: randomX, y: randomY, z: randomZ} = getRandomPolarCoordinate(randomRadius)
    
    positions[i3] = randomX
    positions[i3 + 1] = randomY
    positions[i3 + 2] = randomZ

    // 随机颜色，但倾向于外层颜色
    const colorMix = Math.random() * 0.7 + 0.3 // 0.3-1.0 范围，倾向于外层
    const mixedColor = innerColor.clone().lerp(outerColor, colorMix)
    colors[i3] = mixedColor.r
    colors[i3 + 1] = mixedColor.g
    colors[i3 + 2] = mixedColor.b
  }

  material = new THREE.PointsMaterial({
    size: params.particleSize,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    transparent: true,
    alphaMap: particleTexture,
  })

  geometry = new THREE.BufferGeometry()
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

  points = new THREE.Points(geometry, material)
  scene.add(points)

  spinDirection = params.spin > 0 ? 1 : -1
}

// 重新生成星系
const regenerateGalaxy = () => {
  randomizeParams()
  generateGalaxy()
}

// 设置定期重新生成
const startAutoRegenerate = () => {
  // 每30-60秒随机重新生成星系
  const setNextRegenerate = () => {
    const delay = Math.random() * 30000 + 30000 // 30-60秒
    regenerateTimer = setTimeout(() => {
      regenerateGalaxy()
      setNextRegenerate()
    }, delay)
  }
  setNextRegenerate()
}

// 动画循环
const animate = () => {
  animationFrameId = requestAnimationFrame(animate)

  if (controls) controls.update()
  if (geometry) geometry.rotateY(0.0005 * spinDirection)

  if (renderer && scene && camera) {
    renderer.render(scene, camera)
  }
}

// 窗口大小调整处理
const handleResize = () => {
  if (camera && renderer) {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
  }
}

onMounted(() => {
  initializeScene()
  randomizeParams() // 初始随机化参数（包含button颜色同步）
  generateGalaxy()
  animate()
  startAutoRegenerate() // 开始自动重新生成
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
  
  if (regenerateTimer) {
    clearTimeout(regenerateTimer)
  }
  
  if (animationFrameId !== null) {
    cancelAnimationFrame(animationFrameId)
  }

  if (geometry) geometry.dispose()
  if (material) material.dispose()
  if (renderer) renderer.dispose()
})
</script>

<style lang="scss" scoped>
.galaxy-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  background-color: #030014;
}
</style> 