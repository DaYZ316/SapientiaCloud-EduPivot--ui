import type {AxiosInstance, AxiosRequestConfig} from 'axios'
import axios from 'axios'
import type {Result} from '@/types/common/baseEntity'
import router from '@/router'
import {createDiscreteApi, darkTheme, useDialog, useMessage} from 'naive-ui'
import {useThemeStore, useUserStore} from '@/store'
import i18n from '@/i18n'

// 创建一个获取翻译文本的函数
function t(key: string): string {
  // 定义默认文本
  const defaultTexts: Record<string, string> = {
    'unknown': '未知错误',
    'timeout': '网络请求超时，请检查网络连接',
    'badRequest': '请求参数错误',
    'unauthorized': '登录已过期，请重新登录',
    'unauthorizedTitle': '登录已过期',
    'unauthorizedContent': '您的登录已过期，请重新登录',
    'confirm': '确认',
    'forbidden': '权限不足',
    'notFound': '请求资源不存在',
    'serverError': '服务器内部错误',
    'requestFailed': '请求失败',
    'notInitialized': '对话框实例未初始化'
  };
  
  try {
    // 尝试使用i18n
    return i18n.global.t(`common.http.${key}`);
  } catch (error) {
    // 如果失败，返回默认文本
    return defaultTexts[key] || key;
  }
}

/**
 * API请求路径配置类
 */
class ApiConfig {
  // 服务器IP
  private ip: string
  // 服务器端口
  private port: number
  // API前缀
  private prefix: string
  
  constructor(ip: string = '117.72.194.197', port: number = 31600, prefix: string = '/api') {
    this.ip = ip
    this.port = port
    this.prefix = prefix
  }
  
  /**
   * 获取完整的基础URL
   */
  public getBaseUrl(): string {
    // 判断是否为开发环境
    const isDev = import.meta.env.DEV
    
    if (isDev) {
      // 开发环境使用相对路径，由Vite代理处理
      return this.prefix
    } else {
      // 生产环境使用完整URL
      return `http://${this.ip}:${this.port}${this.prefix}`
    }
  }
}

/**
 * 全局消息提示实例
 */
let messageInstance: ReturnType<typeof useMessage> | null = null

/**
 * 全局对话框实例
 */
let dialogInstance: ReturnType<typeof useDialog> | null = null

/**
 * 设置全局消息提示实例
 */
export const setMessageInstance = (instance: ReturnType<typeof useMessage>) => {
  messageInstance = instance
}

/**
 * 设置全局对话框实例
 */
export const setDialogInstance = (instance: ReturnType<typeof useDialog>) => {
  dialogInstance = instance
}

/**
 * 获取全局消息提示实例
 */
export const getMessageInstance = () => {
  if (!messageInstance) {
    // 使用createDiscreteApi创建一个临时实例，并应用当前主题
    const themeStore = useThemeStore();
    const { message } = createDiscreteApi(['message'], {
      configProviderProps: {
        theme: themeStore.isDarkMode ? darkTheme : null,
        themeOverrides: {
          common: {
            primaryColor: themeStore.primaryColor,
            primaryColorHover: themeStore.primaryColor,
            primaryColorPressed: themeStore.primaryColor,
          }
        }
      }
    });
    messageInstance = message;
  }
  return messageInstance
}

/**
 * 获取全局对话框实例
 */
export const getDialogInstance = () => {
  if (!dialogInstance) {
    // 使用createDiscreteApi创建一个临时实例，并应用当前主题
    const themeStore = useThemeStore();
    const { dialog } = createDiscreteApi(['dialog'], {
      configProviderProps: {
        theme: themeStore.isDarkMode ? darkTheme : null,
        themeOverrides: {
          common: {
            primaryColor: themeStore.primaryColor,
            primaryColorHover: themeStore.primaryColor,
            primaryColorPressed: themeStore.primaryColor,
          }
        }
      }
    });
    dialogInstance = dialog;
  }
  return dialogInstance
}

/**
 * 重置消息和对话框实例
 * 当主题变化时调用此函数，以便下次获取实例时会使用新主题
 */
export const resetInstances = () => {
  messageInstance = null;
  dialogInstance = null;
}

/**
 * Axios HTTP 客户端封装
 */
class HttpClient {
  // Axios实例
  private instance: AxiosInstance
  // API配置
  private apiConfig: ApiConfig
  // 公共配置
  private config: AxiosRequestConfig = {
    timeout: 10000,
    withCredentials: true, // 允许跨域请求携带cookie
    headers: {
      'Content-Type': 'application/json'
    }
  }

  constructor(apiConfig?: ApiConfig) {
    // 初始化API配置
    this.apiConfig = apiConfig || new ApiConfig()
    
    // 设置baseURL
    this.config.baseURL = this.apiConfig.getBaseUrl()
    
    // 创建Axios实例
    this.instance = axios.create(this.config)
    
    // 注册拦截器
    this.setupInterceptors()
  }

