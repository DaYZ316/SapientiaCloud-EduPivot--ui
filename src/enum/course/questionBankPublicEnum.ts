/**
 * 题库公开状态枚举
 */
export enum QuestionBankPublicEnum {
    /** 私有 */
    PRIVATE = 0,
    /** 公开 */
    PUBLIC = 1
}

/**
 * 题库公开状态中文标签映射
 */
export const questionBankPublicLabelMap = {
    [QuestionBankPublicEnum.PRIVATE]: '私有',
    [QuestionBankPublicEnum.PUBLIC]: '公开'
} as const

/**
 * 题库公开状态英文标签映射
 */
export const questionBankPublicEnLabelMap = {
    [QuestionBankPublicEnum.PRIVATE]: 'Private',
    [QuestionBankPublicEnum.PUBLIC]: 'Public'
} as const

/**
 * 获取题库公开状态选项
 * @param t 国际化函数
 * @returns 题库公开状态选项数组
 */
export function getQuestionBankPublicOptions(t: (key: string) => string) {
    return [
        {label: t('course.questionBank.private'), value: QuestionBankPublicEnum.PRIVATE},
        {label: t('course.questionBank.public'), value: QuestionBankPublicEnum.PUBLIC}
    ];
}

/**
 * 获取题库公开状态标签
 * @param value 题库公开状态枚举值
 * @param isEn 是否为英文
 * @returns 题库公开状态标签
 */
export function getQuestionBankPublicLabel(value: QuestionBankPublicEnum | number | string, isEn: boolean = false): string {
    // 确保value是数字类型
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;

    // 转换为QuestionBankPublicEnum类型
    const enumValue = numValue as QuestionBankPublicEnum;

    // 获取对应语言的标签
    const map = isEn ? questionBankPublicEnLabelMap : questionBankPublicLabelMap;

    // 如果映射中存在该值，则返回对应标签，否则返回私有
    return map[enumValue] || map[QuestionBankPublicEnum.PRIVATE];
}
