/**
 * 尝试从不同形式的 track / publication 中提取可用的 MediaStream
 */
export function extractMediaStreamFromTrack(trackCandidate: any): MediaStream | null {
    if (!trackCandidate) return null
    if (trackCandidate instanceof MediaStream) return trackCandidate
    if (trackCandidate.mediaStream && trackCandidate.mediaStream instanceof MediaStream) return trackCandidate.mediaStream
    if (trackCandidate.stream && trackCandidate.stream instanceof MediaStream) return trackCandidate.stream

    // 如果是 LiveKit 的 RemoteTrack 或 MediaStreamTrack，尝试创建 MediaStream
    try {
        // 如果是单个 MediaStreamTrack 或具有类似接口，构造 MediaStream
        if (trackCandidate.id || trackCandidate.kind) {
            return new MediaStream([trackCandidate as any])
        }
    } catch (e) {
        // 忽略错误，返回 null
    }

    return null
}

/**
 * 尝试将 LiveKit track 附加到 video 元素（支持 attach 或直接设置 srcObject）
 */
export function attachTrackToVideoElement(trackCandidate: any, videoEl: HTMLVideoElement | null): boolean {
    if (!videoEl || !trackCandidate) return false
    try {
        if (typeof (trackCandidate as any).attach === 'function') {
            ;(trackCandidate as any).attach(videoEl)
            return true
        }

        const ms = extractMediaStreamFromTrack(trackCandidate)
        if (ms) {
            videoEl.srcObject = ms
            videoEl.muted = true
            videoEl.play?.()
            return true
        }
    } catch (e) {
        // ignore
    }
    return false
}


