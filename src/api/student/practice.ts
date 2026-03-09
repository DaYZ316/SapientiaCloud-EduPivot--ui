import http from '@/utils/http'
import type {
    AnswerPayload,
    PracticeListResult,
    PracticeQueryParams,
    PracticeStatisticsResult,
    PracticeStatisticsVO,
    QuestionStudent,
    QuestionStudentAddDTO,
    QuestionStudentDTO,
    QuestionStudentQueryDTO,
    QuestionStudentListResult,
    QuestionStudentResult,
    QuestionStudentSubmitDTO,
    StudentBooleanResult,
    StudentIntegerResult
} from '@/types/student'

// 获取默认课堂练习查询对象
export function getDefaultPracticeQuery(): PracticeQueryParams {
    return {
        classroomId: null,
        studentId: null,
        questionId: null,
        practiceId: null,
        courseId: null,
        status: null,
        startTime: null,
        endTime: null,
        pageNum: null,
        pageSize: null,
        orderByColumn: null,
        isAsc: null,
        reasonable: null
    }
}

// 获取默认作答内容
export function getDefaultAnswerPayload(): AnswerPayload {
    return {
        content: null,
        options: null,
        blanks: null
    }
}

// 获取默认学生课堂练习提交DTO
export function getDefaultQuestionStudentSubmitDTO(): QuestionStudentSubmitDTO {
    return {
        questionId: null,
        answer: getDefaultAnswerPayload()
    }
}

// 获取默认学生课堂练习新增DTO
export function getDefaultQuestionStudentAddDTO(): QuestionStudentAddDTO {
    return {
        classroomId: null,
        studentId: null,
        questionId: null,
        practiceId: null,
        courseId: null,
        answer: null,
        isCorrect: null,
        score: null,
    }
}

// 获取默认学生课堂练习查询DTO
export function getDefaultQuestionStudentQueryDTO(): QuestionStudentQueryDTO {
    return {
        classroomId: null,
        studentId: null,
        questionId: null,
        practiceId: null,
        courseId: null,
        isCorrect: null,
        startTime: null,
        endTime: null,
        pageNum: null,
        pageSize: null,
        orderByColumn: null,
        isAsc: null,
        reasonable: null
    }
}

// 获取默认学生课堂练习更新DTO
export function getDefaultQuestionStudentDTO(): QuestionStudentDTO {
    return {
        id: null,
        classroomId: null,
        studentId: null,
        questionId: null,
        practiceId: null,
        courseId: null,
        answer: null,
        isCorrect: null,
        score: null,
    }
}

// 获取默认练习统计VO
export function getDefaultPracticeStatisticsVO(): PracticeStatisticsVO {
    return {
        practiceId: null,
        totalQuestions: null,
        correctCount: null,
        incorrectCount: null,
        partialCount: null,
        pendingReviewCount: null,
        averageScore: null
    }
}

// 获取当前学生在课堂中的练习作答记录
export function listMyPracticeByClassroom(classroomId: string): Promise<QuestionStudentListResult> {
    return http.get<QuestionStudent[]>(`/student/practice/me/${classroomId}`)
}

// 提交课堂练习作答（直接走新增接口）
export function submitPractice(
    classroomId: string,
    studentId: string | null,
    payload: QuestionStudentSubmitDTO,
    practiceId?: string | null,
    courseId?: string | null
): Promise<StudentBooleanResult> {
    const data = getDefaultQuestionStudentAddDTO()
    data.classroomId = classroomId
    data.studentId = studentId
    data.questionId = payload.questionId
    data.practiceId = practiceId ?? null
    data.courseId = courseId ?? null
    data.answer = payload.answer
    return addPractice(data)
}

// 获取当前学生的练习汇总
export function summaryMyPractice(): Promise<QuestionStudentListResult> {
    return http.get<QuestionStudent[]>('/student/practice/summary/me')
}

// 新增课堂练习作答记录
export function addPractice(data: QuestionStudentAddDTO): Promise<StudentBooleanResult> {
    return http.post<boolean>('/student/practice', data)
}

// 更新课堂练习作答记录
export function updatePractice(data: QuestionStudentDTO): Promise<StudentBooleanResult> {
    return http.put<boolean>('/student/practice', data)
}

// 批量删除课堂练习作答记录
export function removePracticeByIds(ids: string[]): Promise<StudentIntegerResult> {
    return http.delete<number>('/student/practice', {data: ids})
}

// 根据ID获取课堂练习作答记录
export function getPracticeById(id: string): Promise<QuestionStudentResult> {
    return http.get<QuestionStudent>(`/student/practice/${id}`)
}

// 根据ID删除课堂练习作答记录
export function removePracticeById(id: string): Promise<StudentBooleanResult> {
    return http.delete<boolean>(`/student/practice/${id}`)
}

// 获取全部课堂练习作答记录
export function listAllPractice(): Promise<QuestionStudentListResult> {
    return http.get<QuestionStudent[]>('/student/practice/all')
}

// 分页查询课堂练习作答记录
export function listPractice(params: PracticeQueryParams): Promise<PracticeListResult> {
    return http.getTableData<QuestionStudent>('/student/practice/list', params)
}

// 根据课堂ID和学生ID查询练习作答记录
export function listPracticeByClassroomAndStudent(
    classroomId: string,
    studentId: string
): Promise<QuestionStudentListResult> {
    return http.get<QuestionStudent[]>(`/student/practice/classroom/${classroomId}/student/${studentId}`)
}

// 根据练习ID查询练习作答记录
export function listPracticeByPracticeId(practiceId: string): Promise<QuestionStudentListResult> {
    return http.get<QuestionStudent[]>(`/student/practice/practice/${practiceId}`)
}

// 根据课程ID查询练习作答记录
export function listPracticeByCourseId(courseId: string): Promise<QuestionStudentListResult> {
    return http.get<QuestionStudent[]>(`/student/practice/course/${courseId}`)
}

// 获取练习统计信息
export function getPracticeStatistics(practiceId: string): Promise<PracticeStatisticsResult> {
    return http.get<PracticeStatisticsVO>(`/student/practice/statistics/${practiceId}`)
}

// 根据练习ID和学生ID查询课堂练习作答记录
export function listPracticeByPracticeAndStudent(
    practiceId: string,
    studentId: string
): Promise<QuestionStudentListResult> {
    return http.get<QuestionStudent[]>(`/student/practice/practice/${practiceId}/student/${studentId}`)
}

