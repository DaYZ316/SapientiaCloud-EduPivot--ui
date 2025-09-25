/**
 * 帖子状态枚举
 */
export enum PostStatusEnum {
    /** 正常 */
    NORMAL = 0,
    /** 锁定 */
    LOCKED = 1,
    /** 删除 */
    DELETED = 2
}

/**
 * 帖子状态枚举中文标签
 */
export const postStatusLabelMap = {
    [PostStatusEnum.NORMAL]: '正常',
    [PostStatusEnum.LOCKED]: '锁定',
    [PostStatusEnum.DELETED]: '删除'
};

/**
 * 帖子状态枚举英文标签
 */
export const postStatusEnLabelMap = {
    [PostStatusEnum.NORMAL]: 'Normal',
    [PostStatusEnum.LOCKED]: 'Locked',
    [PostStatusEnum.DELETED]: 'Deleted'
};

/**
 * 根据当前语言获取帖子状态枚举选项
 * @param t 国际化函数
 * @returns 帖子状态枚举选项数组
 */
export function getPostStatusOptions(t: (key: string) => string) {
    return [
        {label: t('course.postStatus.NORMAL'), value: PostStatusEnum.NORMAL},
        {label: t('course.postStatus.LOCKED'), value: PostStatusEnum.LOCKED},
        {label: t('course.postStatus.DELETED'), value: PostStatusEnum.DELETED}
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
