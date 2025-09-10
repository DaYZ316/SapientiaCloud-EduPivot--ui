<template>
  <div class="course-card-container">
    <div v-if="loading" class="loading-state">
      <n-spin size="large"/>
    </div>
    <div v-else-if="courseList.length === 0" class="empty-state">
      <n-empty :description="t('course.empty.noData')"/>
    </div>
    <div v-else>
      <!-- 课程网格 -->
      <div class="course-grid">
        <div
            v-for="course in courseWithAvatars"
            :key="course.id"
            class="course-card"
            @click="handleCourseClick(course)"
        >
          <!-- 课程封面图片 -->
          <div class="course-cover">
            <img
                :alt="course.courseName"
                :class="{ 'suspended': course.status === CourseStatusEnum.SUSPENDED }"
                :src="course.coverImageUrl || defaultImage"
                class="cover-image"
                @error="handleImageError"
            />
          </div>

          <!-- 课程信息区域 -->
          <div class="course-content">
            <!-- 课程标题 -->
            <h3 class="course-title">{{ course.courseName }}</h3>

            <!-- 课程描述 -->
            <p v-if="course.description" class="course-description">
              {{ truncateDescription(course.description) }}
            </p>

            <!-- 教师信息 -->
            <div v-if="course.teacherName" class="instructor">
              <n-tag
                  :bordered="false"
                  class="teacher-tag"
                  round
                  @click.stop="handleTeacherClick(course.teacherId)"
              >
                <span class="teacher-name">{{ course.teacherName }}</span>
                <template #avatar>
                  <n-avatar
                      :fallback-src="defaultUserAvatar"
                      :src="course.teacherAvatar"
                      size="small"
                      @error="handleAvatarError"
                  />
                </template>
              </n-tag>
            </div>

            <!-- 课程信息行 -->
            <div class="course-info">
              <!-- 学期信息 -->
              <div v-if="course.semester" class="info-row">
                <div class="info-item">
                  <n-icon :component="FingerPrintOutline" class="info-icon"/>
                  <span>{{ formatSemester(course.semester) }}</span>
                </div>
              </div>

              <!-- 上课地点信息 -->
              <div v-if="course.location" class="info-row">
                <div class="info-item">
                  <n-icon :component="LocationOutline" class="info-icon"/>
                  <span>{{ course.location }}</span>
                </div>
              </div>
            </div>

            <!-- 继续课程按钮 -->
            <div class="course-actions">
              <n-button
                  :disabled="course.status === CourseStatusEnum.SUSPENDED"
                  block
                  round
                  size="large"
                  type="primary"
                  @click.stop="handleContinueCourse(course)"
              >
                {{ getButtonText(course) }}
              </n-button>
            </div>
          </div>
        </div>
      </div>

      <!-- 分页组件 -->
      <div class="pagination-container">
        <n-pagination
            v-model:page="pagination.pageNum"
            v-model:page-size="pagination.pageSize"
            :item-count="pagination.total"
            :page-sizes="pageSizes"
            :show-quick-jumper="showQuickJumper"
            :show-size-picker="showSizePicker"
            @update:page="onPageChange"
            @update:page-size="onSizeChange"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type * as courseType from '@/types/course'
import type {TeacherVO} from '@/types/teacher'
import type {SysUserVO} from '@/types/system/user'
import {useI18n} from 'vue-i18n'
import {useRouter} from 'vue-router'
import {FingerPrintOutline, LocationOutline} from '@vicons/ionicons5'
import {CourseStatusEnum} from '@/enum/course'
import {getTeacherById} from '@/api/teacher'
import {getUserById} from '@/api/system/user'
import {computed, ref, watch} from 'vue'

const {t} = useI18n()
const router = useRouter()

