import http from '@/utils/http'

// OAuth2 授权（获取授权URL，然后前端跳转）
export function authorize(provider: string) {
    return http.get(`/auth/oauth2/authorize/${provider}`)
}

// OAuth2 回调（处理授权回调，完成登录）
export function oauth2Callback(provider: string, code: string, state: string) {
    return http.get(`/auth/oauth2/callback/${provider}`, {code, state})
}

