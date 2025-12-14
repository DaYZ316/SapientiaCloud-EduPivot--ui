<template>
  <n-card :segmented="{content: true, footer: 'soft'}" class="live-room-overview" size="small">
    <template #header>
      <div class="overview-header">
        <span>{{ t('live.singleRoom.title') }}</span>
        <n-tag v-if="statusLabel" size="small" type="info">{{ statusLabel }}</n-tag>
      </div>
    </template>
    <n-skeleton v-if="loading" :repeat="5" text/>
    <div v-else>
      <div v-if="liveRoom && liveRoom.id" class="overview-body">
        <n-descriptions :column="2" bordered label-placement="left" size="small">
          <n-descriptions-item :label="t('live.singleRoom.roomName')">
            {{ liveRoom.roomName || '-' }}
          </n-descriptions-item>
          <n-descriptions-item :label="t('live.singleRoom.courseName')">
            {{ courseRecord?.courseName || '-' }}
          </n-descriptions-item>
          <n-descriptions-item :label="t('live.singleRoom.teacher')">
            {{ courseRecord?.teacherName || '-' }}
          </n-descriptions-item>
          <n-descriptions-item :label="t('live.singleRoom.maxParticipants')">
            {{ liveRoom.maxParticipants ?? '-' }}
          </n-descriptions-item>
          <n-descriptions-item :label="t('live.singleRoom.startTime')">
            {{ liveRoom.startTime || '-' }}
          </n-descriptions-item>
          <n-descriptions-item :label="t('live.singleRoom.expectedEndTime')">
            {{ liveRoom.expectedEndTime || '-' }}
          </n-descriptions-item>
        </n-descriptions>
      </div>
      <n-empty v-else :description="t('live.singleRoom.empty')"/>
    </div>
    <template #footer>
      <div class="overview-actions">
        <n-space>
          <n-button :disabled="!canEnterRoom" type="primary" @click="handleJoinRoom">
            {{ t('live.singleRoom.enterRoom') }}
          </n-button>
        </n-space>
        <n-button :disabled="loading" quaternary size="small" @click="emitRefresh">
          {{ t('common.refresh') }}
        </n-button>
      </div>
    </template>
  </n-card>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import type * as liveType from '@/types/live'
import type {CourseRecordVO} from '@/types/classroom'
import {getLiveRoomStatusLabel} from '@/enum/live'

const {t} = useI18n()
const router = useRouter()

interface Props {
  liveRoom: liveType.LiveRoomVO | null
  courseRecord?: CourseRecordVO | null
  loading?: boolean | null
}

const props = defineProps<Props>()

interface Emits {
  (e: 'refresh'): void
}

const emit = defineEmits<Emits>()

const statusLabel = computed(() => {
  if (!props.liveRoom || props.liveRoom.status === null || props.liveRoom.status === undefined) {
    return t('live.room.statusUnknown')
  }
  return getLiveRoomStatusLabel(props.liveRoom.status, false)
})
const canEnterRoom = computed(() => Boolean(props.liveRoom?.id))
const loading = computed(() => Boolean(props.loading))

function emitRefresh() {
  emit('refresh')
}

function handleJoinRoom() {
  if (!props.liveRoom?.id) return
  router.push({
    name: 'LiveRoom',
    params: {roomId: props.liveRoom.id}
  })
}
</script>

<style lang="scss" scoped>
@use './index.scss' as *;

.live-room-overview {
  height: 100%;
  display: flex;
  flex-direction: column;

  :deep(.n-card__content) {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .overview-body {
    flex: 1;
  }
}

.overview-header {
  display: flex;
  align-items: center;
  gap: 12px;
  font-weight: 500;
}

.overview-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>

