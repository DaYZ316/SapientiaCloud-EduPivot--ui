import {defineStore} from 'pinia'

// 主题状态类型
interface ThemeState {
    themeMode: 'light' | 'dark'
    locale: string
    defaultLocale: string
}

// 主题 Store
export const useThemeStore = defineStore('theme', {
    state: (): ThemeState => ({
        themeMode: localStorage.getItem('themeMode') as 'light' | 'dark' || 'light',
        locale: localStorage.getItem('locale') || 'zh-CN',
        defaultLocale: 'zh-CN'
    }),

    getters: {
        isDarkMode(): boolean {
            return this.themeMode === 'dark'
        },
        // 根据主题模式自动计算主颜色
        primaryColor(): string {
            return this.themeMode === 'dark' ? '#FFFFFF' : '#B8860B'
        }
    },

    actions: {
        // 设置主题模式
        setThemeMode(mode: 'light' | 'dark') {
            this.themeMode = mode
            localStorage.setItem('themeMode', mode)

            // 根据主题模式设置文档根元素属性
            if (mode === 'dark') {
                document.documentElement.classList.add('dark')
            } else {
                document.documentElement.classList.remove('dark')
            }

            // 自动更新主颜色
            this.updatePrimaryColor()
        },

        // 更新主颜色CSS变量
        updatePrimaryColor() {
            const color = this.primaryColor
            document.documentElement.style.setProperty('--primary-color', color)
        },

        // 设置语言
        setLocale(locale: string) {
            this.locale = locale
            localStorage.setItem('locale', locale)
        },

        // 重置所有设置
        resetSettings() {
            this.setThemeMode('light')
            this.setLocale(this.defaultLocale)
        },

        // 初始化设置
        initSettings() {
            // 清理旧的颜色设置
            localStorage.removeItem('primaryColor')
            
            // 初始化主题模式
            this.setThemeMode(this.themeMode)

            // 初始化语言
            this.setLocale(this.locale)
        }
    }
}) 