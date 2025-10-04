/**
 * 帖子类型枚举
 */
export enum PostTypeEnum {
    /** 普通帖子 */
    NORMAL = 0,
    /** 置顶帖子 */
    TOP = 1,
    /** 精华帖子 */
    ESSENCE = 2,
    /** 公告 */
    ANNOUNCEMENT = 3
}

/**
 * 帖子类型枚举中文标签
 */
export const postTypeLabelMap = {
    [PostTypeEnum.NORMAL]: '普通帖子',
    [PostTypeEnum.TOP]: '置顶帖子',
    [PostTypeEnum.ESSENCE]: '精华帖子',
    [PostTypeEnum.ANNOUNCEMENT]: '公告'
};

/**
 * 帖子类型枚举英文标签
 */
export const postTypeEnLabelMap = {
    [PostTypeEnum.NORMAL]: 'Normal',
    [PostTypeEnum.TOP]: 'Top',
    [PostTypeEnum.ESSENCE]: 'Essence',
    [PostTypeEnum.ANNOUNCEMENT]: 'Announcement'
};

/**
 * 根据当前语言获取帖子类型枚举选项
 * @param t 国际化函数
 * @returns 帖子类型枚举选项数组
 */
export function getPostTypeOptions(t: (key: string) => string) {
    return [
        {label: t('course.postType.NORMAL'), value: PostTypeEnum.NORMAL},
        {label: t('course.postType.TOP'), value: PostTypeEnum.TOP},
        {label: t('course.postType.ESSENCE'), value: PostTypeEnum.ESSENCE},
        {label: t('course.postType.ANNOUNCEMENT'), value: PostTypeEnum.ANNOUNCEMENT}
    ];
}

/**
 * 获取帖子类型标签
 * @param value 帖子类型枚举值
 * @param isEn 是否为英文
 * @returns 帖子类型标签
 */
export function getPostTypeLabel(value: PostTypeEnum | number | string, isEn: boolean = false): string {
    // 确保value是数字类型
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;

    // 转换为PostTypeEnum类型
    const enumValue = numValue as PostTypeEnum;

    // 获取对应语言的标签
    const map = isEn ? postTypeEnLabelMap : postTypeLabelMap;

    // 如果映射中存在该值，则返回对应标签，否则返回普通帖子
    return map[enumValue] || map[PostTypeEnum.NORMAL];
}
