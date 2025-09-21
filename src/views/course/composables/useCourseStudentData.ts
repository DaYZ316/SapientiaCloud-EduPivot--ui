import {ref, watch} from 'vue'
import {listAllCourseStudentByCourseId} from '@/api/course/courseStudent'
import type {CourseStudentVO} from '@/types/course/courseStudent'

// 全局数据缓存
interface CourseStudentCache {
    data: CourseStudentVO[]
    isLoading: boolean
    error: string | null
    promise: Promise<void> | null
}

const globalCache = new Map<string, CourseStudentCache>()

/**
 * 课程学生数据管理 Composable
 * 提供统一的课程学生数据获取、加载状态管理和错误处理
 * 使用全局缓存避免重复请求
 */
export function useCourseStudentData(courseId?: string) {
    // 响应式数据
    const students = ref<CourseStudentVO[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    /**
     * 加载学生数据
     * @param id 课程ID，如果不传则使用传入的courseId
     */
    const loadStudents = async (id?: string) => {
        const targetCourseId = id || courseId
        if (!targetCourseId) {
            return
        }

        // 检查全局缓存
        let cache = globalCache.get(targetCourseId)

        if (!cache) {
            // 创建新的缓存项
            cache = {
                data: [],
                isLoading: false,
                error: null,
                promise: null
            }
            globalCache.set(targetCourseId, cache)
        }

        // 如果正在加载中，等待现有的请求完成
        if (cache.promise) {
            await cache.promise
            // 更新本地响应式数据
            students.value = cache.data
            isLoading.value = cache.isLoading
            error.value = cache.error
            return
        }

        // 如果数据已存在且没有错误，直接使用缓存
        if (cache.data.length > 0 && !cache.error) {
            students.value = cache.data
            isLoading.value = false
            error.value = null
            return
        }

        // 开始新的请求
        try {
            cache.isLoading = true
            cache.error = null
            isLoading.value = true
            error.value = null

            // 创建请求Promise并缓存
            cache.promise = (async () => {
                const response = await listAllCourseStudentByCourseId(targetCourseId)
                cache!.data = response.data || []
                cache!.error = null
            })()

            await cache.promise

            // 更新本地响应式数据
            students.value = cache.data
            error.value = null
        } catch (err) {
            cache.error = '加载学生数据失败'
            cache.data = []
            error.value = '加载学生数据失败'
            students.value = []
        } finally {
            cache.isLoading = false
            cache.promise = null
            isLoading.value = false
        }
    }

    /**
     * 重置数据
     */
    const resetData = () => {
        students.value = []
        isLoading.value = false
        error.value = null
        // 清除全局缓存
        if (courseId) {
            globalCache.delete(courseId)
        }
    }

    /**
     * 刷新数据
     */
    const refreshData = () => {
        if (courseId) {
            // 清除缓存并重新加载
            globalCache.delete(courseId)
            loadStudents()
        }
    }

    /**
     * 清除指定课程的缓存
     */
    const clearCache = (id?: string) => {
        const targetCourseId = id || courseId
        if (targetCourseId) {
            globalCache.delete(targetCourseId)
        }
    }

    // 监听课程ID变化
    if (courseId) {
        watch(() => courseId, (newCourseId) => {
            if (newCourseId) {
                loadStudents(newCourseId)
            } else {
                resetData()
            }
        }, {immediate: true})
    }

    return {
        // 数据
        students,
        isLoading,
        error,

        // 方法
        loadStudents,
        resetData,
        refreshData,
        clearCache
    }
}
