import { ref, onBeforeUnmount } from 'vue'

interface ResourceLeakDetectorResult {
  trackResource: (resource: any, description: string) => () => void
  getResourceCount: () => number
  detectLeaks: () => string[]
  cleanup: () => void
}

export const useResourceLeakDetector = (): ResourceLeakDetectorResult => {
  const trackedResources = ref<Map<any, { description: string; timestamp: number }>>(new Map())
  const leakWarnings = ref<string[]>([])

  // 跟踪资源
  const trackResource = (resource: any, description: string) => {
    const timestamp = Date.now()
    trackedResources.value.set(resource, { description, timestamp })

    // 返回清理函数
    return () => {
      trackedResources.value.delete(resource)
    }
  }

  // 获取资源数量
  const getResourceCount = (): number => {
    return trackedResources.value.size
  }

  // 检测泄漏（长时间未清理的资源）
  const detectLeaks = (): string[] => {
    const now = Date.now()
    const leakThreshold = 5 * 60 * 1000 // 5分钟
    const leaks: string[] = []

    trackedResources.value.forEach((info) => {
      if (now - info.timestamp > leakThreshold) {
        leaks.push(`${info.description} (created ${Math.round((now - info.timestamp) / 1000)}s ago)`)
      }
    })

    if (leaks.length > 0) {
      leakWarnings.value.push(...leaks)
    }

    return leaks
  }

  // 清理所有资源
  const cleanup = (): void => {
    trackedResources.value.clear()
    leakWarnings.value = []
  }

  // 组件卸载时进行最终检查
  onBeforeUnmount(() => {
    const leaks = detectLeaks()
    if (leaks.length > 0) {
      console.warn('Resource leaks detected:', leaks)
    }
    cleanup()
  })

  return {
    trackResource,
    getResourceCount,
    detectLeaks,
    cleanup
  }
}
