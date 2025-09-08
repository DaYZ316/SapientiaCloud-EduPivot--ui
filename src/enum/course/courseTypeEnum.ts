/**
 * 课程类型枚举
 */
export enum CourseTypeEnum {
    /** 必修 */
    REQUIRED = 0,
    /** 选修 */
    ELECTIVE = 1
}

/**
 * 课程类型枚举中文标签
 */
export const courseTypeLabelMap = {
    [CourseTypeEnum.REQUIRED]: '必修',
    [CourseTypeEnum.ELECTIVE]: '选修'
};

/**
 * 课程类型枚举英文标签
 */
export const courseTypeEnLabelMap = {
    [CourseTypeEnum.REQUIRED]: 'Required',
    [CourseTypeEnum.ELECTIVE]: 'Elective'
};

/**
 * 根据当前语言获取课程类型枚举选项
 * @param t 国际化函数
 * @returns 课程类型枚举选项数组
 */
export function getCourseTypeOptions(t: (key: string) => string) {
    return [
        {label: t('course.courseType.REQUIRED'), value: CourseTypeEnum.REQUIRED},
        {label: t('course.courseType.ELECTIVE'), value: CourseTypeEnum.ELECTIVE}
    ];
}

/**
 * 获取课程类型标签
 * @param value 课程类型枚举值
 * @param isEn 是否为英文
 * @returns 课程类型标签
 */
export function getCourseTypeLabel(value: CourseTypeEnum | number | string, isEn: boolean = false): string {
    // 确保value是数字类型
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;

    // 转换为CourseTypeEnum类型
    const enumValue = numValue as CourseTypeEnum;

    // 获取对应语言的标签
    const map = isEn ? courseTypeEnLabelMap : courseTypeLabelMap;

    // 如果映射中存在该值，则返回对应标签，否则返回必修
    return map[enumValue] || map[CourseTypeEnum.REQUIRED];
}
