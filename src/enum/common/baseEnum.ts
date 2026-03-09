/**
 * 枚举选项接口
 */
export interface EnumOption<T = number | string> {
    /** 值 */
    value: T;
    /** 标签 */
    label: string;

    /** 其他额外信息 */
    [key: string]: any;
}

/**
 * 枚举选项工具类
 */
export class EnumUtil {
    /**
     * 根据枚举值获取对应的标签
     * @param options 枚举选项数组
     * @param value 枚举值
     * @param defaultLabel 默认标签（当未找到匹配项时返回）
     * @returns 对应的标签
     */
    static getLabelByValue<T = number | string>(
        options: EnumOption<T>[],
        value: T,
        defaultLabel: string = ''
    ): string {
        const option = options.find(item => item.value === value);
        return option ? option.label : defaultLabel;
    }

    /**
     * 获取枚举所有值的数组
     * @param options 枚举选项数组
     * @returns 值数组
     */
    static getValues<T = number | string>(options: EnumOption<T>[]): T[] {
        return options.map(item => item.value);
    }

    /**
     * 获取枚举所有标签的数组
     * @param options 枚举选项数组
     * @returns 标签数组
     */
    static getLabels(options: EnumOption[]): string[] {
        return options.map(item => item.label);
    }
} 