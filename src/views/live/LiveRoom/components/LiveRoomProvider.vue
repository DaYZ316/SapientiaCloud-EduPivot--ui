<template>
  <slot />
</template>

<script setup lang="ts">
import { provide, watch } from 'vue'
import { useLiveRoom } from '../composables/useLiveRoom'
import { LiveRoomInjectionKey, type LiveRoomContext } from '../composables/useLiveRoomContext'
import { useLivePiPStore } from '@/store'

interface Props {
  roomIdProp?: string | null
  tokenProp?: string | null
}

const props = defineProps<Props>()

// 使用组合式函数
const liveRoom = useLiveRoom(props.roomIdProp, props.tokenProp)
const livePiPStore = useLivePiPStore()

// 当LiveKit连接建立时，注册活动会话到 livePiPStore 以便路由守卫使用
watch(() => liveRoom.connectionIsConnected?.value, (connected) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const liveRoomAny = liveRoom as any
  if (connected && liveRoomAny.connection?.room?.value) {
    livePiPStore.setActiveSession({
      roomId: (props.roomIdProp ?? (liveRoom.roomInfo?.value?.id ?? '')) as string,
      connection: liveRoomAny.connection.room.value,
      videoStream: null,
      participantId: liveRoomAny.activeMainParticipantId?.value ?? ''
    } as any)
  } else if (!connected) {
    // 清理活动会话
    livePiPStore.setActiveSession(null)
  }
})

// 提供上下文给子组件
provide<LiveRoomContext>(LiveRoomInjectionKey, {
  ...liveRoom,
  loadingState: liveRoom.loadingState
})

// 导出给父组件使用
defineExpose(liveRoom)
</script>
