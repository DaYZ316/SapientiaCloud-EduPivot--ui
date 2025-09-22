import {defineStore} from 'pinia'
import type {MenuOption} from '@/config/menu'

interface MenuState {
    dynamicMenuItems: MenuOption[]
}

export const useMenuStore = defineStore('menu', {
    state: (): MenuState => ({
        dynamicMenuItems: []
    }),

    getters: {
        // 获取所有动态菜单项
        getDynamicMenuItems: (state): MenuOption[] => state.dynamicMenuItems
    },

    actions: {
        // 添加动态菜单项
        addDynamicMenuItem(menuItem: MenuOption) {
            // 检查是否已存在相同key的菜单项
            const existingIndex = this.dynamicMenuItems.findIndex(item => item.key === menuItem.key)
            if (existingIndex !== -1) {
                // 如果存在，更新它
                this.dynamicMenuItems[existingIndex] = menuItem
            } else {
                // 如果不存在，添加新的
                this.dynamicMenuItems.push(menuItem)
            }
        },

        // 移除动态菜单项
        removeDynamicMenuItem(key: string) {
            const index = this.dynamicMenuItems.findIndex(item => item.key === key)
            if (index !== -1) {
                this.dynamicMenuItems.splice(index, 1)
            }
        },

        // 清空所有动态菜单项
        clearDynamicMenuItems() {
            this.dynamicMenuItems = []
        }
    }
})
