<template>
  <n-form :model="searchForm" class="search-form" inline>
    <n-form-item :label="t('course.searchForm.courseName')" path="courseName">
      <n-input
          v-model:value="searchForm.courseName"
          :placeholder="t('course.searchForm.courseNamePlaceholder')"
          clearable
      />
    </n-form-item>
    <n-form-item :label="t('course.searchForm.courseType')" path="courseType">
      <n-select
          v-model:value="searchForm.courseType"
          :options="courseTypeOptions"
          :placeholder="t('course.searchForm.courseTypePlaceholder')"
          clearable
          style="min-width: 180px;"
      />
    </n-form-item>
    <n-form-item :label="t('course.searchForm.courseStatus')" path="status">
      <n-select
          v-model:value="searchForm.status"
          :options="courseStatusOptions"
          :placeholder="t('course.searchForm.courseStatusPlaceholder')"
          clearable
          style="min-width: 180px;"
      />
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
      <n-button class="search-reset-btn" @click="handleResetSearch">
        <template #icon>
          <Icon :component="RefreshOutline"/>
        </template>
        {{ t('common.reset') }}
      </n-button>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import {computed, reactive, ref} from 'vue'
import {RefreshOutline, SearchOutline} from '@vicons/ionicons5'
import type * as courseType from '@/types/course'
import {useI18n} from 'vue-i18n'
import Icon from '@/components/common/Icon.vue'
import * as courseApi from '@/api/course'
import {getCourseStatusOptions, getCourseTypeOptions} from '@/enum/course'
import {handleDateRangeChange} from '@/utils/dateUtil'

const {t} = useI18n()

// Props
interface Props {
  modelValue: courseType.CourseQueryParams
}

const props = defineProps<Props>()

// Emits
interface Emits {
  (e: 'update:modelValue', value: courseType.CourseQueryParams): void

  (e: 'search'): void

  (e: 'reset'): void
}

const emit = defineEmits<Emits>()

// 搜索表单
const searchForm = reactive<courseType.CourseQueryParams>(props.modelValue)

// 日期范围选择器
const createTimeRange = ref<[number, number] | null>(null)

// 课程类型选项
const courseTypeOptions = computed(() => getCourseTypeOptions(t))

// 课程状态选项
const courseStatusOptions = computed(() => getCourseStatusOptions(t))

// 处理日期范围变化
function onDateRangeChange(value: [number, number] | null) {
  handleDateRangeChange(value, (startTime, endTime) => {
    searchForm.startTime = startTime || undefined
    searchForm.endTime = endTime || undefined
  })
}

// 搜索处理
function handleSearch() {
  emit('update:modelValue', searchForm)
  emit('search')
}

// 重置搜索处理
function handleResetSearch() {
  const defaultQuery = courseApi.getDefaultCourseQuery()
  Object.assign(searchForm, defaultQuery)
  createTimeRange.value = null
  emit('update:modelValue', searchForm)
  emit('reset')
}

</script>

<style lang="scss" scoped>
.search-form {
  margin-bottom: 16px;

  .search-reset-btn {
    margin-left: 8px;
  }
}
</style>
