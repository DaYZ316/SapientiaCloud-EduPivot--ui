<template>
  <n-card size="small" class="live-room-overview" :segmented="{content: true, footer: 'soft'}">
    <template #header>
      <div class="overview-header">
        <span>{{ t('live.singleRoom.title') }}</span>
        <n-tag v-if="statusLabel" type="info" size="small">{{ statusLabel }}</n-tag>
      </div>
    </template>
    <n-skeleton v-if="loading" text :repeat="5" />
    <div v-else>
      <div v-if="liveRoom && liveRoom.id" class="overview-body">
        <n-descriptions :column="2" label-placement="left" size="small" bordered>
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
      <n-empty v-else :description="t('live.singleRoom.empty')" />
    </div>
    <template #footer>
      <div class="overview-actions">
        <n-space>
          <n-button type="primary" :disabled="!canEnterRoom" @click="handleJoinRoom">
            {{ t('live.singleRoom.enterRoom') }}
          </n-button>
          <n-button secondary :disabled="!canIssueToken" @click="openTokenModal">
            {{ t('live.actions.issueToken') }}
          </n-button>
        </n-space>
        <n-button quaternary size="small" :disabled="loading" @click="emitRefresh">
          {{ t('common.refresh') }}
        </n-button>
      </div>
    </template>
  </n-card>
  <n-modal v-model:show="showTokenModal" preset="card" :title="t('live.token.modalTitle')" class="token-modal">
    <n-form label-placement="left" label-width="120">
      <n-form-item :label="t('live.token.roleLabel')">
        <n-select
            v-model:value="selectedRole"
            :options="roleOptions"
        />
      </n-form-item>
    </n-form>
    <div class="token-modal__actions">
      <n-space justify="end">
        <n-button quaternary @click="showTokenModal = false">
          {{ t('common.cancel') }}
        </n-button>
        <n-button type="primary" :loading="issuingToken" @click="handleIssueToken">
          {{ t('live.token.issueButton') }}
        </n-button>
      </n-space>
    </div>
    <div v-if="issuedToken" class="token-modal__result">
      <div class="token-field">
        <span>{{ t('live.token.issuedToken') }}</span>
        <div class="token-field__content">
          <n-input :value="issuedToken" readonly />
          <n-button tertiary size="small" @click="copyToClipboard(issuedToken)">
            {{ t('live.token.copyToken') }}
          </n-button>
        </div>
      </div>
      <div v-if="shareLink" class="token-field">
        <span>{{ t('live.token.shareLink') }}</span>
        <div class="token-field__content">
          <n-input :value="shareLink" readonly />
          <n-button tertiary size="small" @click="copyToClipboard(shareLink)">
            {{ t('live.token.copyLink') }}
          </n-button>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue'
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import type * as liveType from '@/types/live'
import type {CourseRecordVO} from '@/types/classroom'
import {LiveRoomRoleEnum, getLiveRoomRoleOptions, getLiveRoomStatusLabel} from '@/enum/live'
import * as liveApi from '@/api/live'

const {t} = useI18n()
const router = useRouter()

interface Props {
  liveRoom: liveType.LiveRoomVO | null
  courseRecord?: CourseRecordVO | null
  loading?: boolean
}

const props = defineProps<Props>()

interface Emits {
  (e: 'refresh'): void
}

const emit = defineEmits<Emits>()

const showTokenModal = ref(false)
const issuingToken = ref(false)
const issuedToken = ref('')
const selectedRole = ref<LiveRoomRoleEnum>(LiveRoomRoleEnum.STUDENT)

const roleOptions = computed(() => getLiveRoomRoleOptions(t))
const statusLabel = computed(() => {
  if (!props.liveRoom || props.liveRoom.status === null || props.liveRoom.status === undefined) {
    return t('live.room.statusUnknown')
  }
  return getLiveRoomStatusLabel(props.liveRoom.status, false)
})
const canEnterRoom = computed(() => Boolean(props.liveRoom?.id))
const canIssueToken = computed(() => Boolean(props.liveRoom?.id))
const loading = computed(() => Boolean(props.loading))
const shareLink = computed(() => {
  if (!issuedToken.value || !props.liveRoom?.id) return ''
  const resolved = router.resolve({
    name: 'LiveRoom',
    params: {roomId: props.liveRoom.id},
    query: {token: issuedToken.value}
  })
  if (typeof window === 'undefined') {
    return resolved.href
  }
  return `${window.location.origin}${resolved.href}`
})

function emitRefresh() {
  emit('refresh')
}

function handleJoinRoom() {
  if (!props.liveRoom?.id) return
  router.push({name: 'LiveRoom', params: {roomId: props.liveRoom.id}})
}

function openTokenModal() {
  if (!props.liveRoom?.id) return
  issuedToken.value = ''
  selectedRole.value = LiveRoomRoleEnum.STUDENT
  showTokenModal.value = true
}

async function handleIssueToken() {
  if (!props.liveRoom?.id) return
  issuingToken.value = true

  const tokenRequest = liveApi.getDefaultLiveRoomTokenRequestDTO()
  tokenRequest.role = selectedRole.value

  const response = await liveApi.issueLiveRoomToken(props.liveRoom.id, tokenRequest).then((res) => res, () => null)

  if (response?.data) {
    issuedToken.value = response.data
  }

  issuingToken.value = false
}

function copyToClipboard(value: string) {
  if (!value) return
  if (typeof navigator !== 'undefined' && navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(value)
    return
  }
  if (typeof document === 'undefined') return
  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}
</script>

<style lang="scss" scoped>
@use './index.scss' as *;

.live-room-overview {
  margin-top: 16px;
}

.overview-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.overview-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.token-modal__actions {
  margin-top: 8px;
}

.token-modal__result {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.token-field {
  display: flex;
  flex-direction: column;
  gap: 4px;

  &__content {
    display: flex;
    gap: 8px;
    align-items: center;
  }
}
</style>

