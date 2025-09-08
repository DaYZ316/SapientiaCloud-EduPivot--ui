import http from '@/utils/http'
import type {StudentAddDTO, StudentDTO, StudentQueryParams} from '@/types/student'

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
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'create_time',
        isAsc: 'asc'
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

// 分页查询学生列表
export function getStudentList(params: StudentQueryParams) {
    return http.get('/student/list', params)
}

// 获取所有学生
export function getAllStudents() {
    return http.get('/student/all')
}

// 根据ID获取学生信息
export function getStudentById(id: string) {
    return http.get(`/student/${id}`)
}

// 添加新学生
export function addStudent(studentData: StudentAddDTO) {
    return http.post('/student', studentData)
}

// 更新学生信息
export function updateStudent(studentData: StudentDTO) {
    return http.put('/student', studentData)
}

// 根据ID删除学生
export function deleteStudentById(id: string) {
    return http.delete(`/student/${id}`)
}

// 批量删除学生
export function batchDeleteStudents(studentIds: string[]) {
    return http.delete('/student', {data: studentIds})
}

// 根据用户ID获取学生信息
export function getStudentByUserId(userId: string) {
    return http.get(`/student/user/${userId}`)
}
