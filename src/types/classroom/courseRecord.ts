/**
 * 课程记录相关类型定义
 */
import type {PageEntity} from '../common/baseEntity'
import type {ClassroomTypeEnum} from '@/enum/classroom/classroomTypeEnum'
import type {CourseRecordStatusEnum} from '@/enum/classroom/courseRecordStatusEnum'

/**
 * 课程记录数据传输对象
 */
export interface CourseRecordDTO {
    /** 课程记录ID，更新时必须提供 */
    id: string | null
    /** 关联课程ID */
    courseId: string | null
    /** 授课教师ID */
    teacherId: string | null
    /** 课程名称 */
    courseName: string | null
    /** 课程内容简介 */
    courseDescription: string | null
    /** 教室类型 (0=小型教室, 1=中型教室, 2=大型教室, 3=超大型教室) */
    classroomType: ClassroomTypeEnum | null
    /** 行数 (仅传统布局或对齐布局使用) */
    layoutRows: number | null
    /** 列数 (仅传统布局或对齐布局使用) */
    layoutColumns: number | null
    /** 课程开始时间 */
    startTime: string | null
    /** 课程结束时间 */
    overTime: string | null
    /** 课程状态 (0=未开始, 1=进行中, 2=已结束, 3=取消) */
    status: CourseRecordStatusEnum | null
}

/**
 * 课程记录视图对象
 */
export interface CourseRecordVO {
    /** 课程记录ID */
    id: string
    /** 关联课程ID */
    courseId: string
    /** 课程名称 */
    courseName: string
    /** 课程内容简介 */
    courseDescription: string
    /** 授课教师ID */
    teacherId: string
    /** 授课教师姓名 */
    teacherName: string
    /** 授课教师头像 */
    teacherAvatar: string
    /** 教室类型 (0=小型教室, 1=中型教室, 2=大型教室, 3=超大型教室) */
    classroomType: ClassroomTypeEnum
    /** 行数 (仅传统布局或对齐布局使用) */
    layoutRows: number
    /** 列数 (仅传统布局或对齐布局使用) */
    layoutColumns: number
    /** 课程开始时间 */
    startTime: string
    /** 课程结束时间 */
    overTime: string
    /** 课程状态 (0=未开始, 1=进行中, 2=已结束, 3=取消) */
    status: CourseRecordStatusEnum
    /** 创建时间 */
    createTime: string
    /** 更新时间 */
    updateTime: string
}

/**
 * 课程记录分页查询DTO
 */
export interface CourseRecordPageQueryDTO extends PageEntity {
    /** 关联课程ID */
    courseId?: string | null
    /** 授课教师ID */
    teacherId?: string | null
    /** 课程名称（模糊查询） */
    courseName?: string | null
    /** 教室类型 (0=小型教室, 1=中型教室, 2=大型教室, 3=超大型教室) */
    classroomType?: string | null
    /** 课程状态 (0=未开始, 1=进行中, 2=已结束, 3=取消) */
    status?: string | null
    /** 开始时间范围 - 起始 */
    startTimeBegin?: string | null
    /** 开始时间范围 - 结束 */
    startTimeEnd?: string | null
}

