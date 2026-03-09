import {defineStore} from 'pinia'
import {computed, ref} from 'vue'
import type {CourseVO} from '@/types/course'
import {CoursePublicEnum} from '@/enum/course'
import * as CourseApi from '@/api/course/course'

// 用于本地存储的键名
const CURRENT_COURSE_ID_KEY = 'currentCourseId'

/**
 * 课程状态管理
 */
export const useCourseStore = defineStore('course', () => {
    // 状态
    const currentCourseId = ref<string | null>(localStorage.getItem(CURRENT_COURSE_ID_KEY))
    const currentCourseInfo = ref<CourseVO | null>(null)

    // 计算属性
    /**
     * 当前课程是否公开
     */
    const isCurrentCoursePublic = computed<boolean>(() => {
        return currentCourseInfo.value?.isPublic === CoursePublicEnum.PUBLIC
    })

    /**
     * 设置当前课程ID并更新课程信息
     * @param courseId 课程ID，如果为null则清空当前课程信息
     * @param forceRefresh 是否强制刷新，即使课程ID相同
     */
    const setCurrentCourseId = async (courseId: string | null, forceRefresh: boolean = false): Promise<void> => {
        // 如果课程ID没有变化且不是强制刷新，跳过
        if (!forceRefresh && currentCourseId.value === courseId && currentCourseInfo.value !== null) {
            return
        }

        currentCourseId.value = courseId
        if (courseId) {
            localStorage.setItem(CURRENT_COURSE_ID_KEY, courseId)
            // 通过API获取课程信息
            await refreshCourseInfo(courseId)
        } else {
            localStorage.removeItem(CURRENT_COURSE_ID_KEY)
            currentCourseInfo.value = null
        }
    }

    /**
     * 刷新课程信息
     * @param courseId 课程ID，如果不传则使用当前课程ID
     */
    const refreshCourseInfo = async (courseId?: string | null): Promise<void> => {
        const targetCourseId = courseId || currentCourseId.value
        if (!targetCourseId) {
            currentCourseInfo.value = null
            return
        }

        const res = await CourseApi.getCourseById(targetCourseId)
        if (res.success && res.data) {
            currentCourseInfo.value = res.data
        } else {
            currentCourseInfo.value = null
        }
    }

    /**
     * 重置课程状态
     */
    const resetCourseState = (): void => {
        currentCourseId.value = null
        currentCourseInfo.value = null
        localStorage.removeItem(CURRENT_COURSE_ID_KEY)
    }

    /**
     * 检查课程是否公开
     * @param courseInfo 课程信息，如果不传则使用当前课程信息
     * @returns 是否公开
     */
    const isCoursePublic = (courseInfo?: CourseVO | null): boolean => {
        const targetCourseInfo = courseInfo || currentCourseInfo.value
        return targetCourseInfo?.isPublic === CoursePublicEnum.PUBLIC
    }

    return {
        // 状态
        currentCourseId,
        currentCourseInfo,

        // 计算属性
        isCurrentCoursePublic,

        // 方法
        setCurrentCourseId,
        refreshCourseInfo,
        resetCourseState,
        isCoursePublic
    }
})

