<template>
  <div class="course-chapters">
    <!-- 面包屑导航 -->
    <CourseBreadcrumb
        :course-info="courseInfo"
        :current-page="$t('course.navigation.chapters')"
    />

  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import * as CourseApi from '@/api/course/course'
import type {CourseVO} from '@/types/course'
import CourseBreadcrumb from '../../components/CourseBreadcrumb/CourseBreadcrumb.vue'

// 路由和国际化
const route = useRoute()
const router = useRouter()

// 响应式数据
const courseInfo = ref<CourseVO | null>(null)

// 计算属性
const courseId = computed(() => route.params.courseId as string)

// 方法
const loadCourseInfo = async () => {
  if (!courseId.value || courseId.value === 'undefined') {
    router.push('/course')
    return
  }

  const res = await CourseApi.getCourseById(courseId.value)
  if (res.success && res.data) {
    courseInfo.value = res.data
  }
}

// 生命周期
onMounted(async () => {
  await loadCourseInfo()
})
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
