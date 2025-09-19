<template>
  <div 
    ref="chartContainer" 
    :style="{ width: width, height: height }"
    class="pie-chart-container"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { generateColorVariants } from '@/utils/colorAlgorithm'
import type { PieChartProps, PieChartDataItem } from '@/types/components'

// 组件Props
const props = withDefaults(defineProps<PieChartProps>(), {
  width: '100%',
  height: '400px',
  autoResize: true
})

// 图表实例和容器引用
const chartContainer = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null

// 生成颜色数组
const generateColors = (primaryColor: string, dataLength: number): string[] => {
  const variants = generateColorVariants(primaryColor)
  const colors = [
    variants.primary,
    variants.light,
    variants.lighter,
    variants.dark,
    variants.darker
  ]
  
  // 如果数据项超过5个，生成更多颜色变体
  if (dataLength > 5) {
    const additionalColors = []
    for (let i = 5; i < dataLength; i++) {
      const factor = (i - 4) * 0.1
      const hex = primaryColor.replace('#', '')
      const r = parseInt(hex.substr(0, 2), 16)
      const g = parseInt(hex.substr(2, 2), 16)
      const b = parseInt(hex.substr(4, 2), 16)
      
      // 生成渐变色
      const newR = Math.min(255, Math.max(0, r + (Math.random() - 0.5) * 50))
      const newG = Math.min(255, Math.max(0, g + (Math.random() - 0.5) * 50))
      const newB = Math.min(255, Math.max(0, b + (Math.random() - 0.5) * 50))
      
      additionalColors.push(`#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`)
    }
    colors.push(...additionalColors)
  }
  
  return colors.slice(0, dataLength)
}

// 创建图表配置
const createChartOption = (): EChartsOption => {
  const { options } = props
  const primaryColor = options.primaryColor || '#1890ff'
  const colors = options.colors || generateColors(primaryColor, options.data.length)
  
  // 为数据项添加颜色
  const dataWithColors: PieChartDataItem[] = options.data.map((item, index) => ({
    ...item,
    itemStyle: {
      color: colors[index % colors.length]
    }
  }))

  return {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      show: options.showLegend !== false,
      top: '5%',
      left: 'center',
      textStyle: {
        color: options.dark ? '#ffffff' : '#333333'
      }
    },
    title: options.title ? {
      text: options.title,
      left: 'center',
      top: '2%',
      textStyle: {
        color: options.dark ? '#ffffff' : '#333333',
        fontSize: 16,
        fontWeight: 'bold'
      }
    } : undefined,
    series: [
      {
        name: options.title || '数据',
        type: 'pie',
        radius: options.radius || ['40%', '70%'],
        avoidLabelOverlap: false,
        padAngle: 5,
        itemStyle: {
          borderRadius: 10,
          borderColor: options.dark ? '#333333' : '#ffffff',
          borderWidth: 2
        },
        label: {
          show: options.showLabel !== false,
          position: 'outside',
          formatter: '{b}: {d}%',
          color: options.dark ? '#ffffff' : '#333333'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        labelLine: {
          show: options.showLabel !== false,
          lineStyle: {
            color: options.dark ? '#666666' : '#999999'
          }
        },
        data: dataWithColors
      }
    ]
  }
}

// 初始化图表
const initChart = async () => {
  if (!chartContainer.value) return
  
  await nextTick()
  
  // 销毁已存在的图表实例
  if (chartInstance) {
    chartInstance.dispose()
  }
  
  // 创建新的图表实例
  chartInstance = echarts.init(chartContainer.value, props.options.dark ? 'dark' : undefined)
  
  // 设置图表配置
  const option = createChartOption()
  chartInstance.setOption(option)
  
  // 自动调整大小
  if (props.autoResize) {
    window.addEventListener('resize', handleResize)
  }
}

// 处理窗口大小变化
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

// 更新图表
const updateChart = () => {
  if (chartInstance) {
    const option = createChartOption()
    chartInstance.setOption(option, true)
  }
}

// 监听配置变化
watch(
  () => props.options,
  () => {
    updateChart()
  },
  { deep: true }
)

// 监听容器大小变化
watch(
  [() => props.width, () => props.height],
  () => {
    nextTick(() => {
      if (chartInstance) {
        chartInstance.resize()
      }
    })
  }
)

// 组件挂载
onMounted(() => {
  initChart()
})

// 组件卸载
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  window.removeEventListener('resize', handleResize)
})

// 暴露方法给父组件
defineExpose({
  getChartInstance: () => chartInstance,
  resize: handleResize,
  updateChart
})
</script>

<style lang="scss" scoped>
.pie-chart-container {
  width: 100%;
  height: 100%;
}
</style>
