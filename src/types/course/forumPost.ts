/**
 * 论坛帖子数据传输对象
 * 用于帖子的新增和更新操作
 */
export interface ForumPostDTO {
    /** 帖子ID，更新时必须提供 */
    id?: string | null
    /** 所属论坛ID */
    forumId: string | null
    /** 发帖用户ID */
    userId: string | null
    /** 帖子标题 */
    title: string | null
    /** 帖子内容 */
    content: string | null
    /** 帖子类型 (0=普通帖子, 1=精华帖子, 2=置顶帖子) */
    postType?: number | null
    /** 是否匿名发帖 (0=实名, 1=匿名) */
    isAnonymous?: number | null
    /** 附件URL列表 */
    attachmentUrls?: string[] | null
    /** 标签列表 */
    tags?: string[] | null
    /** 帖子状态 (0=正常, 1=锁定, 2=删除) */
    status?: number | null
}

/**
 * 论坛帖子视图对象
 * 用于帖子信息的展示
 */
export interface ForumPostVO {
    /** 帖子ID */
    id: string
    /** 所属论坛ID */
    forumId: string
    /** 发帖用户ID */
    userId: string
    /** 发帖用户姓名 */
    userName?: string
    /** 发帖用户头像 */
    userAvatar?: string
    /** 帖子标题 */
    title: string
    /** 帖子内容 */
    content: string
    /** 帖子类型 (0=普通帖子, 1=精华帖子, 2=置顶帖子) */
    postType?: number
    /** 是否匿名发帖 (0=实名, 1=匿名) */
    isAnonymous?: number
    /** 附件URL列表 */
    attachmentUrls?: string[]
    /** 标签列表 */
    tags?: string[]
    /** 帖子状态 (0=正常, 1=锁定, 2=删除) */
    status?: number
    /** 浏览次数 */
    viewCount?: number
    /** 点赞次数 */
    likeCount?: number
    /** 回复次数 */
    replyCount?: number
    /** 分享次数 */
    shareCount?: number
    /** 是否已点赞 */
    isLiked?: boolean
    /** 是否已收藏 */
    isFavorited?: boolean
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
}

/**
 * 论坛帖子查询参数
 * 用于帖子列表的分页查询
 */
export interface ForumPostQueryParams {
    /** 论坛ID */
    forumId?: string | null
    /** 课程ID */
    courseId?: string | null
    /** 发帖用户ID */
    userId?: string | null
    /** 帖子标题（模糊查询） */
    title?: string | null
    /** 帖子类型 */
    postType?: string | null
    /** 帖子状态 */
    status?: string | null
    /** 标签 */
    tags?: string | null
    /** 是否精华 */
    isEssence?: string | null
    /** 是否置顶 */
    isTop?: string | null
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
