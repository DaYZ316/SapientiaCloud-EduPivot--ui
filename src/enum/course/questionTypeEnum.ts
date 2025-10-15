/**
 * 题目类型枚举
 * 用于定义题目的类型
 */
export enum QuestionTypeEnum {
  /** 单选题 */
  SINGLE_CHOICE = 0,
  /** 多选题 */
  MULTIPLE_CHOICE = 1,
  /** 判断题 */
  TRUE_FALSE = 2,
  /** 填空题 */
  FILL_BLANK = 3,
  /** 简答题 */
  SHORT_ANSWER = 4
}

/**
 * 题目类型中文标签映射
 */
export const questionTypeLabelMap = {
  [QuestionTypeEnum.SINGLE_CHOICE]: '单选题',
  [QuestionTypeEnum.MULTIPLE_CHOICE]: '多选题',
  [QuestionTypeEnum.TRUE_FALSE]: '判断题',
  [QuestionTypeEnum.FILL_BLANK]: '填空题',
  [QuestionTypeEnum.SHORT_ANSWER]: '简答题'
} as const

/**
 * 题目类型英文标签映射
 */
export const questionTypeEnLabelMap = {
  [QuestionTypeEnum.SINGLE_CHOICE]: 'Single Choice',
  [QuestionTypeEnum.MULTIPLE_CHOICE]: 'Multiple Choice',
  [QuestionTypeEnum.TRUE_FALSE]: 'True/False',
  [QuestionTypeEnum.FILL_BLANK]: 'Fill in the Blank',
  [QuestionTypeEnum.SHORT_ANSWER]: 'Short Answer'
} as const

/**
 * 获取题目类型标签
 * @param value 题目类型值
 * @param isEn 是否英文
 * @returns 题目类型标签
 */
export function getQuestionTypeLabel(value: QuestionTypeEnum | number | string, isEn = false): string {
  const type = Number(value) as QuestionTypeEnum
  const labelMap = isEn ? questionTypeEnLabelMap : questionTypeLabelMap
  return labelMap[type] || (isEn ? 'Unknown' : '未知')
}

/**
 * 获取题目类型选项
 * @param t 国际化函数
 * @returns 题目类型选项数组
 */
export function getQuestionTypeOptions(t: (key: string) => string) {
  return [
    {label: t('course.questions.type.SINGLE_CHOICE'), value: QuestionTypeEnum.SINGLE_CHOICE},
    {label: t('course.questions.type.MULTIPLE_CHOICE'), value: QuestionTypeEnum.MULTIPLE_CHOICE},
    {label: t('course.questions.type.TRUE_FALSE'), value: QuestionTypeEnum.TRUE_FALSE},
    {label: t('course.questions.type.FILL_BLANK'), value: QuestionTypeEnum.FILL_BLANK},
    {label: t('course.questions.type.SHORT_ANSWER'), value: QuestionTypeEnum.SHORT_ANSWER}
  ]
}
