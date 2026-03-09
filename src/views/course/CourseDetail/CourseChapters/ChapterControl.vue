<template>
  <div class="chapter-control">
    <!-- 页面头部 -->
    <div class="page-header">
      <!-- 面包屑导航 -->
      <CourseBreadcrumb
          :course-info="courseInfo"
          :current-page="t('course.chapters.chapterManagement')"
      />

      <!-- 返回按钮 -->
      <n-button
          class="back-button"
          ghost
          type="primary"
          @click="handleBack"
      >
        <template #icon>
          <Icon :component="ArrowBackOutline"/>
        </template>
        {{ t('common.back') }}
      </n-button>
    </div>

    <!-- 章节编辑区域 -->
    <div class="chapter-edit-container">
      <!-- 左侧30% - 章节信息区域 -->
      <div class="chapter-info-panel">
        <n-card class="info-card">
          <!-- 标签栏 -->
          <n-tabs v-model:value="activeTab" type="line">
            <n-tab-pane :tab="t('course.chapters.published')" name="published">
              <div class="chapter-tree-container">
                <n-spin :show="loading">
                  <div v-if="publishedChapterTree.length === 0 && !loading" class="empty-state">
                    <n-empty :description="t('course.chapters.publishedChapters')">
                      <template #icon>
                        <Icon :component="BookOutline"/>
                      </template>
                    </n-empty>
                  </div>
                  <div v-else class="chapter-tree">
                    <n-tree
                        :block-line="true"
                        :children-field="'children'"
                        :data="publishedChapterTree"
                        :default-expand-all="true"
                        :item-size="32"
                        :key-field="'id'"
                        :label-field="'chapterName'"
                        :selectable="true"
                        :selected-keys="currentEditingChapter ? [currentEditingChapter.id] : []"
                        :virtual-scroll="true"
                        @update:selected-keys="handlePublishedChapterSelect"
                    />
                  </div>
                </n-spin>
              </div>
            </n-tab-pane>
            <n-tab-pane :tab="t('course.chapters.draft')" name="draft">
              <div class="chapter-list">
                <n-spin :show="loading">
                  <div class="chapter-items">
                    <!-- 添加章节选项 - 始终显示 -->
                    <div class="add-chapter-item" @click="handleAddChapter">
                      <div class="add-chapter-content">
                        <div class="add-icon">
                          <Icon :component="AddOutline" size="20"/>
                        </div>
                        <span class="add-text">{{ t('course.chapters.addChapter') }}</span>
                      </div>
                    </div>

                    <!-- 空状态 - 只在没有草稿章节且不在加载时显示 -->
                    <div v-if="draftChapters.length === 0 && !loading" class="empty-state">
                      <n-empty :description="t('course.chapters.draftChapters')">
                        <template #icon>
                          <Icon :component="BookOutline"/>
                        </template>
                      </n-empty>
                    </div>

                    <!-- 草稿章节列表 -->
                    <div
                        v-for="chapter in draftChapters"
                        :key="chapter.id"
                        :class="{ 'selected': currentEditingChapter?.id === chapter.id }"
                        class="chapter-item"
                        @click="handleChapterClick(chapter)"
                    >
                      <div class="chapter-info">
                        <h4 class="chapter-title">{{ chapter.chapterName }}</h4>
                        <p v-if="chapter.description" class="chapter-description">{{ chapter.description }}</p>
                        <div class="chapter-meta">
                          <span class="update-time">{{ chapter.updateTime }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </n-spin>
              </div>
            </n-tab-pane>
          </n-tabs>
        </n-card>
      </div>

      <!-- 右侧70% - 章节编辑表单区域 -->
      <div class="chapter-editor-panel">
        <n-card class="editor-card">
          <div class="form-content">
            <n-form
                ref="formRef"
                :model="chapterForm"
                :rules="formRules"
                label-placement="left"
                label-width="auto"
                require-mark-placement="right-hanging"
            >
              <n-grid :cols="24" :x-gap="16">
                <!-- 章节名称和排序权重 -->
                <n-form-item-grid-item :label="t('course.chapters.form.chapterName')" :span="12" path="chapterName">
                  <n-input
                      v-model:value="chapterForm.chapterName"
                      :placeholder="t('course.chapters.form.chapterNamePlaceholder')"
                      clearable
                  />
                </n-form-item-grid-item>

                <n-form-item-grid-item :label="t('course.chapters.form.sortOrder')" :span="18" path="sortOrder">
                  <n-input-number
                      v-model:value="chapterForm.sortOrder"
                      :max="9999"
                      :min="0"
                      :placeholder="t('course.chapters.form.sortOrderPlaceholder')"
                      :precision="0"
                      class="w-full"
                  />
                </n-form-item-grid-item>

                <!-- 父章节选择 -->
                <n-form-item-grid-item :label="t('course.chapters.form.parentChapterId')" :span="24"
                                       path="parentChapterId">
                  <n-tree-select
                      v-model:value="chapterForm.parentChapterId"
                      :cascade="false"
                      :children-field="'children'"
                      :key-field="'value'"
                      :label-field="'label'"
                      :options="parentChapterTreeOptions"
                      :placeholder="t('course.chapters.form.parentChapterIdPlaceholder')"
                      :show-path="true"
                      clearable
                      filterable
                  />
                </n-form-item-grid-item>

                <!-- 章节描述 -->
                <n-form-item-grid-item :label="t('course.chapters.form.description')" :span="24" path="description">
                  <n-input
                      v-model:value="chapterForm.description"
                      :placeholder="t('course.chapters.form.descriptionPlaceholder')"
                      :rows="3"
                      clearable
                      type="textarea"
                  />
                </n-form-item-grid-item>


                <!-- 章节内容标题 -->
                <n-form-item-grid-item :span="24">
                  <div class="section-title">
                    <h3>{{ t('course.chapters.form.content') }}</h3>
                  </div>
                </n-form-item-grid-item>

                <!-- 章节内容 -->
                <n-form-item-grid-item :span="24">
                  <RichTextEditor
                      v-model="chapterForm.content!"
                      :bucket-code="courseBucketCode"
                      :placeholder="t('course.chapters.form.contentPlaceholder')"
                      upload-path="course-chapters"
                      @change="handleContentChange"
                  />
                </n-form-item-grid-item>

                <!-- 章节附件 -->
                <n-form-item-grid-item :label="t('course.chapters.form.attachments')" :span="24">
                  <FileUpload
                      v-model="attachmentFiles"
                      :bucket-code="courseBucketCode"
                      :max-file-count="10"
                      :max-file-size="50 * 1024 * 1024"
                      :multiple="true"
                      :show-delete-button="true"
                      :show-download-button="true"
                      :show-file-list="true"
                      :show-preview-button="true"
                      :upload-hint="t('course.chapters.form.attachmentsDescription')"
                      :upload-text="t('course.chapters.form.attachmentsPlaceholder')"
                      upload-dir="course-chapters"
                      @file-change="handleAttachmentChange"
                      @upload-success="handleAttachmentUploadSuccess"
                      @upload-error="handleAttachmentUploadError"
                      @urls-updated="handleUrlsUpdated"
                  />
                </n-form-item-grid-item>

                <!-- 文件详细信息展示 -->
                <n-form-item-grid-item v-if="fileInfoList.length > 0" :span="24" label="附件列表">
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

                          <template #suffix>
                            <n-button
                                class="delete-button"
                                quaternary
                                size="small"
                                type="error"
                                @click.stop="handleDeleteAttachment(fileInfo)"
                            >
                              <template #icon>
                                <Icon :component="TrashOutline" size="16"/>
                              </template>
                            </n-button>
                          </template>
                        </n-list-item>
                      </n-list>
                    </n-spin>
                  </div>
                </n-form-item-grid-item>
              </n-grid>
            </n-form>
          </div>

          <!-- 操作按钮 - 放回card中并居中 -->
          <div class="form-actions">
            <n-space justify="space-between">
              <!-- 左侧删除按钮 -->
              <div>
                <n-button
                    v-if="isEditMode"
                    :loading="saving"
                    type="error"
                    @click="handleDeleteChapter"
                >
                  {{ t('course.chapters.deleteChapter') }}
                </n-button>
              </div>

              <!-- 右侧其他按钮 -->
              <n-space>
                <n-button v-if="isEditMode" type="default" @click="handleCancelEdit">
                  {{ t('course.chapters.cancelEdit') }}
                </n-button>
                <n-button v-if="!isEditMode" :loading="saving" type="info" @click="handleSaveDraft">
                  {{ t('course.chapters.saveDraft') }}
                </n-button>
                <n-button :loading="saving" type="primary" @click="handleSave">
                  {{ isEditMode ? t('course.chapters.updateChapter') : t('course.chapters.publish') }}
                </n-button>
              </n-space>
            </n-space>
          </div>
        </n-card>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref, watch} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useTitle} from '@/utils/titleUtil'
