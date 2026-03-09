/**
 * 论坛状态枚举
 */
export enum ForumStatusEnum {
    /** 正常 */
    NORMAL = 0,
    /** 关闭 */
    CLOSED = 1,
    /** 维护 */
    MAINTENANCE = 2
}

/**
 * 论坛状态枚举中文标签
 */
export const forumStatusLabelMap = {
    [ForumStatusEnum.NORMAL]: '正常',
    [ForumStatusEnum.CLOSED]: '关闭',
    [ForumStatusEnum.MAINTENANCE]: '维护'
};

/**
 * 论坛状态枚举英文标签
 */
export const forumStatusEnLabelMap = {
    [ForumStatusEnum.NORMAL]: 'Normal',
    [ForumStatusEnum.CLOSED]: 'Closed',
    [ForumStatusEnum.MAINTENANCE]: 'Maintenance'
};

/**
 * 根据当前语言获取论坛状态枚举选项
 * @param t 国际化函数
 * @returns 论坛状态枚举选项数组
 */
export function getForumStatusOptions(t: (key: string) => string) {
    return [
        {label: t('course.forumStatus.NORMAL'), value: ForumStatusEnum.NORMAL},
        {label: t('course.forumStatus.CLOSED'), value: ForumStatusEnum.CLOSED},
        {label: t('course.forumStatus.MAINTENANCE'), value: ForumStatusEnum.MAINTENANCE}
    ];
}

/**
 * 获取论坛状态标签
 * @param value 论坛状态枚举值
 * @param isEn 是否为英文
 * @returns 论坛状态标签
 */
export function getForumStatusLabel(value: ForumStatusEnum | number | string, isEn: boolean = false): string {
    // 确保value是数字类型
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;

    // 转换为ForumStatusEnum类型
    const enumValue = numValue as ForumStatusEnum;

    // 获取对应语言的标签
    const map = isEn ? forumStatusEnLabelMap : forumStatusLabelMap;

    // 如果映射中存在该值，则返回对应标签，否则返回正常
    return map[enumValue] || map[ForumStatusEnum.NORMAL];
}
