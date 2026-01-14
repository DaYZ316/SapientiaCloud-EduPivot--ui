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
          :connection-state-label="connectionStateLabel.value"
          :connection-error="connectionError.value"
        />
        <n-space>
          <n-button v-if="connection.isConnected" type="error" @click="handleLeave">
            {{ t('live.room.leave') }}
          </n-button>
        </n-space>
      </div>

      <div :class="{'is-connected': connection.isConnected}" class="room-layout">
        <section class="video-panel">
          <video-panel
            ref="videoPanelRef"
            :is-connected="connectionIsConnected.value"
            :connecting="connectionConnecting.value"
            :connection-state-label="connectionStateLabel.value"
            :remote-participants="remoteParticipants"
          />

          <media-controls
            v-if="connection.isConnected"
            :camera-enabled="cameraEnabled.value"
            :microphone-enabled="microphoneEnabled.value"
            :is-recording="recording.isRecording.value"
            :recording-loading="recordingLoading.value"
            :current-user-role="currentUserRole"
            :can-record="recording.canRecord(roomInfo, currentUserRole)"
            @toggle-camera="handleToggleCamera"
            @toggle-microphone="handleToggleMicrophone"
            @toggle-recording="handleToggleRecording"
          />
        </section>

        <section :class="['chat-panel', {'chat-panel-connected': connection.isConnected}]">
          <ChatPanel
              :can-send="true"
              :extra="`${chat.chatOnlineCount} ${t('live.room.members')}`"
              :fixed-footer="!!connection.isConnected"
              :loading="false"
              :messages="chatMessages"
              :placeholder="t('live.room.chatPlaceholder')"
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

// 在线人数
const onlineCount = computed(() => {
  // 这里可以根据连接状态和其他逻辑计算
  return connection.room ? 1 : 0
})

