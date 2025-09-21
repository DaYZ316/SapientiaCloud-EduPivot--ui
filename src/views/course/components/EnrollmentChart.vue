<template>
  <div :style="{ '--dynamic-border-color': borderColor }" class="student-enrollment-trend-chart">
    <div class="chart-card">
      <div class="chart-title">{{ t('course.enrollment.title') }}</div>
      <div ref="chartRef" class="chart-container"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import type {EChartsOption} from 'echarts'
import * as echarts from 'echarts'
import {useThemeStore} from '@/store/modules/theme'
import {useColorAlgorithm} from '@/composables/useColorAlgorithm'
import {useCourseBorderColor} from '../composables/useCourseBorderColor'
import {useCourseStudentData} from '../composables/useCourseStudentData'

// 定义学生入课趋势图表数据项类型
interface StudentEnrollmentTrendDataItem {
  /** 日期 */
  date: string
  /** 入课人数（柱状图） */
  enrollmentCount: number
  /** 累计学生数量（折线图） */
  totalStudentCount: number
}

// 定义组件属性
interface Props {
  /** 课程ID */
  courseId?: string
  /** 数据源（可选，如果提供则使用提供的数据，否则从API加载） */
  data?: StudentEnrollmentTrendDataItem[]
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
const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null
const enrollmentData = ref<StudentEnrollmentTrendDataItem[]>([])

// 使用课程学生数据composable
const {students} = useCourseStudentData(props.courseId)

// 国际化
const {t} = useI18n()

// 主题和颜色算法
const themeStore = useThemeStore()
const {getThemeColor, adjustLightness, hexToRgb} = useColorAlgorithm()

// 使用课程边框颜色composable
const {borderColor} = useCourseBorderColor(props.courseType)

// 计算属性
const isDark = computed(() => themeStore.isDarkMode)

// 基于primary颜色生成折线图的颜色

const lineColor = computed(() => {
  const primaryColor = getThemeColor('primary')
  const rgb = hexToRgb(primaryColor)
  if (!rgb) return primaryColor

  // 折线图使用较深的颜色（减少亮度）
  return adjustLightness(rgb.r, rgb.g, rgb.b, -15)
})

// 移除未使用的barHoverColor计算属性

const lineHoverColor = computed(() => {
  const primaryColor = getThemeColor('primary')
  const rgb = hexToRgb(primaryColor)
  if (!rgb) return primaryColor

  // 折线图悬停时使用更深的颜色
  return adjustLightness(rgb.r, rgb.g, rgb.b, -25)
})

// 图表配置
const chartOption = computed((): EChartsOption => {
  const dates = enrollmentData.value.map(item => item.date)
  const enrollmentValues = enrollmentData.value.map(item => item.enrollmentCount)
  const totalStudentValues = enrollmentData.value.map(item => item.totalStudentCount)

  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      backgroundColor: isDark.value ? 'rgba(50, 50, 50, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      borderColor: isDark.value ? '#666' : '#ddd',
      textStyle: {
        color: isDark.value ? '#fff' : '#333'
      },
      formatter: (params: any) => {
        let result = `${params[0].axisValue}<br/>`
        params.forEach((param: any) => {
          const color = param.color
          const marker = `<span style="display:inline-block;margin-right:4px;border-radius:10px;width:10px;height:10px;background-color:${color};"></span>`
          result += `${marker}${param.seriesName}: ${param.value}<br/>`
        })
        return result
      }
    },
    legend: {
      data: [t('course.enrollment.barSeriesName'), t('course.enrollment.lineSeriesName')],
      top: '5%',
      textStyle: {
        color: isDark.value ? '#ccc' : '#666'
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '15%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      boundaryGap: true,
      data: dates,
      axisLine: {
        lineStyle: {
          color: isDark.value ? '#666' : '#ddd'
        }
      },
      axisLabel: {
        color: isDark.value ? '#ccc' : '#666',
        fontSize: 12
      }
    },
    yAxis: [
      {
        type: 'value',
        name: t('course.enrollment.enrollmentCount'),
        position: 'left',
        axisLine: {
          lineStyle: {
            color: isDark.value ? '#666' : '#ddd'
          }
        },
        axisLabel: {
          color: isDark.value ? '#ccc' : '#666',
          fontSize: 12
        },
        splitLine: {
          lineStyle: {
            color: isDark.value ? '#333' : '#f0f0f0'
          }
        }
      },
      {
        type: 'value',
        name: t('course.enrollment.totalStudents'),
        position: 'right',
        axisLine: {
          lineStyle: {
            color: isDark.value ? '#666' : '#ddd'
          }
        },
        axisLabel: {
          color: isDark.value ? '#ccc' : '#666',
          fontSize: 12
        },
        splitLine: {
          show: false
        }
      }
    ],
    series: [
      {
        name: t('course.enrollment.barSeriesName'),
        type: 'bar',
        yAxisIndex: 0,
        data: enrollmentValues,
        barWidth: '50%',
        itemStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: getThemeColor('primary')
              },
              {
                offset: 0.7,
                color: `${getThemeColor('primary')}80`
              },
              {
                offset: 1,
                color: `${getThemeColor('primary')}60`
              }
            ]
          },
          borderRadius: [6, 6, 0, 0]
        },
        emphasis: {
          itemStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: getThemeColor('primary')
                },
                {
                  offset: 0.7,
                  color: getThemeColor('primary')
                },
                {
                  offset: 1,
                  color: `${getThemeColor('primary')}70`
                }
              ]
            }
          }
        }
      },
      {
        name: t('course.enrollment.lineSeriesName'),
        type: 'line',
        yAxisIndex: 1,
        smooth: true,
        symbol: 'circle',
        symbolSize: 6,
        lineStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 1,
            y2: 0,
            colorStops: [
              {
                offset: 0,
                color: getThemeColor('primary')
              },
              {
                offset: 0.4,
                color: getThemeColor('primary')
              },
              {
                offset: 0.5,
                color: '#ff6b6b'
              },
              {
                offset: 0.65,
                color: '#4ecdc4'
              },
              {
                offset: 0.8,
                color: '#45b7d1'
              },
              {
                offset: 0.9,
                color: '#96ceb4'
              },
              {
                offset: 1,
                color: '#feca57'
              }
            ]
          },
          width: 3
        },
        itemStyle: {
          color: lineColor.value,
          borderColor: isDark.value ? '#fff' : '#fff',
          borderWidth: 2
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              {
                offset: 0,
                color: `${getThemeColor('primary')}40`
              },
              {
                offset: 1,
                color: `${getThemeColor('primary')}10`
              }
            ]
          }
        },
        data: totalStudentValues,
        emphasis: {
          itemStyle: {
            color: lineHoverColor.value,
            borderColor: isDark.value ? '#fff' : '#fff',
            borderWidth: 3,
            shadowBlur: 10,
            shadowColor: `${lineColor.value}50`
          }
        }
      }
    ]
  }
})

