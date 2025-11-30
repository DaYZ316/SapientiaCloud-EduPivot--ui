/**
 * 课堂练习相关类型定义
 */
import type {PageEntity} from '../common/baseEntity'
import type {IsRequiredEnum} from '@/enum/classroom/isRequiredEnum'

/**
 * 课堂练习发布与更新DTO
 */
export interface ClassroomQuestionDTO {
    /** 记录ID（更新时必填） */
    id: string | null
    /** 课堂记录ID */
    classroomId: string | null
    /** 题目ID */
    questionId: string | null
    /** 发布顺序 */
    publishOrder: number | null
    /** 题目分值 */
    score: number | null
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
    /** 课堂记录ID */
    classroomId: string
    /** 题目ID */
    questionId: string
    /** 发布顺序 */
    publishOrder: number
    /** 题目分值 */
    score: number
    /** 是否必答 (0=选答,1=必答) */
    isRequired: IsRequiredEnum
    /** 题目可作答开始时间 */
    startTime: string
    /** 题目作答截止时间 */
    endTime: string
    /** 创建时间 */
    createTime: string
    /** 更新时间 */
    updateTime: string
}

/**
 * 课堂练习分页查询DTO
 */
export interface ClassroomQuestionPageQueryDTO extends PageEntity {
    /** 课堂记录ID */
    classroomId?: string | null
}

