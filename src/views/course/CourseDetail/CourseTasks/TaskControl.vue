<template>
  <div class="task-control">
    <!-- 页面头部 -->
    <div class="page-header">
      <!-- 面包屑导航 -->
      <CourseBreadcrumb
          :course-info="courseInfo"
          :current-page="t('course.tasks.taskManagement')"
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

    <!-- 任务编辑区域 -->
    <div class="task-edit-container">
      <!-- 左侧30% - 任务信息区域 -->
      <div class="task-info-panel">
        <n-card class="info-card">
          <!-- 标签栏 -->
          <n-tabs v-model:value="activeTab" type="line">
            <n-tab-pane :tab="t('course.tasks.published')" name="published">
              <div class="tab-content">
                <n-spin :show="loading">
                  <div v-if="publishedTasks.length === 0 && !loading" class="empty-state">
                    <n-empty :description="t('course.tasks.publishedTasks')">
                      <template #icon>
                        <Icon :component="ListOutline"/>
                      </template>
                    </n-empty>
                  </div>
                  <div v-else class="task-list">
                    <div
                        v-for="task in publishedTasks"
                        :key="task.id"
                        :class="{ active: selectedTaskId === task.id }"
                        class="task-item"
                        @click="selectTask(task)"
                    >
                      <div class="task-info">
                        <div class="task-name">{{ task.taskName }}</div>
                      </div>
                    </div>
                  </div>
                </n-spin>
              </div>
            </n-tab-pane>
            <n-tab-pane :tab="t('course.tasks.draft')" name="draft">
              <div class="tab-content">
                <n-spin :show="loading">
                  <div class="task-items">
                    <!-- 添加任务选项 - 始终显示 -->
                    <div class="add-task-item" @click="handleAddTask">
                      <div class="add-task-content">
                        <div class="add-icon">
                          <Icon :component="AddOutline" size="20"/>
                        </div>
                        <span class="add-text">{{ t('course.tasks.addTask') }}</span>
                      </div>
                    </div>

                    <!-- 空状态 - 只在没有草稿任务且不在加载时显示 -->
                    <div v-if="draftTasks.length === 0 && !loading" class="empty-state">
                      <n-empty :description="t('course.tasks.draftTasks')">
                        <template #icon>
                          <Icon :component="ListOutline"/>
                        </template>
                      </n-empty>
                    </div>

                    <!-- 草稿任务列表 -->
                    <div
                        v-for="task in draftTasks"
                        :key="task.id"
                        :class="{ active: selectedTaskId === task.id }"
                        class="task-item"
                        @click="selectTask(task)"
                    >
                      <div class="task-info">
                        <div class="task-name">{{ task.taskName }}</div>
                      </div>
                    </div>
                  </div>
                </n-spin>
              </div>
            </n-tab-pane>
          </n-tabs>
        </n-card>
      </div>

      <!-- 右侧70% - 任务编辑表单 -->
      <div class="task-form-panel">
        <n-card class="form-card">
          <template #header>
            <div class="form-header">
              <h3>{{ isEdit ? t('course.tasks.editTask') : t('course.tasks.addTask') }}</h3>
            </div>
          </template>

          <n-form
              ref="formRef"
              :model="formData"
              :rules="formRules"
              label-placement="left"
              label-width="120px"
              size="large"
          >
            <n-form-item :label="t('course.tasks.taskName')" path="taskName">
              <n-input
                  v-model:value="formData.taskName"
                  :placeholder="t('course.tasks.taskNamePlaceholder')"
                  clearable
              />
            </n-form-item>

            <n-form-item :label="t('course.tasks.taskType')" path="taskType">
              <n-select
                  v-model:value="formData.taskType"
                  :options="taskTypeOptions"
                  :placeholder="t('course.tasks.taskTypePlaceholder')"
                  clearable
              />
            </n-form-item>

            <n-form-item :label="t('course.tasks.difficultyLabel')" path="difficulty">
              <n-select
                  v-model:value="formData.difficulty"
                  :options="difficultyOptions"
                  :placeholder="t('course.tasks.difficultyPlaceholder')"
                  clearable
              />
            </n-form-item>

            <n-form-item :label="t('course.tasks.points')" path="maxScore">
              <n-input-number
                  v-model:value="formData.maxScore"
                  :max="150"
                  :min="0"
                  :placeholder="t('course.tasks.pointsPlaceholder')"
                  style="width: 100%"
              />
            </n-form-item>

            <n-form-item :label="t('course.tasks.startTime')" path="startTime">
              <n-date-picker
                  v-model:value="formData.startTime"
                  :placeholder="t('course.tasks.startTimePlaceholder')"
                  style="width: 100%"
                  type="datetime"
              />
            </n-form-item>

            <n-form-item :label="t('course.tasks.dueDate')" path="endTime">
              <n-date-picker
                  v-model:value="formData.endTime"
                  :placeholder="t('course.tasks.dueDatePlaceholder')"
                  style="width: 100%"
                  type="datetime"
              />
            </n-form-item>

            <n-form-item :label="t('course.tasks.timeLimit')" path="estimatedTime">
              <n-input-number
                  v-model:value="formData.estimatedTime"
                  :max="9999"
                  :min="0"
                  :placeholder="t('course.tasks.timeLimitPlaceholder')"
                  style="width: 100%"
              />
            </n-form-item>

            <n-form-item :label="t('course.tasks.description')" path="description">
              <n-input
                  v-model:value="formData.description"
                  :placeholder="t('course.tasks.descriptionPlaceholder')"
                  :rows="3"
                  type="textarea"
              />
            </n-form-item>

            <!-- 任务内容标题 -->
            <div class="section-title">
              <h3>{{ t('course.tasks.content') }}</h3>
            </div>

            <!-- 任务内容 -->
            <RichTextEditor
                v-model="taskContentModel"
                :bucket-code="BusinessBucketCodeEnum.COURSE_PRIVATE"
                :placeholder="t('course.tasks.contentPlaceholder')"
                style="margin-bottom: 16px;"
            />

            <n-form-item :label="t('course.tasks.attachments')" path="attachments">
              <FileUpload
                  v-model:value="formData.attachmentUrls"
                  :bucket-code="BusinessBucketCodeEnum.COURSE_PRIVATE"
                  :max-count="10"
                  :max-size="50 * 1024 * 1024"
                  accept="*/*"
                  @file-change="handleAttachmentChange"
                  @upload-success="handleAttachmentUploadSuccess"
                  @upload-error="handleAttachmentUploadError"
                  @urls-updated="handleUrlsUpdated"
              />
            </n-form-item>

            <!-- 文件详细信息展示 -->
            <n-form-item v-if="fileInfoList.length > 0" label="附件列表">
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
            </n-form-item>
          </n-form>

          <!-- 操作按钮区域 -->
          <div class="form-actions">
            <n-space justify="space-between">
              <!-- 左侧删除按钮 -->
              <div>
                <n-button
                    v-if="isEdit && currentEditingTask?.status === TaskStatusEnum.PUBLISHED"
                    :loading="saving"
                    type="error"
                    @click="handleDeleteTask"
                >
                  {{ t('course.tasks.deleteTask') }}
                </n-button>
              </div>

              <!-- 右侧其他按钮 -->
              <n-space>
                <n-button
                    v-if="isEdit && currentEditingTask?.status === TaskStatusEnum.PUBLISHED"
                    type="default"
                    @click="handleCancelEdit"
                >
                  {{ t('course.tasks.cancelEdit') }}
                </n-button>
                <n-button
                    v-if="!isEdit || currentEditingTask?.status === TaskStatusEnum.DRAFT"
                    :loading="saving"
                    type="info"
                    @click="handleSaveDraft"
                >
                  {{ t('course.tasks.saveDraft') }}
                </n-button>
                <n-button
                    :loading="saving"
                    type="primary"
                    @click="handlePublish"
                >
                  {{
                  isEdit && currentEditingTask?.status === TaskStatusEnum.PUBLISHED ? t('course.tasks.updateTask') :
                  t('course.tasks.publish')
                  }}
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
import {
  AddOutline,
  ArchiveOutline,
  ArrowBackOutline,
  BookOutline,
  DocumentTextOutline,
  FolderOutline,
  ImageOutline,
  ListOutline,
  MusicalNotesOutline,
  TrashOutline,
  VideocamOutline
} from '@vicons/ionicons5'
import {useRoute, useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useTitle} from '@/utils/titleUtil'
import {useUserStore} from '@/store/modules/user'
import {useTransitionStore} from '@/store/modules/transition'
import {runViewTransition} from '@/utils/themeAnimation'
import * as CourseTaskApi from '@/api/course/courseTask'
import {getDefaultCourseTaskDTO} from '@/api/course/courseTask'
import * as MinIOApi from '@/api/minIO'
import {BusinessBucketCodeEnum} from '@/enum/minIO'
import type {CourseTaskDTO, CourseTaskVO} from '@/types/course/courseTask'
import type {FileInfoDTO} from '@/types/minIO/file'
import {TaskStatusEnum} from '@/enum/course/taskStatusEnum'
import {getTaskTypeOptions} from '@/enum/course/taskTypeEnum'
import {getTaskDifficultyOptions} from '@/enum/course/taskDifficultyEnum'
import CourseBreadcrumb from '../../components/CourseBreadcrumb/CourseBreadcrumb.vue'
import Icon from '@/components/common/Icon.vue'
import RichTextEditor from '@/components/common/RichTextEditor.vue'
import FileUpload from '@/components/common/FileUpload.vue'
import {getDiscreteApi} from '@/utils/naiveUIHelper'
import {useCourseStore} from '@/store'

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
const allTasks = ref<CourseTaskVO[]>([]) // 存储所有任务数据
const publishedTasks = ref<CourseTaskVO[]>([])
const draftTasks = ref<CourseTaskVO[]>([])
const activeTab = ref('published')
const selectedTaskId = ref<string | null>(null)
const isEdit = ref(false)
const loading = ref(false)
const saving = ref(false)
const currentEditingTask = ref<CourseTaskVO | null>(null) // 当前正在编辑的任务
const formRef = ref()

