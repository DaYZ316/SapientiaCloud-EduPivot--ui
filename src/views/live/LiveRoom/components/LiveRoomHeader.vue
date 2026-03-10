<template>
  <page-header :title="context.roomInfo.value?.roomName || t('live.room.title')"/>
</template>

<script lang="ts" setup>
import {useI18n} from 'vue-i18n'
import PageHeader from '@/components/common/PageHeader.vue'
import {useLiveRoomContext} from '../composables/useLiveRoomContext'

const {t} = useI18n()

// 使用注入的上下文
const context = useLiveRoomContext()
</script>
