# 颜色系统说明

## 概述

本项目采用了参考 art-design-pro 设计的现代化颜色系统，提供了完整的颜色管理解决方案，包括预设颜色、动态颜色生成、主题切换等功能。

## 核心特性

### 1. 预设颜色系统
- **8种基础色系**：蓝色、绿色、红色、橙色、紫色、青色、粉色、黄色
- **5个色阶**：primary（主色）、light（浅色）、lighter（更浅）、dark（深色）、darker（更深）
- **专业配色**：基于设计系统的最佳实践，确保视觉和谐

### 2. 智能颜色算法
- **自动变体生成**：根据主色自动计算浅色和深色变体
- **对比度计算**：符合 WCAG AA 标准的对比度检测
- **颜色验证**：HEX 格式验证和颜色有效性检查

### 3. 主题系统
- **亮色/暗色主题**：支持系统主题检测和手动切换
- **语义化颜色**：自动生成 success、warning、error、info 等语义颜色
- **动态CSS变量**：实时更新 CSS 自定义属性

## 文件结构

```
src/
├── utils/
│   └── colorAlgorithm.ts          # 颜色算法核心
├── components/
│   └── common/
│       ├── ColorPicker.vue        # 颜色选择器组件
│       └── ThemePreview.vue       # 主题预览组件
├── store/
│   └── modules/
│       └── theme.ts               # 主题状态管理
└── assets/
    └── styles/
        └── index.scss             # 全局样式和CSS变量
```

## 使用方法

### 1. 基础颜色选择

```vue
<template>
  <ColorPicker
    v-model="primaryColor"
    :show-variants="true"
    :show-preview="true"
    :show-info="true"
    @change="handleColorChange"
  />
</template>

<script setup>
import ColorPicker from '@/components/common/ColorPicker.vue'
import { ref } from 'vue'

const primaryColor = ref('#1890ff')

const handleColorChange = (color) => {
  console.log('选择的颜色:', color)
}
</script>
```

### 2. 主题管理

```typescript
import { useThemeStore } from '@/store'

const themeStore = useThemeStore()

// 切换主题模式
themeStore.setThemeMode('dark')

// 设置主色
themeStore.setPrimaryColor('#52c41a')

// 获取当前颜色
const colors = themeStore.colors
console.log(colors.primary)        // 主色
console.log(colors.primaryLight)   // 浅色变体
console.log(colors.primaryDark)    // 深色变体
```

### 3. 颜色算法使用

```typescript
import { 
  generateColorVariants, 
  getContrastRatio,
  PRESET_COLORS 
} from '@/utils/colorAlgorithm'

// 生成颜色变体
const variants = generateColorVariants('#1890ff')
console.log(variants.light)   // 浅色
console.log(variants.dark)    // 深色

// 计算对比度
const contrast = getContrastRatio('#1890ff', '#ffffff')
console.log('对比度:', contrast)

// 获取预设颜色
const blueColors = PRESET_COLORS.blue
console.log(blueColors.primary)  // #1890ff
```

## 预设颜色

| 色系 | 主色 | 浅色 | 深色 | 说明 |
|------|------|------|------|------|
| 蓝色 | #1890ff | #40a9ff | #096dd9 | 品牌主色，适合主要操作 |
| 绿色 | #52c41a | #73d13d | #389e0d | 成功状态，表示操作成功 |
| 红色 | #f5222d | #ff4d4f | #cf1322 | 错误状态，表示操作失败 |
| 橙色 | #fa8c16 | #ffa940 | #d46b08 | 警告状态，表示需要注意 |
| 紫色 | #722ed1 | #9254de | #531dab | 特殊状态，表示特殊信息 |
| 青色 | #13c2c2 | #36cfc9 | #08979c | 信息状态，表示一般信息 |
| 粉色 | #eb2f96 | #f759ab | #c41d7f | 强调色，用于特殊强调 |
| 黄色 | #fadb14 | #ffec3d | #d4b106 | 提示色，用于提示信息 |

