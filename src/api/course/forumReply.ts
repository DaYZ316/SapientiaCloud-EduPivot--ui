import http from '@/utils/http'
import type {ForumReplyDTO, ForumReplyQueryParams, ForumReplyVO} from '@/types/course'
import type {TableDataResult} from '@/types/common/baseEntity'

// 获取默认论坛回复查询对象
export function getDefaultForumReplyQuery(): ForumReplyQueryParams {
    return {
        postId: null,
        forumId: null,
        courseId: null,
        userId: null,
        parentReplyId: null,
        status: null,
        isAccepted: null,
        startTime: null,
        endTime: null,
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'create_time',
        isAsc: 'asc',
        reasonable: null
    }
}

// 获取默认论坛回复添加DTO
export function getDefaultForumReplyDTO(): ForumReplyDTO {
    return {
        id: null,
        postId: null,
        userId: null,
        parentReplyId: null,
        content: null,
        isAnonymous: null,
        attachmentUrls: null,
        status: null
    }
}

/**
 * 添加论坛回复
 * @param replyData 论坛回复数据传输对象
 * @returns 添加结果
 */
export function addForumReply(replyData: ForumReplyDTO) {
    return http.post<ForumReplyVO>('/course/forum/reply', replyData)
}

/**
 * 更新论坛回复
 * @param replyData 论坛回复数据传输对象
 * @returns 更新结果
 */
export function updateForumReply(replyData: ForumReplyDTO) {
    return http.put('/course/forum/reply', replyData)
}

/**
 * 批量删除论坛回复
 * @param replyIds 回复ID列表
 * @returns 删除结果
 */
export function removeForumReplyByIds(replyIds: string[]) {
    return http.delete('/course/forum/reply/', {data: replyIds})
}

/**
 * 根据ID获取论坛回复
 * @param id 回复ID
 * @returns 回复信息
 */
export function getForumReplyById(id: string) {
    return http.get<ForumReplyVO>(`/course/forum/reply/${id}`)
}

/**
 * 删除论坛回复
 * @param id 回复ID
 * @returns 删除结果
 */
export function removeForumReplyById(id: string) {
    return http.delete(`/course/forum/reply/${id}`)
}

/**
 * 采纳回复（问答区专用）
 * @param replyId 回复ID
 * @returns 采纳结果
 */
export function acceptReply(replyId: string) {
    return http.put(`/course/forum/reply/${replyId}/accept`)
}

/**
 * 取消采纳回复
 * @param replyId 回复ID
 * @returns 取消采纳结果
 */
export function unacceptReply(replyId: string) {
    return http.put(`/course/forum/reply/${replyId}/unaccept`)
}

/**
 * 点赞回复
 * @param replyId 回复ID
 * @returns 点赞结果
 */
export function likeReply(replyId: string) {
    return http.post(`/course/forum/reply/${replyId}/like`)
}

/**
 * 取消点赞回复
 * @param replyId 回复ID
 * @returns 取消点赞结果
 */
export function unlikeReply(replyId: string) {
    return http.delete(`/course/forum/reply/${replyId}/like`)
}

/**
 * 获取回复统计信息
 * @param replyId 回复ID
 * @returns 统计信息
 */
export function getReplyStatistics(replyId: string) {
    return http.get(`/course/forum/reply/${replyId}/statistics`)
}

/**
 * 更新回复状态
 * @param replyId 回复ID
 * @param status 回复状态
 * @returns 更新结果
 */
export function updateReplyStatus(replyId: string, status: number) {
    return http.put(`/course/forum/reply/${replyId}/status`, {status})
}

/**
 * 获取回复树形结构
 * @param postId 帖子ID
 * @returns 回复树
 */
export function getReplyTree(postId: string) {
    return http.get<ForumReplyVO[]>(`/course/forum/post/${postId}/replies/tree`)
}

/**
 * 根据课程ID获取回复列表
 * @param courseId 课程ID
 * @param params 查询参数
 * @returns 回复列表
 */
export function listForumReplyByCourseId(courseId: string, params?: ForumReplyQueryParams) {
    return http.get<TableDataResult<ForumReplyVO>>(`/course/${courseId}/replies`, params)
}

/**
 * 根据论坛ID获取回复列表
 * @param forumId 论坛ID
 * @param params 查询参数
 * @returns 回复列表
 */
export function listForumReplyByForumId(forumId: string, params?: ForumReplyQueryParams) {
    return http.get<TableDataResult<ForumReplyVO>>(`/course/forum/${forumId}/replies`, params)
}

/**
 * 分页查找论坛回复
 * @param params 查询参数
 * @returns 分页回复列表
 */
export function listForumReply(params: ForumReplyQueryParams) {
    return http.get<TableDataResult<ForumReplyVO>>('/course/forum/reply/list', params)
}

/**
 * 根据帖子ID获取回复列表
 * @param postId 帖子ID
 * @param params 查询参数
 * @returns 回复列表
 */
export function listForumReplyByPostId(postId: string, params?: ForumReplyQueryParams) {
    return http.get<TableDataResult<ForumReplyVO>>(`/course/forum/post/${postId}/replies`, params)
}
