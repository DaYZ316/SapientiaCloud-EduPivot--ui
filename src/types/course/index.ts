import type {CourseStatusEnum, CourseTypeEnum, EnrollmentStatusEnum} from '@/enum/course'

/**
 * 课程数据传输对象
 * 用于课程的新增和更新操作
 */
export interface CourseDTO {
    /** 课程ID，更新时必须提供 */
    id?: string | null
    /** 课程名称 */
    courseName: string | null
    /** 主讲教师ID */
    teacherId: string | null
    /** 辅助教学教师ID列表 */
    assistantTeacherIds?: string[] | null
    /** 课程描述 */
    description?: string | null
    /** 课程封面图片URL */
    coverImageUrl?: string | null
    /** 开设学期 */
    semester?: string | null
    /** 上课地点 */
    location?: string | null
    /** 课程类型 (0=必修, 1=选修) */
    courseType?: CourseTypeEnum | null
    /** 课程状态 (0=正常, 1=停课) */
    status?: CourseStatusEnum | null
}

/**
 * 课程视图对象
 * 用于课程信息的展示
 */
export interface CourseVO {
    /** 课程ID */
    id: string
    /** 课程名称 */
    courseName: string
    /** 课程描述 */
    description?: string
    /** 课程类型 (0=必修, 1=选修) */
    courseType?: CourseTypeEnum
    /** 开设学期 */
    semester?: string
    /** 上课地点 */
    location?: string
    /** 主讲教师ID */
    teacherId: string
    /** 主讲教师姓名 */
    teacherName?: string
    /** 辅助教学教师ID列表 */
    assistantTeacherIds?: string[]
    /** 课程封面图片URL */
    coverImageUrl?: string
    /** 课程状态 (0=正常, 1=停课) */
    status?: CourseStatusEnum
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
}

/**
 * 课程查询参数
 * 用于课程列表的分页查询
 */
export interface CourseQueryParams {
    /** 课程名称（模糊查询） */
    courseName?: string | null
    /** 主讲教师ID */
    teacherId?: string | null
    /** 学期 */
    semester?: string | null
    /** 课程类型 */
    courseType?: string | null
    /** 上课地点 */
    location?: string | null
    /** 课程状态 (0=正常, 1=停课) */
    status?: string | null
    /** 学生ID */
    studentId?: string | null
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

/**
 * 课程学生数据传输对象
 * 用于学生选课和成绩管理
 */
export interface CourseStudentDTO {
    /** 学生ID */
    studentId: string | null
    /** 课程ID */
    courseId: string | null
    /** 成绩 */
    grade?: number | null
    /** 选课日期 */
    enrollmentDate?: string | null
    /** 选课状态 (0=在读, 1=已退课, 2=已完成) */
    status?: EnrollmentStatusEnum | null
}

/**
 * 课程学生视图对象
 * 用于学生选课信息的展示
 */
export interface CourseStudentVO {
    /** 学生ID */
    studentId: string
    /** 课程ID */
    courseId: string
    /** 成绩 */
    grade?: number
    /** 选课日期 */
    enrollmentDate?: string
    /** 选课状态 (0=在读, 1=已退课, 2=已完成) */
    status?: EnrollmentStatusEnum
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
}

/**
 * 课程学生查询参数
 * 用于课程学生列表的分页查询
 */
export interface CourseStudentQueryParams {
    /** 学生ID */
    studentId?: string | null
    /** 课程ID */
    courseId?: string | null
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

/**
 * 课程论坛回复数据传输对象
 * 用于论坛回复的新增和更新操作
 */
export interface ThreadReplyDTO {
    /** 回复ID (更新时必填) */
    id?: string | null
    /** 所属主贴ID */
    threadId: string | null
    /** 回复用户ID */
    userId: string | null
    /** 父回复ID (用于支持楼中楼回复) */
    parentReplyId?: string | null
    /** 回复内容 */
    content: string | null
}

/**
 * 课程论坛回复视图对象
 * 用于论坛回复信息的展示
 */
export interface ThreadReplyVO {
    /** 回复ID */
    id: string
    /** 所属主贴ID */
    threadId: string
    /** 回复用户ID */
    userId: string
    /** 回复用户名称 */
    userName?: string
    /** 回复用户头像 */
    userAvatar?: string
    /** 父回复ID */
    parentReplyId?: string
    /** 回复内容 */
    content: string
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
    /** 子回复列表 */
    children?: ThreadReplyVO[]
}

/**
 * 课程论坛主贴数据传输对象
 * 用于论坛主贴的新增和更新操作
 */
export interface CourseThreadDTO {
    /** 主贴ID (更新时必填) */
    id?: string | null
    /** 所属课程ID */
    courseId: string | null
    /** 发帖用户ID */
    userId: string | null
    /** 帖子标题 */
    title: string | null
    /** 帖子内容 */
    content: string | null
    /** 是否置顶 (1=是, 0=否) */
    isPinned?: number | null
    /** 是否关闭/锁定 (1=是, 0=否) */
    isClosed?: number | null
}

/**
 * 课程论坛主贴视图对象
 * 用于论坛主贴信息的展示
 */
export interface CourseThreadVO {
    /** 主贴ID */
    id: string
    /** 所属课程ID */
    courseId: string
    /** 发帖用户ID */
    userId: string
    /** 发帖用户名称 */
    userName?: string
    /** 发帖用户头像 */
    userAvatar?: string
    /** 帖子标题 */
    title: string
    /** 帖子内容 */
    content: string
    /** 是否置顶 */
    pinned?: number
    /** 是否关闭/锁定 */
    closed?: number
    /** 浏览次数 */
    viewCount?: number
    /** 回复总数 */
    replyCount?: number
    /** 最后回复时间 */
    lastReplyTime?: string
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
}

/**
 * 课程章节数据传输对象
 * 用于课程章节的新增和更新操作
 */
export interface CourseChapterDTO {
    /** 章节ID (更新时必填) */
    id?: string | null
    /** 所属课程ID */
    courseId: string | null
    /** 父章节ID (用于支持多级章节结构, NULL表示为一级章节) */
    parentId?: string | null
    /** 章节名称 */
    chapterName: string | null
    /** 章节内容 (例如: 详细的文本、富文本标记等) */
    chapterContent?: string | null
    /** 章节排序 (值越小越靠前) */
    sort?: number | null
}

/**
 * 课程章节视图对象
 * 用于课程章节信息的展示
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
    /** 子章节列表 */
    children?: CourseChapterVO[]
}

