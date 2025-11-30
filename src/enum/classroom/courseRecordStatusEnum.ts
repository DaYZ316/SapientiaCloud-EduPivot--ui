/**
 * 课程记录状态枚举
 */
export enum CourseRecordStatusEnum {
    /** 未开始 */
    NOT_STARTED = 0,
    /** 进行中 */
    IN_PROGRESS = 1,
    /** 已结束 */
    ENDED = 2,
    /** 取消 */
    CANCELLED = 3
}

/**
 * 课程记录状态枚举中文标签
 */
export const courseRecordStatusLabelMap = {
    [CourseRecordStatusEnum.NOT_STARTED]: '未开始',
    [CourseRecordStatusEnum.IN_PROGRESS]: '进行中',
    [CourseRecordStatusEnum.ENDED]: '已结束',
    [CourseRecordStatusEnum.CANCELLED]: '已取消'
};

/**
 * 课程记录状态枚举英文标签
 */
export const courseRecordStatusEnLabelMap = {
    [CourseRecordStatusEnum.NOT_STARTED]: 'Not Started',
    [CourseRecordStatusEnum.IN_PROGRESS]: 'In Progress',
    [CourseRecordStatusEnum.ENDED]: 'Ended',
    [CourseRecordStatusEnum.CANCELLED]: 'Cancelled'
};

/**
 * 课程记录状态枚举选项数组（中文）
 */
export const courseRecordStatusOptions = [
    {label: '未开始', value: CourseRecordStatusEnum.NOT_STARTED},
    {label: '进行中', value: CourseRecordStatusEnum.IN_PROGRESS},
    {label: '已结束', value: CourseRecordStatusEnum.ENDED},
    {label: '已取消', value: CourseRecordStatusEnum.CANCELLED}
];

/**
 * 课程记录状态枚举选项数组（英文）
 */
export const courseRecordStatusEnOptions = [
    {label: 'Not Started', value: CourseRecordStatusEnum.NOT_STARTED},
    {label: 'In Progress', value: CourseRecordStatusEnum.IN_PROGRESS},
    {label: 'Ended', value: CourseRecordStatusEnum.ENDED},
    {label: 'Cancelled', value: CourseRecordStatusEnum.CANCELLED}
];

/**
 * 根据当前语言获取课程记录状态枚举选项
 * @param isEn 是否为英文
 * @returns 课程记录状态枚举选项数组
 */
export function getCourseRecordStatusOptions(isEn: boolean = false) {
    return isEn ? courseRecordStatusEnOptions : courseRecordStatusOptions;
}

/**
 * 获取课程记录状态标签
 * @param value 课程记录状态枚举值
 * @param isEn 是否为英文
 * @returns 课程记录状态标签
 */
export function getCourseRecordStatusLabel(value: CourseRecordStatusEnum | number | string, isEn: boolean = false): string {
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;
    const enumValue = numValue as CourseRecordStatusEnum;
    const map = isEn ? courseRecordStatusEnLabelMap : courseRecordStatusLabelMap;
    return map[enumValue] || map[CourseRecordStatusEnum.NOT_STARTED];
}

