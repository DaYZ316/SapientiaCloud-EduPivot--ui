<template>
  <div class="course-tasks">
    <!-- 面包屑导航 -->
    <CourseBreadcrumb
        :course-info="courseInfo"
        :current-page="t('course.navigation.tasks')"
    />

    <div>
      <!-- 搜索框和操作按钮 -->
      <div class="search-and-actions">
        <div class="search-section">
          <n-input
              v-model:value="searchKeyword"
              :placeholder="t('course.tasks.searchPlaceholder')"
              clearable
              @input="handleSearch"
          >
            <template #prefix>
              <Icon :component="SearchOutline"/>
            </template>
          </n-input>
        </div>

        <div v-if="canAddTask" class="action-buttons">
          <n-button type="primary" @click="handleAdd">
            <template #icon>
              <Icon :component="AddOutline"/>
            </template>
            {{ t('course.tasks.addTask') }}
          </n-button>
        </div>
      </div>
    </div>

    <!-- 主要内容区域：左右分栏布局 -->
    <div class="main-content">
      <!-- 左侧任务列表 -->
      <n-card class="tasks-sidebar">
        <TaskList
            :loading="loading"
            :selected-task-id="selectedTaskId"
            :tasks="filteredTasks"
            @select="handleTaskSelect"
        />
      </n-card>

      <!-- 右侧任务详情 -->
      <n-card class="task-detail">
        <TaskDetail
            :course-id="courseId"
            :task="selectedTask"
            @delete="handleTaskDelete"
            @edit="handleTaskEdit"
            @update="handleTaskUpdate"
        />
      </n-card>
    </div>

  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue'
import {AddOutline, SearchOutline} from '@vicons/ionicons5'
import {useRoute, useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useTitle} from '@/utils/titleUtil'
import * as CourseTaskApi from '@/api/course/courseTask'
import type {CourseTaskVO} from '@/types/course/courseTask'
import {TaskStatusEnum} from '@/enum/course/taskStatusEnum'
import CourseBreadcrumb from '../../components/CourseBreadcrumb/CourseBreadcrumb.vue'
import TaskList from './TaskList.vue'
import TaskDetail from './TaskDetail.vue'
import Icon from '@/components/common/Icon.vue'
import {getDiscreteApi} from '@/utils/naiveUIHelper'
import {useUserStore} from '@/store/modules/user'
import {useCourseStore} from '@/store'

const {message} = getDiscreteApi()
const {t} = useI18n()
const route = useRoute()
const router = useRouter()
const {setTitle} = useTitle()
const userStore = useUserStore()
const courseStore = useCourseStore()

// 响应式数据
const courseInfo = computed(() => courseStore.currentCourseInfo)
const taskList = ref<CourseTaskVO[]>([])
const filteredTasks = ref<CourseTaskVO[]>([])
const searchKeyword = ref('')
const loading = ref(false)
const selectedTask = ref<CourseTaskVO | null>(null)
const selectedTaskId = ref<string | null>(null)

// 计算属性
const courseId = computed(() => route.params.courseId as string)

// 权限检查
const canAddTask = computed(() => {
  return userStore.hasRole('ADMIN') || userStore.hasRole('TEACHER')
})

// 设置动态标题
const setCourseTasksTitle = () => {
  if (courseInfo.value?.courseName) {
    // 设置动态标题：课程名称 - 课程任务
    const courseTasksTitle = t('app.title.course.courseTasks')
    setTitle('courseTasks', `${courseInfo.value.courseName} - ${courseTasksTitle}`)
  } else {
    // 如果课程信息还未加载，使用默认标题
    setTitle('courseTasks')
  }
}

// 加载课程信息
const loadCourseInfo = async () => {
  if (!courseId.value || courseId.value === 'undefined') {
    router.push('/course')
    return
  }

  await courseStore.setCurrentCourseId(courseId.value, true)
  // 设置动态标题
  setCourseTasksTitle()
}

// 过滤发布状态任务的辅助函数
const filterPublishedTasks = (tasks: CourseTaskVO[]): CourseTaskVO[] => {
  if (!tasks || tasks.length === 0) {
    return []
  }

  return tasks.filter(task => {
    // 只保留发布状态的任务
    return task.status === TaskStatusEnum.PUBLISHED
  })
}

// 获取第一个任务的辅助函数
const getFirstTask = (tasks: CourseTaskVO[]): CourseTaskVO | null => {
  if (!tasks || tasks.length === 0) {
    return null
  }

  // 按创建时间排序找到第一个任务
  const sortedTasks = [...tasks].sort((a, b) => (a.createTime || '').localeCompare(b.createTime || ''))
  return sortedTasks[0]
}

// 加载任务列表
const loadTaskList = async () => {
  if (!courseId.value || courseId.value === 'undefined') {
    return
  }

  loading.value = true
  try {
    const res = await CourseTaskApi.listAllCourseTaskByCourseId(courseId.value)

    // 处理任务数据
    let allTasks: CourseTaskVO[] = []
    if (res.success && res.data) {
      allTasks = Array.isArray(res.data) ? res.data : []
    } else if (res.data && Array.isArray(res.data)) {
      allTasks = res.data
    }

    // 过滤只显示发布状态的任务
    const publishedTasks = filterPublishedTasks(allTasks)
    taskList.value = publishedTasks
    filteredTasks.value = publishedTasks

    // 如果存在任务，自动选择第一个任务
    if (taskList.value.length > 0) {
      const firstTask = getFirstTask(taskList.value)
      if (firstTask) {
        selectedTaskId.value = firstTask.id
        selectedTask.value = firstTask
      }
    }
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  if (!searchKeyword.value.trim()) {
    filteredTasks.value = taskList.value
  } else {
    // 搜索任务
    const searchResults = taskList.value.filter(task => {
      // 确保只搜索发布状态的任务
      if (task.status !== TaskStatusEnum.PUBLISHED) {
        return false
      }

      const keyword = searchKeyword.value.toLowerCase()
      return (
          task.taskName?.toLowerCase().includes(keyword) ||
          task.description?.toLowerCase().includes(keyword) ||
          task.taskContent?.toLowerCase().includes(keyword)
      )
    })

    filteredTasks.value = searchResults
  }
}

// 新增任务
function handleAdd() {
  router.push(`/course/detail/${courseId.value}/tasks/control`)
}

// 任务选择处理
function handleTaskSelect(task: CourseTaskVO) {
  selectedTaskId.value = task.id
  selectedTask.value = task
}

// 任务更新处理
function handleTaskUpdate() {
  // 重新加载任务列表
  loadTaskList()
}

// 任务编辑处理
function handleTaskEdit(_task: CourseTaskVO) {
  // 编辑功能已实现，可以跳转到编辑页面
  router.push(`/course/detail/${courseId.value}/tasks/control`)
}

// 任务删除处理
async function handleTaskDelete(task: CourseTaskVO) {
  if (!task || !task.id) {
    return
  }

  try {
    // 调用删除API
    const res = await CourseTaskApi.removeCourseTaskById(task.id)

    if (res.success || res.code === 200) {
      // 显示删除成功消息
      message.success(t('course.tasks.deleteSuccess'))

      // 删除成功后重新加载任务列表
      await loadTaskList()
      // 清空当前选中的任务
      selectedTask.value = null
      selectedTaskId.value = null
    }
  } catch (error) {
  }
}

// 生命周期
onMounted(async () => {
  await loadCourseInfo()
  await loadTaskList()
})
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>