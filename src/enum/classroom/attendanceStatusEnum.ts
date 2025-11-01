/**
 * 出勤状态枚举
 */
export enum AttendanceStatusEnum {
    /** 未签到 */
    NOT_SIGNED = 0,
    /** 已签到 */
    SIGNED = 1,
    /** 缺席 */
    ABSENT = 2
}

/**
 * 出勤状态枚举中文标签
 */
export const attendanceStatusLabelMap = {
    [AttendanceStatusEnum.NOT_SIGNED]: '未签到',
    [AttendanceStatusEnum.SIGNED]: '已签到',
    [AttendanceStatusEnum.ABSENT]: '缺席'
};

/**
 * 出勤状态枚举英文标签
 */
export const attendanceStatusEnLabelMap = {
    [AttendanceStatusEnum.NOT_SIGNED]: 'Not Signed',
    [AttendanceStatusEnum.SIGNED]: 'Signed',
    [AttendanceStatusEnum.ABSENT]: 'Absent'
};

/**
 * 出勤状态枚举选项数组（中文）
 */
export const attendanceStatusOptions = [
    {label: '未签到', value: AttendanceStatusEnum.NOT_SIGNED},
    {label: '已签到', value: AttendanceStatusEnum.SIGNED},
    {label: '缺席', value: AttendanceStatusEnum.ABSENT}
];

/**
 * 出勤状态枚举选项数组（英文）
 */
export const attendanceStatusEnOptions = [
    {label: 'Not Signed', value: AttendanceStatusEnum.NOT_SIGNED},
    {label: 'Signed', value: AttendanceStatusEnum.SIGNED},
    {label: 'Absent', value: AttendanceStatusEnum.ABSENT}
];

/**
 * 根据当前语言获取出勤状态枚举选项
 * @param isEn 是否为英文
 * @returns 出勤状态枚举选项数组
 */
export function getAttendanceStatusOptions(isEn: boolean = false) {
    return isEn ? attendanceStatusEnOptions : attendanceStatusOptions;
}

/**
 * 获取出勤状态标签
 * @param value 出勤状态枚举值
 * @param isEn 是否为英文
 * @returns 出勤状态标签
 */
export function getAttendanceStatusLabel(value: AttendanceStatusEnum | number | string, isEn: boolean = false): string {
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;
    const enumValue = numValue as AttendanceStatusEnum;
    const map = isEn ? attendanceStatusEnLabelMap : attendanceStatusLabelMap;
    return map[enumValue] || map[AttendanceStatusEnum.NOT_SIGNED];
}

