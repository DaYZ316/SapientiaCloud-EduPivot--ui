<template>
  <div class="file-preview-page">
    <Teleport :disabled="!isFullscreen" to="body">
      <div :class="{ 'fullscreen': isFullscreen }" class="file-preview-container">
      <!-- 顶部工具栏 -->
      <div v-if="showToolbar" class="file-preview-toolbar">
        <div class="toolbar-left">
          <n-button
              quaternary
              size="small"
              @click="handleBack"
          >
            <template #icon>
              <Icon :component="ArrowBackOutline"/>
            </template>
            {{ t('common.back') }}
          </n-button>

          <n-divider vertical/>

          <n-text :title="fileInfo.fileName" class="file-name">
            {{ fileInfo.fileName }}
          </n-text>
        </div>

        <div class="toolbar-center">
          <!-- PDF 页码控制 -->
          <div v-if="fileType === 'pdf' && totalPages > 1" class="page-controls">
            <n-button
                :disabled="currentPage <= 1"
                quaternary
                size="small"
                @click="handlePreviousPage"
            >
              <template #icon>
                <Icon :component="ChevronBackOutline"/>
              </template>
            </n-button>

            <n-input-number
                v-model:value="currentPage"
                :max="totalPages"
                :min="1"
                size="small"
                style="width: 80px"
                @update:value="handlePageChange"
            />

            <n-text depth="3" style="margin: 0 8px">
              {{ t('common.filePreview.pageInfo', {current: currentPage, total: totalPages}) }}
            </n-text>

            <n-button
                :disabled="currentPage >= totalPages"
                quaternary
                size="small"
                @click="handleNextPage"
            >
              <template #icon>
                <Icon :component="ChevronForwardOutline"/>
              </template>
            </n-button>
          </div>
        </div>

        <div class="toolbar-right">
          <!-- 缩放控制 -->
          <div v-if="showZoomControls" class="zoom-controls">
            <n-button
                :disabled="zoom <= 0.5"
                quaternary
                size="small"
                @click="handleZoomOut"
            >
              <template #icon>
                <Icon :component="RemoveOutline"/>
              </template>
            </n-button>

            <n-text depth="3" style="margin: 0 8px; min-width: 60px; text-align: center">
              {{ Math.round(zoom * 100) }}%
            </n-text>

            <n-button
                :disabled="zoom >= 3"
                quaternary
                size="small"
                @click="handleZoomIn"
            >
              <template #icon>
                <Icon :component="AddOutline"/>
              </template>
            </n-button>

            <n-button
                quaternary
                size="small"
                @click="handleResetZoom"
            >
              {{ t('common.filePreview.resetZoom') }}
            </n-button>
          </div>

          <n-divider vertical/>

          <!-- 下载按钮 -->
          <n-button
              v-if="allowDownload"
              quaternary
              size="small"
              @click="handleDownload"
          >
            <template #icon>
              <Icon :component="DownloadOutline"/>
            </template>
            {{ t('common.filePreview.downloadFile') }}
          </n-button>

          <!-- 打印按钮 -->
          <n-button
              v-if="allowPrint"
              quaternary
              size="small"
              @click="handlePrint"
          >
            <template #icon>
              <Icon :component="PrintOutline"/>
            </template>
            {{ t('common.filePreview.printFile') }}
          </n-button>

          <!-- 全屏按钮 -->
          <n-button
              quaternary
              size="small"
              @click="toggleFullscreen"
          >
            <template #icon>
              <Icon :component="isFullscreen ? ContractOutline : ExpandOutline"/>
            </template>
            {{ isFullscreen ? t('common.filePreview.exitFullscreen') : t('common.filePreview.fullscreen') }}
          </n-button>
        </div>
      </div>

      <!-- 文件预览区域 -->
      <div :style="contentStyle" class="file-preview-content">
        <!-- 加载状态 -->
        <div v-if="loading" class="loading-container">
          <n-spin size="large">
            <template #description>
              {{ t('common.filePreview.loading') }}
            </template>
          </n-spin>
        </div>

        <!-- 错误状态 -->
        <div v-else-if="error" class="error-container">
          <n-result
              :description="error"
              :title="t('common.filePreview.loadFailed')"
              status="error"
          >
            <template #icon>
              <Icon :component="WarningOutline" size="48"/>
            </template>
            <template #footer>
              <n-button @click="handleRetry">
                {{ t('common.retry') }}
              </n-button>
            </template>
          </n-result>
        </div>

        <!-- 不支持的文件格式 -->
        <div v-else-if="fileType === 'unsupported'" class="unsupported-container">
          <n-result
              :description="t('common.filePreview.errors.unsupportedBrowser')"
              :title="t('common.filePreview.unsupportedFormat')"
              status="warning"
          >
            <template #icon>
              <Icon :component="DocumentTextOutline" size="48"/>
            </template>
            <template #footer>
              <n-button @click="handleDownload">
                {{ t('common.filePreview.downloadFile') }}
              </n-button>
            </template>
          </n-result>
        </div>

        <!-- 文件预览内容 -->
        <div v-else class="preview-content">
          <!-- PDF 预览 -->
          <VueOfficePdf
              v-if="fileType === 'pdf'"
              :src="fileInfo.url"
              :style="pdfStyle"
              @error="handlePdfError"
              @rendered="handlePdfRendered"
          />

          <!-- Word 文档预览 -->
          <VueOfficeDocx
              v-else-if="fileType === 'docx'"
              :src="fileInfo.url"
              :style="docxStyle"
              @error="handleDocxError"
              @rendered="handleDocxRendered"
          />

          <!-- Excel 预览 -->
          <VueOfficeExcel
              v-else-if="fileType === 'excel'"
              :src="fileInfo.url"
              :style="excelStyle"
              @error="handleExcelError"
              @rendered="handleExcelRendered"
          />

          <!-- PowerPoint 预览 -->
          <VueOfficePptx
              v-else-if="fileType === 'pptx'"
              :src="fileInfo.url"
              :style="pptxStyle"
              @error="handlePptxError"
              @rendered="handlePptxRendered"
          />

          <!-- 图片预览 -->
          <div v-else-if="fileType === 'image'" class="image-preview">
            <img
                :alt="fileInfo.fileName"
                :src="fileInfo.url"
                :style="imageStyle"
                @error="handleImageError"
                @load="handleImageLoad"
            />
          </div>

          <!-- 视频预览 -->
          <div v-else-if="fileType === 'video'" class="video-preview">
            <video
                :controls="true"
                :src="fileInfo.url"
                :style="videoStyle"
                @error="handleVideoError"
                @loadeddata="handleVideoLoad"
            >
              {{ t('common.filePreview.errors.unsupportedBrowser') }}
            </video>
          </div>

          <!-- 音频预览 -->
          <div v-else-if="fileType === 'audio'" class="audio-preview">
            <audio
                :controls="true"
                :src="fileInfo.url"
                :style="audioStyle"
                @error="handleAudioError"
                @loadeddata="handleAudioLoad"
            >
              {{ t('common.filePreview.errors.unsupportedBrowser') }}
            </audio>
          </div>

          <!-- 文本预览 -->
          <div v-else-if="fileType === 'text'" class="text-preview">
            <pre :style="textStyle">{{ textContent }}</pre>
          </div>
        </div>
      </div>
    </div>
    </Teleport>
  </div>
