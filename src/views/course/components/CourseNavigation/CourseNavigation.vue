<template>
  <div class="course-navigation">
    <n-card :bordered="false" class="navigation-card">
      <div class="navigation-buttons">
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
          {{ $t('course.navigation.students') }}
        </n-button>

        <n-button
            block
            class="nav-button"
            size="large"
            @click="handleNavigation('forum')"
        >
          <template #icon>
            <n-icon>
              <ChatbubblesOutline/>
            </n-icon>
          </template>
          {{ $t('course.navigation.forum') }}
        </n-button>

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
          {{ $t('course.navigation.chapters') }}
        </n-button>

        <n-button
            block
            class="nav-button"
            size="large"
            @click="handleNavigation('classroom')"
        >
          <template #icon>
            <n-icon>
              <SchoolOutline/>
            </n-icon>
          </template>
          {{ $t('course.navigation.classroom') }}
        </n-button>
      </div>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import {useRouter} from 'vue-router'
import {useMessage} from 'naive-ui'
import {ChatbubblesOutline, LibraryOutline, PeopleOutline, SchoolOutline} from '@vicons/ionicons5'

// 定义props
interface Props {
  courseId: string
}

const props = defineProps<Props>()

// 路由和国际化
const router = useRouter()
const message = useMessage()

// 处理课程功能导航
const handleNavigation = (type: string) => {
  const courseIdValue = props.courseId
  if (!courseIdValue) {
    message.error('课程ID无效')
    return
  }

  switch (type) {
    case 'students':
      router.push(`/course/${courseIdValue}/students`)
      break
    case 'forum':
      router.push(`/course/${courseIdValue}/forum`)
      break
    case 'chapters':
      router.push(`/course/${courseIdValue}/chapters`)
      break
    case 'classroom':
      router.push(`/course/${courseIdValue}/classroom`)
      break
    default:
      break
  }
}
</script>

<style lang="scss" scoped>
@use './CourseNavigation.scss';
</style>
