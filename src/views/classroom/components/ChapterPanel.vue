<template>
  <div v-if="show" class="chapter-panel">
    <NButton circle class="chapter-panel__close" quaternary size="small" @click="handleClose">
      <template #icon>
        <NIcon :component="CloseOutline" :size="18"/>
      </template>
    </NButton>
    <div class="chapter-panel__header">
      <div class="chapter-panel__title">{{ t('classroom.chapterPanel.title') }}</div>
    </div>
    <div class="chapter-panel__body">
      <div class="chapter-panel__list" @scroll="handleChapterScroll">
        <div
            v-for="chapter in visibleChapters"
            :key="chapter.id"
            :class="{'is-active': chapter.id === selectedChapterId}"
            :style="{paddingLeft: `${12 + ((chapter as any).__level || 0) * 16}px`}"
            class="chapter-item"
            @click="handleChapterSelect(chapter as any)"
        >
          <div class="chapter-item__row">
            <span
                v-if="(chapter as any).__hasChildren"
                class="chapter-toggle"
                @click.stop="toggleChapterExpand($event, chapter.id)"
            >
              {{ isChapterExpanded(chapter.id) ? '▾' : '▸' }}
            </span>
            <div class="chapter-item__title is-clamped">{{ chapter.chapterName }}</div>
          </div>
          <div class="chapter-item__desc is-clamped-desc">{{ chapter.description || '暂无简介' }}</div>
        </div>
        <div v-if="chapterLoading" class="chapter-panel__loading">
          <NSpin size="small"/>
        </div>
        <div v-else-if="!visibleChapters.length" class="chapter-panel__empty">{{
            t('classroom.chapterPanel.empty')
          }}
        </div>
      </div>
      <div class="chapter-panel__detail">
        <template v-if="chapterDetail">
          <div class="chapter-detail__header">
            <div class="chapter-detail__title">{{ chapterDetail.chapterName }}</div>
            <div v-if="chapterDetail.description" class="chapter-detail__description">
              {{ chapterDetail.description }}
            </div>
          </div>
          <div v-if="chapterDetail.content" class="chapter-detail__content" v-html="chapterDetail.content"></div>
          <div v-else class="chapter-panel__empty">{{ t('classroom.chapterPanel.noContent') }}</div>
          <div v-if="chapterDetail.attachmentUrls && chapterDetail.attachmentUrls.length > 0"
               class="chapter-detail__files">
            <div class="chapter-detail__files-title">{{ t('classroom.chapterPanel.attachments') }}</div>
            <NSpin :show="loadingFiles ?? false">
              <div v-if="fileInfoList.length > 0" class="file-list">
                <div
                    v-for="fileInfo in fileInfoList"
                    :key="fileInfo.objectName"
                    class="file-item"
                    @click="handleFilePreview(fileInfo, $event)"
                >
                  <Icon :component="getFileTypeIcon(fileInfo)" class="file-item__icon"/>
                  <div class="file-item__info">
                    <div class="file-item__name">{{ fileInfo.fileName }}</div>
                    <div class="file-item__meta">
                      <span class="file-item__size">{{ formatFileSize(fileInfo.size) }}</span>
                    </div>
                  </div>
                  <NButton circle class="file-item__download" quaternary size="small"
                           @click.stop="handleFilePreview(fileInfo, $event)">
                    <DownloadOutline/>
                  </NButton>
                </div>
              </div>
              <div v-else-if="!(loadingFiles ?? false)" class="chapter-panel__empty">
                {{ t('classroom.chapterPanel.noAttachments') }}
              </div>
            </NSpin>
          </div>
        </template>
        <template v-else>
          <div class="chapter-panel__empty">{{ t('classroom.chapterPanel.selectHint') }}</div>
        </template>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from 'vue';
