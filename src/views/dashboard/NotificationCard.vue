<template>
  <n-card class="notification-card">
    <div class="notification-header">
      <n-text class="header-title" strong>
        {{ t('dashboard.notifications.title') }}
      </n-text>
      <n-button
        v-if="notifications.length > 0"
        text
        size="small"
        @click="$router.push('/notification')"
      >
        {{ t('dashboard.notifications.viewAll') }}
      </n-button>
    </div>

    <div v-if="loading" class="notification-loading">
      <n-spin size="small" />
      <n-text depth="3">{{ t('common.loading') }}</n-text>
    </div>

    <div v-else-if="notifications.length === 0" class="notification-empty">
      <n-empty :description="t('dashboard.notifications.empty')" size="small" />
    </div>

    <div v-else class="notification-list">
      <div
        v-for="notification in notifications"
        :key="notification.id"
        class="notification-item"
        :class="{ 'unread': notification.status === 0 }"
        @click="handleNotificationClick(notification)"
      >
        <div class="notification-icon">
          <n-icon size="16">
            <svg v-if="notification.type === NotificationType.SYSTEM" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
            <svg v-else-if="notification.type === NotificationType.COURSE" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </n-icon>
        </div>

        <div class="notification-content">
          <div class="notification-title-row">
            <n-text class="notification-title" strong :ellipsis="{ tooltip: true }">
              {{ notification.title }}
            </n-text>
            <n-text v-if="notification.status === 0" class="unread-dot"></n-text>
          </div>
          <n-text class="notification-sender" depth="3">
            {{ notification.senderName }}
          </n-text>
          <n-text class="notification-time" depth="3">
            {{ formatDateTime(notification.createTime) }}
          </n-text>
        </div>
      </div>
    </div>
  </n-card>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import {
  NCard,
  NText,
  NButton,
  NSpin,
  NEmpty,
  NIcon
} from 'naive-ui'
import type { NotificationVO } from '@/types/system/notification'
import { listAllNotification, markNotificationAsRead } from '@/api/system/notification'
import { NotificationType } from '@/enum/system/notificationTypeEnum'
import { formatDateTime } from '@/utils/dateUtil'

const { t } = useI18n()
const router = useRouter()

const notifications = ref<NotificationVO[]>([])
const loading = ref(true)

const loadNotifications = async () => {
  try {
    loading.value = true
    const result = await listAllNotification()
    if (result.data) {
      // 取前5条通知
      notifications.value = result.data.slice(0, 5)
    }
  } catch (error) {
    // 静默处理错误
  } finally {
    loading.value = false
  }
}

const handleNotificationClick = async (notification: NotificationVO) => {
  // 如果是未读通知，标记为已读
  if (notification.status === 0) {
    try {
      await markNotificationAsRead(notification.id)
      notification.status = 1 // 更新本地状态
    } catch (error) {
      // 静默处理错误
    }
  }

  // 跳转到通知详情或通知列表页面
  router.push('/notification')
}


onMounted(() => {
  loadNotifications()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.notification-card {
  height: 400px;
  z-index: 10;
  width: 70%;
  margin-top: 16px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--background-color) 85%, transparent);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  user-select: none;
  transition: all 0.3s ease;

  .notification-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    padding: 0 4px;

    .header-title {
      font-size: 18px;
      color: var(--text-color);
    }
  }

  .notification-loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 200px;
    gap: 12px;
  }

  .notification-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 200px;
  }

  .notification-list {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .notification-item {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    padding: 16px;
    border-radius: 10px;
    background: color-mix(in srgb, var(--background-secondary-color) 6%, var(--background-color));
    border: 1px solid var(--border-secondary-color);
    transition: all 0.2s ease;
    cursor: pointer;

    &:hover {
      transform: translateY(-2px);
      box-shadow: 0 4px 12px var(--shadow-secondary-color);
      background: color-mix(in srgb, var(--background-secondary-color) 8%, var(--background-color));
    }

    &.unread {
      border-left: 3px solid var(--primary-color);
      background: color-mix(in srgb, var(--primary-color) 5%, var(--background-color));
    }

    .notification-icon {
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: color-mix(in srgb, var(--primary-color) 10%, var(--background-color));
      color: var(--primary-color);
      margin-top: 2px;
    }

    .notification-content {
      flex: 1;
      min-width: 0;

      .notification-title-row {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 6px;

        .notification-title {
          font-size: 14px;
          color: var(--text-color);
          flex: 1;
          margin-right: 8px;
        }

        .unread-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--primary-color);
          flex-shrink: 0;
          margin-top: 6px;
        }
      }

      .notification-sender {
        font-size: 12px;
        color: var(--text-secondary-color);
        margin-bottom: 4px;
      }

      .notification-time {
        font-size: 11px;
        color: var(--text-secondary-color);
        opacity: 0.8;
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .notification-card {
    height: auto;
    min-height: 300px;
    margin-top: 12px;

    .notification-header {
      margin-bottom: 16px;

      .header-title {
        font-size: 16px;
      }
    }

    .notification-list {
      gap: 8px;
    }

    .notification-item {
      padding: 12px;

      .notification-icon {
        width: 24px;
        height: 24px;
      }

      .notification-content {
        .notification-title-row {
          .notification-title {
            font-size: 13px;
          }
        }

        .notification-sender {
          font-size: 11px;
        }

        .notification-time {
          font-size: 10px;
        }
      }
    }
  }
}
</style>
