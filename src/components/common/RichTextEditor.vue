<template>
  <div ref="editorContainerRef" :class="{ 'fullscreen': isFullscreen }" class="rich-text-editor">
    <n-card class="editor-card">
      <!-- 工具栏 -->
      <div class="editor-toolbar">
        <n-button-group>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button
                  :type="editor.isActive('bold') ? 'primary' : 'default'"
                  @click="editor.chain().focus().toggleBold().run()"
              >
                <Icon :component="BoldOutlined"/>
              </n-button>
            </template>
            {{ t('common.richTextEditor.toolbar.bold') }}
          </n-tooltip>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button
                  :type="editor.isActive('italic') ? 'primary' : 'default'"
                  @click="editor.chain().focus().toggleItalic().run()"
              >
                <Icon :component="ItalicOutlined"/>
              </n-button>
            </template>
            {{ t('common.richTextEditor.toolbar.italic') }}
          </n-tooltip>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button
                  :type="editor.isActive('underline') ? 'primary' : 'default'"
                  @click="editor.chain().focus().toggleUnderline().run()"
              >
                <Icon :component="UnderlineOutlined"/>
              </n-button>
            </template>
            {{ t('common.richTextEditor.toolbar.underline') }}
          </n-tooltip>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button
                  :type="editor.isActive('strike') ? 'primary' : 'default'"
                  @click="editor.chain().focus().toggleStrike().run()"
              >
                <Icon :component="StrikethroughOutlined"/>
              </n-button>
            </template>
            {{ t('common.richTextEditor.toolbar.strikethrough') }}
          </n-tooltip>
        </n-button-group>

        <n-divider vertical/>

        <n-button-group>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button
                  :type="editor.isActive({ textAlign: 'left' }) ? 'primary' : 'default'"
                  @click="editor.chain().focus().setTextAlign('left').run()"
              >
                <Icon :component="AlignLeftOutlined"/>
              </n-button>
            </template>
            {{ t('common.richTextEditor.toolbar.alignLeft') }}
          </n-tooltip>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button
                  :type="editor.isActive({ textAlign: 'center' }) ? 'primary' : 'default'"
                  @click="editor.chain().focus().setTextAlign('center').run()"
              >
                <Icon :component="AlignCenterOutlined"/>
              </n-button>
            </template>
            {{ t('common.richTextEditor.toolbar.alignCenter') }}
          </n-tooltip>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button
                  :type="editor.isActive({ textAlign: 'right' }) ? 'primary' : 'default'"
                  @click="editor.chain().focus().setTextAlign('right').run()"
              >
                <Icon :component="AlignRightOutlined"/>
              </n-button>
            </template>
            {{ t('common.richTextEditor.toolbar.alignRight') }}
          </n-tooltip>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button
                  :type="editor.isActive({ textAlign: 'justify' }) ? 'primary' : 'default'"
                  @click="editor.chain().focus().setTextAlign('justify').run()"
              >
                <Icon :component="AlignRightOutlined"/>
              </n-button>
            </template>
            {{ t('common.richTextEditor.toolbar.alignJustify') }}
          </n-tooltip>
        </n-button-group>

        <n-divider vertical/>

        <n-button-group>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button
                  :type="editor.isActive('bulletList') ? 'primary' : 'default'"
                  @click="editor.chain().focus().toggleBulletList().run()"
              >
                <Icon :component="UnorderedListOutlined"/>
              </n-button>
            </template>
            {{ t('common.richTextEditor.toolbar.bulletList') }}
          </n-tooltip>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button
                  :type="editor.isActive('orderedList') ? 'primary' : 'default'"
                  @click="editor.chain().focus().toggleOrderedList().run()"
              >
                <Icon :component="OrderedListOutlined"/>
              </n-button>
            </template>
            {{ t('common.richTextEditor.toolbar.orderedList') }}
          </n-tooltip>
        </n-button-group>

        <n-divider vertical/>

        <n-button-group>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button
                  :type="editor.isActive('blockquote') ? 'primary' : 'default'"
                  @click="editor.chain().focus().toggleBlockquote().run()"
              >
                <Icon :component="CodeOutlined"/>
              </n-button>
            </template>
            {{ t('common.richTextEditor.toolbar.blockquote') }}
          </n-tooltip>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button
                  :type="editor.isActive('codeBlock') ? 'primary' : 'default'"
                  @click="editor.chain().focus().toggleCodeBlock().run()"
              >
                <Icon :component="CodeOutlined"/>
              </n-button>
            </template>
            {{ t('common.richTextEditor.toolbar.codeBlock') }}
          </n-tooltip>
        </n-button-group>

        <n-divider vertical/>

        <n-button-group>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button
                  :type="editor.isActive('link') ? 'primary' : 'default'"
                  @click="setLink"
              >
                <Icon :component="LinkOutlined"/>
              </n-button>
            </template>
            {{ t('common.richTextEditor.toolbar.addLink') }}
          </n-tooltip>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button
                  :disabled="isUploading"
                  :loading="isUploading"
                  @click="addImage"
              >
                <Icon :component="PictureOutlined"/>
              </n-button>
            </template>
            {{
            isUploading ? t('common.richTextEditor.upload.uploading') : t('common.richTextEditor.toolbar.insertImage')
            }}
          </n-tooltip>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button
                  :disabled="isVideoUploading"
                  :loading="isVideoUploading"
                  @click="addVideo"
              >
                <Icon :component="VideoCameraOutlined"/>
              </n-button>
            </template>
            {{
            isVideoUploading ? t('common.richTextEditor.upload.uploading') :
            t('common.richTextEditor.toolbar.insertVideo')
            }}
          </n-tooltip>
        </n-button-group>

        <n-divider vertical/>

        <n-button-group>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button
                  :type="editor.isActive('table') ? 'primary' : 'default'"
                  @click="editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()"
              >
                <Icon :component="TableOutlined"/>
              </n-button>
            </template>
            {{ t('common.richTextEditor.toolbar.insertTable') }}
          </n-tooltip>
        </n-button-group>

        <div class="toolbar-spacer"></div>

        <n-button-group>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button
                  :type="isFullscreen ? 'primary' : 'default'"
                  @click="toggleFullscreen"
              >
                <Icon :component="isFullscreen ? FullscreenExitOutlined : FullscreenOutlined"/>
              </n-button>
            </template>
            {{
            isFullscreen ? t('common.richTextEditor.toolbar.exitFullscreen') :
            t('common.richTextEditor.toolbar.fullscreen')
            }}
          </n-tooltip>
        </n-button-group>
      </div>

      <!-- 编辑器内容区域 -->
      <div class="editor-content">
        <editor-content :editor="editor"/>
      </div>
    </n-card>

    <!-- 隐藏的文件输入 -->
    <input
        ref="fileInputRef"
        accept="image/*"
        style="display: none"
        type="file"
        @change="handleFileSelect"
    />
    <!-- 隐藏的视频文件输入 -->
    <input
        ref="videoInputRef"
        accept="video/*"
        style="display: none"
        type="file"
        @change="handleVideoSelect"
    />
  </div>
