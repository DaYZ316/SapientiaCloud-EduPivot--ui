<template>
  <div class="settings-module">
    <n-card :title="$t('settings.notification.title')" size="small">
      <n-space vertical size="large">
        <!-- 通知类型设置 -->
        <div class="notification-section">
          <h3>通知类型</h3>
          <n-grid cols="1" :x-gap="16" :y-gap="16">
            <n-gi>
              <div class="notification-item">
                <div class="notification-content">
                  <strong>{{ $t('settings.notification.emailNotifications') }}</strong>
                  <p class="description">通过邮件接收重要通知</p>
                </div>
                <n-switch v-model:value="emailNotifications" />
              </div>
            </n-gi>
            
            <n-gi>
              <div class="notification-item">
                <div class="notification-content">
                  <strong>{{ $t('settings.notification.pushNotifications') }}</strong>
                  <p class="description">通过浏览器推送接收通知</p>
                </div>
                <n-switch v-model:value="pushNotifications" />
              </div>
            </n-gi>
            
            <n-gi>
              <div class="notification-item">
                <div class="notification-content">
                  <strong>{{ $t('settings.notification.soundEffect') }}</strong>
                  <p class="description">收到通知时播放提示音</p>
                </div>
                <n-switch v-model:value="soundEffects" />
              </div>
            </n-gi>
          </n-grid>
        </div>
        
        <!-- 通知内容设置 -->
        <div class="notification-section">
          <h3>接收内容</h3>
          <n-grid cols="1" :x-gap="16" :y-gap="16">
            <n-gi>
              <div class="notification-item">
                <div class="notification-content">
                  <strong>{{ $t('settings.notification.systemMessages') }}</strong>
                  <p class="description">系统消息、警告和错误</p>
                </div>
                <n-switch v-model:value="systemMessages" />
              </div>
            </n-gi>
            
            <n-gi>
              <div class="notification-item">
                <div class="notification-content">
                  <strong>{{ $t('settings.notification.updates') }}</strong>
                  <p class="description">系统更新和新功能通知</p>
                </div>
                <n-switch v-model:value="systemUpdates" />
              </div>
            </n-gi>
            
            <n-gi>
              <div class="notification-item">
                <div class="notification-content">
                  <strong>{{ $t('settings.notification.marketing') }}</strong>
                  <p class="description">产品推广和营销信息</p>
                </div>
                <n-switch v-model:value="marketingInfo" />
              </div>
            </n-gi>
          </n-grid>
        </div>
        
        <!-- 通知频率设置 -->
        <div class="notification-section">
          <h3>{{ $t('settings.notification.notificationFrequency') }}</h3>
          <n-radio-group v-model:value="notificationFrequency">
            <n-space vertical>
              <n-radio value="immediate">
                <div class="radio-label">
                  <strong>实时通知</strong>
                  <p class="description">立即接收所有通知</p>
                </div>
              </n-radio>
              <n-radio value="hourly">
                <div class="radio-label">
                  <strong>每小时汇总</strong>
                  <p class="description">每小时接收一次汇总通知</p>
                </div>
              </n-radio>
              <n-radio value="daily">
                <div class="radio-label">
                  <strong>每日汇总</strong>
                  <p class="description">每天接收一次汇总通知</p>
                </div>
              </n-radio>
            </n-space>
          </n-radio-group>
        </div>
        
        <!-- 通知权限检查 -->
        <n-alert v-if="!hasNotificationPermission" type="warning" closable>
          <template #header>需要通知权限</template>
          <template #icon>
            <n-icon><warning-outline /></n-icon>
          </template>
          您需要授予浏览器通知权限以接收实时通知
          <div style="margin-top: 8px;">
            <n-button size="small" type="primary" @click="requestNotificationPermission">
              请求通知权限
            </n-button>
          </div>
        </n-alert>
        
        <!-- 保存按钮 -->
        <div class="action-buttons">
          <n-button type="primary" @click="saveSettings">
            {{ $t('common.save') }}
          </n-button>
          <n-button @click="resetSettings" class="reset-button">
            {{ $t('common.reset') }}
          </n-button>
        </div>
      </n-space>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  NIcon,
  useMessage
} from 'naive-ui'
import { WarningOutline } from '@vicons/ionicons5'

