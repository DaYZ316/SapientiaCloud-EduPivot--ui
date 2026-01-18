import { ref, readonly, onBeforeUnmount, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { useUserStore } from '@/store'
import { useResourceManager } from './useResourceManager'
import { useLoadingState } from './useLoadingState'
import * as liveApi from '@/api/live'

export interface LiveRealtimeMessage {
  type: string
  event?: string
  roomId?: string
  classroomId?: string
  courseId?: string
  status?: number
  startTime?: string
  endTime?: string
  timestamp?: string
  data?: Record<string, any>
}

export interface LiveRealtimeResult {
  isConnected: Readonly<Ref<boolean>>
  connectionState: Readonly<Ref<string>>
  reconnectAttempts: Readonly<Ref<number>>
  messages: Readonly<Ref<readonly LiveRealtimeMessage[]>>
  // 成员列表（由 SSE 提供的在线成员/身份信息）
  members: Readonly<Ref<readonly string[]>>
  membersCount: Readonly<Ref<number>>
  connect: (classroomId: string | null, roomInfo?: LiveRealtimeMessage | null) => Promise<void>
  disconnect: () => void
}

export const useLiveRealtime = (): LiveRealtimeResult => {
  const { t } = useI18n()
  // 使用store和健壮性管理器
  const userStore = useUserStore()
  const resourceManager = useResourceManager()
  const loadingState = useLoadingState()

  // SSE连接控制器
  let eventSourceController: AbortController | null = null

  // 状态
  const isConnected = ref<boolean>(false)
  const connectionState = ref<string>('disconnected')
  const reconnectAttempts = ref<number>(0)

  // 消息历史
  const messages = ref<LiveRealtimeMessage[]>([])
  // 成员列表（SSE 如果支持会返回成员数组或成员变更事件）
  const members = ref<string[]>([])
  const membersCount = ref<number>(0)

  // 轮询定时器
  let pollingTimer: number | null = null

  // 连接到SSE服务器
  const connect = async (classroomId: string | null, _roomInfo?: LiveRealtimeMessage | null): Promise<void> => {
    if (isConnected.value) return

    loadingState.setLoading('sse', true, t('live.sse.connecting'))

    try {
      // SSE连接不重试，因为token是一次性的，重试会失败
      // 如果失败直接降级到轮询模式
      await performConnection(classroomId)

      loadingState.setLoading('sse', false)
    } catch (error: any) {
      loadingState.setLoading('sse', false)
      connectionState.value = 'failed'

      // SSE连接失败时启用轮询模式，不显示错误通知（因为这是正常降级）
      startPolling()

      // 不抛出错误，因为轮询模式是可接受的降级方案
      return
    }
  }

  // 执行实际的连接逻辑
  const performConnection = async (currentClassroomId: string | null): Promise<void> => {
    connectionState.value = 'connecting'

    try {
      // 获取用户JWT token用于SSE认证
      const jwtToken = userStore.token
      if (!jwtToken) {
      throw new Error(t('live.sse.notLoggedIn'))
      }

      // 获取SSE token
      const sseTokenResponse = await liveApi.getSseToken(currentClassroomId)
      if (!sseTokenResponse?.data) {
        throw new Error(t('live.sse.tokenError'))
      }
      const sseToken = sseTokenResponse.data

      // 建立SSE连接
      // 使用fetch-event-source支持Authorization header，避免EventSource的header限制
      const sseUrl = `/live/subscribe${currentClassroomId ? `?classroomId=${currentClassroomId}&token=${sseToken}` : `?token=${sseToken}`}`

      eventSourceController = new AbortController()

      // 注册资源管理
      resourceManager.registerResource(eventSourceController, () => {
        eventSourceController?.abort()
        eventSourceController = null
      })

      await fetchEventSource(sseUrl, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${jwtToken}`,
          'Accept': 'text/event-stream'
        },
        signal: eventSourceController.signal,
        openWhenHidden: true,
        credentials: 'include',
        onopen: async (response) => {
            if (response.ok) {
              isConnected.value = true
              connectionState.value = 'connected'
              reconnectAttempts.value = 0
            } else {
              // 尝试读取错误响应体
              try {
                await response.clone().text()
              } catch (e) {
                // 无法读取错误详情
              }
              throw new Error(t('live.sse.connectFailed', {
                status: response.status,
                statusText: response.statusText
              }))
            }
        },
        onmessage: (event) => {
          try {
            const data = JSON.parse(event.data) as LiveRealtimeMessage
            handleRealtimeMessage(data)
          } catch (error) {
            // JSON解析失败，静默处理
          }
        },
        onerror: (_error) => {
          isConnected.value = false
          connectionState.value = 'disconnected'

          // 如果SSE失败，立即启用轮询作为备用方案
          startPolling()
        }
      })

    } catch (error: any) {
      throw error
    }
  }

  // 设置SSE事件处理器
  // setupEventHandlers不再需要，fetch-event-source已在配置中处理事件

  // 断开SSE连接
  const disconnect = (): void => {
    if (eventSourceController) {
      eventSourceController.abort()
      eventSourceController = null
    }

    isConnected.value = false
    connectionState.value = 'disconnected'

    // 停止轮询
    stopPolling()

    // 清理所有资源
    resourceManager.cleanupAll()
  }


  // 处理实时消息
  const handleRealtimeMessage = (message: LiveRealtimeMessage): void => {
    // 添加时间戳
    message.timestamp = new Date().toISOString()

    // 保存消息历史
    messages.value.push(message)

    // 限制消息历史长度
    if (messages.value.length > 100) {
      messages.value = messages.value.slice(-100)
    }

    // 处理不同类型的消息
    handleMessageByType(message)
  }

  // 根据消息类型处理
  const handleMessageByType = (message: LiveRealtimeMessage): void => {
    // 优先使用event字段（来自Kafka），其次使用type字段
    const eventType = message.event || message.type

    switch (eventType) {
      case 'start':
      case 'end':
      case 'close':
        handleLiveStatusMessage(message)
        break
      case 'chat_message':
        // 聊天消息由 useLiveRoom 处理，这里不做任何操作
        break
      case 'members':
      case 'participants':
        // 处理后端推送的成员信息，data.membersCount 是总人数，data.members 是 sessionId 列表
        try {
          const d = message.data
          if (d) {
            // 优先使用 membersCount（准确的在线人数）
            if (typeof d.membersCount === 'number' && d.membersCount >= 0) {
              membersCount.value = d.membersCount
            }

            // 处理成员列表（sessionId 数组）
            if (Array.isArray(d.members)) {
              // 将 sessionId 列表转换为字符串数组
              members.value = d.members.map((m: any) => {
                if (typeof m === 'string') return m
                return String(m)
              }).filter(Boolean)
            } else if (Array.isArray(d.participants)) {
              // 兼容 participants 字段
              members.value = d.participants.map((p: any) => p.identity || p.id || '').filter(Boolean)
            }

            // 如果没有明确的 membersCount，使用 members 数组长度作为后备
            if (typeof d.membersCount !== 'number' || d.membersCount < 0) {
              membersCount.value = members.value.length
            }
          }
        } catch (e) {
          // ignore parse errors
        }
        break
      default:
        // 未知消息类型，静默处理
        break
    }
  }

  // 处理直播状态消息
  const handleLiveStatusMessage = (message: LiveRealtimeMessage): void => {
    if (message.data && typeof message.data === 'object' && 'status' in message.data) {
      const status = message.data.status as number
      // 状态变更通知可以在这里处理
      switch (status) {
        case 1:
          // 直播中
          break
        case 2:
          // 已结束
          break
        case 3:
          // 已关闭
          break
        default:
          // 未知状态
          break
      }
    }
  }


  // 轮询获取实时消息（SSE失败时的备用方案）
  const startPolling = (): void => {
    stopPolling()

    const pollMessages = async () => {
      try {
        // 在轮询模式下，我们保持连接状态为已连接
        // 但不实际获取消息，因为没有相应的API

        isConnected.value = true
        connectionState.value = 'connected'

        // 可以在这里添加心跳检查或其他状态检查
        // 例如：检查房间是否仍然活跃
      } catch (error) {
        isConnected.value = false
        connectionState.value = 'disconnected'
      }
    }

    // 每30秒轮询一次（比原来的5秒更合理，避免过多请求）
    pollingTimer = window.setInterval(pollMessages, 30000)
    pollMessages() // 立即执行一次
  }

  // 停止轮询
  const stopPolling = (): void => {
    if (pollingTimer) {
      clearInterval(pollingTimer)
      pollingTimer = null
    }
  }

  // 组件卸载时清理资源
  onBeforeUnmount(() => {
    disconnect()
  })

  return {
    // 状态
    isConnected: readonly(isConnected),
    connectionState: readonly(connectionState),
    reconnectAttempts: readonly(reconnectAttempts),

    // 数据
    messages: readonly(messages),
    members: readonly(members),
    membersCount: readonly(membersCount),

    // 方法
    connect,
    disconnect
  }
}
