/**
 * 题目状态枚举
 * 用于定义题目的状态
 */
export enum QuestionStatusEnum {
    /** 草稿 */
    DRAFT = 0,
    /** 发布 */
    PUBLISHED = 1,
    /** 停用 */
    DISABLED = 2
}

/**
 * 题目状态中文标签映射
 */
export const questionStatusLabelMap = {
    [QuestionStatusEnum.DRAFT]: '草稿',
    [QuestionStatusEnum.PUBLISHED]: '发布',
    [QuestionStatusEnum.DISABLED]: '停用'
} as const

/**
 * 题目状态英文标签映射
 */
export const questionStatusEnLabelMap = {
    [QuestionStatusEnum.DRAFT]: 'Draft',
    [QuestionStatusEnum.PUBLISHED]: 'Published',
    [QuestionStatusEnum.DISABLED]: 'Disabled'
} as const

/**
 * 获取题目状态标签
 * @param value 题目状态值
 * @param isEn 是否英文
 * @returns 题目状态标签
 */
export function getQuestionStatusLabel(value: QuestionStatusEnum | number | string, isEn = false): string {
    const status = Number(value) as QuestionStatusEnum
    const labelMap = isEn ? questionStatusEnLabelMap : questionStatusLabelMap
    return labelMap[status] || (isEn ? 'Unknown' : '未知')
}

/**
 * 获取题目状态选项
 * @param t 国际化函数
 * @returns 题目状态选项数组
 */
export function getQuestionStatusOptions(t: (key: string) => string) {
    return [
        {label: t('course.questions.status.DRAFT'), value: QuestionStatusEnum.DRAFT},
        {label: t('course.questions.status.PUBLISHED'), value: QuestionStatusEnum.PUBLISHED},
        {label: t('course.questions.status.DISABLED'), value: QuestionStatusEnum.DISABLED}
    ]
}
