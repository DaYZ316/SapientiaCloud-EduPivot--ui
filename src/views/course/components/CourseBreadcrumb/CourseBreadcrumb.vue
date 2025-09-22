<template>
  <div class="breadcrumb-container">
    <n-breadcrumb class="breadcrumb" size="large">
      <n-breadcrumb-item>
        <router-link to="/">{{ $t('course.home') }}</router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        <router-link to="/course/my-courses">{{ $t('course.myCourses') }}</router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item v-if="courseInfo">
        <router-link v-if="showCourseLink" :to="`/course/detail/${courseId}`">
          {{ courseInfo.courseName }}
        </router-link>
        <span v-else>{{ courseInfo.courseName }}</span>
      </n-breadcrumb-item>
      <n-breadcrumb-item v-if="currentPage">
        {{ currentPage }}
      </n-breadcrumb-item>
    </n-breadcrumb>

    <!-- 操作按钮插槽 -->
    <div v-if="$slots.actions" class="breadcrumb-actions">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import {useRoute} from 'vue-router'
import type {CourseVO} from '@/types/course'

// 定义组件属性
interface Props {
  courseInfo?: CourseVO | null
  currentPage?: string
  showCourseLink?: boolean
}

withDefaults(defineProps<Props>(), {
  courseInfo: null,
  currentPage: '',
  showCourseLink: true
})

// 路由和国际化
const route = useRoute()

// 计算属性
const courseId = computed(() => route.params.courseId as string)
</script>

<style lang="scss" scoped>
@use './CourseBreadcrumb.scss';
</style>
