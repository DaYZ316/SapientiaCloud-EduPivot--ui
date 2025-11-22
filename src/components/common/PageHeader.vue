<template>
  <div class="page-header">
    <n-button class="back-button" quaternary type="text" @click="goBack">
      <template #icon>
        <Icon :component="ArrowBackOutline"/>
      </template>
      {{ t('common.back') }}
    </n-button>
    <h1 v-if="title" class="page-title">{{ title }}</h1>
  </div>
</template>

<script lang="ts" setup>
import {ArrowBackOutline} from '@vicons/ionicons5'
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import Icon from '@/components/common/Icon.vue'

interface Props {
  title?: string
}

defineProps<Props>()

const {t} = useI18n()
const router = useRouter()

function goBack() {
  router.back()
}
</script>

<style lang="scss" scoped>
.page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 16px;

  .back-button {
    font-size: 16px;
    font-weight: 600;
  }

  .page-title {
    margin: 0;
    font-size: 24px;
    font-weight: 600;
    color: var(--primary-color);
  }
}
</style>


