<template>
  <div class="live-room-container">
    <page-header :title="roomInfo?.roomName || t('live.room.title')"/>

    <n-card size="small">
      <div class="room-status-bar">
        <div class="status-meta">
          <span class="status-chip">{{ roomStatusLabel }}</span>
          <span class="online-chip">
            {{ t('live.room.onlineCount') }}: {{ onlineCount }}
          </span>
          <span class="role-chip">{{ t('live.room.currentRole', {role: currentUserRoleLabel}) }}</span>
          <span v-if="usingSharedToken" class="token-chip">
            {{ t('live.room.sharedToken') }}
          </span>
          <n-text v-if="connectionStateLabel" :depth="3">
            {{ t('live.room.connectionState') }}: {{ connectionStateLabel }}
          </n-text>
        </div>
        <n-space>
          <n-button v-if="!isConnected" :loading="connecting" type="primary" @click="handleJoin">
            {{ t('live.room.join') }}
          </n-button>
          <n-button v-else type="error" @click="handleLeave">
            {{ t('live.room.leave') }}
          </n-button>
        </n-space>
      </div>

      <div :class="{'is-connected': isConnected}" class="room-layout">
        <section v-if="isConnected" class="video-panel">
          <template v-if="isConnected">
            <div class="video-grid">
              <div class="video-item local-video">
                <video ref="localVideoRef" autoplay muted playsinline/>
                <div class="video-label">{{ t('live.room.localVideo') }}</div>
              </div>
              <div
                  v-for="participant in remoteParticipants"
                  :key="participant.participantId"
                  class="video-item"
              >
                <video :ref="el => setRemoteVideoRef(el as HTMLVideoElement | null, participant.participantId)" autoplay
                       playsinline/>
                <div class="video-label">{{ participant.participantId }}</div>
              </div>
            </div>

            <div class="media-controls">
              <n-space>
                <n-button :type="cameraEnabled ? 'default' : 'error'" @click="toggleCamera">
                  <template #icon>
                    <Icon :component="cameraEnabled ? VideocamOutline : VideocamOffOutline"/>
                  </template>
                  {{ cameraEnabled ? t('live.room.cameraOn') : t('live.room.cameraOff') }}
                </n-button>
                <n-button :type="microphoneEnabled ? 'default' : 'error'" @click="toggleMicrophone">
                  <template #icon>
                    <Icon :component="microphoneEnabled ? MicOutline : MicOffOutline"/>
                  </template>
                  {{ microphoneEnabled ? t('live.room.microphoneOn') : t('live.room.microphoneOff') }}
                </n-button>
              </n-space>
            </div>
          </template>
        </section>

        <section class="chat-panel">
          <ChatPanel
              :can-send="true"
              :extra="`${chatOnlineCount} ${t('live.room.members')}`"
              :loading="false"
              :messages="chatMessages"
              :show-header="true"
              :sub-title="t('live.room.chatDescription')"
              :title="t('live.room.chatTitle')"
              @send="handleSendMessage"
          />
        </section>
      </div>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import {computed, onBeforeUnmount, onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'
import {RemoteParticipant, RemoteTrackPublication, Room, RoomEvent, Track} from 'livekit-client'
import {MicOffOutline, MicOutline, VideocamOffOutline, VideocamOutline} from '@vicons/ionicons5'
import {useI18n} from 'vue-i18n'
import Icon from '@/components/common/Icon.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ChatPanel from '@/components/common/ChatPanel.vue'
import * as liveApi from '@/api/live'
import {getLiveRoomRoleLabel, getLiveRoomStatusLabel, LiveRoomRoleEnum, LiveRoomStatusEnum} from '@/enum/live'
import type {LiveRoomVO} from '@/types/live'
import {useUserStore} from '@/store'

interface ChatMessage {
  id: string
  sender: string
  content: string
  timestamp: string
}

interface RemoteParticipantMedia {
  participantId: string
  videoTrack: Track | null
  audioTrack: Track | null
}

const {t} = useI18n()
const route = useRoute()
const userStore = useUserStore()

const roomId = route.params.roomId as string
const roomInfo = ref<LiveRoomVO | null>(null)
const room = ref<Room | null>(null)
const isConnected = ref(false)
const connecting = ref(false)
const connectionState = ref('')
const cameraEnabled = ref(false)
const microphoneEnabled = ref(false)
const onlineCount = ref(0)

const chatMessages = ref<ChatMessage[]>([])

const localVideoRef = ref<HTMLVideoElement | null>(null)
const remoteParticipants = ref<RemoteParticipantMedia[]>([])
const remoteVideoRefs = ref<Map<string, HTMLVideoElement>>(new Map())

const roomStatusLabel = computed(() => {
  if (!roomInfo.value?.status && roomInfo.value?.status !== 0) {
    return t('live.room.statusUnknown')
  }
  return getLiveRoomStatusLabel(roomInfo.value.status ?? LiveRoomStatusEnum.NOT_STARTED, false)
})

const chatOnlineCount = computed(() => {
  const liveCount = onlineCount.value || 0
  return liveCount > 0 ? liveCount : 1
})

const livekitServerUrl = computed(() => 'ws://192.168.240.211:7880')

const connectionStateLabel = computed(() => {
  const labels: Record<string, string> = {
    connecting: t('live.room.connecting'),
    connected: t('live.room.connected'),
    disconnected: t('live.room.disconnected'),
    reconnecting: t('live.room.reconnecting'),
    failed: t('live.room.connectFailed')
  }
  return labels[connectionState.value] ?? ''
})
const issuedTokenFromRoute = computed(() => typeof route.query.token === 'string' ? route.query.token : '')
const usingSharedToken = computed(() => Boolean(issuedTokenFromRoute.value))
const currentUserRole = computed<LiveRoomRoleEnum>(() => {
  if (userStore.teacherInfo) {
    return LiveRoomRoleEnum.TEACHER
  }
  if (userStore.roles.some((role) => role.roleKey === 'ASSISTANT')) {
    return LiveRoomRoleEnum.ASSISTANT
  }
  return LiveRoomRoleEnum.STUDENT
})
const currentUserRoleLabel = computed(() => getLiveRoomRoleLabel(currentUserRole.value))

onMounted(async () => {
  await loadRoomInfo()
  await loadHistoryMessages()
})

onBeforeUnmount(() => {
  if (room.value) {
    handleLeave()
  }
})

async function loadRoomInfo() {
  const response = await liveApi.getLiveRoomById(roomId).then((res) => res, () => null)
  if (response?.data) {
    roomInfo.value = response.data
  }
}

async function loadHistoryMessages() {
  const response = await liveApi.listLiveRoomMessages(roomId, 50).then((res) => res, () => null)
  const history = response?.data ?? []
  const mapped = history
      .slice()
      .reverse()
      .map((item) => ({
        id: item.id,
        sender: item.senderName || t('live.room.unknown'),
        content: item.content,
        timestamp: item.sendTime ? new Date(item.sendTime).toLocaleTimeString() : ''
      }))
  if (mapped.length === 0) {
    chatMessages.value = [
      {
        id: 'welcome',
        sender: t('live.room.system'),
        content: t('live.room.welcomeMessage'),
        timestamp: new Date().toLocaleTimeString()
      }
    ]
    return
  }
  chatMessages.value = mapped
}

function setRemoteVideoRef(el: HTMLVideoElement | null, participantId: string) {
  if (el) {
    remoteVideoRefs.value.set(participantId, el)
    const participant = findRemoteParticipant(participantId)
    if (participant?.videoTrack) {
      participant.videoTrack.attach(el)
    }
    return
  }
  remoteVideoRefs.value.delete(participantId)
}

function updateOnlineCount(targetRoom: Room | null) {
  if (!targetRoom) {
    onlineCount.value = 0
    return
  }
  const participantTotal = targetRoom.participants ? targetRoom.participants.size : 0
  onlineCount.value = participantTotal + (isConnected.value ? 1 : 0)
}

async function handleJoin() {
  if (!roomInfo.value || connecting.value || isConnected.value) return

  connecting.value = true
  connectionState.value = 'connecting'

  let token = issuedTokenFromRoute.value

  if (!token) {
    const tokenDTO = liveApi.getDefaultLiveRoomTokenRequestDTO()
    tokenDTO.role = currentUserRole.value
    const tokenResponse = await liveApi.issueLiveRoomToken(roomId, tokenDTO).then((res) => res, () => null)
    token = tokenResponse?.data ?? ''
  }

  if (!token) {
    connecting.value = false
    connectionState.value = 'failed'
    return
  }

  const newRoom = new Room()
  bindRoomEvents(newRoom)

  const connected = await newRoom.connect(livekitServerUrl.value, token).then(
      () => true,
      () => false
  )

  if (!connected) {
    connecting.value = false
    connectionState.value = 'failed'
    return
  }

  room.value = newRoom
  isConnected.value = true
  connectionState.value = 'connected'
  connecting.value = false
  updateOnlineCount(newRoom)
  await setupLocalMedia(newRoom)
}

async function handleLeave() {
  if (!room.value) return
  await room.value.disconnect()
  room.value = null
  isConnected.value = false
  connectionState.value = 'disconnected'
  cameraEnabled.value = false
  microphoneEnabled.value = false
  updateOnlineCount(null)
  cleanupRemoteParticipants()
  if (localVideoRef.value) {
    localVideoRef.value.srcObject = null
  }
}

async function toggleCamera() {
  if (room.value) {
    const enabled = !cameraEnabled.value
    await room.value.localParticipant.setCameraEnabled(enabled)
    cameraEnabled.value = enabled
  }
}

async function toggleMicrophone() {
  if (room.value) {
    const enabled = !microphoneEnabled.value
    await room.value.localParticipant.setMicrophoneEnabled(enabled)
    microphoneEnabled.value = enabled
  }
}

function buildLocalMessage(content: string): ChatMessage {
  return {
    id: `${Date.now()}`,
    sender: userStore.userInfo?.nickName || t('live.room.me'),
    content,
    timestamp: new Date().toLocaleTimeString()
  }
}

async function handleSendMessage(content: string) {
  const trimmed = content.trim()
  if (!trimmed) return

  const localMessage = buildLocalMessage(trimmed)
  chatMessages.value.push(localMessage)

  if (room.value) {
    const payload = {
      type: 'chat',
      content: trimmed,
      sender: localMessage.sender,
      sendTime: new Date().toISOString()
    }

    await room.value.localParticipant.publishData(
        new TextEncoder().encode(JSON.stringify(payload)),
        0
    ).then(() => null, () => null)
  }

  const messageDTO = {
    content: trimmed,
    messageType: 'text',
    senderRole: currentUserRole.value
  }

  await liveApi.appendLiveRoomMessage(roomId, messageDTO).then((res) => res, () => null)
}

function bindRoomEvents(targetRoom: Room) {
  targetRoom.on(RoomEvent.Connected, () => {
    isConnected.value = true
    connecting.value = false
    connectionState.value = 'connected'
    updateOnlineCount(targetRoom)
  })

  targetRoom.on(RoomEvent.DataReceived, (data: Uint8Array) => {
    try {
      const text = new TextDecoder().decode(data)
      const payload = JSON.parse(text)
      if (!payload || payload.type !== 'chat' || !payload.content) {
        return
      }
      chatMessages.value.push({
        id: `${Date.now()}`,
        sender: payload.sender || t('live.room.unknown'),
        content: payload.content,
        timestamp: payload.sendTime ? new Date(payload.sendTime).toLocaleTimeString() : new Date().toLocaleTimeString()
      })
    } catch {
      // ignore invalid payload
    }
  })

  targetRoom.on(RoomEvent.Disconnected, () => {
    connectionState.value = 'disconnected'
    isConnected.value = false
    cleanupRemoteParticipants()
    updateOnlineCount(null)
  })

  targetRoom.on(RoomEvent.StateChanged, (state: string) => {
    connectionState.value = state
    if (state === 'connected') {
      isConnected.value = true
      connecting.value = false
    }
    if (state === 'disconnected') {
      isConnected.value = false
      connecting.value = false
    }
  })

  targetRoom.on(RoomEvent.Reconnecting, () => {
    connectionState.value = 'reconnecting'
  })

  targetRoom.on(RoomEvent.Reconnected, () => {
    connectionState.value = 'connected'
  })

  targetRoom.on(RoomEvent.ParticipantConnected, () => {
    updateOnlineCount(targetRoom)
  })

  targetRoom.on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
    detachAllParticipantTracks(participant.identity)
    updateOnlineCount(targetRoom)
  })

  targetRoom.on(RoomEvent.TrackSubscribed, (track: Track, _publication: RemoteTrackPublication, participant: RemoteParticipant) => {
    attachRemoteTrack(participant.identity, track)
  })

  targetRoom.on(RoomEvent.TrackUnsubscribed, (track: Track, _publication: RemoteTrackPublication, participant: RemoteParticipant) => {
    detachRemoteTrack(participant.identity, track)
  })
}

