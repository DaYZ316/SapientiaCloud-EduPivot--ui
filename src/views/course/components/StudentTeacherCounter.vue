<template>
  <div class="student-teacher-counter">
    <div class="counter-container">
      <!-- 学生计数器 -->
      <div class="counter-item student-counter">
        <div class="counter-icon">
          <n-icon :component="PeopleOutline" color="var(--primary-color)" size="20"/>
        </div>
        <div :data-number="studentCount" class="counter-number">{{ studentCount }}</div>
        <div v-if="studentLoading" class="loading-indicator">
          <n-spin size="small"/>
        </div>
      </div>

      <!-- 分隔线 -->
      <div class="counter-divider"></div>

      <!-- 教师计数器 -->
      <div class="counter-item teacher-counter">
        <div class="counter-icon">
          <n-icon :component="SchoolOutline" color="var(--primary-color)" size="20"/>
        </div>
        <div :data-number="props.teacherCount" class="counter-number">{{ props.teacherCount }}</div>
        <div v-if="props.teacherLoading" class="loading-indicator">
          <n-spin size="small"/>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import {PeopleOutline, SchoolOutline} from '@vicons/ionicons5'
import {useCourseStudentData} from '../composables/useCourseStudentData'

// 定义组件属性
interface Props {
  courseId: string
  teacherCount?: number
  teacherLoading?: boolean
}

// 接收属性
const props = withDefaults(defineProps<Props>(), {
  teacherCount: 0,
  teacherLoading: false
})

// 使用学生数据 composable
const {students, isLoading: studentLoading} = useCourseStudentData(props.courseId)

// 计算学生数量
const studentCount = computed(() => {
  return students.value.length
})

</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.student-teacher-counter {
  padding: 16px 20px;
  background: var(--background-secondary-color);
  border-radius: 12px;
  border: 1px solid var(--border-secondary-color);
  box-shadow: 0 2px 8px var(--shadow-secondary-color);

  .counter-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;

    .counter-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 8px;
      flex: 1;
      position: relative;

      .counter-icon {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        border-radius: 10px;
        background: color-mix(in srgb, var(--primary-color) 10%, transparent);
        transition: all 0.3s ease;

        .n-icon {
          transition: transform 0.3s ease;
        }
      }


      .counter-number {
        font-size: 28px;
        font-weight: 800;
        line-height: 1.1;
        color: var(--primary-color);
        text-align: center;
        text-shadow: 0 1px 0 var(--primary-color),
        0 2px 0 var(--primary-color);
        background: linear-gradient(135deg,
            color-mix(in srgb, var(--primary-color) 90%, #fff) 0%,
            var(--primary-color) 30%,
            color-mix(in srgb, var(--primary-color) 80%, #000) 70%,
            color-mix(in srgb, var(--primary-color) 60%, #000) 100%
        );
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        filter: drop-shadow(0 3px 6px color-mix(in srgb, var(--primary-color) 30%, #000));
        position: relative;
        transform: perspective(100px) rotateX(5deg);

        &::before {
          content: attr(data-number);
          position: absolute;
          top: 0;
          left: 0;
          color: color-mix(in srgb, var(--primary-color) 20%, #000);
          transform: translate(2px, 2px);
          z-index: -1;
          text-shadow: none;
          background: none;
          -webkit-text-fill-color: color-mix(in srgb, var(--primary-color) 20%, #000);
        }

        &::after {
          content: attr(data-number);
          position: absolute;
          top: 0;
          left: 0;
          color: rgba(255, 255, 255, 0.1);
          transform: translate(-1px, -1px);
          z-index: -2;
          text-shadow: none;
          background: none;
          -webkit-text-fill-color: rgba(255, 255, 255, 0.1);
        }
      }

      .loading-indicator {
        position: absolute;
        top: 0;
        right: 0;
        display: flex;
        align-items: center;
        justify-content: center;
      }

    }

    .counter-divider {
      width: 1px;
      height: 40px;
      background: linear-gradient(
              to bottom,
              transparent 0%,
              var(--border-color) 20%,
              var(--border-color) 80%,
              transparent 100%
      );
      flex-shrink: 0;
    }
  }

  // 响应式设计
  @media (max-width: 768px) {
    margin-top: 12px;
    padding: 12px 16px;

    .counter-container {
      gap: 16px;

      .counter-item {
        gap: 6px;

        .counter-icon {
          width: 32px;
          height: 32px;
        }

        .counter-number {
          font-size: 22px;
          transform: perspective(80px) rotateX(3deg);
        }
      }

      .counter-divider {
        height: 32px;
      }
    }
  }
}

</style>
