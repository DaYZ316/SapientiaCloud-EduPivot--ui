<template>
  <n-icon v-if="component" :color="color" :component="iconComponent" :depth="depth" :size="size"/>
  <n-icon v-else :color="color" :depth="depth" :size="size">
    <slot></slot>
  </n-icon>
</template>

<script lang="ts" setup>
import type {Component} from 'vue'
import {computed} from 'vue'

const props = defineProps({
  // 图标颜色
  color: {
    type: String,
    default: null
  },
  // 图标大小
  size: {
    type: [Number, String],
    default: null
  },
  // 图标深度，用于调整暗色主题下的颜色
  depth: {
    type: [Number, String],
    default: null
  },
  // 图标组件
  component: {
    type: Object as () => Component,
    default: null
  }
})

// 将传入的组件转换为可用的图标组件
const iconComponent = computed(() => props.component || null)
</script> 