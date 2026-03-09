import http from '@/utils/http'
import type {ChatSessionQueryDTO, ChatSessionVO, CreateSessionDTO} from '@/types/celestialHub/chatSession'

/**
 * 获取默认会话查询DTO
 */
export function getDefaultChatSessionQueryDTO(): ChatSessionQueryDTO {
    return {
        sysUserId: null,
        sessionTitle: null,
        sessionType: null,
        isPinned: null,
        isFavorite: null,
        startTime: null,
        endTime: null,
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'update_time',
        isAsc: 'desc',
        reasonable: null
    }
}

/**
 * 获取默认创建会话DTO
 */
export function getDefaultCreateSessionDTO(): CreateSessionDTO {
    return {
        courseId: null,
        sessionType: null,
        title: null
    }
}

/**
 * 创建一个新的AI对话会话
 * @param params 查询参数
 */
export function addChatSession(params: CreateSessionDTO) {
    return http.post<ChatSessionVO>('/celestial-hub/session', null, {params})
}

/**
 * 根据会话ID列表批量删除会话
 * @param ids 会话ID数组
 */
export function removeChatSessionByIds(ids: string[]) {
    return http.delete<number>('/celestial-hub/session', {data: ids})
}

/**
 * 通过会话的唯一ID获取其详细信息
 * @param id 会话ID
 */
export function getChatSessionById(id: string) {
    return http.get<ChatSessionVO>(`/celestial-hub/session/${id}`)
}

/**
 * 通过会话的唯一ID删除会话
 * @param id 会话ID
 */
export function removeChatSessionById(id: string) {
    return http.delete<boolean>(`/celestial-hub/session/${id}`)
}

/**
 * 将指定会话归档
 * @param id 会话ID
 */
export function archiveSession(id: string) {
    return http.put<boolean>(`/celestial-hub/session/${id}/archive`)
}

/**
 * 收藏或取消收藏会话
 * @param id 会话ID
 * @param isFavorite 是否收藏
 */
export function favoriteSession(id: string, isFavorite: boolean) {
    return http.put<boolean>(`/celestial-hub/session/${id}/favorite`, null, {
        params: {isFavorite}
    })
}

/**
 * 置顶或取消置顶会话
 * @param id 会话ID
 * @param isPinned 是否置顶
 */
export function pinSession(id: string, isPinned: boolean) {
    return http.put<boolean>(`/celestial-hub/session/${id}/pin`, null, {
        params: {isPinned}
    })
}

/**
 * 修改会话的标题
 * @param id 会话ID
 * @param title 新标题
 */
export function updateChatSessionTitle(id: string, title: string) {
    return http.put<boolean>(`/celestial-hub/session/${id}/title`, null, {
        params: {title}
    })
}

/**
 * 根据传入的条件分页查询AI对话会话信息
 * @param params 查询参数
 */
export function listChatSession(params: ChatSessionQueryDTO) {
    return http.getTableData<ChatSessionVO>('/celestial-hub/session/list', params)
}

/**
 * 获取当前用户的对话会话列表
 */
export function getUserSessions() {
    return http.get<ChatSessionVO[]>('/celestial-hub/session/my')
}

/**
 * 根据用户ID获取该用户的所有会话列表
 * @param sysUserId 用户ID
 */
export function listAllChatSessionByUserId(sysUserId: string) {
    return http.get<ChatSessionVO[]>(`/celestial-hub/session/user/${sysUserId}`)
}

