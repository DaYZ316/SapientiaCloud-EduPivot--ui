<template>
  <div v-if="courseInfo" :style="{ '--dynamic-border-color': borderColor }" class="course-card">
    <!-- 信息模块 (40% 宽度，最左边) -->
    <div class="info-module">
      <!-- 背景装饰元素 -->
      <DecorativeLines/>
      <!-- 左侧背景装饰组件 -->
      <div class="decorative-curve"></div>

      <div class="course-info">
        <div class="course-title">
          <h1>{{ courseInfo.courseName }}</h1>
        </div>

        <div class="course-meta">
          <div v-if="courseInfo.semester" class="meta-item semester-item">
            <n-icon color="#1890ff" size="16">
              <CalendarOutline/>
            </n-icon>
            <span class="semester-text">{{ courseInfo.semester }}</span>
          </div>
          <div v-if="courseInfo.location" class="meta-item location-item">
            <n-icon color="#fa8c16" size="16">
              <LocationOutline/>
            </n-icon>
            <span class="location-text">{{ courseInfo.location }}</span>
          </div>
          <div v-if="courseInfo.createTime" class="meta-item create-time-item">
            <n-icon color="#52c41a" size="16">
              <TimeOutline/>
            </n-icon>
            <span class="create-time-text">{{ formatToBeijingTime(new Date(courseInfo.createTime)) }}</span>
          </div>
        </div>

        <div v-if="courseInfo.description" class="course-description">
          <p>{{ courseInfo.description }}</p>
        </div>

        <!-- 课程类型标签 -->
        <div class="color-declaration">
          <div
              :class="[
                'color-item',
                courseInfo.courseType === CourseTypeEnum.REQUIRED ? 'required-color' : 'elective-color'
              ]"
          >
            <div class="color-dot"></div>
            <span>{{ courseTypeLabel }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 模块2 (课程封面) -->
    <div class="module-2">
      <div class="course-cover">
        <img
            v-if="courseInfo.coverImageUrl"
            :alt="courseInfo.courseName"
            :src="courseInfo.coverImageUrl"
            class="cover-image"
            @error="handleImageError"
        />
        <img
            v-else
            :alt="courseInfo.courseName"
            :src="defaultCourseImage"
            class="cover-image"
        />
      </div>
    </div>

    <!-- 模块3 (最右侧，课程进度仪表盘) -->
    <div v-if="showProgress" class="module-3">
      <!-- 模块三装饰元素 -->
      <Module3Decorations/>
      <div class="progress-chart">
        <!-- 学生显示仪表盘图表 -->
        <template v-if="isStudent">
          <CourseGaugeChart
              :max="progressMax"
              :title="progressTitle"
              :unit="isStudent ? '%' : ''"
              :value="courseProgress"
          />
        </template>
        <!-- 非学生显示大数字章节数 -->
        <template v-else>
          <div class="chapter-count-display">
            <span class="chapter-count-number">{{ rootChapterCount }}</span>
          </div>
        </template>
        <div class="progress-info">
          <h3>{{ progressTitle }}</h3>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import {useI18n} from 'vue-i18n'
import {CalendarOutline, LocationOutline, TimeOutline} from '@vicons/ionicons5'
import type {CourseVO} from '@/types/course'
import {formatToBeijingTime} from '@/utils/dateUtil'
import CourseGaugeChart from '../CourseGaugeChart.vue'
import DecorativeLines from '../DecorativeLines.vue'
import Module3Decorations from '../Module3Decorations.vue'
import defaultCourseImage from '@/assets/image/default-course.png'
import {useCourseBorderColor} from '../../composables/useCourseBorderColor'
import {CourseTypeEnum} from '@/enum/course'
import {useCourseStore} from '@/store/modules/course'
import {useCourseScoreProgress} from '../../composables/useCourseScoreProgress'

// 国际化
const {t} = useI18n()

// store
const courseStore = useCourseStore()
const courseInfo = courseStore.currentCourseInfo

// 使用课程边框颜色composable（兼容空值）
const {borderColor} = useCourseBorderColor((courseInfo && (courseInfo as CourseVO).courseType) as any)

// 课程ID
const courseId = computed(() => {
  return (courseInfo as CourseVO)?.id || ''
})

// 使用课程积分进度 composable
const {isStudent, scoreProgress, rootChapterCount} = useCourseScoreProgress(courseId.value)

// 计算课程类型标签（使用国际化）
const courseTypeLabel = computed(() => {
  if (!courseInfo || (courseInfo as CourseVO).courseType === null || (courseInfo as CourseVO).courseType === undefined) {
    return t('course.courseType.REQUIRED')
  }
  return (courseInfo as CourseVO).courseType === CourseTypeEnum.REQUIRED
      ? t('course.courseType.REQUIRED')
      : t('course.courseType.ELECTIVE')
})

// 图片加载错误处理
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = defaultCourseImage
}

// 课程进度值 - 根据用户类型显示不同内容
const courseProgress = computed(() => {
  // 如果是学生，显示积分进度百分比
  if (isStudent.value) {
    return scoreProgress.value || 0
  }
  // 如果不是学生，显示根章节数量
  return rootChapterCount.value || 0
})

// 进度图表的最大值
const progressMax = computed(() => {
  if (isStudent.value) {
    return 100
  }
  // 非学生显示根章节数量，如果没有章节则设为1避免除零错误
  return rootChapterCount.value || 1
})

// 进度组件的标题 - 根据用户类型显示不同内容
const progressTitle = computed(() => {
  if (isStudent.value) {
    return t('course.card.courseProgress')
  }
  return t('course.card.rootChapterCount') || '根章节'
})

// 是否显示进度组件
const showProgress = computed(() => {
  return true // 始终显示，但内容根据用户类型变化
})
</script>

<style lang="scss" scoped>
@use './CourseCard.scss';
</style>