## CSS 变量

系统会自动生成以下 CSS 变量：

```css
:root {
  /* 主色系 */
  --primary-color: #1890ff;
  --color-primary: #1890ff;
  --color-primary-light: #40a9ff;
  --color-primary-dark: #096dd9;
  
  /* 语义颜色 */
  --success-color: #52c41a;
  --warning-color: #fa8c16;
  --error-color: #f5222d;
  --info-color: #1890ff;
  
  /* 文本颜色 */
  --text-color: #000000;
  --text-secondary-color: #666666;
  --text-disabled-color: #999999;
  
  /* 背景颜色 */
  --background-color: #ffffff;
  --background-secondary-color: #fafafa;
  --background-tertiary-color: #f5f5f5;
  
  /* 边框颜色 */
  --border-color: #d9d9d9;
  --border-secondary-color: #f0f0f0;
  
  /* 阴影颜色 */
  --shadow-color: rgba(0, 0, 0, 0.15);
  --shadow-secondary-color: rgba(0, 0, 0, 0.08);
}
```

## 最佳实践

### 1. 颜色选择
- 优先使用预设颜色，确保设计一致性
- 自定义颜色时注意对比度，确保可读性
- 考虑无障碍设计，符合 WCAG 标准

### 2. 主题切换
- 在应用启动时自动检测系统主题
- 提供手动切换选项，尊重用户偏好
- 保存用户选择，下次访问时自动应用

### 3. 性能优化
- 颜色计算使用计算属性，避免重复计算
- CSS 变量更新使用批量操作，减少重绘
- 颜色变体缓存，避免重复生成

## 扩展开发

### 1. 添加新颜色
在 `colorAlgorithm.ts` 中添加新的预设颜色：

```typescript
export const PRESET_COLORS = {
  // ... 现有颜色
  newColor: {
    primary: '#your-color',
    light: '#your-light-color',
    darker: '#your-dark-color'
  }
}
```

### 2. 自定义颜色算法
扩展颜色生成函数：

```typescript
export function generateCustomColors(baseColor: string) {
  // 自定义颜色生成逻辑
  return {
    custom1: lightenColor(baseColor, 0.1),
    custom2: darkenColor(baseColor, 0.1)
  }
}
```

### 3. 新增主题模式
在主题存储中添加新的主题模式：

```typescript
interface ThemeState {
  themeMode: 'light' | 'dark' | 'custom'
  // ... 其他属性
}
```

## 技术实现

### 1. 颜色算法
- **HSL 转换**：使用 RGB 到 HSL 的转换进行颜色调整
- **对比度计算**：基于 WCAG 2.0 标准的对比度算法
- **颜色验证**：正则表达式验证 HEX 格式

### 2. 状态管理
- **Pinia Store**：使用 Pinia 进行主题状态管理
- **响应式更新**：Vue 3 响应式系统自动更新 UI
- **持久化存储**：localStorage 保存用户偏好

### 3. 组件设计
- **组合式 API**：Vue 3 Composition API 实现
- **TypeScript**：完整的类型定义和类型安全
- **模块化**：组件功能模块化，易于维护和扩展

## 浏览器兼容性

- **现代浏览器**：Chrome 88+, Firefox 85+, Safari 14+, Edge 88+
- **CSS 变量**：支持 CSS 自定义属性的浏览器
- **ES6+ 特性**：支持现代 JavaScript 特性的浏览器

## 总结

这个颜色系统为项目提供了：
1. **专业的设计基础**：基于 art-design-pro 的成熟设计系统
2. **灵活的配置选项**：支持预设颜色和自定义颜色
3. **智能的算法支持**：自动生成颜色变体和计算对比度
4. **完整的主题管理**：支持亮色/暗色主题切换
5. **良好的开发体验**：TypeScript 支持和完善的文档

通过这个系统，开发者可以轻松创建美观、一致且符合无障碍标准的用户界面。
