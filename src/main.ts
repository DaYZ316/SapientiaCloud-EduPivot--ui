import { createApp } from 'vue'
import App from '@/App.vue'
import router from '@/router'
import pinia from '@/store'
import '@/assets/styles/global.scss'

// 导入naive-ui的全部组件
import naive from 'naive-ui'
import { darkTheme, createDiscreteApi } from 'naive-ui'

// 导入i18n
import i18n from '@/i18n'

// 导入HTTP消息处理
import { setMessageInstance, setDialogInstance } from '@/utils/http'
import { useThemeStore } from '@/store'

// 导入自定义组件
import PageTable from '@/components/common/PageTable.vue'

// 导入权限指令
import hasPermission from '@/utils/permissionUtil'

// 创建Vue应用实例
const app = createApp(App)

// 先注册Pinia状态管理，以便于获取主题信息
app.use(pinia)

// 获取主题信息
const themeStore = useThemeStore()

// 初始化全局消息实例和对话框实例，支持主题变化
const { message, dialog, notification } = createDiscreteApi(
  ['message', 'dialog', 'notification'],
  {
    configProviderProps: {
      theme: themeStore.isDarkMode ? darkTheme : null,
      themeOverrides: {
        common: {
          primaryColor: themeStore.primaryColor,
          primaryColorHover: themeStore.primaryColor,
          primaryColorPressed: themeStore.primaryColor,
        }
      }
    }
  }
)

// 设置全局消息和对话框实例
setMessageInstance(message)
setDialogInstance(dialog)

// 监听主题变化并更新消息实例和对话框实例
themeStore.$subscribe((_mutation, state) => {
  const { message: newMessage, dialog: newDialog } = createDiscreteApi(
    ['message', 'dialog'],
    {
      configProviderProps: {
        theme: themeStore.isDarkMode ? darkTheme : null,
        themeOverrides: {
          common: {
            primaryColor: state.primaryColor,
            primaryColorHover: state.primaryColor,
            primaryColorPressed: state.primaryColor,
          }
        }
      }
    }
  )
  setMessageInstance(newMessage)
  setDialogInstance(newDialog)
})

// 注册路由
app.use(router)

// 全局注册naive-ui
app.use(naive)

// 注册i18n
app.use(i18n)

// 全局注册自定义组件
app.component('PageTable', PageTable)

// 注册全局指令
app.directive('hasPermission', hasPermission)

// 挂载应用
app.mount('#app')