</template>

<script lang="ts" setup>
import {onBeforeUnmount, onMounted, ref, watch} from 'vue'
import {Editor, EditorContent} from '@tiptap/vue-3'
import {Node} from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import {TextStyle} from '@tiptap/extension-text-style'
import {Color} from '@tiptap/extension-color'
import {TextAlign} from '@tiptap/extension-text-align'
import {Image} from '@tiptap/extension-image'
import {Table} from '@tiptap/extension-table'
import {TableRow} from '@tiptap/extension-table-row'
import {TableCell} from '@tiptap/extension-table-cell'
import {TableHeader} from '@tiptap/extension-table-header'
import {
  AlignCenterOutlined,
  AlignLeftOutlined,
  AlignRightOutlined,
  BoldOutlined,
  CodeOutlined,
  FullscreenExitOutlined,
  FullscreenOutlined,
  ItalicOutlined,
  LinkOutlined,
  OrderedListOutlined,
  PictureOutlined,
  StrikethroughOutlined,
  TableOutlined,
  UnderlineOutlined,
  UnorderedListOutlined,
  VideoCameraOutlined
} from '@vicons/antd'
import {uploadFile} from '@/api/minIO'
import Icon from '@/components/common/Icon.vue'
import {getDiscreteApi} from '@/utils/naiveUIHelper'
import {useI18n} from 'vue-i18n'
import {BusinessBucketCodeEnum} from '@/enum/minIO'
import type {BusinessBucketCode} from '@/types/minIO'

