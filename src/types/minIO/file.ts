/**
 * MinIO模块-文件类型定义
 */

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
export interface AvatarUploadProps {
    modelValue?: string;
    size?: 'small' | 'medium' | 'large' | number;
    cropSize?: number;
    maxFileSize?: number;
    accept?: string;
    disabled?: boolean;
    // 用户名（用于生成首字母和背景色）
    username?: string;
    // 用户昵称
    nickName?: string;
    // 学生真实姓名（优先级最高）
    studentRealName?: string;
    // 教师真实姓名（优先级最高）
    teacherRealName?: string;
    // 是否圆形
    round?: boolean;
    // 自定义样式类
    avatarClass?: string;
}

// 头像上传组件Emits接口
export interface AvatarUploadEmits {
    'update:modelValue': [value: string];
    'upload-success': [url: string];
    'upload-error': [error: Error];
    'update-avatar': [url: string];
}
