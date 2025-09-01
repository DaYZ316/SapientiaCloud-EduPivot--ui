<template>
  <div class="dashboard-container">
    <n-grid :cols="24" :x-gap="16" :y-gap="16">
      <n-grid-item :span="24">
        <n-card :bordered="false" title="仪表盘概览">
          <div class="dashboard-header">
            <h3>欢迎回来，{{ userInfo?.nickName || userInfo?.username }}</h3>
            <p>{{ currentDate }}</p>
          </div>
        </n-card>
      </n-grid-item>

      <n-grid-item :offset="0" :span="8">
        <n-card :bordered="false" title="用户统计">
          <div class="stat-card">
            <n-statistic :value="userData.total" label="总用户数">
              <template #prefix>
                <Icon :component="PersonOutline"/>
              </template>
            </n-statistic>
            <div class="stat-footer">
              <n-progress :indicator-placement="'inside'" :percentage="userData.growthRate" type="line"/>
              <span>较上月增长 {{ userData.growthRate }}%</span>
            </div>
          </div>
        </n-card>
      </n-grid-item>

      <n-grid-item :span="8">
        <n-card :bordered="false" title="系统状态">
          <div class="stat-card">
            <n-statistic :value="systemData.uptime" label="系统运行时间">
              <template #prefix>
                <Icon :component="TimeOutline"/>
              </template>
            </n-statistic>
            <div class="stat-footer">
              <n-progress :color="systemData.performance > 70 ? 'var(--success-color)' : 'var(--warning-color)'" :indicator-placement="'inside'"
                          :percentage="systemData.performance"
                          type="line"/>
              <span>系统性能评分: {{ systemData.performance }}%</span>
            </div>
          </div>
        </n-card>
      </n-grid-item>

      <n-grid-item :span="8">
        <n-card :bordered="false" title="业务数据">
          <div class="stat-card">
            <n-statistic :value="businessData.activeUsers" label="本月活跃用户">
              <template #prefix>
                <Icon :component="TrendingUpOutline"/>
              </template>
            </n-statistic>
            <div class="stat-footer">
              <n-progress :indicator-placement="'inside'" :percentage="businessData.conversionRate" type="line"/>
              <span>转化率: {{ businessData.conversionRate }}%</span>
            </div>
          </div>
        </n-card>
      </n-grid-item>

      <n-grid-item :span="16">
        <n-card :bordered="false" title="活动概览">
          <div class="chart-container">
            <!-- 图表占位符 -->
            <div class="chart-placeholder">
              图表区域
            </div>
          </div>
        </n-card>
      </n-grid-item>

      <n-grid-item :span="8">
        <n-card :bordered="false" title="最近活动">
          <div class="activity-list">
            <n-list>
              <n-list-item v-for="(activity, index) in recentActivities" :key="index">
                <n-thing :description="activity.time" :title="activity.title">
                  {{ activity.content }}
                </n-thing>
              </n-list-item>
            </n-list>
          </div>
        </n-card>
      </n-grid-item>

      <!-- 主题测试区域 -->
      <n-grid-item :span="24">
        <n-card :bordered="false" title="主题系统测试">
          <n-space vertical size="large">
            <div class="theme-test-section">
              <h4>当前主题状态</h4>
              <n-space>
                <n-tag :type="themeStore.themeMode === 'light' ? 'success' : 'default'">
                  浅色模式: {{ themeStore.themeMode === 'light' ? '启用' : '禁用' }}
                </n-tag>
                <n-tag :type="themeStore.themeMode === 'dark' ? 'success' : 'default'">
                  深色模式: {{ themeStore.themeMode === 'dark' ? '启用' : '禁用' }}
                </n-tag>
                <n-tag :type="themeStore.themeMode === 'system' ? 'success' : 'default'">
                  系统主题: {{ themeStore.themeMode === 'system' ? '启用' : '禁用' }}
                </n-tag>
                <n-tag :type="themeStore.isDarkMode ? 'warning' : 'info'">
                  实际模式: {{ themeStore.isDarkMode ? '深色' : '浅色' }}
                </n-tag>
              </n-space>
            </div>

            <div class="theme-test-section">
              <h4>主题切换测试</h4>
              <n-space>
                <n-button @click="testTheme('light')" :type="themeStore.themeMode === 'light' ? 'primary' : 'default'">
                  切换到浅色
                </n-button>
                <n-button @click="testTheme('dark')" :type="themeStore.themeMode === 'dark' ? 'primary' : 'default'">
                  切换到深色
                </n-button>
                <n-button @click="testTheme('system')" :type="themeStore.themeMode === 'system' ? 'primary' : 'default'">
                  切换到系统
                </n-button>
              </n-space>
            </div>

            <div class="theme-test-section">
              <h4>颜色系统测试</h4>
              <n-space>
                <div class="color-test-item">
                  <div class="color-preview" style="background-color: var(--primary-color)"></div>
                  <span>主色调</span>
                </div>
                <div class="color-test-item">
                  <div class="color-preview" style="background-color: var(--text-color)"></div>
                  <span>文本颜色</span>
                </div>
                <div class="color-test-item">
                  <div class="color-preview" style="background-color: var(--background-color)"></div>
                  <span>背景颜色</span>
                </div>
                <div class="color-test-item">
                  <div class="color-preview" style="background-color: var(--border-color)"></div>
                  <span>边框颜色</span>
                </div>
              </n-space>
            </div>
          </n-space>
        </n-card>
      </n-grid-item>
    </n-grid>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue'
