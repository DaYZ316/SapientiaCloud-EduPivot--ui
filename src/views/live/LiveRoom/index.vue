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

    <student-info-popup
      :position="popupPosition"
      :seat-index="currentSeatIndex"
      :show="showStudentInfo"
      :student="currentStudent"
    />
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

const extractStreamFromTrack = (trackCandidate: any): MediaStream | null => {
  if (!trackCandidate) {
    return null
  }

  // 如果已经是 MediaStream
  if (trackCandidate instanceof MediaStream) {
    return trackCandidate
  }

  // 检查 mediaStream 属性
  if (trackCandidate.mediaStream instanceof MediaStream) {
    return trackCandidate.mediaStream
  }

  // 检查 stream 属性
  if (trackCandidate.stream instanceof MediaStream) {
    return trackCandidate.stream
  }

  // 尝试从 MediaStreamTrack 创建
  if (trackCandidate.kind === 'video' || trackCandidate.id) {
    const stream = new MediaStream([trackCandidate as any])
    return stream
  }

  return null
}

const extractVideoStreamFromRoom = (room: any, participantId: string): MediaStream | null => {
  if (!room) {
    return null
  }

  if (participantId === 'local') {
    const localParticipant: any = room.localParticipant
    if (!localParticipant) {
      return null
    }

    const pubs: any[] = Array.from(localParticipant?.videoTrackPublications?.values?.() ?? [])

    for (const pub of pubs) {
      const track = pub && (pub.track || pub)
      const stream = extractStreamFromTrack(track)
      if (stream) return stream
    }
    return null
  }

  const remoteParticipant = (room.remoteParticipants && room.remoteParticipants.get && room.remoteParticipants.get(participantId)) ||
    Array.from(room.remoteParticipants ? room.remoteParticipants.values() : []).find((p: any) => p.identity === participantId)

  if (!remoteParticipant) {
    return null
  }

  const pubs: any[] = Array.from(remoteParticipant.videoTrackPublications?.values?.() ?? [])

  for (const pub of pubs) {
    const track = pub && (pub.track || pub)
    const stream = extractStreamFromTrack(track)
    if (stream) return stream
  }

  return null
}

const resolvePiPParticipantId = (room: any, preferredId?: string | null): string => {
  if (preferredId) return preferredId

  const remoteWithVideo = (Array.from(room.remoteParticipants ? room.remoteParticipants.values() : []) as any[]).find((p: any) => {
    const pubs = Array.from(p.videoTrackPublications?.values?.() ?? [])
    return pubs.some((pub: any) => (pub.track || pub)?.kind === 'video')
  })
  if (remoteWithVideo?.identity) return remoteWithVideo.identity

  const localPubs = Array.from(room.localParticipant?.videoTrackPublications?.values?.() ?? [])
  if (localPubs.length > 0) return 'local'

  const firstRemote = (Array.from(room.remoteParticipants ? room.remoteParticipants.values() : []) as any[])[0]
  return firstRemote?.identity || 'local'
}

const enterPiPIfConnected = () => {
  if (!providerRef.value?.connection?.isConnected?.value || !providerRef.value?.connection?.room?.value) {
    return
  }

  const room = providerRef.value.connection.room.value
  const participantId = resolvePiPParticipantId(room, providerRef.value.activeMainParticipantId?.value)

  // 1. 首先尝试从当前页面的视频元素获取
  const existingVideo = livePiPStore.findVideoElement?.()
  let videoStream = existingVideo?.srcObject instanceof MediaStream ? existingVideo.srcObject : null

  // 2. 如果没有，尝试从 room 中提取
  if (!videoStream && participantId) {
    videoStream = extractVideoStreamFromRoom(room, participantId)
  }

  // 3. 如果找到视频流，克隆一份以避免页面跳转时被清理
  if (videoStream) {
    videoStream = videoStream.clone()
  }

  const session = {
    roomId: route.params.roomId as string,
    connection: room,
    videoStream,
    participantId,
    sessionId: providerRef.value.sessionId?.value ?? null
  }

  livePiPStore.enterPiPMode(session)
}

// 页面事件处理器
const handleBeforeUnload = (_event: BeforeUnloadEvent) => {
  // 浏览器直接关闭/刷新时，兜底通知后端释放会话
  providerRef.value?.handlePageUnload?.()
}

const handlePageHide = (event: PageTransitionEvent) => {
  // 被 BFCache 暂存时不要释放会话
  if (event.persisted) {
    return
  }
  providerRef.value?.handlePageUnload?.()
}

// 移除 visibilitychange 监听，因为浏览器最小化时不应该进入画中画模式
// 只有在真正离开页面时才进入画中画模式（由 beforeunload 和 beforeRouteLeave 处理）

onBeforeRouteLeave((_to, _from, next) => {
  // 通过页面返回或左侧导航离开直播时进入画中画
  // 无论 PiP 进入是否成功，都不阻塞路由切换
  try {
    enterPiPIfConnected()
  } finally {
    next()
  }
})

// 在子组件完全挂载并注册完 refs 后再调用 initialize，避免注册时序问题
import { nextTick } from 'vue'
onMounted(async () => {
  await nextTick()

  // 添加页面事件监听器
  window.addEventListener('beforeunload', handleBeforeUnload)
  window.addEventListener('pagehide', handlePageHide)

  // 如果刚刚从 PiP 恢复，使用 store 中已有的连接
  if (livePiPStore.justRestoredFromPiP && livePiPStore.activeSession) {
    const session = livePiPStore.activeSession
    if (session.connection) {
      // 恢复会话：加载 roomInfo、连接 SSE、同步参与者等
      await providerRef.value?.restoreSession?.(
        session.connection,
        session.sessionId ?? null,
        session.roomId
      )
    }
    return
  }

  // 在微任务后再触发 LiveRoom 的初始化逻辑（加载房间、连接 SSE/RTC 等）
  providerRef.value?.initialize?.()
})

onUnmounted(() => {
  if (!livePiPStore.isInPiPMode) {
    // 非 PiP 模式：完全清理，包括断开 detector
    providerRef.value?.cleanup?.(false)
  } else {
    // PiP 模式：只断开 LiveKit 连接，不断开 detector（保留给 Classroom3D 使用）
    providerRef.value?.cleanup?.(true)
  }

  // 清理事件监听器
  window.removeEventListener('beforeunload', handleBeforeUnload)
  window.removeEventListener('pagehide', handlePageHide)
})

const showStudentInfo = ref(false)
const showPointerLockHint = ref(false)
const popupPosition = ref({ x: 0, y: 0 })
const currentSeatIndex = ref<number | null>(null)
const currentStudent = ref<any>(null)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.live-room-container {
  position: relative;
}
</style>
