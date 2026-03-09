import { ref, onBeforeUnmount } from 'vue'

export interface ResourceManagerResult {
  registerResource: (resource: any, cleanup?: () => void) => () => void
  registerTimer: (timer: number) => () => void
  registerMediaStream: (stream: MediaStream) => () => void
  registerEventListener: (target: any, event: string, handler: Function) => () => void
  cleanupAll: () => void
  getResourceCount: () => number
}

export interface ResourceManagerOptions {
  autoCleanup?: boolean
}

export const useResourceManager = (options: ResourceManagerOptions = {}): ResourceManagerResult => {
  const autoCleanup = options.autoCleanup !== false
  // 资源存储
  const resources = ref<Map<any, () => void>>(new Map())
  const timers = ref<Set<number>>(new Set())
  const mediaStreams = ref<Set<MediaStream>>(new Set())
  const eventListeners = ref<Map<any, Map<string, Function>>>(new Map())

  // 注册通用资源
  const registerResource = (resource: any, cleanup?: () => void): (() => void) => {
    let cleanupFn: () => void

    if (cleanup) {
      cleanupFn = cleanup
    } else {
      // 根据资源类型提供默认清理逻辑
      cleanupFn = () => {
        if (resource && typeof resource.cleanup === 'function') {
          resource.cleanup()
        } else if (resource && typeof resource.disconnect === 'function') {
          resource.disconnect()
        } else if (resource && typeof resource.close === 'function') {
          resource.close()
        }
      }
    }

    resources.value.set(resource, cleanupFn)

    // 返回注销函数
    return () => {
      resources.value.delete(resource)
    }
  }

  // 注册定时器
  const registerTimer = (timer: number): (() => void) => {
    timers.value.add(timer)

    return () => {
      timers.value.delete(timer)
      clearTimeout(timer)
      clearInterval(timer)
    }
  }

  // 注册媒体流
  const registerMediaStream = (stream: MediaStream): (() => void) => {
    mediaStreams.value.add(stream)

    return () => {
      mediaStreams.value.delete(stream)
      stream.getTracks().forEach(track => {
        track.stop()
      })
    }
  }

  // 注册事件监听器
  const registerEventListener = (target: any, event: string, handler: Function): (() => void) => {
    if (!eventListeners.value.has(target)) {
      eventListeners.value.set(target, new Map())
    }

    const targetListeners = eventListeners.value.get(target)!
    if (targetListeners.has(event)) {
      // 移除旧的监听器（兼容 DOM 和 EventEmitter）
      const oldHandler = targetListeners.get(event)
      if (oldHandler) {
        if (typeof target.removeEventListener === 'function') {
          target.removeEventListener(event, oldHandler)
        } else if (typeof target.off === 'function') {
          target.off(event, oldHandler)
        }
      }
    }

    targetListeners.set(event, handler)

    // 绑定事件，优先支持 DOM EventTarget，再支持 EventEmitter(on/off)
    if (typeof target.addEventListener === 'function') {
      target.addEventListener(event, handler)
    } else if (typeof target.on === 'function') {
      target.on(event, handler)
    } else {
      // 目标不支持事件绑定，静默忽略
    }

    return () => {
      if (targetListeners.has(event)) {
        const savedHandler = targetListeners.get(event)
        if (savedHandler) {
          if (typeof target.removeEventListener === 'function') {
            target.removeEventListener(event, savedHandler)
          } else if (typeof target.off === 'function') {
            target.off(event, savedHandler)
          }
        }
        targetListeners.delete(event)
      }

      if (targetListeners.size === 0) {
        eventListeners.value.delete(target)
      }
    }
  }

  // 清理所有资源
  const cleanupAll = (): void => {
    // 清理定时器
    timers.value.forEach(timer => {
      clearTimeout(timer)
      clearInterval(timer)
    })
    timers.value.clear()

    // 清理媒体流
    mediaStreams.value.forEach(stream => {
      stream.getTracks().forEach(track => {
        track.stop()
      })
    })
    mediaStreams.value.clear()

    // 清理事件监听器
  eventListeners.value.forEach((listeners, target) => {
    listeners.forEach((handler, event) => {
      if (target && typeof target.removeEventListener === 'function') {
        target.removeEventListener(event, handler)
      } else if (target && typeof target.off === 'function') {
        target.off(event, handler)
      }
    })
  })
  eventListeners.value.clear()

    // 清理通用资源
    resources.value.forEach(cleanup => {
      try {
        cleanup()
      } catch (error) {
        // 静默处理清理错误，避免影响其他清理
      }
    })
    resources.value.clear()
  }

  // 获取资源数量（用于调试）
  const getResourceCount = (): number => {
    return resources.value.size + timers.value.size + mediaStreams.value.size
  }

  // 组件卸载时自动清理
  onBeforeUnmount(() => {
    if (autoCleanup) {
      cleanupAll()
    }
  })

  return {
    registerResource,
    registerTimer,
    registerMediaStream,
    registerEventListener,
    cleanupAll,
    getResourceCount
  }
}
