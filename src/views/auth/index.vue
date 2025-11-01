<template>
  <div class="login-page-container">
    <AuthHeader 
      :active-tab="showRegister ? 'register' : 'login'" 
      :class="{ 'animate-in': isPageLoaded }"
      @show-register="handleShowRegister" 
      @show-login="handleShowLogin" 
    />
    <LiquidEther
      ref="liquidEtherRef"
      :colors="fluidColors"
      :mouseForce="25"
      :cursorSize="120"
      :isViscous="false"
      :viscous="30"
      :iterationsViscous="32"
      :iterationsPoisson="40"
      :resolution="0.6"
      :isBounce="false"
      :autoDemo="true"
      :autoSpeed="0.3"
      :autoIntensity="2.5"
      :takeoverDuration="0.25"
      :autoResumeDelay="2000"
      :autoRampDuration="0.6"
      :dt="0.008"
      :class="['liquid-ether-bg', { 'animate-in': isPageLoaded }]"
    />
    <div :class="['rolling-gallery-container', { 'animate-in': isPageLoaded }]">
      <RollingGallery
        ref="rollingGalleryRef"
        :autoplay="true"
        :pause-on-hover="true"
        :images="customImages ?? undefined"
      />
      <div class="slogan-text" :style="sloganGradientStyle">{{ t('auth.slogan') }}</div>
    </div>
    <div :class="['login-form-container', { 'animate-in': isPageLoaded }]">
      <Transition name="card-fade" mode="out-in">
        <Login v-if="!showRegister" key="login" />
        <Register v-else key="register" @switch-to-login="handleShowLogin" />
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { generateColorVariants } from '@/utils/colorAlgorithm'
import { useThemeStore } from '@/store'
import LiquidEther from '@/components/backgrounds/LiquidEther.vue'
import RollingGallery from '@/components/common/RollingGallery.vue'
import AuthHeader from '@/views/auth/components/AuthHeader.vue'
import Login from '@/views/auth/Login/index.vue'
import Register from '@/views/auth/Register/index.vue'
import image1 from '@/assets/image/course-test/1.png'
import image2 from '@/assets/image/course-test/2.png'
import image3 from '@/assets/image/course-test/3.png'
import image4 from '@/assets/image/course-test/4.png'
import image5 from '@/assets/image/course-test/5.png'
import image6 from '@/assets/image/course-test/6.png'

const { t } = useI18n()
const themeStore = useThemeStore()
const fluidColors = ref<string[]>(['#1890ff', '#40a9ff', '#096dd9'])
const customImages = ref<string[] | null>(null)
const liquidEtherRef = ref<InstanceType<typeof LiquidEther> | null>(null)
const rollingGalleryRef = ref<InstanceType<typeof RollingGallery> | null>(null)
const showRegister = ref(false)
const isPageLoaded = ref(false)

// 生成渐变样式
const colorVariants = computed(() => {
  return generateColorVariants(themeStore.primaryColor)
})

const sloganGradientStyle = computed(() => {
  const colors = colorVariants.value
  return {
    backgroundImage: `linear-gradient(135deg, ${colors.darker} 0%, ${colors.dark} 20%, ${colors.primary} 40%, ${colors.light} 60%, ${colors.lighter} 80%, ${colors.primary} 100%)`,
    backgroundSize: '200% 200%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '0% 50%'
  }
})

const getCssVariable = (varName: string): string => {
  return getComputedStyle(document.documentElement)
    .getPropertyValue(varName)
    .trim() || ''
}

onMounted(() => {
  const primary = getCssVariable('--color-primary') || '#1890ff'
  const primaryLight = getCssVariable('--color-primary-light') || '#40a9ff'
  const primaryDark = getCssVariable('--color-primary-dark') || '#096dd9'
  const info = getCssVariable('--info-color') || '#1890ff'
  
  fluidColors.value = [primary, primaryLight, primaryDark, info]
  customImages.value = [
    image1,
    image2,
    image3,
    image4,
    image5,
    image6
  ]

  // 触发页面加载动画
  setTimeout(() => {
    isPageLoaded.value = true
  }, 50)

  // 轮播图进入时转一圈
  setTimeout(() => {
    if (rollingGalleryRef.value) {
      (rollingGalleryRef.value as any).rotateOnce()
    }
  }, 600)
})

const handleShowRegister = () => {
  showRegister.value = true
}

const handleShowLogin = () => {
  showRegister.value = false
}

// 确保在组件卸载前停止所有动画和定时器
onBeforeUnmount(() => {
  // 停止所有可能的后台任务
  if (liquidEtherRef.value) {
    // LiquidEther组件内部会处理清理，但确保它被标记为不可见
    const webgl = (liquidEtherRef.value as any).webglRef?.value
    if (webgl) {
      webgl.pause()
    }
  }
})
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
