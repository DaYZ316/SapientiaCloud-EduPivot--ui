import type {ThemeStore, UserStore} from './index'

export interface AppStore {
  user: UserStore
  theme: ThemeStore
}