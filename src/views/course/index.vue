<template>
  <div class="course-management-container">
    <div class="page-header">
      <n-button circle quaternary @click="goBack">
        <template #icon>
          <Icon :component="ArrowBackOutline"/>
        </template>
      </n-button>
      <h1 class="page-title">{{ t('course.title') }}</h1>
    </div>

    <n-card :title="t('course.title')" size="small">
      <!-- 搜索表单 -->
      <n-form :model="searchForm" class="search-form" inline>
        <n-form-item :label="t('course.searchForm.courseName')" path="courseName">
          <n-input v-model:value="searchForm.courseName" :placeholder="t('course.searchForm.courseNamePlaceholder')"
                   clearable/>
        </n-form-item>
        <n-form-item :label="t('course.searchForm.courseType')" path="courseType">
          <n-select
              v-model:value="searchForm.courseType"
              :options="courseTypeOptions"
              :placeholder="t('course.searchForm.courseTypePlaceholder')"
              clearable
              style="min-width: 120px;"
          />
        </n-form-item>
        <n-form-item :label="t('course.searchForm.courseStatus')" path="status">
          <n-select
              v-model:value="searchForm.status"
              :options="courseStatusOptions"
              :placeholder="t('course.searchForm.courseStatusPlaceholder')"
              clearable
              style="min-width: 120px;"
          />
        </n-form-item>
        <n-form-item :label="t('course.searchForm.teacherId')" path="teacherId">
          <n-input v-model:value="searchForm.teacherId" :placeholder="t('course.searchForm.teacherIdPlaceholder')"
                   clearable/>
        </n-form-item>
        <n-form-item :label="t('course.searchForm.createTimeRange')" path="createTimeRange">
          <n-date-picker
              v-model:value="createTimeRange"
              :placeholder="t('course.searchForm.createTimeRangePlaceholder')"
              clearable
              style="min-width: 300px;"
              type="datetimerange"
              @update:value="onDateRangeChange"
          />
        </n-form-item>
        <n-form-item>
          <n-button type="primary" @click="handleSearch">
            <template #icon>
              <Icon :component="SearchOutline"/>
            </template>
            {{ t('common.search') }}
          </n-button>
          <n-button class="ml-2" @click="handleResetSearch">
            <template #icon>
              <Icon :component="RefreshOutline"/>
            </template>
            {{ t('common.reset') }}
          </n-button>
        </n-form-item>
      </n-form>

      <!-- 操作按钮 -->
      <div class="table-actions">
        <div class="actions-left">
          <n-button v-if="isAdmin" type="primary" @click="handleAdd">
            <template #icon>
              <Icon :component="AddOutline"/>
            </template>
            {{ t('course.actions.add') }}
          </n-button>
        </div>
        <div class="actions-right">
          <n-button-group>
            <n-button
                :type="viewMode === 'card' ? 'primary' : 'default'"
                @click="switchToCardView"
            >
              <template #icon>
                <Icon :component="GridOutline"/>
              </template>
              {{ t('course.view.card') }}
            </n-button>
            <n-button
                :type="viewMode === 'table' ? 'primary' : 'default'"
                @click="switchToTableView"
            >
              <template #icon>
                <Icon :component="ListOutline"/>
              </template>
              {{ t('course.view.table') }}
            </n-button>
          </n-button-group>
        </div>
      </div>

      <!-- 课程表格视图 -->
      <course-table-view
          v-if="viewMode === 'table'"
          ref="tableViewRef"
          :course-api-function="courseApiFunction"
          :is-admin="isAdmin"
          :search-form="searchForm"
          @delete="handleDeleteWithRefresh"
          @edit="handleEditWithRefresh"
          @update:data="onDataUpdate"
      />

      <!-- 课程卡片视图 -->
      <course-card-view
          v-else-if="viewMode === 'card'"
          :course-list="courseList"
          :loading="loading"
          :pagination="pagination"
          @course-click="handleCourseClick"
          @continue-course="handleContinueCourse"
          @page-change="onPageChange"
      />
    </n-card>

    <!-- 课程表单对话框 -->
    <course-form-modal
        v-model:show="showFormModal"
        :course-data="currentCourse"
        :mode="isEditMode ? 'edit' : 'add'"
        :submitting="submitting"
        @cancel="handleFormCancel"
        @submit="handleFormSubmit"
    />

  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import {AddOutline, ArrowBackOutline, GridOutline, ListOutline, RefreshOutline, SearchOutline,} from '@vicons/ionicons5'
