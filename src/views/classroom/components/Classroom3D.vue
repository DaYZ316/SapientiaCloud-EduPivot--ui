<template>
  <div class="classroom-3d-container">
    <canvas ref="canvasRef" class="webgl_7"></canvas>
    <ClassroomToolbox :items="toolboxItems"/>
    <ChapterPanel :course-id="route.params.courseId as string || null" :show="showChapterPanel ?? false"
                  @close="closeChapterPanel"/>
    <QuestionPanel :classroom-id="route.params.courseRecordId as string || null"
                   :course-id="route.params.courseId as string || null"
                   :show="showQuestionPanel ?? false" @close="closeQuestionPanel"/>
    <PracticePanel
        :classroom-id="route.params.courseRecordId as string || null"
        :show="showPracticePanel ?? false"
        @close="closePracticePanel"
    />
    <LivePanel
        :classroom-id="route.params.courseRecordId as string || null"
        :course-id="route.params.courseId as string || null"
        :show="showLivePanel ?? false"
        @close="closeLivePanel"
    />
    <!-- 学生信息框 -->
    <StudentInfoPopup
        :position="popupPosition"
        :seat-index="currentSeatIndex"
        :show="showStudentInfo"
        :student="currentStudent"
    />
    <!-- 指针锁定提示 -->
    <n-alert
        v-if="showPointerLockHint"
        :title="t('classroom.pointerLockHintTitle')"
        class="pointer-lock-hint"
        closable
        type="info"
        @close="showPointerLockHint = false"
    >
      {{ t('classroom.pointerLockHint') }}
    </n-alert>
  </div>
</template>

<script lang="ts" setup>
import {computed, onBeforeUnmount, onMounted, ref, watch} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useI18n} from 'vue-i18n';
import type {InstancedMesh, PerspectiveCamera, Scene, Texture, WebGLRenderer} from 'three';
import * as THREE from 'three';
import type {GLTF} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls.js';
import {Sky} from 'three/examples/jsm/objects/Sky.js';
import {getCourseRecordById} from '@/api/classroom/courseRecord';
import {
  addStudentSeat,
  getDefaultCourseRecordStudentDTO,
  issueSeatSyncWsToken,
  listStudentsByRecordId,
  updateStudentSeat,
  removeStudentSeat
} from '@/api/classroom/courseRecordStudent';
import StudentInfoPopup from './StudentInfoPopup.vue';
import ClassroomToolbox from './ClassroomToolbox.vue';
import QuestionPanel from './QuestionPanel.vue';
import ChapterPanel from './ChapterPanel.vue';
import PracticePanel from './PracticePanel.vue';
import LivePanel from './LivePanel.vue';
import {useUserStore} from '@/store/modules/user';
import {getGlobalApis} from '@/utils/naiveUIHelper';
import {SpriteManager} from '@/views/classroom/composables/spriteManager';
import {resolveUserName, renderAvatarToTexture} from '@/utils/avatarUtil';
import type {AvatarIdentityProps} from '@/types/components/avatar';
import type {CourseRecordStudentDTO, CourseRecordStudentVO, CourseRecordVO} from '@/types/classroom';
import type {ClassroomToolboxItem} from '@/views/classroom/composables/toolbox';
import {SeatStatusEnum} from '@/enum/classroom/seatStatusEnum';
import {calculateCourseRecordStatus, CourseRecordStatusEnum} from '@/enum/classroom/courseRecordStatusEnum';
import type {SeatAssignmentContext} from '@/types/components/seatConfirmModal';
import {useTransitionStore} from '@/store/modules/transition';
import {runViewTransition} from '@/utils/themeAnimation';
import {useLiveSpeakingStore} from '@/stores/liveSpeaking';
import {
  classroomXLenghtRef,
  classroomYLenghtRef,
  classroomZLenghtRef,
  computeCameraPositionsBySize,
  type ClassroomCameraPositions
} from '@/views/classroom/composables/useCameraGroup';
import {
  getClassroomModelPathByRecord,
  getClassroomModelTexturePathByRecord,
  getDeskModelPathByRecord,
  getdeskChairModelTexturePathByRecord,
} from '@/views/classroom/composables/useModelRouter';
import {useSeatLayout, getTeacherSeatPosition} from '@/views/classroom/composables/useSeatLayout';
import {ClassroomTypeEnum} from '@/enum/classroom/classroomTypeEnum';
import {ModelInstanceManager} from '@/views/classroom/composables/ModelInstanceManager';
import {useClassroomInteraction} from '@/views/classroom/composables/useClassroomInteraction';
import eventBus from '@/utils/eventBus';
import {
  BookOutline,
  CreateOutline,
  HelpCircleOutline,
  LogOutOutline,
  VideocamOutline
} from '@vicons/ionicons5';
import ClassPracticeIcon from '@/components/common/ClassPracticeIcon.vue';
import {defaultServerConfig} from '@/config/server';

const {t} = useI18n();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const transitionStore = useTransitionStore();
const {dialog, message} = getGlobalApis();
// 课程记录状态
const courseRecord = ref<CourseRecordVO | null>(null);
const loadingRecord = ref(false);
const recordError = ref<string | null>(null);

// 座位排布（仅小型 / 中型教室启用）
const {
  columnCount,
  instanceCount,
  calculateSeatPosition,
  fillSpritePositions
} = useSeatLayout(courseRecord);

// 教室交互管理
const {
  initInteractions,
  dispose: disposeInteractions
} = useClassroomInteraction();


// 学生信息框相关状态
const showStudentInfo = ref(false);
const currentStudent = ref<CourseRecordStudentVO | null>(null);
const currentSeatIndex = ref<number | null>(null);
const popupPosition = ref({x: 0, y: 0});
const studentsList = ref<CourseRecordStudentVO[]>([]);
// 创建座位索引到学生信息的映射，用于快速查找
const seatStudentMap = ref<Map<number, CourseRecordStudentVO>>(new Map());
const pendingSeatContext = ref<SeatAssignmentContext | null>(null);
const fallbackTextureRef = ref<Texture | null>(null);
const showPointerLockHint = ref(false);
let pointerHintTimeout: number | null = null;
const showChapterPanel = ref<boolean | null>(null);
const showQuestionPanel = ref<boolean | null>(null);
const showPracticePanel = ref<boolean | null>(null);
const showLivePanel = ref<boolean | null>(null);
const canShowPracticeActions = computed(() => {
  const roles = userStore.roles || [];
  const hasAdminRole = Array.isArray(roles) && roles.some(role => role.roleKey === 'ADMIN');
  const isTeacher = Boolean(userStore.teacherInfo?.id);
  return hasAdminRole || isTeacher;
});
type PointerLockHandler = {
  onPointerLockError?: () => void;
  canvasDoubleClick?: () => void;
  escapeKeyDown?: (event: KeyboardEvent) => void;
  canvas?: HTMLCanvasElement;
  altKeyDown?: (event: KeyboardEvent) => void;
  altKeyUp?: (event: KeyboardEvent) => void;
  canvasClick?: (event: MouseEvent) => void;
  mouseMove?: (event: MouseEvent) => void;
  contextMenu?: (event: MouseEvent) => void;
  wheelHandler?: (event: WheelEvent) => void;
};
const showPointerHintTemporarily = () => {
  if (pointerHintTimeout) {
    clearTimeout(pointerHintTimeout);
  }
  showPointerLockHint.value = true;
  pointerHintTimeout = window.setTimeout(() => {
    showPointerLockHint.value = false;
    pointerHintTimeout = null;
  }, 5000);
};
const spriteManager = new SpriteManager();
const speakingStore = useLiveSpeakingStore();
const activeSpeakingSeats = new Set<number>();
const seatSyncPrefix = defaultServerConfig.prefix.startsWith('/')
    ? defaultServerConfig.prefix
    : `/${defaultServerConfig.prefix}`;
