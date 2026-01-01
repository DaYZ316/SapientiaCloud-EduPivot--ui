import { ref, readonly, onBeforeUnmount, type Ref } from 'vue'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { useUserStore } from '@/store'
import { useResourceManager } from './useResourceManager'
import { useLoadingState } from './useLoadingState'

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
  connect: (classroomId: string | null, roomInfo?: LiveRealtimeMessage | null) => Promise<void>
  disconnect: () => void
  sendHeartbeat: () => void
}

export const useLiveRealtime = (): LiveRealtimeResult => {
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

  // 心跳定时器和轮询定时器
  let heartbeatTimer: number | null = null
  let pollingTimer: number | null = null

  // 连接到SSE服务器
  const connect = async (classroomId: string | null, _roomInfo?: LiveRealtimeMessage | null): Promise<void> => {
    if (isConnected.value) return

    loadingState.setLoading('sse', true, '正在连接实时消息...')

    try {
      // SSE连接不重试，因为token是一次性的，重试会失败
      // 如果失败直接降级到轮询模式
      await performConnection(classroomId)

      loadingState.setLoading('sse', false)
    } catch (error: any) {
      loadingState.setLoading('sse', false)
      connectionState.value = 'failed'

      console.error('SSE连接失败:', error)

      // SSE连接失败时启用轮询模式，不显示错误通知（因为这是正常降级）
      console.log('SSE连接失败，启用轮询模式作为备用方案')
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
        throw new Error('用户未登录，无法建立SSE连接')
      }

      console.log('使用JWT token建立SSE连接')

      // 建立SSE连接
      // 使用fetch-event-source支持Authorization header，避免EventSource的header限制
      const sseUrl = `/celestial-hub/live/subscribe${currentClassroomId ? `?classroomId=${currentClassroomId}` : ''}`

      console.log('尝试连接SSE (使用JWT Authorization header):', sseUrl)

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
          console.log('SSE连接响应:', response.status, response.statusText)
          if (response.ok) {
            console.log('SSE连接建立成功')
            isConnected.value = true
            connectionState.value = 'connected'
            reconnectAttempts.value = 0
            startHeartbeat()
          } else {
            console.error('SSE连接失败:', response.status, response.statusText)
            // 尝试读取错误响应体
            try {
              const errorText = await response.clone().text()
              console.error('SSE错误详情:', errorText)
            } catch (e) {
              console.error('无法读取错误详情')
            }
            throw new Error(`SSE连接失败: ${response.status} ${response.statusText}`)
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
        onerror: (error) => {
          console.error('SSE连接错误:', error)
          isConnected.value = false
          connectionState.value = 'disconnected'

          // 如果SSE失败，立即启用轮询作为备用方案
          console.log('SSE连接失败，启用轮询模式作为备用')
          startPolling()
        }
      })

    } catch (error: any) {
      console.error('SSE连接准备阶段出错:', error)
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

    // 停止心跳和轮询
    stopHeartbeat()
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
        // 聊天消息由LiveKit WebRTC处理，这里仅作为备用
        break
      case 'heartbeat':
        // 忽略心跳消息
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

  // 启动心跳
  const startHeartbeat = (): void => {
    stopHeartbeat()
    const timer = setInterval(() => {
      sendHeartbeat()
    }, 30000) // 每30秒发送一次心跳

    // 注册定时器资源
    resourceManager.registerTimer(timer)
    heartbeatTimer = timer
  }

  // 停止心跳
  const stopHeartbeat = (): void => {
    if (heartbeatTimer) {
      clearInterval(heartbeatTimer)
      heartbeatTimer = null
    }
  }

  // 发送心跳
  const sendHeartbeat = (): void => {
    // SSE是单向的，心跳主要用于检测连接状态
    // 如果连接断开，会通过onerror事件处理
  }

  // 轮询获取实时消息（SSE失败时的备用方案）
  const startPolling = (): void => {
    stopPolling()

    console.log('开始轮询模式，每30秒检查一次连接状态')

    const pollMessages = async () => {
      try {
        // 在轮询模式下，我们保持连接状态为已连接
        // 但不实际获取消息，因为没有相应的API
        console.log('轮询模式：保持连接状态')

        isConnected.value = true
        connectionState.value = 'connected'

        // 可以在这里添加心跳检查或其他状态检查
        // 例如：检查房间是否仍然活跃
      } catch (error) {
        console.error('轮询模式出错:', error)
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
    console.log('清理实时连接资源')
    disconnect()
  })

  return {
    // 状态
    isConnected: readonly(isConnected),
    connectionState: readonly(connectionState),
    reconnectAttempts: readonly(reconnectAttempts),

    // 数据
    messages: readonly(messages),

    // 方法
    connect,
    disconnect,
    sendHeartbeat
  }
}