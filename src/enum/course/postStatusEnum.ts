/**
 * 帖子状态枚举
 */
export enum PostStatusEnum {
    /** 正常 */
    NORMAL = 0,
    /** 删除 */
    DELETED = 1,
    /** 审核中 */
    PENDING = 2,
    /** 审核失败 */
    REJECTED = 3
}

/**
 * 帖子状态枚举中文标签
 */
export const postStatusLabelMap = {
    [PostStatusEnum.NORMAL]: '正常',
    [PostStatusEnum.DELETED]: '删除',
    [PostStatusEnum.PENDING]: '审核中',
    [PostStatusEnum.REJECTED]: '审核失败'
};

/**
 * 帖子状态枚举英文标签
 */
export const postStatusEnLabelMap = {
    [PostStatusEnum.NORMAL]: 'Normal',
    [PostStatusEnum.DELETED]: 'Deleted',
    [PostStatusEnum.PENDING]: 'Pending',
    [PostStatusEnum.REJECTED]: 'Rejected'
};

/**
 * 根据当前语言获取帖子状态枚举选项
 * @param t 国际化函数
 * @returns 帖子状态枚举选项数组
 */
export function getPostStatusOptions(t: (key: string) => string) {
    return [
        {label: t('course.postStatus.NORMAL'), value: PostStatusEnum.NORMAL},
        {label: t('course.postStatus.DELETED'), value: PostStatusEnum.DELETED},
        {label: t('course.postStatus.PENDING'), value: PostStatusEnum.PENDING},
        {label: t('course.postStatus.REJECTED'), value: PostStatusEnum.REJECTED}
    ];
}

/**
 * 获取帖子状态标签
 * @param value 帖子状态枚举值
 * @param isEn 是否为英文
 * @returns 帖子状态标签
 */
export function getPostStatusLabel(value: PostStatusEnum | number | string, isEn: boolean = false): string {
    // 确保value是数字类型
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;

    // 转换为PostStatusEnum类型
    const enumValue = numValue as PostStatusEnum;

    // 获取对应语言的标签
    const map = isEn ? postStatusEnLabelMap : postStatusLabelMap;

    // 如果映射中存在该值，则返回对应标签，否则返回正常
    return map[enumValue] || map[PostStatusEnum.NORMAL];
}
