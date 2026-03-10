<template>
  <div class="recent-courses">
    <div class="content-area">
      <div v-if="loading" class="recent-loading">
        <n-spin size="small"/>
        <n-text depth="3">加载中...</n-text>
      </div>

      <div v-else class="courses-grid">
        <div
            v-for="course in displayCourses"
            :key="course.id"
            :class="{ 'empty-card': course.isEmpty }"
            class="course-card"
            @click="!course.isEmpty && goCourse(course)"
        >
          <div class="card-media">
            <img v-if="!course.isEmpty" :src="course.cover || ''" alt="cover"/>
            <div v-else class="empty-content">
              <n-icon color="var(--text-color-3)" size="32">
                <BookOutline/>
              </n-icon>
            </div>
          </div>
          <div class="card-title">
            <n-text v-if="!course.isEmpty" :ellipsis="{ tooltip: true }">{{ course.title || '-' }}</n-text>
            <n-text v-else depth="3" style="font-size: 12px;">暂无课程</n-text>
          </div>
        </div>
      </div>
    </div>

    <button class="full-width-button" @click="goToMyCourses">
      <span>{{ t('dashboard.recentCourses.viewMoreCourses') }}</span>
    </button>
  </div>
</template>

<script lang="ts" setup>
import {ref, onMounted, watch, computed} from 'vue'
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {NSpin, NText, NIcon} from 'naive-ui'
import {BookOutline} from '@vicons/ionicons5'
import {useCourseStore} from '@/store/modules/course'
import {useUserStore} from '@/store/modules/user'
import {useTransitionStore} from '@/store/modules/transition'
import type {CourseVO} from '@/types/course'

interface CoursePreview {
  id: number | string
  title: string | null
  teacherName?: string | null
  cover?: string | null
  isEmpty?: boolean
}

const {t} = useI18n()
const router = useRouter()
const loading = ref(true)
const courses = ref<CoursePreview[]>([])
const courseStore = useCourseStore()
const userStore = useUserStore()
const transitionStore = useTransitionStore()

// 计算显示的课程列表，确保至少显示4个卡片
const displayCourses = computed(() => {
  const realCourses = courses.value.slice(0, 4)
  const emptyCount = Math.max(0, 4 - realCourses.length)
  const emptyCourses: CoursePreview[] = Array(emptyCount).fill(null).map((_, index) => ({
    id: `empty-${index}`,
    title: null,
    cover: null,
    isEmpty: true
  }))
  return [...realCourses, ...emptyCourses]
})

const getRecentKey = (userId: string | null) => userId ? `recentActiveCourses_${userId}` : 'recentActiveCourses'

const loadFromLocal = () => {
  const currentUserId = userStore.userInfo?.id || null
  const key = getRecentKey(currentUserId)
  const raw = localStorage.getItem(key)
  if (!raw) {
    courses.value = []
    return
  }
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed)) {
      courses.value = parsed.slice(0, 4).map((c: any) => ({
        id: c.id ?? null,
        title: c.title ?? null,
        teacherName: c.teacherName ?? null,
        cover: c.cover ?? null
      }))
    } else {
      courses.value = []
    }
  } catch (e) {
    courses.value = []
  }
}

const persistCourse = (course: CourseVO | null) => {
  if (!course || !course.id) return
  const currentUserId = userStore.userInfo?.id || null
  const key = getRecentKey(currentUserId)

  const entry = {
    id: course.id,
    title: course.courseName ?? null,
    teacherName: course.teacherName ?? null,
    cover: course.coverImageUrl ?? null
  }

  let list: any[] = []
  try {
    const raw = localStorage.getItem(key)
    list = raw ? JSON.parse(raw) : []
    if (!Array.isArray(list)) list = []
  } catch (e) {
    list = []
  }

  // 去重并把当前放到最前面
  list = list.filter(item => item.id !== entry.id)
  list.unshift(entry)
  // 限制最大数量为 20
  list = list.slice(0, 20)
  localStorage.setItem(key, JSON.stringify(list))

  // 更新展示（前4）
  courses.value = list.slice(0, 4)
}

const goCourse = (course: CoursePreview) => {
  if (course.id == null) return
  transitionStore.show()
  router.push(`/course/detail/${course.id}`)
}

const goToMyCourses = () => {
  transitionStore.show()
  router.push('/course/my-courses')
}

// 监听 courseStore.currentCourseInfo，更新最近打开课程
watch(
    () => courseStore.currentCourseInfo,
    (newCourse) => {
      if (newCourse) {
        persistCourse(newCourse)
      }
    },
    {immediate: true}
)

// 监听用户变化，重新加载本地数据
watch(
    () => userStore.userInfo?.id,
    (newUserId, oldUserId) => {
      if (newUserId !== oldUserId) {
        loadFromLocal()
      }
    },
    {immediate: true}
)

onMounted(() => {
  loadFromLocal()
  loading.value = false
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

@keyframes gradientFlow {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

.recent-courses {
  display: flex;
  flex-direction: column;
  height: 100%;

  .content-area {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .recent-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    flex: 1;
  }

  .courses-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    grid-auto-rows: auto;
    gap: 12px;
    padding: 8px 0;
  }

  .course-card {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    background: var(--background-secondary-color);
    border: 1px solid var(--border-color);
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.12s ease, box-shadow 0.12s ease;
    height: 160px;
    user-select: none;
  }

  .course-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 18px var(--shadow-secondary-color);
  }

  .course-card.empty-card {
    opacity: 0.4;
    cursor: default;
    border-style: dashed;
    background: var(--background-color);
  }

  .course-card.empty-card:hover {
    transform: none;
    box-shadow: none;
  }

  .card-media {
    width: 100%;
    height: 110px;
    background: var(--background-color);
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
  }

  .card-media img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .empty-content {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  .card-title {
    padding: 8px;
    text-align: left;
    /* 标题占卡片剩余高度并垂直居中 */
    height: 30%;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .card-title n-text {
    font-size: 13px;
    color: var(--text-color);
    display: block;
    width: 100%;
  }

  .full-width-button {
    width: 100%;
    min-height: 11%;
    margin-top: 16px;
    padding: 12px 16px;
    background: var(--color-primary);
    color: #ffffff;
    border: none;
    border-radius: 999px;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    position: relative;
    overflow-x: hidden;
    transition: all 0.2s ease;
    z-index: 1;

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(45deg, var(--primary-color), var(--success-color), var(--warning-color), var(--error-color), var(--info-color));
      background-size: 200% 200%;
      animation: gradientFlow 3s ease-in-out infinite;
      transition: left 0.3s ease;
      z-index: 1;
    }

    &:hover::before {
      left: 0;
    }

    &:hover {
      background: var(--color-primary-light);
      box-shadow: 0 4px 12px var(--shadow-color);
    }

    &:active {
      transform: translateY(0);
      box-shadow: 0 2px 8px var(--shadow-secondary-color);
    }

    &:focus {
      outline: none;
      box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
    }

    span {
      position: relative;
      z-index: 2;
    }
  }
}
</style>



