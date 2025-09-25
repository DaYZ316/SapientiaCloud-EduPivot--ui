/**
 * 论坛回复数据传输对象
 * 用于回复的新增和更新操作
 */
export interface ForumReplyDTO {
    /** 回复ID，更新时必须提供 */
    id?: string | null
    /** 所属帖子ID */
    postId: string | null
    /** 回复用户ID */
    userId: string | null
    /** 父回复ID（用于嵌套回复） */
    parentReplyId?: string | null
    /** 回复内容 */
    content: string | null
    /** 是否匿名回复 (0=实名, 1=匿名) */
    isAnonymous?: number | null
    /** 附件URL列表 */
    attachmentUrls?: string[] | null
    /** 回复状态 (0=正常, 1=删除) */
    status?: number | null
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
    /** 回复用户ID */
    userId: string
    /** 回复用户姓名 */
    userName?: string
    /** 回复用户头像 */
    userAvatar?: string
    /** 父回复ID（用于嵌套回复） */
    parentReplyId?: string
    /** 父回复用户姓名 */
    parentReplyUserName?: string
    /** 回复内容 */
    content: string
    /** 是否匿名回复 (0=实名, 1=匿名) */
    isAnonymous?: number
    /** 附件URL列表 */
    attachmentUrls?: string[]
    /** 回复状态 (0=正常, 1=删除) */
    status?: number
    /** 点赞次数 */
    likeCount?: number
    /** 是否已点赞 */
    isLiked?: boolean
    /** 是否被采纳（问答区专用） */
    isAccepted?: boolean
    /** 子回复列表 */
    children?: ForumReplyVO[]
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
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
    /** 回复用户ID */
    userId?: string | null
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
