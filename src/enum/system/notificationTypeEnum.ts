/**
 * 通知类型枚举
 */
export enum NotificationType {
    /** 系统通知 */
    SYSTEM = 0,
    /** 课程通知 */
    COURSE = 1,
    /** 作业通知 */
    HOMEWORK = 2,
    /** 直播通知 */
    LIVE = 3,
    /** 其他 */
    OTHER = 4
}

/**
 * 通知类型枚举中文标签
 */
export const notificationTypeLabelMap = {
    [NotificationType.SYSTEM]: '系统通知',
    [NotificationType.COURSE]: '课程通知',
    [NotificationType.HOMEWORK]: '作业通知',
    [NotificationType.LIVE]: '直播通知',
    [NotificationType.OTHER]: '其他'
};

/**
 * 通知类型枚举英文标签
 */
export const notificationTypeEnLabelMap = {
    [NotificationType.SYSTEM]: 'System Notification',
    [NotificationType.COURSE]: 'Course Notification',
    [NotificationType.HOMEWORK]: 'Homework Notification',
    [NotificationType.LIVE]: 'Live Notification',
    [NotificationType.OTHER]: 'Other'
};

/**
 * 通知类型枚举选项数组（中文）
 */
export const notificationTypeOptions = [
    {label: '系统通知', value: NotificationType.SYSTEM},
    {label: '课程通知', value: NotificationType.COURSE},
    {label: '作业通知', value: NotificationType.HOMEWORK},
    {label: '直播通知', value: NotificationType.LIVE},
    {label: '其他', value: NotificationType.OTHER}
];

/**
 * 通知类型枚举选项数组（英文）
 */
export const notificationTypeEnOptions = [
    {label: 'System Notification', value: NotificationType.SYSTEM},
    {label: 'Course Notification', value: NotificationType.COURSE},
    {label: 'Homework Notification', value: NotificationType.HOMEWORK},
    {label: 'Live Notification', value: NotificationType.LIVE},
    {label: 'Other', value: NotificationType.OTHER}
];

/**
 * 阅读状态枚举
 */
export enum NotificationReadStatus {
    /** 未读 */
    UNREAD = 0,
    /** 已读 */
    READ = 1
}

/**
 * 阅读状态枚举中文标签
 */
export const notificationReadStatusLabelMap = {
    [NotificationReadStatus.UNREAD]: '未读',
    [NotificationReadStatus.READ]: '已读'
};

/**
 * 阅读状态枚举英文标签
 */
export const notificationReadStatusEnLabelMap = {
    [NotificationReadStatus.UNREAD]: 'Unread',
    [NotificationReadStatus.READ]: 'Read'
};

/**
 * 阅读状态枚举选项数组（中文）
 */
export const notificationReadStatusOptions = [
    {label: '未读', value: NotificationReadStatus.UNREAD},
    {label: '已读', value: NotificationReadStatus.READ}
];

/**
 * 阅读状态枚举选项数组（英文）
 */
export const notificationReadStatusEnOptions = [
    {label: 'Unread', value: NotificationReadStatus.UNREAD},
    {label: 'Read', value: NotificationReadStatus.READ}
];

/**
 * 通知发送范围类型枚举
 */
export enum NotificationScopeType {
    /** 按角色 */
    BY_ROLE = 0,
    /** 按课程学生 */
    BY_COURSE_STUDENTS = 1
}

/**
 * 通知发送范围类型枚举中文标签
 */
export const notificationScopeTypeLabelMap = {
    [NotificationScopeType.BY_ROLE]: '按角色',
    [NotificationScopeType.BY_COURSE_STUDENTS]: '按课程学生'
};

/**
 * 通知发送范围类型枚举英文标签
 */
export const notificationScopeTypeEnLabelMap = {
    [NotificationScopeType.BY_ROLE]: 'By Role',
    [NotificationScopeType.BY_COURSE_STUDENTS]: 'By Course Students'
};

/**
 * 通知发送范围类型枚举选项数组（中文）
 */
export const notificationScopeTypeOptions = [
    {label: '按角色', value: NotificationScopeType.BY_ROLE},
    {label: '按课程学生', value: NotificationScopeType.BY_COURSE_STUDENTS}
];

/**
 * 通知发送范围类型枚举选项数组（英文）
 */
export const notificationScopeTypeEnOptions = [
    {label: 'By Role', value: NotificationScopeType.BY_ROLE},
    {label: 'By Course Students', value: NotificationScopeType.BY_COURSE_STUDENTS}
];

/**
 * 根据当前语言获取通知类型枚举选项
 * @param isEn 是否为英文
 * @returns 通知类型枚举选项数组
 */
export function getNotificationTypeOptions(isEn: boolean = false) {
    return isEn ? notificationTypeEnOptions : notificationTypeOptions;
}

/**
 * 获取通知类型标签
 * @param value 通知类型枚举值
 * @param isEn 是否为英文
 * @returns 通知类型标签
 */
export function getNotificationTypeLabel(value: NotificationType | number | string, isEn: boolean = false): string {
    // 确保value是数字类型
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;

    // 转换为NotificationType类型
    const enumValue = numValue as NotificationType;

    // 获取对应语言的标签
    const map = isEn ? notificationTypeEnLabelMap : notificationTypeLabelMap;

    // 如果映射中存在该值，则返回对应标签，否则返回系统通知
    return map[enumValue] || map[NotificationType.SYSTEM];
}

/**
 * 根据当前语言获取阅读状态枚举选项
 * @param isEn 是否为英文
 * @returns 阅读状态枚举选项数组
 */
export function getNotificationReadStatusOptions(isEn: boolean = false) {
    return isEn ? notificationReadStatusEnOptions : notificationReadStatusOptions;
}

/**
 * 获取阅读状态标签
 * @param value 阅读状态枚举值
 * @param isEn 是否为英文
 * @returns 阅读状态标签
 */
export function getNotificationReadStatusLabel(value: NotificationReadStatus | number | string, isEn: boolean = false): string {
    // 确保value是数字类型
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;

    // 转换为NotificationReadStatus类型
    const enumValue = numValue as NotificationReadStatus;

    // 获取对应语言的标签
    const map = isEn ? notificationReadStatusEnLabelMap : notificationReadStatusLabelMap;

    // 如果映射中存在该值，则返回对应标签，否则返回未读
    return map[enumValue] || map[NotificationReadStatus.UNREAD];
}

/**
 * 根据当前语言获取通知发送范围类型枚举选项
 * @param isEn 是否为英文
 * @returns 通知发送范围类型枚举选项数组
 */
export function getNotificationScopeTypeOptions(isEn: boolean = false) {
    return isEn ? notificationScopeTypeEnOptions : notificationScopeTypeOptions;
}

/**
 * 获取通知发送范围类型标签
 * @param value 通知发送范围类型枚举值
 * @param isEn 是否为英文
 * @returns 通知发送范围类型标签
 */
export function getNotificationScopeTypeLabel(value: NotificationScopeType | number | string, isEn: boolean = false): string {
    // 确保value是数字类型
    const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;

    // 转换为NotificationScopeType类型
    const enumValue = numValue as NotificationScopeType;

    // 获取对应语言的标签
    const map = isEn ? notificationScopeTypeEnLabelMap : notificationScopeTypeLabelMap;

    // 如果映射中存在该值，则返回对应标签，否则返回按角色
    return map[enumValue] || map[NotificationScopeType.BY_ROLE];
}
