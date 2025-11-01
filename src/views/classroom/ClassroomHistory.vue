<template>
  <div class="classroom-history">
    <h2 class="page-title">{{ t('classroom.history.title') }}</h2>
    
    <!-- 加载状态 -->
    <div v-if="loading" class="loading">{{ t('common.loading') }}</div>
    
    <!-- 错误提示 -->
    <div v-else-if="error" class="error">
      <p>⚠️ {{ t('common.error') }}：{{ errorMsg }}</p>
    </div>
    
    <!-- 空状态 -->
    <div v-else-if="records.length === 0" class="empty">
      <p>{{ t('common.noData') }}</p>
      <button class="create-course-btn" @click="handleCreateCourse">
        {{ t('classroom.history.createCourse') }}
      </button>
    </div>
    
    <!-- 数据列表 -->
    <div v-else class="record-list">
      <div v-for="item in records" :key="item.id" class="record" @click="handleRecordClick(item)">
        <div class="record-header">
          <p class="course-name">{{ t('common.course') }}: {{ item.courseName || t('classroom.history.unnamedCourse') }}</p>
          <span v-if="item.status !== undefined" class="record-status" :class="'status-' + item.status">
            {{ getStatusText(item.status) }}
          </span>
        </div>
        <p v-if="item.teacherName">{{ t('common.teacher') }}: {{ item.teacherName }}</p>
        <p>{{ t('common.time') }}: {{ item.updateTime || t('classroom.history.noTime') }}</p>
        <p>{{ t('common.modelType') }}: {{ item.modelType ? getClassroomModelTypeLabel(item.modelType, locale.value === 'en-US') : t('classroom.history.noModelType') }}</p>
      </div>
      <button class="create-course-btn" @click="handleCreateCourse">
        {{ t('classroom.history.createCourse') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { listCourseRecord } from '@/api/classroom/courseRecord'
import eventBus from '@/utils/eventBus'
import { getClassroomModelTypeLabel } from '@/enum/classroom/classroomModelTypeEnum'

const { t, locale } = useI18n()

const loading = ref(false)
const error = ref(false)
const errorMsg = ref('')
const records = ref([])

// 模拟数据，在API调用失败时使用
// 添加状态文本映射
  const getStatusText = (status) => {
    const statusMap = {
      0: t('classroom.history.statusNotStarted'),
      1: t('classroom.history.statusInProgress'),
      2: t('classroom.history.statusCompleted')
    }
    return statusMap[status] || t('classroom.history.statusUnknown')
  }

// 处理创建课程
const handleCreateCourse = () => {
  // 发送重置信号到ClassroomDetail组件
  console.log('发送重置信号')
  eventBus.emit('resetClassroomDetail')
}

// 处理课程记录点击事件
const handleRecordClick = (item) => {
  console.log('点击课程记录:', item.id)
  eventBus.emit('selectCourseRecord', { id: item.id })
}


const loadData = async () => {
  loading.value = true
  error.value = false
  try {
    const res = await listCourseRecord({ pageNum: '1', pageSize: '10' })
    if (res && res.data) {
      records.value = res.data
    }
  } catch (e) {
    console.error('加载失败', e)
    error.value = true
    errorMsg.value = e.message || t('common.error')
    // 使用模拟数据，确保页面有内容显示
    records.value = mockData
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadData()
})
</script>

<style scoped>
.classroom-history {
  width: 100%;
  min-height: 100vh;
  background: var(--background-color);
  color: var(--text-color);
  display: flex;
  flex-direction: column;
  gap: 2rem;
  transition: background-color 0.3s ease, color 0.3s ease;
  padding-bottom: 2rem;
}

.page-title {
  font-size: 2.2rem;
  font-weight: 700;
  text-align: center;
  color: var(--text-color);
  margin-bottom: 1rem;
  text-shadow: 0 2px 4px var(--shadow-color);
}

/* 创建课程按钮样式 */
.create-course-btn {
  width: 100%;
  height: 44px;
  margin: 1.5rem auto 0;
  background-color: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 2px 8px var(--shadow-color);
  display: block;
}

.create-course-btn:hover {
  background-color: var(--color-primary-light);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--shadow-color);
}

.create-course-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px var(--shadow-color);
}

/* 空状态容器样式 */
.empty {
  text-align: center;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
}

.empty p {
  margin-bottom: 1.5rem;
  color: var(--text-secondary-color);
  font-size: 1.1rem;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .create-course-btn {
    max-width: 180px;
    height: 40px;
    font-size: 0.9rem;
  }
  
  .empty {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .create-course-btn {
    max-width: 100%;
    margin: 1rem 1rem 0;
    height: 38px;
    font-size: 0.85rem;
  }
  
  .empty {
    padding: 1rem;
  }
  
  .empty p {
    margin-bottom: 1rem;
    font-size: 1rem;
  }
}

.loading {
  text-align: center;
  padding: 40px;
  color: var(--text-secondary-color, #666666);
  font-size: 14px;
}

.error {
  padding: 20px;
  background-color: rgba(255, 77, 79, 0.08); /* 基于error-color的淡色背景 */
  border: 1px solid var(--border-color, #d9d9d9);
  border-radius: 6px;
  color: var(--error-color, #ff4d4f);
  font-size: 14px;
}

.error-tip {
  font-size: 14px;
  color: var(--warning-color, #faad14);
  margin-top: 8px;
}

.empty {
  text-align: center;
  padding: 60px;
  color: var(--text-disabled-color, #999999);
  font-size: 16px;
}

/* 应用全局滚动条样式 */
.record-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  overflow-y: auto;
  
}

.record {
  padding: 16px;
  border: 1px solid var(--border-color, #d9d9d9);
  border-radius: 8px;
  transition: all 0.3s ease;
  background-color: var(--background-color, #ffffff);
  cursor: pointer;
}

.record:hover {
  border-color: var(--primary-color, #1890ff);
  box-shadow: 0 2px 8px var(--shadow-secondary-color, rgba(0, 0, 0, 0.08));
}

.record-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 8px;
}

.course-name {
  font-weight: 600;
  font-size: 16px;
  color: var(--text-color, #000000);
  margin: 0;
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  transition: color 0.3s ease;
}

.record-status {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.status-0 {
  background-color: rgba(250, 173, 20, 0.1); /* 基于warning-color的淡色背景 */
  color: var(--warning-color, #faad14);
}

.status-1 {
  background-color: rgba(24, 144, 255, 0.1); /* 基于primary-color的淡色背景 */
  color: var(--primary-color, #1890ff);
}

.status-2 {
  background-color: rgba(82, 196, 26, 0.1); /* 基于success-color的淡色背景 */
  color: var(--success-color, #52c41a);
}

.record p {
  margin: 6px 0;
  color: var(--text-secondary-color, #666666);
  font-size: 14px;
  transition: color 0.3s ease;
}

/* 响应式调整 - 与全局响应式规范保持一致 */
@media (max-width: 768px) {
  .classroom-history {
    padding: 12px;
  }
  
  .record {
    padding: 12px;
  }
  
  .record-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 6px;
  }
  
  .course-name {
    white-space: normal;
    overflow: visible;
  }
  
  .loading, .empty {
    padding: 20px 10px;
  }
}

/* 高对比度模式适配 */
@media (prefers-contrast: high) {
  .record {
    border-width: 2px;
  }
  
  .record-status {
    font-weight: 600;
  }
}

/* 减少动画效果的用户偏好设置 */
@media (prefers-reduced-motion: reduce) {
  .record:hover {
    transform: none;
    transition-duration: 0.01ms;
  }
}
</style>