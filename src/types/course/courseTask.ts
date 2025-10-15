import { TaskDifficultyEnum } from '@/enum/course/taskDifficultyEnum'
import { TaskTypeEnum } from '@/enum/course/taskTypeEnum'
import { TaskStatusEnum } from '@/enum/course/taskStatusEnum'

/**
 * 课程任务数据传输对象
 * 用于任务的新增和更新操作
 */
export interface CourseTaskDTO {
    /** 任务ID，更新时必须提供 */
    id?: string | null
    /** 所属课程ID */
    courseId: string | null
    /** 任务发起人ID */
    sysUserId: string | null
    /** 任务名称 */
    taskName: string | null
    /** 任务描述 */
    description: string | null
    /** 任务类型 */
    taskType: TaskTypeEnum | null
    /** 任务内容 (富文本) */
    taskContent: string | null
    /** 任务附件URL列表 */
    attachmentUrls?: string[] | null
    /** 参考资料URL列表 */
    resourceUrls?: string[] | null
    /** 满分 */
    maxScore: number | null
    /** 任务开始时间 */
    startTime: string | Date | number | null
    /** 任务结束时间 */
    endTime: string | Date | number | null
    /** 是否允许迟交 (0=不允许, 1=允许) */
    allowLateSubmit?: number | null
    /** 最大提交次数 (0=无限制) */
    maxSubmitCount?: number | null
    /** 是否自动评分 (0=手动评分, 1=自动评分) */
    autoGrade?: number | null
    /** 标签列表 */
    tags?: string[] | null
    /** 难度等级 */
    difficulty?: TaskDifficultyEnum | null
    /** 预计完成时间 (分钟) */
    estimatedTime?: number | null
    /** 任务状态 */
    status?: TaskStatusEnum | null
}

/**
 * 课程任务视图对象
 * 用于任务信息的展示
 */
export interface CourseTaskVO {
    /** 任务ID */
    id: string
    /** 所属课程ID */
    courseId: string
    /** 课程名称 */
    courseName?: string
    /** 任务发起人ID */
    sysUserId: string
    /** 任务发起人姓名 */
    teacherName?: string
    /** 任务发起人头像 */
    teacherAvatar?: string
    /** 任务名称 */
    taskName: string
    /** 任务描述 */
    description: string
    /** 任务类型 */
    taskType: TaskTypeEnum
    /** 任务内容 (富文本) */
    taskContent: string
    /** 任务附件URL列表 */
    attachmentUrls?: string[]
    /** 参考资料URL列表 */
    resourceUrls?: string[]
    /** 满分 */
    maxScore: number
    /** 任务开始时间 */
    startTime: string
    /** 任务结束时间 */
    endTime: string
    /** 是否允许迟交 (0=不允许, 1=允许) */
    allowLateSubmit?: number
    /** 最大提交次数 (0=无限制) */
    maxSubmitCount?: number
    /** 是否自动评分 (0=手动评分, 1=自动评分) */
    autoGrade?: number
    /** 标签列表 */
    tags?: string[]
    /** 难度等级 */
    difficulty?: TaskDifficultyEnum
    /** 预计完成时间 (分钟) */
    estimatedTime?: number
    /** 浏览次数 */
    viewCount?: number
    /** 任务状态 */
    status?: TaskStatusEnum
    /** 已提交次数 */
    submitCount?: number
    /** 是否已提交 */
    isSubmitted?: boolean
    /** 提交时间 */
    submitTime?: string
    /** 得分 */
    score?: number
    /** 是否已评分 */
    isGraded?: boolean
    /** 评分时间 */
    gradeTime?: string
    /** 创建时间 */
    createTime?: string
    /** 更新时间 */
    updateTime?: string
}

/**
 * 课程任务查询参数
 * 用于任务列表的分页查询
 */
export interface CourseTaskQueryParams {
    /** 任务名称（模糊查询） */
    taskName?: string | null
    /** 所属课程ID */
    courseId?: string | null
    /** 任务发起人ID */
    sysUserId?: string | null
    /** 任务类型 */
    taskType?: string | null
    /** 任务状态 */
    status?: string | null
    /** 难度等级 */
    difficulty?: string | null
    /** 起始时间 */
    startTime?: string | null
    /** 结束时间 */
    endTime?: string | null
    /** 当前记录起始索引 */
    pageNum?: number
    /** 每页显示记录数 */
    pageSize?: number
    /** 排序字段 */
    orderByColumn?: string | null
    /** 排序的方向，可用值：asc,desc */
    isAsc?: 'asc' | 'desc' | null
    /** 分页参数合理化 */
    reasonable?: boolean | null
}
