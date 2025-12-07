import {onBeforeUnmount, onMounted, ref, watch} from 'vue'

const ANSWER_TOGGLE_STORAGE_KEY = 'celestialHub_question_showAnswers'

const resolveStoredShowAnswers = (): boolean => {
  if (typeof window === 'undefined') {
    return false
  }
  const storedValue = window.localStorage.getItem(ANSWER_TOGGLE_STORAGE_KEY)
  if (storedValue === null) {
    return false
  }
  return storedValue === 'true'
}

// 使用自定义事件名称来同步同一窗口内的状态
const ANSWER_TOGGLE_EVENT = 'question-answer-toggle-change'

export function useQuestionAnswerToggle() {
  const showAnswers = ref(resolveStoredShowAnswers())

  // 监听 localStorage 变化（跨标签页同步）
  const handleStorageChange = (e: StorageEvent) => {
    if (e.key === ANSWER_TOGGLE_STORAGE_KEY && e.newValue !== null) {
      showAnswers.value = e.newValue === 'true'
    }
  }

  // 监听自定义事件（同一窗口内同步）
  const handleCustomEvent = (e: CustomEvent<boolean>) => {
    showAnswers.value = e.detail
  }

  // 当 showAnswers 改变时，更新 localStorage 并触发自定义事件
  watch(showAnswers, (value) => {
    if (typeof window === 'undefined') {
      return
    }
    window.localStorage.setItem(ANSWER_TOGGLE_STORAGE_KEY, String(value))
    // 触发自定义事件以同步同一窗口内的其他组件
    window.dispatchEvent(new CustomEvent(ANSWER_TOGGLE_EVENT, {detail: value}))
  })

  onMounted(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange)
      window.addEventListener(ANSWER_TOGGLE_EVENT, handleCustomEvent as EventListener)
    }
  })

  onBeforeUnmount(() => {
    if (typeof window !== 'undefined') {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener(ANSWER_TOGGLE_EVENT, handleCustomEvent as EventListener)
    }
  })

  return {
    showAnswers
  }
}