// 表单数据 - 使用默认DTO初始化
const formData = ref<CourseTaskDTO>(getDefaultCourseTaskDTO())

// 富文本编辑器内容模型 - 处理null到undefined的类型转换
const taskContentModel = computed({
  get: () => formData.value.taskContent || '',
  set: (value: string) => {
    formData.value.taskContent = value || null
  }
})

// 文件信息相关
const fileInfoList = ref<FileInfoDTO[]>([])
const loadingFileInfo = ref(false)

// 表单验证规则
const formRules = {
  taskName: [
    {required: true, message: t('course.tasks.taskNameRequired'), trigger: 'blur'},
    {min: 1, max: 100, message: t('course.tasks.taskNameLength'), trigger: 'blur'}
  ],
  taskType: [
    {required: true, type: 'number', message: t('course.tasks.taskTypeRequired'), trigger: 'change'}
  ],
  difficulty: [
    {required: true, type: 'number', message: t('course.tasks.difficultyRequired'), trigger: 'change'}
  ],
  maxScore: [
    {required: true, type: 'number', message: t('course.tasks.pointsRequired'), trigger: 'blur'},
    {type: 'number', min: 0, message: t('course.tasks.pointsCannotBeNegative'), trigger: 'blur'},
    {type: 'number', max: 150, message: t('course.tasks.pointsCannotExceed150'), trigger: 'blur'}
  ],
  estimatedTime: [
    {type: 'number', min: 0, message: t('course.tasks.timeLimitCannotBeNegative'), trigger: 'blur'},
    {type: 'number', max: 9999, message: t('course.tasks.timeLimitCannotExceed9999'), trigger: 'blur'}
  ],
  startTime: [
    {required: true, type: 'date', message: t('course.tasks.startTimeRequired'), trigger: 'change'}
  ],
  endTime: [
    {required: true, type: 'date', message: t('course.tasks.endTimeRequired'), trigger: 'change'}
  ]
}

