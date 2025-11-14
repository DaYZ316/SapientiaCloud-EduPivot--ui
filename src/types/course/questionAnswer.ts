/**
 * 题目答案数据传输对象
 * 用于填空/简答题答案的新增和更新
 */
export interface QuestionAnswerDTO {
    /** 答案ID */
    id?: string | null
    /** 题目ID */
    questionId: string | null
    /** 答案内容 */
    answerContent: string | null
    /** 答案解析 */
    explanation?: string | null
    /** 分数 */
    score?: number | null
    /** 答案序号 */
    sortOrder?: number | null
}

/**
 * 题目答案视图对象
 * 用于填空/简答题答案的展示
 */
export interface QuestionAnswerVO {
    /** 答案ID */
    id: string
    /** 题目ID */
    questionId: string
    /** 答案内容 */
    answerContent: string
    /** 答案解析 */
    explanation?: string
    /** 分数 */
    score?: number
    /** 答案序号 */
    sortOrder?: number
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
