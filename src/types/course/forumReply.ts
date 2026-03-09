import type {ReplyStatusEnum} from '@/enum/course'

/**
 * 论坛回复数据传输对象
 * 用于回复的新增和更新操作
 */
export interface ForumReplyDTO {
    /** 回复ID，更新时必须提供 */
    id?: string | null
    /** 所属帖子ID */
    postId: string | null
    /** 所属论坛ID */
    forumId: string | null
    /** 所属课程ID */
    courseId: string | null
    /** 回复人ID */
    sysUserId: string | null
    /** 回复内容 */
    content: string | null
    /** 父回复ID（用于嵌套回复） */
    parentReplyId?: string | null
    /** 回复目标用户ID */
    replyToUserId?: string | null
    /** 是否匿名回复 (0=实名, 1=匿名) */
    isAnonymous?: number | null
    /** 附件URL列表 */
    attachmentUrls?: string[] | null
    /** 图片URL列表 */
    imageUrls?: string[] | null
    /** 是否被采纳 (0=否, 1=是) */
    isAccepted?: number | null
    /** 回复状态 (0=正常, 1=删除, 2=审核中, 3=审核失败) */
    status?: ReplyStatusEnum | null
}

/**
 * 论坛回复视图对象
 * 用于回复信息的展示
 */
export interface ForumReplyVO {
    /** 回复ID */
    id: string
    /** 所属帖子ID */
    postId: string
    /** 所属论坛ID */
    forumId: string
    /** 所属课程ID */
    courseId: string
    /** 回复人ID */
    sysUserId: string
    /** 回复人用户名 */
    userName?: string
    /** 回复人头像URL */
    userAvatar?: string
    /** 回复内容 */
    content: string
    /** 父回复ID（用于嵌套回复） */
    parentReplyId?: string
    /** 回复目标用户ID */
    replyToUserId?: string
    /** 回复目标用户名 */
    replyToUserName?: string
    /** 是否匿名回复 (0=实名, 1=匿名) */
    isAnonymous?: number
    /** 附件URL列表 */
    attachmentUrls?: string[]
    /** 图片URL列表 */
    imageUrls?: string[]
    /** 点赞次数 */
    likeCount?: number
    /** 子回复次数 */
    replyCount?: number
    /** 是否被采纳 (0=否, 1=是) */
    isAccepted?: number
    /** 楼层号 */
    floorNumber?: number
    /** 回复状态 (0=正常, 1=删除, 2=审核中, 3=审核失败) */
    status?: number
    /** 发帖IP地址 */
    ipAddress?: string
    /** 用户代理信息 */
    userAgent?: string
    /** 子回复列表 */
    children?: ForumReplyVO[]
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
    /** 是否删除 */
    deleted?: number
}

/**
 * 论坛回复查询参数
 * 用于回复列表的分页查询
 */
export interface ForumReplyQueryParams {
    /** 帖子ID */
    postId?: string | null
    /** 论坛ID */
    forumId?: string | null
    /** 课程ID */
    courseId?: string | null
    /** 回复人ID */
    sysUserId?: string | null
    /** 父回复ID */
    parentReplyId?: string | null
    /** 回复状态 */
    status?: string | null
    /** 是否被采纳 */
    isAccepted?: string | null
    /** 起始时间 */
    startTime?: string | null
    /** 结束时间 */
    endTime?: string | null
    /** 当前记录起始索引 */
    pageNum?: number
    /** 每页显示记录数 */
    pageSize?: number
    /** 排序字段 */
    orderByColumn?: string | null
    /** 排序的方向，可用值：asc,desc */
    isAsc?: 'asc' | 'desc' | null
    /** 分页参数合理化 */
    reasonable?: boolean | null
}
