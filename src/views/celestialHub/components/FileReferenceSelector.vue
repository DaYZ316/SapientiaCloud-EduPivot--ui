<template>
  <div class="file-reference-selector">
    <!-- 已选择的文件引用列表 -->
    <div v-if="selectedFiles.length > 0" class="selected-files">
      <div
          v-for="(file, index) in selectedFiles"
          :key="file.id ?? `file-${index}`"
          class="file-reference-item"
      >
        <div class="file-card">
          <div class="file-icon">
            <n-icon :component="getFileTypeIcon(file)" color="var(--color-primary)" size="24"/>
          </div>
          <div class="file-info">
            <div :title="getDisplayName(file)" class="file-name">
              {{ getDisplayName(file) }}
            </div>
            <div class="file-meta">
              <div class="file-type-badge">
                {{ getFileTypeLabel(file) }}
              </div>
              <div class="file-size">{{ formatFileSize(file.fileSize) }}</div>
            </div>
          </div>
        </div>
        <n-button
            circle
            class="remove-button"
            quaternary
            size="tiny"
            type="error"
            @click="removeFile(index)"
        >
          <template #icon>
            <n-icon>
              <CloseOutline/>
            </n-icon>
          </template>
        </n-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import {NButton, NIcon} from 'naive-ui'
import {CloseOutline, DocumentTextOutline} from '@vicons/ionicons5'
import {useI18n} from 'vue-i18n'
import type {FileReference} from '@/types/celestialHub/knowledge'

const props = withDefaults(defineProps<{
  modelValue?: FileReference[] | null
  sessionId?: string | null
}>(), {
  modelValue: null,
  sessionId: null
})

const emit = defineEmits<{
  'update:modelValue': [value: FileReference[] | null]
}>()

const {t} = useI18n()

const selectedFiles = computed(() => {
  return props.modelValue || []
})

const removeFile = (index: number) => {
  const newFiles = [...selectedFiles.value]
  newFiles.splice(index, 1)
  emit('update:modelValue', newFiles.length > 0 ? newFiles : null)
}

const getFileTypeIcon = (file: FileReference) => {
  const fileType = file.fileType
  if (fileType === 0) return DocumentTextOutline
  if (fileType === 1 || fileType === 2) return DocumentTextOutline
  if (fileType === 3 || fileType === 4) return DocumentTextOutline
  if (fileType === 5 || fileType === 6) return DocumentTextOutline
  return DocumentTextOutline
}

const getFileTypeLabel = (file: FileReference) => {
  const map: Record<number, string> = {
    0: 'PDF',
    1: 'DOC',
    2: 'DOCX',
    3: 'XLS',
    4: 'XLSX',
    5: 'TXT',
    6: 'MD',
    7: 'RTF'
  }
  if (file.fileType !== null && file.fileType !== undefined && map[file.fileType] !== undefined) {
    return map[file.fileType]
  }
  const name = file.fileName || ''
  const ext = name.includes('.') ? name.split('.').pop() || '' : ''
  return ext ? ext.toUpperCase() : 'FILE'
}

const getDisplayName = (file: FileReference) => {
  const rawName = file.fileName || t('chat.session.filesUnnamed')
  if (!rawName) return ''
  const lastDot = rawName.lastIndexOf('.')
  if (lastDot <= 0) return rawName
  return rawName.substring(0, lastDot)
}

const formatFileSize = (bytes: number | null | undefined): string => {
  if (bytes === null || bytes === undefined) return '--'
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`
}

</script>

<style lang="scss" scoped>
@use '@/assets/styles' as *;

.file-reference-selector {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .selected-files {
    display: flex;
    flex-wrap: wrap;
    gap: 12px;

    .file-reference-item {
      position: relative;
      width: 260px;
      display: flex;
      align-items: stretch;
      background: color-mix(in srgb, var(--background-tertiary-color) 70%, transparent);
      border-radius: 14px;
      border: 1px solid var(--border-color);
      padding: 12px;
      transition: all 0.2s ease;

      &:hover {
        border-color: var(--color-primary);
      }

      .file-card {
        display: flex;
        align-items: center;
        gap: 12px;
        width: 100%;
        min-width: 0;

        .file-icon {
          width: 54px;
          height: 54px;
          border-radius: 14px;
          background: color-mix(in srgb, var(--color-primary) 14%, transparent);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .file-info {
          display: flex;
          flex-direction: column;
          gap: 8px;
          min-width: 0;
          width: 100%;
          padding-right: 32px;

          .file-name {
            font-size: 14px;
            color: var(--text-color);
            font-weight: 600;
            line-height: 1.4;
            max-width: 100%;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .file-meta {
            display: flex;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;

            .file-type-badge {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              padding: 4px 10px;
              border-radius: 999px;
              background: color-mix(in srgb, var(--color-primary) 16%, transparent);
              border: 1px solid color-mix(in srgb, var(--color-primary) 28%, transparent);
              color: var(--color-primary);
              font-size: 12px;
              font-weight: 600;
              letter-spacing: 0.4px;
              width: fit-content;
              flex-shrink: 0;
            }

            .file-size {
              font-size: 12px;
              color: var(--text-secondary-color);
              white-space: nowrap;
            }
          }
        }
      }

      .remove-button {
        position: absolute;
        top: 8px;
        right: 8px;
        width: 26px;
        height: 26px;
        min-width: 26px;
        padding: 0;
        border-radius: 50%;
        background: color-mix(in srgb, var(--text-color) 8%, transparent);
        border: 1px solid color-mix(in srgb, var(--text-color) 10%, transparent);
        color: var(--text-color);
        opacity: 0;
        pointer-events: none;
        transition: all 0.2s ease;

        :deep(.n-icon) {
          color: inherit;
        }
      }

      &:hover .remove-button {
        opacity: 1;
        pointer-events: auto;
      }

      .remove-button:hover {
        background: color-mix(in srgb, var(--color-primary) 16%, transparent);
        border-color: color-mix(in srgb, var(--color-primary) 28%, transparent);
        color: var(--color-primary);
      }
    }
  }
}
</style>

