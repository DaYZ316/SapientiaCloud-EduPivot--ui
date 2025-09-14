<template>
  <div class="my-courses-container">
    <page-header :title="t('course.myCourses')"/>

    <n-card size="small">
      <!-- 搜索表单 -->
      <course-search-form
          v-model="searchForm"
          :is-student="isStudent"
          @reset="handleResetSearch"
          @search="handleSearch"
          @enroll-course="showEnrollDialog = true"
      />

      <!-- 课程卡片视图 -->
      <div class="course-card-container">
        <div v-if="courseList.length === 0" class="empty-state">
          <n-empty :description="t('course.empty.noData')"/>
        </div>
        <div v-else>
          <!-- 课程网格 -->
          <div class="course-grid">
            <course-card
                v-for="course in courseWithAvatars"
                :key="course.id"
                :course="course"
                @course-click="handleCourseClick"
                @continue-course="handleContinueCourse"
            />
          </div>

          <!-- 分页组件 -->
          <div class="pagination-container">
            <n-pagination
                v-model:page="pagination.pageNum"
                v-model:page-size="pagination.pageSize"
                :item-count="pagination.total"
                :page-sizes="pageSizes"
                :show-quick-jumper="showQuickJumper"
                :show-size-picker="showSizePicker"
                @update:page="onPageChange"
                @update:page-size="onSizeChange"
            />
          </div>
        </div>
      </div>
    </n-card>

    <!-- 加课对话框 -->
    <n-modal v-model:show="showEnrollDialog" :title="t('course.enroll.addCourseTitle')" preset="dialog">
      <n-form ref="enrollFormRef" :model="enrollForm" :rules="enrollRules" label-placement="left" label-width="80px">
        <n-form-item :label="t('course.enroll.courseId')" path="courseId">
          <n-input
              v-model:value="enrollForm.courseId"
              :placeholder="t('course.enroll.courseIdPlaceholder')"
              clearable
          />
        </n-form-item>
      </n-form>
      <template #action>
        <n-space>
          <n-button @click="showEnrollDialog = false">{{ t('common.cancel') }}</n-button>
          <n-button :loading="enrollLoading" type="primary" @click="handleEnrollCourse">
            {{ t('course.enroll.confirmAdd') }}
          </n-button>
        </n-space>
      </template>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref, watch} from 'vue'
import type * as courseType from '@/types/course'
import type {TeacherVO} from '@/types/teacher'
import type {SysUserVO} from '@/types/system/user'
import {useI18n} from 'vue-i18n'
import CourseCard from './CourseCard.vue'
import CourseSearchForm from '../components/CourseSearchForm.vue'
import PageHeader from '../components/PageHeader.vue'
import * as courseApi from '@/api/course'
import {useUserStore} from '@/store/modules/user'
import {getDiscreteApi} from '@/utils/naiveUIHelper'
import {getTeacherById} from '@/api/teacher'
import {getUserById} from '@/api/system/user'
import {addCourseStudent} from '@/api/course/courseStudent'

const {t} = useI18n()
const {message} = getDiscreteApi()
const userStore = useUserStore()

// 检查用户是否为管理员
const isAdmin = computed(() => userStore.hasRole('ADMIN'))

// 检查用户是否为学生
const isStudent = computed(() => userStore.studentInfo?.id !== null && userStore.studentInfo?.id !== undefined)

// 搜索表单
const searchForm = reactive<courseType.CourseQueryParams>(courseApi.getDefaultCourseQuery())

// 课程列表数据
const courseList = ref<courseType.CourseVO[]>([])

// 分页状态
const pagination = reactive({
  pageNum: 1,
  pageSize: 12,
  total: 0
})

// 分页配置
const pageSizes = [12, 16, 24, 32]
const showQuickJumper = true
const showSizePicker = true

// 默认图片
const defaultUserAvatar = '/src/assets/image/default-userAvatar.png'

// 加课相关状态
const showEnrollDialog = ref(false)
const enrollLoading = ref(false)
const enrollFormRef = ref()

// 加课表单
const enrollForm = reactive({
  courseId: null as string | null
})

// 加课表单验证规则
const enrollRules = computed(() => ({
  courseId: [
    {required: true, message: t('course.enroll.courseIdRequired'), trigger: 'blur'}
  ]
}))

// 教师头像缓存
const teacherAvatarCache = ref<Map<string, string>>(new Map())
const loadingAvatars = ref<Set<string>>(new Set())

// 课程API函数
const courseApiFunction = computed(() => courseApi.listCourse)

