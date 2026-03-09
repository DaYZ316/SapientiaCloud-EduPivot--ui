import http from '@/utils/http'
import type {TeacherAddDTO, TeacherDTO, TeacherQueryParams, TeacherVO} from '@/types/teacher'

// 获取默认教师查询对象
export function getDefaultTeacherQuery(): TeacherQueryParams {
    return {
        teacherCode: null,
        realName: null,
        department: null,
        education: null,
        specialization: null,
        startTime: null,
        endTime: null,
        pageNum: 1,
        pageSize: 10,
        orderByColumn: 'create_time',
        isAsc: 'asc'
    }
}

// 获取默认教师添加DTO
export function getDefaultTeacherAddDTO(): TeacherAddDTO {
    return {
        teacherCode: null,
        realName: null,
        birthDate: null,
        department: null,
        education: null,
        specialization: null,
        description: null,
        sysUserId: null
    }
}

// 获取默认教师更新DTO
export function getDefaultTeacherDTO(): TeacherDTO {
    return {
        id: null,
        teacherCode: null,
        realName: null,
        birthDate: null,
        department: null,
        education: null,
        specialization: null,
        description: null,
        sysUserId: null
    }
}

// 获取默认教师VO
export function getDefaultTeacherVO(): TeacherVO {
    return {
        id: null,
        teacherCode: null,
        realName: null,
        birthDate: null,
        department: null,
        education: null,
        specialization: null,
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

// 分页查询教师列表
export function listTeacher(params: TeacherQueryParams) {
    return http.getTableData('/teacher/list', params)
}

// 获取所有教师
export function listAllTeacher() {
    return http.get('/teacher/all')
}

// 根据ID获取教师信息
export function getTeacherById(id: string) {
    return http.get(`/teacher/${id}`)
}

// 添加新教师
export function addTeacher(teacherData: TeacherAddDTO) {
    return http.post('/teacher', teacherData)
}

// 更新教师信息
export function updateTeacher(teacherData: TeacherDTO) {
    return http.put('/teacher', teacherData)
}

// 根据ID删除教师
export function removeTeacherById(id: string) {
    return http.delete(`/teacher/${id}`)
}

// 批量删除教师
export function removeTeacherByIds(teacherIds: string[]) {
    return http.delete('/teacher', {data: teacherIds})
}

// 根据用户ID获取教师信息
export function getTeacherByUserId(userId: string) {
    return http.get(`/teacher/user/${userId}`)
}
