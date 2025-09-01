import http from '@/utils/http'

// 批量删除文件
export function batchDeleteFiles(fileNames: string[]) {
    return http.delete('/minIO/file/batch-delete', {data: fileNames})
}

// 获取所有存储桶
export function getAllBuckets() {
    return http.get('/minIO/file/buckets')
}

// 删除文件
export function deleteFile(objectName: string) {
    return http.delete('/minIO/file/delete', {params: {objectName}})
}

// 下载文件
export function downloadFile(objectName: string) {
    return http.get('/minIO/file/download', {params: {objectName}, responseType: 'blob'})
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