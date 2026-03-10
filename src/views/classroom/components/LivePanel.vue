<template>
  <div v-if="show" class="live-panel">
    <NButton circle class="live-panel__close" quaternary size="small" @click="handleClose">
      <template #icon>
        <CloseOutline/>
      </template>
    </NButton>

    <div class="live-panel__header">
      <div class="live-panel__title">{{ t('live.panel.title') }}</div>
    </div>

    <div class="live-panel__body">
      <div v-if="loading" class="live-panel__loading">
        <NSpin/>
      </div>

      <div v-else class="live-panel__grid">
        <div class="live-panel__left">
          <div v-if="!room" class="live-panel__create">
            <template v-if="isTeacher">
              <LiveRoomCreateForm
                  :courseId="props.courseId ?? null"
                  :courseRecordId="props.classroomId ?? null"
                  :liveRoom="room"
                  @success="onCreateSuccess"
              />
            </template>
            <template v-else>
              <div class="live-panel__empty">{{ t('classroom.waitingForTeacher') }}</div>
            </template>
          </div>

          <div v-else-if="room" class="live-panel__info">
            <div v-if="courseInfo" class="course-info-row">
              <img v-if="courseInfo.coverImageUrl" :src="courseInfo.coverImageUrl" alt="course cover"
                   class="course-cover"/>
              <div class="course-meta">
                <div class="course-title">{{ courseInfo.courseName }}</div>
                <div v-if="courseInfo.teacherName" class="course-teacher">{{ courseInfo.teacherName }}</div>
                <div v-if="courseInfo.description" class="course-desc">{{ courseInfo.description }}</div>
                <div class="course-extra">
                  <span v-if="courseInfo.semester">{{ t('live.panel.semester') }}{{ courseInfo.semester }}</span>
                  <span v-if="courseInfo.location"> · {{ t('live.panel.location') }}{{ courseInfo.location }}</span>
                </div>
              </div>
            </div>

            <div class="room-row"><strong>{{ t('live.panel.roomName') }}</strong> {{ room.roomName }}</div>
            <div class="room-row">
              <strong>{{ t('live.panel.status') }}</strong>
              <span
                  :class="['live-panel__status-badge', getStatusClass(room.status)]">{{ getStatusLabel(room.status) }}</span>
            </div>
            <div v-if="room.startTime" class="room-row"><strong>{{ t('live.panel.startTime') }}</strong> {{
              formatLiveTime(room.startTime) }}
            </div>
            <div v-if="room.expectedEndTime" class="room-row"><strong>{{ t('live.panel.expectedEndTime') }}</strong> {{
              formatLiveTime(room.expectedEndTime) }}
            </div>
            <div v-if="room.maxParticipants !== null && room.maxParticipants !== undefined" class="room-row">
              <strong>{{ t('live.panel.maxParticipants') }}</strong> {{ room.maxParticipants }}
            </div>
            <div v-if="room.recordingAssetUrl" class="room-row">
              <strong>{{ t('live.panel.recording') }}</strong>
              <a :href="room.recordingAssetUrl" target="_blank">{{ t('live.panel.view') }}</a>
            </div>
          </div>

          <div v-else class="live-panel__empty">{{ t('live.panel.noRoom') }}</div>
        </div>

        <div class="live-panel__right">
          <div class="live-panel__action-card">
            <div class="live-panel__action-status">
              <span class="live-panel__action-status-label">{{ t('live.panel.status') }}</span>
              <span
                  :class="[
                  'live-panel__status-badge',
                  getStatusClass(room?.status)
                ]"
              >
                {{ getStatusLabel(room?.status) }}
              </span>
            </div>

            <div class="live-panel__actions">
              <template v-if="room && room.status === LiveRoomStatusEnum.LIVE">
                <NButton :loading="joiningLoading" type="primary" @click="joinLive">{{ t('live.room.join') }}</NButton>
              </template>

              <template v-if="isTeacher">
                <template v-if="room && room.status === LiveRoomStatusEnum.LIVE">
                  <NButton :loading="endingLoading" type="warning" @click="endLive">{{ t('live.room.stop') }}</NButton>
                </template>
                <template v-else-if="room">
                  <NButton :loading="startingLoading" type="success" @click="startLive">{{ t('live.room.start') }}
                  </NButton>
                </template>
              </template>
            </div>

            <div v-if="!room" class="live-panel__action-tip">
              {{ isTeacher ? t('live.panel.noRoom') : t('classroom.waitingForTeacher') }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref, watch, onBeforeUnmount, computed} from 'vue';
