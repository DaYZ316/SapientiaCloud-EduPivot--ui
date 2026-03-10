<template>
  <slot/>
</template>

<script lang="ts" setup>
import {provide, watch} from 'vue'
import {useLiveRoom} from '../composables/useLiveRoom'
import {type LiveRoomContext, LiveRoomInjectionKey} from '../composables/useLiveRoomContext'
import {useLivePiPStore} from '@/store'

interface Props {
  roomIdProp?: string | null
  tokenProp?: string | null
}

const props = defineProps<Props>()

// 使用组合式函数
const liveRoom = useLiveRoom(props.roomIdProp, props.tokenProp)
const livePiPStore = useLivePiPStore()

// helper: 从 publication/track 中尝试构建 MediaStream
const extractStreamFromTrack = (trackCandidate: any): MediaStream | null => {
  if (!trackCandidate) return null
  if (trackCandidate instanceof MediaStream) return trackCandidate
  if (trackCandidate.mediaStream && trackCandidate.mediaStream instanceof MediaStream) return trackCandidate.mediaStream
  if (trackCandidate.stream && trackCandidate.stream instanceof MediaStream) return trackCandidate.stream
  // 有些 LiveKit track 可以直接作为 MediaStreamTrack 使用
  return new MediaStream([trackCandidate as any])
}

// 提取当前主讲者的视频流
const extractCurrentVideoStream = (room: any, participantId: string): MediaStream | null => {
  let videoStream: MediaStream | null = null

  if (participantId === 'local') {
    const localParticipant: any = room.localParticipant
    const pubs: any[] = []
    if (localParticipant.videoTrackPublications && typeof localParticipant.videoTrackPublications.values === 'function') {
      pubs.push(...Array.from(localParticipant.videoTrackPublications.values()))
    }
    if (typeof localParticipant.getTrackPublications === 'function') {
      const mp = localParticipant.getTrackPublications()
      if (mp && typeof mp.values === 'function') pubs.push(...Array.from(mp.values()))
    }
    if (localParticipant.videoTracks && typeof localParticipant.videoTracks.values === 'function') {
      pubs.push(...Array.from(localParticipant.videoTracks.values()))
    }

    for (const pub of pubs) {
      const track = pub && (((pub as any).track) || (pub as any))
      if (!track) continue
      const stream = extractStreamFromTrack(track)
      if (stream) {
        videoStream = stream
        break
      }
    }
  } else {
    // 远端参与者
    const remoteParticipant = (room.remoteParticipants && room.remoteParticipants.get && room.remoteParticipants.get(participantId)) ||
        Array.from(room.remoteParticipants ? room.remoteParticipants.values() : []).find((p: any) => p.identity === participantId)
    if (remoteParticipant) {
      const videoPubs = Array.from(remoteParticipant.videoTrackPublications?.values?.() ?? [])
      for (const pub of videoPubs) {
        const track = pub && (((pub as any).track) || (pub as any))
        if (!track) continue
        const stream = extractStreamFromTrack(track)
        if (stream) {
          videoStream = stream
          break
        }
      }
    }
  }

  return videoStream
}

// 更新activeSession的videoStream
const updateActiveSessionVideoStream = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const liveRoomAny = liveRoom as any
  const currentSession = livePiPStore.activeSession
  if (currentSession && liveRoomAny.connection?.room?.value && liveRoomAny.activeMainParticipantId?.value) {
    const room = liveRoomAny.connection.room.value as any
    const participantId = liveRoomAny.activeMainParticipantId.value
    const videoStream = extractCurrentVideoStream(room, participantId)

    // 更新session，但保持其他属性不变
    livePiPStore.setActiveSession({
      ...currentSession,
      videoStream,
      participantId
    } as any)
  }
}

// 当LiveKit连接建立时，注册活动会话到 livePiPStore 以便路由守卫使用
watch(() => liveRoom.connectionIsConnected?.value, (connected, prevConnected) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const liveRoomAny = liveRoom as any
  if (connected && liveRoomAny.connection?.room?.value) {
    const room = liveRoomAny.connection.room.value as any
    const participantId = liveRoomAny.activeMainParticipantId?.value ?? ''
    const videoStream = extractCurrentVideoStream(room, participantId)

    livePiPStore.setActiveSession({
      roomId: (props.roomIdProp ?? (liveRoom.roomInfo?.value?.id ?? '')) as string,
      connection: room,
      videoStream,
      participantId,
      sessionId: liveRoomAny.sessionId?.value ?? null
    })

    // 只有在从断开状态变为连接状态时，才清除标志
    if (prevConnected === false && livePiPStore.justRestoredFromPiP) {
      livePiPStore.clearRestoredFromPiPFlag()
    }
  } else if (!connected && prevConnected !== undefined) {
    // 清理活动会话
    livePiPStore.setActiveSession(null)
  }
})

// 监听主讲者变化，及时更新videoStream
watch(() => (liveRoom as any).activeMainParticipantId?.value, (newParticipantId) => {
  if (newParticipantId && liveRoom.connectionIsConnected?.value) {
    updateActiveSessionVideoStream()
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
