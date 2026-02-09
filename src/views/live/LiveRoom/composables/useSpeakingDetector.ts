import { computed, ref, onUnmounted, type ComputedRef } from 'vue'
import {
  RoomEvent,
  type Participant,
  type Room,
  type RemoteParticipant,
  type RemoteTrackPublication
} from 'livekit-client'
import type {
  ActiveSpeaker,
  SpeakingIndicatorConfig,
  SpeakingState
} from '@/types/live/speaking'
import { useLiveSpeakingStore } from '@/stores/liveSpeaking'

const DEFAULT_CONFIG: SpeakingIndicatorConfig = {
  speakingThreshold: 0.05,
  speakingResetDelay: 0,
  detectionInterval: 50
}

export interface SpeakingDetectorResult {
  speakingStates: Map<string, SpeakingState>
  activeSpeaker: ActiveSpeaker | null
  isDetecting: { value: boolean }
  sortedSpeakingIds: ComputedRef<string[]>
  connect: (room: Room) => void
  disconnect: () => void
  destroy: () => void
  getSpeakingState: (participantId: string) => SpeakingState | null
}

/**
 * 独立的说话检测 Composable
 * 可被直播间页面和 PiPLiveWindow 共享使用
 * 组件卸载时不会自动断开连接，只停止检测
 */
