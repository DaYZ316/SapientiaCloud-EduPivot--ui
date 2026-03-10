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
            <n-radio-group v-model:value="selectedClassroomSize" @update:value="onClassroomSizeChange">
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
                        :min="1"
                        :placeholder="t('classroom.detail.rowsPlaceholder')"
                        style="width:100%;"
                        @update:value="computeCellSizeDetail"
                    />
                  </div>
                  <div class="input-group">
                    <label class="input-label">{{ t('classroom.detail.columns') }}</label>
                    <n-input-number
                        v-model:value="componentCols"
                        :min="1"
                        :placeholder="t('classroom.detail.columnsPlaceholder')"
                        :step="inputStep"
                        style="width:100%;"
                        @update:value="computeCellSizeDetail"
                    />
                  </div>
                </div>
              </div>
              <!-- 座位预览部分 (75% 宽度) -->
              <div class="seating-preview-section">
                <label class="form-label required">{{ t('classroom.detail.seatingPreview') }}</label>
                <div v-if="rows > 0 && cols > 0" ref="seatingPreviewRef" class="seating-preview">
                  <template v-if="classroomType === ClassroomTypeEnum.EXTRA_LARGE">
                    <div class="preview-extra-large-container">
                      <div
                          v-for="(seat, index) in getExtraLargeSeatPositions()"
                          :key="`seat-${index}`"
                          :style="{
                          left: seat.x + 'px',
                          top: seat.y + 'px'
                        }"
                          :title="`${t('classroom.detail.seat')}: ${seat.label}`"
                          class="preview-extra-large-seat"
                      >
                        {{ seat.label }}
                      </div>
                    </div>
                    <p class="preview-info" style="text-align:center;margin-top:8px;">
                      {{ t('classroom.detail.totalSeats', {count: getExtraLargeTotalSeats(rows, cols)}) }}
                    </p>
                  </template>
                  <template v-else-if="classroomType === ClassroomTypeEnum.LARGE">
                    <div class="preview-grid">
                      <div
                          v-for="(_row, rowIndex) in rows"
                          :key="`row-${rowIndex}`"
                          class="preview-large-row"
                      >
                        <div
                            v-for="(_col, colIndex) in (cols/4)"
                            :key="`seat-${rowIndex}-${colIndex}`"
                            class="preview-large-col"
                        >
                          <div
                              v-for="local in 4"
                              :key="local"
                              class="preview-large-seat"
                          >
                            {{ String.fromCharCode(65 + colIndex) }}{{ rowIndex + 1 }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <p class="preview-info" style="text-align:center;margin-top:8px;">
                      {{ t('classroom.detail.totalSeats', {count: rows * cols}) }}
                    </p>
                  </template>
                  <template v-else>
                    <div class="preview-grid">
                      <div
                          v-for="(_row, rowIndex) in rows"
                          :key="`row-${rowIndex}`"
                          class="preview-row"
                      >
                        <div
                            v-for="(_col, colIndex) in cols"
                            :key="`seat-${rowIndex}-${colIndex}`"
                            :style="{ width: cellSizeDetail + 'px', height: cellSizeDetail + 'px' }"
                            :title="`${t('classroom.detail.seat')}: ${String.fromCharCode(65 + colIndex)}${rowIndex + 1}`"
                            class="preview-seat"
                        >
                          {{ String.fromCharCode(65 + colIndex) }}{{ rowIndex + 1 }}
                        </div>
                      </div>
                    </div>
                    <p class="preview-info">{{ t('classroom.detail.totalSeats', {count: rows * cols}) }}</p>
                  </template>
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
import {computed, onBeforeUnmount, onMounted, reactive, ref} from 'vue'
import {useDialog, useMessage} from 'naive-ui'
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {
  Book,
  BusinessOutline,
  CheckmarkOutline,
  CreateOutline,
  Grid,
  HomeOutline,
  LibraryOutline,
  LogInOutline,
  SchoolOutline,
  TrashOutline
} from '@vicons/ionicons5'
import eventBus from '@/utils/eventBus'
import {
  addCourseRecord,
  getCourseRecordById,
  getDefaultCourseRecordDTO,
  removeCourseRecordById,
  updateCourseRecord
} from '@/api/classroom/courseRecord'
import {listStudentsByRecordId} from '@/api/classroom/courseRecordStudent'
import {useCourseStore, useUserStore} from '@/store'
import {useTransitionStore} from '@/store/modules/transition'
import type {CourseRecordDTO, CourseRecordVO} from '@/types/classroom'
import {getClassroomTypeFromString, getClassroomTypeString, ClassroomTypeEnum} from '@/enum/classroom/classroomTypeEnum'
import {runViewTransition} from '@/utils/themeAnimation'
import {getExtraLargeTotalSeats} from '@/views/classroom/composables/useSeatLayout'

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
const classroomType = ref<number | null>(null)
const isSubmitting = ref(false)
const isDeleting = ref(false)
const lastConfirmedClassroomSize = ref<string>('classroomMini')

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
    capacity: 64,
    features: t('classroom.detail.classroomMediumFeatures'),
    icon: BusinessOutline
  },
  {
    value: 'classroomPro',
    name: t('classroom.detail.classroomPro'),
    capacity: 160,
    features: t('classroom.detail.classroomProFeatures'),
    icon: SchoolOutline
  },
  {
    value: 'classroomPromax',
    name: t('classroom.detail.classroomPromax'),
    capacity: 250,
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
function applyClassroomSizeChange(newSize: string) {
  // 根据教室大小调整默认座位数
  switch (newSize) {
    case 'classroomMini':
      rows.value = 4
      cols.value = 3
      break
    case 'classroomMedium':
      rows.value = 8
      cols.value = 8
      break
    case 'classroomPro':
      rows.value = 10
      cols.value = 16
      break
    case 'classroomPromax':
      rows.value = 10
      cols.value = 16
      break
    default:
      rows.value = 4
      cols.value = 3
  }
  // 更新对应的 classroomType，确保预览渲染逻辑使用正确类型
  classroomType.value = getClassroomTypeFromString(newSize)
  // 重新计算预览格子尺寸以响应式适配新规格
  computeCellSizeDetail()
}

async function onClassroomSizeChange(newSize: string) {
  const prevSize = String(lastConfirmedClassroomSize.value || 'classroomMini')
  const nextSize = String(newSize || selectedClassroomSize.value || 'classroomMini')

  if (prevSize === nextSize) {
    return
  }

  // 仅在“修改模式”下拦截：若已有学生入座，切换教室类型会初始化座位情况
  if (isEditMode.value && courseRecordId.value) {
    try {
      const resp = await listStudentsByRecordId(courseRecordId.value)
      const list: any[] = (resp as any)?.data ?? (resp as any) ?? []
      const hasSeatedStudents = list.some((s: any) => s?.seatIndex !== null && typeof s?.seatIndex !== 'undefined')
      if (hasSeatedStudents) {
        selectedClassroomSize.value = prevSize
        dialog.warning({
          title: t('classroom.detail.changeClassroomTypeConfirmTitle'),
          content: t('classroom.detail.changeClassroomTypeConfirmContent'),
          positiveText: t('classroom.detail.changeClassroomTypeConfirmContinue'),
          negativeText: t('common.cancel'),
          onPositiveClick: () => {
            lastConfirmedClassroomSize.value = nextSize
            selectedClassroomSize.value = nextSize
            applyClassroomSizeChange(nextSize)
          }
        })
        return
      }
    } catch {
      // 静默处理：查询失败时不阻断用户操作
    }
  }

  lastConfirmedClassroomSize.value = nextSize
  applyClassroomSizeChange(nextSize)
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
  lastConfirmedClassroomSize.value = 'classroomMini'
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


// Responsive sizing for preview in detail
const seatingPreviewRef = ref<HTMLElement | null>(null);
const CELL_MIN_D = 28;
const CELL_MAX_D = 72;
const GAP_D = 8;
const cellSizeDetail = ref<number>(44);

const computeCellSizeDetail = () => {
  const container = seatingPreviewRef.value;
  if (!container) return;
  const padding = 0; // container padding if any
  const available = Math.max(0, container.clientWidth - padding);
  const colsCount = cols.value || 1;
  const size = Math.floor((available - (colsCount - 1) * GAP_D) / colsCount);
  cellSizeDetail.value = Math.max(CELL_MIN_D, Math.min(CELL_MAX_D, size));
};

onMounted(() => {
  // existing onMounted logic above will run; attach resize listener for preview sizing
  computeCellSizeDetail();
  window.addEventListener('resize', computeCellSizeDetail);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', computeCellSizeDetail);
});

// component count for LARGE preview (number of components per row)
// When classroom is LARGE, the UI's columns input should represent model/component count (each component = 4 seats).
const componentCols = computed<number>({
  get() {
    return cols.value || 1;
  },
  set(v: number) {
    const raw = Number(v) || 0;
    if (classroomType.value === ClassroomTypeEnum.EXTRA_LARGE) {
      // round to nearest integer first
      let n = Math.round(raw);
      // if odd, pick nearest even (四舍五入到最近偶数)
      if (n % 2 !== 0) {
        const down = n - 1;
        const up = n + 1;
        n = Math.abs(raw - down) <= Math.abs(up - raw) ? down : up;
      }
      // ensure at least 2 columns for even layout
      cols.value = Math.max(2, n);
    } else {
      cols.value = Math.max(1, Math.round(raw));
    }
    // recompute preview sizing after change
    computeCellSizeDetail();
  }
});

const inputStep = computed(() => {
  if (classroomType.value === ClassroomTypeEnum.LARGE) {
    return 4;
  } else if (classroomType.value === ClassroomTypeEnum.EXTRA_LARGE) {
    return 2;
  }
  return 1;
});

const getExtraLargeSeatPositions = () => {
  const positions: Array<{ x: number, y: number, label: string, ring: number }> = [];

  // Parameters based on calculateExtraLargeSeatPosition logic
  const outerRadius = 29.6;
  const innerRadius = 11.8;
  const angleSpanDeg = 120;
  const angleStart = (180 - (180 - angleSpanDeg) / 2) * Math.PI / 180;

  // Compute radii for each ring
  const radii: number[] = [];
  for (let r = 0; r < 10; r++) {
    const t = r / 9;
    radii.push(innerRadius + t * (outerRadius - innerRadius));
  }

  // Calculate total seats based on classroom type
  // For EXTRA_LARGE classroom: cols represents seats in first row, each subsequent row adds 2 seats
  const totalSeats = getExtraLargeTotalSeats(rows.value || 0, cols.value || 0);
  let seatIndex = 0;

  // use preview container size if available to fit layout to outer frame
  const container = seatingPreviewRef.value;
  const containerWidth = container ? Math.max(100, container.clientWidth) : 300;
  const containerHeight = container ? Math.max(100, container.clientHeight) : 300;
  const minSide = Math.min(containerWidth, containerHeight);
  // leave some padding inside the frame
  const padding = Math.max(16, Math.floor(minSide * 0.06));
  const usableSize = minSide - padding * 2;

  // scale so outerRadius maps to ~usableSize/2
  const scale = usableSize / (outerRadius * 2);
  const centerX = containerWidth / 2;
  const centerY = containerHeight / 2;

  // Process each seat
  while (seatIndex < totalSeats) {
    let remaining = seatIndex + 1;
    let count = Math.max(1, cols.value || 1);
    let ring = 0;

    // Find which ring this seat belongs to
    while (remaining > count) {
      remaining -= count;
      count += 2;
      ring++;
      if (ring >= radii.length) break;
    }

    if (ring < radii.length) {
      const radius = radii[ring];
      let angle = angleStart;
      const angleSpan = (angleSpanDeg * Math.PI) / 180 / (count + 1);
      const angleMedium = angleStart - angleSpan * Math.floor(count / 2);

      remaining -= 0.5;
      if (remaining <= count / 2) {
        angle = angleStart - (angleSpan * remaining);
      } else {
        remaining -= count / 2;
        angle = angleMedium - (angleSpan * remaining);
        remaining += count / 2;
      }

      // Convert polar to cartesian (for 2D preview)
      const x = Math.cos(angle) * radius + 2;
      const z = -Math.sin(angle) * radius + 14;

      const previewX = centerX + x * scale * 4;
      const previewY = centerY - z * scale * 4; // Flip Y axis for screen coordinates

      // Generate seat label
      const rowNum = ring;
      const colNum = remaining + 0.5;
      const label = `${String.fromCharCode(65 + (rowNum % 26))}${colNum}`;

      positions.push({
        x: previewX,
        y: previewY,
        label,
        ring
      });
    }

    seatIndex++;
  }

  return positions;
};

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
    lastConfirmedClassroomSize.value = String(selectedClassroomSize.value || 'classroomMini')
    if (data.layoutRows) {
      rows.value = data.layoutRows
    }
    if (data.layoutColumns) {
      cols.value = data.layoutColumns
    }
    classroomType.value = data.classroomType ?? classroomType.value
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

  // 页面初始化时如果已有 courseRecordId，则从后端获取座位信息并更新（用于预览）
  if (courseRecordId.value) {
    loadCourseRecordData(courseRecordId.value).catch(err => {
      console.warn('初始化获取教室座位信息失败:', err);
    });
  }
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