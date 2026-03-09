import { defineStore } from 'pinia'
import { computed, ref, shallowRef } from 'vue'
import {
  useSpeakingDetector,
  type SpeakingDetectorResult
} from '@/views/live/LiveRoom/composables/useSpeakingDetector'

/**
 * Global speaking detector store shared by LiveRoom / PiP / Classroom3D.
 */
export const useSpeakingDetectorStore = defineStore('speakingDetector', () => {
  const detector = shallowRef<SpeakingDetectorResult | null>(null)
  const currentRoom = ref<any | null>(null)
  const isConnected = ref(false)

  const initDetector = (): SpeakingDetectorResult => {
    if (!detector.value) {
      detector.value = useSpeakingDetector()
    }
    return detector.value!
  }

  const speakingStates = computed(() => {
    if (detector.value?.speakingStates) {
      return detector.value.speakingStates
    }
    return new Map<string, { isSpeaking: boolean; volumeLevel: number }>()
  })

  const activeSpeaker = computed(() => detector.value?.activeSpeaker || null)

  const sortedSpeakingIds = computed(() => {
    const ids = detector.value?.sortedSpeakingIds
    if (!ids) return [] as string[]
    return 'value' in ids ? ids.value : (ids as string[])
  })

  const connect = (room: any): void => {
    const det = initDetector()

    if (currentRoom.value === room && isConnected.value) {
      return
    }

    if (currentRoom.value && currentRoom.value !== room) {
      det.disconnect()
    }

    currentRoom.value = room
    isConnected.value = true
    det.connect(room)
  }

  const disconnect = (): void => {
    if (detector.value) {
      detector.value.disconnect()
    }
    currentRoom.value = null
    isConnected.value = false
  }

  const destroy = (): void => {
    if (detector.value) {
      detector.value.destroy()
      detector.value = null
    }
    currentRoom.value = null
    isConnected.value = false
  }

  const getCurrentRoom = (): any | null => currentRoom.value

  const getSpeakingState = (participantId: string): any => {
    if (!detector.value) {
      return null
    }
    return detector.value.getSpeakingState(participantId)
  }

  return {
    detector,
    currentRoom,
    isConnected,
    speakingStates,
    activeSpeaker,
    sortedSpeakingIds,
    initDetector,
    connect,
    disconnect,
    destroy,
    getCurrentRoom,
    getSpeakingState
  }
})

export type SpeakingDetectorStore = ReturnType<typeof useSpeakingDetectorStore>
