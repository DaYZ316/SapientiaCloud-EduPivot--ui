<template>
  <div class="task-detail-content">
    <n-card v-if="!task" class="no-selection-card">
      <n-empty :description="t('course.tasks.selectTaskToView')">
        <template #icon>
          <Icon :component="ListOutline"/>
        </template>
      </n-empty>
    </n-card>

    <n-card v-else class="task-info-card">
      <!-- 任务标题和基本信息 -->
      <div class="task-header">
        <div class="task-title-section">
          <h2 class="task-title">{{ task.taskName }}</h2>
          <!-- 任务描述 -->
          <div v-if="task.description" class="task-description">
            <div class="description-content">{{ task.description }}</div>
          </div>
          <div class="task-meta-info">
            <div class="task-type-info">
              <Icon :component="getTaskTypeIcon(task.taskType)"/>
              <span>{{ getTaskTypeText(task.taskType) }}</span>
            </div>
            <div class="task-difficulty-info">
              <n-tag :type="getDifficultyTagType(task.difficulty)" size="medium">
                <span>{{ getDifficultyText(task.difficulty) }}</span>
              </n-tag>
            </div>
          </div>
        </div>
        <!-- 操作按钮区域 -->
        <div v-if="canEditTask" class="task-actions">
          <n-button
              :title="t('common.edit')"
              circle
              quaternary
              size="small"
              @click="handleEdit"
          >
            <template #icon>
              <Icon :component="CreateOutline"/>
            </template>
          </n-button>
          <n-button
              :title="t('common.delete')"
              circle
              quaternary
              size="small"
              type="error"
              @click="handleDelete"
          >
            <template #icon>
              <Icon :component="TrashOutline"/>
            </template>
          </n-button>
        </div>
      </div>

      <!-- 任务内容 -->
      <div v-if="task.taskContent" class="task-content">
        <div class="content-body" v-html="task.taskContent"></div>
      </div>

      <!-- 任务附件 -->
      <div v-if="task.attachmentUrls && task.attachmentUrls.length > 0" class="task-attachments">
        <div class="file-info-container">
          <n-spin :show="loadingFileInfo">
            <n-list>
              <n-list-item v-for="fileInfo in fileInfoList" :key="fileInfo.objectName" class="file-info-item"
                           @click="handleFilePreview(fileInfo, $event)">
                <template #prefix>
                  <Icon :component="getFileTypeIcon(fileInfo)" color="var(--color-primary)" size="20"/>
                </template>

                <div class="file-details">
                  <div class="file-name">{{ fileInfo.fileName }}</div>
                  <div class="file-meta">
                    <n-text depth="3" style="font-size: 12px">
                      {{ formatFileSize(fileInfo.size) }}
                    </n-text>
                    <n-text depth="3" style="font-size: 12px; margin-left: 8px">
                      {{ formatUploadTime(fileInfo.lastModified) }}
                    </n-text>
                  </div>
                </div>
              </n-list-item>
            </n-list>
          </n-spin>
        </div>
      </div>

      <!-- 任务统计信息 -->
      <div class="task-stats">
        <h3 class="section-title">{{ t('course.tasks.statistics') }}</h3>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-label">{{ t('course.tasks.points') }}</div>
            <div class="stat-value">{{ task.maxScore || 0 }}</div>
          </div>
          <div v-if="task.startTime" class="stat-item">
            <div class="stat-label">{{ t('course.tasks.startTime') }}</div>
            <div class="stat-value">{{ formatDate(task.startTime) }}</div>
          </div>
          <div v-if="task.endTime" class="stat-item">
            <div class="stat-label">{{ t('course.tasks.dueDate') }}</div>
            <div class="stat-value">{{ formatDate(task.endTime) }}</div>
          </div>
          <div v-if="task.estimatedTime" class="stat-item">
            <div class="stat-label">{{ t('course.tasks.timeLimit') }}</div>
            <div class="stat-value">{{ task.estimatedTime }} {{ t('course.tasks.minutes') }}</div>
          </div>
          <div class="stat-item">
            <div class="stat-label">{{ t('course.tasks.createTime') }}</div>
            <div class="stat-value">{{ formatDate(task.createTime || null) }}</div>
          </div>
        </div>
      </div>

    </n-card>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRouter} from 'vue-router'
import {
  ArchiveOutline,
  BookOutline,
  CodeOutline,
  CreateOutline,
  DocumentTextOutline,
  FolderOutline,
  ImageOutline,
  ListOutline,
  MusicalNotesOutline,
  TrashOutline,
  VideocamOutline
} from '@vicons/ionicons5'
import type {CourseTaskVO} from '@/types/course/courseTask'
import type {FileInfoDTO} from '@/types/minIO/file'
import * as MinIOApi from '@/api/minIO'
import {BusinessBucketCodeEnum} from '@/enum/minIO'
import {getTaskTypeLabel, TaskTypeEnum} from '@/enum/course/taskTypeEnum'
import {getTaskDifficultyLabel, getTaskDifficultyTagType, TaskDifficultyEnum} from '@/enum/course/taskDifficultyEnum'
import Icon from '@/components/common/Icon.vue'
import {formatDate} from '@/utils/dateUtil'
import {getDiscreteApi} from '@/utils/naiveUIHelper'
import {useUserStore} from '@/store/modules/user'
import {useTransitionStore} from '@/store/modules/transition'
import {runViewTransition} from '@/utils/themeAnimation'

