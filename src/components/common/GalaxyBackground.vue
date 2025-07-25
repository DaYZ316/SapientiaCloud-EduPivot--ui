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

const params = {
  particleCount: 250000,
  particleSize: 0.02,
  branches: 6,
  branchRadius: 5,
  spin: 0.2,
  radialRandomness: 0.5,
  innerColor: '#ff812e',
  outerColor: '#a668ff',
}

// 获取随机极坐标
const getRandomPolarCoordinate = (radius) => {
  const theta = Math.random() * Math.PI * 2
  const phi = Math.random() * Math.PI * 2
  const x = radius * Math.sin(theta) * Math.cos(phi)
  const y = radius * Math.sin(theta) * Math.sin(phi)
  const z = radius * Math.cos(theta)
  return { x, y, z }
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
  camera.position.set(7, 4, 7)

  // 创建渲染器
  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
  renderer.setSize(window.innerWidth, window.innerHeight)
  
  if (galaxyContainer.value) {
    galaxyContainer.value.appendChild(renderer.domElement)
  }

  // 创建控制器
  controls = new OrbitControls(camera, renderer.domElement)
  controls.enableDamping = true
  controls.enabled = false // 禁用用户交互
  controls.autoRotate = true
  controls.autoRotateSpeed = 0.5
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
  
  for (let i = 0; i < params.particleCount; i++) {
    const i3 = i * 3

    const radius = params.branchRadius * Math.random()
    const branchAngle = ((i % params.branches) / params.branches) * Math.PI * 2
    const spinAngle = params.spin * radius * Math.PI * 2

    const randRadius = Math.random() * params.radialRandomness * radius
    const { x: randX, y: randY, z: randZ } = getRandomPolarCoordinate(randRadius)

    positions[i3] = radius * Math.cos(branchAngle + spinAngle) + randX
    positions[i3 + 1] = randY
    positions[i3 + 2] = radius * Math.sin(branchAngle + spinAngle) + randZ

    const mixedColor = innerColor.clone().lerp(outerColor, radius / params.branchRadius)
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

// 动画循环
const animate = () => {
  animationFrameId = requestAnimationFrame(animate)
  
  if (controls) controls.update()
  if (geometry) geometry.rotateY(0.001 * spinDirection)
  
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
  generateGalaxy()
  animate()
  window.addEventListener('resize', handleResize)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize)
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