import http from '@/utils/http'
import type {
    KnowledgeSearchRequestDTO,
    KnowledgeSearchResultVO,
    VectorizeRequestDTO
} from '@/types/celestialHub/knowledge'

/**
 * 获取默认知识检索请求DTO
 */
export function getDefaultKnowledgeRequestDTO(): KnowledgeSearchRequestDTO {
    return {
        query: null,
        topK: null,
        similarityThreshold: null,
        sessionId: null
    }
}

/**
 * 获取默认向量化请求DTO
 */
export function getDefaultVectorizeRequestDTO(): VectorizeRequestDTO {
    return {
        courseId: null,
        contentType: null,
        forceReindex: null,
        tags: null
    }
}

/**
 * 删除指定章节的所有向量数据
 * @param chapterId 章节ID
 */
export function deleteChapterVectors(chapterId: string) {
    return http.delete<boolean>(`/celestial-hub/chapter/${chapterId}`)
}

/**
 * 删除指定课程的所有向量数据
 * @param courseId 课程ID
 */
export function deleteCourseVectors(courseId: string) {
    return http.delete<boolean>(`/celestial-hub/course/${courseId}`)
}

/**
 * 获取课程的向量化统计信息
 * @param courseId 课程ID
 */
export function getCourseVectorCount(courseId: string) {
    return http.get<number>(`/celestial-hub/course/${courseId}/count`)
}

/**
 * 基于向量相似度检索知识内容
 * @param data 知识检索请求DTO
 */
export function searchKnowledge(data: KnowledgeSearchRequestDTO) {
    return http.post<KnowledgeSearchResultVO[]>('/celestial-hub/knowledge/search', data)
}

/**
 * 将课程内容向量化并存储到向量库
 * @param data 向量化请求DTO
 */
export function vectorizeContent(data: VectorizeRequestDTO) {
    return http.post<boolean>('/celestial-hub/vectorize', data)
}

