<template>
  <div class="teacher-education-chart">
    <div class="chart-header">
      <h3 class="chart-title">{{ $t('course.teacherEducation.title') }}</h3>
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-icon size="16" class="info-icon">
            <InformationCircleOutline />
          </n-icon>
        </template>
        {{ $t('course.teacherEducation.tooltip') }}
      </n-tooltip>
    </div>
    
    <div v-if="loading" class="chart-loading">
      <n-spin size="medium" />
    </div>
    
    <div v-else-if="chartData.length === 0" class="chart-empty">
      <n-empty :description="$t('course.teacherEducation.noData')" />
    </div>
    
    <div v-else ref="chartContainer" class="chart-container"></div>
  </div>
</template>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
import { NSpin, NEmpty, NTooltip, NIcon } from 'naive-ui'
import { InformationCircleOutline } from '@vicons/ionicons5'
import * as echarts from 'echarts'
import type { EChartsOption } from 'echarts'
import { getCourseAllTeachers } from '@/api/course/courseTeacher'
import { EducationEnum, getEducationLabel } from '@/enum/teacher/educationEnum'
import { generateColorVariants } from '@/utils/colorAlgorithm'
import type { TeacherVO } from '@/types/teacher'

// Props
interface Props {
  courseId: string
}

const props = defineProps<Props>()

// 响应式数据
const { t, locale } = useI18n()
const loading = ref(false)
const chartContainer = ref<HTMLElement | null>(null)
const chartInstance = ref<echarts.ECharts | null>(null)
const chartData = ref<Array<{ name: string; value: number; itemStyle: { color: string } }>>([])

// 颜色配置 - 使用Primary颜色通过算法生成的延伸颜色
const primaryColor = '#1890ff' // 可以根据主题动态获取
const colorVariants = generateColorVariants(primaryColor)
const chartColors = [
  colorVariants.primary,
  colorVariants.light,
  colorVariants.lighter,
  colorVariants.dark
]

// 加载教师数据
const loadTeacherData = async () => {
  if (!props.courseId) return
  
  try {
    loading.value = true
    const response = await getCourseAllTeachers(props.courseId)
    
    if (response.success && response.data) {
      processTeacherData(response.data)
    }
  } catch (error) {
    console.warn('Failed to load teacher data:', error)
  } finally {
    loading.value = false
  }
}

// 处理教师数据，统计学历分布
const processTeacherData = (teachers: TeacherVO[]) => {
  const educationStats = new Map<number, number>()
  
  // 初始化所有学历类型
  Object.values(EducationEnum).forEach(education => {
    if (typeof education === 'number') {
      educationStats.set(education, 0)
    }
  })
  
  // 统计每个学历的教师数量
  teachers.forEach(teacher => {
    if (teacher.education !== null && teacher.education !== undefined) {
      const currentCount = educationStats.get(teacher.education) || 0
      educationStats.set(teacher.education, currentCount + 1)
    }
  })
  
  // 转换为图表数据格式
  chartData.value = Array.from(educationStats.entries())
    .filter(([_, count]) => count > 0) // 只显示有数据的学历
    .map(([education, count], index) => ({
      name: getEducationLabel(education, locale.value === 'en-US'),
      value: count,
      itemStyle: {
        color: chartColors[index % chartColors.length]
      }
    }))
  
  // 更新图表
  updateChart()
}

// 更新图表
const updateChart = () => {
  if (!chartInstance.value || chartData.value.length === 0) return
  
  const option: EChartsOption = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      top: '5%',
      left: 'center',
      textStyle: {
        color: 'var(--text-color)'
      }
    },
    series: [
      {
        name: t('course.teacherEducation.chartName'),
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        padAngle: 5,
        itemStyle: {
          borderRadius: 10
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 20,
            fontWeight: 'bold',
            color: 'var(--text-color)'
          }
        },
        labelLine: {
          show: false
        },
        data: chartData.value
      }
    ]
  }
  
  chartInstance.value.setOption(option, true)
}

// 初始化图表
const initChart = () => {
  if (!chartContainer.value) return
  
  chartInstance.value = echarts.init(chartContainer.value, 'dark')
  updateChart()
  
  // 监听窗口大小变化
  window.addEventListener('resize', handleResize)
}

// 处理窗口大小变化
const handleResize = () => {
  if (chartInstance.value) {
    chartInstance.value.resize()
  }
}

// 销毁图表
const destroyChart = () => {
  if (chartInstance.value) {
    chartInstance.value.dispose()
    chartInstance.value = null
  }
  window.removeEventListener('resize', handleResize)
}

// 监听语言变化
watch(() => locale.value, () => {
  if (chartData.value.length > 0) {
    // 重新处理数据以更新标签
    loadTeacherData()
  }
})

// 监听课程ID变化
watch(() => props.courseId, (newCourseId) => {
  if (newCourseId) {
    loadTeacherData()
  }
})

// 生命周期
onMounted(async () => {
  await nextTick()
  initChart()
  await loadTeacherData()
})

onUnmounted(() => {
  destroyChart()
})
</script>

<style lang="scss" scoped>
@use './TeacherEducationChart.scss';
</style>
