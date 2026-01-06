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

  // 诊断方法
  diagnoseCameraIssues: () => Promise<string>
  diagnoseMicrophoneIssues: () => Promise<string>
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
      errorHandler.handleError({ name: 'ConnectionError', message: '未连接到房间' }, 'media_camera_toggle', {
        showNotification: true,
        customMessage: t('live.room.value.notConnected')
      })
      return
    }

    if (currentRoom.state !== ConnectionState.Connected) {
      const stateText = getConnectionStateText(currentRoom.state)
      errorHandler.handleError({ name: 'ConnectionError', message: `无法切换摄像头：${stateText}` }, 'media_camera_toggle', {
        showNotification: true,
        customMessage: t('live.room.value.cannotToggleCamera')
      })
      return
    }

    // ✅ 关键：在用户手势中先启动音频上下文，解除自动播放限制
    try {
      await safeAsyncCall(
        () => currentRoom.startAudio(),
        '音频上下文启动失败'
      )
    } catch (error: any) {
      // 即使startAudio失败，也要安全处理
    }

    const enabled = !cameraEnabled.value

    try {
      // 如果要启用摄像头，先检查是否存在 video input 设备，避免在无设备时继续重试
      if (enabled && navigator?.mediaDevices?.enumerateDevices) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices()
          const hasVideoInput = devices.some(d => d.kind === 'videoinput')
          if (!hasVideoInput) {
            const notFoundErr: any = new Error('未检测到摄像头设备，请检查设备连接或浏览器权限')
            notFoundErr.name = 'NotFoundError'
            throw notFoundErr
          }
        } catch (enumErr) {
          // 如果 enumerateDevices 本身失败，继续让后续逻辑尝试并在 catch 中集中处理
        }
      }

      await retryMechanism.retry(
        async () => {
          if (!enabled) {
            // 禁用摄像头 - 使用安全包装器
            await safeAsyncCall(
              () => currentRoom.localParticipant.setCameraEnabled(false),
              '禁用摄像头失败'
            )
            cameraEnabled.value = false
          } else {
            // 启用摄像头 - 使用最保守的安全策略
            try {
              // 步骤1: 清理现有轨道（如果有）
              const existingVideoTracks = Array.from(currentRoom.localParticipant.videoTrackPublications.values())
              if (existingVideoTracks.length > 0) {
                try {
                  await safeAsyncCall(
                    () => currentRoom.localParticipant.setCameraEnabled(false),
                    '清理现有摄像头轨道失败'
                  )
                  // 等待轨道完全停止
                  await new Promise(resolve => setTimeout(resolve, 300))
                } catch (cleanupError: any) {
                  // 清理失败，继续执行
                }
              }

              // 步骤2: 启用摄像头 - 使用安全包装器和超时保护
              const enablePromise = safeAsyncCall(
                () => currentRoom.localParticipant.setCameraEnabled(true),
                '启用摄像头失败'
              )
              const timeoutPromise = new Promise((_, reject) =>
                setTimeout(() => reject(new Error('摄像头启用超时，请检查设备连接')), 10000)
              )

              await Promise.race([enablePromise, timeoutPromise])
              cameraEnabled.value = true

              // 步骤3: 等待轨道发布和稳定 - 使用更短的等待时间
              await new Promise(resolve => setTimeout(resolve, 500))

              // 步骤4: 验证轨道是否成功发布
              const videoTracks = Array.from(currentRoom.localParticipant.videoTrackPublications.values())
              if (videoTracks.length === 0) {
                throw new Error('摄像头轨道发布失败')
              }

              // 步骤5: 额外等待确保轨道稳定
              await new Promise(resolve => setTimeout(resolve, 300))

            } catch (trackError: any) {
              cameraEnabled.value = false

              // 增强错误信息，避免传递可能包含不可克隆对象的原始错误
              const enhancedError = new Error('摄像头启用失败')
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
      const safeError = { name: 'MediaError', message: '媒体设备操作失败，请检查设备权限和连接状态' }

      // 错误已通过errorHandler处理，这里不再输出

      // 使用统一错误处理并给出更明确的用户提示
      let customMessage = t('live.room.value.cameraToggleFailed')

      // 安全地提取原始错误信息来进行错误类型判断
      let originalErrorName = 'Error'
      let originalErrorMessage = ''

      try {
        if (typeof error?.name === 'string') originalErrorName = error.name
        if (typeof error?.message === 'string') originalErrorMessage = error.message
      } catch (accessError) {
        // 如果访问原始错误对象失败，可能就是DataCloneError的原因
        originalErrorName = 'DataCloneError'
        originalErrorMessage = 'could not be cloned'
      }

      // 高级错误诊断和用户指导
      if (originalErrorName === 'DataCloneError' || originalErrorMessage.includes('could not be cloned')) {
        customMessage = '摄像头启动失败：浏览器内部错误，请尝试刷新页面或更换浏览器'
      } else if (originalErrorName === 'NotAllowedError' || originalErrorMessage.includes('permission') || originalErrorMessage.includes('denied')) {
        customMessage = '摄像头权限被拒绝。请点击地址栏的摄像头图标，允许网站访问摄像头'
      } else if (originalErrorName === 'NotFoundError' || originalErrorMessage.includes('未检测到摄像头') || originalErrorMessage.includes('device not found')) {
        customMessage = '未检测到摄像头设备。请检查：1)摄像头是否连接电脑 2)其他应用是否正在使用摄像头 3)尝试重启浏览器'
      } else if (originalErrorMessage.includes('busy') || originalErrorMessage.includes('in use')) {
        customMessage = '摄像头被其他应用占用。请关闭其他视频通话软件或浏览器标签页'
      } else if (originalErrorMessage.includes('timeout') || originalErrorMessage.includes('超时')) {
        customMessage = '摄像头启动超时。请检查设备连接，或尝试刷新页面重新连接'
      } else if (originalErrorMessage.includes('network') || originalErrorMessage.includes('connection')) {
        customMessage = '网络连接问题导致摄像头无法启动。请检查网络连接后重试'
      } else if (originalErrorMessage.includes('track') || originalErrorMessage.includes('轨道')) {
        customMessage = '摄像头轨道初始化失败。请尝试：1)刷新页面 2)检查摄像头权限 3)更换浏览器'
      } else if (originalErrorMessage.includes('启用失败') || originalErrorMessage.includes('enable')) {
        customMessage = '摄像头硬件启动失败。请检查：1)摄像头指示灯是否亮起 2)设备管理器中摄像头状态 3)尝试重启电脑'
      } else {
        customMessage = `摄像头启动失败：${originalErrorMessage || '未知错误'}。建议：刷新页面、检查摄像头连接、确认浏览器权限`
      }

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
      errorHandler.handleError({ name: 'ConnectionError', message: '未连接到房间' }, 'media_microphone_toggle', {
        showNotification: true,
        customMessage: t('live.room.value.notConnected')
      })
      return
    }

    if (currentRoom.state !== ConnectionState.Connected) {
      const stateText = getConnectionStateText(currentRoom.state)
      errorHandler.handleError({ name: 'ConnectionError', message: `无法切换麦克风：${stateText}` }, 'media_microphone_toggle', {
        showNotification: true,
        customMessage: t('live.room.value.cannotToggleMicrophone')
      })
      return
    }

    // ✅ 关键：在用户手势中先启动音频上下文，解除自动播放限制
    try {
      await safeAsyncCall(
        () => currentRoom.startAudio(),
        '音频上下文启动失败'
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
              '禁用麦克风失败'
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
                    '清理现有麦克风轨道失败'
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
                '启用麦克风失败'
              )
              microphoneEnabled.value = true

              // 等待轨道发布和稳定
              await new Promise(resolve => setTimeout(resolve, 500))

            } catch (trackError: any) {
              microphoneEnabled.value = false

              // 增强错误信息，避免传递可能包含不可克隆对象的原始错误
              const enhancedError = new Error('麦克风启用失败')
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
      const safeError = { name: 'MediaError', message: '媒体设备操作失败，请检查设备权限和连接状态' }

      // 错误已通过errorHandler处理，这里不再输出

      // 使用统一错误处理
      let customMessage = t('live.room.value.microphoneToggleFailed')

      // 安全地提取原始错误信息来进行错误类型判断
      let originalErrorName = 'Error'
      let originalErrorMessage = ''

      try {
        if (typeof error?.name === 'string') originalErrorName = error.name
        if (typeof error?.message === 'string') originalErrorMessage = error.message
      } catch (accessError) {
        // 如果访问原始错误对象失败，可能就是DataCloneError的原因
        originalErrorName = 'DataCloneError'
        originalErrorMessage = 'could not be cloned'
      }

      // 高级错误诊断和用户指导
      if (originalErrorName === 'DataCloneError' || originalErrorMessage.includes('could not be cloned')) {
        customMessage = '麦克风启动失败：浏览器内部错误，请尝试刷新页面或更换浏览器'
      } else if (originalErrorName === 'NotAllowedError' || originalErrorMessage.includes('permission') || originalErrorMessage.includes('denied')) {
        customMessage = '麦克风权限被拒绝。请点击地址栏的麦克风图标，允许网站访问麦克风'
      } else if (originalErrorName === 'NotFoundError' || originalErrorMessage.includes('device not found')) {
        customMessage = '未检测到麦克风设备。请检查：1)麦克风是否连接电脑 2)其他应用是否正在使用麦克风 3)尝试重启浏览器'
      } else if (originalErrorMessage.includes('busy') || originalErrorMessage.includes('in use')) {
        customMessage = '麦克风被其他应用占用。请关闭其他音频通话软件或浏览器标签页'
      } else if (originalErrorMessage.includes('timeout') || originalErrorMessage.includes('超时')) {
        customMessage = '麦克风启动超时。请检查设备连接，或尝试刷新页面重新连接'
      } else if (originalErrorMessage.includes('network') || originalErrorMessage.includes('connection')) {
        customMessage = '网络连接问题导致麦克风无法启动。请检查网络连接后重试'
      } else if (originalErrorMessage.includes('track') || originalErrorMessage.includes('轨道')) {
        customMessage = '麦克风轨道初始化失败。请尝试：1)刷新页面 2)检查麦克风权限 3)更换浏览器'
      } else if (originalErrorMessage.includes('启用失败') || originalErrorMessage.includes('enable')) {
        customMessage = '麦克风硬件启动失败。请检查：1)麦克风指示灯是否亮起 2)设备管理器中麦克风状态 3)尝试重启电脑'
      } else {
        customMessage = `麦克风启动失败：${originalErrorMessage || '未知错误'}。建议：刷新页面、检查麦克风连接、确认浏览器权限`
      }

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
        '启用麦克风失败'
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
            '启用摄像头失败'
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
        message.warning(t('live.room.value.cameraEnableFailed') || '启用摄像头失败，请检查权限设置或设备是否可用')
      }

      // 等待轨道发布
      await new Promise(resolve => setTimeout(resolve, 500))

    } catch (error) {
      microphoneEnabled.value = false
      cameraEnabled.value = false

      // 使用安全的错误处理
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

  // 摄像头问题诊断
  const diagnoseCameraIssues = async (): Promise<string> => {
    const diagnostics: string[] = []

    try {
      // 检查连接状态
      const currentRoom = room.value
      if (!currentRoom) {
        diagnostics.push('❌ 未连接到直播房间')
        return diagnostics.join('\n')
      }

      if (currentRoom.state !== ConnectionState.Connected) {
        diagnostics.push(`❌ 房间连接状态：${getConnectionStateText(currentRoom.state)}`)
        return diagnostics.join('\n')
      }

      diagnostics.push('✅ 房间连接正常')

      // 检查设备权限
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'camera' as PermissionName })
        diagnostics.push(`📷 摄像头权限状态：${permissionStatus.state}`)
      } catch {
        diagnostics.push('📷 无法检查摄像头权限状态')
      }

      // 检查可用设备
      if (navigator.mediaDevices?.enumerateDevices) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices()
          const videoDevices = devices.filter(d => d.kind === 'videoinput')
          diagnostics.push(`📹 检测到 ${videoDevices.length} 个摄像头设备`)

          if (videoDevices.length > 0) {
            videoDevices.forEach((device, index) => {
              diagnostics.push(`  ${index + 1}. ${device.label || '未命名设备'} (${device.deviceId.slice(0, 8)}...)`)
            })
          }
        } catch (error: any) {
          diagnostics.push(`❌ 设备枚举失败：${error?.message || '未知错误'}`)
        }
      }

      // 检查现有轨道
      const existingVideoTracks = Array.from(currentRoom.localParticipant.videoTrackPublications.values())
      diagnostics.push(`🎬 当前视频轨道数量：${existingVideoTracks.length}`)

      // 最终建议
      if (diagnostics.some(d => d.includes('❌'))) {
        diagnostics.push('\n🔧 建议检查：')
        diagnostics.push('   • 浏览器摄像头权限设置')
        diagnostics.push('   • 摄像头硬件连接')
        diagnostics.push('   • 其他应用是否占用摄像头')
        diagnostics.push('   • 尝试刷新页面或重启浏览器')
      } else {
        diagnostics.push('\n✅ 系统状态正常，如仍有问题可能是临时故障')
      }

    } catch (error: any) {
      diagnostics.push(`❌ 诊断过程中出错：${error?.message || '未知错误'}`)
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
        diagnostics.push('❌ 未连接到直播房间')
        return diagnostics.join('\n')
      }

      if (currentRoom.state !== ConnectionState.Connected) {
        diagnostics.push(`❌ 房间连接状态：${getConnectionStateText(currentRoom.state)}`)
        return diagnostics.join('\n')
      }

      diagnostics.push('✅ 房间连接正常')

      // 检查设备权限
      try {
        const permissionStatus = await navigator.permissions.query({ name: 'microphone' as PermissionName })
        diagnostics.push(`🎤 麦克风权限状态：${permissionStatus.state}`)
      } catch {
        diagnostics.push('🎤 无法检查麦克风权限状态')
      }

      // 检查可用设备
      if (navigator.mediaDevices?.enumerateDevices) {
        try {
          const devices = await navigator.mediaDevices.enumerateDevices()
          const audioDevices = devices.filter(d => d.kind === 'audioinput')
          diagnostics.push(`🎙️ 检测到 ${audioDevices.length} 个麦克风设备`)

          if (audioDevices.length > 0) {
            audioDevices.forEach((device, index) => {
              diagnostics.push(`  ${index + 1}. ${device.label || '未命名设备'} (${device.deviceId.slice(0, 8)}...)`)
            })
          }
        } catch (error: any) {
          diagnostics.push(`❌ 设备枚举失败：${error?.message || '未知错误'}`)
        }
      }

      // 检查现有轨道
      const existingAudioTracks = Array.from(currentRoom.localParticipant.audioTrackPublications.values())
      diagnostics.push(`🔊 当前音频轨道数量：${existingAudioTracks.length}`)

      // 最终建议
      if (diagnostics.some(d => d.includes('❌'))) {
        diagnostics.push('\n🔧 建议检查：')
        diagnostics.push('   • 浏览器麦克风权限设置')
        diagnostics.push('   • 麦克风硬件连接')
        diagnostics.push('   • 其他应用是否占用麦克风')
        diagnostics.push('   • 尝试刷新页面或重启浏览器')
      } else {
        diagnostics.push('\n✅ 系统状态正常，如仍有问题可能是临时故障')
      }

    } catch (error: any) {
      diagnostics.push(`❌ 诊断过程中出错：${error?.message || '未知错误'}`)
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
