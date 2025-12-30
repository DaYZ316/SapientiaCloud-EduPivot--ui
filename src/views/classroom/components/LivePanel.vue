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

      <div v-else>
                <div v-if="!room" class="live-panel__create">
          <LiveRoomCreateForm
            :courseRecordId="props.classroomId ?? null"
            :courseId="props.courseId ?? null"
            :liveRoom="room"
            @success="onCreateSuccess"
          />
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

          <div class="live-panel__actions">
            <NButton type="primary" @click="joinLive" :loading="joining">进入直播间</NButton>
            <span v-if="isTeacher">
              <NButton type="warning" @click="endLive" :loading="ending">结束直播</NButton>
            </span>
          </div>
        </div>

        <div v-else class="live-panel__empty">暂无直播房间</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, watch, onBeforeUnmount, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { NButton, NSpin, useMessage } from 'naive-ui';
import { CloseOutline } from '@vicons/ionicons5';
import LiveRoomCreateForm from '@/views/live/components/LiveRoomCreateForm.vue';
import { LiveRoomRoleEnum } from '@/enum/live/liveRoomRoleEnum';
import { useUserStore } from '@/store/modules/user';
import {
  getLatestLiveRoom,
  endLiveRoom,
  issueRoomToken,
  getSseToken
} from '@/api/live/liveRoom';
import { getCourseById } from '@/api/course/course';
import type { LiveRoomVO } from '@/types/live/liveRoom';
import type { CourseVO } from '@/types/course';

const props = defineProps<{ show: boolean; classroomId: string | null; courseId?: string | null }>();
const emit = defineEmits<{ close: [] }>();
const { t } = useI18n();
const router = useRouter();
const userStore = useUserStore();
const message = useMessage();

const loading = ref<boolean | null>(null);
// creating flag removed; child component handles creation
const ending = ref(false);
const room = ref<LiveRoomVO | null>(null);
const courseInfo = ref<CourseVO | null>(null);
const isTeacher = computed(() => {
  return userStore.hasRole && (userStore.hasRole('TEACHER') || userStore.hasRole('ADMIN'));
});
const joining = ref(false);

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
    if (res && res.data) {
      room.value = res.data;
      // load course info if available
      const cid = (room.value && room.value.courseId) ? room.value.courseId : (props.courseId ?? null);
      if (cid) {
        await loadCourse(cid);
      } else {
        courseInfo.value = null;
      }
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
  try {
    const res: any = await getCourseById(courseId);
    courseInfo.value = res?.data || null;
  } catch (e) {
    courseInfo.value = null;
  }
}

async function endLive() {
  if (!room.value || !room.value.id) return;
  ending.value = true;
  try {
    await endLiveRoom(room.value.id);
    // reload
    await loadRoom();
  } finally {
    ending.value = false;
  }
}

async function joinLive() {
  if (!room.value || !room.value.id || joining.value) return;
  joining.value = true;
  try {
    const role = isTeacher.value ? LiveRoomRoleEnum.TEACHER : LiveRoomRoleEnum.STUDENT;
    const tokenReq: any = { role };
    const res: any = await issueRoomToken(room.value.id, tokenReq);

    // Extract token string correctly
    let token = '';
    if (res?.token) {
      token = res.token;
    } else if (res?.data) {
      token = typeof res.data === 'string' ? res.data : (res.data.token || '');
    } else if (typeof res === 'string') {
      token = res;
    }

    if (token) {
      // 跳转到直播页面，传递 token 作为查询参数
      router.push({
        name: 'LiveRoom',
        params: { roomId: room.value.id },
        query: { token }
      });
    } else {
      if (message) message.error('进入直播间失败');
    }
  } catch (e) {
    if (message) message.error('进入直播间失败');
  } finally {
    joining.value = false;
  }
}

function getStatusLabel(status: number | null | undefined) {
  // lazy map so we don't import enum file here
  if (status === 1) return t('classroom.liveStatus.live');
  if (status === 2) return t('classroom.liveStatus.ended');
  if (status === 3) return t('classroom.liveStatus.closed');
  return t('classroom.liveStatus.notStarted');
}

// SSE subscription
let source: EventSource | null = null;
function subscribeSse() {
  if (!props.classroomId) return;
  unsubscribeSse();
  // First request a short-lived SSE token (authenticated AJAX), then open EventSource to hub with token
  getSseToken(props.classroomId).then((res: any) => {
    const token = res?.data || res;
    if (!token) {
      if (message) message.error('无法获取 SSE 订阅令牌');
      return;
    }
    const url = `/api/live/subscribe?classroomId=${props.classroomId}&token=${token}`;
    source = new EventSource(url);
    source.addEventListener('room-status-change', (evt: MessageEvent) => {
      try {
        const data = JSON.parse(evt.data);
        // update room info (hub may send map or LiveRoomVO-like object)
        room.value = data;
        // show notifications for status changes
        const status = data && (data.status || data.status === 0) ? Number(data.status) : null;
        if (status === 1) {
          message.success('直播开始');
        } else if (status === 2) {
          message.info('直播已结束');
        } else if (status === 3) {
          message.info('直播已关闭');
        }
      } catch (e) {
        // ignore
      }
    });
    source.onerror = () => {
      // ignore errors
    };
  }).catch(() => {
    if (message) message.error('SSE 订阅失败');
  });
}

function unsubscribeSse() {
  if (source) {
    try {
      source.close();
    } catch (e) {
    }
    source = null;
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
  width: 78vw;
  max-width: 1200px;
  min-height: 78vh;
  max-height: 86vh;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, color-mix(in srgb, var(--background-secondary-color) 80%, transparent), color-mix(in srgb, var(--background-tertiary-color) 95%, transparent));
  border: 1px solid color-mix(in srgb, var(--border-color) 80%, transparent);
  border-radius: 16px;
  box-shadow: 0 18px 38px color-mix(in srgb, var(--shadow-color) 80%, transparent);
  padding: 16px;
  overflow: hidden;
  z-index: 1003;
}

@keyframes panel-enter {
  from {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.98);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
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
  font-size: 18px;
  line-height: 1.3;
}

.live-panel__close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 1004;
  color: var(--text-color);
}

.live-panel__body {
  display: flex;
  flex-direction: column;
  gap: 12px;
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 12px;
  background: transparent;
  border-radius: 12px;
}

.room-row {
  margin: 8px 0;
  font-size: 14px;
  line-height: 1.6;
  strong {
    font-size: 14px;
    font-weight: 600;
    margin-right: 6px;
  }
}

.live-panel__actions {
  margin-top: 12px;
}
.course-info-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 12px;
}
.course-cover {
  width: 84px;
  height: 60px;
  object-fit: cover;
  border-radius: 6px;
  background: var(--background-color);
  border: 1px solid var(--border-color);
}
.course-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.course-title {
  font-weight: 600;
  font-size: 16px;
  line-height: 1.25;
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
</style>


