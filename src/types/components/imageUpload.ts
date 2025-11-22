/**
 * 通用图片上传组件类型定义
 */

import type {UploadFileInfo} from '@/types/naive-ui'
import type {BusinessBucketCode} from '@/types/minIO'

/**
 * 图片上传组件Props
 */
export interface ImageUploadProps {
    /** 绑定的图片URL */
    modelValue?: string | null
    /** 图片尺寸 */
    size?: number
    /** 裁剪尺寸 */
    cropSize?: number
    /** 最大文件大小（字节�?*/
    maxFileSize?: number
    /** 接受的文件类�?*/
    accept?: string
    /** 是否禁用 */
    disabled?: boolean
    /** 占位图片 */
    placeholder?: string
    /** 上传目录 */
    uploadDir?: string
    /** 业务桶编码 */
    bucketCode?: BusinessBucketCode
    /** 是否显示裁剪功能 */
    showCrop?: boolean
    /** 裁剪比例 */
    aspectRatio?: number
    /** 是否圆形裁剪 */
    round?: boolean
    /** 预览尺寸 */
    previewSize?: number
}

/**
 * 图片上传组件事件
 */
export interface ImageUploadEmits {
    /** 更新modelValue */
    (e: 'update:modelValue', value: string | null): void

    /** 上传成功 */
    (e: 'upload-success', url: string): void

    /** 上传失败 */
    (e: 'upload-error', error: Error): void

    /** 文件选择�?*/
    (e: 'before-upload', file: UploadFileInfo): boolean | Promise<boolean>

    /** 文件选择�?*/
    (e: 'after-upload', file: UploadFileInfo): void
}

/**
 * 图片上传组件默认Props
 */
export const defaultImageUploadProps: Partial<ImageUploadProps> = {
    size: 120,
    cropSize: 300,
    maxFileSize: 5 * 1024 * 1024, // 5MB
    accept: '.jpg,.jpeg,.png,.gif,.webp',
    disabled: false,
    placeholder: '/src/assets/image/default-course.png',
    uploadDir: 'images',
    showCrop: true,
    aspectRatio: 1,
    round: false,
    previewSize: 150
}
