<template>
  <div class="live-room-container">
    <page-header :title="roomInfo?.roomName || t('live.room.title')"/>

    <!-- 全局加载状态 -->
    <n-spin v-if="loadingState.hasAnyLoading" size="large" class="global-loading">
      <div class="loading-content">
        <n-icon :component="VideocamOutline" size="32" />
        <div class="loading-text">{{ loadingState.getLoadingMessage(loadingState.getLoadingStates()[0]) || t('live.common.processing') }}</div>
      </div>
    </n-spin>

    <n-card v-show="!loadingState.hasAnyLoading" size="small">
      <div class="room-status-bar">
        <connection-status
          :room-status="roomInfo?.status || null"
          :online-count="onlineCount"
          :current-user-role="currentUserRole"
          :is-recording="recording.isRecording.value"
          :recording-status-label="recording.recordingStatusLabel.value"
          :connection-state-label="connectionStateLabel"
          :connection-error="connectionError"
        />
        <n-space>
          <n-button v-if="connectionIsConnected" type="error" @click="handleLeave">
            {{ t('live.room.leave') }}
          </n-button>
        </n-space>
      </div>

      <div class="room-layout is-connected">
        <section class="video-panel">
          <video-panel
            ref="videoPanelRef"
            :is-connected="connectionIsConnected"
            :connecting="connectionConnecting"
            :connection-state-label="connectionStateLabel"
            :remote-participants="remoteParticipants"
          />

          <media-controls
            v-if="connectionIsConnected"
            :camera-enabled="cameraEnabled"
            :microphone-enabled="microphoneEnabled"
            :is-recording="recording.isRecording.value"
            :recording-loading="recordingLoading"
            :current-user-role="currentUserRole"
            :can-record="recording.canRecord(roomInfo, currentUserRole)"
            @toggle-camera="handleToggleCamera"
            @toggle-microphone="handleToggleMicrophone"
            @toggle-recording="handleToggleRecording"
          />
        </section>

        <section class="chat-panel chat-panel-connected">
          <ChatPanel
              :can-send="true"
              :extra="`${chatOnlineCount} ${t('live.room.members')}`"
              :fixed-footer="true"
              :loading="false"
              :messages="chatMessages"
              :placeholder="t('live.room.chatPlaceholder')"
              :show-header="true"
              :sub-title="t('live.room.chatDescription')"
              :title="t('live.room.chatTitle')"
              @send="handleSendMessage"
              style="height: 100%; flex: 1 1 auto; min-height: 0;"
          />
        </section>
      </div>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch, type Ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { NIcon, NSpin } from 'naive-ui'
import { VideocamOutline } from '@vicons/ionicons5'
import { RoomEvent, Track, RemoteParticipant, RemoteTrackPublication } from 'livekit-client'
import PageHeader from '@/components/common/PageHeader.vue'
import ChatPanel from '@/components/common/ChatPanel.vue'
import VideoPanel from './components/VideoPanel.vue'
import MediaControls from './components/MediaControls.vue'
import ConnectionStatus from './components/ConnectionStatus.vue'
import { useLiveConnection } from './composables/useLiveConnection'
import { useMediaDevices } from './composables/useMediaDevices'
import { useChatMessages } from './composables/useChatMessages'
import { useRecording } from './composables/useRecording'
import { useLiveRealtime } from './composables/useLiveRealtime'
import { useErrorHandler } from './composables/useErrorHandler'
import { useResourceManager } from './composables/useResourceManager'
import { useLoadingState } from './composables/useLoadingState'
import { useRetryMechanism } from './composables/useRetryMechanism'
import * as liveApi from '@/api/live'
import { LiveRoomRoleEnum } from '@/enum/live'
import type { LiveRoomVO, RemoteParticipantMedia } from '@/types/live'
import { useUserStore } from '@/store'

const { t } = useI18n()
const route = useRoute()
const props = defineProps<{ roomIdProp?: string | null; tokenProp?: string | null }>()
const userStore = useUserStore()

const roomId = props.roomIdProp ?? (route.params.roomId as string)
const roomInfo = ref<LiveRoomVO | null>(null)
const videoPanelRef = ref<InstanceType<typeof VideoPanel> | null>(null)
const remoteParticipants = ref<RemoteParticipantMedia[]>([])

// 使用 composables
const currentUserRole = computed<LiveRoomRoleEnum>(() => {
  if (userStore.teacherInfo) {
    return LiveRoomRoleEnum.TEACHER
  }
  if (userStore.roles.some((role) => role.roleKey === 'ASSISTANT')) {
    return LiveRoomRoleEnum.ASSISTANT
  }
  return LiveRoomRoleEnum.STUDENT
})

