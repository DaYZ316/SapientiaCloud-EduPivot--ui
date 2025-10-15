import {defineStore} from 'pinia'

interface MenuState {
    lastAccessedCourse: {
        courseId: string
        courseName: string
    } | null
}

export const useMenuStore = defineStore('menu', {
    state: (): MenuState => ({
        lastAccessedCourse: null
    }),

    getters: {
        // 获取最后访问的课程信息
        getLastAccessedCourse: (state) => state.lastAccessedCourse
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
        }
    }
})
