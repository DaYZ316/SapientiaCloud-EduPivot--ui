// 全局挂载message辅助函数
// 定义全局Naive API类型
export interface GlobalNaiveAPI {
    $message: any
    $dialog: any
    $notification: any
    $loadingBar: any
}

// 将类型添加到全局Window对象
declare global {
    interface Window extends GlobalNaiveAPI {
    }
}

// 全局API实例存储
let messageApi: any = null
let dialogApi: any = null
let notificationApi: any = null
let loadingBarApi: any = null

/**
 * 设置全局API实例
 * 这些API实例会在App.vue中通过MessageProvider等组件提供
 */
export function setGlobalApis(apis: {
    message?: any
    dialog?: any
    notification?: any
    loadingBar?: any
}) {
    if (apis.message) {
        messageApi = apis.message
        window.$message = messageApi
    }
    if (apis.dialog) {
        dialogApi = apis.dialog
        window.$dialog = dialogApi
    }
    if (apis.notification) {
        notificationApi = apis.notification
        window.$notification = notificationApi
    }
    if (apis.loadingBar) {
        loadingBarApi = apis.loadingBar
        window.$loadingBar = loadingBarApi
    }
}

/**
 * 获取全局API实例
 * 在组件内部，你可以这样使用:
 *
 * import { getGlobalApis } from '@/utils/naiveUIHelper'
 * const { message } = getGlobalApis()
 * if (message) message.success('成功')
 */
export function getGlobalApis() {
    return {
        message: messageApi || window.$message || null,
        dialog: dialogApi || window.$dialog || null,
        notification: notificationApi || window.$notification || null,
        loadingBar: loadingBarApi || window.$loadingBar || null
    }
}

/**
 * 检查API是否已初始化
 */
export function isApiInitialized(): boolean {
    return !!(messageApi || window.$message)
}

/**
 * 兼容旧的函数名
 */
export function getDiscreteApi() {
    return getGlobalApis()
}

/**
 * Vue插件安装函数
 */
export default {
    install() {
        // 插件安装时不需要做任何事情
        // API实例会通过Provider组件在App.vue中设置
    }
}
