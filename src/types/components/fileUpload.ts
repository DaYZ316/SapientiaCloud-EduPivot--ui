/**
 * 文件上传组件类型定义
 */

import type {UploadFileInfo} from 'naive-ui'

// 文件上传组件Props接口
export interface FileUploadProps {
    // 双向绑定的文件列表
    modelValue?: UploadFileInfo[]
    // 是否禁用
    disabled?: boolean
    // 接受的文件类型
    accept?: string
    // 最大文件大小（字节）
    maxFileSize?: number
    // 最大文件数量
    maxFileCount?: number
    // 上传目录
    uploadDir?: string
    // 是否显示文件列表
    showFileList?: boolean
    // 是否支持多选
    multiple?: boolean
    // 是否拖拽上传
    dragUpload?: boolean
    // 自定义上传按钮文本
    uploadText?: string
    // 自定义上传提示文本
    uploadHint?: string
    // 是否自动上传
    autoUpload?: boolean
    // 文件列表布局方式
    listType?: 'text' | 'image' | 'image-card'
    // 是否显示下载按钮
    showDownloadButton?: boolean
    // 是否显示删除按钮
    showDeleteButton?: boolean
    // 是否显示预览按钮
    showPreviewButton?: boolean
    // 自定义样式类
    customClass?: string
    // 上传按钮样式
    buttonStyle?: Record<string, any>
    // 文件列表样式
    listStyle?: Record<string, any>
}

// 文件上传组件Emits接口
export interface FileUploadEmits {
    'update:modelValue': [files: UploadFileInfo[]]
    'upload-success': [file: UploadFileInfo, response: any]
    'upload-error': [file: UploadFileInfo, error: Error]
    'before-upload': [file: UploadFileInfo]
    'file-change': [files: UploadFileInfo[]]
    'file-remove': [file: UploadFileInfo]
    'file-preview': [file: UploadFileInfo]
    'file-download': [file: UploadFileInfo]
    'urls-updated': [urls: string[]]
}

// 文件上传状态枚举
export enum FileUploadStatus {
    PENDING = 'pending',
    UPLOADING = 'uploading',
    SUCCESS = 'success',
    ERROR = 'error',
    REMOVED = 'removed'
}

// 文件类型枚举
export enum FileType {
    IMAGE = 'image',
    VIDEO = 'video',
    AUDIO = 'audio',
    DOCUMENT = 'document',
    ARCHIVE = 'archive',
    OTHER = 'other'
}

// 文件信息扩展接口
export interface ExtendedFileInfo extends UploadFileInfo {
    // 文件类型
    fileType?: FileType
    // 文件大小（格式化后）
    formattedSize?: string
    // 文件扩展名
    extension?: string
    // 是否可预览
    previewable?: boolean
    // 预览URL
    previewUrl?: string
    // 下载URL
    downloadUrl?: string
    // 上传进度
    uploadProgress?: number
    // 错误信息
    errorMessage?: string
}

// 文件上传配置接口
export interface FileUploadConfig {
    // 默认上传目录
    defaultUploadDir?: string
    // 默认最大文件大小
    defaultMaxFileSize?: number
    // 默认最大文件数量
    defaultMaxFileCount?: number
    // 支持的文件类型
    supportedFileTypes?: string[]
    // 图片文件类型
    imageFileTypes?: string[]
    // 视频文件类型
    videoFileTypes?: string[]
    // 音频文件类型
    audioFileTypes?: string[]
    // 文档文件类型
    documentFileTypes?: string[]
    // 压缩文件类型
    archiveFileTypes?: string[]
}