// 初始化健壮性管理器
const errorHandler = useErrorHandler()
const resourceManager = useResourceManager()
const loadingState = useLoadingState()
const retryMechanism = useRetryMechanism()

// 初始化业务逻辑
const connection = useLiveConnection()
const media = useMediaDevices(connection.room as Ref<import('livekit-client').Room | null>)
const chat = useChatMessages()
const recording = useRecording()
const realtime = useLiveRealtime()

// 连接锁：防止递归重试
let isConnecting = false
const remoteAudioElements = new Map<string, HTMLAudioElement>()

const onlineCount = ref(0)

// 确保传递给子组件的值类型正确
const connectionStateLabel = computed(() => connection.connectionStateLabel.value || '')
const connectionError = computed(() => connection.connectionError.value || null)
const connectionIsConnected = computed(() => connection.isConnected.value)
const connectionConnecting = computed(() => connection.connecting.value)
const cameraEnabled = computed(() => media.cameraEnabled.value)
const microphoneEnabled = computed(() => media.microphoneEnabled.value)
const recordingLoading = computed(() => recording.recordingLoading.value)
const chatMessages = computed(() => {
  const msgs = (chat.messages as any)?.value ?? (chat.messages as any)
  return Array.isArray(msgs) ? msgs : []
})
const chatOnlineCount = computed(() => {
  const count = (chat.chatOnlineCount as any)?.value ?? (chat.chatOnlineCount as any)
  return typeof count === 'number' ? count : onlineCount.value
})

const getParticipantName = (participant: RemoteParticipant) => {
  return participant.name || participant.identity
}

const updateOnlineCount = (targetRoom: import('livekit-client').Room | null) => {
  if (!targetRoom) {
    onlineCount.value = 0
    return
  }
  const remoteCount = targetRoom.remoteParticipants ? targetRoom.remoteParticipants.size : 0
  onlineCount.value = remoteCount + 1
}

const ensureParticipantSubscribed = (participant: RemoteParticipant) => {
  participant.trackPublications.forEach((publication) => {
    if (publication.isSubscribed) return
    publication.setSubscribed(true)
  })
}

const syncExistingParticipantTracks = (participant: RemoteParticipant) => {
  const displayName = getParticipantName(participant)
  const videoPublications = Array.from(participant.videoTrackPublications.values())
  videoPublications.forEach((publication: RemoteTrackPublication) => {
    if (publication.track && publication.track.kind === Track.Kind.Video && videoPanelRef.value) {
      const existingIndex = remoteParticipants.value.findIndex(p => p.participantId === participant.identity)
      if (existingIndex >= 0) {
        remoteParticipants.value[existingIndex].videoTrack = publication.track
        remoteParticipants.value[existingIndex].displayName = displayName
      } else {
        remoteParticipants.value.push({
          participantId: participant.identity,
          displayName,
          videoTrack: publication.track,
          audioTrack: null
        })
      }
      nextTick(() => {
        if (publication.track) {
          videoPanelRef.value?.attachRemoteVideo(participant.identity, publication.track)
        }
      })
    }
  })

  const audioPublications = Array.from(participant.audioTrackPublications.values())
  audioPublications.forEach((publication: RemoteTrackPublication) => {
    if (publication.track && publication.track.kind === Track.Kind.Audio) {
      attachRemoteAudio(participant.identity, publication.track)
      const existingIndex = remoteParticipants.value.findIndex(p => p.participantId === participant.identity)
      if (existingIndex >= 0) {
        remoteParticipants.value[existingIndex].audioTrack = publication.track
        remoteParticipants.value[existingIndex].displayName = displayName
      }
    }
  })
}

const attachRemoteAudio = (participantId: string, track: Track) => {
  if (track.kind !== Track.Kind.Audio) return
  const key = participantId
  const existing = remoteAudioElements.get(key)
  if (existing) {
    existing.remove()
    remoteAudioElements.delete(key)
  }
  const audioEl = track.attach() as HTMLAudioElement
  audioEl.autoplay = true
  audioEl.style.display = 'none'
  document.body.appendChild(audioEl)
  remoteAudioElements.set(key, audioEl)
  audioEl.play().catch(() => {
    // Autoplay might be blocked until user gesture.
  })
}

const detachRemoteAudio = (participantId: string, track: Track) => {
  if (track.kind !== Track.Kind.Audio) return
  const key = participantId
  const audioEl = remoteAudioElements.get(key)
  if (audioEl) {
    track.detach(audioEl)
    audioEl.remove()
    remoteAudioElements.delete(key)
  }
}

