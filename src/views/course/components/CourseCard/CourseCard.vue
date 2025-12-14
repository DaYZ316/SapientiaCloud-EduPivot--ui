<template>
  <div :style="{ '--dynamic-border-color': borderColor }" class="course-card">
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
    <div class="module-3">
      <!-- 模块三装饰元素 -->
      <Module3Decorations/>
      <div class="progress-chart">
        <CourseGaugeChart
            :max="100"
            :title="t('course.card.courseProgress')"
            :value="courseProgress"
            unit="%"
        />
        <div class="progress-info">
          <h3>{{ t('course.card.courseProgress') }}</h3>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue'
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

// 定义组件属性
interface Props {
  courseInfo: CourseVO
}

// 接收属性
const props = defineProps<Props>()

// 国际化
const {t} = useI18n()

// 使用课程边框颜色composable
const {borderColor} = useCourseBorderColor(props.courseInfo.courseType)

// 计算课程类型标签（使用国际化）
const courseTypeLabel = computed(() => {
  if (props.courseInfo.courseType === null || props.courseInfo.courseType === undefined) {
    return t('course.courseType.REQUIRED')
  }
  return props.courseInfo.courseType === CourseTypeEnum.REQUIRED
      ? t('course.courseType.REQUIRED')
      : t('course.courseType.ELECTIVE')
})

// 图片加载错误处理
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.src = defaultCourseImage
}

// 模拟课程进度数据（实际项目中应该从API获取）
const completedChapters = ref(8)
const totalChapters = ref(12)

// 计算课程进度
const courseProgress = computed(() => {
  if (totalChapters.value === 0) return 0
  return Math.round((completedChapters.value / totalChapters.value) * 100)
})

</script>

<style lang="scss" scoped>
@use './CourseCard.scss';
</style>
