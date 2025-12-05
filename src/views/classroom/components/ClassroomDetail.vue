<template>
  <div class="classroom-preparation">
    <div class="form-container">
      <!-- 合并的表单卡片 -->
      <div class="form-section">
        <!-- 课程信息填写区域 -->
        <div class="form-subsection">
          <div class="subsection-header">
            <h4 class="subsection-title">
              <n-icon>
                <Book/>
              </n-icon>
              {{ t('classroom.detail.basicInfo') }}
            </h4>
            <n-space>
              <n-button
                  v-if="isEditMode"
                  :loading="isDeleting"
                  type="error"
                  @click="handleDeleteCourseRecord"
              >
                <template #icon>
                  <n-icon>
                    <TrashOutline/>
                  </n-icon>
                </template>
                {{ t('classroom.detail.deleteCourse') }}
              </n-button>
              <n-button
                  v-if="isEditMode"
                  :loading="isCancelling"
                  @click="handleCancelCourseRecord"
              >
                <template #icon>
                  <n-icon>
                    <CloseOutline/>
                  </n-icon>
                </template>
                {{ t('classroom.detail.cancelCourse') }}
              </n-button>
              <n-button
                  :loading="isSubmitting"
                  type="info"
                  @click="submitForm"
              >
                <template #icon>
                  <n-icon>
                    <CheckmarkOutline v-if="!isEditMode"/>
                    <CreateOutline v-else/>
                  </n-icon>
                </template>
                {{ isEditMode ? t('classroom.detail.updateCourse') : t('classroom.detail.publishCourse') }}
              </n-button>
              <div v-if="isEditMode && courseRecordId" class="tech-button-wrapper">
                <div class="tech-button-border"></div>
                <div class="tech-button-glow"></div>
                <n-button
                    class="tech-button"
                    type="primary"
                    @click="handleEnterClassroomFromDetail($event)"
                >
                  <template #icon>
                    <n-icon>
                      <LogInOutline/>
                    </n-icon>
                  </template>
                  {{ t('classroom.enterClassroom') }}
                </n-button>
              </div>
            </n-space>
          </div>

          <!-- 课程名称 -->
          <div class="form-group">
            <label class="form-label required">{{ t('classroom.detail.courseName') }}</label>
            <n-input
                v-model:value="courseName"
                :maxlength="50"
                :placeholder="t('classroom.detail.courseNamePlaceholder')"
                show-count
                @blur="validateCourseName"
            />
            <div v-if="errors.courseName" class="error-message">{{ errors.courseName }}</div>
          </div>

          <!-- 课程时间 -->
          <div class="form-group time-group">
            <div class="time-item">
              <label class="form-label required">{{ t('classroom.detail.startTime') }}</label>
              <n-date-picker
                  v-model:value="startTime"
                  :placeholder="t('classroom.detail.startTimePlaceholder')"
                  style="width: 100%"
                  type="datetime"
                  @update:value="validateStartTime"
              />
              <div v-if="errors.startTime" class="error-message">{{ errors.startTime }}</div>
            </div>
            <div class="time-item">
              <label class="form-label required">{{ t('classroom.detail.endTime') }}</label>
              <n-date-picker
                  v-model:value="endTime"
                  :placeholder="t('classroom.detail.endTimePlaceholder')"
                  style="width: 100%"
                  type="datetime"
                  @update:value="validateEndTime"
              />
              <div v-if="errors.endTime" class="error-message">{{ errors.endTime }}</div>
            </div>
          </div>

          <!-- 课程简介 -->
          <div class="form-group">
            <label class="form-label">{{ t('classroom.detail.courseDescription') }}</label>
            <n-input
                v-model:value="courseDescription"
                :maxlength="200"
                :minlength="0"
                :placeholder="t('classroom.detail.courseDescriptionPlaceholder')"
                :rows="4"
                show-count
                type="textarea"
                @blur="validateCourseDescription"
            />
            <div v-if="errors.courseDescription" class="error-message">{{ errors.courseDescription }}</div>
          </div>
        </div>

        <!-- 分隔线 -->
        <div class="subsection-divider"></div>

        <!-- 教室配置区域 -->
        <div class="form-subsection">
          <h4 class="subsection-title">
            <n-icon>
              <Grid/>
            </n-icon>
            {{ t('classroom.detail.classroomConfig') }}
          </h4>

          <!-- 教室规格选择 -->
          <div class="form-group">
            <label class="form-label required">{{ t('classroom.detail.classroomSize') }}</label>
            <n-radio-group v-model:value="selectedClassroomSize" @change="onClassroomSizeChange">
              <div class="classroom-specs-container">
                <div v-for="spec in classroomSpecs" :key="spec.value" class="classroom-spec-card">
                  <n-radio-button :class="['spec-radio', { 'active': selectedClassroomSize === spec.value }]"
                                  :value="spec.value">
                    <div v-if="selectedClassroomSize === spec.value" class="spec-checkmark">
                      <n-icon :component="CheckmarkOutline" class="checkmark-icon"/>
                    </div>
                    <div class="spec-content">
                      <div class="spec-header">
                        <div class="spec-icon-wrapper">
                          <n-icon :component="spec.icon" class="spec-icon"/>
                        </div>
                        <div class="spec-name">{{ spec.name }}</div>
                      </div>
                      <div class="spec-details">
                        <div class="spec-capacity">
                          <span class="capacity-label">{{ t('classroom.detail.capacity') }}</span>
                          <span class="capacity-value">{{ spec.capacity }}</span>
                          <span class="capacity-unit">{{ t('classroom.detail.people') }}</span>
                        </div>
                        <div class="spec-features">{{ spec.features }}</div>
                      </div>
                    </div>
                  </n-radio-button>
                </div>
              </div>
            </n-radio-group>
          </div>

          <!-- 座位排布设置和预览 -->
          <div class="form-group seating-arrangement-group">
            <div class="seating-layout-container">
              <!-- 座位排布设置部分 (25% 宽度) -->
              <div class="seating-settings-section">
                <label class="form-label required">{{ t('classroom.detail.seatingArrangement') }}</label>
                <div class="vertical-inputs">
                  <div class="input-group">
                    <label class="input-label">{{ t('classroom.detail.rows') }}</label>
                    <n-input-number
                        v-model:value="rows"
                        :placeholder="t('classroom.detail.rowsPlaceholder')"
                    />
                  </div>
                  <div class="input-group">
                    <label class="input-label">{{ t('classroom.detail.columns') }}</label>
                    <n-input-number
                        v-model:value="cols"
                        :placeholder="t('classroom.detail.columnsPlaceholder')"
                    />
                  </div>
                </div>
              </div>
              <!-- 座位预览部分 (75% 宽度) -->
              <div class="seating-preview-section">
                <label class="form-label required">{{ t('classroom.detail.seatingPreview') }}</label>
                <div v-if="rows > 0 && cols > 0" class="seating-preview">
                  <div class="preview-grid">
                    <div
                        v-for="(_row, rowIndex) in rows"
                        :key="`row-${rowIndex}`"
                        class="preview-row"
                    >
                      <div
                          v-for="(_col, colIndex) in cols"
                          :key="`seat-${rowIndex}-${colIndex}`"
                          :title="`${t('classroom.detail.seat')}: ${String.fromCharCode(65 + colIndex)}${rowIndex + 1}`"
                          class="preview-seat"
                      >
                        {{ String.fromCharCode(65 + colIndex) }}{{ rowIndex + 1 }}
                      </div>
                    </div>
                  </div>
                  <p class="preview-info">{{ t('classroom.detail.totalSeats', { count: rows * cols }) }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, reactive, computed, onMounted, onBeforeUnmount} from 'vue'
