import { computed, ref, type Ref, type ComputedRef, watch, nextTick } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useMessage, useNotification } from 'naive-ui'
import type { LiveRoomVO, RemoteParticipantMedia, HandRaiseState } from '@/types/live'
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
import { useSpeakingDetectorStore } from '@/stores/speakingDetector'
import type { SpeakingDetectorStore } from '@/stores/speakingDetector'
import * as liveApi from '@/api/live'
import { RoomEvent, Track, type Room, type RemoteParticipant, type RemoteTrackPublication } from 'livekit-client'
import { useLiveSpeakingStore } from '@/stores/liveSpeaking'

// 布局模式类型定义
export type LayoutMode = 'speaker' | 'grid'

// 布局持久化 key
const LAYOUT_MODE_STORAGE_KEY = 'liveRoomLayoutMode'

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
  maxMediaParticipants: number
  activeMediaParticipantCount: Ref<number>
  isMediaLimitReached: Ref<boolean>
  speakerVolumeValue: Ref<number>
  canShowRecording: Ref<boolean>
  activeMainParticipantId: Ref<string | null>
  localVideoTrack: Ref<any | null>

  // 说话指示器状态
  speakingStates: Map<string, { isSpeaking: boolean; volumeLevel: number }>
  activeSpeaker: { participantId: string; volumeLevel: number; lastSpeakingAt: number } | null
  sortedSpeakingIds: ComputedRef<string[]>
  localParticipantIdentity: ComputedRef<string>

  // 说话检测器实例
  speakingDetector: SpeakingDetectorStore

  // 举手相关状态（老师端使用）
  handRaiseStates: Ref<HandRaiseState[]>
  isHandRaised: Ref<boolean>
  handRaiseCooldown: Ref<number>

  // 加载状态
  loadingState: any

  // 录制相关
  recording: any

  // 方法
  initialize: () => Promise<void>
  restoreSession: (existingRoom: Room, existingSessionId: string | null, roomId: string) => Promise<void>
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
  handlePageUnload: () => void
  handleRaiseHand: () => void
  cleanup: (keepDetector?: boolean) => void
  registerVideoPanel?: (panel: any) => void
  unregisterVideoPanel?: () => void
}

