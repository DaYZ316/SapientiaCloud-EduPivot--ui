<template>
  <div v-if="show" class="live-panel">
    <NButton circle class="live-panel__close" quaternary size="small" @click="handleClose">
      <template #icon>
        <CloseOutline />
      </template>
    </NButton>

    <div class="live-panel__header">
      <div class="live-panel__title">直播房间配置</div>
    </div>

    <div class="live-panel__body">
      <div v-if="loading" class="live-panel__loading">
        <NSpin />
      </div>

      <div v-else class="live-panel__grid">
        <div class="live-panel__left">
          <div v-if="!room" class="live-panel__create">
            <template v-if="isTeacher">
              <LiveRoomCreateForm
                :courseRecordId="props.classroomId ?? null"
                :courseId="props.courseId ?? null"
                :liveRoom="room"
                @success="onCreateSuccess"
              />
            </template>
            <template v-else>
              <div class="live-panel__empty">{{ t('classroom.waitingForTeacher') }}</div>
            </template>
          </div>

          <div v-else-if="room" class="live-panel__info">
            <div class="course-info-row" v-if="courseInfo">
              <img v-if="courseInfo.coverImageUrl" :src="courseInfo.coverImageUrl" alt="course cover" class="course-cover" />
              <div class="course-meta">
                <div class="course-title">{{ courseInfo.courseName }}</div>
                <div class="course-teacher" v-if="courseInfo.teacherName">{{ courseInfo.teacherName }}</div>
                <div class="course-desc" v-if="courseInfo.description">{{ courseInfo.description }}</div>
                <div class="course-extra">
                  <span v-if="courseInfo.semester">学期: {{ courseInfo.semester }}</span>
                  <span v-if="courseInfo.location"> · 地点: {{ courseInfo.location }}</span>
                </div>
              </div>
            </div>

            <div class="room-row"><strong>房间名：</strong> {{ room.roomName }}</div>
            <div class="room-row"><strong>状态：</strong> {{ getStatusLabel(room.status) }}</div>
            <div class="room-row" v-if="room.startTime"><strong>开始：</strong> {{ room.startTime }}</div>
            <div class="room-row" v-if="room.expectedEndTime"><strong>预计结束：</strong> {{ room.expectedEndTime }}</div>
            <div class="room-row" v-if="room.maxParticipants !== null && room.maxParticipants !== undefined"><strong>最大人数：</strong> {{ room.maxParticipants }}</div>
            <div class="room-row" v-if="room.recordingAssetUrl"><strong>回放：</strong> <a :href="room.recordingAssetUrl" target="_blank">查看</a></div>

          </div>

          <div v-else class="live-panel__empty">暂无直播房间</div>
        </div>

        <!-- footer actions: moved here so they are always at the bottom of the left column -->
        <div class="live-panel__actions">
          <template v-if="room && room.status === LiveRoomStatusEnum.LIVE">
            <NButton type="primary" @click="joinLive" :loading="joiningLoading">{{ t('live.room.join') }}</NButton>
          </template>

          <span v-if="isTeacher">
            <template v-if="room && room.status === LiveRoomStatusEnum.LIVE">
              <NButton type="warning" @click="endLive" :loading="endingLoading">{{ t('live.room.stop') || '结束直播' }}</NButton>
            </template>
            <template v-else>
              <NButton type="success" @click="startLive" :loading="startingLoading">{{ t('live.room.start') || '开启直播' }}</NButton>
            </template>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onBeforeUnmount, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { NButton, NSpin } from 'naive-ui';
import { CloseOutline } from '@vicons/ionicons5';
import { fetchEventSource } from '@microsoft/fetch-event-source';
import LiveRoomCreateForm from '@/views/live/components/LiveRoomCreateForm.vue';
import { LiveRoomRoleEnum } from '@/enum/live/liveRoomRoleEnum';
import { LiveRoomStatusEnum } from '@/enum/live/liveRoomStatusEnum';
import { useUserStore } from '@/store/modules/user';
import { useErrorHandler } from '@/views/live/LiveRoom/composables/useErrorHandler';
import { getGlobalApis } from '@/utils/naiveUIHelper';
import {
  getLatestLiveRoom,
  endLiveRoom,
  startLiveRoom,
  issueRoomToken
} from '@/api/live/liveRoom';
import { getCourseById } from '@/api/course/course';
import type { LiveRoomVO } from '@/types/live';
import type { CourseVO } from '@/types/course';

