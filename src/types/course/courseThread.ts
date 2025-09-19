/**
 * 课程论坛回复数据传输对象
 * 用于论坛回复的新增和更新操作
 */
export interface ThreadReplyDTO {
    /** 回复ID (更新时必�? */
    id?: string | null
    /** 所属主贴ID */
    threadId: string | null
    /** 回复用户ID */
    userId: string | null
    /** 父回复ID (用于支持楼中楼回�? */
    parentReplyId?: string | null
    /** 回复内容 */
    content: string | null
}

/**
 * 课程论坛回复视图对象
 * 用于论坛回复信息的展�?
 */
export interface ThreadReplyVO {
    /** 回复ID */
    id: string
    /** 所属主贴ID */
    threadId: string
    /** 回复用户ID */
    userId: string
    /** 回复用户名称 */
    userName?: string
    /** 回复用户头像 */
    userAvatar?: string
    /** 父回复ID */
    parentReplyId?: string
    /** 回复内容 */
    content: string
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
    /** 子回复列�?*/
    children?: ThreadReplyVO[]
}

/**
 * 课程论坛主贴数据传输对象
 * 用于论坛主贴的新增和更新操作
 */
export interface CourseThreadDTO {
    /** 主贴ID (更新时必�? */
    id?: string | null
    /** 所属课程ID */
    courseId: string | null
    /** 发帖用户ID */
    userId: string | null
    /** 帖子标题 */
    title: string | null
    /** 帖子内容 */
    content: string | null
    /** 是否置顶 (1=�? 0=�? */
    isPinned?: number | null
    /** 是否关闭/锁定 (1=�? 0=�? */
    isClosed?: number | null
}

/**
 * 课程论坛主贴视图对象
 * 用于论坛主贴信息的展�?
 */
export interface CourseThreadVO {
    /** 主贴ID */
    id: string
    /** 所属课程ID */
    courseId: string
    /** 发帖用户ID */
    userId: string
    /** 发帖用户名称 */
    userName?: string
    /** 发帖用户头像 */
    userAvatar?: string
    /** 帖子标题 */
    title: string
    /** 帖子内容 */
    content: string
    /** 是否置顶 */
    pinned?: number
    /** 是否关闭/锁定 */
    closed?: number
    /** 浏览次数 */
    viewCount?: number
    /** 回复总数 */
    replyCount?: number
    /** 最后回复时�?*/
    lastReplyTime?: string
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
}

/**
 * 课程论坛主贴查询参数
 * 用于论坛主贴列表的分页查询
 */
export interface CourseThreadQueryParams {
    /** 所属课程ID */
    courseId?: string | null
    /** 发帖用户ID */
    userId?: string | null
    /** 帖子标题 (支持模糊查询) */
    title?: string | null
    /** 是否置顶 (1=是, 0=否) */
    isPinned?: string | null
    /** 是否关闭/锁定 (1=是, 0=否) */
    isClosed?: string | null
    /** 起始时间 */
    startTime?: string | null
    /** 结束时间 */
    endTime?: string | null
    /** 当前记录起始索引 */
    pageNum?: number
    /** 每页显示记录数 */
    pageSize?: number
    /** 排序列 */
    orderByColumn?: string | null
    /** 排序的方向,可用值:asc,desc */
    isAsc?: 'asc' | 'desc' | null
    /** 分页参数合理化 */
    reasonable?: boolean | null
}

/**
 * 课程论坛回复查询参数
 * 用于论坛回复列表的分页查询
 */
export interface ThreadReplyQueryParams {
    /** 所属主贴ID */
    threadId?: string | null
    /** 回复用户ID */
    userId?: string | null
    /** 父回复ID */
    parentReplyId?: string | null
    /** 起始时间 */
    startTime?: string | null
    /** 结束时间 */
    endTime?: string | null
    /** 当前记录起始索引 */
    pageNum?: number
    /** 每页显示记录数 */
    pageSize?: number
    /** 排序列 */
    orderByColumn?: string | null
    /** 排序的方向,可用值:asc,desc */
    isAsc?: 'asc' | 'desc' | null
    /** 分页参数合理化 */
    reasonable?: boolean | null
}