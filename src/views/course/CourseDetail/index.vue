<template>
  <div class="course-detail">
    <!-- 面包屑导航 -->
    <n-breadcrumb class="breadcrumb" size="large">
      <n-breadcrumb-item>
        <router-link to="/">{{ $t('course.home') }}</router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item>
        <router-link to="/course/my-courses">{{ $t('course.myCourses') }}</router-link>
      </n-breadcrumb-item>
      <n-breadcrumb-item v-if="courseInfo">
        {{ courseInfo.courseName }}
      </n-breadcrumb-item>
    </n-breadcrumb>

    <!-- 加载状态 -->
    <n-spin v-if="loading" size="large" style="width: 100%; height: 400px;"/>

    <!-- 课程详情内容 -->
    <div v-else-if="courseInfo" class="course-detail-content">
      <div class="content-layout">
        <!-- 左侧课程信息 -->
        <div class="course-section">
          <!-- 使用CourseCard组件显示课程信息 -->
          <CourseCard :course-info="courseInfo"/>
        </div>

        <!-- 右侧教师信息 -->
        <div class="teacher-section">
          <div v-if="teacherLoading" class="teacher-loading">
            <n-spin size="medium"/>
          </div>
          <TeacherCard
              v-else-if="teacherInfo"
              :teacher-info="teacherInfo"
          />
          <div v-else class="teacher-empty">
            <n-empty description="暂无教师信息"/>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useMessage} from 'naive-ui'
import * as CourseApi from '@/api/course/course'
import * as TeacherApi from '@/api/teacher'
import type {CourseVO} from '@/types/course'
import type {TeacherVO} from '@/types/teacher'
import TeacherCard from './TeacherCard.vue'
import CourseCard from './CourseCard.vue'

// 路由和国际化
const route = useRoute()
const router = useRouter()
const {t} = useI18n()
const message = useMessage()

// 响应式数据
const loading = ref(false)
const courseInfo = ref<CourseVO | null>(null)
const teacherLoading = ref(false)
const teacherInfo = ref<TeacherVO | null>(null)

// 计算属性
const courseId = computed(() => route.params.courseId as string)

// 方法
const loadCourseInfo = async () => {
  try {
    loading.value = true

    // 检查courseId是否有效
    if (!courseId.value || courseId.value === 'undefined') {
      message.error('课程ID无效')
      router.push('/course')
      return
    }

    const res = await CourseApi.getCourseById(courseId.value)
    if (res.success && res.data) {
      courseInfo.value = res.data
      // 加载课程信息成功后，加载教师信息
      await loadTeacherInfo(courseId.value)
    } else {
      message.error(t('course.messages.loadFail'))
    }
  } catch (error) {
    message.error(t('course.messages.loadFail'))
  } finally {
    loading.value = false
  }
}

const loadTeacherInfo = async (courseId: string) => {
  if (!courseId) return

  try {
    teacherLoading.value = true
    // 直接使用开课教师的ID获取教师信息
    if (courseInfo.value?.teacherId) {
      const res = await TeacherApi.getTeacherById(courseInfo.value.teacherId)
      if (res.success && res.data) {
        teacherInfo.value = res.data
      }
    }
  } catch (error) {
    // 教师信息加载失败不显示错误，因为不是关键信息
    console.warn('Failed to load teacher info:', error)
  } finally {
    teacherLoading.value = false
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
