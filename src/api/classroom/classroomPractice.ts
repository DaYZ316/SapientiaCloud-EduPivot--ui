import http from '@/utils/http'
import type {ClassroomQuestionDTO, ClassroomQuestionPageQueryDTO, ClassroomQuestionVO} from '@/types/classroom'

// 获取默认课堂练习DTO
export function getDefaultClassroomQuestionDTO(): ClassroomQuestionDTO {
    return {
        id: null,
        courseId: null,
        classroomId: null,
        questionId: null,
        questionTitle: null,
        publishOrder: null,
        isRequired: null,
        startTime: null,
        endTime: null
    }
}

// 获取默认课堂练习分页查询DTO
export function getDefaultClassroomQuestionPageQueryDTO(): ClassroomQuestionPageQueryDTO {
    return {
        classroomId: null,
        courseId: null,
        title: null,
        isRequired: null,
        pageNum: 1,
        pageSize: 10,
        orderByColumn: null,
        isAsc: 'asc',
        reasonable: null
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

// 批量同步课堂练习题目（新增缺失、删除多余）
export function syncClassroomPractice(dtoList: ClassroomQuestionDTO[]) {
    return http.post<ClassroomQuestionVO[]>('/classroom/classroom-practice/sync', dtoList)
}

// 根据课堂ID查询所有已发布练习
export function listByClassroomId(classroomId: string) {
    return http.get<ClassroomQuestionVO[]>(`/classroom/classroom-practice/classroom/${classroomId}`)
}

// 根据条件分页查询课堂内练习发布记录
export function listClassroomPractice(params: ClassroomQuestionPageQueryDTO) {
    return http.getTableData<ClassroomQuestionVO>('/classroom/classroom-practice/list', params)
}

// 根据课程ID查询所有课堂练习
export function listClassroomQuestion(courseId: string) {
    return http.get<ClassroomQuestionVO[]>(`/classroom/classroom-practice/course/${courseId}`)
}

// 获取课堂内所有学生练习作答记录（教师统计）
export function listStudentSubmissions(classroomId: string) {
    return http.get<any[]>(`/classroom/classroom-practice/submissions/${classroomId}`)
}

