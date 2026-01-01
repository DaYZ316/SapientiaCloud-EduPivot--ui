import { ref, reactive, readonly, computed } from 'vue'
import { getGlobalApis } from '@/utils/naiveUIHelper'

// 防重入和节流：避免errorHandler递归调用
let handling = false
let lastErrorKey = ''
let lastErrorTime = 0

// 通知去重：避免无限push通知
const shownNotifications = new Map<string, number>()

export interface ErrorInfo {
  code: string
  title: string
  message: string
  type: 'network' | 'business' | 'system' | 'user' | 'unknown'
  timestamp: number
  context?: string
  retryable: boolean
}

export interface ErrorHandlerResult {
  errors: ErrorInfo[]
  handleError: (error: any, context: string, options?: ErrorHandlerOptions) => void
  clearError: (code: string) => void
  clearAllErrors: () => void
  hasErrors: boolean
  getLastError: () => ErrorInfo | null
}

export interface ErrorHandlerOptions {
  showNotification?: boolean
  showDialog?: boolean
  allowRetry?: boolean
  onRetry?: () => void
  customMessage?: string
}

export const useErrorHandler = (): ErrorHandlerResult => {
  const { message, notification, dialog } = getGlobalApis()

  // 错误历史记录
  const errors = ref<ErrorInfo[]>([])

  // 错误统计
  const errorStats = reactive({
    networkErrors: 0,
    businessErrors: 0,
    systemErrors: 0,
    userErrors: 0,
    totalErrors: 0
  })

  // 错误分类和处理策略
  const parseError = (error: any, context: string): ErrorInfo => {
    let errorInfo: ErrorInfo = {
      code: 'unknown_error',
      title: '操作失败',
      message: '发生了未知错误，请稍后重试',
      type: 'unknown',
      timestamp: Date.now(),
      context,
      retryable: true
    }

    // 网络错误检测
    if (!navigator.onLine) {
      errorInfo = {
        code: 'network_offline',
        title: '网络连接错误',
        message: '请检查网络连接后重试',
        type: 'network',
        timestamp: Date.now(),
        context,
        retryable: true
      }
    }
    // HTTP状态码错误
    else if (error?.status) {
      const status = error.status
      if (status === 401 || status === 403) {
        errorInfo = {
          code: 'auth_error',
          title: '权限不足',
          message: '您没有执行此操作的权限',
          type: 'business',
          timestamp: Date.now(),
          context,
          retryable: false
        }
      } else if (status === 404) {
        errorInfo = {
          code: 'not_found',
          title: '资源不存在',
          message: '请求的资源不存在',
          type: 'business',
          timestamp: Date.now(),
          context,
          retryable: false
        }
      } else if (status >= 500) {
        errorInfo = {
          code: 'server_error',
          title: '服务器错误',
          message: '服务器暂时不可用，请稍后重试',
          type: 'system',
          timestamp: Date.now(),
          context,
          retryable: true
        }
      }
    }
    // 超时错误
    else if (error?.message?.includes('timeout') || error?.code === 'TIMEOUT') {
      errorInfo = {
        code: 'timeout_error',
        title: '请求超时',
        message: '网络请求超时，请检查网络连接',
        type: 'network',
        timestamp: Date.now(),
        context,
        retryable: true
      }
    }
    // WebRTC相关错误
    else if (error?.name === 'NotAllowedError') {
      errorInfo = {
        code: 'media_permission_denied',
        title: '权限被拒绝',
        message: '摄像头或麦克风权限被拒绝，请在浏览器设置中允许',
        type: 'user',
        timestamp: Date.now(),
        context,
        retryable: false
      }
    }
    else if (error?.name === 'NotFoundError') {
      errorInfo = {
        code: 'media_device_not_found',
        title: '设备未找到',
        message: '未找到摄像头或麦克风设备',
        type: 'system',
        timestamp: Date.now(),
        context,
        retryable: false
      }
    }
    // 直播相关错误
    else if (error?.message?.includes('room') || context.includes('live')) {
      errorInfo = {
        code: 'live_error',
        title: '直播错误',
        message: error?.message || '直播功能暂时不可用',
        type: 'business',
        timestamp: Date.now(),
        context,
        retryable: true
      }
    }
    // 通用错误处理
    else if (error?.message) {
      errorInfo.message = error.message
      errorInfo.retryable = !error.message.includes('权限') && !error.message.includes('不存在')
    }

    return errorInfo
  }

  // 处理错误并显示用户反馈
  const handleError = (error: any, context: string, options: ErrorHandlerOptions = {}): void => {
    const {
      showNotification = true,
      showDialog = false,
      allowRetry = false,
      onRetry,
      customMessage
    } = options

    // 防重入：避免递归调用
    if (handling) {
      console.warn('[ErrorHandler] 递归调用被阻止', error)
      return
    }

    // 节流：相同错误1秒内只处理一次
    const errorKey = `${context}|${String(error)}`
    const now = Date.now()
    if (errorKey === lastErrorKey && now - lastErrorTime < 1000) {
      return
    }
    lastErrorKey = errorKey
    lastErrorTime = now

    handling = true

    try {
      // 解析错误信息
      const errorInfo = parseError(error, context)

      // 使用自定义消息覆盖默认消息
      if (customMessage) {
        errorInfo.message = customMessage
      }

      // 记录错误
      errors.value.push(errorInfo)

      // 限制错误历史长度
      if (errors.value.length > 50) {
        errors.value = errors.value.slice(-50)
      }

      // 更新错误统计
      errorStats.totalErrors++
      errorStats[`${errorInfo.type}Errors`]++

      // 显示用户反馈
      if (showDialog && !errorInfo.retryable) {
        // 严重错误显示对话框
        dialog.error({
          title: errorInfo.title,
          content: errorInfo.message,
          positiveText: '确定'
        })
      } else if (showNotification) {
        // 显示通知 - 带去重
        showNotificationOnce(errorInfo, allowRetry && errorInfo.retryable && onRetry ? onRetry : null)
      } else {
        // 轻量提示
        message.error(errorInfo.message)
      }

      // 上报错误到监控系统（可扩展）
      reportError(errorInfo)
    } finally {
      handling = false
    }
  }

  // 清除指定错误
  const clearError = (code: string): void => {
    const index = errors.value.findIndex(err => err.code === code)
    if (index >= 0) {
      errors.value.splice(index, 1)
    }
  }

  // 清除所有错误
  const clearAllErrors = (): void => {
    errors.value = []
  }

  // 显示通知（带去重，避免无限push）
  const showNotificationOnce = (errorInfo: ErrorInfo, onRetry: (() => void) | null): void => {
    const notificationKey = `${errorInfo.title}|${errorInfo.message}`
    const now = Date.now()
    const lastShown = shownNotifications.get(notificationKey) ?? 0

    // 相同通知2秒内只显示一次
    if (now - lastShown < 2000) {
      return
    }

    shownNotifications.set(notificationKey, now)

    // 显示通知
    const notificationOptions: any = {
      title: errorInfo.title,
      content: errorInfo.message,
      duration: errorInfo.retryable ? 8000 : 5000
    }

    if (onRetry) {
      notificationOptions.action = () => {
        notification.destroyAll()
        onRetry()
      }
      notificationOptions.actionText = '重试'
    }

    notification.error(notificationOptions)
  }

  // 错误上报（可扩展为实际的监控系统）
  const reportError = (errorInfo: ErrorInfo): void => {
    // 这里可以集成实际的错误监控服务
    // 例如：Sentry、LogRocket等
    if (import.meta.env.DEV) {
      // 开发环境可以记录到本地存储或发送到开发监控
    } else {
      // 生产环境发送到监控平台
    }
  }

  return {
    errors: readonly(errors),
    handleError,
    clearError,
    clearAllErrors,
    hasErrors: computed(() => errors.value.length > 0),
    getLastError: () => errors.value[errors.value.length - 1] || null
  }
}
