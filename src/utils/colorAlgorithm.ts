/**
 * 颜色算法工具
 * 参考 art-design-pro 的颜色系统设计
 */

// 预设主题色板
export const PRESET_COLORS = {
  // 蓝色系
  blue: {
    primary: '#1890ff',
    light: '#40a9ff',
    lighter: '#69c0ff',
    dark: '#096dd9',
    darker: '#0050b3'
  },
  // 绿色系
  green: {
    primary: '#52c41a',
    light: '#73d13d',
    lighter: '#95de64',
    dark: '#389e0d',
    darker: '#237804'
  },
  // 红色系
  red: {
    primary: '#f5222d',
    light: '#ff4d4f',
    lighter: '#ff7875',
    dark: '#cf1322',
    darker: '#a8071a'
  },
  // 橙色系
  orange: {
    primary: '#fa8c16',
    light: '#ffa940',
    lighter: '#ffc53d',
    dark: '#d46b08',
    darker: '#ad4e00'
  },
  // 紫色系
  purple: {
    primary: '#722ed1',
    light: '#9254de',
    lighter: '#b37feb',
    dark: '#531dab',
    darker: '#391085'
  },
  // 青色系
  cyan: {
    primary: '#13c2c2',
    light: '#36cfc9',
    lighter: '#5cdbd3',
    dark: '#08979c',
    darker: '#006d75'
  },
  // 粉色系
  pink: {
    primary: '#eb2f96',
    light: '#f759ab',
    lighter: '#fadb14',
    dark: '#c41d7f',
    darker: '#9c1356'
  },
  // 黄色系
  yellow: {
    primary: '#fadb14',
    light: '#ffec3d',
    lighter: '#fff566',
    dark: '#d4b106',
    darker: '#ad8b00'
  }
}

// 颜色类型
export type ColorType = keyof typeof PRESET_COLORS
export type ColorShade = 'primary' | 'light' | 'lighter' | 'dark' | 'darker'

// 生成颜色变体
export function generateColorVariants(baseColor: string) {
  const hex = baseColor.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16)
  const g = parseInt(hex.substr(2, 2), 16)
  const b = parseInt(hex.substr(4, 2), 16)

  return {
    primary: baseColor,
    light: lightenColor(r, g, b, 0.2),
    lighter: lightenColor(r, g, b, 0.4),
    dark: darkenColor(r, g, b, 0.2),
    darker: darkenColor(r, g, b, 0.4)
  }
}

// 变亮颜色
function lightenColor(r: number, g: number, b: number, factor: number): string {
  const newR = Math.min(255, r + (255 - r) * factor)
  const newG = Math.min(255, g + (255 - g) * factor)
  const newB = Math.min(255, b + (255 - b) * factor)
  
  return `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`
}

// 变暗颜色
function darkenColor(r: number, g: number, b: number, factor: number): string {
  const newR = Math.max(0, r * (1 - factor))
  const newG = Math.max(0, g * (1 - factor))
  const newB = Math.max(0, b * (1 - factor))
  
  return `#${Math.round(newR).toString(16).padStart(2, '0')}${Math.round(newG).toString(16).padStart(2, '0')}${Math.round(newB).toString(16).padStart(2, '0')}`
}

// 计算颜色对比度
export function getContrastRatio(color1: string, color2: string): number {
  const luminance1 = getLuminance(color1)
  const luminance2 = getLuminance(color2)
  
  const brightest = Math.max(luminance1, luminance2)
  const darkest = Math.min(luminance1, luminance2)
  
  return (brightest + 0.05) / (darkest + 0.05)
}

// 计算颜色亮度
function getLuminance(color: string): number {
  const hex = color.replace('#', '')
  const r = parseInt(hex.substr(0, 2), 16) / 255
  const g = parseInt(hex.substr(2, 2), 16) / 255
  const b = parseInt(hex.substr(4, 2), 16) / 255
  
  const [rs, gs, bs] = [r, g, b].map(c => {
    if (c <= 0.03928) {
      return c / 12.92
    }
    return Math.pow((c + 0.055) / 1.055, 2.4)
  })
  
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
}

// 检查颜色是否适合作为文本颜色
export function isTextColorSuitable(backgroundColor: string, textColor: string = '#ffffff'): boolean {
  const contrastRatio = getContrastRatio(backgroundColor, textColor)
  return contrastRatio >= 4.5 // WCAG AA 标准
}

// 生成语义化颜色
export function generateSemanticColors(primaryColor: string, isDark: boolean = false) {
  const variants = generateColorVariants(primaryColor)
  
  return {
    primary: variants.primary,
    success: isDark ? '#52c41a' : '#52c41a',
    warning: isDark ? '#faad14' : '#faad14',
    error: isDark ? '#ff4d4f' : '#ff4d4f',
    info: isDark ? '#1890ff' : '#1890ff',
    
    // 文本颜色
    text: isDark ? '#ffffff' : '#000000',
    textSecondary: isDark ? '#a8a8a8' : '#666666',
    textDisabled: isDark ? '#666666' : '#999999',
    
    // 背景颜色
    background: isDark ? '#141414' : '#ffffff',
    backgroundSecondary: isDark ? '#1f1f1f' : '#fafafa',
    backgroundTertiary: isDark ? '#262626' : '#f5f5f5',
    
    // 边框颜色
    border: isDark ? '#434343' : '#d9d9d9',
    borderSecondary: isDark ? '#303030' : '#f0f0f0',
    
    // 阴影颜色
    shadow: isDark ? 'rgba(0, 0, 0, 0.45)' : 'rgba(0, 0, 0, 0.15)',
    shadowSecondary: isDark ? 'rgba(0, 0, 0, 0.25)' : 'rgba(0, 0, 0, 0.08)'
  }
}

// 获取预设颜色选项
export function getPresetColorOptions() {
  return Object.entries(PRESET_COLORS).map(([key, colors]) => ({
    label: getColorName(key),
    value: colors.primary,
    colors: colors,
    type: key as ColorType
  }))
}

// 颜色名称映射
function getColorName(type: string): string {
  const nameMap: Record<string, string> = {
    blue: '蓝色',
    green: '绿色',
    red: '红色',
    orange: '橙色',
    purple: '紫色',
    cyan: '青色',
    pink: '粉色',
    yellow: '黄色'
  }
  return nameMap[type] || type
}

// 验证颜色格式
export function isValidColor(color: string): boolean {
  const hexRegex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
  return hexRegex.test(color)
}

// 颜色转换工具
export const ColorUtils = {
  // HEX 转 RGB
  hexToRgb(hex: string): { r: number; g: number; b: number } {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : { r: 0, g: 0, b: 0 }
  },
  
  // RGB 转 HEX
  rgbToHex(r: number, g: number, b: number): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  },
  
  // 调整颜色透明度
  setAlpha(color: string, alpha: number): string {
    const rgb = this.hexToRgb(color)
    return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, ${alpha})`
  }
}
