/**
 * 课程记录学生相关类型定义
 */
import type {PageEntity} from '../common/baseEntity'

/**
 * 课程记录学生视图对象
 */
export interface CourseRecordStudentVO {
    /** 课程记录ID */
    recordId: string
    /** 学生ID */
    studentId: string
    /** 学生姓名 */
    studentName: string
    /** 学号 */
    studentCode: string
    /** 学生头像 */
    studentAvatar: string
    /** 课程ID */
    courseId: string
    /** 课程名称 */
    courseName: string
    /** 座位编号 (从0开始) */
    seatIndex: number
    /** 3D坐标X (横向) */
    locationX: number
    /** 3D坐标Y (高度) */
    locationY: number
    /** 3D坐标Z (纵深) */
    locationZ: number
    /** 朝向角度 (弧度制) */
    rotationY: number | null
    /** 座位状态 (normal, marked, reserved, occupied) */
    seatStatus: string | null
    /** 出勤状态 (0=未签到, 1=已签到, 2=缺席) */
    attendanceStatus: number | null
    /** 课堂互动得分 (可选) */
    participationScore: number | null
    /** 创建时间 */
    createTime: string
    /** 更新时间 */
    updateTime: string
}

/**
 * 课程记录学生数据传输对象
 */
export interface CourseRecordStudentDTO {
    /** 课程记录ID */
    recordId: string | null
    /** 学生ID */
    studentId: string | null
    /** 课程ID */
    courseId: string | null
    /** 座位编号 (从0开始) */
    seatIndex: number | null
    /** 3D坐标X (横向) */
    locationX: number | null
    /** 3D坐标Y (高度) */
    locationY: number | null
    /** 3D坐标Z (纵深) */
    locationZ: number | null
    /** 朝向角度 (弧度制) */
    rotationY: number | null
    /** 座位状态 (normal, marked, reserved, occupied) */
    seatStatus: string | null
    /** 出勤状态 (0=未签到, 1=已签到, 2=缺席) */
    attendanceStatus: number | null
    /** 课堂互动得分 (可选) */
    participationScore: number | null
}

/**
 * 学生座位删除数据传输对象
 */
export interface StudentSeatDeleteDTO {
    /** 课程记录ID */
    recordId: string | null
    /** 学生ID */
    studentId: string | null
}

/**
 * 课程记录学生分页查询DTO
 */
export interface CourseRecordStudentPageQueryDTO extends PageEntity {
    /** 课程记录ID */
    recordId?: string | null
    /** 学生ID */
    studentId?: string | null
    /** 课程ID */
    courseId?: string | null
    /** 座位状态 (normal, marked, reserved, occupied) */
    seatStatus?: string | null
    /** 出勤状态 (0=未签到, 1=已签到, 2=缺席) */
    attendanceStatus?: string | null
}