import {useMessage, useDialog} from 'naive-ui'
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {
  Book,
  Grid,
  TrashOutline,
  CheckmarkOutline,
  CreateOutline,
  CloseOutline,
  LogInOutline,
  HomeOutline,
  BusinessOutline,
  SchoolOutline,
  LibraryOutline
} from '@vicons/ionicons5'
import eventBus from '@/utils/eventBus'
import {
  addCourseRecord,
  updateCourseRecord,
  getCourseRecordById,
  getDefaultCourseRecordDTO,
  removeCourseRecordById
} from '@/api/classroom/courseRecord'
import {useUserStore, useCourseStore} from '@/store'
import {useTransitionStore} from '@/store/modules/transition'
import type {CourseRecordDTO, CourseRecordVO} from '@/types/classroom'
import {getClassroomTypeFromString, getClassroomTypeString} from '@/enum/classroom/classroomTypeEnum'
import {CourseRecordStatusEnum} from '@/enum/classroom/courseRecordStatusEnum'
import {runViewTransition} from '@/utils/themeAnimation'

interface Props {
  courseId: string
}

const props = defineProps<Props>()

const {t} = useI18n()
const message = useMessage()
const dialog = useDialog()
const router = useRouter()
const userStore = useUserStore()
const courseStore = useCourseStore()
const transitionStore = useTransitionStore()

