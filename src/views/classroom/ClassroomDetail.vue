<template>
  <div class="classroom-preparation">
    <h2 class="page-title">3D教室课前准备</h2>
    
    <div class="form-container">
      <!-- 课程信息填写区域 -->
      <div class="form-section">
        <h3 class="section-title">
          <n-icon><Book /></n-icon>
          课程基本信息
        </h3>
        
        <!-- 课程名称 -->
        <div class="form-group">
          <label class="form-label required">课程名称</label>
          <n-input
            v-model:value="courseName"
            :placeholder="'请输入课程名称'"
            :maxlength="50"
            show-count
            @blur="validateCourseName"
          />
          <div v-if="errors.courseName" class="error-message">{{ errors.courseName }}</div>
        </div>
        
        <!-- 课程简介 -->
        <div class="form-group">
          <label class="form-label required">课程简介</label>
          <n-input
            v-model:value="courseDescription"
            type="textarea"
            :placeholder="'请输入课程简介（100-200字）'"
            :minlength="0"
            :maxlength="200"
            show-count
            :rows="4"
            @blur="validateCourseDescription"
          />
          <div v-if="errors.courseDescription" class="error-message">{{ errors.courseDescription }}</div>
          <div class="helper-text">建议长度：100-200字</div>
        </div>
        
        <!-- 备注信息 -->
        <div class="form-group">
          <label class="form-label">备注信息</label>
          <n-input
            v-model:value="courseNotes"
            type="textarea"
            :placeholder="'请输入备注信息（可选）'"
            :maxlength="500"
            show-count
            :rows="3"
          />
        </div>
      </div>
      
      <!-- 教室配置区域 -->
      <div class="form-section">
        <h3 class="section-title">
          <n-icon><Grid /></n-icon>
          教室配置
        </h3>
        
        <!-- 教室规格选择 -->
        <div class="form-group">
          <label class="form-label required">教室规格</label>
          <n-radio-group v-model:value="selectedClassroomSize" @change="onClassroomSizeChange">
            <div class="classroom-specs-container">
              <div class="classroom-spec-card" v-for="spec in classroomSpecs" :key="spec.value">
                <n-radio-button :value="spec.value" :class="['spec-radio', { 'active': selectedClassroomSize === spec.value }]">
                  <div class="spec-content">
                    <div class="spec-name">{{ spec.name }}</div>
                    <div class="spec-details">
                      <div class="spec-capacity">容量：{{ spec.capacity }} 人</div>
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
              <label class="form-label required">座位排布设置</label>
              <div class="vertical-inputs">
                <div class="input-group">
                  <label class="input-label">行数</label>
                  <n-input-number
                    v-model:value="rows"
                    placeholder="请输入行数"
                  />
                </div>
                <div class="input-group">
                  <label class="input-label">列数</label>
                  <n-input-number
                    v-model:value="cols"
                    placeholder="请输入列数"
                  />
                </div>
              </div>
            </div>
            <!-- 座位预览部分 (75% 宽度) -->
            <div class="seating-preview-section">
              <label class="form-label required">座位排布预览</label>
              <div v-if="rows > 0 && cols > 0" class="seating-preview">              
                <div class="preview-grid">
                  <div 
                    v-for="(row, rowIndex) in rows" 
                    :key="`row-${rowIndex}`" 
                    class="preview-row"
                  >
                    <div 
                      v-for="(col, colIndex) in cols" 
                      :key="`seat-${rowIndex}-${colIndex}`" 
                      class="preview-seat"
                      :title="`座位: ${String.fromCharCode(65 + colIndex)}${rowIndex + 1}`"
                    >
                      {{ String.fromCharCode(65 + colIndex) }}{{ rowIndex + 1 }}
                    </div>
                  </div>
                </div>
                <p class="preview-info">共 {{ rows * cols }} 个座位</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    
    <!-- 操作按钮区域 -->
    <div class="action-buttons">
      <n-button @click="handleCancel" :disabled="isSubmitting" class="cancel-button">
        <n-icon><ArrowBack /></n-icon>
        返回
      </n-button>
      <n-button type="primary" @click="submitForm" :loading="isSubmitting" :disabled="isSubmitting || !isFormValid">
        <template #icon v-if="!isSubmitting">
          <component :is="isEditMode ? Pencil : Open" />
        </template>
        <template #icon v-else><Refresh /></template>
        {{ isSubmitting 
          ? (isEditMode ? '正在保存修改...' : '正在创建课程...') 
          : (isEditMode ? '修改课程' : '创建课程') 
        }}
      </n-button>
    </div>
    
    <!-- 自动保存提示 -->
    <div v-if="lastSavedTime" class="auto-save-notification">
      <n-icon size="14"><Save /></n-icon>
      <span>自动保存于 {{ lastSavedTime }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted, onBeforeUnmount } from 'vue'