import {useI18n} from 'vue-i18n';
import {NButton, NIcon, NSpin} from 'naive-ui';
import {useRouter} from 'vue-router';
import {useTransitionStore} from '@/store/modules/transition';
import {runViewTransition} from '@/utils/themeAnimation';
import {
  ArchiveOutline,
  CloseOutline,
  DocumentTextOutline,
  DownloadOutline,
  FolderOutline,
  ImageOutline,
  MusicalNotesOutline,
  VideocamOutline
} from '@vicons/ionicons5';
import Icon from '@/components/common/Icon.vue';
import {getCourseChapterById, listCourseChapterTree, viewChapter} from '@/api/course/courseChapter';
import type {CourseChapterVO} from '@/types/course';
import * as MinIOApi from '@/api/minIO';
import {BusinessBucketCodeEnum} from '@/enum/minIO';
import type {FileInfoDTO} from '@/types/minIO/file';

type ChapterFlat = CourseChapterVO & { __level?: number; __hasChildren?: boolean };

const props = defineProps<{
  show: boolean;
  courseId: string | null;
}>();

const emit = defineEmits<{
  close: [];
}>();

const router = useRouter();
const transitionStore = useTransitionStore();
const {t} = useI18n();

const chapterTree = ref<CourseChapterVO[] | null>(null);
const chapterTotal = ref<number | null>(null);
const chapterPageNum = ref<number | null>(null);
const chapterPageSize = ref<number | null>(null);
const chapterLoading = ref<boolean | null>(null);
const chapterLoadingMore = ref<boolean | null>(null);
const selectedChapterId = ref<string | null>(null);
const chapterDetail = ref<CourseChapterVO | null>(null);
const expandedChapters = ref<Set<string> | null>(null);
const fileInfoList = ref<FileInfoDTO[]>([]);
const loadingFiles = ref<boolean | null>(null);

const resetChapterPagination = () => {
  chapterTree.value = null;
  chapterTotal.value = 0;
  chapterPageNum.value = 0;
  chapterPageSize.value = 10;
  selectedChapterId.value = null;
  chapterDetail.value = null;
  chapterLoading.value = false;
  chapterLoadingMore.value = false;
  expandedChapters.value = null;
};

const flattenChapterTree = (tree: CourseChapterVO[]): ChapterFlat[] => {
  const result: ChapterFlat[] = [];
  const flatten = (nodes: CourseChapterVO[], level = 0) => {
    nodes.forEach(node => {
      const {children, ...nodeWithoutChildren} = node;
      result.push({...nodeWithoutChildren, __level: level, __hasChildren: Boolean(children && children.length)});
      if (children && children.length > 0) {
        flatten(children, level + 1);
      }
    });
  };
  flatten(tree, 0);
  return result;
};

const buildVisibleChapters = (tree: CourseChapterVO[], expanded: Set<string>): ChapterFlat[] => {
  const result: ChapterFlat[] = [];
  const walk = (nodes: CourseChapterVO[], level = 0) => {
    nodes.forEach(node => {
      const {children, ...nodeWithoutChildren} = node;
      result.push({...nodeWithoutChildren, __level: level, __hasChildren: Boolean(children && children.length)});
      if (children && children.length > 0 && expanded.has(node.id)) {
        walk(children, level + 1);
      }
    });
  };
  walk(tree, 0);
  return result;
};

const visibleChapters = computed<ChapterFlat[]>(() => {
  if (!chapterTree.value || chapterTree.value.length === 0) {
    return [];
  }
  const expanded = expandedChapters.value || new Set<string>();
  return buildVisibleChapters(chapterTree.value, expanded);
});

const fetchChapterPage = async () => {
  if (!props.courseId) {
    return;
  }
  chapterLoading.value = true;
  const response = await listCourseChapterTree(props.courseId);
  const treeData = Array.isArray((response as any)?.data) ? (response as any).data : [];
  const flattenedList = flattenChapterTree(treeData);
  chapterTree.value = treeData;
  // 默认折叠所有章节，保持列表收起状态，按需展开
  expandedChapters.value = new Set<string>();
  chapterTotal.value = flattenedList.length;
  chapterLoading.value = false;
  chapterLoadingMore.value = false;
};