import {useRouter} from 'vue-router';
import {useI18n} from 'vue-i18n';
import {NButton, NSpin} from 'naive-ui';
import {CloseOutline} from '@vicons/ionicons5';
import LiveRoomCreateForm from '@/views/live/components/LiveRoomCreateForm.vue';
import {LiveRoomRoleEnum} from '@/enum/live/liveRoomRoleEnum';
import {LiveRoomStatusEnum} from '@/enum/live/liveRoomStatusEnum';
import {useUserStore} from '@/store/modules/user';
import {useErrorHandler} from '@/views/live/LiveRoom/composables/useErrorHandler';
import {getGlobalApis} from '@/utils/naiveUIHelper';
import {
  getLatestLiveRoom,
  endLiveRoom,
  startLiveRoom,
  issueLiveRoomToken
} from '@/api/live/liveRoom';
import {getStudentSeat} from '@/api/classroom/courseRecordStudent';
import {getCourseById} from '@/api/course/course';
import type {LiveRoomVO} from '@/types/live';
import type {CourseVO} from '@/types/course';
import {useLivePiPStore} from '@/store';

const props = defineProps<{ show: boolean; classroomId: string | null; courseId?: string | null }>();
const emit = defineEmits<{ close: [] }>();
const {t} = useI18n();
const router = useRouter();
const userStore = useUserStore();
const livePiPStore = useLivePiPStore();

const loading = ref<boolean | null>(null);
const ending = ref<boolean | null>(null);
const room = ref<LiveRoomVO | null>(null);
const courseInfo = ref<CourseVO | null>(null);
const isTeacher = computed(() => {
  return userStore.hasRole && (userStore.hasRole('TEACHER') || userStore.hasRole('ADMIN'));
});
const joining = ref<boolean | null>(null);
const starting = ref<boolean | null>(null);

// 初始化错误处理器
const errorHandler = useErrorHandler();

// 转换 loading 状态为 boolean 类型（naive-ui 期望的类型）
const joiningLoading = computed(() => Boolean(joining.value));
const endingLoading = computed(() => Boolean(ending.value));
const startingLoading = computed(() => Boolean(starting.value));