const cleanupRemoteAudio = () => {
  remoteAudioElements.forEach((audioEl) => {
    audioEl.remove()
  })
  remoteAudioElements.clear()
}

const attachLocalVideoTrack = () => {
  const currentRoom = connection.room.value
  if (!currentRoom || !videoPanelRef.value) return
  const publications = Array.from(currentRoom.localParticipant.videoTrackPublications.values())
  const videoPublication = publications.find(pub => pub.track && pub.track.kind === Track.Kind.Video)
  if (videoPublication?.track) {
    videoPanelRef.value.attachLocalVideo(videoPublication.track)
  }
}

watch(cameraEnabled, (enabled) => {
  if (!enabled) {
    videoPanelRef.value?.cleanupLocalVideo()
    return
  }
  attachLocalVideoTrack()
})

watch(
  () => connection.room.value,
  (currentRoom) => {
    if (!currentRoom) return
    updateOnlineCount(currentRoom)
    currentRoom.remoteParticipants.forEach((participant) => {
      ensureParticipantSubscribed(participant)
      syncExistingParticipantTracks(participant)
    })

    resourceManager.registerEventListener(currentRoom, RoomEvent.LocalTrackPublished, (publication: any) => {
      if (publication?.track?.kind === Track.Kind.Video) {
        videoPanelRef.value?.attachLocalVideo(publication.track)
      }
    })

    resourceManager.registerEventListener(currentRoom, RoomEvent.LocalTrackUnpublished, (publication: any) => {
      if (publication?.track?.kind === Track.Kind.Video) {
        videoPanelRef.value?.cleanupLocalVideo()
      }
    })

    resourceManager.registerEventListener(currentRoom, RoomEvent.TrackSubscribed, (track: Track, _publication: RemoteTrackPublication, participant: RemoteParticipant) => {
      updateOnlineCount(currentRoom)
      if (track.kind === Track.Kind.Video && videoPanelRef.value) {
        const displayName = getParticipantName(participant)
        const existingIndex = remoteParticipants.value.findIndex(p => p.participantId === participant.identity)
        if (existingIndex >= 0) {
          remoteParticipants.value[existingIndex] = {
            ...remoteParticipants.value[existingIndex],
            participantId: participant.identity,
            displayName,
            videoTrack: track
          }
        } else {
          remoteParticipants.value.push({
            participantId: participant.identity,
            displayName,
            videoTrack: track,
            audioTrack: null
          })
        }

        nextTick(() => {
          videoPanelRef.value?.attachRemoteVideo(participant.identity, track)
        })
      }

      if (track.kind === Track.Kind.Audio) {
        const displayName = getParticipantName(participant)
        attachRemoteAudio(participant.identity, track)
        const existingIndex = remoteParticipants.value.findIndex(p => p.participantId === participant.identity)
        if (existingIndex >= 0) {
          remoteParticipants.value[existingIndex] = {
            ...remoteParticipants.value[existingIndex],
            displayName,
            audioTrack: track
          }
        }
      }
    })

    resourceManager.registerEventListener(currentRoom, RoomEvent.TrackUnsubscribed, (track: Track, _publication: RemoteTrackPublication, participant: RemoteParticipant) => {
      updateOnlineCount(currentRoom)
      if (track.kind === Track.Kind.Video && videoPanelRef.value) {
        const index = remoteParticipants.value.findIndex(p => p.participantId === participant.identity)
        if (index >= 0) {
          const existing = remoteParticipants.value[index]
          if (existing.audioTrack) {
            remoteParticipants.value[index] = {
              ...existing,
              videoTrack: null
            }
          } else {
            remoteParticipants.value.splice(index, 1)
          }
        }

        videoPanelRef.value.detachRemoteVideo(participant.identity, track)
      }

      if (track.kind === Track.Kind.Audio) {
        detachRemoteAudio(participant.identity, track)
        const index = remoteParticipants.value.findIndex(p => p.participantId === participant.identity)
        if (index >= 0) {
          const existing = remoteParticipants.value[index]
          if (existing.videoTrack) {
            remoteParticipants.value[index] = {
              ...existing,
              audioTrack: null
            }
          } else {
            remoteParticipants.value.splice(index, 1)
          }
        }
      }
    })

    // 处理参与者连接和断开
    resourceManager.registerEventListener(currentRoom, RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
      updateOnlineCount(currentRoom)
      ensureParticipantSubscribed(participant)
      // 当参与者连接时，检查是否已有视频轨道
      const displayName = getParticipantName(participant)
      const videoPublications = Array.from(participant.videoTrackPublications.values())
      videoPublications.forEach((publication: RemoteTrackPublication) => {
        if (publication.track && publication.track.kind === Track.Kind.Video && videoPanelRef.value) {
          const existingIndex = remoteParticipants.value.findIndex(p => p.participantId === participant.identity)
          if (existingIndex >= 0) {
            remoteParticipants.value[existingIndex].videoTrack = publication.track
            remoteParticipants.value[existingIndex].displayName = displayName
          } else {
            remoteParticipants.value.push({
              participantId: participant.identity,
              displayName,
              videoTrack: publication.track,
              audioTrack: null
            })
          }
          nextTick(() => {
            if (publication.track) {
              videoPanelRef.value?.attachRemoteVideo(participant.identity, publication.track)
            }
          })
        }
      })

      const audioPublications = Array.from(participant.audioTrackPublications.values())
      audioPublications.forEach((publication: RemoteTrackPublication) => {
        if (publication.track && publication.track.kind === Track.Kind.Audio) {
          attachRemoteAudio(participant.identity, publication.track)
          const existingIndex = remoteParticipants.value.findIndex(p => p.participantId === participant.identity)
          if (existingIndex >= 0) {
            remoteParticipants.value[existingIndex].audioTrack = publication.track
            remoteParticipants.value[existingIndex].displayName = displayName
          }
        }
      })
    })

    resourceManager.registerEventListener(currentRoom, RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
      updateOnlineCount(currentRoom)
      // 从 remoteParticipants 数组中移除参与者
      const index = remoteParticipants.value.findIndex(p => p.participantId === participant.identity)
      if (index >= 0) {
        remoteParticipants.value.splice(index, 1)
      }

      const audioEl = remoteAudioElements.get(participant.identity)
      if (audioEl) {
        audioEl.remove()
        remoteAudioElements.delete(participant.identity)
      }
    })
  }
)

