import { ref, readonly } from 'vue'
import { ConnectionState } from 'livekit-client'
import { useI18n } from 'vue-i18n'
import { useErrorHandler } from './useErrorHandler'
import { useRetryMechanism } from './useRetryMechanism'
import { getGlobalApis } from '@/utils/naiveUIHelper'
import type { Room } from 'livekit-client'
import type { Ref } from 'vue'

export interface MediaDevicesResult {
  // 状态
  cameraEnabled: boolean
  microphoneEnabled: boolean

  // 方法
  toggleCamera: () => Promise<void>
  toggleMicrophone: () => Promise<void>
  setupLocalMedia: (targetRoom: Room) => Promise<void>
}

export const useMediaDevices = (room: Ref<Room | null>) => {
  const { t } = useI18n()
  const { message } = getGlobalApis()

  // 集成健壮性工具
  const errorHandler = useErrorHandler()
  const retryMechanism = useRetryMechanism()

  // 媒体状态
  const cameraEnabled = ref<boolean>(false)
  const microphoneEnabled = ref<boolean>(false)

  // 切换摄像头
  const toggleCamera = async (): Promise<void> => {
    const currentRoom = room.value
    if (!currentRoom) {
      errorHandler.handleError(new Error('未连接到房间'), 'media_camera_toggle', {
        showNotification: true,
        customMessage: t('live.room.value.notConnected')
      })
      return
    }

    if (currentRoom.state !== ConnectionState.Connected) {
      const stateText = getConnectionStateText(currentRoom.state)
      errorHandler.handleError(new Error(`无法切换摄像头：${stateText}`), 'media_camera_toggle', {
        showNotification: true,
        customMessage: t('live.room.value.cannotToggleCamera')
      })
      return
    }

    const enabled = !cameraEnabled.value

    try {
      await retryMechanism.retry(
        async () => {
          if (!enabled) {
            // 禁用摄像头
            await currentRoom.localParticipant.setCameraEnabled(false)
            cameraEnabled.value = false
          } else {
            // 启用摄像头 - 先禁用再启用以避免克隆问题
            const existingPublications = Array.from(currentRoom.localParticipant.videoTrackPublications.values())
            if (existingPublications.length > 0) {
              await currentRoom.localParticipant.setCameraEnabled(false)
              await new Promise(resolve => setTimeout(resolve, 200))
            }

            // 重新启用摄像头
            await currentRoom.localParticipant.setCameraEnabled(true)
            cameraEnabled.value = true

            // 等待轨道发布
            await new Promise(resolve => setTimeout(resolve, 500))
          }
        },
        {
          maxRetries: 2,
          retryCondition: (error) => retryMechanism.isRetryableError(error)
        }
      )
    } catch (error: any) {
      // 使用统一错误处理
      const errorMsg = error?.message || '未知错误'
      let customMessage = t('live.room.value.cameraToggleFailed')

      if (error?.name === 'DataCloneError' || errorMsg.includes('could not be cloned')) {
        customMessage = '切换摄像头失败：内部错误，请尝试刷新页面后重试'
      } else {
        customMessage = `切换摄像头失败：${errorMsg}`
      }

      errorHandler.handleError(error, 'media_camera_toggle', {
        showNotification: true,
        customMessage,
        allowRetry: retryMechanism.isRetryableError(error),
        onRetry: () => toggleCamera()
      })

      cameraEnabled.value = false
    }
  }

  // 切换麦克风
  const toggleMicrophone = async (): Promise<void> => {
    const currentRoom = room.value
    if (!currentRoom) {
      errorHandler.handleError(new Error('未连接到房间'), 'media_microphone_toggle', {
        showNotification: true,
        customMessage: t('live.room.value.notConnected')
      })
      return
    }

    if (currentRoom.state !== ConnectionState.Connected) {
      const stateText = getConnectionStateText(currentRoom.state)
      errorHandler.handleError(new Error(`无法切换麦克风：${stateText}`), 'media_microphone_toggle', {
        showNotification: true,
        customMessage: t('live.room.value.cannotToggleMicrophone')
      })
      return
    }

    const enabled = !microphoneEnabled.value

    try {
      await retryMechanism.retry(
        async () => {
          if (!enabled) {
            // 禁用麦克风
            await currentRoom.localParticipant.setMicrophoneEnabled(false)
            microphoneEnabled.value = false
          } else {
            // 启用麦克风 - 先禁用再启用以避免克隆问题
            const existingPublications = Array.from(currentRoom.localParticipant.audioTrackPublications.values())
            if (existingPublications.length > 0) {
              await currentRoom.localParticipant.setMicrophoneEnabled(false)
              await new Promise(resolve => setTimeout(resolve, 200))
            }

            // 重新启用麦克风
            await currentRoom.localParticipant.setMicrophoneEnabled(true)
            microphoneEnabled.value = true
          }
        },
        {
          maxRetries: 2,
          retryCondition: (error) => retryMechanism.isRetryableError(error)
        }
      )
    } catch (error: any) {
      // 使用统一错误处理
      const errorMsg = error?.message || '未知错误'
      let customMessage = t('live.room.value.microphoneToggleFailed')

      if (error?.name === 'DataCloneError' || errorMsg.includes('could not be cloned')) {
        customMessage = '切换麦克风失败：内部错误，请尝试刷新页面后重试'
      } else {
        customMessage = `切换麦克风失败：${errorMsg}`
      }

      errorHandler.handleError(error, 'media_microphone_toggle', {
        showNotification: true,
        customMessage,
        allowRetry: retryMechanism.isRetryableError(error),
        onRetry: () => toggleMicrophone()
      })

      microphoneEnabled.value = false
    }
  }

  // 设置本地媒体（连接成功后调用）
  const setupLocalMedia = async (targetRoom: Room): Promise<void> => {
    if (targetRoom.state !== ConnectionState.Connected) {
      return
    }

    try {
      // 先启用麦克风（通常更稳定）
      await targetRoom.localParticipant.setMicrophoneEnabled(true)
      microphoneEnabled.value = true

      // 等待一小段时间再启用摄像头
      await new Promise(resolve => setTimeout(resolve, 300))

      // 启用摄像头，添加重试机制
      let cameraRetries = 3
      let cameraSuccess = false

      while (cameraRetries > 0 && !cameraSuccess) {
        if (targetRoom.state !== ConnectionState.Connected) {
          break
        }

        try {
          await targetRoom.localParticipant.setCameraEnabled(true)
          cameraEnabled.value = true
          cameraSuccess = true
        } catch (error) {
          cameraRetries--
          if (cameraRetries > 0) {
            await new Promise(resolve => setTimeout(resolve, 1000))
          }
        }
      }

      if (!cameraSuccess) {
        cameraEnabled.value = false
        message.warning(t('live.room.value.cameraEnableFailed') || '启用摄像头失败，请检查权限设置或设备是否可用')
      }

      // 等待轨道发布
      await new Promise(resolve => setTimeout(resolve, 500))

    } catch (error) {
      microphoneEnabled.value = false
      cameraEnabled.value = false
      message.error(t('live.room.value.mediaSetupFailed') || '媒体设备设置失败')
    }
  }

  // 获取连接状态文本
  const getConnectionStateText = (state: ConnectionState): string => {
    switch (state) {
      case ConnectionState.Connecting:
        return t('live.room.value.connecting') || '连接中'
      case ConnectionState.Reconnecting:
        return t('live.room.value.reconnecting') || '重连中'
      case ConnectionState.Disconnected:
        return t('live.room.value.disconnected') || '已断开'
      default:
        return t('live.room.value.connectFailed') || '连接失败'
    }
  }

  return {
    // 状态
    cameraEnabled: readonly(cameraEnabled),
    microphoneEnabled: readonly(microphoneEnabled),

    // 方法
    toggleCamera,
    toggleMicrophone,
    setupLocalMedia
  }
}