// 表单数据
const courseName = ref('')
const courseDescription = ref('')
const startTime = ref<number | null>(null)
const endTime = ref<number | null>(null)

// 教室配置
const selectedClassroomSize = ref('classroomMini') // 默认选中小型教室
const rows = ref(4) // 默认4行
const cols = ref(3) // 默认3列
const isSubmitting = ref(false)
const isDeleting = ref(false)
const isCancelling = ref(false)

// 课程记录ID，用于区分创建和修改状态
const courseRecordId = ref<string | null>(null)
// 创建/修改状态标识
const isEditMode = computed(() => !!courseRecordId.value)
// 创建的记录ID
const createdRecordId = ref<string | null>(null)

// 教室规格配置
const classroomSpecs = computed(() => [
  {
    value: 'classroomMini',
    name: t('classroom.detail.classroomMini'),
    capacity: 12,
    features: t('classroom.detail.classroomMiniFeatures'),
    icon: HomeOutline
  },
  {
    value: 'classroomMedium',
    name: t('classroom.detail.classroomMedium'),
    capacity: 24,
    features: t('classroom.detail.classroomMediumFeatures'),
    icon: BusinessOutline
  },
  {
    value: 'classroomPro',
    name: t('classroom.detail.classroomPro'),
    capacity: 48,
    features: t('classroom.detail.classroomProFeatures'),
    icon: SchoolOutline
  },
  {
    value: 'classroomPromax',
    name: t('classroom.detail.classroomPromax'),
    capacity: 80,
    features: t('classroom.detail.classroomPromaxFeatures'),
    icon: LibraryOutline
  }
])

// 表单验证错误
const errors = reactive({
  courseName: '',
  courseDescription: '',
  startTime: '',
  endTime: ''
})

// 表单验证
const validateCourseName = () => {
  if (!courseName.value.trim()) {
    errors.courseName = t('classroom.detail.courseNameRequired')
    return false
  } else if (courseName.value.trim().length < 2) {
    errors.courseName = t('classroom.detail.courseNameMinLength')
    return false
  } else {
    errors.courseName = ''
    return true
  }
}

const validateCourseDescription = () => {
  if (courseDescription.value.trim().length > 200) {
    errors.courseDescription = t('classroom.detail.courseDescriptionMaxLength')
    return false
  } else {
    errors.courseDescription = ''
    return true
  }
}

const validateStartTime = () => {
  if (!startTime.value) {
    errors.startTime = t('classroom.detail.startTimeRequired')
    return false
  } else {
    errors.startTime = ''
    // 如果结束时间已填写，验证结束时间是否晚于开始时间
    if (endTime.value && endTime.value <= startTime.value) {
      validateEndTime()
    }
    return true
  }
}

const validateEndTime = () => {
  if (!endTime.value) {
    errors.endTime = t('classroom.detail.endTimeRequired')
    return false
  } else if (startTime.value && endTime.value <= startTime.value) {
    errors.endTime = t('classroom.detail.endTimeAfterStartTime')
    return false
  } else {
    errors.endTime = ''
    return true
  }
}

const isFormValid = computed(() => {
  return courseName.value.trim().length >= 2 &&
      courseDescription.value.trim().length <= 200 &&
      startTime.value !== null &&
      endTime.value !== null &&
      endTime.value > startTime.value
})

