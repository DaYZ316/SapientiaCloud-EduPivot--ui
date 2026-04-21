import {onUnmounted, ref} from 'vue'
import type {ChatMessage} from '@/types/celestialHub/chatMessage'

type ScrollMode = 'sync' | 'settled'

const AUTO_SCROLL_THRESHOLD = 96
const SMOOTH_FOLLOW_GUARD_THRESHOLD = 180
const SMOOTH_FOLLOW_GUARD_MS = 220

export function useChatScroll() {
    const chatContentRef = ref<HTMLElement | null>(null)
    const isAutoScroll = ref<boolean | null>(null)
    isAutoScroll.value = true
    let messagesWrapperEl: HTMLElement | null = null
    let settleScrollTimers: number[] = []
    let smoothFollowGuardUntil = 0

    const getDistanceFromBottom = (el: HTMLElement) => {
        return el.scrollHeight - el.scrollTop - el.clientHeight
    }

    const isNearBottom = (el: HTMLElement) => {
        return getDistanceFromBottom(el) <= AUTO_SCROLL_THRESHOLD
    }

    const handleWrapperScroll = () => {
        if (!messagesWrapperEl) {
            return
        }

        const distance = getDistanceFromBottom(messagesWrapperEl)

        // 平滑自动跟随过程中，给一点缓冲，避免滚动动画尚未追到底部时被误判为用户已离开底部。
        if (Date.now() < smoothFollowGuardUntil && distance <= SMOOTH_FOLLOW_GUARD_THRESHOLD) {
            isAutoScroll.value = true
            return
        }

        isAutoScroll.value = distance <= AUTO_SCROLL_THRESHOLD
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

    const clearSettleScrollTimers = () => {
        settleScrollTimers.forEach((timerId) => {
            window.clearTimeout(timerId)
        })
        settleScrollTimers = []
    }

    const scrollContainerToBottom = (container: HTMLElement, mode: ScrollMode, force = false) => {
        const behavior: ScrollBehavior = mode === 'sync' && !force ? 'smooth' : 'auto'

        if (behavior === 'smooth') {
            smoothFollowGuardUntil = Date.now() + SMOOTH_FOLLOW_GUARD_MS
        }

        container.scrollTo({
            top: container.scrollHeight,
            behavior
        })
    }

    const applyBottomScroll = (container: HTMLElement, mode: ScrollMode, force = false) => {
        scrollContainerToBottom(container, mode, force)

        requestAnimationFrame(() => {
            if (force || isAutoScroll.value !== false) {
                scrollContainerToBottom(container, mode, force)
            }
        })

        if (mode !== 'settled') {
            return
        }

        clearSettleScrollTimers()
        ;[96, 240].forEach((delay) => {
            const timerId = window.setTimeout(() => {
                if (force || isAutoScroll.value !== false) {
                    scrollContainerToBottom(container, mode, force)
                }
            }, delay)
            settleScrollTimers.push(timerId)
        })
    }

    const scrollToBottom = (mode: ScrollMode = 'settled') => {
        ensureScrollListener()
        if (isAutoScroll.value === false) {
            return
        }
        if (!messagesWrapperEl) {
            return
        }
        applyBottomScroll(messagesWrapperEl, mode)
    }

    const scrollToBottomForce = (mode: ScrollMode = 'settled') => {
        ensureScrollListener()
        if (!messagesWrapperEl) {
            return
        }
        applyBottomScroll(messagesWrapperEl, mode, true)
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

    // 滚动到最后一条用户消息。
    const scrollToLastUserMessage = (messages: ChatMessage[]) => {
        ensureScrollListener()
        if (!messagesWrapperEl) {
            return
        }

        if (!messages.length) {
            scrollToBottom()
            return
        }

        // 查找最后一条用户消息，也包含出题请求消息 role=3。
        const lastUserLikeMessage = [...messages]
            .reverse()
            .find((msg) => msg.role === 0 || msg.role === 3)

        if (lastUserLikeMessage?.id) {
            const selector = `.chat-message[data-message-id="${lastUserLikeMessage.id}"]`
            const targetElement = messagesWrapperEl.querySelector(selector) as HTMLElement | null
            if (targetElement) {
                scrollIntoViewInMessages(selector, 'start')
            } else {
                // 如果目标元素还没挂载，回退到底部。
                scrollToBottom()
            }
        } else {
            scrollToBottom()
        }
    }

    // 切换会话时重置滚动状态，避免持有旧的 DOM 引用。
    const resetScrollState = () => {
        clearSettleScrollTimers()
        smoothFollowGuardUntil = 0
        if (messagesWrapperEl) {
            messagesWrapperEl.removeEventListener('scroll', handleWrapperScroll)
            messagesWrapperEl = null
        }
        isAutoScroll.value = true
    }

    onUnmounted(() => {
        clearSettleScrollTimers()
        smoothFollowGuardUntil = 0
        if (messagesWrapperEl) {
            messagesWrapperEl.removeEventListener('scroll', handleWrapperScroll)
            messagesWrapperEl = null
        }
    })

    return {
        chatContentRef,
        scrollToBottom,
        scrollToBottomForce,
        scrollIntoViewInMessages,
        scrollToLastUserMessage,
        resetScrollState
    }
}
