<template>
  <div class="my-courses-container">
    <page-header :title="t('course.myCourses')"/>

    <n-card size="small">
      <!-- 搜索表单和按钮 -->
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
        <!-- 添加课程按钮 - 只有教师或管理员才能看到 -->
        <n-button v-if="isTeacher || isAdmin" class="add-course-btn" type="primary" @click="handleAddCourse">
          <template #icon>
            <n-icon>
              <svg height="16" viewBox="0 0 24 24" width="16">
                <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="currentColor"/>
              </svg>
            </n-icon>
          </template>
          {{ t('course.actions.addCourse') }}
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

    <!-- 添加课程对话框 -->
    <CourseFormDialog
        v-model:visible="showAddCourseDialog"
        :modal-width="'900px'"
        :show-fields="['courseName', 'courseType', 'teacherId', 'assistantTeacherIds', 'semester', 'location', 'status', 'isPublic', 'coverImageUrl', 'description']"
        form-layout="full"
        mode="add"
        @submit="handleFormSubmit"
    />
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref} from 'vue'
import type * as courseType from '@/types/course'
import {useI18n} from 'vue-i18n'
import {useRouter} from 'vue-router'
import CourseCard from './CourseCard.vue'
import CourseSearchForm from '../components/CourseSearchForm.vue'
import CourseFormDialog from '../components/CourseFormDialog.vue'
import PageHeader from '@/components/common/PageHeader.vue'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import * as courseApi from '@/api/course'
import {useUserStore} from '@/store/modules/user'
import {getDiscreteApi} from '@/utils/naiveUIHelper'
import {
  addCourseStudent,
  listMyCourseForStudent,
  getDefaultMyCourseQuery as getDefaultMyCourseQueryStudent
} from '@/api/course/courseStudent'
import {listMyCourseForTeacher} from '@/api/course/courseTeacher'

const {t} = useI18n()
const {message} = getDiscreteApi()
const userStore = useUserStore()
const router = useRouter()

// 检查用户是否为管理员
const isAdmin = computed(() => userStore.hasRole('ADMIN'))

// 检查用户是否为教师
const isTeacher = computed(() => userStore.teacherInfo?.id !== null && userStore.teacherInfo?.id !== undefined)

// 检查用户是否为学生
const isStudent = computed(() => userStore.studentInfo?.id !== null && userStore.studentInfo?.id !== undefined)

// 搜索表单（使用 any 以兼容 admin/学生 两种查询结构）
const searchForm = ref<any>(courseApi.getDefaultCourseQuery())

// 加载状态
const loading = ref(false)

// 课程列表数据（统一为 CourseVO[]，方便模板渲染）
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

// 添加课程相关状态
const showAddCourseDialog = ref(false)

// 根据角色选择的 API：admin -> listCourse；teacher -> listMyCourseForTeacher；student -> listMyCourse
// 优先判断管理员身份（即使该账号同时是教师）
const courseApiFunction = computed(() => {
  if (isAdmin.value) {
    return courseApi.listCourse
  }
  // 教师（仅限非管理员的教师）使用教师专用接口
  if (userStore.teacherInfo?.id && !isAdmin.value) {
    return listMyCourseForTeacher
  }
  // 其余视为学生（仅限非管理员的学生），调用我的课程接口
  return listMyCourseForStudent
})

// 初始化搜索表单（根据角色选择不同的默认查询并自动填充 teacherId/studentId）
const initializeSearchForm = () => {
  let defaultQuery: any
  if (isAdmin.value) {
    defaultQuery = courseApi.getDefaultCourseQuery()
  } else if (userStore.teacherInfo?.id) {
    // 教师使用课程查询但需要将 teacherId 写入查询
    defaultQuery = courseApi.getDefaultCourseQuery()
  } else {
    // 学生使用我的课程查询
    defaultQuery = getDefaultMyCourseQueryStudent()
  }

  Object.assign(searchForm.value, defaultQuery)

  // 教师场景：确保传入 teacherId（仅当不是管理员时）
  if (userStore.teacherInfo?.id && !isAdmin.value) {
    ;(searchForm.value as any).teacherId = userStore.teacherInfo.id
  }

  // 学生场景：确保传入 studentId；同时如果存在 teacherId（例如从上级或筛选），也保留或设置（仅当不是管理员时设置 teacherId）
  if (!userStore.teacherInfo?.id && userStore.studentInfo?.id) {
    ;(searchForm.value as any).studentId = userStore.studentInfo.id
  }
  if (userStore.studentInfo?.id && userStore.teacherInfo?.id) {
    ;(searchForm.value as any).studentId = userStore.studentInfo.id
    if (!isAdmin.value) {
      ;(searchForm.value as any).teacherId = userStore.teacherInfo.id
    }
  }
}

// 加载课程数据
const loadCourseData = async () => {
  loading.value = true
  const queryParams = {
    ...searchForm.value,
    pageNum: pagination.pageNum,
    pageSize: pagination.pageSize
  }

  const result = await courseApiFunction.value(queryParams as any)

  // 提取分页数据
  const {data = [], total = 0} = (result as any) || {}

  // 如果是学生端的 listMyCourse，后端返回的是 MyCourseVO[]，每项包含 courseVO；
  // 如果是管理员，返回的是 CourseVO[]
  if (Array.isArray(data)) {
    // 如果后端返回的是 MyCourseVO[]（包含 courseVO 字段），则映射取出 courseVO
    if (data.length > 0 && Object.prototype.hasOwnProperty.call(data[0], 'courseVO')) {
      courseList.value = (data as any[]).map(item => item?.courseVO).filter(Boolean)
    } else {
      // 否则直接当作 CourseVO[] 使用（兼容管理员或教师使用 listCourse 的情况）
      courseList.value = data as courseType.CourseVO[]
    }
  } else {
    courseList.value = []
  }

  pagination.total = total
  loading.value = false
}

// 重置搜索
const resetSearch = () => {
  initializeSearchForm()
}


// 处理分页变化
const onPageChange = (page: number) => {
  pagination.pageNum = page
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
  router.push(`/course/detail/${_course.id}`)
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

// 处理添加课程按钮点击
const handleAddCourse = () => {
  showAddCourseDialog.value = true
}

// 表单提交处理
const handleFormSubmit = async (formData: courseType.CourseDTO) => {
  // 如果是教师或管理员，teacherId 为当前登录用户的教师 ID
  if (userStore.teacherInfo?.id) {
    formData.teacherId = userStore.teacherInfo.id
  }

  await courseApi.addCourse(formData)

  message.success(t('course.actions.addSuccess'))
  showAddCourseDialog.value = false
  // 重新加载课程数据
  loadCourseData()
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