// 处理学生数据，生成入课趋势数据
const processEnrollmentData = () => {
  if (!students.value || students.value.length === 0) {
    enrollmentData.value = []
    return
  }

  // 按入课时间分组统计
  const enrollmentMap = new Map<string, number>()

  students.value.forEach((student) => {
    if (student.createTime) {
      const date = new Date(student.createTime).toISOString().split('T')[0]
      enrollmentMap.set(date, (enrollmentMap.get(date) || 0) + 1)
    }
  })

  // 转换为图表数据格式并按日期排序
  const sortedData = Array.from(enrollmentMap.entries())
      .map(([date, count]) => ({
        date,
        enrollmentCount: count,
        totalStudentCount: 0 // 先设置为0，后面计算累计值
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())

  // 计算累计学生数量
  let cumulativeCount = 0
  enrollmentData.value = sortedData.map(item => {
    cumulativeCount += item.enrollmentCount
    return {
      ...item,
      totalStudentCount: cumulativeCount
    }
  })
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value) return

  // 销毁已存在的图表实例
  if (chartInstance) {
    chartInstance.dispose()
  }

  // 创建新的图表实例
  const theme = isDark.value ? 'dark' : 'light'
  chartInstance = echarts.init(chartRef.value, theme)

  // 设置配置
  const option = chartOption.value
  chartInstance.setOption(option)

  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
}

// 处理窗口大小变化
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

// 更新图表
const updateChart = () => {
  if (!chartInstance) return

  chartInstance.setOption(chartOption.value, true)
}

// 销毁图表
const destroyChart = () => {
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
  window.removeEventListener('resize', handleResize)
}

// 监听主题变化
watch(isDark, () => {
  nextTick(() => {
    initChart()
  })
})

// 监听学生数据变化，处理入课趋势数据
watch(students, () => {
  processEnrollmentData()
}, {deep: true})

// 监听处理后的数据变化
watch(enrollmentData, () => {
  updateChart()
}, {deep: true})

// 监听props.data变化
watch(() => props.data, (newData) => {
  if (newData && newData.length > 0) {
    enrollmentData.value = newData
  }
}, {deep: true})

// 生命周期
onMounted(async () => {
  await nextTick()
  initChart()

  // 如果提供了数据，使用提供的数据；否则使用composable中的数据
  if (props.data && props.data.length > 0) {
    enrollmentData.value = props.data
  } else {
    // 处理从composable获取的学生数据
    processEnrollmentData()
  }
})

onUnmounted(() => {
  destroyChart()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.student-enrollment-trend-chart {
  width: 100%;
  height: 100%;
  position: relative;

  .chart-card {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, var(--background-secondary-color) 0%, var(--background-tertiary-color) 100%) padding-box,
    linear-gradient(90deg, v-bind('getThemeColor("primary")') 0%, v-bind('getThemeColor("primary")') 40%, #ff6b6b 50%, #4ecdc4 65%, #45b7d1 80%, #96ceb4 90%, v-bind('borderColor') 100%) border-box;
    border: 2px solid transparent;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    position: relative;
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);
    display: flex;
    flex-direction: column;
    padding: 20px;


    .chart-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-color);
      margin-bottom: 16px;
      text-align: center;
      position: relative;
      z-index: 10;
    }


    .chart-container {
      flex: 1;
      min-height: 300px;
      width: 100%;
      position: relative;

    }
  }
}


// 暗色主题下的边框效果
:global(.dark) .student-enrollment-trend-chart .chart-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

// 响应式适配
@media (max-width: 768px) {
  .student-enrollment-trend-chart {
    .chart-card {
      border-radius: 12px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      .chart-title {
        font-size: 14px;
        padding: 3px 10px;
      }

      .chart-container {
        padding: 6px;
        min-height: 250px;
      }
    }
  }
}

@media (max-width: 480px) {
  .student-enrollment-trend-chart {
    .chart-card {
      border-radius: 10px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);

      .chart-title {
        font-size: 13px;
        padding: 2px 8px;
      }

      .chart-container {
        padding: 4px;
        min-height: 200px;
      }
    }
  }
}

// 超小屏幕优化
@media (max-width: 320px) {
  .student-enrollment-trend-chart {
    .chart-card {
      border-radius: 8px;

      .chart-title {
        font-size: 12px;
        padding: 2px 6px;
      }
    }
  }
}
</style>
