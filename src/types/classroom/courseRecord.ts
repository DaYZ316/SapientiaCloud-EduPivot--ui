/**
 * 课程记录相关类型定义
 */
import type {LayoutConfig} from './layoutConfig'
import type {PageEntity} from '../common/baseEntity'

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
    /** 授课教师系统用户ID */
    teacherId: string
    /** 授课教师姓名 */
    teacherName: string
    /** 授课教师头像 */
    teacherAvatar: string
    /** 参与学生ID列表 (JSON数组) */
    studentIds: string[]
    /** 课堂互动题目ID列表 (JSON数组) */
    questionIds: string[]
    /** 教室模型类型 (classroomSmall, classroomMiddle, classroomLarge) */
    modelType: string
    /** 桌椅总数 (1-200) */
    totalDesks: number
    /** 行数 (仅传统布局或对齐布局使用) */
    layoutRows: number | null
    /** 列数 (仅传统布局或对齐布局使用) */
    layoutColumns: number | null
    /** 桌椅间距系数 (0.7-1.5) */
    spacing: number | null
    /** 教室布局详细参数 */
    layoutConfig: LayoutConfig | null
    /** 【废弃】旧版布局字段，仅兼容早期版本 */
    classroomLayout: object | null
    /** 课程开始时间 */
    startTime: string | null
    /** 课程结束时间 */
    overTime: string | null
    /** 课程状态 (0=未开始, 1=进行中, 2=已结束, 3=取消) */
    status: number
    /** 应到人数 */
    expectedStudents: number
    /** 实到人数 */
    actualStudents: number
    /** 出勤率 (%) */
    attendanceRate: number | null
    /** 课程时长 (分钟) */
    durationMinutes: number | null
    /** 创建时间 */
    createTime: string
    /** 更新时间 */
    updateTime: string
}

/**
 * 课程记录数据传输对象
 */
export interface CourseRecordDTO {
    /** 课程记录ID，更新时必须提供 */
    id: string | null
    /** 关联课程ID */
    courseId: string | null
    /** 授课教师系统用户ID */
    teacherId: string | null
    /** 参与学生ID列表 (JSON数组) */
    studentIds: string[] | null
    /** 课堂互动题目ID列表 (JSON数组) */
    questionIds: string[] | null
    /** 教室模型类型 (classroomSmall, classroomMiddle, classroomLarge) */
    modelType: string | null
    /** 桌椅总数 (1-200) */
    totalDesks: number | null
    /** 行数 (仅传统布局或对齐布局使用) */
    layoutRows: number | null
    /** 列数 (仅传统布局或对齐布局使用) */
    layoutColumns: number | null
    /** 桌椅间距系数 (0.7-1.5) */
    spacing: number | null
    /** 教室布局详细参数 */
    layoutConfig: LayoutConfig | null
    /** 【废弃】旧版布局字段，仅兼容早期版本 */
    classroomLayout: object | null
    /** 课程开始时间 */
    startTime: string | null
    /** 课程结束时间 */
    overTime: string | null
    /** 课程状态 (0=未开始, 1=进行中, 2=已结束, 3=取消) */
    status: number | null
}

/**
 * 课程记录分页查询DTO
 */
export interface CourseRecordPageQueryDTO extends PageEntity {
    /** 关联课程ID */
    courseId?: string | null
    /** 授课教师系统用户ID */
    teacherId?: string | null
    /** 教室模型类型 (classroomSmall, classroomMiddle, classroomLarge) */
    modelType?: string | null
    /** 课程状态 (0=未开始, 1=进行中, 2=已结束, 3=取消) */
    status?: string | null
    /** 开始时间范围 - 起始 */
    startTimeBegin?: string | null
    /** 开始时间范围 - 结束 */
    startTimeEnd?: string | null
}

