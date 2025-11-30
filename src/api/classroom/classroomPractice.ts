import http from '@/utils/http'
import type {
    ClassroomQuestionDTO,
    ClassroomQuestionPageQueryDTO,
    ClassroomQuestionVO
} from '@/types/classroom'
import type {TableDataResult} from '@/types/common/baseEntity'

// 获取默认课堂练习DTO
export function getDefaultClassroomQuestionDTO(): ClassroomQuestionDTO {
    return {
        id: null,
        classroomId: null,
        questionId: null,
        publishOrder: null,
        score: null,
        isRequired: null,
        startTime: null,
        endTime: null
    }
}

// 更新课堂练习题目配置
export function updateClassroomPractice(data: ClassroomQuestionDTO) {
    return http.put<boolean>('/classroom/classroom-practice', data)
}

// 删除课堂已发布的练习题目
export function removeClassroomPractice(id: string) {
    return http.delete<boolean>(`/classroom/classroom-practice/${id}`)
}

// 发布课堂练习题目
export function addClassroomPractice(data: ClassroomQuestionDTO) {
    return http.post<ClassroomQuestionVO>('/classroom/classroom-practice/add', data)
}

// 根据课堂ID查询所有已发布练习
export function listByClassroomId(classroomId: string) {
    return http.get<ClassroomQuestionVO[]>(`/classroom/classroom-practice/classroom/${classroomId}`)
}

// 根据条件分页查询课堂内练习发布记录
export function listClassroomPractice(params: ClassroomQuestionPageQueryDTO) {
    return http.get<TableDataResult<ClassroomQuestionVO>>('/classroom/classroom-practice/list', params)
}

// 获取课堂内所有学生练习作答记录（教师统计）
export function listStudentSubmissions(classroomId: string) {
    return http.get<any[]>(`/classroom/classroom-practice/submissions/${classroomId}`)
}

