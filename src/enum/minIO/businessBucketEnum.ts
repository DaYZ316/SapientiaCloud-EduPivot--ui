/**
 * MinIO 业务桶枚举
 *
 * 与后端 {@code BusinessBucketEnum} 对齐，提供 code/bucketCode/defaultBucketName 等信息
 */
import type {EnumOption} from '@/enum/common/baseEnum'

/**
 * 业务桶编码
 */
export enum BusinessBucketCodeEnum {
    USER_AVATAR = 'USER_AVATAR',
    COURSE_PUBLIC = 'COURSE_PUBLIC',
    COURSE_PRIVATE = 'COURSE_PRIVATE',
    LIVE_PLAYBACK = 'LIVE_PLAYBACK',
    AI_QA_ASSET = 'AI_QA_ASSET',
    SYSTEM_NOTIFICATION = 'SYSTEM_NOTIFICATION'
}

/**
 * 业务桶选项
 */
export interface BusinessBucketOption extends EnumOption<BusinessBucketCodeEnum> {
    /** 数值编码 */
    code: number;
    /** 桶编码 */
    bucketCode: BusinessBucketCodeEnum;
    /** 推荐/默认桶名称 */
    defaultBucketName: string;
    /** 说明 */
    description: string;
}

/**
 * 业务桶选项列表
 */
export const businessBucketOptions: BusinessBucketOption[] = [
    {
        value: BusinessBucketCodeEnum.USER_AVATAR,
        label: '用户头像/证件照',
        code: 0,
        bucketCode: BusinessBucketCodeEnum.USER_AVATAR,
        defaultBucketName: 'sapientiacloud-user-avatar',
        description: '用户头像、证件照等轻量图片资源'
    },
    {
        value: BusinessBucketCodeEnum.COURSE_PUBLIC,
        label: '课程公开课件/论坛封面',
        code: 1,
        bucketCode: BusinessBucketCodeEnum.COURSE_PUBLIC,
        defaultBucketName: 'sapientiacloud-course-public',
        description: '公开课件、论坛封面、展示类资源'
    },
    {
        value: BusinessBucketCodeEnum.COURSE_PRIVATE,
        label: '课程私有资料/作业',
        code: 2,
        bucketCode: BusinessBucketCodeEnum.COURSE_PRIVATE,
        defaultBucketName: 'sapientiacloud-course-private',
        description: '课程内部资料、作业等敏感资源'
    },
    {
        value: BusinessBucketCodeEnum.LIVE_PLAYBACK,
        label: '直播录制回放',
        code: 3,
        bucketCode: BusinessBucketCodeEnum.LIVE_PLAYBACK,
        defaultBucketName: 'sapientiacloud-live-playback',
        description: '直播课录制文件、点播回放'
    },
    {
        value: BusinessBucketCodeEnum.AI_QA_ASSET,
        label: 'AI 问答临时资产',
        code: 4,
        bucketCode: BusinessBucketCodeEnum.AI_QA_ASSET,
        defaultBucketName: 'sapientiacloud-ai-qa',
        description: 'AI 问答生成的临时文件'
    },
    {
        value: BusinessBucketCodeEnum.SYSTEM_NOTIFICATION,
        label: '系统通知资源',
        code: 5,
        bucketCode: BusinessBucketCodeEnum.SYSTEM_NOTIFICATION,
        defaultBucketName: 'sapientiacloud-system-notification',
        description: '系统通知中的图片、视频、附件资源'
    }
]

/**
 * code -> bucket 速查
 */
export const businessBucketCodeMap: Record<number, BusinessBucketCodeEnum> = businessBucketOptions.reduce(
    (acc, option) => {
        acc[option.code] = option.bucketCode
        return acc
    },
    {} as Record<number, BusinessBucketCodeEnum>
)

/**
 * 根据编码或 bucketCode 获取选项
 */
export function getBusinessBucketOption(value?: BusinessBucketCodeEnum | number | null): BusinessBucketOption | null {
    if (value === null || value === undefined) {
        return null
    }

    if (typeof value === 'number') {
        return businessBucketOptions.find(option => option.code === value) || null
    }

    return businessBucketOptions.find(option => option.bucketCode === value) || null
}

/**
 * 获取业务桶标签
 */
export function getBusinessBucketLabel(
    value?: BusinessBucketCodeEnum | number | null,
    defaultLabel: string = ''
): string {
    const option = getBusinessBucketOption(value)
    return option ? option.label : defaultLabel
}

