import {defineStore} from 'pinia'
import {computed, ref} from 'vue'

/**
 * 说话状态接口
 */
export interface SpeakingState {
    participantId: string
    studentId?: string
    isSpeaking: boolean
    volumeLevel: number
    lastSpeakingAt: number
}

/**
 * 直播说话状态 Store
 * 用于在直播间和教室之间共享说话状态
 */
export const useLiveSpeakingStore = defineStore('liveSpeaking', () => {
    // ========== 状态 ==========

    /**
     * 所有参与者的说话状态
     * key: participantId
     */
    const speakingStates = ref<Map<string, SpeakingState>>(new Map())

    /**
     * 当前活跃说话者（音量最高的）
     */
    const activeSpeaker = ref<SpeakingState | null>(null)

    /**
     * 是否在直播间/悬浮窗中
     * 用于控制是否在教室中显示说话指示器
     */
    const isInLiveRoom = ref(false)

    /**
     * participantId ↔ studentId 映射
     */
    const participantStudentMap = ref<Map<string, string>>(new Map())

    /**
     * studentId ↔ participantId 反向映射
     */
    const studentParticipantMap = ref<Map<string, string>>(new Map())

    // ========== 计算属性 ==========

    /**
     * 获取正在说话的人数
     */
    const speakingCount = computed(() => {
        let count = 0
        speakingStates.value.forEach(state => {
            if (state.isSpeaking) count++
        })
        return count
    })

    /**
     * 获取所有正在说话的 participantId 列表
     */
    const speakingParticipantIds = computed(() => {
        const ids: string[] = []
        speakingStates.value.forEach((state, id) => {
            if (state.isSpeaking) ids.push(id)
        })
        return ids
    })

    /**
     * 获取所有正在说话的 studentId 列表
     */
    const speakingStudentIds = computed(() => {
        const ids: string[] = []
        speakingStates.value.forEach((state) => {
            if (state.isSpeaking && state.studentId) {
                ids.push(state.studentId)
            }
        })
        return ids
    })

    // ========== 方法 ==========

    /**
     * 获取某人的说话状态
     */
    const getSpeakingState = (id: string): SpeakingState | null => {
        return speakingStates.value.get(id) || null
    }

    /**
     * 通过 studentId 获取说话状态
     */
    const getSpeakingStateByStudentId = (studentId: string): SpeakingState | null => {
        const participantId = studentParticipantMap.value.get(studentId)
        if (participantId) {
            return speakingStates.value.get(participantId) || null
        }
        return null
    }

    /**
     * 更新说话状态
     */
    const updateSpeakingState = (
        participantId: string,
        data: Partial<Omit<SpeakingState, 'participantId'>>
    ): SpeakingState => {
        const existing = speakingStates.value.get(participantId) || {
            participantId,
            isSpeaking: false,
            volumeLevel: 0,
            lastSpeakingAt: 0
        }

        // 从 participantStudentMap 中获取 studentId
        const studentId = participantStudentMap.value.get(participantId)

        const newState: SpeakingState = {
            ...existing,
            ...data,
            participantId,
            studentId
        } as SpeakingState

        speakingStates.value.set(participantId, newState)

        // 如果正在说话，更新活跃说话者
        if (newState.isSpeaking) {
            if (!activeSpeaker.value || newState.volumeLevel > (activeSpeaker.value?.volumeLevel || 0)) {
                activeSpeaker.value = newState
            }
        }

        return newState
    }

    /**
     * 设置 participantId 和 studentId 的映射关系
     */
    const setParticipantStudentMapping = (participantId: string, studentId: string): void => {
        participantStudentMap.value.set(participantId, studentId)
        studentParticipantMap.value.set(studentId, participantId)
    }

    /**
     * 批量设置映射关系
     */
    const setBatchMapping = (mappings: { participantId: string; studentId: string }[]): void => {
        mappings.forEach(({participantId, studentId}) => {
            participantStudentMap.value.set(participantId, studentId)
            studentParticipantMap.value.set(studentId, participantId)
        })
    }

    /**
     * 清除某人的说话状态
     */
    const clearSpeakingState = (participantId: string): void => {
        const state = speakingStates.value.get(participantId)
        if (state?.studentId) {
            studentParticipantMap.value.delete(state.studentId)
        }
        speakingStates.value.delete(participantId)

        // 如果清除的是活跃说话者，重新计算
        if (activeSpeaker.value?.participantId === participantId) {
            recalculateActiveSpeaker()
        }
    }

    /**
     * 重新计算活跃说话者
     */
    const recalculateActiveSpeaker = (): void => {
        let maxVolume = 0
        let maxSpeaker: SpeakingState | null = null

        speakingStates.value.forEach(state => {
            if (state.isSpeaking && state.volumeLevel > maxVolume) {
                maxVolume = state.volumeLevel
                maxSpeaker = state
            }
        })

        activeSpeaker.value = maxSpeaker
    }

    /**
     * 清除所有说话状态
     */
    const clearAllSpeakingStates = (): void => {
        speakingStates.value.clear()
        activeSpeaker.value = null
        participantStudentMap.value.clear()
        studentParticipantMap.value.clear()
    }

    /**
     * 设置是否在直播间中
     */
    const setInLiveRoom = (inLiveRoom: boolean): void => {
        isInLiveRoom.value = inLiveRoom
    }

    return {
        // 状态
        speakingStates,
        activeSpeaker,
        isInLiveRoom,
        participantStudentMap,
        // 计算属性
        speakingCount,
        speakingParticipantIds,
        speakingStudentIds,
        // 方法
        getSpeakingState,
        getSpeakingStateByStudentId,
        updateSpeakingState,
        setParticipantStudentMapping,
        setBatchMapping,
        clearSpeakingState,
        clearAllSpeakingStates,
        recalculateActiveSpeaker,
        setInLiveRoom
    }
})