// 自定义Video扩展
const Video = Node.create({
  name: 'video',
  group: 'block',
  atom: true,
  addAttributes() {
    return {
      src: {
        default: null,
      },
      width: {
        default: '100%',
      },
      height: {
        default: 'auto',
      },
      controls: {
        default: true,
      },
    }
  },
  parseHTML() {
    return [
      {
        tag: 'video',
      },
    ]
  },
  renderHTML({HTMLAttributes}: { HTMLAttributes: Record<string, any> }) {
    return ['video', HTMLAttributes]
  },
  addCommands() {
    return {
      setVideo: (options: Record<string, any>) => ({commands}: { commands: any }) => {
        return commands.insertContent({
          type: this.name,
          attrs: options,
        })
      },
    } as any
  },
})

// Props
interface Props {
  modelValue?: string
  placeholder?: string
  minHeight?: string
  maxHeight?: string
  uploadPath?: string
  enableImage?: boolean
  enableVideo?: boolean
  enableTable?: boolean
  enableLink?: boolean
  bucketCode?: BusinessBucketCode
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  placeholder: '',
  minHeight: '300px',
  maxHeight: '600px',
  uploadPath: 'course-content',
  enableImage: true,
  enableVideo: true,
  enableTable: true,
  enableLink: true,
  bucketCode: BusinessBucketCodeEnum.COURSE_PUBLIC
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
  'image-upload': [url: string]
  'video-upload': [url: string]
}>()

const {message} = getDiscreteApi()
const {t} = useI18n()

// 文件上传相关
const fileInputRef = ref<HTMLInputElement>()
const videoInputRef = ref<HTMLInputElement>()
const isUploading = ref(false)
const isVideoUploading = ref(false)

// 全屏相关
const isFullscreen = ref(false)
const editorContainerRef = ref<HTMLElement>()

// Tiptap 编辑器配置
const editor = new Editor({
  content: props.modelValue,
  extensions: [
    StarterKit.configure({
      // 配置 StarterKit 中的扩展
      link: {
        openOnClick: false,
        HTMLAttributes: {
          class: 'editor-link',
        },
      },
    }),
    TextStyle,
    Color,
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
    Image.configure({
      HTMLAttributes: {
        class: 'editor-image',
      },
    }),
    Video,
    Table.configure({
      resizable: true,
    }),
    TableRow,
    TableHeader,
    TableCell,
  ],
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none',
      placeholder: props.placeholder || t('common.richTextEditor.placeholder'),
    },
  },
  onUpdate: ({editor}) => {
    const html = editor.getHTML()
    emit('update:modelValue', html)
    emit('change', html)
  },
})

// 监听外部值变化
watch(() => props.modelValue, (newValue) => {
  if (newValue !== editor.getHTML()) {
    editor.commands.setContent(newValue)
  }
})

// 编辑器方法
const setLink = () => {
  if (!props.enableLink) return

  const previousUrl = editor.getAttributes('link').href
  const url = window.prompt(t('common.richTextEditor.link.prompt'), previousUrl)

  // 取消
  if (url === null) {
    return
  }

  // 清空链接
  if (url === '') {
    editor.chain().focus().extendMarkRange('link').unsetLink().run()
    return
  }

  // 设置链接
  editor.chain().focus().extendMarkRange('link').setLink({href: url}).run()
}

const addImage = () => {
  if (!props.enableImage) return
  // 触发文件选择
  fileInputRef.value?.click()
}

// 处理文件选择
const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    message.error(t('common.richTextEditor.upload.imageTypeError'))
    return
  }

  // 验证文件大小 (限制为10MB)
  const maxSize = 10 * 1024 * 1024
  if (file.size > maxSize) {
    message.error(t('common.richTextEditor.upload.imageSizeError'))
    return
  }

  try {
    isUploading.value = true
    message.loading(t('common.richTextEditor.upload.imageUploading'), {duration: 0})

    // 上传到MinIO
    const response = await uploadFile(file, {
      directory: props.uploadPath,
      bucketCode: props.bucketCode
    })

    if (response.data && response.data.url) {
      // 插入图片到编辑器
      editor.chain().focus().setImage({src: response.data.url}).run()
      emit('image-upload', response.data.url)
      message.destroyAll()
      message.success(t('common.richTextEditor.upload.imageUploadSuccess'))
    } else {
      throw new Error(t('common.richTextEditor.upload.uploadResponseError'))
    }
  } catch (error) {
    console.error('图片上传失败:', error)
    message.destroyAll()
    message.error(t('common.richTextEditor.upload.imageUploadFail'))
  } finally {
    isUploading.value = false
    // 清空文件输入
    if (target) {
      target.value = ''
    }
  }
}

