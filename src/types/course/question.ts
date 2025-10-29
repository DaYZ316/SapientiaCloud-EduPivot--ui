import {QuestionAnswerVO} from "./questionAnswer"

/**
 * 题目数据传输对象
 * 用于题目的新增和更新操作
 */
export interface QuestionDTO {
    /** 题目ID */
    id?: string | null
    /** 所属题库ID */
    questionBankId: string | null
    /** 题目标题 */
    questionTitle: string | null
    /** 题目内容 */
    questionContent: string | null
    /** 题目类型 (0=单选题, 1=多选题, 2=判断题, 3=填空题, 4=简答题) */
    questionType: number | null
    /** 难度等级 (1=简单, 2=中等, 3=困难) */
    difficulty: number | null
    /** 题目分数 */
    score: number | null
    /** 预计答题时间 (分钟) */
    estimatedTime?: number | null
    /** 标签列表 */
    tags?: string[]
    /** 图片URL列表 */
    imageUrls?: string[] | null
    /** 是否允许部分得分 (0=不允许, 1=允许) */
    allowPartialCredit?: number | null
    /** 题目状态 (0=草稿, 1=发布, 2=停用) */
    status?: number | null
}

/**
 * 题目视图对象
 * 用于题目信息的展示
 */
export interface QuestionVO {
    /** 题目ID */
    id: string
    /** 所属题库ID */
    questionBankId: string
    /** 题库名称 */
    questionBankName?: string
    /** 创建用户ID */
    sysUserId?: string
    /** 创建用户名称 */
    sysUserName?: string
    /** 题目标题 */
    questionTitle: string
    /** 题目内容 */
    questionContent: string
    /** 题目类型 (0=单选题, 1=多选题, 2=判断题, 3=填空题, 4=简答题) */
    questionType: number
    /** 难度等级 (1=简单, 2=中等, 3=困难) */
    difficulty: number
    /** 题目分数 */
    score: number
    /** 预计答题时间 (分钟) */
    estimatedTime?: number
    /** 标签列表 */
    tags?: string[]
    /** 图片URL列表 */
    imageUrls?: string[]
    /** 是否允许部分得分 (0=不允许, 1=允许) */
    allowPartialCredit?: number
    /** 浏览次数 */
    viewCount?: number
    /** 题目状态 (0=草稿, 1=发布, 2=停用) */
    status?: number
    /** 选项列表 */
    options?: QuestionOptionVO[]
    /** 答案列表 */
    answer?: QuestionAnswerVO
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
}

/**
 * 题目查询参数
 * 用于题目列表的分页查询
 */
export interface QuestionQueryParams {
    /** 题目标题（模糊查询） */
    questionTitle?: string | null
    /** 所属题库ID */
    questionBankId?: string | null
    /** 题目类型 */
    questionType?: string | null
    /** 难度等级 */
    difficulty?: string | null
    /** 题目状态 */
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

/**
 * 题目选项视图对象
 * 用于题目选项信息的展示
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
