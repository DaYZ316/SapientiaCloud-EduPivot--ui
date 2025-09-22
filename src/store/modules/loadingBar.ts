import {defineStore} from 'pinia'
import {getGlobalApis} from '@/utils/naiveUIHelper'

export const useLoadingBarStore = defineStore('loadingBar', {
    state: () => ({
        isLoading: false,
        loadingCount: 0
    }),

    actions: {
        /**
         * 开始加载
         */
        start() {
            this.loadingCount++
            if (!this.isLoading) {
                this.isLoading = true
                const {loadingBar} = getGlobalApis()
                if (loadingBar) {
                    loadingBar.start()
                }
            }
        },

        /**
         * 完成加载
         */
        finish() {
            this.loadingCount = Math.max(0, this.loadingCount - 1)
            if (this.loadingCount === 0 && this.isLoading) {
                this.isLoading = false
                const {loadingBar} = getGlobalApis()
                if (loadingBar) {
                    loadingBar.finish()
                }
            }
        },

        /**
         * 错误加载
         */
        error() {
            this.loadingCount = 0
            this.isLoading = false
            const {loadingBar} = getGlobalApis()
            if (loadingBar) {
                loadingBar.error()
            }
        },

        /**
         * 重置加载状态
         */
        reset() {
            this.loadingCount = 0
            this.isLoading = false
            const {loadingBar} = getGlobalApis()
            if (loadingBar) {
                loadingBar.finish()
            }
        }
    }
})
