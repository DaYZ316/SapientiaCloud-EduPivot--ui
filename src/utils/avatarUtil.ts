/**
 * 头像相关工具函数
 */
import type {AvatarIdentityProps, AvatarSizeType} from '@/types/components/avatar'

// 头像颜色池（科技感配色）
export const AVATAR_COLOR_PALETTE = [
    '#00D4FF', '#4ECDC4', '#45B7D1', '#6C5CE7', '#A29BFE', '#74B9FF',
    '#0984E3', '#00B894', '#00CEC9', '#55EFC4', '#81ECEC', '#74B9FF',
    '#6C5CE7', '#A29BFE', '#FD79A8', '#FDCB6E', '#E17055', '#D63031'
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

// 获取渐变颜色组合（根据文本生成稳定的渐变配色）
export const getGradientColors = (text: string): [string, string, string] => {
    if (!text) return ['#00D4FF', '#4ECDC4', '#6C5CE7']
    let hash = 0
    for (let i = 0; i < text.length; i += 1) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash)
    }
    const index1 = Math.abs(hash) % AVATAR_COLOR_PALETTE.length
    const index2 = Math.abs(hash * 2) % AVATAR_COLOR_PALETTE.length
    const index3 = Math.abs(hash * 3) % AVATAR_COLOR_PALETTE.length
    return [
        AVATAR_COLOR_PALETTE[index1],
        AVATAR_COLOR_PALETTE[index2],
        AVATAR_COLOR_PALETTE[index3]
    ]
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

