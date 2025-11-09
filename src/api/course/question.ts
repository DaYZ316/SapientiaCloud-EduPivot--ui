import http from '@/utils/http'
import type {QuestionDTO, QuestionQueryParams, QuestionVO} from '@/types/course'

// 获取默认题目查询对象
export function getDefaultQuestionQuery(): QuestionQueryParams {
    return {
        questionTitle: null,
        questionBankId: null,
        questionType: null,
        difficulty: null,
        status: null,
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'create_time',
        isAsc: 'asc',
        reasonable: null
    }
}

// 获取默认题目添加DTO
export function getDefaultQuestionDTO(): QuestionDTO {
    return {
        id: null,
        questionBankId: null,
        questionTitle: null,
        questionContent: null,
        questionType: null,
        difficulty: null,
        score: null,
        estimatedTime: null,
        tags: [],
        imageUrls: null,
        allowPartialCredit: null,
        status: null,
        options: null
    }
}

/**
 * 创建新的题目
 * @param questionData 题目信息数据传输对象
 * @returns 创建结果
 */
export function addQuestion(questionData: QuestionDTO) {
    return http.post<QuestionVO>('/course/question/add', questionData)
}

/**
 * 修改现有题目的信息
 * @param questionData 题目信息数据传输对象
 * @returns 更新结果
 */
export function updateQuestion(questionData: QuestionDTO) {
    return http.put<boolean>('/course/question', questionData)
}

/**
 * 根据题目ID列表批量删除题目
 * @param questionIds 题目ID列表
 * @returns 删除结果
 */
export function removeQuestionByIds(questionIds: string[]) {
    return http.delete<number>('/course/question', {data: questionIds})
}

/**
 * 根据题目ID获取题目详情
 * @param id 题目ID
 * @returns 题目信息
 */
export function getQuestionById(id: string) {
    return http.get<QuestionVO>(`/course/question/${id}`)
}

/**
 * 根据题目ID删除题目
 * @param id 题目ID
 * @returns 删除结果
 */
export function removeQuestionById(id: string) {
    return http.delete<boolean>(`/course/question/${id}`)
}

/**
 * 获取所有题目列表
 * @returns 所有题目列表
 */
export function listAllQuestion() {
    return http.get<QuestionVO[]>('/course/question/all')
}

/**
 * 分页查找题目
 * @param params 查询参数
 * @returns 分页题目列表
 */
export function listQuestion(params: QuestionQueryParams) {
    return http.getTableData<QuestionVO>('/course/question/list', params)
}

/**
 * 根据题库ID获取题目列表
 * @param questionBankId 题库ID
 * @returns 题目列表
 */
export function listQuestionByQuestionBankId(questionBankId: string) {
    return http.get<QuestionVO[]>(`/course/question/question-bank/${questionBankId}`)
}

/**
 * 发布题目
 * @param id 题目ID
 * @returns 发布结果
 */
export function publishQuestion(id: string) {
    return http.put<boolean>(`/course/question/${id}/publish`)
}

/**
 * 取消发布题目
 * @param id 题目ID
 * @returns 取消发布结果
 */
export function unpublishQuestion(id: string) {
    return http.put<boolean>(`/course/question/${id}/unpublish`)
}

/**
 * 增加题目浏览次数
 * @param id 题目ID
 * @returns 更新结果
 */
export function viewQuestion(id: string) {
    return http.put<boolean>(`/course/question/${id}/view`)
}
