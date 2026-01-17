import { ref, shallowRef, computed, readonly, type Ref, type ComputedRef } from 'vue'
import { Room, RoomEvent, RemoteParticipant, RemoteTrackPublication, Track } from 'livekit-client'
import { useI18n } from 'vue-i18n'
import * as liveApi from '@/api/live'
import { LiveRoomRoleEnum, LiveRoomStatusEnum } from '@/enum/live'
import type { LiveRoomVO, LiveRoomTokenRequestDTO } from '@/types/live'
import { useErrorHandler } from './useErrorHandler'
import { useResourceManager } from './useResourceManager'
import { useRetryMechanism } from './useRetryMechanism'

export interface LiveConnectionResult {
  // 状态
  room: Ref<Room | null>
  isConnected: Readonly<Ref<boolean>>
  connecting: Readonly<Ref<boolean>>
  connectionState: Readonly<Ref<string>>
  connectionError: Readonly<Ref<string | null>>
  sessionId: Readonly<Ref<string | null>>
  heartbeatIntervalSeconds: Readonly<Ref<number | null>>

  // 计算属性
  connectionStateLabel: ComputedRef<string>

  // 方法
  connect: (roomInfo: import('@/types/live').LiveRoomVO | null, currentUserRole: import('@/enum/live').LiveRoomRoleEnum, token?: string, sessionId?: string | null) => Promise<void>
  disconnect: () => Promise<void>
  updateOnlineCount: (targetRoom: Room | null) => void
}

