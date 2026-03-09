/**
 * 教室类型枚举
 */
export enum ClassroomTypeEnum {
    /** 小型教室 */
    SMALL = 0,
    /** 中型教室 */
    MIDDLE = 1,
    /** 大型教室 */
    LARGE = 2,
    /** 超大型教室 */
    EXTRA_LARGE = 3
}

/**
 * 教室类型枚举中文标签
 */
export const classroomTypeLabelMap = {
    [ClassroomTypeEnum.SMALL]: '小型教室',
    [ClassroomTypeEnum.MIDDLE]: '中型教室',
    [ClassroomTypeEnum.LARGE]: '大型教室',
    [ClassroomTypeEnum.EXTRA_LARGE]: '超大型教室'
};

/**
 * 教室类型枚举英文标签
 */
export const classroomTypeEnLabelMap = {
    [ClassroomTypeEnum.SMALL]: 'Small Classroom',
    [ClassroomTypeEnum.MIDDLE]: 'Middle Classroom',
    [ClassroomTypeEnum.LARGE]: 'Large Classroom',
    [ClassroomTypeEnum.EXTRA_LARGE]: 'Extra Large Classroom'
};

/**
 * 教室类型枚举选项数组（中文）
 */
export const classroomTypeOptions = [
    {label: '小型教室', value: ClassroomTypeEnum.SMALL},
    {label: '中型教室', value: ClassroomTypeEnum.MIDDLE},
    {label: '大型教室', value: ClassroomTypeEnum.LARGE},
    {label: '超大型教室', value: ClassroomTypeEnum.EXTRA_LARGE}
];

/**
 * 教室类型枚举选项数组（英文）
 */
export const classroomTypeEnOptions = [
    {label: 'Small Classroom', value: ClassroomTypeEnum.SMALL},
    {label: 'Middle Classroom', value: ClassroomTypeEnum.MIDDLE},
    {label: 'Large Classroom', value: ClassroomTypeEnum.LARGE},
    {label: 'Extra Large Classroom', value: ClassroomTypeEnum.EXTRA_LARGE}
];

/**
 * 根据当前语言获取教室类型枚举选项
 * @param isEn 是否为英文
 * @returns 教室类型枚举选项数组
 */
export function getClassroomTypeOptions(isEn: boolean = false) {
    return isEn ? classroomTypeEnOptions : classroomTypeOptions;
}

/**
 * 获取教室类型标签
 * @param value 教室类型枚举值
 * @param isEn 是否为英文
 * @returns 教室类型标签
 */
export function getClassroomTypeLabel(value: ClassroomTypeEnum | number | string, isEn: boolean = false): string {
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;
    const enumValue = numValue as ClassroomTypeEnum;
    const map = isEn ? classroomTypeEnLabelMap : classroomTypeLabelMap;
    return map[enumValue] || map[ClassroomTypeEnum.SMALL];
}

/**
 * 教室类型枚举值到字符串值的映射
 */
export const classroomTypeToStringMap: Record<ClassroomTypeEnum, string> = {
    [ClassroomTypeEnum.SMALL]: 'classroomMini',
    [ClassroomTypeEnum.MIDDLE]: 'classroomMedium',
    [ClassroomTypeEnum.LARGE]: 'classroomPro',
    [ClassroomTypeEnum.EXTRA_LARGE]: 'classroomPromax'
};

/**
 * 将教室类型枚举值转换为字符串值
 * @param value 教室类型枚举值
 * @returns 教室类型字符串值
 */
export function getClassroomTypeString(value: ClassroomTypeEnum | number | string | null | undefined): string {
    if (value === null || value === undefined) {
        return 'classroomMini';
    }
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;
    const enumValue = numValue as ClassroomTypeEnum;
    return classroomTypeToStringMap[enumValue] || 'classroomMini';
}

/**
 * 字符串值到教室类型枚举值的映射
 */
export const stringToClassroomTypeMap: Record<string, ClassroomTypeEnum> = {
    'classroomMini': ClassroomTypeEnum.SMALL,
    'classroomMedium': ClassroomTypeEnum.MIDDLE,
    'classroomPro': ClassroomTypeEnum.LARGE,
    'classroomPromax': ClassroomTypeEnum.EXTRA_LARGE
};

/**
 * 将字符串值转换为教室类型枚举值
 * @param value 教室类型字符串值
 * @returns 教室类型枚举值，如果无效则返回 null
 */
export function getClassroomTypeFromString(value: string | null | undefined): ClassroomTypeEnum | null {
    if (!value) {
        return null;
    }
    return stringToClassroomTypeMap[value] ?? null;
}

