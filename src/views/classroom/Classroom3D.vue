<template>
  <div class="classroom-3d-container">
    <canvas ref="canvasRef" class="webgl_7"></canvas>
    <!-- 退出教室按钮 -->
    <n-button
        class="exit-button"
        size="medium"
        type="default"
        @click="handleExit($event)"
    >
      {{ t('classroom.exit') }}
    </n-button>
    <!-- 智慧课堂黑白按钮 -->
    <n-button
        class="live-button"
        size="medium"
        type="default"
        @click="handleLive($event)"
    >
      {{ t('classroom.live') }}
    </n-button>
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
import {onMounted, onBeforeUnmount, ref, computed} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useI18n} from 'vue-i18n';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls.js';
import {ModelClickHandler} from '@/utils/threeModelClickHandler';
import {Sky} from 'three/examples/jsm/objects/Sky.js';
import {getCourseRecordById} from '@/api/classroom/courseRecord';
import {
  listStudentsByRecordId,
  addStudentSeat,
  getDefaultCourseRecordStudentDTO,
  updateStudentSeat,
  removeStudentSeat
} from '@/api/classroom/courseRecordStudent';
import StudentInfoPopup from './StudentInfoPopup.vue';
import {useUserStore} from '@/store/modules/user';
import {getGlobalApis} from '@/utils/naiveUIHelper';
import {SpriteManager} from '@/views/classroom/composables/spriteManager';
import {getAvatarColor, getAvatarInitial, resolveUserName} from '@/utils/avatarUtil';
import type {AvatarIdentityProps} from '@/types/components/avatar';
import type {CourseRecordVO, CourseRecordStudentVO, CourseRecordStudentDTO} from '@/types/classroom';
import {SeatStatusEnum} from '@/enum/classroom/seatStatusEnum';
import type {SeatAssignmentContext} from '@/types/components/seatConfirmModal';
import type {Texture, PerspectiveCamera, Scene, WebGLRenderer} from 'three';
import type {InstancedMesh} from 'three';
import type {GLTF} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {useTransitionStore} from '@/store/modules/transition';
import {runViewTransition} from '@/utils/themeAnimation';

const {t} = useI18n();
const modelClickHandler = new ModelClickHandler();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const transitionStore = useTransitionStore();
const {dialog, message} = getGlobalApis();
// 课程记录状态
const courseRecord = ref<CourseRecordVO | null>(null);
const loadingRecord = ref(false);
const recordError = ref<string | null>(null);
const isClassroomOwner = computed(() => {
  if (!courseRecord.value) {
    return false;
  }
  const teacherId = courseRecord.value.teacherId;
  const currentTeacherId = userStore.teacherInfo?.id || null;
  return Boolean(teacherId && currentTeacherId && teacherId === currentTeacherId);
});

// 学生信息框相关状态
const showStudentInfo = ref(false);
const currentStudent = ref<CourseRecordStudentVO | null>(null);
const currentSeatIndex = ref<number | null>(null);
const popupPosition = ref({x: 0, y: 0});
const studentsList = ref<CourseRecordStudentVO[]>([]);
const pendingSeatContext = ref<SeatAssignmentContext | null>(null);
const fallbackTextureRef = ref<Texture | null>(null);
const showPointerLockHint = ref(false);
let pointerHintTimeout: number | null = null;

const spriteManager = new SpriteManager();

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

const createAvatarFallbackTexture = (displayName: string): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');
  const initials = getAvatarInitial(displayName);
  if (context) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = getAvatarColor(displayName);
    context.fillRect(0, 0, canvas.width, canvas.height);
    if (initials) {
      context.fillStyle = '#FFFFFF';
      context.font = 'bold 64px sans-serif';
      context.textAlign = 'center';
      context.textBaseline = 'middle';
      context.fillText(initials, canvas.width / 2, canvas.height / 2);
    }
  }
  return new THREE.CanvasTexture(canvas);
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
  const fallbackTexture = fallbackTextureRef.value || createAvatarFallbackTexture(pendingSeatContext.value.displayName || '');

  // 获取座位3D坐标（如果不存在则使用默认值）
  const seatPosition = spritePositions[seatIndex];
  let locationX: number = 0;
  let locationY: number = 0;
  let locationZ: number | null = null;

  if (seatPosition) {
    locationX = seatPosition.x;
    locationY = seatPosition.y;
    locationZ = seatPosition.z;
  }

  // 构建API请求数据
  const existingSeat = studentsList.value.find(student => student.studentId === userInfo.id) || null;
  const seatData: CourseRecordStudentDTO = getDefaultCourseRecordStudentDTO();
  seatData.recordId = recordId;
  seatData.studentId = userInfo.id;
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
    spriteManager.updateSpriteInfo(userInfo.id, texture, seatIndex);
    resetSeatConfirmState(shouldDisposeFallback);
    // 刷新学生列表
    if (recordId) {
      fetchStudentsList(recordId);
    }
  };

  if (!avatarUrl || avatarUrl.trim() === '') {
    applyTextureToSprite(fallbackTexture, false);
    return true;
  }

  const textureLoader = new THREE.TextureLoader();
  textureLoader.load(
      avatarUrl,
      (texture) => {
        applyTextureToSprite(texture);
      },
      undefined,
      () => {
        applyTextureToSprite(fallbackTexture, false);
      }
  );

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
  fallbackTextureRef.value = createAvatarFallbackTexture(context.displayName || '');

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


