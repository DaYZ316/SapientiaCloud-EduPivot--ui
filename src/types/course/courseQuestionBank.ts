/**
 * 课程题库数据传输对象
 * 用于题库的新增和更新操作
 */
export interface CourseQuestionBankDTO {
    /** 题库ID */
    id?: string | null
    /** 所属课程ID */
    courseId: string | null
    /** 题库名称 */
    bankName: string | null
    /** 题库描述 */
    description?: string | null
    /** 题库类型 (0=练习题库, 1=考试题库, 2=作业题库) */
    bankType: number | null
    /** 标签列表 */
    tags?: string[] | null
    /** 整体难度等级 (1=简单, 2=中等, 3=困难) */
    difficulty: number | null
    /** 是否公开 (0=私有, 1=公开) */
    isPublic: number | null
}

/**
 * 课程题库视图对象
 * 用于题库信息的展示
 */
export interface CourseQuestionBankVO {
    /** 题库ID */
    id: string
    /** 所属课程ID */
    courseId: string
    /** 创建用户ID */
    sysUserId?: string
    /** 创建用户名称 */
    sysUserName?: string
    /** 创建用户头像 */
    sysUserAvatar?: string
    /** 题库名称 */
    bankName: string
    /** 题库描述 */
    description?: string
    /** 题库类型 (0=练习题库, 1=考试题库, 2=作业题库) */
    bankType: number
    /** 标签列表 */
    tags?: string[]
    /** 整体难度等级 (1=简单, 2=中等, 3=困难) */
    difficulty: number
    /** 是否公开 (0=私有, 1=公开) */
    isPublic: number
    /** 题目数量 */
    questionCount?: number
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
}

/**
 * 课程题库查询参数
 * 用于题库列表的分页查询
 */
export interface CourseQuestionBankQueryParams {
    /** 课程ID */
    courseId?: string | null
    /** 题库名称（模糊查询） */
    bankName?: string | null
    /** 题库类型 */
    bankType?: string | null
    /** 难度等级 */
    difficulty?: string | null
    /** 是否公开 */
    isPublic?: string | null
    /** 标签列表 */
    tags?: string | null
    /** 创建时间开始 */
    createTimeStart?: string | null
    /** 创建时间结束 */
    createTimeEnd?: string | null
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