</template>

<script lang="ts" setup>
// 使用动态导入来避免 Vite 7 兼容性问题
import {computed, defineAsyncComponent, onMounted, onUnmounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRoute, useRouter} from 'vue-router'
import {useMenuStore} from '@/store'
import {createFilePreviewMenuOption} from '@/config/menu'
import {
  AddOutline,
  ArrowBackOutline,
  ChevronBackOutline,
  ChevronForwardOutline,
  ContractOutline,
  DocumentTextOutline,
  DownloadOutline,
  ExpandOutline,
  PrintOutline,
  RemoveOutline,
  WarningOutline
} from '@vicons/ionicons5'
import type {FileInfoDTO} from '@/types/minIO/file'
import {getDefaultFileInfoDTO} from '@/types/minIO/file'
import type {FilePreviewTypeString} from '@/types/filePreview'
import Icon from '@/components/common/Icon.vue'
import {getDiscreteApi} from '@/utils/naiveUIHelper'

const VueOfficePdf = defineAsyncComponent(() => import('@vue-office/pdf'))
const VueOfficeDocx = defineAsyncComponent(() => import('@vue-office/docx'))
const VueOfficeExcel = defineAsyncComponent(() => import('@vue-office/excel'))
const VueOfficePptx = defineAsyncComponent(() => import('@vue-office/pptx'))

const {message} = getDiscreteApi()
const {t} = useI18n()
const router = useRouter()
const route = useRoute()
const menuStore = useMenuStore()

// 响应式数据
const loading = ref(true)
const error = ref<string | null>(null)
const isFullscreen = ref(false)
const currentPage = ref(1)
const totalPages = ref(0)
const zoom = ref(1)
const textContent = ref('')

// 文件信息
const fileInfo = ref<FileInfoDTO>(getDefaultFileInfoDTO())

// 配置项
const showToolbar = ref(true)
const allowDownload = ref(true)
const allowPrint = ref(true)
const showZoomControls = ref(true)

