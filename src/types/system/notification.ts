/**
 * 通知相关类型定义
 */
import type { PageEntity } from '../common/baseEntity'
import type { NotificationType, NotificationReadStatus, NotificationScopeType } from '@/enum/system/notificationTypeEnum'

/**
 * 通知视图对象
 */
export interface NotificationVO {
    /** 通知ID */
    id: string
    /** 接收用户ID */
    userId: string
    /** 通知标题 */
    title: string
    /** 通知内容（富文本HTML） */
    content: string
    /** 附件URL列表（JSON字符串或URL数组，前端与MinIO配合使用） */
    attachmentUrls: string
    /** 通知类型 (0=系统通知, 1=课程通知, 2=作业通知, 3=直播通知, 4=其他) */
    type: NotificationType
    /** 通知类型标签 */
    typeLabel: string
    /** 阅读状态 (0=未读, 1=已读) */
    status: NotificationReadStatus
    /** 阅读状态标签 */
    statusLabel: string
    /** 阅读时间 */
    readTime: string
    /** 发送者ID */
    senderId: string
    /** 发送者名称 */
    senderName: string
    /** 创建时间 */
    createTime: string
    /** 更新时间 */
    updateTime: string
}

/**
 * 通知数据传输对象（用于更新）
 */
export interface NotificationDTO {
    /** 通知ID，更新时必须提供 */
    id: string | null
    /** 通知标题 */
    title: string | null
    /** 通知内容（富文本HTML） */
    content: string | null
    /** 附件URL列表（JSON字符串或URL数组，前端与MinIO配合使用） */
    attachmentUrls: string | null
    /** 通知类型 */
    type: NotificationType | null
}

/**
 * 创建通知数据传输对象
 */
export interface NotificationAddDTO {
    /** 接收用户ID */
    userId: string | null
    /** 通知标题 */
    title: string | null
    /** 通知内容（富文本HTML） */
    content: string | null
    /** 附件URL列表（JSON字符串或URL数组，前端与MinIO配合使用） */
    attachmentUrls: string | null
    /** 通知类型 (0=系统通知, 1=课程通知, 2=作业通知, 3=直播通知, 4=其他) */
    type: NotificationType | null
    /** 发送者ID */
    senderId: string | null
    /** 发送者名称 */
    senderName: string | null
}

/**
 * 批量创建通知数据传输对象
 */
export interface NotificationBatchAddDTO {
    /** 接收用户ID列表 */
    userIds: string[] | null
    /** 通知标题 */
    title: string | null
    /** 通知内容（富文本HTML） */
    content: string | null
    /** 通知类型 (0=系统通知, 1=课程通知, 2=作业通知, 3=直播通知, 4=其他) */
    type: NotificationType | null
    /** 发送者ID */
    senderId: string | null
    /** 发送者名称 */
    senderName: string | null
}

/**
 * 按范围发送通知数据传输对象
 */
export interface NotificationScopeSendDTO {
    /** 发送范围类型 (0=按角色, 1=按课程学生) */
    scopeType: NotificationScopeType | null
    /** 角色标识 (scopeType=0 时必填) */
    roleKey: string | null
    /** 课程ID (scopeType=1 时必填) */
    courseId: string | null
    /** 通知标题 */
    title: string | null
    /** 通知内容（富文本HTML） */
    content: string | null
    /** 附件URL列表（JSON字符串或URL数组，前端与MinIO配合使用） */
    attachmentUrls: string | null
    /** 通知类型 (0=系统通知, 1=课程通知, 2=作业通知, 3=直播通知, 4=其他) */
    type: NotificationType | null
    /** 发送者ID */
    senderId: string | null
    /** 发送者名称 */
    senderName: string | null
}

/**
 * 通知分页查询参数接口
 */
export interface NotificationPageQueryDTO extends PageEntity {
    /** 通知类型 */
    type?: NotificationType | null
    /** 通知标题（模糊查询） */
    title?: string | null
    /** 阅读状态 */
    status?: NotificationReadStatus | null
    /** 发送者名称（模糊查询） */
    senderName?: string | null
    /** 开始时间 */
    startTime?: string | null
    /** 结束时间 */
    endTime?: string | null
}
