/**
 * 答案正确性枚举
 * 用于定义答案的正确性状态
 */
export enum AnswerCorrectnessEnum {
    /** 错误 */
    WRONG = 0,
    /** 正确 */
    CORRECT = 1,
    /** 部分正确 */
    PARTIAL_CORRECT = 2
}

/**
 * 答案正确性标签映射
 */
export const AnswerCorrectnessLabels = {
    [AnswerCorrectnessEnum.WRONG]: '错误',
    [AnswerCorrectnessEnum.CORRECT]: '正确',
    [AnswerCorrectnessEnum.PARTIAL_CORRECT]: '部分正确'
} as const

/**
 * 获取答案正确性标签
 * @param correctness 答案正确性
 * @returns 答案正确性标签
 */
export function getAnswerCorrectnessLabel(correctness: AnswerCorrectnessEnum): string {
    return AnswerCorrectnessLabels[correctness] || '未知'
}

/**
 * 获取所有答案正确性选项
 * @returns 答案正确性选项数组
 */
export function getAnswerCorrectnessOptions() {
    return Object.entries(AnswerCorrectnessLabels).map(([value, label]) => ({
        value: Number(value),
        label
    }))
}
