import type { UserStore, ThemeStore } from './index'

declare module '@/store' {
  export function useUserStore(): UserStore
  export function useThemeStore(): ThemeStore
} 