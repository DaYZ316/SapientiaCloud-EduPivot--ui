/**
 * 会话类型枚举
 */
export enum SessionTypeEnum {
    /** 普通对话 */
    NORMAL = 0,
    /** 课程问答 */
    COURSE_QA = 1,
    /** 题目辅导 */
    TUTORING = 2,
    /** 知识检索 */
    KNOWLEDGE_SEARCH = 3
}

/**
 * 会话类型枚举中文标签
 */
export const sessionTypeLabelMap = {
    [SessionTypeEnum.NORMAL]: '普通对话',
    [SessionTypeEnum.COURSE_QA]: '课程问答',
    [SessionTypeEnum.TUTORING]: '题目辅导',
    [SessionTypeEnum.KNOWLEDGE_SEARCH]: '知识检索'
};

/**
 * 会话类型枚举英文标签
 */
export const sessionTypeEnLabelMap = {
    [SessionTypeEnum.NORMAL]: 'Normal',
    [SessionTypeEnum.COURSE_QA]: 'Course QA',
    [SessionTypeEnum.TUTORING]: 'Tutoring',
    [SessionTypeEnum.KNOWLEDGE_SEARCH]: 'Knowledge Search'
};

/**
 * 会话类型枚举选项数组（中文）
 */
export const sessionTypeOptions = [
    {label: '普通对话', value: SessionTypeEnum.NORMAL},
    {label: '课程问答', value: SessionTypeEnum.COURSE_QA},
    {label: '题目辅导', value: SessionTypeEnum.TUTORING},
    {label: '知识检索', value: SessionTypeEnum.KNOWLEDGE_SEARCH}
];

/**
 * 会话类型枚举选项数组（英文）
 */
export const sessionTypeEnOptions = [
    {label: 'Normal', value: SessionTypeEnum.NORMAL},
    {label: 'Course QA', value: SessionTypeEnum.COURSE_QA},
    {label: 'Tutoring', value: SessionTypeEnum.TUTORING},
    {label: 'Knowledge Search', value: SessionTypeEnum.KNOWLEDGE_SEARCH}
];

/**
 * 根据当前语言获取会话类型枚举选项
 * @param isEn 是否为英文
 * @returns 会话类型枚举选项数组
 */
export function getSessionTypeOptions(isEn: boolean = false) {
    return isEn ? sessionTypeEnOptions : sessionTypeOptions;
}

/**
 * 获取会话类型标签
 * @param value 会话类型枚举值
 * @param isEn 是否为英文
 * @returns 会话类型标签
 */
export function getSessionTypeLabel(value: SessionTypeEnum | number | string, isEn: boolean = false): string {
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;
    const enumValue = numValue as SessionTypeEnum;
    const map = isEn ? sessionTypeEnLabelMap : sessionTypeLabelMap;
    return map[enumValue] || map[SessionTypeEnum.NORMAL];
}

