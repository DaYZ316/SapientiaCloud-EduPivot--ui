/**
 * 答案状态枚举
 */
export enum AnswerStatusEnum {
    /** 错误 */
    INCORRECT = 0,
    /** 正确 */
    CORRECT = 1,
    /** 半对 */
    PARTIALLY_CORRECT = 2,
    /** 待批阅 */
    PENDING_REVIEW = 3
}

/**
 * 答案状态枚举中文标签
 */
export const answerStatusLabelMap = {
    [AnswerStatusEnum.INCORRECT]: '错误',
    [AnswerStatusEnum.CORRECT]: '正确',
    [AnswerStatusEnum.PARTIALLY_CORRECT]: '半对',
    [AnswerStatusEnum.PENDING_REVIEW]: '待批阅'
};

/**
 * 答案状态枚举英文标签
 */
export const answerStatusEnLabelMap = {
    [AnswerStatusEnum.INCORRECT]: 'Incorrect',
    [AnswerStatusEnum.CORRECT]: 'Correct',
    [AnswerStatusEnum.PARTIALLY_CORRECT]: 'Partially Correct',
    [AnswerStatusEnum.PENDING_REVIEW]: 'Pending Review'
};

/**
 * 答案状态枚举选项数组（中文）
 */
export const answerStatusOptions = [
    {label: '错误', value: AnswerStatusEnum.INCORRECT},
    {label: '正确', value: AnswerStatusEnum.CORRECT},
    {label: '半对', value: AnswerStatusEnum.PARTIALLY_CORRECT},
    {label: '待批阅', value: AnswerStatusEnum.PENDING_REVIEW}
];

/**
 * 答案状态枚举选项数组（英文）
 */
export const answerStatusEnOptions = [
    {label: 'Incorrect', value: AnswerStatusEnum.INCORRECT},
    {label: 'Correct', value: AnswerStatusEnum.CORRECT},
    {label: 'Partially Correct', value: AnswerStatusEnum.PARTIALLY_CORRECT},
    {label: 'Pending Review', value: AnswerStatusEnum.PENDING_REVIEW}
];

/**
 * 根据当前语言获取答案状态枚举选项
 * @param isEn 是否为英文
 * @returns 答案状态枚举选项数组
 */
export function getAnswerStatusOptions(isEn: boolean = false) {
    return isEn ? answerStatusEnOptions : answerStatusOptions;
}

/**
 * 获取答案状态标签
 * @param value 答案状态枚举值
 * @param isEn 是否为英文
 * @returns 答案状态标签
 */
export function getAnswerStatusLabel(value: AnswerStatusEnum | number | string, isEn: boolean = false): string {
    // 确保value是数字类型
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;

    // 转换为AnswerStatusEnum类型
    const enumValue = numValue as AnswerStatusEnum;

    // 获取对应语言的标签
    const map = isEn ? answerStatusEnLabelMap : answerStatusLabelMap;

    // 如果映射中存在该值，则返回对应标签，否则返回错误
    return map[enumValue] || map[AnswerStatusEnum.INCORRECT];
}

/**
 * 验证答案状态码是否有效
 * @param code 答案状态码
 * @returns 是否有效
 */
export function isValidAnswerStatusCode(code: number | null): boolean {
    return code !== null && code >= AnswerStatusEnum.INCORRECT && code <= AnswerStatusEnum.PENDING_REVIEW;
}

/**
 * 获取答案状态统计标签
 * @param status 答案状态枚举值
 * @param isEn 是否为英文
 * @returns 统计标签
 */
export function getAnswerStatusCountLabel(status: AnswerStatusEnum | number | string, isEn: boolean = false): string {
    const numValue = (typeof status === 'string') ? parseInt(status, 10) : status;
    const enumValue = numValue as AnswerStatusEnum;

    const countLabels = isEn ? {
        [AnswerStatusEnum.INCORRECT]: 'Incorrect Count',
        [AnswerStatusEnum.CORRECT]: 'Correct Count',
        [AnswerStatusEnum.PARTIALLY_CORRECT]: 'Partially Correct Count',
        [AnswerStatusEnum.PENDING_REVIEW]: 'Pending Review Count'
    } : {
        [AnswerStatusEnum.INCORRECT]: '错误数量',
        [AnswerStatusEnum.CORRECT]: '正确数量',
        [AnswerStatusEnum.PARTIALLY_CORRECT]: '半对数量',
        [AnswerStatusEnum.PENDING_REVIEW]: '待批阅数量'
    };

    return countLabels[enumValue] || countLabels[AnswerStatusEnum.INCORRECT];
}
