<template>
  <div class="course-card">
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


      <!-- 课程信息行 -->
      <div class="course-info">
        <!-- 教师信息 -->
        <div v-if="course.teacherName" class="info-row teacher-info">
          <div class="info-item teacher-item" @click.stop="handleTeacherClick">
            <AvatarDisplay
                :avatar-src="teacherAvatar"
                :nick-name="course.teacherName"
                :username="course.teacherName"
                class="teacher-avatar"
                size="small"
            />
            <span class="teacher-name">{{ course.teacherName }}</span>
          </div>
        </div>

        <!-- 学期信息 -->
        <div v-if="course.semester" class="info-row">
          <div class="info-item">
            <n-icon :component="CalendarOutline" class="info-icon"/>
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
import {CalendarOutline, LocationOutline} from '@vicons/ionicons5'
import {CourseStatusEnum} from '@/enum/course'
import AvatarDisplay from '@/components/common/AvatarDisplay.vue'
import {getTeacherById} from '@/api/teacher'
import {computed} from 'vue'

const {t} = useI18n()
const router = useRouter()

// Props
interface Props {
  course: courseType.CourseVO
}

const props = defineProps<Props>()

// Emits
interface Emits {
  (e: 'continue-course', course: courseType.CourseVO): void
}

const emit = defineEmits<Emits>()

// 默认图片
const defaultImage = '/src/assets/image/default-course.png'

// 教师头像URL（从course对象中获取）
const teacherAvatar = computed(() => {
  // 从course对象中获取teacherAvatar字段
  return props.course.teacherAvatar || undefined
})

const formatSemester = (semester: string) => semester || ''

const truncateDescription = (description: string, maxLength: number = 60) =>
    description.length <= maxLength ? description : description.substring(0, maxLength) + '...'

const getButtonText = (course: courseType.CourseVO) =>
    course.status === CourseStatusEnum.SUSPENDED ? t('course.card.suspended') : t('course.card.startCourse')

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = defaultImage
}


// 处理继续课程按钮点击
const handleContinueCourse = () => {
  // 跳转到课程详情页面
  router.push({name: 'CourseDetail', params: {courseId: props.course.id}})
}

// 处理教师信息点击
const handleTeacherClick = async () => {
  // 如果有teacherUserId，直接跳转
  if (props.course.teacherUserId) {
    router.push(`/user/${props.course.teacherUserId}`)
    return
  }

  // 如果没有teacherUserId但有teacherId，先查询教师信息获取sysUserId
  if (props.course.teacherId) {
    try {
      const response = await getTeacherById(props.course.teacherId)
      if (response.success && response.data?.sysUserId) {
        router.push(`/user/${response.data.sysUserId}`)
      }
    } catch (error) {
      console.error('获取教师信息失败:', error)
    }
  }
}

</script>

<style lang="scss" scoped>
@use './CourseCard.scss';
</style>

