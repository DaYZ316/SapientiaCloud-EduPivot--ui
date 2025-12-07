import mitt from 'mitt'
import type {CourseRecordPageQueryDTO} from '@/types/classroom'
import type {ChatSessionVO} from '@/types/celestialHub/chatSession'

// 定义事件类型
export type EventBusEvents = {
    resetClassroomDetail: void
    selectCourseRecord: { id: string } | null
    refreshClassroomHistory: void
    searchCourseRecord: CourseRecordPageQueryDTO
    aiActiveSessionIdChanged: string | number | null
    aiSelectSession: ChatSessionVO
    aiNewChat: void
    aiMyFavorites: void
}

// 创建事件总线实例
const eventBus = mitt<EventBusEvents>()

export default eventBus