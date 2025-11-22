import http from '@/utils/http'
import type {CourseDTO, CourseQueryParams, CourseVO, PublicCourseVO} from '@/types/course'

// 获取默认课程查询对象
export function getDefaultCourseQuery(): CourseQueryParams {
    return {
        courseName: null,
        teacherId: null,
        semester: null,
        courseType: null,
        location: null,
        status: null,
        isPublic: null,
        studentId: null,
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
        id: null,
        courseName: null,
        teacherId: null,
        assistantTeacherIds: null,
        description: null,
        coverImageUrl: null,
        semester: null,
        location: null,
        courseType: null,
        status: null,
        isPublic: null
    }
}

/**
 * 更新现有课程
 * @param courseData 课程信息数据传输对象
 * @returns 更新结果
 */
export function updateCourse(courseData: CourseDTO) {
    return http.put('/course/', courseData)
}

/**
 * 批量删除课程
 * @param courseIds 课程ID列表
 * @returns 删除结果
 */
export function removeCourseByIds(courseIds: string[]) {
    return http.delete('/course/', {data: courseIds})
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
    return http.getTableData<CourseVO>('/course/list', params)
}

/**
 * 获取公开课程列表
 * 该接口无需权限验证，可供未登录用户访问，仅返回正常状态的课程，不包含敏感信息
 * @returns 公开课程列表
 */
export function listPublicCourse() {
    return http.get<PublicCourseVO[]>('/course/public/list')
}

/**
 * 获取默认公开课程VO
 * @returns 默认公开课程VO对象
 */
export function getDefaultPublicCourseVO(): PublicCourseVO {
    return {
        id: null,
        courseName: null,
        description: null,
        coverImageUrl: null,
        courseType: null,
        semester: null,
        location: null,
        teacherName: null,
        teacherAvatar: null,
        createTime: null
    }
}
