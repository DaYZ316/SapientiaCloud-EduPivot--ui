<template>
  <div class="practice-statistics-chart">
    <n-card class="chart-card" :bordered="false" embedded>
      <template #header>
        <div class="chart-header">
          <span class="chart-title">{{ $t('course.classPractice.practiceStatistics') }}</span>
        </div>
      </template>

      <div v-if="loading" class="loading-container">
        <n-spin size="medium" />
      </div>
      <div v-else-if="!statistics" class="empty-container">
        <n-empty :description="$t('course.classPractice.noStatisticsData')" />
      </div>
      <div v-else class="chart-container">
        <div ref="chartRef" class="echarts-container"></div>
        <div class="statistics-summary">
          <div class="summary-item">
            <div class="summary-label">{{ getAnswerStatusCountLabel(AnswerStatusEnum.INCORRECT, isEn) }}</div>
            <div class="summary-value incorrect">{{ statistics.incorrectCount || 0 }}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">{{ getAnswerStatusCountLabel(AnswerStatusEnum.CORRECT, isEn) }}</div>
            <div class="summary-value correct">{{ statistics.correctCount || 0 }}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">{{ getAnswerStatusCountLabel(AnswerStatusEnum.PARTIALLY_CORRECT, isEn) }}</div>
            <div class="summary-value partial">{{ statistics.partialCount || 0 }}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">{{ getAnswerStatusCountLabel(AnswerStatusEnum.PENDING_REVIEW, isEn) }}</div>
            <div class="summary-value pending">{{ statistics.pendingReviewCount || 0 }}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">{{ $t('course.classPractice.totalSubmissions') }}</div>
            <div class="summary-value">{{ statistics.totalQuestions || 0 }}</div>
          </div>
          <div class="summary-item">
            <div class="summary-label">{{ $t('course.classPractice.averageScore') }}</div>
            <div class="summary-value average">{{ formatScore(statistics.averageScore) }}</div>
          </div>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import * as echarts from 'echarts'
import { useThemeStore } from '@/store/modules/theme'
import { useI18n } from 'vue-i18n'
import { getAnswerStatusLabel, AnswerStatusEnum, getAnswerStatusCountLabel } from '@/enum/student/answerStatusEnum'
import type { PracticeStatisticsVO } from '@/types/student/practice'

// Props
interface Props {
  statistics: PracticeStatisticsVO | null
  loading?: boolean
}

// Emits
interface Emits {
  (e: 'filter-change', isCorrect: number | null): void
}

const props = withDefaults(defineProps<Props>(), {
  loading: false
})

const emit = defineEmits<Emits>()

// 国际化
const { locale, t: $t } = useI18n()
const isEn = computed(() => locale.value === 'en-US')

// 响应式数据
const chartRef = ref<HTMLDivElement>()
let chartInstance: echarts.ECharts | null = null
let themeObserver: MutationObserver | null = null
const selectedIndex = ref<number | null>(null)

// 主题store
const themeStore = useThemeStore()

// 获取CSS变量值
const getCssVar = (varName: string) => {
  return getComputedStyle(document.documentElement).getPropertyValue(varName).trim()
}

// 格式化分数
const formatScore = (score: number | null) => {
  if (score === null || score === undefined) {
    return '-'
  }
  return score.toFixed(1)
}

// 处理图表点击事件
const handleChartClick = (params: any) => {
  if (params.componentType === 'series' && params.seriesType === 'pie') {
    // 如果点击的是已选中的扇叶，则取消选中
    if (selectedIndex.value === params.dataIndex) {
      selectedIndex.value = null
      emit('filter-change', null)
      return
    }

    // 选中新的扇叶
    selectedIndex.value = params.dataIndex

    let isCorrect: number | null = null

    const isEnValue = isEn.value
    switch (params.name) {
      case getAnswerStatusLabel(AnswerStatusEnum.CORRECT, isEnValue):
        isCorrect = 1
        break
      case getAnswerStatusLabel(AnswerStatusEnum.INCORRECT, isEnValue):
        isCorrect = 0
        break
      case getAnswerStatusLabel(AnswerStatusEnum.PARTIALLY_CORRECT, isEnValue):
        isCorrect = 2
        break
      case getAnswerStatusLabel(AnswerStatusEnum.PENDING_REVIEW, isEnValue):
        isCorrect = 3
        break
    }

    emit('filter-change', isCorrect)

    // 更新图表选中状态
    if (chartInstance) {
      // 清除所有选中状态
      chartInstance.dispatchAction({
        type: 'pieUnSelect',
        seriesIndex: 0,
        dataIndex: 0
      })
      chartInstance.dispatchAction({
        type: 'pieUnSelect',
        seriesIndex: 0,
        dataIndex: 1
      })
      chartInstance.dispatchAction({
        type: 'pieUnSelect',
        seriesIndex: 0,
        dataIndex: 2
      })
      chartInstance.dispatchAction({
        type: 'pieUnSelect',
        seriesIndex: 0,
        dataIndex: 3
      })

      // 选中当前点击的扇叶
      if (selectedIndex.value !== null) {
        chartInstance.dispatchAction({
          type: 'pieSelect',
          seriesIndex: 0,
          dataIndex: selectedIndex.value
        })
      }
    }
  }
}