const seatSyncMessageEvents = new Set(['seat_snapshot', 'seat_upsert', 'seat_remove']);

type SeatSyncPayload = {
  event?: string;
  recordId?: string;
  version?: number;
  data?: {
    seats?: CourseRecordStudentVO[];
    seat?: CourseRecordStudentVO;
    studentId?: string | null;
    seatIndex?: number | null;
  };
};

let seatSyncSocket: WebSocket | null = null;
let seatSyncReconnectTimer: number | null = null;
let seatSyncReconnectAttempts = 0;
let seatSyncLatestVersion = 0;
let seatSyncConnecting = false;
let seatSyncShouldReconnect = false;

const resolveSeatIndexByStudentId = (studentId: string): number | null => {
  let seatIndex = spriteManager.getPositionIndexByUserId(studentId);
  if (seatIndex !== null) {
    return seatIndex;
  }

  const numericId = Number(studentId);
  if (!Number.isNaN(numericId)) {
    seatIndex = spriteManager.getPositionIndexByUserId(numericId);
    if (seatIndex !== null) {
      return seatIndex;
    }
  }

  return null;
};

const resolveSpeakingStudentId = (
    participantId: string,
    state: { studentId?: string | null }
): string | null => {
  const mappedStudentId = speakingStore.participantStudentMap.get(participantId);
  if (mappedStudentId) {
    return String(mappedStudentId);
  }

  if (state.studentId) {
    return String(state.studentId);
  }

  if (participantId === 'local') {
    const localStudentId = userStore.studentInfo?.id;
    if (localStudentId) {
      return String(localStudentId);
    }
  }

  if (/^\d+$/.test(participantId)) {
    return participantId;
  }

  return null;
};

const syncSpeakingIndicatorsFromStore = () => {
  if (!spriteManager.isInitialized) {
    return;
  }

  const nextSpeakingSeats = new Set<number>();

  speakingStore.speakingStates.forEach((state, participantId) => {
    if (!state.isSpeaking) {
      return;
    }

    const studentId = resolveSpeakingStudentId(participantId, state);
    if (!studentId) {
      return;
    }

    const seatIndex = resolveSeatIndexByStudentId(String(studentId));
    if (seatIndex !== null) {
      nextSpeakingSeats.add(seatIndex);
    }
  });

  activeSpeakingSeats.forEach((seatIndex) => {
    if (!nextSpeakingSeats.has(seatIndex)) {
      spriteManager.setSpeakingIndicator(seatIndex, false);
    }
  });

  nextSpeakingSeats.forEach((seatIndex) => {
    spriteManager.setSpeakingIndicator(seatIndex, true);
  });

  activeSpeakingSeats.clear();
  nextSpeakingSeats.forEach((seatIndex) => activeSpeakingSeats.add(seatIndex));
};

const handleChapterButton = async (event: MouseEvent) => {
  event.stopPropagation();
  const willShow = !(showChapterPanel.value ?? false);
  if (willShow) {
    showQuestionPanel.value = false;
    showPracticePanel.value = false;
  }
  showChapterPanel.value = willShow;
};

const closeChapterPanel = () => {
  showChapterPanel.value = false;
};

const handleQuestionButton = (event: MouseEvent) => {
  if (!canShowPracticeActions.value) {
    return;
  }
  event.stopPropagation();
  const willShow = !(showQuestionPanel.value ?? false);
  if (willShow) {
    showChapterPanel.value = false;
    showPracticePanel.value = false;
  }
  showQuestionPanel.value = willShow;
};

const closeQuestionPanel = () => {
  showQuestionPanel.value = false;
};

const handlePracticeButton = (event: MouseEvent) => {
  event.stopPropagation();
  const willShow = !(showPracticePanel.value ?? false);
  if (willShow) {
    showChapterPanel.value = false;
    showQuestionPanel.value = false;
  }
  showPracticePanel.value = willShow;
};

const closePracticePanel = () => {
  showPracticePanel.value = false;
};

const closeLivePanel = () => {
  showLivePanel.value = false;
};

const getIdentityName = (info: Record<string, any> | null | undefined): string => {
  if (!info) {
    return '';
  }
  const identity: AvatarIdentityProps = {
    avatarSrc: info.avatar ?? info.studentAvatar ?? null,
    username:
        info.studentName
        || info.realName
        || info.name
        || info.username
        || null,
    nickName: info.nickName ?? null,
    studentRealName: info.studentRealName ?? info.realName ?? null,
    teacherRealName: info.teacherRealName ?? null,
    fallbackSrc: null
  };
  return resolveUserName(identity);
};


const disposeFallbackTexture = () => {
  if (fallbackTextureRef.value) {
    fallbackTextureRef.value.dispose();
    fallbackTextureRef.value = null;
  }
};

const resetSeatConfirmState = (shouldDisposeTexture = true) => {
  pendingSeatContext.value = null;
  if (shouldDisposeTexture) {
    disposeFallbackTexture();
    return;
  }
  fallbackTextureRef.value = null;
};

const confirmSeatSelection = async () => {
  if (!pendingSeatContext.value || pendingSeatContext.value.seatIndex === null) {
    resetSeatConfirmState();
    return false;
  }
  if (!spriteManager || !spriteManager.isInitialized) {
    resetSeatConfirmState();
    return false;
  }
  const userInfo = userStore.userInfo;
  const studentInfoFromStore = userStore.studentInfo;
  if (!userInfo || !userInfo.id) {
    resetSeatConfirmState();
    return false;
  }
  const recordId = (route.params.courseRecordId as string) || (route.query.recordId as string);
  if (!recordId) {
    resetSeatConfirmState();
    return false;
  }
  const seatIndex = pendingSeatContext.value.seatIndex;
  const avatarUrl = pendingSeatContext.value.avatarUrl;

  // 计算座位排和列索引（从座位索引转换为排和列）
  // locationX: 排索引, locationY: 列索引, locationZ: 默认0
  const columnCountValue = columnCount.value || 1;
  const locationX: number = Math.floor(seatIndex / columnCountValue); // 排索引
  const locationY: number = seatIndex % columnCountValue; // 列索引
  const locationZ: number | null = null; // Z坐标默认为null，后端处理

  // 构建API请求数据
  const currentStudentId = studentInfoFromStore && studentInfoFromStore.id ? studentInfoFromStore.id : null;
  // 如果当前登录用户没有学生身份，则提示先绑定学生信息
  if (!currentStudentId) {
    resetSeatConfirmState();
    if (message) {
      message.info(t('classroom.noStudentIdentityContent'));
    }
    return false;
  }

  const existingSeat = studentsList.value.find(student => student.studentId === currentStudentId) || null;

  // 根据课程的开始时间和结束时间判断当前课堂状态
  const courseStatus = calculateCourseRecordStatus(
    courseRecord.value?.startTime ?? null,
    courseRecord.value?.overTime ?? null
  );

  // 如果课堂已结束，不允许坐下
  if (courseStatus === CourseRecordStatusEnum.ENDED) {
    resetSeatConfirmState();
    if (message) {
      message.warning(t('classroom.seatConfirm.classEnded'));
    }
    return false;
  }

  const seatData: CourseRecordStudentDTO = getDefaultCourseRecordStudentDTO();
  seatData.recordId = recordId;
  seatData.studentId = currentStudentId;
  seatData.courseId = courseRecord.value?.courseId || null;
  seatData.seatIndex = seatIndex;
  seatData.locationX = locationX;
  seatData.locationY = locationY;
  seatData.locationZ = locationZ;
  seatData.rotationY = null;
  seatData.seatStatus = SeatStatusEnum.NORMAL;

  // 调用API添加学生座位
  const apiResponse = existingSeat ? await updateStudentSeat(seatData) : await addStudentSeat(seatData);
  const isSuccessResponse = typeof apiResponse === 'boolean'
      ? apiResponse
      : Boolean(apiResponse && (apiResponse.success === true || apiResponse.code === 200));

  if (!isSuccessResponse) {
    resetSeatConfirmState();
    return false;
  }

  if (message) {
    const successKey = existingSeat
        ? t('classroom.seatConfirm.updateSuccess')
        : t('classroom.seatConfirm.assignSuccess');
    message.success(successKey);
  }

  // API调用成功后更新前端显示
  const applyTextureToSprite = (texture: Texture, shouldDisposeFallback = true) => {
    if (!texture) {
      resetSeatConfirmState();
      return;
    }
    // 使用 studentId 更新精灵（后端和学生列表使用的是 studentId）
    spriteManager.updateSpriteInfo(currentStudentId, texture, seatIndex);
    resetSeatConfirmState(shouldDisposeFallback);
    // 刷新学生列表
    if (recordId) {
      fetchStudentsList(recordId);
    }
  };

  // 构建 AvatarIdentityProps
  const avatarIdentity = {
    avatarSrc: avatarUrl || null,
    username: userInfo.username || null,
    nickName: userInfo.nickName || null,
    studentRealName: studentInfoFromStore?.realName || null,
    teacherRealName: null,
    fallbackSrc: null
  };

  // 使用 AvatarDisplay 组件渲染纹理
  const texture = await renderAvatarToTexture(avatarIdentity, 128);
  applyTextureToSprite(texture);

  return true;
};

