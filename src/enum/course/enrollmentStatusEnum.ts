/**
 * 选课状态枚举
 */
export enum EnrollmentStatusEnum {
    /** 在读 */
    ENROLLED = 0,
    /** 已退课 */
    DROPPED = 1,
    /** 已完成 */
    COMPLETED = 2
}

/**
 * 选课状态枚举中文标签
 */
export const enrollmentStatusLabelMap = {
    [EnrollmentStatusEnum.ENROLLED]: '在读',
    [EnrollmentStatusEnum.DROPPED]: '已退课',
    [EnrollmentStatusEnum.COMPLETED]: '已完成'
};

/**
 * 选课状态枚举英文标签
 */
export const enrollmentStatusEnLabelMap = {
    [EnrollmentStatusEnum.ENROLLED]: 'Enrolled',
    [EnrollmentStatusEnum.DROPPED]: 'Dropped',
    [EnrollmentStatusEnum.COMPLETED]: 'Completed'
};

/**
 * 根据当前语言获取选课状态枚举选项
 * @param isEn 是否为英文
 * @returns 选课状态枚举选项数组
 */
export function getEnrollmentStatusOptions(isEn: boolean = false) {
    const options = [
        {label: isEn ? 'Enrolled' : '在读', value: EnrollmentStatusEnum.ENROLLED},
        {label: isEn ? 'Dropped' : '已退课', value: EnrollmentStatusEnum.DROPPED},
        {label: isEn ? 'Completed' : '已完成', value: EnrollmentStatusEnum.COMPLETED}
    ];
    return options;
}

/**
 * 获取选课状态标签
 * @param value 选课状态枚举值
 * @param isEn 是否为英文
 * @returns 选课状态标签
 */
export function getEnrollmentStatusLabel(value: EnrollmentStatusEnum | number | string, isEn: boolean = false): string {
    // 确保value是数字类型
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;

    // 转换为EnrollmentStatusEnum类型
    const enumValue = numValue as EnrollmentStatusEnum;

    // 获取对应语言的标签
    const map = isEn ? enrollmentStatusEnLabelMap : enrollmentStatusLabelMap;

    // 如果映射中存在该值，则返回对应标签，否则返回在读
    return map[enumValue] || map[EnrollmentStatusEnum.ENROLLED];
}