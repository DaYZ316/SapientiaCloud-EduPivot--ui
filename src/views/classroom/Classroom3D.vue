<template>
  <div class="classroom-3d-container">
  <canvas ref="canvasRef" class="webgl_7"></canvas>
    <!-- 退出教室按钮 -->
    <n-button 
      @click="handleExit"
      class="exit-button"
      type="default"
      size="medium"
    >
      {{ t('classroom.exit') }}
    </n-button>
    <!-- 智慧课堂黑白按钮 -->
    <n-button 
      @click="handleLive"
      class="live-button"
      type="default"
      size="medium"
    >
      {{ t('classroom.live') }}
    </n-button>
    <!-- 学生信息框 -->
    <StudentInfoPopup
      :show="showStudentInfo"
      :student="currentStudent"
      :seat-index="currentSeatIndex"
      :position="popupPosition"
    />
  </div>
</template>
  
<script setup lang="ts">
  import { onMounted, onBeforeUnmount, ref, computed } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { useI18n } from 'vue-i18n';
  import * as THREE from 'three';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
  import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
  import { ModelClickHandler } from '@/utils/threeModelClickHandler';
  import { Sky } from 'three/examples/jsm/objects/Sky.js';
  import { getCourseRecordById } from '@/api/classroom/courseRecord';
  import { listStudentsByRecordId } from '@/api/classroom/courseRecordStudent';
  import StudentInfoPopup from './StudentInfoPopup.vue';
  import { useUserStore } from '@/store/modules/user';
  import { getGlobalApis } from '@/utils/naiveUIHelper';
  import { SpriteManager } from '@/views/classroom/composables/spriteManager';
  import type { CourseRecordVO, CourseRecordStudentVO } from '@/types/classroom';
  import type { SeatAssignmentContext } from '@/types/components/seatConfirmModal';
  import type { Texture, PerspectiveCamera, Scene, WebGLRenderer } from 'three';
  import type { InstancedMesh } from 'three';
  import type { GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';

  const { t } = useI18n();
  const modelClickHandler = new ModelClickHandler();
  const route = useRoute();
  const router = useRouter();
  const userStore = useUserStore();
  const { dialog } = getGlobalApis();
  // 课程记录状态
  const courseRecord = ref<CourseRecordVO | null>(null);
  const loadingRecord = ref(false);
  const recordError = ref<string | null>(null);
  
  // 学生信息框相关状态
  const showStudentInfo = ref(false);
  const currentStudent = ref<CourseRecordStudentVO | null>(null);
  const currentSeatIndex = ref<number | null>(null);
  const popupPosition = ref({ x: 0, y: 0 });
  const studentsList = ref<CourseRecordStudentVO[]>([]);
  const pendingSeatContext = ref<SeatAssignmentContext | null>(null);
  const fallbackTextureRef = ref<Texture | null>(null);

  const spriteManager = new SpriteManager();

  const avatarColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
    '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA',
    '#F1948A', '#D7BDE2'
  ];

  const getAvatarColor = (text: string): string => {
    if (!text) {
      return '#000000';
    }
    let hash = 0;
    for (let i = 0; i < text.length; i += 1) {
      hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }
    return avatarColors[Math.abs(hash) % avatarColors.length];
  };

  const resolveDisplayName = (info: any): string => {
    if (!info) {
      return '';
    }
    return info.studentRealName
      || info.teacherRealName
      || info.nickName
      || info.username
      || info.realName
      || info.name
      || '';
  };

  const createAvatarFallbackTexture = (displayName: string): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    const initials = displayName ? displayName.charAt(0).toUpperCase() : '';
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

  const confirmSeatSelection = () => {
    if (!pendingSeatContext.value || pendingSeatContext.value.seatIndex === null) {
      resetSeatConfirmState();
      return;
    }
    if (!spriteManager || !spriteManager.isInitialized) {
      resetSeatConfirmState();
      return;
    }
    const userInfo = userStore.userInfo;
    if (!userInfo || !userInfo.id) {
      resetSeatConfirmState();
      return;
    }
    const seatIndex = pendingSeatContext.value.seatIndex;
    const avatarUrl = pendingSeatContext.value.avatarUrl;
    const fallbackTexture = fallbackTextureRef.value || createAvatarFallbackTexture(pendingSeatContext.value.displayName || '');

    const applyTextureToSprite = (texture: Texture, shouldDisposeFallback = true) => {
      if (!texture) {
        resetSeatConfirmState();
        return;
      }
      spriteManager.updateSpriteInfo(userInfo.id, texture, seatIndex);
      resetSeatConfirmState(shouldDisposeFallback);
    };

    if (!avatarUrl || avatarUrl.trim() === '') {
      applyTextureToSprite(fallbackTexture, false);
      return;
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
  };

  const formatSeatLabel = (rowIndex: number, columnIndex: number): string => {
    return t('classroom.formatSeatLabel', { row: rowIndex + 1, column: columnIndex + 1 });
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
      ? t('classroom.seatConfirm.titleWithSeat', { seatLabel: context.seatLabel })
      : t('classroom.seatConfirm.title');
    const seatSubtitle = context.displayName
      ? t('classroom.seatConfirm.subtitleWithStudent', { studentName: context.displayName })
      : t('classroom.seatConfirm.subtitle');
    
    if (dialog) {
      dialog.warning({
        title: seatTitle,
        content: seatSubtitle,
        positiveText: t('classroom.seatConfirm.confirm'),
        negativeText: t('classroom.seatConfirm.cancel'),
        onPositiveClick: () => {
          confirmSeatSelection();
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
      const recordId = route.query.recordId;
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
  
  // 获取学生列表
  const fetchStudentsList = async (recordId: string) => {
    try {
      const response = await listStudentsByRecordId(recordId);
      studentsList.value = response?.data || [];
    } catch (error) {
      studentsList.value = [];
    }
  };
  
  // 显示学生信息框
  const showStudentInfoPopup = (event: MouseEvent, seatIndex: number) => {
    // 查找对应座位的学生
    const student = studentsList.value.find(s => s.seatIndex === seatIndex);
    
    // 设置信息框位置在鼠标右侧
    popupPosition.value = {
      x: event.clientX + 15,
      y: event.clientY
    };
    
    if (student) {
      currentStudent.value = student;
      currentSeatIndex.value = seatIndex;
    } else {
      // 如果没有学生，显示空座位信息
      currentStudent.value = null;
      currentSeatIndex.value = seatIndex;
    }
    
    showStudentInfo.value = true;
  };
  
  // 隐藏学生信息框
  const hideStudentInfoPopup = () => {
    showStudentInfo.value = false;
    currentStudent.value = null;
    currentSeatIndex.value = null;
  };

  // 退出教室
  const handleExit = () => {
    const courseId = route.params.courseId as string;
    if (courseId) {
      router.push(`/course/detail/${courseId}/classroom`);
    } else {
      router.back();
    }
  };

  // 跳转到直播页面
  const handleLive = () => {
    const courseId = route.params.courseId as string;
    const courseRecordId = route.params.courseRecordId as string;
    if (courseId && courseRecordId) {
      router.push({
        name: 'Live',
        params: {
          courseId,
          courseRecordId
        }
      });
    } else {
      router.push({ name: 'Live' });
    }
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
  let wheelTimeout: ReturnType<typeof setTimeout> | null = null;
  let handleMouseWheel: ((event: WheelEvent) => void) | null = null;
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
     // 相机位置配置对象（组件级别变量）
    window.cameraPositions = {
      front: { 
        position: { x: -9, y: 4.5, z: 0 },
        initialRotation: new THREE.Euler(0, Math.PI * 3 / 2, 0) // 初始朝向
      },
      rightRear: { 
        position: { x: 9, y: 4.5, z: -6.5 },
        initialRotation: new THREE.Euler(0, Math.PI * 3 / 4, 0), // 初始朝向
      },
      leftRear: { 
        position: { x: 9, y: 4.5, z: 6.5 },
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
    window.switchCameraPosition = function() {
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
      
      // 如果指针已锁定，解锁以重置控制器状态
      if (window.controls && canvas && document.pointerLockElement === canvas) {
        document.exitPointerLock();
      }
    }
    
    // 添加鼠标双击事件以启用指针锁定
    if (canvas && controls) {
      canvas.addEventListener('dblclick', () => {
        // 直接调用lock()方法，它不返回Promise
        controls?.lock();
      });
      
      // 添加指针锁定错误处理
      const onPointerLockError = () => {
        // 静默处理指针锁定错误
      };
      
      // 绑定指针锁定错误事件到document
      document.addEventListener('pointerlockerror', onPointerLockError);
      
      // 监听指针锁定状态变化
      controls.addEventListener('lock', () => {
      });
      
      controls.addEventListener('unlock', () => {
      });
    }

    // 渲染器
    if (canvas) {
      renderer = new THREE.WebGLRenderer({ canvas });
      renderer.setSize(window.innerWidth, window.innerHeight);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    }

    /**
     * 背景天空部分
     */
    const sky = new Sky();
    sky.scale.setScalar( 450000 );
    scene.add( sky );

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
      uniforms[ 'turbidity' ].value = effectController.turbidity;
      uniforms[ 'rayleigh' ].value = effectController.rayleigh;
      uniforms[ 'mieCoefficient' ].value = effectController.mieCoefficient;
      uniforms[ 'mieDirectionalG' ].value = effectController.mieDirectionalG;

      const phi = THREE.MathUtils.degToRad( 90 - effectController.elevation );
      const theta = THREE.MathUtils.degToRad( effectController.azimuth );

      sun.setFromSphericalCoords( 1, phi, theta );

      uniforms[ 'sunPosition' ].value.copy( sun );

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
                    identifyModelStructure: function(object: THREE.Object3D) {
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
                    collectMeshesInComponent: function(
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
                    createGroupedInstancedMeshes: function(
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
                    setInstanceMatricesAsGroup: function(
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
                    disposeResources: function(instancedMeshGroups: InstancedMesh[]) {
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
                    position.x = 2 * Math.floor(instanceId / columnCount.value) - classroomXLenght/2 + 6;
                    position.y = 0.0;
                    position.z = classroomZLenght/2 - classroomZLenght / columnCount.value * (0.5 + instanceId % columnCount.value);
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
                    spritePositions[i].set(tempPosition.x + 0.5, tempPosition.y + 2.0, tempPosition.z);
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
                  
                  // 8. 添加课桌悬浮事件处理
                  const raycaster = new THREE.Raycaster();
                  const mouse = new THREE.Vector2();
                  let currentHoveredDeskId: number | null = null; // 当前悬停的课桌ID
                  const originalMatrices = new Map<number, THREE.Matrix4>(); // 存储原始矩阵
                  const hoverScale = 1.1; // 悬浮时的放大倍数
                  let isCursorPointer = false; // 跟踪当前鼠标样式状态
                  
                  // 辅助函数：更新实例的缩放（保持子组件相对位置）
                  const updateInstanceScale = (instanceId: number, scale: number) => {
                    // 获取原始矩阵以提取整体模型位置
                    let originalMatrix = originalMatrices.get(instanceId);
                    if (!originalMatrix) {
                      // 如果没有存储原始矩阵，从第一个实例化网格获取
                      if (instancedMeshGroups.length > 0) {
                        const tempMatrix = new THREE.Matrix4();
                        instancedMeshGroups[0].getMatrixAt(instanceId, tempMatrix);
                        originalMatrices.set(instanceId, tempMatrix.clone());
                        originalMatrix = originalMatrices.get(instanceId);
                      } else {
                        return;
                      }
                    }
                    
                    // 重用矩阵和向量对象以减少GC压力
                    const matrix = new THREE.Matrix4();
                    const groupMatrix = new THREE.Matrix4();
                    const componentMatrix = new THREE.Matrix4();
                    const globalPosition = new THREE.Vector3();
                    const localPosition = new THREE.Vector3();
                    const quaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0));
                    const groupQuaternion = new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0));
                    const scaleVec = new THREE.Vector3(scale, scale, scale);
                    
                    // 从原始矩阵中提取整体模型的位置（不包含缩放）
                    // 通过计算位置回调函数来获取原始位置
                    calculatePosition(instanceId, globalPosition);
                    
                    // 计算整体模型的变换矩阵（包含缩放）
                    groupMatrix.compose(globalPosition, groupQuaternion, scaleVec);
                    
                        // 对每个子组件的网格应用相同的整体变换，但保持相对位置
                        instancedMeshGroups.forEach((instancedMesh: InstancedMesh) => {
                      // 计算子组件相对于整体模型的变换矩阵（从userData获取）
                      componentMatrix.compose(
                        instancedMesh.userData.componentPosition,
                        instancedMesh.userData.componentQuaternion,
                        instancedMesh.userData.componentScale
                      );
                      
                      // 应用整体模型变换（包含缩放）到组件位置
                      componentMatrix.premultiply(groupMatrix);
                      
                      // 使用网格相对于组件的原始位置（从userData获取）
                      localPosition.copy(instancedMesh.userData.meshPosition);
                      
                      // 应用组件变换到网格位置（保持子组件相对位置）
                      localPosition.applyMatrix4(componentMatrix);
                      
                      // 设置实例矩阵（缩放已在groupMatrix中应用，这里使用单位缩放）
                      const finalScale = new THREE.Vector3(1, 1, 1);
                      matrix.compose(localPosition, quaternion, finalScale);
                      instancedMesh.setMatrixAt(instanceId, matrix);
                      instancedMesh.instanceMatrix.needsUpdate = true;
                    });
                  };
                  
                  const handleDeskHover = (event: MouseEvent) => {
                    if (!canvas || !camera) return;
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
                        const intersection = intersects[0];
                        
                        // 检查是否有实例ID（InstancedMesh的intersection会有instanceId）
                        if (intersection.instanceId !== undefined) {
                          const instanceId = intersection.instanceId;
                          
                          // 如果悬停的是同一个课桌，不需要重复处理
                          if (currentHoveredDeskId === instanceId) {
                            // 确保鼠标样式为pointer
                            if (!isCursorPointer) {
                              canvas.style.cursor = 'pointer';
                              isCursorPointer = true;
                            }
                            foundDesk = true;
                            break;
                          }
                          
                          // 如果之前有悬停的课桌，恢复其原始大小
                          if (currentHoveredDeskId !== null && currentHoveredDeskId !== instanceId) {
                            updateInstanceScale(currentHoveredDeskId, 1.0);
                          }
                          
                          // 更新当前悬停的课桌ID
                          currentHoveredDeskId = instanceId;
                          
                          // 放大当前悬停的课桌
                          updateInstanceScale(instanceId, hoverScale);
                          
                          // 计算课桌位置
                          const deskPosition = new THREE.Vector3();
                          calculatePosition(instanceId, deskPosition);
                          
                          // 显示学生信息框
                          showStudentInfoPopup(event, instanceId);
                          
                          // 改变鼠标样式为pointer
                          if (!isCursorPointer) {
                            canvas.style.cursor = 'pointer';
                            isCursorPointer = true;
                          }
                          
                          foundDesk = true;
                          // 只处理第一个交点，避免重复触发
                          break;
                        }
                      }
                    }
                    
                    // 如果鼠标没有悬停在任何课桌上，恢复之前悬停的课桌大小并隐藏信息框
                    if (!foundDesk) {
                      if (currentHoveredDeskId !== null) {
                        updateInstanceScale(currentHoveredDeskId, 1.0);
                        currentHoveredDeskId = null;
                        hideStudentInfoPopup();
                      }
                      // 恢复鼠标样式为默认
                      if (isCursorPointer) {
                        canvas.style.cursor = 'default';
                        isCursorPointer = false;
                      }
                    }
                  };
                  
                  // 添加鼠标移动事件监听器
                  if (canvas) {
                    canvas.addEventListener('mousemove', handleDeskHover);
                  }
                  
                  // 添加鼠标离开画布事件，隐藏信息框并恢复课桌大小
                  const handleMouseLeave = () => {
                    if (currentHoveredDeskId !== null) {
                      updateInstanceScale(currentHoveredDeskId, 1.0);
                      currentHoveredDeskId = null;
                    }
                    hideStudentInfoPopup();
                    // 恢复鼠标样式为默认
                    if (isCursorPointer && canvas) {
                      canvas.style.cursor = 'default';
                      isCursorPointer = false;
                    }
                  };
                  if (canvas) {
                    canvas.addEventListener('mouseleave', handleMouseLeave);
                  }
                  
                  // 9. 添加课桌点击事件处理
                  const handleDeskClick = (event: MouseEvent) => {
                    if (!canvas || !camera) return;
                    // 检查精灵管理器是否已初始化
                    if (!spriteManager || !spriteManager.isInitialized) {
                      return;
                    }
                    
                    // 计算鼠标在标准化设备坐标中的位置 (-1 到 1)
                    const rect = canvas.getBoundingClientRect();
                    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
                    
                    // 设置射线投射器的射线
                    raycaster.setFromCamera(mouse, camera);
                    
                    // 检测与所有实例化网格的交点
                    for (const instancedMesh of instancedMeshGroups) {
                      const intersects = raycaster.intersectObject(instancedMesh);
                      
                      if (intersects.length > 0) {
                        const intersection = intersects[0];
                        
                        // 检查是否有实例ID
                        if (intersection.instanceId !== undefined) {
                          const instanceId = intersection.instanceId;
                          
                          // 从user store获取当前用户信息
                          const userInfo = userStore.userInfo;
                          if (!userInfo || !userInfo.id) {
                            return;
                          }
                          
                          // 获取学生信息
                          const studentInfo = userStore.studentInfo;
                          const avatarUrl = (userInfo?.avatar) || (studentInfo?.avatar) || null;
                          const displayName = resolveDisplayName(studentInfo) || resolveDisplayName(userInfo) || '您';
                          const row = Math.floor(instanceId / columnCount.value);
                          const column = instanceId % columnCount.value;

                          openSeatConfirmModal({
                            seatIndex: instanceId,
                            seatLabel: formatSeatLabel(row, column),
                            avatarUrl,
                            displayName
                          });
                          
                          // 只处理第一个交点
                          break;
                        }
                      }
                    }
                  };
                  
                  // 添加点击事件监听器
                  if (canvas) {
                    canvas.addEventListener('click', handleDeskClick);
                  }
                  
                  // 存储事件处理函数引用，以便后续清理
                  if (!window.deskHoverHandlers) {
                    window.deskHoverHandlers = [];
                  }
                  if (canvas) {
                    window.deskHoverHandlers.push({
                      handler: handleDeskHover,
                      leaveHandler: handleMouseLeave,
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
              
              // 加载用户纹理（示例代码，实际使用时会在用户加入时触发）
              const userTextureLoader = new THREE.TextureLoader();
              userTextureLoader.load(
                '/src/assets/image/zhuanruzijin.png',
                (userTexture: Texture) => {
                  // 纹理加载成功，更新精灵信息
                  try {
                    spriteManager.updateSpriteInfo('student_1', userTexture, 0);
                  } catch {
                    // 静默处理错误
                  }
                },
                undefined,
                () => {
                  // 加载失败，使用默认纹理
                  try {
                    if (spriteManager.defaultTexture) {
                      spriteManager.updateSpriteInfo('student_1', spriteManager.defaultTexture, 0);
                    }
                  } catch {
                    // 静默处理错误
                  }
                }
              );
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
    loadModelsSequentially()


    
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
    
    /**
     * 鼠标滚轮事件监听
     */
    const WHEEL_DEBOUNCE_DELAY = 500; // 防抖延迟时间（毫秒）
    
    handleMouseWheel = (event: WheelEvent) => {
      // 阻止默认滚动行为
      event.preventDefault();
      
      // 防抖处理，避免快速滚动时频繁切换
      if (wheelTimeout) {
        clearTimeout(wheelTimeout);
      }
      
      wheelTimeout = setTimeout(() => {
        try {
          // 切换相机位置
          if (typeof window.switchCameraPosition === 'function') {
            window.switchCameraPosition();
          }
        } catch {
          // 静默处理相机切换失败
        }
      }, WHEEL_DEBOUNCE_DELAY);
    };
    
    // 添加鼠标滚轮事件监听器到画布元素
    if (canvas) {
      canvas.addEventListener('wheel', handleMouseWheel);
    }

  
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
    // 先获取课程记录
    await fetchCourseRecord();
    // 然后初始化Three.js场景
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
  
    // 清理鼠标滚轮事件监听器
    if (canvas && handleMouseWheel) {
      canvas.removeEventListener('wheel', handleMouseWheel);
    }
  
    // 清理滚轮防抖定时器
    if (wheelTimeout) {
      clearTimeout(wheelTimeout);
      wheelTimeout = null;
    }
  
    // 清理课桌悬浮和点击事件监听器
    if (window.deskHoverHandlers && Array.isArray(window.deskHoverHandlers)) {
      window.deskHoverHandlers.forEach(({ handler, leaveHandler, clickHandler, canvas: handlerCanvas }) => {
        if (handlerCanvas && handler) {
          handlerCanvas.removeEventListener('mousemove', handler);
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