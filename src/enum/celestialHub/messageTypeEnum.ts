/**
 * 消息类型枚举
 */
export enum MessageTypeEnum {
    /** 文本 */
    TEXT = 0,
    /** 代码 */
    CODE = 1,
    /** 图片 */
    IMAGE = 2,
    /** 文件 */
    FILE = 3
}

/**
 * 消息类型枚举中文标签
 */
export const messageTypeLabelMap = {
    [MessageTypeEnum.TEXT]: '文本',
    [MessageTypeEnum.CODE]: '代码',
    [MessageTypeEnum.IMAGE]: '图片',
    [MessageTypeEnum.FILE]: '文件'
};

/**
 * 消息类型枚举英文标签
 */
export const messageTypeEnLabelMap = {
    [MessageTypeEnum.TEXT]: 'Text',
    [MessageTypeEnum.CODE]: 'Code',
    [MessageTypeEnum.IMAGE]: 'Image',
    [MessageTypeEnum.FILE]: 'File'
};

/**
 * 消息类型枚举选项数组（中文）
 */
export const messageTypeOptions = [
    {label: '文本', value: MessageTypeEnum.TEXT},
    {label: '代码', value: MessageTypeEnum.CODE},
    {label: '图片', value: MessageTypeEnum.IMAGE},
    {label: '文件', value: MessageTypeEnum.FILE}
];

/**
 * 消息类型枚举选项数组（英文）
 */
export const messageTypeEnOptions = [
    {label: 'Text', value: MessageTypeEnum.TEXT},
    {label: 'Code', value: MessageTypeEnum.CODE},
    {label: 'Image', value: MessageTypeEnum.IMAGE},
    {label: 'File', value: MessageTypeEnum.FILE}
];

/**
 * 根据当前语言获取消息类型枚举选项
 * @param isEn 是否为英文
 * @returns 消息类型枚举选项数组
 */
export function getMessageTypeOptions(isEn: boolean = false) {
    return isEn ? messageTypeEnOptions : messageTypeOptions;
}

/**
 * 获取消息类型标签
 * @param value 消息类型枚举值
 * @param isEn 是否为英文
 * @returns 消息类型标签
 */
export function getMessageTypeLabel(value: MessageTypeEnum | number | string, isEn: boolean = false): string {
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;
    const enumValue = numValue as MessageTypeEnum;
    const map = isEn ? messageTypeEnLabelMap : messageTypeLabelMap;
    return map[enumValue] || map[MessageTypeEnum.TEXT];
}

