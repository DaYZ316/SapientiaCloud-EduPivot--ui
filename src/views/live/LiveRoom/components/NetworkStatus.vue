<template>
  <n-alert
      v-if="showNetworkAlert"
      :title="networkStatusTitle"
      :type="networkStatusType"
      closable
      @close="dismissAlert"
  >
    {{ networkStatusMessage }}
    <div v-if="!isOnline" style="margin-top: 8px;">
      <n-button size="small" @click="handleReconnect">
        {{ t('live.network.reconnect') }}
      </n-button>
    </div>
  </n-alert>
</template>

<script lang="ts" setup>
import {computed, onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {NAlert, NButton} from 'naive-ui'
import {useLiveRoomContext} from '../composables/useLiveRoomContext'

const {t} = useI18n()

// 使用注入的上下文
const context = useLiveRoomContext()

// 网络状态
const isOnline = ref(navigator.onLine)
const showNetworkAlert = ref(false)
const lastConnectionState = ref(true)

// 网络状态监听
const handleOnline = () => {
  isOnline.value = true
  showNetworkAlert.value = false
}

const handleOffline = () => {
  isOnline.value = false
  showNetworkAlert.value = true
}

// 监听连接状态变化
const handleConnectionChange = (connected: boolean) => {
  if (lastConnectionState.value && !connected && isOnline.value) {
    // 从连接状态变为断开状态，且网络在线，可能是服务器连接问题
    showNetworkAlert.value = true
  } else if (!lastConnectionState.value && connected) {
    // 从断开状态变为连接状态
    showNetworkAlert.value = false
  }
  lastConnectionState.value = connected
}

const networkStatusTitle = computed(() => {
  if (!isOnline.value) {
    return t('live.network.offlineTitle')
  } else if (!context.connectionIsConnected.value) {
    return t('live.network.disconnectedTitle')
  }
  return t('live.network.reconnectedTitle')
})

const networkStatusMessage = computed(() => {
  if (!isOnline.value) {
    return t('live.network.offlineMessage')
  } else if (!context.connectionIsConnected.value) {
    return t('live.network.disconnectedMessage')
  }
  return t('live.network.reconnectedMessage')
})

const networkStatusType = computed<'warning' | 'error' | 'success'>(() => {
  if (!isOnline.value) {
    return 'error'
  } else if (!context.connectionIsConnected.value) {
    return 'warning'
  }
  return 'success'
})

const dismissAlert = () => {
  showNetworkAlert.value = false
}

const handleReconnect = async () => {
  if (!isOnline.value) {
    // 如果网络离线，提示用户检查网络
    return
  }

  // 如果网络在线但连接断开，尝试重新连接
  try {
    showNetworkAlert.value = false
    // 这里可以触发重新连接逻辑
    // 实际的重连逻辑会在LiveRoom中处理
  } catch (error) {
    showNetworkAlert.value = true
  }
}

onMounted(() => {
  // 监听网络状态变化
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)

  // 监听连接状态变化
  watch(context.connectionIsConnected, handleConnectionChange)
})

onBeforeUnmount(() => {
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})
</script>
