import http from '@/utils/http'
import type {ClassroomQuestionDTO, ClassroomQuestionPageQueryDTO, ClassroomQuestionVO} from '@/types/classroom'
import type {TableDataResult} from '@/types/common/baseEntity'

// 获取默认课堂练习DTO
export function getDefaultClassroomQuestionDTO(): ClassroomQuestionDTO {
    return {
        id: null,
        classroomId: null,
        questionId: null,
        questionTitle: null,
        publishOrder: null,
        isRequired: null,
        startTime: null,
        endTime: null,
        status: null
    }
}

// 获取默认课堂练习分页查询DTO
export function getDefaultClassroomQuestionPageQueryDTO(): ClassroomQuestionPageQueryDTO {
    return {
        classroomId: null,
        startTime: null,
        endTime: null,
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
    const queryParams: Record<string, any> = {};
    if (params.classroomId !== null && params.classroomId !== undefined) {
        queryParams.classroomId = params.classroomId;
    }
    if (params.pageNum !== null && params.pageNum !== undefined) {
        queryParams.pageNum = params.pageNum;
    }
    if (params.pageSize !== null && params.pageSize !== undefined) {
        queryParams.pageSize = params.pageSize;
    }
    if (params.isAsc !== null && params.isAsc !== undefined) {
        queryParams.isAsc = params.isAsc;
    }
    if (params.orderByColumn !== null && params.orderByColumn !== undefined) {
        queryParams.orderByColumn = params.orderByColumn;
    }
    if (params.startTime !== null && params.startTime !== undefined) {
        queryParams.startTime = params.startTime;
    }
    if (params.endTime !== null && params.endTime !== undefined) {
        queryParams.endTime = params.endTime;
    }
    if (params.reasonable !== null && params.reasonable !== undefined) {
        queryParams.reasonable = params.reasonable;
    }
    return http.get<TableDataResult<ClassroomQuestionVO>>('/classroom/classroom-practice/list', queryParams)
}

// 获取课堂内所有学生练习作答记录（教师统计）
export function listStudentSubmissions(classroomId: string) {
    return http.get<any[]>(`/classroom/classroom-practice/submissions/${classroomId}`)
}