// 教室大小变化处理
function onClassroomSizeChange(newSize: string) {
  // 根据教室大小调整默认座位数
  switch (newSize) {
    case 'classroomMini':
      rows.value = 4
      cols.value = 3
      break
    case 'classroomMedium':
      rows.value = 6
      cols.value = 4
      break
    case 'classroomPro':
      rows.value = 8
      cols.value = 6
      break
    case 'classroomPromax':
      rows.value = 10
      cols.value = 8
      break
    default:
      rows.value = 6
      cols.value = 3
  }
}


// 提交表单
async function submitForm() {
  // 验证所有必填字段
  const isNameValid = validateCourseName()
  const isDescriptionValid = validateCourseDescription()
  const isStartTimeValid = validateStartTime()
  const isEndTimeValid = validateEndTime()

  if (!isNameValid || !isDescriptionValid || !isStartTimeValid || !isEndTimeValid) {
    return
  }

  if (!isFormValid.value) {
    return
  }

  isSubmitting.value = true

  try {
    // 构建课程记录数据
    const courseRecordData: CourseRecordDTO = getDefaultCourseRecordDTO()
    courseRecordData.id = courseRecordId.value
    courseRecordData.courseId = courseStore.currentCourseId
    courseRecordData.teacherId = userStore.teacherInfo?.id || null
    courseRecordData.courseName = courseName.value.trim() || null
    courseRecordData.courseDescription = courseDescription.value.trim() || null
    courseRecordData.layoutRows = rows.value
    courseRecordData.layoutColumns = cols.value
    courseRecordData.classroomType = getClassroomTypeFromString(selectedClassroomSize.value)
    courseRecordData.startTime = startTime.value ? new Date(startTime.value).toISOString() : null
    courseRecordData.overTime = endTime.value ? new Date(endTime.value).toISOString() : null

    // 根据状态调用不同的API
    let recordId: string | null = null
    if (isEditMode.value) {
      // 修改课程
      await updateCourseRecord(courseRecordData)
      message.success(t('classroom.detail.updateSuccess'))
      // 触发事件，更新课程历史记录列表
      eventBus.emit('refreshClassroomHistory')
    } else {
      // 创建课程
      const response = await addCourseRecord(courseRecordData)
      recordId = response.data?.id || null

      if (recordId) {
        // 保存创建的记录ID，显示成功对话框询问是否进入
        createdRecordId.value = recordId
        dialog.success({
          title: t('classroom.detail.createSuccess'),
          content: t('classroom.detail.enterClassroomContent'),
          positiveText: t('classroom.detail.enterClassroom'),
          negativeText: t('classroom.detail.stayHere'),
          onPositiveClick: () => {
            handleEnterClassroom()
          },
          onNegativeClick: () => {
            handleStayHere()
          }
        })
      }
    }
  } catch (error) {
    console.error('提交表单失败:', error)
  } finally {
    isSubmitting.value = false
  }
}

// 重置表单数据到初始状态
function resetFormData() {

  // 重置课程信息
  courseName.value = ''
  courseDescription.value = ''
  startTime.value = null
  endTime.value = null

  // 重置教室配置
  selectedClassroomSize.value = 'classroomMini'
  rows.value = 4
  cols.value = 3

  // 清除错误提示
  errors.courseName = ''
  errors.courseDescription = ''

  // 重置提交状态
  isSubmitting.value = false

  // 清除课程记录ID，切换到创建模式
  courseRecordId.value = null
}

// 处理留在此页
function handleStayHere() {
  createdRecordId.value = null
  // 重置表单，准备创建下一个课程
  resetFormData()
  // 触发事件，更新课程历史记录列表
  eventBus.emit('refreshClassroomHistory')
  message.success(t('classroom.detail.createSuccess'))
}

// 统一的进入智慧教室导航（带全局过渡动画）
function navigateToClassroom(recordId: string, e?: MouseEvent) {
  transitionStore.show()
  const action = () => {
    router.push({
      name: 'Classroom3D',
      params: {
        courseId: props.courseId,
        courseRecordId: recordId
      }
    })
  }
  runViewTransition(action, e)
}

// 处理进入智慧教室（创建完成后的对话框）
function handleEnterClassroom() {
  if (createdRecordId.value) {
    const recordId = createdRecordId.value
    createdRecordId.value = null
    message.success(t('classroom.detail.createSuccess'))
    navigateToClassroom(recordId)
  }
}

