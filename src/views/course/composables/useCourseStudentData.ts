import {isRef, ref, type Ref, watch} from 'vue'
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
export function useCourseStudentData(courseId?: string | Ref<string | null>) {
    // 响应式数据
    const students = ref<CourseStudentVO[]>([])
    const isLoading = ref(false)
    const error = ref<string | null>(null)

    /**
     * 加载学生数据
     * @param id 课程ID，如果不传则使用传入的courseId
     */
    const resolveCourseId = (id?: string | Ref<string | null>) => {
        if (isRef(id)) return id.value || null
        return id || null
    }

    const loadStudents = async (id?: string | Ref<string | null>) => {
        const targetCourseId = resolveCourseId(id) || resolveCourseId(courseId)
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
        cache.isLoading = false
        cache.promise = null
        isLoading.value = false
    }

    /**
     * 重置数据
     */
    const resetData = () => {
        students.value = []
        isLoading.value = false
        error.value = null
        // 清除全局缓存
        const key = resolveCourseId(courseId)
        if (key) {
            globalCache.delete(key)
        }
    }

    /**
     * 刷新数据
     */
    const refreshData = () => {
        const key = resolveCourseId(courseId)
        if (key) {
            // 清除缓存并重新加载
            globalCache.delete(key)
            loadStudents(key)
        }
    }

    /**
     * 清除指定课程的缓存
     */
    const clearCache = (id?: string) => {
        const targetCourseId = resolveCourseId(id) || resolveCourseId(courseId)
        if (targetCourseId) {
            globalCache.delete(targetCourseId)
        }
    }

    // 监听课程ID变化（支持传入 string 或 Ref<string|null>）
    if (courseId) {
        if (isRef(courseId)) {
            watch(() => courseId.value, (newCourseId) => {
                if (newCourseId) {
                    loadStudents(newCourseId)
                } else {
                    resetData()
                }
            }, {immediate: true})
        } else {
            watch(() => courseId, (newCourseId) => {
                if (newCourseId) {
                    loadStudents(newCourseId)
                } else {
                    resetData()
                }
            }, {immediate: true})
        }
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
