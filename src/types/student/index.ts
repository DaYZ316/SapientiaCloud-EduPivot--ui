// 学生信息数据传输对象
export interface StudentDTO {
    id?: string | null
    studentCode: string | null
    realName: string | null
    birthDate?: string | null
    admissionYear?: number | null
    major?: string | null
    academicStatus?: number | null // 0=在读, 1=休学, 2=退学, 3=毕业
    description?: string | null
    sysUserId?: string | null
    createTime?: string | null
    updateTime?: string | null
}

// 学生添加信息数据传输对象
export interface StudentAddDTO {
    studentCode: string | null
    realName: string | null
    birthDate?: string | null
    admissionYear?: number | null
    major?: string | null
    academicStatus?: number | null
    description?: string | null
    sysUserId?: string | null
}

// 学生视图对象
export interface StudentVO {
    id: string
    studentCode: string
    realName: string
    birthDate?: string | null
    admissionYear?: number | null
    major?: string | null
    academicStatus?: number | null // 0=在读, 1=休学, 2=退学, 3=毕业
    description?: string | null
    sysUserId?: string | null
    avatar?: string | null
    username?: string | null
    nickName?: string | null
    email?: string | null
    mobile?: string | null
    gender?: number | null // 0=未知, 1=男, 2=女
    status?: number | null // 0=正常, 1=停用
    createTime: string
    updateTime: string
}

// 学生查询参数
export interface StudentQueryParams {
    studentCode?: string | null
    realName?: string | null
    admissionYear?: string | null
    major?: string | null
    academicStatus?: string | null
    startTime?: string | null
    endTime?: string | null
    pageNum?: number
    pageSize?: number
    orderByColumn?: string | null
    isAsc?: string | null
    reasonable?: string | null
}

// 重新导出学籍状态枚举，保持向后兼容
export {AcademicStatusEnum as AcademicStatus} from '@/enum/student';
export {academicStatusLabelMap as AcademicStatusLabels} from '@/enum/student';
