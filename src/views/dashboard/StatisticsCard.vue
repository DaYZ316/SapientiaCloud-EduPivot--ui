<template>
  <n-card class="statistics-card">
    <div class="stats-container">
      <div class="stat-item">
        <div class="stat-number">
          <n-number-animation
            v-if="startAnimation"
            ref="studentAnimationRef"
            :from="0"
            :to="statistics?.studentCount || 0"
            :precision="0"
            :duration="1000"
            :show-separator="true"
          />
          <span v-else>{{ statistics?.studentCount || 0 }}</span>
        </div>
        <div class="stat-label">{{ t('dashboard.stats.students') }}</div>
      </div>

      <n-divider vertical />

      <div class="stat-item">
        <div class="stat-number">
          <n-number-animation
            v-if="startAnimation"
            ref="teacherAnimationRef"
            :from="0"
            :to="statistics?.teacherCount || 0"
            :precision="0"
            :duration="1000"
            :show-separator="true"
          />
          <span v-else>{{ statistics?.teacherCount || 0 }}</span>
        </div>
        <div class="stat-label">{{ t('dashboard.stats.teachers') }}</div>
      </div>

      <n-divider vertical />

      <div class="stat-item">
        <div class="stat-number">
          <n-number-animation
            v-if="startAnimation"
            ref="courseAnimationRef"
            :from="0"
            :to="statistics?.courseCount || 0"
            :precision="0"
            :duration="1000"
            :show-separator="true"
          />
          <span v-else>{{ statistics?.courseCount || 0 }}</span>
        </div>
        <div class="stat-label">{{ t('dashboard.stats.courses') }}</div>
      </div>
    </div>
  </n-card>
</template>

<script lang="ts" setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { NCard, NNumberAnimation, NDivider } from 'naive-ui'
import type { StatisticsVO } from '@/types/dashboard/statistics'
import { getStatistics } from '@/api/dashboard/dashboard'

const { t } = useI18n()
const statistics = ref<StatisticsVO | null>(null)
const startAnimation = ref(false)

const loadStatistics = async () => {
  try {
    const result = await getStatistics()
    if (result.data) {
      statistics.value = result.data
      // 等待过渡动画结束后开始数字动画
      setTimeout(() => {
        startAnimation.value = true
      }, 800)
    }
  } catch (error) {
    // 静默处理错误
  }
}

onMounted(() => {
  loadStatistics()
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.statistics-card {
  height: 200px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  width: 40%;
  margin-left: auto;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  border: none;
  box-shadow:
    0 8px 32px var(--shadow-color),
    0 4px 16px var(--shadow-secondary-color);
  user-select: none;

  .stats-container {
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex: 1;
    padding: 0;
    height: 100%;

    .stat-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1;
      text-align: center;

      .stat-number {
        font-size: 42px;
        font-weight: 700;
        color: var(--primary-color);
        margin-bottom: 12px;
        min-height: 56px;
        display: flex;
        align-items: center;
        justify-content: center;
        text-shadow:
          0 3px 12px color-mix(in srgb, var(--primary-color) 40%, transparent),
          0 2px 4px rgba(0, 0, 0, 0.15);
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.08));
      }

      .stat-label {
        font-size: 18px;
        color: var(--text-secondary-color);
        font-weight: 500;
        letter-spacing: 0.5px;
        opacity: 0.9;
      }
    }
  }
}

@media (max-width: 768px) {
  .statistics-card {
    width: 90%;
    max-width: none;
    margin-left: auto;
    margin-right: auto;
    border-radius: 16px;
    box-shadow:
      0 6px 24px var(--shadow-color),
      0 3px 12px var(--shadow-secondary-color),
      inset 0 1px 0 rgba(255, 255, 255, 0.15);

    .stats-container {
      flex-direction: column;
      gap: 24px;
      padding: 28px 20px;
      height: 100%;

      .stat-item {
        flex-direction: column;
        justify-content: center;
        gap: 10px;

        .stat-number {
          font-size: 36px;
          min-height: 48px;
          text-shadow:
            0 3px 10px color-mix(in srgb, var(--primary-color) 35%, transparent),
            0 2px 3px rgba(0, 0, 0, 0.12);
        }

        .stat-label {
          font-size: 17px;
        }
      }
    }
  }

  .dark .statistics-card {
    box-shadow:
      0 8px 32px var(--shadow-color),
      0 4px 16px var(--shadow-secondary-color),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }
}

// 暗色主题磨砂效果
.dark {
  .statistics-card {
    background: rgba(26, 26, 26, 0.75);
    border: 1px solid rgba(255, 255, 255, 0.15);
    box-shadow:
      0 12px 40px var(--shadow-color),
      0 4px 16px var(--shadow-secondary-color),
      inset 0 1px 0 rgba(255, 255, 255, 0.08);
  }
}
</style>
