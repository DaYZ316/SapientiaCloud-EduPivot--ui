/**
 * 题库难度枚举
 */
export enum QuestionBankDifficultyEnum {
    /** 简单 */
    EASY = 1,
    /** 中等 */
    MEDIUM = 2,
    /** 困难 */
    HARD = 3
}

/**
 * 题库难度中文标签映射
 */
export const questionBankDifficultyLabelMap = {
    [QuestionBankDifficultyEnum.EASY]: '简单',
    [QuestionBankDifficultyEnum.MEDIUM]: '中等',
    [QuestionBankDifficultyEnum.HARD]: '困难'
} as const

/**
 * 题库难度英文标签映射
 */
export const questionBankDifficultyEnLabelMap = {
    [QuestionBankDifficultyEnum.EASY]: 'Easy',
    [QuestionBankDifficultyEnum.MEDIUM]: 'Medium',
    [QuestionBankDifficultyEnum.HARD]: 'Hard'
} as const

/**
 * 获取题库难度选项
 * @param t 国际化函数
 * @returns 题库难度选项数组
 */
export function getQuestionBankDifficultyOptions(t: (key: string) => string) {
    return [
        {label: t('common.easy'), value: QuestionBankDifficultyEnum.EASY},
        {label: t('common.medium'), value: QuestionBankDifficultyEnum.MEDIUM},
        {label: t('common.hard'), value: QuestionBankDifficultyEnum.HARD}
    ];
}

/**
 * 获取题库难度标签
 * @param value 题库难度枚举值
 * @param isEn 是否为英文
 * @returns 题库难度标签
 */
export function getQuestionBankDifficultyLabel(value: QuestionBankDifficultyEnum | number | string, isEn: boolean = false): string {
    // 确保value是数字类型
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;

    // 转换为QuestionBankDifficultyEnum类型
    const enumValue = numValue as QuestionBankDifficultyEnum;

    // 获取对应语言的标签
    const map = isEn ? questionBankDifficultyEnLabelMap : questionBankDifficultyLabelMap;

    // 如果映射中存在该值，则返回对应标签，否则返回简单
    return map[enumValue] || map[QuestionBankDifficultyEnum.EASY];
}
