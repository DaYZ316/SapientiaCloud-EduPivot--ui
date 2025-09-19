/**
 * 颜色算法组合式函数
 * 基于primary颜色生成衍生颜色，参考Ant Design Pro的设计理念
 * 保持颜色本质不变，通过HSL调整明度和饱和度
 */

import { computed } from 'vue'
import { useThemeStore } from '@/store/modules/theme'

/**
 * 颜色算法组合式函数
 */
export function useColorAlgorithm() {
  const themeStore = useThemeStore()

  /**
   * 将十六进制颜色转换为RGB
   */
  function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }

  /**
   * 将RGB转换为十六进制颜色
   */
  function rgbToHex(r: number, g: number, b: number): string {
    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`
  }

  /**
   * 将RGB转换为HSL
   */
  function rgbToHsl(r: number, g: number, b: number): { h: number; s: number; l: number } {
    r /= 255
    g /= 255
    b /= 255
    
    const max = Math.max(r, g, b)
    const min = Math.min(r, g, b)
    const delta = max - min
    
    let h = 0
    let s = 0
    const l = (max + min) / 2
    
    if (delta !== 0) {
      s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min)
      
      if (max === r) {
        h = ((g - b) / delta) % 6
      } else if (max === g) {
        h = (b - r) / delta + 2
      } else {
        h = (r - g) / delta + 4
      }
    }
    
    h = Math.round(h * 60)
    if (h < 0) h += 360
    
    return {
      h,
      s: Math.round(s * 100),
      l: Math.round(l * 100)
    }
  }

  /**
   * 将HSL转换为RGB
   */
  function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
    h /= 360
    s /= 100
    l /= 100
    
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1
      if (t > 1) t -= 1
      if (t < 1/6) return p + (q - p) * 6 * t
      if (t < 1/2) return q
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6
      return p
    }
    
    let r, g, b
    
    if (s === 0) {
      r = g = b = l
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s
      const p = 2 * l - q
      r = hue2rgb(p, q, h + 1/3)
      g = hue2rgb(p, q, h)
      b = hue2rgb(p, q, h - 1/3)
    }
    
    return {
      r: Math.round(r * 255),
      g: Math.round(g * 255),
      b: Math.round(b * 255)
    }
  }

  /**
   * 基于HSL调整颜色亮度（保持色相和饱和度不变）
   */
  function adjustLightness(r: number, g: number, b: number, lightnessDelta: number): string {
    const hsl = rgbToHsl(r, g, b)
    const newLightness = Math.max(0, Math.min(100, hsl.l + lightnessDelta))
    const rgb = hslToRgb(hsl.h, hsl.s, newLightness)
    return rgbToHex(rgb.r, rgb.g, rgb.b)
  }

  /**
   * 基于HSL调整颜色饱和度（保持色相和亮度不变）
   */
  function adjustSaturation(r: number, g: number, b: number, saturationDelta: number): string {
    const hsl = rgbToHsl(r, g, b)
    const newSaturation = Math.max(0, Math.min(100, hsl.s + saturationDelta))
    const rgb = hslToRgb(hsl.h, newSaturation, hsl.l)
    return rgbToHex(rgb.r, rgb.g, rgb.b)
  }

  /**
   * 基于HSL调整色相（保持饱和度和亮度不变）
   */
  function adjustHue(r: number, g: number, b: number, hueDelta: number): string {
    const hsl = rgbToHsl(r, g, b)
    const newHue = (hsl.h + hueDelta) % 360
    const rgb = hslToRgb(newHue < 0 ? newHue + 360 : newHue, hsl.s, hsl.l)
    return rgbToHex(rgb.r, rgb.g, rgb.b)
  }

  /**
   * 生成主题适配的颜色调色板
   * 参考Ant Design Pro的设计理念，保持颜色本质不变
   */
  const themeColorPalette = computed(() => {
    const primaryColor = themeStore.primaryColor
    const rgb = hexToRgb(primaryColor)
    
    if (!rgb) return {
      light: [primaryColor, primaryColor, primaryColor, primaryColor, primaryColor],
      dark: [primaryColor, primaryColor, primaryColor, primaryColor, primaryColor]
    }
    
    const { r, g, b } = rgb
    
    // 亮色主题：保持色相和饱和度，调整亮度
    const lightPalette = [
      adjustLightness(r, g, b, 40),  // 最浅色
      adjustLightness(r, g, b, 20),  // 浅色
      primaryColor,                  // 主色
      adjustLightness(r, g, b, -20), // 深色
      adjustLightness(r, g, b, -40)  // 最深色
    ]
    
    // 暗色主题：保持色相，适度调整饱和度和亮度
    const darkPalette = [
      adjustLightness(r, g, b, 30),  // 最浅色
      adjustLightness(r, g, b, 10),  // 浅色
      primaryColor,                  // 主色
      adjustLightness(r, g, b, -15), // 深色
      adjustLightness(r, g, b, -30)  // 最深色
    ]
    
    return {
      light: lightPalette,
      dark: darkPalette
    }
  })

  /**
   * 生成状态颜色调色板
   */
  const statusColorPalette = computed(() => {
    const primaryColor = themeStore.primaryColor
    const rgb = hexToRgb(primaryColor)
    
    if (!rgb) return {
      success: ['#52c41a', '#52c41a', '#52c41a', '#52c41a', '#52c41a'],
      warning: ['#faad14', '#faad14', '#faad14', '#faad14', '#faad14'],
      error: ['#ff4d4f', '#ff4d4f', '#ff4d4f', '#ff4d4f', '#ff4d4f'],
      info: [primaryColor, primaryColor, primaryColor, primaryColor, primaryColor]
    }
    
    // 成功色：绿色系
    const successRgb = hexToRgb('#52c41a')!
    const successPalette = [
      adjustLightness(successRgb.r, successRgb.g, successRgb.b, 30),
      adjustLightness(successRgb.r, successRgb.g, successRgb.b, 15),
      '#52c41a',
      adjustLightness(successRgb.r, successRgb.g, successRgb.b, -15),
      adjustLightness(successRgb.r, successRgb.g, successRgb.b, -30)
    ]
    
    // 警告色：橙色系
    const warningRgb = hexToRgb('#faad14')!
    const warningPalette = [
      adjustLightness(warningRgb.r, warningRgb.g, warningRgb.b, 30),
      adjustLightness(warningRgb.r, warningRgb.g, warningRgb.b, 15),
      '#faad14',
      adjustLightness(warningRgb.r, warningRgb.g, warningRgb.b, -15),
      adjustLightness(warningRgb.r, warningRgb.g, warningRgb.b, -30)
    ]
    
    // 错误色：红色系
    const errorRgb = hexToRgb('#ff4d4f')!
    const errorPalette = [
      adjustLightness(errorRgb.r, errorRgb.g, errorRgb.b, 30),
      adjustLightness(errorRgb.r, errorRgb.g, errorRgb.b, 15),
      '#ff4d4f',
      adjustLightness(errorRgb.r, errorRgb.g, errorRgb.b, -15),
      adjustLightness(errorRgb.r, errorRgb.g, errorRgb.b, -30)
    ]
    
    // 信息色：基于主色
    const { r, g, b } = rgb
    const infoPalette = [
      adjustLightness(r, g, b, 30),
      adjustLightness(r, g, b, 15),
      primaryColor,
      adjustLightness(r, g, b, -15),
      adjustLightness(r, g, b, -30)
    ]
    
    return {
      success: successPalette,
      warning: warningPalette,
      error: errorPalette,
      info: infoPalette
    }
  })

  /**
   * 生成中性色调色板（用于文本、背景等）
   */
  const neutralColorPalette = computed(() => {
    return {
      light: {
        text: ['#000000', '#262626', '#595959', '#8c8c8c', '#bfbfbf'],
        background: ['#ffffff', '#fafafa', '#f5f5f5', '#f0f0f0', '#d9d9d9'],
        border: ['#d9d9d9', '#f0f0f0', '#e8e8e8', '#d1d1d1', '#bfbfbf']
      },
      dark: {
        text: ['#ffffff', '#f0f0f0', '#d9d9d9', '#a6a6a6', '#737373'],
        background: ['#141414', '#1f1f1f', '#262626', '#2a2a2a', '#434343'],
        border: ['#434343', '#303030', '#3a3a3a', '#4a4a4a', '#595959']
      }
    }
  })

  /**
   * 获取当前主题的颜色
   */
  const getThemeColor = (colorType: 'primary' | 'success' | 'warning' | 'error' | 'info', level: number = 2) => {
    const isDark = themeStore.isDarkMode
    const palette = isDark ? themeColorPalette.value.dark : themeColorPalette.value.light
    
    if (colorType === 'primary') {
      return palette[level - 1] || palette[2]
    }
    
    const statusPalette = statusColorPalette.value[colorType as keyof typeof statusColorPalette.value]
    return statusPalette[level - 1] || statusPalette[2]
  }

  /**
   * 获取中性色
   */
  const getNeutralColor = (type: 'text' | 'background' | 'border', level: number = 2) => {
    const isDark = themeStore.isDarkMode
    const palette = isDark ? neutralColorPalette.value.dark : neutralColorPalette.value.light
    return palette[type][level - 1] || palette[type][2]
  }

  return {
    themeColorPalette,
    statusColorPalette,
    neutralColorPalette,
    getThemeColor,
    getNeutralColor,
    hexToRgb,
    rgbToHex,
    rgbToHsl,
    hslToRgb,
    adjustLightness,
    adjustSaturation,
    adjustHue
  }
}