async function setupLocalMedia(targetRoom: Room) {
  await targetRoom.localParticipant.setCameraEnabled(true)
  await targetRoom.localParticipant.setMicrophoneEnabled(true)
  cameraEnabled.value = true
  microphoneEnabled.value = true

  const tracks = targetRoom.localParticipant.getTracks()
  for (const publication of tracks) {
    if (publication.track && publication.track.kind === Track.Kind.Video && localVideoRef.value) {
      publication.track.attach(localVideoRef.value)
    }
  }
}

function attachRemoteTrack(participantId: string, track: Track) {
  const participant = ensureRemoteParticipant(participantId)
  if (track.kind === Track.Kind.Video) {
    participant.videoTrack = track
    const videoEl = remoteVideoRefs.value.get(participantId)
    if (videoEl) {
      track.attach(videoEl)
    }
  } else if (track.kind === Track.Kind.Audio) {
    participant.audioTrack = track
    track.attach()
  }
}

function detachRemoteTrack(participantId: string, track: Track) {
  const participant = findRemoteParticipant(participantId)
  if (!participant) return
  if (track.kind === Track.Kind.Video && participant.videoTrack) {
    const videoEl = remoteVideoRefs.value.get(participantId)
    if (videoEl) {
      track.detach(videoEl)
      videoEl.srcObject = null
    } else {
      track.detach()
    }
    participant.videoTrack = null
  } else if (track.kind === Track.Kind.Audio && participant.audioTrack) {
    track.detach()
    participant.audioTrack = null
  }

  if (!participant.videoTrack && !participant.audioTrack) {
    removeRemoteParticipant(participantId)
  }
}

