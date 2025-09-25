import http from '@/utils/http'
import type {CourseForumDTO, CourseForumQueryParams, CourseForumVO} from '@/types/course'
import type {TableDataResult} from '@/types/common/baseEntity'

// 获取默认课程论坛查询对象
export function getDefaultCourseForumQuery(): CourseForumQueryParams {
    return {
        courseId: null,
        forumName: null,
        forumType: null,
        isPublic: null,
        status: null,
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'sort_order',
        isAsc: 'asc',
        reasonable: null
    }
}

// 获取默认课程论坛添加DTO
export function getDefaultCourseForumDTO(): CourseForumDTO {
    return {
        id: null,
        courseId: null,
        forumName: null,
        description: null,
        forumType: null,
        isPublic: null,
        allowAnonymous: null,
        moderatorIds: null,
        sortOrder: null,
        status: null,
        rules: null,
        tags: null
    }
}

/**
 * 向课程中添加一个新的论坛
 * @param forumData 课程论坛数据传输对象
 * @returns 添加结果
 */
export function addCourseForum(forumData: CourseForumDTO) {
    return http.post<CourseForumVO>('/course/forum', forumData)
}

/**
 * 更新课程论坛信息
 * @param forumData 课程论坛数据传输对象
 * @returns 更新结果
 */
export function updateCourseForum(forumData: CourseForumDTO) {
    return http.put('/course/forum', forumData)
}

/**
 * 批量删除课程论坛
 * @param forumIds 论坛ID列表
 * @returns 删除结果
 */
export function removeCourseForumByIds(forumIds: string[]) {
    return http.delete('/course/forum/', {data: forumIds})
}

/**
 * 根据ID获取课程论坛
 * @param id 论坛ID
 * @returns 论坛信息
 */
export function getCourseForumById(id: string) {
    return http.get<CourseForumVO>(`/course/forum/${id}`)
}

/**
 * 删除课程论坛
 * @param id 论坛ID
 * @returns 删除结果
 */
export function removeCourseForumById(id: string) {
    return http.delete(`/course/forum/${id}`)
}

/**
 * 设置论坛版主
 * @param forumId 论坛ID
 * @param moderatorIds 版主ID列表
 * @returns 设置结果
 */
export function setForumModerators(forumId: string, moderatorIds: string[]) {
    return http.put(`/course/forum/${forumId}/moderators`, moderatorIds)
}

/**
 * 获取论坛统计信息
 * @param forumId 论坛ID
 * @returns 统计信息
 */
export function getForumStatistics(forumId: string) {
    return http.get(`/course/forum/${forumId}/statistics`)
}

/**
 * 更新论坛状态
 * @param forumId 论坛ID
 * @param status 论坛状态
 * @returns 更新结果
 */
export function updateForumStatus(forumId: string, status: number) {
    return http.put(`/course/forum/${forumId}/status`, {status})
}

/**
 * 根据课程ID获取论坛列表
 * @param courseId 课程ID
 * @returns 论坛列表
 */
export function listCourseForumByCourseId(courseId: string) {
    return http.get<CourseForumVO[]>(`/course/${courseId}/forums`)
}

/**
 * 分页查找课程论坛
 * @param params 查询参数
 * @returns 分页论坛列表
 */
export function listCourseForum(params: CourseForumQueryParams) {
    return http.get<TableDataResult<CourseForumVO>>('/course/forum/list', params)
}
