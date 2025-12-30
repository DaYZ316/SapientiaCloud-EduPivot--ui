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
          <span v-if="recordingStatusLabel" :class="{'recording-active': isRecording}" class="recording-chip">
            {{ recordingStatusLabel }}
          </span>
          <n-text v-if="connectionStateLabel" :depth="3">
            {{ t('live.room.connectionState') }}: {{ connectionStateLabel }}
          </n-text>
          <n-text v-if="connectionError" :depth="3" style="color: var(--error-color);">
            {{ connectionError }}
          </n-text>
        </div>
        <n-space>
          <n-button v-if="isConnected" type="error" @click="handleLeave">
            {{ t('live.room.leave') }}
          </n-button>
        </n-space>
      </div>

      <div :class="{'is-connected': isConnected}" class="room-layout">
        <section class="video-panel">
          <template v-if="connecting">
            <div class="connecting-state">
              <n-spin size="large" />
              <div class="connecting-text">{{ connectionStateLabel || t('live.room.connecting') }}</div>
            </div>
          </template>
          <template v-else-if="isConnected">
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
                <video :ref="(el) => setRemoteVideoRef(el as HTMLVideoElement | null, participant.participantId)"
                       autoplay
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
                <n-button
                    v-if="isConnected && (currentUserRole === LiveRoomRoleEnum.TEACHER || currentUserRole === LiveRoomRoleEnum.ASSISTANT)"
                    :disabled="roomInfo?.recordingEnabled !== 1"
                    :loading="recordingLoading"
                    :type="isRecording ? 'error' : 'default'"
                    @click="toggleRecording"
                >
                  <template #icon>
                    <Icon :component="isRecording ? StopCircleOutline : RadioButtonOnOutline"/>
                  </template>
                  {{ isRecording ? t('live.room.stopRecording') : t('live.room.startRecording') }}
                </n-button>
              </n-space>
            </div>
          </template>
        </section>

        <section :class="['chat-panel', {'chat-panel-connected': isConnected}]">
          <ChatPanel
              :can-send="true"
              :extra="`${chatOnlineCount} ${t('live.room.members')}`"
              :fixed-footer="!!isConnected"
              :loading="false"
              :messages="chatMessages || []"
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
import {computed, onBeforeUnmount, onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'
import {ConnectionState, RemoteParticipant, RemoteTrackPublication, Room, RoomEvent, Track} from 'livekit-client'
import {
  MicOffOutline,
  MicOutline,
  RadioButtonOnOutline,
  StopCircleOutline,
  VideocamOffOutline,
  VideocamOutline
} from '@vicons/ionicons5'
import {useI18n} from 'vue-i18n'
import Icon from '@/components/common/Icon.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import ChatPanel from '@/components/common/ChatPanel.vue'
import * as liveApi from '@/api/live'
import {getLiveRoomRoleLabel, getLiveRoomStatusLabel, LiveRoomRoleEnum, LiveRoomStatusEnum} from '@/enum/live'
import type {LiveRoomChatMessage, LiveRoomVO, RemoteParticipantMedia} from '@/types/live'
import {useUserStore} from '@/store'

const {t} = useI18n()
const route = useRoute()
const props = defineProps<{ roomIdProp?: string | null; tokenProp?: string | null }>();
const userStore = useUserStore()

const roomId = props.roomIdProp ?? (route.params.roomId as string)
const roomInfo = ref<LiveRoomVO | null>(null)
const room = ref<Room | null>(null)
const isConnected = ref<boolean | null>(null)
const connecting = ref<boolean | null>(null)
const connectionState = ref<string | null>(null)
const connectionError = ref<string | null>(null)
const cameraEnabled = ref<boolean | null>(null)
const microphoneEnabled = ref<boolean | null>(null)
const onlineCount = ref<number | null>(null)
const recordingLoading = ref<boolean | null>(null)

const chatMessages = ref<LiveRoomChatMessage[] | null>(null)

const localVideoRef = ref<HTMLVideoElement | null>(null)
const remoteParticipants = ref<RemoteParticipantMedia[]>([])
const remoteVideoRefs = ref<Map<string, HTMLVideoElement>>(new Map())

const messagePollingTimer = ref<ReturnType<typeof setInterval> | null>(null)
const lastMessageTime = ref<string | null>(null)
const connectionHealthCheckTimer = ref<ReturnType<typeof setInterval> | null>(null)

// 页面刷新/卸载检测
let pageUnloading = false

const roomStatusLabel = computed(() => {
  if (!roomInfo.value?.status && roomInfo.value?.status !== 0) {
    return t('live.room.statusUnknown')
  }
  return getLiveRoomStatusLabel(roomInfo.value.status ?? LiveRoomStatusEnum.NOT_STARTED, false)
})

const chatOnlineCount = computed(() => {
  const liveCount = onlineCount.value ?? 0
  return liveCount > 0 ? liveCount : 1
})

const livekitServerUrl = computed(() => {
  // 优先使用环境变量（Vite: VITE_LIVEKIT_WS），例如: VITE_LIVEKIT_WS=ws://localhost:7880
  // 回退到默认值：同主机的 7880 端口（LiveKit 在 docker-compose 中使用 7880）
  const envUrl = (import.meta && (import.meta as any).env && (import.meta as any).env.VITE_LIVEKIT_WS) || ''
  if (envUrl && envUrl.trim().length > 0) {
    return envUrl.trim()
  }

  const isHttps = window.location.protocol === 'https:'
  const wsProtocol = isHttps ? 'wss:' : 'ws:'
  // 使用 hostname 而不是包含端口的 host，确保使用默认 LiveKit 端口 7880
  return `${wsProtocol}//${window.location.hostname}:7880`
})

// RTC 配置，包括 STUN/TURN 服务器
// 注意：livekit-client 会自动使用浏览器的默认 RTC 配置
// 如果需要自定义，可以通过环境变量配置 TURN 服务器

const connectionStateLabel = computed(() => {
  if (!connectionState.value) return ''
  const labels: Record<string, string> = {
    connecting: t('live.room.connecting'),
    connected: t('live.room.connected'),
    disconnected: t('live.room.disconnected'),
    reconnecting: t('live.room.reconnecting'),
    failed: t('live.room.connectFailed')
  }
  return labels[connectionState.value] ?? ''
})
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

// 录制相关状态
const isRecording = computed(() => {
  return roomInfo.value?.egressStatus === 1 // RUNNING
})

const recordingStatusLabel = computed(() => {
  if (!roomInfo.value) return null
  const status = roomInfo.value.egressStatus
  if (status === null || status === undefined) return null
  const labels: Record<number, string> = {
    0: t('live.room.recordingIdle') || '未录制',
    1: t('live.room.recordingRunning') || '录制中',
    2: t('live.room.recordingStopping') || '停止中',
    3: t('live.room.recordingStopped') || '已停止',
    4: t('live.room.recordingFailed') || '录制失败'
  }
  return labels[status] || null
})

// 页面卸载检测
const handlePageUnload = () => {
  pageUnloading = true
  if (room.value) {
    // 同步断开连接，避免异步操作
    try {
      room.value.disconnect()
    } catch (e) {
      // 忽略清理过程中的错误
    }
  }
}

onMounted(async () => {
  // 添加页面卸载监听器
  window.addEventListener('beforeunload', handlePageUnload)
  window.addEventListener('unload', handlePageUnload)

  await loadRoomInfo()
  await loadHistoryMessages()

  // 检查 props 或路由参数中是否有 token，直接尝试加入
  const queryToken = route.query.token as string
  const providedToken = props.tokenProp ?? queryToken ?? null

  if (providedToken) {
    // 有token时直接加入直播
    setTimeout(() => {
      handleJoin(providedToken).catch((err: any) => {
        connectionError.value = err?.message || t('live.room.connectError')
      })
    }, 150)
  } else {
    // 没有token时尝试自动获取并加入
    setTimeout(() => {
      handleJoin().catch((err: any) => {
        connectionError.value = err?.message || t('live.room.connectError')
        // 如果自动加入失败，启动消息轮询作为备选
        startMessagePolling()
      })
    }, 150)
  }
})

onBeforeUnmount(() => {
  // 移除页面卸载监听器
  window.removeEventListener('beforeunload', handlePageUnload)
  window.removeEventListener('unload', handlePageUnload)

  if (room.value) {
    handleLeave()
  }
  // 清除轮询定时器
  stopMessagePolling()
  // 清除健康检查定时器
  if (connectionHealthCheckTimer.value) {
    clearInterval(connectionHealthCheckTimer.value)
    connectionHealthCheckTimer.value = null
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
  const currentUserId = userStore.userInfo?.id
  const currentUserNickName = userStore.userInfo?.nickName
  const mapped = history
      .slice()
      .reverse()
      .map((item) => {
        const senderName = (item as any).senderName || t('live.room.unknown')
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

  if (mapped.length === 0) {
    chatMessages.value = [
      {
        id: 'welcome',
        sender: t('live.room.system'),
        content: t('live.room.welcomeMessage'),
        timestamp: new Date().toLocaleTimeString(),
        isOwn: false
      }
    ]
    return
  }
  chatMessages.value = mapped
}

// 轮询获取新消息
async function pollNewMessages() {
  // 如果已连接，不需要轮询（通过 WebRTC 接收）
  if (isConnected.value) {
    return
  }

  const response = await liveApi.listLiveRoomMessages(roomId, 50).then((res) => res, () => null)
  if (!response?.data || response.data.length === 0) {
    return
  }

  const history = response.data
  const currentUserId = userStore.userInfo?.id
  const currentUserNickName = userStore.userInfo?.nickName

  // 如果有最后一条消息的时间，只获取新消息
  if (lastMessageTime.value) {
    const newMessages = history.filter((item: any) => {
      if (!item.sendTime) return false
      return new Date(item.sendTime) > new Date(lastMessageTime.value!)
    })

    if (newMessages.length === 0) {
      return
    }

    // 将新消息添加到列表
    const mapped = newMessages.map((item: any) => {
      const senderName = (item as any).senderName || t('live.room.unknown')
      const isOwn = senderName === currentUserNickName || (item as any).senderId === currentUserId
      return {
        id: item.id || `${Date.now()}-${Math.random()}`,
        sender: senderName,
        content: item.content,
        timestamp: item.sendTime ? new Date(item.sendTime).toLocaleTimeString() : '',
        isOwn
      }
    })

    if (!chatMessages.value) {
      chatMessages.value = []
    }

    // 避免重复添加
    const existingIds = new Set(chatMessages.value.map(msg => msg.id))
    const uniqueNewMessages = mapped.filter(msg => !existingIds.has(msg.id))

    if (uniqueNewMessages.length > 0) {
      chatMessages.value.push(...uniqueNewMessages)
      // 更新最后一条消息的时间
      const lastNewMessage = newMessages[newMessages.length - 1]
      lastMessageTime.value = lastNewMessage.sendTime || null
    }
  } else {
    // 如果没有记录，重新加载所有消息
    await loadHistoryMessages()
  }
}

// 启动消息轮询
function startMessagePolling() {
  // 清除之前的定时器
  stopMessagePolling()
  // 每2秒轮询一次新消息
  messagePollingTimer.value = setInterval(() => {
    pollNewMessages()
  }, 2000)
}

// 停止消息轮询
function stopMessagePolling() {
  if (messagePollingTimer.value) {
    clearInterval(messagePollingTimer.value)
    messagePollingTimer.value = null
  }
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
    onlineCount.value = null
    return
  }
  const participantTotal = targetRoom.remoteParticipants ? targetRoom.remoteParticipants.size : 0
  onlineCount.value = participantTotal + (isConnected.value ? 1 : 0)
}

async function handleJoin(tokenArg?: string | Event) {
  try {
    if (!roomInfo.value || connecting.value || isConnected.value || pageUnloading) return

    // 处理参数，因为可能是鼠标事件
    const providedToken = typeof tokenArg === 'string' ? tokenArg : undefined

    connecting.value = true
    connectionState.value = 'connecting'
    connectionError.value = null

    // 连接前刷新房间信息，确保获取最新状态
    await loadRoomInfo().then(() => {
      // 检查房间状态，如果房间已结束，不允许加入
      if (roomInfo.value?.status === LiveRoomStatusEnum.ENDED || roomInfo.value?.status === LiveRoomStatusEnum.CLOSED) {
        connecting.value = false
        connectionState.value = 'failed'
        connectionError.value = t('live.room.roomEnded')
        return
      }

      // 学生角色检查 - 学生只能加入正在直播的房间
      const isStudent = currentUserRole.value === LiveRoomRoleEnum.STUDENT
      if (isStudent && roomInfo.value?.status !== LiveRoomStatusEnum.LIVE) {
        connecting.value = false
        connectionState.value = 'failed'
        connectionError.value = t('live.room.notLiveForStudent')
        return
      }
    }, () => {
      // 继续尝试连接，不阻止
    })

    // 如果房间已结束或学生无法加入，直接返回
    if (roomInfo.value?.status === LiveRoomStatusEnum.ENDED ||
        roomInfo.value?.status === LiveRoomStatusEnum.CLOSED ||
        (currentUserRole.value === LiveRoomRoleEnum.STUDENT && roomInfo.value?.status !== LiveRoomStatusEnum.LIVE)) {
      // 确保重置连接状态
      if (connecting.value) {
        connecting.value = false
      }
      return
    }

    // 统一通过后端接口获取 token（后端同时返回用于 LiveKit 的 roomName）
    let token: string | null = providedToken || null
    let returnedRoomName: string | null = null

    if (!token) {
      const tokenDTO = liveApi.getDefaultLiveRoomTokenRequestDTO()
      tokenDTO.role = currentUserRole.value
      const tokenResponse = await liveApi.issueLiveRoomToken(roomId, tokenDTO).then((res) => res, () => null)

      // tokenResponse.data 可能是字符串（旧实现）或对象 { token, roomName }
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
      connecting.value = false
      connectionState.value = 'failed'
      connectionError.value = t('live.room.tokenError')
      return
    }

    const newRoom = new Room({
      // 启用自适应流和动态广播
      adaptiveStream: true,
      dynacast: true
    })
    bindRoomEvents(newRoom)

    // 创建一个 Promise 来等待 Connected 事件
    let connectedResolver: (() => void) | null = null
    let connectedRejector: ((error: Error) => void) | null = null
    const connectedPromise = new Promise<void>((resolve, reject) => {
      connectedResolver = resolve
      connectedRejector = reject
    })

    // 在事件绑定中设置连接成功回调
    // 注意：这些是临时监听器，在连接完成后会被移除
    const onConnected = () => {
      if (connectedResolver) {
        connectedResolver()
        // 清理引用，防止后续调用
        connectedResolver = null
        connectedRejector = null
      }
    }
    // 断开连接原因映射
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

    const onDisconnected = (reason?: any) => {
      // 只在连接建立过程中才拒绝 Promise
      if (connectedRejector && connecting.value) {
        const reasonMessage = getDisconnectReasonMessage(reason)
        connectedRejector(new Error(`连接丢失: ${reasonMessage}`))
        // 清理引用，防止后续调用
        connectedResolver = null
        connectedRejector = null
      }
    }
    newRoom.on(RoomEvent.Connected, onConnected)
    newRoom.on(RoomEvent.Disconnected, onDisconnected)

    // 如果后端返回了 LiveKit 的真实 roomName，则在连接时通过查询参数传入（确保与 token 中 video.room 一致）
    const connectUrl = returnedRoomName ? `${livekitServerUrl.value}?room=${encodeURIComponent(returnedRoomName)}` : livekitServerUrl.value
    const connectPromise = newRoom.connect(connectUrl, token).catch((connectError) => {
      // 如果连接直接失败，提供更具体的错误信息
      if (connectError?.message?.includes('unauthorized') || connectError?.message?.includes('401')) {
        throw new Error('身份验证失败：访问令牌无效或已过期')
      } else if (connectError?.message?.includes('not found') || connectError?.message?.includes('404')) {
        throw new Error('房间不存在或无法访问')
      } else if (connectError?.message?.includes('forbidden') || connectError?.message?.includes('403')) {
        throw new Error('访问被拒绝：您没有权限加入此房间')
      } else {
        throw new Error(`连接失败：${connectError?.message || '未知错误'}`)
      }
    })

    let timeoutId: ReturnType<typeof setTimeout> | null = null
    const timeoutPromise = new Promise<never>((_, reject) => {
      timeoutId = setTimeout(() => {
        reject(new Error('连接超时：60秒后仍未建立连接'))
      }, 60000)
    })

    // 等待 WebSocket 连接
    await Promise.race([connectPromise, timeoutPromise]).then(() => {
      // 再等待 Connected 事件（表示 RTC 连接也建立完成）
      return Promise.race([
        connectedPromise,
        new Promise<never>((_, reject) => {
          setTimeout(() => {
            reject(new Error('RTC连接超时：60秒后仍未完成媒体连接'))
          }, 60000)
        })
      ])
    }, (error) => {
      return Promise.reject(error)
    }).then(() => {
      // 清理超时定时器
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      // 移除临时事件监听器
      newRoom.off(RoomEvent.Connected, onConnected)
      newRoom.off(RoomEvent.Disconnected, onDisconnected)

      // 确保清理 Promise 相关引用
      connectedResolver = null
      connectedRejector = null

      // 检查连接状态
      if (newRoom.state !== ConnectionState.Connected) {
        throw new Error('Room is not in connected state')
      }

      room.value = newRoom
      isConnected.value = true
      connectionState.value = 'connected'
      connecting.value = false
      connectionError.value = null
      updateOnlineCount(newRoom)
      // 连接成功后停止轮询（通过 WebRTC 接收消息）
      stopMessagePolling()

      // 在完全连接后再设置媒体，短暂等待确保连接稳定
      return new Promise(resolve => setTimeout(resolve, 1000)).then(() => {
        // 再次检查连接状态
        if (newRoom.state === ConnectionState.Connected) {
          return setupLocalMedia(newRoom).then(() => null, () => null)
        }
        return null
      })
    }, (error: any) => {
      // 清理超时定时器
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
      // 移除临时事件监听器
      newRoom.off(RoomEvent.Connected, onConnected)
      newRoom.off(RoomEvent.Disconnected, onDisconnected)

      // 确保清理 Promise 相关引用
      connectedResolver = null
      connectedRejector = null

      connecting.value = false
      connectionState.value = 'failed'
      // 提供更详细的错误信息
      let errorMessage = error?.message || t('live.room.connectError')
      if (error?.message?.includes('pc connection') || error?.message?.includes('could not establish pc connection')) {
        errorMessage = t('live.room.rtcConnectionError') + ' ' + t('live.room.rtcConnectionErrorHint')
      } else if (error?.message?.includes('timeout') || error?.message?.includes('Connection timeout') || error?.message?.includes('RTC connection timeout')) {
        errorMessage = t('live.room.connectionTimeout') + ' ' + t('live.room.connectionTimeoutHint') + ' (可能是网络问题或防火墙阻止了 WebRTC 连接)'
      } else if (error?.message?.includes('network') || error?.message?.includes('Network')) {
        errorMessage = t('live.room.networkError')
      } else if (error?.message?.includes('401') || error?.message?.includes('Unauthorized')) {
        errorMessage = t('live.room.tokenInvalid')
      } else if (error?.message?.includes('404') || error?.message?.includes('Not Found')) {
        errorMessage = t('live.room.serverNotFound')
      }
      connectionError.value = errorMessage

      // 清理资源 - 检查连接状态
      if (newRoom.state !== ConnectionState.Disconnected) {
        newRoom.disconnect().then(() => null, () => null)
      }

      // 不要抛出，让调用方继续，但返回以中止函数
      return
    })
  } catch (err: any) {
    // 捕获所有异常，设置状态并清理资源，避免未捕获的 promise 错误
    connecting.value = false
    connectionState.value = 'failed'
    connectionError.value = err?.message || t('live.room.connectError')

    try {
      if (room.value) {
        await room.value.disconnect().then(() => null, () => null)
      }
    } catch (_e) {
      // noop
    }
    return
  }
}

async function handleLeave() {
  if (!room.value) return
  await room.value.disconnect().then(() => null, () => null)
  room.value = null
  isConnected.value = null
  connectionState.value = 'disconnected'
  cameraEnabled.value = null
  microphoneEnabled.value = null
  updateOnlineCount(null)
  cleanupRemoteParticipants()
  if (localVideoRef.value) {
    localVideoRef.value.srcObject = null
  }
  // 断开连接后，如果还在房间页面，重新启动轮询
  if (roomId) {
    startMessagePolling()
  }
}

// 处理服务器强制断开连接的情况
async function handleForcedDisconnect() {
  // Handling forced disconnect from server

  // 设置连接状态
  connectionState.value = 'disconnected'
  isConnected.value = null
  connecting.value = null

  // 清理媒体状态
  cameraEnabled.value = null
  microphoneEnabled.value = null
  updateOnlineCount(null)
  cleanupRemoteParticipants()

  // 清理本地视频
  if (localVideoRef.value) {
    localVideoRef.value.srcObject = null
  }

  // 清理房间引用（但不调用disconnect，因为连接已经断开）
  room.value = null

  // 如果页面正在卸载，不显示错误提示
  if (!pageUnloading) {
    connectionError.value = t('live.room.connectionLost') || '连接已断开，请重新加入房间'
  }

  // 重新启动消息轮询
  if (roomId && !pageUnloading) {
    startMessagePolling()
  }
}

async function toggleCamera() {
  if (!room.value) {
    connectionError.value = t('live.room.notConnected') || '未连接到房间'
    return
  }

  if (room.value.state !== ConnectionState.Connected) {
    let stateText = t('live.room.connectFailed') || '连接失败'
    if (room.value.state === ConnectionState.Connecting) {
      stateText = t('live.room.connecting') || '连接中'
    } else if (room.value.state === ConnectionState.Reconnecting) {
      stateText = t('live.room.reconnecting') || '重连中'
    } else if (room.value.state === ConnectionState.Disconnected) {
      stateText = t('live.room.disconnected') || '已断开'
    }
    connectionError.value = t('live.room.cannotToggleCamera') || `无法切换摄像头：${stateText}`
    return
  }

  const enabled = !cameraEnabled.value

  // 如果禁用，直接调用 setCameraEnabled(false)
  if (!enabled) {
    await room.value.localParticipant.setCameraEnabled(false).then(() => {
      cameraEnabled.value = false
      if (localVideoRef.value) {
        localVideoRef.value.srcObject = null
      }
    }, () => null)
    return
  }

  // 启用摄像头：如果已经有轨道，先禁用再启用以避免克隆问题
  const existingPublications = Array.from(room.value.localParticipant.videoTrackPublications.values())
  if (existingPublications.length > 0) {
    // 先禁用
    await room.value.localParticipant.setCameraEnabled(false).then(() => {
      return new Promise(resolve => setTimeout(resolve, 200))
    }, () => null)
  }

  // 重新启用摄像头
  await room.value.localParticipant.setCameraEnabled(true).then(() => {
    cameraEnabled.value = true

    // 等待轨道发布并附加到视频元素
    return new Promise(resolve => setTimeout(resolve, 500))
  }, (error: any) => {
    const errorMsg = error?.message || '未知错误'
    if (error?.name === 'DataCloneError' || errorMsg.includes('could not be cloned')) {
      connectionError.value = t('live.room.cameraToggleFailed') || '切换摄像头失败：内部错误，请尝试刷新页面后重试'
    } else {
      connectionError.value = t('live.room.cameraToggleFailed') || `切换摄像头失败：${errorMsg}`
    }
    return null
  }).then(() => {
    const videoPublications = Array.from(room.value!.localParticipant.videoTrackPublications.values())
    for (const publication of videoPublications) {
      if (publication.track && localVideoRef.value) {
        publication.track.attach(localVideoRef.value)
      }
    }

    // 如果还没有视频轨道，监听发布事件
    if (videoPublications.length === 0 && localVideoRef.value) {
      const handleTrackPublished = (publication: any) => {
        if (publication.track && publication.track.kind === Track.Kind.Video && localVideoRef.value) {
          publication.track.attach(localVideoRef.value)
          room.value!.localParticipant.off('trackPublished', handleTrackPublished)
        }
      }
      room.value!.localParticipant.on('trackPublished', handleTrackPublished)

      // 设置超时清理监听器
      setTimeout(() => {
        room.value?.localParticipant.off('trackPublished', handleTrackPublished)
      }, 5000)
    }
  })
}

async function toggleMicrophone() {
  if (!room.value) {
    connectionError.value = t('live.room.notConnected') || '未连接到房间'
    return
  }

  if (room.value.state !== ConnectionState.Connected) {
    let stateText = t('live.room.connectFailed') || '连接失败'
    if (room.value.state === ConnectionState.Connecting) {
      stateText = t('live.room.connecting') || '连接中'
    } else if (room.value.state === ConnectionState.Reconnecting) {
      stateText = t('live.room.reconnecting') || '重连中'
    } else if (room.value.state === ConnectionState.Disconnected) {
      stateText = t('live.room.disconnected') || '已断开'
    }
    connectionError.value = t('live.room.cannotToggleMicrophone') || `无法切换麦克风：${stateText}`
    return
  }

  const enabled = !microphoneEnabled.value

  // 如果禁用，直接调用 setMicrophoneEnabled(false)
  if (!enabled) {
    await room.value.localParticipant.setMicrophoneEnabled(false).then(() => {
      microphoneEnabled.value = false
    }, () => null)
    return
  }

  // 启用麦克风：如果已经有轨道，先禁用再启用以避免克隆问题
  const existingPublications = Array.from(room.value.localParticipant.audioTrackPublications.values())
  if (existingPublications.length > 0) {
    // 先禁用
    await room.value.localParticipant.setMicrophoneEnabled(false).then(() => {
      return new Promise(resolve => setTimeout(resolve, 200))
    }, () => null)
  }

  // 重新启用麦克风
  await room.value.localParticipant.setMicrophoneEnabled(true).then(() => {
    microphoneEnabled.value = true
  }, (error: any) => {
    const errorMsg = error?.message || '未知错误'
    if (error?.name === 'DataCloneError' || errorMsg.includes('could not be cloned')) {
      connectionError.value = t('live.room.microphoneToggleFailed') || '切换麦克风失败：内部错误，请尝试刷新页面后重试'
    } else {
      connectionError.value = t('live.room.microphoneToggleFailed') || `切换麦克风失败：${errorMsg}`
    }
  })
}

async function toggleRecording() {
  if (!roomInfo.value) {
    return
  }

  // 检查权限
  if (!isConnected.value || (currentUserRole.value !== LiveRoomRoleEnum.TEACHER && currentUserRole.value !== LiveRoomRoleEnum.ASSISTANT)) {
    connectionError.value = t('live.room.noPermissionToRecord') || '您没有权限控制录制'
    return
  }

  // 检查房间是否启用了录制功能
  if (roomInfo.value.recordingEnabled !== 1) {
    connectionError.value = t('live.room.recordingNotEnabled') || '该房间未开启录制功能，请在创建房间时启用录制'
    return
  }

  if (recordingLoading.value) {
    return
  }

  recordingLoading.value = true

  if (isRecording.value) {
    // 停止录制
    await liveApi.stopRecording(roomId).then((response) => {
      if (response?.data) {
        roomInfo.value = response.data
      }
      recordingLoading.value = null
    }, () => {
      connectionError.value = t('live.room.stopRecordingFailed') || '停止录制失败'
      recordingLoading.value = null
    })
  } else {
    // 开始录制
    await liveApi.startRecording(roomId).then((response) => {
      if (response?.data) {
        roomInfo.value = response.data
      }
      recordingLoading.value = null
    }, () => {
      connectionError.value = t('live.room.startRecordingFailed') || '开始录制失败'
      recordingLoading.value = null
    })
  }
}

function buildLocalMessage(content: string): LiveRoomChatMessage {
  return {
    id: `${Date.now()}`,
    sender: userStore.userInfo?.nickName || t('live.room.me'),
    content,
    timestamp: new Date().toLocaleTimeString(),
    isOwn: true
  }
}

async function handleSendMessage(content: string) {
  const trimmed = content.trim()
  if (!trimmed) return

  const localMessage = buildLocalMessage(trimmed)
  if (!chatMessages.value) {
    chatMessages.value = []
  }
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
        {reliable: true}
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
    connecting.value = null
    connectionState.value = 'connected'
    updateOnlineCount(targetRoom)
    // 连接成功后停止轮询（通过 WebRTC 接收消息）
    stopMessagePolling()
  })

  targetRoom.on(RoomEvent.DataReceived, (data: Uint8Array) => {
    const text = new TextDecoder().decode(data)
    Promise.resolve(text).then((decodedText) => {
      return new Promise((resolve) => {
        const payload = JSON.parse(decodedText)
        resolve(payload)
      })
    }).then((payload: any) => {
      if (!payload || payload.type !== 'chat' || !payload.content) {
        return
      }
      if (!chatMessages.value) {
        chatMessages.value = []
      }
      const senderName = payload.sender || t('live.room.unknown')
      const currentUserNickName = userStore.userInfo?.nickName
      const isOwn = senderName === currentUserNickName
      chatMessages.value.push({
        id: `${Date.now()}`,
        sender: senderName,
        content: payload.content,
        timestamp: payload.sendTime ? new Date(payload.sendTime).toLocaleTimeString() : new Date().toLocaleTimeString(),
        isOwn
      })
    }, () => null)
  })

  targetRoom.on(RoomEvent.Disconnected, () => {
    connectionState.value = 'disconnected'
    isConnected.value = null
    cleanupRemoteParticipants()
    updateOnlineCount(null)
    // 断开连接后，重新启动轮询
    if (roomId) {
      startMessagePolling()
    }
  })

  // 添加连接健康检查，处理服务器强制断开的情况
  const startConnectionHealthCheck = () => {
    // 清除之前的定时器
    if (connectionHealthCheckTimer.value) {
      clearInterval(connectionHealthCheckTimer.value)
    }
    // 每5秒检查一次连接状态
    connectionHealthCheckTimer.value = setInterval(() => {
      // 如果页面正在卸载，不进行健康检查
      if (pageUnloading) return

      if (targetRoom.state === ConnectionState.Disconnected && isConnected.value) {
        // Connection lost unexpectedly (detected by health check), cleaning up...
        handleForcedDisconnect()
      }
    }, 5000)
  }

  const stopConnectionHealthCheck = () => {
    if (connectionHealthCheckTimer.value) {
      clearInterval(connectionHealthCheckTimer.value)
      connectionHealthCheckTimer.value = null
    }
  }

  // 连接建立时启动健康检查
  targetRoom.on(RoomEvent.Connected, () => {
    startConnectionHealthCheck()
  })

  // 断开连接时停止健康检查
  targetRoom.on(RoomEvent.Disconnected, () => {
    stopConnectionHealthCheck()
  })

  // RoomEvent.StateChanged 不存在，使用其他事件代替
  // 连接状态通过 Connected 和 Disconnected 事件处理

  targetRoom.on(RoomEvent.Reconnecting, () => {
    // 如果页面正在卸载，不进行重连
    if (pageUnloading) {
      // Page unloading, skipping reconnect
      return
    }
    connectionState.value = 'reconnecting'
  })

  targetRoom.on(RoomEvent.Reconnected, () => {
    // 如果页面正在卸载，不处理重连成功
    if (pageUnloading) {
      // Page unloading, ignoring reconnect success
      return
    }
    connectionState.value = 'connected'
    isConnected.value = true
    // 重连成功后停止轮询（通过 WebRTC 接收消息）
    stopMessagePolling()
    // 重连成功后，如果之前启用了摄像头或麦克风，尝试恢复它们
    if (targetRoom.state === ConnectionState.Connected) {
      setTimeout(() => {
        // 恢复麦克风状态
        if (microphoneEnabled.value === true) {
          targetRoom.localParticipant.setMicrophoneEnabled(true).then(() => null, () => {
            microphoneEnabled.value = null
          })
        }
        // 恢复摄像头状态
        if (cameraEnabled.value === true) {
          targetRoom.localParticipant.setCameraEnabled(true).then(() => {
            // 等待轨道发布并附加到视频元素
            setTimeout(() => {
              const videoPublications = Array.from(targetRoom.localParticipant.videoTrackPublications.values())
              for (const publication of videoPublications) {
                if (publication.track && localVideoRef.value) {
                  publication.track.attach(localVideoRef.value)
                }
              }
            }, 300)
          }, () => {
            cameraEnabled.value = null
          })
        }
      }, 1000) // 等待1秒确保连接稳定
    }
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

  // 监听本地轨道发布事件
  targetRoom.localParticipant.on('trackPublished', (publication: any) => {
    if (publication.track && publication.track.kind === Track.Kind.Video && localVideoRef.value) {
      publication.track.attach(localVideoRef.value)
    }
  })
}

async function setupLocalMedia(targetRoom: Room) {
  // 检查连接状态
  if (targetRoom.state !== ConnectionState.Connected) {
    return
  }

  // 先启用麦克风（通常更稳定）
  await targetRoom.localParticipant.setMicrophoneEnabled(true).then(() => {
    microphoneEnabled.value = true
  }, () => {
    microphoneEnabled.value = null
    connectionError.value = t('live.room.microphoneEnableFailed') || '启用麦克风失败，请检查权限设置'
  })

  // 等待一小段时间再启用摄像头
  await new Promise(resolve => setTimeout(resolve, 300))

  // 启用摄像头，添加重试机制
  let cameraRetries = 3
  let cameraSuccess = false

  while (cameraRetries > 0 && !cameraSuccess) {
    // 再次检查连接状态
    if (targetRoom.state !== ConnectionState.Connected) {
      break
    }

    await targetRoom.localParticipant.setCameraEnabled(true).then(() => {
      cameraEnabled.value = true
      cameraSuccess = true
    }, () => {
      cameraRetries--
      if (cameraRetries > 0) {
        return new Promise(resolve => setTimeout(resolve, 1000))
      }
      return null
    })

    if (cameraSuccess) {
      break
    }
  }

  if (!cameraSuccess) {
    cameraEnabled.value = null
    connectionError.value = t('live.room.cameraEnableFailed') || '启用摄像头失败，请检查权限设置或设备是否可用'
  }

  // 等待轨道发布
  await new Promise(resolve => setTimeout(resolve, 500))

  // 使用 videoTrackPublications 获取已发布的视频轨道
  const videoPublications = Array.from(targetRoom.localParticipant.videoTrackPublications.values())
  for (const publication of videoPublications) {
    if (publication.track && localVideoRef.value) {
      publication.track.attach(localVideoRef.value)
    }
  }

  // 如果还没有视频轨道，等待轨道发布
  if (videoPublications.length === 0 && localVideoRef.value && cameraSuccess) {
    // 监听本地视频轨道发布
    const handleLocalTrackPublished = (publication: any) => {
      if (publication.track && publication.track.kind === Track.Kind.Video && localVideoRef.value) {
        publication.track.attach(localVideoRef.value)
        targetRoom.localParticipant.off('trackPublished', handleLocalTrackPublished)
      }
    }
    targetRoom.localParticipant.on('trackPublished', handleLocalTrackPublished)

    // 设置超时，如果5秒内没有轨道发布，给出提示并清理监听器
    setTimeout(() => {
      targetRoom.localParticipant.off('trackPublished', handleLocalTrackPublished)
      const currentPublications = Array.from(targetRoom.localParticipant.videoTrackPublications.values())
      if (currentPublications.length === 0 && cameraEnabled.value === true) {
        connectionError.value = t('live.room.cameraTrackNotPublished') || '摄像头已启用，但视频轨道未发布，请检查设备权限'
      }
    }, 5000)

    // 注意：如果连接断开，handleLeave 会清理所有资源，包括事件监听器
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
  .token-chip,
  .recording-chip {
    padding: 4px 12px;
    border-radius: 999px;
    background-color: var(--background-tertiary-color);
    font-size: 12px;
  }

  .token-chip {
    border: 1px dashed var(--primary-color);
    color: var(--primary-color);
    background-color: transparent;
  }

  .recording-chip {
    &.recording-active {
      background-color: var(--error-color);
      color: var(--text-color);
      animation: recordingPulse 2s ease-in-out infinite;
    }
  }

  @keyframes recordingPulse {
    0%, 100% {
      opacity: 1;
    }
    50% {
      opacity: 0.7;
    }
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

    .connecting-state {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      color: var(--text-color-3);
      min-height: 260px;
      flex: 1;

      .connecting-text {
        font-size: 14px;
        text-align: center;
      }
    }

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
      padding-bottom: 100px; // 预留输入框高度，增加一些余量
      -webkit-overflow-scrolling: touch;
      box-sizing: border-box;
    }

    :deep(.chat-panel__loading) {
      flex: 1 1 auto;
      min-height: 0;
      max-height: 100%;
      overflow-y: auto;
      overflow-x: hidden;
      padding-bottom: 100px; // 预留输入框高度，增加一些余量
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
      padding-bottom: 100px !important; // 预留输入框高度，增加一些余量
      -webkit-overflow-scrolling: touch;
      box-sizing: border-box !important;
    }

    :deep(.chat-panel__loading) {
      flex: 1 1 auto !important;
      min-height: 0 !important;
      max-height: 100% !important;
      overflow-y: auto !important;
      overflow-x: hidden !important;
      padding-bottom: 100px !important; // 预留输入框高度，增加一些余量
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
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 16px;
    flex: 1;
    min-height: 0;
    overflow: hidden;
    align-content: start;
  }

  .video-grid .local-video {
    grid-column: 1 / -1;
    min-height: 400px;
  }

  .video-item {
    position: relative;
    background: var(--background-color);
    border-radius: 8px;
    overflow: hidden;
    aspect-ratio: 16 / 9;
    min-height: 200px;

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
      background: var(--shadow-color);
      color: var(--text-color);
      border-radius: 4px;
      font-size: 12px;
    }
  }

  .video-item.local-video {
    aspect-ratio: auto;
    min-height: 400px;
  }

  .media-controls {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid var(--border-color);
    flex-shrink: 0;
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

