/**
 * MinIO模块-文件类型定义
 */
import type {AvatarIdentityProps, AvatarSizeType} from '@/types/components/avatar'
import type {BusinessBucketCode} from './bucket'

// 文件信息DTO接口
export interface FileInfoDTO {
    objectName: string;
    fileName: string;
    size: number;
    contentType: string;
    lastModified: string;
    etag: string;
    isDir: boolean;
    url: string;
    extension: string;
    path: string;
    bucketName: string;
    bucketCode: BusinessBucketCode | null;
    error: boolean;
    errorMessage: string;
}

// 文件信息接口（兼容旧版本）
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
export interface AvatarUploadProps extends AvatarIdentityProps {
    modelValue?: string | null;
    size?: AvatarSizeType;
    cropSize?: number;
    maxFileSize?: number;
    accept?: string;
    disabled?: boolean;
    round?: boolean;
    avatarClass?: string;
    fallbackSrc?: string | null;
    bucketCode?: BusinessBucketCode;
}

// 头像上传组件Emits接口
export interface AvatarUploadEmits {
    'update:modelValue': [value: string];
    'upload-success': [url: string];
    'upload-error': [error: Error];
    'update-avatar': [url: string];
}

// 获取默认的FileInfoDTO对象
export function getDefaultFileInfoDTO(): FileInfoDTO {
    return {
        objectName: '',
        fileName: '',
        size: 0,
        contentType: '',
        lastModified: '',
        etag: '',
        isDir: false,
        url: '',
        extension: '',
        path: '',
        bucketName: '',
        bucketCode: null,
        error: false,
        errorMessage: ''
    }
}