interface Props {
  task: CourseTaskVO | null
  courseId: string
}

interface Emits {
  (e: 'delete', task: CourseTaskVO): void

  (e: 'edit', task: CourseTaskVO): void

  (e: 'update'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
const {t, locale} = useI18n()
const {dialog} = getDiscreteApi()
const router = useRouter()
const userStore = useUserStore()
const transitionStore = useTransitionStore()

// 响应式数据
const fileInfoList = ref<FileInfoDTO[]>([]) // 文件详细信息列表
const loadingFileInfo = ref(false) // 加载文件信息状态

// 权限检查
const canEditTask = computed(() => {
  return userStore.hasRole('ADMIN') || userStore.hasRole('TEACHER')
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
const getDifficultyText = (difficulty: number | undefined) => {
  if (difficulty === undefined) return t('course.tasks.difficulty.unknown')
  return getTaskDifficultyLabel(difficulty as TaskDifficultyEnum, locale.value === 'en-US')
}

// 获取难度标签类型
const getDifficultyTagType = (difficulty: number | undefined) => {
  if (difficulty === undefined) return 'default'
  return getTaskDifficultyTagType(difficulty as TaskDifficultyEnum)
}


// 处理编辑
const handleEdit = () => {
  if (props.task) {
    // 跳转到任务编辑页面，传递任务ID作为查询参数
    router.push({
      name: 'TaskControl',
      params: {
        courseId: props.courseId
      },
      query: {
        taskId: props.task.id
      }
    })
  }
}

// 处理删除
const handleDelete = () => {
  if (!props.task) return

  dialog.warning({
    title: t('common.delete'),
    content: t('course.tasks.deleteConfirmContent', {taskName: props.task.taskName}),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: () => {
      emit('delete', props.task!)
    }
  })
}

// 处理文件预览
const handleFilePreview = (fileInfo: FileInfoDTO, event?: MouseEvent) => {
  transitionStore.show()
  runViewTransition(() => {
    router.push({
      name: 'FilePreview',
      query: {
        fileInfo: JSON.stringify(fileInfo),
        from: 'TaskDetail',
        courseId: props.courseId,
        taskId: props.task?.id || ''
      }
    })
  }, event)
}

// 加载文件详细信息
const loadFileInfo = async () => {
  if (!props.task?.attachmentUrls || props.task.attachmentUrls.length === 0) {
    fileInfoList.value = []
    return
  }

  loadingFileInfo.value = true
  try {
    const res = await MinIOApi.getBatchFileInfoByPath({
      filePaths: props.task.attachmentUrls,
      bucketCode: BusinessBucketCodeEnum.COURSE_PRIVATE
    })
    if (res && res.success && res.data) {
      // 过滤掉error字段为true的文件
      fileInfoList.value = res.data.filter(file => !file.error)
    }
  } catch (error) {
  } finally {
    loadingFileInfo.value = false
  }
}

// 获取文件类型图标
const getFileTypeIcon = (fileInfo: FileInfoDTO) => {
  const contentType = fileInfo.contentType || ''
  if (contentType.startsWith('image/')) return ImageOutline
  if (contentType.startsWith('video/')) return VideocamOutline
  if (contentType.startsWith('audio/')) return MusicalNotesOutline
  if (contentType.includes('pdf') || contentType.includes('document') || contentType.includes('text')) return DocumentTextOutline
  if (contentType.includes('zip') || contentType.includes('rar') || contentType.includes('7z')) return ArchiveOutline
  return FolderOutline
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// 格式化上传时间
const formatUploadTime = (timeString: string): string => {
  const date = new Date(timeString)
  return date.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 监听任务变化，重新加载文件信息
watch(() => props.task, () => {
  if (props.task) {
    loadFileInfo()
  } else {
    fileInfoList.value = []
  }
}, {immediate: true})

</script>

<style lang="scss" scoped>
.task-detail-content {
  height: 100%;
  overflow: hidden;

  .no-selection-card {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: none;
    box-shadow: none;
  }

  .task-info-card {
    height: 100%;
    overflow: auto;
    border: none;
    box-shadow: none;

    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }

    .task-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--border-color);

      .task-title-section {
        flex: 1;
        margin-right: 16px;

        .task-title {
          font-size: 24px;
          font-weight: 700;
          color: var(--text-color);
          margin: 0 0 8px 0;
          line-height: 1.3;
        }

        .task-meta-info {
          display: flex;
          gap: 16px;
          align-items: center;
          flex-wrap: wrap;

          .task-type-info,
          .task-difficulty-info {
            display: flex;
            align-items: center;
            gap: 6px;
            font-size: 14px;
            color: var(--text-secondary-color);

            .n-icon {
              font-size: 16px;
            }
          }

          .task-status-info {
            flex-shrink: 0;
          }
        }
      }

      .task-actions {
        display: flex;
        gap: 8px;
        flex-shrink: 0;
      }
    }

    .section-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--text-color);
      margin: 0 0 12px 0;
      padding-bottom: 8px;
      border-bottom: 2px solid var(--color-primary);
    }

    .task-description {
      margin-bottom: 12px;

      .description-content {
        font-size: 15px;
        line-height: 1.5;
        color: var(--text-secondary-color);
        padding: 0;
        background: none;
        border: none;
        border-radius: 0;
      }
    }

    .task-content {
      margin-bottom: 24px;

      .content-body {
        font-size: 15px;
        line-height: 1.6;
        color: var(--text-color);
        background: var(--background-secondary-color);
        padding: 16px;
        border-radius: 8px;
        border: 1px solid var(--border-color);

        :deep(h1), :deep(h2), :deep(h3), :deep(h4), :deep(h5), :deep(h6) {
          color: var(--text-color);
          margin-top: 16px;
          margin-bottom: 8px;
        }

        :deep(p) {
          margin-bottom: 12px;
        }

        :deep(ul), :deep(ol) {
          padding-left: 20px;
          margin-bottom: 12px;
        }

        :deep(li) {
          margin-bottom: 4px;
        }

        :deep(blockquote) {
          border-left: 4px solid var(--color-primary);
          padding-left: 16px;
          margin: 16px 0;
          color: var(--text-secondary-color);
        }

        :deep(code) {
          background: var(--background-secondary-color);
          padding: 2px 6px;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
        }

        :deep(pre) {
          background: var(--background-secondary-color);
          padding: 12px;
          border-radius: 6px;
          overflow-x: auto;
          margin: 12px 0;
        }
      }
    }

    .task-requirements {
      margin-bottom: 24px;

      .requirements-content {
        font-size: 15px;
        line-height: 1.6;
        color: var(--text-color);
        background: var(--background-secondary-color);
        padding: 16px;
        border-radius: 8px;
        border: 1px solid var(--border-color);
      }
    }

    .task-attachments {
      margin-bottom: 24px;

      .file-info-container {
        margin-top: 8px;

        .file-info-item {
          padding: 12px 16px;
          border-bottom: 1px solid var(--n-border-color);
          cursor: pointer;
          transition: all 0.2s ease;
          border-radius: 8px;
          margin-bottom: 4px;
          position: relative;

          &:last-child {
            border-bottom: none;
            margin-bottom: 0;
          }

          &:hover {
            background-color: var(--n-color-hover);
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          }

          &:active {
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.1);
          }

          .file-details {
            flex: 1;
            margin-left: 12px;

            .file-name {
              font-weight: 500;
              margin-bottom: 4px;
              word-break: break-all;
              color: var(--n-text-color);
              transition: color 0.2s ease;
            }

            .file-meta {
              display: flex;
              align-items: center;
              gap: 8px;
            }
          }

          &:hover .file-details .file-name {
            color: var(--color-primary);
          }
        }
      }
    }

    .task-stats {
      margin-bottom: 24px;

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 16px;

        .stat-item {
          background: var(--background-secondary-color);
          padding: 16px;
          border-radius: 8px;
          border: 1px solid var(--border-color);
          text-align: center;

          .stat-label {
            font-size: 12px;
            color: var(--text-secondary-color);
            margin-bottom: 4px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }

          .stat-value {
            font-size: 20px;
            font-weight: 600;
            color: var(--color-primary);
          }
        }
      }
    }

  }
}

// 响应式设计
@media (max-width: 768px) {
  .task-detail-content {
    .task-info-card {
      .task-header {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;

        .task-title-section {
          margin-right: 0;

          .task-title {
            font-size: 20px;
          }

          .task-meta-info {
            gap: 12px;
            font-size: 13px;
          }
        }

        .task-actions {
          justify-content: flex-end;
        }
      }

      .section-title {
        font-size: 16px;
      }

      .task-description,
      .task-content,
      .task-requirements {
        .description-content,
        .content-body,
        .requirements-content {
          font-size: 14px;
          padding: 12px;
        }
      }

      .task-stats {
        .stats-grid {
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;

          .stat-item {
            padding: 12px;

            .stat-value {
              font-size: 18px;
            }
          }
        }
      }
    }
  }
}

@media (max-width: 480px) {
  .task-detail-content {
    .task-info-card {
      .task-header {
        .task-title-section {
          .task-meta-info {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
        }
      }

      .task-stats {
        .stats-grid {
          grid-template-columns: 1fr;
        }
      }
    }
  }
}
</style>
