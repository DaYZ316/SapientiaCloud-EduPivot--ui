import type {Ref} from 'vue'
import {readonly, ref, watch} from 'vue'
import type {Room} from 'livekit-client'
import {ConnectionState, RoomEvent, Track} from 'livekit-client'
import {useI18n} from 'vue-i18n'
import {useErrorHandler} from './useErrorHandler'
import {useRetryMechanism} from './useRetryMechanism'

export interface MediaDevicesResult {

    cameraEnabled: boolean
    microphoneEnabled: boolean
    screenShareEnabled: boolean

    toggleCamera: () => Promise<void>
    toggleMicrophone: () => Promise<void>
    toggleScreenShare: () => Promise<void>
    setupLocalMedia: (targetRoom: Room) => Promise<void>
    syncLocalMediaState: (targetRoom?: Room | null) => void

    diagnoseCameraIssues: () => Promise<string>
    diagnoseMicrophoneIssues: () => Promise<string>
}

export const useMediaDevices = (room: Ref<Room | null>) => {
    const {t} = useI18n()

    const errorHandler = useErrorHandler()
    const retryMechanism = useRetryMechanism()

    const cameraEnabled = ref<boolean>(false)
    const microphoneEnabled = ref<boolean>(false)
    const screenShareEnabled = ref<boolean>(false)

    let listenerRoom: Room | null = null
    let roomEventHandlers: Array<{ event: RoomEvent; handler: (...args: unknown[]) => void }> = []

    const isPublicationActive = (publication: unknown): boolean => {
        const pub = publication as { track?: unknown; isMuted?: boolean } | null | undefined
        if (!pub) {
            return false
        }
        if (!pub.track) {
            return false
        }
        if (typeof pub.isMuted === 'boolean') {
            return !pub.isMuted
        }
        return true
    }

    const syncLocalMediaState = (targetRoom: Room | null = room.value): void => {
        if (!targetRoom || targetRoom.state !== ConnectionState.Connected || !targetRoom.localParticipant) {
            cameraEnabled.value = false
            microphoneEnabled.value = false
            screenShareEnabled.value = false
            return
        }

        const localParticipant = targetRoom.localParticipant
        const videoPublications = Array.from(localParticipant.videoTrackPublications?.values?.() ?? [])
        const audioPublications = Array.from(localParticipant.audioTrackPublications?.values?.() ?? [])

        const hasCameraTrack = videoPublications.some((publication: any) => {
            return publication?.source === Track.Source.Camera && isPublicationActive(publication)
        })
        const hasScreenShareTrack = videoPublications.some((publication: any) => {
            return publication?.source === Track.Source.ScreenShare && isPublicationActive(publication)
        })
        const hasMicrophoneTrack = audioPublications.some((publication: any) => {
            return publication?.source === Track.Source.Microphone && isPublicationActive(publication)
        })

        const cameraFlag = typeof localParticipant.isCameraEnabled === 'boolean' ? localParticipant.isCameraEnabled : null
        const microphoneFlag = typeof localParticipant.isMicrophoneEnabled === 'boolean' ? localParticipant.isMicrophoneEnabled : null
        const screenShareFlag = typeof localParticipant.isScreenShareEnabled === 'boolean' ? localParticipant.isScreenShareEnabled : null

        cameraEnabled.value = cameraFlag === null ? hasCameraTrack : cameraFlag || hasCameraTrack
        microphoneEnabled.value = microphoneFlag === null ? hasMicrophoneTrack : microphoneFlag || hasMicrophoneTrack
        screenShareEnabled.value = screenShareFlag === null ? hasScreenShareTrack : screenShareFlag || hasScreenShareTrack
    }

    const isLocalParticipantEvent = (targetRoom: Room, participant: any): boolean => {
        if (!participant) {
            return false
        }
        return participant === targetRoom.localParticipant ||
            participant.identity === targetRoom.localParticipant?.identity ||
            participant.sid === targetRoom.localParticipant?.sid
    }

    const unbindRoomEvents = (): void => {
        if (!listenerRoom) {
            return
        }
        roomEventHandlers.forEach(({event, handler}) => {
            listenerRoom?.off(event, handler as any)
        })
        roomEventHandlers = []
        listenerRoom = null
    }

    const bindRoomEvents = (targetRoom: Room): void => {
        unbindRoomEvents()
        listenerRoom = targetRoom

        const addListener = (event: RoomEvent, handler: (...args: any[]) => void) => {
            targetRoom.on(event, handler as any)
            roomEventHandlers.push({event, handler})
        }

        addListener(RoomEvent.LocalTrackPublished, () => {
            syncLocalMediaState(targetRoom)
        })
        addListener(RoomEvent.LocalTrackUnpublished, () => {
            syncLocalMediaState(targetRoom)
        })
        addListener(RoomEvent.TrackMuted, (_publication: any, participant: any) => {
            if (isLocalParticipantEvent(targetRoom, participant)) {
                syncLocalMediaState(targetRoom)
            }
        })
        addListener(RoomEvent.TrackUnmuted, (_publication: any, participant: any) => {
            if (isLocalParticipantEvent(targetRoom, participant)) {
                syncLocalMediaState(targetRoom)
            }
        })
        addListener(RoomEvent.Reconnected, () => {
            syncLocalMediaState(targetRoom)
        })
        addListener(RoomEvent.Disconnected, () => {
            syncLocalMediaState(null)
        })
    }

    watch(
        room,
        (currentRoom, previousRoom) => {
            if (previousRoom && previousRoom !== currentRoom) {
                unbindRoomEvents()
            }
            if (!currentRoom) {
                syncLocalMediaState(null)
                return
            }
            bindRoomEvents(currentRoom)
            syncLocalMediaState(currentRoom)
        },
        {immediate: true}
    )

    const safeAsyncCall = async <T>(operation: () => Promise<T>, fallbackError: string): Promise<T> => {
        try {
            return await operation()
        } catch (error) {

            if (error instanceof Error && error.name === 'DataCloneError') {
                throw new Error(fallbackError)
            }
            throw error
        }
    }

    const toggleCamera = async (): Promise<void> => {
        const currentRoom = room.value
        if (!currentRoom) {
            errorHandler.handleError({
                name: 'ConnectionError',
                message: t('live.room.notConnected')
            }, 'media_camera_toggle', {
                showNotification: true,
                customMessage: t('live.room.notConnected')
            })
            return
        }

        if (currentRoom.state !== ConnectionState.Connected) {
            errorHandler.handleError({
                name: 'ConnectionError',
                message: t('live.room.cannotToggleCamera')
            }, 'media_camera_toggle', {
                showNotification: true,
                customMessage: t('live.room.cannotToggleCamera')
            })
            return
        }

        safeAsyncCall(
            () => currentRoom.startAudio(),
            t('live.media.audioContextStartFailed')
        ).catch(() => {

        })

        const enabled = !cameraEnabled.value

        try {

            if (enabled && navigator?.mediaDevices?.enumerateDevices) {
                const devices = await navigator.mediaDevices.enumerateDevices()
                const hasVideoInput = devices.some(d => d.kind === 'videoinput')
                if (!hasVideoInput) {
                    const notFoundErr: any = new Error(t('live.media.cameraNotFound'))
                    notFoundErr.name = 'NotFoundError'
                    throw notFoundErr
                }
            }

            await retryMechanism.retry(
                async () => {
                    if (!enabled) {

                        await safeAsyncCall(
                            () => currentRoom.localParticipant.setCameraEnabled(false),
                            t('live.media.cameraDisableFailed')
                        )
                        cameraEnabled.value = false
                    } else {

                        try {

                            const existingVideoTracks = Array.from(currentRoom.localParticipant.videoTrackPublications.values())
                            if (existingVideoTracks.length > 0) {
                                safeAsyncCall(
                                    () => currentRoom.localParticipant.setCameraEnabled(false),
                                    t('live.media.cameraCleanupFailed')
                                ).then(() => {

                                    return new Promise(resolve => setTimeout(resolve, 300))
                                }).catch(() => {

                                })
                            }

                            const enablePromise = safeAsyncCall(
                                () => currentRoom.localParticipant.setCameraEnabled(true),
                                t('live.media.cameraEnableFailed')
                            )
                            const timeoutPromise = new Promise((_, reject) =>
                                setTimeout(() => reject(new Error(t('live.media.cameraEnableTimeout'))), 10000)
                            )

                            await Promise.race([enablePromise, timeoutPromise])
                            cameraEnabled.value = true

                            await new Promise(resolve => setTimeout(resolve, 100))
                            syncLocalMediaState(currentRoom)

                            const videoTracks = Array.from(currentRoom.localParticipant.videoTrackPublications.values())
                            if (videoTracks.length === 0) {
                                throw new Error(t('live.media.cameraPublishFailed'))
                            }

                            await new Promise(resolve => setTimeout(resolve, 300))

                        } catch (trackError: any) {
                            cameraEnabled.value = false

                            const enhancedError = new Error(trackError?.message || t('live.media.cameraEnableFailed'))
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

            const safeError = {name: 'MediaError', message: t('live.media.operationFailed')}

            const customMessage = error?.message || t('live.media.cameraStartFailed')

            errorHandler.handleError(safeError, 'media_camera_toggle', {
                showNotification: true,
                customMessage,
                allowRetry: retryMechanism.isRetryableError(error),
                onRetry: () => toggleCamera()
            })

            cameraEnabled.value = false
        }
    }

    const toggleMicrophone = async (): Promise<void> => {
        const currentRoom = room.value
        if (!currentRoom) {
            errorHandler.handleError({
                name: 'ConnectionError',
                message: t('live.room.notConnected')
            }, 'media_microphone_toggle', {
                showNotification: true,
                customMessage: t('live.room.notConnected')
            })
            return
        }

        if (currentRoom.state !== ConnectionState.Connected) {
            errorHandler.handleError({
                name: 'ConnectionError',
                message: t('live.room.cannotToggleMicrophone')
            }, 'media_microphone_toggle', {
                showNotification: true,
                customMessage: t('live.room.cannotToggleMicrophone')
            })
            return
        }

        try {
            await safeAsyncCall(
                () => currentRoom.startAudio(),
                t('live.media.audioContextStartFailed')
            )
        } catch (error: any) {

        }

        const enabled = !microphoneEnabled.value

        try {
            await retryMechanism.retry(
                async () => {
                    if (!enabled) {

                        await safeAsyncCall(
                            () => currentRoom.localParticipant.setMicrophoneEnabled(false),
                            t('live.media.microphoneDisableFailed')
                        )
                        microphoneEnabled.value = false
                    } else {

                        try {

                            const existingAudioTracks = Array.from(currentRoom.localParticipant.audioTrackPublications.values())
                            if (existingAudioTracks.length > 0) {
                                try {
                                    await safeAsyncCall(
                                        () => currentRoom.localParticipant.setMicrophoneEnabled(false),
                                        t('live.media.microphoneCleanupFailed')
                                    )

                                    await new Promise(resolve => setTimeout(resolve, 300))
                                } catch (cleanupError: any) {

                                }
                            }

                            await safeAsyncCall(
                                () => currentRoom.localParticipant.setMicrophoneEnabled(true),
                                t('live.media.microphoneEnableFailed')
                            )
                            microphoneEnabled.value = true

                            await new Promise(resolve => setTimeout(resolve, 100))
                            syncLocalMediaState(currentRoom)

                        } catch (trackError: any) {
                            microphoneEnabled.value = false

                            const enhancedError = new Error(t('live.media.microphoneEnableFailed'))
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

            const safeError = {name: 'MediaError', message: t('live.media.operationFailed')}

            const customMessage = error?.message || t('live.media.microphoneStartFailed')

            errorHandler.handleError(safeError, 'media_microphone_toggle', {
                showNotification: true,
                customMessage,
                allowRetry: retryMechanism.isRetryableError(error),
                onRetry: () => toggleMicrophone()
            })

            microphoneEnabled.value = false
        }
    }

    const toggleScreenShare = async (): Promise<void> => {
        const currentRoom = room.value
        if (!currentRoom) {
            errorHandler.handleError({
                name: 'ConnectionError',
                message: t('live.room.notConnected')
            }, 'media_screenShare_toggle', {
                showNotification: true,
                customMessage: t('live.room.notConnected')
            })
            return
        }

        if (currentRoom.state !== ConnectionState.Connected) {
            errorHandler.handleError({
                name: 'ConnectionError',
                message: t('live.room.cannotToggleScreenShare')
            }, 'media_screenShare_toggle', {
                showNotification: true,
                customMessage: t('live.room.cannotToggleScreenShare')
            })
            return
        }

        const enabled = !screenShareEnabled.value

        try {
            await retryMechanism.retry(
                async () => {
                    if (!enabled) {

                        await safeAsyncCall(
                            () => currentRoom.localParticipant.setScreenShareEnabled(false),
                            t('live.media.screenShareDisableFailed')
                        )
                        screenShareEnabled.value = false
                    } else {

                        await safeAsyncCall(
                            () => currentRoom.localParticipant.setScreenShareEnabled(true),
                            t('live.media.screenShareEnableFailed')
                        )
                        screenShareEnabled.value = true

                        await new Promise(resolve => setTimeout(resolve, 100))
                        syncLocalMediaState(currentRoom)

                        const screenShareTracks = Array.from(currentRoom.localParticipant.videoTrackPublications.values())
                            .filter(pub => pub.source === Track.Source.ScreenShare)

                        screenShareTracks.forEach(pub => {
                            if (pub.track) {
                                pub.track.on('ended', () => {
                                    screenShareEnabled.value = false
                                })
                            }
                        })
                    }
                },
                {
                    maxRetries: 2,
                    retryCondition: (error) => retryMechanism.isRetryableError(error)
                }
            )
        } catch (error: any) {
            const safeError = {name: 'MediaError', message: t('live.media.operationFailed')}

            const customMessage = error?.message || t('live.media.screenShareStartFailed')

            errorHandler.handleError(safeError, 'media_screenShare_toggle', {
                showNotification: true,
                customMessage,
                allowRetry: retryMechanism.isRetryableError(error),
                onRetry: () => toggleScreenShare()
            })

            screenShareEnabled.value = false
        }
    }

    const setupLocalMedia = async (targetRoom: Room): Promise<void> => {
        if (targetRoom.state !== ConnectionState.Connected) {
            return
        }


        try {

            await new Promise(resolve => setTimeout(resolve, 100))
            syncLocalMediaState(targetRoom)
        } catch (error) {

            microphoneEnabled.value = false
            cameraEnabled.value = false
            screenShareEnabled.value = false

            errorHandler.handleError(error, 'media_setup', {
                showNotification: true,
                customMessage: t('live.room.mediaSetupFailed')
            })
        }
    }

    const getConnectionStateText = (state: ConnectionState): string => {
        switch (state) {
            case ConnectionState.Connecting:
                return t('live.room.connecting')
            case ConnectionState.Reconnecting:
                return t('live.room.reconnecting')
            case ConnectionState.Disconnected:
                return t('live.room.disconnected')
            default:
                return t('live.room.connectFailed')
        }
    }

    const diagnoseCameraIssues = async (): Promise<string> => {
        const diagnostics: string[] = []

        try {

            const currentRoom = room.value
            if (!currentRoom) {
                diagnostics.push(t('live.diagnostics.roomNotConnected'))
                return diagnostics.join('\n')
            }

            if (currentRoom.state !== ConnectionState.Connected) {
                diagnostics.push(t('live.diagnostics.roomConnectionState', {state: getConnectionStateText(currentRoom.state)}))
                return diagnostics.join('\n')
            }

            diagnostics.push(t('live.diagnostics.roomConnectionOk'))

            try {
                const permissionStatus = await navigator.permissions.query({name: 'camera' as PermissionName})
                diagnostics.push(t('live.diagnostics.cameraPermissionState', {state: permissionStatus.state}))
            } catch {
                diagnostics.push(t('live.diagnostics.cameraPermissionUnavailable'))
            }

            if (navigator.mediaDevices?.enumerateDevices) {
                try {
                    const devices = await navigator.mediaDevices.enumerateDevices()
                    const videoDevices = devices.filter(d => d.kind === 'videoinput')
                    diagnostics.push(t('live.diagnostics.cameraDevicesDetected', {count: videoDevices.length}))

                    if (videoDevices.length > 0) {
                        videoDevices.forEach((device, index) => {
                            diagnostics.push(t('live.diagnostics.deviceLabelLine', {
                                index: index + 1,
                                label: device.label || t('live.diagnostics.deviceLabelUnknown'),
                                id: device.deviceId.slice(0, 8)
                            }))
                        })
                    }
                } catch (error: any) {
                    diagnostics.push(t('live.diagnostics.deviceEnumFailed', {error: error?.message || t('live.common.unknownError')}))
                }
            }

            const existingVideoTracks = Array.from(currentRoom.localParticipant.videoTrackPublications.values())
            diagnostics.push(t('live.diagnostics.currentVideoTracks', {count: existingVideoTracks.length}))

            if (diagnostics.some(d => /error|failed|not|denied|unavailable|disconnect/i.test(d))) {
                diagnostics.push(t('live.diagnostics.suggestTitle'))
                diagnostics.push(t('live.diagnostics.suggestCameraPermission'))
                diagnostics.push(t('live.diagnostics.suggestCameraHardware'))
                diagnostics.push(t('live.diagnostics.suggestCameraOccupied'))
                diagnostics.push(t('live.diagnostics.suggestRefresh'))
            } else {
                diagnostics.push(t('live.diagnostics.ok'))
            }

        } catch (error: any) {
            diagnostics.push(t('live.diagnostics.error', {error: error?.message || t('live.common.unknownError')}))
        }

        return diagnostics.join('\n')
    }

    const diagnoseMicrophoneIssues = async (): Promise<string> => {
        const diagnostics: string[] = []

        try {

            const currentRoom = room.value
            if (!currentRoom) {
                diagnostics.push(t('live.diagnostics.roomNotConnected'))
                return diagnostics.join('\n')
            }

            if (currentRoom.state !== ConnectionState.Connected) {
                diagnostics.push(t('live.diagnostics.roomConnectionState', {state: getConnectionStateText(currentRoom.state)}))
                return diagnostics.join('\n')
            }

            diagnostics.push(t('live.diagnostics.roomConnectionOk'))

            try {
                const permissionStatus = await navigator.permissions.query({name: 'microphone' as PermissionName})
                diagnostics.push(t('live.diagnostics.microphonePermissionState', {state: permissionStatus.state}))
            } catch {
                diagnostics.push(t('live.diagnostics.microphonePermissionUnavailable'))
            }

            if (navigator.mediaDevices?.enumerateDevices) {
                try {
                    const devices = await navigator.mediaDevices.enumerateDevices()
                    const audioDevices = devices.filter(d => d.kind === 'audioinput')
                    diagnostics.push(t('live.diagnostics.microphoneDevicesDetected', {count: audioDevices.length}))

                    if (audioDevices.length > 0) {
                        audioDevices.forEach((device, index) => {
                            diagnostics.push(t('live.diagnostics.deviceLabelLine', {
                                index: index + 1,
                                label: device.label || t('live.diagnostics.deviceLabelUnknown'),
                                id: device.deviceId.slice(0, 8)
                            }))
                        })
                    }
                } catch (error: any) {
                    diagnostics.push(t('live.diagnostics.deviceEnumFailed', {error: error?.message || t('live.common.unknownError')}))
                }
            }

            const existingAudioTracks = Array.from(currentRoom.localParticipant.audioTrackPublications.values())
            diagnostics.push(t('live.diagnostics.currentAudioTracks', {count: existingAudioTracks.length}))

            if (diagnostics.some(d => /error|failed|not|denied|unavailable|disconnect/i.test(d))) {
                diagnostics.push(t('live.diagnostics.suggestTitle'))
                diagnostics.push(t('live.diagnostics.suggestMicrophonePermission'))
                diagnostics.push(t('live.diagnostics.suggestMicrophoneHardware'))
                diagnostics.push(t('live.diagnostics.suggestMicrophoneOccupied'))
                diagnostics.push(t('live.diagnostics.suggestRefresh'))
            } else {
                diagnostics.push(t('live.diagnostics.ok'))
            }

        } catch (error: any) {
            diagnostics.push(t('live.diagnostics.error', {error: error?.message || t('live.common.unknownError')}))
        }

        return diagnostics.join('\n')
    }

    return {

        cameraEnabled: readonly(cameraEnabled),
        microphoneEnabled: readonly(microphoneEnabled),
        screenShareEnabled: readonly(screenShareEnabled),

        toggleCamera,
        toggleMicrophone,
        toggleScreenShare,
        setupLocalMedia,
        syncLocalMediaState,

        diagnoseCameraIssues,
        diagnoseMicrophoneIssues
    }
}

