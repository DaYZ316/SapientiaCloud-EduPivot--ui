<template>
  <div class="live-container">
    <div class="live-content">
      <h1>{{ t('live.title') }}</h1>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'

const { t } = useI18n()
const route = useRoute()

const courseId = route.params.courseId as string | undefined
const courseRecordId = route.params.courseRecordId as string | undefined
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.live-container {
  width: 100%;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--background-color);
}

.live-content {
  text-align: center;
  
  h1 {
    color: var(--text-color);
    font-size: 2rem;
    font-weight: 600;
  }
}
</style>

