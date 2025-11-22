/**
 * 头像相关工具函数
 */
import type {AvatarIdentityProps, AvatarSizeType} from '@/types/components/avatar'

// 头像颜色池
export const AVATAR_COLOR_PALETTE = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA',
    '#F1948A', '#D7BDE2'
] as const

const AVATAR_SIZE_MAP: Record<'small' | 'medium' | 'large', number> = {
    small: 32,
    medium: 40,
    large: 48
}

// 解析姓名，保证优先使用真实姓名
export const resolveUserName = (identity: AvatarIdentityProps): string => {
    return identity.studentRealName
        || identity.teacherRealName
        || identity.nickName
        || identity.username
        || ''
}

// 获取头像首字母
export const getAvatarInitial = (name: string): string => {
    return name ? name.charAt(0).toUpperCase() : ''
}

// 获取头像颜色
export const getAvatarColor = (text: string): string => {
    if (!text) return '#000000'
    let hash = 0
    for (let i = 0; i < text.length; i += 1) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash)
    }
    return AVATAR_COLOR_PALETTE[Math.abs(hash) % AVATAR_COLOR_PALETTE.length]
}

// 获取头像尺寸
export const normalizeAvatarSize = (size?: AvatarSizeType): number => {
    if (typeof size === 'number') {
        return size > 0 ? size : AVATAR_SIZE_MAP.medium
    }
    const preset = size || 'medium'
    return AVATAR_SIZE_MAP[preset] || AVATAR_SIZE_MAP.medium
}

// 根据尺寸计算字体大小
export const getAvatarFontSize = (size: number): string => {
    return `${Math.max(14, Math.round(size * 0.5))}px`
}

