/**
 * 聊天会话查询DTO
 */
export interface ChatSessionQueryDTO {
    /** 用户ID */
    sysUserId?: string | null
    /** 会话标题（模糊查询） */
    sessionTitle?: string | null
    /** 会话类型: 0-普通对话, 1-课程问答, 2-题目辅导, 3-知识检索 */
    sessionType?: string | null
    /** 是否置顶: 0-否, 1-是 */
    isPinned?: string | null
    /** 是否收藏: 0-否, 1-是 */
    isFavorite?: string | null
    /** 起始时间 */
    startTime?: string | null
    /** 结束时间 */
    endTime?: string | null
    /** 当前记录起始索引 */
    pageNum?: number | null
    /** 每页显示记录数 */
    pageSize?: number | null
    /** 排序列 */
    orderByColumn?: string | null
    /** 排序的方向,可用值:asc,desc */
    isAsc?: string | null
    /** 分页参数合理化 */
    reasonable?: string | null
}

/**
 * 聊天会话VO
 */
export interface ChatSessionVO {
    /** 会话ID */
    id?: string | null
    /** 用户ID */
    sysUserId?: string | null
    /** 会话标题 */
    sessionTitle?: string | null
    /** 会话类型 */
    sessionType?: number | null
    /** 消息数量 */
    messageCount?: number | null
    /** 是否置顶 */
    isPinned?: number | null
    /** 是否收藏 */
    isFavorite?: number | null
    /** 最后一条消息预览 */
    lastMessagePreview?: string | null
    /** 创建时间 */
    createTime?: string | null
    /** 更新时间 */
    updateTime?: string | null
}

/**
 * 创建会话请求DTO
 */
export interface CreateSessionDTO {
    /** 课程ID */
    courseId?: string | null
    /** 会话类型 */
    sessionType?: number | null
    /** 会话标题 */
    title?: string | null
}