const addVideo = () => {
  if (!props.enableVideo) return
  // 触发视频文件选择
  videoInputRef.value?.click()
}

// 处理视频文件选择
const handleVideoSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // 验证文件类型
  if (!file.type.startsWith('video/')) {
    message.error(t('common.richTextEditor.upload.videoTypeError'))
    return
  }

  // 验证文件大小 (限制为100MB)
  const maxSize = 100 * 1024 * 1024
  if (file.size > maxSize) {
    message.error(t('common.richTextEditor.upload.videoSizeError'))
    return
  }

  try {
    isVideoUploading.value = true
    message.loading(t('common.richTextEditor.upload.videoUploading'), {duration: 0})

    // 上传到MinIO
    const response = await uploadFile(file, {
      directory: props.uploadPath,
      bucketCode: props.bucketCode
    })

    if (response.data && response.data.url) {
      // 插入视频到编辑器
      insertVideoFromUrl(response.data.url)
      emit('video-upload', response.data.url)
      message.destroyAll()
      message.success(t('common.richTextEditor.upload.videoUploadSuccess'))
    } else {
      throw new Error(t('common.richTextEditor.upload.uploadResponseError'))
    }
  } catch (error) {
    console.error('视频上传失败:', error)
    message.destroyAll()
    message.error(t('common.richTextEditor.upload.videoUploadFail'))
  } finally {
    isVideoUploading.value = false
    // 清空文件输入
    if (target) {
      target.value = ''
    }
  }
}

// 插入视频到编辑器
const insertVideoFromUrl = (url: string) => {
  // 使用Tiptap的Video节点插入视频
  editor.chain().focus().insertContent({
    type: 'video',
    attrs: {
      src: url,
      width: '100%',
      height: 'auto',
      controls: true
    }
  }).run()
}

// 全屏切换功能
const toggleFullscreen = () => {
  if (!isFullscreen.value) {
    enterFullscreen()
  } else {
    exitFullscreen()
  }
}

const enterFullscreen = () => {
  const element = editorContainerRef.value
  if (!element) return

  if (element.requestFullscreen) {
    element.requestFullscreen()
  } else if ((element as any).webkitRequestFullscreen) {
    (element as any).webkitRequestFullscreen()
  } else if ((element as any).msRequestFullscreen) {
    (element as any).msRequestFullscreen()
  }
}

const exitFullscreen = () => {
  if (document.exitFullscreen) {
    document.exitFullscreen()
  } else if ((document as any).webkitExitFullscreen) {
    (document as any).webkitExitFullscreen()
  } else if ((document as any).msExitFullscreen) {
    (document as any).msExitFullscreen()
  }
}

// 监听全屏状态变化
const handleFullscreenChange = () => {
  const isCurrentlyFullscreen = !!(
      document.fullscreenElement ||
      (document as any).webkitFullscreenElement ||
      (document as any).msFullscreenElement
  )
  isFullscreen.value = isCurrentlyFullscreen
}

// 键盘快捷键处理
const handleKeydown = (event: KeyboardEvent) => {
  // F11 键切换全屏
  if (event.key === 'F11') {
    event.preventDefault()
    toggleFullscreen()
  }
  // Esc 键退出全屏
  if (event.key === 'Escape' && isFullscreen.value) {
    exitFullscreen()
  }
}

// 暴露编辑器实例
defineExpose({
  editor,
  getContent: () => editor.getHTML(),
  setContent: (content: string) => editor.commands.setContent(content),
  clear: () => editor.commands.clearContent(),
  focus: () => editor.commands.focus(),
})

