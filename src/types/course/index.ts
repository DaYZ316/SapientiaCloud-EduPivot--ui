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
    isAsc?: string | null
    /** 分页参数合理化 */
    reasonable?: string | null
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
    isAsc?: string | null
    /** 分页参数合理化 */
    reasonable?: string | null
}

