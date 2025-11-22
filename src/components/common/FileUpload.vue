<template>
  <div :class="['file-upload', props.customClass]">
    <!-- 拖拽上传区域 -->
    <n-upload
        v-if="props.dragUpload"
        ref="uploadRef"
        v-model:file-list="fileList"
        :accept="props.accept"
        :custom-request="handleCustomRequest"
        :disabled="props.disabled"
        :list-type="props.listType"
        :max="props.maxFileCount"
        :multiple="props.multiple"
        :show-file-list="props.showFileList"
        @download="handleFileDownload"
        @preview="handleFilePreview"
        @remove="handleFileRemove"
        @before-upload="handleBeforeUpload"
    >
      <n-upload-dragger>
        <div class="upload-dragger-content">
          <n-icon :depth="3" size="48">
            <CloudUploadOutline/>
          </n-icon>
          <n-p style="font-size: 16px">
            {{ props.uploadText || t('common.clickOrDragToUpload') }}
          </n-p>
          <n-p depth="3" style="margin: 8px 0 0 0">
            {{ props.uploadHint || t('common.uploadHint') }}
          </n-p>
        </div>
      </n-upload-dragger>
    </n-upload>

    <!-- 按钮上传区域 -->
    <div v-else class="upload-button-area">
      <n-upload
          ref="uploadRef"
          v-model:file-list="fileList"
          :accept="props.accept"
          :custom-request="handleCustomRequest"
          :disabled="props.disabled"
          :list-type="props.listType"
          :max="props.maxFileCount"
          :multiple="props.multiple"
          :show-file-list="props.showFileList"
          @download="handleFileDownload"
          @preview="handleFilePreview"
          @remove="handleFileRemove"
          @before-upload="handleBeforeUpload"
      >
        <n-button
            :disabled="props.disabled"
            :loading="uploading"
            :style="props.buttonStyle"
            type="primary"
        >
          <template #icon>
            <n-icon>
              <CloudUploadOutline/>
            </n-icon>
          </template>
          {{ props.uploadText || t('common.selectFiles') }}
        </n-button>
      </n-upload>

      <!-- 上传提示 -->
      <div v-if="props.uploadHint" class="upload-hint">
        <n-text depth="3" style="font-size: 12px">
          {{ props.uploadHint }}
        </n-text>
      </div>
    </div>

    <!-- 文件列表 - 只显示正在上传的文件 -->
    <div v-if="props.showFileList && uploadingFiles.length > 0" :style="props.listStyle" class="file-list">
      <n-list>
        <n-list-item v-for="file in uploadingFiles" :key="file.id" class="file-item">
          <template #prefix>
            <n-icon :color="getFileIconColor(file)" size="20">
              <component :is="getFileIcon(file)"/>
            </n-icon>
          </template>

          <div class="file-info">
            <div class="file-name">{{ file.name }}</div>
            <div class="file-details">
              <n-text depth="3" style="font-size: 12px">
                {{ formatFileSize(file.file?.size || 0) }}
              </n-text>
              <n-text v-if="file.status === 'error'" style="font-size: 12px; margin-left: 8px" type="error">
                {{ t('common.uploadFailed') }}
              </n-text>
            </div>
            <!-- 上传进度条 -->
            <n-progress
                v-if="file.status === 'uploading'"
                :percentage="file.percentage || 0"
                :show-indicator="false"
                size="small"
                style="margin-top: 4px"
            />
          </div>

          <template #suffix>
            <n-space>
              <!-- 取消上传按钮 -->
              <n-button
                  v-if="file.status === 'uploading'"
                  size="small"
                  text
                  type="error"
                  @click="handleFileRemove({ file, fileList: fileList, index: fileList.findIndex((f: UploadFileInfo) => f.id === file.id) })"
              >
                <template #icon>
                  <n-icon>
                    <TrashOutline/>
                  </n-icon>
                </template>
                {{ t('common.cancel') }}
              </n-button>
            </n-space>
          </template>
        </n-list-item>
      </n-list>
    </div>

    <!-- 文件预览模态框 -->
    <n-modal v-model:show="showPreviewModal" :title="previewFile?.name" preset="card" style="width: 80%">
      <div v-if="previewFile" class="file-preview">
        <!-- 图片预览 -->
        <img
            v-if="isImageFile(previewFile)"
            :src="previewFile.url || ''"
            alt="Preview"
            class="preview-image"
        />
        <!-- 视频预览 -->
        <video
            v-else-if="isVideoFile(previewFile)"
            :src="previewFile.url || ''"
            class="preview-video"
            controls
        />
        <!-- 音频预览 -->
        <audio
            v-else-if="isAudioFile(previewFile)"
            :src="previewFile.url || ''"
            class="preview-audio"
            controls
        />
        <!-- 其他文件类型 -->
        <div v-else class="preview-other">
          <n-icon :depth="3" size="64">
            <component :is="getFileIcon(previewFile)"/>
          </n-icon>
          <n-p style="margin-top: 16px">
            {{ t('common.previewNotSupported') }}
          </n-p>
          <n-button type="primary" @click="handleFileDownload(previewFile)">
            <template #icon>
              <n-icon>
                <DownloadOutline/>
              </n-icon>
            </template>
            {{ t('common.downloadFile') }}
          </n-button>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from 'vue'