import {
  AddOutline,
  ArchiveOutline,
  ArrowBackOutline,
  BookOutline,
  DocumentTextOutline,
  FolderOutline,
  ImageOutline,
  MusicalNotesOutline,
  TrashOutline,
  VideocamOutline
} from '@vicons/ionicons5'
import * as CourseChapterApi from '@/api/course/courseChapter'
import {getDefaultCourseChapterDTO} from '@/api/course/courseChapter'
import * as MinIOApi from '@/api/minIO'
import {BusinessBucketCodeEnum} from '@/enum/minIO'
import {ChapterStatusEnum} from '@/enum/course/chapterStatusEnum'
import {CoursePublicEnum} from '@/enum/course'
import type {CourseChapterAddDTO, CourseChapterDTO, CourseChapterVO} from '@/types/course/courseChapter'
import type {FileInfoDTO} from '@/types/minIO/file'
import CourseBreadcrumb from '../../components/CourseBreadcrumb/CourseBreadcrumb.vue'
import Icon from '@/components/common/Icon.vue'
import RichTextEditor from '@/components/common/RichTextEditor.vue'
import FileUpload from '@/components/common/FileUpload.vue'
import {getDiscreteApi} from '@/utils/naiveUIHelper'
import {useUserStore} from '@/store/modules/user'
import {useCourseStore} from '@/store'
import {useTransitionStore} from '@/store/modules/transition'
import {runViewTransition} from '@/utils/themeAnimation'

