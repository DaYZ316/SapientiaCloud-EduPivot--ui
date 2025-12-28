<template>
  <div class="classroom-3d-container">
    <canvas ref="canvasRef" class="webgl_7"></canvas>
    <ClassroomToolbox :items="toolboxItems"/>
    <ChapterPanel :course-id="route.params.courseId as string || null" :show="showChapterPanel ?? false"
                  @close="closeChapterPanel"/>
    <QuestionPanel :classroom-id="route.params.courseRecordId as string || null" :course-id="route.params.courseId as string || null"
                   :show="showQuestionPanel ?? false" @close="closeQuestionPanel"/>
    <PracticePanel
        :classroom-id="route.params.courseRecordId as string || null"
        :show="showPracticePanel ?? false"
        @close="closePracticePanel"
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
import {computed, onBeforeUnmount, onMounted, ref} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useI18n} from 'vue-i18n';
import type {InstancedMesh, PerspectiveCamera, Scene, Texture, WebGLRenderer} from 'three';
import * as THREE from 'three';
import type {GLTF} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import {PointerLockControls} from 'three/examples/jsm/controls/PointerLockControls.js';
import {ModelClickHandler} from '@/utils/threeModelClickHandler';
import {Sky} from 'three/examples/jsm/objects/Sky.js';
import {getCourseRecordById} from '@/api/classroom/courseRecord';
import {
  listStudentsByRecordId
} from '@/api/classroom/courseRecordStudent';
import StudentInfoPopup from './StudentInfoPopup.vue';
import ClassroomToolbox from './components/ClassroomToolbox.vue';
import QuestionPanel from './components/QuestionPanel.vue';
import ChapterPanel from './components/ChapterPanel.vue';
import PracticePanel from './components/PracticePanel.vue';
import {useUserStore} from '@/store/modules/user';
// 全局 NaiveUI API（仅在需要时按需使用）
import {SpriteManager} from '@/views/classroom/composables/spriteManager';
import {getAvatarColor, getAvatarInitial} from '@/utils/avatarUtil';
import type {CourseRecordStudentVO, CourseRecordVO} from '@/types/classroom';
import type {ClassroomToolboxItem} from '@/views/classroom/composables/toolbox';
// SeatStatusEnum: 若后续启用座位状态相关逻辑，请按需导入
// SeatAssignmentContext 类型在当前文件中未直接使用，按需拆分到类型目录
import {useTransitionStore} from '@/store/modules/transition';
import {runViewTransition} from '@/utils/themeAnimation';
import {
  classroomXLenghtRef,
  classroomYLenghtRef,
  classroomZLenghtRef,
  computeCameraPositionsBySize,
  type ClassroomCameraPositions
} from '@/views/classroom/composables/useCameraGroup';
import {
  getClassroomModelPathByRecord,
  getDeskModelPathByRecord,
} from '@/views/classroom/composables/useModelRouter';
import {useSeatLayout} from '@/views/classroom/composables/useSeatLayout';
import {ModelInstanceManager} from '@/views/classroom/composables/ModelInstanceManager';
import {
  BookOutline,
  CreateOutline,
  HelpCircleOutline,
  LogOutOutline,
  SchoolOutline,
  VideocamOutline
} from '@vicons/ionicons5';

const {t} = useI18n();
const modelClickHandler = new ModelClickHandler();
const route = useRoute();
const router = useRouter();
const userStore = useUserStore();
const transitionStore = useTransitionStore();
// 全局消息/对话框 APIs 如需使用可在调用处按需导入
// 课程记录状态
const courseRecord = ref<CourseRecordVO | null>(null);
const loadingRecord = ref(false);
const recordError = ref<string | null>(null);
// 教室归属判断（暂不使用，保留逻辑以备后续启用）

// 座位排布（仅小型 / 中型教室启用），仅保留当前使用的字段
const {
  instanceCount,
  calculateSeatPosition,
  fillSpritePositions
} = useSeatLayout(courseRecord);


// 学生信息框相关状态
const showStudentInfo = ref(false);
const currentStudent = ref<CourseRecordStudentVO | null>(null);
const currentSeatIndex = ref<number | null>(null);
const popupPosition = ref({x: 0, y: 0});
const studentsList = ref<CourseRecordStudentVO[]>([]);
// 座位分配上下文相关状态在当前实现中未启用
const showPointerLockHint = ref(false);
let pointerHintTimeout: number | null = null;
const showChapterPanel = ref<boolean | null>(null);
const showQuestionPanel = ref<boolean | null>(null);
const showPracticePanel = ref<boolean | null>(null);
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

// fallback 纹理的创建与释放逻辑如需保留，请拆分到精灵管理模块

// 座位确认状态重置逻辑已内联或随座位流程合并，如需保留请拆分到独立模块

// 座位确认与提交逻辑已内联或由其他交互流程处理，独立的 confirmSeatSelection 函数在当前构建中未启用

