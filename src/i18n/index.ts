import { createI18n } from 'vue-i18n'
import zh from './locales/zh-CN/index'
import en from './locales/en-US/index'
import { useStorage } from '@vueuse/core'

// 创建存储语言偏好的本地存储
const defaultLocale = useStorage('language', 'zh-CN')

const messages = {
  'zh-CN': zh,
  'en-US': en
}

// 创建i18n实例
const i18n = createI18n({
  legacy: false, // 使用组合式API
  locale: defaultLocale.value,
  fallbackLocale: 'zh-CN', // 降级语言
  messages,
  globalInjection: true, // 全局注册$t方法
})

// 提供切换语言的函数
export function setLanguage(locale: string) {
  i18n.global.locale.value = locale
  defaultLocale.value = locale
  // 设置HTML的lang属性
  document.querySelector('html')?.setAttribute('lang', locale)
}

// 初始化HTML的lang属性
document.querySelector('html')?.setAttribute('lang', defaultLocale.value)

export default i18n 