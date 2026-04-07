import http from '@/utils/http'
import type {
    CourseRecordStudentDTO,
    CourseRecordStudentPageQueryDTO,
    CourseRecordStudentVO,
    StudentSeatDeleteDTO
} from '@/types/classroom'

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

export function getDefaultStudentSeatDeleteDTO(): StudentSeatDeleteDTO {
    return {
        recordId: null,
        studentId: null
    }
}

export function removeStudentSeat(recordId: string, studentId: string) {
    return http.delete<boolean>(`/classroom/course-record-student/${recordId}/${studentId}`)
}

export function addStudentSeat(data: CourseRecordStudentDTO) {
    return http.post<CourseRecordStudentVO>('/classroom/course-record-student/add', data)
}

export function listAllCourseRecordStudent() {
    return http.get<CourseRecordStudentVO[]>('/classroom/course-record-student/all')
}

export function removeStudentSeatBatch(data: StudentSeatDeleteDTO[]) {
    return http.delete<number>('/classroom/course-record-student/batch', {data})
}

export function checkSeatOccupied(recordId: string, seatIndex: number) {
    return http.get<boolean>(`/classroom/course-record-student/check-seat/${recordId}/${seatIndex}`)
}

export function countStudentsByRecordId(recordId: string) {
    return http.get<number>(`/classroom/course-record-student/count/${recordId}`)
}

export function listCourseRecordStudent(params: CourseRecordStudentPageQueryDTO) {
    return http.getTableData<CourseRecordStudentVO>('/classroom/course-record-student/list', params)
}

export function listStudentsByRecordId(recordId: string) {
    return http.get<CourseRecordStudentVO[]>(`/classroom/course-record-student/record/${recordId}`)
}

export function getStudentSeat(recordId: string, studentId: string) {
    return http.get<CourseRecordStudentVO>(`/classroom/course-record-student/student-seat/${recordId}`, {
        studentId
    })
}

export function updateStudentSeat(data: CourseRecordStudentDTO) {
    return http.put<boolean>('/classroom/course-record-student/update', data)
}

// Request a one-time websocket token for seat sync.
export function issueSeatSyncWsToken(recordId: string) {
    return http.post<string>('/classroom/seat-sync/ws-token', null, {
        params: {recordId}
    })
}
