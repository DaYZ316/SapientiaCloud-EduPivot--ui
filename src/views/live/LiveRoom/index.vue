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
  if (!trackCandidate) return null
  if (trackCandidate instanceof MediaStream) return trackCandidate
  if (trackCandidate.mediaStream instanceof MediaStream) return trackCandidate.mediaStream
  if (trackCandidate.stream instanceof MediaStream) return trackCandidate.stream
  try {
    return new MediaStream([trackCandidate as any])
  } catch (e) {
    return null
  }
}

const extractVideoStreamFromRoom = (room: any, participantId: string): MediaStream | null => {
  try {
    if (participantId === 'local') {
      const localParticipant: any = room.localParticipant
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
    if (!remoteParticipant) return null

    const pubs: any[] = Array.from(remoteParticipant.videoTrackPublications?.values?.() ?? [])
    for (const pub of pubs) {
      const track = pub && (pub.track || pub)
      const stream = extractStreamFromTrack(track)
      if (stream) return stream
    }
  } catch (e) {
    return null
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

  const existingVideo = livePiPStore.findVideoElement?.()
  let videoStream = existingVideo?.srcObject instanceof MediaStream ? existingVideo.srcObject : null
  if (!videoStream && participantId) {
    videoStream = extractVideoStreamFromRoom(room, participantId)
  }

  // 如果找到视频流，克隆一份以避免页面跳转时被清理
  if (videoStream) {
    try {
      videoStream = videoStream.clone()
    } catch (e) {
      console.warn('PiP: 无法克隆视频流，将使用原始流', e)
    }
  }

  const session = {
    roomId: route.params.roomId as string,
    connection: room,
    videoStream,
    participantId,
    sessionId: providerRef.value.sessionId?.value ?? null
  }
  console.log('Entering PiP mode with session:', session)
  livePiPStore.enterPiPMode(session)
}

// 页面事件处理器
const handleBeforeUnload = (_event: BeforeUnloadEvent) => {
  // 如果有活跃直播连接，阻止默认行为并进入画中画模式
  enterPiPIfConnected()
}

// 移除 visibilitychange 监听，因为浏览器最小化时不应该进入画中画模式
// 只有在真正离开页面时才进入画中画模式（由 beforeunload 和 beforeRouteLeave 处理）

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
})

onUnmounted(() => {
  if (!livePiPStore.isInPiPMode) {
    providerRef.value?.cleanup?.()
  }

  // 清理事件监听器
  window.removeEventListener('beforeunload', handleBeforeUnload)
})

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
