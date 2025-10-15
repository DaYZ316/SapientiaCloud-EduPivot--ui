import http from '@/utils/http'
import type {QuestionOptionDTO, QuestionOptionQueryParams, QuestionOptionVO} from '@/types/course'

// 获取默认选项查询对象
export function getDefaultQuestionOptionQuery(): QuestionOptionQueryParams {
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

// 获取默认选项添加DTO
export function getDefaultQuestionOptionDTO(): QuestionOptionDTO {
    return {
        id: null,
        questionId: null,
        optionContent: null,
        optionLabel: null,
        isCorrect: null,
        score: null,
        imageUrls: null,
    }
}

/**
 * 创建新的题目选项
 * @param optionData 选项信息数据传输对象
 * @returns 创建结果
 */
export function addQuestionOption(optionData: QuestionOptionDTO) {
    return http.post<QuestionOptionVO>('/course/question-option/add', optionData)
}

/**
 * 修改现有选项的信息
 * @param optionData 选项信息数据传输对象
 * @returns 更新结果
 */
export function updateQuestionOption(optionData: QuestionOptionDTO) {
    return http.put<boolean>('/course/question-option', optionData)
}

/**
 * 根据选项ID列表批量删除选项
 * @param optionIds 选项ID列表
 * @returns 删除结果
 */
export function removeQuestionOptionsByIds(optionIds: string[]) {
    return http.delete<number>('/course/question-option', {data: optionIds})
}

/**
 * 根据选项ID获取选项详情
 * @param id 选项ID
 * @returns 选项信息
 */
export function getQuestionOptionById(id: string) {
    return http.get<QuestionOptionVO>(`/course/question-option/${id}`)
}

/**
 * 根据选项ID删除选项
 * @param id 选项ID
 * @returns 删除结果
 */
export function removeQuestionOptionById(id: string) {
    return http.delete<boolean>(`/course/question-option/${id}`)
}

/**
 * 批量创建题目选项
 * @param optionDataList 选项信息数据传输对象列表
 * @returns 创建结果
 */
export function addQuestionOptions(optionDataList: QuestionOptionDTO[]) {
    return http.post<QuestionOptionVO[]>('/course/question-option/add-batch', optionDataList)
}

/**
 * 分页查找选项
 * @param params 查询参数
 * @returns 分页选项列表
 */
export function listQuestionOption(params: QuestionOptionQueryParams) {
    return http.getTableData<QuestionOptionVO>('/course/question-option/list', params)
}

/**
 * 根据题目ID获取所有选项
 * @param questionId 题目ID
 * @returns 选项列表
 */
export function listAllQuestionOptionByQuestionId(questionId: string) {
    return http.get<QuestionOptionVO[]>(`/course/question-option/question/${questionId}`)
}

/**
 * 根据题目ID获取选项列表
 * @param questionId 题目ID
 * @returns 选项列表
 */
export function listQuestionOptionByQuestionId(questionId: string) {
    return http.get<QuestionOptionVO[]>(`/course/question-option/question/${questionId}`)
}
