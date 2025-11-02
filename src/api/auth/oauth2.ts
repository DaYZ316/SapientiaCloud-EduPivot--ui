import http from '@/utils/http'

// OAuth2 授权
export function authorize(provider: string) {
    return http.get(`/auth/oauth2/authorize/${provider}`)
}

// OAuth2 回调
export function oauth2Callback(provider: string, code: string, state: string) {
    return http.get(`/auth/oauth2/callback/${provider}`, {code, state})
}

