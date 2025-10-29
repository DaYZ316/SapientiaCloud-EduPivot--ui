/**
 * 内容类型枚举
 */
export enum ContentTypeEnum {
    /** 章节 */
    CHAPTER = 0,
    /** 问题 */
    QUESTION = 1,
    /** 答案 */
    ANSWER = 2,
    /** 论坛 */
    FORUM = 3
}

/**
 * 内容类型枚举中文标签
 */
export const contentTypeLabelMap = {
    [ContentTypeEnum.CHAPTER]: '章节',
    [ContentTypeEnum.QUESTION]: '问题',
    [ContentTypeEnum.ANSWER]: '答案',
    [ContentTypeEnum.FORUM]: '论坛'
};

/**
 * 内容类型枚举英文标签
 */
export const contentTypeEnLabelMap = {
    [ContentTypeEnum.CHAPTER]: 'Chapter',
    [ContentTypeEnum.QUESTION]: 'Question',
    [ContentTypeEnum.ANSWER]: 'Answer',
    [ContentTypeEnum.FORUM]: 'Forum'
};

/**
 * 内容类型枚举选项数组（中文）
 */
export const contentTypeOptions = [
    {label: '章节', value: ContentTypeEnum.CHAPTER},
    {label: '问题', value: ContentTypeEnum.QUESTION},
    {label: '答案', value: ContentTypeEnum.ANSWER},
    {label: '论坛', value: ContentTypeEnum.FORUM}
];

/**
 * 内容类型枚举选项数组（英文）
 */
export const contentTypeEnOptions = [
    {label: 'Chapter', value: ContentTypeEnum.CHAPTER},
    {label: 'Question', value: ContentTypeEnum.QUESTION},
    {label: 'Answer', value: ContentTypeEnum.ANSWER},
    {label: 'Forum', value: ContentTypeEnum.FORUM}
];

/**
 * 根据当前语言获取内容类型枚举选项
 * @param isEn 是否为英文
 * @returns 内容类型枚举选项数组
 */
export function getContentTypeOptions(isEn: boolean = false) {
    return isEn ? contentTypeEnOptions : contentTypeOptions;
}

/**
 * 获取内容类型标签
 * @param value 内容类型枚举值
 * @param isEn 是否为英文
 * @returns 内容类型标签
 */
export function getContentTypeLabel(value: ContentTypeEnum | number | string, isEn: boolean = false): string {
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;
    const enumValue = numValue as ContentTypeEnum;
    const map = isEn ? contentTypeEnLabelMap : contentTypeLabelMap;
    return map[enumValue] || map[ContentTypeEnum.CHAPTER];
}

