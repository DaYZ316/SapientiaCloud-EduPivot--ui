/**
 * MinIO模块-文件类型定义
 */

// 文件信息接口
export interface FileInfo {
    filename: string;
    size: number;
    lastModified: string;
    etag: string;
    contentType?: string;
    url?: string;
}

// 上传文件响应
export interface UploadFileResponse {
    url: string;
    objectName: string;
    size: number;
    contentType: string;
}

// 头像上传组件Props接口
export interface AvatarUploadProps {
    modelValue?: string;
    size?: number;
    cropSize?: number;
    maxFileSize?: number;
    accept?: string;
    disabled?: boolean;
    placeholder?: string;
    showDefaultAvatar?: boolean;
}

// 头像上传组件Emits接口
export interface AvatarUploadEmits {
    'update:modelValue': [value: string];
    'upload-success': [url: string];
    'upload-error': [error: Error];
} 