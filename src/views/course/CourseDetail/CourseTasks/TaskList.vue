<template>
  <div class="task-list">
    <div class="task-container">
      <n-spin :show="loading">
        <div v-if="filteredTasks.length === 0 && !loading" class="empty-state">
          <n-empty :description="t('course.tasks.noTasks')">
            <template #icon>
              <Icon :component="ListOutline"/>
            </template>
          </n-empty>
        </div>

        <div v-else class="tasks-list">
          <div
              v-for="task in filteredTasks"
              :key="task.id"
              :class="['task-item', { 'active': selectedTaskId === task.id }]"
              @click="handleTaskClick(task)"
          >
            <div class="task-header">
              <div class="task-title">{{ task.taskName }}</div>
              <div class="task-difficulty">
                <n-tag :type="getDifficultyTagType(task.difficulty)" size="small">
                  <span>{{ getDifficultyText(task.difficulty) }}</span>
                </n-tag>
              </div>
            </div>

            <div class="task-meta">
              <div class="task-type">
                <Icon :component="getTaskTypeIcon(task.taskType)"/>
                <span>{{ getTaskTypeText(task.taskType) }}</span>
              </div>
              <div v-if="task.createTime" class="task-create-time">
                <span>{{ formatToBeijingTime(new Date(task.createTime)) }}</span>
              </div>
            </div>
          </div>
        </div>
      </n-spin>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import {useI18n} from 'vue-i18n'
import {BookOutline, CodeOutline, DocumentTextOutline, ListOutline, VideocamOutline} from '@vicons/ionicons5'
import type {CourseTaskVO} from '@/types/course/courseTask'
import {getTaskTypeLabel, TaskTypeEnum} from '@/enum/course/taskTypeEnum'
import {getTaskDifficultyLabel, getTaskDifficultyTagType, TaskDifficultyEnum} from '@/enum/course/taskDifficultyEnum'
import Icon from '@/components/common/Icon.vue'
import {formatToBeijingTime} from '@/utils/dateUtil'

interface Props {
  tasks: CourseTaskVO[]
  loading: boolean
  selectedTaskId: string | null
}

interface Emits {
  (e: 'select', task: CourseTaskVO): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const {t, locale} = useI18n()

// 计算属性
const filteredTasks = computed(() => {
  return [...props.tasks].sort((a, b) => (a.createTime || '').localeCompare(b.createTime || ''))
})


// 获取任务类型图标
const getTaskTypeIcon = (taskType: TaskTypeEnum) => {
  switch (taskType) {
    case TaskTypeEnum.HOMEWORK:
      return CodeOutline
    case TaskTypeEnum.QUIZ:
      return DocumentTextOutline
    case TaskTypeEnum.PROJECT:
      return BookOutline
    case TaskTypeEnum.EXPERIMENT:
      return VideocamOutline
    default:
      return DocumentTextOutline
  }
}

// 获取任务类型文本
const getTaskTypeText = (taskType: TaskTypeEnum) => {
  return getTaskTypeLabel(taskType, locale.value === 'en-US')
}


// 获取难度文本
const getDifficultyText = (difficulty: TaskDifficultyEnum | undefined) => {
  if (difficulty === undefined) return t('course.tasks.difficulty.unknown')
  return getTaskDifficultyLabel(difficulty, locale.value === 'en-US')
}

// 获取难度标签类型
const getDifficultyTagType = (difficulty: TaskDifficultyEnum | undefined) => {
  if (difficulty === undefined) return 'default'
  return getTaskDifficultyTagType(difficulty)
}

// 任务点击处理
const handleTaskClick = (task: CourseTaskVO) => {
  emit('select', task)
}
</script>

<style lang="scss" scoped>
.task-list {
  .task-container {
    .empty-state {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 60px 20px;
    }

    .tasks-list {
      padding: 12px;
      display: flex;
      flex-direction: column;
      gap: 8px;

      .task-item {
        padding: 16px;
        border: 1px solid var(--border-color);
        border-radius: 8px;
        background: var(--background-color);
        cursor: pointer;
        transition: all 0.3s ease;

        &:hover {
          background-color: var(--hover-color);
          border-color: var(--primary-color-light);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

          .task-title {
            color: var(--primary-color);
          }
        }

        &.active {
          border-color: var(--primary-color);
          background-color: var(--primary-color-light);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);

          .task-title {
            color: var(--primary-color);
            font-weight: 600;
          }
        }

        .task-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 8px;

          .task-title {
            font-size: 16px;
            font-weight: 600;
            color: var(--primary-color);
            flex: 1;
            margin-right: 12px;
            transition: color 0.2s ease;
          }

          .task-status {
            flex-shrink: 0;
          }

          .task-difficulty {
            flex-shrink: 0;
            margin-left: 12px;
          }
        }

        .task-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-size: 14px;
          color: var(--text-secondary-color);

          .task-type {
            display: flex;
            align-items: center;
            gap: 4px;
          }

          .task-create-time {
            font-size: 12px;
            color: var(--text-disabled-color);
          }
        }
      }
    }
  }
}
</style>
