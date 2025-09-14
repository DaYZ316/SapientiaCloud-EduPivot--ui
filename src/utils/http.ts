import type {AxiosInstance, AxiosRequestConfig} from 'axios'
import axios from 'axios'
import type {Result} from '@/types/common/baseEntity'
import router from '@/router'
import {useUserStore} from '@/store'
import i18n from '@/i18n'
import {getDiscreteApi} from '@/utils/naiveUIHelper'
import {defaultServerConfig, getApiBaseUrl, type ServerConfig} from '@/config/server'

/**
 * API请求路径配置类
 */
class ApiConfig {
    // 服务器配置
    private serverConfig: ServerConfig

    constructor(serverConfig: ServerConfig = defaultServerConfig) {
        this.serverConfig = serverConfig
    }

    /**
     * 获取完整的基础URL
     */
    public getBaseUrl(): string {
        // 判断是否为开发环境
        const isDev = import.meta.env.DEV

        if (isDev) {
            // 开发环境使用相对路径，由Vite代理处理
            return this.serverConfig.prefix
        } else {
            // 生产环境使用完整URL
            return getApiBaseUrl(this.serverConfig)
        }
    }

    /**
     * 获取服务器配置
     */
    public getServerConfig(): ServerConfig {
        return this.serverConfig
    }

    /**
     * 更新服务器配置
     */
    public updateServerConfig(newConfig: Partial<ServerConfig>): void {
        this.serverConfig = {...this.serverConfig, ...newConfig}
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
     * GET请求
     */
    public get<T = any>(url: string, params?: any, config?: AxiosRequestConfig): Promise<Result<T>> {
        return this.instance.get(url, {...config, params}) as unknown as Promise<Result<T>>
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
                        this.handleUnauthorized()
                    } else {
                        this.handleErrorCode(res.code || 500, res.message || i18n.global.t('common.http.requestFailed'))
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
     * 处理未授权状态
     */
    private handleUnauthorized(): void {
        const userStore = useUserStore()
        const {dialog} = getDiscreteApi()

        if (dialog) {
            dialog.warning({
                title: i18n.global.t('common.http.unauthorizedTitle'),
                content: i18n.global.t('common.http.unauthorizedContent'),
                positiveText: i18n.global.t('common.http.confirm'),
                positiveButtonProps: {
                    type: 'primary',
                    ghost: false
                },
                onPositiveClick: () => {
                    userStore.resetUserState()
                    router.push('/login')
                }
            })
        } else {
            const {message} = getDiscreteApi()
            if (message) {
                message.error(i18n.global.t('common.http.unauthorized'))
            }
            userStore.resetUserState()
            router.push('/login')
        }
    }

    /**
     * 处理业务错误码
     */
    private handleErrorCode(code: number, message: string): void {
        const {message: messageApi} = getDiscreteApi()
        if (!messageApi) return

        // 根据不同错误码处理
        switch (code) {
            case 403:
                messageApi.error(i18n.global.t('common.http.forbidden'))
                break
            default:
                messageApi.error(message)
        }
    }

    /**
     * 处理HTTP错误
     */
    private handleHttpError(error: any): void {
        const {message: messageApi} = getDiscreteApi()
        if (!messageApi) return

        if (error.response) {
            const status = error.response.status

            // 根据HTTP状态码处理
            switch (status) {
                case 400:
                    messageApi.error(i18n.global.t('common.http.badRequest'))
                    break
                case 401:
                    this.handleUnauthorized()
                    break
                case 403:
                    messageApi.error(i18n.global.t('common.http.forbidden'))
                    break
                case 404:
                    messageApi.error(i18n.global.t('common.http.notFound'))
                    break
                case 500:
                    messageApi.error(i18n.global.t('common.http.serverError'))
                    break
                default:
                    messageApi.error(`${i18n.global.t('common.http.requestFailed')}(${status})`)
            }
        } else if (error.request) {
            messageApi.error(i18n.global.t('common.http.timeout'))
        } else {
            messageApi.error(i18n.global.t('common.http.unknown'))
        }
    }
}

// 创建默认API配置
export const apiConfig = new ApiConfig()

// 导出API配置类，便于修改配置
export {ApiConfig}

// 导出HTTP客户端实例
export default new HttpClient(apiConfig) 