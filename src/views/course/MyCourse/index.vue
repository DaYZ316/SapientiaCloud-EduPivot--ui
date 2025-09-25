<template>
  <div class="my-courses-container">
    <page-header :title="t('course.myCourses')"/>

    <n-card size="small">
      <!-- 搜索表单和加课按钮 -->
      <div class="search-container">
        <course-search-form
            v-model="searchForm"
            @reset="handleResetSearch"
            @search="handleSearch"
        />
        <!-- 加课按钮 - 只有学生身份才能看到 -->
        <n-button v-if="isStudent" class="enroll-course-btn" type="primary" @click="showEnrollDialog = true">
          <template #icon>
            <n-icon>
              <svg height="16" viewBox="0 0 24 24" width="16">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
              </svg>
            </n-icon>
          </template>
          {{ t('course.enroll.addCourse') }}
        </n-button>
      </div>

      <!-- 加载状态 -->
      <LoadingSpinner
          v-if="loading"
          :title="t('course.messages.loading')"
          min-height="400px"
          size="large"
      />

      <!-- 课程卡片视图 -->
      <div v-else class="course-card-container">
        <div v-if="courseList.length === 0" class="empty-state">
          <n-empty :description="t('course.empty.noData')"/>
        </div>
        <div v-else>
          <!-- 课程网格 -->
          <div class="course-grid">
            <course-card
                v-for="course in courseList"
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
import {computed, onMounted, reactive, ref} from 'vue'
import type * as courseType from '@/types/course'
import {useI18n} from 'vue-i18n'
import {useRouter} from 'vue-router'
import CourseCard from './CourseCard.vue'
import CourseSearchForm from '../components/CourseSearchForm.vue'
import PageHeader from '../components/PageHeader.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import * as courseApi from '@/api/course'
import {useUserStore} from '@/store/modules/user'
import {getDiscreteApi} from '@/utils/naiveUIHelper'
import {addCourseStudent} from '@/api/course/courseStudent'

const {t} = useI18n()
const {message} = getDiscreteApi()
const userStore = useUserStore()
const router = useRouter()

// 检查用户是否为管理员
const isAdmin = computed(() => userStore.hasRole('ADMIN'))

// 检查用户是否为学生
const isStudent = computed(() => userStore.studentInfo?.id !== null && userStore.studentInfo?.id !== undefined)

// 搜索表单
const searchForm = reactive<courseType.CourseQueryParams>(courseApi.getDefaultCourseQuery())

// 加载状态
const loading = ref(false)

// 课程列表数据
const courseList = ref<courseType.CourseVO[]>([])

// 分页状态
const pagination = reactive({
  pageNum: 1,
  pageSize: 10,
  total: 0
})

// 分页配置
const pageSizes = [10, 20, 30, 50]
const showQuickJumper = true
const showSizePicker = true

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

// 课程API函数
const courseApiFunction = computed(() => courseApi.listCourse)

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
  loading.value = true
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
  loading.value = false
}

// 重置搜索
const resetSearch = () => {
  initializeSearchForm()
}


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
  // 跳转到课程详情页面
  router.push(`/course/detail/${_course.id}`)
}

// 处理继续课程按钮点击
const handleContinueCourse = (_course: courseType.CourseVO) => {
  // 跳转到课程学习页面
  router.push(`/course/learn/${_course.id}`)
}

// 处理加课
const handleEnrollCourse = async () => {
  if (!enrollFormRef.value) return

  await enrollFormRef.value.validate()

  if (!userStore.studentInfo?.id) {
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
  enrollLoading.value = false
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
