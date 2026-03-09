import {useI18n} from 'vue-i18n'

/**
 * 页面标题工具类
 */
export class TitleUtil {
    private static i18n: any = null

    /**
     * 初始化i18n实例
     */
    static init(i18nInstance: any) {
        this.i18n = i18nInstance
    }

    /**
     * 设置页面标题
     * @param titleKey 标题键名，对应i18n中的路径
     * @param customTitle 自定义标题，用于动态标题（如课程详情页面）
     */
    static setTitle(titleKey: string = 'default', customTitle?: string) {
        if (!this.i18n) {
            return
        }

        try {
            const projectName = this.i18n.global.t('app.name')
            let pageTitle: string

            if (customTitle) {
                // 如果有自定义标题，直接使用
                pageTitle = customTitle
            } else {
                // 获取页面标题
                pageTitle = this.i18n.global.t(`app.title.${titleKey}`)

                if (pageTitle === `app.title.${titleKey}`) {
                    // 如果找不到对应的翻译，使用默认标题
                    pageTitle = this.i18n.global.t('app.title.default')
                }
            }

            // 格式：页面标题 - 项目名称
            document.title = `${pageTitle} - ${projectName}`
        } catch (error) {
            // 降级处理：使用默认标题
            try {
                const defaultTitle = this.i18n.global.t('app.title.default')
                const projectName = this.i18n.global.t('app.name')
                document.title = `${defaultTitle} - ${projectName}`
            } catch (fallbackError) {
                document.title = 'SapientiaCloud EduPivot'
            }
        }
    }

    /**
     * 根据路由路径设置标题
     * @param path 路由路径
     */
    static setTitleByPath(path: string) {
        // 移除开头的斜杠
        const cleanPath = path.replace(/^\//, '')

        // 根据路径映射到对应的标题键
        const pathToTitleMap: Record<string, string> = {
            '': 'default',
            'dashboard': 'dashboard',
            'profile': 'profile',
            'settings': 'settings',
            'auth': 'login',
            'auth/login': 'login',
            'auth/register': 'register',
            'auth/verification-code-login': 'verificationCodeLogin',
            'system/user': 'system.user',
            'system/role': 'system.role',
            'system/permission': 'system.permission',
            'info/teacher': 'infoManagement.teacher',
            'info/student': 'infoManagement.student',
            'course': 'course.course',
            'course/my-courses': 'course.myCourses',
            'course/detail': 'course.courseDetail'
        }

        // 处理课程详情子页面
        if (cleanPath.startsWith('course/detail/')) {
            const pathParts = cleanPath.split('/')
            if (pathParts.length >= 4) {
                const subPage = pathParts[3]
                switch (subPage) {
                    case 'chapters':
                        return this.setTitle('course.courseChapters')
                    case 'forum':
                        return this.setTitle('course.courseForum')
                    case 'students':
                        return this.setTitle('course.courseStudents')
                    case 'classroom':
                        return this.setTitle('course.courseClassroom')
                    case 'control':
                        return this.setTitle('course.courseChapterControl')
                    default:
                        return this.setTitle('course.courseDetail')
                }
            }
            return this.setTitle('course.courseDetail')
        }

        const titleKey = pathToTitleMap[cleanPath] || 'default'
        this.setTitle(titleKey)
    }

    /**
     * 更新页面标题（用于语言切换时）
     */
    static updateTitle() {
        // 获取当前路径
        const currentPath = window.location.pathname
        this.setTitleByPath(currentPath)
    }
}

/**
 * 组合式API的标题设置函数
 */
export function useTitle() {
    const {t} = useI18n()

    const setTitle = (titleKey: string = 'default', customTitle?: string) => {
        try {
            const projectName = t('app.name')
            let pageTitle: string

            if (customTitle) {
                // 如果有自定义标题，直接使用
                pageTitle = customTitle
            } else {
                // 获取页面标题
                pageTitle = t(`app.title.${titleKey}`)

                if (pageTitle === `app.title.${titleKey}`) {
                    // 如果找不到对应的翻译，使用默认标题
                    pageTitle = t('app.title.default')
                }
            }

            // 格式：页面标题 - 项目名称
            document.title = `${pageTitle} - ${projectName}`
        } catch (error) {
            document.title = 'SapientiaCloud EduPivot'
        }
    }

    const setTitleByPath = (path: string) => {
        const cleanPath = path.replace(/^\//, '')

        const pathToTitleMap: Record<string, string> = {
            '': 'default',
            'dashboard': 'dashboard',
            'profile': 'profile',
            'settings': 'settings',
            'auth': 'login',
            'auth/login': 'login',
            'auth/register': 'register',
            'auth/verification-code-login': 'verificationCodeLogin',
            'system/user': 'system.user',
            'system/role': 'system.role',
            'system/permission': 'system.permission',
            'info/teacher': 'infoManagement.teacher',
            'info/student': 'infoManagement.student',
            'course': 'course.course',
            'course/my-courses': 'course.myCourses',
            'course/detail': 'course.courseDetail'
        }

        // 处理课程详情子页面
        if (cleanPath.startsWith('course/detail/')) {
            const pathParts = cleanPath.split('/')
            if (pathParts.length >= 4) {
                const subPage = pathParts[3]
                switch (subPage) {
                    case 'chapters':
                        return setTitle('course.courseChapters')
                    case 'forum':
                        return setTitle('course.courseForum')
                    case 'students':
                        return setTitle('course.courseStudents')
                    case 'classroom':
                        return setTitle('course.courseClassroom')
                    case 'control':
                        return setTitle('course.courseChapterControl')
                    default:
                        return setTitle('course.courseDetail')
                }
            }
            return setTitle('course.courseDetail')
        }

        const titleKey = pathToTitleMap[cleanPath] || 'default'
        setTitle(titleKey)
    }

    return {
        setTitle,
        setTitleByPath
    }
}
