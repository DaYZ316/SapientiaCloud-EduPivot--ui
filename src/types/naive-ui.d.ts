/**
 * Naive UI 相关类型定义
 */

// Naive UI Upload 相关类型
export interface UploadFileInfo {
    id: string
    name: string
    status: 'pending' | 'uploading' | 'finished' | 'removed' | 'error'
    percentage?: number
    file?: File | null
    url?: string
    thumbUrl?: string
}

export interface UploadCustomRequestOptions {
    file: UploadFileInfo
    data?: any
    headers?: Record<string, string>
    withCredentials?: boolean
    action?: string
    onProgress?: (event: { percent: number }) => void
    onError?: (event: Error) => void
    onSuccess?: (response: any) => void
}

export type {
    UploadFileInfo,
    UploadCustomRequestOptions
} 
