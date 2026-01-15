<template>
  <div class="class-practice">
    <!-- 面包屑导航 -->
    <CourseBreadcrumb
        :course-info="courseInfo"
        :current-page="t('course.navigation.practice')"
    />

    <!-- 搜索表单 -->
    <div class="search-form-container">
      <ClassroomPracticeSearchForm
        v-model="searchForm"
        :course-id="courseId"
        @search="handleSearch"
        @reset="handleResetSearch"
      />
    </div>

    <!-- 主要内容区域 -->
    <div class="main-content">
      <!-- 左侧练习列表 -->
      <div class="practice-sidebar">
        <PracticeList
            ref="practiceListRef"
            :course-id="courseId"
            :selected-practice-id="selectedPracticeId"
            :search-query="searchForm"
            :use-course-records="false"
            @select="handlePracticeSelect"
        />
      </div>

        <!-- 右侧练习详情 -->
      <n-card v-if="selectedPractice" class="practice-detail-card">
        <!-- 管理员和教师显示 PracticeDetail -->
        <PracticeDetail
            v-if="isAdminOrTeacher"
            :selected-practice="selectedPractice"
            :selected-classroom-info="selectedClassroomInfo"
        />
        <!-- 学生显示 StudentPracticeDetail -->
        <StudentPracticeDetail
            v-else
            :selected-practice="selectedPractice"
            :selected-classroom-info="selectedClassroomInfo"
        />
      </n-card>

      <!-- 空白页 -->
      <n-card v-else class="practice-empty-card">
        <n-empty :description="t('course.classPractice.selectPractice')"/>
      </n-card>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref} from 'vue'
import {useRoute} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useTitle} from '@/utils/titleUtil'
import type {ClassroomQuestionVO} from '@/types/classroom'
import CourseBreadcrumb from '../../components/CourseBreadcrumb/CourseBreadcrumb.vue'
import PracticeList from './components/PracticeList.vue'
import PracticeDetail from './components/PracticeDetail.vue'
import StudentPracticeDetail from './components/StudentPracticeDetail.vue'
import ClassroomPracticeSearchForm from './components/ClassroomPracticeSearchForm.vue'
import {useCourseStore, useUserStore} from '@/store'
import type {ClassroomQuestionPageQueryDTO} from '@/types/classroom'
import * as ClassroomPracticeApi from '@/api/classroom/classroomPractice'

// 路由和国际化
const route = useRoute()
const {t} = useI18n()
const {setTitle} = useTitle()
const courseStore = useCourseStore()

// 响应式数据
const selectedPractice = ref<ClassroomQuestionVO | null>(null)
const selectedPracticeId = ref<string | null>(null)
const selectedClassroomInfo = ref<any>(null)
const practiceListRef = ref<any>(null)

// 搜索表单
const searchForm = reactive<ClassroomQuestionPageQueryDTO>(ClassroomPracticeApi.getDefaultClassroomQuestionPageQueryDTO())

// 计算属性
const courseId = computed(() => route.params.courseId as string)
const courseInfo = computed(() => courseStore.currentCourseInfo)
const userStore = useUserStore()
const isAdminOrTeacher = computed(() => {
  const userRoles = userStore.userInfo?.roles || [];
  const isAdmin = userRoles.some(role => role.roleKey === 'ADMIN' || role.admin === true);
  const isTeacher = userStore.hasRole('TEACHER') && userStore.teacherInfo !== null;
  return isAdmin || isTeacher;
})

// 方法
const handlePracticeSelect = (practice: ClassroomQuestionVO, classroomInfo?: any) => {
  selectedPractice.value = practice
  selectedPracticeId.value = practice.id
  selectedClassroomInfo.value = classroomInfo
}

// 搜索处理
const handleSearch = () => {
  // 触发练习列表重新搜索
  if (practiceListRef.value) {
    practiceListRef.value.loadPracticeList()
  }
}

// 重置搜索处理
const handleResetSearch = () => {
  // 触发练习列表重新加载，但保持选中的练习
  if (practiceListRef.value) {
    practiceListRef.value.loadPracticeList()
  }
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
@use '@/assets/styles' as *;

// 搜索表单容器样式
.search-form-container {
  margin-bottom: 16px;
  background-color: var(--background-color);
  border-radius: 8px;
}

// 练习详情卡片样式
.practice-detail-card {
  background-color: var(--background-color);
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: none;

  :deep(.n-card__content) {
    height: 100%;
    overflow-y: auto;
    padding: 0;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--border-color);
      border-radius: 2px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: var(--text-secondary-color);
    }
  }

  :deep(.n-card__header) {
    padding: 0;
    border-bottom: none;
    background: transparent;
  }
}

// 空白页卡片样式
.practice-empty-card {
  background-color: var(--background-color);
  height: 100%;
  max-height: 100%;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: none;
  display: flex;
  align-items: center;
  justify-content: center;

  :deep(.n-card__content) {
    height: 100%;
    overflow-y: auto;
    padding: 0 20px 20px 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-track {
      background: transparent;
    }

    &::-webkit-scrollbar-thumb {
      background: var(--border-color);
      border-radius: 2px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: var(--text-secondary-color);
    }
  }

  :deep(.n-card__header) {
    display: none;
  }
}
</style>