// 处理从详情页进入教室
function handleEnterClassroomFromDetail(e: MouseEvent) {
  if (courseRecordId.value) {
    navigateToClassroom(courseRecordId.value, e)
  }
}

// 处理删除课程记录
function handleDeleteCourseRecord() {
  if (!courseRecordId.value) {
    return
  }

  dialog.warning({
    title: t('classroom.detail.deleteCourse'),
    content: t('classroom.detail.deleteConfirm'),
    positiveText: t('classroom.detail.deleteConfirmText'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      isDeleting.value = true
      try {
        await removeCourseRecordById(courseRecordId.value!)
        message.success(t('classroom.detail.deleteSuccess'))
        // 重置表单
        resetFormData()
        // 触发事件，更新课程历史记录列表
        eventBus.emit('refreshClassroomHistory')
        return true
      } catch (error) {
        return false
      } finally {
        isDeleting.value = false
      }
    }
  })
}

// 处理取消课程记录
function handleCancelCourseRecord() {
  if (!courseRecordId.value) {
    return
  }

  dialog.warning({
    title: t('classroom.detail.cancelCourse'),
    content: t('classroom.detail.cancelConfirm'),
    positiveText: t('classroom.detail.cancelConfirmText'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      isCancelling.value = true
      try {
        // 构建课程记录数据，使用表单中已有的数据
        const courseRecordData: CourseRecordDTO = getDefaultCourseRecordDTO()
        courseRecordData.id = courseRecordId.value
        courseRecordData.courseId = courseStore.currentCourseId
        courseRecordData.teacherId = userStore.teacherInfo?.id || null
        courseRecordData.courseName = courseName.value.trim() || null
        courseRecordData.courseDescription = courseDescription.value.trim() || null
        courseRecordData.layoutRows = rows.value
        courseRecordData.layoutColumns = cols.value
        courseRecordData.classroomType = getClassroomTypeFromString(selectedClassroomSize.value)
        courseRecordData.startTime = startTime.value ? new Date(startTime.value).toISOString() : null
        courseRecordData.overTime = endTime.value ? new Date(endTime.value).toISOString() : null
        // 更新状态为取消
        courseRecordData.status = CourseRecordStatusEnum.CANCELLED

        await updateCourseRecord(courseRecordData)
        message.success(t('classroom.detail.cancelSuccess'))
        // 触发事件，更新课程历史记录列表
        eventBus.emit('refreshClassroomHistory')
        return true
      } catch (error) {
        return false
      } finally {
        isCancelling.value = false
      }
    }
  })
}


// 加载课程记录数据
async function loadCourseRecordData(id: string) {
  try {
    const response = await getCourseRecordById(id)
    const data: CourseRecordVO = response.data || response // 根据实际API返回格式调整

    // 填充表单数据
    courseName.value = data.courseName || ''
    courseDescription.value = data.courseDescription || ''
    startTime.value = data.startTime ? new Date(data.startTime).getTime() : null
    endTime.value = data.overTime ? new Date(data.overTime).getTime() : null
    // 填充其他相关数据
    selectedClassroomSize.value = getClassroomTypeString(data.classroomType)
    if (data.layoutRows) {
      rows.value = data.layoutRows
    }
    if (data.layoutColumns) {
      cols.value = data.layoutColumns
    }
  } catch (error) {
    console.error('加载课程数据失败:', error)
    // 加载失败时重置表单
    resetFormData()
  }
}

// 生命周期钩子
onMounted(() => {
  // 注册事件监听器，监听重置信号
  eventBus.on('resetClassroomDetail', () => {
    resetFormData()
  })

  // 注册事件监听器，监听课程记录选择信号
  eventBus.on('selectCourseRecord', (data) => {
    if (data && data.id) {
      courseRecordId.value = data.id
      loadCourseRecordData(data.id)
    }
  })
})

onBeforeUnmount(() => {
  // 移除事件监听器，避免内存泄漏
  eventBus.off('resetClassroomDetail')
  eventBus.off('selectCourseRecord')
})
</script>

<style lang="scss" scoped>
@use './ClassroomDetail.scss';
</style>