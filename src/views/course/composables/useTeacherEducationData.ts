import {computed, readonly, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {EducationEnum, getEducationLabel} from '@/enum/teacher/educationEnum'
import {listAllTeacherByCourseId} from '@/api/course/courseTeacher'
import type {TeacherVO} from '@/types/teacher'

// 定义饼图数据项类型
export interface PieChartDataItem {
    /** 数值 */
    value: number
    /** 名称 */
    name: string
    /** 颜色（可选） */
    itemStyle?: {
        color?: string
    }
}

/**
 * 教师学历分布数据 composable
 * @param courseId 课程ID
 * @param externalData 外部数据源（可选）
 * @returns 教师学历分布相关数据和方法
 */
export function useTeacherEducationData(courseId?: string, externalData?: PieChartDataItem[]) {
    // 响应式数据
    const teachers = ref<TeacherVO[]>([])
    const isLoading = ref(false)

    // 国际化
    const {locale} = useI18n()

    // 计算教师学历分布数据
    const educationData = computed(() => {
        // 如果提供了外部数据，优先使用外部数据
        if (externalData && externalData.length > 0) {
            return externalData
        }

        // 如果没有教师数据，返回空数组
        if (teachers.value.length === 0) {
            return []
        }

        // 统计各学历人数
        const educationCount = {
            [EducationEnum.COLLEGE]: 0,
            [EducationEnum.BACHELOR]: 0,
            [EducationEnum.MASTER]: 0,
            [EducationEnum.DOCTOR]: 0
        }

        teachers.value.forEach(teacher => {
            if (teacher.education !== null && teacher.education !== undefined) {
                educationCount[teacher.education as EducationEnum]++
            }
        })

        // 转换为图表数据格式
        const result: PieChartDataItem[] = []
        Object.entries(educationCount).forEach(([education, count]) => {
            if (count > 0) {
                result.push({
                    value: count,
                    name: getEducationLabel(parseInt(education) as EducationEnum, locale.value === 'en-US')
                })
            }
        })

        return result
    })

    // 判断是否有数据
    const hasData = computed(() => {
        return educationData.value.length > 0
    })

    // 获取教师总数
    const totalTeachers = computed(() => {
        return teachers.value.length
    })

    // 获取各学历统计信息
    const educationStats = computed(() => {
        const stats = {
            [EducationEnum.COLLEGE]: {count: 0, percentage: 0},
            [EducationEnum.BACHELOR]: {count: 0, percentage: 0},
            [EducationEnum.MASTER]: {count: 0, percentage: 0},
            [EducationEnum.DOCTOR]: {count: 0, percentage: 0}
        }

        const total = teachers.value.length
        if (total === 0) return stats

        teachers.value.forEach(teacher => {
            if (teacher.education !== null && teacher.education !== undefined) {
                stats[teacher.education as EducationEnum].count++
            }
        })

        // 计算百分比
        Object.keys(stats).forEach(education => {
            const educationKey = parseInt(education) as EducationEnum
            stats[educationKey].percentage = total > 0 ? (stats[educationKey].count / total) * 100 : 0
        })

        return stats
    })

    // 加载教师数据
    const loadTeachers = async (targetCourseId?: string) => {
        const id = targetCourseId || courseId
        if (!id) return

        isLoading.value = true
        const response = await listAllTeacherByCourseId(id)
        teachers.value = response.data || []
        isLoading.value = false
    }

    // 刷新数据
    const refresh = () => {
        loadTeachers()
    }

    // 清空数据
    const clear = () => {
        teachers.value = []
    }

    // 监听课程ID变化
    if (courseId) {
        watch(() => courseId, (newCourseId) => {
            if (newCourseId) {
                loadTeachers(newCourseId)
            }
        }, {immediate: true})
    }

    return {
        // 数据
        teachers: readonly(teachers),
        educationData,
        hasData,
        totalTeachers,
        educationStats,
        isLoading: readonly(isLoading),

        // 方法
        loadTeachers,
        refresh,
        clear
    }
}