import { useMessage } from 'naive-ui'
import { useRouter} from 'vue-router'
import { Book, Grid, ArrowBack, Open, Refresh, Save, Pencil } from '@vicons/ionicons5'
import eventBus from '@/utils/eventBus'
import { addCourseRecord, updateCourseRecord, getCourseRecordById } from '@/api/classroom/courseRecord'
import { useUserStore, useCourseStore } from '@/store'

interface Props {
  courseId: string
}

const props = defineProps<Props>()

const message = useMessage()
const router = useRouter()
const userStore = useUserStore()
const courseStore = useCourseStore()

// 表单数据
const courseName = ref('')
const courseDescription = ref('')
const courseNotes = ref('')

// 教室配置
const selectedClassroomSize = ref('classroomMini') // 默认选中小型教室
const rows = ref(4) // 默认4行
const cols = ref(3) // 默认3列
const isSubmitting = ref(false)
const lastSavedTime = ref('')
let autoSaveTimer: number | null = null

// 课程记录ID，用于区分创建和修改状态
const courseRecordId = ref<string | null>(null)
// 创建/修改状态标识
const isEditMode = computed(() => !!courseRecordId.value)

// 教室规格配置
const classroomSpecs = [
  {
    value: 'classroomMini',
    name: '小型教室',
    capacity: 12,
    features: '适合小组讨论，配置基础教学工具'
  },
  {
    value: 'classroomMedium',
    name: '中型教室',
    capacity: 24,
    features: '标准教学环境，配备多媒体设备'
  },
  {
    value: 'classroomPro',
    name: '大型教室',
    capacity: 48,
    features: '多媒体教学，支持分组活动'
  },
  {
    value: 'classroomPromax',
    name: '超大型教室',
    capacity: 80,
    features: '高级教学环境，全景互动，分组讨论'
  }
]

// 表单验证错误
const errors = reactive({
  courseName: '',
  courseDescription: ''
})

// 表单验证
const validateCourseName = () => {
  if (!courseName.value.trim()) {
    errors.courseName = '请输入课程名称'
    return false
  } else if (courseName.value.trim().length < 2) {
    errors.courseName = '课程名称至少需要2个字符'
    return false
  } else {
    errors.courseName = ''
    return true
  }
}

const validateCourseDescription = () => {
if (courseDescription.value.trim().length > 200) {
    errors.courseDescription = '课程简介不能超过200个字符'
    return false
  } else {
    errors.courseDescription = ''
    return true
  }
}

