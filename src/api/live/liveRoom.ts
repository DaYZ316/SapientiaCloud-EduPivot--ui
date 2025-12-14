import http from '@/utils/http'
import type {
    LiveRoomCreateDTO,
    LiveRoomMessageDTO,
    LiveRoomMessageVO,
    LiveRoomPageQueryDTO,
    LiveRoomTokenRequestDTO,
    LiveRoomTokenVO,
    LiveRoomVO
} from '@/types/live'
import type {TableDataResult} from '@/types/common/baseEntity'

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
        role: null
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
 * 获取直播房间详情（getLiveRoomDetail）
 */
export function getLiveRoomDetail(id: string) {
    return http.get<LiveRoomVO>(`/live/live-room/${id}`)
}

/**
 * 兼容方法：根据直播房间ID获取详情
 * 与 getLiveRoomDetail 等价
 */
export function getLiveRoomById(id: string) {
    return getLiveRoomDetail(id)
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
 * 创建直播房间并返回房间信息（addLiveRoom）
 */
export function addLiveRoom(data: LiveRoomCreateDTO) {
    return http.post<LiveRoomVO>('/live/live-room/add', data)
}

/**
 * 兼容方法：创建直播房间并返回房间信息
 * 与 addLiveRoom 等价
 */
export function createLiveRoom(data: LiveRoomCreateDTO) {
    return addLiveRoom(data)
}

/**
 * 根据房间ID关闭直播房间（closeLiveRoom）
 */
export function closeLiveRoom(id: string) {
    return http.post<boolean>(`/live/live-room/close/${id}`)
}

/**
 * 分页查询直播房间列表（listLiveRooms）
 */
export function listLiveRooms(params: LiveRoomPageQueryDTO) {
    return http.get<TableDataResult<LiveRoomVO>>('/live/live-room/list', params)
}

/**
 * 根据房间ID与用户角色签发访问令牌（issueRoomToken）
 */
export function issueRoomToken(id: string, data: LiveRoomTokenRequestDTO) {
    return http.post<LiveRoomTokenVO>(`/live/live-room/token/${id}`, data)
}

/**
 * 兼容方法：根据房间ID与用户角色签发访问令牌
 * 与 issueRoomToken 等价
 */
export function issueLiveRoomToken(id: string, data: LiveRoomTokenRequestDTO) {
    return issueRoomToken(id, data)
}

