<template>
  <div class="classroom-layout">
    <!-- 面包屑导航 -->
    <div class="breadcrumb-wrapper">
      <CourseBreadcrumb
          :course-info="courseInfo"
          :current-page="t('course.navigation.classroom')"
      >
        <template #actions>
          <n-card class="search-form-card" size="small">
            <n-form :model="searchForm" class="search-form" inline>
              <n-form-item :label="t('classroom.searchForm.courseName')" path="courseName">
                <n-input
                    v-model:value="searchForm.courseName"
                    :placeholder="t('classroom.searchForm.courseNamePlaceholder')"
                    clearable
                    style="min-width: 200px;"
                />
              </n-form-item>
              <n-form-item :label="t('classroom.searchForm.classroomType')" path="classroomType">
                <n-select
                    v-model:value="searchForm.classroomType"
                    :options="classroomTypeOptions"
                    :placeholder="t('classroom.searchForm.classroomTypePlaceholder')"
                    clearable
                    style="min-width: 180px;"
                />
              </n-form-item>
              <n-form-item :label="t('classroom.searchForm.startTimeRange')" path="startTimeRange">
                <n-date-picker
                    v-model:value="startTimeRange"
                    :placeholder="t('classroom.searchForm.startTimeRangePlaceholder')"
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
                </n-button>
                <n-button class="ml-2" @click="resetSearch">
                  <template #icon>
                    <Icon :component="RefreshOutline"/>
                  </template>
                </n-button>
              </n-form-item>
            </n-form>
          </n-card>
        </template>
      </CourseBreadcrumb>
    </div>

    <div class="classroom-content">
      <!-- 左侧教室历史组件 - 占25%宽度 -->
      <div class="classroom-history-container">
        <ClassroomHistory/>
      </div>
      <!-- 右侧教室选择组件 - 占75%宽度 -->
      <div class="classroom-select-container">
        <ClassroomDetail :course-id="courseId"/>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {RefreshOutline, SearchOutline} from '@vicons/ionicons5'
import ClassroomDetail from './components/ClassroomDetail.vue'
import ClassroomHistory from './components/ClassroomHistory.vue'
import CourseBreadcrumb from '@/views/course/components/CourseBreadcrumb/CourseBreadcrumb.vue'
import {useCourseStore} from '@/store'
import eventBus from '@/utils/eventBus'
import * as courseRecordApi from '@/api/classroom/courseRecord'
import type {CourseRecordPageQueryDTO} from '@/types/classroom'
import {getClassroomTypeOptions} from '@/enum/classroom/classroomTypeEnum'
import {handleDateRangeChange} from '@/utils/dateUtil'
import Icon from '@/components/common/Icon.vue'

const {t, locale} = useI18n()
const route = useRoute()
const router = useRouter()
const courseStore = useCourseStore()

const courseId = computed(() => route.params.courseId as string)
const courseInfo = computed(() => courseStore.currentCourseInfo)

// 是否为英文环境
const isEnglish = computed(() => locale.value === 'en-US')

// 搜索表单
const searchForm = reactive<CourseRecordPageQueryDTO>(courseRecordApi.getDefaultCourseRecordPageQueryDTO())

// 日期范围选择器
const startTimeRange = ref<[number, number] | null>(null)

// 选项配置
const classroomTypeOptions = computed(() => getClassroomTypeOptions(isEnglish.value))

// 搜索处理
const handleSearch = () => {
  eventBus.emit('searchCourseRecord', createSearchParams())
}

// 重置搜索
const resetSearch = () => {
  Object.assign(searchForm, courseRecordApi.getDefaultCourseRecordPageQueryDTO())
  searchForm.courseId = courseId.value
  startTimeRange.value = null
  eventBus.emit('searchCourseRecord', createSearchParams())
}

// 处理日期范围变化
const onDateRangeChange = (value: [number, number] | null) => {
  handleDateRangeChange(value, (startTime, endTime) => {
    searchForm.startTimeBegin = startTime
    searchForm.startTimeEnd = endTime
  })
}

// 将枚举值转换为字符串的辅助函数
const convertEnumToString = (value: number | string | null | undefined): string | null => {
  return value !== null && value !== undefined ? String(value) : null
}

// 创建搜索参数对象
const createSearchParams = (): CourseRecordPageQueryDTO => {
  return {
    ...searchForm,
    courseId: courseId.value,
    pageNum: 1,
    pageSize: 20,
    classroomType: convertEnumToString(searchForm.classroomType)
  }
}

// 加载课程信息
const loadCourseInfo = async () => {
  if (!courseId.value || courseId.value === 'undefined') {
    router.push('/course')
    return
  }

  await courseStore.setCurrentCourseId(courseId.value, true)
  // 设置搜索表单的courseId
  searchForm.courseId = courseId.value
}

onMounted(async () => {
  await loadCourseInfo()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.classroom-layout {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 12px;
  overflow: hidden;
  padding: 0;
}

.breadcrumb-wrapper {
  width: 100%;
  flex-shrink: 0;
  padding: 0;

  // 单独为classroom页面设置样式
  :deep(.breadcrumb-container) {
    margin-bottom: 0;
    border-bottom: none;
  }
}

.search-form-card {
  margin-top: 0;
  background-color: var(--background-color);
  padding: 0 12px;
  border: none;

  :deep(.n-card__content) {
    padding: 0;
  }
}

.search-form {
  margin: 0;

  :deep(.n-form-item) {
    margin-bottom: 0;
    margin-right: 12px;
    margin-top: 0;
  }

  :deep(.n-form-item-label) {
    padding-right: 8px;
    padding-bottom: 0;
  }
}

.ml-2 {
  margin-left: 8px;
}

.classroom-content {
  display: flex;
  width: 100%;
  gap: 12px;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  padding: 0;
}

.classroom-select-container {
  flex: 3;
  background-color: var(--background-secondary-color);
  border-radius: 8px;
  box-shadow: var(--shadow-secondary-color);
  min-width: 0;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 0;
}

.classroom-history-container {
  flex: 1;
  background-color: var(--background-secondary-color);
  border-radius: 8px;
  box-shadow: var(--shadow-secondary-color);
  min-width: 0;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 0;
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .classroom-content {
    flex-direction: column;
    gap: 12px;
  }

  .classroom-select-container,
  .classroom-history-container {
    flex: none;
    width: 100%;
    height: auto;
    max-height: 50vh;
  }
}

/* 确保在小屏幕上布局合理 */
@media (max-width: 768px) {
  .classroom-layout {
    gap: 8px;
  }

  .classroom-content {
    gap: 8px;
  }

  .classroom-select-container,
  .classroom-history-container {
    max-height: 45vh;
  }
}
</style>
