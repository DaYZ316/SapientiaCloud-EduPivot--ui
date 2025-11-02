import {createPinia} from 'pinia'

// 创建Pinia实例
const pinia = createPinia()

// 导出Pinia实例
export default pinia

// 导出各个模块的Store
export * from './modules/user'
export * from './modules/theme'
export * from './modules/menu'
export * from './modules/loadingBar'
export * from './modules/course'
export * from './modules/transition' 
