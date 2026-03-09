import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { extractMediaStreamFromTrack } from '@/views/live/LiveRoom/composables/mediaHelpers'
import { RoomEvent, Track } from 'livekit-client'
import { useSpeakingDetectorStore } from '@/stores/speakingDetector'

interface PiPWindowState {
  isOpen: boolean
  windowRef: Window | null
  videoElement: HTMLVideoElement | null
}

export const useLivePiPStore = defineStore('livePiP', () => {
  const isInPiPMode = ref<boolean>(false)
  const activeSession = ref<any>(null)
  const justRestoredFromPiP = ref<boolean>(false)
  const pipWindow = ref<PiPWindowState>({
    isOpen: false,
    windowRef: null,
    videoElement: null
  })

  let pipListenerRoom: any = null
  let trackSubscribedHandler: ((track: any, pub: any, participant: any) => void) | null = null

  const hasActiveLive = computed<boolean>(() => {
    return activeSession.value !== null && activeSession.value.connection !== null
  })

  const isPiPSupported = computed<boolean>(() => {
    return document.pictureInPictureEnabled !== undefined
  })

  const enterPiPMode = (session: any): void => {
    if (!session || !session.connection) {
      return
    }

    activeSession.value = session
    isInPiPMode.value = true

    createPiPWindow()

    if ((!activeSession.value?.videoStream || !activeSession.value?.screenShareStream) && activeSession.value?.connection) {
      const room = activeSession.value.connection as any
      const participantId = activeSession.value.participantId

      if (pipListenerRoom && trackSubscribedHandler && typeof pipListenerRoom.off === 'function') {
        pipListenerRoom.off(RoomEvent.TrackSubscribed, trackSubscribedHandler)
      }

      trackSubscribedHandler = (track: any, publication: any, participant: any) => {
        const participantIdentity = participant?.identity

        if (participantId !== 'local' && participantIdentity !== participantId) return
        if (participantId === 'local' && participant !== room.localParticipant && participantIdentity !== room.localParticipant?.identity) return
        if (!track || (track.kind && track.kind !== 'video')) return

        const isScreenShare = publication?.source === Track.Source.ScreenShare
        const mediaStream = extractMediaStreamFromTrack(track) || new MediaStream([track as any])

        if (isScreenShare) {
          if (activeSession.value) {
            activeSession.value = { ...activeSession.value, screenShareStream: mediaStream }
          }
        } else {
          if (activeSession.value) {
            activeSession.value = { ...activeSession.value, videoStream: mediaStream }
          }
        }
      }

      if (room && typeof room.on === 'function') {
        room.on(RoomEvent.TrackSubscribed, trackSubscribedHandler)
        pipListenerRoom = room
      }
    }
  }

  const exitPiPMode = (): void => {
    closePiPWindow()
    justRestoredFromPiP.value = true
    isInPiPMode.value = false
  }

  const clearRestoredFromPiPFlag = (): void => {
    justRestoredFromPiP.value = false
  }

  const setActiveSession = (session: any): void => {
    activeSession.value = session
  }

  const forceDisconnect = async (): Promise<void> => {
    const detectorStore = useSpeakingDetectorStore()
    detectorStore.destroy()

    if (activeSession.value?.connection && typeof activeSession.value.connection.disconnect === 'function') {
      activeSession.value.connection.disconnect()
    }

    if (activeSession.value?.roomId && activeSession.value?.sessionId) {
      const liveApi = await import('@/api/live')
      const payload = liveApi.getDefaultLiveRoomSessionDTO()
      payload.roomId = activeSession.value.roomId
      payload.sessionId = activeSession.value.sessionId
      await liveApi.leaveLiveRoom(payload)
    }

    closePiPWindow()

    activeSession.value = null
    justRestoredFromPiP.value = false
    isInPiPMode.value = false
  }

  const createPiPWindow = (): void => {
    if (pipWindow.value.isOpen) {
      return
    }

    if (activeSession.value && !activeSession.value.videoStream) {
      const session: any = activeSession.value
      const room = session.connection
      const participantId = session.participantId
      let videoStream: MediaStream | null = null
      let screenShareStream: MediaStream | null = null

      const tryExtractFromParticipant = (participant: any) => {
        if (!participant) return { video: null, screenShare: null }
        const publications: any[] = Array.from(participant.videoTrackPublications?.values?.() ?? [])
        let video: MediaStream | null = null
        let screenShare: MediaStream | null = null

        for (const publication of publications) {
          const track = publication && (publication.track || publication)
          if (!track) continue

          if (publication.source === Track.Source.ScreenShare) {
            const mediaStream = extractMediaStreamFromTrack(track)
            screenShare = mediaStream || new MediaStream([track as any])
          } else if (!video && track.kind === 'video') {
            const mediaStream = extractMediaStreamFromTrack(track)
            video = mediaStream || new MediaStream([track as any])
          }
        }

        return { video, screenShare }
      }

      if (participantId === 'local') {
        const localParticipant: any = room.localParticipant
        const result = tryExtractFromParticipant(localParticipant)
        videoStream = result.video
        screenShareStream = result.screenShare
      } else {
        const remoteParticipant = (room.remoteParticipants && room.remoteParticipants.get && room.remoteParticipants.get(participantId)) ||
          Array.from(room.remoteParticipants ? room.remoteParticipants.values() : []).find((p: any) => p.identity === participantId)
        const result = tryExtractFromParticipant(remoteParticipant)
        videoStream = result.video
        screenShareStream = result.screenShare
      }

      if (videoStream || screenShareStream) {
        activeSession.value = {
          ...activeSession.value,
          ...(videoStream && { videoStream }),
          ...(screenShareStream && { screenShareStream })
        }
      }
    }
  }

  const closePiPWindow = (): void => {
    if (!pipWindow.value.isOpen) {
      return
    }

    if (pipWindow.value.windowRef) {
      pipWindow.value.windowRef.close()
    } else if (pipWindow.value.videoElement) {
      pipWindow.value.videoElement.pause?.()
      pipWindow.value.videoElement.srcObject = null
    }

    if (pipListenerRoom && trackSubscribedHandler && typeof pipListenerRoom.off === 'function') {
      pipListenerRoom.off(RoomEvent.TrackSubscribed, trackSubscribedHandler)
    }

    pipListenerRoom = null
    trackSubscribedHandler = null

    pipWindow.value = {
      isOpen: false,
      windowRef: null,
      videoElement: null
    }
  }

  const findVideoElement = (): HTMLVideoElement | null => {
    const selectors = [
      '.video-panel .main-video video',
      '.video-panel .local-video video',
      '.video-panel video',
      'video'
    ]

    for (const selector of selectors) {
      const videos = document.querySelectorAll(selector)
      for (const video of videos) {
        const element = video as HTMLVideoElement
        if (element.srcObject || element.currentSrc || element.readyState >= 2) {
          return element
        }
      }
    }

    return null
  }

  return {
    isInPiPMode,
    activeSession,
    justRestoredFromPiP,
    pipWindow,
    hasActiveLive,
    isPiPSupported,
    enterPiPMode,
    exitPiPMode,
    forceDisconnect,
    createPiPWindow,
    closePiPWindow,
    findVideoElement,
    setActiveSession,
    clearRestoredFromPiPFlag
  }
})
