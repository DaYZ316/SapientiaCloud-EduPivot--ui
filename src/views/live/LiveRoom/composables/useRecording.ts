import { ref, computed, readonly, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
import * as liveApi from '@/api/live'
import type { LiveRoomVO } from '@/types/live'
import { LiveRoomRoleEnum } from '@/enum/live'
import { useErrorHandler } from './useErrorHandler'

// 录制状态常量
const EGRESS_STATUS = {
  NOT_RECORDING: 0,
  RECORDING: 1,
  STOPPING: 2,
  STOPPED: 3,
  FAILED: 4
} as const

export interface RecordingResult {
  // 状态
  isRecording: boolean
  recordingStatusLabel: string | null
  recordingLoading: boolean

  // 方法
  toggleRecording: (roomInfoRef: Ref<LiveRoomVO | null>, currentUserRole: LiveRoomRoleEnum) => Promise<void>
  canRecord: (roomInfo: LiveRoomVO | null, currentUserRole: LiveRoomRoleEnum) => boolean
}

export const useRecording = () => {
  const { t } = useI18n()
  const errorHandler = useErrorHandler()

  // 状态
  const recordingLoading = ref<boolean>(false)

  // 计算属性
  const isRecording = computed(() => {
    // 从外部传入的 roomInfo ref 中获取状态
    // 实际使用中以传入的 roomInfo.egressStatus 为准
    return false
  })

  const recordingStatusLabel = computed(() => {
    return null
  })

  // 切换录制状态
  const toggleRecording = async (
    roomInfoRef: Ref<LiveRoomVO | null>,
    currentUserRole: LiveRoomRoleEnum
  ): Promise<void> => {
    const roomInfo = roomInfoRef.value
    if (!roomInfo) {
      errorHandler.handleError({ name: 'RecordError', message: t('live.recording.roomInfoMissing') }, 'recording_toggle', {
        showNotification: true,
        customMessage: t('live.recording.roomInfoMissing')
      })
      return
    }

    // 检查权限
    if (!canRecord(roomInfo, currentUserRole)) {
      errorHandler.handleError({ name: 'PermissionError', message: t('live.room.noPermissionToRecord') }, 'recording_toggle', {
        showNotification: true,
        customMessage: t('live.room.noPermissionToRecord')
      })
      return
    }

    if (recordingLoading.value) {
      return
    }

    recordingLoading.value = true

    const isCurrentlyRecording = roomInfo.egressStatus === EGRESS_STATUS.RECORDING
    const operation = isCurrentlyRecording ? 'stop' : 'start'
    const apiCall = isCurrentlyRecording
      ? liveApi.stopRecording(roomInfo.id)
      : liveApi.startRecording(roomInfo.id)

    apiCall.then((response) => {
      if (response?.data) {
        Object.assign(roomInfo, response.data)
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