const message = useMessage()

// 通知类型设置
const emailNotifications = ref(true)
const pushNotifications = ref(true)
const soundEffects = ref(true)

// 通知内容设置
const systemMessages = ref(true)
const systemUpdates = ref(true)
const marketingInfo = ref(false)

// 通知频率
const notificationFrequency = ref('immediate')

// 通知权限状态
const hasNotificationPermission = ref(false)

// 初始化设置
onMounted(() => {
  // 检查通知权限
  if ('Notification' in window) {
    hasNotificationPermission.value = Notification.permission === 'granted'
  }
  
  // 从本地存储或API获取已保存的设置
  const savedSettings = localStorage.getItem('notificationSettings')
  if (savedSettings) {
    try {
      const settings = JSON.parse(savedSettings)
      emailNotifications.value = settings.emailNotifications ?? emailNotifications.value
      pushNotifications.value = settings.pushNotifications ?? pushNotifications.value
      soundEffects.value = settings.soundEffects ?? soundEffects.value
      systemMessages.value = settings.systemMessages ?? systemMessages.value
      systemUpdates.value = settings.systemUpdates ?? systemUpdates.value
      marketingInfo.value = settings.marketingInfo ?? marketingInfo.value
      notificationFrequency.value = settings.notificationFrequency || notificationFrequency.value
    } catch (e) {
      console.error('Failed to parse saved settings')
    }
  }
})

// 请求通知权限
const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    try {
      const permission = await Notification.requestPermission()
      hasNotificationPermission.value = permission === 'granted'
      
      if (permission === 'granted') {
        message.success('已获得通知权限')
      } else {
        message.error('未能获得通知权限')
      }
    } catch (error) {
      message.error('请求通知权限时出错')
    }
  } else {
    message.error('您的浏览器不支持通知功能')
  }
}

// 保存设置
const saveSettings = () => {
  // 保存设置到本地存储
  const settings = {
    emailNotifications: emailNotifications.value,
    pushNotifications: pushNotifications.value,
    soundEffects: soundEffects.value,
    systemMessages: systemMessages.value,
    systemUpdates: systemUpdates.value,
    marketingInfo: marketingInfo.value,
    notificationFrequency: notificationFrequency.value
  }
  
  localStorage.setItem('notificationSettings', JSON.stringify(settings))
  
  message.success('通知设置已保存')
}

// 重置设置
const resetSettings = () => {
  emailNotifications.value = true
  pushNotifications.value = true
  soundEffects.value = true
  systemMessages.value = true
  systemUpdates.value = true
  marketingInfo.value = false
  notificationFrequency.value = 'immediate'
  
  // 清除本地存储
  localStorage.removeItem('notificationSettings')
  
  message.success('已重置为默认设置')
}
</script>

<style scoped lang="scss">
.settings-module {
  margin-bottom: 20px;
}

.notification-section {
  margin-bottom: 24px;
  
  h3 {
    font-size: 16px;
    font-weight: 500;
    margin-top: 0;
    margin-bottom: 16px;
    color: var(--text-color-primary);
  }
  
  .notification-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 16px;
    background-color: var(--card-color);
    border-radius: 4px;
    
    .notification-content {
      flex: 1;
      
      strong {
        font-size: 14px;
        display: block;
        margin-bottom: 4px;
      }
      
      .description {
        margin: 0;
        font-size: 12px;
        color: var(--text-color-secondary);
      }
    }
  }
  
  .radio-label {
    strong {
      font-size: 14px;
      display: block;
    }
    
    .description {
      margin: 4px 0 0;
      font-size: 12px;
      color: var(--text-color-secondary);
    }
  }
}

.action-buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
  
  .reset-button {
    margin-left: 12px;
  }
}
</style> 