import http from '@/utils/http'
import type {
    CourseDTO,
    CourseQueryParams,
    CourseStudentDTO,
    CourseStudentQueryParams,
    CourseStudentVO,
    CourseVO
} from '@/types/course'
import type {TableDataResult} from '@/types/common/baseEntity'

// 获取默认课程查询对象
export function getDefaultCourseQuery(): CourseQueryParams {
    return {
        courseName: null,
        teacherId: null,
        semester: null,
        courseType: null,
        location: null,
        status: null,
        startTime: null,
        endTime: null,
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'create_time',
        isAsc: 'asc',
        reasonable: null
    }
}

// 获取默认课程添加DTO
export function getDefaultCourseDTO(): CourseDTO {
    return {
        courseName: null,
        teacherId: null,
        assistantTeacherIds: null,
        coverImageUrl: null
    }
}

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

// ==================== 课程管理 ====================

/**
 * 更新现有课程
 * @param courseData 课程信息数据传输对象
 * @returns 更新结果
 */
export function updateCourse(courseData: CourseDTO) {
    return http.put('/course', courseData)
}

/**
 * 批量删除课程
 * @param courseIds 课程ID列表
 * @returns 删除结果
 */
export function removeCourseByIds(courseIds: string[]) {
    return http.delete('/course', {data: courseIds})
}

/**
 * 学生加入课程
 * @param courseId 课程ID
 * @param studentId 学生ID
 * @returns 加入结果
 */
export function enrollStudentToCourse(courseId: string, studentId: string) {
    return http.post(`/course/${courseId}/enroll`, null, {
        params: {studentId}
    })
}

/**
 * 分配课程教师
 * @param courseId 课程ID
 * @param teacherId 教师ID
 * @returns 分配结果
 */
export function assignCourseTeacher(courseId: string, teacherId: string) {
    return http.post(`/course/${courseId}/teacher`, null, {
        params: {teacherId}
    })
}

/**
 * 分配课程教师团队
 * @param courseId 课程ID
 * @param teacherIds 教师ID列表
 * @returns 分配结果
 */
export function assignCourseTeacherTeam(courseId: string, teacherIds: string[]) {
    return http.post(`/course/${courseId}/teachers`, teacherIds)
}

/**
 * 批量分配课程教师团队
 * @param courseId 课程ID
 * @param teacherIds 教师ID列表
 * @returns 分配结果
 */
export function assignCourseTeachers(courseId: string, teacherIds: string[]) {
    return http.post(`/course/${courseId}/teachers/assign`, teacherIds)
}

/**
 * 根据ID获取课程
 * @param id 课程ID
 * @returns 课程信息
 */
export function getCourseById(id: string) {
    return http.get<CourseVO>(`/course/${id}`)
}

/**
 * 删除课程
 * @param id 课程ID
 * @returns 删除结果
 */
export function removeCourseById(id: string) {
    return http.delete(`/course/${id}`)
}

/**
 * 管理员添加新课程
 * @param courseData 课程信息数据传输对象
 * @returns 添加结果
 */
export function addCourse(courseData: CourseDTO) {
    return http.post<CourseVO>('/course/add', courseData)
}

/**
 * 获取所有课程
 * @returns 所有课程列表
 */
export function listAllCourse() {
    return http.get<CourseVO[]>('/course/all')
}

/**
 * 分页查找课程
 * @param params 查询参数
 * @returns 分页课程列表
 */
export function listCourse(params: CourseQueryParams) {
    return http.get<TableDataResult<CourseVO>>('/course/list', params)
}

/**
 * 根据学生ID查询课程
 * @param studentId 学生ID
 * @returns 学生已选课程列表
 */
export function listAllCourseByStudentId(studentId: string) {
    return http.get<CourseVO[]>(`/course/student/${studentId}/all`)
}

/**
 * 根据学生ID分页查询课程
 * @param params 查询参数
 * @returns 学生已选课程分页列表
 */
export function listCourseByStudentId(params: CourseQueryParams) {
    return http.get<TableDataResult<CourseVO>>('/course/student/page', params)
}

/**
 * 根据教师ID获取课程列表
 * @param teacherId 教师ID
 * @returns 教师课程列表
 */
export function listAllCourseByTeacherId(teacherId: string) {
    return http.get<CourseVO[]>(`/course/teacher/${teacherId}/all`)
}

/**
 * 根据教师ID分页查询课程
 * @param params 查询参数
 * @returns 教师课程分页列表
 */
export function listCourseByTeacherId(params: CourseQueryParams) {
    return http.get<TableDataResult<CourseVO>>('/course/teacher/page', params)
}

// ==================== 课程学生管理 ====================

/**
 * 检查学生是否已选某门课程
 * @param studentId 学生ID
 * @param courseId 课程ID
 * @returns 是否已选课
 */
export function isEnrolled(studentId: string, courseId: string) {
    return http.get<boolean>('/course/course-student/check-enrolled', {
        params: {studentId, courseId}
    })
}

/**
 * 分页查询课程选课学生
 * @param params 查询参数
 * @returns 选课学生分页列表
 */
export function listCourseStudentByCourseId(params: CourseStudentQueryParams) {
    return http.get<TableDataResult<CourseStudentVO>>('/course/course-student/course/page', params)
}

/**
 * 获取课程所有选课学生
 * @param courseId 课程ID
 * @returns 所有选课学生列表
 */
export function listAllCourseStudentByCourseId(courseId: string) {
    return http.get<CourseStudentVO[]>(`/course/course-student/course/${courseId}/all`)
}

/**
 * 学生退课
 * @param studentId 学生ID
 * @param courseId 课程ID
 * @returns 退课结果
 */
export function dropCourse(studentId: string, courseId: string) {
    return http.post('/course/course-student/drop', null, {
        params: {studentId, courseId}
    })
}

/**
 * 学生选课
 * @param courseStudentData 课程学生数据传输对象
 * @returns 选课结果
 */
export function enrollCourse(courseStudentData: CourseStudentDTO) {
    return http.post('/course/course-student/enroll', courseStudentData)
}

/**
 * 获取学生某门课程的成绩
 * @param studentId 学生ID
 * @param courseId 课程ID
 * @returns 学生成绩
 */
export function getStudentGrade(studentId: string, courseId: string) {
    return http.get<number>('/course/course-student/grade', {
        params: {studentId, courseId}
    })
}

/**
 * 更新学生成绩
 * @param studentId 学生ID
 * @param courseId 课程ID
 * @param grade 成绩
 * @returns 更新结果
 */
export function updateGrade(studentId: string, courseId: string, grade: number) {
    return http.put('/course/course-student/grade', null, {
        params: {studentId, courseId, grade}
    })
}

/**
 * 批量更新学生成绩
 * @param courseStudentDTOs 课程学生数据传输对象列表
 * @returns 批量更新结果
 */
export function batchUpdateGrade(courseStudentDTOs: CourseStudentDTO[]) {
    return http.put<number>('/course/course-student/grade/batch', courseStudentDTOs)
}

/**
 * 分页查询学生选课记录
 * @param params 查询参数
 * @returns 学生选课记录分页列表
 */
export function listCourseStudentByStudentId(params: CourseStudentQueryParams) {
    return http.get<TableDataResult<CourseStudentVO>>('/course/course-student/student/page', params)
}

/**
 * 获取学生所有选课记录
 * @param studentId 学生ID
 * @returns 学生所有选课记录
 */
export function getAllStudentCourses(studentId: string) {
    return http.get<CourseStudentVO[]>(`/course/course-student/student/${studentId}/all`)
}