function detachAllParticipantTracks(participantId: string) {
  const participant = findRemoteParticipant(participantId)
  if (!participant) return
  if (participant.videoTrack) {
    const videoEl = remoteVideoRefs.value.get(participantId)
    if (videoEl) {
      participant.videoTrack.detach(videoEl)
      videoEl.srcObject = null
    } else {
      participant.videoTrack.detach()
    }
  }
  if (participant.audioTrack) {
    participant.audioTrack.detach()
  }
  removeRemoteParticipant(participantId)
}

function ensureRemoteParticipant(participantId: string): RemoteParticipantMedia {
  let participant = findRemoteParticipant(participantId)
  if (!participant) {
    participant = {
      participantId,
      videoTrack: null,
      audioTrack: null
    }
    remoteParticipants.value.push(participant)
  }
  return participant
}

function findRemoteParticipant(participantId: string) {
  return remoteParticipants.value.find((item) => item.participantId === participantId)
}

function removeRemoteParticipant(participantId: string) {
  const index = remoteParticipants.value.findIndex((item) => item.participantId === participantId)
  if (index >= 0) {
    remoteParticipants.value.splice(index, 1)
  }
  remoteVideoRefs.value.delete(participantId)
}

function cleanupRemoteParticipants() {
  remoteParticipants.value.forEach((participant) => {
    if (participant.videoTrack) {
      const videoEl = remoteVideoRefs.value.get(participant.participantId)
      if (videoEl) {
        participant.videoTrack.detach(videoEl)
        videoEl.srcObject = null
      } else {
        participant.videoTrack.detach()
      }
    }
    if (participant.audioTrack) {
      participant.audioTrack.detach()
    }
  })
  remoteParticipants.value = []
  remoteVideoRefs.value.forEach((videoEl) => {
    videoEl.srcObject = null
  })
  remoteVideoRefs.value.clear()
}

