import http from '@/utils/http'
import type {
    BindMobileConfirmDTO,
    BindMobileDTO,
    SelectIdentityDTO,
    SendVerificationCodeDTO,
    SysUserLoginDTO,
    SysUserMobileLoginDTO,
    SysUserMobilePasswordDTO,
    SysUserPasswordDTO,
    SysUserRegisterDTO
} from '@/types/auth'

// 获取默认用户登录DTO
export function getDefaultSysUserLoginDTO(): SysUserLoginDTO {
    return {
        username: null,
        password: null
    }
}

// 获取默认用户注册DTO
export function getDefaultSysUserRegisterDTO(): SysUserRegisterDTO {
    return {
        username: null,
        password: null,
        confirmPassword: null,
        avatar: null,
        nickName: null,
        mobile: null,
        verificationCode: null
    }
}

// 获取默认密码修改DTO
export function getDefaultSysUserPasswordDTO(): SysUserPasswordDTO {
    return {
        currentPassword: null,
        newPassword: null,
        confirmPassword: null
    }
}

// 用户登录
export function login(params: SysUserLoginDTO) {
    return http.post('/auth/login', params)
}

// 用户注册
export function register(params: SysUserRegisterDTO) {
    return http.post('/auth/register', params)
}

// 用户登出
export function logout() {
    return http.post('/auth/logout')
}

// 验证令牌
export function validateToken(token: string) {
    return http.get('/auth/validate', {token})
}

// 获取当前登录用户信息
export function getUserInfo() {
    return http.get('/auth/info')
}

// 修改用户密码
export function updatePassword(data: SysUserPasswordDTO) {
    return http.put('/auth/password', data)
}

// 获取默认手机登录DTO
export function getDefaultSysUserMobileLoginDTO(): SysUserMobileLoginDTO {
    return {
        mobile: null,
        verificationCode: null
    }
}

// 手机验证码登录
export function mobileLogin(params: SysUserMobileLoginDTO) {
    return http.post('/auth/mobile-login', params)
}

// 获取默认发送验证码DTO
export function getDefaultSendVerificationCodeDTO(): SendVerificationCodeDTO {
    return {
        mobile: null
    }
}

// 发送手机验证码
export function sendVerificationCode(params: SendVerificationCodeDTO) {
    return http.post('/auth/send-code', params)
}

// 检查用户名是否可用
export function checkUsername(username: string) {
    return http.get('/auth/check-username', {username})
}

// 获取默认身份选择DTO
export function getDefaultSelectIdentityDTO(): SelectIdentityDTO {
    return {
        identityType: null,
        studentInfo: null,
        teacherInfo: null
    }
}

// 选择身份并创建对应的学生或教师记录
export function selectIdentity(params: SelectIdentityDTO) {
    return http.post('/auth/identity/select', params)
}

// 获取默认绑定手机号DTO
export function getDefaultBindMobileDTO(): BindMobileDTO {
    return {
        mobile: null,
        verificationCode: null,
        userId: null
    }
}

// 绑定手机号
export function bindMobile(params: BindMobileDTO) {
    return http.post('/auth/bind-mobile', params)
}

// 获取默认绑定手机号确认DTO
export function getDefaultBindMobileConfirmDTO(): BindMobileConfirmDTO {
    return {
        mobile: null,
        userId: null,
        isSameAccount: null
    }
}

// 确认绑定手机号
export function bindMobileConfirm(params: BindMobileConfirmDTO) {
    return http.post('/auth/bind-mobile/confirm', params)
}

// 检查手机号是否可用
export function checkMobile(mobile: string) {
    return http.get('/auth/check-mobile', {mobile})
}

// 获取默认手机修改密码DTO
export function getDefaultSysUserMobilePasswordDTO(): SysUserMobilePasswordDTO {
    return {
        mobile: null,
        verificationCode: null,
        newPassword: null,
        confirmPassword: null
    }
}

// 通过手机验证码修改密码
export function updatePasswordByMobile(data: SysUserMobilePasswordDTO) {
    return http.put('/auth/mobile-password', data)
} 