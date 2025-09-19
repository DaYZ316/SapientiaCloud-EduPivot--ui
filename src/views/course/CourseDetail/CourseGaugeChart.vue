<template>
  <div class="course-gauge-chart">
    <div ref="chartRef" class="chart-container"></div>
  </div>
</template>

<script lang="ts" setup>
import {nextTick, onMounted, onUnmounted, ref, watch} from 'vue'
import * as echarts from 'echarts'
import {useThemeStore} from '@/store/modules/theme'

// 定义组件属性
interface Props {
  value?: number
  max?: number
  title?: string
  unit?: string
}

// 接收属性
const props = withDefaults(defineProps<Props>(), {
  value: 0,
  max: 100,
  title: '课程进度',
  unit: '%'
})

// 响应式数据
const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null
let intervalId: number | null = null

// 主题store
const themeStore = useThemeStore()

// 图表配置常量
const _animationDuration = 1000
const _animationDurationUpdate = 1000
const _animationEasingUpdate = 'quarticInOut' as const
const _valOnRadianMax = 200
const _outerRadius = 80
const _innerRadius = 65
const _pointerInnerRadius = 15
const _insidePanelRadius = 55

// 渲染函数
function renderItem(params: any, api: any) {
  const valOnRadian = api.value(1)
  const coords = api.coord([api.value(0), valOnRadian])
  const polarEndRadian = coords[3]

  // 根据主题获取颜色
  const isDark = themeStore.isDarkMode
  const primaryColor = themeStore.primaryColor
  const textColor = isDark ? '#ffffff' : '#000000'

  return {
    type: 'group',
    children: [
      // 背景圆环 - 透明
      {
        type: 'sector',
        shape: {
          cx: params.coordSys.cx,
          cy: params.coordSys.cy,
          r: _outerRadius,
          r0: _innerRadius,
          startAngle: 0,
          endAngle: Math.PI * 2
        },
        style: {
          fill: 'transparent',
          stroke: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
          lineWidth: 1
        }
      },
      // 进度圆环 - 使用白色到primary颜色的渐变，白色在起始段
      {
        type: 'sector',
        shape: {
          cx: params.coordSys.cx,
          cy: params.coordSys.cy,
          r: _outerRadius,
          r0: _innerRadius,
          startAngle: 0,
          endAngle: -polarEndRadian,
          transition: 'endAngle',
          enterFrom: {endAngle: 0}
        },
        style: {
          fill: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: primaryColor
              },
              {
                offset: 0.3,
                color: primaryColor + '80'
              },
              {
                offset: 0.9,
                color: '#ffffff'
              },
              {
                offset: 1,
                color: '#ffffff'
              }
            ]
          },
          shadowBlur: 25,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowColor: primaryColor + '80'
        }
      },
      // 指针
      {
        type: 'polygon',
        shape: {
          points: makePointerPoints(params, polarEndRadian)
        },
        style: {
          fill: primaryColor,
          stroke: '#ffffff',
          lineWidth: 2,
          shadowBlur: 15,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowColor: primaryColor + '80'
        },
        extra: {
          polarEndRadian: polarEndRadian,
          transition: 'polarEndRadian',
          enterFrom: {polarEndRadian: 0}
        },
        during: function (apiDuring: any) {
          apiDuring.setShape(
              'points',
              makePointerPoints(params, apiDuring.getExtra('polarEndRadian'))
          )
        }
      },
      {
        type: 'circle',
        shape: {
          cx: params.coordSys.cx,
          cy: params.coordSys.cy,
          r: _insidePanelRadius
        },
        style: {
          fill: isDark ? '#1f1f1f' : '#ffffff',
          shadowBlur: 30,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowColor: primaryColor + '60'
        }
      },
      {
        type: 'text',
        extra: {
          valOnRadian: valOnRadian,
          transition: 'valOnRadian',
          enterFrom: {valOnRadian: 0}
        },
        style: {
          text: makeText(valOnRadian),
          fontSize: 24,
          fontWeight: 700,
          x: params.coordSys.cx,
          y: params.coordSys.cy - 5,
          fill: primaryColor,
          align: 'center',
          verticalAlign: 'middle',
          enterFrom: {opacity: 0}
        },
        during: function (apiDuring: any) {
          apiDuring.setStyle(
              'text',
              makeText(apiDuring.getExtra('valOnRadian'))
          )
        }
      },
      {
        type: 'text',
        style: {
          text: props.unit,
          fontSize: 12,
          fontWeight: 500,
          x: params.coordSys.cx,
          y: params.coordSys.cy + 15,
          fill: textColor,
          align: 'center',
          verticalAlign: 'middle'
        }
      }
    ]
  }
}

// 转换极坐标点
function convertToPolarPoint(renderItemParams: any, radius: number, radian: number) {
  return [
    Math.cos(radian) * radius + renderItemParams.coordSys.cx,
    -Math.sin(radian) * radius + renderItemParams.coordSys.cy
  ]
}

// 创建指针点
function makePointerPoints(renderItemParams: any, polarEndRadian: number) {
  return [
    convertToPolarPoint(renderItemParams, _outerRadius, polarEndRadian),
    convertToPolarPoint(
        renderItemParams,
        _outerRadius,
        polarEndRadian + Math.PI * 0.03
    ),
    convertToPolarPoint(renderItemParams, _pointerInnerRadius, polarEndRadian)
  ]
}

