import type {AxiosRequestConfig} from 'axios'
import http from '@/utils/http'
import type {
    QuestionGenerateRequestDTO,
    QuestionResponseDTO
} from '@/types/celestialHub/question'

/**
 * 获取默认AI出题请求DTO
 */
export function getDefaultQuestionGenerateRequestDTO(): QuestionGenerateRequestDTO {
    return {
        sessionId: null,
        questionCount: null,
        questionType: null,
        difficulty: null,
        scorePerQuestion: null,
        requirement: null
    }
}

/**
 * 通过AI自动生成题目（Kafka转发）
 * @param data AI出题请求参数
 * @param config Axios 请求配置（可用于关闭全局进度条等）
 */
export function generateQuestions(data: QuestionGenerateRequestDTO, config?: AxiosRequestConfig) {
    return http.post<QuestionResponseDTO[]>('/celestial-hub/question/generate', data, config)
}

/**
 * 检查 Kafka 出题请求是否仍在进行中
 * @param requestId 请求唯一标识
 * @param config Axios 请求配置
 */
export function checkKafkaRequest(requestId: string, config?: AxiosRequestConfig) {
    return http.get<boolean>(
        `/celestial-hub/question/status/${requestId}`,
        config
    )
}


