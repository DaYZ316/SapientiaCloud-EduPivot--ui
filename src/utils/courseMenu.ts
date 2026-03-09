import {Router} from 'vue-router'
import {useMenuStore} from '@/store'

/**
 * 课程菜单处理工具函数
 */
export class CourseMenuHandler {
    private router: Router
    private menuStore: ReturnType<typeof useMenuStore>

    constructor(router: Router, menuStore: ReturnType<typeof useMenuStore>) {
        this.router = router
        this.menuStore = menuStore
    }

    /**
     * 处理课程相关菜单选择
     * @param key 菜单项key
     * @returns 是否处理了该菜单项
     */
    handleCourseMenuSelect(key: string): boolean {
        const courseMenuKeys = ['CourseDetail', 'CourseOverview', 'CourseChapters', 'CourseForum', 'CourseStudents', 'CourseClassroom', 'CourseTasks', 'CourseQuestions', 'CoursePractice']

        if (!courseMenuKeys.includes(key)) {
            return false
        }

        const lastCourse = this.menuStore.getLastAccessedCourse
        if (!lastCourse) {
            // 如果没有最后访问的课程，跳转到课程列表
            this.router.push('/course/my-courses')
            return true
        }

        // 根据不同的子菜单项跳转到对应的页面
        switch (key) {
            case 'CourseDetail':
                this.router.push(`/course/detail/${lastCourse.courseId}`)
                break
            case 'CourseOverview':
                this.router.push(`/course/detail/${lastCourse.courseId}`)
                break
            case 'CourseChapters':
                this.router.push(`/course/detail/${lastCourse.courseId}/chapters`)
                break
            case 'CourseForum':
                this.router.push(`/course/detail/${lastCourse.courseId}/forum`)
                break
            case 'CourseStudents':
                this.router.push(`/course/detail/${lastCourse.courseId}/students`)
                break
            case 'CourseClassroom':
                this.router.push(`/course/detail/${lastCourse.courseId}/classroom`)
                break
            case 'CourseTasks':
                this.router.push(`/course/detail/${lastCourse.courseId}/tasks`)
                break
            case 'CourseQuestions':
                this.router.push(`/course/detail/${lastCourse.courseId}/questions`)
                break
            case 'CoursePractice':
                this.router.push(`/course/detail/${lastCourse.courseId}/practice`)
                break
        }

        return true
    }
}

/**
 * 创建课程菜单处理器实例
 * @param router Vue Router实例
 * @param menuStore 菜单Store
 * @returns 课程菜单处理器实例
 */
export function createCourseMenuHandler(router: Router, menuStore: ReturnType<typeof useMenuStore>) {
    return new CourseMenuHandler(router, menuStore)
}
