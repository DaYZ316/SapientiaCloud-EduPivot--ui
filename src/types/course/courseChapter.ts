/**
 * 课程章节数据传输对象
 * 用于课程章节的新增和更新操作
 */
export interface CourseChapterDTO {
    /** 章节ID (更新时必�? */
    id?: string | null
    /** 所属课程ID */
    courseId: string | null
    /** 父章节ID (用于支持多级章节结构, NULL表示为一级章�? */
    parentId?: string | null
    /** 章节名称 */
    chapterName: string | null
    /** 章节内容 (例如: 详细的文本、富文本标记�? */
    chapterContent?: string | null
    /** 章节排序 (值越小越靠前) */
    sort?: number | null
}

/**
 * 课程章节视图对象
 * 用于课程章节信息的展�?
 */
export interface CourseChapterVO {
    /** 章节ID */
    id: string
    /** 所属课程ID */
    courseId: string
    /** 父章节ID */
    parentId?: string
    /** 章节名称 */
    chapterName: string
    /** 章节内容 */
    chapterContent?: string
    /** 章节排序 */
    sort?: number
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
    /** 子章节列�?*/
    children?: CourseChapterVO[]
}

/**
 * 课程章节查询参数
 * 用于课程章节列表的分页查询
 */
export interface CourseChapterQueryParams {
    /** 所属课程ID */
    courseId?: string | null
    /** 父章节ID */
    parentId?: string | null
    /** 章节名称 (支持模糊查询) */
    chapterName?: string | null
    /** 起始时间 */
    startTime?: string | null
    /** 结束时间 */
    endTime?: string | null
    /** 当前记录起始索引 */
    pageNum?: number
    /** 每页显示记录数 */
    pageSize?: number
    /** 排序列 */
    orderByColumn?: string | null
    /** 排序的方向,可用值:asc,desc */
    isAsc?: 'asc' | 'desc' | null
    /** 分页参数合理化 */
    reasonable?: boolean | null
}