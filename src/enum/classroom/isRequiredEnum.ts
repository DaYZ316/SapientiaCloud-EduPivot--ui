/**
 * 是否必答枚举
 */
export enum IsRequiredEnum {
    /** 选答 */
    OPTIONAL = 0,
    /** 必答 */
    REQUIRED = 1
}

/**
 * 是否必答枚举中文标签
 */
export const isRequiredLabelMap = {
    [IsRequiredEnum.OPTIONAL]: '选答',
    [IsRequiredEnum.REQUIRED]: '必答'
};

/**
 * 是否必答枚举英文标签
 */
export const isRequiredEnLabelMap = {
    [IsRequiredEnum.OPTIONAL]: 'Optional',
    [IsRequiredEnum.REQUIRED]: 'Required'
};

/**
 * 是否必答枚举选项数组（中文）
 */
export const isRequiredOptions = [
    {label: '选答', value: IsRequiredEnum.OPTIONAL},
    {label: '必答', value: IsRequiredEnum.REQUIRED}
];

/**
 * 是否必答枚举选项数组（英文）
 */
export const isRequiredEnOptions = [
    {label: 'Optional', value: IsRequiredEnum.OPTIONAL},
    {label: 'Required', value: IsRequiredEnum.REQUIRED}
];

/**
 * 根据当前语言获取是否必答枚举选项
 * @param isEn 是否为英文
 * @returns 是否必答枚举选项数组
 */
export function getIsRequiredOptions(isEn: boolean = false) {
    return isEn ? isRequiredEnOptions : isRequiredOptions;
}

/**
 * 获取是否必答标签
 * @param value 是否必答枚举值
 * @param isEn 是否为英文
 * @returns 是否必答标签
 */
export function getIsRequiredLabel(value: IsRequiredEnum | number | string, isEn: boolean = false): string {
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;
    const enumValue = numValue as IsRequiredEnum;
    const map = isEn ? isRequiredEnLabelMap : isRequiredLabelMap;
    return map[enumValue] || map[IsRequiredEnum.OPTIONAL];
}

