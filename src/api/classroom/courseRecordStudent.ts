import http from '@/utils/http'
import type {
    CourseRecordStudentDTO,
    CourseRecordStudentPageQueryDTO,
    CourseRecordStudentVO,
    StudentSeatDeleteDTO
} from '@/types/classroom'
import type {TableDataResult} from '@/types/common/baseEntity'

// 获取默认课程记录学生DTO
export function getDefaultCourseRecordStudentDTO(): CourseRecordStudentDTO {
    return {
        recordId: null,
        studentId: null,
        courseId: null,
        seatIndex: null,
        locationX: null,
        locationY: null,
        locationZ: null,
        rotationY: null,
        seatStatus: null,
        attendanceStatus: null,
        participationScore: null
    }
}

// 获取默认学生座位删除DTO
export function getDefaultStudentSeatDeleteDTO(): StudentSeatDeleteDTO {
    return {
        recordId: null,
        studentId: null
    }
}

// 根据课程记录ID和学生ID删除学生座位
export function removeStudentSeat(recordId: string, studentId: string) {
    return http.delete<boolean>(`/classroom/course-record-student/${recordId}/${studentId}`)
}

// 添加学生到课程记录，分配座位
export function addStudentSeat(data: CourseRecordStudentDTO) {
    return http.post<CourseRecordStudentVO>('/classroom/course-record-student/add', data)
}

// 获取所有课程记录学生列表
export function listAllCourseRecordStudent() {
    return http.get<CourseRecordStudentVO[]>('/classroom/course-record-student/all')
}

// 批量删除学生座位
export function removeStudentSeatBatch(data: StudentSeatDeleteDTO[]) {
    return http.delete<number>('/classroom/course-record-student/batch', {data})
}

// 检查指定座位是否已被占用
export function checkSeatOccupied(recordId: string, seatIndex: number) {
    return http.get<boolean>(`/classroom/course-record-student/check-seat/${recordId}/${seatIndex}`)
}

// 统计课程记录的学生数量
export function countStudentsByRecordId(recordId: string) {
    return http.get<number>(`/classroom/course-record-student/count/${recordId}`)
}

// 根据条件分页查询课程记录学生列表，支持按课程记录、学生、座位状态等条件筛选
export function listCourseRecordStudent(params: CourseRecordStudentPageQueryDTO) {
    return http.get<TableDataResult<CourseRecordStudentVO>>('/classroom/course-record-student/list', params)
}

// 根据课程记录ID查询该课程记录的所有学生信息
export function listStudentsByRecordId(recordId: string) {
    return http.get<CourseRecordStudentVO[]>(`/classroom/course-record-student/record/${recordId}`)
}

// 查询学生在课程记录中的座位信息
export function getStudentSeat(recordId: string, studentId: string) {
    return http.get<CourseRecordStudentVO>(`/classroom/course-record-student/student-seat/${recordId}`, {
        studentId
    })
}

// 修改学生座位信息（包括位置、状态、出勤等）
export function updateStudentSeat(data: CourseRecordStudentDTO) {
    return http.put<boolean>('/classroom/course-record-student/update', data)
}

