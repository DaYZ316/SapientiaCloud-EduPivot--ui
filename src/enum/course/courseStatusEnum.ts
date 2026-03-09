/**
 * 课程状态枚举
 */
export enum CourseStatusEnum {
    /** 正常 */
    NORMAL = 0,
    /** 停课 */
    SUSPENDED = 1
}

/**
 * 课程状态枚举中文标签
 */
export const courseStatusLabelMap = {
    [CourseStatusEnum.NORMAL]: '正常',
    [CourseStatusEnum.SUSPENDED]: '停课'
};

/**
 * 课程状态枚举英文标签
 */
export const courseStatusEnLabelMap = {
    [CourseStatusEnum.NORMAL]: 'Normal',
    [CourseStatusEnum.SUSPENDED]: 'Suspended'
};

/**
 * 根据当前语言获取课程状态枚举选项
 * @param t 国际化函数
 * @returns 课程状态枚举选项数组
 */
export function getCourseStatusOptions(t: (key: string) => string) {
    return [
        {label: t('course.courseStatus.NORMAL'), value: CourseStatusEnum.NORMAL},
        {label: t('course.courseStatus.SUSPENDED'), value: CourseStatusEnum.SUSPENDED}
    ];
}

/**
 * 获取课程状态标签
 * @param value 课程状态枚举值
 * @param isEn 是否为英文
 * @returns 课程状态标签
 */
export function getCourseStatusLabel(value: CourseStatusEnum | number | string, isEn: boolean = false): string {
    // 确保value是数字类型
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;

    // 转换为CourseStatusEnum类型
    const enumValue = numValue as CourseStatusEnum;

    // 获取对应语言的标签
    const map = isEn ? courseStatusEnLabelMap : courseStatusLabelMap;

    // 如果映射中存在该值，则返回对应标签，否则返回正常
    return map[enumValue] || map[CourseStatusEnum.NORMAL];
}