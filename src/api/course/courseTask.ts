import http from '@/utils/http'
import type {CourseTaskDTO, CourseTaskQueryParams, CourseTaskVO} from '@/types/course'

// 获取默认任务查询对象
export function getDefaultCourseTaskQuery(): CourseTaskQueryParams {
    return {
        taskName: null,
        courseId: null,
        sysUserId: null,
        taskType: null,
        status: null,
        difficulty: null,
        startTime: null,
        endTime: null,
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'create_time',
        isAsc: 'asc',
        reasonable: null
    }
}

// 获取默认任务添加DTO
export function getDefaultCourseTaskDTO(): CourseTaskDTO {
    return {
        id: null,
        courseId: null,
        sysUserId: null,
        taskName: null,
        description: null,
        taskType: null,
        taskContent: null,
        attachmentUrls: null,
        resourceUrls: null,
        maxScore: null,
        startTime: Date.now(),
        endTime: null,
        allowLateSubmit: null,
        maxSubmitCount: null,
        autoGrade: null,
        tags: null,
        difficulty: null,
        estimatedTime: null,
        status: null
    }
}

/**
 * 创建新的课程任务
 * @param taskData 任务信息数据传输对象
 * @returns 创建结果
 */
export function addCourseTask(taskData: CourseTaskDTO) {
    return http.post<CourseTaskVO>('/course/task', taskData)
}

/**
 * 更新现有任务的信息
 * @param taskData 任务信息数据传输对象
 * @returns 更新结果
 */
export function updateCourseTask(taskData: CourseTaskDTO) {
    return http.put('/course/task', taskData)
}

/**
 * 根据任务ID列表批量删除任务
 * @param taskIds 任务ID列表
 * @returns 删除结果
 */
export function removeCourseTaskByIds(taskIds: string[]) {
    return http.delete('/course/task', {data: taskIds})
}

/**
 * 根据任务ID获取任务详情
 * @param id 任务ID
 * @returns 任务信息
 */
export function getCourseTaskById(id: string) {
    return http.get<CourseTaskVO>(`/course/task/${id}`)
}

/**
 * 根据任务ID删除任务
 * @param id 任务ID
 * @returns 删除结果
 */
export function removeCourseTaskById(id: string) {
    return http.delete(`/course/task/${id}`)
}

/**
 * 获取所有任务列表
 * @returns 所有任务列表
 */
export function listAllCourseTaskByCourseId(courseId: string) {
    return http.get<CourseTaskVO[]>(`/course/task/course/${courseId}`)
}

/**
 * 分页查找任务
 * @param params 查询参数
 * @returns 分页任务列表
 */
export function listCourseTask(params: CourseTaskQueryParams) {
    return http.getTableData<CourseTaskVO>('/course/task/list', params)
}