// 计算属性
const courseId = computed(() => route.params.courseId as string)
const editTaskId = computed(() => route.query.taskId as string)

// 任务类型选项
const taskTypeOptions = getTaskTypeOptions(t)

// 难度选项
const difficultyOptions = getTaskDifficultyOptions(t)

// 设置动态标题
const setTaskControlTitle = () => {
  if (courseInfo.value?.courseName) {
    const taskControlTitle = t('course.tasks.taskManagement')
    setTitle('taskControl', `${courseInfo.value.courseName} - ${taskControlTitle}`)
  } else {
    setTitle('taskControl')
  }
}

// 加载课程信息
const loadCourseInfo = async () => {
  if (!courseId.value || courseId.value === 'undefined') {
    router.push('/course')
    return
  }

  await courseStore.setCurrentCourseId(courseId.value, true)
  setTaskControlTitle()
}

// 加载任务列表
const loadTaskList = async () => {
  if (!courseId.value || courseId.value === 'undefined') {
    return
  }

  loading.value = true
  try {
    const res = await CourseTaskApi.listAllCourseTaskByCourseId(courseId.value)
    let tasks: CourseTaskVO[] = []

    if (res.code === 200 && res.data) {
      tasks = Array.isArray(res.data) ? res.data : []
    }

    // 存储所有任务数据
    allTasks.value = tasks

    // 按状态分类
    publishedTasks.value = tasks.filter(task => task.status === TaskStatusEnum.PUBLISHED)
    // 草稿任务需要根据当前用户ID过滤，只显示当前用户创建的草稿
    draftTasks.value = tasks.filter(task =>
        task.status === TaskStatusEnum.DRAFT &&
        task.sysUserId === userStore.userInfo?.id
    )
  } catch (error) {
  } finally {
    loading.value = false
  }
}


