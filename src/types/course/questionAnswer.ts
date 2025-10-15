/**
 * 题目答案数据传输对象
 * 用于答案的新增和更新操作
 */
export interface QuestionAnswerDTO {
    /** 答案ID */
    id?: string | null
    /** 题目ID */
    questionId: string | null
    /** 答案内容 */
    answerContent: string | null
    /** 文本答案 (填空题、简答题) */
    answerText?: string | null
    /** 是否正确 (0=错误, 1=正确, 2=部分正确) */
    isCorrect: number | null
    /** 得分 */
    score: number | null
}

/**
 * 题目答案视图对象
 * 用于答案信息的展示
 */
export interface QuestionAnswerVO {
    /** 答案ID */
    id: string
    /** 题目ID */
    questionId: string
    /** 题目标题 */
    questionTitle?: string
    /** 创建用户ID */
    sysUserId?: string
    /** 创建用户名称 */
    sysUserName?: string
    /** 答案内容 */
    answerContent: string
    /** 文本答案 (填空题、简答题) */
    answerText?: string
    /** 是否正确 (0=错误, 1=正确, 2=部分正确) */
    isCorrect: number
    /** 是否正确名称 */
    isCorrectName?: string
    /** 得分 */
    score: number
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
}

/**
 * 题目答案查询参数
 * 用于答案列表的分页查询
 */
export interface QuestionAnswerQueryParams {
    /** 题目ID */
    questionId?: string | null
    /** 是否正确 */
    isCorrect?: string | null
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
