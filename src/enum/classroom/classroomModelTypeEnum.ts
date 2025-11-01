/**
 * 教室模型类型枚举
 */
export enum ClassroomModelTypeEnum {
    /** 小教室 */
    SMALL = 'classroomSmall',
    /** 中教室 */
    MIDDLE = 'classroomMiddle',
    /** 大教室 */
    LARGE = 'classroomLarge'
}

/**
 * 教室模型类型枚举中文标签
 */
export const classroomModelTypeLabelMap = {
    [ClassroomModelTypeEnum.SMALL]: '小教室',
    [ClassroomModelTypeEnum.MIDDLE]: '中教室',
    [ClassroomModelTypeEnum.LARGE]: '大教室'
};

/**
 * 教室模型类型枚举英文标签
 */
export const classroomModelTypeEnLabelMap = {
    [ClassroomModelTypeEnum.SMALL]: 'Small Classroom',
    [ClassroomModelTypeEnum.MIDDLE]: 'Middle Classroom',
    [ClassroomModelTypeEnum.LARGE]: 'Large Classroom'
};

/**
 * 教室模型类型枚举选项数组（中文）
 */
export const classroomModelTypeOptions = [
    {label: '小教室', value: ClassroomModelTypeEnum.SMALL},
    {label: '中教室', value: ClassroomModelTypeEnum.MIDDLE},
    {label: '大教室', value: ClassroomModelTypeEnum.LARGE}
];

/**
 * 教室模型类型枚举选项数组（英文）
 */
export const classroomModelTypeEnOptions = [
    {label: 'Small Classroom', value: ClassroomModelTypeEnum.SMALL},
    {label: 'Middle Classroom', value: ClassroomModelTypeEnum.MIDDLE},
    {label: 'Large Classroom', value: ClassroomModelTypeEnum.LARGE}
];

/**
 * 根据当前语言获取教室模型类型枚举选项
 * @param isEn 是否为英文
 * @returns 教室模型类型枚举选项数组
 */
export function getClassroomModelTypeOptions(isEn: boolean = false) {
    return isEn ? classroomModelTypeEnOptions : classroomModelTypeOptions;
}

/**
 * 获取教室模型类型标签
 * @param value 教室模型类型枚举值
 * @param isEn 是否为英文
 * @returns 教室模型类型标签
 */
export function getClassroomModelTypeLabel(value: ClassroomModelTypeEnum | string, isEn: boolean = false): string {
    const enumValue = value as ClassroomModelTypeEnum;
    const map = isEn ? classroomModelTypeEnLabelMap : classroomModelTypeLabelMap;
    return map[enumValue] || map[ClassroomModelTypeEnum.SMALL];
}

