<template>
  <div class="page-header">
    <n-button circle quaternary @click="goBack">
      <template #icon>
        <Icon :component="ArrowBackOutline"/>
      </template>
    </n-button>
    <h1 class="page-title">{{ title }}</h1>
  </div>
</template>

<script lang="ts" setup>
import {ArrowBackOutline} from '@vicons/ionicons5'
import {useRouter} from 'vue-router'
import Icon from '@/components/common/Icon.vue'

interface Props {
  title: string
}

defineProps<Props>()

const router = useRouter()

function goBack() {
  router.back()
}
</script>

<style lang="scss" scoped>
.page-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;

  .page-title {
    margin: 0 0 0 12px;
    font-size: 24px;
    font-weight: 600;
    color: var(--primary-color);
  }
}
</style>
