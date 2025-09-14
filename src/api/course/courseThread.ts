import http from '@/utils/http'
import type {CourseThreadDTO, CourseThreadVO, ThreadReplyDTO, ThreadReplyVO} from '@/types/course'
import type {TableDataResult} from '@/types/common/baseEntity'

// 获取默认论坛主贴DTO
export function getDefaultCourseThreadDTO(): CourseThreadDTO {
    return {
        courseId: null,
        userId: null,
        title: null,
        content: null
    }
}

// 获取默认论坛回复DTO
export function getDefaultThreadReplyDTO(): ThreadReplyDTO {
    return {
        threadId: null,
        userId: null,
        content: null
    }
}

// ==================== 课程论坛主贴管理 ====================

/**
 * 修改现有论坛主贴的信息
 * @param courseThreadData 课程论坛主贴数据传输对象
 * @returns 更新结果
 */
export function updateCourseThread(courseThreadData: CourseThreadDTO) {
    return http.put('/course/course-thread', courseThreadData)
}

/**
 * 根据主贴ID列表批量删除主贴
 * @param threadIds 主贴ID列表
 * @returns 删除结果
 */
export function removeCourseThreadByIds(threadIds: string[]) {
    return http.delete('/course/course-thread', {data: threadIds})
}

/**
 * 通过主贴的唯一ID获取其详细信息
 * @param id 主贴ID
 * @returns 主贴信息
 */
export function getCourseThreadById(id: string) {
    return http.get<CourseThreadVO>(`/course/course-thread/${id}`)
}

/**
 * 根据主贴ID从系统中移除主贴
 * @param id 主贴ID
 * @returns 删除结果
 */
export function removeCourseThreadById(id: string) {
    return http.delete(`/course/course-thread/${id}`)
}

/**
 * 发布新的论坛主贴
 * @param courseThreadData 课程论坛主贴数据传输对象
 * @returns 添加结果
 */
export function addCourseThread(courseThreadData: CourseThreadDTO) {
    return http.post<CourseThreadVO>('/course/course-thread/add', courseThreadData)
}

/**
 * 获取所有论坛主贴列表
 * @returns 所有主贴列表
 */
export function listAllCourseThread() {
    return http.get<CourseThreadVO[]>('/course/course-thread/all')
}

/**
 * 关闭或开启主贴
 * @param id 主贴ID
 * @param isClosed 是否关闭
 * @returns 操作结果
 */
export function closeThread(id: string, isClosed: boolean) {
    return http.put(`/course/course-thread/close/${id}`, null, {
        params: {isClosed}
    })
}

/**
 * 根据传入的条件分页查询论坛主贴信息
 * @param params 查询参数
 * @returns 主贴分页列表
 */
export function listCourseThread(params: any) {
    return http.get<TableDataResult<CourseThreadVO>>('/course/course-thread/list', params)
}

/**
 * 置顶或取消置顶主贴
 * @param id 主贴ID
 * @param isPinned 是否置顶
 * @returns 操作结果
 */
export function pinThread(id: string, isPinned: boolean) {
    return http.put(`/course/course-thread/pin/${id}`, null, {
        params: {isPinned}
    })
}

/**
 * 浏览主贴，增加浏览次数
 * @param id 主贴ID
 * @returns 操作结果
 */
export function viewThread(id: string) {
    return http.post(`/course/course-thread/view/${id}`)
}

// ==================== 课程论坛回复管理 ====================

/**
 * 修改现有论坛回复的信息
 * @param threadReplyData 课程论坛回复数据传输对象
 * @returns 更新结果
 */
export function updateThreadReply(threadReplyData: ThreadReplyDTO) {
    return http.put('/course/course-thread/reply', threadReplyData)
}

/**
 * 根据回复ID列表批量删除回复
 * @param replyIds 回复ID列表
 * @returns 删除结果
 */
export function removeThreadReplyByIds(replyIds: string[]) {
    return http.delete('/course/course-thread/reply', {data: replyIds})
}

/**
 * 通过回复的唯一ID获取其详细信息
 * @param id 回复ID
 * @returns 回复信息
 */
export function getThreadReplyById(id: string) {
    return http.get<ThreadReplyVO>(`/course/course-thread/reply/${id}`)
}

/**
 * 根据回复ID从系统中移除回复
 * @param id 回复ID
 * @returns 删除结果
 */
export function removeThreadReplyById(id: string) {
    return http.delete(`/course/course-thread/reply/${id}`)
}

/**
 * 发布新的论坛回复
 * @param threadReplyData 课程论坛回复数据传输对象
 * @returns 添加结果
 */
export function addThreadReply(threadReplyData: ThreadReplyDTO) {
    return http.post<ThreadReplyVO>('/course/course-thread/reply/add', threadReplyData)
}

/**
 * 根据传入的条件分页查询论坛回复信息
 * @param params 查询参数
 * @returns 回复分页列表
 */
export function listThreadReply(params: any) {
    return http.get<TableDataResult<ThreadReplyVO>>('/course/course-thread/reply/list', params)
}

/**
 * 获取指定课程ID下所有回复列表,并以树状结构返回
 * @param threadId 主贴ID
 * @returns 回复树状列表
 */
export function listThreadReplyTreeByThreadId(threadId: string) {
    return http.get<ThreadReplyVO[]>(`/course/course-thread/reply/tree/Thread/${threadId}`)
}