// 页面卸载检测
const handlePageUnload = () => {
  if (connection.room.value) {
    // 在页面卸载时进行同步清理，忽略可能的错误
    connection.disconnect().catch(() => {
      // 忽略清理过程中的错误
    })
  }
}

// 加载房间信息
async function loadRoomInfo() {
  return liveApi.getLiveRoomById(roomId).then((res) => {
    if (res?.data) {
      roomInfo.value = res.data
    }
    return res
  }, () => {
    // 静默处理错误，不抛出异常
    return null
  })
}

// 初始化
onMounted(async () => {
  // 添加页面卸载监听器
  window.addEventListener('beforeunload', handlePageUnload)
  window.addEventListener('unload', handlePageUnload)

  await loadRoomInfo()
  await chat.loadHistoryMessages(roomId)

  // 检查 props 或路由参数中是否有 token，直接尝试加入
  const queryToken = route.query.token as string
  const providedToken = props.tokenProp ?? queryToken ?? null

  // 启动SSE实时连接
  await realtime.connect(roomId, null)

  // 带重试的连接逻辑
  const connectWithRetry = async (token?: string) => {
    // 防递归：如果正在连接，直接返回
    if (isConnecting) {
      return
    }

    isConnecting = true
    loadingState.setLoading('connection', true, t('live.common.connectingRoom'))

    return retryMechanism.retry(
      () => connection.connect(roomInfo.value, currentUserRole.value, token),
      {
        maxRetries: 3,
        baseDelay: 2000,
        retryCondition: (error) => retryMechanism.isRetryableError(error),
        onRetry: (attempt, _error) => {
          loadingState.setLoading('connection', true, t('live.common.retryingConnection', { attempt, total: 3 }))
        }
      }
    ).then(() => {
      // 如果成功到达这里，说明连接成功
      loadingState.setLoading('connection', false)

      // 设置实时消息监听
      if (connection.room.value) {
        chat.setupRealtimeMessages(connection.room.value)
      }

      // 媒体设置将在用户点击媒体控制按钮时进行
    }, (error) => {
      loadingState.setLoading('connection', false)
      errorHandler.handleError(error, t('live.common.connectionContext'), {
        allowRetry: true,
        onRetry: () => connectWithRetry(token)
      })

      // 连接失败时启用降级模式 - 启动消息轮询
      chat.startPolling(roomId)
    }).finally(() => {
      isConnecting = false
    })
  }

  if (providedToken) {
    // 有token时直接加入直播
    setTimeout(() => connectWithRetry(providedToken), 150)
  } else {
    // 没有token时尝试自动获取并加入
    setTimeout(() => connectWithRetry(), 150)
  }
})

