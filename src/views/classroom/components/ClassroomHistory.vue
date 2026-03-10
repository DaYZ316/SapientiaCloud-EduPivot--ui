<template>
  <div class="classroom-history">
    <!-- 添加课程按钮 - 固定在顶部 -->
    <div v-if="hasPermission && !loading" class="add-course-header">
      <div class="add-course-item" @click="handleAddCourse">
        <div class="add-course-content">
          <div class="add-icon">
            <Icon :component="AddOutline" size="20"/>
          </div>
          <span class="add-text">{{ t('classroom.history.createCourse') }}</span>
        </div>
      </div>
    </div>

    <!-- 加载状态 -->
    <LoadingSpinner
        v-if="loading"
        :title="t('classroom.history.loading')"
        min-height="400px"
        size="large"
    />

    <!-- 错误提示 -->
    <div v-else-if="error" class="error-container">
      <n-empty :description="errorMsg">
        <template #icon>
          <n-icon>
            <WarningOutline/>
          </n-icon>
        </template>
      </n-empty>
    </div>

    <!-- 空状态 -->
    <div v-else-if="records.length === 0" class="empty-container">
      <n-empty :description="t('classroom.history.noRecords')">
        <template #icon>
          <n-icon>
            <DocumentTextOutline/>
          </n-icon>
        </template>
      </n-empty>
    </div>

    <!-- 数据列表 -->
    <div v-else ref="recordListRef" :class="['record-list', { 'record-list-no-add': !hasPermission }]" @scroll="handleScroll">
      <div
          v-for="item in records"
          :key="item.id"
          :class="{ 'record-active': selectedRecordId === item.id }"
          class="record"
          @click="handleRecordClick(item)"
      >
        <div class="record-header">
          <p class="course-name">{{ item.courseName || t('classroom.history.unnamedCourse') }}</p>
          <span :class="'status-' + calculateCourseRecordStatus(item.startTime, item.overTime)" class="record-status">
            {{ getStatusText(item) }}
          </span>
        </div>
        <div class="record-info">
          <span v-if="item.teacherName" class="info-item">
            <n-icon class="info-icon"><PersonOutline/></n-icon>
            {{ item.teacherName }}
          </span>
          <span class="info-item">
            <n-icon class="info-icon"><TimeOutline/></n-icon>
            {{ formatTime(item.updateTime) }}
          </span>
          <span class="info-item">
            <n-icon class="info-icon"><GridOutline/></n-icon>
            {{
              item.classroomType !== undefined && item.classroomType !== null ? getClassroomTypeLabel(item.classroomType, locale === 'en-US') : t('classroom.history.noModelType')
            }}
          </span>
        </div>
      </div>

      <!-- 加载更多提示 -->
      <div v-if="loadingMore" class="loading-more">
        <n-spin size="small"/>
        <span>{{ t('classroom.history.loadingMore') }}</span>
      </div>
      <div v-else-if="!hasMore && records.length > 0" class="no-more">
        {{ t('classroom.history.noMore') }}
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onBeforeUnmount, onMounted, ref, watch, computed} from 'vue'
import {useI18n} from 'vue-i18n'
import {
  AddOutline,
  DocumentTextOutline,
  GridOutline,
  PersonOutline,
  TimeOutline,
  WarningOutline
} from '@vicons/ionicons5'
import {NIcon, NSpin} from 'naive-ui'
import {listCourseRecord} from '@/api/classroom/courseRecord'
import eventBus from '@/utils/eventBus'
import {getClassroomTypeLabel} from '@/enum/classroom/classroomTypeEnum'
import {getCourseRecordStatusLabel, calculateCourseRecordStatus} from '@/enum/classroom/courseRecordStatusEnum'
import LoadingSpinner from '@/components/common/LoadingSpinner.vue'
import Icon from '@/components/common/Icon.vue'
import type {CourseRecordPageQueryDTO, CourseRecordVO} from '@/types/classroom'
import {useCourseStore, useUserStore} from '@/store'
import {formatDate} from '@/utils/dateUtil'

