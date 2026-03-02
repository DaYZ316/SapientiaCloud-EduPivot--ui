import { ref, readonly, onBeforeUnmount, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { fetchEventSource } from '@microsoft/fetch-event-source'
import { useUserStore } from '@/store'
import { apiConfig } from '@/utils/http'
import { useResourceManager } from './useResourceManager'
import { useLoadingState } from './useLoadingState'
import * as liveApi from '@/api/live'

class SseFatalError extends Error {}

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
  members: Readonly<Ref<readonly string[]>>
  membersCount: Readonly<Ref<number>>
  connect: (classroomId: string | null, roomInfo?: LiveRealtimeMessage | null) => Promise<void>
  disconnect: () => void
}

export const useLiveRealtime = (): LiveRealtimeResult => {
  const { t } = useI18n()
  const userStore = useUserStore()
  const resourceManager = useResourceManager()
  const loadingState = useLoadingState()

  let eventSourceController: AbortController | null = null

  const isConnected = ref<boolean>(false)
  const connectionState = ref<string>('disconnected')
  const reconnectAttempts = ref<number>(0)

  const messages = ref<LiveRealtimeMessage[]>([])
  const members = ref<string[]>([])
  const membersCount = ref<number>(0)

  let pollingTimer: number | null = null

  const connect = async (classroomId: string | null, _roomInfo?: LiveRealtimeMessage | null): Promise<void> => {
    if (isConnected.value) return

    loadingState.setLoading('sse', true, t('live.sse.connecting'))

    try {
      await performConnection(classroomId)
      loadingState.setLoading('sse', false)
    } catch {
      loadingState.setLoading('sse', false)
      connectionState.value = 'failed'
      startPolling()
    }
  }

  const performConnection = async (currentClassroomId: string | null): Promise<void> => {
    connectionState.value = 'connecting'

    const jwtToken = userStore.token
    if (!jwtToken) {
      throw new Error(t('live.sse.notLoggedIn'))
    }

    const sseTokenResponse = await liveApi.getSseToken(currentClassroomId)
    if (!sseTokenResponse?.data) {
      throw new Error(t('live.sse.tokenError'))
    }
    const sseToken = sseTokenResponse.data

    const baseURL = apiConfig.getBaseUrl()
    const ssePath = `/live/live/subscribe${currentClassroomId ? `?classroomId=${currentClassroomId}&token=${sseToken}` : `?token=${sseToken}`}`
    const sseUrl = `${baseURL}${ssePath}`

    eventSourceController = new AbortController()

    resourceManager.registerResource(eventSourceController, () => {
      eventSourceController?.abort()
      eventSourceController = null
    })

    fetchEventSource(sseUrl, {
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
          throw new SseFatalError(t('live.sse.connectFailed', {
            status: response.status,
            statusText: response.statusText
          }))
        }
      },
      onmessage: (event) => {
        try {
          const data = JSON.parse(event.data) as LiveRealtimeMessage
          handleRealtimeMessage(data)
        } catch {
          // JSON 解析失败，静默处理
        }
      },
      onerror: (error) => {
        try {
          eventSourceController?.abort()
          eventSourceController = null
        } catch {
          // ignore
        }

        isConnected.value = false
        connectionState.value = 'disconnected'
        startPolling()
        throw error instanceof SseFatalError ? error : new SseFatalError('SSE error')
      }
    })
  }

  const disconnect = (): void => {
    if (eventSourceController) {
      eventSourceController.abort()
      eventSourceController = null
    }

    isConnected.value = false
    connectionState.value = 'disconnected'
    stopPolling()
    resourceManager.cleanupAll()
  }

  const handleRealtimeMessage = (message: LiveRealtimeMessage): void => {
    message.timestamp = new Date().toISOString()
    messages.value.push(message)

    if (messages.value.length > 100) {
      messages.value = messages.value.slice(-100)
    }

    handleMessageByType(message)
  }

  const handleMessageByType = (message: LiveRealtimeMessage): void => {
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
        try {
          const d = message.data
          if (d) {
            if (typeof d.membersCount === 'number' && d.membersCount >= 0) {
              membersCount.value = d.membersCount
            }

            if (Array.isArray(d.members)) {
              members.value = d.members.map((m: any) => {
                if (typeof m === 'string') return m
                return String(m)
              }).filter(Boolean)
            } else if (Array.isArray(d.participants)) {
              members.value = d.participants.map((p: any) => p.identity || p.id || '').filter(Boolean)
            }

            if (typeof d.membersCount !== 'number' || d.membersCount < 0) {
              membersCount.value = members.value.length
            }
          }
        } catch {
          // ignore parse errors
        }
        break
      default:
        // 未知消息类型，静默处理
        break
    }
  }

  const handleLiveStatusMessage = (message: LiveRealtimeMessage): void => {
    if (message.data && typeof message.data === 'object' && 'status' in message.data) {
      const status = message.data.status as number
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

  const startPolling = (): void => {
    stopPolling()

    const pollMessages = async () => {
      try {
        isConnected.value = false
        connectionState.value = 'polling'
      } catch {
        isConnected.value = false
        connectionState.value = 'disconnected'
      }
    }

    pollingTimer = window.setInterval(pollMessages, 30000)
    pollMessages()
  }

  const stopPolling = (): void => {
    if (pollingTimer) {
      clearInterval(pollingTimer)
      pollingTimer = null
    }
  }

  onBeforeUnmount(() => {
    disconnect()
  })

  return {
    isConnected: readonly(isConnected),
    connectionState: readonly(connectionState),
    reconnectAttempts: readonly(reconnectAttempts),
    messages: readonly(messages),
    members: readonly(members),
    membersCount: readonly(membersCount),
    connect,
    disconnect
  }
}
