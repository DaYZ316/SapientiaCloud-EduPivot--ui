<template>
  <slot />
</template>

<script setup lang="ts">
import { provide } from 'vue'
import { useLiveRoom } from '../composables/useLiveRoom'
import { LiveRoomInjectionKey, type LiveRoomContext } from '../composables/useLiveRoomContext'

interface Props {
  roomIdProp?: string | null
  tokenProp?: string | null
}

const props = defineProps<Props>()

// 使用组合式函数
const liveRoom = useLiveRoom(props.roomIdProp, props.tokenProp)

// 提供上下文给子组件
provide<LiveRoomContext>(LiveRoomInjectionKey, {
  ...liveRoom,
  loadingState: liveRoom.loadingState
})

// 导出给父组件使用
defineExpose(liveRoom)
</script>
