<template>
  <n-card class="live-room-settings-card" size="small">
    <template #header>
      <div class="card-header">
        <span>{{ t('live.form.title') }}</span>
      </div>
    </template>
    <n-form
        ref="formRef"
        :disabled="!courseRecordId"
        :model="formData"
        :rules="formRules"
        label-placement="left"
        label-width="120"
    >
      <n-grid :cols="2" :x-gap="24">
        <n-gi :span="2">
          <n-form-item :label="t('live.form.roomName')" path="roomName">
            <n-input
                v-model:value="formData.roomName"
                :placeholder="t('live.form.roomNamePlaceholder')"
                clearable
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item :label="t('live.form.maxParticipants')" path="maxParticipants">
            <n-input-number
                v-model:value="formData.maxParticipants"
                :max="10000"
                :min="1"
                :placeholder="t('live.form.maxParticipantsPlaceholder')"
                clearable
                style="width: 100%"
            />
          </n-form-item>
        </n-gi>
        <n-gi>
          <n-form-item :label="t('live.form.recordingEnabled')" path="recordingEnabled">
            <n-switch
                v-model:value="formData.recordingEnabled"
                :checked-value="1"
                :unchecked-value="0"
            >
              <template #checked>{{ t('live.form.recordingEnabledOn') }}</template>
              <template #unchecked>{{ t('live.form.recordingEnabledOff') }}</template>
            </n-switch>
          </n-form-item>
        </n-gi>
      </n-grid>
      <div v-if="!courseRecordId" class="form-hint">
        <n-alert :title="t('live.form.courseRecordMissing')" type="warning">
          {{ t('live.form.courseRecordMissingDesc') }}
        </n-alert>
      </div>
      <div class="form-actions">
        <n-space>
          <n-button :disabled="!courseRecordId" @click="handleReset">{{ t('common.reset') }}</n-button>
          <n-button :disabled="!courseRecordId" :loading="submitting" type="primary" @click="handleSubmit">
            创建直播房间
          </n-button>
        </n-space>
      </div>
    </n-form>
  </n-card>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from 'vue'
import type {FormInst, FormRules} from 'naive-ui'
import type * as liveType from '@/types/live'
import {useI18n} from 'vue-i18n'
import * as liveApi from '@/api/live'

const {t} = useI18n()

interface Props {
  courseRecordId: string | null
  courseId: string | null
  liveRoom?: liveType.LiveRoomVO | null
}

interface Emits {
  (e: 'success'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const formRef = ref<FormInst | null>(null)
const defaultFormData = liveApi.getDefaultLiveRoomCreateDTO()
const formData = ref<liveType.LiveRoomCreateDTO>({
  ...defaultFormData,
  roomName: defaultFormData.roomName ?? null,
  classroomId: defaultFormData.classroomId ?? null
})
const submitting = ref<boolean | null>(null)

const formRules: FormRules = {
  roomName: [
    {required: true, message: t('live.validation.roomNameRequired'), trigger: 'blur'},
    {max: 128, message: t('live.validation.roomNameLength'), trigger: 'blur'}
  ]
}

const normalizedRecording = computed(() => {
  if (!props.liveRoom) {
    return 0
  }
  if (props.liveRoom.recordingEnabled === null || props.liveRoom.recordingEnabled === undefined) {
    return 0
  }
  return props.liveRoom.recordingEnabled
})

watch(
    () => props.liveRoom,
    (room) => {
      if (!room) {
        const defaultData = liveApi.getDefaultLiveRoomCreateDTO()
        formData.value = {
          ...defaultData,
          roomName: defaultData.roomName ?? null,
          courseId: props.courseId,
          classroomId: props.courseRecordId,
          recordingEnabled: defaultData.recordingEnabled ?? 0
        }
        return
      }
      formData.value.roomName = room.roomName ?? null
      formData.value.courseId = room.courseId ?? props.courseId ?? null
      formData.value.classroomId = props.courseRecordId
      formData.value.maxParticipants = room.maxParticipants ?? null
      formData.value.recordingEnabled = normalizedRecording.value
    },
    {immediate: true}
)

async function handleSubmit() {
  if (!props.courseRecordId) {
    return
  }
  // 表单验证，如果失败则不提交（不使用 try-catch，使用 then 的第二个参数）
  await formRef.value?.validate().then(() => {
    submitting.value = true

    const submitData: liveType.LiveRoomCreateDTO = {
      roomName: formData.value.roomName,
      courseId: props.courseId,
      classroomId: props.courseRecordId,
      maxParticipants: formData.value.maxParticipants ?? null,
      recordingEnabled: formData.value.recordingEnabled ?? 0
    }

    return liveApi.createLiveRoom(submitData).then((response) => {
      if (response?.data) {
        emit('success')
      }
      submitting.value = null
    }, () => {
      submitting.value = null
    })
  }, () => {
    // 表单验证失败，不提交
  })
}

function handleReset() {
  if (!props.liveRoom) {
    const defaultData = liveApi.getDefaultLiveRoomCreateDTO()
    formData.value = {
      ...defaultData,
      roomName: defaultData.roomName ?? null,
      courseId: props.courseId,
      classroomId: props.courseRecordId,
      recordingEnabled: defaultData.recordingEnabled ?? 0
    }
    formRef.value?.restoreValidation()
    return
  }
  formData.value.roomName = props.liveRoom.roomName
  formData.value.maxParticipants = props.liveRoom.maxParticipants ?? null
  formData.value.recordingEnabled = normalizedRecording.value
  formRef.value?.restoreValidation()
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.live-room-settings-card {
  height: 100%;
  display: flex;
  flex-direction: column;

  :deep(.n-card__content) {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  :deep(.n-form) {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}

.form-actions {
  margin-top: auto;
  padding-top: 16px;
  display: flex;
  justify-content: flex-end;
}

.form-hint {
  margin-top: 8px;
}

.card-header {
  font-weight: 500;
}
</style>