const {message} = getDiscreteApi()
const {t} = useI18n()
const route = useRoute()
const router = useRouter()
const {setTitle} = useTitle()
const userStore = useUserStore()
const courseStore = useCourseStore()
const transitionStore = useTransitionStore()

// 响应式数据
const courseInfo = computed(() => courseStore.currentCourseInfo)

// 根据课程是否公开决定使用的桶
const courseBucketCode = computed(() => {
  return courseInfo.value?.isPublic === CoursePublicEnum.PUBLIC
      ? BusinessBucketCodeEnum.COURSE_PUBLIC
      : BusinessBucketCodeEnum.COURSE_PRIVATE
})

const allChapters = ref<CourseChapterVO[]>([]) // 存储所有章节数据（扁平化）
const originalChapterTree = ref<CourseChapterVO[]>([]) // 存储原始树形数据
const draftChapters = ref<CourseChapterVO[]>([]) // 草稿章节（从allChapters过滤）
const publishedChapterTree = ref<CourseChapterVO[]>([]) // 已发布章节树（从原始树形数据过滤）
const loading = ref(false)
const saving = ref(false)
const formRef = ref()
const isEditMode = ref(false) // 是否为编辑模式
const currentEditingChapter = ref<CourseChapterVO | null>(null) // 当前正在编辑的章节
const activeTab = ref('published') // 当前激活的标签页
const attachmentFiles = ref<any[]>([]) // 附件文件列表
const fileInfoList = ref<FileInfoDTO[]>([]) // 文件详细信息列表
const loadingFileInfo = ref(false) // 加载文件信息状态

// 章节表单数据
const chapterForm = ref<CourseChapterDTO>(getDefaultCourseChapterDTO())


// 父章节选项（树形结构）
const parentChapterTreeOptions = ref<Array<{
  label: string;
  value: string;
  children?: Array<{ label: string; value: string }>
}>>([])

