/**
 * 知识检索请求DTO
 */
export interface KnowledgeRequestDTO {
    /** 查询内容 */
    query?: string | null
    /** 课程ID */
    courseId?: string | null
    /** 章节ID */
    chapterId?: string | null
    /** 内容类型过滤: 0-章节, 1-问题, 2-答案, 3-论坛 */
    contentTypes?: number[] | null
    /** 返回结果数量 */
    topK?: number | null
    /** 相似度阈值(0.0-1.0) */
    similarityThreshold?: number | null
    /** 标签过滤 */
    tags?: string[] | null
}

/**
 * 知识项VO
 */
export interface KnowledgeItemVO {
    /** 内容ID */
    id?: string | null
    /** 内容类型: 0-章节, 1-问题, 2-答案, 3-论坛 */
    contentType?: number | null
    /** 标题 */
    title?: string | null
    /** 内容 */
    content?: string | null
    /** 相似度分数 */
    score?: number | null
    /** 课程ID */
    courseId?: string | null
    /** 章节ID */
    chapterId?: string | null
    /** 题库ID（问题类型时使用） */
    questionBankId?: string | null
    /** 问题ID（问题类型时使用） */
    questionId?: string | null
    /** 任务ID（任务类型时使用） */
    taskId?: string | null
    /** 论坛ID（论坛类型时使用） */
    forumId?: string | null
    /** 帖子ID（论坛类型时使用） */
    postId?: string | null
    /** 标签列表 */
    tags?: string[] | null
    /** 元数据 */
    metadata?: any | null
}

/**
 * 知识搜索响应VO
 */
export interface KnowledgeSearchVO {
    /** 查询内容 */
    query?: string | null
    /** 知识项 */
    items?: KnowledgeItemVO[] | null
    /** 总数 */
    total?: number | null
    /** 查询耗时(ms) */
    queryTime?: number | null
}

/**
 * 向量化请求DTO
 */
export interface VectorizeRequestDTO {
    /** 课程ID */
    courseId?: string | null
    /** 内容类型: 0-章节, 1-问题, 2-答案, 3-论坛 */
    contentType?: number | null
    /** 是否强制重新向量化 */
    forceReindex?: boolean | null
    /** 标签过滤 */
    tags?: string[] | null
}

