/**
 * 课堂题目状态枚举
 * 用于定义课堂题目的状态
 */
export enum ClassroomQuestionStatusEnum {
    /** 待作答 */
    PENDING = 0,
    /** 待批阅 */
    PENDING_REVIEW = 1,
    /** 已批阅 */
    REVIEWED = 2
}

/**
 * 课堂题目状态枚举中文标签
 */
export const classroomQuestionStatusLabelMap = {
    [ClassroomQuestionStatusEnum.PENDING]: '待作答',
    [ClassroomQuestionStatusEnum.PENDING_REVIEW]: '待批阅',
    [ClassroomQuestionStatusEnum.REVIEWED]: '已批阅'
};

/**
 * 课堂题目状态枚举英文标签
 */
export const classroomQuestionStatusEnLabelMap = {
    [ClassroomQuestionStatusEnum.PENDING]: 'Pending',
    [ClassroomQuestionStatusEnum.PENDING_REVIEW]: 'Pending Review',
    [ClassroomQuestionStatusEnum.REVIEWED]: 'Reviewed'
};

/**
 * 课堂题目状态枚举选项数组（中文）
 */
export const classroomQuestionStatusOptions = [
    {label: '待作答', value: ClassroomQuestionStatusEnum.PENDING},
    {label: '待批阅', value: ClassroomQuestionStatusEnum.PENDING_REVIEW},
    {label: '已批阅', value: ClassroomQuestionStatusEnum.REVIEWED}
];

/**
 * 课堂题目状态枚举选项数组（英文）
 */
export const classroomQuestionStatusEnOptions = [
    {label: 'Pending', value: ClassroomQuestionStatusEnum.PENDING},
    {label: 'Pending Review', value: ClassroomQuestionStatusEnum.PENDING_REVIEW},
    {label: 'Reviewed', value: ClassroomQuestionStatusEnum.REVIEWED}
];

/**
 * 根据当前语言获取课堂题目状态枚举选项
 * @param isEn 是否为英文
 * @returns 课堂题目状态枚举选项数组
 */
export function getClassroomQuestionStatusOptions(isEn: boolean = false) {
    return isEn ? classroomQuestionStatusEnOptions : classroomQuestionStatusOptions;
}

/**
 * 获取课堂题目状态标签
 * @param value 课堂题目状态枚举值
 * @param isEn 是否为英文
 * @returns 课堂题目状态标签
 */
export function getClassroomQuestionStatusLabel(value: ClassroomQuestionStatusEnum | number | string, isEn: boolean = false): string {
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;
    const enumValue = numValue as ClassroomQuestionStatusEnum;
    const map = isEn ? classroomQuestionStatusEnLabelMap : classroomQuestionStatusLabelMap;
    return map[enumValue] || map[ClassroomQuestionStatusEnum.PENDING];
}
















