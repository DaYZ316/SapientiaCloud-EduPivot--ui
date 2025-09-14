<template>
  <div class="course-card" @click="handleCourseClick">
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
            @click.stop="handleContinueCourse"
        >
          {{ getButtonText(course) }}
        </n-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type * as courseType from '@/types/course'
import {useI18n} from 'vue-i18n'
import {useRouter} from 'vue-router'
import {FingerPrintOutline, LocationOutline} from '@vicons/ionicons5'
import {CourseStatusEnum} from '@/enum/course'

const {t} = useI18n()
const router = useRouter()

// Props
interface Props {
  course: courseType.CourseVO & { teacherAvatar?: string }
}

const props = defineProps<Props>()

// Emits
interface Emits {
  (e: 'course-click', course: courseType.CourseVO): void

  (e: 'continue-course', course: courseType.CourseVO): void
}

const emit = defineEmits<Emits>()

// 默认图片
const defaultImage = '/src/assets/image/default-course.png'
const defaultUserAvatar = '/src/assets/image/default-userAvatar.png'

const formatSemester = (semester: string) => semester ? `学期: ${semester}` : ''

const truncateDescription = (description: string, maxLength: number = 60) =>
    description.length <= maxLength ? description : description.substring(0, maxLength) + '...'

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
const handleCourseClick = () => emit('course-click', props.course)

// 处理继续课程按钮点击
const handleContinueCourse = () => emit('continue-course', props.course)

// 处理教师标签点击
const handleTeacherClick = (teacherId: string) => {
  if (teacherId) {
    router.push({name: 'TeacherProfile', params: {teacherId}})
  }
}
</script>

<style lang="scss" scoped>
@use './CourseCard.scss';
</style>