import {useUserStore, useThemeStore} from '@/store'
import {PersonOutline, TimeOutline, TrendingUpOutline} from '@vicons/ionicons5'
import Icon from '@/components/common/Icon.vue'

const userStore = useUserStore()
const themeStore = useThemeStore()
const userInfo = computed(() => userStore.userInfo)

// 当前日期
const currentDate = computed(() => {
  return new Date().toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
})

// 模拟数据
const userData = ref({
  total: 3458,
  growthRate: 15
})

const systemData = ref({
  uptime: '45天16小时',
  performance: 85
})

const businessData = ref({
  activeUsers: 1235,
  conversionRate: 65
})

const recentActivities = ref([
  {
    title: '系统更新',
    content: '系统完成了安全更新',
    time: '30分钟前'
  },
  {
    title: '新用户注册',
    content: '有5个新用户加入了系统',
    time: '2小时前'
  },
  {
    title: '数据库备份',
    content: '自动备份已完成',
    time: '5小时前'
  },
  {
    title: '权限变更',
    content: '管理员更新了角色权限',
    time: '1天前'
  }
])

// 测试主题切换
const testTheme = (mode: 'light' | 'dark' | 'system') => {
  themeStore.setThemeMode(mode)
}
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 16px;

  .dashboard-header {
    margin-bottom: 16px;

    h3 {
      margin: 0 0 8px;
      font-size: 20px;
      font-weight: 500;
    }

    p {
      margin: 0;
      color: var(--text-secondary-color);
    }
  }

  .stat-card {
    .stat-footer {
      margin-top: 16px;

      span {
        display: block;
        margin-top: 4px;
        font-size: 12px;
        color: var(--text-secondary-color);
      }
    }
  }

  .chart-container {
    min-height: 300px;

    .chart-placeholder {
      display: flex;
      align-items: center;
      justify-content: center;
      height: 300px;
      background-color: var(--panel-background-color);
      border-radius: 4px;
      color: var(--text-disabled-color);
    }
  }

  .activity-list {
    min-height: 300px;
  }

  .theme-test-section {
    h4 {
      margin: 0 0 12px 0;
      font-size: 16px;
      font-weight: 500;
      color: var(--text-color);
    }

    .color-test-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;

      .color-preview {
        width: 40px;
        height: 40px;
        border-radius: 4px;
        border: 2px solid var(--border-color);
      }

      span {
        font-size: 12px;
        color: var(--text-secondary-color);
      }
    }
  }
}
</style>
