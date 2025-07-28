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
                <Icon :component="PersonOutline" />
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
                <Icon :component="TimeOutline" />
              </template>
            </n-statistic>
            <div class="stat-footer">
              <n-progress :color="systemData.performance > 70 ? '#18a058' : '#f0a020'" :indicator-placement="'inside'" :percentage="systemData.performance"
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
                <Icon :component="TrendingUpOutline" />
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
    </n-grid>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue'
import {useUserStore} from '@/store'
import {PersonOutline, TimeOutline, TrendingUpOutline} from '@vicons/ionicons5'
import Icon from '@/components/common/Icon.vue'

const userStore = useUserStore()
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
      color: #666;
    }
  }

  .stat-card {
    .stat-footer {
      margin-top: 16px;

      span {
        display: block;
        margin-top: 4px;
        font-size: 12px;
        color: #666;
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
      background-color: rgba(0, 0, 0, 0.02);
      border-radius: 4px;
      color: #999;
    }
  }

  .activity-list {
    min-height: 300px;
  }
}
</style>
