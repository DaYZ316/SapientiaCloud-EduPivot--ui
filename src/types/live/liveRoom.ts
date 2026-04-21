/**
 * 直播房间相关类型定义
 */
import type {PageEntity} from '../common/baseEntity'
import type {LiveRoomStatusEnum} from '@/enum/live/liveRoomStatusEnum'
import type {LiveRoomUserRoleEnum} from '@/enum/live/liveRoomRoleEnum'

/**
 * 直播房间创建 DTO（addLiveRoom）
 */
export interface LiveRoomCreateDTO {
    /** 房间名称 */
    roomName: string | null
    /** 课程ID */
    courseId?: string | null
    /** 课堂记录ID（mg_course_record.id） */
    classroomId: string | null
    /** 最大并发人数 */
    maxParticipants?: number | null
    /** 是否开启录制(0/1) - 用于更新房间时启用录制功能 */
    recordingEnabled?: number | null
}

/**
 * 直播房间访问令牌请求 DTO（issueRoomToken）
 */
export interface LiveRoomTokenRequestDTO {
    /** 用户角色(0=学生,1=老师,2=助教) */
    role: LiveRoomUserRoleEnum | null
    /** 直播会话ID */
    sessionId?: string | null
}

/**
 * 直播房间聊天消息 DTO（appendLiveRoomMessage）
 */
export interface LiveRoomMessageDTO {
    /** 消息内容 */
    content: string | null
    /** 消息类型(text/system等) */
    messageType?: string | null
    /** 发送人角色(0=学生,1=老师,2=助教) */
    senderRole?: LiveRoomUserRoleEnum | null
}

/**
 * 直播房间视图对象（getLiveRoomDetail / listLiveRooms）
 */
export interface LiveRoomVO {
    /** 房间ID */
    id: string
    /** 房间名称 */
    roomName: string
    /** 课程ID */
    courseId?: string
    /** 课堂记录ID（mg_course_record.id） */
    classroomId: string
    /** 最大并发人数 */
    maxParticipants?: number
    /** 是否开启录制(0/1) */
    recordingEnabled?: number
    /** 录制任务ID */
    egressTaskId?: string | null
    /** 录制状态(0=未录制,1=录制中,2=停止中,3=已停止,4=录制失败) */
    egressStatus?: number | null
    /** 录制文件访问URL */
    recordingAssetUrl?: string | null
    /** 房间状态 */
    status?: LiveRoomStatusEnum
    /** 房间创建时间 */
    createTime?: string
    /** 房间更新时间 */
    updateTime?: string
    /** 直播开始时间 */
    startTime?: string
    /** 预计结束时间 */
    expectedEndTime?: string
}

/**
 * 直播房间访问令牌响应对象
 */
export interface LiveRoomTokenVO {
    /** 访问令牌 */
    token: string
    /** 直播房间ID */
    roomId?: string
    /** 用户角色(0=学生,1=老师,2=助教) */
    role?: LiveRoomUserRoleEnum
    /** 过期时间 */
    expireAt?: string | null
    /** LiveKit 房间名称 */
    roomName?: string | null
    /** 直播会话ID */
    sessionId?: string | null
    /** 心跳间隔(秒) */
    heartbeatIntervalSeconds?: number | null
}

/**
 * 直播会话心跳/退出 DTO
 */
export interface LiveRoomSessionDTO {
    /** 直播房间ID */
    roomId: string | null
    /** 直播会话ID */
    sessionId: string | null
}

/**
 * 直播房间聊天消息视图对象
 */
export interface LiveRoomMessageVO {
    /** 消息ID */
    id?: string
    /** 房间ID */
    roomId?: string
    /** 消息内容 */
    content: string
    /** 消息类型(text/system等) */
    messageType?: string
    /** 发送人角色(0=学生,1=老师,2=助教) */
    senderRole?: LiveRoomUserRoleEnum | number
    /** 发送时间 */
    sendTime?: string
}

/**
 * 直播房间分页查询 DTO（listLiveRooms）
 */
export interface LiveRoomPageQueryDTO extends PageEntity {
    /** 房间状态 */
    status?: LiveRoomStatusEnum | number | string | null
    /** 课程ID */
    courseId?: string | null
    /** 课堂记录ID（mg_course_record.id） */
    classroomId?: string | null
}

/**
 * 直播房间聊天消息
 */
export interface LiveRoomChatMessage {
    /** 消息ID */
    id: string
    /** 发送者 */
    sender: string
    /** 消息内容 */
    content: string
    /** 时间戳 */
    timestamp: string
    /** 是否是本人发送的消息 */
    isOwn?: boolean
}

/**
 * 直播聊天总结消息上下文
 */
export interface LiveChatSummaryMessagePayload {
    /** 消息ID */
    id: string | null
    /** 发送者 */
    sender: string | null
    /** 消息内容 */
    content: string | null
    /** 时间戳 */
    timestamp: string | null
    /** 是否是本人发送的消息 */
    isOwn: boolean | null
}

/**
 * 直播聊天总结请求上下文
 */
export interface LiveChatSummaryRequestPayload {
    /** 直播房间ID */
    roomId: string | null
    /** 课堂记录ID */
    classroomId: string | null
    /** 课程ID */
    courseId: string | null
    /** 总结类型 */
    summaryType: 'brief' | 'detail' | 'questions' | 'actions' | 'teacher_review'
    /** 消息列表 */
    messages: LiveChatSummaryMessagePayload[]
}

/**
 * 远程参与者媒体信息
 */
export interface RemoteParticipantMedia {
    /** 参与者ID */
    participantId: string
    /** 参与者显示名 */
    displayName?: string | null
    /** 参与者角色 */
    role?: string | null
    /** 摄像头视频轨道 */
    videoTrack: any | null
    /** 屏幕共享视频轨道 */
    screenShareTrack: any | null
    /** 音频轨道 */
    audioTrack: any | null
    /** 是否正在说话 */
    isSpeaking?: boolean
    /** 音量级别 (0.0 - 1.0) */
    volumeLevel?: number
}

/**
 * 举手消息（通过 LiveKit DataChannel 传输）
 */
export interface HandRaiseMessage {
    /** 消息类型 */
    type: 'hand_raise'
    /** 举手者 participantId */
    participantId: string
    /** 举手者名称 */
    participantName: string
    /** 举手时间戳 */
    timestamp: number
}

/**
 * 举手状态（老师端使用）
 */
export interface HandRaiseState {
    /** 举手者 participantId */
    participantId: string
    /** 举手者名称 */
    participantName: string
    /** 举手时间戳 */
    raisedAt: number
    /** 剩余显示时间（秒） */
    remainingSeconds: number
}


