/**
 * 题目选项数据传输对象
 * 用于选项的新增和更新操作
 */
export interface QuestionOptionDTO {
    /** 选项ID */
    id?: string | null
    /** 所属题目ID */
    questionId: string | null
    /** 选项内容 */
    optionContent: string | null
    /** 选项标签 (A, B, C, D等) */
    optionLabel: string | null
    /** 是否为正确答案 (0=错误, 1=正确) */
    isCorrect: number | null
    /** 选项分数 (多选题部分得分使用) */
    score?: number | null
    /** 图片URL列表 */
    imageUrls?: string[] | null
    /** 选项解析 */
    explanation?: string | null
}

/**
 * 题目选项视图对象
 * 用于选项信息的展示
 */
export interface QuestionOptionVO {
    /** 选项ID */
    id: string
    /** 所属题目ID */
    questionId: string
    /** 选项内容 */
    optionContent: string
    /** 选项标签 (A, B, C, D等) */
    optionLabel: string
    /** 是否为正确答案 (0=错误, 1=正确) */
    isCorrect: number
    /** 选项分数 (多选题部分得分使用) */
    score?: number
    /** 图片URL列表 */
    imageUrls?: string[]
    /** 选项解析 */
    explanation?: string
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
}

/**
 * 题目选项查询参数
 * 用于选项列表的分页查询
 */
export interface QuestionOptionQueryParams {
    /** 所属题目ID */
    questionId?: string | null
    /** 是否为正确答案 */
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