// 计算属性
const fileType = computed((): FilePreviewTypeString => {
  const contentType = fileInfo.value.contentType?.toLowerCase() || ''
  const extension = fileInfo.value.extension?.toLowerCase() || ''

  // 处理扩展名，移除可能存在的点号
  const cleanExtension = extension.startsWith('.') ? extension.slice(1) : extension

  if (contentType.includes('pdf') || cleanExtension === 'pdf') return 'pdf'
  if (contentType.includes('word') || contentType.includes('docx') || cleanExtension === 'docx') return 'docx'
  if (contentType.includes('excel') || contentType.includes('xlsx') || cleanExtension === 'xlsx') return 'excel'
  if (contentType.includes('presentation') || contentType.includes('pptx') || cleanExtension === 'pptx' || cleanExtension === 'ppt') return 'pptx'
  if (contentType.startsWith('image/')) return 'image'
  if (contentType.startsWith('video/')) return 'video'
  if (contentType.startsWith('audio/')) return 'audio'
  if (contentType.startsWith('text/') || ['txt', 'md', 'json', 'xml', 'html', 'css', 'js'].includes(cleanExtension)) return 'text'

  return 'unsupported'
})

const contentStyle = computed(() => ({
  height: isFullscreen.value ? '100vh' : 'calc(100vh - 60px)',
  width: '100%'
}))

const pdfStyle = computed(() => ({
  width: '100%',
  height: '100%',
  transform: `scale(${zoom.value})`,
  transformOrigin: 'top left'
}))

const docxStyle = computed(() => ({
  width: '100%',
  height: '100%',
  transform: `scale(${zoom.value})`,
  transformOrigin: 'top left'
}))

const excelStyle = computed(() => ({
  width: '100%',
  height: '100%',
  transform: `scale(${zoom.value})`,
  transformOrigin: 'top left'
}))

const pptxStyle = computed(() => ({
  width: '100%',
  height: '100%',
  transform: `scale(${zoom.value})`,
  transformOrigin: 'top left'
}))

const imageStyle = computed(() => ({
  maxWidth: '100%',
  maxHeight: '100%',
  objectFit: 'contain' as const,
  transform: `scale(${zoom.value})`,
  transformOrigin: 'center'
}))

const videoStyle = computed(() => ({
  width: '100%',
  height: '100%',
  objectFit: 'contain' as const
}))

const audioStyle = computed(() => ({
  width: '100%',
  maxWidth: '600px'
}))

const textStyle = computed(() => ({
  width: '100%',
  height: '100%',
  overflow: 'auto',
  padding: '16px',
  fontSize: '14px',
  lineHeight: '1.6',
  whiteSpace: 'pre-wrap',
  wordBreak: 'break-word' as const
}))

// 事件处理函数
const handleBack = () => {
  // 检查是否有来源页面信息
  const fromPage = route.query.from as string
  const chapterId = route.query.chapterId as string
  const courseId = route.query.courseId as string

  if (fromPage && courseId) {
    // 如果有来源页面信息，直接跳转到指定页面
    if (fromPage === 'ChapterControl' && chapterId) {
      // 返回到章节控制页面并保持选中的章节
      router.push({
        name: 'ChapterControl',
        params: {courseId},
        query: {chapterId}
      })
    } else if (fromPage === 'ChapterDetail' && chapterId) {
      // 返回到章节详情页面
      router.push({
        name: 'CourseChapters',
        params: {courseId},
        query: {chapterId}
      })
    } else {
      // 其他情况使用默认返回
      router.back()
    }
  } else {
    // 没有来源信息时使用默认返回
    router.back()
  }
}

const handleDownload = () => {
  const link = document.createElement('a')
  link.href = fileInfo.value.url
  link.download = fileInfo.value.fileName
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const handlePrint = () => {
  window.print()
}

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value
  if (isFullscreen.value) {
    document.documentElement.requestFullscreen?.()
  } else {
    document.exitFullscreen?.()
  }
}


const handleZoomIn = () => {
  if (zoom.value < 3) {
    zoom.value = Math.min(3, zoom.value + 0.1)
  }
}

const handleZoomOut = () => {
  if (zoom.value > 0.5) {
    zoom.value = Math.max(0.5, zoom.value - 0.1)
  }
}

const handleResetZoom = () => {
  zoom.value = 1
}

const handlePreviousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const handleNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

const handlePageChange = (page: number) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const handleRetry = () => {
  loading.value = true
  error.value = null
  loadFile()
}

