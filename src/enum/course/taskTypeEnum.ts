/**
 * 任务类型枚举
 * 用于定义课程任务的类型
 */
export enum TaskTypeEnum {
  /** 作业 */
  HOMEWORK = 0,
  /** 测验 */
  QUIZ = 1,
  /** 项目 */
  PROJECT = 2,
  /** 实验 */
  EXPERIMENT = 3
}

/**
 * 任务类型中文标签映射
 */
export const taskTypeLabelMap = {
  [TaskTypeEnum.HOMEWORK]: '作业',
  [TaskTypeEnum.QUIZ]: '测验',
  [TaskTypeEnum.PROJECT]: '项目',
  [TaskTypeEnum.EXPERIMENT]: '实验'
} as const

/**
 * 任务类型英文标签映射
 */
export const taskTypeEnLabelMap = {
  [TaskTypeEnum.HOMEWORK]: 'Homework',
  [TaskTypeEnum.QUIZ]: 'Quiz',
  [TaskTypeEnum.PROJECT]: 'Project',
  [TaskTypeEnum.EXPERIMENT]: 'Experiment'
} as const

/**
 * 获取任务类型标签
 * @param value 任务类型值
 * @param isEn 是否英文
 * @returns 任务类型标签
 */
export function getTaskTypeLabel(value: TaskTypeEnum | number | string, isEn = false): string {
  const type = Number(value) as TaskTypeEnum
  const labelMap = isEn ? taskTypeEnLabelMap : taskTypeLabelMap
  return labelMap[type] || (isEn ? 'Unknown' : '未知')
}

/**
 * 获取任务类型选项
 * @param t 国际化函数
 * @returns 任务类型选项数组
 */
export function getTaskTypeOptions(t: (key: string) => string) {
  return [
    {label: t('course.tasks.type.HOMEWORK'), value: TaskTypeEnum.HOMEWORK},
    {label: t('course.tasks.type.QUIZ'), value: TaskTypeEnum.QUIZ},
    {label: t('course.tasks.type.PROJECT'), value: TaskTypeEnum.PROJECT},
    {label: t('course.tasks.type.EXPERIMENT'), value: TaskTypeEnum.EXPERIMENT}
  ]
}
