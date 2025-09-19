# PieChart 饼图组件

基于 ECharts 的 Vue 3 饼图组件，支持自定义颜色、主题切换等功能。

## 功能特性

- 🎨 支持自定义主色调，自动生成延伸颜色
- 🌙 支持明暗主题切换
- 📱 响应式设计，自适应容器大小
- 🎯 丰富的配置选项
- 🔄 数据动态更新
- 📊 多种显示模式

## 基础用法

```vue
<template>
  <PieChart 
    :options="chartOptions" 
    height="400px"
  />
</template>

<script setup lang="ts">
import PieChart from '@/components/common/PieChart.vue'
import type { PieChartOptions } from '@/types/components'

const chartOptions: PieChartOptions = {
  title: '访问来源统计',
  data: [
    { value: 1048, name: '搜索引擎' },
    { value: 735, name: '直接访问' },
    { value: 580, name: '邮件营销' }
  ],
  primaryColor: '#1890ff',
  showLegend: true,
  showLabel: true
}
</script>
```

## Props

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| options | PieChartOptions | - | 图表配置选项 |
| width | string \| number | '100%' | 图表宽度 |
| height | string \| number | '400px' | 图表高度 |
| autoResize | boolean | true | 是否自动调整大小 |

## PieChartOptions

| 属性 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| title | string | - | 图表标题 |
| data | PieChartDataItem[] | - | 图表数据 |
| primaryColor | string | '#1890ff' | 主色调 |
| showLegend | boolean | true | 是否显示图例 |
| showLabel | boolean | true | 是否显示标签 |
| radius | [string, string] | ['40%', '70%'] | 饼图半径 |
| dark | boolean | false | 是否启用暗色主题 |
| colors | string[] | - | 自定义颜色数组 |

## PieChartDataItem

| 属性 | 类型 | 说明 |
|------|------|------|
| value | number | 数值 |
| name | string | 名称 |
| itemStyle | object | 样式配置 |

## 颜色算法

组件使用内置的颜色算法，基于主色调自动生成延伸颜色：

- primary: 主色调
- light: 浅色变体
- lighter: 更浅色变体
- dark: 深色变体
- darker: 更深色变体

当数据项超过5个时，会自动生成更多颜色变体。

## 示例

查看 `PieChartExample.vue` 文件获取更多使用示例。

## 注意事项

1. 确保容器有明确的宽高设置
2. 数据项建议不超过10个，以保证视觉效果
3. 颜色会自动根据主色调生成，也可自定义颜色数组
4. 组件会自动处理响应式更新和内存清理
