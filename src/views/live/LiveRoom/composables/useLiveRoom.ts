import { computed, ref, type Ref, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { LiveRoomVO, RemoteParticipantMedia } from '@/types/live'
import type { LiveConnectionResult } from './useLiveConnection'
import { LiveRoomRoleEnum } from '@/enum/live'
import { useUserStore } from '@/store'
import { useLiveConnection } from './useLiveConnection'
import { useMediaDevices } from './useMediaDevices'
import { useChatMessages } from './useChatMessages'
import { useRecording } from './useRecording'
import { useLiveRealtime } from './useLiveRealtime'
import { useErrorHandler } from './useErrorHandler'
import { useResourceManager } from './useResourceManager'
import { useLoadingState } from './useLoadingState'
import { useRetryMechanism } from './useRetryMechanism'
import * as liveApi from '@/api/live'
import { RoomEvent, Track, type RemoteParticipant, type RemoteTrackPublication } from 'livekit-client'

export interface LiveRoomResult {
  // 状态
  roomInfo: Ref<LiveRoomVO | null>
  connection: LiveConnectionResult
  remoteParticipants: Ref<RemoteParticipantMedia[]>
  onlineCount: Ref<number>
  isFullscreen: Ref<boolean>
  isChatCollapsed: Ref<boolean>
  unreadMessageCount: Ref<number>
  speakerVolume: Ref<number | null>
  sessionId: Ref<string | null>
  layoutMode: Ref<string>
  selectedMainParticipantId: Ref<string | null>
  firstTeacherParticipantId: Ref<string | null>

  // 计算属性
  currentUserRole: Ref<LiveRoomRoleEnum>
  connectionStateLabel: Ref<string>
  connectionError: Ref<string | null>
  connectionIsConnected: Ref<boolean>
  connectionConnecting: Ref<boolean>
  cameraEnabled: Ref<boolean>
  microphoneEnabled: Ref<boolean>
  recordingLoading: Ref<boolean>
  chatMessages: Ref<any[]>
  chatOnlineCount: Ref<number>
  activeVideoCount: Ref<number>
  speakerVolumeValue: Ref<number>
  canShowRecording: Ref<boolean>
  activeMainParticipantId: Ref<string | null>

  // 加载状态
  loadingState: any

  // 录制相关
  recording: any

  // 方法
  initialize: () => Promise<void>
  handleLeave: () => Promise<void>
  handleSendMessage: (content: string) => Promise<void>
  handleToggleCamera: () => Promise<void>
  handleToggleMicrophone: () => Promise<void>
  handleToggleRecording: () => Promise<void>
  handleSpeakerVolumeChange: (value: number) => void
  handleSelectMain: (participantId: string) => void
  handleToggleLayoutMode: () => void
  handleToggleFullscreen: () => void
  handleToggleChatCollapse: () => void
  cleanup: () => void
  registerVideoPanel?: (panel: any) => void
  unregisterVideoPanel?: () => void
}

export const useLiveRoom = (roomIdProp?: string | null, tokenProp?: string | null): LiveRoomResult => {
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const userStore = useUserStore()

  // 基本状态
  const roomId = roomIdProp ?? (route.params.roomId as string)
  const roomInfo = ref<LiveRoomVO | null>(null)
  const remoteParticipants = ref<RemoteParticipantMedia[]>([])
  // 后端报告的在线人数（通过API和SSE获取）
  const backendMemberCount = ref<number>(0)

  // 在线人数：优先使用后端数据，其次使用LiveKit计算
  const onlineCount = computed(() => {
    // 优先使用后端报告的成员数
    if (backendMemberCount.value > 0) {
      return backendMemberCount.value
    }

    // 其次使用SSE/后端提供的实时成员数
    const realtimeCount = realtime.membersCount.value
    if (typeof realtimeCount === 'number' && realtimeCount >= 0) {
      return realtimeCount
    }

    // 回退到LiveKit计算（用于兼容性）
    if (!connection.room.value) return 0
    const participantTotal = connection.room.value.remoteParticipants ? connection.room.value.remoteParticipants.size : 0
    return participantTotal + (connection.isConnected.value ? 1 : 0)
  })
  const isFullscreen = ref(false)
  const isChatCollapsed = ref(false)
  const unreadMessageCount = ref(0)
  const speakerVolume = ref<number | null>(null)
  const sessionId = ref<string | null>(null)
  const layoutMode = ref('speaker')
  const selectedMainParticipantId = ref<string | null>(null)
  const firstTeacherParticipantId = ref<string | null>(null)

  // 初始化健壮性管理器
  const errorHandler = useErrorHandler()
  const resourceManager = useResourceManager()
  const loadingState = useLoadingState()
  const retryMechanism = useRetryMechanism()
  // 本地 VideoPanel 引用（用于在本地轨道可用时附加本地视频）
  const videoPanelRef = ref<any>(null)

  const registerVideoPanel = (panel: any) => {
    videoPanelRef.value = panel
  }

  const unregisterVideoPanel = () => {
    videoPanelRef.value = null
  }

  const attachRemoteVideoWithRetry = (participantId: string, track: Track) => {
    const panel = videoPanelRef.value?.value ?? videoPanelRef.value
    if (!panel?.attachRemoteVideo) {
      return
    }
    nextTick(() => {
      panel.attachRemoteVideo(participantId, track)
      setTimeout(() => panel.attachRemoteVideo(participantId, track), 300)
      setTimeout(() => panel.attachRemoteVideo(participantId, track), 800)
    })
  }

  // 初始化业务逻辑
  const connection = useLiveConnection()
  const media = useMediaDevices(connection.room as Ref<import('livekit-client').Room | null>)
  const chat = useChatMessages()
  const recording = useRecording()
  const realtime = useLiveRealtime()

  // 计算属性
  const currentUserRole = computed<LiveRoomRoleEnum>(() => {
    if (userStore.teacherInfo) {
      return LiveRoomRoleEnum.TEACHER
    }
    if (userStore.roles.some((role) => role.roleKey === 'ASSISTANT')) {
      return LiveRoomRoleEnum.ASSISTANT
    }
    return LiveRoomRoleEnum.STUDENT
  })

  const connectionStateLabel = computed(() => connection.connectionStateLabel.value || '')
  const connectionError = computed(() => connection.connectionError.value || null)
  const connectionIsConnected = computed(() => connection.isConnected.value)
  const connectionConnecting = computed(() => connection.connecting.value)
  const cameraEnabled = computed(() => media.cameraEnabled.value)
  const microphoneEnabled = computed(() => media.microphoneEnabled.value)
  const recordingLoading = computed(() => recording.recordingLoading.value)
  const chatMessages = computed(() => {
    // 确保返回数组类型
    const msgs = chat.messages
    return Array.isArray(msgs) ? msgs : []
  })
  const chatOnlineCount = computed(() => {
    // 优先使用后端报告的成员数，与直播上方人数保持一致
    if (backendMemberCount.value > 0) {
      return backendMemberCount.value
    }

    // 其次使用SSE推送的实时成员数
    const realtimeCount = realtime.membersCount.value
    if (typeof realtimeCount === 'number' && realtimeCount >= 0) {
      return realtimeCount
    }

    // 回退到LiveKit计算（用于兼容性）
    return onlineCount.value
  })

  // 活跃视频数量（用于布局优化）
  const activeVideoCount = computed(() => {
    const remoteVideoCount = remoteParticipants.value.filter(p => p.videoTrack).length
    const localVideoEnabled = media.cameraEnabled.value
    return remoteVideoCount + (localVideoEnabled ? 1 : 0)
  })
  const speakerVolumeValue = computed(() => speakerVolume.value ?? 100)
  const canShowRecording = computed(() => {
    return currentUserRole.value === LiveRoomRoleEnum.TEACHER ||
           currentUserRole.value === LiveRoomRoleEnum.ASSISTANT
  })

  const activeMainParticipantId = computed(() => {
    if (layoutMode.value !== 'speaker') {
      return null
    }
    if (selectedMainParticipantId.value === 'local') {
      return 'local'
    }
    if (selectedMainParticipantId.value) {
      const exists = remoteParticipants.value.some(participant => {
        return participant.participantId === selectedMainParticipantId.value && participant.videoTrack
      })
      if (exists) {
        return selectedMainParticipantId.value
      }
    }
    // 优先选择第一个进入的老师
    if (firstTeacherParticipantId.value) {
      const firstTeacher = remoteParticipants.value.find(participant =>
        participant.participantId === firstTeacherParticipantId.value && participant.videoTrack
      )
      if (firstTeacher) {
        return firstTeacher.participantId
      }
    }
    if (currentUserRole.value === LiveRoomRoleEnum.TEACHER || currentUserRole.value === LiveRoomRoleEnum.ASSISTANT) {
      return 'local'
    }
    const fallback = remoteParticipants.value.find(participant => participant.videoTrack)
    return fallback ? fallback.participantId : 'local'
  })

  // 加载房间信息
  const loadRoomInfo = async (): Promise<void> => {
    const res = await liveApi.getLiveRoomById(roomId)
    if (res?.data) {
      roomInfo.value = res.data
    }
  }

  // 初始化
  const initialize = async (): Promise<void> => {
    await loadRoomInfo()
    await chat.loadHistoryMessages(roomId)

    // 检查 props 或路由参数中是否有 token，直接尝试加入
    const queryToken = route.query.token as string
    const providedToken = tokenProp ?? queryToken ?? null
    const querySessionId = route.query.sessionId as string
    if (querySessionId) {
      sessionId.value = querySessionId
    } else {
      const storedSessionId = window.sessionStorage.getItem(`live:session:${roomId}`)
      sessionId.value = storedSessionId || null
    }

    // 启动SSE实时连接
    await realtime.connect(roomId, null)

    // 连接逻辑
    const connectWithRetry = async (token?: string) => {
      loadingState.setLoading('connection', true, t('live.common.connectingRoom'))

      try {
        await retryMechanism.retry(
          () => connection.connect(roomInfo.value, currentUserRole.value, token, sessionId.value),
          {
            maxRetries: 3,
            baseDelay: 2000,
            retryCondition: (error) => retryMechanism.isRetryableError(error),
            onRetry: (attempt, _error) => {
              loadingState.setLoading('connection', true, t('live.common.retryingConnection', { attempt, total: 3 }))
            }
          }
        )

        loadingState.setLoading('connection', false)

        // 设置实时消息监听并停止轮询（已连接则使用实时）
        if (connection.room.value) {
          chat.setupRealtimeMessages(connection.room.value)
          chat.stopPolling()
        }

        const latestSessionId = sessionId.value
        if (latestSessionId) {
          window.sessionStorage.setItem(`live:session:${roomId}`, latestSessionId)
        }

        // 连接成功后尝试附加本地视频轨道（如果存在）
        const tryAttachLocalVideo = async (forceDirectAttach = false) => {
          const currentRoom = connection.room.value
          if (!currentRoom) {
            return
          }

          // 尝试从 localParticipant 的视频 publication 中找到 track（兼容多种命名）
          const localParticipant: any = (currentRoom as any).localParticipant
          if (!localParticipant) {
            return
          }

          // 收集可能的 publication/track 容器，兼容不同 livekit-client 版本 API
          const pubs: any[] = []
          if (localParticipant.videoTrackPublications && typeof localParticipant.videoTrackPublications.values === 'function') {
            pubs.push(...Array.from(localParticipant.videoTrackPublications.values()))
          }
          if (typeof localParticipant.getTrackPublications === 'function') {
            const mp = localParticipant.getTrackPublications()
            if (mp && typeof mp.values === 'function') pubs.push(...Array.from(mp.values()))
          }
          if (localParticipant.videoTracks && typeof localParticipant.videoTracks.values === 'function') {
            pubs.push(...Array.from(localParticipant.videoTracks.values()))
          }

          // 有些实现直接把 track 放在集合里，有些放在 publication.track 中，逐一检查
          for (const pub of pubs) {
            const track = pub && (pub.track || pub)
            if (!track) continue
            if (track.kind === Track.Kind.Video) {
              // 支持 panel 是 ref 或 直接对象
              if (videoPanelRef.value) {
                const panel = videoPanelRef.value?.value ?? videoPanelRef.value
                panel?.attachLocalVideo?.(track)
                return
              }

              // 回退：如果 panel 未注册，尝试直接附加到页面上的本地 video 元素（避免时序导致无法 attach）
              const els = Array.from(document.querySelectorAll('.video-panel .local-video video')) as HTMLVideoElement[]

              for (const el of els) {
                if (!el) continue
                // LiveKit track 支持 attach
                if (typeof (track as any).attach === 'function') {
                  (track as any).attach(el)
                } else if (track instanceof MediaStream) {
                  el.srcObject = track
                } else if (typeof (track as any).kind === 'string') {
                  const ms = new MediaStream([track as any])
                  el.srcObject = ms
                } else if ((track as any).mediaStream instanceof MediaStream) {
                  el.srcObject = (track as any).mediaStream
                } else if ((track as any).stream instanceof MediaStream) {
                  el.srcObject = (track as any).stream
                }

                // 解除 autoplay 限制并尝试播放
                el.muted = true
                el.play?.()
                return
              }
            }
          }

          // 如果 forceDirectAttach 为 true 或者没有找到 LiveKit 轨道，尝试直接 getUserMedia
          if (forceDirectAttach || pubs.length === 0) {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: false
            })

            const els = Array.from(document.querySelectorAll('.video-panel .local-video video')) as HTMLVideoElement[]

            els.forEach(el => {
              if (el) {
                el.srcObject = stream
                el.muted = true
                el.play?.()
              }
            })

            return
          }
          return
        }

        // 重试机制：尝试多次附加本地视频以避免时序问题
        let attachSuccess = false
        for (let i = 0; i < 10; i++) {
          // eslint-disable-next-line no-console
          console.log(`尝试附加本地视频 (第 ${i + 1} 次)`)
          await tryAttachLocalVideo()
          await new Promise(resolve => setTimeout(resolve, 500))

          // 检查是否附加成功
          const els = Array.from(document.querySelectorAll('.video-panel .local-video video')) as HTMLVideoElement[]
          if (els.some(el => el.srcObject && el.readyState >= 2)) {
            // eslint-disable-next-line no-console
            console.log('检测到视频附加成功')
            attachSuccess = true
            break
          }
        }

        // 如果前面的尝试都失败了，强制使用直接 getUserMedia
        if (!attachSuccess) {
          // eslint-disable-next-line no-console
          console.log('LiveKit 轨道附加失败，启用强制直接附加模式')
          setTimeout(async () => {
            await tryAttachLocalVideo(true)
          }, 1000)
        }

        // 额外的延迟附加，确保组件完全挂载
        setTimeout(async () => {
          await tryAttachLocalVideo()
        }, 2000)

        // 如果LiveKit附加失败，使用直接getUserMedia作为回退方案
        setTimeout(async () => {
          const videoElements = document.querySelectorAll('.video-panel .local-video video')
          let hasVideo = false

          Array.from(videoElements).forEach((video) => {
            const videoEl = video as HTMLVideoElement
            if (videoEl.srcObject || videoEl.videoWidth > 0 || videoEl.videoHeight > 0) {
              hasVideo = true
            }
          })

          if (!hasVideo) {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: false
            })

            Array.from(videoElements).forEach((video) => {
              const videoEl = video as HTMLVideoElement
              videoEl.srcObject = stream
              videoEl.muted = true
              videoEl.play()
            })
          }
        }, 5000)
      } catch (error: any) {
        loadingState.setLoading('connection', false)
        errorHandler.handleError(error, t('live.common.connectionContext'), {
          allowRetry: true,
          onRetry: () => connectWithRetry(token)
        })

        // 连接失败时启用降级模式 - 启动消息轮询
        chat.startPolling(roomId)
      }
    }

    if (providedToken) {
      // 有token时直接加入直播
      setTimeout(() => connectWithRetry(providedToken), 150)
    } else {
      // 没有token时尝试自动获取并加入
      setTimeout(() => connectWithRetry(), 150)
    }
  }

  // 处理离开房间
  const handleLeave = async (): Promise<void> => {
    loadingState.setLoading('disconnect', true, t('live.common.disconnecting'))

    await connection.disconnect()

    // 断开由 connection.disconnect() 负责资源清理，避免重复调用
    // 启动聊天轮询以保证离开后的消息仍可见
    chat.startPolling(roomId)

    const currentSessionId = sessionId.value
    if (currentSessionId) {
      const payload = liveApi.getDefaultLiveRoomSessionDTO()
      payload.roomId = roomId
      payload.sessionId = currentSessionId
      liveApi.leaveLiveRoom(payload)
    }

    loadingState.setLoading('disconnect', false)
    // 与页面顶部返回按钮一致：离开后返回上一页（例如 classroom3d）
    try {
      router.back()
    } catch (e) {
      // ignore navigation errors silently
    }

    // 如果 router.back 无法将用户带出直播页，尝试回退到 classroom 或 dashboard 作为兜底
    setTimeout(() => {
      const current = router.currentRoute.value
      if (current && (current.name === 'LiveRoom' || current.path.includes('/live/room/'))) {
        const courseId = (route.params as any).courseId || (route.query as any).courseId
        const courseRecordId = (route.params as any).courseRecordId || (route.query as any).courseRecordId
        if (courseId && courseRecordId) {
          router.push({ name: 'Classroom3D', params: { courseId, courseRecordId } })
        } else {
          router.push({ name: 'Dashboard' })
        }
      }
    }, 200)
  }

  const handleSendMessage = async (content: string): Promise<void> => {
    await chat.sendMessage(content, connection.room.value, roomId)
  }

  const handleToggleCamera = async (): Promise<void> => {
    loadingState.setLoading('camera', true, t('live.common.switchingCamera'))

    await media.toggleCamera()

    loadingState.setLoading('camera', false)
  }

  const handleToggleMicrophone = async (): Promise<void> => {
    loadingState.setLoading('microphone', true, t('live.common.switchingMicrophone'))

    await media.toggleMicrophone()

    loadingState.setLoading('microphone', false)
  }

  const handleToggleRecording = async (): Promise<void> => {
    const action = recording.isRecording ? t('live.common.recordingStop') : t('live.common.recordingStart')
    loadingState.setLoading('recording', true, t('live.common.recordingInProgress', { action }))

    await recording.toggleRecording(roomInfo.value, currentUserRole.value)

    loadingState.setLoading('recording', false)
  }

  const handleSpeakerVolumeChange = (value: number): void => {
    speakerVolume.value = value
  }

  const handleSelectMain = (participantId: string): void => {
    if (layoutMode.value !== 'speaker') {
      return
    }
    selectedMainParticipantId.value = participantId
  }

  const handleToggleLayoutMode = (): void => {
    layoutMode.value = layoutMode.value === 'speaker' ? 'grid' : 'speaker'
    selectedMainParticipantId.value = null
  }

  const handleToggleFullscreen = (): void => {
    isFullscreen.value = !isFullscreen.value
  }

  const handleToggleChatCollapse = (): void => {
    isChatCollapsed.value = !isChatCollapsed.value
    if (isChatCollapsed.value) {
      unreadMessageCount.value = 0
    }
  }
 
  // 将 VideoPanel 注册方法暴露给外部（Provider）
  // 这样父组件可以在挂载后注册 panel 引用
  // registerVideoPanel(panelRef) / unregisterVideoPanel()

  // 监听实时消息
  watch(
    () => realtime.messages.value,
    (newMessages, oldMessages) => {
      if (newMessages.length > oldMessages.length) {
        // 处理新增的消息
        const latestMessage = newMessages[newMessages.length - 1]
        handleRealtimeMessage(latestMessage)
      }
    },
    { deep: true }
  )

  // 处理实时消息
  const handleRealtimeMessage = (message: any) => {
    const eventType = message.event || message.type

    switch (eventType) {
      case 'chat_message':
        // 处理SSE推送的聊天消息
        if (message.data) {
          const chatMessage = {
            id: message.data.id || `${Date.now()}-${Math.random()}`,
            sender: message.data.sender || t('live.room.unknown'),
            content: message.data.content || '',
            timestamp: message.data.sendTime ? new Date(message.data.sendTime).toLocaleTimeString() : new Date().toLocaleTimeString(),
            isOwn: false // SSE推送的消息默认不是自己的
          }

          // 使用chat composable的addMessage方法添加消息
          chat.addMessage(chatMessage)
        }
        break
      case 'members':
        // 更新后端报告的成员数量
        if (message.data && typeof message.data.membersCount === 'number') {
          backendMemberCount.value = message.data.membersCount
        }
        break
      // 可以在这里添加其他事件类型的处理
    }
  }

  // 同步参与者已有轨道（用于首次加入房间或重连）
  const syncExistingParticipantTracks = (participant: RemoteParticipant) => {
    const displayName = (participant.identity) || participant.sid
    const participantRole = (() => {
      if (participant.metadata) {
        const meta = JSON.parse(participant.metadata)
        return meta.role || null
      }
      return null
    })()

    const videoPubs = Array.from(participant.videoTrackPublications.values()) as RemoteTrackPublication[]
    videoPubs.forEach((pub) => {
      if (pub.track && pub.track.kind === Track.Kind.Video) {
        const existingIndex = remoteParticipants.value.findIndex(p => p.participantId === participant.identity)
        if (existingIndex >= 0) {
          remoteParticipants.value[existingIndex] = {
            ...remoteParticipants.value[existingIndex],
            participantId: participant.identity,
            displayName,
            role: participantRole,
            videoTrack: pub.track,
          }
        } else {
          remoteParticipants.value.push({
            participantId: participant.identity,
            displayName,
            role: participantRole,
            videoTrack: pub.track,
            audioTrack: null
          })
        }
      }
    })

    const audioPubs = Array.from(participant.audioTrackPublications.values()) as RemoteTrackPublication[]
    audioPubs.forEach((pub) => {
      if (pub.track && pub.track.kind === Track.Kind.Audio) {
        const existingIndex = remoteParticipants.value.findIndex(p => p.participantId === participant.identity)
        if (existingIndex >= 0) {
          remoteParticipants.value[existingIndex] = {
            ...remoteParticipants.value[existingIndex],
            participantId: participant.identity,
            displayName,
            role: participantRole,
            audioTrack: pub.track
          }
        } else {
          remoteParticipants.value.push({
            participantId: participant.identity,
            displayName,
            role: participantRole,
            videoTrack: null,
            audioTrack: pub.track
          })
        }
      }
    })
  }

  // 监听 LiveKit Room 的参与者与轨道事件，保持 remoteParticipants 同步
  watch(
    () => connection.room.value,
    (currentRoom) => {
      if (!currentRoom) return

      // 房间连接成功时，主动从后端获取在线人数（确保数据同步）
      if (roomId) {
        liveApi.getRoomMemberCount(roomId).then(result => {
          backendMemberCount.value = result.data
        })
      }

      // 同步已有参与者轨道
      currentRoom.remoteParticipants.forEach((participant) => {
        syncExistingParticipantTracks(participant)
      })

      // 订阅事件
      resourceManager.registerEventListener(currentRoom, RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
        syncExistingParticipantTracks(participant)
      })

      resourceManager.registerEventListener(currentRoom, RoomEvent.TrackSubscribed, (track: Track, _publication: RemoteTrackPublication, participant: RemoteParticipant) => {
        const participantId = participant.identity
        const displayName = participantId
        const existingIndex = remoteParticipants.value.findIndex(p => p.participantId === participantId)

        if (track.kind === Track.Kind.Video) {
          if (existingIndex >= 0) {
            remoteParticipants.value[existingIndex] = {
              ...remoteParticipants.value[existingIndex],
              participantId,
              displayName,
              videoTrack: track
            }
          } else {
            remoteParticipants.value.push({
              participantId,
              displayName,
              role: null,
              videoTrack: track,
              audioTrack: null
            })
          }
          attachRemoteVideoWithRetry(participantId, track)
        }
        if (track.kind === Track.Kind.Audio) {
          if (existingIndex >= 0) {
            remoteParticipants.value[existingIndex] = {
              ...remoteParticipants.value[existingIndex],
              participantId,
              displayName,
              audioTrack: track
            }
          }
        }
      })

      resourceManager.registerEventListener(currentRoom, RoomEvent.TrackUnsubscribed, (track: Track, _pub: RemoteTrackPublication, participant: RemoteParticipant) => {
        const idx = remoteParticipants.value.findIndex(p => p.participantId === participant.identity)
        if (idx >= 0) {
          const existing = remoteParticipants.value[idx]
          if (track.kind === Track.Kind.Video) {
            if (existing.audioTrack) {
              remoteParticipants.value[idx] = { ...existing, videoTrack: null }
            } else {
              remoteParticipants.value.splice(idx, 1)
            }
          } else if (track.kind === Track.Kind.Audio) {
            if (existing.videoTrack) {
              remoteParticipants.value[idx] = { ...existing, audioTrack: null }
            } else {
              remoteParticipants.value.splice(idx, 1)
            }
          }
        }
      })

      resourceManager.registerEventListener(currentRoom, RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => {
        const index = remoteParticipants.value.findIndex(p => p.participantId === participant.identity)
        if (index >= 0) remoteParticipants.value.splice(index, 1)
      })
    }
  )

  // 清理资源
  const cleanup = (): void => {
    realtime.disconnect()
    chat.stopPolling()
    firstTeacherParticipantId.value = null
  }

  return {
    // 状态
    roomInfo,
    connection,
    remoteParticipants,
    onlineCount,
    isFullscreen,
    isChatCollapsed,
    unreadMessageCount,
    speakerVolume,
    sessionId,
    layoutMode,
    selectedMainParticipantId,
    firstTeacherParticipantId,

    // 加载状态
    loadingState,

    // 录制相关
    recording,

    // 计算属性
    currentUserRole,
    connectionStateLabel,
    connectionError,
    connectionIsConnected,
    connectionConnecting,
    cameraEnabled,
    microphoneEnabled,
    recordingLoading,
    chatMessages,
    chatOnlineCount,
    activeVideoCount,
    speakerVolumeValue,
    canShowRecording,
    activeMainParticipantId,

    // 方法
    initialize,
    handleLeave,
    handleSendMessage,
    handleToggleCamera,
    handleToggleMicrophone,
    handleToggleRecording,
    handleSpeakerVolumeChange,
    handleSelectMain,
    handleToggleLayoutMode,
    handleToggleFullscreen,
    handleToggleChatCollapse,
    registerVideoPanel,
    unregisterVideoPanel,
    cleanup
  }
}