const handleClose = () => {
  emit('close');
};

const handleChapterSelect = async (chapter: CourseChapterVO) => {
  if (selectedChapterId.value === chapter.id && chapterDetail.value) {
    return;
  }
  selectedChapterId.value = chapter.id;
  const detailResponse = await getCourseChapterById(chapter.id);
  chapterDetail.value = (detailResponse as any)?.data || null;
  await viewChapter(chapter.id);
  loadFileInfo();
};

const loadFileInfo = () => {
  if (!chapterDetail.value || !chapterDetail.value.attachmentUrls || chapterDetail.value.attachmentUrls.length === 0) {
    fileInfoList.value = [];
    return;
  }

  loadingFiles.value = true;
  MinIOApi.getBatchFileInfoByPath({
    filePaths: chapterDetail.value.attachmentUrls,
    bucketCode: BusinessBucketCodeEnum.COURSE_PRIVATE
  }).then(res => {
    if (res && res.success && Array.isArray(res.data)) {
      fileInfoList.value = res.data.filter(file => !file.error);
    } else {
      fileInfoList.value = [];
    }
  }).finally(() => {
    loadingFiles.value = false;
  });
};

const getFileTypeIcon = (fileInfo: FileInfoDTO) => {
  const contentType = fileInfo.contentType || '';
  if (contentType.startsWith('image/')) return ImageOutline;
  if (contentType.startsWith('video/')) return VideocamOutline;
  if (contentType.startsWith('audio/')) return MusicalNotesOutline;
  if (contentType.includes('pdf') || contentType.includes('document') || contentType.includes('text')) return DocumentTextOutline;
  if (contentType.includes('zip') || contentType.includes('rar') || contentType.includes('7z')) return ArchiveOutline;
  return FolderOutline;
};

const formatFileSize = (bytes: number): string => {
  if (!bytes) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const handleFilePreview = (fileInfo: FileInfoDTO, event?: MouseEvent) => {
  transitionStore.show();
  runViewTransition(() => {
    router.push({
      name: 'FilePreview',
      query: {
        fileInfo: JSON.stringify(fileInfo),
        from: 'ChapterPanel',
        courseId: props.courseId || '',
        chapterId: selectedChapterId.value || ''
      }
    });
  }, event);
};

const isChapterExpanded = (id: string | null | undefined) => {
  if (!id || !expandedChapters.value) {
    return false;
  }
  return expandedChapters.value.has(id);
};

const toggleChapterExpand = (event: MouseEvent, id: string | null | undefined) => {
  if (!id) {
    return;
  }
  if (event) {
    event.stopPropagation();
  }
  const next = new Set<string>(expandedChapters.value || []);
  if (next.has(id)) {
    next.delete(id);
  } else {
    next.add(id);
  }
  expandedChapters.value = next;
};

const handleChapterScroll = () => {
  // 树形 API 返回所有数据，不需要滚动加载更多
};

watch(() => props.show, (newVal) => {
  if (newVal) {
    resetChapterPagination();
    fetchChapterPage();
  }
});

watch(() => props.courseId, (newVal) => {
  if (newVal && props.show) {
    resetChapterPagination();
    fetchChapterPage();
  }
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.chapter-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: chapter-panel-enter 0.25s ease;
  width: 70vw;
  max-width: 1200px;
  min-height: 82vh;
  max-height: 82vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, color-mix(in srgb, var(--background-secondary-color) 80%, transparent), color-mix(in srgb, var(--background-tertiary-color) 95%, transparent));
  border: 1px solid color-mix(in srgb, var(--border-color) 80%, transparent);
  border-radius: 16px;
  box-shadow: 0 18px 38px color-mix(in srgb, var(--shadow-color) 80%, transparent);
  overflow: hidden;
  z-index: 1003;
}

@keyframes chapter-panel-enter {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.98);
  }

  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.chapter-panel__close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1004;
  color: var(--text-color);

  &:hover {
    color: var(--color-primary);
    background-color: color-mix(in srgb, var(--color-primary) 15%, transparent);
  }
}

