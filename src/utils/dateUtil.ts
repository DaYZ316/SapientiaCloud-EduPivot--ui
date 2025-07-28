/**
 * 日期时间格式化工具
 */

/**
 * 格式化为东八区时间字符串（对应Java LocalDateTime）
 * @param date Date对象
 * @returns 格式化后的时间字符串 yyyy-MM-dd HH:mm:ss
 */
export function formatToBeijingTime(date: Date): string {
    // 直接转换为东八区时间，不考虑用户当前时区
    // 这样可以确保与Java后端的LocalDateTime保持一致
    const utcTime = date.getTime() + (date.getTimezoneOffset() * 60 * 1000)
    const beijingTime = new Date(utcTime + (8 * 60 * 60 * 1000))

    const year = beijingTime.getFullYear()
    const month = String(beijingTime.getMonth() + 1).padStart(2, '0')
    const day = String(beijingTime.getDate()).padStart(2, '0')
    const hours = String(beijingTime.getHours()).padStart(2, '0')
    const minutes = String(beijingTime.getMinutes()).padStart(2, '0')
    const seconds = String(beijingTime.getSeconds()).padStart(2, '0')

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`
}

/**
 * 格式化时间戳数组为东八区时间字符串数组
 * @param timestamps 时间戳数组
 * @returns 格式化后的时间字符串数组
 */
export function formatTimestampsToBeijingTime(timestamps: [number, number] | null): [string, string] | [null, null] {
    if (!timestamps) {
        return [null, null]
    }

    return [
        formatToBeijingTime(new Date(timestamps[0])),
        formatToBeijingTime(new Date(timestamps[1]))
    ]
}

/**
 * 格式化日期为东八区日期字符串
 * @param date Date对象
 * @returns 格式化后的日期字符串 yyyy-MM-dd
 */
export function formatToBeijingDate(date: Date): string {
    // 直接转换为东八区时间
    const utcTime = date.getTime() + (date.getTimezoneOffset() * 60 * 1000)
    const beijingTime = new Date(utcTime + (8 * 60 * 60 * 1000))

    const year = beijingTime.getFullYear()
    const month = String(beijingTime.getMonth() + 1).padStart(2, '0')
    const day = String(beijingTime.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}

/**
 * 处理日期范围选择器的值变化
 * @param value 日期范围选择器的值
 * @param callback 回调函数，接收格式化后的开始时间和结束时间
 */
export function handleDateRangeChange(
    value: [number, number] | null,
    callback: (startTime: string | null, endTime: string | null) => void
) {
    if (value) {
        const [startTime, endTime] = formatTimestampsToBeijingTime(value)
        callback(startTime, endTime)
    } else {
        callback(null, null)
    }
} 