import { inject } from 'vue'

// 依赖注入的key
export const LiveRoomInjectionKey = Symbol('LiveRoom')

// 上下文接口
export interface LiveRoomContext {
  // 状态
  roomInfo: any
  remoteParticipants: any
  onlineCount: any
  isFullscreen: any
  isChatCollapsed: any
  unreadMessageCount: any
  speakerVolume: any
  sessionId: any
  layoutMode: any
  selectedMainParticipantId: any
  firstTeacherParticipantId: any

  // 计算属性
  currentUserRole: any
  connectionStateLabel: any
  connectionError: any
  connectionIsConnected: any
  connectionConnecting: any
  cameraEnabled: any
  microphoneEnabled: any
  recordingLoading: any
  chatMessages: any
  chatOnlineCount: any
  speakerVolumeValue: any
  canShowRecording: any
  activeMainParticipantId: any

  // 加载状态
  loadingState: any

  // 录制相关
  recording: any

  // 方法
  handleLeave: any
  handleSendMessage: any
  handleToggleCamera: any
  handleToggleMicrophone: any
  handleToggleRecording: any
  handleSpeakerVolumeChange: any
  handleSelectMain: any
  handleToggleLayoutMode: any
  handleToggleFullscreen: any
  handleToggleChatCollapse: any
  registerVideoPanel?: any
  unregisterVideoPanel?: any
}

export const useLiveRoomContext = (): LiveRoomContext => {
  const context = inject<LiveRoomContext>(LiveRoomInjectionKey)
  if (!context) {
    throw new Error('useLiveRoomContext must be used within a LiveRoomProvider')
  }
  return context
}