// 处理编辑特定任务
const handleEditSpecificTask = async (taskId: string) => {
  // 在所有任务中查找要编辑的任务
  const targetTask = allTasks.value.find(task => task.id === taskId)

  if (targetTask) {
    // 设置当前编辑任务
    currentEditingTask.value = targetTask
    isEdit.value = true
    selectedTaskId.value = targetTask.id

    // 填充表单数据
    await fillFormWithTaskData(targetTask)

    // 根据任务状态切换到对应的标签页
    if (targetTask.status === TaskStatusEnum.DRAFT) {
      // 如果是草稿任务，切换到草稿标签页
      activeTab.value = 'draft'
    } else if (targetTask.status === TaskStatusEnum.PUBLISHED) {
      // 如果是已发布任务，切换到已发布标签页
      activeTab.value = 'published'
    }
  }
}

// 将任务数据填充到表单
const fillFormWithTaskData = async (task: CourseTaskVO) => {
  formData.value = {
    id: task.id,
    courseId: task.courseId,
    sysUserId: task.sysUserId,
    taskName: task.taskName || null,
    description: task.description || null,
    taskType: task.taskType !== undefined ? Number(task.taskType) : null,
    taskContent: task.taskContent || null,
    attachmentUrls: task.attachmentUrls || null,
    resourceUrls: task.resourceUrls || null,
    maxScore: task.maxScore || null,
    startTime: task.startTime ? new Date(task.startTime).getTime() : Date.now(),
    endTime: task.endTime ? new Date(task.endTime).getTime() : null,
    allowLateSubmit: task.allowLateSubmit || null,
    maxSubmitCount: task.maxSubmitCount || null,
    autoGrade: task.autoGrade || null,
    tags: task.tags || null,
    difficulty: task.difficulty !== undefined ? Number(task.difficulty) : null,
    estimatedTime: task.estimatedTime || null,
    status: task.status || null
  }

  // 加载文件信息
  if (task.attachmentUrls && task.attachmentUrls.length > 0) {
    await loadFileInfo(task.attachmentUrls)
  } else {
    fileInfoList.value = []
  }
}

// 处理添加任务点击
const handleAddTask = () => {
  currentEditingTask.value = null
  selectedTaskId.value = null
  isEdit.value = false
  resetForm()
}

