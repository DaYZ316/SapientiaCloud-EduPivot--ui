import { ref, computed, readonly } from 'vue'
import { ConnectionState, Room, RoomEvent, RemoteParticipant, RemoteTrackPublication, Track } from 'livekit-client'
import { useI18n } from 'vue-i18n'
import * as liveApi from '@/api/live'
import { LiveRoomRoleEnum, LiveRoomStatusEnum } from '@/enum/live'
import type { LiveRoomVO, LiveRoomTokenRequestDTO, RemoteParticipantMedia } from '@/types/live'
import { useUserStore } from '@/store'
import { useErrorHandler } from './useErrorHandler'
import { useResourceManager } from './useResourceManager'
import { useRetryMechanism } from './useRetryMechanism'
import { getGlobalApis } from '@/utils/naiveUIHelper'

export interface LiveConnectionResult {
  // 状态
  room: Room | null
  isConnected: boolean
  connecting: boolean
  connectionState: string
  connectionError: string | null

  // 计算属性
  connectionStateLabel: string

  // 方法
  connect: (token?: string) => Promise<void>
  disconnect: () => Promise<void>
  updateOnlineCount: (targetRoom: Room | null) => void
}

export const useLiveConnection = () => {
  const { t } = useI18n()

  // 集成健壮性工具
  const errorHandler = useErrorHandler()
  const resourceManager = useResourceManager()
  const retryMechanism = useRetryMechanism()

  // 状态
  const room = ref<Room | null>(null)
  const isConnected = ref<boolean>(false)
  const connecting = ref<boolean>(false)
  const connectionState = ref<string>('disconnected')
  const connectionError = ref<string | null>(null)

  // LiveKit服务器URL配置
  const livekitServerUrl = computed(() => {
    const envUrl = (import.meta && (import.meta as any).env && (import.meta as any).env.VITE_LIVEKIT_WS) || ''
    if (envUrl && envUrl.trim().length > 0) {
      return envUrl.trim()
    }

    const isHttps = window.location.protocol === 'https:'
    const wsProtocol = isHttps ? 'wss:' : 'ws:'
    return `${wsProtocol}//${window.location.hostname}:7880`
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

  // 获取断开连接原因的描述
  const getDisconnectReasonMessage = (reason: any): string => {
    const reasonCode = typeof reason === 'number' ? reason : parseInt(reason?.toString() || '0')
    switch (reasonCode) {
      case 0: return '未知原因'
      case 1: return '客户端主动断开'
      case 2: return '重复身份'
      case 3: return '服务器关闭'
      case 4: return '参与者被移除'
      case 5: return '房间已删除'
      case 6: return '状态不匹配'
      case 7: return '加入失败'
      default: return `未知原因 (${reasonCode})`
    }
  }

  // 连接到直播房间（带重试机制）
  const connect = async (roomInfo: LiveRoomVO | null, currentUserRole: LiveRoomRoleEnum, providedToken?: string): Promise<void> => {
    if (!roomInfo || connecting.value || isConnected.value) return

    connecting.value = true
    connectionState.value = 'connecting'
    connectionError.value = null

    // 使用重试机制执行连接
    try {
      await retryMechanism.retry(
        () => performConnection(roomInfo, currentUserRole, providedToken),
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
              customMessage: `连接失败，正在重试 (${attempt}/3)...`
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
        onRetry: () => connect(roomInfo, currentUserRole, providedToken)
      })

      throw error
    }
  }

  // 执行实际的连接逻辑
  const performConnection = async (roomInfo: LiveRoomVO, currentUserRole: LiveRoomRoleEnum, providedToken?: string): Promise<void> => {
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
        role: currentUserRole
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
        }
      }
    }

    if (!token) {
      throw new Error(t('live.room.tokenError'))
    }

    // 创建Room实例
    const newRoom = new Room({
      adaptiveStream: true,
      dynacast: true
    })

    // 注册资源管理
    const unregisterRoom = resourceManager.registerResource(newRoom)

    // 绑定事件
    bindRoomEvents(newRoom)

    // 连接配置
    const connectUrl = returnedRoomName
      ? `${livekitServerUrl.value}?room=${encodeURIComponent(returnedRoomName)}`
      : livekitServerUrl.value

    // 连接到服务器
    await newRoom.connect(connectUrl, token)

    // 等待RTC连接完成
    await new Promise<void>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('RTC连接超时：60秒后仍未完成媒体连接'))
      }, 60000)

      const onConnected = () => {
        clearTimeout(timeoutId)
        newRoom.off(RoomEvent.Connected, onConnected)
        newRoom.off(RoomEvent.Disconnected, onDisconnected)
        resolve()
      }

      const onDisconnected = (reason?: any) => {
        clearTimeout(timeoutId)
        newRoom.off(RoomEvent.Connected, onConnected)
        newRoom.off(RoomEvent.Disconnected, onDisconnected)
        const reasonMessage = getDisconnectReasonMessage(reason)
        reject(new Error(`连接丢失: ${reasonMessage}`))
      }

      newRoom.on(RoomEvent.Connected, onConnected)
      newRoom.on(RoomEvent.Disconnected, onDisconnected)
    })

    // 连接成功
    room.value = newRoom
    isConnected.value = true
    connectionState.value = 'connected'
    connecting.value = false
    connectionError.value = null
    updateOnlineCount(newRoom)

    // 连接成功提示：使用全局 message 显示成功通知（不要通过 errorHandler 显示成功）
    const { message } = getGlobalApis()
    if (message) {
      message.success(t('live.room.connected'))
    }

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
      (track: Track, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
        // 这里会通过事件向上传递给VideoPanel处理
      })

    resourceManager.registerEventListener(targetRoom, RoomEvent.TrackUnsubscribed,
      (track: Track, publication: RemoteTrackPublication, participant: RemoteParticipant) => {
        // 这里会通过事件向上传递给VideoPanel处理
      })
  }

  return {
    // 状态
    room: readonly(room),
    isConnected: readonly(isConnected),
    connecting: readonly(connecting),
    connectionState: readonly(connectionState),
    connectionError: readonly(connectionError),

    // 计算属性
    connectionStateLabel,

    // 方法
    connect,
    disconnect,
    updateOnlineCount
  }
}
