import { onMounted, onUnmounted, ref, type ComponentPublicInstance, type Ref } from 'vue'

export function useScrollLogic(courseListRef: Ref<ComponentPublicInstance | undefined>, dividerRef: Ref<HTMLElement | undefined>) {
  // 滚动次数计数器，用于控制滚动方向
  const scrollCount = ref(0)

  onMounted(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            scrollCount.value++
            const isEvenScroll = scrollCount.value % 2 === 0

            // 根据滚动次数决定滚动方向：奇数次滚动到底部，偶数次滚动到顶部
            if (courseListRef.value && courseListRef.value.$el) {
              // 滚动到课程列表组件
              if (isEvenScroll) {
                // 偶数次：滚动到顶部
                courseListRef.value.$el.scrollIntoView({
                  behavior: 'smooth',
                  block: 'start'
                })
              } else {
                // 奇数次：滚动到底部
                courseListRef.value.$el.scrollIntoView({
                  behavior: 'smooth',
                  block: 'end'
                })
              }
            } else {
              // 如果找不到课程列表引用，则滚动到页面底部或顶部
              if (isEvenScroll) {
                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                })
              } else {
                window.scrollTo({
                  top: document.documentElement.scrollHeight,
                  behavior: 'smooth'
                })
              }
            }
          }
        })
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
      }
    )

    if (dividerRef.value) {
      observer.observe(dividerRef.value)
    }

    onUnmounted(() => {
      if (dividerRef.value) {
        observer.unobserve(dividerRef.value)
      }
    })
  })
}
