/**
 * 座位状态枚举
 */
export enum SeatStatusEnum {
    /** 正常 */
    NORMAL = 0,
    /** 已预留 */
    RESERVED = 2,
    /** 已占用 */
    OCCUPIED = 3
}

/**
 * 座位状态枚举中文标签
 */
export const seatStatusLabelMap = {
    [SeatStatusEnum.NORMAL]: '正常',
    [SeatStatusEnum.RESERVED]: '已预留',
    [SeatStatusEnum.OCCUPIED]: '已占用'
};

/**
 * 座位状态枚举英文标签
 */
export const seatStatusEnLabelMap = {
    [SeatStatusEnum.NORMAL]: 'Normal',
    [SeatStatusEnum.RESERVED]: 'Reserved',
    [SeatStatusEnum.OCCUPIED]: 'Occupied'
};

/**
 * 座位状态枚举选项数组（中文）
 */
export const seatStatusOptions = [
    {label: '正常', value: SeatStatusEnum.NORMAL},
    {label: '已预留', value: SeatStatusEnum.RESERVED},
    {label: '已占用', value: SeatStatusEnum.OCCUPIED}
];

/**
 * 座位状态枚举选项数组（英文）
 */
export const seatStatusEnOptions = [
    {label: 'Normal', value: SeatStatusEnum.NORMAL},
    {label: 'Reserved', value: SeatStatusEnum.RESERVED},
    {label: 'Occupied', value: SeatStatusEnum.OCCUPIED}
];

/**
 * 根据当前语言获取座位状态枚举选项
 * @param isEn 是否为英文
 * @returns 座位状态枚举选项数组
 */
export function getSeatStatusOptions(isEn: boolean = false) {
    return isEn ? seatStatusEnOptions : seatStatusOptions;
}

/**
 * 获取座位状态标签
 * @param value 座位状态枚举值
 * @param isEn 是否为英文
 * @returns 座位状态标签
 */
export function getSeatStatusLabel(value: SeatStatusEnum | number | string, isEn: boolean = false): string {
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;
    const enumValue = numValue as SeatStatusEnum;
    const map = isEn ? seatStatusEnLabelMap : seatStatusLabelMap;
    return map[enumValue] || map[SeatStatusEnum.NORMAL];
}