const formatSeatLabel = (rowIndex: number, columnIndex: number): string => {
  return t('classroom.formatSeatLabel', {row: rowIndex + 1, column: columnIndex + 1});
};

const openSeatConfirmModal = (context: SeatAssignmentContext) => {
  pendingSeatContext.value = {
    seatIndex: context.seatIndex,
    seatLabel: context.seatLabel,
    avatarUrl: context.avatarUrl,
    displayName: context.displayName
  };
  disposeFallbackTexture();

  // 使用 AvatarDisplay 组件渲染预览纹理
  const avatarIdentity = {
    avatarSrc: context.avatarUrl || null,
    username: null,
    nickName: null,
    studentRealName: context.displayName || null,
    teacherRealName: null,
    fallbackSrc: null
  };

  // 异步渲染纹理，但不等待结果，因为这是预览
  renderAvatarToTexture(avatarIdentity, 128).then((texture) => {
    if (fallbackTextureRef.value) {
      fallbackTextureRef.value.dispose();
    }
    fallbackTextureRef.value = texture;
  });

  const seatTitle = context.seatLabel
      ? t('classroom.seatConfirm.titleWithSeat', {seatLabel: context.seatLabel})
      : t('classroom.seatConfirm.title');
  const seatSubtitle = context.displayName
      ? t('classroom.seatConfirm.subtitleWithStudent', {studentName: context.displayName})
      : t('classroom.seatConfirm.subtitle');

  if (controls && canvas && document.pointerLockElement === canvas) {
    controls.unlock();
  }

  if (dialog) {
    dialog.warning({
      title: seatTitle,
      content: seatSubtitle,
      positiveText: t('classroom.seatConfirm.confirm'),
      negativeText: t('classroom.seatConfirm.cancel'),
      onPositiveClick: async () => {
        await confirmSeatSelection();
      },
      onNegativeClick: () => {
        resetSeatConfirmState();
      }
    });
  }
};


// 获取课程记录信息
const getCurrentRecordId = (): string | null => {
  const paramRecordId = route.params.courseRecordId as string | undefined;
  const queryRecordId = route.query.recordId as string | undefined;
  return paramRecordId || queryRecordId || null;
};

const buildSeatSyncWsUrl = (recordId: string, token: string): string => {
  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  return `${wsProtocol}//${window.location.host}${seatSyncPrefix}/classroom/ws/seat?recordId=${encodeURIComponent(recordId)}&token=${encodeURIComponent(token)}`;
};

const clearSeatSyncReconnectTimer = () => {
  if (seatSyncReconnectTimer !== null) {
    clearTimeout(seatSyncReconnectTimer);
    seatSyncReconnectTimer = null;
  }
};

const closeSeatSyncSocket = () => {
  if (!seatSyncSocket) {
    return;
  }
  seatSyncSocket.onopen = null;
  seatSyncSocket.onmessage = null;
  seatSyncSocket.onerror = null;
  seatSyncSocket.onclose = null;
  if (
      seatSyncSocket.readyState === WebSocket.OPEN
      || seatSyncSocket.readyState === WebSocket.CONNECTING
  ) {
    seatSyncSocket.close();
  }
  seatSyncSocket = null;
};

const fetchCourseRecord = async () => {
  try {
    loadingRecord.value = true;
    recordError.value = null;

    // 从路由参数获取课程记录ID
    const recordId = getCurrentRecordId();
    if (!recordId) {
      return;
    }

    // 调用API获取课程记录
    const response = await getCourseRecordById(String(recordId));
    courseRecord.value = response?.data || null;

    // 获取学生列表
    await fetchStudentsList(String(recordId));
  } catch (error) {
    recordError.value = t('classroom.fetchCourseRecordFailed');
    // 发生错误时不阻止组件继续加载，而是使用默认配置
  } finally {
    loadingRecord.value = false;
  }
};

// 渲染学生精灵模型
const renderStudentSprites = async (students: CourseRecordStudentVO[]) => {
  if (!spriteManager || !spriteManager.isInitialized) {
    return;
  }

  for (const student of students) {
    if (student.seatIndex === null || student.seatIndex === undefined) {
      continue;
    }

    const seatIndex = student.seatIndex;
    const studentId = student.studentId;

    // 构建 AvatarIdentityProps
    const avatarIdentity = {
      avatarSrc: student.studentAvatar || null,
      username: student.studentCode || null,
      nickName: null,
      studentRealName: student.studentName || null,
      teacherRealName: null,
      fallbackSrc: null
    };

    // 使用 AvatarDisplay 组件渲染纹理
    const texture = await renderAvatarToTexture(avatarIdentity, 128);
    spriteManager.updateSpriteInfo(studentId, texture, seatIndex);
  }
};

// 获取学生列表
const removeSpriteByStudentId = (studentId: string | number | null | undefined) => {
  if (!spriteManager || !spriteManager.isInitialized || studentId === null || studentId === undefined) {
    return;
  }

  const candidateIds: Array<string | number> = [studentId];
  if (typeof studentId === 'string') {
    const numericId = Number(studentId);
    if (!Number.isNaN(numericId)) {
      candidateIds.push(numericId);
    }
  } else if (typeof studentId === 'number') {
    candidateIds.push(String(studentId));
  }

  for (const candidateId of candidateIds) {
    try {
      spriteManager.removeUserData(candidateId);
      return;
    } catch (_error) {
      continue;
    }
  }
};

const rebuildSeatStudentMap = (students: CourseRecordStudentVO[]) => {
  seatStudentMap.value.clear();
  students.forEach((student) => {
    if (student.seatIndex !== null && student.seatIndex !== undefined) {
      seatStudentMap.value.set(student.seatIndex, student);
    }
  });
};

const applyStudentsState = async (nextStudents: CourseRecordStudentVO[]) => {
  const normalizedStudents = Array.isArray(nextStudents) ? nextStudents : [];
  const previousStudents = studentsList.value;
  const nextStudentIdSet = new Set(normalizedStudents.map(student => String(student.studentId)));

  if (spriteManager && spriteManager.isInitialized) {
    previousStudents.forEach((student) => {
      if (!nextStudentIdSet.has(String(student.studentId))) {
        removeSpriteByStudentId(student.studentId);
      }
    });
  }

  studentsList.value = normalizedStudents;
  rebuildSeatStudentMap(normalizedStudents);

  if (normalizedStudents.length > 0 && spriteManager && spriteManager.isInitialized) {
    await renderStudentSprites(normalizedStudents);
  }
};

const fetchStudentsList = async (recordId: string) => {
  try {
    const response = await listStudentsByRecordId(recordId);
    await applyStudentsState(response?.data || []);
  } catch (error) {
    await applyStudentsState([]);
  }
};

