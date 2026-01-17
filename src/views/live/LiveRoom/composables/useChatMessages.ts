import { ref, computed, readonly } from 'vue'
import { Room, RoomEvent } from 'livekit-client'
import { useI18n } from 'vue-i18n'
import * as liveApi from '@/api/live'
import type { LiveRoomChatMessage } from '@/types/live'
import { useUserStore } from '@/store'
import { LiveRoomRoleEnum } from '@/enum/live/liveRoomRoleEnum'

export interface ChatMessagesResult {
  // 状态
  messages: LiveRoomChatMessage[]
  chatOnlineCount: number

  // 方法
  loadHistoryMessages: (roomId: string) => Promise<void>
  sendMessage: (content: string, room: Room | null, roomId: string) => Promise<void>
  addMessage: (message: LiveRoomChatMessage) => void
  setupRealtimeMessages: (room: Room) => void
  startPolling: (roomId: string) => void
  stopPolling: () => void
}

export const useChatMessages = () => {
  const { t } = useI18n()
  const userStore = useUserStore()

  // 状态
  const messages = ref<LiveRoomChatMessage[]>([])
  const pollingTimer = ref<number | null>(null)
  const lastMessageTime = ref<string | null>(null)

  // 在线人数（简化计算）
  const chatOnlineCount = computed(() => Math.max(messages.value.length > 0 ? 2 : 1, 1))

  // 加载历史消息
  const loadHistoryMessages = async (roomId: string): Promise<void> => {
    try {
      const response = await liveApi.listLiveRoomMessages(roomId, 50)
      if (!response?.data) return

      const history = response.data
      const currentUserId = userStore.userInfo?.id
      const currentUserNickName = userStore.userInfo?.nickName

      const mapped = history
        .slice()
        .reverse()
        .map((item: any) => {
          const senderName = item.senderName || t('live.room.unknown')
          const isOwn = senderName === currentUserNickName || (item as any).senderId === currentUserId
          return {
            id: item.id || `${Date.now()}-${Math.random()}`,
            sender: senderName,
            content: item.content,
            timestamp: item.sendTime ? new Date(item.sendTime).toLocaleTimeString() : '',
            isOwn
          }
        })

      // 记录最后一条消息的时间
      if (mapped.length > 0 && history.length > 0) {
        const lastMessage = history[history.length - 1]
        lastMessageTime.value = lastMessage.sendTime || null
      }

      messages.value = mapped.length > 0 ? mapped : [
        {
          id: 'welcome',
          sender: t('live.room.system'),
          content: t('live.room.welcomeMessage'),
          timestamp: new Date().toLocaleTimeString(),
          isOwn: false
        }
      ]
    } catch (error) {
      // 加载历史消息失败
      messages.value = [{
        id: 'error',
        sender: t('live.room.system'),
        content: t('live.room.loadHistoryFailed'),
        timestamp: new Date().toLocaleTimeString(),
        isOwn: false
      }]
    }
  }

  // 添加消息到列表（用于SSE推送的消息）
  const addMessage = (message: LiveRoomChatMessage): void => {
    // 检查是否已经在消息列表中（避免重复添加）
    const exists = messages.value.some(m => m.id === message.id)
    if (!exists) {
      messages.value.push(message)
    }
  }

  // 发送消息
  const sendMessage = async (content: string, room: Room | null, roomId: string): Promise<void> => {
    const trimmed = content.trim()
    if (!trimmed) return

    // 创建本地消息
    const localMessage: LiveRoomChatMessage = {
      id: `${Date.now()}`,
      sender: userStore.userInfo?.nickName || t('live.room.me'),
      content: trimmed,
      timestamp: new Date().toLocaleTimeString(),
      isOwn: true
    }

    // 添加到本地消息列表
    messages.value.push(localMessage)

    try {
      // 通过WebRTC发送（如果已连接）
      if (room) {
        const payload = {
          type: 'chat',
          content: trimmed,
          sender: localMessage.sender,
          sendTime: new Date().toISOString()
        }

        await room.localParticipant.publishData(
          new TextEncoder().encode(JSON.stringify(payload)),
          { reliable: true }
        )
      }

      // 发送到后端
      const senderRole = userStore.teacherInfo
        ? LiveRoomRoleEnum.TEACHER
        : (userStore.roles?.some((r: any) => r.roleKey === 'ASSISTANT') ? LiveRoomRoleEnum.ASSISTANT : LiveRoomRoleEnum.STUDENT)

      const messageDTO = {
        content: trimmed,
        messageType: 'text',
        senderRole
      }

      const response = await liveApi.appendLiveRoomMessage(roomId, messageDTO)

      // 如果后端返回了消息数据，使用后端时间更新 lastMessageTime，并替换本地临时消息
      if (response?.data) {
        const serverMsg: any = response.data

        // 更新 lastMessageTime，保证轮询能检测到之后的消息
        if (serverMsg.sendTime) {
          lastMessageTime.value = serverMsg.sendTime
        }

        // 将本地临时消息替换为服务端版本，避免重复与 id 不一致
        const lastIdx = messages.value.length - 1
        const mapped = {
          id: serverMsg.id || localMessage.id,
          sender: serverMsg.senderName || localMessage.sender,
          content: serverMsg.content || localMessage.content,
          timestamp: serverMsg.sendTime ? new Date(serverMsg.sendTime).toLocaleTimeString() : localMessage.timestamp,
          isOwn: true
        }

        if (lastIdx >= 0 && messages.value[lastIdx].id === localMessage.id) {
          messages.value[lastIdx] = mapped
        } else {
          const exists = messages.value.some(m => m.id === mapped.id)
          if (!exists) messages.value.push(mapped)
        }
      }
    } catch (error) {
      // 发送消息失败
      // 可以在消息上标记发送失败状态
    }
  }

  // 设置实时消息监听
  const setupRealtimeMessages = (room: Room): void => {
    room.on(RoomEvent.DataReceived, (data: Uint8Array) => {
      try {
        const text = new TextDecoder().decode(data)
        const payload = JSON.parse(text)

        if (!payload || payload.type !== 'chat' || !payload.content) {
          return
        }

        const currentUserNickName = userStore.userInfo?.nickName
        const senderName = payload.sender || t('live.room.unknown')
        const isOwn = senderName === currentUserNickName

        messages.value.push({
          id: `${Date.now()}`,
          sender: senderName,
          content: payload.content,
          timestamp: payload.sendTime ? new Date(payload.sendTime).toLocaleTimeString() : new Date().toLocaleTimeString(),
          isOwn
        })
      } catch (error) {
        // 处理实时消息失败
      }
    })
  }

  // 启动轮询（用于未连接时的消息获取）
  const startPolling = (roomId: string): void => {
    stopPolling()
    pollingTimer.value = setInterval(() => {
      pollNewMessages(roomId)
    }, 2000)
  }

  // 停止轮询
  const stopPolling = (): void => {
    if (pollingTimer.value) {
      clearInterval(pollingTimer.value)
      pollingTimer.value = null
    }
  }

  // 轮询新消息
  const pollNewMessages = async (roomId: string): Promise<void> => {
    try {
      const response = await liveApi.listLiveRoomMessages(roomId, 50)
      if (!response?.data || response.data.length === 0) return

      const history = response.data
      const currentUserId = userStore.userInfo?.id
      const currentUserNickName = userStore.userInfo?.nickName

      if (lastMessageTime.value) {
        const newMessages = history.filter((item: any) => {
          if (!item.sendTime) return false
          return new Date(item.sendTime) > new Date(lastMessageTime.value!)
        })

        if (newMessages.length === 0) return

        const mapped = newMessages.map((item: any) => {
          const senderName = item.senderName || t('live.room.unknown')
          const isOwn = senderName === currentUserNickName || (item as any).senderId === currentUserId
          return {
            id: item.id || `${Date.now()}-${Math.random()}`,
            sender: senderName,
            content: item.content,
            timestamp: item.sendTime ? new Date(item.sendTime).toLocaleTimeString() : '',
            isOwn
          }
        })

        // 避免重复添加
        const existingIds = new Set(messages.value.map(msg => msg.id))
        const uniqueNewMessages = mapped.filter(msg => !existingIds.has(msg.id))

        if (uniqueNewMessages.length > 0) {
          messages.value.push(...uniqueNewMessages)
          const lastNewMessage = newMessages[newMessages.length - 1]
          lastMessageTime.value = lastNewMessage.sendTime || null
        }
      }
    } catch (error) {
      // 轮询消息失败
    }
  }

  return {
    // 状态
    messages: readonly(messages),
    chatOnlineCount,

    // 方法
    loadHistoryMessages,
    sendMessage,
    addMessage,
    setupRealtimeMessages,
    startPolling,
    stopPolling
  }
}
