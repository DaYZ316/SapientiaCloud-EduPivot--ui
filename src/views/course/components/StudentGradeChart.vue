<template>
  <div :style="{ '--dynamic-border-color': borderColor }" class="student-grade-chart">
    <div class="chart-card">
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
        <div class="no-data-description">{{ t('course.studentGrade.noDataDescription') }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import type {EChartsOption} from 'echarts'
import * as echarts from 'echarts'
import {NIcon} from 'naive-ui'
import {useThemeStore} from '@/store/modules/theme'
import {useCourseStore} from '@/store/modules/course'
// import { useColorAlgorithm } from '@/composables/useColorAlgorithm'
import {useCourseBorderColor} from '../composables/useCourseBorderColor'
import {useCourseStudentData} from '../composables/useCourseStudentData'

// 定义学生积分数据项类型
interface StudentScoreDataItem {
  /** 学生姓名 */
  name: string
  /** 积分 */
  grade: number
  /** 学生ID */
  id: string
}

// 定义组件属性
interface Props {
  /** 课程ID */
  courseId?: string
  /** 数据源（可选，如果提供则使用提供的数据，否则从API加载） */
  data?: StudentScoreDataItem[]
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

// 使用课程学生数据composable（优先使用 props.courseId，否则使用 course store 的当前课程ID）
const courseStore = useCourseStore()
const {students} = useCourseStudentData((props.courseId || courseStore.currentCourseId) as any)

// 国际化
const {t, locale} = useI18n()

// 主题store
const themeStore = useThemeStore()

// 颜色算法（暂时不使用，使用自定义成绩等级颜色）
// const { themeColorPalette } = useColorAlgorithm()

// 使用课程边框颜色composable
const {borderColor} = useCourseBorderColor(props.courseType)

// 计算学生成绩数据（用于水平条形图）
const studentGradeData = computed<StudentScoreDataItem[]>(() => {
  if (props.data.length > 0) {
    // 如果提供了数据，假设是学生成绩数据格式
    return props.data as StudentScoreDataItem[]
  }

  if (students.value.length === 0) {
    return []
  }

  // 过滤有成绩的学生并按成绩排序
  return students.value
      .filter(student => student.grade !== null && student.grade !== undefined)
      .map(student => ({
        name: student.realName || t('common.unknown'),
        grade: student.grade!,
        id: student.studentId
      }))
      .sort((a, b) => b.grade - a.grade) // 按成绩降序排列
})

// 判断是否有数据
const hasData = computed(() => {
  return studentGradeData.value.length > 0
})

// 获取图表配置
function getChartOption(): EChartsOption {
  const isDark = themeStore.isDarkMode
  const primaryColor = themeStore.primaryColor
  const textColor = isDark ? '#ffffff' : '#000000'
  const backgroundColor = isDark ? 'rgba(31, 31, 31, 0.8)' : 'rgba(255, 255, 255, 0.8)'

  // 使用计算的数据
  const chartData = studentGradeData.value

  // 定义成绩等级对应的颜色（从低到高：红色->橙色->黄色->绿色->蓝色）
  const gradeColors = [
    '#ff4757', // 不及格 - 红色
    '#ffa502', // 及格 - 橙色
    '#ffd32a', // 良好 - 黄色
    '#2ed573', // 优秀 - 绿色
    '#3742fa'  // 卓越 - 蓝色
  ]

  // 根据积分获取对应颜色（积分越高颜色越好）
  function getGradeColor(score: number): string {
    if (score < 100) return gradeColors[0] // 低积分 - 红色
    if (score < 200) return gradeColors[1] // 中低积分 - 橙色
    if (score < 500) return gradeColors[2] // 中等积分 - 黄色
    if (score < 1000) return gradeColors[3] // 高积分 - 绿色
    return gradeColors[4] // 极高积分 - 蓝色
  }

  return {
    backgroundColor: 'transparent',
    title: {
      text: t('course.studentGrade.individualTitle'),
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
        return `${param.name}: ${param.value}${t('course.studentGrade.scoreUnit')}`
      }
    },
    grid: {
      left: '8%',
      right: '6%',
      bottom: '6%',
      top: '12%',
      containLabel: true
    },
    xAxis: {
      type: 'value',
      name: t('course.studentGrade.scoreAxis'),
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
      min: 0
    },
    yAxis: {
      type: 'category',
      data: chartData.map(item => item.name),
      axisLine: {
        lineStyle: {
          color: isDark ? '#666' : '#ddd'
        }
      },
      axisLabel: {
        color: isDark ? '#ccc' : '#666',
        fontSize: 12,
        interval: 0, // 显示所有标签
        formatter: (value: string) => {
          // 如果名字太长，截断显示
          return value.length > 8 ? value.substring(0, 8) + '...' : value
        }
      },
      splitLine: {
        show: false
      }
    },
    series: [
      {
        name: t('course.studentGrade.individualTitle'),
        type: 'bar',
        data: chartData.map((item) => {
          const baseColor = getGradeColor(item.grade)

          return {
            value: item.grade,
            itemStyle: {
              color: {
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
              borderRadius: [0, 4, 4, 0]
            }
          }
        }),
        barWidth: '70%'
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

// 监听学生数据变化
watch(() => students.value, updateChart, {deep: true})

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

    .no-data-container {
      width: 100%;
      height: 350px;
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