const isFormValid = computed(() => {
  return courseName.value.trim().length >= 2 && 
         courseDescription.value.trim().length <= 200
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

// 自动保存功能
function autoSaveForm() {
  if (!courseName.value && !courseDescription.value && !courseNotes.value) {
    return // 无需保存空表单
  }
  
  const formData = {
    courseName: courseName.value,
    courseDescription: courseDescription.value,
    courseNotes: courseNotes.value,
    classroomSize: selectedClassroomSize.value,
    rows: rows.value,
    cols: cols.value
  }
  
  // 保存到localStorage
  try {
    localStorage.setItem('classroomPreparationForm', JSON.stringify(formData))
    lastSavedTime.value = new Date().toLocaleTimeString()
  } catch (error) {
    console.error('自动保存失败:', error)
  }
}

// 恢复自动保存的表单数据
function restoreSavedForm() {
  try {
    const savedData = localStorage.getItem('classroomPreparationForm')
    if (savedData) {
      const formData = JSON.parse(savedData)
      courseName.value = formData.courseName || ''
      courseDescription.value = formData.courseDescription || ''
      courseNotes.value = formData.courseNotes || ''
      
      message.info('已恢复上次编辑的内容')
    }
  } catch (error) {
    console.error('恢复表单数据失败:', error)
  }
}

// 清除自动保存的数据
function clearSavedForm() {
  try {
    localStorage.removeItem('classroomPreparationForm')
    lastSavedTime.value = ''
  } catch (error) {
    console.error('清除保存数据失败:', error)
  }
}

// 提交表单
async function submitForm() {
  // 验证所有必填字段
  const isNameValid = validateCourseName()
  const isDescriptionValid = validateCourseDescription()
  
  if (!isNameValid || !isDescriptionValid) {
    message.error('请完善必填信息')
    return
  }
  
  if (!isFormValid.value) {
    message.error('表单信息有误，请检查后重试')
    return
  }
  
  isSubmitting.value = true
  
  try {
    // 构建课程记录数据
    const courseRecordData = {
    id: courseRecordId.value,
    courseId: courseStore.currentCourseId,
    teacherId: userStore.teacherInfo?.id || '',
    studentIds: null,
    questionIds: null,
    modelType: selectedClassroomSize.value,
    totalDesks: rows.value * cols.value,
    layoutRows: rows.value,
    layoutColumns: cols.value,
    spacing: null,
    layoutConfig: null,
    classroomLayout: null,
    startTime: null,
    overTime: null,
    status: null,
    }

    const classroomConfig={
      size: selectedClassroomSize.value,
      rowCount: rows.value,
      colCount: cols.value,
    }
    
    // 根据状态调用不同的API
    let recordId: string | null = null
    if (isEditMode.value) {
      // 修改课程
      await updateCourseRecord(courseRecordData)
      message.success('课程修改成功')
      recordId = courseRecordId.value
    } else {
      // 创建课程
      const response = await addCourseRecord(courseRecordData)
      message.success('课程创建成功')
      recordId = response.data?.id || null
    }
    
    if (!recordId) {
      message.error('无法获取课程记录ID')
      return
    }
    
    // 清除保存的数据（已成功提交）
    clearSavedForm()
    
    // 跳转到教室页面
    router.push({ path: `/course/${props.courseId}/classroom/${recordId}` })
  } catch (error) {
    console.error('提交表单失败:', error)
    message.error(isEditMode.value ? '修改课程失败，请重试' : '创建课程失败，请重试')
  } finally {
    isSubmitting.value = false
  }
}

// 重置表单数据到初始状态
function resetFormData() {
  console.log('执行表单重置操作')
  
  // 重置课程信息
  courseName.value = ''
  courseDescription.value = ''
  courseNotes.value = ''
  
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
  
  // 清除本地存储的表单数据
  clearSavedForm()
  
  console.log('表单数据已重置为初始状态')
}

// 取消操作
function handleCancel() {
  // 如果表单有内容，显示确认对话框
  if (courseName.value || courseDescription.value || courseNotes.value) {
    if (confirm('您有未保存的内容，确定要离开吗？')) {
      router.back()
    }
  } else {
    router.back()
  }
}

// 监听表单变化，设置自动保存
watch([courseName, courseDescription, courseNotes, selectedClassroomSize, rows, cols], () => {
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer)
  }
  
  // 3秒后自动保存
  autoSaveTimer = window.setTimeout(autoSaveForm, 3000)
})

// 加载课程记录数据
async function loadCourseRecordData(id: string) {
  try {
    const response = await getCourseRecordById(id)
    const data = response.data || response // 根据实际API返回格式调整
    
    // 填充表单数据
    courseName.value = data.courseName || ''
    courseDescription.value = ''
    courseNotes.value = ''
    // 填充其他相关数据
    if (data.modelType) {
      selectedClassroomSize.value = data.modelType
    }
    if (data.layoutRows) {
      rows.value = data.layoutRows
    }
    if (data.layoutColumns) {
      cols.value = data.layoutColumns
    }
    
    message.info('课程数据加载成功')
  } catch (error) {
    console.error('加载课程数据失败:', error)
    message.error('加载课程数据失败，请重试')
    // 加载失败时重置表单
    resetFormData()
  }
}

