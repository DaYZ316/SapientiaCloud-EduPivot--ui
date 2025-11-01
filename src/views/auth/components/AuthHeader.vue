<template>
  <header class="auth-header">
    <div class="auth-header-content">
      <div class="auth-header-left">
        <img src="@/assets/image/SapientiaCloud EduPivot Logo.png" alt="Logo" class="auth-header-logo" />
        <span class="auth-header-title" :style="gradientStyle">{{ appName }}</span>
      </div>
      <nav class="auth-header-nav">
        <a class="auth-header-link" :class="{ 'is-active': props.activeTab === 'login' }" @click="handleLoginClick">{{ t('auth.login') }}</a>
        <a class="auth-header-link" :class="{ 'is-active': props.activeTab === 'register' }" @click="handleRegisterClick">{{ t('auth.register') }}</a>
      </nav>
    </div>
  </header>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { generateColorVariants } from '@/utils/colorAlgorithm'
import { useThemeStore } from '@/store'

const props = defineProps<{
  activeTab?: 'login' | 'register'
}>()

const emit = defineEmits<{
  showRegister: []
  showLogin: []
}>()

const { t, locale } = useI18n()
const themeStore = useThemeStore()
const appName = ref<string | null>(null)

const handleLoginClick = () => {
  emit('showLogin')
}

const handleRegisterClick = () => {
  emit('showRegister')
}

// 从 theme store 获取 primary 颜色并生成变体
const colorVariants = computed(() => {
  return generateColorVariants(themeStore.primaryColor)
})

// 计算流光渐变样式
const gradientStyle = computed(() => {
  const colors = colorVariants.value
  return {
    backgroundImage: `linear-gradient(90deg, ${colors.darker} 0%, ${colors.dark} 25%, ${colors.primary} 50%, ${colors.light} 75%, ${colors.lighter} 100%)`,
    backgroundSize: '200% 100%',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: '0% 50%'
  }
})

onMounted(() => {
  appName.value = t('app.name')
})

watch(locale, () => {
  appName.value = t('app.name')
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.auth-header {
  position: absolute;
  top: 30px;
  left: 0;
  right: 0;
  z-index: 10;
  pointer-events: none;
  padding: 16px 48px;
  opacity: 0;
  transform: translateY(-40px);
  transition: opacity 0.8s cubic-bezier(0.4, 0, 0.2, 1),
              transform 0.8s cubic-bezier(0.4, 0, 0.2, 1);

  &.animate-in {
    opacity: 1;
    transform: translateY(0);
  }

  &-content {
    max-width: 70%;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 36px;
    padding: 12px 48px;
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.1);
    pointer-events: none;

    @media (max-width: 1400px) {
      max-width: 80%;
      padding: 12px 40px;
    }

    @media (max-width: 1200px) {
      max-width: 85%;
      padding: 12px 36px;
    }

    @media (max-width: 992px) {
      max-width: 90%;
      padding: 12px 32px;
    }

    @media (max-width: 768px) {
      max-width: 95%;
      padding: 10px 24px;
      border-radius: 24px;
    }

    @media (max-width: 640px) {
      max-width: 100%;
      padding: 10px 20px;
      border-radius: 20px;
      margin: 0 12px;
    }

    @media (max-width: 480px) {
      padding: 8px 16px;
      border-radius: 18px;
      margin: 0 8px;
    }
  }

  &-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  &-logo {
    height: 40px;
    width: auto;
    object-fit: contain;
    display: block;

    @media (max-width: 992px) {
      height: 36px;
    }

    @media (max-width: 768px) {
      height: 32px;
    }

    @media (max-width: 640px) {
      height: 28px;
    }

    @media (max-width: 480px) {
      height: 24px;
    }
  }

  &-title {
    font-size: 28px;
    font-weight: 600;
    white-space: nowrap;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    -webkit-background-clip: text;
    background-clip: text;
    -webkit-text-fill-color: transparent;
    color: transparent;
    display: inline-block;
    animation: flowing-gradient 3s ease-in-out infinite;
    position: relative;

    @media (max-width: 1200px) {
      font-size: 24px;
    }

    @media (max-width: 992px) {
      font-size: 22px;
    }

    @media (max-width: 768px) {
      font-size: 20px;
    }

    @media (max-width: 640px) {
      font-size: 18px;
    }

    @media (max-width: 480px) {
      font-size: 16px;
    }
  }

  &-nav {
    display: flex;
    align-items: center;
    gap: 24px;

    @media (max-width: 992px) {
      gap: 20px;
    }

    @media (max-width: 768px) {
      gap: 16px;
    }

    @media (max-width: 640px) {
      gap: 12px;
    }

    @media (max-width: 480px) {
      gap: 8px;
    }
  }

  &-link {
    font-size: 20px;
    color: var(--text-color);
    text-decoration: none;
    transition: all 0.3s ease;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    cursor: pointer;
    pointer-events: auto;
    position: relative;
    padding: 8px 16px;
    border-radius: 8px;

    @media (max-width: 992px) {
      font-size: 18px;
      padding: 6px 14px;
    }

    @media (max-width: 768px) {
      font-size: 16px;
      padding: 6px 12px;
    }

    @media (max-width: 640px) {
      font-size: 15px;
      padding: 5px 10px;
    }

    @media (max-width: 480px) {
      font-size: 14px;
      padding: 4px 8px;
    }

    &:hover {
      color: var(--color-primary-light);
    }

    &.is-active {
      color: var(--color-primary);
      font-weight: 600;
      
      &::after {
        content: '';
        position: absolute;
        bottom: 4px;
        left: 50%;
        transform: translateX(-50%);
        width: 60%;
        height: 2px;
        background: var(--color-primary);
        border-radius: 2px;
      }
    }

    &.router-link-active {
      color: var(--color-primary-light);
    }
  }
}

@keyframes flowing-gradient {
  0% {
    background-position-x: 0%;
  }
  50% {
    background-position-x: 100%;
  }
  100% {
    background-position-x: 0%;
  }
}
</style>