// 选择任务
const selectTask = async (task: CourseTaskVO) => {
  currentEditingTask.value = task
  selectedTaskId.value = task.id
  isEdit.value = true
  await fillFormWithTaskData(task)
}

// 保存草稿
const handleSaveDraft = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    saving.value = true

    const taskData = {
      ...formData.value,
      status: TaskStatusEnum.DRAFT,
      courseId: courseId.value,
      sysUserId: userStore.userInfo?.id || null,
      startTime: typeof formData.value.startTime === 'number' ? new Date(formData.value.startTime).toISOString() : formData.value.startTime,
      endTime: typeof formData.value.endTime === 'number' ? new Date(formData.value.endTime).toISOString() : formData.value.endTime
    }

    if (isEdit.value && selectedTaskId.value) {
      // 更新任务
      taskData.id = selectedTaskId.value
      const res = await CourseTaskApi.updateCourseTask(taskData as CourseTaskDTO)
      if (res.success || res.code === 200) {
        message.success(t('course.tasks.saveDraftSuccess'))
        await loadTaskList()
      }
    } else {
      // 创建新任务
      const res = await CourseTaskApi.addCourseTask(taskData as CourseTaskDTO)
      if (res.success || res.code === 200) {
        message.success(t('course.tasks.saveDraftSuccess'))
        await loadTaskList()
        resetForm()
      }
    }
  } catch (error) {
  } finally {
    saving.value = false
  }
}

// 发布任务
const handlePublish = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    saving.value = true

    const taskData = {
      ...formData.value,
      status: TaskStatusEnum.PUBLISHED,
      courseId: courseId.value,
      sysUserId: userStore.userInfo?.id || null,
      startTime: typeof formData.value.startTime === 'number' ? new Date(formData.value.startTime).toISOString() : formData.value.startTime,
      endTime: typeof formData.value.endTime === 'number' ? new Date(formData.value.endTime).toISOString() : formData.value.endTime
    }

    if (isEdit.value && selectedTaskId.value) {
      // 更新任务
      taskData.id = selectedTaskId.value
      const res = await CourseTaskApi.updateCourseTask(taskData as CourseTaskDTO)
      if (res.success || res.code === 200) {
        const successMessage = currentEditingTask.value?.status === TaskStatusEnum.PUBLISHED
            ? t('course.tasks.updateSuccess')
            : t('course.tasks.publishSuccess')
        message.success(successMessage)
        await loadTaskList()
      }
    } else {
      // 创建新任务
      const res = await CourseTaskApi.addCourseTask(taskData as CourseTaskDTO)
      if (res.success || res.code === 200) {
        message.success(t('course.tasks.publishSuccess'))
        await loadTaskList()
        resetForm()
      }
    }
  } catch (error) {
  } finally {
    saving.value = false
  }
}

// 重置表单
const resetForm = () => {
  formData.value = getDefaultCourseTaskDTO()
  selectedTaskId.value = null
  isEdit.value = false
  currentEditingTask.value = null
  fileInfoList.value = []
  if (formRef.value) {
    formRef.value.restoreValidation()
  }
}

// 删除任务
const handleDeleteTask = async () => {
  if (!currentEditingTask.value?.id) {
    return
  }

  const {dialog} = getDiscreteApi()
  dialog.warning({
    title: t('course.tasks.deleteConfirm'),
    content: t('course.tasks.deleteConfirmContent', {taskName: currentEditingTask.value.taskName}),
    positiveText: t('course.tasks.confirmDelete'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      try {
        saving.value = true
        await CourseTaskApi.removeCourseTaskById(currentEditingTask.value!.id!)
        message.success(t('course.tasks.deleteSuccess'))

        // 重置表单并退出编辑模式
        resetForm()

        // 重新加载任务列表
        await loadTaskList()
      } catch (error) {
      } finally {
        saving.value = false
      }
    }
  })
}

// 取消编辑
const handleCancelEdit = () => {
  resetForm()
}

// 文件处理相关方法
const handleAttachmentChange = (_files: any[]) => {
  // 处理附件变化
}

const handleAttachmentUploadSuccess = (_response: any) => {
  // 处理上传成功
  message.success(t('course.tasks.uploadSuccess'))
}

