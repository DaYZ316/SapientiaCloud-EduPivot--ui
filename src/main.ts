import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import pinia from '@/store'
import '@/assets/styles/global.scss'

// 导入naive-ui的全部组件
import naive from 'naive-ui'

// 导入i18n
import i18n from '@/i18n'

// 导入HTTP消息处理
import { setMessageInstance } from '@/utils/http'
import { createDiscreteApi } from 'naive-ui'

// 创建Vue应用实例
const app = createApp(App)

// 初始化全局消息实例
const { message } = createDiscreteApi(['message'])
setMessageInstance(message)

// 注册Pinia状态管理
app.use(pinia)

// 注册路由
app.use(router)

// 全局注册naive-ui
app.use(naive)

// 注册i18n
app.use(i18n)

// 挂载应用
app.mount('#app')
