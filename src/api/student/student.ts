import http from '@/utils/http'
import type {
    StudentAddDTO,
    StudentBooleanResult,
    StudentDTO,
    StudentIntegerResult,
    StudentListResponse,
    StudentListResult,
    StudentQueryParams,
    StudentResult,
    StudentVO
} from '@/types/student'

// 获取默认学生查询对象
export function getDefaultStudentQuery(): StudentQueryParams {
    return {
        studentCode: null,
        realName: null,
        admissionYear: null,
        major: null,
        academicStatus: null,
        startTime: null,
        endTime: null,
        pageNum: null,
        pageSize: null,
        orderByColumn: null,
        isAsc: null,
        reasonable: null
    }
}

// 获取默认学生添加DTO
export function getDefaultStudentAddDTO(): StudentAddDTO {
    return {
        studentCode: null,
        realName: null,
        birthDate: null,
        admissionYear: null,
        major: null,
        academicStatus: null,
        description: null,
        sysUserId: null
    }
}

// 获取默认学生更新DTO
export function getDefaultStudentDTO(): StudentDTO {
    return {
        id: null,
        studentCode: null,
        realName: null,
        birthDate: null,
        admissionYear: null,
        major: null,
        academicStatus: null,
        description: null,
        sysUserId: null
    }
}

// 获取默认学生VO
export function getDefaultStudentVO(): StudentVO {
    return {
        id: null,
        studentCode: null,
        realName: null,
        birthDate: null,
        admissionYear: null,
        major: null,
        academicStatus: null,
        description: null,
        sysUserId: null,
        avatar: null,
        username: null,
        nickName: null,
        email: null,
        mobile: null,
        gender: null,
        status: null,
        createTime: null,
        updateTime: null,
        lastLoginTime: null
    }
}

// 分页查询学生列表
export function listStudent(params: StudentQueryParams): Promise<StudentListResult> {
    return http.getTableData<StudentVO>('/student/list', params)
}

// 获取所有学生
export function listAllStudent(): Promise<StudentListResponse> {
    return http.get<StudentVO[]>('/student/all')
}

// 根据ID获取学生信息
export function getStudentById(id: string): Promise<StudentResult> {
    return http.get<StudentVO>(`/student/${id}`)
}

// 添加新学生
export function addStudent(studentData: StudentAddDTO): Promise<StudentBooleanResult> {
    return http.post<boolean>('/student', studentData)
}

// 更新学生信息
export function updateStudent(studentData: StudentDTO): Promise<StudentBooleanResult> {
    return http.put<boolean>('/student', studentData)
}

// 根据ID删除学生
export function removeStudentById(id: string): Promise<StudentBooleanResult> {
    return http.delete<boolean>(`/student/${id}`)
}

// 批量删除学生
export function removeStudentByIds(studentIds: string[]): Promise<StudentIntegerResult> {
    return http.delete<number>('/student', {data: studentIds})
}

// 根据用户ID获取学生信息
export function getStudentByUserId(userId: string): Promise<StudentResult> {
    return http.get<StudentVO>(`/student/user/${userId}`)
}

