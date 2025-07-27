/// <reference types="vite/client" />

// 声明模块
declare module '*.vue' {
    import type {DefineComponent} from 'vue'
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/ban-types
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 声明缺少类型定义的模块
declare module '@vicons/ionicons5';
