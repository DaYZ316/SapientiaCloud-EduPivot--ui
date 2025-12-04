/**
 * 直播房间状态枚举
 */
export enum LiveRoomStatusEnum {
    /** 未开始 */
    NOT_STARTED = 0,
    /** 直播中 */
    LIVE = 1,
    /** 已结束 */
    ENDED = 2,
    /** 已关闭 */
    CLOSED = 3
}

/**
 * 直播房间状态枚举中文标签
 */
export const liveRoomStatusLabelMap = {
    [LiveRoomStatusEnum.NOT_STARTED]: '未开始',
    [LiveRoomStatusEnum.LIVE]: '直播中',
    [LiveRoomStatusEnum.ENDED]: '已结束',
    [LiveRoomStatusEnum.CLOSED]: '已关闭'
}

/**
 * 直播房间状态枚举英文标签
 */
export const liveRoomStatusEnLabelMap = {
    [LiveRoomStatusEnum.NOT_STARTED]: 'Not Started',
    [LiveRoomStatusEnum.LIVE]: 'Live',
    [LiveRoomStatusEnum.ENDED]: 'Ended',
    [LiveRoomStatusEnum.CLOSED]: 'Closed'
}

/**
 * 直播房间状态选项数组（中文）
 */
export const liveRoomStatusOptions = [
    {label: '未开始', value: LiveRoomStatusEnum.NOT_STARTED},
    {label: '直播中', value: LiveRoomStatusEnum.LIVE},
    {label: '已结束', value: LiveRoomStatusEnum.ENDED},
    {label: '已关闭', value: LiveRoomStatusEnum.CLOSED}
]

/**
 * 直播房间状态选项数组（英文）
 */
export const liveRoomStatusEnOptions = [
    {label: 'Not Started', value: LiveRoomStatusEnum.NOT_STARTED},
    {label: 'Live', value: LiveRoomStatusEnum.LIVE},
    {label: 'Ended', value: LiveRoomStatusEnum.ENDED},
    {label: 'Closed', value: LiveRoomStatusEnum.CLOSED}
]

/**
 * 获取直播房间状态选项
 * @param isEn 是否为英文
 */
export function getLiveRoomStatusOptions(isEn: boolean = false) {
    return isEn ? liveRoomStatusEnOptions : liveRoomStatusOptions
}

/**
 * 获取直播房间状态标签
 * @param value 状态值
 * @param isEn 是否为英文
 */
export function getLiveRoomStatusLabel(value: LiveRoomStatusEnum | number | string, isEn: boolean = false): string {
    const numValue = typeof value === 'string' ? parseInt(value, 10) : value
    const enumValue = numValue as LiveRoomStatusEnum
    const map = isEn ? liveRoomStatusEnLabelMap : liveRoomStatusLabelMap
    return map[enumValue] || map[LiveRoomStatusEnum.NOT_STARTED]
}


