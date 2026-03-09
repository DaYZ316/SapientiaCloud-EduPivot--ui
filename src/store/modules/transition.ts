import {defineStore} from 'pinia'
import {ref} from 'vue'

/**
 * 过渡动画状态管理
 */
export const useTransitionStore = defineStore('transition', () => {
    const showTransition = ref<boolean>(false)
    const showTime = ref<number>(0)

    /**
     * 显示过渡动画
     */
    const show = (): void => {
        showTransition.value = true
        showTime.value = Date.now()
    }

    /**
     * 隐藏过渡动画
     * @param minDuration 最小持续时间（毫秒），默认2000ms
     */
    const hide = (minDuration: number = 2000): void => {
        const elapsed = Date.now() - showTime.value
        const remaining = Math.max(0, minDuration - elapsed)

        if (remaining > 0) {
            setTimeout(() => {
                showTransition.value = false
            }, remaining)
        } else {
            showTransition.value = false
        }
    }

    return {
        showTransition,
        show,
        hide
    }
})