const {t, locale} = useI18n()
const courseStore = useCourseStore()
const userStore = useUserStore()

// 判断当前用户是否为管理员
const isAdmin = computed(() => userStore.hasRole('ADMIN'))

// 判断当前用户是否为课程的开课教师
const isCourseTeacher = computed(() => {
  const currentTeacherId = userStore.teacherInfo?.id
  const courseTeacherId = courseStore.currentCourseInfo?.teacherId
  return currentTeacherId && courseTeacherId && currentTeacherId === courseTeacherId
})

// 判断当前用户是否有权限操作（是开课教师或管理员）
const hasPermission = computed(() => isAdmin.value || isCourseTeacher.value)

const loading = ref(false)
const loadingMore = ref(false)
const error = ref(false)
const errorMsg = ref('')
const records = ref<CourseRecordVO[]>([])
const pageNum = ref(1)
const pageSize = ref(20)
const total = ref(0)
const hasMore = ref(false)
const recordListRef = ref<HTMLElement | null>(null)
const selectedRecordId = ref<string | null>(null)
const searchParams = ref<CourseRecordPageQueryDTO | null>(null)

// 获取状态文本，使用枚举函数，根据时间计算状态
const getStatusText = (item: CourseRecordVO) => {
  const status = calculateCourseRecordStatus(item.startTime, item.overTime)
  return getCourseRecordStatusLabel(status, locale.value === 'en-US')
}

// 处理添加课程点击事件
const handleAddCourse = () => {
  selectedRecordId.value = null
  eventBus.emit('resetClassroomDetail')
}

// 处理课程记录点击事件
const handleRecordClick = (item: any) => {
  // 如果点击的是已经高亮的记录，不再重新加载
  if (selectedRecordId.value === item.id) {
    return
  }
  eventBus.emit('selectCourseRecord', {id: item.id})
}

