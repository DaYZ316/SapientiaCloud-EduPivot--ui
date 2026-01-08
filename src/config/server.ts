/**
 * 服务器配置
 * 统一管理API服务器地址，确保http.ts和vite.config.ts使用相同的配置
 */

export interface ServerConfig {
    /** 服务器IP地址或域名 */
    ip: string
    /** 服务器端口*/
    port?: number
    /** 是否使用HTTPS */
    https?: boolean
    /** API前缀 */
    prefix: string
}

/**
 * 开发环境服务器配置
 */
export const devServerConfig: ServerConfig = {
    ip: '117.72.194.197',
    port: 31600,
    https: false,
    prefix: '/api'
}

/**
 * 生产环境服务器配置
 */
export const prodServerConfig: ServerConfig = {
    ip: 'edupivot.xyz',
    https: true,
    prefix: '/api'
}

/**
 * 判断是否为开发环境
 */
function isDevEnvironment(): boolean {
    return (import.meta as any).env?.DEV === true
}

/**
 * 默认服务器配置（根据环境自动选择）
 */
export const defaultServerConfig: ServerConfig = isDevEnvironment() ? devServerConfig : prodServerConfig

/**
 * 获取完整的服务器URL
 */
export function getServerUrl(config: ServerConfig = defaultServerConfig): string {
    const protocol = config.https ? 'https' : 'http'
    const port = config.port ? `:${config.port}` : ''
    return `${protocol}://${config.ip}${port}`
}

/**
 * 获取完整的API基础URL
 */
export function getApiBaseUrl(config: ServerConfig = defaultServerConfig): string {
    return `${getServerUrl(config)}${config.prefix}`
}

/**
 * 获取代理目标URL
 */
export function getProxyTarget(config: ServerConfig = defaultServerConfig): string {
    return getServerUrl(config)
}
