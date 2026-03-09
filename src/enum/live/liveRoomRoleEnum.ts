/**
 * 直播房间用户角色枚举
 */
export enum LiveRoomRoleEnum {
    /** 学生 */
    STUDENT = 0,
    /** 老师 */
    TEACHER = 1,
    /** 助教 */
    ASSISTANT = 2
}

/**
 * 兼容导出：直播房间用户角色枚举别名
 * 供类型定义中按 LiveRoomUserRoleEnum 引用
 */
export {LiveRoomRoleEnum as LiveRoomUserRoleEnum}

/**
 * 直播房间用户角色中文标签
 */
export const liveRoomRoleLabelMap = {
    [LiveRoomRoleEnum.STUDENT]: '学生',
    [LiveRoomRoleEnum.TEACHER]: '老师',
    [LiveRoomRoleEnum.ASSISTANT]: '助教'
}

/**
 * 直播房间用户角色英文标签
 */
export const liveRoomRoleEnLabelMap = {
    [LiveRoomRoleEnum.STUDENT]: 'Student',
    [LiveRoomRoleEnum.TEACHER]: 'Teacher',
    [LiveRoomRoleEnum.ASSISTANT]: 'Assistant'
}

/**
 * 直播房间用户角色选项数组（中文）
 */
export const liveRoomRoleOptions = [
    {label: '学生', value: LiveRoomRoleEnum.STUDENT},
    {label: '老师', value: LiveRoomRoleEnum.TEACHER},
    {label: '助教', value: LiveRoomRoleEnum.ASSISTANT}
]

/**
 * 直播房间用户角色选项数组（英文）
 */
export const liveRoomRoleEnOptions = [
    {label: 'Student', value: LiveRoomRoleEnum.STUDENT},
    {label: 'Teacher', value: LiveRoomRoleEnum.TEACHER},
    {label: 'Assistant', value: LiveRoomRoleEnum.ASSISTANT}
]

/**
 * 获取直播房间用户角色选项
 * @param isEn 是否为英文
 */
export function getLiveRoomRoleOptions(isEn: boolean = false) {
    return isEn ? liveRoomRoleEnOptions : liveRoomRoleOptions
}

/**
 * 获取直播房间用户角色标签
 * @param value 角色值
 * @param isEn 是否为英文
 */
export function getLiveRoomRoleLabel(value: LiveRoomRoleEnum | number | string, isEn: boolean = false): string {
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value
    const enumValue = numValue as LiveRoomRoleEnum
    const map = isEn ? liveRoomRoleEnLabelMap : liveRoomRoleLabelMap
    return map[enumValue] || liveRoomRoleLabelMap[LiveRoomRoleEnum.STUDENT]
}