// Props
interface Props {
  courseList: courseType.CourseVO[]
  loading: boolean
  pagination: {
    pageNum: number
    pageSize: number
    total: number
  }
  pageSizes?: number[]
  showQuickJumper?: boolean
  showSizePicker?: boolean
  isAdmin?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  pageSizes: () => [12, 16, 24, 32],
  showQuickJumper: true,
  showSizePicker: true
})

// Emits
interface Emits {
  (e: 'course-click', course: courseType.CourseVO): void

  (e: 'continue-course', course: courseType.CourseVO): void

  (e: 'page-change', pagination: { pageNum: number, pageSize: number }): void
}

const emit = defineEmits<Emits>()

// 默认图片
const defaultImage = '/src/assets/image/default-course.png'
const defaultUserAvatar = '/src/assets/image/default-userAvatar.png'

// 教师头像缓存
const teacherAvatarCache = ref<Map<string, string>>(new Map())
const loadingAvatars = ref<Set<string>>(new Set())

// 获取教师头像
const getTeacherAvatar = async (teacherId: string): Promise<string> => {
  if (teacherAvatarCache.value.has(teacherId)) {
    return teacherAvatarCache.value.get(teacherId)!
  }

  if (loadingAvatars.value.has(teacherId)) {
    return defaultUserAvatar
  }

  try {
    loadingAvatars.value.add(teacherId)

    const teacherResponse = await getTeacherById(teacherId)
    const teacher: TeacherVO = teacherResponse.data

    if (teacher.sysUserId) {
      const userResponse = await getUserById(teacher.sysUserId)
      const user: SysUserVO = userResponse.data
      const avatarUrl = user.avatar || defaultUserAvatar
      teacherAvatarCache.value.set(teacherId, avatarUrl)
      return avatarUrl
    }

    teacherAvatarCache.value.set(teacherId, defaultUserAvatar)
    return defaultUserAvatar
  } catch {
    teacherAvatarCache.value.set(teacherId, defaultUserAvatar)
    return defaultUserAvatar
  } finally {
    loadingAvatars.value.delete(teacherId)
  }
}

// 计算属性：为每个课程获取教师头像
const courseWithAvatars = computed(() => {
  return props.courseList.map(course => ({
    ...course,
    teacherAvatar: teacherAvatarCache.value.get(course.teacherId) || defaultUserAvatar
  }))
})

// 监听课程列表变化，预加载教师头像
watch(() => props.courseList, (newCourseList) => {
  if (newCourseList?.length > 0) {
    newCourseList.forEach(course => {
      if (course.teacherId && !teacherAvatarCache.value.has(course.teacherId)) {
        getTeacherAvatar(course.teacherId)
      }
    })
  }
}, {immediate: true})

// 格式化学期显示
const formatSemester = (semester: string) => semester ? `学期: ${semester}` : ''

// 截断描述文本
const truncateDescription = (description: string, maxLength: number = 60) =>
    description.length <= maxLength ? description : description.substring(0, maxLength) + '...'

// 获取按钮文本
const getButtonText = (course: courseType.CourseVO) =>
    course.status === CourseStatusEnum.SUSPENDED ? t('course.card.suspended') : t('course.card.startCourse')

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = defaultImage
}

// 处理头像加载错误
const handleAvatarError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = defaultUserAvatar
}

// 处理课程卡片点击
const handleCourseClick = (course: courseType.CourseVO) => emit('course-click', course)

// 处理继续课程按钮点击
const handleContinueCourse = (course: courseType.CourseVO) => emit('continue-course', course)

// 处理页码变化
const onPageChange = (page: number) => emit('page-change', {pageNum: page, pageSize: props.pagination.pageSize})

// 处理页大小变化
const onSizeChange = (size: number) => emit('page-change', {pageNum: 1, pageSize: size})

// 处理教师标签点击
const handleTeacherClick = (teacherId: string) => {
  if (teacherId) {
    router.push({name: 'TeacherProfile', params: {teacherId}})
  }
}
</script>

<style lang="scss" scoped>
@use './CourseCardView.scss';

</style>
