/**
 * 课堂练习相关类型定义
 */
import type {PageEntity} from '../common/baseEntity'
import type {IsRequiredEnum} from '@/enum/classroom/isRequiredEnum'
import type {QuestionVO} from '@/types/course/question'

/**
 * 课堂练习发布与更新DTO
 */
export interface ClassroomQuestionDTO {
    /** 记录ID（更新时必填） */
    id: string | null
    /** 课程ID */
    courseId: string | null
    /** 课堂记录ID */
    classroomId: string | null
    /** 题目ID */
    questionId: string | null
    /** 题目标题 */
    questionTitle: string | null
    /** 发布顺序 */
    publishOrder: number | null
    /** 是否必答 (0=选答,1=必答) */
    isRequired: IsRequiredEnum | null
    /** 题目可作答开始时间 */
    startTime: string | null
    /** 题目作答截止时间 */
    endTime: string | null
}

/**
 * 课堂练习视图对象
 */
export interface ClassroomQuestionVO {
    /** 记录ID */
    id: string
    /** 课程ID */
    courseId: string
    /** 课堂记录ID */
    classroomId: string
    /** 课堂名称 */
    classroomName: string
    /** 题目ID */
    questionId: string
    /** 题目标题 */
    questionTitle: string
    /** 题目详情 */
    questionVO?: QuestionVO | null
    /** 发布顺序 */
    publishOrder: number
    /** 是否必答 (0=选答,1=必答) */
    isRequired: IsRequiredEnum
    /** 题目可作答开始时间 */
    startTime: string
    /** 题目作答截止时间 */
    endTime: string
}

/**
 * 课堂练习分页查询DTO
 */
export interface ClassroomQuestionPageQueryDTO extends PageEntity {
    /** 课程ID */
    courseId?: string | null
    /** 课堂记录ID */
    classroomId?: string | null
}