// 学生信息框展示逻辑移除悬停触发，保留基础状态，后续如需点击展示可在此扩展

// 退出教室，使用全局过渡动画
const tryParseSeatSyncPayload = (rawPayload: string): SeatSyncPayload | null => {
  try {
    const parsed = JSON.parse(rawPayload) as SeatSyncPayload;
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch (_error) {
    return null;
  }
};

const applySeatSyncPayload = async (recordId: string, payload: SeatSyncPayload) => {
  if (!payload || typeof payload !== 'object') {
    return;
  }
  if (payload.recordId && payload.recordId !== recordId) {
    return;
  }

  if (typeof payload.version === 'number') {
    if (payload.version <= seatSyncLatestVersion) {
      return;
    }
    seatSyncLatestVersion = payload.version;
  }

  if (!payload.event || !seatSyncMessageEvents.has(payload.event)) {
    return;
  }

  if (payload.event === 'seat_snapshot') {
    const seats = Array.isArray(payload.data?.seats) ? payload.data.seats : [];
    await applyStudentsState(seats);
    return;
  }

  if (payload.event === 'seat_upsert') {
    const seat = payload.data?.seat;
    if (!seat || !seat.studentId) {
      return;
    }

    const nextStudents = studentsList.value.filter((student) => {
      return student.studentId !== seat.studentId && student.seatIndex !== seat.seatIndex;
    });
    nextStudents.push(seat);
    await applyStudentsState(nextStudents);
    return;
  }

  if (payload.event === 'seat_remove') {
    const studentId = payload.data?.studentId ? String(payload.data.studentId) : null;
    const rawSeatIndex = payload.data?.seatIndex;
    const seatIndex = typeof rawSeatIndex === 'number'
        ? rawSeatIndex
        : Number.parseInt(String(rawSeatIndex ?? ''), 10);
    const hasSeatIndex = !Number.isNaN(seatIndex);

    const nextStudents = studentsList.value.filter((student) => {
      const hitStudent = studentId !== null && String(student.studentId) === studentId;
      const hitSeat = hasSeatIndex && student.seatIndex === seatIndex;
      return !(hitStudent || hitSeat);
    });
    await applyStudentsState(nextStudents);
  }
};

const scheduleSeatSyncReconnect = (recordId: string) => {
  if (!seatSyncShouldReconnect || seatSyncReconnectTimer !== null || seatSyncReconnectAttempts >= 8) {
    return;
  }

  const delay = Math.min(1000 * (2 ** seatSyncReconnectAttempts), 15000);
  seatSyncReconnectAttempts += 1;
  seatSyncReconnectTimer = window.setTimeout(() => {
    seatSyncReconnectTimer = null;
    void connectSeatSync(recordId);
  }, delay);
};

const connectSeatSync = async (recordId: string) => {
  if (!seatSyncShouldReconnect || seatSyncConnecting || !recordId) {
    return;
  }
  if (
      seatSyncSocket
      && (
          seatSyncSocket.readyState === WebSocket.OPEN
          || seatSyncSocket.readyState === WebSocket.CONNECTING
      )
  ) {
    return;
  }

  seatSyncConnecting = true;
  try {
    const tokenResponse = await issueSeatSyncWsToken(recordId);
    const token = tokenResponse?.data;
    if (!token) {
      throw new Error('Seat sync websocket token is empty');
    }

    const wsUrl = buildSeatSyncWsUrl(recordId, token);
    const socket = new WebSocket(wsUrl);
    seatSyncSocket = socket;

    socket.onopen = () => {
      seatSyncReconnectAttempts = 0;
    };

    socket.onmessage = (event) => {
      if (typeof event.data !== 'string') {
        return;
      }
      if (event.data === 'pong') {
        return;
      }

      const payload = tryParseSeatSyncPayload(event.data);
      if (!payload) {
        return;
      }
      void applySeatSyncPayload(recordId, payload);
    };

    socket.onerror = () => {
      if (
          socket.readyState === WebSocket.OPEN
          || socket.readyState === WebSocket.CONNECTING
      ) {
        socket.close();
      }
    };

    socket.onclose = () => {
      if (seatSyncSocket === socket) {
        seatSyncSocket = null;
      }
      if (seatSyncShouldReconnect) {
        scheduleSeatSyncReconnect(recordId);
      }
    };
  } catch (_error) {
    if (seatSyncShouldReconnect) {
      scheduleSeatSyncReconnect(recordId);
    }
  } finally {
    seatSyncConnecting = false;
  }
};

const startSeatSync = (recordId: string) => {
  if (!recordId) {
    return;
  }
  seatSyncShouldReconnect = true;
  seatSyncLatestVersion = 0;
  seatSyncReconnectAttempts = 0;
  clearSeatSyncReconnectTimer();
  void connectSeatSync(recordId);
};

const stopSeatSync = () => {
  seatSyncShouldReconnect = false;
  seatSyncLatestVersion = 0;
  seatSyncReconnectAttempts = 0;
  seatSyncConnecting = false;
  clearSeatSyncReconnectTimer();
  closeSeatSyncSocket();
};

const handleExit = (e: MouseEvent) => {
  transitionStore.show();
  const courseId = route.params.courseId as string;
  runViewTransition(() => {
    if (courseId) {
      router.push(`/course/detail/${courseId}/classroom`);
    } else {
      router.back();
    }
  }, e);
};

// 跳转到直播页面，根据身份处理
const handleLive = (e: MouseEvent) => {
  e.stopPropagation();
  const willShow = !(showLivePanel.value ?? false);
  if (willShow) {
    showChapterPanel.value = false;
    showQuestionPanel.value = false;
    showPracticePanel.value = false;
  }

  // 学生：直接打开 LivePanel 悬浮窗，由悬浮窗提供进入房间入口
  const isTeacherOrAdmin = canShowPracticeActions.value;
  if (!isTeacherOrAdmin) {
    const classroomId = route.params.courseRecordId as string || null;
    if (!classroomId) {
      if (message) message.info(t('classroom.liveNotAvailable'));
      return;
    }
    showLivePanel.value = true;
    return;
  }

  // 老师/管理员：打开 LivePanel 悬浮窗
  showLivePanel.value = willShow;
};

const toolboxItems = computed<ClassroomToolboxItem[]>(() => {
  const items: ClassroomToolboxItem[] = [
    {
      key: 'chapters',
      label: t('classroom.chapters'),
      labelKey: 'classroom.chapters',
      icon: BookOutline,
      handler: handleChapterButton
    }
  ];

  items.push({
    key: 'class-practice',
    label: t('classroom.classPractice'),
    labelKey: 'classroom.classPractice',
    icon: ClassPracticeIcon,
    handler: handlePracticeButton
  });

  if (canShowPracticeActions.value) {
    items.push(
        {
          key: 'publish-practice',
          label: t('classroom.publishPractice'),
          labelKey: 'classroom.publishPractice',
          icon: CreateOutline,
          handler: handleQuestionButton
        }
    );
  }

  items.push(
      {
        key: 'exit',
        label: t('classroom.exit'),
        icon: LogOutOutline,
        handler: handleExit
      },
      {
        key: 'live',
        label: t('classroom.live'),
        icon: VideocamOutline,
        handler: handleLive
      },
      {
        key: 'pointer-hint',
        label: t('classroom.pointerLockHintTitle'),
        icon: HelpCircleOutline,
        handler: (event: MouseEvent) => {
          event.stopPropagation();
          showPointerHintTemporarily();
        }
      }
  );
  // 如果当前路由包含 courseRecordId，则在工具栏中追加"编辑座位"项（由页面负责注入，避免工具箱组件自行构造）
  const recordId = (route.params.courseRecordId as string) || (route.query.recordId as string);
  if (recordId && !items.some(it => it.key === 'edit-seating')) {
    items.push({
      key: 'edit-seating',
      label: t('classroom.editSeating'),
      labelKey: 'classroom.editSeating',
      icon: CreateOutline,
      handler: undefined
    } as unknown as ClassroomToolboxItem);
  }

  return items;
});

let canvas: HTMLCanvasElement | null = null;
let renderer: WebGLRenderer | null = null;
let scene: Scene | null = null;
let camera: PerspectiveCamera | null = null;
let controls: PointerLockControls | null = null;
let classroomModel: THREE.Group | null = null;
let loader: GLTFLoader | null = null;
let textureLoader: THREE.TextureLoader | null = null;
let spritePositions: THREE.Vector3[] = [];
const initThree = () => {
  //窗口大小信息
  const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
  };

  /**
   * 场景环境设置
   */
  //画布
  canvas = document.querySelector('.webgl_7') as HTMLCanvasElement;
  // 场景
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x0a0a1a);

  /**
   * 相机
   */
  // 相机位置配置对象（组件级别变量，基于教室模型尺寸响应式计算）
  window.cameraPositions = computeCameraPositionsBySize(
      classroomXLenghtRef.value,
      classroomYLenghtRef.value,
      classroomZLenghtRef.value,
      courseRecord.value?.classroomType
  );

  camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
  // 保存初始FOV值，用于限制缩放范围（只能放大，不能缩小）
  const initialFov = camera.fov;
  // 将相机固定在教室内部前部位置
  // 基于教室模型尺寸计算前部位置，使相机处于教室内部靠前的位置
  const initialCameraConfig = window.cameraPositions.front;
  camera.position.set(
      initialCameraConfig.position.x,
      initialCameraConfig.position.y,
      initialCameraConfig.position.z
  ); // 设置相机在前部较高位置，可观察整个教室
  camera.setRotationFromEuler(initialCameraConfig.initialRotation);
  scene.add(camera);

  // 将相机引用存储到window对象上
  window.camera = camera;

  // 当前相机位置标识（组件级别变量）
  window.currentCameraPosition = 'front';

  // 相机控制 - 使用PointerLockControls实现位置锁定的视角控制
  if (canvas) {
    controls = new PointerLockControls(camera, canvas);
  }

  // 将控制器引用存储到window对象上
  if (controls) {
    window.controls = controls;
  }

  // 不需要额外设置不存在的属性，直接使用标准API

  // 相机位置切换方法（组件级别函数）
  window.switchCameraPosition = function () {
    if (!window.cameraPositions || !window.camera) return;
    // 定义位置顺序数组
    const positionOrder: Array<'front' | 'rightRear' | 'leftRear'> = ['front', 'rightRear', 'leftRear'];

    // 获取当前位置在数组中的索引
    const currentIndex = window.currentCameraPosition
        ? positionOrder.indexOf(window.currentCameraPosition)
        : 0;

    // 计算下一个位置的索引（循环切换）
    const nextIndex = (currentIndex + 1) % positionOrder.length;

    // 切换位置标识
    window.currentCameraPosition = positionOrder[nextIndex];
    const positionConfig = window.cameraPositions[window.currentCameraPosition];

    if (!positionConfig) return;

    // 更新相机位置
    window.camera.position.set(
        positionConfig.position.x,
        positionConfig.position.y,
        positionConfig.position.z
    );

    // 应用初始旋转
    window.camera.setRotationFromEuler(positionConfig.initialRotation);

    // 重置FOV到初始值
    window.camera.fov = initialFov;
    window.camera.updateProjectionMatrix();

    // 保持指针锁定状态（如果之前已锁定）
    // PointerLockControls 会自动处理相机旋转，切换位置后继续使用即可
  }

  // 监听 courseRecord 或类型变化，确保相机位置根据教室类型动态更新（例如 EXTRA_LARGE）
  watch(courseRecord, (newVal) => {
    if (!camera) return;
    // 重新计算相机组
    window.cameraPositions = computeCameraPositionsBySize(
        classroomXLenghtRef.value,
        classroomYLenghtRef.value,
        classroomZLenghtRef.value,
        newVal?.classroomType ?? null
    );
    const frontConfig = window.cameraPositions?.front;
    if (frontConfig) {
      camera.position.set(frontConfig.position.x, frontConfig.position.y, frontConfig.position.z);
      camera.setRotationFromEuler(frontConfig.initialRotation);
      camera.updateProjectionMatrix();
    }
  }, {immediate: true});

  // 添加指针锁定错误处理
  if (canvas && controls) {
    const onPointerLockError = () => {
      // 显示自定义提示
      showPointerLockHint.value = true;
    };

    // 绑定指针锁定错误事件到document
    document.addEventListener('pointerlockerror', onPointerLockError);

    // 监听指针锁定状态变化
    controls.addEventListener('lock', () => {
      // 锁定指针时隐藏鼠标
      if (canvas) {
        canvas.style.cursor = 'none';
      }
    });

    controls.addEventListener('unlock', () => {
      // 解锁指针时显示鼠标
      if (canvas) {
        canvas.style.cursor = 'default';
      }
    });

    // 双击画布时锁定指针
    const handleCanvasDoubleClick = () => {
      if (canvas && controls && document.pointerLockElement !== canvas) {
        if (!localStorage.getItem('pointerLockHintShown')) {
          showPointerLockHint.value = true;
          localStorage.setItem('pointerLockHintShown', 'true');
        }
        controls.lock();
      }
    };

    // 指针锁定后，左键点击切换相机视角
    const handleCanvasClick = (event: MouseEvent) => {
      if (!canvas) {
        return;
      }
      if (event.button !== 0) {
        return;
      }
      if (document.pointerLockElement !== canvas) {
        return;
      }
      if (typeof window.switchCameraPosition === 'function') {
        window.switchCameraPosition();
      }
    };

    // 按下 Esc 时退出指针锁定
    const handleEscapeKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && canvas && document.pointerLockElement === canvas) {
        document.exitPointerLock();
      }
    };

    document.addEventListener('keydown', handleEscapeKeyDown, true);

    // 滚轮缩放功能
    const handleWheel = (event: WheelEvent) => {
      if (!camera || !canvas) return;

      // 只在指针锁定状态下才能缩放视角
      if (document.pointerLockElement !== canvas) {
        return;
      }

      // 阻止默认滚动行为
      event.preventDefault();

      // 缩放速度系数
      const zoomSpeed = 0.1;
      // FOV范围限制：最小值为初始FOV（只能放大，不能缩小），最大值为30度（放大后的最小FOV）
      const minFov = 30;
      const maxFov = initialFov;

      // 反转滚轮方向：滚轮向上（deltaY < 0）时放大视角（减小FOV），滚轮向下（deltaY > 0）时缩小视角（增大FOV）
      const deltaFov = event.deltaY * zoomSpeed;
      const newFov = camera.fov + deltaFov;

      // 限制FOV：最小值为30度（最大放大），最大值为初始FOV（原始大小，不能缩小）
      camera.fov = Math.max(minFov, Math.min(maxFov, newFov));

      // 更新相机投影矩阵
      camera.updateProjectionMatrix();
    };

    if (canvas) {
      canvas.addEventListener('dblclick', handleCanvasDoubleClick);
      canvas.addEventListener('click', handleCanvasClick);
      canvas.addEventListener('wheel', handleWheel, {passive: false});
    }

    // 存储事件处理函数以便后续清理
    if (!window.pointerLockHandlers) {
      window.pointerLockHandlers = [];
    }
    const pointerLockHandlers = ((window as any).pointerLockHandlers as PointerLockHandler[]) || [];

    // 将滚轮事件处理器添加到清理列表
    pointerLockHandlers.push({
      wheelHandler: handleWheel,
      canvas: canvas
    });
    (window as any).pointerLockHandlers = pointerLockHandlers;
    pointerLockHandlers.push({
      onPointerLockError: onPointerLockError,
      canvasDoubleClick: handleCanvasDoubleClick,
      canvasClick: handleCanvasClick,
      escapeKeyDown: handleEscapeKeyDown,
      canvas: canvas
    });
  }

  // 渲染器
  if (canvas) {
    renderer = new THREE.WebGLRenderer({canvas});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }

  /**
   * 背景天空部分
   */
  const sky = new Sky();
  sky.scale.setScalar(450000);
  scene.add(sky);

  const sun = new THREE.Vector3();

  /// GUI
  const effectController = {
    turbidity: 8,          // 降低浑浊度，黎明时空气较清新
    rayleigh: 5,           // 增加瑞利散射，强化黎明的蓝色和粉色调
    mieCoefficient: 0.003, // 降低米氏散射，使天空更通透
    mieDirectionalG: 0.85, // 调整散射方向性
    elevation: 3.5,        // 设置为低角度，黎明太阳刚升起
    azimuth: 105,          // 调整为清晨方向（东偏南）
    exposure: 1.2          // 稍微提高曝光，增强黎明的明亮感
  };

  function guiChanged() {

    const uniforms = sky.material.uniforms;
    uniforms['turbidity'].value = effectController.turbidity;
    uniforms['rayleigh'].value = effectController.rayleigh;
    uniforms['mieCoefficient'].value = effectController.mieCoefficient;
    uniforms['mieDirectionalG'].value = effectController.mieDirectionalG;

    const phi = THREE.MathUtils.degToRad(90 - effectController.elevation);
    const theta = THREE.MathUtils.degToRad(effectController.azimuth);

    sun.setFromSphericalCoords(1, phi, theta);

    uniforms['sunPosition'].value.copy(sun);

    if (renderer) {
      renderer.toneMappingExposure = effectController.exposure;
    }
  }

  guiChanged();

  /**
   * 精灵模型
   */
  spritePositions = [];


  /**
   * 加载教室模型
   */
  loader = new GLTFLoader();
  textureLoader = new THREE.TextureLoader();

  let classroomTexture: THREE.Texture | null = null;
  let deskChairTexture: THREE.Texture | null = null;

  // 加载模型 - 顺序加载实现
  const loadModelsSequentially = async () => {
    try {
      await new Promise<void>((resolve, reject) => {
        if (!textureLoader) {
          reject(new Error('TextureLoader not initialized'));
          return;
        }

        classroomTexture = textureLoader.load(getClassroomModelTexturePathByRecord(courseRecord.value))
        deskChairTexture = textureLoader.load(getdeskChairModelTexturePathByRecord(courseRecord.value))
        classroomTexture.flipY = false;
        deskChairTexture.flipY = false;

        resolve();
      });
      // 加载第一个模型（教室）
      await new Promise<void>((resolve, reject) => {
        const bakedMaterial = new THREE.MeshBasicMaterial({
          map: classroomTexture,
          side: THREE.DoubleSide
        });

        if (!loader) {
          reject(new Error('Loader not initialized'));
          return;
        }

        loader.load(
            getClassroomModelPathByRecord(courseRecord.value),
            (gltf: GLTF) => {
              classroomModel = gltf.scene;
              // 调整模型大小和位置
              classroomModel.position.set(0, 0, 0);
              classroomModel.rotation.y = Math.PI / 2; // 根据需要调整旋转

              // 计算并输出模型尺寸
              const box = new THREE.Box3().setFromObject(classroomModel);
              const size = new THREE.Vector3();
              box.getSize(size);

              classroomXLenghtRef.value = size.x;
              classroomYLenghtRef.value = size.y;
              classroomZLenghtRef.value = size.z;

              // 根据最新的教室模型尺寸重新计算相机位置
              window.cameraPositions = computeCameraPositionsBySize(
                  classroomXLenghtRef.value,
                  classroomYLenghtRef.value,
                  classroomZLenghtRef.value,
                  courseRecord.value?.classroomType
              );

              // 模型加载完成后，将相机初始位置设置为相机组中的 front 视角
              const frontConfig = window.cameraPositions?.front;
              if (camera && frontConfig) {
                camera.position.set(
                    frontConfig.position.x,
                    frontConfig.position.y,
                    frontConfig.position.z
                );
                camera.setRotationFromEuler(frontConfig.initialRotation);
              }

              // 遍历模型，应用纹理
              classroomModel.traverse((child) => {
                if ((child as THREE.Mesh).isMesh) {
                  const mesh = child as THREE.Mesh;
                  mesh.material = bakedMaterial;
                  mesh.material.needsUpdate = true;
                }
              });

              if (scene && classroomModel) {
                scene.add(classroomModel);
              }
              resolve();
            },
            () => {
              // 加载进度处理
            },
            (error) => {
              reject(error);
            }
        );

      });

      // 第一个模型加载完成后，加载第二个模型（桌椅）
      await new Promise<void>((resolve, reject) => {
        if (!loader) {
          reject(new Error('Loader not initialized'));
          return;
        }

        loader.load(
            getDeskModelPathByRecord(courseRecord.value),
            (gltf: GLTF) => {
              try {
                const modelInstanceManager = new ModelInstanceManager();

                // 1. 识别模型结构并保存子组件和网格信息
                const subComponents = modelInstanceManager.identifyModelStructure(gltf.scene);

                // 计算总网格数量
                const totalMeshCount = subComponents.reduce((sum, component) => sum + component.meshes.length, 0);
                if (totalMeshCount === 0) {
                  throw new Error(t('classroom.noMeshObjectsFound'));
                }

                // 2. 智能计算安全的实例数量（实例数量指模型实例数量）
                const hardwareLimit = 65536; // WebGL 1.0 限制
                const maxAllowedInstances = Math.min(instanceCount.value, 1000, hardwareLimit);

                // 计算实际座位数量（大型教室：每个模型对应 4 个座位；其他类型：每个模型对应 1 个座位）
                const seatsPerModel = courseRecord.value?.classroomType === ClassroomTypeEnum.LARGE ? 4 : 1;
                const totalSeatCount = maxAllowedInstances * seatsPerModel;

                // 3. 创建整体模型的实例化网格集合
                const instancedMeshGroups = modelInstanceManager.createGroupedInstancedMeshes(
                    subComponents,
                    maxAllowedInstances,
                    deskChairTexture
                );

                // 4. 批量计算位置和设置矩阵（优化内存使用）
                const calculatePosition = (instanceId: number, position: THREE.Vector3): THREE.Vector3 => {
                  return calculateSeatPosition(
                      instanceId,
                      position,
                      classroomXLenghtRef.value,
                      classroomZLenghtRef.value
                  );
                };

                // 批量设置矩阵 - 保持内部组件相对位置
                modelInstanceManager.setInstanceMatricesAsGroup(
                    instancedMeshGroups,
                    0,
                    maxAllowedInstances,
                    calculatePosition,
                    courseRecord.value?.classroomType || undefined
                );

                // 5. 批量存储精灵位置 - 优化内存分配
                fillSpritePositions(
                    spritePositions,
                    totalSeatCount,
                    classroomXLenghtRef.value,
                    classroomZLenghtRef.value
                );

                // 6. 批量添加到场景
                if (scene && instancedMeshGroups.length > 0) {
                  instancedMeshGroups.forEach((instancedMesh: InstancedMesh) => {
                    if (scene) {
                      scene.add(instancedMesh);
                    }
                  });
                }

                // 7. 存储实例化网格引用以便后续清理
                if (!window.instancedObjects) {
                  window.instancedObjects = [];
                }
                window.instancedObjects.push(...instancedMeshGroups);

                // 8. 初始化教室交互（悬浮、点击、右键等）
                if (canvas && camera && scene) {
                  initInteractions({
                    canvas,
                    camera,
                    scene,
                    classroomModel: classroomModel || undefined,
                    instancedMeshGroups,
                    classroomType: courseRecord.value?.classroomType || null,
                    classroomXLength: classroomXLenghtRef.value,
                    classroomZLength: classroomZLenghtRef.value,
                    onSeatHover: (seatIndex, event) => {
                      // 显示学生信息弹窗
                      if (seatIndex !== null) {
                        const seatIdx = seatIndex;
                        showStudentInfo.value = true;
                        currentSeatIndex.value = seatIdx;
                        currentStudent.value = seatStudentMap.value.get(seatIdx) || null;

                        // 设置弹窗位置（鼠标位置附近）
                        popupPosition.value = {
                          x: event.clientX + 15,
                          y: event.clientY + 15
                        };
                      } else {
                        // 隐藏学生信息弹窗
                        showStudentInfo.value = false;
                        currentStudent.value = null;
                        currentSeatIndex.value = null;
                      }
                    },
                    onSeatContextMenu: async (seatIndex) => {
                      // 教师（无学生身份）右键桌椅直接无响应
                      const currentStudentId = userStore.studentInfo?.id || null;
                      if (!currentStudentId) {
                        return;
                      }

                      // 处理座位右键（站起/退座）
                      const recordId = (route.params.courseRecordId as string) || (route.query.recordId as string);
                      if (!recordId) return;

                      // 检查该座位是否被当前学生占用
                      const occupant = studentsList.value.find(s => s.seatIndex === seatIndex) || null;

                      // 只有座位上的学生自己可以右键站起
                      if (!occupant || occupant.studentId !== currentStudentId) {
                        return;
                      }

                      // 弹出确认框
                      dialog.warning({
                        title: t('classroom.standUp.confirm.title'),
                        content: t('classroom.standUp.confirm.content'),
                        positiveText: t('classroom.standUp.confirm.confirm'),
                        negativeText: t('classroom.standUp.confirm.cancel'),
                        onPositiveClick: async () => {
                          // 执行退座操作
                          const apiResponse = await removeStudentSeat(recordId, occupant.studentId);
                          const isSuccess = typeof apiResponse === 'boolean' ? apiResponse : Boolean(apiResponse && (apiResponse.success === true || apiResponse.code === 200));

                          if (!isSuccess) {
                            return;
                          }

                          // 更新前端显示：移除精灵数据并刷新列表
                          try {
                            if (spriteManager && spriteManager.isInitialized) {
                              spriteManager.removeUserData(occupant.studentId);
                            }
                          } catch (e) {
                            // 静默处理
                          }
                          await fetchStudentsList(recordId);
                          if (message) {
                            message.success(t('classroom.standUp.success'));
                          }
                        }
                      });
                    },
                    onSeatClick: (seatIndex) => {
                      // 处理座位点击（入座）
                      const recordId = (route.params.courseRecordId as string) || (route.query.recordId as string);
                      if (!recordId) return;

                      // 如果当前账号没有学生身份，使用 message.info 给出提示并阻止入座流程
                      const currentStudentId = userStore.studentInfo?.id || null;
                      if (!currentStudentId) {
                        if (message) {
                          message.info(t('classroom.noStudentIdentityContent'));
                        }
                        return;
                      }

                      // 检查该座位是否已被占用（使用 studentId 比较）
                      const occupant = studentsList.value.find(s => s.seatIndex === seatIndex) || null;

                      if (occupant && occupant.studentId !== currentStudentId) {
                        if (message) {
                          message.info(t('classroom.seatOccupied'));
                        }
                        return;
                      }

                      // 打开确认对话，交由现有流程处理入座
                      const seatLabel = formatSeatLabel(Math.floor(seatIndex / (columnCount.value || 1)), seatIndex % (columnCount.value || 1));
                      const avatarUrl = userStore.userInfo?.avatar ?? null;
                      const displayName = getIdentityName(userStore.userInfo || null);
                      openSeatConfirmModal({
                        seatIndex,
                        seatLabel,
                        avatarUrl,
                        displayName
                      });
                    },
                  });
                }

                resolve();
              } catch (error) {
                if (window.instancedObjects) {
                  window.instancedObjects.forEach(obj => {
                    if (obj && scene) {
                      scene.remove(obj);
                    }
                  });
                  window.instancedObjects = [];
                }
                reject(error);
              }
            },
            () => {
              // 加载进度处理
            },
            (error) => {
              reject(error);
            }
        );
      });

      // 加载 cool_man 模型（教师模型）
      await new Promise<void>((resolve, _reject) => {
        // 创建新的 loader 实例以设置正确的路径
        const coolManLoader = new GLTFLoader();
        const basePath = import.meta.env.DEV 
          ? '/src/assets/3Dmodel/cool_man/' 
          : '/assets/3Dmodel/cool_man/';
        
        coolManLoader.setPath(basePath);

        coolManLoader.load(
            'scene.gltf',
            (gltf: GLTF) => {
              const coolManModel = gltf.scene;

              // 根据教室类型获取老师座位位置
              const teacherPosition = getTeacherSeatPosition(courseRecord.value?.classroomType ?? null);

              // 调整模型大小和位置
              coolManModel.position.copy(teacherPosition); // 放置在讲台位置
              coolManModel.rotation.y = Math.PI; // 面向前方
              // coolManModel.scale.set(0.5, 0.5, 0.5); // 调整大小

              if (scene && coolManModel) {
                scene.add(coolManModel);

                // 在教师模型附近添加光照
                const ambientLight = new THREE.AmbientLight(0xffffff, 2);
                scene.add(ambientLight);
              }
              resolve();
            },
            () => {
              // 加载进度处理
            },
            (error) => {
              console.warn('加载 cool_man 模型失败:', error);
              resolve(); // 即使失败也继续执行
            }
        );
      });

      await new Promise<void>((resolve) => {
        // 初始化精灵管理器
        const initializeSpriteManager = (texture: Texture) => {
          try {
            // 使用实际座位数量初始化精灵管理器（避免把实例数量误当作座位数量）
            const seatCountForInit = spritePositions.length;
            spriteManager.initialize(seatCountForInit, texture);
            spriteManager.setPositions(spritePositions);

            // 设置场景引用
            if (scene && camera) {
              spriteManager.setScene(scene);
              spriteManager.setCamera(camera);
            }

            // 创建精灵实例
            try {
              spriteManager.createSpriteInstances();
            } catch (error) {
              // 静默处理错误
            }

            // 如果已有学生列表，渲染学生精灵
            if (studentsList.value.length > 0) {
              renderStudentSprites(studentsList.value);
            }
          } catch (initError) {
            // 静默处理错误
          }
        };

        const defaultAvatarIdentity = {
          avatarSrc: null,
          username: null,
          nickName: null,
          studentRealName: null,
          teacherRealName: null
        };
        renderAvatarToTexture(defaultAvatarIdentity, 128).then((defaultTexture) => {
          initializeSpriteManager(defaultTexture);
        });

        // 精灵管理器初始化完成后，立即获取学生座位信息并渲染精灵
        // 这样桌椅模型加载完成后，占用的座位上会立即显示学生头像
        const recordId = (route.params.courseRecordId as string) || (route.query.recordId as string);
        if (recordId) {
          fetchStudentsList(recordId).catch(error => {
            console.warn(t('classroom.fetchStudentsListFailed'), error);
          });
        }

        resolve();
      });
    } catch (error) {
      // 静默处理模型加载失败
    }
  };

  loadModelsSequentially().then(async () => {
    // 模型加载完成后，隐藏全局过渡动画并显示提示信息
    transitionStore.hide(1250);
    showPointerHintTemporarily();

    // 如果已有学生列表且精灵管理器已初始化，渲染学生精灵
    if (studentsList.value.length > 0 && spriteManager && spriteManager.isInitialized) {
      await renderStudentSprites(studentsList.value);
    }

    // 注意：Pointer Lock API 需要用户手势才能请求锁定
    // 因此不在模型加载完成后自动锁定，而是等待用户点击画布
    // 用户点击画布时会通过 handleCanvasClick 函数触发锁定
  });


  /**
   * 窗口大小调整
   */
  window.addEventListener('resize', () => {
    if (!camera || !renderer) return;
    // 更新尺寸
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // 更新相机
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // 更新渲染器
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  });

  // 移除滚轮事件监听，改为左键点击触发视角切换
  // 视角切换逻辑已集成到 handleDeskClick 中


  /**
   * 帧更新(动画)
   */
  const tick = () => {
    if (!controls || !renderer || !scene || !camera) {
      requestAnimationFrame(tick);
      return;
    }

    // 更新控制器
    if (controls) {
      (controls as any).update();
    }

    if (spriteManager.isInitialized) {
      syncSpeakingIndicatorsFromStore();
      spriteManager.updateSpeakingAnimations();
    }

    // 基于当前相机预设视角，限制旋转角度在 ±60°
    const maxDelta = Math.PI / 3; // 60度

    // 计算角度差值，考虑 -π 到 π 的循环，选择最短路径
    const getAngleDelta = (current: number, initial: number): number => {
      let delta = current - initial;
      // 归一化到 [-π, π] 范围，选择最短路径
      while (delta > Math.PI) delta -= 2 * Math.PI;
      while (delta < -Math.PI) delta += 2 * Math.PI;
      return delta;
    };

    // 限制角度差值在 ±60° 范围内
    const clampDelta = (delta: number): number => {
      if (delta > maxDelta) {
        return maxDelta;
      }
      if (delta < -maxDelta) {
        return -maxDelta;
      }
      return delta;
    };

    if ((window as any).cameraPositions && (window as any).currentCameraPosition && camera.rotation) {
      const cameraPositions = (window as any).cameraPositions as ClassroomCameraPositions;
      const currentKey = (window as any).currentCameraPosition as keyof ClassroomCameraPositions;
      const config = cameraPositions[currentKey];

      if (config && config.initialRotation) {
        const initial = config.initialRotation;
        const current = camera.rotation;

        // 计算每个轴的差值（考虑角度循环）
        let dx = getAngleDelta(current.x, initial.x);
        let dy = getAngleDelta(current.y, initial.y);

        // 只允许绕 X/Y 轴旋转，完全禁止 Z 轴滚转（避免画面倾斜）
        const needsClampX = Math.abs(dx) > maxDelta;
        const needsClampY = Math.abs(dy) > maxDelta;

        // 只在超出限制时才修正
        if (needsClampX || needsClampY) {
          dx = clampDelta(dx);
          dy = clampDelta(dy);

          // 设置限制后的旋转，保持 YXZ 顺序，Z 轴始终为初始值
          camera.rotation.order = initial.order;
          camera.rotation.x = initial.x + dx;
          camera.rotation.y = initial.y + dy;
          camera.rotation.z = initial.z;
        } else {
          // 在限制范围内，也强制保持 Z 轴不滚转
          camera.rotation.z = initial.z;
        }
      }
    }

    // 渲染
    renderer.render(scene, camera);

    // 继续调用 tick 函数
    requestAnimationFrame(tick);
  };

  // 启动动画循环
  tick();
};

