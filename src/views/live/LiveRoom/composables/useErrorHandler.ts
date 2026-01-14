import { ref, reactive, readonly, computed, type ComputedRef, type Ref } from 'vue'
import { useI18n } from 'vue-i18n'
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
  errors: Readonly<Ref<readonly ErrorInfo[]>>
  handleError: (error: any, context: string, options?: ErrorHandlerOptions) => void
  clearError: (code: string) => void
  clearAllErrors: () => void
  hasErrors: ComputedRef<boolean>
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
  const { t } = useI18n()
  const { notification, dialog } = getGlobalApis()

  // 错误历史记录
  const errors = ref<ErrorInfo[]>([])

  // 错误统计
  const errorStats = reactive({
    networkErrors: 0,
    businessErrors: 0,
    systemErrors: 0,
    userErrors: 0,
    unknownErrors: 0,
    totalErrors: 0
  })

  // 错误分类和处理策略
  const parseError = (error: any, context: string): ErrorInfo => {
    // 安全提取错误信息，避免使用可能包含DOM引用的属性
    const getSafeErrorMessage = (err: any): string => {
      try {
        if (typeof err === 'string') return err
        if (err?.message && typeof err.message === 'string') return err.message
        if (err?.toString && typeof err.toString === 'function') return err.toString()
        return t('live.errors.unknownError')
      } catch {
        return t('live.errors.unknownError')
      }
    }

    const getSafeErrorName = (err: any): string => {
      try {
        return typeof err?.name === 'string' ? err.name : 'Error'
      } catch {
        return 'Error'
      }
    }

    let errorInfo: ErrorInfo = {
      code: 'unknown_error',
      title: t('live.errors.operationFailedTitle'),
      message: t('live.errors.operationFailedMessage'),
      type: 'unknown',
      timestamp: Date.now(),
      context,
      retryable: true
    }

    // 网络错误检测 - 安全地检查网络状态
    let isNetworkError = false
    try {
      if (typeof navigator !== 'undefined' && !navigator.onLine) {
        errorInfo = {
          code: 'network_offline',
          title: t('live.errors.networkErrorTitle'),
          message: t('live.errors.networkErrorMessage'),
          type: 'network',
          timestamp: Date.now(),
          context,
          retryable: true
        }
        isNetworkError = true
      }
    } catch {
      // 如果navigator访问失败，跳过网络检查
    }

    // HTTP状态码错误
    if (!isNetworkError && error?.status) {
      const status = error.status
      if (status === 401 || status === 403) {
        errorInfo = {
          code: 'auth_error',
          title: t('live.errors.permissionDeniedTitle'),
          message: t('live.errors.permissionDeniedMessage'),
          type: 'business',
          timestamp: Date.now(),
          context,
          retryable: false
        }
      } else if (status === 404) {
        errorInfo = {
          code: 'not_found',
          title: t('live.errors.notFoundTitle'),
          message: t('live.errors.notFoundMessage'),
          type: 'business',
          timestamp: Date.now(),
          context,
          retryable: false
        }
      } else if (status >= 500) {
        errorInfo = {
          code: 'server_error',
          title: t('live.errors.serverErrorTitle'),
          message: t('live.errors.serverErrorMessage'),
          type: 'system',
          timestamp: Date.now(),
          context,
          retryable: true
        }
      }
    }
    // 超时错误
    else if (getSafeErrorMessage(error).includes('timeout') || error?.code === 'TIMEOUT') {
      errorInfo = {
        code: 'timeout_error',
        title: t('live.errors.timeoutTitle'),
        message: t('live.errors.timeoutMessage'),
        type: 'network',
        timestamp: Date.now(),
        context,
        retryable: true
      }
    }
    // WebRTC相关错误
    else if (getSafeErrorName(error) === 'NotAllowedError') {
      errorInfo = {
        code: 'media_permission_denied',
        title: t('live.errors.mediaPermissionDeniedTitle'),
        message: t('live.errors.mediaPermissionDeniedMessage'),
        type: 'user',
        timestamp: Date.now(),
        context,
        retryable: false
      }
    }
    else if (getSafeErrorName(error) === 'NotFoundError') {
      errorInfo = {
        code: 'media_device_not_found',
        title: t('live.errors.mediaDeviceNotFoundTitle'),
        message: t('live.errors.mediaDeviceNotFoundMessage'),
        type: 'system',
        timestamp: Date.now(),
        context,
        retryable: false
      }
    }
    // 直播相关错误
    else if (getSafeErrorMessage(error).includes('room') || context.includes('live')) {
      errorInfo = {
        code: 'live_error',
        title: t('live.errors.liveErrorTitle'),
        message: getSafeErrorMessage(error) || t('live.errors.liveErrorMessage'),
        type: 'business',
        timestamp: Date.now(),
        context,
        retryable: true
      }
    }
    // 通用错误处理
    else if (getSafeErrorMessage(error)) {
      const safeMessage = getSafeErrorMessage(error)
      errorInfo.message = safeMessage
      errorInfo.retryable = !['auth_error', 'not_found'].includes(errorInfo.code)
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
      return
    }

    // 节流：相同错误1秒内只处理一次
    const safeErrorKey = `${context}|${typeof error?.name === 'string' ? error.name : 'Error'}|${typeof error?.message === 'string' ? error.message : 'Unknown'}`
    const now = Date.now()
    if (safeErrorKey === lastErrorKey && now - lastErrorTime < 1000) {
      return
    }
    lastErrorKey = safeErrorKey
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
          positiveText: t('live.errors.confirm')
        })
      } else if (showNotification) {
        // 显示通知 - 带去重
        showNotificationOnce(errorInfo, allowRetry && errorInfo.retryable && onRetry ? onRetry : null)
      } else {
        // 简化的错误提示 - 记录到错误历史，不输出到控制台
        // 错误信息已通过 errors.value 记录，可通过其他方式查看
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
      notificationOptions.actionText = t('live.errors.retry')
    }

    notification.error(notificationOptions)
  }


  // 错误上报（可扩展为实际的监控系统）
  const reportError = (_errorInfo: ErrorInfo): void => {
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
