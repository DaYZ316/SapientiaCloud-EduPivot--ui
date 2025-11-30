<template>
  <div class="chapter-detail-content">
    <n-card v-if="!chapter" class="no-selection-card">
      <n-empty :description="t('course.chapters.selectChapterToView')">
        <template #icon>
          <Icon :component="BookOutline"/>
        </template>
      </n-empty>
    </n-card>

    <n-card v-else class="chapter-info-card">
      <!-- 章节标题和描述 -->
      <div class="chapter-header">
        <div class="chapter-title-section">
          <h2 class="chapter-title">{{ chapter.chapterName }}</h2>
          <p v-if="chapter.description" class="chapter-description">{{ chapter.description }}</p>
        </div>
        <!-- 操作按钮区域 -->
        <div v-if="canEditChapter" class="chapter-actions">
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

      <!-- 章节内容 -->
      <div v-if="chapter.content" class="chapter-content">
        <div class="content-body" v-html="chapter.content"></div>
      </div>

      <!-- 章节附件 -->
      <FileInfoList
          v-if="chapter.attachmentUrls && chapter.attachmentUrls.length > 0"
          :file-paths="chapter.attachmentUrls"
          :title="t('course.chapters.form.attachments')"
          @preview="handleFilePreview"
      />

    </n-card>

  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRouter} from 'vue-router'
import {
  BookOutline,
  CreateOutline,
  TrashOutline
} from '@vicons/ionicons5'
import type {CourseChapterVO} from '@/types/course/courseChapter'
import type {FileInfoDTO} from '@/types/minIO/file'
import Icon from '@/components/common/Icon.vue'
import {useUserStore} from '@/store/modules/user'
import FileInfoList from '@/components/common/FileInfoList.vue'

const {t} = useI18n()
const router = useRouter()
const userStore = useUserStore()

// 权限检查
const canEditChapter = computed(() => {
  return userStore.hasRole('ADMIN') || userStore.hasRole('TEACHER')
})

// Props
interface Props {
  chapter: CourseChapterVO | null
  courseId: string
}

const props = defineProps<Props>()

// Emits
const emit = defineEmits<{
  update: []
  edit: [chapter: CourseChapterVO]
  delete: [chapter: CourseChapterVO]
}>()

// 事件处理函数
const handleEdit = () => {
  if (props.chapter) {
    // 跳转到章节编辑页面，传递章节ID作为查询参数
    router.push(`/course/detail/${props.courseId}/chapters/control?chapterId=${props.chapter.id}`)
  }
}

const handleDelete = () => {
  if (props.chapter) {
    emit('delete', props.chapter)
  }
}

const handleFilePreview = (fileInfo: FileInfoDTO) => {
  // 跳转到文件预览页面，传递文件信息作为查询参数
  router.push({
    name: 'FilePreview',
    query: {
      fileInfo: JSON.stringify(fileInfo),
      from: 'ChapterDetail',
      courseId: props.courseId,
      chapterId: props.chapter?.id || ''
    }
  })
}


</script>

<style lang="scss" scoped>
.chapter-detail-content {
  height: 100%;

  .no-selection-card {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .chapter-info-card {
    height: 100%;
    overflow-y: auto;

    .chapter-header {
      margin-bottom: 24px;
      padding-bottom: 16px;
      border-bottom: 1px solid var(--n-border-color);
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;

      .chapter-title-section {
        flex: 1;
        min-width: 0;

        .chapter-title {
          margin: 0 0 12px 0;
          font-size: 24px;
          font-weight: 600;
          color: var(--n-text-color);
        }

        .chapter-description {
          margin: 0;
          line-height: 1.6;
          color: var(--n-text-color);
          font-size: 16px;
        }
      }

      .chapter-actions {
        display: flex;
        gap: 8px;
        flex-shrink: 0;
      }
    }

    .chapter-content {
      margin-bottom: 24px;

      .content-body {
        line-height: 1.6;
        color: var(--n-text-color);
      }
    }

  }
}

</style>
