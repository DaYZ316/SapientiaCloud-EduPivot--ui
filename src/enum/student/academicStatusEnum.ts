/**
 * 学籍状态枚举
 */
export enum AcademicStatusEnum {
    /** 在读 */
    ENROLLED = 0,
    /** 休学 */
    SUSPENDED = 1,
    /** 退学 */
    DROPPED = 2,
    /** 毕业 */
    GRADUATED = 3
}

/**
 * 学籍状态枚举中文标签
 */
export const academicStatusLabelMap = {
    [AcademicStatusEnum.ENROLLED]: '在读',
    [AcademicStatusEnum.SUSPENDED]: '休学',
    [AcademicStatusEnum.DROPPED]: '退学',
    [AcademicStatusEnum.GRADUATED]: '毕业'
};

/**
 * 学籍状态枚举英文标签
 */
export const academicStatusEnLabelMap = {
    [AcademicStatusEnum.ENROLLED]: 'Enrolled',
    [AcademicStatusEnum.SUSPENDED]: 'Suspended',
    [AcademicStatusEnum.DROPPED]: 'Dropped',
    [AcademicStatusEnum.GRADUATED]: 'Graduated'
};

/**
 * 学籍状态枚举选项数组（中文）
 */
export const academicStatusOptions = [
    {label: '在读', value: AcademicStatusEnum.ENROLLED},
    {label: '休学', value: AcademicStatusEnum.SUSPENDED},
    {label: '退学', value: AcademicStatusEnum.DROPPED},
    {label: '毕业', value: AcademicStatusEnum.GRADUATED}
];

/**
 * 学籍状态枚举选项数组（英文）
 */
export const academicStatusEnOptions = [
    {label: 'Enrolled', value: AcademicStatusEnum.ENROLLED},
    {label: 'Suspended', value: AcademicStatusEnum.SUSPENDED},
    {label: 'Dropped', value: AcademicStatusEnum.DROPPED},
    {label: 'Graduated', value: AcademicStatusEnum.GRADUATED}
];

/**
 * 根据当前语言获取学籍状态枚举选项
 * @param isEn 是否为英文
 * @returns 学籍状态枚举选项数组
 */
export function getAcademicStatusOptions(isEn: boolean = false) {
    return isEn ? academicStatusEnOptions : academicStatusOptions;
}

/**
 * 获取学籍状态标签
 * @param value 学籍状态枚举值
 * @param isEn 是否为英文
 * @returns 学籍状态标签
 */
export function getAcademicStatusLabel(value: AcademicStatusEnum | number | string, isEn: boolean = false): string {
    // 确保value是数字类型
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;

    // 转换为AcademicStatusEnum类型
    const enumValue = numValue as AcademicStatusEnum;

    // 获取对应语言的标签
    const map = isEn ? academicStatusEnLabelMap : academicStatusLabelMap;

    // 如果映射中存在该值，则返回对应标签，否则返回在读
    return map[enumValue] || map[AcademicStatusEnum.ENROLLED];
}