const handleAttachmentUploadError = (_error: any) => {
  // 处理上传错误
}

const handleUrlsUpdated = async (urls: string[]) => {
  // 确保URL数组不为空且过滤掉无效URL
  const validUrls = urls.filter(url => url && url.trim() !== '')

  if (validUrls.length > 0) {
    // 拼接新URL到现有的attachmentUrls数组中
    const existingUrls = formData.value.attachmentUrls || []
    formData.value.attachmentUrls = [...existingUrls, ...validUrls]

    // 重新加载文件信息
    await loadFileInfo(formData.value.attachmentUrls)

    // 显示成功消息
    message.success(t('course.tasks.attachmentAddedSuccess'))
  } else {
    formData.value.attachmentUrls = []
    fileInfoList.value = []
  }
}

// 加载文件信息
const loadFileInfo = async (urls: string[]) => {
  if (!urls || urls.length === 0) {
    fileInfoList.value = []
    return
  }

  try {
    loadingFileInfo.value = true
    const res = await MinIOApi.getBatchFileInfoByPath({
      filePaths: urls,
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

// 获取文件类型图标
const getFileTypeIcon = (fileInfo: FileInfoDTO) => {
  const extension = fileInfo.fileName.split('.').pop()?.toLowerCase()

  switch (extension) {
    case 'pdf':
      return DocumentTextOutline
    case 'doc':
    case 'docx':
      return BookOutline
    case 'jpg':
    case 'jpeg':
    case 'png':
    case 'gif':
    case 'bmp':
    case 'webp':
      return ImageOutline
    case 'mp4':
    case 'avi':
    case 'mov':
    case 'wmv':
    case 'flv':
      return VideocamOutline
    case 'mp3':
    case 'wav':
    case 'flac':
    case 'aac':
      return MusicalNotesOutline
    case 'zip':
    case 'rar':
    case '7z':
    case 'tar':
    case 'gz':
      return ArchiveOutline
    default:
      return FolderOutline
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

// 文件预览
const handleFilePreview = (fileInfo: FileInfoDTO, event?: MouseEvent) => {
  transitionStore.show()
  runViewTransition(() => {
    router.push({
      name: 'FilePreview',
      query: {
        fileInfo: JSON.stringify(fileInfo),
        from: 'TaskControl',
        courseId: route.params.courseId,
        taskId: route.query.taskId || ''
      }
    })
  }, event)
}

// 删除附件
const handleDeleteAttachment = async (fileInfo: FileInfoDTO) => {
  const {dialog} = getDiscreteApi()
  dialog.warning({
    title: t('course.tasks.deleteAttachmentConfirm'),
    content: t('course.tasks.deleteAttachmentConfirmContent', {fileName: fileInfo.fileName}),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      try {
        // 从MinIO删除文件
        await MinIOApi.deleteFile({
          objectName: fileInfo.objectName,
          bucketCode: BusinessBucketCodeEnum.COURSE_PRIVATE
        })

        // 从文件列表中移除
        const index = fileInfoList.value.findIndex(f => f.objectName === fileInfo.objectName)
        if (index > -1) {
          fileInfoList.value.splice(index, 1)
        }

        // 从表单数据中移除URL
        const urlIndex = formData.value.attachmentUrls?.indexOf(fileInfo.url)
        if (urlIndex !== undefined && urlIndex > -1) {
          formData.value.attachmentUrls?.splice(urlIndex, 1)
        }

        message.success(t('course.tasks.deleteAttachmentSuccess'))
      } catch (error) {
      }
    }
  })
}

// 返回处理
const handleBack = () => {
  router.push(`/course/detail/${courseId.value}/tasks`)
}

// 加载任务列表并处理编辑
const loadTasks = async () => {
  await loadTaskList()

  // 检查是否有需要自动打开的任务
  if (editTaskId.value) {
    await handleEditSpecificTask(editTaskId.value)
  }
}

// 生命周期
onMounted(async () => {
  await loadCourseInfo()
  await loadTasks()
})
</script>

<style lang="scss" scoped>
@use './TaskControl.scss';
</style>
