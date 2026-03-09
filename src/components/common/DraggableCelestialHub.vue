<template>
  <div
    ref="containerRef"
    class="draggable-celestial-hub-container"
    :class="{ 'dragging': isDragging }"
    :style="containerStyle"
    tabindex="-1"
  >
    <!-- 拖拽手柄 -->
    <div class="drag-handle">
      <div class="drag-indicator"></div>
    </div>

    <!-- CelestialHub 组件 -->
    <CelestialHub
      ref="celestialHubRef"
      :is-active="isActive"
      :size="props.size"
      @click="handleModelClick"
      @mousedown="startDrag"
      @touchstart="startDrag"
    />

    <!-- 弹窗 -->
    <Transition
      name="popup"
      :duration="{ enter: 300, leave: 200 }"
      appear
    >
      <div
        v-if="isPopupVisible && !isPopupMinimized"
        ref="popupRef"
        :style="popupStyles"
        class="celestial-popup"
      >
        <CelestialHubWindow
          :is-minimized="isPopupMinimized"
          :is-history-view="isHistoryView"
          @minimize="handlePopupMinimize"
          @close="handlePopupClose"
          @show-history="handleShowHistory" 
          @new-chat="handleNewChat"
        />
      </div>
    </Transition>

  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { computePosition, offset, flip, shift, autoUpdate } from '@floating-ui/dom';
import CelestialHub from './CelestialHub.vue';
import CelestialHubWindow from './CelestialHubWindow.vue';

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
const celestialHubRef = ref<InstanceType<typeof CelestialHub> | null>(null);
const isDragging = ref(false);

// 弹窗状态
const isPopupVisible = ref(false);
const isPopupMinimized = ref(false);
const isHistoryView = ref(false);
const popupRef = ref<HTMLElement | null>(null);
const popupStyles = ref({});
let cleanupAutoUpdate: (() => void) | null = null;

// 更新弹窗显示状态和位置
const updatePopupState = async (visible: boolean, minimized = false) => {
  const wasVisible = isPopupVisible.value;
  isPopupVisible.value = visible;
  isPopupMinimized.value = minimized;

  if (visible !== wasVisible || (visible && minimized !== isPopupMinimized.value)) {
    // 只有在真正显示弹窗时才控制发光效果（非最小化状态）
    controlModelGlow(visible && !minimized);

    if (visible && !minimized) {
      await nextTick();
      await updatePopupPosition();

      // 启动自动更新
      if (containerRef.value && popupRef.value) {
        cleanupAutoUpdate = autoUpdate(containerRef.value, popupRef.value, updatePopupPosition);
      }
    } else {
      // 停止自动更新
      if (cleanupAutoUpdate) {
        cleanupAutoUpdate();
        cleanupAutoUpdate = null;
      }
    }
  }
};

// 计算弹窗最佳位置
const calculatePopupPlacement = (rect: DOMRect): 'top' | 'bottom' | 'left' | 'right' => {
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // 优先考虑水平方向
  if (centerX < window.innerWidth / 2) {
    // 模型在左半边，弹窗放在右侧
    return centerY < POPUP_VERTICAL_THRESHOLD || centerY > window.innerHeight - POPUP_VERTICAL_THRESHOLD
      ? (centerY < window.innerHeight / 2 ? 'bottom' : 'top')
      : 'right';
  } else {
    // 模型在右半边，弹窗放在左侧
    return centerY < POPUP_VERTICAL_THRESHOLD || centerY > window.innerHeight - POPUP_VERTICAL_THRESHOLD
      ? (centerY < window.innerHeight / 2 ? 'bottom' : 'top')
      : 'left';
  }
};

// 更新弹窗位置
const updatePopupPosition = async () => {
  if (!containerRef.value || !popupRef.value || !isPopupVisible.value) return;

  const rect = containerRef.value.getBoundingClientRect();
  const placement = calculatePopupPlacement(rect);

  const { x, y } = await computePosition(containerRef.value, popupRef.value, {
    placement,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
  });

  popupStyles.value = {
    left: `${x}px`,
    top: `${y}px`,
    position: 'fixed',
  };
};

// 拖拽相关状态
let startX: number | null = null;
let startY: number | null = null;
let initialX: number | null = null;
let initialY: number | null = null;
let currentX: number | null = null;
let currentY: number | null = null;

// 常量定义
const DRAG_THRESHOLD = 5; // 拖拽阈值，移动超过此距离才算拖拽
const GLOW_DURATION_IN = 600; // 渐亮动画时长
const GLOW_DURATION_OUT = 400; // 渐暗动画时长
const POPUP_VERTICAL_THRESHOLD = 150; // 垂直方向空间阈值

// 拖拽检测相关
let hasDragged = false;

