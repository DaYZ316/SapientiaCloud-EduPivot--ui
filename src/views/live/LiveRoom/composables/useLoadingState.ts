import {computed, reactive} from 'vue'

export interface LoadingState {
    loading: boolean
    message: string | null
    progress: number | null
    startTime: number | null
}

export interface LoadingStateResult {
    states: Record<string, LoadingState>
    setLoading: (key: string, loading: boolean, message?: string | null, progress?: number | null) => void
    isLoading: (key: string) => boolean
    getLoadingMessage: (key: string) => string | null
    getLoadingProgress: (key: string) => number | null
    getLoadingTime: (key: string) => number | null
    hasAnyLoading: boolean
    getLoadingStates: () => string[]
    clearLoading: (key: string) => void
    clearAllLoading: () => void
}

export const useLoadingState = (): LoadingStateResult => {
    // 加载状态存储
    const states = reactive<Record<string, LoadingState>>({})

    // 设置加载状态
    const setLoading = (
        key: string,
        loading: boolean,
        message: string | null = null,
        progress: number | null = null
    ): void => {
        if (loading) {
            // 开始加载
            if (!states[key]) {
                states[key] = {
                    loading: false,
                    message: null,
                    progress: null,
                    startTime: null
                }
            }

            states[key].loading = true
            states[key].message = message
            states[key].progress = progress
            states[key].startTime = Date.now()
        } else {
            // 结束加载
            if (states[key]) {
                states[key].loading = false
                states[key].progress = null
                // 保留message一段时间以显示完成状态
                setTimeout(() => {
                    if (states[key] && !states[key].loading) {
                        states[key].message = null
                    }
                }, 2000)
            }
        }
    }

    // 检查是否正在加载
    const isLoading = (key: string): boolean => {
        return states[key]?.loading || false
    }

    // 获取加载消息
    const getLoadingMessage = (key: string): string | null => {
        return states[key]?.message || null
    }

    // 获取加载进度
    const getLoadingProgress = (key: string): number | null => {
        return states[key]?.progress || null
    }

    // 获取加载时间
    const getLoadingTime = (key: string): number | null => {
        const state = states[key]
        if (!state || !state.startTime || !state.loading) {
            return null
        }
        return Date.now() - state.startTime
    }

    // 检查是否有任何加载状态
    const hasAnyLoading = computed(() => {
        return Object.values(states).some(state => state.loading)
    })

    // 获取所有正在加载的状态key
    const getLoadingStates = (): string[] => {
        return Object.keys(states).filter(key => states[key].loading)
    }

    // 清除指定加载状态
    const clearLoading = (key: string): void => {
        if (states[key]) {
            states[key].loading = false
            states[key].message = null
            states[key].progress = null
            states[key].startTime = null
        }
    }

    // 清除所有加载状态
    const clearAllLoading = (): void => {
        Object.keys(states).forEach(key => {
            clearLoading(key)
        })
    }

    return {
        states,
        setLoading,
        isLoading,
        getLoadingMessage,
        getLoadingProgress,
        getLoadingTime,
        hasAnyLoading: hasAnyLoading.value,
        getLoadingStates,
        clearLoading,
        clearAllLoading
    }
}
