<template>
  <div class="teacher-marquee-container">
    <!-- 跑马灯包装器 -->
    <div
        class="marquee-wrapper"
        @mouseenter="handleMouseEnter"
        @mouseleave="handleMouseLeave"
    >
      <!-- 左侧渐变遮罩 -->
      <div class="marquee-fade marquee-fade--left"></div>

      <!-- 跑马灯内容 -->
      <div
          v-if="assistantTeachers.length > 0"
          ref="marqueeContentRef"
          :style="{ transform: `translateX(${currentPosition}px)` }"
          class="marquee-content"
      >
        <!-- 第一组教师 -->
        <div class="teacher-group">
          <div
              v-for="teacher in assistantTeachers"
              :key="`first-${teacher.id}`"
              class="teacher-item"
              @click="handleTeacherClick(teacher)"
          >
            <AvatarDisplay
                :avatar-src="teacher.avatar"
                :nick-name="teacher.nickName"
                :round="true"
                :size="48"
                :teacher-real-name="teacher.realName"
                :username="teacher.username"
                class="teacher-avatar"
            />
            <div class="teacher-info">
              <div class="teacher-name">{{ teacher.realName || teacher.teacherCode || t('common.unknown') }}</div>
              <div v-if="teacher.department || teacher.teacherCode" class="teacher-meta">
                <span v-if="teacher.department" class="teacher-department">{{ teacher.department }}</span>
                <span v-if="teacher.department && teacher.teacherCode" class="meta-separator">·</span>
                <span v-if="teacher.teacherCode" class="teacher-code">{{ teacher.teacherCode }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 第二组教师（用于无缝循环） -->
        <div v-if="shouldAnimate" class="teacher-group">
          <div
              v-for="teacher in assistantTeachers"
              :key="`second-${teacher.id}`"
              class="teacher-item"
              @click="handleTeacherClick(teacher)"
          >
            <AvatarDisplay
                :avatar-src="teacher.avatar"
                :nick-name="teacher.nickName"
                :round="true"
                :size="48"
                :teacher-real-name="teacher.realName"
                :username="teacher.username"
                class="teacher-avatar"
            />
            <div class="teacher-info">
              <div class="teacher-name">{{ teacher.realName || teacher.teacherCode || t('common.unknown') }}</div>
              <div v-if="teacher.department || teacher.teacherCode" class="teacher-meta">
                <span v-if="teacher.department" class="teacher-department">{{ teacher.department }}</span>
                <span v-if="teacher.department && teacher.teacherCode" class="meta-separator">·</span>
                <span v-if="teacher.teacherCode" class="teacher-code">{{ teacher.teacherCode }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 空状态 -->
      <div v-else class="empty-state">
        <n-empty
            :description="t('course.teacherMarquee.noAssistantTeachers')"
            size="small"
        />
      </div>

      <!-- 右侧渐变遮罩 -->
      <div class="marquee-fade marquee-fade--right"></div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, nextTick, onMounted, onUnmounted, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRouter} from 'vue-router'
import type {TeacherVO} from '@/types/teacher'
import AvatarDisplay from '@/components/common/AvatarDisplay.vue'

// 定义组件属性
interface Props {
  /** 开课教师ID（用于排除） */
  mainTeacherId?: string | null
  /** 教师数据 */
  teachers: readonly TeacherVO[]
  /** 加载状态 */
  loading?: boolean
}

// 接收属性
const props = withDefaults(defineProps<Props>(), {
  mainTeacherId: null,
  teachers: () => [],
  loading: false
})

// 国际化
const {t} = useI18n()

// 路由
const router = useRouter()

// DOM 引用
const marqueeContentRef = ref<HTMLElement | null>(null)

// 响应式数据
const marqueeDuration = ref(20) // 跑马灯动画持续时间（秒）
const isPaused = ref(false) // 是否暂停动画
const currentPosition = ref(0) // 当前动画位置
const animationFrameId = ref<number | null>(null) // 动画帧ID
const groupWidth = ref(0) // 教师组的宽度
const lastTimestamp = ref<number | null>(null) // 上一帧的时间戳

// 计算属性
const assistantTeachers = computed(() => {
  if (!props.teachers || props.teachers.length === 0) return []
  return props.teachers.filter(teacher => teacher.id !== props.mainTeacherId)
})

// 是否需要动画（当教师数量较多时启用）
const shouldAnimate = computed(() => assistantTeachers.value.length > 3)

// 计算动画速度（像素/秒）
const animationSpeed = computed(() => {
  if (!shouldAnimate.value || groupWidth.value === 0) return 0
  // 每 marqueeDuration 秒移动 groupWidth 像素
  return groupWidth.value / marqueeDuration.value
})

// 点击教师跳转到个人主页
const handleTeacherClick = (teacher: TeacherVO) => {
  if (teacher.sysUserId) {
    router.push(`/user/${teacher.sysUserId}`)
  }
}

// 处理鼠标进入
const handleMouseEnter = () => {
  if (shouldAnimate.value) {
    isPaused.value = true
  }
}

// 处理鼠标离开
const handleMouseLeave = () => {
  if (shouldAnimate.value) {
    isPaused.value = false
    startAnimation()
  }
}

// 更新教师组宽度
const updateGroupWidth = () => {
  if (marqueeContentRef.value) {
    const firstGroup = marqueeContentRef.value.querySelector('.teacher-group') as HTMLElement
    if (firstGroup) {
      groupWidth.value = firstGroup.offsetWidth + 20 // 加上 gap
    }
  }
}

// 动画循环
const animate = (timestamp: number) => {
  if (isPaused.value) {
    animationFrameId.value = null
    lastTimestamp.value = null
    return
  }

  // 初始化时间戳
  if (lastTimestamp.value === null) {
    lastTimestamp.value = timestamp
    animationFrameId.value = requestAnimationFrame(animate)
    return
  }

  // 计算实际时间差（毫秒）
  const deltaTime = timestamp - lastTimestamp.value
  lastTimestamp.value = timestamp

  // 计算移动距离（像素）
  const deltaPosition = (animationSpeed.value * deltaTime) / 1000

  // 更新位置
  currentPosition.value -= deltaPosition

  // 当移动到一半时重置位置（无缝循环）
  if (Math.abs(currentPosition.value) >= groupWidth.value) {
    currentPosition.value = 0
  }

  animationFrameId.value = requestAnimationFrame(animate)
}

// 启动动画
const startAnimation = () => {
  if (!shouldAnimate.value || isPaused.value) return
  if (animationFrameId.value) return

  animationFrameId.value = requestAnimationFrame(animate)
}

// 停止动画
const stopAnimation = () => {
  if (animationFrameId.value) {
    cancelAnimationFrame(animationFrameId.value)
    animationFrameId.value = null
  }
  lastTimestamp.value = null
}

// 监听教师数据变化，动态调整动画速度
watch(() => assistantTeachers.value.length, (count) => {
  if (count > 0) {
    // 根据教师数量调整动画速度，教师越多速度越快
    // 最小8秒，最大30秒
    marqueeDuration.value = Math.max(8, Math.min(30, 25 - count * 0.8))
    // 更新宽度并重新启动动画
    nextTick(() => {
      updateGroupWidth()
      if (shouldAnimate.value && !isPaused.value) {
        stopAnimation()
        startAnimation()
      }
    })
  }
}, {immediate: true})

// 监听是否需要动画
watch(shouldAnimate, (needAnimate) => {
  if (needAnimate) {
    nextTick(() => {
      updateGroupWidth()
      if (!isPaused.value) {
        startAnimation()
      }
    })
  } else {
    stopAnimation()
    currentPosition.value = 0
  }
}, {immediate: true})

// 监听暂停状态
watch(isPaused, (paused) => {
  if (paused) {
    stopAnimation()
  } else if (shouldAnimate.value) {
    startAnimation()
  }
})

// 监听窗口大小变化
const handleResize = () => {
  if (shouldAnimate.value) {
    updateGroupWidth()
  }
}

// 生命周期
onMounted(() => {
  if (shouldAnimate.value) {
    nextTick(() => {
      updateGroupWidth()
      startAnimation()
    })
  }

  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  stopAnimation()
  window.removeEventListener('resize', handleResize)
})

</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.teacher-marquee-container {
  width: 100%;
  height: 100%;
  min-height: 100px;
  border-radius: 12px;
  background: var(--background-secondary-color);
  border: 1px solid var(--border-secondary-color);
  box-shadow: 0 2px 8px var(--shadow-secondary-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow: hidden;

  &:hover {
    border-color: var(--primary-color);
    box-shadow: 0 4px 16px var(--shadow-color);
  }
}

.marquee-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100px;
  overflow: hidden;
  display: flex;
  align-items: center;
}

.marquee-fade {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 60px;
  z-index: 10;
  pointer-events: none;

  &--left {
    left: 0;
    background: linear-gradient(
            to right,
            var(--background-secondary-color) 0%,
            color-mix(in srgb, var(--background-secondary-color) 80%, transparent) 50%,
            transparent 100%
    );
  }

  &--right {
    right: 0;
    background: linear-gradient(
            to left,
            var(--background-secondary-color) 0%,
            color-mix(in srgb, var(--background-secondary-color) 80%, transparent) 50%,
            transparent 100%
    );
  }
}

.marquee-content {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 20px;
  padding: 16px 0;
  white-space: nowrap;
  will-change: transform;
  transition: transform 0s linear;
}

.teacher-group {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-shrink: 0;
}

.teacher-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 18px;
  background: var(--background-color);
  border-radius: 24px;
  box-shadow: 0 2px 8px var(--shadow-secondary-color);
  border: 1px solid var(--border-secondary-color);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  min-width: 200px;
  cursor: pointer;
  position: relative;
  overflow: hidden;

  // 添加背景渐变效果
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
            90deg,
            transparent 0%,
            color-mix(in srgb, var(--primary-color) 10%, transparent) 50%,
            transparent 100%
    );
    transition: left 0.5s ease;
  }

  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 6px 20px var(--shadow-color);
    border-color: var(--primary-color);
    background: var(--background-tertiary-color);

    &::before {
      left: 100%;
    }

    .teacher-name {
      color: var(--primary-color);
    }
  }

  &:active {
    transform: translateY(-1px);
  }
}

