import { ref, computed, readonly } from 'vue'
import { useI18n } from 'vue-i18n'
import * as liveApi from '@/api/live'
import type { LiveRoomVO } from '@/types/live'
import { LiveRoomRoleEnum } from '@/enum/live'
import { getGlobalApis } from '@/utils/naiveUIHelper'

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
  const { message } = getGlobalApis()

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
      message.error('房间信息不存在')
      return
    }

    // 检查权限
    if (!canRecord(roomInfo, currentUserRole)) {
      message.error(t('live.room.noPermissionToRecord') || '您没有权限控制录制')
      return
    }

    if (recordingLoading.value) {
      return
    }

    recordingLoading.value = true

    try {
      if (isRecording.value) {
        // 停止录制
        const response = await liveApi.stopRecording(roomInfo.id)
        if (response?.data) {
          // 更新房间信息
          Object.assign(roomInfo, response.data)
          message.success('录制已停止')
        }
      } else {
        // 开始录制
        const response = await liveApi.startRecording(roomInfo.id)
        if (response?.data) {
          // 更新房间信息
          Object.assign(roomInfo, response.data)
          message.success('录制已开始')
        }
      }
    } catch (error: any) {
      const errorMsg = error?.message || '操作失败'
      if (isRecording.value) {
        message.error(t('live.room.stopRecordingFailed') || `停止录制失败：${errorMsg}`)
      } else {
        message.error(t('live.room.startRecordingFailed') || `开始录制失败：${errorMsg}`)
      }
    } finally {
      recordingLoading.value = false
    }
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