import {
  NButton,
  NIcon,
  NList,
  NListItem,
  NModal,
  NP,
  NProgress,
  NSpace,
  NText,
  NUpload,
  NUploadDragger,
  type UploadCustomRequestOptions,
  type UploadFileInfo
} from 'naive-ui'
import {
  ArchiveOutline,
  CloudUploadOutline,
  DocumentOutline,
  DownloadOutline,
  FolderOutline,
  ImageOutline,
  MusicalNotesOutline,
  PlayCircleOutline,
  TrashOutline
} from '@vicons/ionicons5'
import {useI18n} from 'vue-i18n'
import {uploadFile} from '@/api/minIO'
import type {FileUploadEmits, FileUploadProps} from '@/types/components/fileUpload'
import {FileType} from '@/types/components/fileUpload'
import {BusinessBucketCodeEnum} from '@/enum/minIO'

// Props定义
const props = withDefaults(defineProps<FileUploadProps>(), {
  modelValue: () => [],
  disabled: false,
  accept: '*',
  maxFileSize: 10 * 1024 * 1024, // 10MB
  maxFileCount: 10,
  uploadDir: 'files',
  bucketCode: BusinessBucketCodeEnum.COURSE_PRIVATE,
  showFileList: true,
  multiple: true,
  dragUpload: false,
  uploadText: '',
  uploadHint: '',
  autoUpload: true,
  listType: 'text',
  showDownloadButton: true,
  showDeleteButton: true,
  showPreviewButton: true,
  customClass: '',
  buttonStyle: () => ({}),
  listStyle: () => ({})
})

// Emits定义
const emit = defineEmits<FileUploadEmits>()

// 组合式API
const {t} = useI18n()

// 响应式数据
const uploadRef = ref()
const fileList = ref<UploadFileInfo[]>(props.modelValue || [])
const uploading = ref(false)
const showPreviewModal = ref(false)
const previewFile = ref<UploadFileInfo | null>(null)

// 计算属性
const modelValue = computed({
  get: () => props.modelValue || [],
  set: (value: UploadFileInfo[]) => emit('update:modelValue', value)
})

// 只显示正在上传的文件
const uploadingFiles = computed(() => {
  return fileList.value.filter(file => file.status === 'uploading')
})

// 监听文件列表变化
watch(fileList, (newFiles) => {
  modelValue.value = newFiles
  emit('file-change', newFiles)
}, {deep: true})

// 方法
const handleBeforeUpload = (data: { file: UploadFileInfo }): boolean => {
  const {file} = data

  // 验证文件大小
  if (file.file && file.file.size > props.maxFileSize) {
    return false
  }

  // 验证文件数量
  if (fileList.value.length >= props.maxFileCount) {
    return false
  }

  // 触发before-upload事件
  emit('before-upload', file)
  return true
}

const handleCustomRequest = async (options: UploadCustomRequestOptions) => {
  const {file, onFinish, onError} = options

  if (!file.file) return

  try {
    uploading.value = true

    // 更新文件状态为上传中
    const fileIndex = fileList.value.findIndex(f => f.id === file.id)
    if (fileIndex !== -1) {
      fileList.value[fileIndex].status = 'uploading'
    }

    // 上传文件
    const response = await uploadFile(file.file, {
      directory: props.uploadDir,
      bucketCode: props.bucketCode
    })

    if (response && response.data) {
      // 更新文件状态为已完成，然后立即从列表中移除
      if (fileIndex !== -1) {
        fileList.value[fileIndex].status = 'finished'
        fileList.value[fileIndex].url = response.data.url
        // 延迟移除，让用户看到完成状态
        setTimeout(() => {
          const currentIndex = fileList.value.findIndex(f => f.id === file.id)
          if (currentIndex !== -1) {
            fileList.value.splice(currentIndex, 1)
          }
        }, 500) // 500ms后移除
      }

      // 触发成功事件
      emit('upload-success', file, response.data)

      // 触发URL更新事件，只传递新上传的文件URL
      emit('urls-updated', [response.data.url])

      onFinish()
    } else {
      throw new Error('Upload failed')
    }
  } catch (error) {
    // 上传失败时也从文件列表中移除
    const fileIndex = fileList.value.findIndex(f => f.id === file.id)
    if (fileIndex !== -1) {
      fileList.value.splice(fileIndex, 1)
    }

    emit('upload-error', file, error as Error)
    onError()
  } finally {
    uploading.value = false
  }
}

