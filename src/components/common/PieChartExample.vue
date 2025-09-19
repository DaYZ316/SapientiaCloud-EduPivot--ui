<template>
  <div class="pie-chart-example">
    <n-card title="饼图示例" class="chart-card">
      <template #header-extra>
        <n-space>
          <n-button @click="toggleTheme">
            {{ isDark ? '浅色主题' : '深色主题' }}
          </n-button>
          <n-button @click="updateData">更新数据</n-button>
        </n-space>
      </template>
      
      <n-space vertical size="large">
        <!-- 基础饼图 -->
        <div>
          <h3>基础饼图</h3>
          <PieChart 
            :options="basicOptions" 
            height="300px"
          />
        </div>
        
        <!-- 自定义颜色饼图 -->
        <div>
          <h3>自定义颜色饼图</h3>
          <PieChart 
            :options="customColorOptions" 
            height="300px"
          />
        </div>
        
        <!-- 无图例饼图 -->
        <div>
          <h3>无图例饼图</h3>
          <PieChart 
            :options="noLegendOptions" 
            height="300px"
          />
        </div>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { NCard, NSpace, NButton } from 'naive-ui'
import PieChart from './PieChart.vue'
import type { PieChartOptions } from '@/types/components'

// 主题状态
const isDark = ref(false)

// 基础饼图配置
const basicOptions = computed<PieChartOptions>(() => ({
  title: '访问来源统计',
  data: [
    { value: 1048, name: '搜索引擎' },
    { value: 735, name: '直接访问' },
    { value: 580, name: '邮件营销' },
    { value: 484, name: '联盟广告' },
    { value: 300, name: '视频广告' }
  ],
  primaryColor: '#1890ff',
  showLegend: true,
  showLabel: true,
  dark: isDark.value
}))

// 自定义颜色饼图配置
const customColorOptions = computed<PieChartOptions>(() => ({
  title: '课程类型分布',
  data: [
    { value: 320, name: '编程课程' },
    { value: 240, name: '设计课程' },
    { value: 149, name: '语言课程' },
    { value: 100, name: '数学课程' },
    { value: 59, name: '其他课程' }
  ],
  primaryColor: '#52c41a',
  showLegend: true,
  showLabel: true,
  dark: isDark.value
}))

// 无图例饼图配置
const noLegendOptions = computed<PieChartOptions>(() => ({
  title: '用户活跃度',
  data: [
    { value: 45, name: '活跃用户' },
    { value: 30, name: '普通用户' },
    { value: 15, name: '低活跃用户' },
    { value: 10, name: '休眠用户' }
  ],
  primaryColor: '#722ed1',
  showLegend: false,
  showLabel: true,
  dark: isDark.value
}))

// 切换主题
const toggleTheme = () => {
  isDark.value = !isDark.value
}

// 更新数据
const updateData = () => {
  // 这里可以添加数据更新逻辑
  // 由于使用了computed，数据变化会自动更新图表
}
</script>

<style lang="scss" scoped>
.pie-chart-example {
  padding: 20px;
  
  .chart-card {
    max-width: 1200px;
    margin: 0 auto;
  }
  
  h3 {
    margin-bottom: 16px;
    color: var(--text-color);
    font-size: 16px;
    font-weight: 600;
  }
}
</style>
