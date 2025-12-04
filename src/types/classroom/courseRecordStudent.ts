/**
 * 课程记录学生相关类型定义
 */
import type {PageEntity} from '../common/baseEntity'
import type {SeatStatusEnum} from '@/enum/classroom/seatStatusEnum'
import type {AttendanceStatusEnum} from '@/enum/classroom/attendanceStatusEnum'

/**
 * 课程记录学生参与数据传输对象
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
    /** 学生座位的x坐标 */
    locationX: number | null
    /** 学生座位的y坐标 */
    locationY: number | null
    /** 3D坐标Z (纵深) - 可选，用于3D场景 */
    locationZ: number | null
    /** 朝向角度 (弧度制) - 可选，用于3D场景 */
    rotationY: number | null
    /** 座位状态 (0=正常, 2=已预留, 3=已占用) */
    seatStatus: SeatStatusEnum | null
    /** 出勤状态 (0=未签到, 1=已签到, 2=缺席) */
    attendanceStatus: AttendanceStatusEnum | null
    /** 课堂互动得分 (可选) */
    participationScore: number | null
}

/**
 * 课程记录学生参与视图对象
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
    /** 座位编号 (从0开始) */
    seatIndex: number
    /** 学生座位的x坐标 */
    locationX: number
    /** 学生座位的y坐标 */
    locationY: number
    /** 3D坐标Z (纵深) - 可选，用于3D场景 */
    locationZ?: number
    /** 朝向角度 (弧度制) - 可选，用于3D场景 */
    rotationY?: number
    /** 座位状态 (0=正常, 2=已预留, 3=已占用) */
    seatStatus: SeatStatusEnum
    /** 出勤状态 (0=未签到, 1=已签到, 2=缺席) - 可选 */
    attendanceStatus?: AttendanceStatusEnum
    /** 课堂互动得分 (可选) */
    participationScore?: number
    /** 创建时间 */
    createTime: string
    /** 更新时间 */
    updateTime: string
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