const formatLiveTime = (time: string | null | undefined): string => {
  if (!time) {
    return '';
  }

  const raw = String(time).trim();
  const withT = raw.includes('T') ? raw : raw.replace(' ', 'T');
  const hasTimezone = /([zZ]|[+\-]\d{2}:\d{2})$/.test(withT);
  const parsedDate = new Date(hasTimezone ? withT : `${withT}+08:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return raw.replace('T', ' ');
  }

  const formatter = new Intl.DateTimeFormat('zh-CN', {
    timeZone: 'Asia/Shanghai',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  const parts = formatter.formatToParts(parsedDate);
  const values: Record<string, string> = {};
  parts.forEach((part) => {
    if (part.type !== 'literal') {
      values[part.type] = part.value;
    }
  });

  return `${values.year}-${values.month}-${values.day} ${values.hour}:${values.minute}:${values.second}`;
};

watch(() => props.show, async (val) => {
  if (val) {
    await loadRoom();
    // 移除SSE连接，改用定期更新
    startStatusPolling();
  } else {
    stopStatusPolling();
  }
});

const handleClose = () => emit('close');

async function loadRoom() {
  loading.value = true;
  room.value = null;
  try {
    const res: any = await getLatestLiveRoom(props.courseId ?? null, props.classroomId ?? null);
    const data = res?.data ?? null;

    if (!data || !data.id) {
      room.value = null;
      courseInfo.value = null;
      return;
    }

    if (typeof data.roomName !== 'string' || data.roomName.trim().length === 0) {
      room.value = null;
      courseInfo.value = null;
      return;
    }

    room.value = data;
    const cid = room.value?.courseId ?? props.courseId ?? null;
    if (cid) {
      await loadCourse(cid);
    } else {
      courseInfo.value = null;
    }
  } finally {
    loading.value = false;
  }
}

async function onCreateSuccess() {
  await loadRoom();
}

async function loadCourse(courseId: string) {
  const res: any = await getCourseById(courseId).catch((error) => {
    courseInfo.value = null;
    errorHandler.handleError(error, 'load_course', {
      showNotification: false
    });
    return null;
  });
  if (res?.data) {
    courseInfo.value = res.data;
  }
}

async function endLive() {
  if (!room.value || !room.value.id) return;
  ending.value = true;
  await endLiveRoom(room.value.id).then(async () => {
    await loadRoom();
  }).catch((error) => {
    errorHandler.handleError(error, 'end_live', {
      showNotification: true,
      allowRetry: true,
      onRetry: endLive
    });
  }).finally(() => {
    ending.value = false;
  });
}

async function joinLive() {
  if (!room.value || !room.value.id || joining.value) return;

  // 如果已经有小窗，直接恢复全屏直播（使用已有的连接）
  if (livePiPStore.isInPiPMode) {
    livePiPStore.exitPiPMode()
    router.push(`/live/room/${room.value.id}`)
    return
  }

  joining.value = true;

  if (!isTeacher.value) {
    const {message} = getGlobalApis();
    const recordId = props.classroomId ?? null;
    const studentId = userStore.studentInfo?.id ?? null;
    if (!recordId) {
      if (message) message.info(t('classroom.liveNotAvailable'));
      joining.value = false;
      return;
    }
    if (!studentId) {
      if (message) message.info(t('classroom.noStudentIdentityContent'));
      joining.value = false;
      return;
    }
    try {
      const seatRes: any = await getStudentSeat(recordId, studentId);
      const seatInfo = seatRes?.data ?? seatRes ?? null;
      if (!seatInfo || seatInfo.seatIndex === null || seatInfo.seatIndex === undefined) {
        if (message) message.info(t('live.panel.seatRequired'));
        joining.value = false;
        return;
      }
    } catch (error) {
      if (message) message.info(t('live.panel.seatRequired'));
      joining.value = false;
      return;
    }
  }

  const role = isTeacher.value ? LiveRoomRoleEnum.TEACHER : LiveRoomRoleEnum.STUDENT;
  const tokenReq: any = {role};

  await issueLiveRoomToken(room.value.id, tokenReq).then((res: any) => {
    let token: string | null = null;
    let sessionId: string | null = null;
    if (res?.token) {
      token = res.token;
    } else if (res?.data) {
      token = typeof res.data === 'string' ? res.data : (res.data.token || null);
      sessionId = typeof res.data === 'object' ? (res.data.sessionId || null) : null;
    } else if (typeof res === 'string') {
      token = res;
    }

    if (token && room.value) {
      router.push({
        name: 'LiveRoom',
        params: {roomId: room.value.id},
        query: {token, sessionId}
      });
    } else {
      errorHandler.handleError(new Error(t('live.panel.joinTokenFailed')), 'join_live_token', {
        showNotification: true,
        customMessage: t('live.panel.joinTokenFailed')
      });
    }
  }).catch((error: any) => {
    errorHandler.handleError(error, 'join_live', {
      showNotification: true,
      customMessage: t('live.panel.joinFailed')
    });
  }).finally(() => {
    joining.value = false;
  });
}

async function startLive() {
  if (!room.value || !room.value.id) return;
  starting.value = true;

  await startLiveRoom(room.value.id).then(async () => {
    await loadRoom();
    const {message} = getGlobalApis();
    if (message) {
      message.success(t('live.room.startSuccess'));
    }
  }).catch((error) => {
    errorHandler.handleError(error, 'start_live', {
      showNotification: true,
      customMessage: t('live.room.startFailed')
    });
  }).finally(() => {
    starting.value = false;
  });
}

function getStatusLabel(status: number | null | undefined) {
  if (status === LiveRoomStatusEnum.LIVE) return t('classroom.liveStatus.live');
  if (status === LiveRoomStatusEnum.ENDED) return t('classroom.liveStatus.ended');
  if (status === LiveRoomStatusEnum.CLOSED) return t('classroom.liveStatus.closed');
  return t('classroom.liveStatus.notStarted');
}

function getStatusClass(status: number | null | undefined): string {
  if (status === LiveRoomStatusEnum.LIVE) return 'is-live';
  if (status === LiveRoomStatusEnum.ENDED) return 'is-ended';
  if (status === LiveRoomStatusEnum.CLOSED) return 'is-closed';
  return 'is-idle';
}

// 状态轮询定时器
let statusPollingTimer: number | null = null;

function startStatusPolling() {
  stopStatusPolling();
  // 每10秒检查一次房间状态
  statusPollingTimer = window.setInterval(async () => {
    if (props.classroomId) {
      await loadRoom();
    }
  }, 10000);
}

function stopStatusPolling() {
  if (statusPollingTimer) {
    clearInterval(statusPollingTimer);
    statusPollingTimer = null;
  }
}

onBeforeUnmount(() => {
  stopStatusPolling();
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.live-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: panel-enter 0.25s ease;
  width: min(1120px, 88vw);
  max-width: 1120px;
  min-height: 72vh;
  max-height: 84vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(
          135deg,
          color-mix(in srgb, var(--background-secondary-color) 80%, transparent),
          color-mix(in srgb, var(--background-tertiary-color) 95%, transparent)
  );
  border: 1px solid color-mix(in srgb, var(--border-color) 80%, transparent);
  border-radius: 16px;
  box-shadow: 0 18px 38px color-mix(in srgb, var(--shadow-color) 80%, transparent);
  overflow: hidden;
  z-index: 1003;
}

@keyframes panel-enter {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.985);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

.live-panel__close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1004;
  color: var(--text-color);

  &:hover {
    color: var(--color-primary);
    background-color: color-mix(in srgb, var(--color-primary) 15%, transparent);
  }
}

.live-panel__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  border-bottom: 1px solid color-mix(in srgb, var(--border-secondary-color) 90%, transparent);
}

.live-panel__title {
  font-weight: 600;
  color: var(--text-color);
}

.live-panel__body {
  flex: 1;
  padding: 12px;
  overflow: hidden;
  background: color-mix(in srgb, var(--background-secondary-color) 85%, transparent);
}

.live-panel__loading {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.room-row {
  display: grid;
  grid-template-columns: 120px 1fr;
  column-gap: 12px;
  align-items: center;
  padding: 12px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
  color: var(--text-color);
  background: color-mix(in srgb, var(--background-tertiary-color) 82%, transparent);
  border: 1px solid color-mix(in srgb, var(--border-color) 70%, transparent);
  margin: 10px 0;
}

.room-row strong {
  color: var(--text-color-3);
  font-weight: 600;
}

.live-panel__status-badge {
  width: fit-content;
  max-width: 100%;
  padding: 3px 10px;
  border-radius: 999px;
  font-size: 12px;
  font-weight: 700;
  line-height: 1.4;
  border: 1px solid transparent;
  white-space: nowrap;

  &.is-live {
    color: var(--success-color);
    border-color: color-mix(in srgb, var(--success-color) 60%, transparent);
    background: color-mix(in srgb, var(--success-color) 12%, transparent);
  }

  &.is-ended {
    color: var(--error-color);
    border-color: color-mix(in srgb, var(--error-color) 60%, transparent);
    background: color-mix(in srgb, var(--error-color) 12%, transparent);
  }

  &.is-closed {
    color: var(--warning-color);
    border-color: color-mix(in srgb, var(--warning-color) 60%, transparent);
    background: color-mix(in srgb, var(--warning-color) 12%, transparent);
  }

  &.is-idle {
    color: var(--text-color-3);
    border-color: color-mix(in srgb, var(--border-color) 70%, transparent);
    background: color-mix(in srgb, var(--background-color) 88%, transparent);
  }
}

.course-info-row {
  display: flex;
  gap: 14px;
  align-items: flex-start;
  margin-bottom: 14px;
  padding: 14px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--background-tertiary-color) 80%, transparent);
  border: 1px solid color-mix(in srgb, var(--border-color) 70%, transparent);
}

.course-cover {
  width: 104px;
  height: 72px;
  object-fit: cover;
  border-radius: 12px;
  background: var(--background-color);
  border: 1px solid color-mix(in srgb, var(--border-color) 85%, transparent);
  box-shadow: 0 8px 18px color-mix(in srgb, var(--shadow-color) 24%, transparent);
}

.course-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.course-title {
  font-weight: 700;
  font-size: 19px;
  line-height: 1.3;
}

.course-teacher {
  color: var(--text-color-3);
  font-size: 14px;
  line-height: 1.4;
}

.course-desc {
  color: var(--text-color-3);
  font-size: 13px;
  line-height: 1.5;
  max-height: 56px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.course-extra {
  color: var(--text-color-3);
  font-size: 13px;
  line-height: 1.4;
}

.live-panel__actions :deep(.n-button) {
  font-size: 14px;
  height: 40px;
  padding: 0 14px;
  min-width: 120px;
}

.live-panel__grid {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1.7fr) minmax(260px, 0.9fr);
  gap: 16px;
  align-items: stretch;
}

.live-panel__left {
  width: 100%;
  min-width: 0;
  height: 100%;
  overflow-y: auto;
  padding-right: 2px;
}

.live-panel__right {
  display: flex;
  align-items: stretch;
  min-width: 0;
}

.live-panel__action-card {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 14px;
  padding: 14px;
  border-radius: 14px;
  border: 1px solid color-mix(in srgb, var(--border-secondary-color) 78%, transparent);
  background: color-mix(in srgb, var(--background-tertiary-color) 82%, transparent);
  box-shadow: 0 8px 20px color-mix(in srgb, var(--shadow-secondary-color) 28%, transparent);
}

.live-panel__action-status {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
}

.live-panel__action-status-label {
  font-size: 13px;
  color: var(--text-color-3);
  font-weight: 600;
}

.live-panel__actions {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.live-panel__actions :deep(.n-button) {
  width: 100%;
}

.live-panel__action-tip {
  margin-top: auto;
  padding: 10px 12px;
  border-radius: 10px;
  border: 1px dashed color-mix(in srgb, var(--border-secondary-color) 85%, transparent);
  color: var(--text-color-3);
  font-size: 13px;
  line-height: 1.5;
}

.live-panel__empty {
  color: var(--text-color-3);
  padding: 14px;
  border-radius: 12px;
  border: 1px dashed color-mix(in srgb, var(--border-secondary-color) 78%, transparent);
  background: color-mix(in srgb, var(--background-tertiary-color) 76%, transparent);
}

@media (max-width: 1024px) {
  .live-panel {
    width: min(980px, 92vw);
    min-height: 76vh;
  }

  .live-panel__grid {
    grid-template-columns: 1fr;
  }

  .live-panel__left {
    overflow-y: auto;
  }

  .live-panel__right {
    overflow: visible;
  }

  .live-panel__action-card {
    flex-direction: row;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
  }

  .live-panel__action-status {
    min-width: 220px;
  }

  .live-panel__actions {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .live-panel__actions :deep(.n-button) {
    width: auto;
    min-width: 140px;
  }

  .live-panel__action-tip {
    margin-top: 0;
    width: 100%;
  }
}

@media (max-width: 768px) {
  .live-panel {
    width: 94vw;
    min-height: 78vh;
    max-height: 88vh;
  }

  .room-row {
    grid-template-columns: 100px 1fr;
    padding: 10px 12px;
    font-size: 13px;
  }

  .course-info-row {
    padding: 12px;
  }

  .course-cover {
    width: 88px;
    height: 62px;
  }

  .course-title {
    font-size: 16px;
  }

  .live-panel__actions :deep(.n-button) {
    width: 100%;
  }
}
</style>
