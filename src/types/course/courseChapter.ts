/**
 * 课程章节数据传输对象
 * 用于章节的新增和更新操作
 */
export interface CourseChapterDTO {
    /** 章节ID，更新时必须提供 */
    id?: string | null
    /** 所属课程ID */
    courseId: string | null
    /** 章节名称 */
    chapterName: string | null
    /** 章节序号 */
    chapterNumber?: number | null
    /** 父章节ID */
    parentChapterId?: string | null
    /** 章节描述 */
    description?: string | null
    /** 章节内容 */
    content?: string | null
    /** 视频资源URL */
    videoUrl?: string | null
    /** 视频时长(秒) */
    videoDuration?: number | null
    /** 附件URL列表 */
    attachmentUrls?: string[] | null
    /** 排序权重 */
    sortOrder?: number | null
    /** 章节状态 (0=草稿, 1=发布, 2=下架) */
    status?: number | null
}

/**
 * 课程章节视图对象
 * 用于章节信息的展示
 */
export interface CourseChapterVO {
    /** 章节ID */
    id: string
    /** 所属课程ID */
    courseId: string
    /** 章节名称 */
    chapterName: string
    /** 章节序号 */
    chapterNumber?: number
    /** 父章节ID */
    parentChapterId?: string
    /** 章节描述 */
    description?: string
    /** 章节内容 */
    content?: string
    /** 视频资源URL */
    videoUrl?: string
    /** 视频时长(秒) */
    videoDuration?: number
    /** 附件URL列表 */
    attachmentUrls?: string[]
    /** 排序权重 */
    sortOrder?: number
    /** 章节状态 (0=草稿, 1=发布, 2=下架) */
    status?: number
    /** 浏览次数 */
    viewCount?: number
    /** 点赞次数 */
    likeCount?: number
    /** 评论次数 */
    commentCount?: number
    /** 是否已点赞 */
    isLiked?: boolean
    /** 是否已学习 */
    isStudied?: boolean
    /** 学习进度 */
    studyProgress?: number
    /** 子章节列表（用于树形结构） */
    children?: CourseChapterVO[]
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
}

/**
 * 课程章节查询参数
 * 用于章节列表的分页查询
 */
export interface CourseChapterQueryParams {
    /** 课程ID */
    courseId?: string | null
    /** 章节名称（模糊查询） */
    chapterName?: string | null
    /** 父章节ID */
    parentChapterId?: string | null
    /** 章节状态 */
    status?: string | null
    /** 是否有视频 */
    hasVideo?: string | null
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
