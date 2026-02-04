import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { extractMediaStreamFromTrack } from '@/views/live/LiveRoom/composables/mediaHelpers'
import { RoomEvent } from 'livekit-client'

/**
 * 画中画窗口状态接口
 */
interface PiPWindowState {
  isOpen: boolean
  windowRef: Window | null
  videoElement: HTMLVideoElement | null
}

/**
 * 直播画中画状态管理
 */
export const useLivePiPStore = defineStore('livePiP', () => {
  // 状态
  const isInPiPMode = ref<boolean>(false)
  const activeSession = ref<any>(null)
  // 标记是否刚刚从 PiP 恢复，用于防止直播页面重复初始化
  const justRestoredFromPiP = ref<boolean>(false)
  const pipWindow = ref<PiPWindowState>({
    isOpen: false,
    windowRef: null,
    videoElement: null
  })
  // 用于在后到轨道时附加的监听引用，便于在退出时移除
  let pipListenerRoom: any = null
  let trackSubscribedHandler: ((track: any, pub: any, participant: any) => void) | null = null

  // 计算属性
  const hasActiveLive = computed<boolean>(() => {
    return activeSession.value !== null && activeSession.value.connection !== null
  })

  const isPiPSupported = computed<boolean>(() => {
    return document.pictureInPictureEnabled !== undefined
  })

  // 方法
  /**
   * 进入画中画模式
   */
  const enterPiPMode = (session: any): void => {
    if (!session || !session.connection) {
      return
    }

    activeSession.value = session
    isInPiPMode.value = true

    // 创建画中画窗口
    createPiPWindow()

    // 如果当前没有 videoStream，订阅 Room 的 TrackSubscribed 事件，当目标参与者发布 video 时填充 activeSession.videoStream
    if (!activeSession.value?.videoStream && activeSession.value?.connection) {
      const room = activeSession.value.connection as any
      const participantId = activeSession.value.participantId

      // 移除已有的监听器（保险）
      if (pipListenerRoom && trackSubscribedHandler && typeof pipListenerRoom.off === 'function') {
        pipListenerRoom.off(RoomEvent.TrackSubscribed, trackSubscribedHandler)
      }

      trackSubscribedHandler = (track: any, _pub: any, participant: any) => {
        const pId = participant?.identity
        // 仅处理目标 participant 的 video 轨道
        if (participantId !== 'local' && pId !== participantId) return
        if (participantId === 'local' && participant !== room.localParticipant && pId !== room.localParticipant?.identity) return
        if (!track || (track.kind && track.kind !== 'video')) return

        const ms = extractMediaStreamFromTrack(track)
        if (ms) {
          if (activeSession.value) activeSession.value = { ...activeSession.value, videoStream: ms }
        } else {
          const cloned = new MediaStream([track as any])
          if (activeSession.value) activeSession.value = { ...activeSession.value, videoStream: cloned }
        }
      }

      if (room && typeof room.on === 'function') {
        room.on(RoomEvent.TrackSubscribed, trackSubscribedHandler)
        pipListenerRoom = room
      }
    }
  }

  /**
   * 退出画中画模式
   */
  const exitPiPMode = (): void => {
    // 关闭画中画窗口
    closePiPWindow()

    // 标记刚刚从 PiP 恢复，防止直播页面重复初始化
    // 注意：这里保留 activeSession，以便直播页面可以复用现有的连接
    justRestoredFromPiP.value = true
    isInPiPMode.value = false
  }

  /**
   * 清除从 PiP 恢复的标记
   */
  const clearRestoredFromPiPFlag = (): void => {
    justRestoredFromPiP.value = false
  }

  /**
   * 仅设置活动会话（不打开 PiP 窗口），用于路由守卫或初始化时注册会话
   */
  const setActiveSession = (session: any): void => {
    activeSession.value = session
  }

  /**
   * 强制断开直播连接
   */
  const forceDisconnect = async (): Promise<void> => {
    if (activeSession.value?.connection && typeof (activeSession.value.connection.disconnect) === 'function') {
      // 断开LiveKit连接
      activeSession.value.connection.disconnect()
    }

    // 通知后端用户离开直播间
    if (activeSession.value?.roomId && activeSession.value?.sessionId) {
      const liveApi = await import('@/api/live')
      const payload = liveApi.getDefaultLiveRoomSessionDTO()
      payload.roomId = activeSession.value.roomId
      payload.sessionId = activeSession.value.sessionId
      await liveApi.leaveLiveRoom(payload)
    }

    // 关闭 PiP 窗口
    closePiPWindow()

    // 完全清理所有状态
    activeSession.value = null
    justRestoredFromPiP.value = false
    isInPiPMode.value = false
  }

  /**
   * 创建画中画窗口
   */
  const createPiPWindow = (): void => {
    if (pipWindow.value.isOpen) {
      return
    }

    // 在创建 PiP 窗口前，若没有 videoStream，尝试从 activeSession.connection 中提取
    if (activeSession.value && !activeSession.value.videoStream) {
      const session: any = activeSession.value
      const room = session.connection
      const participantId = session.participantId
      let videoStream: MediaStream | null = null

      const tryExtractFromParticipant = (participant: any) => {
        if (!participant) return null
        const pubs: any[] = Array.from(participant.videoTrackPublications?.values?.() ?? [])
        for (const pub of pubs) {
          const track = pub && (pub.track || pub)
          const ms = extractMediaStreamFromTrack(track)
          if (ms) return ms
        }
        return null
      }

      if (participantId === 'local') {
        const localParticipant: any = room.localParticipant
        videoStream = tryExtractFromParticipant(localParticipant)
      } else {
        const remoteParticipant = (room.remoteParticipants && room.remoteParticipants.get && room.remoteParticipants.get(participantId)) ||
                                  Array.from(room.remoteParticipants ? room.remoteParticipants.values() : []).find((p: any) => p.identity === participantId)
        videoStream = tryExtractFromParticipant(remoteParticipant)
      }

      if (videoStream) {
        // 更新 store 中的 activeSession 引用
        activeSession.value = {
          ...activeSession.value,
          videoStream
        }
      }
    }

    // 仅使用自定义页面内 PiP（避免浏览器原生 PiP 导致出现双小窗）
    // 直接创建自定义浮动窗口；如果后续需要支持原生 PiP，可在未来单独开启
    createCustomPiPWindow()
  }

  /**
   * 关闭画中画窗口
   */
  const closePiPWindow = (): void => {
    if (!pipWindow.value.isOpen) {
      return
    }

    if (pipWindow.value.windowRef) {
      // 关闭自定义窗口（历史兼容），尽管现在不再使用 window.open
      pipWindow.value.windowRef.close()
    } else if (pipWindow.value.videoElement) {
      // 页面内 video 元素清理（不再使用原生 PiP）
      pipWindow.value.videoElement.pause?.()
      pipWindow.value.videoElement.srcObject = null
    }

    // 移除对 Room 的 TrackSubscribed 监听（如果有）
    if (pipListenerRoom && trackSubscribedHandler && typeof pipListenerRoom.off === 'function') {
      pipListenerRoom.off(RoomEvent.TrackSubscribed, trackSubscribedHandler)
    }
    pipListenerRoom = null
    trackSubscribedHandler = null

    pipWindow.value = {
      isOpen: false,
      windowRef: null,
      videoElement: null
    } as PiPWindowState
  }

  /**
   * 创建自定义画中画窗口（降级方案）
   */
  const createCustomPiPWindow = (): void => {
    pipWindow.value = {
      isOpen: true,
      windowRef: null,
      videoElement: null
    } as PiPWindowState
  }

  /**
   * 查找当前页面的视频元素
   */
  const findVideoElement = (): HTMLVideoElement | null => {
    // 优先查找明确的主视频元素，避免匹配到空的或无关的 video 元素
    const selectors = [
      '.video-panel .main-video video',
      '.video-panel .local-video video',
      '.video-panel video',
      'video'
    ]

    for (const sel of selectors) {
      const videos = document.querySelectorAll(sel)
      for (const video of videos) {
        const v = video as HTMLVideoElement
        if (v.srcObject || v.currentSrc || v.readyState >= 2) {
          return v
        }
      }
    }

    return null
  }

  return {
    // 状态
    isInPiPMode,
    activeSession,
    justRestoredFromPiP,
    pipWindow,

    // 计算属性
    hasActiveLive,
    isPiPSupported,

    // 方法
    enterPiPMode,
    exitPiPMode,
    forceDisconnect,
    createPiPWindow,
    closePiPWindow,
    findVideoElement,
    setActiveSession,
    clearRestoredFromPiPFlag
  }
})
