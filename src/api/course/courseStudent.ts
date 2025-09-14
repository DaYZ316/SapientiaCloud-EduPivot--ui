import http from '@/utils/http'
import type {CourseStudentDTO, CourseStudentQueryParams, CourseStudentVO} from '@/types/course'
import type {TableDataResult} from '@/types/common/baseEntity'

// 获取默认课程学生DTO
export function getDefaultCourseStudentDTO(): CourseStudentDTO {
    return {
        studentId: null,
        courseId: null
    }
}

// 获取默认课程学生查询对象
export function getDefaultCourseStudentQuery(): CourseStudentQueryParams {
    return {
        studentId: null,
        courseId: null,
        startTime: null,
        endTime: null,
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'create_time',
        isAsc: 'asc',
        reasonable: null
    }
}

/**
 * 修改选课信息
 * @param courseStudentData 课程学生数据传输对象
 * @returns 更新结果
 */
export function updateCourseStudent(courseStudentData: CourseStudentDTO) {
    return http.put('/course/course-student', courseStudentData)
}

/**
 * 批量删除选课记录
 * @param courseId 课程ID
 * @param studentIds 学生ID列表
 * @returns 删除结果
 */
export function removeCourseStudentByStudentIds(courseId: string, studentIds: string[]) {
    return http.delete('/course/course-student', {
        params: {courseId},
        data: studentIds
    })
}

/**
 * 获取学生在指定课程中的选课信息
 * @param studentId 学生ID
 * @param courseId 课程ID
 * @returns 选课信息
 */
export function getStudentCourseById(studentId: string, courseId: string) {
    return http.get<CourseStudentVO>(`/course/course-student/${studentId}`, {
        params: {courseId}
    })
}

/**
 * 学生退出已选的课程
 * @param studentId 学生ID
 * @param courseId 课程ID
 * @returns 退课结果
 */
export function removeCourseStudentByStudentId(studentId: string, courseId: string) {
    return http.delete(`/course/course-student/${studentId}`, {
        params: {courseId}
    })
}

/**
 * 学生选择某门课程
 * @param courseStudentData 课程学生数据传输对象
 * @returns 选课结果
 */
export function addCourseStudent(courseStudentData: CourseStudentDTO) {
    return http.post('/course/course-student/add', courseStudentData)
}

/**
 * 根据课程ID获取所有选课学生
 * @param courseId 课程ID
 * @returns 所有选课学生列表
 */
export function listAllCourseStudentByCourseId(courseId: string) {
    return http.get<CourseStudentVO[]>(`/course/course-student/course/${courseId}/all`)
}

/**
 * 分页查询选课记录
 * @param params 查询参数
 * @returns 选课记录分页列表
 */
export function listCourseStudent(params: CourseStudentQueryParams) {
    return http.get<TableDataResult<CourseStudentVO>>('/course/course-student/course/list', params)
}

/**
 * 根据学生ID获取所有选课记录
 * @param studentId 学生ID
 * @returns 学生所有选课记录
 */
export function listAllCourseStudentByStudentId(studentId: string) {
    return http.get<CourseStudentVO[]>(`/course/course-student/student/${studentId}/all`)
}
