import { ref, computed, readonly } from 'vue'
import { useI18n } from 'vue-i18n'
import * as liveApi from '@/api/live'
import type { LiveRoomVO } from '@/types/live'
import { LiveRoomRoleEnum } from '@/enum/live'
import { useErrorHandler } from './useErrorHandler'

export interface RecordingResult {
  // 状态
  isRecording: boolean
  recordingStatusLabel: string | null
  recordingLoading: boolean

  // 方法
  toggleRecording: (roomInfo: LiveRoomVO | null, currentUserRole: LiveRoomRoleEnum) => Promise<void>
  canRecord: (roomInfo: LiveRoomVO | null, currentUserRole: LiveRoomRoleEnum) => boolean
}

export const useRecording = () => {
  const { t } = useI18n()
  const errorHandler = useErrorHandler()

  // 状态
  const recordingLoading = ref<boolean>(false)

  // 计算属性
  const isRecording = computed(() => {
    // 这里需要从roomInfo获取状态，暂时返回false
    return false
  })

  const recordingStatusLabel = computed(() => {
    // 这里需要从roomInfo获取状态，暂时返回null
    return null
  })

  // 切换录制状态
  const toggleRecording = async (
    roomInfo: LiveRoomVO | null,
    currentUserRole: LiveRoomRoleEnum
  ): Promise<void> => {
    if (!roomInfo) {
      errorHandler.handleError(new Error('Room info not found'), 'recording_toggle', {
        showNotification: true,
        customMessage: t('live.recording.roomInfoMissing')
      })
      return
    }

    // 检查权限
    if (!canRecord(roomInfo, currentUserRole)) {
      errorHandler.handleError(new Error('No permission to record'), 'recording_toggle', {
        showNotification: true,
        customMessage: t('live.room.noPermissionToRecord')
      })
      return
    }

    if (recordingLoading.value) {
      return
    }

    recordingLoading.value = true

    const operation = isRecording.value ? 'stop' : 'start'
    const apiCall = isRecording.value
      ? liveApi.stopRecording(roomInfo.id)
      : liveApi.startRecording(roomInfo.id)

    apiCall.then((response) => {
      if (response?.data) {
        // 更新房间信息
        Object.assign(roomInfo, response.data)
        // 成功提示通过其他方式处理，这里先注释掉
      }
      recordingLoading.value = false
    }).catch((error: any) => {
      const errorMsg = error?.message || t('live.recording.operationFailed')
      const errorKey = operation === 'stop' ? 'stopRecordingFailed' : 'startRecordingFailed'
      const actionLabel = operation === 'stop'
        ? t('live.common.recordingStop')
        : t('live.common.recordingStart')
      const fallbackMessage = t('live.recording.actionFailed', { action: actionLabel, error: errorMsg })
      const customMessage = t(`live.room.${errorKey}`) || fallbackMessage

      errorHandler.handleError(error, `recording_${operation}`, {
        showNotification: true,
        customMessage
      })
      recordingLoading.value = false
    })
  }

  // 检查是否可以录制
  const canRecord = (
    roomInfo: LiveRoomVO | null,
    currentUserRole: LiveRoomRoleEnum
  ): boolean => {
    if (!roomInfo) return false

    // 检查用户角色权限
    const hasPermission = currentUserRole === LiveRoomRoleEnum.TEACHER ||
                         currentUserRole === LiveRoomRoleEnum.ASSISTANT

    if (!hasPermission) return false

    // 检查房间是否启用了录制功能
    return roomInfo.recordingEnabled === 1
  }

  return {
    // 状态
    isRecording,
    recordingStatusLabel,
    recordingLoading: readonly(recordingLoading),

    // 方法
    toggleRecording,
    canRecord
  }
}