// 创建文本
function makeText(valOnRadian: number) {
  const percentage = ((valOnRadian / _valOnRadianMax) * props.max).toFixed(0)
  return percentage
}

// 获取图表配置
function getChartOption() {
  const isDark = themeStore.isDarkMode
  const primaryColor = themeStore.primaryColor
  const textColor = isDark ? '#ffffff' : '#000000'

  return {
    animationEasing: _animationEasingUpdate,
    animationDuration: _animationDuration,
    animationDurationUpdate: _animationDurationUpdate,
    animationEasingUpdate: _animationEasingUpdate,
    backgroundColor: 'transparent',
    dataset: {
      source: [[1, (props.value / props.max) * _valOnRadianMax]]
    },
    tooltip: {
      show: true,
      formatter: (params: any) => {
        const value = ((params.data[1] / _valOnRadianMax) * props.max).toFixed(1)
        return `${props.title}: ${value}${props.unit}`
      },
      backgroundColor: isDark ? 'rgba(31, 31, 31, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      borderColor: primaryColor,
      textStyle: {
        color: textColor
      }
    },
    angleAxis: {
      type: 'value',
      startAngle: 0,
      show: false,
      min: 0,
      max: _valOnRadianMax
    },
    radiusAxis: {
      type: 'value',
      show: false
    },
    polar: {},
    series: [
      {
        type: 'custom',
        coordinateSystem: 'polar',
        renderItem: renderItem
      }
    ]
  }
}

// 初始化图表
function initChart() {
  if (!chartRef.value) return

  // 销毁已存在的图表实例
  if (chartInstance) {
    chartInstance.dispose()
  }

  // 创建新的图表实例
  const theme = themeStore.isDarkMode ? 'dark' : 'light'
  chartInstance = echarts.init(chartRef.value, theme)

  // 设置配置
  const option = getChartOption()
  chartInstance.setOption(option)

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
}

// 处理窗口大小变化
function handleResize() {
  if (chartInstance) {
    chartInstance.resize()
  }
}

// 更新图表数据
function updateChart() {
  if (!chartInstance) return

  const newValue = (props.value / props.max) * _valOnRadianMax
  chartInstance.setOption({
    dataset: {
      source: [[1, newValue]]
    }
  })
}

// 监听属性变化
watch(() => props.value, updateChart)
watch(() => props.max, updateChart)

// 监听主题变化
watch(() => themeStore.isDarkMode, () => {
  nextTick(() => {
    initChart()
  })
})

watch(() => themeStore.primaryColor, () => {
  if (chartInstance) {
    const option = getChartOption()
    chartInstance.setOption(option)
  }
})

// 组件挂载
onMounted(() => {
  nextTick(() => {
    initChart()
  })
})

// 组件卸载
onUnmounted(() => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  window.removeEventListener('resize', handleResize)
  if (intervalId) {
    clearInterval(intervalId)
  }
})
</script>

<style lang="scss" scoped>
.course-gauge-chart {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  .chart-container {
    width: 200px;
    height: 200px;
    position: relative;
    
    // 添加外圈荧光效果
    &::before {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 110%;
      height: 110%;
      transform: translate(-50%, -50%);
      background: radial-gradient(
        circle,
        rgba(var(--primary-color-rgb, 76, 107, 167), 0.15) 0%,
        rgba(var(--primary-color-rgb, 76, 107, 167), 0.08) 40%,
        transparent 70%
      );
      border-radius: 50%;
      animation: gauge-glow 2.5s ease-in-out infinite;
      pointer-events: none;
      z-index: -1;
    }
    
    // 添加内圈荧光效果
    &::after {
      content: '';
      position: absolute;
      top: 50%;
      left: 50%;
      width: 80%;
      height: 80%;
      transform: translate(-50%, -50%);
      background: radial-gradient(
        circle,
        rgba(var(--primary-color-rgb, 76, 107, 167), 0.1) 0%,
        transparent 60%
      );
      border-radius: 50%;
      animation: inner-glow 2s ease-in-out infinite reverse;
      pointer-events: none;
      z-index: -1;
    }
  }
}

// 仪表盘外圈荧光动画
@keyframes gauge-glow {
  0%, 100% {
    opacity: 0.4;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.8;
    transform: translate(-50%, -50%) scale(1.05);
  }
}

// 仪表盘内圈荧光动画
@keyframes inner-glow {
  0%, 100% {
    opacity: 0.2;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.5;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

// 暗色主题下的荧光效果
:global(.dark) .course-gauge-chart .chart-container {
  &::before {
    background: radial-gradient(
      circle,
      rgba(var(--primary-color-rgb, 76, 107, 167), 0.25) 0%,
      rgba(var(--primary-color-rgb, 76, 107, 167), 0.12) 40%,
      transparent 70%
    );
  }
  
  &::after {
    background: radial-gradient(
      circle,
      rgba(var(--primary-color-rgb, 76, 107, 167), 0.15) 0%,
      transparent 60%
    );
  }
}
</style>
