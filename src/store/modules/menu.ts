import {defineStore} from 'pinia'
import type {MenuOption} from '@/config/menu'

interface MenuState {
    lastAccessedCourse: {
        courseId: string
        courseName: string
    } | null
    dynamicMenuItems: MenuOption[]
}

export const useMenuStore = defineStore('menu', {
    state: (): MenuState => ({
        lastAccessedCourse: null,
        dynamicMenuItems: []
    }),

    getters: {
        // 获取最后访问的课程信息
        getLastAccessedCourse: (state) => state.lastAccessedCourse,
        // 获取动态菜单项
        getDynamicMenuItems: (state) => state.dynamicMenuItems
    },

    actions: {
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
        },

        // 添加动态菜单项（如文件预览）
        addDynamicMenuItem(menuOption: MenuOption) {
            if (!menuOption) {
                return
            }
            const existingIndex = this.dynamicMenuItems.findIndex(item => item.key === menuOption.key)
            if (existingIndex > -1) {
                this.dynamicMenuItems.splice(existingIndex, 1, menuOption)
            } else {
                this.dynamicMenuItems.push(menuOption)
            }
        },

        // 移除动态菜单项
        removeDynamicMenuItem(key: string) {
            if (!key) {
                return
            }
            this.dynamicMenuItems = this.dynamicMenuItems.filter(item => item.key !== key)
        }
    }
})