export const useLiveRoom = (roomIdProp?: string | null, tokenProp?: string | null): LiveRoomResult => {
  const { t } = useI18n()
  const route = useRoute()
  const router = useRouter()
  const userStore = useUserStore()
  const message = useMessage()
  const notification = useNotification()

  // 基本状态
  const roomId = roomIdProp ?? (route.params.roomId as string)
  const roomInfo = ref<LiveRoomVO | null>(null)
  const remoteParticipants = ref<RemoteParticipantMedia[]>([])
  // 后端报告的在线人数（通过API和SSE获取）
  const backendMemberCount = ref<number>(0)

  // 在线人数，优先使用后端数据，其次使用SSE/后端提供的实时成员数
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

    // 降级到LiveKit计算（用于兼容性）
    if (!connection.room.value) return 0
    const participantTotal = connection.room.value.remoteParticipants ? connection.room.value.remoteParticipants.size : 0
    return participantTotal + (connection.isConnected.value ? 1 : 0)
  })
  const isFullscreen = ref(false)
  const isChatCollapsed = ref(false)
  const unreadMessageCount = ref(0)
  const speakerVolume = ref<number | null>(null)
  const sessionId = ref<string | null>(null)
  const sessionStorageKey = `live:session:${roomId}`
  const localStorageSessionKey = `live:last-session:${roomId}`

  // 举手相关状态
  const handRaiseStates = ref<HandRaiseState[]>([])
  const isHandRaised = ref(false)
  const handRaiseCooldown = ref(0)
  const handRaiseTimerMap = new Map<string, number>()
  const HAND_RAISE_DURATION = 10 // 举手持续显示时间（秒）

  const readStoredSessionId = (): string | null => {
    const fromSessionStorage = window.sessionStorage.getItem(sessionStorageKey)
    if (fromSessionStorage) return fromSessionStorage
    const fromLocalStorage = window.localStorage.getItem(localStorageSessionKey)
    return fromLocalStorage || null
  }

  const persistSessionId = (id: string | null): void => {
    if (!id) return
    window.sessionStorage.setItem(sessionStorageKey, id)
    window.localStorage.setItem(localStorageSessionKey, id)
  }

  const clearStoredSessionId = (): void => {
    window.sessionStorage.removeItem(sessionStorageKey)
    window.localStorage.removeItem(localStorageSessionKey)
  }

  const releaseServerSession = (useUnloadTransport = false): void => {
    const currentSessionId = sessionId.value || connection.sessionId.value || readStoredSessionId()
    if (!currentSessionId || !roomId) {
      clearStoredSessionId()
      sessionId.value = null
      return
    }

    const payload = liveApi.getDefaultLiveRoomSessionDTO()
    payload.roomId = roomId
    payload.sessionId = currentSessionId

    if (useUnloadTransport) {
      liveApi.leaveLiveRoomOnPageUnload(payload)
    } else {
      void liveApi.leaveLiveRoom(payload).catch(() => undefined)
    }

    clearStoredSessionId()
    sessionId.value = null
  }

  // 从 localStorage 读取持久化的布局模式，如果没有则使用默认值 'speaker'
  const getInitialLayoutMode = (): LayoutMode => {
    const stored = localStorage.getItem(LAYOUT_MODE_STORAGE_KEY)
    if (stored === 'speaker' || stored === 'grid') {
      return stored as LayoutMode
    }
    return 'speaker'
  }

  const layoutMode = ref<LayoutMode>(getInitialLayoutMode())
  const selectedMainParticipantId = ref<string | null>(null)
  const firstTeacherParticipantId = ref<string | null>(null)

  // 初始化错误处理器
  const errorHandler = useErrorHandler()
  const resourceManager = useResourceManager()
  const loadingState = useLoadingState()
  const retryMechanism = useRetryMechanism()
  // 本地 VideoPanel 引用（用于在本地视频通道可用时附加本地视频）
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

  const attachRemoteAudioWithRetry = (participantId: string, track: Track) => {
    const panel = videoPanelRef.value?.value ?? videoPanelRef.value
    if (!panel?.attachRemoteAudio) {
      return
    }
    nextTick(() => {
      panel.attachRemoteAudio(participantId, track)
      setTimeout(() => panel.attachRemoteAudio(participantId, track), 300)
      setTimeout(() => panel.attachRemoteAudio(participantId, track), 800)
    })
  }

  // 初始化业务逻辑
  const connection = useLiveConnection()
  const media = useMediaDevices(connection.room as Ref<import('livekit-client').Room | null>)
  const chat = useChatMessages()
  const recording = useRecording()
  const realtime = useLiveRealtime()
  // 使用全局 detector store
  const speakingDetectorStore = useSpeakingDetectorStore()
  // 保留本地引用以保持类型兼容（注意：detector 可能尚未初始化，需要通过 store 访问）
  const speakingDetector = speakingDetectorStore
  const speakingStore = useLiveSpeakingStore()

  const resolveStudentIdFromMetadata = (metadata: string | null | undefined): string | null => {
    if (!metadata) return null

    try {
      const meta = JSON.parse(metadata)
      const candidates = [
        meta?.studentId,
        meta?.student?.id,
        meta?.studentInfo?.id,
        meta?.profile?.studentId
      ]

      for (const candidate of candidates) {
        if (candidate !== null && candidate !== undefined && String(candidate).trim().length > 0) {
          return String(candidate)
        }
      }
    } catch {
      // ignore invalid metadata payloads
    }

    return null
  }

  const bindParticipantStudentMapping = (participantId: string, metadata?: string | null): void => {
    const studentId = resolveStudentIdFromMetadata(metadata)
    if (studentId) {
      speakingStore.setParticipantStudentMapping(participantId, studentId)
    }
  }

  const bindLocalParticipantStudentMapping = (room: Room): void => {
    const localIdentity = room.localParticipant?.identity
    if (!localIdentity) return

    const localStudentId = userStore.studentInfo?.id
    const localTeacherId = userStore.teacherInfo?.id
    const fallbackUserId = userStore.userInfo?.id
    const mappedId = localStudentId || localTeacherId || fallbackUserId

    if (mappedId) {
      speakingStore.setParticipantStudentMapping(localIdentity, String(mappedId))
    }
  }

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
    const msgs = chat.messages.value
    return Array.isArray(msgs) ? msgs : []
  })
  const chatOnlineCount = computed(() => {
    // 优先使用后端报告的成员数，与直播上方人数保持一致
    if (backendMemberCount.value > 0) {
      return backendMemberCount.value
    }

    // 其次使用SSE发送的实时成员数
    const realtimeCount = realtime.membersCount.value
    if (typeof realtimeCount === 'number' && realtimeCount >= 0) {
      return realtimeCount
    }

    // 降级到LiveKit计算（用于兼容性）
    return onlineCount.value
  })

  // 活跃视频数量（用于布局优化）
  const activeVideoCount = computed(() => {
    const remoteVideoCount = remoteParticipants.value.filter(p => p.videoTrack).length
    const localVideoEnabled = media.cameraEnabled.value
    return remoteVideoCount + (localVideoEnabled ? 1 : 0)
  })

  // 开启摄像头或麦克风的参与人数（最多10人限制）
  const MAX_MEDIA_PARTICIPANTS = 10
  const activeMediaParticipantCount = computed(() => {
    let count = 0

    // 统计本地用户
    if (media.cameraEnabled.value || media.microphoneEnabled.value) {
      count++
    }

    // 统计远程用户
    const currentRoom = connection.room.value
    if (currentRoom) {
      // 遍历远程参与者
      currentRoom.remoteParticipants.forEach((participant) => {
        const hasVideo = Array.from(participant.videoTrackPublications.values()).some(
          (pub) => pub.track && !pub.isMuted
        )
        const hasAudio = Array.from(participant.audioTrackPublications.values()).some(
          (pub) => pub.track && !pub.isMuted
        )
        if (hasVideo || hasAudio) {
          count++
        }
      })
    }

    return count
  })

  // 是否已达到媒体人数限制
  const isMediaLimitReached = computed(() => {
    return activeMediaParticipantCount.value >= MAX_MEDIA_PARTICIPANTS
  })
  const speakerVolumeValue = computed(() => speakerVolume.value ?? 100)
  const canShowRecording = computed(() => {
    return currentUserRole.value === LiveRoomRoleEnum.TEACHER ||
           currentUserRole.value === LiveRoomRoleEnum.ASSISTANT
  })

  const localVideoTrack = computed(() => {
    // 依赖摄像头状态以触发重新计算
    void media.cameraEnabled.value
    const currentRoom = connection.room.value
    if (!currentRoom?.localParticipant) return null
    const pubs = Array.from(currentRoom.localParticipant.videoTrackPublications.values())
    const pub = pubs.find(p => p.track && p.track.kind === Track.Kind.Video)
    return pub?.track ?? null
  })

  // 本地参与者的 identity（用于说话指示器）
  const localParticipantIdentity = computed(() => {
    const currentRoom = connection.room.value
    if (!currentRoom?.localParticipant) return 'local'
    return currentRoom.localParticipant.identity || 'local'
  })

  watch(
    () => [
      connection.room.value?.localParticipant?.identity || null,
      userStore.studentInfo?.id || null,
      userStore.teacherInfo?.id || null,
      userStore.userInfo?.id || null
    ] as const,
    ([localIdentity, studentId, teacherId, userId]) => {
      if (!localIdentity) return
      const mappedId = studentId || teacherId || userId
      if (mappedId) {
        speakingStore.setParticipantStudentMapping(localIdentity, String(mappedId))
      }
    },
    { immediate: true }
  )

  watch(
    () => connection.sessionId.value,
    (latestSessionId) => {
      if (!latestSessionId || sessionId.value === latestSessionId) {
        return
      }
      sessionId.value = latestSessionId
      persistSessionId(latestSessionId)
    },
    { immediate: true }
  )

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
    // 优先选择第一个进场的老师
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

  // 恢复会话（从 PiP 恢复时使用）
  const restoreSession = async (existingRoom: Room, existingSessionId: string | null, existingRoomId: string): Promise<void> => {
    // 加载房间信息
    await loadRoomInfo()
    // 设置 sessionId
    sessionId.value = existingSessionId
    persistSessionId(existingSessionId)

    // 启动SSE实时连接
    await realtime.connect(existingRoomId, null)

    // 恢复 LiveKit 连接
    connection.restoreConnection(existingRoom, existingSessionId, existingRoomId)

    // 设置聊天消息监听
    if (existingRoom) {
      chat.setupRealtimeMessages(existingRoom)
      chat.teardownSseListener()
    }

    // 同步已有参与者轨道
    existingRoom.remoteParticipants.forEach((participant: RemoteParticipant) => {
      syncExistingParticipantTracks(participant)
    })

    // 获取在线人数
    if (existingRoomId) {
      liveApi.getRoomMemberCount(existingRoomId).then(result => {
        backendMemberCount.value = result.data
      })
    }
  }

  // 初始化
  const initialize = async (): Promise<void> => {
    await loadRoomInfo()
    await chat.loadHistoryMessages(roomId)

    // 检查 props 或路由参数中是否有 token，直接尝试加 入
    const queryToken = route.query.token as string
    const providedToken = tokenProp ?? queryToken ?? null
    const querySessionId = route.query.sessionId as string
    if (querySessionId) {
      sessionId.value = querySessionId
      persistSessionId(querySessionId)
    } else {
      sessionId.value = readStoredSessionId()
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
            onRetry: (_attempt, _error) => {
              // 重试时不更新loading文本，避免显示错误提示给用户
              // 保持loading状态，但不改变文本
            }
          }
        )

        loadingState.setLoading('connection', false)

        // 设置实时消息监听并停止SSE（已连接则使用WebRTC DataChannel）
        if (connection.room.value) {
          chat.setupRealtimeMessages(connection.room.value)
          chat.teardownSseListener()
        }

        const latestSessionId = connection.sessionId.value || sessionId.value
        if (latestSessionId) {
          sessionId.value = latestSessionId
          persistSessionId(latestSessionId)
        }

        // 摄像头默认关闭，不需要尝试附加本地视频
        // 只有当用户手动开启摄像头时，才会在 toggleCamera() 中处理视频附加
      } catch (error: any) {
        loadingState.setLoading('connection', false)
        errorHandler.handleError(error, t('live.common.connectionContext'), {
          allowRetry: true,
          onRetry: () => connectWithRetry(token)
        })

        // 连接失败时启动降级方案 - 启动 SSE 监听
        chat.setupSseListener(roomId, undefined)
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

    const currentRoom = connection.room.value
    if (currentRoom) {
      chat.teardownRealtimeMessages(currentRoom)
    }

    await connection.disconnect()

    // 断开由 connection.disconnect() 负责资源清理，避免重复调用
    // 离开直播后停止 SSE 监听
    chat.teardownSseListener()

    releaseServerSession(false)

    loadingState.setLoading('disconnect', false)
    // 与页面顶部返回按钮一致：离开后返回上一页面（例如 classroom3d）
    try {
      router.back()
    } catch (e) {
      // ignore navigation errors silently
    }

    // 如果 router.back 无法将用户带出回退页，尝试回退到 classroom 或 dashboard 作为兜底
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

  const handlePageUnload = (): void => {
    releaseServerSession(true)
  }

  const handleSendMessage = async (content: string): Promise<void> => {
    await chat.sendMessage(content, connection.room.value, roomId)
  }

  const handleToggleCamera = async (): Promise<void> => {
    // 如果当前未开启摄像头，检查是否已达到人数限制
    if (!media.cameraEnabled.value && isMediaLimitReached.value) {
      loadingState.setLoading('camera', false)
      message.warning(
        t('live.room.mediaLimitReached', { max: MAX_MEDIA_PARTICIPANTS })
      )
      return
    }

    loadingState.setLoading('camera', true, t('live.common.switchingCamera'))

    await media.toggleCamera()

    loadingState.setLoading('camera', false)
  }

  const handleToggleMicrophone = async (): Promise<void> => {
    // 如果当前未开启麦克风，检查是否已达到人数限制
    if (!media.microphoneEnabled.value && isMediaLimitReached.value) {
      loadingState.setLoading('microphone', false)
      message.warning(
        t('live.room.mediaLimitReached', { max: MAX_MEDIA_PARTICIPANTS })
      )
      return
    }

    loadingState.setLoading('microphone', true, t('live.common.switchingMicrophone'))
    const wasEnabled = media.microphoneEnabled.value

    try {
      await media.toggleMicrophone()
      if (wasEnabled) {
        const localIdentity = connection.room.value?.localParticipant?.identity || 'local'
        speakingStore.updateSpeakingState(localIdentity, {
          isSpeaking: false,
          volumeLevel: 0,
          lastSpeakingAt: Date.now()
        })
      }
    } finally {
      loadingState.setLoading('microphone', false)
    }
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
    const newMode: LayoutMode = layoutMode.value === 'speaker' ? 'grid' : 'speaker'
    layoutMode.value = newMode
    selectedMainParticipantId.value = null

    // 持久化到 localStorage
    localStorage.setItem(LAYOUT_MODE_STORAGE_KEY, newMode)

    // 显示模式切换提示
    message.success(
      newMode === 'grid'
        ? t('live.room.layoutModeGrid') || '已切换到网格模式'
        : t('live.room.layoutModeSpeaker') || '已切换到演讲者模式'
    )
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

  // 举手相关方法
  /**
   * 学生举手
   */
  const handleRaiseHand = (): void => {
    // 如果正在冷却中，不能举手
    if (handRaiseCooldown.value > 0 || isHandRaised.value) {
      return
    }

    const currentRoom = connection.room.value
    if (!currentRoom) {
      return
    }

    // 获取当前用户信息
    const participantId = currentRoom.localParticipant?.identity || 'local'
    const participantName = userStore.userInfo?.nickName || participantId

    // 发送举手消息（通过 DataChannel 广播给房间内所有人）
    const payload = {
      type: 'hand_raise',
      participantId,
      participantName,
      timestamp: Date.now()
    }

    currentRoom.localParticipant.publishData(
      new TextEncoder().encode(JSON.stringify(payload)),
      { reliable: true }
    )

    // 设置本地举手状态和冷却
    isHandRaised.value = true
    handRaiseCooldown.value = HAND_RAISE_DURATION

    // 冷却倒计时
    const cooldownInterval = setInterval(() => {
      handRaiseCooldown.value--
      if (handRaiseCooldown.value <= 0) {
        clearInterval(cooldownInterval)
        isHandRaised.value = false
      }
    }, 1000)
  }

  /**
   * 处理收到的举手消息（老师端）
   */
  const handleHandRaiseMessage = (payload: {
    type: string
    participantId: string
    participantName: string
    timestamp: number
  }): void => {
    // 只有老师和助教能看到举手提示
    if (currentUserRole.value !== LiveRoomRoleEnum.TEACHER &&
        currentUserRole.value !== LiveRoomRoleEnum.ASSISTANT) {
      return
    }

    // 检查是否已经在举手列表中，避免重复显示
    const existingIndex = handRaiseStates.value.findIndex(
      state => state.participantId === payload.participantId
    )

    if (existingIndex < 0) {
      // 添加到举手列表
      handRaiseStates.value.push({
        participantId: payload.participantId,
        participantName: payload.participantName,
        raisedAt: payload.timestamp,
        remainingSeconds: HAND_RAISE_DURATION
      })

      // 使用 NNotification 显示举手提示，10秒后自动消失
      notification.warning({
        title: payload.participantName,
        content: t('live.room.handRaising'),
        duration: 10000,
        keepAliveOnHover: false
      })

      // 10秒后从列表中移除
      const timer = setTimeout(() => {
        const idx = handRaiseStates.value.findIndex(
          state => state.participantId === payload.participantId
        )
        if (idx >= 0) {
          handRaiseStates.value.splice(idx, 1)
        }
      }, HAND_RAISE_DURATION * 1000)

      handRaiseTimerMap.set(payload.participantId, timer as unknown as number)
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
        // 处理SSE发送的聊天消息
        if (message.data) {
          const chatMessage = {
            id: message.data.id || `${Date.now()}-${Math.random()}`,
            sender: message.data.sender || t('live.room.unknown'),
            content: message.data.content || '',
            timestamp: message.data.sendTime ? new Date(message.data.sendTime).toLocaleTimeString() : new Date().toLocaleTimeString(),
            isOwn: false // SSE发送的消息默认不是自己的
          }

          // 使用chat composable的 addMessage 方法添加消息
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
    const participantId = participant.identity
    const displayName = participantId || participant.sid

    // 解析 metadata 获取角色和学生信息
    const participantRole = (() => {
      if (participant.metadata) {
        try {
          const meta = JSON.parse(participant.metadata)
          return meta.role || null
        } catch (e) {
          return null
        }
      }
      return null
    })()

    // 建立 participantId -> studentId 映射（供教室页面使用）
    bindParticipantStudentMapping(participantId, participant.metadata)
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

  // 监听 LiveKit Room 的参与者与通道事件，保持 remoteParticipants 同步
  watch(
    () => connection.room.value,
    (currentRoom) => {
      if (!currentRoom) return

      // 房间连接成功后，主动从后端获取在线人数（确保数据同步）
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

         // 建立 participantId -> studentId 映射（供教室页面使用）
         bindParticipantStudentMapping(participantId, participant.metadata)
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
           } else {
             remoteParticipants.value.push({
               participantId,
               displayName,
               role: null,
               videoTrack: null,
               audioTrack: track
             })
           }
           attachRemoteAudioWithRetry(participantId, track)
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

      // 建立本地参与者的映射（participant.identity -> studentId）
      // 由于 LiveKit 服务器不允许更新 metadata，这里通过 userStore 直接建立映射
      bindLocalParticipantStudentMapping(currentRoom)

      // 启动说话检测（使用全局 detector store）
      speakingDetectorStore.connect(currentRoom)

      // 监听 DataChannel 消息（用于举手等实时通信）
      const dataMessageHandler = (data: Uint8Array) => {
        try {
          const text = new TextDecoder().decode(data)
          const payload = JSON.parse(text)

          if (payload?.type === 'hand_raise') {
            handleHandRaiseMessage(payload)
          }
        } catch (e) {
          // ignore parse errors
        }
      }
      currentRoom.on(RoomEvent.DataReceived, dataMessageHandler)
      ;(currentRoom as any).__hand_raise_handler = dataMessageHandler
    }
  )

  // 清理资源
  /**
   * 清理直播间资源
   * @param keepDetector - 是否保留说话检测器（进入 PiP 模式时设为 true）
   */
  const cleanup = (keepDetector = false): void => {
    const currentRoom = connection.room.value
    if (currentRoom) {
      chat.teardownRealtimeMessages(currentRoom)
    }
    if (connection.isConnected.value || connection.room.value) {
      void connection.disconnect()
    }
    releaseServerSession(false)
    realtime.disconnect()
    chat.teardownSseListener()
    firstTeacherParticipantId.value = null

    if (keepDetector) {
      // PiP 模式：只断开 LiveKit 连接，不断开 detector（保留给 Classroom3D 使用）
      // 注意：connection.disconnect() 会自动断开 detector 的事件监听
      // setInLiveRoom 状态由 detector 自行管理，不需要手动处理
    } else {
      // 非 PiP 模式：完全清理，包括断开 detector 和清空 store
      speakingDetectorStore.destroy()
    }
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
    maxMediaParticipants: MAX_MEDIA_PARTICIPANTS,
    activeMediaParticipantCount,
    isMediaLimitReached,
    speakerVolumeValue,
    canShowRecording,
    activeMainParticipantId,
    localVideoTrack,

    // 说话检测器
    speakingStates: speakingDetector.speakingStates,
    activeSpeaker: speakingDetector.activeSpeaker,
    sortedSpeakingIds: speakingDetector.sortedSpeakingIds as unknown as ComputedRef<string[]>,
    speakingDetector,
    localParticipantIdentity,

    // 举手相关
    handRaiseStates,
    isHandRaised,
    handRaiseCooldown,

    // 方法
    initialize,
    restoreSession,
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
    handlePageUnload,
    handleRaiseHand,
    registerVideoPanel,
    unregisterVideoPanel,
    cleanup
  }
}
