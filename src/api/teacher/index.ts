import http from '@/utils/http'
import type {TeacherAddDTO, TeacherDTO, TeacherQueryParams} from '@/types/teacher'

// 添加新教师
export function addTeacher(teacherData: TeacherAddDTO) {
    return http.post('/teacher', teacherData)
}

// 更新教师信息
export function updateTeacher(teacherData: TeacherDTO) {
    return http.put('/teacher', teacherData)
}

// 批量删除教师
export function batchDeleteTeachers(teacherIds: string[]) {
    return http.delete('/teacher', {data: teacherIds})
}

// 根据ID获取教师信息
export function getTeacherById(id: string) {
    return http.get(`/teacher/${id}`)
}

// 根据ID删除教师
export function deleteTeacherById(id: string) {
    return http.delete(`/teacher/${id}`)
}

// 获取所有教师
export function getAllTeachers() {
    return http.get('/teacher/all')
}

// 分页查询教师列表
export function getTeacherList(params: TeacherQueryParams) {
    return http.get('/teacher/list', {params})
}

// 根据用户ID获取教师信息
export function getTeacherByUserId(userId: string) {
    return http.get(`/teacher/user/${userId}`)
}
