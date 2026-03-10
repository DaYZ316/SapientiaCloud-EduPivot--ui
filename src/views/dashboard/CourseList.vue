<template>
  <div class="course-list-container">
    <!-- 搜索框 -->
    <div class="search-section">
      <n-input
          v-model:value="searchQuery"
          clearable
          placeholder="搜索公开课程..."
          @input="handleSearch"
      >
        <template #prefix>
          <n-icon>
            <SearchOutlined/>
          </n-icon>
        </template>
      </n-input>
    </div>

    <!-- 课程列表 -->
    <div
        ref="courseListRef"
        class="course-list"
        @scroll="handleScroll"
    >
      <n-grid
          v-if="courses.length > 0"
          :cols="5"
          :x-gap="12"
          :y-gap="16"
      >
        <n-grid-item
            v-for="course in courses"
            :key="course.id"
        >
          <div class="course-card" @click="handleCourseClick(course)">
            <!-- 课程封面图片 -->
            <div class="course-cover">
              <img
                  :alt="course.courseName"
                  :src="course.coverImageUrl || defaultImage"
                  class="cover-image"
                  @error="handleImageError"
              />
            </div>

            <!-- 课程信息区域 -->
            <div class="course-content">
              <!-- 课程标题 -->
              <h3 class="course-title">
                <span class="course-name">{{ course.courseName }}</span>
                <n-tag
                    v-if="course.courseType === 0"
                    class="course-type-tag"
                    size="small"
                    type="info"
                >
                  必修
                </n-tag>
                <n-tag
                    v-else-if="course.courseType === 1"
                    class="course-type-tag"
                    size="small"
                    type="success"
                >
                  选修
                </n-tag>
              </h3>

              <!-- 课程描述 -->
              <p v-if="course.description" class="course-description">
                {{ truncateDescription(course.description) }}
              </p>

              <!-- 教师信息 -->
              <div v-if="course.teacherName" class="instructor">
                <div class="teacher-tag" @click.stop="handleTeacherClick(course)">
                  <AvatarDisplay
                      :avatarSrc="course.teacherAvatar"
                      :round="true"
                      :username="course.teacherName"
                      size="small"
                  />
                  <span class="teacher-name">{{ course.teacherName }}</span>
                </div>
              </div>

              <!-- 课程信息行 -->
              <div class="course-info">
                <!-- 学期信息 -->
                <div v-if="course.semester" class="info-row">
                  <div class="info-item">
                    <n-icon :component="CalendarOutlined" class="info-icon"/>
                    <span>{{ course.semester }}</span>
                  </div>
                </div>

                <!-- 上课地点信息 -->
                <div v-if="course.location" class="info-row">
                  <div class="info-item">
                    <n-icon :component="EnvironmentOutlined" class="info-icon"/>
                    <span>{{ course.location }}</span>
                  </div>
                </div>
              </div>

              <!-- 查看详情按钮 -->
              <div class="course-actions">
                <n-button
                    block
                    round
                    size="large"
                    type="primary"
                    @click.stop="handleCourseClick(course)"
                >
                  查看详情
                </n-button>
              </div>
            </div>
          </div>
        </n-grid-item>
      </n-grid>

      <!-- 空状态 -->
      <n-empty
          v-else-if="!loading && courses.length === 0"
          description="暂无公开课程"
      />

      <!-- 加载状态 -->
      <div
          v-if="loading && courses.length === 0"
          class="loading-container"
      >
        <n-spin size="large"/>
      </div>

      <!-- 底部加载更多 -->
      <div
          v-if="loading && courses.length > 0"
          class="loading-more"
      >
        <n-spin size="small"/>
        <n-text depth="3">加载更多...</n-text>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, onMounted, computed} from 'vue'
import {SearchOutlined, CalendarOutlined, EnvironmentOutlined} from '@vicons/antd'
import AvatarDisplay from '@/components/common/AvatarDisplay.vue'
import {listCourse, getDefaultCourseQuery} from '@/api/course/course'
import type {CourseVO, CourseQueryParams} from '@/types/course'
import {useRouter} from 'vue-router'
import defaultCourseImage from '@/assets/image/default-course.png'

