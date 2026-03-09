import {createApp} from 'vue'
import App from '@/App.vue'
import router from '@/router'
import pinia, {useThemeStore} from '@/store'

// 导入全局样式
import '@/assets/styles/index.scss'

// 导入naive-ui的全部组件
import naive from 'naive-ui'

// 导入i18n
import i18n from '@/i18n'

// 导入标题工具
import {TitleUtil} from '@/utils'

// 导入自定义组件
import PageTable from '@/components/common/PageTable.vue'

// 导入权限指令
import hasPermission from '@/utils/permissionUtil'

// 导入naiveUIHelper
import naiveUIHelper from '@/utils/naiveUIHelper'

// 创建Vue应用实例
const app = createApp(App)

// 先注册Pinia状态管理
app.use(pinia)

// 先注册i18n，确保语言设置正确
app.use(i18n)

// 初始化标题工具
TitleUtil.init(i18n)

// 获取主题信息
const themeStore = useThemeStore()

// 初始化主题设置
themeStore.initSettings()

// 注册路由
app.use(router)

// 全局注册naive-ui
app.use(naive)

// 注册naiveUIHelper
app.use(naiveUIHelper)

// 全局注册自定义组件
app.component('PageTable', PageTable)

// 注册全局指令
app.directive('hasPermission', hasPermission)

// 挂载应用
app.mount('#app')