// 生命周期钩子
onMounted(() => {
  // 注册事件监听器，监听重置信号
  eventBus.on('resetClassroomDetail', () => {
    console.log('接收到重置信号，执行重置操作')
    resetFormData()
  })
  
  // 注册事件监听器，监听课程记录选择信号
  eventBus.on('selectCourseRecord', (data) => {
    console.log('接收到课程记录选择信号:', data)
    if (data && data.id) {
      courseRecordId.value = data.id
      loadCourseRecordData(data.id)
    }
  })
  
  // 恢复保存的数据
  restoreSavedForm()
})

onBeforeUnmount(() => {
  // 清理定时器
  if (autoSaveTimer) {
    clearTimeout(autoSaveTimer)
  }
  
  // 移除事件监听器，避免内存泄漏
  eventBus.off('resetClassroomDetail')
  eventBus.off('selectCourseRecord')
  
  // 离开前自动保存
  autoSaveForm()
})
</script>

<style scoped>
/* 基础样式 - 使用全局CSS变量 */
.classroom-preparation {
  width: 100%;
  min-height: 100vh;
  background: var(--background-color);
  color: var(--text-color);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.page-title {
  font-size: 2.2rem;
  font-weight: 700;
  text-align: center;
  color: var(--text-color);
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px var(--shadow-color);
}

/* 表单容器 */
.form-container {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
}

/* 表单区块 */
.form-section {
  background: var(--background-secondary-color);
  border-radius: 12px;
  border: 1px solid var(--border-color);
  padding: 2rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px var(--shadow-color);
  transition: box-shadow 0.3s ease;
}

.form-section:hover {
  box-shadow: 0 6px 24px var(--shadow-secondary-color);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  color: var(--text-color);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--border-color);
}

/* 表单组 */
.form-group {
  margin-bottom: 1.75rem;
}

.form-label {
  display: block;
  font-size: 1.1rem;
  font-weight: 500;
  color: var(--text-color);
  margin-bottom: 0.75rem;
}

/* 表单标签必填标记 */
.form-label.required::after {
  content: '*';
  color: var(--error-color);
  margin-left: 4px;
}

