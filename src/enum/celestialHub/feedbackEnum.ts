/**
 * 反馈类型枚举
 */
export enum FeedbackEnum {
    /** 无反馈 */
    NONE = 0,
    /** 有用 */
    USEFUL = 1,
    /** 无用 */
    USELESS = -1
}

/**
 * 反馈类型枚举中文标签
 */
export const feedbackLabelMap = {
    [FeedbackEnum.NONE]: '无反馈',
    [FeedbackEnum.USEFUL]: '有用',
    [FeedbackEnum.USELESS]: '无用'
};

/**
 * 反馈类型枚举英文标签
 */
export const feedbackEnLabelMap = {
    [FeedbackEnum.NONE]: 'None',
    [FeedbackEnum.USEFUL]: 'Useful',
    [FeedbackEnum.USELESS]: 'Useless'
};

/**
 * 反馈类型枚举选项数组（中文）
 */
export const feedbackOptions = [
    {label: '无反馈', value: FeedbackEnum.NONE},
    {label: '有用', value: FeedbackEnum.USEFUL},
    {label: '无用', value: FeedbackEnum.USELESS}
];

/**
 * 反馈类型枚举选项数组（英文）
 */
export const feedbackEnOptions = [
    {label: 'None', value: FeedbackEnum.NONE},
    {label: 'Useful', value: FeedbackEnum.USEFUL},
    {label: 'Useless', value: FeedbackEnum.USELESS}
];

/**
 * 根据当前语言获取反馈类型枚举选项
 * @param isEn 是否为英文
 * @returns 反馈类型枚举选项数组
 */
export function getFeedbackOptions(isEn: boolean = false) {
    return isEn ? feedbackEnOptions : feedbackOptions;
}

/**
 * 获取反馈类型标签
 * @param value 反馈类型枚举值
 * @param isEn 是否为英文
 * @returns 反馈类型标签
 */
export function getFeedbackLabel(value: FeedbackEnum | number | string, isEn: boolean = false): string {
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;
    const enumValue = numValue as FeedbackEnum;
    const map = isEn ? feedbackEnLabelMap : feedbackLabelMap;
    return map[enumValue] || map[FeedbackEnum.NONE];
}

