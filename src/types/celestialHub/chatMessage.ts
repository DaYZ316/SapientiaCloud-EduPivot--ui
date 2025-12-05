import type {FileReference} from './knowledge'

/**
 * 聊天消息实体
 */
export interface ChatMessage {
    /** 创建时间 */
    createTime?: string | null
    /** 更新时间 */
    updateTime?: string | null
    /** 删除标记 */
    deleted?: number | null
    /** 消息ID */
    id?: string | null
    /** 会话ID */
    sessionId?: string | null
    /** 角色: 0-用户, 1-AI助手, 2-系统 */
    role?: number | null
    /** 消息内容 */
    content?: string | null
    /** 消息类型: 0-文本, 1-代码, 2-图片, 3-文件 */
    messageType?: number | null
    /** token数量 */
    tokenCount?: number | null
    /** 使用的模型名称 */
    modelName?: string | null
    /** 引用的参考内容 */
    references?: any[] | null
    /** 附件URL列表 */
    attachments?: string[] | null
    /** 引用文件数组（用于索引文件向量数据） */
    fileReferences?: FileReference[] | null
    /** 请求ID（用于幂等） */
    requestId?: string | null
    /** 用户反馈: 0-无, 1-有用, -1-无用 */
    isFeedback?: number | null
    /** 元数据 */
    metadata?: any | null
    /** 出题请求参数（JSON），当角色为出题请求者时使用 */
    questionRequest?: string | null
    /** AI出题生成结果（JSON），当角色为出题者时使用 */
    questionResponse?: string | null
}

/**
 * 发送消息请求DTO
 */
export interface ChatRequestDTO {
    /** 会话ID（新对话时可为空） */
    sessionId?: string | null
    /** 用户ID（Kafka场景下需要） */
    userId?: string | null
    /** 用户消息内容 */
    message: string | null
    /** 课程ID（课程相关问答时提供） */
    courseId?: string | null
    /** 章节ID（章节相关问答时提供） */
    chapterId?: string | null
    /** 会话类型: 0-普通对话, 1-课程问答, 2-题目辅导, 3-知识检索 */
    sessionType?: number | null
    /** 是否使用RAG检索 */
    useRag?: boolean | null
    /** 是否流式输出 */
    stream?: boolean | null
    /** 温度参数(0.0-1.0) */
    temperature?: number | null
    /** 最大token数 */
    maxTokens?: number | null
    /** 附件URL列表 */
    attachments?: string[] | null
    /** 文件引用信息 */
    fileReferences?: FileReference[] | null
}

/**
 * Kafka流式聊天请求DTO
 */
export interface KafkaChatRequestDTO extends ChatRequestDTO {
    /** 请求ID（用于Kafka幂等及取消） */
    requestId?: string | null
}

/**
 * 引用内容VO
 */
export interface ReferenceVO {
    /** 内容ID */
    contentId?: string | null
    /** 内容类型: 0-章节, 1-问题, 2-任务, 3-论坛 */
    contentType?: number | null
    /** 标题 */
    title?: string | null
    /** 内容片段 */
    snippet?: string | null
    /** 相似度分数 */
    similarityScore?: number | null
    /** 来源URL */
    sourceUrl?: string | null
}

/**
 * 聊天响应VO
 */
export interface ChatResponseVO {
    /** 会话ID */
    sessionId?: string | null
    /** 消息ID */
    messageId?: string | null
    /** AI回复内容 */
    content?: string | null
    /** 使用的模型 */
    model?: string | null
    /** token使用量 */
    tokenCount?: number | null
    /** 引用文件数组（用于索引文件向量数据） */
    fileReferences?: FileReference[] | null
    /** 引用内容 */
    references?: ReferenceVO[] | null
    /** 响应时间 */
    responseTime?: string | null
    /** 是否完成 */
    finished?: boolean | null
    /** 元数据 */
    metadata?: any | null
}

/**
 * 取消Kafka流式聊天请求DTO
 */
export interface CancelChatStreamKafkaDTO {
    /** 请求ID */
    requestId?: string | null
    /** 取消原因 */
    reason?: string | null
}

/**
 * SSE事件回调
 */
export interface SSEEventCallbacks {
    /** 接收到数据事件时调用 */
    onMessage?: (data: string) => void
    /** 连接打开时调用 */
    onOpen?: () => void
    /** 发生错误时调用 */
    onError?: (error: Error) => void
    /** 连接关闭时调用 */
    onClose?: () => void
}

