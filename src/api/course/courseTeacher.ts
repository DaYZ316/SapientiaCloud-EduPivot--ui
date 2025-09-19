import http from '@/utils/http'
import type {CourseQueryParams, CourseVO} from '@/types/course'
import type {TableDataResult} from '@/types/common/baseEntity'
import type {TeacherVO} from '@/types/teacher'

/**
 * 为指定课程分配主讲教�? * @param courseId 课程ID
 * @param teacherId 教师ID
 * @returns 分配结果
 */
export function assignTeacher(courseId: string, teacherId: string) {
    return http.post(`/course/course-teacher/${courseId}/teacher`, null, {
        params: {teacherId}
    })
}

/**
 * 为指定课程批量分配教师团�? * @param courseId 课程ID
 * @param teacherIds 教师ID列表
 * @returns 分配结果
 */
export function assignCourseTeachers(courseId: string, teacherIds: string[]) {
    return http.post(`/course/course-teacher/${courseId}/teachers/assign`, teacherIds)
}

/**
 * 获取教师作为负责人或教学团队成员的所有课程? * @param teacherId 教师ID
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
    return http.get<TableDataResult<CourseVO>>('/course/course-teacher/teacher', params)
}