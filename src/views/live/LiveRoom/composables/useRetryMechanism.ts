import {ref} from 'vue'

export interface RetryOptions {
    maxRetries?: number
    baseDelay?: number
    maxDelay?: number
    backoffFactor?: number
    retryCondition?: (error: any, attempt: number) => boolean
    onRetry?: (error: any, attempt: number) => void
}

export interface RetryMechanismResult {
    retry: <T>(operation: () => Promise<T>, options?: RetryOptions) => Promise<T>
    isRetryableError: (error: any) => boolean
    getRetryStats: () => RetryStats
}

export interface RetryStats {
    totalRetries: number
    successfulRetries: number
    failedRetries: number
    averageRetryDelay: number
}

export const useRetryMechanism = (): RetryMechanismResult => {
    // 重试统计
    const retryStats = ref({
        totalRetries: 0,
        successfulRetries: 0,
        failedRetries: 0,
        totalDelayTime: 0,
        retryCount: 0
    })


    // 判断错误是否可以重试
    const isRetryableError = (error: any): boolean => {
        if (!error) return false

        // 安全地提取错误信息，避免DataCloneError
        let errorName = 'Error'
        let errorMessage = ''
        let errorCode: string | undefined

        try {
            // 只访问基本类型属性，避免DOM引用
            if (typeof error?.name === 'string') errorName = error.name
            if (typeof error?.message === 'string') errorMessage = error.message
            if (typeof error?.code === 'string') errorCode = error.code
        } catch {
            // 如果访问失败，使用默认值
        }

        // ✅ 关键：AudioContext权限错误不应该触发连接重试
        if (errorMessage.includes('AudioContext was not allowed') ||
            errorMessage.includes('NotAllowedError') ||
            errorMessage.includes('autoplay') ||
            errorName === 'NotAllowedError') {
            return false
        }

        const normalizedMessage = errorMessage.toLowerCase()

        // 网络相关错误可以重试
        if (normalizedMessage.includes('network') ||
            normalizedMessage.includes('timeout') ||
            normalizedMessage.includes('timed out') ||
            normalizedMessage.includes('connection') ||
            normalizedMessage.includes('connect') ||
            normalizedMessage.includes('websocket') ||
            errorCode === 'NETWORK_ERROR' ||
            errorCode === 'TIMEOUT') {
            return true
        }

        // HTTP状态码判断（直接使用原始error，因为status是基本类型）
        try {
            if (error?.status) {
                // 5xx服务器错误可以重试
                if (error.status >= 500) return true
                // 429 Too Many Requests 可以重试
                if (error.status === 429) return true
                // 408 Request Timeout 可以重试
                if (error.status === 408) return true
            }
        } catch {
            // 如果status访问失败，跳过
        }

        // WebRTC相关错误
        if (errorName === 'NetworkError' ||
            errorName === 'TimeoutError' ||
            errorMessage.includes('ICE') ||
            errorMessage.includes('connection')) {
            return true
        }

        // 默认情况下，对于媒体错误，我们认为它们通常是不可重试的
        // 因为通常涉及权限、设备不存在等问题
        return false
    }

    // 核心重试逻辑
    const retry = async <T>(
        operation: () => Promise<T>,
        options: RetryOptions = {}
    ): Promise<T> => {
        const {
            maxRetries = 3,
            baseDelay = 1000,
            maxDelay = 30000,
            backoffFactor = 2,
            retryCondition = isRetryableError,
            onRetry
        } = options

        let lastError: any = null
        const delays: number[] = []

        // 初始尝试 + 重试次数
        for (let attempt = 0; attempt <= maxRetries; attempt++) {
            try {
                const result = await operation()

                // 成功时更新统计
                if (attempt > 0) {
                    retryStats.value.successfulRetries++
                    retryStats.value.totalDelayTime += delays.reduce((sum, delay) => sum + delay, 0)
                    retryStats.value.retryCount += attempt
                }

                return result

            } catch (error) {
                lastError = error

                // 如果是最后一次尝试，抛出错误
                if (attempt === maxRetries) {
                    retryStats.value.failedRetries++
                    break
                }

                // 检查是否应该重试
                if (!retryCondition(error, attempt)) {
                    break
                }

                // 计算延迟时间（指数退避 + 抖动）
                const exponentialDelay = Math.min(baseDelay * Math.pow(backoffFactor, attempt), maxDelay)
                const jitter = Math.random() * 0.1 * exponentialDelay // 10%抖动
                const delay = exponentialDelay + jitter

                delays.push(delay)
                retryStats.value.totalRetries++

                // 重试回调
                if (onRetry) {
                    onRetry(error, attempt + 1)
                }

                // 等待延迟
                await new Promise(resolve => setTimeout(resolve, delay))
            }
        }

        throw lastError
    }

    // 获取重试统计信息
    const getRetryStats = (): RetryStats => {
        const stats = retryStats.value
        const averageRetryDelay = stats.retryCount > 0
            ? stats.totalDelayTime / stats.retryCount
            : 0

        return {
            totalRetries: stats.totalRetries,
            successfulRetries: stats.successfulRetries,
            failedRetries: stats.failedRetries,
            averageRetryDelay
        }
    }

    return {
        retry,
        isRetryableError,
        getRetryStats
    }
}
