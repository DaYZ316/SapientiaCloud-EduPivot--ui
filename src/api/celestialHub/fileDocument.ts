import http from '@/utils/http'
import type {
    FileDocumentQueryDTO,
    FileDocumentUploadOptions,
    FileDocumentVO,
    PageFileDocumentVO
} from '@/types/celestialHub/fileDocument'
import type {FileInfoDTO} from '@/types/minIO/file'

/**
 * 获取文件文档查询默认DTO
 */
export function getDefaultFileDocumentQueryDTO(): FileDocumentQueryDTO {
    return {
        sessionId: null,
        courseId: null,
        userId: null,
        isVectorized: null,
        fileName: null,
        startTime: null,
        endTime: null,
        pageNum: null,
        pageSize: null,
        orderByColumn: null,
        isAsc: null,
        reasonable: null
    }
}

/**
 * 根据文件ID获取文件信息
 * @param id 文件ID
 */
export function getFileById(id: string) {
    return http.get<FileDocumentVO>(`/celestial-hub/file-document/${id}`)
}

/**
 * 根据文件ID删除文件
 * @param id 文件ID
 */
export function deleteFile(id: string) {
    return http.delete<boolean>(`/celestial-hub/file-document/${id}`)
}

/**
 * 手动触发文件向量化
 * @param id 文件ID
 */
export function vectorizeFile(id: string) {
    return http.post<boolean>(`/celestial-hub/file-document/${id}/vectorize`)
}

/**
 * 分页查询文件列表
 * @param params 查询参数
 */
export function listFiles(params: FileDocumentQueryDTO) {
    return http.get<PageFileDocumentVO>('/celestial-hub/file-document/list', {
        params
    })
}

/**
 * 上传单个文件
 * @param file 待上传文件
 * @param options 可选参数
 */
export function uploadFile(file: File, options?: FileDocumentUploadOptions) {
    const formData = new FormData()
    formData.append('file', file)

    if (options?.courseId) {
        formData.append('courseId', options.courseId)
    }
    if (options?.sessionId) {
        formData.append('sessionId', options.sessionId)
    }
    if (options?.autoVectorize !== null && options?.autoVectorize !== undefined) {
        formData.append('autoVectorize', String(options.autoVectorize))
    }

    return http.post<FileDocumentVO>('/celestial-hub/file-document/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

/**
 * 批量上传多个文件
 * @param files 文件数组
 * @param options 可选参数
 */
export function uploadFiles(files: File[], options?: FileDocumentUploadOptions) {
    const formData = new FormData()
    files.forEach((item) => {
        formData.append('files', item)
    })

    if (options?.courseId) {
        formData.append('courseId', options.courseId)
    }
    if (options?.sessionId) {
        formData.append('sessionId', options.sessionId)
    }
    const resolvedAutoVectorize = options?.autoVectorize === null || options?.autoVectorize === undefined
        ? true
        : options.autoVectorize
    formData.append('autoVectorize', String(resolvedAutoVectorize))

    return http.post<FileDocumentVO[]>('/celestial-hub/file-document/upload/batch', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

/**
 * 根据会话ID获取文件信息列表
 * @param sessionId 会话ID
 */
export function getFilesBySessionId(sessionId: string) {
    return http.get<FileInfoDTO[]>(`/celestial-hub/file-document/session/${sessionId}/files`)
}