onMounted(async () => {
  showChapterPanel.value = false;
  showQuestionPanel.value = false;
  await fetchCourseRecord();
  const recordId = getCurrentRecordId();
  if (recordId) {
    startSeatSync(recordId);
  }
  initThree();
  // 监听座位布局更新事件，刷新页面或重新拉取数据
  (eventBus as any).on && (eventBus as any).on('classroomLayoutUpdated', async () => {
    // 保守处理：刷新页面以确保所有实例按照新布局重建
    window.location.reload();
  });
});

onBeforeUnmount(() => {
  stopSeatSync();
  activeSpeakingSeats.clear();

  if (spriteManager && spriteManager.isInitialized) {
    spriteManager.clearSpeakingIndicators();
  }

  // 清理PointerLockControls
  if (controls && canvas) {
    // 解锁鼠标指针
    if (document.pointerLockElement === canvas) {
      document.exitPointerLock();
    }
    // 清理控制器引用
    controls = null;
  }

  // 滚轮事件已移除，无需清理

  // 清理指针锁定相关监听器
  if ((window as any).pointerLockHandlers && Array.isArray((window as any).pointerLockHandlers)) {
    const pointerLockHandlers = ((window as any).pointerLockHandlers as PointerLockHandler[]) || [];
    pointerLockHandlers.forEach(({
                                   onPointerLockError,
                                   canvasDoubleClick,
                                   canvasClick,
                                   escapeKeyDown,
                                   wheelHandler,
                                   canvas: handlerCanvas
                                 }) => {
      if (onPointerLockError) {
        document.removeEventListener('pointerlockerror', onPointerLockError);
      }
      if (escapeKeyDown) {
        document.removeEventListener('keydown', escapeKeyDown, true);
      }
      if (canvasDoubleClick && handlerCanvas) {
        handlerCanvas.removeEventListener('dblclick', canvasDoubleClick);
      }
      if (canvasClick && handlerCanvas) {
        handlerCanvas.removeEventListener('click', canvasClick);
      }
      if (wheelHandler && handlerCanvas) {
        handlerCanvas.removeEventListener('wheel', wheelHandler);
      }
    });
    (window as any).pointerLockHandlers = [];
  }

  // 清理教室交互资源
  disposeInteractions();

  // 清理学生信息弹窗状态
  showStudentInfo.value = false;
  currentStudent.value = null;
  currentSeatIndex.value = null;
  studentsList.value = [];
  seatStudentMap.value.clear();

  // 清理window上的引用
  if (window.cameraPositions) {
    delete window.cameraPositions;
  }
  if (window.currentCameraPosition) {
    delete window.currentCameraPosition;
  }
  if (window.switchCameraPosition) {
    delete window.switchCameraPosition;
  }
  if (window.camera) {
    delete window.camera;
  }
  if (window.controls) {
    delete window.controls;
  }
  // 移除事件监听
  (eventBus as any).off && (eventBus as any).off('classroomLayoutUpdated');

  // 清理批量实例化的网格对象
  if (window.instancedObjects) {
    window.instancedObjects.forEach((obj: InstancedMesh) => {
      if (obj) {
        // 从场景中移除
        if (scene && obj.parent === scene) {
          scene.remove(obj);
        }
        // 释放资源
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach(m => m.dispose());
          } else {
            obj.material.dispose();
          }
        }
        // 释放实例矩阵（InstancedMesh 的 instanceMatrix 不需要手动 dispose）
      }
    });
    // 清空数组
    window.instancedObjects.length = 0;
  }

  // 清理Three.js核心资源
  if (renderer) {
    renderer.dispose();
    renderer.domElement.remove();
  }

  // 清理场景中的其他对象
  if (scene) {
    scene.traverse((object: THREE.Object3D) => {
      if ((object as THREE.Mesh).geometry) (object as THREE.Mesh).geometry.dispose();
      if ((object as THREE.Mesh).material) {
        const material = (object as THREE.Mesh).material;
        if (Array.isArray(material)) {
          material.forEach((m: THREE.Material) => m.dispose());
        } else {
          material.dispose();
        }
      }
      // 清理灯光和其他特殊对象
      if ((object as THREE.Light).isLight && (object as any).dispose) {
        (object as any).dispose();
      }
    });
  }

  // 清理加载器（LoadingManager 不需要手动 dispose）

  // 清理精灵位置数组
  spritePositions.length = 0;
  if (pointerHintTimeout) {
    clearTimeout(pointerHintTimeout);
    pointerHintTimeout = null;
  }
});
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.classroom-3d-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100vw;
  height: 100vh;
  z-index: 1000;
}

.webgl_7 {
  width: 100%;
  height: 100%;
  display: block;
}

.pointer-lock-hint {
  position: fixed;
  top: 80px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1002;
  max-width: 400px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}


@media (max-width: 768px) {
  .classroom-3d-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
  }
}

@media (max-width: 480px) {
}
</style>