/* 错误信息 - 使用全局错误色 */
.error-message {
  color: var(--error-color);
  font-size: 0.9rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* 辅助文本 */
.helper-text {
  color: var(--text-secondary-color);
  font-size: 0.85rem;
  margin-top: 0.5rem;
}

/* 教室规格卡片 */
.classroom-specs-container {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 1rem;
  min-height: 300px;
  width: 100%;
}

/* 确保在不同屏幕尺寸下保持田字布局 */
@media (max-width: 768px) {
  .classroom-specs-container {
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
}

.classroom-spec-card {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.classroom-spec-card:hover {
  transform: translateY(-2px);
}

.classroom-spec-card .spec-radio {
  width: 100%;
  padding: 0;
}

.spec-content {
  padding: 1.5rem;
  border-radius: 8px;
  transition: all 0.3s ease;
  background: var(--background-secondary-color);
  border: 2px solid transparent;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.classroom-spec-card .spec-radio.n-radio-button--active .spec-content {
  background: color-mix(in srgb, var(--primary-color) 20%, var(--background-secondary-color));
  border-color: var(--primary-color);
}

.classroom-spec-card:hover .spec-content {
  background: var(--background-tertiary-color);
}

.spec-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
}

.spec-details {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.spec-capacity {
  color: var(--text-color);
  font-weight: 500;
}

.spec-features {
  color: var(--text-secondary-color);
  font-size: 0.9rem;
  line-height: 1.4;
}

/* 座位排布设置 */
.seating-arrangement-group {
  margin-bottom: 0;
}

.seating-arrangement-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.seating-inputs {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.input-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.input-label {
  font-size: 1rem;
  font-weight: 500;
  color: var(--text-color);
}

/* 座位排布整体布局容器 */
.seating-layout-container {
  display: flex;
  gap: 1.5rem;
  flex-wrap: wrap;
  width: 100%;
}

/* 座位设置部分 (25% 宽度) */
.seating-settings-section {
  width: 25%;
  min-width: 200px;
}

/* 座位预览部分 (75% 宽度) */
.seating-preview-section {
  width: calc(75% - 1.5rem);
  min-width: 300px;
}

/* 垂直排列的输入框组 */
.vertical-inputs {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1rem;
  background: var(--background-tertiary-color);
  min-height: 300px;
  justify-content: space-evenly;
  display: flex;
  flex-direction: column;
}

/* 座位预览 */
.seating-preview {
  border: 1px solid var(--border-color);
  border-radius: 8px;
  padding: 1.5rem;
  background: var(--background-tertiary-color);
  min-height: 300px;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
}

/* 响应式布局调整 */
@media (max-width: 768px) {
  .seating-layout-container {
    flex-direction: column;
  }
  
  .seating-settings-section,
  .seating-preview-section {
    width: 100%;
  }
}

.preview-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--text-color);
  margin-bottom: 1rem;
}

.preview-grid {
  overflow: auto;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.preview-row {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.preview-row:last-child {
  margin-bottom: 0;
}

/* 座位预览 - 添加荧光效果 */
.preview-seat {
  position: relative;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--primary-color) 10%, var(--background-color));
  border: 1px solid color-mix(in srgb, var(--primary-color) 30%, transparent);
  border-radius: 6px;
  font-size: 0.9rem;
  color: var(--text-color);
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: default;
  box-shadow: 0 2px 4px var(--shadow-secondary-color);
  z-index: 1;
}

.preview-seat:hover {
  background: color-mix(in srgb, var(--primary-color) 20%, var(--background-color));
  transform: translateY(-2px);
  box-shadow: 0 4px 8px var(--shadow-color);
}

.preview-info {
  text-align: center;
  color: var(--text-secondary-color);
  font-size: 1rem;
  margin-top: 1rem;
  font-weight: 500;
}

/* 操作按钮 */
.action-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  margin-top: 1rem;
  padding: 1rem 0;
}

/* 自动保存通知 */
.auto-save-notification {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: color-mix(in srgb, var(--info-color) 15%, var(--background-color));
  border: 1px solid color-mix(in srgb, var(--info-color) 30%, transparent);
  border-radius: 6px;
  padding: 0.75rem 1rem;
  color: var(--info-color);
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px var(--shadow-color);
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Naive UI 组件覆盖样式 - 使用全局变量 */
:deep(.n-input) {
  width: 100%;
}

:deep(.n-input__wrapper) {
  background-color: var(--background-secondary-color);
  border-color: var(--border-color);
  transition: all 0.3s ease;
}

:deep(.n-input__wrapper:hover) {
  border-color: var(--border-secondary-color);
  background-color: var(--background-tertiary-color);
}

:deep(.n-input__wrapper:focus-within) {
  border-color: var(--primary-color);
  box-shadow: 0 0 0 2px color-mix(in srgb, var(--primary-color) 30%, transparent);
}

:deep(.n-input__input) {
  color: var(--text-color);
  font-size: 1rem;
}

:deep(.n-input-number) {
  width: 100%;
}

:deep(.n-input-number__wrapper) {
  background-color: var(--background-secondary-color);
  border-color: var(--border-color);
}

:deep(.n-input-number__wrapper:hover) {
  border-color: var(--border-secondary-color);
  background-color: var(--background-tertiary-color);
}

:deep(.n-input-number__input) {
  color: var(--text-color);
  font-size: 1rem;
}

:deep(.n-input-number__handler) {
  background-color: var(--background-tertiary-color);
  border-color: var(--border-color);
}

:deep(.n-input-number__handler:hover) {
  background-color: var(--background-color);
}

:deep(.n-input-number__handler-icon) {
  color: var(--text-color);
}

:deep(.n-radio-group) {
  width: 100%;
}

:deep(.n-radio-button) {
  padding: 0;
  background: transparent;
  border: none;
}

:deep(.n-radio-button:hover) {
  background: transparent;
}

:deep(.n-button) {
  font-size: 1rem;
  padding: 0.75rem 0.5rem;
  border-radius: 8px;
  font-weight: 600;
  transition: all 0.3s ease;
}

:deep(.n-button--primary) {
  background-color: var(--primary-color);
  border-color: var(--primary-color);
  color: var(--text-inverse-color, #ffffff);
}

:deep(.n-button--primary:hover:not(:disabled)) {
  background-color: var(--color-primary-light);
  border-color: var(--color-primary-light);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px color-mix(in srgb, var(--primary-color) 30%, transparent);
}

:deep(.n-button--primary:focus) {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color) 30%, transparent);
}

:deep(.n-button--default) {
  background-color: var(--background-secondary-color);
  border-color: var(--border-color);
  color: var(--text-color);
}

:deep(.n-button--default:hover:not(:disabled)) {
  background-color: var(--background-tertiary-color);
  border-color: var(--border-secondary-color);
  transform: translateY(-1px);
}

:deep(.n-button--default:focus) {
  outline: none;
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary-color) 30%, transparent);
}

