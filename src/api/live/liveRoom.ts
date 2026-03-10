import http from '@/utils/http'
import type {
    LiveRoomCreateDTO,
    LiveRoomMessageDTO,
    LiveRoomMessageVO,
    LiveRoomPageQueryDTO,
    LiveRoomSessionDTO,
    LiveRoomTokenRequestDTO,
    LiveRoomTokenVO,
    LiveRoomVO
} from '@/types/live'
import {defaultServerConfig} from '@/config/server'

/**
 * 获取默认直播房间创建 DTO
 * 注意：roomName 和 classroomId 为必填字段，需要在使用时设置
 */
export function getDefaultLiveRoomCreateDTO(): Partial<LiveRoomCreateDTO> {
    return {
        courseId: null,
        maxParticipants: null,
        recordingEnabled: 0
    }
}

/**
 * 获取默认直播房间令牌请求 DTO
 */
export function getDefaultLiveRoomTokenRequestDTO(): LiveRoomTokenRequestDTO {
    return {
        role: null,
        sessionId: null
    }
}

/**
 * 获取默认直播房间消息 DTO
 * 注意：content 为必填字段，需要在使用时设置
 */
export function getDefaultLiveRoomMessageDTO(): Partial<LiveRoomMessageDTO> {
    return {
        messageType: 'text',
        senderRole: null
    }
}

/**
 * 获取默认直播会话 DTO
 */
export function getDefaultLiveRoomSessionDTO(): LiveRoomSessionDTO {
    return {
        roomId: null,
        sessionId: null
    }
}

/**
 * 获取默认直播房间分页查询 DTO
 */
export function getDefaultLiveRoomPageQueryDTO(): Partial<LiveRoomPageQueryDTO> {
    return {
        pageNum: 1,
        pageSize: 10,
        startTime: null,
        endTime: null,
        orderByColumn: null,
        isAsc: null,
        reasonable: null,
        status: null,
        courseId: null,
        classroomId: null
    }
}

/**
 * 根据直播房间ID获取详情
 */
export function getLiveRoomById(id: string) {
    return http.get<LiveRoomVO>(`/live/live-room/${id}`)
}

/**
 * 追加一条直播房间聊天消息（appendLiveRoomMessage）
 */
export function appendLiveRoomMessage(id: string, data: LiveRoomMessageDTO) {
    return http.post<LiveRoomMessageVO>(`/live/live-room/${id}/message`, data)
}

/**
 * 获取直播房间最近的聊天消息（listLiveRoomMessages）
 */
export function listLiveRoomMessages(id: string, limit?: number) {
    return http.get<LiveRoomMessageVO[]>(`/live/live-room/${id}/messages`, {limit})
}

/**
 * 手动开启直播录制（startRecording）
 */
export function startRecording(id: string) {
    return http.post<LiveRoomVO>(`/live/live-room/${id}/record/start`)
}

/**
 * 手动停止直播录制（stopRecording）
 */
export function stopRecording(id: string) {
    return http.post<LiveRoomVO>(`/live/live-room/${id}/record/stop`)
}

/**
 * 创建直播房间并返回房间信息
 */
export function createLiveRoom(data: LiveRoomCreateDTO) {
    return http.post<LiveRoomVO>('/live/live-room/add', data)
}


/**
 * 分页查询直播房间列表（listLiveRooms）
 */
export function listLiveRooms(params: LiveRoomPageQueryDTO) {
    return http.getTableData<LiveRoomVO>('/live/live-room/list', params)
}

/**
 * 根据房间ID与用户角色签发访问令牌
 */
export function issueLiveRoomToken(id: string, data: LiveRoomTokenRequestDTO) {
    return http.post<LiveRoomTokenVO>(`/live/live-room/token/${id}`, data)
}

/**
 * 直播会话心跳
 */
export function heartbeatLiveRoom(data: LiveRoomSessionDTO) {
    return http.post<boolean>('/live/live-room/heartbeat', data)
}

/**
 * 退出直播并释放会话
 */
export function leaveLiveRoom(data: LiveRoomSessionDTO) {
    return http.post<boolean>('/live/live-room/leave', data)
}

/**
 * 页面关闭场景的离会兜底上报：
 * - 优先使用 fetch(keepalive) 携带 Authorization
 * - 降级为 sendBeacon（若后端支持 cookie 认证）
 */
export function leaveLiveRoomOnPageUnload(data: LiveRoomSessionDTO): void {
    if (!data?.roomId || !data?.sessionId) {
        return
    }

    const endpoint = `${defaultServerConfig.prefix}/live/live-room/leave`
    const payload = JSON.stringify(data)
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

    try {
        if (typeof fetch === 'function') {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json'
            }
            if (token) {
                headers.Authorization = `Bearer ${token}`
            }
            void fetch(endpoint, {
                method: 'POST',
                headers,
                body: payload,
                keepalive: true,
                credentials: 'include'
            })
            return
        }
    } catch {
        // fallback to beacon below
    }

    try {
        if (typeof navigator !== 'undefined' && typeof navigator.sendBeacon === 'function') {
            const blob = new Blob([payload], {type: 'application/json'})
            navigator.sendBeacon(endpoint, blob)
        }
    } catch {
        // ignore
    }
}

/**
 * 获取当前课堂/课程的进行中房间（若存在）
 */
export function getActiveLiveRoom(courseId?: string | null, classroomId?: string | null) {
    return http.get<LiveRoomVO>('/live/live-room/active', {courseId, classroomId})
}

/**
 * 获取当前课堂/课程的最新房间（不按状态过滤）
 */
export function getLatestLiveRoom(courseId?: string | null, classroomId?: string | null) {
    return http.get<LiveRoomVO>('/live/live-room/latest', {courseId, classroomId})
}

/**
 * 开始直播（将房间状态置为 LIVE）
 */
export function startLiveRoom(id: string) {
    return http.post<LiveRoomVO>(`/live/live-room/start/${id}`)
}

/**
 * 结束直播（将房间状态置为 ENDED）
 */
export function endLiveRoom(id: string) {
    return http.post<LiveRoomVO>(`/live/live-room/end/${id}`)
}

/**
 * 获取短期 SSE token（需登录），用于 EventSource 订阅
 */
export function getSseToken(classroomId?: string | null) {
    return http.post<string>('/live/live/sse-token', null, {params: {classroomId}})
}

/**
 * 获取房间在线成员数量
 */
export function getRoomMemberCount(roomId: string) {
    return http.get<number>(`/live/live-room/${roomId}/members/count`)
}

