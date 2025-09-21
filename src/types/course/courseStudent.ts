import type {EnrollmentStatusEnum} from '@/enum/course'

/**
 * 课程学生数据传输对象
 * 用于学生选课和成绩管�?
 */
export interface CourseStudentDTO {
    /** 学生ID */
    studentId: string | null
    /** 课程ID */
    courseId: string | null
    /** 成绩 */
    grade?: number | null
    /** 选课状�?(0=在读, 1=已退�? 2=已完�? */
    status?: EnrollmentStatusEnum | null
}

/**
 * 课程学生视图对象
 * 用于学生选课信息的展�?
 */
export interface CourseStudentVO {
    /** 学生ID */
    studentId: string
    /** 课程ID */
    courseId: string
    /** 成绩 */
    grade?: number
    /** 选课状�?(0=在读, 1=已退�? 2=已完�? */
    status?: EnrollmentStatusEnum
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
}

/**
 * 课程学生查询参数
 * 用于课程学生列表的分页查�?
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
    /** 每页显示记录�?*/
    pageSize?: number
    /** 排序�?*/
    orderByColumn?: string | null
    /** 排序的方�?可用�?asc,desc */
    isAsc?: 'asc' | 'desc' | null
    /** 分页参数合理�?*/
    reasonable?: boolean | null
}
