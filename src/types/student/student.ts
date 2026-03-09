/**
 * 学生相关类型定义
 */
import type {PageEntity} from '../common/baseEntity'
import type {AcademicStatusEnum} from '@/enum/student'

/**
 * 学生添加信息数据传输对象
 */
export interface StudentAddDTO {
    /** 学号 */
    studentCode: string | null
    /** 学生真实姓名 */
    realName: string | null
    /** 出生日期 */
    birthDate?: string | null
    /** 入学年份 */
    admissionYear?: number | null
    /** 专业 */
    major?: string | null
    /** 学籍状态 (0=在读, 1=休学, 2=退学, 3=毕业) */
    academicStatus?: AcademicStatusEnum | null
    /** 自我描述 */
    description?: string | null
    /** 系统用户ID */
    sysUserId?: string | null
}

/**
 * 学生信息数据传输对象
 */
export interface StudentDTO {
    /** 学生ID，更新时必须提供 */
    id?: string | null
    /** 学号 */
    studentCode: string | null
    /** 学生真实姓名 */
    realName: string | null
    /** 出生日期 */
    birthDate?: string | null
    /** 入学年份 */
    admissionYear?: number | null
    /** 专业 */
    major?: string | null
    /** 学籍状态 (0=在读, 1=休学, 2=退学, 3=毕业) */
    academicStatus?: AcademicStatusEnum | null
    /** 自我描述 */
    description?: string | null
    /** 系统用户ID */
    sysUserId?: string | null
}

/**
 * 学生视图对象
 */
export interface StudentVO {
    /** 学生ID */
    id: string | null
    /** 学号 */
    studentCode: string | null
    /** 学生真实姓名 */
    realName: string | null
    /** 出生日期 */
    birthDate?: string | null
    /** 入学年份 */
    admissionYear?: number | null
    /** 专业 */
    major?: string | null
    /** 学籍状态 (0=在读, 1=休学, 2=退学, 3=毕业) */
    academicStatus?: AcademicStatusEnum | null
    /** 自我描述 */
    description?: string | null
    /** 系统用户ID */
    sysUserId?: string | null
    /** 用户头像URL */
    avatar?: string | null
    /** 用户名 */
    username?: string | null
    /** 用户昵称 */
    nickName?: string | null
    /** 邮箱 */
    email?: string | null
    /** 手机号 */
    mobile?: string | null
    /** 性别 (0=未知, 1=男, 2=女) */
    gender?: number | null
    /** 状态 (0=正常, 1=停用) */
    status?: number | null
    /** 创建时间 */
    createTime?: string | null
    /** 更新时间 */
    updateTime?: string | null
    /** 最后登录时间 */
    lastLoginTime?: string | null
}

/**
 * 学生查询参数
 */
export interface StudentQueryParams extends PageEntity {
    /** 学号 */
    studentCode?: string | null
    /** 学生真实姓名 */
    realName?: string | null
    /** 入学年份 */
    admissionYear?: string | null
    /** 专业 */
    major?: string | null
    /** 学籍状态 (0=在读, 1=休学, 2=退学, 3=毕业) */
    academicStatus?: string | null
}

/**
 * 学生查询DTO（用于内部接口）
 */
export interface StudentQueryDTO extends PageEntity {
    /** 学号 */
    studentCode?: string | null
    /** 学生真实姓名 */
    realName?: string | null
    /** 入学年份 */
    admissionYear?: number | null
    /** 专业 */
    major?: string | null
    /** 学籍状态 (0=在读, 1=休学, 2=退学, 3=毕业) */
    academicStatus?: AcademicStatusEnum | null
    /** 排序字段 */
    orderBy?: string | null
}

/**
 * 学生布尔结果响应
 */
export interface StudentBooleanResult {
    success: boolean | null
    code: number | null
    message: string | null
    data: boolean | null
}

/**
 * 学生整数结果响应
 */
export interface StudentIntegerResult {
    success: boolean | null
    code: number | null
    message: string | null
    data: number | null
}

/**
 * 学生结果响应
 */
export interface StudentResult {
    success: boolean | null
    code: number | null
    message: string | null
    data: StudentVO | null
}

/**
 * 学生列表响应
 */
export interface StudentListResponse {
    success: boolean | null
    code: number | null
    message: string | null
    data: StudentVO[] | null
}

/**
 * 学生列表结果（分页）
 */
export interface StudentListResult {
    total: number | null
    data: StudentVO[]
    code: number | null
    msg: string | null
}

