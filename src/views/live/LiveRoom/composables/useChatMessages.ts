import {onBeforeUnmount, readonly, ref, type Ref} from 'vue'
import {Room, RoomEvent} from 'livekit-client'
import {useI18n} from 'vue-i18n'
import {fetchEventSource} from '@microsoft/fetch-event-source'
import * as liveApi from '@/api/live'
import type {LiveRoomChatMessage} from '@/types/live'
import {useUserStore} from '@/store'
import {LiveRoomRoleEnum} from '@/enum/live/liveRoomRoleEnum'
import {apiConfig} from '@/utils/http'

export interface ChatMessagesResult {
    // 状态
    messages: Ref<readonly LiveRoomChatMessage[]>
    chatOnlineCount: Ref<number>

    // 方法
    loadHistoryMessages: (roomId: string) => Promise<void>
    sendMessage: (content: string, room: Room | null, roomId: string) => Promise<void>
    addMessage: (message: LiveRoomChatMessage) => void
    setupRealtimeMessages: (room: Room) => void
    teardownRealtimeMessages: (room: Room) => void
    setupSseListener: (roomId: string, classroomId?: string) => Promise<void>
    teardownSseListener: () => void
    setOnlineCount: (count: number) => void
}

export const useChatMessages = () => {
    const {t} = useI18n()
    const userStore = useUserStore()

    // 状态
    const messages = ref<LiveRoomChatMessage[]>([])

    // SSE 连接相关状态
    let sseController: AbortController | null = null
    const sseIsConnected = ref<boolean>(false)

    // 在线人数（由外部传入）
    const chatOnlineCount = ref<number>(1)

    // 设置在线人数
    const setOnlineCount = (count: number): void => {
        chatOnlineCount.value = Math.max(count, 1)
    }

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
                    {reliable: true}
                )
            }

            // 发送到后端（后端会通过 SSE 广播给其他用户）
            const senderRole = userStore.teacherInfo
                ? LiveRoomRoleEnum.TEACHER
                : (userStore.roles?.some((r: any) => r.roleKey === 'ASSISTANT') ? LiveRoomRoleEnum.ASSISTANT : LiveRoomRoleEnum.STUDENT)

            const messageDTO = {
                content: trimmed,
                messageType: 'text',
                senderRole
            }

            const response = await liveApi.appendLiveRoomMessage(roomId, messageDTO)

            // 如果后端返回了消息数据，替换本地临时消息
            if (response?.data) {
                const serverMsg: any = response.data

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
        // 防止重复绑定导致消息重复处理
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const roomAny = room as any
        if (roomAny.__chat_handler_attached) return

        const handler = (data: Uint8Array) => {
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
        }

        room.on(RoomEvent.DataReceived, handler)
        roomAny.__chat_handler_attached = true
        // 记录引用以便必要时移除（例如在 disconnect/cleanup 中）
        roomAny.__chat_handler = handler
    }

    const teardownRealtimeMessages = (room: Room): void => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const roomAny = room as any
        if (!roomAny.__chat_handler_attached || !roomAny.__chat_handler) return
        try {
            room.off(RoomEvent.DataReceived, roomAny.__chat_handler)
        } catch (e) {
            // ignore removal errors
        }
        roomAny.__chat_handler_attached = false
        roomAny.__chat_handler = null
    }

    // 设置 SSE 监听聊天消息
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const setupSseListener = async (_roomId: string, classroomId?: string): Promise<void> => {
        // 如果已经连接，先断开
        teardownSseListener()

        try {
            const jwtToken = userStore.token
            if (!jwtToken) {
                return
            }

            // 获取 SSE token
            const sseTokenResponse = await liveApi.getSseToken(classroomId)
            if (!sseTokenResponse?.data) {
                return
            }
            const sseToken = sseTokenResponse.data

            // 建立 SSE 连接
            const baseURL = apiConfig.getBaseUrl()
            const ssePath = `/live/live/subscribe${classroomId ? `?classroomId=${classroomId}&token=${sseToken}` : `?token=${sseToken}`}`
            const sseUrl = `${baseURL}${ssePath}`

            sseController = new AbortController()

            await fetchEventSource(sseUrl, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${jwtToken}`,
                    'Accept': 'text/event-stream'
                },
                signal: sseController.signal,
                openWhenHidden: true,
                credentials: 'include',
                onopen: async (response) => {
                    if (response.ok) {
                        sseIsConnected.value = true
                    }
                },
                onmessage: (event) => {
                    try {
                        const data = JSON.parse(event.data)

                        // 只处理聊天消息事件
                        if (data.event !== 'chat_message' || !data.data) {
                            return
                        }

                        const payload = data.data
                        const currentUserNickName = userStore.userInfo?.nickName
                        const senderName = payload.sender || t('live.room.unknown')
                        const isOwn = senderName === currentUserNickName

                        // 检查是否已经在消息列表中
                        const exists = messages.value.some(m => m.id === payload.id)
                        if (!exists) {
                            messages.value.push({
                                id: payload.id || `${Date.now()}`,
                                sender: senderName,
                                content: payload.content,
                                timestamp: payload.sendTime ? new Date(payload.sendTime).toLocaleTimeString() : new Date().toLocaleTimeString(),
                                isOwn
                            })
                        }
                    } catch (error) {
                        // 解析 SSE 消息失败，静默处理
                    }
                },
                onerror: (_error) => {
                    sseIsConnected.value = false
                    teardownSseListener()
                }
            })
        } catch (error) {
            sseIsConnected.value = false
        }
    }

    // 断开 SSE 连接
    const teardownSseListener = (): void => {
        if (sseController) {
            sseController.abort()
            sseController = null
        }
        sseIsConnected.value = false
    }

    // 组件卸载时自动断开 SSE
    onBeforeUnmount(() => {
        teardownSseListener()
    })

    return {
        // 状态
        messages: readonly(messages),
        chatOnlineCount: readonly(chatOnlineCount),

        // 方法
        loadHistoryMessages,
        sendMessage,
        addMessage,
        setupRealtimeMessages,
        teardownRealtimeMessages,
        setupSseListener,
        teardownSseListener,
        setOnlineCount
    }
}