</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.live-room-container {
  .room-status-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 12px;
    margin-bottom: 16px;
    border-bottom: 1px solid var(--border-color);
  }

  .status-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
  }

  .status-chip,
  .online-chip,
  .role-chip,
  .token-chip {
    padding: 4px 12px;
    border-radius: 999px;
    background-color: var(--background-tertiary-color);
    font-size: 12px;
  }

  .token-chip {
    border: 1px dashed var(--primary-color);
    color: var(--primary-color);
    background-color: rgba(0, 0, 0, 0);
  }

  .room-layout {
    display: flex;
    flex-direction: column;
    gap: 16px;
    transition: all 0.4s ease;

    &.is-connected {
      flex-direction: row;
      align-items: flex-start;
    }
  }

  .video-panel {
    flex: 1;
    background: var(--background-tertiary-color);
    border-radius: 12px;
    padding: 16px;
    opacity: 0;
    transform: translateY(20px);
    transition: flex 0.4s ease, opacity 0.3s ease, transform 0.3s ease;
    order: 1;
    min-height: 420px;

    .video-placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 12px;
      color: var(--text-color-3);
      min-height: 260px;

      svg {
        width: 48px;
        height: 48px;
      }
    }
  }

  .room-layout.is-connected .video-panel {
    flex: 1 1 auto;
    opacity: 1;
    transform: translateY(0);
  }

  .chat-panel {
    flex: 1;
    background: var(--background-tertiary-color);
    border-radius: 12px;
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    transition: flex 0.4s ease, max-width 0.4s ease;
    order: 2;
    height: 360px;
    box-sizing: border-box;
    overflow: hidden;
  }

  .room-layout.is-connected .chat-panel {
    flex: 0 0 380px;
    max-width: 380px;
  }

  .chat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    h3 {
      margin: 0;
    }

    .chat-online {
      font-size: 12px;
      color: var(--text-color-3);
    }
  }

  .video-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
  }

  .video-item {
    position: relative;
    background: var(--background-color);
    border-radius: 8px;
    overflow: hidden;
    aspect-ratio: 16 / 9;

    video {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .video-label {
      position: absolute;
      bottom: 8px;
      left: 8px;
      padding: 4px 8px;
      background: rgba(0, 0, 0, 0.6);
      color: var(--text-color);
      border-radius: 4px;
      font-size: 12px;
    }
  }

  .media-controls {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--border-color);
  }
}
</style>

