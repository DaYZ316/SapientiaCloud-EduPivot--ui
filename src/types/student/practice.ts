/**
 * 学生课堂练习相关类型定义
 */
import type {PageEntity} from '../common/baseEntity'

/**
 * 作答内容
 */
export interface AnswerPayload {
    /** 作答内容 */
    content?: string | null
    /** 选项列表 */
    options?: string[] | null
    /** 填空题答案列表 */
    blanks?: string[] | null
}

/**
 * 课堂练习作答新增DTO
 */
export interface QuestionStudentAddDTO {
    /** 课堂记录ID */
    classroomId: string | null
    /** 学生ID */
    studentId: string | null
    /** 题目ID */
    questionId: string | null
    /** 练习ID */
    practiceId: string | null
    /** 课程ID */
    courseId: string | null
    /** 作答内容 */
    answer?: AnswerPayload | null
    /** 是否正确 */
    isCorrect?: number | null
    /** 得分 */
    score?: number | null
}

/**
 * 课堂练习作答查询DTO
 */
export interface QuestionStudentQueryDTO extends PageEntity {
    /** 课堂记录ID */
    classroomId?: string | null
    /** 学生ID */
    studentId?: string | null
    /** 题目ID */
    questionId?: string | null
    /** 练习ID */
    practiceId?: string | null
    /** 课程ID */
    courseId?: string | null
    /** 是否正确（0-错误，1-正确，2-半对，3-待批阅） */
    isCorrect?: number | null
}

/**
 * 课堂练习作答更新DTO
 */
export interface QuestionStudentDTO {
    /** 作答记录ID */
    id: string | null
    /** 课堂记录ID */
    classroomId: string | null
    /** 学生ID */
    studentId: string | null
    /** 题目ID */
    questionId: string | null
    /** 练习ID */
    practiceId: string | null
    /** 课程ID */
    courseId: string | null
    /** 作答内容 */
    answer?: AnswerPayload | null
    /** 是否正确 */
    isCorrect?: number | null
    /** 得分 */
    score?: number | null
}

/**
 * 课堂练习作答视图对象
 */
export interface QuestionStudentVO {
    /** 作答记录ID */
    id: string | null
    /** 课堂记录ID */
    classroomId: string | null
    /** 学生ID */
    studentId: string | null
    /** 学生真实姓名 */
    studentRealName?: string | null
    /** 题目ID */
    questionId: string | null
    /** 练习ID */
    practiceId: string | null
    /** 课程ID */
    courseId: string | null
    /** 作答内容 */
    answer?: AnswerPayload | null
    /** 是否正确 */
    isCorrect?: number | null
    /** 得分 */
    score?: number | null
    /** 创建时间 */
    createTime?: string | null
    /** 更新时间 */
    updateTime?: string | null
}

/**
 * 课堂练习查询参数
 */
export interface PracticeQueryParams extends PageEntity {
    /** 课堂记录ID */
    classroomId?: string | null
    /** 学生ID */
    studentId?: string | null
    /** 题目ID */
    questionId?: string | null
    /** 练习ID */
    practiceId?: string | null
    /** 课程ID */
    courseId?: string | null
    /** 状态 */
    status?: string | null
    /** 是否正确（0-错误，1-正确，2-半对，3-待批阅） */
    isCorrect?: number | null
}

/**
 * 课堂练习提交DTO
 */
export interface QuestionStudentSubmitDTO {
    /** 题目ID */
    questionId: string | null
    /** 作答内容 */
    answer: AnswerPayload | null
}

/**
 * 课堂练习结果响应
 */
export interface QuestionStudentResult {
    success: boolean | null
    code: number | null
    message: string | null
    data: QuestionStudentVO | null
}

/**
 * 课堂练习列表响应
 */
export interface QuestionStudentListResult {
    success: boolean | null
    code: number | null
    message: string | null
    data: QuestionStudentVO[] | null
}

/**
 * 课堂练习列表结果（分页）
 */
export interface PracticeListResult {
    total: number | null
    data: QuestionStudentVO[]
    code: number | null
    msg: string | null
}

/**
 * 练习统计VO
 */
export interface PracticeStatisticsVO {
    /** 练习ID */
    practiceId: string | null
    /** 题目总数 */
    totalQuestions: number | null
    /** 正确数量 */
    correctCount: number | null
    /** 错误数量 */
    incorrectCount: number | null
    /** 半对数量 */
    partialCount: number | null
    /** 待批阅数量 */
    pendingReviewCount: number | null
    /** 题目平均分 */
    averageScore: number | null
}

/**
 * 练习统计结果响应
 */
export interface PracticeStatisticsResult {
    success: boolean | null
    code: number | null
    message: string | null
    data: PracticeStatisticsVO | null
}

/**
 * 课堂练习类型别名（用于兼容）
 */
export type QuestionStudent = QuestionStudentVO