// 生命周期
onMounted(() => {
  // 初始化内容
  if (props.modelValue) {
    editor.commands.setContent(props.modelValue)
  }

  // 添加全屏状态监听
  document.addEventListener('fullscreenchange', handleFullscreenChange)
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.addEventListener('msfullscreenchange', handleFullscreenChange)

  // 添加键盘事件监听
  document.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  editor.destroy()

  // 移除事件监听
  document.removeEventListener('fullscreenchange', handleFullscreenChange)
  document.removeEventListener('webkitfullscreenchange', handleFullscreenChange)
  document.removeEventListener('msfullscreenchange', handleFullscreenChange)
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<style lang="scss" scoped>
.rich-text-editor {
  width: 100%;
}

.editor-card {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.editor-toolbar {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px;
  border-bottom: 1px solid var(--n-border-color);
  background-color: var(--n-color);
  flex-wrap: wrap;

  .toolbar-spacer {
    flex: 1;
    min-width: 0;
  }
}

.editor-content {
  flex: 1;
  padding: 16px;
  min-height: v-bind(minHeight);
  max-height: v-bind(maxHeight);
  overflow-y: auto;

  // 隐藏滚动条
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

// Tiptap 编辑器样式
:deep(.ProseMirror) {
  outline: none;
  min-height: 300px;
  padding: 16px;
  border: 1px solid var(--n-border-color);
  border-radius: 6px;
  background-color: var(--n-color);

  p {
    margin: 0.5em 0;
    line-height: 1.6;
  }

  h1, h2, h3, h4, h5, h6 {
    margin: 1em 0 0.5em 0;
    font-weight: 600;
    line-height: 1.3;
  }

  h1 {
    font-size: 1.5em;
  }

  h2 {
    font-size: 1.3em;
  }

  h3 {
    font-size: 1.1em;
  }

  ul, ol {
    padding-left: 1.5em;
    margin: 0.5em 0;
  }

  li {
    margin: 0.2em 0;
  }

  blockquote {
    border-left: 4px solid var(--n-color-focus);
    padding-left: 1em;
    margin: 1em 0;
    color: var(--n-text-color-disabled);
    font-style: italic;
  }

  code {
    background-color: var(--n-color-focus);
    padding: 0.2em 0.4em;
    border-radius: 3px;
    font-family: 'Courier New', monospace;
    font-size: 0.9em;
  }

  pre {
    background-color: var(--n-color-focus);
    padding: 1em;
    border-radius: 6px;
    overflow-x: auto;
    margin: 1em 0;

    code {
      background: none;
      padding: 0;
    }
  }

  a {
    color: var(--n-color-primary);
    text-decoration: underline;

    &:hover {
      color: var(--n-color-primary-hover);
    }
  }

  img {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    margin: 0.5em 0;
  }

  table {
    border-collapse: collapse;
    margin: 1em 0;
    width: 100%;

    th, td {
      border: 1px solid var(--n-border-color);
      padding: 8px 12px;
      text-align: left;
    }

    th {
      background-color: var(--n-color-focus);
      font-weight: 600;
    }

    tr:nth-child(even) {
      background-color: var(--n-color-focus);
    }
  }

  .editor-link {
    color: var(--n-color-primary);
    text-decoration: underline;
    cursor: pointer;

    &:hover {
      color: var(--n-color-primary-hover);
    }
  }

  .editor-image {
    max-width: 100%;
    height: auto;
    border-radius: 4px;
    margin: 0.5em 0;
  }
}

// 工具栏按钮样式
:deep(.n-button-group .n-button) {
  border-radius: 4px;

  &.n-button--primary-type {
    background-color: var(--n-color-primary-hover);
    border-color: var(--n-color-primary);
    color: var(--n-color-primary);

    .n-icon {
      color: var(--n-color-primary);
    }
  }
}


// 全屏样式
.rich-text-editor.fullscreen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  z-index: 9999;
  background-color: var(--n-color);

  .editor-card {
    height: 100vh;
    border-radius: 0;
    box-shadow: none;
  }

  .editor-toolbar {
    position: sticky;
    top: 0;
    z-index: 10000;
    background-color: var(--n-color);
    border-bottom: 2px solid var(--n-border-color);
  }

  .editor-content {
    height: calc(100vh - 80px); // 减去工具栏高度
    max-height: none;
    overflow-y: auto;
  }

  :deep(.ProseMirror) {
    min-height: calc(100vh - 120px); // 减去工具栏和padding
    max-height: none;
  }
}
</style>