// 确保传递给子组件的值类型正确
const connectionStateLabel = computed(() => connection.connectionStateLabel || '')
const connectionError = computed(() => connection.connectionError || null)
const connectionIsConnected = computed(() => connection.isConnected)
const connectionConnecting = computed(() => connection.connecting)
const cameraEnabled = computed(() => media.cameraEnabled)
const microphoneEnabled = computed(() => media.microphoneEnabled)
const recordingLoading = computed(() => recording.recordingLoading)
const chatMessages = computed(() => {
  const msgs = (chat.messages as any)?.value ?? (chat.messages as any)
  return Array.isArray(msgs) ? msgs : []
})

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

    // 添加远程参与者视频轨道处理
    resourceManager.registerEventListener(currentRoom, RoomEvent.TrackSubscribed, (track: Track, _publication: RemoteTrackPublication, participant: RemoteParticipant) => {
      if (track.kind === Track.Kind.Video && videoPanelRef.value) {
        // 更新 remoteParticipants 数组
        const existingIndex = remoteParticipants.value.findIndex(p => p.participantId === participant.identity)
        if (existingIndex >= 0) {
          // 更新现有参与者
          remoteParticipants.value[existingIndex] = {
            participantId: participant.identity,
            videoTrack: track,
            audioTrack: null // 可以后续扩展音频处理
          }
        } else {
          // 添加新参与者
          remoteParticipants.value.push({
            participantId: participant.identity,
            videoTrack: track,
            audioTrack: null
          })
        }

        // 附加视频轨道到 VideoPanel
        videoPanelRef.value.attachRemoteVideo(participant.identity, track)
      }
    })

    resourceManager.registerEventListener(currentRoom, RoomEvent.TrackUnsubscribed, (track: Track, _publication: RemoteTrackPublication, participant: RemoteParticipant) => {
      if (track.kind === Track.Kind.Video && videoPanelRef.value) {
        // 从 remoteParticipants 数组中移除
        const index = remoteParticipants.value.findIndex(p => p.participantId === participant.identity)
        if (index >= 0) {
          remoteParticipants.value.splice(index, 1)
        }

        // 分离视频轨道
        videoPanelRef.value.detachRemoteVideo(participant.identity, track)
      }
    })

    // 处理参与者连接和断开
    resourceManager.registerEventListener(currentRoom, RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
      // 当参与者连接时，检查是否已有视频轨道
      const videoPublications = Array.from(participant.videoTrackPublications.values())
      videoPublications.forEach((publication: RemoteTrackPublication) => {
        if (publication.track && publication.track.kind === Track.Kind.Video && videoPanelRef.value) {
          const existingIndex = remoteParticipants.value.findIndex(p => p.participantId === participant.identity)
          if (existingIndex >= 0) {
            remoteParticipants.value[existingIndex].videoTrack = publication.track
          } else {
            remoteParticipants.value.push({
              participantId: participant.identity,
              videoTrack: publication.track,
              audioTrack: null
            })
          }
          videoPanelRef.value.attachRemoteVideo(participant.identity, publication.track)
        }
      })
    })

    resourceManager.registerEventListener(currentRoom, RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
      // 从 remoteParticipants 数组中移除参与者
      const index = remoteParticipants.value.findIndex(p => p.participantId === participant.identity)
      if (index >= 0) {
        remoteParticipants.value.splice(index, 1)
      }

      // 清理视频轨道
      if (videoPanelRef.value) {
        // 这里可以调用 VideoPanel 的清理方法，如果有的话
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
    gap: 0;
    transition: flex 0.4s ease, width 0.4s ease;
    order: 2;
    height: 100%;
    min-height: 0;
    max-height: 100%;
    box-sizing: border-box;
    overflow: hidden;
    position: relative;

    :deep(.chat-panel) {
      height: 100% !important;
      min-height: 0;
      max-height: 100%;
      overflow: hidden;
      display: flex !important;
      flex-direction: column !important;
      position: relative !important;
      box-sizing: border-box;
    }

    :deep(.chat-panel__header) {
      flex-shrink: 0;
      padding: 12px 16px;
      position: relative;
      z-index: 1;
    }

    :deep(.chat-panel__body) {
      flex: 1 1 auto !important;
      min-height: 0;
      max-height: 100%;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      position: relative;
      padding-bottom: 0;
      margin-bottom: 0;
    }

    :deep(.chat-panel__messages) {
      flex: 1 1 auto;
      min-height: 0;
      max-height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      padding-bottom: 100px;
      -webkit-overflow-scrolling: touch;
      box-sizing: border-box;
    }

    :deep(.chat-panel__loading) {
      flex: 1 1 auto;
      min-height: 0;
      max-height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      padding-bottom: 100px;
      -webkit-overflow-scrolling: touch;
      box-sizing: border-box;
    }

    :deep(.chat-panel__footer) {
      position: absolute !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      border-bottom-left-radius: 12px !important;
      border-bottom-right-radius: 12px !important;
      z-index: 100 !important;
      background-color: var(--background-tertiary-color);
      margin: 0 !important;
      padding: 0 !important;
      flex-shrink: 0;
      box-sizing: border-box;
    }

    :deep(.chat-panel__footer-actions) {
      flex-shrink: 0;
    }
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

    :deep(.chat-panel) {
      height: 100% !important;
      min-height: 0 !important;
      max-height: 100% !important;
      overflow: hidden !important;
      display: flex !important;
      flex-direction: column !important;
      position: relative !important;
      box-sizing: border-box !important;
    }

    :deep(.chat-panel__header) {
      flex-shrink: 0 !important;
      padding: 12px 16px;
      position: relative;
      z-index: 1;
    }

    :deep(.chat-panel__body) {
      flex: 1 1 auto !important;
      min-height: 0 !important;
      max-height: 100% !important;
      overflow: hidden !important;
      display: flex !important;
      flex-direction: column !important;
      position: relative !important;
      padding-bottom: 0 !important;
      margin-bottom: 0 !important;
    }

    :deep(.chat-panel__messages) {
      flex: 1 1 auto !important;
      min-height: 0 !important;
      max-height: 100% !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
      padding-bottom: 100px !important;
      -webkit-overflow-scrolling: touch;
      box-sizing: border-box !important;
    }

    :deep(.chat-panel__loading) {
      flex: 1 1 auto !important;
      min-height: 0 !important;
      max-height: 100% !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
      padding-bottom: 100px !important;
      -webkit-overflow-scrolling: touch;
      box-sizing: border-box !important;
    }

    :deep(.chat-panel) {
      position: relative !important;
    }

    :deep(.chat-panel__footer) {
      position: absolute !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      border-bottom-left-radius: 12px !important;
      border-bottom-right-radius: 12px !important;
      z-index: 1000 !important;
      background-color: var(--background-tertiary-color) !important;
      margin: 0 !important;
      padding: 0 !important;
      flex-shrink: 0 !important;
      box-sizing: border-box !important;
    }

    :deep(.chat-panel__footer--fixed) {
      position: absolute !important;
      bottom: 0 !important;
      left: 0 !important;
      right: 0 !important;
      width: 100% !important;
      z-index: 1000 !important;
    }

    :deep(.chat-panel__footer-input-wrapper) {
      position: relative !important;
      flex-shrink: 0 !important;
      padding: 12px 16px !important;
      padding-bottom: 12px !important;
      margin: 0 !important;
      display: flex !important;
      align-items: center !important;
      gap: 8px !important;
    }

    :deep(.chat-panel__footer-actions) {
      flex-shrink: 0 !important;
      position: absolute !important;
      right: 24px !important;
      top: 50% !important;
      transform: translateY(-50%) !important;
      z-index: 1 !important;
    }
  }
}
</style>

