import type { UserStore, ThemeStore } from './index'

export interface AppStore {
  user: UserStore
  theme: ThemeStore
}