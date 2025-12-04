import {onUnmounted, ref} from 'vue'

export function useChatScroll() {
  const chatContentRef = ref<HTMLElement | null>(null)
  const isAutoScroll = ref<boolean | null>(null)
  isAutoScroll.value = true
  let messagesWrapperEl: HTMLElement | null = null

  const isNearBottom = (el: HTMLElement) => {
    const threshold = 12
    const distance = el.scrollHeight - el.scrollTop - el.clientHeight
    return distance <= threshold
  }

  const handleWrapperScroll = () => {
    if (!messagesWrapperEl) {
      return
    }
    isAutoScroll.value = isNearBottom(messagesWrapperEl)
  }

  const ensureScrollListener = () => {
    if (!chatContentRef.value) {
      return
    }
    if (!messagesWrapperEl) {
      const el = chatContentRef.value.querySelector('.messages-wrapper') as HTMLElement | null
      if (el) {
        messagesWrapperEl = el
        messagesWrapperEl.addEventListener('scroll', handleWrapperScroll, {passive: true})
        isAutoScroll.value = isNearBottom(messagesWrapperEl)
      }
    }
  }

  const scrollToBottom = () => {
    ensureScrollListener()
    if (isAutoScroll.value === false) {
      return
    }
    if (!messagesWrapperEl) {
      return
    }
    const container = messagesWrapperEl
    const scrollHeight = container.scrollHeight

    container.scrollTop = scrollHeight

    requestAnimationFrame(() => {
      container.scrollTop = scrollHeight
    })

    setTimeout(() => {
      if (isAutoScroll.value !== false) {
        container.scrollTop = container.scrollHeight
      }
    }, 100)

    setTimeout(() => {
      if (isAutoScroll.value !== false) {
        container.scrollTop = container.scrollHeight
      }
    }, 300)
  }

  const scrollToBottomForce = () => {
    ensureScrollListener()
    if (!messagesWrapperEl) {
      return
    }
    const container = messagesWrapperEl
    const scrollHeight = container.scrollHeight
    container.scrollTop = scrollHeight
    requestAnimationFrame(() => {
      container.scrollTop = scrollHeight
    })
    setTimeout(() => {
      container.scrollTop = container.scrollHeight
    }, 100)
    setTimeout(() => {
      container.scrollTop = container.scrollHeight
    }, 300)
  }

  const scrollIntoViewInMessages = (selector: string, align: 'start' | 'center' | 'end' = 'center') => {
    ensureScrollListener()
    if (!messagesWrapperEl) {
      return
    }
    const target = messagesWrapperEl.querySelector(selector) as HTMLElement | null
    if (!target) {
      return
    }
    const wrapperRect = messagesWrapperEl.getBoundingClientRect()
    const targetRect = target.getBoundingClientRect()
    let offsetTop = targetRect.top - wrapperRect.top + messagesWrapperEl.scrollTop

    if (align === 'center') {
      const targetCenterOffset = targetRect.top - wrapperRect.top + targetRect.height / 2
      offsetTop = messagesWrapperEl.scrollTop + targetCenterOffset - messagesWrapperEl.clientHeight / 2
    } else if (align === 'end') {
      offsetTop = messagesWrapperEl.scrollTop + (targetRect.bottom - wrapperRect.bottom)
    }

    messagesWrapperEl.scrollTo({
      top: offsetTop,
      behavior: 'smooth'
    })
  }

  onUnmounted(() => {
    if (messagesWrapperEl) {
      messagesWrapperEl.removeEventListener('scroll', handleWrapperScroll)
      messagesWrapperEl = null
    }
  })

  return {
    chatContentRef,
    scrollToBottom,
    scrollToBottomForce,
    scrollIntoViewInMessages
  }
}


