import type {EnrollmentStatusEnum} from '@/enum/course'
import type {CourseVO} from './course'

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
    /** 学生真实姓名 */
    realName?: string
    /** 学生头像 */
    avatar?: string
    /** 系统用户ID */
    sysUserId?: string
    /** 课程ID */
    courseId: string
    /** 成绩 */
    grade?: number
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
    /** 学生真实姓名 */
    realName?: string | null
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

/**
 * 我的课程视图对象
 * 用于展示学生的我的课程信息
 */
export interface MyCourseVO {
    /** 课程VO */
    courseVO?: CourseVO | null
    /** 成绩 */
    grade?: number | null
    /** 选课状态 (0=在读, 1=已退课, 2=已完成) */
    status?: EnrollmentStatusEnum | number | null
    /** 入课时间 */
    createTime?: string | null
}

/**
 * 我的课程查询参数
 * 用于我的课程分页查询
 */
export interface MyCourseQueryParams {
    /** 课程名称（模糊查询） */
    courseName?: string | null
    /** 课程类型 */
    courseType?: number | null
    /** 选课状态 (0=在读, 1=已退课, 2=已完成) */
    status?: number | null
    /** 学生ID */
    studentId?: string | null
    /** 是否公开 (0=仅课程成员, 1=公开) */
    isPublic?: number | null
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