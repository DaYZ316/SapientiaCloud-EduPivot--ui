import mitt from 'mitt'
import type {CourseRecordPageQueryDTO} from '@/types/classroom'

// 定义事件类型
export type EventBusEvents = {
    resetClassroomDetail: void
    selectCourseRecord: { id: string } | null
    refreshClassroomHistory: void
    searchCourseRecord: CourseRecordPageQueryDTO
}

// 创建事件总线实例
const eventBus = mitt<EventBusEvents>()

export default eventBus