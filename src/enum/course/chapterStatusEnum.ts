/**
 * 章节状态枚举
 */
export enum ChapterStatusEnum {
    /** 草稿 */
    DRAFT = 0,
    /** 发布 */
    PUBLISHED = 1
}

/**
 * 章节状态枚举中文标签
 */
export const chapterStatusLabelMap = {
    [ChapterStatusEnum.DRAFT]: '草稿',
    [ChapterStatusEnum.PUBLISHED]: '发布'
};

/**
 * 章节状态枚举英文标签
 */
export const chapterStatusEnLabelMap = {
    [ChapterStatusEnum.DRAFT]: 'Draft',
    [ChapterStatusEnum.PUBLISHED]: 'Published'
};

/**
 * 根据当前语言获取章节状态枚举选项
 * @param t 国际化函数
 * @returns 章节状态枚举选项数组
 */
export function getChapterStatusOptions(t: (key: string) => string) {
    return [
        {label: t('course.chapterStatus.DRAFT'), value: ChapterStatusEnum.DRAFT},
        {label: t('course.chapterStatus.PUBLISHED'), value: ChapterStatusEnum.PUBLISHED}
    ];
}

/**
 * 获取章节状态标签
 * @param value 章节状态枚举值
 * @param isEn 是否为英文
 * @returns 章节状态标签
 */
export function getChapterStatusLabel(value: ChapterStatusEnum | number | string, isEn: boolean = false): string {
    // 确保value是数字类型
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;

    // 转换为ChapterStatusEnum类型
    const enumValue = numValue as ChapterStatusEnum;

    // 获取对应语言的标签
    const map = isEn ? chapterStatusEnLabelMap : chapterStatusLabelMap;

    // 如果映射中存在该值，则返回对应标签，否则返回草稿
    return map[enumValue] || map[ChapterStatusEnum.DRAFT];
}