// 拖拽时的弹窗状态管理
let popupWasVisibleBeforeDrag = false; // 记录拖拽开始前弹窗是否可见

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
  hasDragged = false; // 重置拖拽标志

  // 记录拖拽开始前弹窗状态
  popupWasVisibleBeforeDrag = isPopupVisible.value && !isPopupMinimized.value;

  // 开始拖拽时关闭弹窗，但保持高亮
  if (isPopupVisible.value && !isPopupMinimized.value) {
    isPopupVisible.value = false;
    // 停止自动更新
    if (cleanupAutoUpdate) {
      cleanupAutoUpdate();
      cleanupAutoUpdate = null;
    }
    // 注意：不关闭发光效果，保持高亮状态
  }

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

  // 检查是否超过拖拽阈值
  if (!hasDragged && (Math.abs(deltaX) > DRAG_THRESHOLD || Math.abs(deltaY) > DRAG_THRESHOLD)) {
    hasDragged = true;
  }

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
const stopDrag = async () => {
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

  // 如果拖拽前弹窗是打开的，则重新打开（高亮已经保持着）
  if (popupWasVisibleBeforeDrag) {
    await updatePopupState(true, false);
  }
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

// 处理模型点击事件
const handleModelClick = async () => {
  // 只有在没有发生拖拽的情况下才切换弹窗状态
  if (!hasDragged) {
    if (isPopupMinimized.value) {
      // 如果是最小化状态，点击时恢复显示
      await updatePopupState(true, false);
    } else {
      await updatePopupState(!isPopupVisible.value);
    }
  }

  // 重置拖拽标志，为下次点击做准备
  hasDragged = false;
};

// 处理弹窗最小化
const handlePopupMinimize = async () => {
  await updatePopupState(true, true);
};

// 处理弹窗关闭
const handlePopupClose = async () => {
  await updatePopupState(false, false);
  isHistoryView.value = false; // 关闭时重置历史记录视图
};

// 处理显示历史记录
const handleShowHistory = () => {
  isHistoryView.value = !isHistoryView.value;
};

// 处理新建对话
const handleNewChat = () => {
  isHistoryView.value = false; // 切换到聊天视图（新对话页面）
};

// 处理弹窗外点击关闭
const handleClickOutside = async (event: Event) => {
  const target = event.target as HTMLElement;
  if (popupRef.value && !popupRef.value.contains(target) && containerRef.value && !containerRef.value.contains(target)) {
    await updatePopupState(false);
  }
};

// 缓动函数
const easeOut = (progress: number) => 1 - Math.pow(1 - progress, 3);

// 控制模型发光效果
let glowAnimationId: number | null = null;

const controlModelGlow = (shouldGlow: boolean) => {
  if (!celestialHubRef.value) return;

  // 取消之前的动画
  if (glowAnimationId) {
    cancelAnimationFrame(glowAnimationId);
    glowAnimationId = null;
  }

  const animate = (targetIntensity: number, targetEmissive: number, duration: number, reverse = false) => {
    let startTime: number | null = null;

    const step = (timestamp: number) => {
      if (startTime === null) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easedProgress = easeOut(progress);

      const intensity = reverse ? targetIntensity * (1 - easedProgress) : targetIntensity * easedProgress;
      const emissive = reverse ? targetEmissive * (1 - easedProgress) : targetEmissive * easedProgress;

      if (intensity > 0) {
        celestialHubRef.value?.enableWhiteLight?.(intensity, emissive);
      } else {
        celestialHubRef.value?.disableWhiteLight?.();
      }

      if (progress < 1) {
        glowAnimationId = requestAnimationFrame(step);
      } else {
        glowAnimationId = null;
      }
    };

    glowAnimationId = requestAnimationFrame(step);
  };

  shouldGlow ? animate(50, 0.3, GLOW_DURATION_IN) : animate(50, 0.3, GLOW_DURATION_OUT, true);
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

  // 添加全局点击监听，用于关闭弹窗
  document.addEventListener('click', handleClickOutside);
});

// 组件卸载前清理
onBeforeUnmount(() => {
  if (snapAnimationId) {
    cancelAnimationFrame(snapAnimationId);
  }

  // 清理发光动画
  if (glowAnimationId) {
    cancelAnimationFrame(glowAnimationId);
    glowAnimationId = null;
  }

  // 清理autoUpdate
  if (cleanupAutoUpdate) {
    cleanupAutoUpdate();
    cleanupAutoUpdate = null;
  }

  window.removeEventListener('resize', handleResize);
  document.removeEventListener('click', handleClickOutside);

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
  cursor: default;
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

.draggable-celestial-hub-container:hover {
  cursor: pointer;
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

/* 弹窗样式 */
.celestial-popup {
  background: transparent;
  border: none;
  border-radius: 12px;
  padding: 0;
  box-shadow: none;
  z-index: 1001;
  /* 使用屏幕占比，最大尺寸不超过 1200x800px，最小保证可用 */
  width: min(80vw, 1400px);
  height: min(80vh, 800px);
  min-width: 320px;
  min-height: 300px;
  max-width: 100vw;
  max-height: 100vh;
  box-sizing: border-box;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: center;
}


/* 弹窗动画 */
.popup-enter-active,
.popup-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.popup-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(-10px);
}

.popup-enter-to {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.popup-leave-from {
  opacity: 1;
  transform: scale(1) translateY(0);
}

.popup-leave-to {
  opacity: 0;
  transform: scale(0.8) translateY(-10px);
}

/* 减少动画效果的用户偏好设置 */
@media (prefers-reduced-motion: reduce) {
  .draggable-celestial-hub-container,
  .drag-handle,
  .drag-indicator,
  .drag-indicator::before,
  .celestial-popup {
    transition: none;
    animation: none;
  }

  .popup-enter-active,
  .popup-leave-active {
    transition: none;
  }
}
</style>
