/**
 * 角色枚举（消息角色）
 */
export enum RoleEnum {
    /** 用户 */
    USER = 0,
    /** AI助手 */
    ASSISTANT = 1,
    /** 系统 */
    SYSTEM = 2
}

/**
 * 角色枚举中文标签
 */
export const roleLabelMap = {
    [RoleEnum.USER]: '用户',
    [RoleEnum.ASSISTANT]: 'AI助手',
    [RoleEnum.SYSTEM]: '系统'
};

/**
 * 角色枚举英文标签
 */
export const roleEnLabelMap = {
    [RoleEnum.USER]: 'User',
    [RoleEnum.ASSISTANT]: 'AI Assistant',
    [RoleEnum.SYSTEM]: 'System'
};

/**
 * 角色枚举选项数组（中文）
 */
export const roleOptions = [
    {label: '用户', value: RoleEnum.USER},
    {label: 'AI助手', value: RoleEnum.ASSISTANT},
    {label: '系统', value: RoleEnum.SYSTEM}
];

/**
 * 角色枚举选项数组（英文）
 */
export const roleEnOptions = [
    {label: 'User', value: RoleEnum.USER},
    {label: 'AI Assistant', value: RoleEnum.ASSISTANT},
    {label: 'System', value: RoleEnum.SYSTEM}
];

/**
 * 根据当前语言获取角色枚举选项
 * @param isEn 是否为英文
 * @returns 角色枚举选项数组
 */
export function getRoleOptions(isEn: boolean = false) {
    return isEn ? roleEnOptions : roleOptions;
}

/**
 * 获取角色标签
 * @param value 角色枚举值
 * @param isEn 是否为英文
 * @returns 角色标签
 */
export function getRoleLabel(value: RoleEnum | number | string, isEn: boolean = false): string {
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;
    const enumValue = numValue as RoleEnum;
    const map = isEn ? roleEnLabelMap : roleLabelMap;
    return map[enumValue] || map[RoleEnum.USER];
}

