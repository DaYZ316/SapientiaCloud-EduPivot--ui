<template>
  <div :class="containerClass" :style="containerStyle" class="loading-spinner">
    <!-- 遮罩层 -->
    <div v-if="mask" :style="maskStyle" class="loading-mask"></div>

    <!-- 自定义加载动画 -->
    <div v-if="type === 'custom'" :style="customSpinnerStyle" class="custom-spinner">
      <div :class="`spinner-${size}`" class="spinner-ring">
        <div class="ring"></div>
        <div class="ring"></div>
        <div class="ring"></div>
        <div class="ring"></div>
      </div>
      <div v-if="title || description" class="loading-text">
        <div v-if="title" class="loading-title">{{ title }}</div>
        <div v-if="description" class="loading-description">{{ description }}</div>
      </div>
    </div>

    <!-- 脉冲加载动画 -->
    <div v-else-if="type === 'pulse'" :style="customSpinnerStyle" class="pulse-spinner">
      <div :class="`pulse-${size}`" class="pulse-dot"></div>
      <div :class="`pulse-${size}`" class="pulse-dot"></div>
      <div :class="`pulse-${size}`" class="pulse-dot"></div>
      <div v-if="title || description" class="loading-text">
        <div v-if="title" class="loading-title">{{ title }}</div>
        <div v-if="description" class="loading-description">{{ description }}</div>
      </div>
    </div>

    <!-- 骨架屏加载 -->
    <div v-else-if="type === 'skeleton'" :style="customSpinnerStyle" class="skeleton-spinner">
      <div class="skeleton-content">
        <div class="skeleton-line skeleton-title"></div>
        <div class="skeleton-line skeleton-text"></div>
        <div class="skeleton-line skeleton-text"></div>
        <div class="skeleton-line skeleton-text-short"></div>
      </div>
    </div>

    <!-- 默认 Naive UI 加载器 -->
    <n-spin v-else :size="size" :style="spinnerStyle">
      <template v-if="showContent" #default>
        <slot>
          <div class="loading-content">
            <div v-if="title" class="loading-title">{{ title }}</div>
            <div v-if="description" class="loading-description">{{ description }}</div>
          </div>
        </slot>
      </template>
    </n-spin>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue'

type LoadingType = 'default' | 'custom' | 'pulse' | 'skeleton'
type LoadingSize = 'small' | 'medium' | 'large'

interface Props {
  /** 加载器类型 */
  type?: LoadingType
  /** 加载器尺寸 */
  size?: LoadingSize
  /** 容器样式类名 */
  containerClass?: string
  /** 加载器样式 */
  spinnerStyle?: string | Record<string, any>
  /** 是否显示内容插槽 */
  showContent?: boolean
  /** 加载标题 */
  title?: string
  /** 加载描述 */
  description?: string
  /** 最小高度 */
  minHeight?: string
  /** 是否居中显示 */
  center?: boolean
  /** 加载器颜色 */
  color?: string
  /** 背景颜色 */
  backgroundColor?: string
  /** 是否显示遮罩 */
  mask?: boolean
  /** 遮罩透明度 */
  maskOpacity?: number
}

const props = withDefaults(defineProps<Props>(), {
  type: 'default',
  size: 'medium',
  containerClass: '',
  spinnerStyle: '',
  showContent: false,
  title: '',
  description: '',
  minHeight: '200px',
  center: true,
  color: '#1890ff',
  backgroundColor: 'transparent',
  mask: false,
  maskOpacity: 0.5
})

// 计算容器样式
const containerStyle = computed(() => {
  const style: Record<string, any> = {
    minHeight: props.minHeight,
    backgroundColor: props.backgroundColor
  }

  if (props.center) {
    style.display = 'flex'
    style.alignItems = 'center'
    style.justifyContent = 'center'
  }

  if (props.mask) {
    style.position = 'relative'
    style.zIndex = 1000
  }

  return style
})

// 计算自定义加载器样式
const customSpinnerStyle = computed(() => {
  const style: Record<string, any> = {}

  if (props.color) {
    style['--loading-color'] = props.color
  }

  return style
})

