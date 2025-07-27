<template>
  <div class="not-found">
    <n-result description="您访问的页面不存在或已被删除" status="404" title="404 页面不存在">
      <template #footer>
        <n-button type="primary" @click="backToHome">返回首页</n-button>
      </template>
    </n-result>
  </div>
</template>

<script lang="ts" setup>
import {useRouter} from 'vue-router'

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