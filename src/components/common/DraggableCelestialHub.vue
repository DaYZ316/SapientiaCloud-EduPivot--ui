<template>
  <div
    ref="containerRef"
    class="draggable-celestial-hub-container"
    :class="{ 'dragging': isDragging }"
    :style="containerStyle"
    @mousedown="startDrag"
    @touchstart="startDrag"
    tabindex="-1"
  >
    <!-- 拖拽手柄 -->
    <div class="drag-handle">
      <div class="drag-indicator"></div>
    </div>

    <!-- CelestialHub 组件 -->
    <CelestialHub :is-active="isActive" :size="props.size" />

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import CelestialHub from './CelestialHub.vue';

// Props
const props = defineProps({
  isActive: {
    type: Boolean,
    default: false
  },
  // 放大尺寸（像素）
  size: {
    type: Number,
    default: 64
  },
  // 边界吸附距离阈值
  snapThreshold: {
    type: Number,
    default: 50
  },
  // 边界吸附动画时长
  snapDuration: {
    type: Number,
    default: 500
  }
});

// 组件状态
const containerRef = ref<HTMLElement | null>(null);
const isDragging = ref(false);

// 拖拽相关状态
let startX: number | null = null;
let startY: number | null = null;
let initialX: number | null = null;
let initialY: number | null = null;
let currentX: number | null = null;
let currentY: number | null = null;

// 边界吸附相关
let snapAnimationId: number | null = null;

// 计算并返回容器内联样式（用于放大）
import { computed } from 'vue';

const containerStyle = computed(() => {
  const indicatorSize = Math.max(12, Math.round(props.size * 0.33));
  const indicatorDot = Math.max(6, Math.round(props.size * 0.165));
  return {
    width: `${props.size}px`,
    height: `${props.size}px`,
    ['--hub-size']: `${props.size}px`,
    ['--indicator-size']: `${indicatorSize}px`,
    ['--indicator-dot-size']: `${indicatorDot}px`
  } as Record<string, string>;
});

// 初始化位置
const initPosition = () => {
  if (!containerRef.value) return;

  // 从localStorage读取保存的位置
  const savedPosition = localStorage.getItem('celestialHubPosition');
  const container = containerRef.value;
  const rect = container.getBoundingClientRect();

  if (savedPosition) {
    try {
      const position = JSON.parse(savedPosition);
      // 确保位置在有效范围内
      currentX = Math.max(0, Math.min(position.x, window.innerWidth - rect.width));
      currentY = Math.max(0, Math.min(position.y, window.innerHeight - rect.height));
    } catch (error) {
      // 如果解析失败，使用默认位置
      setDefaultPosition();
    }
  } else {
    // 默认位置：屏幕右侧中间
    setDefaultPosition();
  }

  updatePosition();
};

// 设置默认位置（屏幕右侧中间）
const setDefaultPosition = () => {
  if (!containerRef.value) return;

  const container = containerRef.value;
  const rect = container.getBoundingClientRect();

  currentX = window.innerWidth - rect.width - 20;
  currentY = (window.innerHeight - rect.height) / 2;
};

// 保存当前位置到localStorage
const savePosition = () => {
  if (currentX !== null && currentY !== null) {
    const position = {
      x: currentX,
      y: currentY,
      timestamp: Date.now()
    };
    localStorage.setItem('celestialHubPosition', JSON.stringify(position));
  }
};

// 更新元素位置
const updatePosition = () => {
  if (!containerRef.value || currentX === null || currentY === null) return;

  const container = containerRef.value;
  container.style.left = `${currentX}px`;
  container.style.top = `${currentY}px`;
};

// 开始拖拽
const startDrag = (event: MouseEvent | TouchEvent) => {
  event.preventDefault();

  isDragging.value = true;

  // 获取初始位置
  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

  startX = clientX;
  startY = clientY;

  initialX = currentX;
  initialY = currentY;

  // 添加全局事件监听
  document.addEventListener('mousemove', handleDrag);
  document.addEventListener('touchmove', handleDrag);
  document.addEventListener('mouseup', stopDrag);
  document.addEventListener('touchend', stopDrag);

  // 禁用文本选择
  document.body.style.userSelect = 'none';
};

// 处理拖拽
const handleDrag = (event: MouseEvent | TouchEvent) => {
  if (!isDragging.value || startX === null || startY === null || initialX === null || initialY === null) return;

  const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
  const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;

  const deltaX = clientX - startX;
  const deltaY = clientY - startY;

  currentX = initialX + deltaX;
  currentY = initialY + deltaY;

  // 限制在窗口范围内
  if (containerRef.value) {
    const rect = containerRef.value.getBoundingClientRect();
    currentX = Math.max(0, Math.min(currentX, window.innerWidth - rect.width));
    currentY = Math.max(0, Math.min(currentY, window.innerHeight - rect.height));
  }

  updatePosition();
};

