import zhCN from './locales/zh-CN'

export type MessageSchema = typeof zhCN
export type Locale = 'zh-CN' | 'en-US'

// 声明模块扩展
declare module 'vue-i18n' {
  // 定义组合式API类型
  export interface ComposerCustomProperties {
    t: (key: string) => string
  }
  
  // 定义模板内的类型
  export interface VueI18n {
    t: (key: string) => string
  }
} 