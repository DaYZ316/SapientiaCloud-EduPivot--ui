<template>
  <transition name="auth-transition">
    <div v-if="show" class="auth-transition-overlay">
      <div class="loading-dots">
        <div class="dot dot-1"></div>
        <div class="dot dot-2"></div>
        <div class="dot dot-3"></div>
        <div class="dot dot-4"></div>
      </div>
    </div>
  </transition>
</template>

<script lang="ts" setup>
import {computed, onBeforeUnmount, watch} from 'vue'
import {useTransitionStore} from '@/store/modules/transition'

const transitionStore = useTransitionStore()

const show = computed(() => transitionStore.showTransition)

// 保存原始的overflow样式，用于恢复
let originalBodyOverflow: string | null = null
let originalHtmlOverflow: string | null = null

// 监听过渡动画状态，控制页面滚动
watch(show, (newValue) => {
  if (newValue) {
    // 保存原始样式
    originalBodyOverflow = document.body.style.overflow
    originalHtmlOverflow = document.documentElement.style.overflow

    // 禁止滚动
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
  } else {
    // 恢复原始样式
    if (originalBodyOverflow !== null) {
      document.body.style.overflow = originalBodyOverflow
    } else {
      document.body.style.overflow = ''
    }

    if (originalHtmlOverflow !== null) {
      document.documentElement.style.overflow = originalHtmlOverflow
    } else {
      document.documentElement.style.overflow = ''
    }
  }
}, {immediate: true})

// 组件卸载时恢复滚动
onBeforeUnmount(() => {
  if (originalBodyOverflow !== null) {
    document.body.style.overflow = originalBodyOverflow
  } else {
    document.body.style.overflow = ''
  }

  if (originalHtmlOverflow !== null) {
    document.documentElement.style.overflow = originalHtmlOverflow
  } else {
    document.documentElement.style.overflow = ''
  }
})
</script>

<style lang="scss" scoped>
.auth-transition-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: var(--background-color);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-dots {
  position: relative;
  width: 60px;
  height: 60px;
}

.dot {
  position: absolute;
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: var(--color-primary);
}

.dot-1 {
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  animation: rotate-dot-1 1.4s ease-in-out infinite;
}

.dot-2 {
  top: 50%;
  right: 0;
  transform: translateY(-50%);
  animation: rotate-dot-2 1.4s ease-in-out infinite;
}

.dot-3 {
  bottom: 0;
  left: 50%;
  transform: translateX(-50%);
  animation: rotate-dot-3 1.4s ease-in-out infinite;
}

.dot-4 {
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  animation: rotate-dot-4 1.4s ease-in-out infinite;
}

@keyframes rotate-dot-1 {
  0% {
    top: 0;
    left: 50%;
    opacity: 0.3;
    transform: translateX(-50%) scale(0.8);
  }
  25% {
    top: 50%;
    left: 100%;
    opacity: 1;
    transform: translate(-50%, -50%) scale(1.2);
  }
  50% {
    top: 100%;
    left: 50%;
    opacity: 0.3;
    transform: translateX(-50%) scale(0.8);
  }
  75% {
    top: 50%;
    left: 0;
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(0.8);
  }
  100% {
    top: 0;
    left: 50%;
    opacity: 0.3;
    transform: translateX(-50%) scale(0.8);
  }
}

@keyframes rotate-dot-2 {
  0% {
    top: 50%;
    right: 0;
    opacity: 0.3;
    transform: translateY(-50%) scale(0.8);
  }
  25% {
    top: 100%;
    right: 50%;
    opacity: 0.3;
    transform: translate(50%, -50%) scale(0.8);
  }
  50% {
    top: 50%;
    right: 100%;
    opacity: 0.3;
    transform: translateY(-50%) scale(0.8);
  }
  75% {
    top: 0;
    right: 50%;
    opacity: 1;
    transform: translate(50%, -50%) scale(1.2);
  }
  100% {
    top: 50%;
    right: 0;
    opacity: 0.3;
    transform: translateY(-50%) scale(0.8);
  }
}

@keyframes rotate-dot-3 {
  0% {
    bottom: 0;
    left: 50%;
    opacity: 0.3;
    transform: translateX(-50%) scale(0.8);
  }
  25% {
    bottom: 50%;
    left: 0;
    opacity: 0.3;
    transform: translate(-50%, 50%) scale(0.8);
  }
  50% {
    bottom: 100%;
    left: 50%;
    opacity: 1;
    transform: translateX(-50%) scale(1.2);
  }
  75% {
    bottom: 50%;
    left: 100%;
    opacity: 0.3;
    transform: translate(-50%, 50%) scale(0.8);
  }
  100% {
    bottom: 0;
    left: 50%;
    opacity: 0.3;
    transform: translateX(-50%) scale(0.8);
  }
}

@keyframes rotate-dot-4 {
  0% {
    top: 50%;
    left: 0;
    opacity: 1;
    transform: translateY(-50%) scale(1.2);
  }
  25% {
    top: 0;
    left: 50%;
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(0.8);
  }
  50% {
    top: 50%;
    left: 100%;
    opacity: 0.3;
    transform: translateY(-50%) scale(0.8);
  }
  75% {
    top: 100%;
    left: 50%;
    opacity: 0.3;
    transform: translate(-50%, 50%) scale(0.8);
  }
  100% {
    top: 50%;
    left: 0;
    opacity: 1;
    transform: translateY(-50%) scale(1.2);
  }
}

.auth-transition-enter-active,
.auth-transition-leave-active {
  transition: opacity 0.3s ease;
}

.auth-transition-enter-from,
.auth-transition-leave-to {
  opacity: 0;
}
</style>
