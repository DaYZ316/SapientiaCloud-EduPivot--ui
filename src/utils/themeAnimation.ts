import {useThemeStore} from '@/store'

/**
 * 主题切换动画
 * @param e 鼠标点击事件
 */
export const themeAnimation = (e: MouseEvent) => {
    runViewTransition(toggleTheme, e)
}

/**
 * 切换主题
 */
const toggleTheme = () => {
    const themeStore = useThemeStore()
    const currentMode = themeStore.themeMode
    if (currentMode === 'light') {
        themeStore.setThemeMode('dark')
    } else if (currentMode === 'dark') {
        themeStore.setThemeMode('light')
    } else {
        // system模式时根据当前实际状态切换
        themeStore.setThemeMode(themeStore.isDarkMode ? 'light' : 'dark')
    }
}

/**
 * 通用视图过渡动画封装
 * @param action 视图切换逻辑（例如路由跳转或主题切换）
 * @param e 可选的鼠标点击事件，用于确定动画起点
 */
export const runViewTransition = (action: () => void, e?: MouseEvent) => {
    const x = e?.clientX ?? innerWidth / 2
    const y = e?.clientY ?? innerHeight / 2
    const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))

    document.documentElement.style.setProperty('--x', x + 'px')
    document.documentElement.style.setProperty('--y', y + 'px')
    document.documentElement.style.setProperty('--r', endRadius + 'px')

    if (document.startViewTransition) {
        document.startViewTransition(() => action())
    } else {
        action()
    }
}

/**
 * 提升暗黑主题下页面刷新视觉体验
 * @param addClass 是否添加 class
 */
export const setThemeTransitionClass = (addClass: boolean) => {
    const el = document.getElementsByTagName('body')[0]

    if (addClass) {
        el.setAttribute('class', 'theme-change')
    } else {
        setTimeout(() => {
            el.removeAttribute('class')
        }, 300)
    }
}

