/**
 * 头像相关类型定义
 */

// 头像尺寸类型
export type AvatarSizeType = 'small' | 'medium' | 'large' | number

// 头像身份信息
export interface AvatarIdentityProps {
    avatarSrc?: string | null
    username?: string | null
    nickName?: string | null
    studentRealName?: string | null
    teacherRealName?: string | null
    fallbackSrc?: string | null
}

// 头像展示组件 Props
export interface AvatarDisplayProps extends AvatarIdentityProps {
    size?: AvatarSizeType
    round?: boolean
    avatarClass?: string
}

// 头像展示通用返回体
export interface AvatarVisualMeta {
    name: string
    initial: string
    size: number
}