  /**
   * 配置请求/响应拦截器
   */
  private setupInterceptors(): void {
    // 请求拦截器
    this.instance.interceptors.request.use(
      (config) => {
        // 获取token并添加到请求头
        const userStore = useUserStore()
        const token = userStore.token
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )

    // 响应拦截器
    this.instance.interceptors.response.use(
      (response): any => {
        // 检查响应是否为TableDataResult格式
        const data = response.data
        if (data && 'total' in data && 'data' in data && 'code' in data && data.code === 200) {
          // 是TableDataResult格式，直接返回
          return data
        }

        // 业务状态码处理，处理Result<T>格式
        const res = data as Result<any>
        if (!res.success && res.code !== 200) {
          // 检查是否为401未授权错误
          if (res.code === 401) {
            const userStore = useUserStore()
            try {
              const dialog = getDialogInstance()
              dialog.warning({
                title: t('unauthorizedTitle'),
                content: t('unauthorizedContent'),
                positiveText: t('confirm'),
                positiveButtonProps: {
                  type: 'primary',
                  ghost: false
                },
                onPositiveClick: () => {
                  userStore.resetUserState()
                  router.push('/login')
                }
              })
            } catch (error) {
              console.error('对话框实例未初始化', error)
              // 如果对话框未初始化，则使用消息提示
              const messageApi = getMessageInstance()
              messageApi.error(t('unauthorized'))
              userStore.resetUserState()
              router.push('/login')
            }
          } else {
            this.handleErrorCode(res.code || 500, res.message || '请求失败')
          }
          return Promise.reject(res)
        }
        return res
      },
      (error) => {
        // HTTP错误处理
        this.handleHttpError(error)
        return Promise.reject(error)
      }
    )
  }

  /**
   * 处理业务错误码
   */
  private handleErrorCode(code: number, message: string): void {
    try {
      const messageApi = getMessageInstance()
      const userStore = useUserStore()
      
      // 根据不同错误码处理
      switch (code) {
        // 未授权情况已在响应拦截器中处理
        // 权限不足
        case 403:
          messageApi.error(t('forbidden'))
          break
        // 其他错误
        default:
          messageApi.error(message || '请求失败')
      }
    } catch (error) {
      console.error('处理业务错误码失败:', error)
    }
  }

  /**
   * 处理HTTP错误
   */
  private handleHttpError(error: any): void {
    const messageApi = getMessageInstance()
    const userStore = useUserStore()
    
    let message = '未知错误'
    
    if (error.response) {
      const status = error.response.status
      
      // 根据HTTP状态码处理
      switch (status) {
        case 400:
          message = t('badRequest')
          messageApi.error(message)
          break
        case 401:
          message = t('unauthorized')
          try {
            const dialog = getDialogInstance()
            dialog.warning({
              title: t('unauthorizedTitle'),
              content: t('unauthorizedContent'),
              positiveText: t('confirm'),
              positiveButtonProps: {
                type: 'primary',
                ghost: false
              },
              onPositiveClick: () => {
                userStore.resetUserState()
                router.push('/login')
              }
            })
          } catch (error) {
            console.error('对话框实例未初始化', error)
            // 如果对话框未初始化，则使用消息提示
            messageApi.error(message)
            userStore.resetUserState()
            router.push('/login')
          }
          break
        case 403:
          message = t('forbidden')
          messageApi.error(message)
          break
        case 404:
          message = t('notFound')
          messageApi.error(message)
          break
        case 500:
          message = t('serverError')
          messageApi.error(message)
          break
        default:
          message = t('requestFailed') + `(${status})`
          messageApi.error(message)
      }
    } else if (error.request) {
      message = t('timeout')
      messageApi.error(message)
    } else {
      messageApi.error(message)
    }
  }

  /**
   * GET请求
   */
  public get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<Result<T>> {
    return this.instance.get(url, { ...config, params }) as unknown as Promise<Result<T>>
  }

  /**
   * POST请求
   */
  public post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<Result<T>> {
    return this.instance.post(url, data, config) as unknown as Promise<Result<T>>
  }

  /**
   * PUT请求
   */
  public put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<Result<T>> {
    return this.instance.put(url, data, config) as unknown as Promise<Result<T>>
  }

  /**
   * DELETE请求
   */
  public delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<Result<T>> {
    return this.instance.delete(url, config) as unknown as Promise<Result<T>>
  }
}

// 创建默认API配置
export const apiConfig = new ApiConfig()

// 导出API配置类，便于修改配置
export { ApiConfig }

// 导出HTTP客户端实例
export default new HttpClient(apiConfig) 