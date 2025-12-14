<template>
  <div class="common-file-list">
    <div v-if="title" class="section-title">
      <h3>{{ title }}</h3>
    </div>
    <div class="file-info-container">
      <n-spin :show="loading">
        <n-list>
          <n-list-item
              v-for="fileInfo in fileInfoList"
              :key="fileInfo.objectName"
              class="file-info-item"
              draggable="true"
              @click="emitPreview(fileInfo, $event)"
              @dragstart="handleDragStart($event, fileInfo)"
          >
            <template #prefix>
              <Icon
                  :component="getFileTypeIcon(fileInfo)"
                  color="var(--color-primary)"
                  size="20"
              />
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
</template>

<script lang="ts" setup>
import {ref, watch} from 'vue'
import {
  ArchiveOutline,
  DocumentTextOutline,
  FolderOutline,
  ImageOutline,
  MusicalNotesOutline,
  VideocamOutline
} from '@vicons/ionicons5'
import Icon from '@/components/common/Icon.vue'
import * as MinIOApi from '@/api/minIO'
import {BusinessBucketCodeEnum} from '@/enum/minIO'
import type {FileInfoDTO, FileInfo} from '@/types/minIO/file'
import {getDefaultFileInfoDTO} from '@/types/minIO/file'

interface Props {
  filePaths?: string[]
  fileInfos?: FileInfoDTO[]
  bucketCode?: BusinessBucketCodeEnum
  title?: string
}

const props = withDefaults(defineProps<Props>(), {
  filePaths: () => [],
  fileInfos: () => [],
  bucketCode: BusinessBucketCodeEnum.COURSE_PRIVATE,
  title: ''
})

const emit = defineEmits<{
  preview: [fileInfo: FileInfoDTO, event?: MouseEvent]
  dragstart: [fileInfo: FileInfoDTO]
}>()

const handleDragStart = (event: DragEvent, fileInfo: FileInfoDTO) => {
  if (event.dataTransfer) {
    event.dataTransfer.effectAllowed = 'copy'
    event.dataTransfer.setData('application/json', JSON.stringify({
      type: 'file-reference',
      fileInfo: fileInfo
    }))
    // 通知父组件开始拖拽，可以关闭侧边栏
    emit('dragstart', fileInfo)
  }
}

const fileInfoList = ref<FileInfoDTO[]>([])
const loading = ref(false)

const emitPreview = (fileInfo: FileInfoDTO, event?: MouseEvent) => {
  emit('preview', fileInfo, event)
}

const normalizeFileInfo = (info: FileInfoDTO | FileInfo): FileInfoDTO => {
  if ('objectName' in info) {
    return info
  }
  const dto = getDefaultFileInfoDTO()
  const fallbackName = info.filename ?? ''
  dto.objectName = info.filename ?? info.etag ?? fallbackName
  dto.fileName = fallbackName
  dto.size = info.size ?? 0
  dto.lastModified = info.lastModified ?? ''
  dto.etag = info.etag ?? ''
  dto.contentType = info.contentType ?? ''
  dto.url = info.url ?? ''
  return dto
}

const loadFileInfo = () => {
  if (props.fileInfos && props.fileInfos.length > 0) {
    fileInfoList.value = props.fileInfos.map(file => normalizeFileInfo(file))
    loading.value = false
    return
  }

  if (!props.filePaths || props.filePaths.length === 0) {
    fileInfoList.value = []
    return
  }

  loading.value = true
  MinIOApi.getBatchFileInfoByPath({
    filePaths: props.filePaths,
    bucketCode: props.bucketCode
  })
      .then(res => {
        if (res && res.success && Array.isArray(res.data)) {
          fileInfoList.value = res.data
              .filter(file => !file.error)
              .map(file => normalizeFileInfo(file))
        } else {
          fileInfoList.value = []
        }
      })
      .finally(() => {
        loading.value = false
      })
}

watch(() => [props.filePaths, props.fileInfos], () => {
  loadFileInfo()
}, {immediate: true, deep: true})

const getFileTypeIcon = (fileInfo: FileInfoDTO) => {
  const contentType = fileInfo.contentType || ''
  if (contentType.startsWith('image/')) return ImageOutline
  if (contentType.startsWith('video/')) return VideocamOutline
  if (contentType.startsWith('audio/')) return MusicalNotesOutline
  if (contentType.includes('pdf') || contentType.includes('document') || contentType.includes('text')) return DocumentTextOutline
  if (contentType.includes('zip') || contentType.includes('rar') || contentType.includes('7z')) return ArchiveOutline
  return FolderOutline
}

const formatFileSize = (bytes: number): string => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
}

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
</script>

<style lang="scss" scoped>
.common-file-list {
  .section-title {
    margin-bottom: 16px;

    h3 {
      margin: 0;
      font-size: 18px;
      font-weight: 600;
      color: var(--n-text-color);
    }
  }

  .file-info-container {
    .file-info-item {
      padding: 12px 16px;
      border-bottom: 1px solid var(--n-border-color);
      cursor: pointer;
      transition: all 0.2s ease;
      border-radius: 8px;
      margin-bottom: 4px;

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
</style>

