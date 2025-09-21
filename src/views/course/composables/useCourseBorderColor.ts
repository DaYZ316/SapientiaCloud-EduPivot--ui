import {computed} from 'vue'
import {CourseTypeEnum} from '@/enum/course/courseTypeEnum'

/**
 * 课程边框颜色计算 Composable
 * 根据课程类型返回对应的边框颜色
 */
export function useCourseBorderColor(courseType?: number) {
    /**
     * 根据课程类型计算边框颜色
     * @param courseType 课程类型
     * @returns 对应的CSS变量颜色
     */
    const getBorderColor = (courseType?: number) => {
        if (courseType === CourseTypeEnum.REQUIRED) {
            return 'var(--error-color)' // 红色
        } else if (courseType === CourseTypeEnum.ELECTIVE) {
            return 'var(--success-color)' // 绿色
        }
        return 'var(--primary-color)' // 默认主色调
    }

    /**
     * 响应式的边框颜色计算属性
     */
    const borderColor = computed(() => getBorderColor(courseType))

    return {
        borderColor,
        getBorderColor
    }
}
