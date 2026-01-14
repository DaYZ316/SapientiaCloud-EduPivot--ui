<template>
  <n-card class="practice-list-card">
    <div v-if="loading" class="loading-container">
      <n-spin size="medium"/>
    </div>
    <div v-else-if="!classroomTree.length" class="empty-container">
      <n-empty :description="$t('course.classPractice.noPractice')"/>
    </div>
    <div v-else class="classroom-tree">
      <n-collapse v-model:value="expandedKeys" ghost class="practice-collapse">
        <n-collapse-item
            v-for="classroom in classroomTree"
            :key="classroom.id"
            :name="classroom.id"
            :title="classroom.classroomName"
        >
          <div class="practice-list">
            <div
                v-for="practice in classroom.children"
                :key="practice.id"
                :class="['practice-item', {'is-active': practice.id === selectedPracticeId}]"
                @click="handlePracticeSelect(practice)"
            >
              <div class="practice-item__title">
                <span class="title-text">{{ practice.questionTitle || $t('course.classPractice.unnamedQuestion') }}</span>
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
              <div class="practice-item__time">
                <div class="practice-item__start-time">
                  {{ $t('course.classPractice.start') }}: {{ formatTime(practice.startTime) }}
                </div>
                <div class="practice-item__end-time">
                  {{ $t('course.classPractice.end') }}: {{ formatTime(practice.endTime) }}
                </div>
              </div>
            </div>
          </div>
        </n-collapse-item>
      </n-collapse>
    </div>
  </n-card>
</template>

<script lang="ts" setup>
import {ref, watch, computed} from 'vue'
import * as ClassroomPracticeApi from '@/api/classroom/classroomPractice'
import type {ClassroomQuestionVO} from '@/types/classroom'
import {IsRequiredEnum, getIsRequiredLabel} from '@/enum/classroom/isRequiredEnum'
import {getDiscreteApi} from '@/utils/naiveUIHelper'
import {useI18n} from 'vue-i18n'

// 树形节点类型定义
interface ClassroomTreeNode {
  id: string
  classroomId: string
  classroomName: string
  children: ClassroomQuestionVO[]
  expanded?: boolean
}

const {message} = getDiscreteApi()

// 国际化
const {locale, t: $t} = useI18n()
const isEn = computed(() => locale.value === 'en-US')

// 定义组件属性
interface Props {
  courseId?: string
  selectedPracticeId?: string | null
}

interface Emits {
  (e: 'select', practice: ClassroomQuestionVO, classroomInfo?: any): void
}

const props = withDefaults(defineProps<Props>(), {
  courseId: '',
  selectedPracticeId: null
})
const emit = defineEmits<Emits>()

// 响应式数据
const loading = ref(false)
const classroomTree = ref<ClassroomTreeNode[]>([])
const expandedKeys = ref<string[]>([])

// 方法
const loadPracticeList = async () => {
  if (!props.courseId) {
    return
  }

  loading.value = true
  try {
    // 使用分页查询接口，仅传入 courseId 进行过滤，不传入 classroomId
    const queryParams = {
      courseId: props.courseId,
      classroomId: null, // 不传入 classroomId
      pageNum: 1,
      pageSize: 1000, // 获取所有记录
      isAsc: 'desc' as const, // 按时间倒序
      orderByColumn: 'startTime'
    }
    const response = await ClassroomPracticeApi.listClassroomPractice(queryParams)

    const resolveList = (res: any): any[] => {
      if (!res) return []
      if (Array.isArray(res.data)) return res.data
      if (Array.isArray(res.data?.data)) return res.data.data
      if (Array.isArray(res)) return res
      return []
    }

    const practiceList = resolveList(response)

    // 按照 classroomId 分组数据
    const groupedData = new Map<string, ClassroomQuestionVO[]>()

    practiceList.forEach((practice: ClassroomQuestionVO) => {
      const classroomId = practice.classroomId
      if (!groupedData.has(classroomId)) {
        groupedData.set(classroomId, [])
      }
      groupedData.get(classroomId)!.push(practice)
    })

    // 转换为树形结构
    const treeData: ClassroomTreeNode[] = []
    groupedData.forEach((practices, classroomId) => {
      const firstPractice = practices[0]
      treeData.push({
        id: classroomId,
        classroomId: classroomId,
        classroomName: firstPractice.classroomName || $t('course.classPractice.unnamedClassroom'),
        children: practices,
        expanded: true
      })
    })

    // 按 classroomName 排序
    treeData.sort((a, b) => a.classroomName.localeCompare(b.classroomName))

    classroomTree.value = treeData
    expandedKeys.value = treeData.map(node => node.id)

  } catch (error) {
    console.error('加载课堂练习失败:', error)
    message.error('加载课堂练习失败')
  } finally {
    loading.value = false
  }
}

const handlePracticeSelect = (practice: ClassroomQuestionVO) => {
  emit('select', practice, null)
}

const formatTime = (time: string) => {
  if (!time) return $t('course.classPractice.notSet')
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

// 监听 courseId 变化
watch(() => props.courseId, (newCourseId) => {
  if (newCourseId) {
    loadPracticeList()
  }
}, {immediate: true})

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
}

.classroom-tree {
  height: 100%;

  :deep(.n-collapse-item) {
    .n-collapse-item__header {
      .n-collapse-item__header-main {
        color: var(--text-color);

        .n-collapse-item__header-main__title {
          color: var(--text-color);
        }
      }
    }
  }

  :deep(.n-collapse-item--active) {
    .n-collapse-item__header {
      .n-collapse-item__header-main {
        color: var(--color-primary);

        .n-collapse-item__header-main__title {
          color: var(--color-primary);
        }
      }
    }
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
  gap: 8px;
}

.practice-item {
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
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

.practice-item__title {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;

  .title-text {
    font-weight: 500;
    color: var(--text-color);
  }
}

.practice-item__time {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: var(--text-secondary-color);

  .practice-item__start-time,
  .practice-item__end-time {
    flex: 1;
  }
}
</style>
