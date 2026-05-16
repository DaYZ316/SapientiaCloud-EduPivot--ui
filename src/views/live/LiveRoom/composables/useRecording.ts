import {computed, readonly, ref, type Ref} from 'vue'
import {useI18n} from 'vue-i18n'
import * as liveApi from '@/api/live'
import type {LiveRoomVO} from '@/types/live'
import {LiveRoomRoleEnum} from '@/enum/live'
import {useErrorHandler} from './useErrorHandler'

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
    hasRecorded: boolean

    // 方法
    toggleRecording: (roomInfoRef: Ref<LiveRoomVO | null>, currentUserRole: LiveRoomRoleEnum) => Promise<void>
    canRecord: (roomInfo: LiveRoomVO | null, currentUserRole: LiveRoomRoleEnum) => boolean
}

export const useRecording = (roomInfoRef?: Ref<LiveRoomVO | null>) => {
    const {t} = useI18n()
    const errorHandler = useErrorHandler()

    // 状态
    const recordingLoading = ref<boolean>(false)
    const hasRecorded = ref<boolean>(false)

    // 计算属性 - 基于 roomInfoRef 的 egressStatus 实时反映录制状态
    const isRecording = computed(() => {
        return roomInfoRef?.value?.egressStatus === EGRESS_STATUS.RECORDING
    })

    const recordingStatusLabel = computed(() => {
        const status = roomInfoRef?.value?.egressStatus ?? null
        if (status === EGRESS_STATUS.RECORDING) return t('live.room.recordingRunning')
        if (status === EGRESS_STATUS.STOPPING) return t('live.room.recordingStopping')
        if (status === EGRESS_STATUS.FAILED) return t('live.room.recordingFailed')
        return null
    })

    // 切换录制状态
    const toggleRecording = async (
        roomInfoRef: Ref<LiveRoomVO | null>,
        currentUserRole: LiveRoomRoleEnum
    ): Promise<void> => {
        const roomInfo = roomInfoRef.value
        if (!roomInfo) {
            errorHandler.handleError({
                name: 'RecordError',
                message: t('live.recording.roomInfoMissing')
            }, 'recording_toggle', {
                showNotification: true,
                customMessage: t('live.recording.roomInfoMissing')
            })
            return
        }

        // 检查权限
        if (!canRecord(roomInfo, currentUserRole)) {
            errorHandler.handleError({
                name: 'PermissionError',
                message: t('live.room.noPermissionToRecord')
            }, 'recording_toggle', {
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

        if (!isCurrentlyRecording) {
            hasRecorded.value = true
        }
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
            const fallbackMessage = t('live.recording.actionFailed', {action: actionLabel, error: errorMsg})
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
        hasRecorded: readonly(hasRecorded),

        // 方法
        toggleRecording,
        canRecord
    }
}
