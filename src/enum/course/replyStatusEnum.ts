/**
 * 回复状态枚举
 */
export enum ReplyStatusEnum {
    /** 正常 */
    NORMAL = 0,
    /** 删除 */
    DELETED = 1,
    /** 审核中 */
    PENDING = 2,
    /** 审核失败 */
    REJECTED = 3
}

/**
 * 回复状态枚举中文标签
 */
export const replyStatusLabelMap = {
    [ReplyStatusEnum.NORMAL]: '正常',
    [ReplyStatusEnum.DELETED]: '删除',
    [ReplyStatusEnum.PENDING]: '审核中',
    [ReplyStatusEnum.REJECTED]: '审核失败'
};

/**
 * 回复状态枚举英文标签
 */
export const replyStatusEnLabelMap = {
    [ReplyStatusEnum.NORMAL]: 'Normal',
    [ReplyStatusEnum.DELETED]: 'Deleted',
    [ReplyStatusEnum.PENDING]: 'Pending',
    [ReplyStatusEnum.REJECTED]: 'Rejected'
};

/**
 * 根据当前语言获取回复状态枚举选项
 * @param t 国际化函数
 * @returns 回复状态枚举选项数组
 */
export function getReplyStatusOptions(t: (key: string) => string) {
    return [
        {label: t('course.replyStatus.NORMAL'), value: ReplyStatusEnum.NORMAL},
        {label: t('course.replyStatus.DELETED'), value: ReplyStatusEnum.DELETED},
        {label: t('course.replyStatus.PENDING'), value: ReplyStatusEnum.PENDING},
        {label: t('course.replyStatus.REJECTED'), value: ReplyStatusEnum.REJECTED}
    ];
}

/**
 * 获取回复状态标签
 * @param value 回复状态枚举值
 * @param isEn 是否为英文
 * @returns 回复状态标签
 */
export function getReplyStatusLabel(value: ReplyStatusEnum | number | string, isEn: boolean = false): string {
    // 确保value是数字类型
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;

    // 转换为ReplyStatusEnum类型
    const enumValue = numValue as ReplyStatusEnum;

    // 获取对应语言的标签
    const map = isEn ? replyStatusEnLabelMap : replyStatusLabelMap;

    // 如果映射中存在该值，则返回对应标签，否则返回正常
    return map[enumValue] || map[ReplyStatusEnum.NORMAL];
}
