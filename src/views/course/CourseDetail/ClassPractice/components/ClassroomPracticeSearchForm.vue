<template>
  <n-form :model="searchForm" class="search-form" inline>
    <n-form-item :label="t('course.classPractice.searchForm.questionTitle')" path="title">
      <n-input
          v-model:value="searchForm.title"
          :placeholder="t('course.classPractice.searchForm.questionTitlePlaceholder')"
          clearable
      />
    </n-form-item>
    <n-form-item :label="t('course.classPractice.searchForm.classroomId')" path="classroomId">
      <n-select
          v-model:value="searchForm.classroomId"
          :options="classroomOptions"
          :placeholder="t('course.classPractice.searchForm.classroomIdPlaceholder')"
          :loading="classroomLoading"
          :remote="true"
          :filterable="true"
          clearable
          style="min-width: 240px;"
          @focus="handleClassroomFocus"
          @search="handleClassroomSearch"
          @scroll="handleClassroomScroll"
      />
    </n-form-item>
    <n-form-item :label="t('course.classPractice.searchForm.isRequired')" path="isRequired">
      <n-select
          v-model:value="searchForm.isRequired"
          :options="isRequiredOptions"
          :placeholder="t('course.classPractice.searchForm.isRequiredPlaceholder')"
          clearable
          style="min-width: 180px;"
      />
    </n-form-item>
    <n-form-item :label="t('course.classPractice.searchForm.timeRange')" path="timeRange">
      <n-date-picker
          v-model:value="timeRange"
          :placeholder="t('course.classPractice.searchForm.timeRangePlaceholder')"
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
import type {ClassroomQuestionPageQueryDTO, CourseRecordVO} from '@/types/classroom'
import {useI18n} from 'vue-i18n'
import Icon from '@/components/common/Icon.vue'
import {getIsRequiredOptions} from '@/enum/classroom'
import {handleDateRangeChange} from '@/utils/dateUtil'
import * as CourseRecordApi from '@/api/classroom/courseRecord'

const {t, locale} = useI18n()

// Props
interface Props {
  modelValue: ClassroomQuestionPageQueryDTO
  courseId?: string
}

const props = withDefaults(defineProps<Props>(), {
  courseId: ''
})

// Emits
interface Emits {
  (e: 'update:modelValue', value: ClassroomQuestionPageQueryDTO): void
  (e: 'search'): void
  (e: 'reset'): void
}

const emit = defineEmits<Emits>()

// 搜索表单
const searchForm = reactive<ClassroomQuestionPageQueryDTO>(props.modelValue)

// 日期范围选择器
const timeRange = ref<[number, number] | null>(null)

// 是否必答选项
const isRequiredOptions = computed(() => getIsRequiredOptions(locale.value === 'en-US'))

// 课堂记录选项
const classroomOptions = ref<Array<{label: string, value: string}>>([])
const classroomLoading = ref(false)
const classroomSearchQuery = ref('')

// 获取课堂记录选项
const loadClassroomOptions = async (query: string = '', pageNum: number = 1) => {
  try {
    classroomLoading.value = true
    const params: any = {
      courseId: props.courseId || null,
      courseName: query || undefined,
      pageNum,
      pageSize: 20,
      isAsc: 'desc' as const,
      orderByColumn: 'startTime'
    }
    const response = await CourseRecordApi.listCourseRecord(params)
    const data = response.data || []
    const newOptions = data.map((item: CourseRecordVO) => ({
      label: `${item.courseName} - ${new Date(item.startTime).toLocaleString('zh-CN')}`,
      value: item.id
    }))

    if (pageNum === 1) {
      classroomOptions.value = newOptions
    } else {
      classroomOptions.value = [...classroomOptions.value, ...newOptions]
    }

    // 返回是否还有更多数据：如果返回的数据等于pageSize，说明可能还有更多
    return data.length === 20
  } catch (error) {
    return false
  } finally {
    classroomLoading.value = false
  }
}

// 处理课堂记录下拉搜索
const handleClassroomSearch = async (query: string) => {
  classroomSearchQuery.value = query
  await loadClassroomOptions(query, 1)
}

// 处理课堂记录下拉框获得焦点
const handleClassroomFocus = async () => {
  await loadClassroomOptions('', 1)
}

// 处理课堂记录下拉滚动加载更多
const handleClassroomScroll = async () => {
  if (classroomLoading.value) return
  const hasMore = await loadClassroomOptions(classroomSearchQuery.value, Math.ceil(classroomOptions.value.length / 20) + 1)
  return hasMore
}

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
  // 重置搜索表单为默认值
  Object.assign(searchForm, {
    title: null,
    classroomId: null,
    isRequired: null
  })
  timeRange.value = null
  emit('update:modelValue', searchForm)
  emit('reset')
}

// 初始化加载课堂记录选项（移除自动加载，由点击下拉框触发）
</script>

<style lang="scss" scoped>
.search-form {
  .search-reset-btn {
    margin-left: 8px;
  }
}

.classroom-option {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .classroom-name {
    font-weight: 500;
    color: var(--text-color);
  }

  .classroom-time {
    font-size: 12px;
    color: var(--text-color-secondary);
  }
}
</style>
