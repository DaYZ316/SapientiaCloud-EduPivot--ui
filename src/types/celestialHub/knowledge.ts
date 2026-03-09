/**
 * 文件引用信息（对应mg_file_document中的属性）
 */
export interface FileReference {
    /** 文件ID */
    id: string | null
    /** 文件名 */
    fileName?: string | null
    /** 文件类型: 0-PDF, 1-DOC, 2-DOCX, 3-XLS, 4-XLSX, 5-TXT, 6-MD, 7-RTF */
    fileType?: number | null
    /** 文件大小（字节） */
    fileSize?: number | null
    /** MIME类型 */
    mimeType?: string | null
    /** 存储路径（MinIO对象名） */
    storagePath?: string | null
    /** 存储桶代码 */
    bucketCode?: string | null
    /** 上传用户ID */
    sysUserId?: string | null
    /** 课程ID（可选） */
    courseId?: string | null
    /** 会话ID（可选，关联会话） */
    sessionId?: string | null
    /** 是否已向量化 */
    isVectorized?: boolean | null
    /** 向量块数量 */
    vectorCount?: number | null
}

/**
 * 知识检索请求DTO（searchKnowledge）
 */
export interface KnowledgeSearchRequestDTO {
    /** 检索查询内容 */
    query: string | null
    /** 返回结果数量（TopK） */
    topK?: number | null
    /** 相似度阈值 */
    similarityThreshold?: number | null
    /** 会话ID */
    sessionId?: string | null
    /** 文件引用信息 */
    fileReferences?: FileReference[] | null
}

/**
 * 知识检索结果VO（KnowledgeSearchResultVO）
 */
export interface KnowledgeSearchResultVO {
    /** 向量ID */
    vectorId?: string | null
    /** 向量存储ID（Redis） */
    documentId?: string | null
    /** 内容类型 */
    contentType?: number | null
    /** 标题 */
    title?: string | null
    /** 内容片段 */
    content?: string | null
    /** 分数 */
    score?: number | null
    /** 距离 */
    distance?: number | null
    /** Chunk索引 */
    chunkIndex?: number | null
    /** 标签 */
    tags?: string[] | null
    /** 课程ID */
    courseId?: string | null
    /** 章节ID */
    chapterId?: string | null
    /** 内容ID */
    contentId?: string | null
    /** 题库ID */
    questionBankId?: string | null
    /** 问题ID */
    questionId?: string | null
    /** 任务ID */
    taskId?: string | null
    /** 论坛ID */
    forumId?: string | null
    /** 帖子ID */
    postId?: string | null
    /** 文件ID */
    fileId?: string | null
    /** 会话ID */
    sessionId?: string | null
    /** 聊天消息ID */
    messageId?: string | null
    /** 用户ID */
    userId?: string | null
    /** 创建时间 */
    createTime?: string | null
    /** 嵌入模型 */
    embeddingModel?: string | null
}

/**
 * 向量化请求DTO
 */
export interface VectorizeRequestDTO {
    /** 课程ID */
    courseId?: string | null
    /** 内容类型: 0-章节, 1-问题, 2-任务, 3-论坛 */
    contentType: number | null
    /** 是否强制重新向量化 */
    forceReindex?: boolean | null
    /** 标签过滤 */
    tags?: string[] | null
}

