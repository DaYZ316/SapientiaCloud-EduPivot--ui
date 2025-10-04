<template>
  <div class="course-students">
    <!-- 面包屑导航 -->
    <CourseBreadcrumb
        :course-info="courseInfo"
        :current-page="t('course.navigation.students')"
    />

  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useTitle} from '@/utils/titleUtil'
import * as CourseApi from '@/api/course/course'
import type {CourseVO} from '@/types/course'
import CourseBreadcrumb from '../../components/CourseBreadcrumb/CourseBreadcrumb.vue'

// 路由和国际化
const route = useRoute()
const router = useRouter()
const {t} = useI18n()
const {setTitle} = useTitle()

// 响应式数据
const courseInfo = ref<CourseVO | null>(null)

// 计算属性
const courseId = computed(() => route.params.courseId as string)

// 设置动态标题
const setCourseStudentsTitle = () => {
  if (courseInfo.value?.courseName) {
    // 设置动态标题：课程名称 - 课程学生
    const courseStudentsTitle = t('app.title.course.courseStudents')
    setTitle('courseStudents', `${courseInfo.value.courseName} - ${courseStudentsTitle}`)
  } else {
    // 如果课程信息还未加载，使用默认标题
    setTitle('courseStudents')
  }
}

// 方法
const loadCourseInfo = async () => {
  if (!courseId.value || courseId.value === 'undefined') {
    router.push('/course')
    return
  }

  const res = await CourseApi.getCourseById(courseId.value)
  if (res.success && res.data) {
    courseInfo.value = res.data
    // 设置动态标题
    setCourseStudentsTitle()
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