const router = useRouter()

// 响应式数据
const searchQuery = ref('')
const courses = ref<CourseVO[]>([])
const loading = ref(false)
const hasMore = ref(true)
const currentPage = ref(1)
const pageSize = ref(20)

// DOM 引用
const courseListRef = ref<HTMLElement>()

// 搜索防抖定时器
let searchTimer: number | null = null

// 默认图片
const defaultImage = defaultCourseImage

// 计算属性
const queryParams = computed((): CourseQueryParams => {
  return {
    ...getDefaultCourseQuery(),
    courseName: searchQuery.value || null,
    isPublic: '1', // 只查询公开课程
    pageNum: currentPage.value,
    pageSize: pageSize.value,
    orderByColumn: 'create_time',
    isAsc: 'desc'
  }
})

// 截断描述文本
function truncateDescription(description: string, maxLength: number = 60): string {
  const desc = description || ''
  return desc.length <= maxLength ? desc : desc.substring(0, maxLength) + '...'
}

// 处理图片加载错误
function handleImageError(event: Event): void {
  const img = event.target as HTMLImageElement
  img.src = defaultImage
}

// 处理搜索
function handleSearch() {
  if (searchTimer) {
    clearTimeout(searchTimer)
  }

  searchTimer = setTimeout(() => {
    currentPage.value = 1
    courses.value = []
    hasMore.value = true
    loadCourses()
  }, 500)
}

// 加载课程数据
async function loadCourses() {
  if (loading.value || !hasMore.value) return

  loading.value = true

  try {
    const response = await listCourse(queryParams.value)

    if (response.data && response.data.length > 0) {
      if (currentPage.value === 1) {
        courses.value = response.data
      } else {
        courses.value = [...courses.value, ...response.data]
      }

      // 检查是否还有更多数据
      hasMore.value = response.data.length === pageSize.value
    } else {
      hasMore.value = false
    }
  } catch (error) {
    console.error('加载课程失败:', error)
    hasMore.value = false
  } finally {
    loading.value = false
  }
}

// 处理滚动到底部
function handleScroll() {
  if (!courseListRef.value) return

  const {scrollTop, scrollHeight, clientHeight} = courseListRef.value
  const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100

  if (isNearBottom && !loading.value && hasMore.value) {
    currentPage.value++
    loadCourses()
  }
}

// 处理课程点击
function handleCourseClick(course: CourseVO) {
  router.push(`/course/detail/${course.id}`)
}

// 处理教师点击
function handleTeacherClick(course: CourseVO) {
  if (course.teacherUserId) {
    router.push(`/user/${course.teacherUserId}`)
    return
  }
  if (course.teacherId) {
    // 这里可以调用API获取教师信息然后跳转，暂时先跳转到教师ID
    router.push(`/user/${course.teacherId}`)
  }
}

