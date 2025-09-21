<template>
  <div :class="containerClass" :style="containerStyle" class="loading-spinner">
    <n-spin :size="size" :style="spinnerStyle">
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
import type {SpinProps} from 'naive-ui'

interface Props {
  /** 加载器尺寸 */
  size?: SpinProps['size']
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
}

const props = withDefaults(defineProps<Props>(), {
  size: 'large',
  containerClass: '',
  spinnerStyle: '',
  showContent: false,
  title: '',
  description: '',
  minHeight: '200px',
  center: true
})

// 计算容器样式
const containerStyle = computed(() => {
  const style: Record<string, any> = {
    minHeight: props.minHeight
  }

  if (props.center) {
    style.display = 'flex'
    style.alignItems = 'center'
    style.justifyContent = 'center'
  }

  return style
})
</script>

<style lang="scss" scoped>
.loading-spinner {
  width: 100%;

  .loading-content {
    text-align: center;
    padding: 20px;

    .loading-title {
      font-size: 16px;
      font-weight: 500;
      margin-bottom: 8px;
      color: var(--text-color-1);
    }

    .loading-description {
      font-size: 14px;
      color: var(--text-color-3);
    }
  }
}
</style>
