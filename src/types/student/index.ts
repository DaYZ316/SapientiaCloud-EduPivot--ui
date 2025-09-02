// 学生信息数据传输对象
export interface StudentDTO {
    id?: string
    studentCode: string
    realName: string
    birthDate?: string
    admissionYear?: number
    major?: string
    academicStatus?: number // 0=在读, 1=休学, 2=退学, 3=毕业
    description?: string
    sysUserId?: string
    createTime?: string
    updateTime?: string
}

// 学生添加信息数据传输对象
export interface StudentAddDTO {
    studentCode: string
    realName: string
    birthDate?: string
    admissionYear?: number
    major?: string
    academicStatus?: number
    description?: string
    sysUserId?: string
}

// 学生视图对象
export interface StudentVO extends StudentDTO {
    id: string
    createTime: string
    updateTime: string
}

// 学生查询参数
export interface StudentQueryParams {
    studentCode?: string
    realName?: string
    admissionYear?: string
    major?: string
    academicStatus?: string
    startTime?: string
    endTime?: string
    pageNum?: string
    pageSize?: string
    orderByColumn?: string
    isAsc?: string
    reasonable?: string
}

// 学籍状态枚举
export enum AcademicStatus {
    ENROLLED = 0,    // 在读
    SUSPENDED = 1,   // 休学
    DROPPED = 2,     // 退学
    GRADUATED = 3    // 毕业
}

// 学籍状态标签映射
export const AcademicStatusLabels: Record<AcademicStatus, string> = {
    [AcademicStatus.ENROLLED]: '在读',
    [AcademicStatus.SUSPENDED]: '休学',
    [AcademicStatus.DROPPED]: '退学',
    [AcademicStatus.GRADUATED]: '毕业'
}
