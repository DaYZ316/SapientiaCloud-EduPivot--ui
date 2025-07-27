/**
 * 状态枚举
 */
export enum StatusEnum {
    /** 正常 */
    NORMAL = 0,
    /** 停用 */
    DISABLED = 1
}

/**
 * 状态枚举中文标签
 */
export const statusLabelMap = {
    [StatusEnum.NORMAL]: '正常',
    [StatusEnum.DISABLED]: '停用'
};

/**
 * 状态枚举英文标签
 */
export const statusEnLabelMap = {
    [StatusEnum.NORMAL]: 'Normal',
    [StatusEnum.DISABLED]: 'Disabled'
};

/**
 * 状态枚举选项数组（中文）
 */
export const statusOptions = [
    {label: '正常', value: StatusEnum.NORMAL},
    {label: '停用', value: StatusEnum.DISABLED}
];

/**
 * 状态枚举选项数组（英文）
 */
export const statusEnOptions = [
    {label: 'Normal', value: StatusEnum.NORMAL},
    {label: 'Disabled', value: StatusEnum.DISABLED}
];

/**
 * 根据当前语言获取状态枚举选项
 * @param isEn 是否为英文
 * @returns 状态枚举选项数组
 */
export function getStatusOptions(isEn: boolean = false) {
    return isEn ? statusEnOptions : statusOptions;
}

/**
 * 获取状态标签
 * @param value 状态枚举值
 * @param isEn 是否为英文
 * @returns 状态标签
 */
export function getStatusLabel(value: StatusEnum | number | string, isEn: boolean = false): string {
    // 确保value是数字类型
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;

    // 转换为StatusEnum类型
    const enumValue = numValue as StatusEnum;

    // 获取对应语言的标签
    const map = isEn ? statusEnLabelMap : statusLabelMap;

    // 如果映射中存在该值，则返回对应标签，否则返回正常
    return map[enumValue] || map[StatusEnum.NORMAL];
} 