.chapter-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid color-mix(in srgb, var(--border-secondary-color) 90%, transparent);
}

.chapter-panel__title {
  font-weight: 600;
  color: var(--text-color);
}

.chapter-panel__body {
  display: grid;
  grid-template-columns: 30% 70%;
  min-height: 320px;
}

.chapter-panel__list {
  border-right: 1px solid color-mix(in srgb, var(--border-secondary-color) 90%, transparent);
  padding: 10px;
  overflow-y: auto;
  background: color-mix(in srgb, var(--background-secondary-color) 75%, transparent);
}

.chapter-panel__detail {
  padding: 12px;
  overflow-y: auto;
}

.chapter-detail__header {
  margin-bottom: 12px;
}

.chapter-detail__title {
  font-weight: 700;
  font-size: 20px;
  color: var(--text-color);
  margin-bottom: 8px;
}

.chapter-detail__description {
  color: var(--text-secondary-color);
  line-height: 1.5;
}

.chapter-item {
  padding: 10px 12px;
  border-radius: 10px;
  background: color-mix(in srgb, var(--background-tertiary-color) 70%, transparent);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 8px;
}

.chapter-item__row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.chapter-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 18px;
  height: 18px;
  border-radius: 4px;
  background: color-mix(in srgb, var(--background-tertiary-color) 60%, transparent);
  color: var(--text-secondary-color);
  font-size: 12px;
  flex-shrink: 0;
}

.chapter-item__title {
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 6px;
  flex: 1;
  min-width: 0;
}

.chapter-item__title.is-clamped {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  line-clamp: 1;
  overflow: hidden;
}

.chapter-item__desc {
  font-size: 13px;
  color: var(--text-secondary-color);
}

.chapter-item__desc.is-clamped-desc {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  line-clamp: 2;
  overflow: hidden;
}

.chapter-item:hover {
  border-color: color-mix(in srgb, var(--color-primary) 55%, transparent);
  box-shadow: 0 10px 24px color-mix(in srgb, var(--shadow-secondary-color) 90%, transparent);
}

.chapter-item.is-active {
  border-color: color-mix(in srgb, var(--color-primary) 70%, transparent);
  background: linear-gradient(135deg, color-mix(in srgb, var(--color-primary-light) 15%, transparent), color-mix(in srgb, var(--background-tertiary-color) 80%, transparent));
}

.chapter-panel__loading,
.chapter-panel__empty {
  padding: 12px;
  text-align: center;
  color: var(--text-secondary-color);
}

.chapter-detail__content {
  color: var(--text-secondary-color);
  line-height: 1.5;
  max-height: 360px;
  overflow-y: auto;
}

.chapter-detail__files {
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid color-mix(in srgb, var(--border-secondary-color) 90%, transparent);
}

.chapter-detail__files-title {
  font-weight: 600;
  font-size: 16px;
  color: var(--text-color);
  margin-bottom: 12px;
}

.file-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.file-item {
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background: color-mix(in srgb, var(--background-tertiary-color) 70%, transparent);
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
  gap: 12px;

  &:hover {
    border-color: color-mix(in srgb, var(--color-primary) 55%, transparent);
    background: color-mix(in srgb, var(--background-tertiary-color) 85%, transparent);
    box-shadow: 0 2px 8px color-mix(in srgb, var(--shadow-secondary-color) 50%, transparent);
  }
}

.file-item__icon {
  flex-shrink: 0;
  color: var(--color-primary);
  font-size: 20px;
}

.file-item__info {
  flex: 1;
  min-width: 0;
}

.file-item__name {
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 4px;
  word-break: break-all;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
}

.file-item__meta {
  display: flex;
  align-items: center;
  gap: 8px;
}

.file-item__size {
  font-size: 12px;
  color: var(--text-secondary-color);
}

.file-item__download {
  flex-shrink: 0;
  color: var(--color-primary);
}
</style>

