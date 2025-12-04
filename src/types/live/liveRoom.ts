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
    /** 是否开启录制(0/1) */
    recordingEnabled?: number | null
}

/**
 * 直播房间访问令牌请求 DTO（issueRoomToken）
 */
export interface LiveRoomTokenRequestDTO {
    /** 用户角色(0=学生,1=老师,2=助教) */
    role: LiveRoomUserRoleEnum | null
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
    /** 房间状态 */
    status?: LiveRoomStatusEnum
    /** 房间创建时间 */
    createTime?: string
    /** 房间更新时间 */
    updateTime?: string
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