// 表单验证规则
const formRules = {
  chapterName: [
    {required: true, message: t('course.chapters.validation.chapterNameRequired'), trigger: 'blur'},
    {min: 1, max: 100, message: t('course.chapters.validation.chapterNameLength'), trigger: 'blur'}
  ],
  description: [
    {max: 500, message: t('course.chapters.validation.descriptionLength'), trigger: 'blur'}
  ],
  sortOrder: [
    {type: 'number', min: 0, max: 9999, message: t('course.chapters.validation.sortOrderRange'), trigger: 'blur'}
  ]
}

// 计算属性
const courseId = computed(() => route.params.courseId as string)
const editChapterId = computed(() => route.query.chapterId as string)

// 监听标签页切换，重新初始化附件相关字段
watch(activeTab, () => {
  // 清空附件相关字段
  chapterForm.value.attachmentUrls = null
  attachmentFiles.value = []
  fileInfoList.value = []

  // 重置当前编辑章节
  currentEditingChapter.value = null
  isEditMode.value = false

  // 重置表单
  resetForm()
})

// 设置动态标题
const setCourseChapterControlTitle = () => {
  if (courseInfo.value?.courseName) {
    // 设置动态标题：课程名称 - 章节管理
    const courseChapterControlTitle = t('course.chapters.chapterManagement')
    setTitle('courseChapterControl', `${courseInfo.value.courseName} - ${courseChapterControlTitle}`)
  } else {
    // 如果课程信息还未加载，使用默认标题
    setTitle('courseChapterControl')
  }
}

// 加载课程信息
const loadCourseInfo = async () => {
  if (!courseId.value || courseId.value === 'undefined') {
    router.push('/course')
    return
  }

  await courseStore.setCurrentCourseId(courseId.value, true)
  // 设置动态标题
  setCourseChapterControlTitle()
}

// 加载所有章节数据（使用树形接口）
const loadAllChapters = async () => {
  if (!courseId.value) return

  loading.value = true
  try {
    const res = await CourseChapterApi.listCourseChapterTree(courseId.value)
    if (res && res.data) {
      const treeData = Array.isArray(res.data) ? res.data : []
      // 存储原始树形数据
      originalChapterTree.value = treeData
      // 将树形结构扁平化为数组，便于过滤和操作
      allChapters.value = flattenChapterTree(treeData)
      // 过滤草稿章节
      filterDraftChapters()
      // 过滤已发布章节并构建树形结构
      filterPublishedChapters()
    }
  } catch (error) {
  } finally {
    loading.value = false
  }
}

// 将树形结构扁平化为数组
const flattenChapterTree = (tree: CourseChapterVO[]): CourseChapterVO[] => {
  const result: CourseChapterVO[] = []

  const flatten = (nodes: CourseChapterVO[]) => {
    nodes.forEach(node => {
      // 添加当前节点（不包含children属性）
      const {children, ...nodeWithoutChildren} = node
      result.push(nodeWithoutChildren)

      // 递归处理子节点
      if (children && children.length > 0) {
        flatten(children)
      }
    })
  }

  flatten(tree)
  return result
}

// 过滤草稿章节
const filterDraftChapters = () => {
  // 草稿章节需要根据当前用户ID过滤，只显示当前用户创建的草稿
  draftChapters.value = allChapters.value.filter(chapter =>
      chapter.status === ChapterStatusEnum.DRAFT &&
      chapter.teacherId === userStore.userInfo?.id
  )
}

// 从树形结构中过滤已发布章节
const filterPublishedChaptersFromTree = (tree: CourseChapterVO[]): CourseChapterVO[] => {
  const filterTree = (nodes: CourseChapterVO[]): CourseChapterVO[] => {
    const result: CourseChapterVO[] = []

    nodes.forEach(node => {
      if (node.status === ChapterStatusEnum.PUBLISHED) {
        const filteredChildren = node.children ? filterTree(node.children) : []
        result.push({
          ...node,
          children: filteredChildren
        })
      }
    })

    return result
  }

  return filterTree(tree)
}

