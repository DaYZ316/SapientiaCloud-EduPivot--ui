<template>
  <div class="live-room-container">
    <live-room-provider ref="providerRef" :room-id-prop="props.roomIdProp" :token-prop="props.tokenProp">
      <live-room-header />

      <live-room-status />

      <n-card size="small">
        <live-room-controls />

        <live-room-layout />
      </n-card>
    </live-room-provider>

    <!-- 瀛︾敓淇℃伅妗?-->
    <student-info-popup
      :position="popupPosition"
      :seat-index="currentSeatIndex"
      :show="showStudentInfo"
      :student="currentStudent"
    />
    <!-- 鎸囬拡閿佸畾鎻愮ず -->
    <n-alert
      v-if="showPointerLockHint"
      :title="t('classroom.pointerLockHintTitle')"
      class="pointer-lock-hint"
      closable
      type="info"
      @close="showPointerLockHint = false"
    >
      {{ t('classroom.pointerLockHint') }}
    </n-alert>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, onBeforeRouteLeave } from 'vue-router'
import { NAlert, NCard } from 'naive-ui'
import { useLivePiPStore } from '@/store'
import LiveRoomProvider from './components/LiveRoomProvider.vue'
import LiveRoomHeader from './components/LiveRoomHeader.vue'
import LiveRoomStatus from './components/LiveRoomStatus.vue'
import LiveRoomControls from './components/LiveRoomControls.vue'
import LiveRoomLayout from './components/LiveRoomLayout.vue'
import StudentInfoPopup from '@/views/classroom/components/StudentInfoPopup.vue'

const { t } = useI18n()
const route = useRoute()
const livePiPStore = useLivePiPStore()

const props = defineProps<{ roomIdProp?: string | null; tokenProp?: string | null }>()

// provider 的引用，用于调用 expose 出来的方法（initialize / cleanup）
const providerRef = ref<any>(null)

const enterPiPIfConnected = () => {
  if (!providerRef.value?.connection?.isConnected?.value || !providerRef.value?.connection?.room?.value) {
    return
  }
  const session = {
    roomId: route.params.roomId as string,
    connection: providerRef.value.connection.room.value,
    videoStream: null,
    participantId: providerRef.value.activeMainParticipantId?.value || ''
  }
  livePiPStore.enterPiPMode(session)
}

// 页面事件处理器
const handleBeforeUnload = (_event: BeforeUnloadEvent) => {
  // 如果有活跃直播连接，阻止默认行为并进入画中画模式
  enterPiPIfConnected()
}

const handleVisibilityChange = () => {
  if (document.hidden) {
    // 页面变为不可见时进入画中画模式
    enterPiPIfConnected()
  }
}

onBeforeRouteLeave((_to, _from, next) => {
  // 通过页面返回或左侧导航离开直播时进入画中画
  enterPiPIfConnected()
  next()
})

// 在子组件完全挂载并注册完 refs 后再调用 initialize，避免注册时序问题
import { nextTick } from 'vue'
onMounted(async () => {
  await nextTick()
  // 在微任务后再触发 LiveRoom 的初始化逻辑（加载房间、连接 SSE/RTC 等）
  providerRef.value?.initialize?.()

  // 添加页面事件监听器
  window.addEventListener('beforeunload', handleBeforeUnload)
  document.addEventListener('visibilitychange', handleVisibilityChange)
})

onUnmounted(() => {
  // 组件卸载时清理 provider 中的资源（断开连接、停止轮询等）
  providerRef.value?.cleanup?.()

  // 清理事件监听器
  window.removeEventListener('beforeunload', handleBeforeUnload)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
})

// 3D 鏁欏鐩稿叧鐘舵€?(淇濈暀鍘熸湁3D鍔熻兘)
const showStudentInfo = ref(false)
const showPointerLockHint = ref(false)
const popupPosition = ref({ x: 0, y: 0 })
const currentSeatIndex = ref<number | null>(null)
const currentStudent = ref<any>(null)
</script>

<style scoped>
.live-room-container {
  position: relative;
}
</style>

<style scoped>
.live-room-container {
  position: relative;
}
</style>
