/**
 * 饼图组件类型定义
 */

// 饼图数据项
export interface PieChartDataItem {
  value: number
  name: string
  itemStyle?: {
    color?: string
  }
}

// 饼图配置选项
export interface PieChartOptions {
  // 图表标题
  title?: string
  // 图表数据
  data: PieChartDataItem[]
  // 主色调
  primaryColor?: string
  // 是否显示图例
  showLegend?: boolean
  // 是否显示标签
  showLabel?: boolean
  // 饼图半径
  radius?: [string, string]
  // 是否启用暗色主题
  dark?: boolean
  // 自定义颜色数组
  colors?: string[]
}

// 饼图组件Props
export interface PieChartProps {
  // 图表配置
  options: PieChartOptions
  // 图表宽度
  width?: string | number
  // 图表高度
  height?: string | number
  // 是否自适应容器大小
  autoResize?: boolean
}
