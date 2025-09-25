/**
 * 课程论坛数据传输对象
 * 用于论坛的新增和更新操作
 */
export interface CourseForumDTO {
    /** 论坛ID，更新时必须提供 */
    id?: string | null
    /** 所属课程ID */
    courseId: string | null
    /** 论坛名称 */
    forumName: string | null
    /** 论坛描述 */
    description?: string | null
    /** 论坛类型 (0=讨论区, 1=问答区, 2=作业区, 3=公告区) */
    forumType?: number | null
    /** 是否公开 (0=仅课程成员, 1=公开) */
    isPublic?: number | null
    /** 是否允许匿名发帖 (0=不允许, 1=允许) */
    allowAnonymous?: number | null
    /** 版主ID列表 */
    moderatorIds?: string[] | null
    /** 排序权重 */
    sortOrder?: number | null
    /** 论坛状态 (0=正常, 1=关闭, 2=维护) */
    status?: number | null
    /** 论坛规则 */
    rules?: string | null
    /** 标签列表 */
    tags?: string[] | null
}

/**
 * 课程论坛视图对象
 * 用于论坛信息的展示
 */
export interface CourseForumVO {
    /** 论坛ID */
    id: string
    /** 所属课程ID */
    courseId: string
    /** 论坛名称 */
    forumName: string
    /** 论坛描述 */
    description?: string
    /** 论坛类型 (0=讨论区, 1=问答区, 2=作业区, 3=公告区) */
    forumType?: number
    /** 是否公开 (0=仅课程成员, 1=公开) */
    isPublic?: number
    /** 是否允许匿名发帖 (0=不允许, 1=允许) */
    allowAnonymous?: number
    /** 版主ID列表 */
    moderatorIds?: string[]
    /** 帖子总数 */
    postCount?: number
    /** 回复总数 */
    replyCount?: number
    /** 最新帖子ID */
    lastPostId?: string
    /** 最新发帖时间 */
    lastPostTime?: string
    /** 排序权重 */
    sortOrder?: number
    /** 论坛状态 (0=正常, 1=关闭, 2=维护) */
    status?: number
    /** 论坛规则 */
    rules?: string
    /** 标签列表 */
    tags?: string[]
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
}

/**
 * 课程论坛查询参数
 * 用于论坛列表的分页查询
 */
export interface CourseForumQueryParams {
    /** 课程ID */
    courseId?: string | null
    /** 论坛名称（模糊查询） */
    forumName?: string | null
    /** 论坛类型 */
    forumType?: string | null
    /** 是否公开 */
    isPublic?: string | null
    /** 论坛状态 */
    status?: string | null
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
