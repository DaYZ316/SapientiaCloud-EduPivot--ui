/**
 * 状态管理类型定义索引文件
 */

// 声明模块以便TypeScript识别
export interface UserStore {
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
  getUserInfo: () => Promise<boolean>
}

export interface ThemeStore {
  darkMode: boolean
  toggleDarkMode: () => void
} 