// 座位标签格式化与座位确认弹窗逻辑已合并到主流程中，相关独立函数暂不启用


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

const toolboxItems = computed<ClassroomToolboxItem[]>(() => {
  const items: ClassroomToolboxItem[] = [
    {
      key: 'chapters',
      label: '章节',
      labelKey: 'classroom.chapters',
      icon: BookOutline,
      handler: handleChapterButton
    }
  ];

  items.push({
    key: 'class-practice',
    label: '课堂练习',
    labelKey: 'classroom.classPractice',
    icon: SchoolOutline,
    handler: handlePracticeButton
  });

  if (canShowPracticeActions.value) {
    items.push(
        {
          key: 'publish-practice',
          label: '发布练习',
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

  return items;
});

let canvas: HTMLCanvasElement | null = null;
let renderer: WebGLRenderer | null = null;
let scene: Scene | null = null;
let camera: PerspectiveCamera | null = null;
let controls: PointerLockControls | null = null;
let classroomModel: THREE.Group | null = null;
let loader: GLTFLoader | null = null;
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
      classroomZLenghtRef.value
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
      canvas.addEventListener('wheel', handleWheel, { passive: false });
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

        // 兼容 dev/prod 路径：使用 getClassroomModelPathByRecord 返回的路径，并设置 loader 的 base path，
        // 这样 glTF 内部引用的纹理可以正确按相对路径加载，避免首次 404 问题
        const classroomModelUrl = getClassroomModelPathByRecord(courseRecord.value);
        const classroomFileName = classroomModelUrl.substring(classroomModelUrl.lastIndexOf('/') + 1);
        const classroomDir = classroomModelUrl.substring(0, classroomModelUrl.lastIndexOf('/') + 1);
        // 为当前 loader 设置基础路径（loader.load 只传文件名）
        try {
          loader.setPath(classroomDir);
        } catch (e) {
          // 某些环境下 setPath 可能不可用，降级为直接使用完整路径
        }

        loader.load(
            classroomFileName,
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
                  classroomZLenghtRef.value
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

        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        // 同上：先设置 base path 再加载文件名，确保 gltf 引用的纹理路径正确解析
        const deskModelUrl = getDeskModelPathByRecord(courseRecord.value);
        const deskFileName = deskModelUrl.substring(deskModelUrl.lastIndexOf('/') + 1);
        const deskDir = deskModelUrl.substring(0, deskModelUrl.lastIndexOf('/') + 1);
        try {
          loader.setPath(deskDir);
        } catch (e) {
          // ignore
        }
        loader.load(
            deskFileName,
            (gltf: GLTF) => {
              try {
                const modelInstanceManager = new ModelInstanceManager();

                // 1. 识别模型结构并保存子组件和网格信息
                const subComponents = modelInstanceManager.identifyModelStructure(gltf.scene);

                // 计算总网格数量
                const totalMeshCount = subComponents.reduce((sum, component) => sum + component.meshes.length, 0);
                if (totalMeshCount === 0) {
                  throw new Error('未在桌椅模型中找到任何网格对象');
                }

                // 2. 智能计算安全的实例数量
                const hardwareLimit = 65536; // WebGL 1.0 限制
                const maxAllowedInstances = Math.min(instanceCount.value, 1000, hardwareLimit);

                // 3. 创建整体模型的实例化网格集合
                const instancedMeshGroups = modelInstanceManager.createGroupedInstancedMeshes(subComponents, maxAllowedInstances);

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
                modelInstanceManager.setInstanceMatricesAsGroup(instancedMeshGroups, 0, maxAllowedInstances, calculatePosition);

                // 5. 批量存储精灵位置 - 优化内存分配
                fillSpritePositions(
                    spritePositions,
                    maxAllowedInstances,
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

                // 8. 悬浮事件
                let isCursorPointer = false;
                const handleDeskHover = (event: MouseEvent) => {
                  if (!canvas || !camera) return;
                  if (document.pointerLockElement === canvas) {
                    return;
                  }

                  const rect = canvas.getBoundingClientRect();
                  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

                  raycaster.setFromCamera(mouse, camera);

                  let foundDesk = false;
                  for (const instancedMesh of instancedMeshGroups) {
                    const intersects = raycaster.intersectObject(instancedMesh);
                    if (intersects.length > 0) {
                      foundDesk = true;
                      break;
                    }
                  }

                  if (foundDesk && !isCursorPointer) {
                    canvas!.style.cursor = 'pointer';
                    isCursorPointer = true;
                  } else if (!foundDesk && isCursorPointer) {
                    canvas!.style.cursor = 'default';
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

                // 9. 点击 / 右键事件逻辑保持不变（沿用原来的 handleDeskClick 和 handleDeskContextMenu 代码块）
                // 这里为了保持简洁，继续使用原有实现（已在前面存在），不再拆分为单独函数

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
  initThree();
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