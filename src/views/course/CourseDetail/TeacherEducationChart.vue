<template>
    <div class="teacher-education-chart">
      <div class="chart-card">
        <div ref="chartRef" class="chart-container"></div>
      </div>
    </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { useThemeStore } from '@/store/modules/theme'
import { EducationEnum, getEducationLabel } from '@/enum/teacher/educationEnum'
import { useColorAlgorithm } from '@/composables/useColorAlgorithm'
import { listAllTeacherByCourseId } from '@/api/course/courseTeacher'
import type { TeacherVO } from '@/types/teacher'

// 定义饼图数据项类型
interface PieChartDataItem {
  /** 数值 */
  value: number
  /** 名称 */
  name: string
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
  data?: PieChartDataItem[]
  /** 是否加载中 */
  loading?: boolean
}

// 接收属性
const props = withDefaults(defineProps<Props>(), {
  courseId: '',
  data: () => [],
  loading: false
})

// 响应式数据
const chartRef = ref<HTMLElement>()
let chartInstance: echarts.ECharts | null = null
const teachers = ref<TeacherVO[]>([])
const isLoading = ref(false)

// 国际化
const { t, locale } = useI18n()

// 主题store
const themeStore = useThemeStore()

// 颜色算法
const { themeColorPalette } = useColorAlgorithm()

// 计算教师学历分布数据
const educationData = computed(() => {
  if (props.data.length > 0) {
    return props.data
  }
  
  if (teachers.value.length === 0) {
    return []
  }
  
  // 统计各学历人数
  const educationCount = {
    [EducationEnum.COLLEGE]: 0,
    [EducationEnum.BACHELOR]: 0,
    [EducationEnum.MASTER]: 0,
    [EducationEnum.DOCTOR]: 0
  }
  
  teachers.value.forEach(teacher => {
    if (teacher.education !== null && teacher.education !== undefined) {
      educationCount[teacher.education as EducationEnum]++
    }
  })
  
  // 转换为图表数据格式
  const result: PieChartDataItem[] = []
  Object.entries(educationCount).forEach(([education, count]) => {
    if (count > 0) {
      result.push({
        value: count,
        name: getEducationLabel(parseInt(education) as EducationEnum, locale.value === 'en-US')
      })
    }
  })
  
  return result
})


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
        avoidLabelOverlap: false,
        padAngle: 5,
        itemStyle: {
          borderRadius: 10,
          borderColor: isDark ? '#2a2a2a' : '#ffffff',
          borderWidth: 2,
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
            shadowBlur: 12,
            shadowOffsetX: 0,
            shadowOffsetY: 0,
            shadowColor: (item.itemStyle?.color || colors[index % colors.length]) + '60'
          }
        }))
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

// 加载教师数据
async function loadTeachers() {
  if (!props.courseId) return
  
  try {
    isLoading.value = true
    const response = await listAllTeacherByCourseId(props.courseId)
    teachers.value = response.data || []
  } catch (error) {
    console.error('加载教师数据失败:', error)
    teachers.value = []
  } finally {
    isLoading.value = false
  }
}

// 更新图表数据
function updateChart() {
  if (!chartInstance) return

  const option = getChartOption()
  chartInstance.setOption(option)
}

// 监听数据变化
watch(() => props.data, updateChart, { deep: true })

// 监听教师数据变化
watch(() => teachers.value, updateChart, { deep: true })

// 监听课程ID变化
watch(() => props.courseId, (newCourseId) => {
  if (newCourseId) {
    loadTeachers()
  }
}, { immediate: true })

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
    background: var(--background-color);
    border: 1px solid var(--border-color);
    border-radius: 12px;
    box-shadow: 0 4px 12px var(--shadow-color);
    overflow: hidden;
    position: relative;
    transition: all 0.3s ease;



    .chart-container {
      width: 100%;
      height: 100%;
      min-height: 300px;
      position: relative;
      padding: 16px;
      
      // 添加荧光动画效果
      &::before {
        content: '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 120%;
        height: 120%;
        transform: translate(-50%, -50%);
        background: radial-gradient(
          circle,
          rgba(var(--primary-color-rgb), 0.1) 0%,
          rgba(var(--primary-color-rgb), 0.05) 30%,
          transparent 70%
        );
        border-radius: 50%;
        animation: pulse-glow var(--glow-animation-duration) ease-in-out infinite;
        pointer-events: none;
        z-index: -1;
      }
    }
  }
}

// 荧光脉冲动画
@keyframes pulse-glow {
  0%, 100% {
    opacity: 0.3;
    transform: translate(-50%, -50%) scale(1);
  }
  50% {
    opacity: 0.6;
    transform: translate(-50%, -50%) scale(1.1);
  }
}

// 暗色主题下的荧光效果
:global(.dark) .teacher-education-chart .chart-container::before {
  background: radial-gradient(
    circle,
    rgba(var(--primary-color-rgb), 0.2) 0%,
    rgba(var(--primary-color-rgb), 0.1) 30%,
    transparent 70%
  );
}

// 响应式适配
@media (max-width: 768px) {
  .teacher-education-chart {
    .chart-card {

      .chart-container {
        padding: 12px;
        min-height: 250px;
      }
    }
  }
}

@media (max-width: 480px) {
  .teacher-education-chart {
    .chart-card {
      border-radius: 8px;


      .chart-container {
        padding: 8px;
        min-height: 200px;
      }
    }
  }
}
</style>