:deep(.n-button--disabled) {
  opacity: 0.4;
  cursor: not-allowed;
}

/* 为文本反色添加默认值，保证兼容性 */
:root {
  --text-inverse-color: #ffffff;
}

/* 暗色主题下也保持一致 */
.dark {
  --text-inverse-color: #ffffff;
}

/* 文本颜色统一 */
.page-title,
.section-title,
.spec-name,
.spec-capacity,
.preview-info,
.form-label,
.input-label {
  color: var(--text-color);
}

.spec-features,
.helper-text {
  color: var(--text-secondary-color);
}

/* 表单标签必填标记 */
.form-label.required::after {
  content: '*';
  color: var(--error-color);
  margin-left: 4px;
}

/* 错误信息 - 使用全局错误色 */
.error-message {
  color: var(--error-color);
  font-size: 0.9rem;
  margin-top: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

/* 座位预览样式 */
.preview-seat {
  position: relative;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: color-mix(in srgb, var(--primary-color) 10%, var(--background-color));
  border: 1px solid color-mix(in srgb, var(--primary-color) 30%, transparent);
  border-radius: 6px;
  font-size: 0.9rem;
  color: var(--text-color);
  font-weight: 500;
  transition: all 0.3s ease;
  cursor: default;
  box-shadow: 0 2px 4px var(--shadow-secondary-color);
  z-index: 1;
}

.preview-seat:hover {
  background: color-mix(in srgb, var(--primary-color) 20%, var(--background-color));
  transform: translateY(-2px);
  box-shadow: 0 4px 8px var(--shadow-color);
}

/* 自动保存通知 */
.auto-save-notification {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: color-mix(in srgb, var(--info-color) 15%, var(--background-color));
  border: 1px solid color-mix(in srgb, var(--info-color) 30%, transparent);
  border-radius: 6px;
  padding: 0.75rem 1rem;
  color: var(--info-color);
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
  box-shadow: 0 2px 10px var(--shadow-color);
  animation: fadeIn 0.3s ease;
}

/* 滚动条样式 - 与全局滚动条样式保持一致 */
.preview-grid::-webkit-scrollbar,
:deep(.n-input__textarea-el::-webkit-scrollbar) {
  width: 8px;
  height: 8px;
}

.preview-grid::-webkit-scrollbar-track,
:deep(.n-input__textarea-el::-webkit-scrollbar-track) {
  background: var(--background-tertiary-color);
  border-radius: 4px;
}

.preview-grid::-webkit-scrollbar-thumb,
:deep(.n-input__textarea-el::-webkit-scrollbar-thumb) {
  background: var(--border-color);
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.preview-grid::-webkit-scrollbar-thumb:hover,
:deep(.n-input__textarea-el::-webkit-scrollbar-thumb:hover) {
  background: var(--text-secondary-color);
}

/* 响应式设计调整 */
@media (max-width: 768px) {
  .classroom-preparation {
    padding: 1.5rem 1rem;
  }
  
  .form-section {
    padding: 1.5rem;
  }
  
  .page-title {
    font-size: 1.8rem;
  }
  
  .seating-layout-container {
    flex-direction: column;
  }
  
  .seating-settings-section,
  .seating-preview-section {
    width: 100%;
  }
}

@media (max-width: 480px) {
  .classroom-specs-container {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
    gap: 1rem;
  }
  
  :deep(.n-button) {
    width: 100%;
    max-width: 300px;
  }
}
</style>