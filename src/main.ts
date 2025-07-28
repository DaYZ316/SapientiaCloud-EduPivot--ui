import {createApp} from 'vue'
import App from '@/App.vue'
import router from '@/router'

// 导入Pinia状态管理
import pinia from '@/store'

// 导入naive-ui的全部组件
import naive from 'naive-ui'

// 导入i18n
import i18n from '@/i18n'

// 导入自定义组件
import PageTable from '@/components/common/PageTable.vue'

// 导入权限指令
import hasPermission from '@/utils/permissionUtil'

// 导入naiveUIHelper
import naiveUIHelper from '@/utils/naiveUIHelper'

// 创建Vue应用实例
const app = createApp(App)

// 先注册Pinia状态管理，以便于获取主题信息
app.use(pinia)

// 注册路由
app.use(router)

// 全局注册naive-ui
app.use(naive)

// 注册naiveUIHelper
app.use(naiveUIHelper)

// 注册i18n
app.use(i18n)

// 全局注册自定义组件
app.component('PageTable', PageTable)

// 注册全局指令
app.directive('hasPermission', hasPermission)

// 挂载应用
app.mount('#app')
