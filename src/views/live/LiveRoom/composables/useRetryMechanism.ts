import { ref } from 'vue'

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

    // 网络相关错误可以重试
    if (error.message?.includes('网络') ||
        error.message?.includes('timeout') ||
        error.message?.includes('连接') ||
        error.code === 'NETWORK_ERROR' ||
        error.code === 'TIMEOUT') {
      return true
    }

    // HTTP状态码判断
    if (error.status) {
      // 5xx服务器错误可以重试
      if (error.status >= 500) return true
      // 429 Too Many Requests 可以重试
      if (error.status === 429) return true
      // 408 Request Timeout 可以重试
      if (error.status === 408) return true
    }

    // WebRTC相关错误
    if (error.name === 'NetworkError' ||
        error.name === 'TimeoutError' ||
        error.message?.includes('ICE') ||
        error.message?.includes('connection')) {
      return true
    }

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