<style lang="scss">
// 全局样式，用于强制覆盖 ChatPanel 的 scoped 样式
.chat-panel-connected .chat-panel {
  height: 100% !important;
  min-height: 0 !important;
  max-height: 100% !important;
  overflow: hidden !important;
  display: flex !important;
  flex-direction: column !important;
  position: relative !important;
  box-sizing: border-box !important;
}

.chat-panel-connected .chat-panel__body {
  flex: 1 1 auto !important;
  min-height: 0 !important;
  max-height: 100% !important;
  overflow: hidden !important;
  display: flex !important;
  flex-direction: column !important;
  position: relative !important;
  padding-bottom: 0 !important;
  margin-bottom: 0 !important;
}

.chat-panel-connected .chat-panel__messages,
.chat-panel-connected .chat-panel__loading {
  flex: 1 1 auto !important;
  min-height: 0 !important;
  max-height: 100% !important;
  overflow-y: auto !important;
  overflow-x: hidden !important;
  padding-bottom: 100px !important;
  box-sizing: border-box !important;
}

.chat-panel-connected .chat-panel__footer {
  position: absolute !important;
  bottom: 0 !important;
  left: 0 !important;
  right: 0 !important;
  width: 100% !important;
  border-bottom-left-radius: 12px !important;
  border-bottom-right-radius: 12px !important;
  z-index: 1000 !important;
  background-color: var(--background-tertiary-color) !important;
  margin: 0 !important;
  padding: 0 !important;
  flex-shrink: 0 !important;
  box-sizing: border-box !important;
}

.chat-panel-connected .chat-panel__footer-input-wrapper {
  position: relative !important;
  flex-shrink: 0 !important;
  padding: 12px 16px !important;
  padding-bottom: 12px !important;
  margin: 0 !important;
  display: flex !important;
  align-items: center !important;
  gap: 8px !important;
}

.chat-panel-connected .chat-panel__footer-actions {
  flex-shrink: 0 !important;
  position: absolute !important;
  right: 24px !important;
  top: 50% !important;
  transform: translateY(-50%) !important;
  z-index: 1 !important;
}
</style>