// 遮罩样式
const maskStyle = computed(() => {
  if (!props.mask) return {}

  return {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: `rgba(255, 255, 255, ${props.maskOpacity})`,
    zIndex: 999
  }
})
</script>

<style lang="scss" scoped>
.loading-spinner {
  width: 100%;
  position: relative;

  // 遮罩样式
  .loading-mask {
    backdrop-filter: blur(2px);
  }

  // 通用文本样式
  .loading-text {
    text-align: center;
    margin-top: 16px;

    .loading-title {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 8px;
      color: var(--text-color-1, #262626);
    }

    .loading-description {
      font-size: 14px;
      color: var(--text-color-3, #8c8c8c);
    }
  }

  // 默认内容样式
  .loading-content {
    text-align: center;
    padding: 20px;

    .loading-title {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 8px;
      color: var(--text-color-1, #262626);
    }

    .loading-description {
      font-size: 14px;
      color: var(--text-color-3, #8c8c8c);
    }
  }

  // 自定义环形加载器
  .custom-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .spinner-ring {
      position: relative;
      display: inline-block;

      .ring {
        position: absolute;
        border: 2px solid transparent;
        border-top: 2px solid var(--loading-color, #1890ff);
        border-radius: 50%;
        animation: spin 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;

        &:nth-child(1) {
          animation-delay: -0.45s;
        }

        &:nth-child(2) {
          animation-delay: -0.3s;
        }

        &:nth-child(3) {
          animation-delay: -0.15s;
        }
      }

      // 尺寸变体
      &.spinner-small {
        width: 20px;
        height: 20px;

        .ring {
          width: 20px;
          height: 20px;
        }
      }

      &.spinner-medium {
        width: 32px;
        height: 32px;

        .ring {
          width: 32px;
          height: 32px;
        }
      }

      &.spinner-large {
        width: 48px;
        height: 48px;

        .ring {
          width: 48px;
          height: 48px;
        }
      }
    }
  }

  // 脉冲加载器
  .pulse-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;

    .pulse-dot {
      display: inline-block;
      border-radius: 50%;
      background-color: var(--loading-color, #1890ff);
      animation: pulse 1.4s ease-in-out infinite both;

      &:nth-child(1) {
        animation-delay: -0.32s;
      }

      &:nth-child(2) {
        animation-delay: -0.16s;
      }

      &:nth-child(3) {
        animation-delay: 0s;
      }

      // 尺寸变体
      &.pulse-small {
        width: 6px;
        height: 6px;
        margin: 0 2px;
      }

      &.pulse-medium {
        width: 8px;
        height: 8px;
        margin: 0 3px;
      }

      &.pulse-large {
        width: 12px;
        height: 12px;
        margin: 0 4px;
      }
    }
  }

  // 骨架屏加载器
  .skeleton-spinner {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;

    .skeleton-content {
      width: 100%;
      max-width: 300px;

      .skeleton-line {
        background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
        background-size: 200% 100%;
        animation: skeleton-loading 1.5s infinite;
        border-radius: 4px;
        margin-bottom: 12px;

        &.skeleton-title {
          height: 20px;
          width: 60%;
        }

        &.skeleton-text {
          height: 16px;
          width: 100%;
        }

        &.skeleton-text-short {
          height: 16px;
          width: 80%;
        }
      }
    }
  }
}

// 动画定义
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%, 80%, 100% {
    transform: scale(0);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes skeleton-loading {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .loading-spinner {
    .loading-text {
      .loading-title {
        font-size: 14px;
      }

      .loading-description {
        font-size: 12px;
      }
    }

    .custom-spinner {
      .spinner-ring {
        &.spinner-large {
          width: 40px;
          height: 40px;

          .ring {
            width: 40px;
            height: 40px;
          }
        }
      }
    }
  }
}

// 暗色主题支持
@media (prefers-color-scheme: dark) {
  .loading-spinner {
    .loading-text {
      .loading-title {
        color: var(--text-color-1, #ffffff);
      }

      .loading-description {
        color: var(--text-color-3, #a6a6a6);
      }
    }

    .skeleton-spinner {
      .skeleton-content {
        .skeleton-line {
          background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
          background-size: 200% 100%;
        }
      }
    }
  }
}
</style>
