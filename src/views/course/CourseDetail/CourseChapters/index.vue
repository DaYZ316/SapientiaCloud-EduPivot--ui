<template>
  <div class="course-chapters">
    <!-- 面包屑导航 -->
    <CourseBreadcrumb
        :course-info="courseInfo"
        :current-page="$t('course.navigation.chapters')"
    />

    <div>
      <!-- 搜索框和操作按钮 -->
      <div class="search-and-actions">
        <div class="search-section">
          <n-input
              v-model:value="searchKeyword"
              :placeholder="t('course.chapters.searchPlaceholder')"
              clearable
              @input="handleSearch"
          >
            <template #prefix>
              <Icon :component="SearchOutline"/>
            </template>
          </n-input>
        </div>

        <div class="action-buttons">
          <n-button type="primary" @click="handleAdd">
            <template #icon>
              <Icon :component="AddOutline"/>
            </template>
            {{ t('course.chapters.addChapter') }}
          </n-button>
        </div>
      </div>
    </div>

    <!-- 主要内容区域：左右分栏布局 -->
    <div class="main-content">
      <!-- 左侧章节树形列表 -->
      <div class="chapters-sidebar">
        <div class="chapters-container">
          <n-spin :show="loading">
            <div v-if="filteredChapterTree.length === 0 && !loading" class="empty-state">
              <n-empty :description="t('course.chapters.noChapters')">
                <template #icon>
                  <Icon :component="BookOutline"/>
                </template>
              </n-empty>
            </div>

            <div v-else class="chapters-tree">
              <n-tree
                  :block-line="true"
                  :children-field="'children'"
                  :data="filteredChapterTree"
                  :default-expand-all="true"
                  :item-size="32"
                  :key-field="'id'"
                  :label-field="'chapterName'"
                  :selectable="true"
                  :selected-keys="selectedChapterId ? [selectedChapterId] : []"
                  :virtual-scroll="true"
                  @click="handleChapterClick"
                  @update:selected-keys="handleChapterSelect"
              />
            </div>
          </n-spin>
        </div>
      </div>

      <!-- 右侧章节详情 -->
      <div class="chapter-detail">
        <ChapterDetail
            :chapter="selectedChapter"
            :course-id="courseId"
            @delete="handleChapterDelete"
            @edit="handleChapterEdit"
            @update="handleChapterUpdate"
        />
      </div>
    </div>

  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, ref} from 'vue'
import {AddOutline, BookOutline, SearchOutline} from '@vicons/ionicons5'
import {useRoute, useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useTitle} from '@/utils/titleUtil'
import * as CourseChapterApi from '@/api/course/courseChapter'
import type {CourseChapterVO} from '@/types/course/courseChapter'
import {ChapterStatusEnum} from '@/enum/course/chapterStatusEnum'
import CourseBreadcrumb from '../../components/CourseBreadcrumb/CourseBreadcrumb.vue'
import ChapterDetail from './ChapterDetail.vue'
import Icon from '@/components/common/Icon.vue'
import {getDiscreteApi} from '@/utils/naiveUIHelper'
import {useCourseStore} from '@/store'

const {t} = useI18n()
const route = useRoute()
const router = useRouter()
const {setTitle} = useTitle()
const courseStore = useCourseStore()

// 响应式数据
const courseInfo = computed(() => courseStore.currentCourseInfo)
const chapterTree = ref<CourseChapterVO[]>([])
const filteredChapterTree = ref<CourseChapterVO[]>([])
const searchKeyword = ref('')
const loading = ref(false)
const selectedChapter = ref<CourseChapterVO | null>(null)
const selectedChapterId = ref<string | null>(null)

// 计算属性
const courseId = computed(() => route.params.courseId as string)


