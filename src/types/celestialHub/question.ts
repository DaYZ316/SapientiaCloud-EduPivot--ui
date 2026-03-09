/**
 * AI出题请求DTO（generateQuestions）
 */
export interface QuestionGenerateRequestDTO {
    /** 会话ID（可选，若为空则由后端创建新的出题会话） */
    sessionId?: string | null
    /** 生成题目数量 */
    questionCount?: number | null
    /** 题目类型 (0=单选题, 1=多选题, 2=判断题, 3=填空题, 4=简答题, 5=混合出题) */
    questionType?: number | null
    /** 难度等级 (0=随机, 1=简单, 2=中等, 3=困难) */
    difficulty?: number | null
    /** 每题分数，若为空则由AI统一或按难度分配 */
    scorePerQuestion?: number | null
    /** 出题详细要求（题型组合、考查能力、场景限制等） */
    requirement?: string | null
}

/**
 * AI出题结果选项DTO（QuestionOptionSimpleDTO）
 */
export interface QuestionOptionSimpleDTO {
    /** 选项ID */
    id?: string | null
    /** 所属题目ID */
    questionId?: string | null
    /** 选项内容 */
    optionContent?: string | null
    /** 选项标签 (A, B, C, D等) */
    optionLabel?: string | null
    /** 是否为正确答案 (0=错误, 1=正确) */
    isCorrect?: number | null
    /** 选项分数 (多选题部分得分使用) */
    score?: number | null
    /** 图片URL列表 */
    imageUrls?: string[] | null
    /** 选项解析 */
    explanation?: string | null
}

/**
 * AI出题结果答案DTO（QuestionAnswerSimpleDTO）
 */
export interface QuestionAnswerSimpleDTO {
    /** 答案ID */
    id?: string | null
    /** 题目ID */
    questionId?: string | null
    /** 本空答案 */
    answerContent?: string | null
    /** 本空解析 */
    explanation?: string | null
    /** 分数 */
    score?: number | null
    /** 本空序号 */
    sortOrder?: number | null
}

/**
 * AI出题响应DTO（QuestionResponseDTO）
 */
export interface QuestionResponseDTO {
    /** 题目ID（后期落库时注入） */
    id?: string | null
    /** 创建用户ID（后期注入，可选） */
    sysUserId?: string | null
    /** 题目标题 */
    questionTitle?: string | null
    /** 题目内容 */
    questionContent?: string | null
    /** 题目类型 (0=单选题, 1=多选题, 2=判断题, 3=填空题, 4=简答题) */
    questionType?: number | null
    /** 难度等级 (1=简单, 2=中等, 3=困难) */
    difficulty?: number | null
    /** 题目分数 */
    score?: number | null
    /** 预计答题时间 (分钟) */
    estimatedTime?: number | null
    /** 标签列表 */
    tags?: string[] | null
    /** AI出题结果选项DTO列表 */
    options?: QuestionOptionSimpleDTO[] | null
    /** AI出题结果答案DTO列表 */
    answers?: QuestionAnswerSimpleDTO[] | null
}