const props = defineProps<{ show: boolean; classroomId: string | null; courseId?: string | null }>();
const emit = defineEmits<{ close: [] }>();
const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();

const loading = ref<boolean | null>(null);
// creating flag removed; child component handles creation
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

// 转换loading状态为boolean类型（naive-ui期望的类型）
const joiningLoading = computed(() => Boolean(joining.value));
const endingLoading = computed(() => Boolean(ending.value));
const startingLoading = computed(() => Boolean(starting.value));

// no-op

watch(() => props.show, async (val) => {
  if (val) {
    await loadRoom();
    subscribeSse();
  } else {
    unsubscribeSse();
  }
});

const handleClose = () => emit('close');

async function loadRoom() {
  loading.value = true;
  room.value = null;
  try {
    const res: any = await getLatestLiveRoom(props.courseId ?? null, props.classroomId ?? null);
    const data = res?.data ?? null;

    // Treat empty or invalid responses (no id) as no room
    if (!data || !data.id) {
      room.value = null;
      courseInfo.value = null;
      return;
    }

    // Require a non-empty roomName to treat the response as a created room.
    // If roomName is missing or empty, treat as "no room" so teachers see the create form.
    if (typeof data.roomName !== 'string' || data.roomName.trim().length === 0) {
      room.value = null;
      courseInfo.value = null;
      return;
    }

    room.value = data;
    // load course info if available
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
  // reload latest room after child emitted success
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
    // reload
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
  joining.value = true;

  const role = isTeacher.value ? LiveRoomRoleEnum.TEACHER : LiveRoomRoleEnum.STUDENT;
  const tokenReq: any = { role };

  await issueRoomToken(room.value.id, tokenReq).then((res: any) => {
    // Extract token string correctly
    let token = '';
    if (res?.token) {
      token = res.token;
    } else if (res?.data) {
      token = typeof res.data === 'string' ? res.data : (res.data.token || '');
    } else if (typeof res === 'string') {
      token = res;
    }

    if (token && room.value) {
      // 跳转到直播页面，传递 token 作为查询参数
      router.push({
        name: 'LiveRoom',
        params: { roomId: room.value.id },
        query: { token }
      });
    } else {
      errorHandler.handleError(new Error('获取直播令牌失败'), 'join_live_token', {
        showNotification: true,
        customMessage: '进入直播间失败：无法获取访问令牌'
      });
    }
  }).catch((error) => {
    errorHandler.handleError(error, 'join_live', {
      showNotification: true,
      customMessage: '进入直播间失败'
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
    const { message } = getGlobalApis();
    if (message) {
      message.success(t('live.room.startSuccess') || '已开启直播');
    }
  }).catch((error) => {
    errorHandler.handleError(error, 'start_live', {
      showNotification: true,
      customMessage: t('live.room.startFailed') || '开启直播失败'
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

// SSE subscription
let eventSourceController: AbortController | null = null;
async function subscribeSse() {
  if (!props.classroomId) return;
  unsubscribeSse();

  try {
    const jwtToken = userStore.token;
    if (!jwtToken) {
      throw new Error('用户未登录，无法建立SSE连接');
    }

    const sseUrl = `/celestial-hub/live/subscribe?classroomId=${props.classroomId}`;

    eventSourceController = new AbortController();

    await fetchEventSource(sseUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Accept': 'text/event-stream'
      },
      signal: eventSourceController.signal,
      openWhenHidden: true,
      credentials: 'include',
      onopen: async (response) => {
        if (response.ok) {
          console.log('LivePanel SSE连接建立成功');
        } else {
          console.error('LivePanel SSE连接失败:', response.status, response.statusText);
        }
      },
      onmessage: (evt) => {
        try {
          const data = JSON.parse(evt.data);
          // Require a non-empty roomName to treat the response as a created room.
          // If roomName is missing or empty, treat as "no room" so teachers see the create form.
          if (typeof data.roomName !== 'string' || data.roomName.trim().length === 0) {
            room.value = null;
            courseInfo.value = null;
            return;
          }
          // update room info (hub may send map or LiveRoomVO-like object)
          room.value = data;
          // show notifications for status changes
          const status = data && (data.status || data.status === 0) ? Number(data.status) : null;
          if (status === LiveRoomStatusEnum.LIVE) {
            const { message } = getGlobalApis();
            if (message) message.success('直播开始');
          } else if (status === LiveRoomStatusEnum.ENDED) {
            const { message } = getGlobalApis();
            if (message) message.info('直播已结束');
          } else if (status === LiveRoomStatusEnum.CLOSED) {
            const { message } = getGlobalApis();
            if (message) message.info('直播已关闭');
          }
        } catch (e) {
          // ignore JSON parse errors
        }
      },
      onerror: (error) => {
        console.error('LivePanel SSE连接错误:', error);
        // Don't show error notifications for connection issues, just log them
      }
    });
  } catch (error) {
    errorHandler.handleError(error, 'sse_subscribe', {
      showNotification: true,
      customMessage: 'SSE 订阅失败'
    });
  }
}

function unsubscribeSse() {
  if (eventSourceController) {
    try {
      eventSourceController.abort();
    } catch (e) {
    }
    eventSourceController = null;
  }
}

onBeforeUnmount(() => {
  unsubscribeSse();
});
</script>

<style scoped lang="scss">
@use '@/assets/styles/index.scss' as *;

.live-panel {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  animation: panel-enter 0.25s ease;
  width: min(920px, 92vw);
  max-width: 920px;
  height: min(78vh, 720px);
  max-height: 78vh;
  display: flex;
  flex-direction: column;
  /* 更干净的背景：减少花哨渐变 */
  background: color-mix(in srgb, var(--background-color) 96%, transparent);
  border: 1px solid color-mix(in srgb, var(--border-color) 85%, transparent);
  border-radius: 16px;
  box-shadow: 0 22px 60px color-mix(in srgb, var(--shadow-color) 65%, transparent);
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
  padding: 14px 18px;
  background: color-mix(in srgb, var(--background-secondary-color) 55%, transparent);
  border-bottom: 1px solid color-mix(in srgb, var(--border-secondary-color) 85%, transparent);
}

.live-panel__title {
  font-weight: 600;
  color: var(--text-color);
}

.live-panel__body {
  flex: 1;
  padding: 16px;
  overflow: hidden;
  /* 内容区干净一点 */
  background: color-mix(in srgb, var(--background-color) 92%, transparent);
}

.room-row {
  display: grid;
  grid-template-columns: 110px 1fr;
  column-gap: 12px;
  align-items: baseline;
  padding: 14px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  color: var(--text-color);
  /* 轻分隔感 */
  background: color-mix(in srgb, var(--background-color) 92%, transparent);
  border: 1px solid color-mix(in srgb, var(--border-color) 75%, transparent);
  margin: 12px 0;
}

.live-panel__actions {
  margin-top: 12px;
  display: flex;
  align-items: center;
  gap: 12px;
}
.course-info-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 12px;
}
.course-cover {
  width: 92px;
  height: 64px;
  object-fit: cover;
  border-radius: 10px;
  background: var(--background-color);
  border: 1px solid color-mix(in srgb, var(--border-color) 85%, transparent);
  box-shadow: 0 6px 16px color-mix(in srgb, var(--shadow-color) 22%, transparent);
}
.course-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.course-title {
  font-weight: 700;
  font-size: 18px;
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
  height: 36px;
  padding: 0 12px;
}

.live-panel__grid {
  height: 100%;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr; /* single column: left fills entire modal */
  gap: 16px;
  align-items: stretch;
}

.live-panel__left {
  width: 100%;
}

.live-panel__right {
  display: none; /* hide right column since left should occupy full modal */
}

</style>


