import http from '@/utils/http'
import type {
    BusinessBucketCode,
    FileInfoDTO,
    MinioBatchObjectParams,
    MinioBatchPathParams,
    MinioFilePathParams,
    MinioFileUrlParams,
    MinioListFilesParams,
    MinioObjectParams,
    MinioUploadFileOptions
} from '@/types/minIO'

const buildBucketParams = (bucketCode?: BusinessBucketCode | null) => (bucketCode ? {bucketCode} : undefined)

// 批量删除文件
export function batchDeleteFiles(params: MinioBatchObjectParams) {
    const {objectNames, bucketCode} = params
    return http.delete('/minIO/file/batch-delete', {
        data: objectNames,
        params: buildBucketParams(bucketCode)
    })
}

// 根据文件路径批量删除文件
export function batchDeleteFilesByPath(params: MinioBatchPathParams) {
    const {filePaths, bucketCode} = params
    return http.delete('/minIO/file/batch-delete/path', {
        data: filePaths,
        params: buildBucketParams(bucketCode)
    })
}

// 获取所有存储桶
export function listBuckets() {
    return http.get('/minIO/file/buckets')
}

// 删除文件
export function deleteFile(params: MinioObjectParams) {
    const {objectName, bucketCode} = params
    return http.delete('/minIO/file/delete', {
        params: {
            objectName,
            ...buildBucketParams(bucketCode)
        }
    })
}

// 根据文件路径删除文件
export function deleteFileByPath(params: MinioFilePathParams) {
    const {filePath, bucketCode} = params
    return http.delete('/minIO/file/delete/path', {
        params: {
            filePath,
            ...buildBucketParams(bucketCode)
        }
    })
}

// 下载文件
export function downloadFile(params: MinioObjectParams) {
    const {objectName, bucketCode} = params
    return http.get('/minIO/file/download', {
        params: {
            objectName,
            ...buildBucketParams(bucketCode)
        },
        responseType: 'blob'
    })
}

// 获取文件详细信息
export function getFileInfo(params: MinioObjectParams) {
    const {objectName, bucketCode} = params
    return http.get<FileInfoDTO>('/minIO/file/info', {
        params: {
            objectName,
            ...buildBucketParams(bucketCode)
        }
    })
}

// 批量获取文件详细信息
export function getBatchFileInfo(params: MinioBatchObjectParams) {
    const {objectNames, bucketCode} = params
    return http.post<FileInfoDTO[]>('/minIO/file/info/batch', objectNames, {
        params: buildBucketParams(bucketCode)
    })
}

// 通过路径获取文件详细信息
export function getFileInfoByPath(params: MinioFilePathParams) {
    const {filePath, bucketCode} = params
    return http.get<FileInfoDTO>('/minIO/file/info/path', {
        params: {
            filePath,
            ...buildBucketParams(bucketCode)
        }
    })
}

// 通过路径数组批量获取文件详细信息
export function getBatchFileInfoByPath(params: MinioBatchPathParams) {
    const {filePaths, bucketCode} = params
    return http.post<FileInfoDTO[]>('/minIO/file/info/batch/path', filePaths, {
        params: buildBucketParams(bucketCode)
    })
}

// 列出指定前缀的文件
export function listFiles(params?: MinioListFilesParams) {
    const {prefix, bucketCode} = params || {}
    return http.get('/minIO/file/list', {
        params: {
            prefix,
            ...buildBucketParams(bucketCode)
        }
    })
}

// 上传文件（新接口）
export function uploadFile(file: File, options?: MinioUploadFileOptions | string) {
    const formData = new FormData()
    formData.append('file', file)

    let directory: string | undefined
    let bucketCode: BusinessBucketCode | null | undefined

    if (typeof options === 'string') {
        directory = options
    } else if (options) {
        directory = options.directory ?? undefined
        bucketCode = options.bucketCode
    }

    if (directory) {
        formData.append('directory', directory)
    }
    if (bucketCode) {
        formData.append('bucketCode', bucketCode)
    }

    return http.post('/minIO/file/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

// 获取文件URL
export function getFileUrl(params: MinioFileUrlParams) {
    const {objectName, expiry, bucketCode} = params
    return http.get('/minIO/file/url', {
        params: {
            objectName,
            expiry,
            ...buildBucketParams(bucketCode)
        }
    })
}