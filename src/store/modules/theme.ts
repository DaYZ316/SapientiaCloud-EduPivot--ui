import {defineStore} from 'pinia'

// 主题状态类型
interface ThemeState {
    themeMode: 'light' | 'dark'
    primaryColor: string
    defaultPrimaryColor: string
    locale: string
    defaultLocale: string
}

// 主题 Store
export const useThemeStore = defineStore('theme', {
    state: (): ThemeState => ({
        themeMode: localStorage.getItem('themeMode') as 'light' | 'dark' || 'light',
        primaryColor: localStorage.getItem('primaryColor') || '#18a058',
        defaultPrimaryColor: '#18a058',
        locale: localStorage.getItem('locale') || 'zh-CN',
        defaultLocale: 'zh-CN'
    }),

    getters: {
        isDarkMode(): boolean {
            return this.themeMode === 'dark'
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
        },

        // 设置主题颜色
        setPrimaryColor(color: string) {
            this.primaryColor = color
            localStorage.setItem('primaryColor', color)

            // 更新CSS变量
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
            this.setPrimaryColor(this.defaultPrimaryColor)
            this.setLocale(this.defaultLocale)
        },

        // 初始化设置
        initSettings() {
            // 初始化主题模式
            this.setThemeMode(this.themeMode)

            // 初始化主题颜色
            this.setPrimaryColor(this.primaryColor)

            // 初始化语言
            this.setLocale(this.locale)
        }
    }
}) 