import {defineStore} from 'pinia'
import {generateColorVariants, generateSemanticColors} from '@/utils/colorAlgorithm'

// 主题状态类型
interface ThemeState {
    themeMode: 'light' | 'dark' | 'system'
    primaryColor: string
}

// 主题 Store
export const useThemeStore = defineStore('theme', {
    state: (): ThemeState => ({
        themeMode: localStorage.getItem('themeMode') as 'light' | 'dark' | 'system' || 'light',
        primaryColor: localStorage.getItem('primaryColor') || '#1890ff'
    }),

    getters: {
        isDarkMode(): boolean {
            if (this.themeMode === 'system') {
                return window.matchMedia('(prefers-color-scheme: dark)').matches
            }
            return this.themeMode === 'dark'
        },

        // 根据主题模式自动计算所有颜色
        colors(): Record<string, string> {
            const isDark = this.isDarkMode

            // 使用新的语义化颜色生成
            const semanticColors = generateSemanticColors(this.primaryColor, isDark)

            // 生成主色的变体
            const primaryVariants = generateColorVariants(this.primaryColor)

            return {
                // 主要颜色（用户可自定义）
                primary: this.primaryColor,
                primaryLight: primaryVariants.light,
                primaryLighter: primaryVariants.lighter,
                primaryDark: primaryVariants.dark,
                primaryDarker: primaryVariants.darker,

                // 语义化颜色
                ...semanticColors,

                // 兼容性别名
                success: semanticColors.success,
                warning: semanticColors.warning,
                error: semanticColors.error,
                info: semanticColors.info,

                // 文本颜色
                text: semanticColors.text,
                textSecondary: semanticColors.textSecondary,
                textDisabled: semanticColors.textDisabled,

                // 背景颜色
                background: semanticColors.background,
                backgroundSecondary: semanticColors.backgroundSecondary,
                backgroundTertiary: semanticColors.backgroundTertiary,

                // 边框颜色
                border: semanticColors.border,
                borderSecondary: semanticColors.borderSecondary,

                // 阴影颜色
                shadow: semanticColors.shadow,
                shadowSecondary: semanticColors.shadowSecondary
            }
        }
    },

    actions: {
        // 设置主题模式
        setThemeMode(mode: 'light' | 'dark' | 'system') {
            this.themeMode = mode
            localStorage.setItem('themeMode', mode)

            // 应用主题到文档根元素
            this.applyTheme()
        },

        // 设置主要颜色
        setPrimaryColor(color: string) {
            this.primaryColor = color
            localStorage.setItem('primaryColor', color)

            // 应用颜色到CSS变量
            this.applyColors()
        },

        // 应用主题到文档根元素
        applyTheme() {
            const isDark = this.isDarkMode

            if (isDark) {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }

            // 应用颜色到CSS变量
            this.applyColors()
        },

        // 应用颜色到CSS变量
        applyColors() {
            const colors = this.colors

            // 设置所有颜色变量，保持与CSS变量命名一致
            Object.entries(colors).forEach(([key, value]) => {
                // 转换驼峰命名到短横线命名
                const cssVarName = key.replace(/([A-Z])/g, '-$1').toLowerCase()
                document.documentElement.style.setProperty(`--${cssVarName}-color`, value)
            })

            // 特殊处理primary-color，确保与CSS变量一致
            document.documentElement.style.setProperty('--primary-color', this.primaryColor)

            // 设置CSS自定义属性
            document.documentElement.style.setProperty('--color-primary', this.primaryColor)
            document.documentElement.style.setProperty('--color-primary-light', colors.primaryLight)
            document.documentElement.style.setProperty('--color-primary-dark', colors.primaryDark)
        },

        // 重置所有设置
        resetSettings() {
            this.setThemeMode('system')
            this.setPrimaryColor('#1890ff')
        },

        // 初始化设置
        initSettings() {
            // 检查是否有保存的主题设置
            const savedTheme = localStorage.getItem('themeMode')

            if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
                this.themeMode = savedTheme as 'light' | 'dark' | 'system'
            } else {
                // 如果没有保存的设置或设置无效，默认使用系统主题
                this.themeMode = 'system'
                localStorage.setItem('themeMode', this.themeMode)
            }

            // 应用主题
            this.applyTheme()

            // 监听系统主题变化
            this.setupSystemThemeListener()
        },

        // 设置系统主题监听器
        setupSystemThemeListener() {
            const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')

            const handleChange = () => {
                if (this.themeMode === 'system') {
                    this.applyTheme()
                }
            }

            // 添加监听器
            mediaQuery.addEventListener('change', handleChange)

            // 返回清理函数（如果需要的话）
            return () => {
                mediaQuery.removeEventListener('change', handleChange)
            }
        }
    }
}) 