// 停止拖拽并执行边界吸附
const stopDrag = () => {
  if (!isDragging.value) return;

  isDragging.value = false;

  // 移除事件监听
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('touchmove', handleDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchend', stopDrag);

  // 恢复文本选择
  document.body.style.userSelect = '';

  // 执行边界吸附
  snapToBoundary();

  // 保存当前位置
  savePosition();
};

// 边界吸附逻辑
const snapToBoundary = () => {
  if (!containerRef.value) return;

  const container = containerRef.value;
  const rect = container.getBoundingClientRect();

  // 计算到各个边界的距离
  const distances = {
    left: currentX!,
    right: window.innerWidth - (currentX! + rect.width),
    top: currentY!,
    bottom: window.innerHeight - (currentY! + rect.height)
  };

  // 找到最近的边界
  let minDistance = Infinity;
  let targetEdge = '';

  Object.entries(distances).forEach(([edge, distance]) => {
    if (distance < minDistance) {
      minDistance = distance;
      targetEdge = edge;
    }
  });

  // 总是吸附到最近的边界
  const targetPosition = { x: currentX, y: currentY };

  switch (targetEdge) {
    case 'left':
      targetPosition.x = 0;
      break;
    case 'right':
      targetPosition.x = window.innerWidth - rect.width;
      break;
    case 'top':
      targetPosition.y = 0;
      break;
    case 'bottom':
      targetPosition.y = window.innerHeight - rect.height;
      break;
  }

  // 平滑动画到目标位置
  animateToPosition(targetPosition.x!, targetPosition.y!);
};

// 平滑动画到指定位置
const animateToPosition = (targetX: number, targetY: number) => {
  if (snapAnimationId) {
    cancelAnimationFrame(snapAnimationId);
  }

  const startX = currentX!;
  const startY = currentY!;
  const duration = props.snapDuration;
  let startTime: number | null = null;

  const animate = (timestamp: number) => {
    if (startTime === null) {
      startTime = timestamp;
    }

    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // 缓动函数 (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3);

    currentX = startX + (targetX - startX) * easeOut;
    currentY = startY + (targetY - startY) * easeOut;

    updatePosition();

    if (progress < 1) {
      snapAnimationId = requestAnimationFrame(animate);
    } else {
      snapAnimationId = null;
      // 动画完成后保存位置
      savePosition();
    }
  };

  snapAnimationId = requestAnimationFrame(animate);
};

// 处理窗口大小变化
const handleResize = () => {
  if (!containerRef.value || currentX === null || currentY === null) return;

  const rect = containerRef.value.getBoundingClientRect();

  // 确保组件仍在窗口范围内
  currentX = Math.max(0, Math.min(currentX, window.innerWidth - rect.width));
  currentY = Math.max(0, Math.min(currentY, window.innerHeight - rect.height));

  updatePosition();

  // 保存调整后的位置
  savePosition();
};

// 组件挂载
onMounted(async () => {
  await nextTick();
  initPosition();

  // 添加窗口大小变化监听
  window.addEventListener('resize', handleResize);
});

// 组件卸载前清理
onBeforeUnmount(() => {
  if (snapAnimationId) {
    cancelAnimationFrame(snapAnimationId);
  }

  window.removeEventListener('resize', handleResize);

  // 清理可能残留的事件监听
  document.removeEventListener('mousemove', handleDrag);
  document.removeEventListener('touchmove', handleDrag);
  document.removeEventListener('mouseup', stopDrag);
  document.removeEventListener('touchend', stopDrag);
});
</script>

<style scoped>
.draggable-celestial-hub-container {
  position: fixed;
  width: var(--hub-size, 64px);
  height: var(--hub-size, 64px);
  min-width: 48px;
  min-height: 48px;
  max-width: 120px;
  max-height: 120px;
  z-index: 1000;
  cursor: grab;
  border-radius: 8px;
  overflow: hidden;
}

.draggable-celestial-hub-container.dragging {
  cursor: grabbing;
  z-index: 1001;
}

/* 拖拽手柄 */
.drag-handle {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s ease;
}

.draggable-celestial-hub-container:hover .drag-handle {
  opacity: 1;
}

.drag-indicator {
  width: var(--indicator-size, 16px);
  height: var(--indicator-size, 16px);
  background: rgba(255, 255, 255, 0.9);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.drag-indicator::before {
  content: '';
  width: var(--indicator-dot-size, 8px);
  height: var(--indicator-dot-size, 8px);
  background: var(--primary-color, #1890ff);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

/* 防止点击时出现默认焦点或边框（例如 canvas 或子元素获取焦点） */ 
.draggable-celestial-hub-container:focus,
.draggable-celestial-hub-container *:focus,
.draggable-celestial-hub-container canvas:focus {
  outline: none !important;
  box-shadow: none !important;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.5;
    transform: scale(0.8);
  }
}

/* 响应式设计 */
@media (max-width: 768px) {
  /* 小屏幕不再强制覆盖容器宽高，指示器尺寸按变量稍微缩小 */
  .drag-indicator {
    width: calc(var(--indicator-size, 16px) * 0.9);
    height: calc(var(--indicator-size, 16px) * 0.9);
  }

  .drag-indicator::before {
    width: calc(var(--indicator-dot-size, 8px) * 0.9);
    height: calc(var(--indicator-dot-size, 8px) * 0.9);
  }
}

@media (max-width: 480px) {
  .drag-indicator {
    width: calc(var(--indicator-size, 16px) * 0.8);
    height: calc(var(--indicator-size, 16px) * 0.8);
  }

  .drag-indicator::before {
    width: calc(var(--indicator-dot-size, 8px) * 0.8);
    height: calc(var(--indicator-dot-size, 8px) * 0.8);
  }
}

/* 高对比度模式适配 */
@media (prefers-contrast: high) {
  .drag-indicator {
    background: #000;
    border: 1px solid #fff;
  }

  .drag-indicator::before {
    background: #fff;
  }
}

/* 减少动画效果的用户偏好设置 */
@media (prefers-reduced-motion: reduce) {
  .draggable-celestial-hub-container,
  .drag-handle,
  .drag-indicator,
  .drag-indicator::before {
    transition: none;
    animation: none;
  }
}
</style>
