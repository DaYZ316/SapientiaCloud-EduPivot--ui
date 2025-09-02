// 教师信息数据传输对象
export interface TeacherDTO {
    id?: string
    teacherCode: string
    realName: string
    birthDate?: string
    department?: string
    education?: number // 0=专科, 1=本科, 2=硕士, 3=博士
    specialization?: string
    description?: string
    sysUserId?: string
    createTime?: string
    updateTime?: string
}

// 教师添加信息数据传输对象
export interface TeacherAddDTO {
    teacherCode: string
    realName: string
    birthDate?: string
    department?: string
    education?: number
    specialization?: string
    description?: string
    sysUserId?: string
}

// 教师视图对象
export interface TeacherVO extends TeacherDTO {
    id: string
    createTime: string
    updateTime: string
}

// 教师查询参数
export interface TeacherQueryParams {
    teacherCode?: string
    realName?: string
    department?: string
    education?: string
    specialization?: string
    startTime?: string
    endTime?: string
    pageNum?: string
    pageSize?: string
    orderByColumn?: string
    isAsc?: string
    reasonable?: string
}

// 学历枚举
export enum Education {
    COLLEGE = 0,     // 专科
    BACHELOR = 1,    // 本科
    MASTER = 2,      // 硕士
    DOCTOR = 3       // 博士
}

// 学历标签映射
export const EducationLabels: Record<Education, string> = {
    [Education.COLLEGE]: '专科',
    [Education.BACHELOR]: '本科',
    [Education.MASTER]: '硕士',
    [Education.DOCTOR]: '博士'
}
