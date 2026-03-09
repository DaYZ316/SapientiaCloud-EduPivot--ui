/**
 * 论坛帖子数据传输对象
 * 用于帖子的新增和更新操作
 */
export interface ForumPostDTO {
    /** 帖子ID，更新时必须提供 */
    id?: string | null
    /** 所属论坛ID */
    forumId: string | null
    /** 所属课程ID */
    courseId: string | null
    /** 发帖人ID */
    sysUserId: string | null
    /** 帖子标题 */
    title: string | null
    /** 帖子内容 */
    content: string | null
    /** 帖子类型 (0=普通帖子, 1=置顶帖子, 2=精华帖子, 3=公告) */
    postType?: number | null
    /** 是否匿名发帖 (0=实名, 1=匿名) */
    isAnonymous?: number | null
    /** 附件URL列表 */
    attachmentUrls?: string[] | null
    /** 图片URL列表 */
    imageUrls?: string[] | null
    /** 标签列表 */
    tags?: string[] | null
    /** 是否置顶 (0=否, 1=是) */
    isTop?: number | null
    /** 是否精华 (0=否, 1=是) */
    isEssence?: number | null
    /** 是否锁定 (0=否, 1=是) */
    isLocked?: number | null
    /** 帖子状态 (0=正常, 1=删除, 2=审核中, 3=审核失败) */
    status?: number | null
    /** 关联章节ID */
    chapterId?: string | null
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
    /** 所属课程ID */
    courseId: string
    /** 发帖人ID */
    sysUserId: string
    /** 发帖人用户名 */
    userName?: string
    /** 发帖人头像URL */
    userAvatar?: string
    /** 帖子标题 */
    title: string
    /** 帖子内容 */
    content: string
    /** 帖子类型 (0=普通帖子, 1=置顶帖子, 2=精华帖子, 3=公告) */
    postType?: number
    /** 是否匿名发帖 (0=实名, 1=匿名) */
    isAnonymous?: number
    /** 附件URL列表 */
    attachmentUrls?: string[]
    /** 图片URL列表 */
    imageUrls?: string[]
    /** 标签列表 */
    tags?: string[]
    /** 浏览次数 */
    viewCount?: number
    /** 点赞次数 */
    likeCount?: number
    /** 回复次数 */
    replyCount?: number
    /** 分享次数 */
    shareCount?: number
    /** 是否置顶 (0=否, 1=是) */
    isTop?: number
    /** 是否精华 (0=否, 1=是) */
    isEssence?: number
    /** 是否锁定 (0=否, 1=是) */
    isLocked?: number
    /** 最新回复ID */
    lastReplyId?: string
    /** 最新回复时间 */
    lastReplyTime?: string
    /** 最新回复用户ID */
    lastReplyUserId?: string
    /** 帖子状态 (0=正常, 1=删除, 2=审核中, 3=审核失败) */
    status?: number
    /** 关联章节ID */
    chapterId?: string
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
    /** 发帖人ID */
    sysUserId?: string | null
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
    /** 是否锁定 */
    isLocked?: string | null
    /** 关联章节ID */
    chapterId?: string | null
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