// 过滤已发布章节并构建树形结构
const filterPublishedChapters = () => {
  // 从原始树形数据中过滤已发布章节
  publishedChapterTree.value = filterPublishedChaptersFromTree(originalChapterTree.value)
}

// 构建父章节树形选项
const buildParentChapterTreeOptions = (chapters: CourseChapterVO[]): Array<{
  label: string;
  value: string;
  children?: Array<{ label: string; value: string }>
}> => {
  const chapterMap = new Map<string, {
    label: string;
    value: string;
    children: Array<{ label: string; value: string }>
  }>()
  const rootOptions: Array<{ label: string; value: string; children?: Array<{ label: string; value: string }> }> = []

  // 首先创建所有章节的映射
  chapters.forEach(chapter => {
    chapterMap.set(chapter.id, {
      label: chapter.chapterName,
      value: chapter.id,
      children: []
    })
  })

  // 然后构建树形结构
  chapters.forEach(chapter => {
    const chapterNode = chapterMap.get(chapter.id)!
    if (chapter.parentChapterId && chapterMap.has(chapter.parentChapterId)) {
      const parentNode = chapterMap.get(chapter.parentChapterId)!
      parentNode.children.push(chapterNode)
    } else {
      rootOptions.push(chapterNode)
    }
  })

  // 按排序权重排序
  const sortOptions = (options: Array<{
    label: string;
    value: string;
    children?: Array<{ label: string; value: string }>
  }>): Array<{ label: string; value: string; children?: Array<{ label: string; value: string }> }> => {
    return options.sort((a, b) => {
      const aChapter = chapters.find(c => c.id === a.value)
      const bChapter = chapters.find(c => c.id === b.value)
      return (aChapter?.sortOrder || 0) - (bChapter?.sortOrder || 0)
    }).map(option => ({
      ...option,
      children: option.children ? sortOptions(option.children) : []
    }))
  }

  return sortOptions(rootOptions)
}

// 构建父章节选项（使用已加载的数据）
const buildParentChapterOptions = () => {
  // 只使用已发布的章节作为父章节选项
  const publishedChapters = allChapters.value.filter(chapter => chapter.status === ChapterStatusEnum.PUBLISHED)
  parentChapterTreeOptions.value = buildParentChapterTreeOptions(publishedChapters)
}

// 处理编辑特定章节
const handleEditSpecificChapter = async (chapterId: string) => {
  // 在所有章节中查找要编辑的章节
  const targetChapter = allChapters.value.find(chapter => chapter.id === chapterId)

  if (targetChapter) {
    // 设置当前编辑章节
    currentEditingChapter.value = targetChapter
    isEditMode.value = true

    // 填充表单数据
    fillFormWithChapterData(targetChapter)

    // 根据章节状态切换到对应的标签页
    if (targetChapter.status === ChapterStatusEnum.DRAFT) {
      // 如果是草稿章节，切换到草稿标签页
      activeTab.value = 'draft'
    } else if (targetChapter.status === ChapterStatusEnum.PUBLISHED) {
      // 如果是已发布章节，切换到已发布标签页
      activeTab.value = 'published'
    }
  }
}

// 加载章节列表
const loadChapters = async () => {
  await loadAllChapters()
  buildParentChapterOptions()

  // 检查是否有需要自动打开的章节
  if (editChapterId.value) {
    await handleEditSpecificChapter(editChapterId.value)
  }
}


// 事件处理方法
const handleContentChange = (content: string) => {
  chapterForm.value.content = content
}

// 处理附件变化
const handleAttachmentChange = (files: any[]) => {
  attachmentFiles.value = files
  // URL更新由handleUrlsUpdated方法处理
}

