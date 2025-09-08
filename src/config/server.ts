/**
 * 服务器配置
 * 统一管理API服务器地址，确保http.ts和vite.config.ts使用相同的配置
 */

export interface ServerConfig {
    /** 服务器IP地址 */
    ip: string
    /** 服务器端口 */
    port: number
    /** API前缀 */
    prefix: string
}

/**
 * 默认服务器配置
 */
export const defaultServerConfig: ServerConfig = {
    ip: '127.0.0.1',
    port: 31600,
    prefix: '/api'
}

/**
 * 获取完整的服务器URL
 */
export function getServerUrl(config: ServerConfig = defaultServerConfig): string {
    return `http://${config.ip}:${config.port}`
}

/**
 * 获取完整的API基础URL
 */
export function getApiBaseUrl(config: ServerConfig = defaultServerConfig): string {
    return `${getServerUrl(config)}${config.prefix}`
}

/**
 * 获取代理目标URL（用于Vite配置）
 */
export function getProxyTarget(config: ServerConfig = defaultServerConfig): string {
    return getServerUrl(config)
}
