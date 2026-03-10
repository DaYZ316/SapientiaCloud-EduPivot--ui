<template>
  <n-card class="welcome-card">
    <canvas
        ref="particleCanvas"
        class="particle-canvas"
    ></canvas>
    <div class="welcome-content">
      <div class="card-inner">

        <div class="text-section">
          <div class="top-row">
            <div class="greeting">{{ greeting }}</div>

          </div>


          <p class="welcome-message">{{ t('dashboard.welcome.message') }}</p>
        </div>

        <div class="image-section">
          <img
              alt="Dashboard"
              class="dashboard-image"
              src="@/assets/image/dashboard.webp"
          />
        </div>
      </div>
    </div>
  </n-card>
</template>

<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import {computed, ref, onMounted, onUnmounted} from 'vue'
import {useUserStore} from '@/store'

const {t} = useI18n()
const userStore = useUserStore()
const particleCanvas = ref<HTMLCanvasElement>()
let animationFrameId: number | null = null
let particles: Particle[] = []
let ctx: CanvasRenderingContext2D | null = null

// 粒子类
class Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  opacity: number
  color: string
  life: number
  maxLife: number
  glowSize: number

  constructor(canvasWidth: number, canvasHeight: number) {
    this.x = Math.random() * canvasWidth
    this.y = Math.random() * canvasHeight
    this.vx = (Math.random() - 0.5) * 0.3
    this.vy = (Math.random() - 0.5) * 0.3
    this.size = Math.random() * 3 + 1.5  // 增加基础大小，从0.5-2.5提高到1.5-4.5
    this.opacity = Math.random() * 0.4 + 0.7  // 提高基础亮度，从0.3-0.8提高到0.7-1.1
    this.maxLife = Math.random() * 400 + 300
    this.life = this.maxLife
    this.glowSize = this.size * 4  // 增加光晕大小比例

    // 使用白色粒子
    const colors = [
      'rgba(255, 255, 255, 0.9)'   // 白色
    ]
    this.color = colors[Math.floor(Math.random() * colors.length)]
  }

  update() {
    this.x += this.vx
    this.y += this.vy
    this.life = Math.max(0, this.life - 1) // 确保life不会小于0

    const canvasWidth = ctx?.canvas.offsetWidth || 0
    const canvasHeight = ctx?.canvas.offsetHeight || 0

    // 边界检查和反弹
    if (this.x < 0) {
      this.x = 0
      this.vx *= -0.7
    } else if (this.x > canvasWidth) {
      this.x = canvasWidth
      this.vx *= -0.7
    }

    if (this.y < 0) {
      this.y = 0
      this.vy *= -0.7
    } else if (this.y > canvasHeight) {
      this.y = canvasHeight
      this.vy *= -0.7
    }

    // 添加轻微的随机力和重力效果
    this.vx += (Math.random() - 0.5) * 0.005
    this.vy += (Math.random() - 0.5) * 0.005 + 0.001 // 轻微下坠

    // 添加一些湍流效果
    const turbulence = Math.sin(this.life * 0.01) * 0.002
    this.vx += turbulence
    this.vy += turbulence * 0.5

    // 限制速度
    const maxSpeed = 0.6
    const speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy)
    if (speed > maxSpeed) {
      this.vx = (this.vx / speed) * maxSpeed
      this.vy = (this.vy / speed) * maxSpeed
    }

    // 逐渐减速
    this.vx *= 0.998
    this.vy *= 0.998
  }

  draw(ctx: CanvasRenderingContext2D) {
    const lifeProgress = this.life / this.maxLife
    const alpha = Math.max(0.1, lifeProgress * this.opacity) // 提高最小alpha值
    const lifeRatio = Math.max(0.1, lifeProgress) // 提高最小lifeRatio值，让粒子更持久

    ctx.save()

    // 创建径向渐变光晕效果
    const glowRadius = Math.max(0.1, this.glowSize * lifeRatio)
    const glowGradient = ctx.createRadialGradient(
        this.x, this.y, 0,
        this.x, this.y, glowRadius
    )
    const colorMatch = this.color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/)
    if (colorMatch) {
      const r = parseInt(colorMatch[1])
      const g = parseInt(colorMatch[2])
      const b = parseInt(colorMatch[3])
      glowGradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${alpha * 0.6})`)
      glowGradient.addColorStop(0.4, `rgba(${r}, ${g}, ${b}, ${alpha * 0.3})`)
      glowGradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)
    }

    ctx.fillStyle = glowGradient
    ctx.beginPath()
    ctx.arc(this.x, this.y, glowRadius, 0, Math.PI * 2)
    ctx.fill()

    // 绘制粒子核心
    const coreRadius = Math.max(0.1, this.size * lifeRatio)
    ctx.globalAlpha = alpha
    ctx.fillStyle = this.color
    ctx.beginPath()
    ctx.arc(this.x, this.y, coreRadius, 0, Math.PI * 2)
    ctx.fill()

    // 添加闪烁效果
    if (Math.random() > 0.95) {
      ctx.globalAlpha = alpha * 0.8
      ctx.strokeStyle = this.color
      ctx.lineWidth = 1
      ctx.beginPath()
      ctx.arc(this.x, this.y, Math.max(0.1, this.size * 1.5 * lifeRatio), 0, Math.PI * 2)
      ctx.stroke()
    }

    ctx.restore()
  }

  isDead(): boolean {
    return this.life <= 0
  }
}

// 初始化粒子系统
const initParticles = () => {
  if (!ctx || !particleCanvas.value) return

  const canvas = particleCanvas.value
  canvas.width = canvas.offsetWidth * window.devicePixelRatio
  canvas.height = canvas.offsetHeight * window.devicePixelRatio
  canvas.style.width = canvas.offsetWidth + 'px'
  canvas.style.height = canvas.offsetHeight + 'px'
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio)

  particles = []
  // 根据屏幕大小动态调整粒子数量
  const area = canvas.offsetWidth * canvas.offsetHeight
  const particleCount = Math.min(8, Math.max(4, Math.floor(area / 18000)))

  for (let i = 0; i < particleCount; i++) {
    particles.push(new Particle(canvas.offsetWidth, canvas.offsetHeight))
  }
}

// 动画循环
const animate = () => {
  if (!ctx || !particleCanvas.value) return

  // 清除画布
  ctx.clearRect(0, 0, particleCanvas.value.offsetWidth, particleCanvas.value.offsetHeight)

  // 更新和绘制粒子
  for (let i = particles.length - 1; i >= 0; i--) {
    const particle = particles[i]
    particle.update()
    particle.draw(ctx)

    // 移除死亡的粒子
    if (particle.isDead()) {
      particles.splice(i, 1)
    }
  }

  // 动态添加新粒子，保持稳定的粒子数量
  const maxParticles = Math.min(20, Math.max(5, Math.floor((particleCanvas.value.offsetWidth * particleCanvas.value.offsetHeight) / 12000)))
  if (particles.length < maxParticles && Math.random() < 0.08) {
    particles.push(new Particle(particleCanvas.value.offsetWidth, particleCanvas.value.offsetHeight))
  }

  animationFrameId = requestAnimationFrame(animate)
}

// 窗口大小改变处理
const handleResize = () => {
  initParticles()
}

// 性能检测和优化
const detectPerformance = () => {
  // 检测设备性能
  const isLowEndDevice = navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 4
  const connection = (navigator as any).connection
  const isSlowConnection = connection &&
      (connection.effectiveType === 'slow-2g' ||
          connection.effectiveType === '2g')

  return isLowEndDevice || isSlowConnection
}

// 生命周期
onMounted(() => {
  if (particleCanvas.value) {
    ctx = particleCanvas.value.getContext('2d')
    // 如果是低性能设备，跳过粒子动画
    if (detectPerformance()) {
      return
    }
    initParticles()
    animate()
    window.addEventListener('resize', handleResize)
  }
})

onUnmounted(() => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId)
  }
  window.removeEventListener('resize', handleResize)
})

const greeting = computed(() => {
  const hour = new Date().getHours()
  let greetKey: string

  // 更合理的问好时间划分
  if (hour >= 5 && hour < 12) {
    greetKey = 'dashboard.goodMorning'
  } else if (hour >= 12 && hour < 14) {
    greetKey = 'dashboard.goodNoon'
  } else if (hour >= 14 && hour < 18) {
    greetKey = 'dashboard.goodAfternoon'
  } else if (hour >= 18 && hour < 22) {
    greetKey = 'dashboard.goodEvening'
  } else {
    greetKey = 'dashboard.goodNight'
  }

  const name = userStore.userInfo?.nickName ?? userStore.userInfo?.username ?? ''
  return name ? `${t(greetKey)}，${name}` : `${t(greetKey)}`
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.welcome-card {
  z-index: 10;
  width: 60%;
  height: 200px; /* 保持高度不变 */
  background: radial-gradient(circle at 20% 80%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
  radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
  radial-gradient(circle at 40% 40%, rgba(255, 255, 255, 0.02) 0%, transparent 50%),
    /* 混合 primary 与 background 颜色，第二项使用半透明以增加整体透明度 */
  color-mix(in srgb, var(--primary-color) 30%, rgba(20, 20, 20, 1) 70%);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1),
  0 2px 8px rgba(0, 0, 0, 0.05),
  inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border: none;
  border-radius: 12px;
  transition: all 0.3s ease;
  box-sizing: border-box;
  overflow: hidden;
  position: relative; /* 使右侧图片可以绝对定位，不推动布局 */
  user-select: none;
}

.particle-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 1;
  opacity: 0.6;
  mix-blend-mode: screen;

  @media (prefers-reduced-motion: reduce) {
    display: none;
  }
}

.welcome-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 12px 20px; /* 稍微压缩内边距以腾出空间 */
  gap: 12px;
  box-sizing: border-box;
  position: relative;
  z-index: 2;
}

.card-inner {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 16px;
  width: 100%;
  justify-content: flex-start;
  flex-wrap: wrap; /* 在内容过宽时换行，保证不溢出卡片 */
  align-content: center;
}


.text-section {
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: left;
  flex: 1;
  min-width: 0; /* 允许子元素缩小，避免超出容器 */
  margin-right: 320px; /* 预留右侧绝对定位图片的空间，避免内容被覆盖 */
}

.image-section {
  position: absolute;
  right: 20px;
  top: 70%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 340px; /* 固定图片区域宽度（在大屏） */
  flex-shrink: 0;
  margin-left: 0;
}

.dashboard-image {
  height: 280px; /* 继续增大图片高度 */
  width: auto;
  object-fit: contain;
  display: block;
  border-radius: 8px;

  @media (max-width: 768px) {
    height: 150px; /* 移动端也相应增大 */
  }
}

/* 在较小屏幕上恢复图片流式布局，避免绝对定位导致遮挡或溢出 */
@media (max-width: 960px) {
  .image-section {
    position: static;
    transform: none;
    width: 180px;
    margin-left: 12px;
  }

  .text-section {
    margin-right: 0;
  }
}

.top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 6px;
  gap: 12px;
}


.actions {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-shrink: 0;
  flex-wrap: nowrap;
}

.action-btn {
  padding: 4px 8px;
}

.greeting {
  font-size: 32px;
  font-weight: 600;
  color: white;
  margin: 0 0 6px 0;
  text-align: left;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.welcome-message {
  font-size: 18px;
  color: #a8a8a8;
  margin: 0;
  line-height: 1.5;
  max-height: 60px; /* 限制行高，避免过长推高卡片 */
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;

  @media (max-width: 768px) {
    font-size: 16px;
    max-height: 48px;
    -webkit-line-clamp: 3;
    line-clamp: 3;
  }
}

</style>
