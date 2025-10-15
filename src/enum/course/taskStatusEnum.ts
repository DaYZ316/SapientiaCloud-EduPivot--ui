/**
 * 任务状态枚举
 * 用于定义课程任务的状态
 */
export enum TaskStatusEnum {
  /** 草稿 */
  DRAFT = 0,
  /** 发布 */
  PUBLISHED = 1,
  /** 进行中 */
  IN_PROGRESS = 2,
  /** 已结束 */
  ENDED = 3
}

/**
 * 任务状态中文标签映射
 */
export const taskStatusLabelMap = {
  [TaskStatusEnum.DRAFT]: '草稿',
  [TaskStatusEnum.PUBLISHED]: '发布',
  [TaskStatusEnum.IN_PROGRESS]: '进行中',
  [TaskStatusEnum.ENDED]: '已结束'
} as const

/**
 * 任务状态英文标签映射
 */
export const taskStatusEnLabelMap = {
  [TaskStatusEnum.DRAFT]: 'Draft',
  [TaskStatusEnum.PUBLISHED]: 'Published',
  [TaskStatusEnum.IN_PROGRESS]: 'In Progress',
  [TaskStatusEnum.ENDED]: 'Ended'
} as const

/**
 * 获取任务状态标签
 * @param value 任务状态值
 * @param isEn 是否英文
 * @returns 任务状态标签
 */
export function getTaskStatusLabel(value: TaskStatusEnum | number | string, isEn = false): string {
  const status = Number(value) as TaskStatusEnum
  const labelMap = isEn ? taskStatusEnLabelMap : taskStatusLabelMap
  return labelMap[status] || (isEn ? 'Unknown' : '未知')
}

/**
 * 获取任务状态选项
 * @param t 国际化函数
 * @returns 任务状态选项数组
 */
export function getTaskStatusOptions(t: (key: string) => string) {
  return [
    {label: t('course.tasks.status.DRAFT'), value: TaskStatusEnum.DRAFT},
    {label: t('course.tasks.status.PUBLISHED'), value: TaskStatusEnum.PUBLISHED},
    {label: t('course.tasks.status.IN_PROGRESS'), value: TaskStatusEnum.IN_PROGRESS},
    {label: t('course.tasks.status.ENDED'), value: TaskStatusEnum.ENDED}
  ]
}