// 设置动态标题
const setCourseChaptersTitle = () => {
  if (courseInfo.value?.courseName) {
    // 设置动态标题：课程名称 - 课程章节
    const courseChaptersTitle = t('app.title.course.courseChapters')
    setTitle('courseChapters', `${courseInfo.value.courseName} - ${courseChaptersTitle}`)
  } else {
    // 如果课程信息还未加载，使用默认标题
    setTitle('courseChapters')
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
  setCourseChaptersTitle()
}

// 过滤发布状态章节的辅助函数
const filterPublishedChapters = (nodes: CourseChapterVO[]): CourseChapterVO[] => {
  if (!nodes || nodes.length === 0) {
    return []
  }

  return nodes.filter(node => {
    // 只保留发布状态的章节
    if (node.status !== ChapterStatusEnum.PUBLISHED) {
      return false
    }

    // 如果有子章节，递归过滤
    if (node.children && node.children.length > 0) {
      const filteredChildren = filterPublishedChapters(node.children)
      if (filteredChildren.length > 0) {
        return {
          ...node,
          children: filteredChildren
        }
      }
      return false
    }

    return true
  }).map(node => ({
    ...node,
    children: node.children ? filterPublishedChapters(node.children) : []
  }))
}

// 获取第一个章节的辅助函数
const getFirstChapter = (nodes: CourseChapterVO[]): CourseChapterVO | null => {
  if (!nodes || nodes.length === 0) {
    return null
  }

  // 按排序顺序找到第一个章节
  const sortedNodes = [...nodes].sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
  return sortedNodes[0]
}

// 加载章节树形列表
const loadChapterList = async () => {
  if (!courseId.value || courseId.value === 'undefined') {
    return
  }

  // 检查是否有从 ChapterControl 传递的已发布章节数据
  const publishedChaptersParam = route.query.publishedChapters
  if (publishedChaptersParam) {
    try {
      const publishedChapters = JSON.parse(publishedChaptersParam as string)
      if (Array.isArray(publishedChapters) && publishedChapters.length > 0) {
        // 使用传递的已发布章节数据，并确保只显示发布状态的章节
        const filteredChapters = filterPublishedChapters(publishedChapters)
        chapterTree.value = filteredChapters
        filteredChapterTree.value = filteredChapters

        // 如果存在章节，自动选择第一个章节
        if (chapterTree.value.length > 0) {
          const firstChapter = getFirstChapter(chapterTree.value)
          if (firstChapter) {
            selectedChapterId.value = firstChapter.id
            selectedChapter.value = firstChapter
          }
        }
        return
      }
    } catch (error) {
      // 解析传递的已发布章节数据失败，使用默认加载方式
    }
  }

  // 如果没有传递数据或解析失败，则正常获取数据
  loading.value = true
  try {
    const res = await CourseChapterApi.listCourseChapterTree(courseId.value)

    // 处理树形结构数据
    let allChapters: CourseChapterVO[] = []
    if (res.code === 200 && res.data) {
      allChapters = Array.isArray(res.data) ? res.data : []
    } else if (res.success && res.data) {
      allChapters = Array.isArray(res.data) ? res.data : []
    }

    // 过滤只显示发布状态的章节
    chapterTree.value = filterPublishedChapters(allChapters)
    filteredChapterTree.value = chapterTree.value

    // 如果存在章节，自动选择第一个章节
    if (chapterTree.value.length > 0) {
      const firstChapter = getFirstChapter(chapterTree.value)
      if (firstChapter) {
        selectedChapterId.value = firstChapter.id
        selectedChapter.value = firstChapter
      }
    }
  } finally {
    loading.value = false
  }
}

// 搜索处理
const handleSearch = () => {
  if (!searchKeyword.value.trim()) {
    filteredChapterTree.value = chapterTree.value
  } else {
    // 递归搜索树形结构（只搜索已发布的章节）
    const searchInTree = (nodes: CourseChapterVO[]): CourseChapterVO[] => {
      return nodes.filter(node => {
        // 确保只搜索发布状态的章节
        if (node.status !== ChapterStatusEnum.PUBLISHED) {
          return false
        }

        const matches = node.chapterName?.toLowerCase().includes(searchKeyword.value.toLowerCase())
        const children = node.children ? searchInTree(node.children) : []

        if (matches || children.length > 0) {
          return {
            ...node,
            children: children
          }
        }
        return false
      }).map(node => ({
        ...node,
        children: node.children ? searchInTree(node.children) : []
      }))
    }

    filteredChapterTree.value = searchInTree(chapterTree.value)
  }
}

// 新增章节
function handleAdd() {
  router.push(`/course/detail/${courseId.value}/chapters/control`)
}

// 章节选择处理
function handleChapterSelect(keys: string[]) {
  if (keys.length > 0) {
    // 如果点击的是已经选中的章节，不做任何处理，保持选中状态
    if (selectedChapterId.value === keys[0]) {
      return
    }

    selectedChapterId.value = keys[0]
    // 在树形结构中查找选中的章节
    const findChapter = (nodes: CourseChapterVO[]): CourseChapterVO | null => {
      for (const node of nodes) {
        if (node.id === keys[0]) {
          return node
        }
        if (node.children) {
          const found = findChapter(node.children)
          if (found) return found
        }
      }
      return null
    }
    selectedChapter.value = findChapter(chapterTree.value)
  } else {
    // 只有在没有选中任何章节时才清空选择
    if (!selectedChapterId.value) {
      selectedChapterId.value = null
      selectedChapter.value = null
    }
  }
}

// 章节点击处理
function handleChapterClick() {
  // 点击处理逻辑，可以在这里添加额外的点击行为
}

// 章节更新处理
function handleChapterUpdate() {
  // 重新加载章节列表
  loadChapterList()
}

// 章节编辑处理
function handleChapterEdit(_chapter: CourseChapterVO) {
  // 编辑功能已实现，可以跳转到编辑页面
  router.push(`/course/detail/${courseId.value}/chapters/control`)
}

// 章节删除处理
async function handleChapterDelete(chapter: CourseChapterVO) {
  if (!chapter || !chapter.id) {
    return
  }

  // 显示确认对话框
  const {dialog} = getDiscreteApi()
  dialog.warning({
    title: t('common.delete'),
    content: t('course.chapters.deleteConfirmContent', {chapterName: chapter.chapterName}),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      try {
        // 调用删除API
        const res = await CourseChapterApi.removeCourseChapterById(chapter.id)

        if (res.success || res.code === 200) {
          // 删除成功后重新加载章节列表
          await loadChapterList()
          // 清空当前选中的章节
          selectedChapter.value = null
          selectedChapterId.value = null
        }
    } catch (error) {
    }
    }
  })
}


// 清理查询参数
const clearQueryParams = () => {
  if (route.query.publishedChapters) {
    router.replace({
      path: route.path,
      query: {}
    })
  }
}

// 生命周期
onMounted(async () => {
  await loadCourseInfo()
  await loadChapterList()
  // 清理查询参数，避免页面刷新时重复使用
  clearQueryParams()
})
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