export const useLiveConnection = (): LiveConnectionResult => {
  const { t } = useI18n()

  // 集成健壮性工具
  const errorHandler = useErrorHandler()
  const resourceManager = useResourceManager()
  const retryMechanism = useRetryMechanism()

  // 状态
  const room: Ref<Room | null> = shallowRef(null)
  const isConnected = ref<boolean>(false)
  const connecting = ref<boolean>(false)
  const connectionState = ref<string>('disconnected')
  const connectionError = ref<string | null>(null)
  const sessionId = ref<string | null>(null)
  const heartbeatIntervalSeconds = ref<number | null>(null)
  const onlineCount = ref<number>(0)

  const livekitServerUrl = computed(() => {
    const envUrl = (import.meta as any)?.env?.VITE_LIVEKIT_WS
    if (envUrl && envUrl.trim()) {
      return envUrl.trim()
    }

    const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
    return `${wsProtocol}//${window.location.host}`
  })


  // 连接状态标签
  const connectionStateLabel = computed(() => {
    const labels: Record<string, string> = {
      connecting: t('live.room.connecting'),
      connected: t('live.room.connected'),
      disconnected: t('live.room.disconnected'),
      reconnecting: t('live.room.reconnecting'),
      failed: t('live.room.connectFailed')
    }
    return labels[connectionState.value] || ''
  })


  // 连接到直播房间（带重试机制）
  const connect = async (roomInfo: LiveRoomVO | null, currentUserRole: LiveRoomRoleEnum, providedToken?: string, providedSessionId?: string | null): Promise<void> => {
    if (!roomInfo || connecting.value || isConnected.value) return

    connecting.value = true
    connectionState.value = 'connecting'
    connectionError.value = null

    // 使用重试机制执行连接
    try {
      await retryMechanism.retry(
        () => performConnection(roomInfo, currentUserRole, providedToken, providedSessionId),
        {
          maxRetries: 3,
          baseDelay: 2000,
          maxDelay: 10000,
          retryCondition: (error) => retryMechanism.isRetryableError(error),
          onRetry: (error, attempt) => {
            connectionState.value = 'reconnecting'
            // 重试通知
            errorHandler.handleError(error, 'live_connection_retry', {
              showNotification: true,
              customMessage: t('live.common.retryingConnection', { attempt, total: 3 })
            })
          }
        }
      )
    } catch (error: any) {
      // 连接最终失败，使用统一错误处理
      connecting.value = false
      connectionState.value = 'failed'
      connectionError.value = error.message

      errorHandler.handleError(error, 'live_connection', {
        showNotification: true,
        allowRetry: retryMechanism.isRetryableError(error),
        onRetry: () => connect(roomInfo, currentUserRole, providedToken, providedSessionId)
      })

      throw error
    }
  }

  // 执行实际的连接逻辑
  const performConnection = async (roomInfo: LiveRoomVO, currentUserRole: LiveRoomRoleEnum, providedToken?: string, providedSessionId?: string | null): Promise<void> => {
    // 检查房间状态
    if (roomInfo.status === LiveRoomStatusEnum.ENDED || roomInfo.status === LiveRoomStatusEnum.CLOSED) {
      throw new Error(t('live.room.roomEnded'))
    }

    // 学生角色检查
    if (currentUserRole === LiveRoomRoleEnum.STUDENT && roomInfo.status !== LiveRoomStatusEnum.LIVE) {
      throw new Error(t('live.room.notLiveForStudent'))
    }

    // 获取token（使用重试机制）
    let token: string | null = providedToken || null
    let returnedRoomName: string | null = null

    if (!token) {
      const tokenDTO: LiveRoomTokenRequestDTO = {
        role: currentUserRole,
        sessionId: providedSessionId ?? sessionId.value ?? null
      }

      const tokenResponse = await retryMechanism.retry(
        () => liveApi.issueLiveRoomToken(roomInfo.id, tokenDTO),
        {
          maxRetries: 2,
          retryCondition: (error) => retryMechanism.isRetryableError(error)
        }
      )

      if (tokenResponse?.data) {
        if (typeof tokenResponse.data === 'string') {
          token = tokenResponse.data
        } else {
          token = tokenResponse.data.token || null
          returnedRoomName = tokenResponse.data.roomName || null
          sessionId.value = tokenResponse.data.sessionId || null
          heartbeatIntervalSeconds.value = tokenResponse.data.heartbeatIntervalSeconds ?? null
        }
      }
    }

    if (!token) {
      throw new Error(t('live.room.tokenError'))
    }

    if (providedSessionId && !sessionId.value) {
      sessionId.value = providedSessionId
    }

    // 创建Room实例
    const newRoom = new Room({
      adaptiveStream: true,
      dynacast: true,
      // 禁用自动音频捕获，避免在没有用户手势时创建AudioContext
      audioCaptureDefaults: {
        deviceId: 'default',
        autoGainControl: true,
        echoCancellation: true,
        noiseSuppression: true
      },
      // 禁用自动视频捕获
      videoCaptureDefaults: {
        deviceId: 'default'
      },
      // 禁用自动发布，这可以避免连接时自动尝试获取媒体设备
      publishDefaults: {
        simulcast: true,
        videoEncoding: {
          maxBitrate: 2000000,
          maxFramerate: 30
        }
      }
    })

    // 注册资源管理
    resourceManager.registerResource(newRoom)

    // 绑定事件
    bindRoomEvents(newRoom)

    // 连接配置
    const connectUrl = returnedRoomName
      ? `${livekitServerUrl.value}?room=${encodeURIComponent(returnedRoomName)}`
      : livekitServerUrl.value

    // 连接到服务器（LiveKit client会自动等待连接完成）
    await newRoom.connect(connectUrl, token)

    // 连接成功
    room.value = newRoom
    isConnected.value = true
    connectionState.value = 'connected'
    connecting.value = false
    connectionError.value = null
    updateOnlineCount(newRoom)


  }

  // 断开连接
  const disconnect = async (): Promise<void> => {
    if (!room.value) return

    try {
      await room.value.disconnect()
    } catch (error: any) {
      errorHandler.handleError(error, 'live_disconnect', {
        showNotification: false // 断开连接的错误不显示通知
      })
    } finally {
      // 使用资源管理器清理所有资源
      resourceManager.cleanupAll()

      // 重置状态
      room.value = null
      isConnected.value = false
      connectionState.value = 'disconnected'
      connectionError.value = null
      updateOnlineCount(null)
    }
  }

  // 更新在线人数
  const updateOnlineCount = (targetRoom: Room | null): void => {
    if (!targetRoom) {
      onlineCount.value = 0
      return
    }
    const participantTotal = targetRoom.remoteParticipants ? targetRoom.remoteParticipants.size : 0
    onlineCount.value = participantTotal + (isConnected.value ? 1 : 0)
  }

  // 绑定房间事件
  const bindRoomEvents = (targetRoom: Room): void => {
    // 连接状态变化
    resourceManager.registerEventListener(targetRoom, RoomEvent.Connected, () => {
      isConnected.value = true
      connectionState.value = 'connected'
      updateOnlineCount(targetRoom)
    })

    resourceManager.registerEventListener(targetRoom, RoomEvent.Disconnected, () => {
      connectionState.value = 'disconnected'
      isConnected.value = false
      updateOnlineCount(null)
    })

    resourceManager.registerEventListener(targetRoom, RoomEvent.Reconnecting, () => {
      connectionState.value = 'reconnecting'
    })

    resourceManager.registerEventListener(targetRoom, RoomEvent.Reconnected, () => {
      connectionState.value = 'connected'
      isConnected.value = true
      updateOnlineCount(targetRoom)
    })

    // 参与者变化
    resourceManager.registerEventListener(targetRoom, RoomEvent.ParticipantConnected, () => {
      updateOnlineCount(targetRoom)
    })

    resourceManager.registerEventListener(targetRoom, RoomEvent.ParticipantDisconnected, () => {
      updateOnlineCount(targetRoom)
    })

    // 轨道订阅（需要与其他composable配合）
    resourceManager.registerEventListener(targetRoom, RoomEvent.TrackSubscribed,
      (_track: Track, _publication: RemoteTrackPublication, _participant: RemoteParticipant) => {
        // 使用参数避免未使用警告，这里会通过事件向上传递给VideoPanel处理
      })

    resourceManager.registerEventListener(targetRoom, RoomEvent.TrackUnsubscribed,
      (_track: Track, _publication: RemoteTrackPublication, _participant: RemoteParticipant) => {
        // 使用参数避免未使用警告，这里会通过事件向上传递给VideoPanel处理
      })
  }

  return {
    // 状态
    room,
    isConnected: readonly(isConnected),
    connecting: readonly(connecting),
    connectionState: readonly(connectionState),
    connectionError: readonly(connectionError),
    sessionId: readonly(sessionId),
    heartbeatIntervalSeconds: readonly(heartbeatIntervalSeconds),

    // 计算属性
    connectionStateLabel,

    // 方法
    connect,
    disconnect,
    updateOnlineCount
  }
}