// 加载文件详细信息
const loadFileInfo = async () => {
  if (!chapterForm.value.attachmentUrls || chapterForm.value.attachmentUrls.length === 0) {
    fileInfoList.value = []
    return
  }

  loadingFileInfo.value = true
  try {
    const res = await MinIOApi.getBatchFileInfoByPath({
      filePaths: chapterForm.value.attachmentUrls,
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

// 处理附件上传成功
const handleAttachmentUploadSuccess = () => {
  message.success(t('course.chapters.attachmentUploadSuccess'))
}

// 处理附件上传失败
const handleAttachmentUploadError = () => {
}

// 处理URL更新
const handleUrlsUpdated = (urls: string[]) => {
  // 确保URL数组不为空且过滤掉无效URL
  const validUrls = urls.filter(url => url && url.trim() !== '')

  if (validUrls.length > 0) {
    // 拼接新URL到现有的attachmentUrls数组中
    const existingUrls = chapterForm.value.attachmentUrls || []
    chapterForm.value.attachmentUrls = [...existingUrls, ...validUrls]
  }

  // 获取文件详细信息
  loadFileInfo()
}

// 处理文件预览
const handleFilePreview = (fileInfo: FileInfoDTO, event?: MouseEvent) => {
  transitionStore.show()
  runViewTransition(() => {
    router.push({
      name: 'FilePreview',
      query: {
        fileInfo: JSON.stringify(fileInfo),
        from: 'ChapterControl',
        courseId: courseId.value,
        chapterId: currentEditingChapter.value?.id || ''
      }
    })
  }, event)
}

// 处理删除附件
const handleDeleteAttachment = (fileInfo: FileInfoDTO) => {
  const {dialog} = getDiscreteApi()
  dialog.warning({
    title: t('course.chapters.form.deleteAttachmentConfirm'),
    content: t('course.chapters.form.deleteAttachmentConfirmContent', {fileName: fileInfo.fileName}),
    positiveText: t('course.chapters.confirmDelete'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      try {
        // 1. 先更新章节信息，从attachmentUrls中移除该文件的URL
        if (chapterForm.value.attachmentUrls) {
          chapterForm.value.attachmentUrls = chapterForm.value.attachmentUrls.filter(url => {
            // 排除逻辑：filePath.url匹配或者是filePath.objectName包含
            return url !== fileInfo.url && !url.includes(fileInfo.objectName)
          })
        }

        // 如果是编辑模式且有章节ID，先更新章节信息
        if (isEditMode.value && chapterForm.value.id) {
          // 更新章节信息
          const updateData = {
            ...chapterForm.value,
            courseId: courseId.value,
            teacherId: null
          }

          const updateRes = await CourseChapterApi.updateCourseChapter(updateData)
          if (!updateRes || !updateRes.success) {
            return
          }
        }

        // 2. 只有当文件的error字段不为true时，才删除MinIO中的文件
        if (!fileInfo.error && fileInfo.url) {
          await MinIOApi.deleteFileByPath({
            filePath: fileInfo.url,
            bucketCode: BusinessBucketCodeEnum.COURSE_PRIVATE
          })
        }

        // 3. 更新本地缓存状态（无论error字段是否为true都要删除本地缓存）
        // 从fileInfoList中移除该文件信息
        fileInfoList.value = fileInfoList.value.filter(file => !file.url.includes(fileInfo.objectName))

        // 从attachmentFiles中移除对应的文件
        attachmentFiles.value = attachmentFiles.value.filter(file => !file.url.includes(fileInfo.objectName))

        message.success(t('course.chapters.deleteAttachmentSuccess'))
        } catch (error) {
      }
    }
  })
}


// 处理添加章节点击
const handleAddChapter = () => {
  currentEditingChapter.value = null
  isEditMode.value = false
  resetForm()
}

// 处理章节点击（通用函数）
const handleChapterClick = (chapter: CourseChapterVO) => {
  currentEditingChapter.value = chapter
  isEditMode.value = true
  fillFormWithChapterData(chapter)
}

// 将章节数据填充到表单
const fillFormWithChapterData = (chapter: CourseChapterVO) => {
  chapterForm.value = {
    id: chapter.id,
    courseId: chapter.courseId,
    teacherId: chapter.teacherId,
    chapterName: chapter.chapterName || null,
    parentChapterId: chapter.parentChapterId || null,
    description: chapter.description || null,
    content: chapter.content || null,
    attachmentUrls: chapter.attachmentUrls || null,
    sortOrder: chapter.sortOrder || 0,
    status: chapter.status || null
  }

  // 初始化附件文件列表
  if (chapter.attachmentUrls && chapter.attachmentUrls.length > 0) {
    attachmentFiles.value = chapter.attachmentUrls.map((url, index) => ({
      id: `attachment-${index}`,
      name: url.split('/').pop() || `附件${index + 1}`,
      status: 'finished',
      url: url,
      percentage: 100
    }))

    // 加载文件详细信息
    loadFileInfo()
  } else {
    attachmentFiles.value = []
    fileInfoList.value = []
  }
}

const handlePublishedChapterSelect = (keys: string[]) => {
  if (keys.length > 0) {
    const selectedChapterId = keys[0]
    // 在树形结构中查找选中的章节
    const findChapter = (nodes: CourseChapterVO[]): CourseChapterVO | null => {
      for (const node of nodes) {
        if (node.id === selectedChapterId) {
          return node
        }
        if (node.children) {
          const found = findChapter(node.children)
          if (found) return found
        }
      }
      return null
    }
    const selectedChapter = findChapter(publishedChapterTree.value)
    if (selectedChapter) {
      handleChapterClick(selectedChapter)
    }
  }
}

// 保存章节（通用函数）
const saveChapter = async (isDraft: boolean = false) => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    saving.value = true

    // 设置表单数据
    chapterForm.value.courseId = courseId.value
    chapterForm.value.teacherId = null

    // attachmentUrls已经在handleUrlsUpdated中更新，无需重复处理

    // 如果是编辑模式，保持原有的status不变
    if (isEditMode.value && chapterForm.value.id) {
      // 编辑模式：保持原有status不变
      // chapterForm.value.status 已经在fillFormWithChapterData中设置为原章节的status
    } else {
      // 新增模式：根据操作类型设置status
      chapterForm.value.status = isDraft ? ChapterStatusEnum.DRAFT : ChapterStatusEnum.PUBLISHED
    }

    let res
    if (isEditMode.value && chapterForm.value.id) {
      // 编辑模式：更新章节
      res = await CourseChapterApi.updateCourseChapter(chapterForm.value)
    } else {
      // 新增模式：添加章节 - 使用CourseChapterAddDTO
      const addData: CourseChapterAddDTO = {
        courseId: chapterForm.value.courseId,
        teacherId: chapterForm.value.teacherId,
        chapterName: chapterForm.value.chapterName,
        parentChapterId: chapterForm.value.parentChapterId,
        description: chapterForm.value.description,
        content: chapterForm.value.content,
        attachmentUrls: chapterForm.value.attachmentUrls,
        sortOrder: chapterForm.value.sortOrder,
        status: chapterForm.value.status
      }
      res = await CourseChapterApi.addCourseChapter(addData)
    }

    if (res && res.success) {
      await loadChapters() // 重新加载章节列表
      if (!isEditMode.value) {
        resetForm() // 新增模式下重置表单
        message.success(isDraft ? t('course.chapters.saveDraftSuccess') : t('course.chapters.addSuccess'))
      } else {
        message.success(t('course.chapters.updateSuccess'))
      }

      // 保持当前页面状态不变，不进行标签页跳转
    } else {
    }
    } catch (error) {
  } finally {
    saving.value = false
  }
}

// 保存章节（发布）
const handleSave = () => saveChapter(false)

// 保存草稿
const handleSaveDraft = () => saveChapter(true)

// 删除章节
const handleDeleteChapter = async () => {
  if (!currentEditingChapter.value?.id) {
    return
  }

  // 显示确认对话框
  const {dialog} = getDiscreteApi()
  dialog.warning({
    title: t('course.chapters.deleteConfirm'),
    content: t('course.chapters.deleteConfirmContent', {chapterName: currentEditingChapter.value.chapterName}),
    positiveText: t('course.chapters.confirmDelete'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      try {
        await CourseChapterApi.removeCourseChapterById(currentEditingChapter.value!.id!)
        message.success(t('course.chapters.deleteSuccess'))

        // 重置表单并退出编辑模式
        resetForm()

        // 重新加载章节列表
        await loadChapters()
      } catch (error) {
      }
    }
  })
}

// 重置表单
const resetForm = () => {
  chapterForm.value = getDefaultCourseChapterDTO()
  attachmentFiles.value = []
  isEditMode.value = false
  currentEditingChapter.value = null
  if (formRef.value) {
    formRef.value.restoreValidation()
  }
}

// 取消编辑
const handleCancelEdit = () => {
  resetForm()
}

// 返回上一页
const handleBack = () => {
  router.back()
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

// 生命周期
onMounted(async () => {
  await loadCourseInfo()
  await loadChapters()
})
</script>

<style lang="scss" scoped>
.chapter-control {
  height: 100%;
  overflow-y: hidden;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .back-button {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}

.chapter-edit-container {
  flex: 1;
  margin-top: 24px;
  display: flex;
  gap: 24px;
  height: calc(100% - 24px);
}

.chapter-info-panel {
  height: 85vh;
  width: 30%;
  min-width: 300px;
}


.chapter-editor-panel {
  height: 85vh;
  width: 70%;
  flex: 1;
}

.editor-card {
  height: 100%;
  display: flex;
  flex-direction: column;

  :deep(.n-card__content) {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
}

.form-content {
  flex: 1;
  padding-right: 8px;
  overflow-y: auto;

  // 隐藏滚动条
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }
}

.form-actions {
  padding-top: 16px;
  text-align: center;

  :deep(.n-space) {
    gap: 24px !important;
  }
}

.chapter-list {
  height: calc(100vh - 230px);
  overflow-y: auto;
  padding: 0 8px;

  .empty-state {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .chapter-items {
    padding: 8px 0;
  }

  .add-chapter-item {
    border: 1px dashed;
    display: flex;
    align-items: center;
    padding: 12px 16px;
    margin: 4px 8px 24px 8px;
    border-radius: 8px;
    transition: all 0.2s;
    cursor: pointer;


    .add-chapter-content {
      display: flex;
      align-items: center;
      gap: 12px;

      .add-icon {
        transition: color 0.2s;
        margin-top: 4px;
      }

      .add-text {
        font-size: 14px;
        transition: color 0.2s;
      }
    }
  }

  .chapter-item {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 12px 16px;
    margin: 4px 8px;
    border-radius: 8px;
    border: 1px solid transparent;
    transition: all 0.2s;
    cursor: pointer;

    &:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }

    &.selected {
      color: white;

      .chapter-title {
        color: white;
      }

      .chapter-description {
        color: rgba(255, 255, 255, 0.8);
      }

      .chapter-meta {
        color: rgba(255, 255, 255, 0.7);
      }
    }

    .chapter-info {
      flex: 1;
      min-width: 0;

      .chapter-title {
        margin: 0 0 8px 0;
        font-size: 16px;
        font-weight: 600;
        color: var(--n-text-color);
        line-height: 1.4;
      }

      .chapter-description {
        margin: 0 0 8px 0;
        font-size: 14px;
        color: var(--n-text-color-secondary);
        line-height: 1.4;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        overflow: hidden;
      }

      .chapter-meta {
        display: flex;
        align-items: center;
        gap: 8px;

        .update-time {
          font-size: 12px;
          color: var(--n-text-color-tertiary);
        }
      }
    }

  }
}

.info-card {
  height: 100%;
  display: flex;
  flex-direction: column;

  :deep(.n-card__content) {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
}

// 已发布标签页的树形容器样式
.chapter-tree-container {
  height: calc(100vh - 230px);
  overflow-y: auto;
  padding: 0 8px;

  // 隐藏滚动条
  scrollbar-width: none;
  -ms-overflow-style: none;

  &::-webkit-scrollbar {
    display: none;
  }

  .empty-state {
    height: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .chapter-tree {
    height: 100%;
    margin: 0;
    padding: 8px 0;

  }
}

// 文件信息展示样式
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

    .delete-button {
      opacity: 0;
      transition: opacity 0.2s ease;
    }

    &:hover .delete-button {
      opacity: 1;
    }
  }
}
</style>


