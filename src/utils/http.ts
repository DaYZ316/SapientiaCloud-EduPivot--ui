import type {AxiosInstance, AxiosRequestConfig} from 'axios'
import axios from 'axios'
import {nextTick} from 'vue'
import type {Result} from '@/types/common/baseEntity'
import router from '@/router'
import {useLoadingBarStore, useUserStore} from '@/store'
import i18n from '@/i18n'
import {getDiscreteApi, isApiInitialized} from '@/utils/naiveUIHelper'
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
    // 登录失效处理标志，防止重复弹出通知
    private isHandlingUnauthorized = false
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
     * 重置登录失效处理状态
     * 在用户重新登录后调用，确保下次登录失效时能正常弹出通知
     */
    public resetUnauthorizedHandling(): void {
        this.isHandlingUnauthorized = false
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

                // 开始加载条（除了某些不需要显示加载条的请求）
                if (!config.meta?.hideLoading) {
                    const loadingBarStore = useLoadingBarStore()
                    loadingBarStore.start()
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
                // 完成加载条（如果请求没有隐藏加载条）
                if (!response.config.meta?.hideLoading) {
                    const loadingBarStore = useLoadingBarStore()
                    loadingBarStore.finish()
                }

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
                // 完成加载条（如果请求没有隐藏加载条）
                if (!error.config?.meta?.hideLoading) {
                    const loadingBarStore = useLoadingBarStore()
                    loadingBarStore.error()
                }

                // HTTP错误处理
                this.handleHttpError(error)
                return Promise.reject(error)
            }
        )
    }

    /**
     * 安全跳转到登录页
     */
    private navigateToLogin(): void {
        const userStore = useUserStore()
        userStore.resetUserState()

        // 重置处理标志
        this.isHandlingUnauthorized = false

        // 使用 nextTick 确保状态更新后再跳转
        nextTick(() => {
            try {
                // 尝试使用 Vue Router 跳转
                router.push('/login').catch((error) => {
                    console.warn('Vue Router 跳转失败，使用 window.location 强制跳转:', error)
                    // 如果路由跳转失败，使用 window.location 强制跳转
                    this.forceNavigateToLogin()
                })
            } catch (error) {
                console.warn('路由跳转异常，使用 window.location 强制跳转:', error)
                this.forceNavigateToLogin()
            }
        })
    }

    /**
     * 强制跳转到登录页
     */
    private forceNavigateToLogin(): void {
        try {
            // 使用 window.location 强制跳转
            window.location.href = '/login'
        } catch (error) {
            console.error('强制跳转失败:', error)
            // 最后的回退方案：重新加载页面到登录页
            window.location.reload()
        }
    }

    /**
     * 处理未授权状态
     */
    private handleUnauthorized(): void {
        // 如果已经在处理登录失效，直接返回，避免重复弹出通知
        if (this.isHandlingUnauthorized) {
            return
        }

        // 设置处理标志
        this.isHandlingUnauthorized = true

        // 检查API是否已初始化
        if (!isApiInitialized()) {
            // 如果API未初始化，直接跳转
            this.navigateToLogin()
            return
        }

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
                    this.navigateToLogin()
                },
                onAfterLeave: () => {
                    // 对话框关闭后重置标志
                    this.isHandlingUnauthorized = false
                }
            })
        } else {
            const {message} = getDiscreteApi()
            if (message) {
                message.error(i18n.global.t('common.http.unauthorized'))
            }
            this.navigateToLogin()
            // 如果没有对话框，立即重置标志
            this.isHandlingUnauthorized = false
        }
    }

    /**
     * 处理业务错误码
     */
    private handleErrorCode(code: number, message: string): void {
        const {message: messageApi, notification: notificationApi} = getDiscreteApi()

        // 根据不同错误码处理
        switch (code) {
            case 403:
                if (notificationApi) {
                    notificationApi.warning({
                        title: i18n.global.t('common.http.forbiddenTitle'),
                        content: i18n.global.t('common.http.forbiddenContent'),
                        duration: 5000,
                        keepAliveOnHover: true
                    })
                } else if (messageApi) {
                    messageApi.error(i18n.global.t('common.http.forbidden'))
                }
                break
            default:
                if (messageApi) {
                    messageApi.error(message)
                }
        }
    }

    /**
     * 处理HTTP错误
     */
    private handleHttpError(error: any): void {
        const {message: messageApi, notification: notificationApi} = getDiscreteApi()

        if (error.response) {
            const status = error.response.status

            // 根据HTTP状态码处理
            switch (status) {
                case 400:
                    if (messageApi) {
                        messageApi.error(i18n.global.t('common.http.badRequest'))
                    }
                    break
                case 401:
                    this.handleUnauthorized()
                    break
                case 403:
                    if (notificationApi) {
                        notificationApi.warning({
                            title: i18n.global.t('common.http.forbiddenTitle'),
                            content: i18n.global.t('common.http.forbiddenContent'),
                            duration: 5000,
                            keepAliveOnHover: true
                        })
                    } else if (messageApi) {
                        messageApi.error(i18n.global.t('common.http.forbidden'))
                    }
                    break
                case 404:
                    if (messageApi) {
                        messageApi.error(i18n.global.t('common.http.notFound'))
                    }
                    break
                case 500:
                    if (messageApi) {
                        messageApi.error(i18n.global.t('common.http.serverError'))
                    }
                    break
                default:
                    if (messageApi) {
                        messageApi.error(`${i18n.global.t('common.http.requestFailed')}(${status})`)
                    }
            }
        } else if (error.request) {
            if (messageApi) {
                messageApi.error(i18n.global.t('common.http.timeout'))
            }
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