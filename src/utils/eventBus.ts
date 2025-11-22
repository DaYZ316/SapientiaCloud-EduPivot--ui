import mitt from 'mitt'

// 定义事件类型
export type EventBusEvents = {
    resetClassroomDetail: void
    selectCourseRecord: { id: string } | null
}

// 创建事件总线实例
const eventBus = mitt<EventBusEvents>()

export default eventBus