// 格式化时间显示
const formatTime = (time: string | null | undefined): string => {
  if (!time) return t('classroom.history.noTime')
  try {
    const date = new Date(time)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) {
      // 今天，显示时间
      const hours = date.getHours()
      const minutes = date.getMinutes()
      return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`
    } else if (days < 7) {
      return `${days}天前`
    } else {
      return formatDate(time)
    }
  } catch {
    return time
  }
}

// 解析响应数据
const parseResponse = (res: any): { list: CourseRecordVO[], total: number } => {
  if (!res) return {list: [], total: 0}

  // 处理不同格式的响应
  if ('total' in res && 'data' in res) {
    // 格式1: TableDataResult - { data: T[], total: number }
    return {
      list: Array.isArray(res.data) ? res.data : [],
      total: typeof res.total === 'number' ? res.total : 0
    }
  } else if ('data' in res && res.data && typeof res.data === 'object') {
    // 格式2: Result<TableDataResult> - { data: { data: T[], total: number } }
    const pageResult = res.data as any
    if ('data' in pageResult && 'total' in pageResult) {
      return {
        list: Array.isArray(pageResult.data) ? pageResult.data : [],
        total: typeof pageResult.total === 'number' ? pageResult.total : 0
      }
    }
  }
  return {list: [], total: 0}
}

// 初始加载数据
const loadData = async (autoSelectFirst: boolean = true) => {
  loading.value = true
  error.value = false
  pageNum.value = 1
  records.value = []

  const params: CourseRecordPageQueryDTO = {
    pageNum: searchParams.value?.pageNum ?? 1,
    pageSize: searchParams.value?.pageSize ?? pageSize.value,
    courseId: courseStore.currentCourseId || null,
    ...(searchParams.value || {})
  }

  const res = await listCourseRecord(params)
  if (res) {
    const {list, total: totalCount} = parseResponse(res)
    records.value = list
    total.value = totalCount
    hasMore.value = records.value.length < total.value

    // 如果启用自动选择且没有选中记录，默认选择第一个
    if (autoSelectFirst && records.value.length > 0 && !selectedRecordId.value) {
      const firstRecord = records.value[0]
      if (firstRecord && firstRecord.id) {
        selectedRecordId.value = firstRecord.id
        eventBus.emit('selectCourseRecord', {id: firstRecord.id})
      }
    }
  } else {
    error.value = true
    errorMsg.value = t('common.error')
    records.value = []
    total.value = 0
    hasMore.value = false
  }
  loading.value = false
}

// 加载更多数据
const loadMoreData = async () => {
  if (!hasMore.value || loadingMore.value) {
    return
  }
  loadingMore.value = true
  pageNum.value += 1

  const params: CourseRecordPageQueryDTO = {
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    courseId: courseStore.currentCourseId || null,
    ...(searchParams.value || {})
  }

  const res = await listCourseRecord(params)
  if (res) {
    const {list} = parseResponse(res)
    if (list && list.length > 0) {
      records.value = [...records.value, ...list]
      hasMore.value = records.value.length < total.value
    } else {
      hasMore.value = false
    }
  } else {
    hasMore.value = false
  }
  loadingMore.value = false
}

// 处理滚动事件
const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement
  const scrollTop = target.scrollTop
  const scrollHeight = target.scrollHeight
  const clientHeight = target.clientHeight

  // 当滚动到距离底部50px时加载更多
  if (scrollHeight - scrollTop - clientHeight < 50) {
    loadMoreData()
  }
}

// 监听课程记录选择事件
const handleSelectCourseRecord = (data: { id: string } | null) => {
  if (data && data.id) {
    selectedRecordId.value = data.id
  } else {
    selectedRecordId.value = null
  }
}

// 监听重置事件
const handleResetClassroomDetail = () => {
  selectedRecordId.value = null
}

// 监听刷新课程历史记录事件
const handleRefreshClassroomHistory = async () => {
  const currentSelectedId = selectedRecordId.value
  await loadData(false)

  // 刷新后，如果之前的选中记录还在列表中，保持选中；否则选择第一个
  if (currentSelectedId && records.value.some(r => r.id === currentSelectedId)) {
    selectedRecordId.value = currentSelectedId
    eventBus.emit('selectCourseRecord', {id: currentSelectedId})
  } else if (records.value.length > 0 && !selectedRecordId.value) {
    const firstRecord = records.value[0]
    if (firstRecord && firstRecord.id) {
      selectedRecordId.value = firstRecord.id
      eventBus.emit('selectCourseRecord', {id: firstRecord.id})
    }
  }
}

// 监听搜索课程记录事件
const handleSearchCourseRecord = (params: CourseRecordPageQueryDTO) => {
  // 确保分页参数不为null
  searchParams.value = {
    ...params,
    pageNum: params.pageNum ?? 1,
    pageSize: params.pageSize ?? 20
  }
  selectedRecordId.value = null
  loadData(false)
}

onMounted(() => {
  loadData()
  // 监听课程记录选择事件
  eventBus.on('selectCourseRecord', handleSelectCourseRecord)
  // 监听重置事件
  eventBus.on('resetClassroomDetail', handleResetClassroomDetail)
  // 监听刷新课程历史记录事件
  eventBus.on('refreshClassroomHistory', handleRefreshClassroomHistory)
  // 监听搜索课程记录事件
  eventBus.on('searchCourseRecord', handleSearchCourseRecord)
})

// 监听 courseId 变化，重新加载数据
watch(() => courseStore.currentCourseId, () => {
  selectedRecordId.value = null
  loadData()
})

onBeforeUnmount(() => {
  // 移除事件监听器，避免内存泄漏
  eventBus.off('selectCourseRecord', handleSelectCourseRecord)
  eventBus.off('resetClassroomDetail', handleResetClassroomDetail)
  eventBus.off('refreshClassroomHistory', handleRefreshClassroomHistory)
  eventBus.off('searchCourseRecord', handleSearchCourseRecord)
})
</script>

<style lang="scss" scoped>
@use './ClassroomHistory.scss';
</style>