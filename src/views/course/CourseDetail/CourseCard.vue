<template>
  <div class="course-card">
    <!-- 信息模块 (40% 宽度，最左边) -->
    <div class="info-module">
      <div class="course-info">
        <div class="course-title">
          <h1>{{ courseInfo.courseName }}</h1>
          <n-tag
              :type="courseInfo.courseType === 0 ? 'error' : 'success'"
              class="course-type-tag"
              round
              size="medium"
          >
            {{ getCourseTypeLabel(courseInfo.courseType ?? 0) }}
          </n-tag>
        </div>

        <div class="course-meta">
          <div v-if="courseInfo.semester" class="meta-item semester-item">
            <n-icon color="#1890ff" size="16">
              <CalendarOutline/>
            </n-icon>
            <n-tag round size="small" type="info">
              {{ courseInfo.semester }}
            </n-tag>
          </div>
          <div v-if="courseInfo.createTime" class="meta-item create-time-item">
            <n-icon color="#52c41a" size="16">
              <TimeOutline/>
            </n-icon>
            <n-tag round size="small" type="success">
              {{ formatToBeijingTime(new Date(courseInfo.createTime)) }}
            </n-tag>
          </div>
        </div>

        <div v-if="courseInfo.description" class="course-description">
          <p>{{ courseInfo.description }}</p>
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
      <div class="progress-chart">
        <CourseGaugeChart
            :max="100"
            :value="courseProgress"
            title="课程进度"
            unit="%"
        />
        <div class="progress-info">
          <h3>学习进度</h3>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue'
import {CalendarOutline, TimeOutline} from '@vicons/ionicons5'
import type {CourseVO} from '@/types/course'
import {getCourseTypeLabel} from '@/enum/course/courseTypeEnum'
import {formatToBeijingTime} from '@/utils/dateUtil'
import CourseGaugeChart from './CourseGaugeChart.vue'
import defaultCourseImage from '@/assets/image/default-course.png'

// 定义组件属性
interface Props {
  courseInfo: CourseVO
}

// 接收属性
defineProps<Props>()

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
