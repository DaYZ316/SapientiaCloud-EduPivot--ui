<template>
  <div class="not-found">
    <n-result status="404" title="404 页面不存在" description="您访问的页面不存在或已被删除">
      <template #footer>
        <n-button type="primary" @click="backToHome">返回首页</n-button>
      </template>
    </n-result>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

// 返回首页
const backToHome = () => {
  router.push('/')
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as vars;

.not-found {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background-color: var(--background-color-base);
}
</style> 