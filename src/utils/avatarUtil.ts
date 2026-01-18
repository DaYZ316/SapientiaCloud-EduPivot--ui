/**
 * 头像相关工具函数
 */
import type {AvatarIdentityProps, AvatarSizeType} from '@/types/components/avatar'
import * as THREE from 'three'
import {createAvatar} from '@dicebear/core'
import * as avatarCollection from '@dicebear/collection'

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

// 将 AvatarDisplay 组件渲染为 Three.js 纹理
export const renderAvatarToTexture = async (
    identity: AvatarIdentityProps,
    size: number = 128
): Promise<THREE.Texture> => {
    return new Promise(async (resolve) => {
        try {
            // 优先使用传入的头像源
            if (identity.avatarSrc) {
                const img = new Image()
                img.crossOrigin = 'anonymous'
                img.onload = () => {
                    const canvas = document.createElement('canvas')
                    canvas.width = size
                    canvas.height = size
                    const ctx = canvas.getContext('2d')

                    if (ctx) {
                        // 清除背景
                        ctx.clearRect(0, 0, size, size)
                        // 绘制圆形背景
                        ctx.fillStyle = '#ffffff'
                        ctx.beginPath()
                        ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI)
                        ctx.fill()
                        // 绘制图像
                        ctx.save()
                        ctx.beginPath()
                        ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI)
                        ctx.clip()
                        ctx.drawImage(img, 0, 0, size, size)
                        ctx.restore()

                        // 创建 Three.js 纹理
                        const texture = new THREE.CanvasTexture(canvas)
                        texture.needsUpdate = true
                        resolve(texture)
                        return
                    }
                }
                img.onerror = () => {
                    // 头像加载失败，使用 DiceBear 头像
                    generateDicebearAvatar()
                }
                img.src = identity.avatarSrc
            } else {
                // 没有头像源，直接使用 DiceBear 头像
                generateDicebearAvatar()
            }

            // 生成 DiceBear 头像
            function generateDicebearAvatar() {
                try {
                    const userName = resolveUserName(identity)
                    if (!userName) {
                        throw new Error('No username available')
                    }

                    // 根据用户名生成稳定的渐变颜色组合
                    const [color1, color2, color3] = getGradientColors(userName)
                    const gradientId = `gradient-${userName.replace(/[^a-zA-Z0-9]/g, '')}-${size}`

                    const avatar = createAvatar(avatarCollection.bottts, {
                        seed: userName,
                        size: size
                    })

                    // 获取 SVG 字符串并添加渐变背景和动画
                    const svgString = avatar.toString()

                    // 创建渐变定义
                    const gradientDef = `
                        <defs>
                            <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" style="stop-color:${color1};stop-opacity:1"/>
                                <stop offset="50%" style="stop-color:${color2};stop-opacity:1"/>
                                <stop offset="100%" style="stop-color:${color3};stop-opacity:1"/>
                            </linearGradient>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#${gradientId})"/>
                    `

                    // 在 SVG 开头添加渐变背景
                    const svgWithBackground = svgString.replace(
                        /<svg([^>]*)>/,
                        `<svg$1>${gradientDef}`
                    )

                    // 转换为 data URI
                    const svgUrl = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgWithBackground)}`

                    // 将 SVG URL 转换为 canvas
                    const img = new Image()
                    img.crossOrigin = 'anonymous'
                    img.onload = () => {
                        const canvas = document.createElement('canvas')
                        canvas.width = size
                        canvas.height = size
                        const ctx = canvas.getContext('2d')

                        if (ctx) {
                            // 清除背景
                            ctx.clearRect(0, 0, size, size)
                            // 绘制图像
                            ctx.drawImage(img, 0, 0, size, size)

                            // 创建 Three.js 纹理
                            const texture = new THREE.CanvasTexture(canvas)
                            texture.needsUpdate = true

                            resolve(texture)
                            return
                        }
                    }
                    img.onerror = () => {
                        throw new Error('Failed to load DiceBear SVG image')
                    }
                    img.src = svgUrl
                } catch (error) {
                    // 发生错误时使用后备方案
                    const fallbackTexture = createFallbackTexture(identity, size)
                    resolve(fallbackTexture)
                }
            }
        } catch (error) {
            // 发生错误时使用后备方案
            const fallbackTexture = createFallbackTexture(identity, size)
            resolve(fallbackTexture)
        }
    })
}

// 创建后备纹理（使用纯色圆形和首字母）
const createFallbackTexture = (identity: AvatarIdentityProps, size: number): THREE.Texture => {
    const canvas = document.createElement('canvas')
    canvas.width = size
    canvas.height = size
    const ctx = canvas.getContext('2d')

    if (ctx) {
        const displayName = resolveUserName(identity)
        const color = getAvatarColor(displayName)
        const initial = getAvatarInitial(displayName)

        // 绘制圆形背景
        ctx.fillStyle = color
        ctx.beginPath()
        ctx.arc(size / 2, size / 2, size / 2, 0, 2 * Math.PI)
        ctx.fill()

        // 绘制首字母
        if (initial) {
            ctx.fillStyle = '#FFFFFF'
            ctx.font = `bold ${size * 0.4}px sans-serif`
            ctx.textAlign = 'center'
            ctx.textBaseline = 'middle'
            ctx.fillText(initial, size / 2, size / 2)
        }
    }

    const texture = new THREE.CanvasTexture(canvas)
    texture.needsUpdate = true
    return texture
}

