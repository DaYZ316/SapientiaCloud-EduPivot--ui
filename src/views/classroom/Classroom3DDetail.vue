<template>
  <div class="classroom-detail">
    <n-button 
      @click="showClassroomSelect"
      class="sunrise-exit-button"
    >
      {{ t('classroom.exit') }}
    </n-button>
    <Classroom3D />
  </div>
</template>

<script setup>
  import Classroom3D from './Classroom3D.vue';
  import { useRouter, useRoute } from 'vue-router';
  import { useI18n } from 'vue-i18n';

  const { t } = useI18n();

  const router = useRouter();
  const route = useRoute();

  function showClassroomSelect() {
    router.push(`/course/detail/${route.params.courseId}/classroom`)
  }
</script>

<style scoped>
.classroom-detail {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f0f9ff 0%, #f5f0ff 50%, #fff9e6 100%);
}

/* 退出按钮样式 - 使用全局CSS变量 */
.sunrise-exit-button {
  position: relative;
  top: -45vh;
  left: 90vw;
  z-index: 2;
  min-width: 120px;
  border-radius: 12px;
  font-weight: 600;
  letter-spacing: 0.05em;
  background-color: var(--background-color);
  color: var(--text-color);
  border: 1px solid var(--border-color);
  box-shadow: 
    0 4px 12px var(--shadow-secondary-color),
    inset 0 -1px 0 var(--border-secondary-color);
  transition: all 0.3s ease;
}

/* 悬停状态 */
.sunrise-exit-button:hover {
  transform: translateY(-2px);
  box-shadow: 
    0 6px 16px var(--shadow-color),
    inset 0 -1px 0 var(--border-color);
  background-color: var(--background-secondary-color);
}

/* 点击状态 */
.sunrise-exit-button:active {
  transform: translateY(0);
  box-shadow: 
    0 2px 6px var(--shadow-secondary-color),
    inset 0 1px 3px var(--shadow-color);
  background-color: var(--background-tertiary-color);
}

/* 聚焦状态 - 符合全局设计 */
.sunrise-exit-button:focus {
  outline: none;
  box-shadow: 
    0 0 0 3px color-mix(in srgb, var(--primary-color) 30%, transparent),
    0 4px 12px var(--shadow-secondary-color);
}

/* 荧光效果 - 使用全局荧光样式变量 */
.sunrise-exit-button {
  position: relative;
}

.sunrise-exit-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(
    circle at center,
    color-mix(in srgb, var(--primary-color) var(--glow-intensity), transparent) 0%,
    color-mix(in srgb, var(--primary-color) calc(var(--glow-intensity) * 0.5), transparent) 50%,
    transparent 100%
  );
  border-radius: inherit;
  pointer-events: none;
  z-index: -1;
}

/* 响应式设计 - 与全局响应式规范一致 */
@media (max-width: 768px) {
  .sunrise-exit-button {
    top: 1rem;
    right: 1rem;
    min-width: 100px;
    padding: 0.625rem 1.25rem;
    font-size: 0.875rem;
    border-radius: 10px;
  }
}

@media (max-width: 480px) {
  .sunrise-exit-button {
    top: 0.75rem;
    right: 0.75rem;
    min-width: 80px;
    padding: 0.5rem 1rem;
    font-size: 0.8125rem;
    border-radius: 8px;
    letter-spacing: 0.03em;
  }
}

/* 高对比度模式适配 */
@media (prefers-contrast: high) {
  .sunrise-exit-button {
    border-width: 2px;
    box-shadow: none;
  }
  
  .sunrise-exit-button::before {
    display: none;
  }
}

/* 减少动画效果的用户偏好设置 */
@media (prefers-reduced-motion: reduce) {
  .sunrise-exit-button,
  .sunrise-exit-button::before {
    transition: none;
    animation: none;
  }
}
</style>