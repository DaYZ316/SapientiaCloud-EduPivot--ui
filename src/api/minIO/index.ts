import http from '@/utils/http'
import type {FileInfoDTO} from '@/types/minIO/file'

// 批量删除文件
export function batchDeleteFiles(fileNames: string[]) {
    return http.delete('/minIO/file/batch-delete', {data: fileNames})
}

// 根据文件路径批量删除文件
export function batchDeleteFilesByPath(filePaths: string[]) {
    return http.delete('/minIO/file/batch-delete/path', {data: filePaths})
}

// 获取所有存储桶
export function listBuckets() {
    return http.get('/minIO/file/buckets')
}

// 删除文件
export function deleteFile(objectName: string) {
    return http.delete('/minIO/file/delete', {params: {objectName}})
}

// 根据文件路径删除文件
export function deleteFileByPath(filePath: string) {
    return http.delete('/minIO/file/delete/path', {params: {filePath}})
}

// 下载文件
export function downloadFile(objectName: string) {
    return http.get('/minIO/file/download', {params: {objectName}, responseType: 'blob'})
}

// 获取文件详细信息
export function getFileInfo(objectName: string) {
    return http.get<FileInfoDTO>('/minIO/file/info', {params: {objectName}})
}

// 批量获取文件详细信息
export function getBatchFileInfo(objectNames: string[]) {
    return http.post<FileInfoDTO[]>('/minIO/file/info/batch', objectNames)
}

// 通过路径获取文件详细信息
export function getFileInfoByPath(filePath: string) {
    return http.get<FileInfoDTO>('/minIO/file/info/path', {params: {filePath}})
}

// 通过路径数组批量获取文件详细信息
export function getBatchFileInfoByPath(filePaths: string[]) {
    return http.post<FileInfoDTO[]>('/minIO/file/info/batch/path', filePaths)
}

// 列出指定前缀的文件
export function listFiles(prefix?: string) {
    return http.get('/minIO/file/list', {params: {prefix}})
}

// 上传文件
export function uploadFile(file: File, directory?: string) {
    const formData = new FormData()
    formData.append('file', file)
    if (directory) {
        formData.append('directory', directory)
    }
    return http.post('/minIO/file/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}

// 获取文件URL
export function getFileUrl(objectName: string, expiry?: number) {
    return http.get('/minIO/file/url', {params: {objectName, expiry}})
}