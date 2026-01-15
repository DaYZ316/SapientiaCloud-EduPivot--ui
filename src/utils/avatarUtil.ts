/**
 * 头像相关工具函数
 */
import type {AvatarIdentityProps, AvatarSizeType} from '@/types/components/avatar'
import * as THREE from 'three'
import {createApp} from 'vue'
import AvatarDisplay from '@/components/common/AvatarDisplay.vue'

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
            // 创建 Vue 应用实例来获取组件生成的 SVG
            const container = document.createElement('div')
            container.style.position = 'absolute'
            container.style.left = '-9999px'
            container.style.top = '-9999px'
            container.style.width = `${size}px`
            container.style.height = `${size}px`
            container.style.background = 'transparent'
            document.body.appendChild(container)

            // 创建 AvatarDisplay 组件实例
            const app = createApp(AvatarDisplay, {
                ...identity,
                size,
                round: true,
                avatarClass: ''
            })

            // 挂载组件
            const vm = app.mount(container)

            // 等待组件初始化完成
            await new Promise(resolve => setTimeout(resolve, 100))

            // 从组件实例中获取生成的 SVG URL
            const componentInstance = vm.$ as any
            if (componentInstance && componentInstance.setupState && componentInstance.setupState.dicebearAvatarUrl) {
                const svgUrl = componentInstance.setupState.dicebearAvatarUrl

                if (svgUrl) {
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

                            // 清理资源
                            app.unmount()
                            document.body.removeChild(container)

                            resolve(texture)
                            return
                        }
                    }
                    img.onerror = () => {
                        throw new Error('Failed to load SVG image')
                    }
                    img.src = svgUrl
                } else {
                    throw new Error('No SVG URL generated')
                }
            } else {
                throw new Error('Cannot access component instance')
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

