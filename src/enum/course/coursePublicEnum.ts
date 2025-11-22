/**
 * 课程公开状态枚举
 */
export enum CoursePublicEnum {
    /** 仅课程成员 */
    PRIVATE = 0,
    /** 公开 */
    PUBLIC = 1
}

/**
 * 课程公开状态枚举中文标签
 */
export const coursePublicLabelMap = {
    [CoursePublicEnum.PRIVATE]: '仅课程成员',
    [CoursePublicEnum.PUBLIC]: '公开'
};

/**
 * 课程公开状态枚举英文标签
 */
export const coursePublicEnLabelMap = {
    [CoursePublicEnum.PRIVATE]: 'Private',
    [CoursePublicEnum.PUBLIC]: 'Public'
};

/**
 * 根据当前语言获取课程公开状态枚举选项
 * @param t 国际化函数
 * @returns 课程公开状态枚举选项数组
 */
export function getCoursePublicOptions(t: (key: string) => string) {
    return [
        {label: t('course.coursePublic.PRIVATE'), value: CoursePublicEnum.PRIVATE},
        {label: t('course.coursePublic.PUBLIC'), value: CoursePublicEnum.PUBLIC}
    ];
}

/**
 * 获取课程公开状态标签
 * @param value 课程公开状态枚举值
 * @param isEn 是否为英文
 * @returns 课程公开状态标签
 */
export function getCoursePublicLabel(value: CoursePublicEnum | number | string, isEn: boolean = false): string {
    // 确保value是数字类型
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;

    // 转换为CoursePublicEnum类型
    const enumValue = numValue as CoursePublicEnum;

    // 获取对应语言的标签
    const map = isEn ? coursePublicEnLabelMap : coursePublicLabelMap;

    // 如果映射中存在该值，则返回对应标签，否则返回仅课程成员
    return map[enumValue] || map[CoursePublicEnum.PRIVATE];
}