.teacher-avatar {
  flex-shrink: 0;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  .teacher-item:hover & {
    transform: scale(1.1);
  }
}

.teacher-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1;
}

.teacher-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.3s ease;
}

.teacher-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: var(--text-secondary-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.teacher-department,
.teacher-code {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.meta-separator {
  color: var(--text-tertiary-color);
  font-weight: 300;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 100px;
  color: var(--text-secondary-color);
}


// 响应式设计
@media (max-width: 1024px) {
  .teacher-item {
    min-width: 180px;
    padding: 8px 16px;
    gap: 10px;
  }

  .teacher-name {
    font-size: 13px;
  }

  .teacher-meta {
    font-size: 11px;
  }

  .marquee-fade {
    width: 40px;
  }
}

@media (max-width: 768px) {
  .teacher-marquee-container {
    border-radius: 8px;
  }

  .teacher-item {
    min-width: 160px;
    padding: 8px 14px;
    gap: 8px;
    border-radius: 20px;
  }

  .teacher-avatar {
    :deep(.n-avatar) {
      width: 40px !important;
      height: 40px !important;
    }
  }

  .teacher-name {
    font-size: 12px;
  }

  .teacher-meta {
    font-size: 10px;
    gap: 4px;
  }

  .marquee-fade {
    width: 30px;
  }

  .marquee-content {
    gap: 16px;
    padding: 12px 0;
  }

  .teacher-group {
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .teacher-item {
    min-width: 140px;
    padding: 6px 12px;
  }

  .teacher-avatar {
    :deep(.n-avatar) {
      width: 36px !important;
      height: 36px !important;
    }
  }

  .teacher-name {
    font-size: 11px;
  }

  .teacher-meta {
    font-size: 9px;
  }

  .marquee-fade {
    width: 20px;
  }
}

</style>
