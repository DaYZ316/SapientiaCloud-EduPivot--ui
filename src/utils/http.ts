import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import type { Result } from '@/types/http'
import { useRouter } from 'vue-router'
import { createDiscreteApi } from 'naive-ui'

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
    return `http://${this.ip}:${this.port}${this.prefix}`
  }
  
  /**
   * 获取完整的API路径
   */
  public getUrl(path: string): string {
    // 确保路径以/开头
    if (!path.startsWith('/')) {
      path = '/' + path
    }
    return `${this.getBaseUrl()}${path}`
  }
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
        const token = localStorage.getItem('token')
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
        // 业务状态码处理
        const res = response.data as Result
        if (!res.success || res.code !== 200) {
          this.handleErrorCode(res.code, res.message)
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
    const { message: messageApi } = createDiscreteApi(['message'])
    
    // 根据不同错误码处理
    switch (code) {
      // 未授权
      case 401:
        messageApi.error('登录已过期，请重新登录')
        localStorage.removeItem('token')
        useRouter().push('/login')
        break
      // 权限不足
      case 403:
        messageApi.error('权限不足')
        break
      // 其他错误
      default:
        messageApi.error(message || '请求失败')
    }
  }

  /**
   * 处理HTTP错误
   */
  private handleHttpError(error: any): void {
    const { message: messageApi } = createDiscreteApi(['message'])
    
    let message = '未知错误'
    
    if (error.response) {
      const status = error.response.status
      
      // 根据HTTP状态码处理
      switch (status) {
        case 400:
          message = '请求参数错误'
          break
        case 401:
          message = '登录已过期，请重新登录'
          localStorage.removeItem('token')
          useRouter().push('/login')
          break
        case 403:
          message = '权限不足'
          break
        case 404:
          message = '请求资源不存在'
          break
        case 500:
          message = '服务器内部错误'
          break
        default:
          message = `请求失败(${status})`
      }
    } else if (error.request) {
      message = '网络请求超时，请检查网络连接'
    }
    
    messageApi.error(message)
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