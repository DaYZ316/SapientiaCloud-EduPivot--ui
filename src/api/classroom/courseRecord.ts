import http from '@/utils/http'
import type {
    CourseRecordDTO,
    CourseRecordVO,
    CourseRecordPageQueryDTO
} from '@/types/classroom'
import type {TableDataResult} from '@/types/common/baseEntity'

// 获取默认课程记录DTO
export function getDefaultCourseRecordDTO(): CourseRecordDTO {
    return {
        id: null,
        courseId: null,
        teacherId: null,
        studentIds: null,
        questionIds: null,
        modelType: null,
        totalDesks: null,
        layoutRows: null,
        layoutColumns: null,
        spacing: null,
        layoutConfig: null,
        classroomLayout: null,
        startTime: null,
        overTime: null,
        status: null
    }
}

// 根据ID查询课程记录详细信息
export function getCourseRecordById(id: string) {
    return http.get<CourseRecordVO>(`/classroom/course-record/${id}`)
}

// 根据ID删除课程记录
export function removeCourseRecordById(id: string) {
    return http.delete<boolean>(`/classroom/course-record/${id}`)
}

// 教师开课，创建课程教学记录
export function addCourseRecord(data: CourseRecordDTO) {
    return http.post<CourseRecordVO>('/classroom/course-record/add', data)
}

// 获取所有课程记录列表
export function listAllCourseRecord() {
    return http.get<CourseRecordVO[]>('/classroom/course-record/all')
}

// 根据ID列表批量删除课程记录
export function removeCourseRecordByIds(ids: string[]) {
    return http.delete<number>('/classroom/course-record/batch', ids)
}

// 根据课程ID查询该课程的所有教学记录
export function listCourseRecordByCourseId(courseId: string) {
    return http.get<CourseRecordVO[]>(`/classroom/course-record/course/${courseId}`)
}

// 教师下课，结束课程记录
export function endCourseRecord(id: string) {
    return http.post<boolean>(`/classroom/course-record/end/${id}`)
}

// 根据条件分页查询课程记录列表，支持按课程、教师、状态等条件筛选
export function listCourseRecord(params: CourseRecordPageQueryDTO) {
    return http.get<TableDataResult<CourseRecordVO>>('/classroom/course-record/list', params)
}

// 根据教师ID查询该教师的所有教学记录
export function listCourseRecordByTeacherId(teacherId: string) {
    return http.get<CourseRecordVO[]>(`/classroom/course-record/teacher/${teacherId}`)
}

// 修改课程记录信息
export function updateCourseRecord(data: CourseRecordDTO) {
    return http.put<boolean>('/classroom/course-record/update', data)
}

