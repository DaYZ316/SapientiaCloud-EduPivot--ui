/**
 * 错误处理工具函数
 *
 * 用于统一处理后端API返回的错误信息，按照项目规范显示错误。
 * 遵循规则：不使用 console、alert、message.error
 */

import {getGlobalApis} from './naiveUIHelper'

const {dialog, message} = getGlobalApis()

/**
 * 提取后端返回的错误信息（兼容多种返回格式）
 *
 * 支持的错误信息字段：
 * - response.message
 * - response.msg
 * - response.data.message
 * - response.data.msg
 *
 * @param apiResponse API响应对象
 * @returns 错误信息字符串或null
 */
export function extractBackendErrorMessage(apiResponse: any): string | null {
  if (!apiResponse || typeof apiResponse !== 'object') {
    return null
  }

  // 优先检查顶层错误信息
  let backendMessage = apiResponse.message || apiResponse.msg || null

  // 如果顶层没有错误信息，检查data字段
  if (!backendMessage && apiResponse.data && typeof apiResponse.data === 'object') {
    backendMessage = apiResponse.data.message || apiResponse.data.msg || null
  }

  return backendMessage
}

/**
 * 显示后端错误信息（遵循项目规则，不使用message.error）
 *
 * 使用 naive-ui 的 dialog.warning 显示错误信息。
 * 如果 dialog 不可用，则降级使用 message.info。
 *
 * @param apiResponse API响应对象
 * @param title 对话框标题（可选，默认为'操作失败'）
 * @param fallbackMessage 默认错误信息（可选，默认为'操作失败，请稍后重试'）
 *
 * @example
 * ```typescript
 * try {
 *   const response = await apiCall()
 *   if (response.code !== 200) {
 *     showBackendError(response, '保存失败', '保存数据时发生错误')
 *   }
 * } catch (error) {
 *   showBackendError(null, '网络错误', '请检查网络连接')
 * }
 * ```
 */
export function showBackendError(apiResponse: any, title?: string, fallbackMessage?: string) {
  const backendMessage = extractBackendErrorMessage(apiResponse)

  const errorMessage = backendMessage || fallbackMessage || '操作失败，请稍后重试'

  // 使用dialog显示错误（遵循项目规则）
  if (dialog) {
    dialog.warning({
      title: title || '操作失败',
      content: errorMessage,
      positiveText: '确定'
    })
  } else if (message) {
    // 降级方案：使用message.info（不要使用message.error）
    message.info(errorMessage)
  }
}

/**
 * 处理API响应错误并返回成功状态
 *
 * 这是一个便捷函数，结合了响应检查和错误显示。
 *
 * @param apiResponse API响应对象
 * @param title 对话框标题（可选）
 * @param fallbackMessage 默认错误信息（可选）
 * @returns 是否为成功响应
 *
 * @example
 * ```typescript
 * const response = await apiCall()
 * if (!handleApiResponse(response, '操作失败', '请稍后重试')) {
 *   return // 处理失败的情况
 * }
 * // 处理成功的情况
 * ```
 */
export function handleApiResponse(apiResponse: any, title?: string, fallbackMessage?: string): boolean {
  const isSuccess = typeof apiResponse === 'boolean'
    ? apiResponse
    : Boolean(apiResponse && (apiResponse.success === true || apiResponse.code === 200))

  if (!isSuccess) {
    showBackendError(apiResponse, title, fallbackMessage)
  }

  return isSuccess
}