// 初始化图表
const initChart = () => {
  if (!chartRef.value || !props.statistics) return

  // 销毁旧实例
  if (chartInstance) {
    chartInstance.dispose()
  }

  // 创建新实例
  chartInstance = echarts.init(chartRef.value)

  // 图表配置
  const option = {
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)'
    },
    legend: {
      orient: 'vertical',
      left: 'left',
      textStyle: {
        color: 'var(--text-color)'
      }
    },
    series: [
      {
        name: $t('course.classPractice.practiceStatistics'),
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        selectedMode: 'single',
        itemStyle: {
          borderRadius: 10
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: false
          }
        },
        selected: {
          itemStyle: {
            borderWidth: 2,
            borderColor: 'var(--primary-color)',
            shadowBlur: 20,
            shadowColor: 'var(--primary-color)',
            shadowOffsetX: 0,
            shadowOffsetY: 0
          }
        },
        labelLine: {
          show: false
        },
        data: [
          {
            value: props.statistics.correctCount || 0,
            name: getAnswerStatusLabel(AnswerStatusEnum.CORRECT, isEn.value),
            itemStyle: {
              color: getCssVar('--success-color'),
              shadowBlur: themeStore.isDarkMode ? 12 : 8,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowColor: getCssVar('--success-color') + (themeStore.isDarkMode ? '40' : '60')
            }
          },
          {
            value: props.statistics.incorrectCount || 0,
            name: getAnswerStatusLabel(AnswerStatusEnum.INCORRECT, isEn.value),
            itemStyle: {
              color: getCssVar('--error-color'),
              shadowBlur: themeStore.isDarkMode ? 12 : 8,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowColor: getCssVar('--error-color') + (themeStore.isDarkMode ? '40' : '60')
            }
          },
          {
            value: props.statistics.partialCount || 0,
            name: getAnswerStatusLabel(AnswerStatusEnum.PARTIALLY_CORRECT, isEn.value),
            itemStyle: {
              color: getCssVar('--warning-color'),
              shadowBlur: themeStore.isDarkMode ? 12 : 8,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowColor: getCssVar('--warning-color') + (themeStore.isDarkMode ? '40' : '60')
            }
          },
          {
            value: props.statistics.pendingReviewCount || 0,
            name: getAnswerStatusLabel(AnswerStatusEnum.PENDING_REVIEW, isEn.value),
            itemStyle: {
              color: getCssVar('--info-color'),
              shadowBlur: themeStore.isDarkMode ? 12 : 8,
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowColor: getCssVar('--info-color') + (themeStore.isDarkMode ? '40' : '60')
            }
          }
        ]
      }
    ]
  }

  chartInstance.setOption(option)

  // 添加点击事件监听
  chartInstance.on('click', handleChartClick)
}

// 监听数据变化
watch(() => props.statistics, () => {
  nextTick(() => {
    selectedIndex.value = null // 重置选中状态
    initChart()
  })
}, { deep: true })

// 监听主题变化
watch(() => themeStore.isDarkMode, () => {
  nextTick(() => {
    initChart()
  })
})

watch(() => themeStore.primaryColor, () => {
  if (chartInstance) {
    nextTick(() => {
      initChart()
    })
  }
})

// 窗口大小变化时重新调整图表大小
const handleResize = () => {
  if (chartInstance) {
    chartInstance.resize()
  }
}

// 生命周期
onMounted(() => {
  window.addEventListener('resize', handleResize)

  // 监听主题变化
  themeObserver = new MutationObserver(() => {
    nextTick(() => {
      initChart()
    })
  })

  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class']
  })

  nextTick(() => {
    initChart()
  })
})

onUnmounted(() => {
  window.removeEventListener('resize', handleResize)
  if (themeObserver) {
    themeObserver.disconnect()
    themeObserver = null
  }
  if (chartInstance) {
    chartInstance.dispose()
    chartInstance = null
  }
})
</script>

<style lang="scss" scoped>
.practice-statistics-chart {
  width: 100%;

  .chart-card {
    background-color: var(--background-color);
    border-radius: 12px;
    border: 1px solid var(--border-color);
    transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);

    :deep(.n-card__header) {
      padding: 16px 16px 0 16px;
      border-bottom: none;
      background: transparent;
    }

    :deep(.n-card__content) {
      padding: 16px;
    }
  }

  .chart-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .chart-title {
      font-size: 16px;
      font-weight: 600;
      color: var(--text-color);
    }
  }

  .loading-container,
  .empty-container {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
  }

  .chart-container {
    display: flex;
    gap: 24px;
    align-items: flex-start;

    .echarts-container {
      flex: 1;
      height: 300px;
      min-width: 300px;
    }

    .statistics-summary {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      grid-template-rows: auto auto auto;
      gap: 12px;
      flex: 0 0 50%;
      max-width: 50%;
    }

    .summary-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      padding: 12px;
      background: var(--background-secondary-color);
      border-radius: 8px;
      flex: 1;


      .summary-label {
        font-size: 12px;
        color: var(--text-secondary-color);
        font-weight: 500;
      }

      .summary-value {
        font-size: 18px;
        font-weight: 700;
        color: var(--text-color);

        &.correct {
          color: var(--success-color);
        }

        &.incorrect {
          color: var(--error-color);
        }

        &.partial {
          color: var(--warning-color);
        }

        &.pending {
          color: var(--info-color);
        }

        &.average {
          color: var(--primary-color);
        }
      }
    }
  }
}

// 暗色主题下的科技感增强效果
:global(.dark) .practice-statistics-chart .chart-card {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

// 响应式设计
@media (max-width: 768px) {
  .practice-statistics-chart {
    .chart-container {
      flex-direction: column;
      gap: 16px;

      .echarts-container {
        height: 250px;
        min-width: unset;
      }

      .statistics-summary {
        grid-template-columns: repeat(2, 1fr);
        grid-template-rows: repeat(3, auto);
        min-width: unset;
        gap: 12px;
      }

      .summary-item {
        padding: 10px;


        .summary-value {
          font-size: 16px;
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .practice-statistics-chart {
    .chart-container {
      .statistics-summary {
        grid-template-columns: 1fr;
        grid-template-rows: repeat(5, auto);
        gap: 12px;
      }

    }
  }
}
</style>
