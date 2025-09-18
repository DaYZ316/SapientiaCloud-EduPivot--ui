// 教师信息数据传输对象
export interface TeacherDTO {
    id?: string | null
    teacherCode: string | null
    employeeId?: string | null
    realName: string | null
    birthDate?: string | null
    department?: string | null
    education?: number | null // 0=专科, 1=本科, 2=硕士, 3=博士
    specialization?: string | null
    description?: string | null
    sysUserId?: string | null
    createTime?: string | null
    updateTime?: string | null
}

// 教师添加信息数据传输对象
export interface TeacherAddDTO {
    teacherCode: string | null
    employeeId?: string | null
    realName: string | null
    birthDate?: string | null
    department?: string | null
    education?: number | null
    specialization?: string | null
    description?: string | null
    sysUserId?: string | null
}

// 教师视图对象
export interface TeacherVO {
    id: string | null
    teacherCode: string | null
    employeeId?: string | null
    realName: string | null
    birthDate?: string | null
    department?: string | null
    education?: number | null // 0=专科, 1=本科, 2=硕士, 3=博士
    specialization?: string | null
    description?: string | null
    sysUserId?: string | null
    avatar?: string | null
    username?: string | null
    nickName?: string | null
    email?: string | null
    mobile?: string | null
    gender?: number | null // 0=未知, 1=男, 2=女
    status?: number | null // 0=正常, 1=停用
    createTime: string | null
    updateTime: string | null
    lastLoginTime?: string | null
}

// 教师查询参数
export interface TeacherQueryParams {
    teacherCode?: string | null
    realName?: string | null
    department?: string | null
    education?: string | null
    specialization?: string | null
    startTime?: string | null
    endTime?: string | null
    pageNum?: number
    pageSize?: number
    orderByColumn?: string | null
    isAsc?: string | null
    reasonable?: string | null
}

// 重新导出学历枚举，保持向后兼容
export {EducationEnum as Education} from '@/enum/teacher';
export {educationLabelMap as EducationLabels} from '@/enum/teacher';