import type * as courseType from '@/types/course'
import {useI18n} from 'vue-i18n'
import {useRouter} from 'vue-router'
import Icon from '@/components/common/Icon.vue'
import CourseTableView from './components/CourseTableView.vue'
import CourseCardView from './components/CourseCardView.vue'
import CourseFormModal from './components/CourseFormModal.vue'
import {useCourseData} from './composables/useCourseData'
import {getDiscreteApi} from '@/utils/naiveUIHelper'

const {t} = useI18n()
const router = useRouter()
const {message} = getDiscreteApi()

// 使用课程数据管理
const {
  isAdmin,
  courseTypeOptions,
  courseStatusOptions,
  searchForm,
  createTimeRange,
  courseList,
  loading,
  courseApiFunction,
  pagination,
  initializeSearchForm,
  loadCourseData,
  onDateRangeChange,
  onDataUpdate,
  resetSearch,
  onPageChange
} = useCourseData()

// 对话框状态管理
const showFormModal = ref(false)
const isEditMode = ref(false)
const currentCourse = ref<courseType.CourseVO | undefined>(undefined)

const submitting = ref(false)

// 新增课程
const handleAdd = () => {
  isEditMode.value = false
  currentCourse.value = undefined
  showFormModal.value = true
}

// 视图模式：'table' | 'card'
const viewMode = ref<'table' | 'card'>('card')

// 表格视图引用
const tableViewRef = ref()

// 返回上一页
function goBack() {
  router.back()
}

// 搜索处理
function handleSearch() {
  if (viewMode.value === 'table') {
    tableViewRef.value?.fetchData()
  } else {
    pagination.pageNum = 1
    loadCourseData()
  }
}

// 重置搜索处理
function handleResetSearch() {
  resetSearch()
  if (viewMode.value === 'table') {
    tableViewRef.value?.reset()
  } else {
    pagination.pageNum = 1
    loadCourseData()
  }
}

// 切换到卡片视图
function switchToCardView() {
  viewMode.value = 'card'
  // 每次切换到卡片视图都重新加载数据，确保数据是最新的
  loadCourseData()
}

// 切换到表格视图
function switchToTableView() {
  viewMode.value = 'table'
}

// 编辑课程
const handleEditWithRefresh = (course: courseType.CourseVO) => {
  isEditMode.value = true
  currentCourse.value = course
  showFormModal.value = true
}

// 删除课程
const handleDeleteWithRefresh = (_course: courseType.CourseVO) => {
  // TODO: 实现删除课程功能
}

// 处理课程卡片点击
function handleCourseClick(_course: courseType.CourseVO) {
  // TODO: 跳转到课程详情页面
}

// 处理继续课程按钮点击
function handleContinueCourse(_course: courseType.CourseVO) {
  // TODO: 跳转到课程学习页面
}

// 表单提交成功处理
const handleFormSubmit = async (_courseData: courseType.CourseDTO) => {
  submitting.value = true
  try {
    message.success(isEditMode.value ? '课程更新成功' : '课程创建成功')
    showFormModal.value = false

    // 刷新数据
    if (viewMode.value === 'table') {
      tableViewRef.value?.fetchData()
    } else {
      loadCourseData()
    }
  } catch (error) {
    message.error('提交课程失败')
  } finally {
    submitting.value = false
  }
}

// 表单取消处理
const handleFormCancel = () => {
  showFormModal.value = false
}

// 组件挂载时初始化
onMounted(() => {
  initializeSearchForm()
  if (viewMode.value === 'card') {
    loadCourseData()
  }
})
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
