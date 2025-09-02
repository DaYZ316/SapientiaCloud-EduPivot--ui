import http from '@/utils/http'
import type {StudentAddDTO, StudentDTO, StudentQueryParams} from '@/types/student'

// 添加新学生
export function addStudent(studentData: StudentAddDTO) {
    return http.post('/student', studentData)
}

// 更新学生信息
export function updateStudent(studentData: StudentDTO) {
    return http.put('/student', studentData)
}

// 批量删除学生
export function batchDeleteStudents(studentIds: string[]) {
    return http.delete('/student', {data: studentIds})
}

// 根据ID获取学生信息
export function getStudentById(id: string) {
    return http.get(`/student/${id}`)
}

// 根据ID删除学生
export function deleteStudentById(id: string) {
    return http.delete(`/student/${id}`)
}

// 获取所有学生
export function getAllStudents() {
    return http.get('/student/all')
}

// 分页查询学生列表
export function getStudentList(params: StudentQueryParams) {
    return http.get('/student/list', {params})
}

// 根据用户ID获取学生信息
export function getStudentByUserId(userId: string) {
    return http.get(`/student/user/${userId}`)
}
