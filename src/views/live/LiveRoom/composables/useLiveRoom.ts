import { computed, ref, type Ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import type { LiveRoomVO, RemoteParticipantMedia } from '@/types/live'
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
  const userStore = useUserStore()

  // 基本状态
  const roomId = roomIdProp ?? (route.params.roomId as string)
  const roomInfo = ref<LiveRoomVO | null>(null)
  const remoteParticipants = ref<RemoteParticipantMedia[]>([])
  const onlineCount = ref(0)
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
    // 优先使用 SSE/后端提供的实时成员数（realtime.membersCount），其次使用 chat 组合函数提供的简化人数，最后回退到 RTC 的 onlineCount
    const realtimeCount = (realtime as any)?.membersCount?.value ?? null
    if (typeof realtimeCount === 'number' && realtimeCount >= 0) {
      return realtimeCount
    }

    const countFromChat = (chat.chatOnlineCount as any)?.value ?? null
    if (typeof countFromChat === 'number') {
      return countFromChat
    }

    return onlineCount.value
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

      return retryMechanism.retry(
        () => connection.connect(roomInfo.value, currentUserRole.value, token, sessionId.value),
        {
          maxRetries: 3,
          baseDelay: 2000,
          retryCondition: (error) => retryMechanism.isRetryableError(error),
          onRetry: (attempt, _error) => {
            loadingState.setLoading('connection', true, t('live.common.retryingConnection', { attempt, total: 3 }))
          }
        }
      ).then(() => {
        loadingState.setLoading('connection', false)

        // 设置实时消息监听
        if (connection.room.value) {
          chat.setupRealtimeMessages(connection.room.value)
        }

        const latestSessionId = sessionId.value
        if (latestSessionId) {
          window.sessionStorage.setItem(`live:session:${roomId}`, latestSessionId)
        }

        // 媒体设置将在用户点击媒体控制按钮时进行
      }, (error) => {
        loadingState.setLoading('connection', false)
        errorHandler.handleError(error, t('live.common.connectionContext'), {
          allowRetry: true,
          onRetry: () => connectWithRetry(token)
        })

        // 连接失败时启用降级模式 - 启动消息轮询
        chat.startPolling(roomId)
      })
      // 连接成功后尝试附加本地视频轨道（如果存在）
      const tryAttachLocalVideo = async (forceDirectAttach = false) => {
        try {
          const currentRoom = connection.room.value
          if (!currentRoom) {
            console.log('tryAttachLocalVideo: 房间不存在')
            return
          }

          // 尝试从 localParticipant 的视频 publication 中找到 track（兼容多种命名）
          const localParticipant: any = (currentRoom as any).localParticipant
          if (!localParticipant) {
            console.log('tryAttachLocalVideo: 本地参与者不存在')
            return
          }

          // 收集可能的 publication/track 容器，兼容不同 livekit-client 版本 API
          const pubs: any[] = []
          try {
            if (localParticipant.videoTrackPublications && typeof localParticipant.videoTrackPublications.values === 'function') {
              pubs.push(...Array.from(localParticipant.videoTrackPublications.values()))
            }
          } catch (e) {}
          try {
            if (typeof localParticipant.getTrackPublications === 'function') {
              const mp = localParticipant.getTrackPublications()
              if (mp && typeof mp.values === 'function') pubs.push(...Array.from(mp.values()))
            }
          } catch (e) {}
          try {
            if (localParticipant.videoTracks && typeof localParticipant.videoTracks.values === 'function') {
              pubs.push(...Array.from(localParticipant.videoTracks.values()))
            }
          } catch (e) {}

          console.log('tryAttachLocalVideo: 找到', pubs.length, '个轨道发布')

          // 有些实现直接把 track 放在集合里，有些放在 publication.track 中，逐一检查
          for (const pub of pubs) {
            const track = pub && (pub.track || pub)
            if (!track) continue
            try {
              if (track.kind === Track.Kind.Video) {
                console.log('tryAttachLocalVideo: 找到视频轨道，尝试附加:', track)

                // 支持 panel 是 ref 或 直接对象
                if (videoPanelRef.value) {
                  const panel = videoPanelRef.value?.value ?? videoPanelRef.value
                  console.log('tryAttachLocalVideo: 附加到 VideoPanel')
                  panel?.attachLocalVideo?.(track)
                  return
                }

                // 回退：如果 panel 未注册，尝试直接附加到页面上的本地 video 元素（避免时序导致无法 attach）
                try {
                  const els = Array.from(document.querySelectorAll('.video-panel .local-video video')) as HTMLVideoElement[]
                  console.log('tryAttachLocalVideo: VideoPanel 未注册，尝试直接附加到', els.length, '个元素')

                  for (const el of els) {
                    if (!el) continue
                    try {
                      console.log('tryAttachLocalVideo: 附加到元素:', el)

                      // LiveKit track 支持 attach
                      if (typeof (track as any).attach === 'function') {
                        (track as any).attach(el)
                        console.log('tryAttachLocalVideo: LiveKit attach 成功')
                      } else if (track instanceof MediaStream) {
                        el.srcObject = track
                        console.log('tryAttachLocalVideo: MediaStream attach 成功')
                      } else if (typeof (track as any).kind === 'string') {
                        try {
                          const ms = new MediaStream([track as any])
                          el.srcObject = ms
                          console.log('tryAttachLocalVideo: 新建 MediaStream attach 成功')
                        } catch (e) {
                          console.log('tryAttachLocalVideo: 新建 MediaStream 失败:', e)
                        }
                      } else if ((track as any).mediaStream instanceof MediaStream) {
                        el.srcObject = (track as any).mediaStream
                        console.log('tryAttachLocalVideo: mediaStream 属性 attach 成功')
                      } else if ((track as any).stream instanceof MediaStream) {
                        el.srcObject = (track as any).stream
                        console.log('tryAttachLocalVideo: stream 属性 attach 成功')
                      }

                      // 解除 autoplay 限制并尝试播放
                      el.muted = true
                      el.play?.().catch((e) => {
                        console.log('tryAttachLocalVideo: 播放失败:', e)
                      })
                      console.log('tryAttachLocalVideo: 附加完成')
                      return
                    } catch (e) {
                      console.log('tryAttachLocalVideo: 单个元素附加失败:', e)
                    }
                  }
                } catch (e) {
                  console.log('tryAttachLocalVideo: DOM 附加错误:', e)
                }
              }
            } catch (e) {
              console.log('tryAttachLocalVideo: 单个轨道错误:', e)
            }
          }

          console.log('tryAttachLocalVideo: 未找到合适的视频轨道')

          // 如果 forceDirectAttach 为 true 或者没有找到 LiveKit 轨道，尝试直接 getUserMedia
          if (forceDirectAttach || pubs.length === 0) {
            console.log('tryAttachLocalVideo: 尝试直接 getUserMedia 回退方案')
            try {
              const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: false
              })

              const els = Array.from(document.querySelectorAll('.video-panel .local-video video')) as HTMLVideoElement[]
              console.log('tryAttachLocalVideo: 直接附加到', els.length, '个元素')

              els.forEach(el => {
                if (el) {
                  el.srcObject = stream
                  el.muted = true
                  el.play?.().catch(e => console.log('tryAttachLocalVideo: 播放失败:', e))
                }
              })

              console.log('tryAttachLocalVideo: 直接 getUserMedia 附加成功')
              return
            } catch (directError) {
              console.log('tryAttachLocalVideo: 直接 getUserMedia 也失败:', directError)
            }
          }
        } catch (e) {
          console.log('tryAttachLocalVideo: 整体错误:', e)

          // 如果整体出错，也尝试直接 getUserMedia 回退
          try {
            console.log('tryAttachLocalVideo: 因错误尝试直接 getUserMedia 回退')
            const stream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: false
            })

            const els = Array.from(document.querySelectorAll('.video-panel .local-video video')) as HTMLVideoElement[]
            els.forEach(el => {
              if (el) {
                el.srcObject = stream
                el.muted = true
                el.play?.().catch(e => console.log('tryAttachLocalVideo: 回退播放失败:', e))
              }
            })
          } catch (fallbackError) {
            console.log('tryAttachLocalVideo: 回退方案也失败:', fallbackError)
          }
        }
        return
      }

      // 重试机制：尝试多次附加本地视频以避免时序问题
      let attachSuccess = false
      for (let i = 0; i < 10; i++) {
        console.log(`尝试附加本地视频 (第 ${i + 1} 次)`)
        await tryAttachLocalVideo()
        await new Promise(resolve => setTimeout(resolve, 500))

        // 检查是否附加成功
        const els = Array.from(document.querySelectorAll('.video-panel .local-video video')) as HTMLVideoElement[]
        if (els.some(el => el.srcObject && el.readyState >= 2)) {
          console.log('检测到视频附加成功')
          attachSuccess = true
          break
        }
      }

      // 如果前面的尝试都失败了，强制使用直接 getUserMedia
      if (!attachSuccess) {
        console.log('LiveKit 轨道附加失败，启用强制直接附加模式')
        setTimeout(async () => {
          await tryAttachLocalVideo(true)
        }, 1000)
      }

      // 额外的延迟附加，确保组件完全挂载
      setTimeout(async () => {
        console.log('执行延迟附加本地视频...')
        await tryAttachLocalVideo()
      }, 2000)

      // 如果LiveKit附加失败，使用直接getUserMedia作为回退方案
      setTimeout(async () => {
        console.log('检查LiveKit附加是否成功...')
        const videoElements = document.querySelectorAll('.video-panel .local-video video')
        let hasVideo = false

        Array.from(videoElements).forEach((video) => {
          const videoEl = video as HTMLVideoElement
          if (videoEl.srcObject || videoEl.videoWidth > 0 || videoEl.videoHeight > 0) {
            hasVideo = true
          }
        })

        if (!hasVideo) {
          console.log('LiveKit附加失败，使用直接getUserMedia回退方案...')
          try {
            const stream = await navigator.mediaDevices.getUserMedia({
              video: true,
              audio: false
            })

            Array.from(videoElements).forEach((video) => {
              const videoEl = video as HTMLVideoElement
              videoEl.srcObject = stream
              videoEl.muted = true
              videoEl.play().catch((e: any) => console.log('回退播放失败:', e))
            })

            console.log('✅ 回退方案成功：直接getUserMedia附加完成')
          } catch (error) {
            console.log('❌ 回退方案也失败:', error)
          }
        } else {
          console.log('✅ LiveKit附加成功，无需回退')
        }
      }, 5000)
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

    // 清理资源
    resourceManager.cleanupAll()
    chat.startPolling(roomId)

    const currentSessionId = sessionId.value
    if (currentSessionId) {
      const payload = liveApi.getDefaultLiveRoomSessionDTO()
      payload.roomId = roomId
      payload.sessionId = currentSessionId
      liveApi.leaveLiveRoom(payload)
    }

    loadingState.setLoading('disconnect', false)
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

  // 同步参与者已有轨道（用于首次加入房间或重连）
  const syncExistingParticipantTracks = (participant: RemoteParticipant) => {
    try {
      const displayName = (participant.identity) || participant.sid
      const participantRole = (() => {
        try {
          if (participant.metadata) {
            const meta = JSON.parse(participant.metadata)
            return meta.role || null
          }
        } catch (e) {
          // ignore
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
    } catch (e) {
      // ignore
    }
  }

  // 监听 LiveKit Room 的参与者与轨道事件，保持 remoteParticipants 同步
  watch(
    () => connection.room.value,
    (currentRoom) => {
      if (!currentRoom) return

      connection.updateOnlineCount(currentRoom)

      // 同步已有参与者轨道
      currentRoom.remoteParticipants.forEach((participant) => {
        syncExistingParticipantTracks(participant)
      })

      // 订阅事件
      resourceManager.registerEventListener(currentRoom, RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => {
        connection.updateOnlineCount(currentRoom)
        syncExistingParticipantTracks(participant)
      })

      resourceManager.registerEventListener(currentRoom, RoomEvent.TrackSubscribed, (track: Track, _publication: RemoteTrackPublication, participant: RemoteParticipant) => {
        try {
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
        } catch (e) {
          // ignore
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
        connection.updateOnlineCount(currentRoom)
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
