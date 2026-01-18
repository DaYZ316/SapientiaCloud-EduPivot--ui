import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

/**
 * 直播画中画状态接口
 */
interface LivePiPSession {
  roomId: string
  connection: any // LiveKit Room实例
  videoStream: MediaStream | null // 视频流
  participantId: string // 参与者ID
}

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
  const activeSession = ref<LivePiPSession | null>(null)
  const pipWindow = ref<PiPWindowState>({
    isOpen: false,
    windowRef: null,
    videoElement: null
  })

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
  const enterPiPMode = (session: LivePiPSession): void => {
    if (!session || !session.connection) {
      return
    }

    activeSession.value = session
    isInPiPMode.value = true

    // 创建画中画窗口
    createPiPWindow()
  }

  /**
   * 退出画中画模式
   */
  const exitPiPMode = (): void => {
    // 关闭画中画窗口
    closePiPWindow()

    // 清理状态
    activeSession.value = null
    isInPiPMode.value = false
  }

  /**
   * 仅设置活动会话（不打开 PiP 窗口），用于路由守卫或初始化时注册会话
   */
  const setActiveSession = (session: LivePiPSession | null): void => {
    activeSession.value = session
  }

  /**
   * 强制断开直播连接
   */
  const forceDisconnect = (): void => {
    if (activeSession.value?.connection && typeof (activeSession.value.connection.disconnect) === 'function') {
      // 断开LiveKit连接
      activeSession.value.connection.disconnect()
    }

    // 清理所有状态
    exitPiPMode()
  }

  /**
   * 创建画中画窗口
   */
  const createPiPWindow = (): void => {
    if (pipWindow.value.isOpen) {
      return
    }

    // 使用浏览器原生PiP API
    if (isPiPSupported.value && activeSession.value?.videoStream) {
      // 获取视频元素
      const videoElement = findVideoElement()
      if (videoElement && document.pictureInPictureEnabled) {
        videoElement.requestPictureInPicture().then(() => {
          pipWindow.value = {
            isOpen: true,
            windowRef: null, // 原生PiP没有window引用
            videoElement: videoElement
          }
        }).catch(() => {
          // 降级到自定义窗口
          createCustomPiPWindow()
        })
      } else {
        createCustomPiPWindow()
      }
    } else {
      // 降级方案：自定义浮动窗口
      createCustomPiPWindow()
    }
  }

  /**
   * 关闭画中画窗口
   */
  const closePiPWindow = (): void => {
    if (!pipWindow.value.isOpen) {
      return
    }

    if (pipWindow.value.windowRef) {
      // 关闭自定义窗口
      pipWindow.value.windowRef.close()
    } else if (pipWindow.value.videoElement && document.pictureInPictureElement) {
      // 退出原生PiP模式
      document.exitPictureInPicture()
    }

    pipWindow.value = {
      isOpen: false,
      windowRef: null,
      videoElement: null
    }
  }

  /**
   * 创建自定义画中画窗口（降级方案）
   */
  const createCustomPiPWindow = (): void => {
    const pipWin = window.open(
      '',
      'livePiP',
      'width=320,height=240,top=100,left=100,scrollbars=no,resizable=yes,status=no,toolbar=no,menubar=no'
    )

    if (pipWin) {
      // 设置窗口内容
      pipWin.document.title = '直播中...'
      pipWin.document.body.style.margin = '0'
      pipWin.document.body.style.padding = '0'
      pipWin.document.body.style.backgroundColor = '#000'
      pipWin.document.body.style.display = 'flex'
      pipWin.document.body.style.alignItems = 'center'
      pipWin.document.body.style.justifyContent = 'center'

      // 创建视频容器
      const videoContainer = pipWin.document.createElement('div')
      videoContainer.style.width = '100%'
      videoContainer.style.height = '100%'
      videoContainer.style.display = 'flex'
      videoContainer.style.flexDirection = 'column'
      videoContainer.style.alignItems = 'center'
      videoContainer.style.justifyContent = 'center'

      // 创建视频元素
      const video = pipWin.document.createElement('video')
      video.style.maxWidth = '100%'
      video.style.maxHeight = '100%'
      video.autoplay = true
      video.muted = true

      // 添加到容器
      videoContainer.appendChild(video)
      pipWin.document.body.appendChild(videoContainer)

      // 设置视频源
      if (activeSession.value?.videoStream) {
        video.srcObject = activeSession.value.videoStream
      }

      pipWindow.value = {
        isOpen: true,
        windowRef: pipWin,
        videoElement: video
      }
    }
  }

  /**
   * 查找当前页面的视频元素
   */
  const findVideoElement = (): HTMLVideoElement | null => {
    // 查找LiveRoom页面中的视频元素
    const videos = document.querySelectorAll('video')
    for (const video of videos) {
      if (video.srcObject || video.currentSrc) {
        return video as HTMLVideoElement
      }
    }
    return null
  }

  return {
    // 状态
    isInPiPMode,
    activeSession,
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
    findVideoElement
    ,setActiveSession
  }
})
