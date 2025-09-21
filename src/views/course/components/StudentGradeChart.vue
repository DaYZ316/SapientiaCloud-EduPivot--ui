<template>
  <div :style="{ '--dynamic-border-color': borderColor }" class="student-grade-chart">
    <div class="chart-card">
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
// import { useColorAlgorithm } from '@/composables/useColorAlgorithm'
import {useCourseBorderColor} from '../composables/useCourseBorderColor'
import {useCourseStudentData} from '../composables/useCourseStudentData'

// 定义成绩分布数据项类型
interface GradeDistributionDataItem {
  /** 成绩区间 */
  range: string
  /** 学生数量 */
  count: number
  /** 颜色（可选） */
  itemStyle?: {
    color?: string
  }
}

// 定义组件属性
interface Props {
  /** 课程ID */
  courseId?: string
  /** 数据源（可选，如果提供则使用提供的数据，否则从API加载） */
  data?: GradeDistributionDataItem[]
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

// 使用课程学生数据composable
const {students} = useCourseStudentData(props.courseId)

// 国际化
const {t, locale} = useI18n()

// 主题store
const themeStore = useThemeStore()

// 颜色算法（暂时不使用，使用自定义成绩等级颜色）
// const { themeColorPalette } = useColorAlgorithm()

// 使用课程边框颜色composable
const {borderColor} = useCourseBorderColor(props.courseType)

// 计算成绩分布数据
const gradeData = computed(() => {
  if (props.data.length > 0) {
    return props.data
  }

  if (students.value.length === 0) {
    return []
  }

  // 定义成绩区间
  const gradeRanges = [
    {min: 0, max: 59, label: t('course.studentGrade.ranges.fail')},
    {min: 60, max: 69, label: t('course.studentGrade.ranges.pass')},
    {min: 70, max: 79, label: t('course.studentGrade.ranges.good')},
    {min: 80, max: 89, label: t('course.studentGrade.ranges.veryGood')},
    {min: 90, max: 100, label: t('course.studentGrade.ranges.excellent')}
  ]

  // 统计各成绩区间人数
  const rangeCount = gradeRanges.map(range => ({
    range: range.label,
    count: 0
  }))

  students.value.forEach(student => {
    if (student.grade !== null && student.grade !== undefined) {
      const grade = student.grade
      const rangeIndex = gradeRanges.findIndex(range => grade >= range.min && grade <= range.max)
      if (rangeIndex !== -1) {
        rangeCount[rangeIndex].count++
      }
    }
  })

  // 过滤掉人数为0的区间
  return rangeCount.filter(item => item.count > 0)
})

// 获取图表配置
function getChartOption(): EChartsOption {
  const isDark = themeStore.isDarkMode
  const primaryColor = themeStore.primaryColor
  const textColor = isDark ? '#ffffff' : '#000000'
  const backgroundColor = isDark ? 'rgba(31, 31, 31, 0.8)' : 'rgba(255, 255, 255, 0.8)'

  // 使用计算的数据
  const chartData = gradeData.value

  // 定义成绩等级对应的颜色（从低到高：红色->橙色->黄色->绿色->蓝色）
  const gradeColors = [
    '#ff4757', // 不及格 - 红色
    '#ffa502', // 及格 - 橙色  
    '#ffd32a', // 良好 - 黄色
    '#2ed573', // 优秀 - 绿色
    '#3742fa'  // 卓越 - 蓝色
  ]

  // 根据成绩区间获取对应颜色
  function getGradeColor(rangeLabel: string): string {
    if (rangeLabel.includes('不及格') || rangeLabel.includes('Fail')) return gradeColors[0]
    if (rangeLabel.includes('及格') || rangeLabel.includes('Pass')) return gradeColors[1]
    if (rangeLabel.includes('良好') || rangeLabel.includes('Good')) return gradeColors[2]
    if (rangeLabel.includes('优秀') || rangeLabel.includes('Very Good')) return gradeColors[3]
    if (rangeLabel.includes('卓越') || rangeLabel.includes('Excellent')) return gradeColors[4]
    return gradeColors[0] // 默认颜色
  }

  return {
    backgroundColor: 'transparent',
    title: {
      text: t('course.studentGrade.title'),
      left: 'center',
      textStyle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: isDark ? '#ffffff' : '#333333'
      }
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor,
      borderColor: primaryColor,
      textStyle: {
        color: textColor
      },
      formatter: (params: any) => {
        const param = params[0]
        const percentage = chartData.length > 0
            ? ((param.value / chartData.reduce((sum, item) => sum + item.count, 0)) * 100).toFixed(1)
            : '0'
        return `${param.name}: ${param.value}人 (${percentage}%)`
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '20%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: chartData.map(item => item.range),
      axisLine: {
        lineStyle: {
          color: isDark ? '#666' : '#ddd'
        }
      },
      axisLabel: {
        color: isDark ? '#ccc' : '#666',
        fontSize: 12,
        rotate: chartData.length > 4 ? 45 : 0
      }
    },
    yAxis: {
      type: 'value',
      name: t('course.studentGrade.studentCount'),
      nameTextStyle: {
        color: isDark ? '#ccc' : '#666'
      },
      axisLine: {
        lineStyle: {
          color: isDark ? '#666' : '#ddd'
        }
      },
      axisLabel: {
        color: isDark ? '#ccc' : '#666',
        fontSize: 12,
        formatter: (value: number) => Math.round(value).toString()
      },
      splitLine: {
        lineStyle: {
          color: isDark ? '#333' : '#f0f0f0'
        }
      },
      minInterval: 1,
      min: 0
    },
    series: [
      {
        name: t('course.studentGrade.title'),
        type: 'bar',
        data: chartData.map((item, index) => {
          const baseColor = getGradeColor(item.range)
          // 为不同柱子创建不同的渐变方式
          const gradientConfigs = [
            // 不及格 - 垂直渐变
            {
              type: 'linear' as const,
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {offset: 0, color: primaryColor},
                {offset: 1, color: baseColor}
              ]
            },
            // 及格 - 水平渐变
            {
              type: 'linear' as const,
              x: 0,
              y: 0,
              x2: 1,
              y2: 0,
              colorStops: [
                {offset: 0, color: primaryColor},
                {offset: 1, color: baseColor}
              ]
            },
            // 良好 - 对角渐变
            {
              type: 'linear' as const,
              x: 0,
              y: 0,
              x2: 1,
              y2: 1,
              colorStops: [
                {offset: 0, color: primaryColor},
                {offset: 1, color: baseColor}
              ]
            },
            // 优秀 - 径向渐变
            {
              type: 'radial' as const,
              x: 0.5,
              y: 0.5,
              r: 0.8,
              colorStops: [
                {offset: 0, color: primaryColor},
                {offset: 1, color: baseColor}
              ]
            },
            // 卓越 - 反向对角渐变
            {
              type: 'linear' as const,
              x: 1,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {offset: 0, color: primaryColor},
                {offset: 1, color: baseColor}
              ]
            }
          ]

          return {
            value: item.count,
            itemStyle: {
              color: gradientConfigs[index] || gradientConfigs[0],
              borderRadius: [6, 6, 0, 0]
            }
          }
        }),
        barWidth: '60%',
        emphasis: {
          itemStyle: {
            // 悬停时无特殊效果
          }
        }
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

  const option = getChartOption()
  chartInstance.setOption(option)
}

// 监听数据变化
watch(() => props.data, updateChart, {deep: true})

// 监听学生数据变化
watch(() => students.value, updateChart, {deep: true})

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

.student-grade-chart {
  width: 100%;
  height: 100%;
  position: relative;

  .chart-card {
    width: 100%;
    height: 100%;
    background: linear-gradient(135deg, var(--background-secondary-color) 0%, var(--background-tertiary-color) 100%) padding-box,
    linear-gradient(45deg, var(--dynamic-border-color, var(--primary-color)) 0%, transparent 25%, transparent 75%, var(--primary-color) 100%) border-box;
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
      height: 350px;
      position: relative;
      padding: 8px 8px 8px 8px;
      margin-top: 20px;
    }
  }
}

// 暗色主题下的边框效果
:global(.dark) .student-grade-chart .chart-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

// 响应式适配
@media (max-width: 768px) {
  .student-grade-chart {
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
        height: 320px;
      }
    }
  }
}

@media (max-width: 480px) {
  .student-grade-chart {
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
  .student-grade-chart {
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
