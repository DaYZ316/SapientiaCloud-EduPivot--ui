/**
 * 论坛类型枚举
 */
export enum ForumTypeEnum {
    /** 讨论区 */
    DISCUSSION = 0,
    /** 问答区 */
    Q_AND_A = 1,
    /** 作业区 */
    ASSIGNMENT = 2,
    /** 公告区 */
    ANNOUNCEMENT = 3
}

/**
 * 论坛类型枚举中文标签
 */
export const forumTypeLabelMap = {
    [ForumTypeEnum.DISCUSSION]: '讨论区',
    [ForumTypeEnum.Q_AND_A]: '问答区',
    [ForumTypeEnum.ASSIGNMENT]: '作业区',
    [ForumTypeEnum.ANNOUNCEMENT]: '公告区'
};

/**
 * 论坛类型枚举英文标签
 */
export const forumTypeEnLabelMap = {
    [ForumTypeEnum.DISCUSSION]: 'Discussion',
    [ForumTypeEnum.Q_AND_A]: 'Q&A',
    [ForumTypeEnum.ASSIGNMENT]: 'Assignment',
    [ForumTypeEnum.ANNOUNCEMENT]: 'Announcement'
};

/**
 * 根据当前语言获取论坛类型枚举选项
 * @param t 国际化函数
 * @returns 论坛类型枚举选项数组
 */
export function getForumTypeOptions(t: (key: string) => string) {
    return [
        {label: t('course.forum.forumType.DISCUSSION'), value: ForumTypeEnum.DISCUSSION},
        {label: t('course.forum.forumType.Q_AND_A'), value: ForumTypeEnum.Q_AND_A},
        {label: t('course.forum.forumType.ASSIGNMENT'), value: ForumTypeEnum.ASSIGNMENT},
        {label: t('course.forum.forumType.ANNOUNCEMENT'), value: ForumTypeEnum.ANNOUNCEMENT}
    ];
}

/**
 * 获取论坛类型标签
 * @param value 论坛类型枚举值
 * @param isEn 是否为英文
 * @returns 论坛类型标签
 */
export function getForumTypeLabel(value: ForumTypeEnum | number | string, isEn: boolean = false): string {
    // 确保value是数字类型
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;

    // 转换为ForumTypeEnum类型
    const enumValue = numValue as ForumTypeEnum;

    // 获取对应语言的标签
    const map = isEn ? forumTypeEnLabelMap : forumTypeLabelMap;

    // 如果映射中存在该值，则返回对应标签，否则返回讨论区
    return map[enumValue] || map[ForumTypeEnum.DISCUSSION];
}
