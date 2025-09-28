<template>
  <div class="chapter-control">
    <!-- 页面头部 -->
    <div class="page-header">
      <!-- 面包屑导航 -->
      <CourseBreadcrumb
          :course-info="courseInfo"
          :current-page="$t('course.chapters.addChapter')"
      />

      <!-- 返回按钮 -->
      <n-button
          class="back-button"
          ghost
          type="primary"
          @click="handleBack"
      >
        <template #icon>
          <n-icon>
            <Icon :component="ArrowBackOutline"/>
          </n-icon>
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
            <n-tab-pane :tab="t('course.chapters.draft')" name="draft">
              <div class="chapter-list">
                <n-spin :show="loading">
                  <div class="chapter-items">
                    <!-- 添加章节选项 - 始终显示 -->
                    <div class="add-chapter-item" @click="handleAddChapter">
                      <div class="add-chapter-content">
                        <div class="add-icon">
                          <n-icon size="20">
                            <Icon :component="AddOutline"/>
                          </n-icon>
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
                        @click="handleDraftChapterClick(chapter)"
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
                <n-form-item-grid-item :span="12" label="章节名称" path="chapterName">
                  <n-input
                      v-model:value="chapterForm.chapterName"
                      :placeholder="t('course.chapters.form.chapterNamePlaceholder')"
                      clearable
                  />
                </n-form-item-grid-item>

                <n-form-item-grid-item :span="18" label="排序权重" path="sortOrder">
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
                <n-form-item-grid-item :span="24" label="父章节" path="parentChapterId">
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
                <n-form-item-grid-item :span="24" label="章节描述" path="description">
                  <n-input
                      v-model:value="chapterForm.description"
                      :placeholder="t('course.chapters.form.descriptionPlaceholder')"
                      :rows="3"
                      clearable
                      type="textarea"
                  />
                </n-form-item-grid-item>


                <!-- 章节内容 -->
                <n-form-item-grid-item :span="24">
                  <RichTextEditor
                      v-model="chapterForm.content"
                      placeholder="请输入章节内容..."
                      upload-path="course-chapters"
                      @change="handleContentChange"
                  />
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
                  删除章节
                </n-button>
              </div>

              <!-- 右侧其他按钮 -->
              <n-space>
                <n-button v-if="isEditMode" type="default" @click="handleCancelEdit">
                  取消编辑
                </n-button>
                <n-button v-if="!isEditMode" :loading="saving" type="info" @click="handleSaveDraft">
                  {{ t('course.chapters.saveDraft') }}
                </n-button>
                <n-button :loading="saving" type="primary" @click="handleSave">
                  {{ isEditMode ? '更新章节' : t('course.chapters.publish') }}
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
import {computed, onMounted, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {AddOutline, ArrowBackOutline, BookOutline} from '@vicons/ionicons5'
import * as CourseApi from '@/api/course/course'
import * as CourseChapterApi from '@/api/course/courseChapter'
import {ChapterStatusEnum} from '@/enum/course/chapterStatusEnum'
import type {CourseVO} from '@/types/course'
import type {CourseChapterVO} from '@/types/course/courseChapter'
import CourseBreadcrumb from '../../components/CourseBreadcrumb/CourseBreadcrumb.vue'
import Icon from '@/components/common/Icon.vue'
import RichTextEditor from '@/components/common/RichTextEditor.vue'
import {getDiscreteApi} from '@/utils/naiveUIHelper'

const {message} = getDiscreteApi()
const {t} = useI18n()
const route = useRoute()
const router = useRouter()

// 响应式数据
const courseInfo = ref<CourseVO | null>(null)
const allChapters = ref<CourseChapterVO[]>([]) // 存储所有章节数据（扁平化）
const originalChapterTree = ref<CourseChapterVO[]>([]) // 存储原始树形数据
const draftChapters = ref<CourseChapterVO[]>([]) // 草稿章节（从allChapters过滤）
const publishedChapterTree = ref<CourseChapterVO[]>([]) // 已发布章节树（从原始树形数据过滤）
const loading = ref(false)
const saving = ref(false)
const formRef = ref()
const isEditMode = ref(false) // 是否为编辑模式
const currentEditingChapter = ref<CourseChapterVO | null>(null) // 当前正在编辑的章节
const activeTab = ref('draft') // 当前激活的标签页

// 章节表单数据
const chapterForm = ref({
  id: null as string | null,
  courseId: null as string | null,
  teacherId: null as string | null,
  chapterName: '',
  parentChapterId: null as string | null,
  description: '',
  content: '',
  sortOrder: 0,
  status: null as number | null
})


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

// 加载课程信息
const loadCourseInfo = async () => {
  if (!courseId.value || courseId.value === 'undefined') {
    router.push('/course')
    return
  }

  try {
    const res = await CourseApi.getCourseById(courseId.value)
    if (res.success && res.data) {
      courseInfo.value = res.data
    }
  } catch (error) {
    message.error(t('course.chapters.loadCourseInfoFailed'))
  }
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
    message.error(t('course.chapters.loadChaptersFailed'))
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
  draftChapters.value = allChapters.value.filter(chapter => chapter.status === ChapterStatusEnum.DRAFT)
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

// 处理添加章节点击
const handleAddChapter = () => {
  currentEditingChapter.value = null
  isEditMode.value = false
  resetForm()

  // 设置teacherId为null，由后端处理
  chapterForm.value.teacherId = null
}

// 处理草稿章节点击
const handleDraftChapterClick = (chapter: CourseChapterVO) => {
  currentEditingChapter.value = chapter
  isEditMode.value = true
  fillFormWithChapterData(chapter)
}

// 处理已发布章节点击
const handlePublishedChapterClick = (chapter: CourseChapterVO) => {
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
    chapterName: chapter.chapterName || '',
    parentChapterId: chapter.parentChapterId || null,
    description: chapter.description || '',
    content: chapter.content || '',
    sortOrder: chapter.sortOrder || 0,
    status: chapter.status || null
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
      handlePublishedChapterClick(selectedChapter)
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
      // 新增模式：添加章节
      res = await CourseChapterApi.addCourseChapter(chapterForm.value)
    }

    if (res && res.success) {
      await loadChapters() // 重新加载章节列表
      if (!isEditMode.value) {
        resetForm() // 新增模式下重置表单
        message.success(isDraft ? '草稿保存成功' : t('course.chapters.addSuccess'))
      } else {
        message.success('章节更新成功')
      }

      // 保持当前页面状态不变，不进行标签页跳转
    } else {
      const errorMessage = isEditMode.value
          ? '章节更新失败'
          : (isDraft ? '草稿保存失败' : t('course.chapters.addFailed'))
      message.error(errorMessage)
    }
  } catch (error) {
    message.error('保存失败，请检查表单信息')
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
    message.error('无法获取章节信息')
    return
  }

  // 显示确认对话框
  const {dialog} = getDiscreteApi()
  dialog.warning({
    title: '确认删除',
    content: `确定要删除章节"${currentEditingChapter.value.chapterName}"吗？删除后无法恢复。`,
    positiveText: '确定删除',
    negativeText: '取消',
    onPositiveClick: async () => {
      try {
        await CourseChapterApi.removeCourseChapterById(currentEditingChapter.value!.id!)
        message.success('章节删除成功')

        // 重置表单并退出编辑模式
        resetForm()

        // 重新加载章节列表
        await loadChapters()
      } catch (error) {
        message.error('删除章节失败')
      }
    }
  })
}

// 重置表单
const resetForm = () => {
  chapterForm.value = {
    id: null,
    courseId: null,
    teacherId: null,
    chapterName: '',
    parentChapterId: null,
    description: '',
    content: '',
    sortOrder: 0,
    status: null
  }
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
</style>

