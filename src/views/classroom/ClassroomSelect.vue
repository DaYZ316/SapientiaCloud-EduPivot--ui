<template>
  <div class="classroom-layout">
    <!-- 左侧教室选择组件 - 占75%宽度 -->
    <div class="classroom-select-container">
      <ClassroomDetail :course-id="courseId"/>
    </div>

    <!-- 右侧教室历史组件 - 占25%宽度 -->
    <div class="classroom-history-container">
      <ClassroomHistory/>
    </div>
  </div>
</template>

<script setup>
import {computed} from 'vue'
import {useRoute} from 'vue-router'
import ClassroomDetail from './ClassroomDetail.vue'
import ClassroomHistory from './ClassroomHistory.vue'

const route = useRoute()
const courseId = computed(() => route.params.courseId);
</script>

<style scoped>
.classroom-layout {
  display: flex;
  width: 100%;
  gap: 16px;
  min-height: 100vh;
  box-sizing: border-box;
}

.classroom-select-container {
  flex: 3; /* 75% 宽度 */
  background-color: var(--bg-color-1);
  border-radius: 8px;
  box-shadow: var(--shadow-light);
  min-width: 0; /* 防止内容溢出 */
}

.classroom-history-container {
  flex: 1; /* 25% 宽度 */
  background-color: var(--bg-color-1);
  border-radius: 8px;
  box-shadow: var(--shadow-light);
  min-width: 0; /* 防止内容溢出 */
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .classroom-layout {
    flex-direction: column;
    gap: 24px;
  }

  .classroom-select-container,
  .classroom-history-container {
    flex: none;
    width: 100%;
  }
}

/* 确保在小屏幕上布局合理 */
@media (max-width: 768px) {
  .classroom-layout {
    padding: 12px;
    gap: 16px;
  }

  .classroom-select-container,
  .classroom-history-container {
    padding: 16px;
  }
}
</style>
