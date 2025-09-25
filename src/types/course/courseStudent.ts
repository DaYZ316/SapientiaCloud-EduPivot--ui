import type {EnrollmentStatusEnum} from '@/enum/course'

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
    /** 学生姓名 */
    studentName?: string
    /** 学生学号 */
    studentNumber?: string
    /** 学生头像 */
    studentAvatar?: string
    /** 成绩 */
    grade?: number
    /** 选课状态 (0=在读, 1=已退课, 2=已完成) */
    status?: EnrollmentStatusEnum
    /** 选课时间 */
    enrollmentTime?: string
    /** 最后学习时间 */
    lastStudyTime?: string
    /** 学习进度 */
    studyProgress?: number
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
    /** 学生姓名（模糊查询） */
    studentName?: string | null
    /** 学生学号（模糊查询） */
    studentNumber?: string | null
    /** 选课状态 */
    status?: string | null
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