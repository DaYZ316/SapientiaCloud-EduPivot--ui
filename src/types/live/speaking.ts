/**
 * 说话指示器类型定义
 */
import {type ComputedRef, type Ref} from 'vue'

/**
 * 说话状态
 */
export interface SpeakingState {
    /** 是否正在说话 */
    isSpeaking: boolean
    /** 音量级别 (0.0 - 1.0) */
    volumeLevel: number
}

/**
 * 活跃说话者信息
 */
export interface ActiveSpeaker {
    /** 说话者 ID */
    participantId: string
    /** 音量级别 */
    volumeLevel: number
    /** 最后说话时间戳 */
    lastSpeakingAt: number
}

/**
 * 说话配置
 */
export interface SpeakingIndicatorConfig {
    /** 音量阈值，超过此值认为在说话 (0.0 - 1.0) */
    speakingThreshold: number
    /** 说话状态恢复延迟 (毫秒) */
    speakingResetDelay: number
    /** 音量检测间隔 (毫秒) */
    detectionInterval: number
}

/**
 * 说话指示器结果接口
 */
export interface SpeakingIndicatorResult {
    /** 所有参与者的说话状态 */
    speakingStates: Map<string, SpeakingState>
    /** 当前活跃说话者 */
    activeSpeaker: ActiveSpeaker | null
    /** 是否正在检测 */
    isDetecting: Readonly<Ref<boolean>>
    /** 说话者 ID 列表（按音量排序） */
    sortedSpeakingIds: ComputedRef<string[]>

    // 方法
    startDetecting: (room: import('livekit-client').Room) => void
    stopDetecting: () => void
    getSpeakingState: (participantId: string) => SpeakingState | null
}

