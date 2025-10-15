import http from '@/utils/http'
import type {QuestionAnswerDTO, QuestionAnswerQueryParams, QuestionAnswerVO} from '@/types/course'

// 获取默认答案查询对象
export function getDefaultQuestionAnswerQuery(): QuestionAnswerQueryParams {
    return {
        questionId: null,
        isCorrect: null,
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'create_time',
        isAsc: 'asc',
        reasonable: null
    }
}

// 获取默认答案添加DTO
export function getDefaultQuestionAnswerDTO(): QuestionAnswerDTO {
    return {
        id: null,
        questionId: null,
        answerContent: null,
        answerText: null,
        isCorrect: null,
        score: null
    }
}

/**
 * 创建新的题目答案
 * @param answerData 答案信息数据传输对象
 * @returns 创建结果
 */
export function addQuestionAnswer(answerData: QuestionAnswerDTO) {
    return http.post<QuestionAnswerVO>('/course/question-answer/add', answerData)
}

/**
 * 修改现有答案的信息
 * @param answerData 答案信息数据传输对象
 * @returns 更新结果
 */
export function updateQuestionAnswer(answerData: QuestionAnswerDTO) {
    return http.put<boolean>('/course/question-answer', answerData)
}

/**
 * 根据答案ID列表批量删除答案
 * @param answerIds 答案ID列表
 * @returns 删除结果
 */
export function removeQuestionAnswersByIds(answerIds: string[]) {
    return http.delete<number>('/course/question-answer', {data: answerIds})
}

/**
 * 根据答案ID获取答案详情
 * @param id 答案ID
 * @returns 答案信息
 */
export function getQuestionAnswerById(id: string) {
    return http.get<QuestionAnswerVO>(`/course/question-answer/${id}`)
}

/**
 * 根据答案ID删除答案
 * @param id 答案ID
 * @returns 删除结果
 */
export function removeQuestionAnswerById(id: string) {
    return http.delete<boolean>(`/course/question-answer/${id}`)
}

/**
 * 批量创建题目答案
 * @param answerDataList 答案信息数据传输对象列表
 * @returns 创建结果
 */
export function addQuestionAnswers(answerDataList: QuestionAnswerDTO[]) {
    return http.post<QuestionAnswerVO[]>('/course/question-answer/add-batch', answerDataList)
}

/**
 * 分页查找答案
 * @param params 查询参数
 * @returns 分页答案列表
 */
export function listQuestionAnswer(params: QuestionAnswerQueryParams) {
    return http.getTableData<QuestionAnswerVO>('/course/question-answer/list', params)
}

/**
 * 根据题目ID获取所有答案
 * @param questionId 题目ID
 * @returns 答案列表
 */
export function listAllQuestionAnswerByQuestionId(questionId: string) {
    return http.get<QuestionAnswerVO[]>(`/course/question-answer/question/${questionId}`)
}

/**
 * 根据题目ID和用户ID获取答案
 * @param questionId 题目ID
 * @param sysUserId 用户ID
 * @returns 答案信息
 */
export function getQuestionAnswerByQuestionIdAndSysUserId(questionId: string, sysUserId: string) {
    return http.get<QuestionAnswerVO>(`/course/question-answer/question/${questionId}/user/${sysUserId}`)
}
