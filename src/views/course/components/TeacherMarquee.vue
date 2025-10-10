<template>
  <div class="teacher-marquee-container">

    <!-- 教师跑马灯内容 -->
    <div class="marquee-wrapper">
      <div
          v-if="assistantTeachers.length > 0"
          :class="{ 'marquee-animate': shouldAnimate }"
          :style="{ '--marquee-duration': `${marqueeDuration}s` }"
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
                :teacher-real-name="teacher.realName || teacher.teacherCode"
                class="teacher-avatar"
                round
                size="medium"
            />
            <div class="teacher-info">
              <div class="teacher-name">{{ teacher.realName || teacher.teacherCode }}</div>
              <div v-if="teacher.teacherCode" class="teacher-department">{{ teacher.teacherCode }}</div>
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
                :teacher-real-name="teacher.realName || teacher.teacherCode"
                class="teacher-avatar"
                round
                size="medium"
            />
            <div class="teacher-info">
              <div class="teacher-name">{{ teacher.realName || teacher.teacherCode }}</div>
              <div v-if="teacher.teacherCode" class="teacher-department">{{ teacher.teacherCode }}</div>
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
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRouter} from 'vue-router'
import type {TeacherVO} from '@/types/teacher'
import AvatarDisplay from '@/components/common/AvatarDisplay.vue'

// 定义组件属性
interface Props {
  /** 开课教师ID（用于排除） */
  mainTeacherId?: string
  /** 教师数据 */
  teachers: readonly TeacherVO[]
  /** 加载状态 */
  loading?: boolean
}

// 接收属性
const props = withDefaults(defineProps<Props>(), {
  loading: false
})

// 国际化
const {t} = useI18n()

// 路由
const router = useRouter()

// 响应式数据
const marqueeDuration = ref(20) // 跑马灯动画持续时间（秒）

// 计算属性
const assistantTeachers = computed(() => {
  return props.teachers?.filter(teacher => teacher.id !== props.mainTeacherId) || []
})

// 是否需要动画（当教师数量较多时启用）
const shouldAnimate = computed(() => assistantTeachers.value.length > 3)

// 点击教师跳转到个人主页
const handleTeacherClick = (teacher: TeacherVO) => {
  if (teacher.id) {
    router.push(`/user/${teacher.sysUserId}`)
  }
}

// 监听教师数据变化，动态调整动画速度
watch(() => assistantTeachers.value.length, (count) => {
  if (count > 0) {
    // 根据教师数量调整动画速度，教师越多速度越快
    marqueeDuration.value = Math.max(15, 30 - count * 2)
  }
}, {immediate: true})

</script>

<style lang="scss" scoped>
.teacher-marquee-container {
  border-radius: 12px;
  box-shadow: 0 2px 8px var(--shadow-secondary-color);
  border: 1px solid var(--border-secondary-color);
  transition: all 0.3s ease;
}


.marquee-wrapper {
  position: relative;
  overflow: hidden;
  height: 100%;
  border-radius: 8px;
  background: var(--background-secondary-color);
}

.marquee-content {
  display: flex;
  align-items: center;
  height: 100%;
  gap: 24px;
  padding: 0 16px;
  white-space: nowrap;

  &.marquee-animate {
    animation: marquee var(--marquee-duration, 20s) linear infinite;
  }
}

.teacher-group {
  display: flex;
  align-items: center;
  gap: 24px;
  flex-shrink: 0;
}

.teacher-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 16px;
  background: var(--background-color);
  border-radius: 20px;
  box-shadow: 0 2px 8px var(--shadow-secondary-color);
  border: 1px solid var(--border-secondary-color);
  transition: all 0.3s ease;
  min-width: 200px;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px var(--shadow-color);
    border-color: var(--primary-color);
  }
}

.teacher-avatar {
  margin-top: 5px;
  flex-shrink: 0;
}

.teacher-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}

.teacher-name {
  font-size: 14px;
  font-weight: 600;
  color: var(--primary-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.teacher-department {
  font-size: 12px;
  color: var(--text-secondary-color);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.empty-state {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: var(--text-secondary-color);
}

// 跑马灯动画
@keyframes marquee {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-50%);
  }
}

// 响应式设计
@media (max-width: 768px) {
  .teacher-marquee-container {
    padding: 16px;
    margin-top: 12px;
  }


  .teacher-item {
    min-width: 160px;
    padding: 6px 12px;
    gap: 8px;
  }

  .teacher-name {
    font-size: 13px;
  }

  .teacher-department {
    font-size: 11px;
  }
}

</style>