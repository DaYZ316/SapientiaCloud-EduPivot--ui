import http from '@/utils/http'
import type {CourseQueryParams, CourseVO, CourseTeacherAssignDTO, CourseTeacherDTO, CourseTeacherQueryDTO} from '@/types/course'
import type {TeacherVO} from '@/types/teacher'

/**
 * 初始化 CourseTeacherQueryDTO
 */
export function initCourseTeacherQueryDTO(): CourseTeacherQueryDTO {
    return {
        teacherId: null,
        startTime: null,
        endTime: null,
        pageNum: null,
        pageSize: null,
        orderByColumn: null,
        isAsc: null,
        reasonable: null
    }
}

/**
 * 初始化 CourseTeacherAssignDTO
 */
export function initCourseTeacherAssignDTO(): CourseTeacherAssignDTO {
    return {
        courseId: null,
        teacherIds: null
    }
}

/**
 * 初始化 CourseTeacherDTO
 */
export function initCourseTeacherDTO(): CourseTeacherDTO {
    return {
        courseId: null,
        teacherId: null
    }
}

/**
 * 为指定课程分配主讲教师
 * @param courseId 课程ID
 * @param teacherId 教师ID
 * @returns 分配结果
 */
export function assignTeacher(courseId: string, teacherId: string) {
    return http.post(`/course/course-teacher/${courseId}/teacher`, null, {
        params: {teacherId}
    })
}

/**
 * 为指定课程批量分配教师团队
 * @param courseId 课程ID
 * @param teacherIds 教师ID列表
 * @returns 分配结果
 */
export function assignCourseTeachers(courseId: string, teacherIds: string[]) {
    return http.post(`/course/course-teacher/${courseId}/teachers/assign`, teacherIds)
}

/**
 * 获取教师作为负责人或教学团队成员的所有课程
 * @param teacherId 教师ID
 * @returns 教师课程列表
 */
export function listAllCourseByTeacherId(teacherId: string) {
    return http.get<CourseVO[]>(`/course/course-teacher/teacher/${teacherId}/all`)
}

/**
 * 获取课程下的所有教师
 * @param courseId 课程ID
 * @returns 教师列表
 */
export function listAllTeacherByCourseId(courseId: string) {
    return http.get<TeacherVO[]>(`/course/course-teacher/course/${courseId}/all`)
}

/**
 * 分页获取教师作为负责人或教学团队成员的所有课程
 * @param params 查询参数
 * @returns 教师课程分页列表
 */
export function listCourseByTeacherId(params: CourseQueryParams) {
    return http.getTableData<CourseVO>('/course/course-teacher/teacher', params)
}

/**
 * 分页获取当前教师作为助教参与的课程
 * @param params 查询参数
 */
export function listMyCourseForTeacher(params: CourseTeacherQueryDTO) {
    return http.getTableData<CourseVO>('/course/course-teacher/my-course', params)
}

/**
 * 为指定课程批量添加助教教师关系
 * @param courseId 课程ID
 * @param teacherIds 教师ID列表
 */
export function batchAddAssistantTeachers(courseId: string, teacherIds: string[]) {
    return http.post(`/course/course-teacher/${courseId}/assistants/batch`, teacherIds)
}

/**
 * 为指定课程批量删除助教教师关系
 * @param courseId 课程ID
 * @param teacherIds 教师ID列表
 */
export function batchDeleteAssistantTeachers(courseId: string, teacherIds: string[]) {
    return http.delete(`/course/course-teacher/${courseId}/assistants/batch`, { data: teacherIds })
}