<template>
  <div :style="{ '--dynamic-border-color': borderColor }" class="teacher-education-chart">
    <div class="chart-card">
      <div class="chart-title">{{ t('course.teacherEducation.title') }}</div>
      <div v-if="hasData" ref="chartRef" class="chart-container"></div>
      <div v-else class="no-data-container">
        <div class="no-data-icon">
          <n-icon color="var(--text-color-disabled)" size="48">
            <svg fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path
                  d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2ZM21 9V7L15 1H5C3.89 1 3 1.89 3 3V21C3 22.11 3.89 23 5 23H19C20.11 23 21 22.11 21 21V9M19 9H14V4H5V21H19V9Z"
                  fill="currentColor"/>
            </svg>
          </n-icon>
        </div>
        <div class="no-data-text">{{ t('common.noData') }}</div>
        <div class="no-data-description">{{ t('course.teacherEducation.noDataDescription') }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {nextTick, onMounted, onUnmounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import type {EChartsOption} from 'echarts'
import * as echarts from 'echarts'
import {NIcon} from 'naive-ui'
import {useThemeStore} from '@/store/modules/theme'
import {useColorAlgorithm} from '@/composables/useColorAlgorithm'
import {useCourseBorderColor} from '../composables/useCourseBorderColor'
import {type PieChartDataItem, useTeacherEducationData} from '../composables/useTeacherEducationData'


// 定义组件属性
interface Props {
  /** 课程ID */
  courseId?: string
  /** 数据源（可选，如果提供则使用提供的数据，否则从API加载） */
  data?: PieChartDataItem[]
  /** 是否加载中 */
  loading?: boolean
  /** 课程类型 */
  courseType?: number
}

// 接收属性
const props = withDefaults(defineProps<Props>(), {
  courseId: '',
  data: () => [],
  loading: false,
  courseType: 0
})

// 响应式数据
const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null

// 国际化
const {t, locale} = useI18n()

// 主题store
const themeStore = useThemeStore()

// 颜色算法
const {themeColorPalette} = useColorAlgorithm()

// 使用课程边框颜色composable
const {borderColor} = useCourseBorderColor(props.courseType)

// 使用教师学历分布数据composable
const {
  educationData,
  hasData
} = useTeacherEducationData(props.courseId, props.data)


// 获取图表配置
function getChartOption(): EChartsOption {
  const isDark = themeStore.isDarkMode
  const primaryColor = themeStore.primaryColor
  const textColor = isDark ? '#ffffff' : '#000000'
  const backgroundColor = isDark ? 'rgba(31, 31, 31, 0.8)' : 'rgba(255, 255, 255, 0.8)'

  // 使用计算的数据
  const chartData = educationData.value

  // 使用颜色算法生成的主题颜色
  const colors = isDark ? themeColorPalette.value.dark : themeColorPalette.value.light

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      backgroundColor,
      borderColor: primaryColor,
      textStyle: {
        color: textColor
      },
      formatter: (params: any) => {
        const percentage = ((params.value / chartData.reduce((sum, item) => sum + item.value, 0)) * 100).toFixed(1)
        return `${params.name}: ${params.value}人 (${percentage}%)`
      }
    },
    legend: {
      top: 'center',
      right: '5%',
      orient: 'vertical',
      textStyle: {
        color: textColor
      }
    },
    series: [
      {
        name: t('course.teacherEducation.title'),
        type: 'pie',
        radius: ['40%', '70%'],
        center: ['35%', '50%'],
        avoidLabelOverlap: false,
        padAngle: 5,
        itemStyle: {
          borderRadius: 10,
          shadowBlur: 8,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowColor: primaryColor + '40'
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 16,
            fontWeight: 'bold',
            color: textColor
          },
          itemStyle: {
            shadowBlur: 20,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: primaryColor + '80'
          }
        },
        labelLine: {
          show: false
        },
        data: chartData.map((item, index) => ({
          ...item,
          itemStyle: {
            color: item.itemStyle?.color || colors[index % colors.length],
            shadowBlur: isDark ? 12 : 20,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: isDark ? (item.itemStyle?.color || colors[index % colors.length]) + '60' : primaryColor + '80'
          }
        }))
      }
    ]
  }
}

// 初始化图表
function initChart() {
  if (!chartRef.value || !hasData.value) return

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

  const option = getChartOption()
  chartInstance.setOption(option)
}

// 监听数据变化
watch(() => props.data, updateChart, {deep: true})

// 监听教师数据变化
watch(educationData, updateChart, {deep: true})

// 监听数据状态变化
watch(hasData, (newHasData) => {
  if (newHasData) {
    nextTick(() => {
      initChart()
    })
  } else {
    if (chartInstance) {
      chartInstance.dispose()
      chartInstance = null
    }
  }
})


// 监听语言变化
watch(() => locale.value, () => {
  nextTick(() => {
    updateChart()
  })
})

// 监听主题变化
watch(() => themeStore.isDarkMode, () => {
  nextTick(() => {
    initChart()
  })
})

watch(() => themeStore.primaryColor, () => {
  if (chartInstance) {
    updateChart()
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
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.teacher-education-chart {
  width: 100%;
  height: 100%;
  position: relative;

  .chart-card {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, var(--background-secondary-color) 0%, var(--background-tertiary-color) 100%) padding-box,
    radial-gradient(circle at center, var(--dynamic-border-color, var(--primary-color)) 0%, transparent 70%, var(--primary-color) 100%) border-box;
    border: 2px solid transparent;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    position: relative;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);


    .chart-title {
      position: absolute;
      top: 16px;
      left: 20px;
      font-size: 20px;
      font-weight: 600;
      color: var(--text-color);
      z-index: 10;
    }


    .chart-container {
      width: 100%;
      height: 300px;
      position: relative;
      padding: 8px 8px 8px 8px;
      margin-top: 20px;
    }

    .no-data-container {
      width: 100%;
      height: 300px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      padding: 20px;
      margin-top: 20px;

      .no-data-icon {
        margin-bottom: 16px;
        opacity: 0.6;
      }

      .no-data-text {
        font-size: 16px;
        font-weight: 500;
        color: var(--text-color-disabled);
        margin-bottom: 8px;
      }

      .no-data-description {
        font-size: 14px;
        color: var(--text-color-disabled);
        text-align: center;
        line-height: 1.5;
        opacity: 0.8;
      }
    }
  }
}


// 暗色主题下的边框效果
:global(.dark) .teacher-education-chart .chart-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

// 响应式适配
@media (max-width: 768px) {
  .teacher-education-chart {
    .chart-card {
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      .chart-title {
        top: 12px;
        left: 16px;
        font-size: 14px;
        padding: 3px 10px;
      }

      .chart-container {
        padding: 6px;
        height: 300px;
      }
    }
  }
}

@media (max-width: 480px) {
  .teacher-education-chart {
    .chart-card {
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      .chart-title {
        top: 10px;
        left: 12px;
        font-size: 13px;
        padding: 2px 8px;
      }

      .chart-container {
        padding: 4px;
        height: 300px;
      }
    }
  }
}

// 超小屏幕优化
@media (max-width: 320px) {
  .teacher-education-chart {
    .chart-card {
      border-radius: 8px;

      .chart-title {
        top: 8px;
        left: 10px;
        font-size: 12px;
        padding: 2px 6px;
      }
    }
  }
}
</style>
