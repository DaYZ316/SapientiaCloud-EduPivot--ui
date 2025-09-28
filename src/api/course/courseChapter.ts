import http from '@/utils/http'
import type {CourseChapterAddDTO, CourseChapterDTO, CourseChapterQueryParams, CourseChapterVO} from '@/types/course'
import type {TableDataResult} from '@/types/common/baseEntity'

// 获取默认课程章节查询对象
export function getDefaultCourseChapterQuery(): CourseChapterQueryParams {
    return {
        courseId: null,
        chapterName: null,
        parentChapterId: null,
        status: null,
        startTime: null,
        endTime: null,
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'sort_order',
        isAsc: 'asc',
        reasonable: null
    }
}

// 获取默认课程章节添加DTO
export function getDefaultCourseChapterDTO(): CourseChapterDTO {
    return {
        id: null,
        courseId: null,
        teacherId: null,
        chapterName: null,
        parentChapterId: null,
        description: null,
        content: null,
        videoUrl: null,
        videoDuration: null,
        attachmentUrls: null,
        sortOrder: 0,
        status: null
    }
}

// 获取默认课程章节添加DTO
export function getDefaultCourseChapterAddDTO(): CourseChapterAddDTO {
    return {
        id: null,
        courseId: null,
        teacherId: null,
        chapterName: null,
        parentChapterId: null,
        description: null,
        content: null,
        videoUrl: null,
        videoDuration: null,
        attachmentUrls: null,
        sortOrder: 0,
        status: null
    }
}

/**
 * 向课程中添加一个新的章节
 * @param chapterData 课程章节数据传输对象
 * @returns 添加结果
 */
export function addCourseChapter(chapterData: CourseChapterAddDTO) {
    return http.post<CourseChapterVO>('/course/chapter', chapterData)
}

/**
 * 更新课程章节
 * @param chapterData 课程章节数据传输对象
 * @returns 更新结果
 */
export function updateCourseChapter(chapterData: CourseChapterDTO) {
    return http.put('/course/chapter', chapterData)
}

/**
 * 批量删除课程章节
 * @param chapterIds 章节ID列表
 * @returns 删除结果
 */
export function removeCourseChapterByIds(chapterIds: string[]) {
    return http.delete('/course/chapter/', {data: chapterIds})
}

/**
 * 根据ID获取课程章节
 * @param id 章节ID
 * @returns 章节信息
 */
export function getCourseChapterById(id: string) {
    return http.get<CourseChapterVO>(`/course/chapter/${id}`)
}

/**
 * 删除课程章节
 * @param id 章节ID
 * @returns 删除结果
 */
export function removeCourseChapterById(id: string) {
    return http.delete(`/course/chapter/${id}`)
}

/**
 * 点赞章节
 * @param chapterId 章节ID
 * @returns 点赞结果
 */
export function likeChapter(chapterId: string) {
    return http.post(`/course/chapter/${chapterId}/like`)
}

/**
 * 取消点赞章节
 * @param chapterId 章节ID
 * @returns 取消点赞结果
 */
export function unlikeChapter(chapterId: string) {
    return http.delete(`/course/chapter/${chapterId}/like`)
}

/**
 * 更新章节排序
 * @param chapterId 章节ID
 * @param sortOrder 排序权重
 * @returns 更新结果
 */
export function updateChapterSortOrder(chapterId: string, sortOrder: number) {
    return http.put(`/course/chapter/${chapterId}/sort`, {sortOrder})
}

/**
 * 批量更新章节排序
 * @param chapterSortData 章节排序数据
 * @returns 更新结果
 */
export function batchUpdateChapterSortOrder(chapterSortData: Array<{ id: string, sortOrder: number }>) {
    return http.put('/course/chapter/batch/sort', chapterSortData)
}

/**
 * 获取章节统计信息
 * @param chapterId 章节ID
 * @returns 统计信息
 */
export function getChapterStatistics(chapterId: string) {
    return http.get(`/course/chapter/${chapterId}/statistics`)
}

/**
 * 更新章节状态
 * @param chapterId 章节ID
 * @param status 章节状态
 * @returns 更新结果
 */
export function updateChapterStatus(chapterId: string, status: number) {
    return http.put(`/course/chapter/${chapterId}/status`, {status})
}

/**
 * 浏览章节
 * @param chapterId 章节ID
 * @returns 浏览结果
 */
export function viewChapter(chapterId: string) {
    return http.post(`/course/chapter/${chapterId}/view`)
}

/**
 * 根据课程ID获取章节列表
 * @param courseId 课程ID
 * @param params 查询参数
 * @returns 章节列表
 */
export function listCourseChapterByCourseId(courseId: string, params?: CourseChapterQueryParams) {
    return http.get<TableDataResult<CourseChapterVO>>(`/course/chapter/course/${courseId}`, params)
}

/**
 * 获取课程章节树形结构
 * @param courseId 课程ID
 * @returns 章节树
 */
export function listCourseChapterTree(courseId: string) {
    return http.get<CourseChapterVO[]>(`/course/chapter/course/${courseId}/tree`)
}

/**
 * 分页查找课程章节
 * @param params 查询参数
 * @returns 分页章节列表
 */
export function listCourseChapter(params: CourseChapterQueryParams) {
    return http.get<TableDataResult<CourseChapterVO>>('/course/chapter/list', params)
}