// 初始化加载
onMounted(() => {
  loadCourses()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.course-list-container {
  width: 100%;
  padding: 20px 0;

  .search-section {
    margin-bottom: 20px;
    max-width: 400px;
  }

  .course-list {
    height: 80vh;
    overflow-y: auto;
    padding: 20px 0;

    /* 隐藏滚动条 - Firefox / IE / WebKit */
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE 10+ */
    &::-webkit-scrollbar {
      width: 0;
      height: 0;
      background: transparent;
    }

    .course-card {
      background: var(--background-color);
      border: 1px solid var(--border-secondary-color);
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 2px 8px var(--shadow-secondary-color);
      transition: all 0.3s ease;
      height: 100%;
      display: flex;
      flex-direction: column;
      cursor: pointer;

      &:hover {
        border-color: var(--primary-color);
        transform: translateY(-2px);
        box-shadow: 0 4px 16px rgba(var(--primary-color-rgb), 0.2);
      }

      .course-cover {
        position: relative;
        width: 100%;
        height: 180px;
        overflow: hidden;

        .cover-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        &:hover .cover-image {
          transform: scale(1.05);
          filter: brightness(1.1);
        }
      }

      .course-content {
        padding: 20px;
        flex: 1;
        display: flex;
        flex-direction: column;

        .course-title {
          margin: 0 0 8px 0;
          font-size: 18px;
          font-weight: 600;
          color: var(--primary-color);
          line-height: 1.4;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .course-name {
            flex: 1;
          }

          .course-type-tag {
            margin-left: 8px;
            flex-shrink: 0;
          }
        }

        .course-description {
          margin: 0 0 12px 0;
          font-size: 14px;
          color: var(--text-secondary-color);
          line-height: 1.5;
          flex: 1;
        }

        .instructor {
          margin: 0 0 16px 0;

          .teacher-tag {
            background: rgba(var(--primary-color-rgb), 0.1);
            color: var(--text-color);
            border: none;
            font-weight: 500;
            font-size: 13px;
            height: auto;
            min-height: 28px;
            cursor: pointer;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            user-select: none;
            display: inline-flex;
            align-items: center;
            border-radius: 14px;

            :deep(.n-avatar) {
              margin-right: 6px;
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            .teacher-name {
              transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            }

            &:hover {
              background: rgba(var(--primary-color-rgb), 0.2);
              border-color: var(--primary-color);
              transform: translateY(-2px) scale(1.02);
              box-shadow: 0 4px 16px rgba(var(--primary-color-rgb), 0.4);

              :deep(.n-avatar) {
                transform: scale(1.1) rotate(5deg);
                box-shadow: 0 2px 8px rgba(var(--primary-color-rgb), 0.3);
              }

              .teacher-name {
                color: var(--primary-color);
                font-weight: 600;
              }
            }

            &:active {
              transform: translateY(-1px) scale(1.01);
              transition: all 0.1s ease;
            }
          }
        }

        .course-info {
          margin-bottom: 20px;

          .info-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 12px;

            &:last-child {
              margin-bottom: 0;
            }

            .info-item {
              display: flex;
              align-items: center;
              font-size: 14px;
              color: var(--text-secondary-color);

              .info-icon {
                margin-right: 6px;
                font-size: 16px;
                color: var(--primary-color);
              }
            }
          }
        }

        .course-actions {
          margin-top: auto;

          :deep(.n-button) {
            font-weight: 600;
            letter-spacing: 0.5px;
            background: var(--primary-color);
            border-color: var(--primary-color);
            color: white;
            border-radius: 25px;
            padding: 12px 24px;
            height: auto;
            min-height: 44px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            overflow: hidden;
            user-select: none;

            &:hover:not(:disabled) {
              background: var(--color-primary-light);
              border-color: var(--color-primary-light);
            }

            &:active:not(:disabled) {
              background: var(--color-primary-dark);
              border-color: var(--color-primary-dark);
            }

            &:disabled {
              background: var(--text-disabled-color);
              border-color: var(--text-disabled-color);
              color: var(--background-color);
            }
          }
        }
      }
    }

    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 200px;
    }

    .loading-more {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      padding: 20px;
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .course-list-container {
    padding: 16px 0;

    .search-section {
      margin-bottom: 16px;
      max-width: 100%;
      padding: 0 16px;
    }

    .course-list {
      height: 500px;
      padding: 0 16px;

      /* 隐藏滚动条 - 移动端也隐藏 */
      scrollbar-width: none;
      -ms-overflow-style: none;

      &::-webkit-scrollbar {
        width: 0;
        height: 0;
        background: transparent;
      }

      .course-card {
        .course-cover {
          height: 140px;
        }

        .course-content {
          padding: 16px;

          .course-title {
            font-size: 16px;
          }

          .course-info {
            .info-row {
              flex-direction: column;
              align-items: flex-start;
              gap: 8px;
            }
          }
        }
      }
    }
  }
}
</style>
