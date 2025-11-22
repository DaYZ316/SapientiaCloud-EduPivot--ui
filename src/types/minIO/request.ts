import type {BusinessBucketCode} from './bucket'

/**
 * 带业务桶的通用入参
 */
export interface MinioBucketScopedParams {
    bucketCode?: BusinessBucketCode | null;
}

/**
 * 需要 objectName 的请求参数
 */
export interface MinioObjectParams extends MinioBucketScopedParams {
    objectName: string;
}

/**
 * 需要 filePath 的请求参数
 */
export interface MinioFilePathParams extends MinioBucketScopedParams {
    filePath: string;
}

/**
 * 批量 objectName
 */
export interface MinioBatchObjectParams extends MinioBucketScopedParams {
    objectNames: string[];
}

/**
 * 批量 filePath
 */
export interface MinioBatchPathParams extends MinioBucketScopedParams {
    filePaths: string[];
}

/**
 * 列表查询参数
 */
export interface MinioListFilesParams extends MinioBucketScopedParams {
    prefix?: string;
}

/**
 * 文件上传参数
 */
export interface MinioUploadFileOptions extends MinioBucketScopedParams {
    directory?: string | null;
}

/**
 * 获取临时URL参数
 */
export interface MinioFileUrlParams extends MinioBucketScopedParams {
    objectName: string;
    expiry?: number;
}

