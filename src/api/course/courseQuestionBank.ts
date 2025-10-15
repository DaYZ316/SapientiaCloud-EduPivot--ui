import http from '@/utils/http'
import type {CourseQuestionBankDTO, CourseQuestionBankQueryParams, CourseQuestionBankVO} from '@/types/course'

// 获取默认题库查询对象
export function getDefaultCourseQuestionBankQuery(): CourseQuestionBankQueryParams {
    return {
        courseId: null,
        bankName: null,
        bankType: null,
        difficulty: null,
        isPublic: null,
        tags: null,
        createTimeStart: null,
        createTimeEnd: null,
        startTime: null,
        endTime: null,
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'create_time',
        isAsc: 'asc',
        reasonable: null
    }
}

// 获取默认题库添加DTO
export function getDefaultCourseQuestionBankDTO(): CourseQuestionBankDTO {
    return {
        id: null,
        courseId: null,
        bankName: null,
        description: null,
        bankType: null,
        tags: null,
        difficulty: null,
        isPublic: null
    }
}

/**
 * 创建新的题库
 * @param questionBankData 题库信息数据传输对象
 * @returns 创建结果
 */
export function addCourseQuestionBank(questionBankData: CourseQuestionBankDTO) {
    return http.post<CourseQuestionBankVO>('/course/course-question-bank/add', questionBankData)
}

/**
 * 修改现有题库的信息
 * @param questionBankData 题库信息数据传输对象
 * @returns 更新结果
 */
export function updateCourseQuestionBank(questionBankData: CourseQuestionBankDTO) {
    return http.put<boolean>('/course/course-question-bank', questionBankData)
}

/**
 * 根据题库ID列表批量删除题库
 * @param questionBankIds 题库ID列表
 * @returns 删除结果
 */
export function removeCourseQuestionBankByIds(questionBankIds: string[]) {
    return http.delete<number>('/course/course-question-bank', {data: questionBankIds})
}

/**
 * 根据题库ID获取题库详情
 * @param id 题库ID
 * @returns 题库信息
 */
export function getCourseQuestionBankById(id: string) {
    return http.get<CourseQuestionBankVO>(`/course/course-question-bank/${id}`)
}

/**
 * 根据题库ID删除题库
 * @param id 题库ID
 * @returns 删除结果
 */
export function removeCourseQuestionBankById(id: string) {
    return http.delete<boolean>(`/course/course-question-bank/${id}`)
}

/**
 * 根据课程ID获取所有题库列表
 * @param courseId 课程ID
 * @returns 所有题库列表
 */
export function listAllCourseQuestionBankByCourseId(courseId: string) {
    return http.get<CourseQuestionBankVO[]>(`/course/course-question-bank/course/${courseId}`)
}

/**
 * 分页查找题库
 * @param params 查询参数
 * @returns 分页题库列表
 */
export function listCourseQuestionBank(params: CourseQuestionBankQueryParams) {
    return http.getTableData<CourseQuestionBankVO>('/course/course-question-bank/list', params)
}
