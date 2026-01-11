<template>
  <div class="class-practice">
    <!-- 面包屑导航 -->
    <CourseBreadcrumb
        :course-info="courseInfo"
        :current-page="$t('course.navigation.practice')"
    />

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧练习列表 -->
      <div class="practice-sidebar">
        <PracticeList
            :course-id="courseId"
            :selected-practice-id="selectedPracticeId"
            :use-course-records="false"
            @select="handlePracticeSelect"
        />
      </div>

      <!-- 右侧练习详情 -->
      <PracticeDetail
          :selected-practice="selectedPractice"
          :selected-classroom-info="selectedClassroomInfo"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue'
import {useRoute} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useTitle} from '@/utils/titleUtil'
import type {ClassroomQuestionVO} from '@/types/classroom'
import CourseBreadcrumb from '../../components/CourseBreadcrumb/CourseBreadcrumb.vue'
import PracticeList from './components/PracticeList.vue'
import PracticeDetail from './components/PracticeDetail.vue'
import {useCourseStore} from '@/store'

// 路由和国际化
const route = useRoute()
const {t} = useI18n()
const {setTitle} = useTitle()
const courseStore = useCourseStore()

// 响应式数据
const selectedPractice = ref<ClassroomQuestionVO | null>(null)
const selectedPracticeId = ref<string | null>(null)
const selectedClassroomInfo = ref<any>(null)

// 计算属性
const courseId = computed(() => route.params.courseId as string)
const courseInfo = computed(() => courseStore.currentCourseInfo)

// 方法
const handlePracticeSelect = (practice: ClassroomQuestionVO, classroomInfo?: any) => {
  selectedPractice.value = practice
  selectedPracticeId.value = practice.id
  selectedClassroomInfo.value = classroomInfo
}


// 设置页面标题
const setPageTitle = () => {
  if (courseInfo.value?.courseName) {
    const practiceTitle = t('course.navigation.practice')
    setTitle('classPractice', `${courseInfo.value.courseName} - ${practiceTitle}`)
  } else {
    setTitle('classPractice')
  }
}

// 生命周期
onMounted(async () => {
  // 设置课程ID，如果需要的话
  if (courseId.value && courseId.value !== 'undefined') {
    await courseStore.setCurrentCourseId(courseId.value, false)
  }
  setPageTitle()
})
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
