import {defineStore} from 'pinia'
import type {MenuOption} from '@/config/menu'

interface MenuState {
    dynamicMenuItems: MenuOption[]
    lastAccessedCourse: {
        courseId: string
        courseName: string
    } | null
}

export const useMenuStore = defineStore('menu', {
    state: (): MenuState => ({
        dynamicMenuItems: [],
        lastAccessedCourse: null
    }),

    getters: {
        // 获取所有动态菜单项
        getDynamicMenuItems: (state): MenuOption[] => state.dynamicMenuItems,

        // 获取最后访问的课程信息
        getLastAccessedCourse: (state) => state.lastAccessedCourse
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
        },

        // 设置最后访问的课程信息
        setLastAccessedCourse(courseId: string, courseName: string) {
            this.lastAccessedCourse = {
                courseId,
                courseName
            }
            // 持久化存储到localStorage
            localStorage.setItem('lastAccessedCourse', JSON.stringify(this.lastAccessedCourse))
        },

        // 从localStorage加载最后访问的课程信息
        loadLastAccessedCourse() {
            try {
                const stored = localStorage.getItem('lastAccessedCourse')
                if (stored) {
                    this.lastAccessedCourse = JSON.parse(stored)
                }
            } catch (error) {
                // 如果解析失败，清空存储
                localStorage.removeItem('lastAccessedCourse')
                this.lastAccessedCourse = null
            }
        },

        // 清除最后访问的课程信息
        clearLastAccessedCourse() {
            this.lastAccessedCourse = null
            localStorage.removeItem('lastAccessedCourse')
        }
    }
})
