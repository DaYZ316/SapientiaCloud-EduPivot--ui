# Icon 组件使用说明

`Icon` 组件是对 naive-ui 的 `n-icon` 组件的封装，提供了更简洁的使用方式。

## 基本用法

### 1. 直接使用组件

```vue
<template>
  <!-- 使用组件方式 -->
  <Icon :component="HomeOutline" />
  
  <!-- 设置颜色和大小 -->
  <Icon :component="HomeOutline" color="red" :size="24" />
</template>

<script setup lang="ts">
import { HomeOutline } from '@vicons/ionicons5'
</script>
```

### 2. 使用工具函数

```vue
<template>
  <!-- 在需要渲染函数的地方使用 -->
  <n-menu :options="menuOptions" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { HomeOutline, SettingsOutline } from '@vicons/ionicons5'
import { renderIcon } from '@/utils'

const menuOptions = computed(() => [
  {
    label: '首页',
    key: 'home',
    icon: renderIcon(HomeOutline)
  },
  {
    label: '设置',
    key: 'settings',
    icon: renderIcon(SettingsOutline, { color: 'green' })
  }
])
</script>
```

### 3. 使用插槽方式

```vue
<template>
  <Icon color="blue" :size="20">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
      <!-- SVG路径 -->
    </svg>
  </Icon>
</template>
```

## 属性

| 属性名       | 类型            | 默认值  | 说明                 |
|-----------|---------------|------|--------------------|
| color     | String        | null | 图标颜色               |
| size      | Number/String | null | 图标大小               |
| depth     | Number/String | null | 图标深度，用于调整暗色主题下的颜色  |
| component | Component     | null | 图标组件，通常是从图标库中导入的组件 |

## 插槽

| 名称      | 说明                                   |
|---------|--------------------------------------|
| default | 默认插槽，当不使用component属性时可以使用此插槽来自定义图标内容 | 