export const useSpeakingDetector = (
  config?: Partial<SpeakingIndicatorConfig>
): SpeakingDetectorResult => {
  const settings: SpeakingIndicatorConfig = {
    ...DEFAULT_CONFIG,
    ...config
  }

  const store = useLiveSpeakingStore()
  const speakingStatesMap = ref<Map<string, SpeakingState>>(new Map())
  const activeSpeakerRef = ref<ActiveSpeaker | null>(null)
  const isDetectingRef = ref(false)

  let detectionTimer: number | null = null
  let currentRoom: Room | null = null

  const clampVolume = (value: number): number => {
    if (!Number.isFinite(value)) return 0
    return Math.max(0, Math.min(1, value))
  }

  const setSpeakingState = (participantId: string, state: SpeakingState): void => {
    speakingStatesMap.value.set(participantId, state)
    store.updateSpeakingState(participantId, state)
  }

  const recalculateActiveSpeaker = (): void => {
    let active: ActiveSpeaker | null = null

    speakingStatesMap.value.forEach((state, participantId) => {
      if (!state.isSpeaking) return

      if (!active || state.volumeLevel > active.volumeLevel) {
        active = {
          participantId,
          volumeLevel: state.volumeLevel,
          lastSpeakingAt: Date.now()
        }
      }
    })

    activeSpeakerRef.value = active
  }

  const markSpeaking = (participantId: string, volumeLevel: number): void => {
    const normalized = clampVolume(volumeLevel)
    const currentState = speakingStatesMap.value.get(participantId)

    if (
      currentState &&
      currentState.isSpeaking &&
      Math.abs(currentState.volumeLevel - normalized) < 0.01
    ) {
      return
    }

    setSpeakingState(participantId, {
      isSpeaking: true,
      volumeLevel: normalized
    })

    activeSpeakerRef.value = {
      participantId,
      volumeLevel: normalized,
      lastSpeakingAt: Date.now()
    }
  }

  const markSilent = (participantId: string): void => {
    const currentState = speakingStatesMap.value.get(participantId)
    if (currentState && !currentState.isSpeaking && currentState.volumeLevel === 0) {
      return
    }

    setSpeakingState(participantId, {
      isSpeaking: false,
      volumeLevel: 0
    })

    if (activeSpeakerRef.value?.participantId === participantId) {
      recalculateActiveSpeaker()
    }
  }

  const updateSpeakingState = (participantId: string, volumeLevel: number): void => {
    const normalized = clampVolume(volumeLevel)
    const isSpeaking = normalized >= settings.speakingThreshold

    if (isSpeaking) {
      markSpeaking(participantId, normalized)
      return
    }

    markSilent(participantId)
  }

  const getSpeakingState = (participantId: string): SpeakingState | null => {
    return speakingStatesMap.value.get(participantId) || null
  }

  const getParticipantVolume = (participant: RemoteParticipant | Participant | any): number => {
    if (
      typeof participant?.isMicrophoneEnabled === 'boolean' &&
      !participant.isMicrophoneEnabled
    ) {
      return 0
    }

    const audioPubs = Array.from(
      (participant.audioTrackPublications?.values?.() || []) as RemoteTrackPublication[]
    )

    // Prefer explicit speaking flag to clear indicator immediately when silence is detected.
    if (typeof participant?.isSpeaking === 'boolean' && !participant.isSpeaking) {
      return 0
    }

    // Mic disabled or all audio tracks muted: treat as silent immediately.
    if (audioPubs.length > 0) {
      const hasEnabledAudio = audioPubs.some((pub) => {
        const publicationMuted = Boolean(
          (pub as any).isMuted ?? (pub as any).muted ?? (pub as any).isUpstreamPaused
        )
        const trackLike = (pub as any).track
        const trackMuted = Boolean((trackLike as any)?.isMuted ?? (trackLike as any)?.muted)
        const mediaStreamTrackEnabled = (trackLike as any)?.mediaStreamTrack?.enabled
        const trackEnabled =
          typeof mediaStreamTrackEnabled === 'boolean' ? mediaStreamTrackEnabled : true

        return !publicationMuted && !trackMuted && trackEnabled
      })
      if (!hasEnabledAudio) {
        return 0
      }
    } else if (typeof participant?.isSpeaking !== 'boolean') {
      // No audio publication and no speaking signal, treat as silent.
      return 0
    }

    // Use LiveKit-reported audio level when available.
    if (typeof participant?.audioLevel === 'number') {
      const level = clampVolume(participant.audioLevel)
      if (typeof participant?.isSpeaking === 'boolean') {
        return participant.isSpeaking ? Math.max(level, settings.speakingThreshold + 0.01) : 0
      }
      return level
    }

    if (typeof participant?.isSpeaking === 'boolean') {
      return participant.isSpeaking ? Math.max(settings.speakingThreshold + 0.01, 0.08) : 0
    }

    for (const pub of audioPubs) {
      if (pub.track && pub.track.kind === 'audio') {
        if (typeof (pub.track as any).getVolumeLevel === 'function') {
          return clampVolume((pub.track as any).getVolumeLevel())
        }
      }
    }

    return 0
  }

  const detectAllVolumes = (): void => {
    if (!currentRoom) return

    const observedIds = new Set<string>()

    currentRoom.remoteParticipants.forEach((participant: RemoteParticipant) => {
      const participantId = participant.identity
      observedIds.add(participantId)
      updateSpeakingState(participantId, getParticipantVolume(participant))
    })

    if (currentRoom.localParticipant) {
      const localIdentity = currentRoom.localParticipant.identity || 'local'
      observedIds.add(localIdentity)
      updateSpeakingState(localIdentity, getParticipantVolume(currentRoom.localParticipant as any))
    }

    speakingStatesMap.value.forEach((_state, participantId) => {
      if (!observedIds.has(participantId)) {
        markSilent(participantId)
      }
    })
  }

  const handleActiveSpeakersChanged = (participants: Participant[]): void => {
    const activeIds = new Set<string>()

    for (const participant of participants) {
      const participantId = participant.identity || 'local'
      activeIds.add(participantId)
      const eventVolume =
        typeof (participant as any)?.audioLevel === 'number'
          ? clampVolume((participant as any).audioLevel)
          : ((participant as any)?.isSpeaking ? Math.max(settings.speakingThreshold + 0.01, 0.08) : 0)

      updateSpeakingState(participantId, Math.max(eventVolume, getParticipantVolume(participant)))
    }

    speakingStatesMap.value.forEach((_state, participantId) => {
      if (!activeIds.has(participantId)) {
        updateSpeakingState(participantId, 0)
      }
    })
  }

  /**
   * 连接到 Room 开始检测
   * @param room - LiveKit Room 实例
   */
  const connect = (room: Room): void => {
    if (isDetectingRef.value && currentRoom === room) {
      return
    }

    currentRoom = room
    isDetectingRef.value = true

    // 标记进入直播间/悬浮窗
    store.setInLiveRoom(true)

    room.on(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakersChanged as any)

    detectionTimer = window.setInterval(() => {
      detectAllVolumes()
    }, settings.detectionInterval)

    detectAllVolumes()
  }

  /**
   * 断开连接，停止检测
   * 注意：此方法只停止检测，不会清空 store 状态
   */
  const disconnect = (): void => {
    isDetectingRef.value = false

    if (detectionTimer) {
      clearInterval(detectionTimer)
      detectionTimer = null
    }

    if (currentRoom) {
      currentRoom.off(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakersChanged as any)
      currentRoom = null
    }

    // 标记离开直播间/悬浮窗
    store.setInLiveRoom(false)
  }

  /**
   * 完全清理，包括清空 store 状态
   * 用于直播完全结束时调用
   */
  const destroy = (): void => {
    disconnect()
    speakingStatesMap.value.clear()
    activeSpeakerRef.value = null
    store.clearAllSpeakingStates()
  }

  // 组件卸载时自动断开检测（但不清理 store）
  onUnmounted(() => {
    disconnect()
  })

  return {
    get speakingStates() {
      return speakingStatesMap.value
    },
    get activeSpeaker() {
      return activeSpeakerRef.value
    },
    isDetecting: isDetectingRef,
    sortedSpeakingIds: computed(() => {
      const speakers: { id: string; volume: number }[] = []

      speakingStatesMap.value.forEach((state, participantId) => {
        if (state.isSpeaking) {
          speakers.push({
            id: participantId,
            volume: state.volumeLevel
          })
        }
      })

      speakers.sort((a, b) => b.volume - a.volume)
      return speakers.map((speaker) => speaker.id)
    }),
    connect,
    disconnect,
    destroy,
    getSpeakingState
  }
}