// 获取教师头像
const getTeacherAvatar = async (teacherId: string): Promise<string> => {
  if (teacherAvatarCache.value.has(teacherId)) {
    return teacherAvatarCache.value.get(teacherId)!
  }

  if (loadingAvatars.value.has(teacherId)) {
    return defaultUserAvatar
  }

  try {
    loadingAvatars.value.add(teacherId)

    const teacherResponse = await getTeacherById(teacherId)
    const teacher: TeacherVO = teacherResponse.data

    if (teacher.sysUserId) {
      const userResponse = await getUserById(teacher.sysUserId)
      const user: SysUserVO = userResponse.data
      const avatarUrl = user.avatar || defaultUserAvatar
      teacherAvatarCache.value.set(teacherId, avatarUrl)
      return avatarUrl
    }

    teacherAvatarCache.value.set(teacherId, defaultUserAvatar)
    return defaultUserAvatar
  } catch {
    teacherAvatarCache.value.set(teacherId, defaultUserAvatar)
    return defaultUserAvatar
  } finally {
    loadingAvatars.value.delete(teacherId)
  }
}

// 计算属性：为每个课程获取教师头像
const courseWithAvatars = computed(() => {
  return courseList.value.map(course => ({
    ...course,
    teacherAvatar: teacherAvatarCache.value.get(course.teacherId) || defaultUserAvatar
  }))
})

// 初始化搜索表单
const initializeSearchForm = () => {
  const defaultQuery = courseApi.getDefaultCourseQuery()
  Object.assign(searchForm, defaultQuery)

  // 非管理员根据用户角色设置查询条件
  if (!isAdmin.value && userStore.teacherInfo?.id) {
    searchForm.teacherId = userStore.teacherInfo.id
  }
}

// 加载课程数据
const loadCourseData = async () => {
  try {
    const queryParams = {
      ...searchForm,
      pageNum: pagination.pageNum,
      pageSize: pagination.pageSize
    }

    const result = await courseApiFunction.value(queryParams)

    // 提取分页数据
    const {data = [], total = 0} = (result as any) || {}
    courseList.value = data
    pagination.total = total
  } catch (error) {
    message.error('加载课程数据失败')
    courseList.value = []
    pagination.total = 0
  }
}

// 重置搜索
const resetSearch = () => {
  initializeSearchForm()
}

// 监听课程列表变化，预加载教师头像
watch(() => courseList.value, (newCourseList) => {
  if (newCourseList?.length > 0) {
    newCourseList.forEach(course => {
      if (course.teacherId && !teacherAvatarCache.value.has(course.teacherId)) {
        getTeacherAvatar(course.teacherId)
      }
    })
  }
}, {immediate: true})

// 处理分页变化
const onPageChange = (newPagination: { pageNum: number, pageSize: number }) => {
  pagination.pageNum = newPagination.pageNum
  pagination.pageSize = newPagination.pageSize
  loadCourseData()
}

// 处理页大小变化
const onSizeChange = (size: number) => {
  pagination.pageNum = 1
  pagination.pageSize = size
  loadCourseData()
}

// 搜索处理
const handleSearch = () => {
  pagination.pageNum = 1
  loadCourseData()
}

// 重置搜索处理
const handleResetSearch = () => {
  resetSearch()
  pagination.pageNum = 1
  loadCourseData()
}

// 处理课程卡片点击
const handleCourseClick = (_course: courseType.CourseVO) => {
  // TODO: 跳转到课程详情页面
}

// 处理继续课程按钮点击
const handleContinueCourse = (_course: courseType.CourseVO) => {
  // TODO: 跳转到课程学习页面
}

// 处理加课
const handleEnrollCourse = async () => {
  if (!enrollFormRef.value) return

  try {
    await enrollFormRef.value.validate()

    if (!userStore.studentInfo?.id) {
      message.error('学生信息不存在')
      return
    }

    enrollLoading.value = true

    const courseStudentData = courseApi.getDefaultCourseStudentDTO()
    courseStudentData.studentId = userStore.studentInfo.id
    courseStudentData.courseId = enrollForm.courseId

    await addCourseStudent(courseStudentData)

    message.success(t('course.enroll.addSuccess'))
    showEnrollDialog.value = false
    enrollForm.courseId = null
    // 重新加载课程数据
    loadCourseData()
  } catch (error: any) {
    if (error.message) {
      message.error(error.message)
    } else {
      message.error(t('course.enroll.addFail'))
    }
  } finally {
    enrollLoading.value = false
  }
}

// 组件挂载时初始化
onMounted(() => {
  initializeSearchForm()
  loadCourseData()
})
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
