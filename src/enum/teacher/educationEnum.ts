/**
 * 学历枚举
 */
export enum EducationEnum {
    /** 专科 */
    COLLEGE = 0,
    /** 本科 */
    BACHELOR = 1,
    /** 硕士 */
    MASTER = 2,
    /** 博士 */
    DOCTOR = 3
}

/**
 * 学历枚举中文标签
 */
export const educationLabelMap = {
    [EducationEnum.COLLEGE]: '专科',
    [EducationEnum.BACHELOR]: '本科',
    [EducationEnum.MASTER]: '硕士',
    [EducationEnum.DOCTOR]: '博士'
};

/**
 * 学历枚举英文标签
 */
export const educationEnLabelMap = {
    [EducationEnum.COLLEGE]: 'Associate',
    [EducationEnum.BACHELOR]: 'Bachelor',
    [EducationEnum.MASTER]: 'Master',
    [EducationEnum.DOCTOR]: 'Doctor'
};

/**
 * 学历枚举选项数组（中文）
 */
export const educationOptions = [
    {label: '专科', value: EducationEnum.COLLEGE},
    {label: '本科', value: EducationEnum.BACHELOR},
    {label: '硕士', value: EducationEnum.MASTER},
    {label: '博士', value: EducationEnum.DOCTOR}
];

/**
 * 学历枚举选项数组（英文）
 */
export const educationEnOptions = [
    {label: 'Associate', value: EducationEnum.COLLEGE},
    {label: 'Bachelor', value: EducationEnum.BACHELOR},
    {label: 'Master', value: EducationEnum.MASTER},
    {label: 'Doctor', value: EducationEnum.DOCTOR}
];

/**
 * 根据当前语言获取学历枚举选项
 * @param isEn 是否为英文
 * @returns 学历枚举选项数组
 */
export function getEducationOptions(isEn: boolean = false) {
    return isEn ? educationEnOptions : educationOptions;
}

/**
 * 获取学历标签
 * @param value 学历枚举值
 * @param isEn 是否为英文
 * @returns 学历标签
 */
export function getEducationLabel(value: EducationEnum | number | string, isEn: boolean = false): string {
    // 确保value是数字类型
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;

    // 转换为EducationEnum类型
    const enumValue = numValue as EducationEnum;

    // 获取对应语言的标签
    const map = isEn ? educationEnLabelMap : educationLabelMap;

    // 如果映射中存在该值，则返回对应标签，否则返回专科
    return map[enumValue] || map[EducationEnum.COLLEGE];
}