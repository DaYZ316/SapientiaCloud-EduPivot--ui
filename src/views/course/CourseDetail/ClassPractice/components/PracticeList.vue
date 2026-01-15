<template>
  <n-card ref="practiceListCardRef" class="practice-list-card" @scroll="handleScroll">
    <div v-if="loading" class="loading-container">
      <n-spin size="medium"/>
    </div>
    <div v-else-if="!practiceList.length" class="empty-container">
      <n-empty :description="t('course.classPractice.noPractice')"/>
    </div>
    <div v-else class="practice-list">
      <div
          v-for="practice in practiceList"
          :key="practice.id"
          :class="['practice-item', {'is-active': practice.id === selectedPracticeId}]"
          @click="handlePracticeSelect(practice)"
      >
        <div class="practice-item__header">
          <div class="practice-item__classroom">
            <n-tag type="info" size="small">
              {{ practice.classroomName || t('course.classPractice.unnamedClassroom') }}
            </n-tag>
          </div>
          <div class="practice-item__required">
            <n-tag
                :type="practice.isRequired === IsRequiredEnum.REQUIRED ? 'success' : 'default'"
                size="small"
                round
            >
              {{ getIsRequiredLabel(practice.isRequired, isEn) }}
            </n-tag>
          </div>
        </div>
        <div class="practice-item__title">
          <span class="title-text">{{ practice.questionTitle || t('course.classPractice.unnamedQuestion') }}</span>
        </div>
        <div class="practice-item__time">
          <div class="practice-item__start-time">
            {{ t('course.classPractice.start') }}: {{ formatTime(practice.startTime) }}
          </div>
          <div class="practice-item__end-time">
            {{ t('course.classPractice.end') }}: {{ formatTime(practice.endTime) }}
          </div>
        </div>
      </div>
      <!-- 加载更多提示 -->
      <div v-if="loadingMore" class="loading-more">
        <n-spin size="small"/>
      </div>
    </div>
  </n-card>
</template>

<script lang="ts" setup>
import {ref, watch, computed} from 'vue'
import * as ClassroomPracticeApi from '@/api/classroom/classroomPractice'
import type {ClassroomQuestionVO} from '@/types/classroom'
import {IsRequiredEnum, getIsRequiredLabel} from '@/enum/classroom/isRequiredEnum'
import {useI18n} from 'vue-i18n'

// 国际化
const {locale, t: t} = useI18n()
const isEn = computed(() => locale.value === 'en-US')

// 定义组件属性
interface Props {
  courseId?: string
  selectedPracticeId?: string | null
  searchQuery?: any
}

interface Emits {
  (e: 'select', practice: ClassroomQuestionVO): void
}

const props = withDefaults(defineProps<Props>(), {
  courseId: '',
  selectedPracticeId: null,
  searchQuery: null
})
const emit = defineEmits<Emits>()

// 响应式数据
const loading = ref(false)
const practiceList = ref<ClassroomQuestionVO[]>([])
const loadingMore = ref(false)
const hasMore = ref(true)
const total = ref(0)

// 工具函数
const resolveList = (res: any): any[] => {
  if (!res) return []
  if (Array.isArray(res.data)) return res.data
  if (Array.isArray(res.data?.data)) return res.data.data
  if (Array.isArray(res)) return res
  return []
}

const sortPracticesByStartTime = (practices: ClassroomQuestionVO[]) => {
  practices.sort((a, b) => {
    const timeA = new Date(a.startTime || '').getTime()
    const timeB = new Date(b.startTime || '').getTime()
    return timeB - timeA // 最新的在前面
  })
}

const buildQueryParams = (pageNum: number) => ({
  courseId: props.courseId,
  classroomId: null,
  pageNum,
  pageSize: 10,
  isAsc: 'desc' as const,
  orderByColumn: 'classroom_id',
  ...props.searchQuery
})

// 方法
const loadPracticeList = async () => {
  if (!props.courseId) return

  loading.value = true
  const response = await ClassroomPracticeApi.listClassroomPractice(buildQueryParams(1))

  const practices = resolveList(response)
  sortPracticesByStartTime(practices)

  practiceList.value = practices
  total.value = response.total || practices.length
  hasMore.value = practices.length < total.value
  loading.value = false
}

const handlePracticeSelect = (practice: ClassroomQuestionVO) => {
  emit('select', practice)
}

const formatTime = (time: string) => {
  if (!time) return t('course.classPractice.notSet')
  try {
    return new Date(time).toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return time
  }
}

// 加载更多练习
const loadMorePractices = async () => {
  if (!hasMore.value || loadingMore.value || !props.courseId) return

  loadingMore.value = true
  const currentPage = Math.ceil(practiceList.value.length / 10) + 1
  const response = await ClassroomPracticeApi.listClassroomPractice(buildQueryParams(currentPage))

  const newPractices = resolveList(response)

  if (newPractices.length > 0) {
    sortPracticesByStartTime(newPractices)
    practiceList.value = [...practiceList.value, ...newPractices]
    hasMore.value = practiceList.value.length < total.value
  } else {
    hasMore.value = false
  }

  loadingMore.value = false
}

// 滚动处理
const handleScroll = (e: Event) => {
  const target = e.target as HTMLElement
  const scrollTop = target.scrollTop
  const scrollHeight = target.scrollHeight
  const clientHeight = target.clientHeight

  // 当滚动到距离底部10px时加载更多
  if (scrollHeight - scrollTop - clientHeight < 10) {
    loadMorePractices()
  }
}

// 监听 courseId 变化
watch(() => props.courseId, (newCourseId) => {
  if (newCourseId) {
    loadPracticeList()
  }
}, {immediate: true})

// 监听搜索条件变化（移除自动搜索，由父组件手动触发）

// 暴露方法给父组件调用
defineExpose({
  loadPracticeList
})

// 生命周期说明：使用 watch 的 { immediate: true } 处理初始加载
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss';

.practice-list-card {
  margin-bottom: 16px;
  background-color: var(--background-color);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  box-shadow: none;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}


.loading-container,
.empty-container {
  padding: 32px;
  text-align: center;
  color: var(--text-secondary-color);
}

.practice-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.practice-item {
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background-color: var(--background-color);
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    border-color: var(--color-primary);
    box-shadow: 0 2px 8px var(--shadow-secondary-color);
  }

  &.is-active {
    border-color: var(--color-primary);
    background-color: color-mix(in srgb, var(--color-primary) 5%, var(--background-color));
    box-shadow: 0 2px 8px var(--shadow-color);
  }
}

.practice-item__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  .practice-item__classroom {
    flex: 0 0 auto;
    max-width: 180px;

    :deep(.n-tag) {
      max-width: 100%;
      overflow: hidden;

      span {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        display: block;
      }
    }
  }

  .practice-item__required {
    flex: 0 0 auto;
  }
}

.practice-item__title {
  margin-bottom: 8px;

  .title-text {
    font-weight: 500;
    color: var(--text-color);
    display: block;
    line-height: 1.4;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.practice-item__time {
  display: flex;
  justify-content: space-between;
  font-size: 12px;
  color: var(--text-secondary-color);

  .practice-item__start-time {
    flex: 0 0 auto;
  }

  .practice-item__end-time {
    flex: 0 0 auto;
    margin-left: auto;
  }
}

.loading-more {
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