// 从课程记录获取行数
const rowCount = computed(() => {
  // 优先从课程记录获取，没有则使用默认值
  if (courseRecord.value && courseRecord.value.layoutRows !== null) {
    // 添加合理的边界检查
    return Math.min(Math.max(courseRecord.value.layoutRows, 1), 12);
  }
  return 4;
});

// 从课程记录获取列数
const columnCount = computed(() => {
  // 优先从课程记录获取，没有则使用默认值
  if (courseRecord.value && courseRecord.value.layoutColumns !== null) {
    // 添加合理的边界检查
    return Math.min(Math.max(courseRecord.value.layoutColumns, 1), 12);
  }
  return 3;
});

// 计算实例数量，添加上限检查（最大50个实例，进一步降低以避免类型化数组错误）
const instanceCount = computed(() => {
  const count = rowCount.value * columnCount.value;
  // 进一步降低上限以避免类型化数组错误
  return Math.min(count, 50);
});

// 获取课程记录信息
const fetchCourseRecord = async () => {
  try {
    loadingRecord.value = true;
    recordError.value = null;

    // 从路由参数获取课程记录ID
    const recordId = (route.params.courseRecordId as string) || (route.query.recordId as string);
    if (!recordId) {
      return;
    }

    // 调用API获取课程记录
    const response = await getCourseRecordById(String(recordId));
    courseRecord.value = response?.data || null;

    // 获取学生列表
    await fetchStudentsList(String(recordId));
  } catch (error) {
    recordError.value = '获取课程记录失败，使用默认配置';
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

  const textureLoader = new THREE.TextureLoader();

  for (const student of students) {
    if (student.seatIndex === null || student.seatIndex === undefined) {
      continue;
    }

    const seatIndex = student.seatIndex;
    const studentId = student.studentId;
    const avatarUrl = student.studentAvatar;
    const displayName = student.studentName || student.studentCode || '';

    // 如果有头像URL，加载头像纹理
    if (avatarUrl && avatarUrl.trim() !== '') {
      textureLoader.load(
          avatarUrl,
          (texture: Texture) => {
            spriteManager.updateSpriteInfo(studentId, texture, seatIndex);
          },
          undefined,
          () => {
            // 加载失败，使用默认纹理
            const fallbackTexture = createAvatarFallbackTexture(displayName);
            spriteManager.updateSpriteInfo(studentId, fallbackTexture, seatIndex);
          }
      );
    } else {
      // 没有头像，使用默认纹理
      const fallbackTexture = createAvatarFallbackTexture(displayName);
      spriteManager.updateSpriteInfo(studentId, fallbackTexture, seatIndex);
    }
  }
};

// 获取学生列表
const fetchStudentsList = async (recordId: string) => {
  try {
    const response = await listStudentsByRecordId(recordId);
    studentsList.value = response?.data || [];

    // 渲染学生精灵模型
    if (studentsList.value.length > 0 && spriteManager && spriteManager.isInitialized) {
      await renderStudentSprites(studentsList.value);
    }
  } catch (error) {
    studentsList.value = [];
  }
};

// 学生信息框展示逻辑移除悬停触发，保留基础状态，后续如需点击展示可在此扩展

// 退出教室，使用全局过渡动画
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

// 跳转到直播页面，使用全局过渡动画
const handleLive = (e: MouseEvent) => {
  transitionStore.show();
  const courseId = route.params.courseId as string;
  const courseRecordId = route.params.courseRecordId as string;
  runViewTransition(() => {
    if (courseId && courseRecordId) {
      router.push({
        name: 'CourseLive',
        params: {
          courseId,
          courseRecordId
        }
      });
    } else {
      router.push({name: 'Live'});
    }
  }, e);
};

let canvas: HTMLCanvasElement | null = null;
let renderer: WebGLRenderer | null = null;
let scene: Scene | null = null;
let camera: PerspectiveCamera | null = null;
let controls: PointerLockControls | null = null;
let classroomModel: THREE.Group | null = null;
let loader: GLTFLoader | null = null;
let classroomXLenght = 1;
let classroomZLenght = 1;
let spritePositions: THREE.Vector3[] = [];
let isAltPressed = false; // Alt键状态跟踪


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
  // 相机位置配置对象（组件级别变量）
  window.cameraPositions = {
    front: {
      position: {x: -9, y: 4.5, z: 0},
      initialRotation: new THREE.Euler(0, Math.PI * 3 / 2, 0) // 初始朝向
    },
    rightRear: {
      position: {x: 9, y: 4.5, z: -6.5},
      initialRotation: new THREE.Euler(0, Math.PI * 3 / 4, 0), // 初始朝向
    },
    leftRear: {
      position: {x: 9, y: 4.5, z: 6.5},
      initialRotation: new THREE.Euler(0, Math.PI / 4, 0) // 旋转45度
    }
  };

  camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
  // 将相机固定在教室内部前部位置
  // 基于教室模型尺寸计算前部位置，使相机处于教室内部靠前的位置
  camera.position.set(
      window.cameraPositions.front.position.x,
      window.cameraPositions.front.position.y,
      window.cameraPositions.front.position.z
  ); // 设置相机在前部较高位置，可观察整个教室
  camera.setRotationFromEuler(window.cameraPositions.front.initialRotation);
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

    // 保持指针锁定状态（如果之前已锁定）
    // PointerLockControls 会自动处理相机旋转，切换位置后继续使用即可
  }

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

    // Alt键按下时解锁指针显示鼠标
    const handleAltKeyDown = (event: KeyboardEvent) => {
      // 检查是否是Alt键（包括左右Alt键）
      if (event.key === 'Alt' || event.altKey) {
        // 防止Alt键触发浏览器菜单
        event.preventDefault();
        isAltPressed = true;

        // 隐藏提示（用户已经知道如何操作）
        showPointerLockHint.value = false;

        // 如果指针已锁定，解锁以显示鼠标
        if (canvas && document.pointerLockElement === canvas) {
          document.exitPointerLock();
        }
      }
    };

    // Alt键释放时立即尝试重新锁定指针
    const handleAltKeyUp = (event: KeyboardEvent) => {
      // 检查是否是Alt键
      if (event.key === 'Alt' || (!event.altKey && isAltPressed)) {
        isAltPressed = false;
        // 在键盘抬起事件（用户手势）中直接调用 lock()，满足浏览器要求
        if (canvas && controls && document.pointerLockElement !== canvas) {
          controls.lock();
        }
      }
    };

    // 鼠标移动时检查Alt键状态（作为备用检测方法）
    const handleMouseMove = (event: MouseEvent) => {
      const altCurrentlyPressed = event.altKey;

      // 如果Alt键状态发生变化
      if (altCurrentlyPressed !== isAltPressed) {
        isAltPressed = altCurrentlyPressed;

        if (altCurrentlyPressed) {
          // Alt键刚被按下：解锁指针显示鼠标
          if (canvas && document.pointerLockElement === canvas) {
            document.exitPointerLock();
          }
        }
        // 鼠标移动事件中不做自动锁定，锁定逻辑在 Alt 抬起或点击画布时处理
      }
    };

    // 点击画布时自动锁定指针（如果未锁定且Alt键未按下）
    const handleCanvasClick = (event: MouseEvent) => {
      // 如果Alt键未按下，才自动锁定
      if (!event.altKey && !isAltPressed && canvas && controls && document.pointerLockElement !== canvas) {
        // 首次点击时显示提示
        if (!localStorage.getItem('pointerLockHintShown')) {
          showPointerLockHint.value = true;
          localStorage.setItem('pointerLockHintShown', 'true');
        }
        // 在用户点击事件中直接调用 lock()，这是有效的用户手势
        controls.lock();
      }
    };

    // 防止Alt键触发浏览器菜单
    const handleContextMenu = (event: MouseEvent) => {
      if (event.altKey) {
        event.preventDefault();
      }
    };

    // 添加Alt键事件监听器
    document.addEventListener('keydown', handleAltKeyDown, true);
    document.addEventListener('keyup', handleAltKeyUp, true);

    // 添加鼠标移动事件监听器作为备用检测
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      // 防止Alt键触发浏览器菜单
      canvas.addEventListener('contextmenu', handleContextMenu);
    }

    // 添加点击画布事件监听器（用于自动锁定指针）
    if (canvas) {
      canvas.addEventListener('click', handleCanvasClick);
    }

    // 存储事件处理函数以便后续清理
    if (!window.pointerLockHandlers) {
      window.pointerLockHandlers = [];
    }
    window.pointerLockHandlers.push({
      altKeyDown: handleAltKeyDown,
      altKeyUp: handleAltKeyUp,
      onPointerLockError: onPointerLockError,
      canvasClick: handleCanvasClick,
      mouseMove: handleMouseMove,
      contextMenu: handleContextMenu,
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
  if (scene && camera && renderer) {
    modelClickHandler.init(scene, camera, renderer.domElement);
  }
  loader = new GLTFLoader();

  // 加载模型 - 顺序加载实现
  const loadModelsSequentially = async () => {
    try {
      // 加载第一个模型（教室）
      await new Promise<void>((resolve, reject) => {
        if (!loader) {
          reject(new Error('Loader not initialized'));
          return;
        }
        loader.load(
            `/src/assets/3Dmodel/classroom/classroomPro.gltf`,
            (gltf: GLTF) => {
              classroomModel = gltf.scene;
              // 调整模型大小和位置
              classroomModel.position.set(0, 0, 0);
              classroomModel.rotation.y = Math.PI / 2; // 根据需要调整旋转

              // 计算并输出模型尺寸
              const box = new THREE.Box3().setFromObject(classroomModel);
              const size = new THREE.Vector3();
              box.getSize(size);

              classroomXLenght = size.x;
              classroomZLenght = size.z;

              // 处理Blender中添加的点光源，转换为three.js标准
              classroomModel.traverse((child: THREE.Object3D) => {
                // 检查是否为光源对象
                const light = child as THREE.Light;
                if (light.isLight) {
                  // 点光源增强处理
                  const pointLight = light as THREE.PointLight;
                  if (pointLight.isPointLight) {
                    // 设置点光源的强度为0.2
                    pointLight.intensity = 8;
                    // 设置合适的衰减
                    pointLight.decay = 2;
                    // 增加光源范围
                    pointLight.distance = Math.max(pointLight.distance || 10, 15);
                  }
                }
              });

              /**
               * 射线选择
               */
              modelClickHandler.addClickListener(
                  classroomModel,
                  '大黑板',
                  () => {
                    // 使用Vue Router跳转到'/html-forest'界面
                  }
              );

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
            '/src/assets/3Dmodel/desk_Chair/deskAndChair.gltf',
            (gltf: GLTF) => {
              try {
                // 整体模型处理管理器 - 增强版
                const modelInstanceManager = {
                  // 识别并保存模型的子组件结构
                  identifyModelStructure: function (object: THREE.Object3D) {
                    const subComponents: Array<{
                      name: string
                      position: THREE.Vector3
                      quaternion: THREE.Quaternion
                      scale: THREE.Vector3
                      meshes: Array<{
                        mesh: THREE.Mesh
                        originalPosition: THREE.Vector3
                        originalQuaternion: THREE.Quaternion
                        originalScale: THREE.Vector3
                      }>
                    }> = [];

                    // 假设模型的直接子节点是主要子组件
                    if (object.children.length > 0) {

                      // 遍历所有直接子节点
                      object.children.forEach((child: THREE.Object3D, index: number) => {
                        if (child.isObject3D && !(child as THREE.Mesh).isMesh) { // 识别子组件（非网格对象）
                          const componentInfo = {
                            name: child.name || `component_${index}`,
                            position: child.position.clone(),
                            quaternion: child.quaternion.clone(),
                            scale: child.scale.clone(),
                            meshes: [] // 用于存储此子组件下的所有网格
                          };

                          // 递归收集此子组件下的所有网格
                          this.collectMeshesInComponent(child, componentInfo.meshes);

                          if (componentInfo.meshes.length > 0) {
                            subComponents.push(componentInfo);
                          }
                        }
                      });
                    }

                    // 如果没有识别到子组件结构，回退到原有的网格收集方式
                    if (subComponents.length === 0) {
                      const defaultMeshes: Array<{
                        mesh: THREE.Mesh
                        originalPosition: THREE.Vector3
                        originalQuaternion: THREE.Quaternion
                        originalScale: THREE.Vector3
                      }> = [];
                      this.collectMeshesInComponent(object, defaultMeshes);
                      subComponents.push({
                        name: 'default',
                        position: new THREE.Vector3(0, 0, 0),
                        quaternion: new THREE.Quaternion(),
                        scale: new THREE.Vector3(1, 1, 1),
                        meshes: defaultMeshes
                      });
                    }

                    return subComponents;
                  },

                  // 收集组件中的所有网格
                  collectMeshesInComponent: function (
                      object: THREE.Object3D,
                      meshes: Array<{
                        mesh: THREE.Mesh
                        originalPosition: THREE.Vector3
                        originalQuaternion: THREE.Quaternion
                        originalScale: THREE.Vector3
                      }> = []
                  ) {
                    if ((object as THREE.Mesh).isMesh) {
                      const mesh = object as THREE.Mesh;
                      if (mesh.visible && mesh.geometry) {
                        // 保存网格及其原始位置信息（相对于父组件）
                        meshes.push({
                          mesh: mesh,
                          originalPosition: mesh.position.clone(),
                          originalQuaternion: mesh.quaternion.clone(),
                          originalScale: mesh.scale.clone()
                        });
                      }
                    }

                    // 递归处理子节点
                    for (const child of object.children) {
                      this.collectMeshesInComponent(child, meshes);
                    }

                    return meshes;
                  },

                  // 创建整体模型的实例化网格集合
                  createGroupedInstancedMeshes: function (
                      subComponents: Array<{
                        name: string
                        position: THREE.Vector3
                        quaternion: THREE.Quaternion
                        scale: THREE.Vector3
                        meshes: Array<{
                          mesh: THREE.Mesh
                          originalPosition: THREE.Vector3
                          originalQuaternion: THREE.Quaternion
                          originalScale: THREE.Vector3
                        }>
                      }>,
                      count: number
                  ) {
                    const instancedMeshGroups: InstancedMesh[] = [];

                    // 为每个子组件中的网格创建实例化网格
                    subComponents.forEach((component) => {
                      component.meshes.forEach((meshData, meshIndex) => {
                        const mesh = meshData.mesh;
                        try {
                          // 重用几何体
                          const geometry = mesh.geometry;
                          // 克隆材质
                          const material = Array.isArray(mesh.material)
                              ? mesh.material.map((m: THREE.Material) => m.clone())
                              : (mesh.material.clone ? mesh.material.clone() : mesh.material);

                          // 创建实例化网格
                          const instancedMesh = new THREE.InstancedMesh(geometry, material, count);
                          instancedMesh.name = `${component.name}_${meshIndex}_instanced`;

                          // 设置渲染属性
                          instancedMesh.castShadow = mesh.castShadow;
                          instancedMesh.receiveShadow = mesh.receiveShadow;
                          instancedMesh.instanceMatrix.usage = THREE.DynamicDrawUsage;

                          // 存储原始位置信息和组件信息用于保持相对关系
                          instancedMesh.userData = {
                            meshPosition: meshData.originalPosition,
                            meshQuaternion: meshData.originalQuaternion,
                            meshScale: meshData.originalScale,
                            componentPosition: component.position.clone(),
                            componentQuaternion: component.quaternion.clone(),
                            componentScale: component.scale.clone(),
                            componentName: component.name
                          };

                          instancedMeshGroups.push(instancedMesh);
                        } catch (err) {
                          // 静默处理创建实例化网格失败
                        }
                      });
                    });

                    return instancedMeshGroups;
                  },

                  // 批量设置实例矩阵 - 保持模型内部相对位置
                  setInstanceMatricesAsGroup: function (
                      instancedMeshGroups: InstancedMesh[],
                      startIndex: number,
                      count: number,
                      positionCallback: (instanceId: number, position: THREE.Vector3) => THREE.Vector3
                  ) {
                    // 重用矩阵对象以减少GC压力
                    const matrix = new THREE.Matrix4();
                    const groupMatrix = new THREE.Matrix4();
                    const componentMatrix = new THREE.Matrix4();
                    const globalPosition = new THREE.Vector3();
                    const localPosition = new THREE.Vector3();
                    const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0));
                    const groupQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0));
                    const scale = new THREE.Vector3(1, 1, 1);

                    // 批量更新矩阵
                    for (let i = 0; i < count; i++) {
                      const instanceId = startIndex + i;

                      // 获取整体模型的位置
                      positionCallback(instanceId, globalPosition);

                      // 计算整体模型的变换矩阵
                      groupMatrix.compose(globalPosition, groupQuaternion, scale);

                      // 对每个网格应用相同的整体变换，但保持相对位置
                      instancedMeshGroups.forEach((instancedMesh: InstancedMesh) => {
                        // 计算子组件相对于整体模型的变换矩阵
                        componentMatrix.compose(
                            instancedMesh.userData.componentPosition,
                            instancedMesh.userData.componentQuaternion,
                            instancedMesh.userData.componentScale
                        );

                        // 应用整体模型变换到组件位置
                        componentMatrix.premultiply(groupMatrix);

                        // 使用网格相对于组件的原始位置
                        localPosition.copy(instancedMesh.userData.meshPosition);

                        // 应用组件变换到网格位置
                        localPosition.applyMatrix4(componentMatrix);

                        // 设置实例矩阵
                        matrix.compose(localPosition, quaternion, scale);
                        instancedMesh.setMatrixAt(instanceId, matrix);
                      });
                    }

                    // 标记所有实例矩阵需要更新
                    instancedMeshGroups.forEach(instancedMesh => {
                      instancedMesh.instanceMatrix.needsUpdate = true;
                    });
                  },

                  // 资源清理函数
                  disposeResources: function (instancedMeshGroups: InstancedMesh[]) {
                    instancedMeshGroups.forEach((mesh: InstancedMesh) => {
                      if (mesh && mesh.dispose) {
                        mesh.dispose();
                      }
                    });
                  }
                };

                // 1. 识别模型结构并保存子组件和网格信息
                const subComponents = modelInstanceManager.identifyModelStructure(gltf.scene);

                // 计算总网格数量
                const totalMeshCount = subComponents.reduce((sum, component) => sum + component.meshes.length, 0);

                if (totalMeshCount === 0) {
                  throw new Error('未在桌椅模型中找到任何网格对象');
                }

                // 2. 智能计算安全的实例数量
                const hardwareLimit = 65536; // WebGL 1.0 限制
                const maxAllowedInstances = Math.min(instanceCount.value, 1000, hardwareLimit); // 综合限制

                // 3. 创建整体模型的实例化网格集合
                const instancedMeshGroups = modelInstanceManager.createGroupedInstancedMeshes(subComponents, maxAllowedInstances);

                // 4. 批量计算位置和设置矩阵（优化内存使用）
                // 优化的位置计算函数 - 直接修改传入的向量
                const calculatePosition = (instanceId: number, position: THREE.Vector3): THREE.Vector3 => {
                  position.x = 2 * Math.floor(instanceId / columnCount.value) - classroomXLenght / 2 + 6;
                  position.y = 0.0;
                  position.z = classroomZLenght / 2 - classroomZLenght / columnCount.value * (0.5 + instanceId % columnCount.value);
                  return position;
                };

                // 批量设置矩阵 - 保持内部组件相对位置
                modelInstanceManager.setInstanceMatricesAsGroup(instancedMeshGroups, 0, maxAllowedInstances, calculatePosition);

                // 5. 批量存储精灵位置 - 优化内存分配
                spritePositions.length = 0; // 清空数组以重用
                spritePositions.length = maxAllowedInstances; // 预分配空间

                const tempPosition = new THREE.Vector3();
                for (let i = 0; i < maxAllowedInstances; i++) {
                  calculatePosition(i, tempPosition);
                  // 重用或创建向量以节省内存
                  if (!spritePositions[i]) {
                    spritePositions[i] = new THREE.Vector3();
                  }
                  // 将精灵头像在面向讲台方向略微前移，避免与桌椅重叠
                  spritePositions[i].set(tempPosition.x, tempPosition.y + 2.0, tempPosition.z);
                }

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

                // 8. 添加课桌悬浮事件处理（仅变更鼠标样式）
                const raycaster = new THREE.Raycaster();
                const mouse = new THREE.Vector2();
                let isCursorPointer = false; // 跟踪当前鼠标样式状态

                const handleDeskHover = (event: MouseEvent) => {
                  if (!canvas || !camera) return;

                  // 如果指针已锁定，不处理悬停
                  if (document.pointerLockElement === canvas) {
                    return;
                  }

                  // 计算鼠标在标准化设备坐标中的位置 (-1 到 1)
                  const rect = canvas.getBoundingClientRect();
                  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

                  // 设置射线投射器的射线
                  raycaster.setFromCamera(mouse, camera);

                  let foundDesk = false;

                  // 检测与所有实例化网格的交点
                  for (const instancedMesh of instancedMeshGroups) {
                    const intersects = raycaster.intersectObject(instancedMesh);
                    if (intersects.length > 0) {
                      foundDesk = true;
                      break;
                    }
                  }

                  // 根据是否命中课桌更新鼠标样式
                  if (foundDesk && !isCursorPointer) {
                    canvas.style.cursor = 'pointer';
                    isCursorPointer = true;
                  } else if (!foundDesk && isCursorPointer) {
                    canvas.style.cursor = 'default';
                    isCursorPointer = false;
                  }
                };

                if (canvas) {
                  const handleMouseLeave = () => {
                    if (isCursorPointer) {
                      (canvas as HTMLCanvasElement).style.cursor = 'default';
                      isCursorPointer = false;
                    }
                  };
                  canvas.addEventListener('mousemove', handleDeskHover);
                  canvas.addEventListener('mouseleave', handleMouseLeave);

                  if (!window.deskHoverHandlers) {
                    window.deskHoverHandlers = [];
                  }
                  window.deskHoverHandlers.push({
                    hoverHandler: handleDeskHover,
                    leaveHandler: handleMouseLeave,
                    canvas: canvas as HTMLCanvasElement
                  });
                }

                // 9. 添加课桌点击事件处理（左键入座 / 右键站起）
                const handleDeskClick = (event: MouseEvent) => {
                  if (!canvas || !camera) return;

                  // 只处理左键点击入座逻辑，右键交由上下文菜单事件处理
                  if (event.button !== 0) return;

                  // 如果指针已锁定，直接切换视角（不处理课桌点击，因为无法准确获取鼠标位置）
                  if (document.pointerLockElement === canvas) {
                    if (typeof window.switchCameraPosition === 'function') {
                      window.switchCameraPosition();
                    }
                    return;
                  }

                  // 检查精灵管理器是否已初始化
                  if (!spriteManager || !spriteManager.isInitialized) {
                    // 如果没有初始化，可能是要切换视角
                    if (typeof window.switchCameraPosition === 'function') {
                      window.switchCameraPosition();
                    }
                    return;
                  }

                  // 计算鼠标在标准化设备坐标中的位置 (-1 到 1)
                  const rect = canvas.getBoundingClientRect();
                  const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                  const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

                  mouse.x = mouseX;
                  mouse.y = mouseY;

                  // 设置射线投射器的射线
                  raycaster.setFromCamera(mouse, camera);

                  let clickedDesk = false;

                  // 检测与所有实例化网格的交点
                  for (const instancedMesh of instancedMeshGroups) {
                    const intersects = raycaster.intersectObject(instancedMesh);

                    if (intersects.length > 0) {
                      const intersection = intersects[0];

                      // 检查是否有实例ID
                      if (intersection.instanceId !== undefined) {
                        const instanceId = intersection.instanceId;

                        if (isClassroomOwner.value) {
                          if (message) {
                            message.info(t('classroom.seatConfirm.ownerForbiddenMessage'));
                          }
                          clickedDesk = true;
                          break;
                        }

                        // 从user store获取当前用户信息
                        const userInfo = userStore.userInfo;
                        if (!userInfo || !userInfo.id) {
                          return;
                        }

                        // 检查该座位是否已有学生
                        const existingStudent = studentsList.value.find(student => student.seatIndex === instanceId);
                        if (existingStudent) {
                          if (existingStudent.studentId === userInfo.id) {
                            if (message) {
                              message.info(t('classroom.seatConfirm.selfSeatMessage'));
                            }
                          } else if (message) {
                            message.info(t('classroom.seatConfirm.occupiedMessage'));
                          }
                          clickedDesk = true;
                          break;
                        }

                        // 获取学生信息
                        const studentInfo = userStore.studentInfo;
                        const avatarUrl = (userInfo?.avatar) || (studentInfo?.avatar) || null;
                        const displayName = getIdentityName(studentInfo) || getIdentityName(userInfo) || '您';
                        const row = Math.floor(instanceId / columnCount.value);
                        const column = instanceId % columnCount.value;

                        openSeatConfirmModal({
                          seatIndex: instanceId,
                          seatLabel: formatSeatLabel(row, column),
                          avatarUrl,
                          displayName
                        });

                        clickedDesk = true;
                        // 只处理第一个交点
                        break;
                      }
                    }
                  }
                };

                // 右键站起事件处理
                const handleDeskContextMenu = async (event: MouseEvent) => {
                  if (!canvas || !camera) return;

                  // 禁用默认右键菜单
                  event.preventDefault();

                  // 指针锁定状态下不处理站起逻辑
                  if (document.pointerLockElement === canvas) {
                    return;
                  }

                  const userInfo = userStore.userInfo;
                  if (!userInfo || !userInfo.id) {
                    return;
                  }

                  const recordId = (route.params.courseRecordId as string) || (route.query.recordId as string);
                  if (!recordId) {
                    return;
                  }

                  // 计算鼠标在标准化设备坐标中的位置 (-1 到 1)
                  const rect = canvas.getBoundingClientRect();
                  const mouseX = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                  const mouseY = -((event.clientY - rect.top) / rect.height) * 2 + 1;

                  mouse.x = mouseX;
                  mouse.y = mouseY;

                  raycaster.setFromCamera(mouse, camera);

                  for (const instancedMesh of instancedMeshGroups) {
                    const intersects = raycaster.intersectObject(instancedMesh);

                    if (intersects.length > 0) {
                      const intersection = intersects[0];

                      if (intersection.instanceId !== undefined) {
                        const instanceId = intersection.instanceId;

                        // 查找该座位是否是当前用户
                        const existingStudent = studentsList.value.find(student => student.seatIndex === instanceId);
                        if (!existingStudent || existingStudent.studentId !== userInfo.id) {
                          return;
                        }

                        const doStandUp = async () => {
                          const apiResult = await removeStudentSeat(recordId, userInfo.id);
                          const isSuccess = typeof apiResult === 'boolean'
                              ? apiResult
                              : Boolean(apiResult && (apiResult.success === true || apiResult.code === 200));

                          if (!isSuccess) {
                            return false;
                          }

                          // 前端移除座位信息
                          studentsList.value = studentsList.value.filter(student => student.studentId !== userInfo.id);

                          // 从精灵管理器中移除
                          try {
                            spriteManager.removeUserData(userInfo.id);
                          } catch (e) {
                            // 静默处理
                          }

                          if (message) {
                            message.success(t('classroom.seatConfirm.standUpSuccess'));
                          }

                          return true;
                        };

                        if (dialog) {
                          dialog.warning({
                            title: t('classroom.seatConfirm.standUpTitle'),
                            content: t('classroom.seatConfirm.standUpContent'),
                            positiveText: t('common.confirm'),
                            negativeText: t('common.cancel'),
                            onPositiveClick: async () => {
                              await doStandUp();
                            }
                          });
                        } else {
                          await doStandUp();
                        }

                        return;
                      }
                    }
                  }
                };

                // 添加点击事件监听器
                // 使用 click 事件（按下并抬起一次）来触发视角切换或入座
                if (canvas) {
                  canvas.addEventListener('click', handleDeskClick);
                  canvas.addEventListener('contextmenu', handleDeskContextMenu);

                  if (!window.deskHoverHandlers) {
                    window.deskHoverHandlers = [];
                  }
                  window.deskHoverHandlers.push({
                    clickHandler: handleDeskClick,
                    canvas: canvas
                  });
                }

                resolve();
              } catch (error) {
                // 清理已创建的资源
                if (window.instancedObjects) {
                  window.instancedObjects.forEach(obj => {
                    if (obj && scene) {
                      scene.remove(obj);
                    }
                  });
                  // 清空instancedObjects数组
                  window.instancedObjects = [];
                }
                // 注意：instancedMeshGroups变量只在try块内定义，错误处理中不需要引用
                reject(error);
              }
            },
            undefined,
            (error) => {
              // 确保即使加载失败也清理可能已创建的资源
              if (window.instancedObjects && scene) {
                window.instancedObjects.forEach((obj: InstancedMesh) => {
                  if (obj && scene) {
                    scene.remove(obj);
                  }
                });
                window.instancedObjects = [];
              }
              reject(error);
            }
        );
      });

      await new Promise<void>((resolve) => {
        // 初始化精灵管理器
        const initializeSpriteManager = (texture: Texture) => {
          try {
            spriteManager.initialize(spritePositions.length, texture);
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

        const defaultTexture = createAvatarFallbackTexture('');
        initializeSpriteManager(defaultTexture);
        resolve();
      });
    } catch (error) {
      // 静默处理模型加载失败
    }
  };

  // 启动模型加载
  const showPointerHintOnce = () => {
    if (pointerHintTimeout) {
      clearTimeout(pointerHintTimeout);
    }
    showPointerLockHint.value = true;
    pointerHintTimeout = window.setTimeout(() => {
      showPointerLockHint.value = false;
      pointerHintTimeout = null;
    }, 5000);
  };

  loadModelsSequentially().then(async () => {
    // 模型加载完成后，显示提示信息
    showPointerHintOnce();

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

    // 渲染
    renderer.render(scene, camera);

    // 继续调用 tick 函数
    requestAnimationFrame(tick);
  };

  // 启动动画循环
  tick();
};

onMounted(async () => {
  await fetchCourseRecord();
  initThree();
  transitionStore.hide(1250);
});

onBeforeUnmount(() => {
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

  // 清理Alt键事件监听器和点击事件监听器
  if (window.pointerLockHandlers && Array.isArray(window.pointerLockHandlers)) {
    window.pointerLockHandlers.forEach(({
                                          altKeyDown,
                                          altKeyUp,
                                          onPointerLockError,
                                          canvasClick,
                                          mouseMove,
                                          contextMenu,
                                          canvas: handlerCanvas
                                        }) => {
      if (altKeyDown) {
        document.removeEventListener('keydown', altKeyDown, true);
      }
      if (altKeyUp) {
        document.removeEventListener('keyup', altKeyUp, true);
      }
      if (onPointerLockError) {
        document.removeEventListener('pointerlockerror', onPointerLockError);
      }
      if (canvasClick && handlerCanvas) {
        handlerCanvas.removeEventListener('click', canvasClick);
      }
      if (mouseMove && handlerCanvas) {
        handlerCanvas.removeEventListener('mousemove', mouseMove);
      }
      if (contextMenu && handlerCanvas) {
        handlerCanvas.removeEventListener('contextmenu', contextMenu);
      }
    });
    window.pointerLockHandlers = [];
  }

  // 清理课桌悬浮和点击事件监听器
  if (window.deskHoverHandlers && Array.isArray(window.deskHoverHandlers)) {
    window.deskHoverHandlers.forEach(({hoverHandler, leaveHandler, clickHandler, canvas: handlerCanvas}) => {
      if (handlerCanvas && hoverHandler) {
        handlerCanvas.removeEventListener('mousemove', hoverHandler);
        handlerCanvas.style.cursor = 'default';
      }
      if (handlerCanvas && leaveHandler) {
        handlerCanvas.removeEventListener('mouseleave', leaveHandler);
      }
      if (handlerCanvas && clickHandler) {
        handlerCanvas.removeEventListener('click', clickHandler);
      }
    });
    window.deskHoverHandlers = [];
  }

  // 清理点击处理器资源
  modelClickHandler.dispose();

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

.exit-button {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1001;
}

.live-button {
  position: fixed;
  top: 20px;
  right: 140px;
  z-index: 1001;
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

  .exit-button {
    top: 1rem;
    right: 1rem;
  }

  .live-button {
    top: 1rem;
    right: 7rem;
  }
}

@media (max-width: 480px) {
  .exit-button {
    top: 0.75rem;
    right: 0.75rem;
  }

  .live-button {
    top: 0.75rem;
    right: 6rem;
  }
}
</style>