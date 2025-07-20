/**
 * vue-i18n类型声明扩展
 */

// 类型定义
export interface I18nComposer {
  t: (key: string) => string
  locale: {
    value: string
  }
  d: (value: any, options?: any) => string
  n: (value: any, options?: any) => string
}

export interface I18nGlobal {
  global: {
    t: (key: string) => string
    locale: {
      value: string
    }
  }
}

export interface ComposerCustomProperties {
  t: (key: string) => string
}

export interface VueI18n {
  t: (key: string) => string
} 