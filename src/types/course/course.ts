import type {CoursePublicEnum, CourseStatusEnum, CourseTypeEnum} from '@/enum/course'

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
    /** 是否公开 (0=仅课程成员, 1=公开) */
    isPublic?: CoursePublicEnum | null
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
    /** 主讲教师用户ID */
    teacherUserId?: string
    /** 主讲教师姓名 */
    teacherName?: string
    /** 主讲教师头像 */
    teacherAvatar?: string
    /** 辅助教学教师ID列表 */
    assistantTeacherIds?: string[]
    /** 辅助教学教师姓名列表 */
    assistantTeacherNames?: string[]
    /** 课程封面图片URL */
    coverImageUrl?: string
    /** 课程状态 (0=正常, 1=停课) */
    status?: CourseStatusEnum
    /** 是否公开 (0=仅课程成员, 1=公开) */
    isPublic?: CoursePublicEnum
    /** 学生总数 */
    studentCount?: number
    /** 章节总数 */
    chapterCount?: number
    /** 论坛总数 */
    forumCount?: number
    /** 课程评分 */
    rating?: number
    /** 评分人数 */
    ratingCount?: number
    /** 是否已选课 */
    isEnrolled?: boolean
    /** 选课状态 */
    enrollmentStatus?: number
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
}

/**
 * 公开课程视图对象
 * 用于公开课程信息的展示，无需权限验证
 */
export interface PublicCourseVO {
    /** 课程ID */
    id: string | null
    /** 课程名称 */
    courseName: string | null
    /** 课程描述 */
    description?: string | null
    /** 课程封面图片URL */
    coverImageUrl?: string | null
    /** 课程类型 (0=必修, 1=选修) */
    courseType?: CourseTypeEnum | null
    /** 开设学期 */
    semester?: string | null
    /** 上课地点 */
    location?: string | null
    /** 授课教师姓名 */
    teacherName?: string | null
    /** 授课教师头像 */
    teacherAvatar?: string | null
    /** 创建时间 */
    createTime?: string | null
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
    /** 是否公开 (0=仅课程成员, 1=公开) */
    isPublic?: string | null
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
    /** 排序字段 */
    orderByColumn?: string | null
    /** 排序的方向，可用值：asc,desc */
    isAsc?: 'asc' | 'desc' | null
    /** 分页参数合理化 */
    reasonable?: boolean | null
}