const handleFileRemove = (data: { file: UploadFileInfo; fileList: UploadFileInfo[]; index: number }) => {
  const {file} = data
  const index = fileList.value.findIndex(f => f.id === file.id)
  if (index !== -1) {
    // 如果文件正在上传，需要取消上传
    if (file.status === 'uploading') {
      // 这里可以添加取消上传的逻辑，比如取消XMLHttpRequest
      // 目前直接移除文件
    }

    fileList.value.splice(index, 1)
    emit('file-remove', file)

    // 触发URL更新事件，传递当前剩余文件的URL数组
    const uploadedUrls = fileList.value
        .filter(f => f.status === 'finished' && f.url)
        .map(f => f.url!)
    emit('urls-updated', uploadedUrls)
  }
}

const handleFilePreview = (file: UploadFileInfo) => {
  previewFile.value = file
  showPreviewModal.value = true
  emit('file-preview', file)
}

const handleFileDownload = (file: UploadFileInfo) => {
  if (file.url) {
    const link = document.createElement('a')
    link.href = file.url
    link.download = file.name
    link.target = '_blank'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }
  emit('file-download', file)
}

// 文件类型判断
const getFileType = (file: UploadFileInfo): FileType => {
  if (!file.file) return FileType.OTHER

  const type = file.file.type
  if (type.startsWith('image/')) return FileType.IMAGE
  if (type.startsWith('video/')) return FileType.VIDEO
  if (type.startsWith('audio/')) return FileType.AUDIO
  if (type.includes('pdf') || type.includes('document') || type.includes('text')) return FileType.DOCUMENT
  if (type.includes('zip') || type.includes('rar') || type.includes('7z')) return FileType.ARCHIVE
  return FileType.OTHER
}

const isImageFile = (file: UploadFileInfo): boolean => {
  return getFileType(file) === FileType.IMAGE
}

const isVideoFile = (file: UploadFileInfo): boolean => {
  return getFileType(file) === FileType.VIDEO
}

const isAudioFile = (file: UploadFileInfo): boolean => {
  return getFileType(file) === FileType.AUDIO
}


// 文件图标
const getFileIcon = (file: UploadFileInfo) => {
  const fileType = getFileType(file)
  switch (fileType) {
    case FileType.IMAGE:
      return ImageOutline
    case FileType.VIDEO:
      return PlayCircleOutline
    case FileType.AUDIO:
      return MusicalNotesOutline
    case FileType.DOCUMENT:
      return DocumentOutline
    case FileType.ARCHIVE:
      return ArchiveOutline
    default:
      return FolderOutline
  }
}

const getFileIconColor = (file: UploadFileInfo): string => {
  const fileType = getFileType(file)
  switch (fileType) {
    case FileType.IMAGE:
      return '#52c41a'
    case FileType.VIDEO:
      return '#1890ff'
    case FileType.AUDIO:
      return '#722ed1'
    case FileType.DOCUMENT:
      return '#fa8c16'
    case FileType.ARCHIVE:
      return '#eb2f96'
    default:
      return '#8c8c8c'
  }
}

// 格式化文件大小
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
</script>

<style lang="scss" scoped>
.file-upload {
  width: 100%;

  .upload-dragger-content {
    padding: 20px;
    text-align: center;
  }

  .upload-button-area {
    .upload-hint {
      margin-top: 8px;
      text-align: center;
    }
  }

  .file-list {
    margin-top: 16px;

    .file-item {
      padding: 12px 0;
      border-bottom: 1px solid var(--n-border-color);

      &:last-child {
        border-bottom: none;
      }

      .file-info {
        flex: 1;
        margin-left: 12px;

        .file-name {
          font-weight: 500;
          margin-bottom: 4px;
          word-break: break-all;
        }

        .file-details {
          display: flex;
          align-items: center;
        }
      }
    }
  }

  .file-preview {
    text-align: center;

    .preview-image {
      max-width: 100%;
      max-height: 70vh;
      object-fit: contain;
    }

    .preview-video {
      max-width: 100%;
      max-height: 70vh;
    }

    .preview-audio {
      width: 100%;
      max-width: 500px;
    }

    .preview-other {
      padding: 40px;
    }
  }
}
</style>
