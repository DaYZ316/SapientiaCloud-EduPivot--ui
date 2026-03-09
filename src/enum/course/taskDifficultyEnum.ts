/**
 * 任务难度枚举
 * 用于定义课程任务的难度等级
 */
export enum TaskDifficultyEnum {
    /** 简单 */
    EASY = 1,
    /** 中等 */
    MEDIUM = 2,
    /** 困难 */
    HARD = 3
}

/**
 * 任务难度枚举中文标签
 */
export const taskDifficultyLabelMap = {
    [TaskDifficultyEnum.EASY]: '简单',
    [TaskDifficultyEnum.MEDIUM]: '中等',
    [TaskDifficultyEnum.HARD]: '困难'
};

/**
 * 任务难度枚举英文标签
 */
export const taskDifficultyEnLabelMap = {
    [TaskDifficultyEnum.EASY]: 'Easy',
    [TaskDifficultyEnum.MEDIUM]: 'Medium',
    [TaskDifficultyEnum.HARD]: 'Hard'
};

/**
 * 根据当前语言获取任务难度枚举选项
 * @param t 国际化函数
 * @returns 任务难度枚举选项数组
 */
export function getTaskDifficultyOptions(t: (key: string) => string) {
    return [
        {label: t('course.tasks.difficulty.EASY'), value: TaskDifficultyEnum.EASY},
        {label: t('course.tasks.difficulty.MEDIUM'), value: TaskDifficultyEnum.MEDIUM},
        {label: t('course.tasks.difficulty.HARD'), value: TaskDifficultyEnum.HARD}
    ];
}

/**
 * 获取任务难度标签
 * @param value 任务难度枚举值
 * @param isEn 是否为英文
 * @returns 任务难度标签
 */
export function getTaskDifficultyLabel(value: TaskDifficultyEnum | number | string, isEn: boolean = false): string {
    // 确保value是数字类型
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;

    // 转换为TaskDifficultyEnum类型
    const enumValue = numValue as TaskDifficultyEnum;

    // 获取对应语言的标签
    const map = isEn ? taskDifficultyEnLabelMap : taskDifficultyLabelMap;

    // 如果映射中存在该值，则返回对应标签，否则返回简单
    return map[enumValue] || map[TaskDifficultyEnum.EASY];
}

/**
 * 获取任务难度颜色
 * @param value 任务难度枚举值
 * @returns 难度对应的颜色
 */
export function getTaskDifficultyColor(value: TaskDifficultyEnum | number | string): string {
    // 确保value是数字类型
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;

    // 转换为TaskDifficultyEnum类型
    const enumValue = numValue as TaskDifficultyEnum;

    switch (enumValue) {
        case TaskDifficultyEnum.EASY:
            return '#52c41a' // 绿色 - 简单
        case TaskDifficultyEnum.MEDIUM:
            return '#faad14' // 橙色 - 中等
        case TaskDifficultyEnum.HARD:
            return '#ff4d4f' // 红色 - 困难
        default:
            return '#52c41a' // 默认绿色
    }
}

/**
 * 获取任务难度标签类型
 * @param value 任务难度枚举值
 * @returns 难度对应的标签类型
 */
export function getTaskDifficultyTagType(value: TaskDifficultyEnum | number | string): 'success' | 'warning' | 'error' | 'default' {
    // 确保value是数字类型
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;

    // 转换为TaskDifficultyEnum类型
    const enumValue = numValue as TaskDifficultyEnum;

    switch (enumValue) {
        case TaskDifficultyEnum.EASY:
            return 'success' // 绿色 - 简单
        case TaskDifficultyEnum.MEDIUM:
            return 'warning' // 橙色 - 中等
        case TaskDifficultyEnum.HARD:
            return 'error' // 红色 - 困难
        default:
            return 'default'
    }
}