// 文件加载处理
const loadFile = async () => {
  try {
    loading.value = true
    error.value = null

    // 如果是文本文件，加载文本内容
    if (fileType.value === 'text') {
      const response = await fetch(fileInfo.value.url)
      if (!response.ok) {
        throw new Error(t('common.filePreview.errors.networkError'))
      }
      textContent.value = await response.text()
    }

    loading.value = false
  } catch (err) {
    loading.value = false
    error.value = err instanceof Error ? err.message : t('common.filePreview.loadFailed')
    message.error(error.value)
  }
}

// 各种文件类型的加载成功处理
const handlePdfRendered = () => {
  loading.value = false
  totalPages.value = 1 // PDF 总页数需要从组件获取
}

const handleDocxRendered = () => {
  loading.value = false
}

const handleExcelRendered = () => {
  loading.value = false
}

const handlePptxRendered = () => {
  loading.value = false
}

const handleImageLoad = () => {
  loading.value = false
}

const handleVideoLoad = () => {
  loading.value = false
}

const handleAudioLoad = () => {
  loading.value = false
}

// 各种文件类型的错误处理
const handlePdfError = (_err: any) => {
  loading.value = false
  error.value = t('common.filePreview.errors.parseError')
}

const handleDocxError = (_err: any) => {
  loading.value = false
  error.value = t('common.filePreview.errors.parseError')
}

const handleExcelError = (_err: any) => {
  loading.value = false
  error.value = t('common.filePreview.errors.parseError')
}

const handlePptxError = (_err: any) => {
  loading.value = false
  error.value = t('common.filePreview.errors.parseError')
}

const handleImageError = () => {
  loading.value = false
  error.value = t('common.filePreview.errors.fileNotFound')
}

const handleVideoError = () => {
  loading.value = false
  error.value = t('common.filePreview.errors.fileNotFound')
}

const handleAudioError = () => {
  loading.value = false
  error.value = t('common.filePreview.errors.fileNotFound')
}


// 监听全屏状态变化
const handleFullscreenChange = () => {
  isFullscreen.value = !!document.fullscreenElement
}

// 生命周期
onMounted(() => {
  // 添加文件预览菜单项
  const filePreviewMenuOption = createFilePreviewMenuOption(t)
  menuStore.addDynamicMenuItem(filePreviewMenuOption)

  // 从路由参数获取文件信息
  const fileInfoParam = route.query.fileInfo as string
  if (fileInfoParam) {
    try {
      const parsedFileInfo = JSON.parse(fileInfoParam) as FileInfoDTO
      fileInfo.value = parsedFileInfo
      loadFile()
    } catch (err) {
      error.value = t('common.filePreview.errors.parseError')
      loading.value = false
    }
  } else {
    error.value = t('common.filePreview.errors.fileNotFound')
    loading.value = false
  }

  // 监听全屏状态变化
  document.addEventListener('fullscreenchange', handleFullscreenChange)
})

onUnmounted(() => {
  // 移除文件预览菜单项
  menuStore.removeDynamicMenuItem('FilePreview')

  document.removeEventListener('fullscreenchange', handleFullscreenChange)
})

// 监听文件类型变化，调整缩放控制显示
watch(fileType, (newType: FilePreviewTypeString) => {
  showZoomControls.value = ['pdf', 'image', 'docx', 'excel', 'pptx'].includes(newType)
})
</script>

<style lang="scss" scoped>
.file-preview-page {
  display: contents;
}

.file-preview-container {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: var(--n-color);

  &.fullscreen {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: 9999;
    background-color: #000;
  }
}

.file-preview-toolbar {
  height: 60px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: var(--n-color);
  border-bottom: 1px solid var(--n-border-color);
  flex-shrink: 0;

  .toolbar-left {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    min-width: 0;

    .file-name {
      font-weight: 500;
      max-width: 300px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .toolbar-center {
    display: flex;
    align-items: center;
    justify-content: center;
    flex: 1;

    .page-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }

  .toolbar-right {
    display: flex;
    align-items: center;
    gap: 12px;
    flex: 1;
    justify-content: flex-end;

    .zoom-controls {
      display: flex;
      align-items: center;
      gap: 8px;
    }
  }
}

.file-preview-content {
  flex: 1;
  overflow: hidden;
  position: relative;

  .loading-container,
  .error-container,
  .unsupported-container {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .preview-content {
    height: 100%;
    width: 100%;
    overflow: auto;

    .image-preview,
    .video-preview,
    .audio-preview {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 16px;
    }

    .text-preview {
      height: 100%;
      overflow: auto;
    }
  }
}


// 响应式设计
@media (max-width: 768px) {
  .file-preview-toolbar {
    padding: 0 8px;

    .toolbar-left {
      .file-name {
        max-width: 150px;
      }
    }

    .toolbar-center {
      display: none;
    }

    .toolbar-right {
      .zoom-controls {
        display: none;
      }
    }
  }
}
</style>