onBeforeUnmount(() => {
  // 移除页面卸载监听器
  window.removeEventListener('beforeunload', handlePageUnload)
  window.removeEventListener('unload', handlePageUnload)

  if (connection.room.value) {
    connection.disconnect()
  }

  cleanupRemoteAudio()

  // 停止SSE连接
  realtime.disconnect()

  // 停止轮询
  chat.stopPolling()
})

// 处理离开房间
async function handleLeave() {
  loadingState.setLoading('disconnect', true, t('live.common.disconnecting'))

  return connection.disconnect().then(() => {
    // 清理视频面板资源
    if (videoPanelRef.value) {
      videoPanelRef.value.cleanupRemoteVideos()
      videoPanelRef.value.cleanupLocalVideo()
    }
    cleanupRemoteAudio()

    // 清理所有资源
    resourceManager.cleanupAll()

    // 重新启动消息轮询
    chat.startPolling(roomId)

    loadingState.setLoading('disconnect', false)
  }, (error) => {
    loadingState.setLoading('disconnect', false)
    errorHandler.handleError(error, t('live.common.disconnectContext'))
  })
}

// 处理发送消息
async function handleSendMessage(content: string) {
  await chat.sendMessage(content, connection.room.value as import('livekit-client').Room | null, roomId)
}

// 处理切换摄像头
async function handleToggleCamera() {
  loadingState.setLoading('camera', true, t('live.common.switchingCamera'))

  return media.toggleCamera().then(() => {
    loadingState.setLoading('camera', false)
  }, (error) => {
    loadingState.setLoading('camera', false)
    errorHandler.handleError(error, t('live.common.cameraToggleContext'), {
      allowRetry: true,
      onRetry: handleToggleCamera
    })
  })
}

// 处理切换麦克风
async function handleToggleMicrophone() {
  loadingState.setLoading('microphone', true, t('live.common.switchingMicrophone'))

  return media.toggleMicrophone().then(() => {
    loadingState.setLoading('microphone', false)
  }, (error) => {
    loadingState.setLoading('microphone', false)
    errorHandler.handleError(error, t('live.common.microphoneToggleContext'), {
      allowRetry: true,
      onRetry: handleToggleMicrophone
    })
  })
}

// 处理切换录制
async function handleToggleRecording() {
  const action = recording.isRecording ? t('live.common.recordingStop') : t('live.common.recordingStart')
  loadingState.setLoading('recording', true, t('live.common.recordingInProgress', { action }))

  return recording.toggleRecording(roomInfo.value, currentUserRole.value).then(() => {
    loadingState.setLoading('recording', false)
  }, (error) => {
    loadingState.setLoading('recording', false)
    errorHandler.handleError(error, t('live.common.recordingContext', { action }), {
      allowRetry: true,
      onRetry: handleToggleRecording
    })
  })
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.live-room-container {
  position: relative;

  .global-loading {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    z-index: 9999;

    .loading-content {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 16px;
      padding: 32px;

      .loading-text {
        font-size: 14px;
        color: var(--text-secondary-color);
        text-align: center;
      }
    }
  }

  .room-status-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 12px;
    margin-bottom: 16px;
    border-bottom: 1px solid var(--border-color);
  }

  .room-layout {
    display: flex;
    flex-direction: column;
    gap: 16px;
    transition: all 0.4s ease;
    min-height: 0;
    height: calc(100vh - 200px);

    &.is-connected {
      flex-direction: row;
      align-items: stretch;
      height: calc(100vh - 200px);
      min-height: 600px;
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
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    height: 100%;
  }

  .room-layout.is-connected .video-panel,
  .room-layout:not(.is-connected) .video-panel {
    flex: 2 1 60%;
    opacity: 1;
    transform: translateY(0);
    min-height: 0;
  }

  .chat-panel {
    flex: 1;
    background: var(--background-tertiary-color);
    border-radius: 12px;
    padding: 0;
    display: flex;
    flex-direction: column;
    transition: flex 0.4s ease, width 0.4s ease;
    order: 2;
    height: 100%;
    min-height: 0;
    max-height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;
  }

  .room-layout.is-connected .chat-panel,
  .chat-panel.chat-panel-connected {
    flex: 0 0 400px;
    width: 400px;
    min-width: 400px;
    height: 100%;
    min-height: 0;
    max-height: 100%;
    align-self: stretch;
    position: relative;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
}
</style>

<style lang="scss">
// 确保聊天面板在直播房间中的正确显示
.live-room-container .room-layout.is-connected .chat-panel.chat-panel-connected {
  border-radius: 12px;
}
</style>
