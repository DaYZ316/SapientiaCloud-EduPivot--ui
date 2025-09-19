import http from '@/utils/http'
import type {CourseChapterDTO, CourseChapterVO, CourseChapterQueryParams} from '@/types/course'
import type {TableDataResult} from '@/types/common/baseEntity'

// 获取默认课程章节DTO
export function getDefaultCourseChapterDTO(): CourseChapterDTO {
    return {
        id: null,
        courseId: null,
        parentId: null,
        chapterName: null,
        chapterContent: null,
        sort: 0
    }
}

// 获取默认课程章节查询对象
export function getDefaultCourseChapterQuery(): CourseChapterQueryParams {
    return {
        courseId: null,
        parentId: null,
        chapterName: null,
        startTime: null,
        endTime: null,
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'sort',
        isAsc: 'asc',
        reasonable: null
    }
}

/**
 * 修改现有课程章节的信�? * @param courseChapterData 课程章节数据传输对象
 * @returns 更新结果
 */
export function updateCourseChapter(courseChapterData: CourseChapterDTO) {
    return http.put('/course/course-chapter', courseChapterData)
}

/**
 * 根据章节ID列表批量删除章节
 * @param chapterIds 章节ID列表
 * @returns 删除结果
 */
export function removeCourseChapterByIds(chapterIds: string[]) {
    return http.delete('/course/course-chapter', {data: chapterIds})
}

/**
 * 通过章节的唯一ID获取其详细信�? * @param id 章节ID
 * @returns 章节信息
 */
export function getCourseChapterById(id: string) {
    return http.get<CourseChapterVO>(`/course/course-chapter/${id}`)
}

/**
 * 根据章节ID从系统中移除章节
 * @param id 章节ID
 * @returns 删除结果
 */
export function removeCourseChapterById(id: string) {
    return http.delete(`/course/course-chapter/${id}`)
}

/**
 * 添加新的课程章节
 * @param courseChapterData 课程章节数据传输对象
 * @returns 添加结果
 */
export function addCourseChapter(courseChapterData: CourseChapterDTO) {
    return http.post<CourseChapterVO>('/course/course-chapter/add', courseChapterData)
}

/**
 * 根据父章节ID获取子章节列�? * @param params 查询参数
 * @returns 章节分页列表
 */
export function listCourseChapter(params: CourseChapterQueryParams) {
    return http.get<TableDataResult<CourseChapterVO>>('/course/course-chapter/list', params)
}

/**
 * 查询课程中的所有章节，并以树状结构返回
 * @param courseId 课程ID
 * @returns 章节树状列表
 */
export function listAllCourseChapterTree(courseId: string) {
    return http.post<CourseChapterVO[]>(`/course/course-chapter/tree/course/${courseId}`)
}
