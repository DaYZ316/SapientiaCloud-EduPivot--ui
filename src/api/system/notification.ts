import http from '@/utils/http'
import type {
    NotificationAddDTO,
    NotificationBatchAddDTO,
    NotificationDTO,
    NotificationPageQueryDTO,
    NotificationScopeSendDTO
} from '@/types/system/notification'

// 获取默认通知查询对象
export function getDefaultNotificationQuery(): NotificationPageQueryDTO {
    return {
        boxType: 0,
        type: null,
        title: null,
        status: null,
        senderName: null,
        startTime: null,
        endTime: null,
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'create_time',
        isAsc: 'desc'
    }
}

// 获取默认通知DTO
export function getDefaultNotificationDTO(): NotificationDTO {
    return {
        id: null,
        title: null,
        content: null,
        attachmentUrls: null,
        type: null
    }
}

// 获取默认创建通知DTO
export function getDefaultNotificationAddDTO(): NotificationAddDTO {
    return {
        userId: null,
        title: null,
        content: null,
        attachmentUrls: null,
        type: null,
        senderId: null,
        senderName: null
    }
}

// 获取默认批量创建通知DTO
export function getDefaultNotificationBatchAddDTO(): NotificationBatchAddDTO {
    return {
        userIds: null,
        title: null,
        content: null,
        type: null,
        senderId: null,
        senderName: null
    }
}

// 获取默认按范围发送通知DTO
export function getDefaultNotificationScopeSendDTO(): NotificationScopeSendDTO {
    return {
        scopeType: null,
        roleKey: null,
        courseId: null,
        title: null,
        content: null,
        attachmentUrls: null,
        type: null,
        senderId: null,
        senderName: null
    }
}

// 获取通知列表（分页）
export function listNotification(params: NotificationPageQueryDTO) {
    return http.getTableData('/system/notification/list', params)
}

// 获取当前用户所有通知列表
export function listAllNotification() {
    return http.get('/system/notification/all')
}

// 根据ID获取通知详情
export function getNotificationById(id: string) {
    return http.get(`/system/notification/${id}`)
}

// 创建通知
export function addNotification(data: NotificationAddDTO) {
    return http.post('/system/notification/add', data)
}

// 批量创建通知
export function batchAddNotification(data: NotificationBatchAddDTO) {
    return http.post('/system/notification/batch-add', data)
}

// 更新通知
export function updateNotification(data: NotificationDTO) {
    return http.put('/system/notification', data)
}

// 删除通知
export function removeNotificationById(id: string) {
    return http.delete(`/system/notification/${id}`)
}

// 批量删除通知
export function removeNotificationByIds(ids: string[]) {
    return http.delete('/system/notification', {data: ids})
}

// 管理员撤回通知消息
export function removeNotificationMsg(id: string) {
    return http.delete(`/system/notification/msg/${id}`)
}

// 标记通知为已读
export function markNotificationAsRead(id: string) {
    return http.put(`/system/notification/${id}/read`)
}

// 批量标记通知为已读
export function batchMarkAsRead(ids: string[]) {
    return http.put('/system/notification/batch-read', ids)
}

// 标记当前用户所有通知为已读
export function readAllNotifications() {
    return http.put('/system/notification/read-all')
}

// 按范围发送通知
export function sendNotificationByScope(data: NotificationScopeSendDTO) {
    return http.post('/system/notification/send-by-scope', data)
}

// 获取当前用户未读通知数量
export function getUnreadNotificationCount() {
    return http.get('/system/notification/unread-count')
}
