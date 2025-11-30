import type {PageEntity} from '@/types/common/baseEntity'

/**
 * 文件文档查询DTO
 * 继承通用分页参数
 */
export interface FileDocumentQueryDTO extends PageEntity {
    /** 会话ID */
    sessionId?: string | null
    /** 课程ID */
    courseId?: string | null
    /** 用户ID */
    userId?: string | null
    /** 是否已向量化 */
    isVectorized?: boolean | null
    /** 文件名（模糊查询） */
    fileName?: string | null
}

/**
 * 文件文档视图对象
 */
export interface FileDocumentVO {
    /** 文件ID */
    id?: string | null
    /** 文件名 */
    fileName?: string | null
    /** 文件类型 */
    fileType?: number | null
    /** 文件类型名称 */
    fileTypeName?: string | null
    /** 文件大小（字节） */
    fileSize?: number | null
    /** 文件大小（格式化） */
    fileSizeFormatted?: string | null
    /** MIME类型 */
    mimeType?: string | null
    /** 存储路径 */
    storagePath?: string | null
    /** 上传用户ID */
    sysUserId?: string | null
    /** 课程ID */
    courseId?: string | null
    /** 会话ID */
    sessionId?: string | null
    /** 状态 */
    status?: number | null
    /** 状态名称 */
    statusName?: string | null
    /** 是否已向量化 */
    isVectorized?: boolean | null
    /** 向量块数量 */
    vectorCount?: number | null
    /** 创建时间 */
    createTime?: string | null
    /** 更新时间 */
    updateTime?: string | null
}

/**
 * 排序对象
 */
export interface SortObject {
    /** 是否为空 */
    empty?: boolean | null
    /** 是否已排序 */
    sorted?: boolean | null
    /** 是否未排序 */
    unsorted?: boolean | null
}

/**
 * 分页对象
 */
export interface PageableObject {
    /** 偏移量 */
    offset?: number | null
    /** 排序信息 */
    sort?: SortObject | null
    /** 页码 */
    pageNumber?: number | null
    /** 每页数量 */
    pageSize?: number | null
    /** 是否未分页 */
    unpaged?: boolean | null
    /** 是否已分页 */
    paged?: boolean | null
}

/**
 * 文件文档分页响应对象
 */
export interface PageFileDocumentVO {
    /** 总元素数量 */
    totalElements?: number | null
    /** 总页数 */
    totalPages?: number | null
    /** 每页大小 */
    size?: number | null
    /** 文件内容 */
    content?: FileDocumentVO[] | null
    /** 当前页码 */
    number?: number | null
    /** 排序信息 */
    sort?: SortObject | null
    /** 是否第一页 */
    first?: boolean | null
    /** 是否最后一页 */
    last?: boolean | null
    /** 分页详细信息 */
    pageable?: PageableObject | null
    /** 当前页元素数量 */
    numberOfElements?: number | null
    /** 是否为空 */
    empty?: boolean | null
}

/**
 * 文件上传可选参数
 */
export interface FileDocumentUploadOptions {
    /** 课程ID（可选） */
    courseId?: string | null
    /** 会话ID（可选） */
    sessionId?: string | null
    /** 是否自动向量化 */
    autoVectorize?: boolean | null
}


