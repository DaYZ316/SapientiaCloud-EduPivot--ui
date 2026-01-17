import { ref, readonly } from 'vue'
import { ConnectionState } from 'livekit-client'
import { useI18n } from 'vue-i18n'
import { useErrorHandler } from './useErrorHandler'
import { useRetryMechanism } from './useRetryMechanism'
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

  // 诊断方法
  diagnoseCameraIssues: () => Promise<string>
  diagnoseMicrophoneIssues: () => Promise<string>
}

export const useMediaDevices = (room: Ref<Room | null>) => {
  const { t } = useI18n()

  // 集成健壮性工具
  const errorHandler = useErrorHandler()
  const retryMechanism = useRetryMechanism()

  // 媒体状态
  const cameraEnabled = ref<boolean>(false)
  const microphoneEnabled = ref<boolean>(false)

  // 全局错误捕获，防止DataCloneError传播
  const safeAsyncCall = async <T>(operation: () => Promise<T>, fallbackError: string): Promise<T> => {
    try {
      return await operation()
    } catch (error) {
      // 如果是DataCloneError，抛出一个安全的错误
      if (error instanceof Error && error.name === 'DataCloneError') {
        throw new Error(fallbackError)
      }
      throw error
    }
  }


  // 切换摄像头
  const toggleCamera = async (): Promise<void> => {
    const currentRoom = room.value
    if (!currentRoom) {
      errorHandler.handleError({ name: 'ConnectionError', message: t('live.room.notConnected') }, 'media_camera_toggle', {
        showNotification: true,
        customMessage: t('live.room.notConnected')
      })
      return
    }

    if (currentRoom.state !== ConnectionState.Connected) {
      errorHandler.handleError({ name: 'ConnectionError', message: t('live.room.cannotToggleCamera') }, 'media_camera_toggle', {
        showNotification: true,
        customMessage: t('live.room.cannotToggleCamera')
      })
      return
    }

    // ✅ 关键：在用户手势中先启动音频上下文，解除自动播放限制
    safeAsyncCall(
      () => currentRoom.startAudio(),
      t('live.media.audioContextStartFailed')
    ).catch(() => {
      // 即使startAudio失败，也要安全处理
    })

    const enabled = !cameraEnabled.value

    try {
      // 如果要启用摄像头，先检查是否存在 video input 设备，避免在无设备时继续重试
      if (enabled && navigator?.mediaDevices?.enumerateDevices) {
        navigator.mediaDevices.enumerateDevices().then((devices) => {
          const hasVideoInput = devices.some(d => d.kind === 'videoinput')
          if (!hasVideoInput) {
            const notFoundErr: any = new Error(t('live.media.cameraNotFound'))
            notFoundErr.name = 'NotFoundError'
            throw notFoundErr
          }
        }).catch(() => {
          // 如果 enumerateDevices 本身失败，继续让后续逻辑尝试并在 catch 中集中处理
        })
      }

      await retryMechanism.retry(
        async () => {
          if (!enabled) {
            // 禁用摄像头 - 使用安全包装器
            await safeAsyncCall(
              () => currentRoom.localParticipant.setCameraEnabled(false),
              t('live.media.cameraDisableFailed')
            )
            cameraEnabled.value = false
          } else {
            // 启用摄像头 - 使用最保守的安全策略
            try {
              // 步骤1: 清理现有轨道（如果有）
              const existingVideoTracks = Array.from(currentRoom.localParticipant.videoTrackPublications.values())
              if (existingVideoTracks.length > 0) {
                safeAsyncCall(
                  () => currentRoom.localParticipant.setCameraEnabled(false),
                  t('live.media.cameraCleanupFailed')
                ).then(() => {
                  // 等待轨道完全停止
                  return new Promise(resolve => setTimeout(resolve, 300))
                }).catch(() => {
                  // 清理失败，继续执行
                })
              }

              // 步骤2: 启用摄像头 - 使用安全包装器和超时保护
              const enablePromise = safeAsyncCall(
                () => currentRoom.localParticipant.setCameraEnabled(true),
                t('live.media.cameraEnableFailed')
              )
              const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error(t('live.media.cameraEnableTimeout'))), 10000)
              )

              await Promise.race([enablePromise, timeoutPromise])
              cameraEnabled.value = true

              // 步骤3: 等待轨道发布和稳定 - 使用更短的等待时间
              await new Promise(resolve => setTimeout(resolve, 500))

              // 步骤4: 验证轨道是否成功发布
              const videoTracks = Array.from(currentRoom.localParticipant.videoTrackPublications.values())
              if (videoTracks.length === 0) {
                throw new Error(t('live.media.cameraPublishFailed'))
              }

              // 步骤5: 额外等待确保轨道稳定
              await new Promise(resolve => setTimeout(resolve, 300))

              // 步骤6: 手动触发视频附加
              console.log('useMediaDevices: 摄像头启用成功，触发视频附加')
              try {
                // 获取第一个视频轨道
                const firstVideoTrack = videoTracks[0]?.track
                if (!firstVideoTrack) {
                  console.log('useMediaDevices: 未找到视频轨道，跳过附加')
                  return
                }

                // 查找 useLiveRoom 的上下文并触发附加
                const vueInstances: any[] = []
                function findVueInstances(node: any) {
                  if (node.__vue__) {
                    vueInstances.push(node.__vue__)
                  }
                  if (node.children) {
                    Array.from(node.children).forEach(findVueInstances)
                  }
                }
                findVueInstances(document.body)

                vueInstances.forEach((vm: any) => {
                  if (vm.$?.data?.videoPanelRef || vm.$?.refs?.videoPanelRef) {
                    const videoPanel = vm.$?.data?.videoPanelRef || vm.$?.refs?.videoPanelRef
                    if (videoPanel?.attachLocalVideo) {
                      console.log('useMediaDevices: 手动附加本地视频到 VideoPanel')
                      videoPanel.attachLocalVideo(firstVideoTrack)
                    }
                  }
                })

                // 也尝试直接附加到 DOM 元素
                const localVideos = document.querySelectorAll('.video-panel .local-video video')
                Array.from(localVideos).forEach((video) => {
                  try {
                    const videoEl = video as HTMLVideoElement
                    if (firstVideoTrack && typeof firstVideoTrack.attach === 'function') {
                      firstVideoTrack.attach(videoEl)
                      videoEl.muted = true
                      videoEl.play?.().catch(() => {})
                    }
                  } catch (e) {
                    console.log('useMediaDevices: 直接附加失败:', e)
                  }
                })
              } catch (attachError) {
                console.log('useMediaDevices: 手动附加出错:', attachError)
              }

            } catch (trackError: any) {
              cameraEnabled.value = false

              // 增强错误信息，避免传递可能包含不可克隆对象的原始错误
              const enhancedError = new Error(trackError?.message || t('live.media.cameraEnableFailed'))
              enhancedError.name = trackError?.name || 'CameraError'
              throw enhancedError
            }
          }
        },
        {
          maxRetries: 2,
          retryCondition: (error) => retryMechanism.isRetryableError(error)
        }
      )
    } catch (error: any) {
      // 使用安全的错误创建函数，避免任何DataCloneError
      const safeError = { name: 'MediaError', message: t('live.media.operationFailed') }

      // 错误已通过errorHandler处理，这里不再输出

      // 简化的错误处理
      const customMessage = error?.message || t('live.media.cameraStartFailed')

      errorHandler.handleError(safeError, 'media_camera_toggle', {
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
      errorHandler.handleError({ name: 'ConnectionError', message: t('live.room.notConnected') }, 'media_microphone_toggle', {
        showNotification: true,
        customMessage: t('live.room.notConnected')
      })
      return
    }

    if (currentRoom.state !== ConnectionState.Connected) {
      errorHandler.handleError({ name: 'ConnectionError', message: t('live.room.cannotToggleMicrophone') }, 'media_microphone_toggle', {
        showNotification: true,
        customMessage: t('live.room.cannotToggleMicrophone')
      })
      return
    }

    // ✅ 关键：在用户手势中先启动音频上下文，解除自动播放限制
    try {
      await safeAsyncCall(
        () => currentRoom.startAudio(),
        t('live.media.audioContextStartFailed')
      )
    } catch (error: any) {
      // 即使startAudio失败，也要安全处理
    }

    const enabled = !microphoneEnabled.value

    try {
      await retryMechanism.retry(
        async () => {
          if (!enabled) {
            // 禁用麦克风
            await safeAsyncCall(
              () => currentRoom.localParticipant.setMicrophoneEnabled(false),
              t('live.media.microphoneDisableFailed')
            )
            microphoneEnabled.value = false
          } else {
            // 启用麦克风 - 改进的轨道管理逻辑
            try {
              // 先检查是否已有音频轨道，如果有则先停止
              const existingAudioTracks = Array.from(currentRoom.localParticipant.audioTrackPublications.values())
              if (existingAudioTracks.length > 0) {
                try {
                  await safeAsyncCall(
                    () => currentRoom.localParticipant.setMicrophoneEnabled(false),
                    t('live.media.microphoneCleanupFailed')
                  )
                  // 等待轨道完全停止
                  await new Promise(resolve => setTimeout(resolve, 300))
                } catch (cleanupError: any) {
                  // 清理失败，继续执行
                }
              }

              // 启用麦克风
              await safeAsyncCall(
                () => currentRoom.localParticipant.setMicrophoneEnabled(true),
                t('live.media.microphoneEnableFailed')
              )
              microphoneEnabled.value = true

              // 等待轨道发布和稳定
              await new Promise(resolve => setTimeout(resolve, 500))

            } catch (trackError: any) {
              microphoneEnabled.value = false

              // 增强错误信息，避免传递可能包含不可克隆对象的原始错误
              const enhancedError = new Error(t('live.media.microphoneEnableFailed'))
              enhancedError.name = trackError?.name || 'MicrophoneError'
              throw enhancedError
            }
          }
        },
        {
          maxRetries: 2,
          retryCondition: (error) => retryMechanism.isRetryableError(error)
        }
      )
    } catch (error: any) {
      // 使用安全的错误创建函数，避免任何DataCloneError
      const safeError = { name: 'MediaError', message: t('live.media.operationFailed') }

      // 错误已通过errorHandler处理，这里不再输出

      // 简化的错误处理
      const customMessage = error?.message || t('live.media.microphoneStartFailed')

      errorHandler.handleError(safeError, 'media_microphone_toggle', {
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
      await safeAsyncCall(
        () => targetRoom.localParticipant.setMicrophoneEnabled(true),
        t('live.media.microphoneEnableFailed')
      )
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
          await safeAsyncCall(
            () => targetRoom.localParticipant.setCameraEnabled(true),
            t('live.media.cameraEnableFailed')
          )
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
        errorHandler.handleError(new Error('Camera enable failed'), 'media_camera_enable', {
          showNotification: true,
          customMessage: t('live.room.cameraEnableFailed')
        })
      }

      // 等待轨道发布
      await new Promise(resolve => setTimeout(resolve, 500))

    } catch (error) {
      microphoneEnabled.value = false
      cameraEnabled.value = false

      // 使用统一的错误处理器
      errorHandler.handleError(error, 'media_setup', {
        showNotification: true,
        customMessage: t('live.room.mediaSetupFailed')
      })
    }
  }

  // 获取连接状态文本
  const getConnectionStateText = (state: ConnectionState): string => {
    switch (state) {
      case ConnectionState.Connecting:
        return t('live.room.connecting')
      case ConnectionState.Reconnecting:
        return t('live.room.reconnecting')
      case ConnectionState.Disconnected:
        return t('live.room.disconnected')
      default:
        return t('live.room.connectFailed')
    }
  }

  // 摄像头问题诊断
  const diagnoseCameraIssues = async (): Promise<string> => {
    const diagnostics: string[] = []

    try {
      // 检查连接状态
      const currentRoom = room.value
      if (!currentRoom) {
        diagnostics.push(t('live.diagnostics.roomNotConnected'))
        return diagnostics.join('\n')
      }

      if (currentRoom.state !== ConnectionState.Connected) {
        diagnostics.push(t('live.diagnostics.roomConnectionState', { state: getConnectionStateText(currentRoom.state) }))
        return diagnostics.join('\n')
      }

      diagnostics.push(t('live.diagnostics.roomConnectionOk'))

      // 检查设备权限
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName })
        diagnostics.push(t('live.diagnostics.cameraPermissionState', { state: permissionStatus.state }))
      } catch {
        diagnostics.push(t('live.diagnostics.cameraPermissionUnavailable'))
      }

      // 检查可用设备
      if (navigator.mediaDevices?.enumerateDevices) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices()
          const videoDevices = devices.filter(d => d.kind === 'videoinput')
          diagnostics.push(t('live.diagnostics.cameraDevicesDetected', { count: videoDevices.length }))

          if (videoDevices.length > 0) {
            videoDevices.forEach((device, index) => {
              diagnostics.push(t('live.diagnostics.deviceLabelLine', {
                index: index + 1,
                label: device.label || t('live.diagnostics.deviceLabelUnknown'),
                id: device.deviceId.slice(0, 8)
              }))
            })
          }
        } catch (error: any) {
          diagnostics.push(t('live.diagnostics.deviceEnumFailed', { error: error?.message || t('live.common.unknownError') }))
        }
      }

      // 检查现有轨道
      const existingVideoTracks = Array.from(currentRoom.localParticipant.videoTrackPublications.values())
      diagnostics.push(t('live.diagnostics.currentVideoTracks', { count: existingVideoTracks.length }))

      // 最终建议
      if (diagnostics.some(d => d.includes('❌'))) {
        diagnostics.push(t('live.diagnostics.suggestTitle'))
        diagnostics.push(t('live.diagnostics.suggestCameraPermission'))
        diagnostics.push(t('live.diagnostics.suggestCameraHardware'))
        diagnostics.push(t('live.diagnostics.suggestCameraOccupied'))
        diagnostics.push(t('live.diagnostics.suggestRefresh'))
      } else {
        diagnostics.push(t('live.diagnostics.ok'))
      }

    } catch (error: any) {
      diagnostics.push(t('live.diagnostics.error', { error: error?.message || t('live.common.unknownError') }))
    }

    return diagnostics.join('\n')
  }

  // 麦克风问题诊断
  const diagnoseMicrophoneIssues = async (): Promise<string> => {
    const diagnostics: string[] = []

    try {
      // 检查连接状态
      const currentRoom = room.value
      if (!currentRoom) {
        diagnostics.push(t('live.diagnostics.roomNotConnected'))
        return diagnostics.join('\n')
      }

      if (currentRoom.state !== ConnectionState.Connected) {
        diagnostics.push(t('live.diagnostics.roomConnectionState', { state: getConnectionStateText(currentRoom.state) }))
        return diagnostics.join('\n')
      }

      diagnostics.push(t('live.diagnostics.roomConnectionOk'))

      // 检查设备权限
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName })
        diagnostics.push(t('live.diagnostics.microphonePermissionState', { state: permissionStatus.state }))
      } catch {
        diagnostics.push(t('live.diagnostics.microphonePermissionUnavailable'))
      }

      // 检查可用设备
      if (navigator.mediaDevices?.enumerateDevices) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices()
          const audioDevices = devices.filter(d => d.kind === 'audioinput')
          diagnostics.push(t('live.diagnostics.microphoneDevicesDetected', { count: audioDevices.length }))

          if (audioDevices.length > 0) {
            audioDevices.forEach((device, index) => {
              diagnostics.push(t('live.diagnostics.deviceLabelLine', {
                index: index + 1,
                label: device.label || t('live.diagnostics.deviceLabelUnknown'),
                id: device.deviceId.slice(0, 8)
              }))
            })
          }
        } catch (error: any) {
          diagnostics.push(t('live.diagnostics.deviceEnumFailed', { error: error?.message || t('live.common.unknownError') }))
        }
      }

      // 检查现有轨道
      const existingAudioTracks = Array.from(currentRoom.localParticipant.audioTrackPublications.values())
      diagnostics.push(t('live.diagnostics.currentAudioTracks', { count: existingAudioTracks.length }))

      // 最终建议
      if (diagnostics.some(d => d.includes('❌'))) {
        diagnostics.push(t('live.diagnostics.suggestTitle'))
        diagnostics.push(t('live.diagnostics.suggestMicrophonePermission'))
        diagnostics.push(t('live.diagnostics.suggestMicrophoneHardware'))
        diagnostics.push(t('live.diagnostics.suggestMicrophoneOccupied'))
        diagnostics.push(t('live.diagnostics.suggestRefresh'))
      } else {
        diagnostics.push(t('live.diagnostics.ok'))
      }

    } catch (error: any) {
      diagnostics.push(t('live.diagnostics.error', { error: error?.message || t('live.common.unknownError') }))
    }

    return diagnostics.join('\n')
  }

  return {
    // 状态
    cameraEnabled: readonly(cameraEnabled),
    microphoneEnabled: readonly(microphoneEnabled),

    // 方法
    toggleCamera,
    toggleMicrophone,
    setupLocalMedia,

    // 诊断方法
    diagnoseCameraIssues,
    diagnoseMicrophoneIssues
  }
}
