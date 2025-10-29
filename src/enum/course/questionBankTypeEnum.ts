/**
 * 题库类型枚举
 */
export enum QuestionBankTypeEnum {
    /** 练习题库 */
    PRACTICE = 0,
    /** 考试题库 */
    EXAM = 1,
    /** 作业题库 */
    HOMEWORK = 2
}

/**
 * 题库类型中文标签映射
 */
export const questionBankTypeLabelMap = {
    [QuestionBankTypeEnum.PRACTICE]: '练习题库',
    [QuestionBankTypeEnum.EXAM]: '考试题库',
    [QuestionBankTypeEnum.HOMEWORK]: '作业题库'
} as const

/**
 * 题库类型英文标签映射
 */
export const questionBankTypeEnLabelMap = {
    [QuestionBankTypeEnum.PRACTICE]: 'Practice',
    [QuestionBankTypeEnum.EXAM]: 'Exam',
    [QuestionBankTypeEnum.HOMEWORK]: 'Homework'
} as const

/**
 * 获取题库类型选项
 * @param t 国际化函数
 * @returns 题库类型选项数组
 */
export function getQuestionBankTypeOptions(t: (key: string) => string) {
    return [
        {label: t('course.questionBank.practice'), value: QuestionBankTypeEnum.PRACTICE},
        {label: t('course.questionBank.exam'), value: QuestionBankTypeEnum.EXAM},
        {label: t('course.questionBank.homework'), value: QuestionBankTypeEnum.HOMEWORK}
    ];
}

/**
 * 获取题库类型标签
 * @param value 题库类型枚举值
 * @param isEn 是否为英文
 * @returns 题库类型标签
 */
export function getQuestionBankTypeLabel(value: QuestionBankTypeEnum | number | string, isEn: boolean = false): string {
    // 确保value是数字类型
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;

    // 转换为QuestionBankTypeEnum类型
    const enumValue = numValue as QuestionBankTypeEnum;

    // 获取对应语言的标签
    const map = isEn ? questionBankTypeEnLabelMap : questionBankTypeLabelMap;

    // 如果映射中存在该值，则返回对应标签，否则返回练习题库
    return map[enumValue] || map[QuestionBankTypeEnum.PRACTICE];
}
