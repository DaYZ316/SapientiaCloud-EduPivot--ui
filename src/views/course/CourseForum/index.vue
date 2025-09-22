<template>
  <div class="course-forum">
    <!-- 面包屑导航 -->
    <CourseBreadcrumb
        :course-info="courseInfo"
        :current-page="$t('course.navigation.forum')"
    />

    <!-- 暂未开放提示 -->
    <div class="coming-soon-container">
      <n-card :bordered="false" class="coming-soon-card">
        <div class="coming-soon-content">
          <n-icon color="#d03050" size="80">
            <ChatbubblesOutline/>
          </n-icon>
          <h2 class="coming-soon-title">{{ $t('course.comingSoon.title') }}</h2>
          <p class="coming-soon-description">{{ $t('course.comingSoon.forumDescription') }}</p>
          <n-button type="primary" @click="goBack">
            {{ $t('common.back') }}
          </n-button>
        </div>
      </n-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {ChatbubblesOutline} from '@vicons/ionicons5'
import * as CourseApi from '@/api/course/course'
import type {CourseVO} from '@/types/course'
import CourseBreadcrumb from '../components/CourseBreadcrumb/CourseBreadcrumb.vue'

// 路由和国际化
const route = useRoute()
const router = useRouter()

// 响应式数据
const courseInfo = ref<CourseVO | null>(null)

// 计算属性
const courseId = computed(() => route.params.courseId as string)

// 方法
const loadCourseInfo = async () => {
  try {
    if (!courseId.value || courseId.value === 'undefined') {
      router.push('/course')
      return
    }

    const res = await CourseApi.getCourseById(courseId.value)
    if (res.success && res.data) {
      courseInfo.value = res.data
    }
  } catch (error) {
    // 处理错误
  }
}

const goBack = () => {
  router.push(`/course/${courseId.value}`)
}

// 生命周期
onMounted(async () => {
  await loadCourseInfo()
})
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
