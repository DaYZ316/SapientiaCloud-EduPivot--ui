<template>
  <div class="course-navigation">
    <n-card :bordered="false" class="navigation-card">
      <div class="navigation-buttons">
        <n-button
            block
            class="nav-button"
            size="large"
            @click="handleNavigation('chapters')"
        >
          <template #icon>
            <n-icon>
              <LibraryOutline/>
            </n-icon>
          </template>
          {{ t('course.navigation.chapters') }}
        </n-button>

        <n-button
            block
            class="nav-button"
            size="large"
            @click="handleNavigation('forum')"
        >
          <template #icon>
            <n-icon>
              <ChatbubbleOutline/>
            </n-icon>
          </template>
          {{ t('course.navigation.forum') }}
        </n-button>

        <n-button
            block
            class="nav-button"
            size="large"
            @click="handleNavigation('students')"
        >
          <template #icon>
            <n-icon>
              <PeopleOutline/>
            </n-icon>
          </template>
          {{ t('course.navigation.students') }}
        </n-button>

        <n-button
            block
            class="nav-button"
            size="large"
            @click="handleNavigation('tasks')"
        >
          <template #icon>
            <n-icon>
              <CheckmarkCircleOutline/>
            </n-icon>
          </template>
          {{ t('course.navigation.tasks') }}
        </n-button>

        <n-button
            block
            class="nav-button"
            size="large"
            @click="handleNavigation('questions')"
        >
          <template #icon>
            <n-icon>
              <HelpCircleOutline/>
            </n-icon>
          </template>
          {{ t('course.navigation.questions') }}
        </n-button>

        <n-button
            block
            class="nav-button"
            size="large"
            @click="handleNavigation('practice')"
        >
          <template #icon>
            <n-icon>
              <BookOutline/>
            </n-icon>
          </template>
          {{ t('course.navigation.practice') }}
        </n-button>

        <n-button
            block
            class="nav-button nav-button-wide"
            size="large"
            @click="handleNavigation('classroom')"
        >
          <template #icon>
            <n-icon>
              <SchoolOutline/>
            </n-icon>
          </template>
          {{ t('course.navigation.classroom') }}
        </n-button>

      </div>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import {useRouter} from 'vue-router'
import { useI18n } from 'vue-i18n'
import {
  BookOutline,
  ChatbubbleOutline,
  CheckmarkCircleOutline,
  HelpCircleOutline,
  LibraryOutline,
  PeopleOutline,
  SchoolOutline
} from '@vicons/ionicons5'

// 定义props
interface Props {
  courseId: string
}

const props = defineProps<Props>()

// 国际化
const { t } = useI18n()

// 路由
const router = useRouter()

// 处理课程功能导航
const handleNavigation = (type: string) => {
  const courseIdValue = props.courseId
  if (!courseIdValue) {
    return
  }

  switch (type) {
    case 'students':
      router.push(`/course/detail/${courseIdValue}/students`)
      break
    case 'forum':
      router.push(`/course/detail/${courseIdValue}/forum`)
      break
    case 'chapters':
      router.push(`/course/detail/${courseIdValue}/chapters`)
      break
    case 'classroom':
      router.push(`/course/detail/${courseIdValue}/classroom`)
      break
    case 'tasks':
      router.push(`/course/detail/${courseIdValue}/tasks`)
      break
    case 'questions':
      router.push(`/course/detail/${courseIdValue}/questions`)
      break
    case 'practice':
      router.push(`/course/detail/${courseIdValue}/practice`)
      break
    default:
      break
  }
}
</script>

<style lang="scss" scoped>
@use './CourseNavigation.scss';
</style>