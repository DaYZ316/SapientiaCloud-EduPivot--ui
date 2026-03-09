import type {Component} from 'vue'
import {
    BookOutline,
    HomeOutline,
    KeyOutline,
    LibraryOutline,
    PeopleCircleOutline,
    PeopleOutline,
    PersonCircleOutline,
    SchoolOutline,
    SettingsOutline,
    ShieldCheckmarkOutline,
    SparklesOutline
} from '@vicons/ionicons5'

export interface FastEnterApplication {
    nameKey: string
    descriptionKey: string
    icon: Component
    routeName: string
    enabled: boolean
    order: number
}

export interface FastEnterQuickLink {
    nameKey: string
    routeName: string
    enabled: boolean
    order: number
}

const fastEnterConfig = {
    applications: [
        {
            nameKey: 'header.fastEnterDashboard',
            descriptionKey: 'header.fastEnterDashboardDesc',
            icon: HomeOutline,
            routeName: 'Dashboard',
            enabled: true,
            order: 1
        },
        {
            nameKey: 'header.fastEnterAI',
            descriptionKey: 'header.fastEnterAIDesc',
            icon: SparklesOutline,
            routeName: 'AI',
            enabled: true,
            order: 2
        },
        {
            nameKey: 'header.fastEnterMyCourses',
            descriptionKey: 'header.fastEnterMyCoursesDesc',
            icon: BookOutline,
            routeName: 'MyCourses',
            enabled: true,
            order: 3
        },
        {
            nameKey: 'header.fastEnterCourseManagement',
            descriptionKey: 'header.fastEnterCourseManagementDesc',
            icon: LibraryOutline,
            routeName: 'CourseManagement',
            enabled: true,
            order: 4
        },
        {
            nameKey: 'header.fastEnterProfile',
            descriptionKey: 'header.fastEnterProfileDesc',
            icon: PersonCircleOutline,
            routeName: 'Profile',
            enabled: true,
            order: 5
        },
        {
            nameKey: 'header.fastEnterTeacher',
            descriptionKey: 'header.fastEnterTeacherDesc',
            icon: SchoolOutline,
            routeName: 'Teacher',
            enabled: true,
            order: 6
        },
        {
            nameKey: 'header.fastEnterStudent',
            descriptionKey: 'header.fastEnterStudentDesc',
            icon: PeopleCircleOutline,
            routeName: 'Student',
            enabled: true,
            order: 7
        },
        {
            nameKey: 'header.fastEnterUser',
            descriptionKey: 'header.fastEnterUserDesc',
            icon: PeopleOutline,
            routeName: 'User',
            enabled: true,
            order: 8
        },
        {
            nameKey: 'header.fastEnterRole',
            descriptionKey: 'header.fastEnterRoleDesc',
            icon: KeyOutline,
            routeName: 'Role',
            enabled: true,
            order: 9
        },
        {
            nameKey: 'header.fastEnterPermission',
            descriptionKey: 'header.fastEnterPermissionDesc',
            icon: ShieldCheckmarkOutline,
            routeName: 'Permission',
            enabled: true,
            order: 10
        },
        {
            nameKey: 'header.fastEnterSettings',
            descriptionKey: 'header.fastEnterSettingsDesc',
            icon: SettingsOutline,
            routeName: 'Settings',
            enabled: true,
            order: 11
        }
    ],
    quickLinks: [
        {
            nameKey: 'header.fastEnterDashboard',
            routeName: 'Dashboard',
            enabled: true,
            order: 1
        },
        {
            nameKey: 'header.fastEnterMyCourses',
            routeName: 'MyCourses',
            enabled: true,
            order: 2
        },
        {
            nameKey: 'header.fastEnterCourseManagement',
            routeName: 'CourseManagement',
            enabled: true,
            order: 3
        },
        {
            nameKey: 'header.fastEnterProfile',
            routeName: 'Profile',
            enabled: true,
            order: 4
        },
        {
            nameKey: 'header.fastEnterSettings',
            routeName: 'Settings',
            enabled: true,
            order: 5
        }
    ]
}

export default Object.freeze(fastEnterConfig)

