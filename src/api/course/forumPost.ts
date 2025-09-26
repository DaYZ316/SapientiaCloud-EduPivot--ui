import http from '@/utils/http'
import type {ForumPostDTO, ForumPostQueryParams, ForumPostVO} from '@/types/course'
import type {TableDataResult} from '@/types/common/baseEntity'

// 获取默认论坛帖子查询对象
export function getDefaultForumPostQuery(): ForumPostQueryParams {
    return {
        forumId: null,
        courseId: null,
        userId: null,
        title: null,
        postType: null,
        status: null,
        tags: null,
        isEssence: null,
        isTop: null,
        startTime: null,
        endTime: null,
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'create_time',
        isAsc: 'desc',
        reasonable: null
    }
}

// 获取默认论坛帖子添加DTO
export function getDefaultForumPostDTO(): ForumPostDTO {
    return {
        id: null,
        forumId: null,
        userId: null,
        title: null,
        content: null,
        postType: null,
        isAnonymous: null,
        attachmentUrls: null,
        tags: null,
        status: null
    }
}

/**
 * 发布新帖子
 * @param postData 论坛帖子数据传输对象
 * @returns 添加结果
 */
export function addForumPost(postData: ForumPostDTO) {
    return http.post<ForumPostVO>('/course/post', postData)
}

/**
 * 更新论坛帖子
 * @param postData 论坛帖子数据传输对象
 * @returns 更新结果
 */
export function updateForumPost(postData: ForumPostDTO) {
    return http.put('/course/post', postData)
}

/**
 * 批量删除论坛帖子
 * @param postIds 帖子ID列表
 * @returns 删除结果
 */
export function removeForumPostByIds(postIds: string[]) {
    return http.delete('/course/post/', {data: postIds})
}

/**
 * 根据ID获取论坛帖子
 * @param id 帖子ID
 * @returns 帖子信息
 */
export function getForumPostById(id: string) {
    return http.get<ForumPostVO>(`/course/post/${id}`)
}

/**
 * 删除论坛帖子
 * @param id 帖子ID
 * @returns 删除结果
 */
export function removeForumPostById(id: string) {
    return http.delete(`/course/post/${id}`)
}

/**
 * 设置帖子精华
 * @param postId 帖子ID
 * @param isEssence 是否精华
 * @returns 设置结果
 */
export function setPostEssence(postId: string, isEssence: boolean) {
    return http.put(`/course/post/${postId}/essence`, {isEssence})
}

/**
 * 点赞帖子
 * @param postId 帖子ID
 * @returns 点赞结果
 */
export function likePost(postId: string) {
    return http.post(`/course/post/${postId}/like`)
}

/**
 * 取消点赞帖子
 * @param postId 帖子ID
 * @returns 取消点赞结果
 */
export function unlikePost(postId: string) {
    return http.delete(`/course/post/${postId}/like`)
}

/**
 * 锁定/解锁帖子
 * @param postId 帖子ID
 * @param isLocked 是否锁定
 * @returns 设置结果
 */
export function setPostLock(postId: string, isLocked: boolean) {
    return http.put(`/course/post/${postId}/lock`, {isLocked})
}

/**
 * 分享帖子
 * @param postId 帖子ID
 * @returns 分享结果
 */
export function sharePost(postId: string) {
    return http.post(`/course/post/${postId}/share`)
}

/**
 * 更新帖子状态
 * @param postId 帖子ID
 * @param status 帖子状态
 * @returns 更新结果
 */
export function updatePostStatus(postId: string, status: number) {
    return http.put(`/course/post/${postId}/status`, {status})
}

/**
 * 置顶/取消置顶帖子
 * @param postId 帖子ID
 * @param isTop 是否置顶
 * @returns 设置结果
 */
export function setPostTop(postId: string, isTop: boolean) {
    return http.put(`/course/post/${postId}/top`, {isTop})
}

/**
 * 浏览帖子
 * @param postId 帖子ID
 * @returns 浏览结果
 */
export function viewPost(postId: string) {
    return http.post(`/course/post/${postId}/view`)
}

/**
 * 根据课程ID获取帖子列表
 * @param courseId 课程ID
 * @param params 查询参数
 * @returns 帖子列表
 */
export function listForumPostByCourseId(courseId: string, params?: ForumPostQueryParams) {
    return http.get<TableDataResult<ForumPostVO>>(`/course/post/course/${courseId}`, params)
}

/**
 * 根据论坛ID获取帖子列表
 * @param forumId 论坛ID
 * @param params 查询参数
 * @returns 帖子列表
 */
export function listForumPostByForumId(forumId: string, params?: ForumPostQueryParams) {
    return http.get<TableDataResult<ForumPostVO>>(`/course/post/forum/${forumId}`, params)
}

/**
 * 获取热门帖子
 * @param params 查询参数
 * @returns 热门帖子列表
 */
export function getHotPosts(params?: ForumPostQueryParams) {
    return http.get<ForumPostVO[]>('/course/post/hot', params)
}

/**
 * 获取最新帖子
 * @param params 查询参数
 * @returns 最新帖子列表
 */
export function getLatestPosts(params?: ForumPostQueryParams) {
    return http.get<ForumPostVO[]>('/course/post/latest', params)
}

/**
 * 分页查找论坛帖子
 * @param params 查询参数
 * @returns 分页帖子列表
 */
export function listForumPost(params: ForumPostQueryParams) {
    return http.get<TableDataResult<ForumPostVO>>('/course/post/list', params)
}
