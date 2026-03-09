/**
 * 教室交互管理 Composable
 *
 * 负责处理教室内的所有射线交互逻辑，包括：
 * - 模型点击检测（黑板等）
 * - 座位悬浮检测和信息显示
 * - 座位点击入座
 * - 座位右键退座
 */

import {ref, computed, markRaw, shallowRef, type ComputedRef} from 'vue';
import * as THREE from 'three';
import {ModelClickHandler} from '@/utils/threeModelClickHandler';
import type {InstancedMesh} from 'three';
import {ClassroomTypeEnum} from '@/enum/classroom/classroomTypeEnum';

export interface ClassroomInteractionOptions {
  canvas: HTMLCanvasElement;
  camera: THREE.Camera;
  scene: THREE.Scene;
  classroomModel?: THREE.Group;
  instancedMeshGroups: InstancedMesh[];
  classroomType?: ClassroomTypeEnum | null;
  classroomXLength?: number | null;
  classroomZLength?: number | null;
  // actual seat columns (total seat columns in classroom), used to map labels like A1 -> index for EXTRA_LARGE
  seatColumns?: number | null;
  onSeatHover?: (seatIndex: number | null, event: MouseEvent) => void;
  onSeatClick?: (seatIndex: number) => void;
  onSeatContextMenu?: (seatIndex: number) => void;
}

export interface ClassroomInteractionResult {
  // 鼠标悬浮状态
  isCursorPointer: ComputedRef<boolean>;

  // 高亮边框相关
  highlightBorder: ComputedRef<THREE.LineSegments | null>;

  // 初始化交互
  initInteractions: (options: ClassroomInteractionOptions) => void;

  // 清理资源
  dispose: () => void;
}

export const useClassroomInteraction = (): ClassroomInteractionResult => {
  // 状态管理
  const isCursorPointer = ref(false);
  const highlightBorder = shallowRef<THREE.LineSegments | null>(null);

  // 射线投射器和鼠标向量
  let raycaster: THREE.Raycaster;
  let mouse: THREE.Vector2;

  // 事件处理器引用
  let deskHoverHandler: ((event: MouseEvent) => void) | null = null;
  let deskClickHandler: ((event: MouseEvent) => void) | null = null;
  let deskContextMenuHandler: ((event: MouseEvent) => void) | null = null;

  // 回调函数
  let onSeatHoverCallback: ((seatIndex: number | null, event: MouseEvent) => void) | undefined;
  let onSeatClickCallback: ((seatIndex: number) => void) | undefined;
  let onSeatContextMenuCallback: ((seatIndex: number) => void) | undefined;

  // 全局引用
  let canvasRef: HTMLCanvasElement | null = null;
  let cameraRef: THREE.Camera | null = null;
  let sceneRef: THREE.Scene | null = null;
  let instancedMeshGroupsRef: InstancedMesh[] = [];
  let classroomTypeRef: ClassroomTypeEnum | null = null;
  let classroomXLengthRef: number | null = null;
  let classroomZLengthRef: number | null = null;

  // 高亮状态跟踪
  let lastHighlightedSeatIndex: number | null = null;
  // 调试开关：在场景中渲染每个子座位的 world-space box（线框）
  let debugShowSeatBoxes = true;
  const debugSeatWireframes: THREE.LineSegments[] = [];

  /**
   * 初始化射线投射器
   */
  const initRaycaster = () => {
    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
  };

  /**
   * 检测鼠标位置下的座位
   */
  const detectSeatAtMouse = (event: MouseEvent): number | null => {
    if (!canvasRef || !cameraRef || !instancedMeshGroupsRef.length) {
      return null;
    }

    const rect = canvasRef.getBoundingClientRect();
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

    raycaster.setFromCamera(mouse, cameraRef);

    for (let meshIndex = 0; meshIndex < instancedMeshGroupsRef.length; meshIndex++) {
      const instancedMesh = instancedMeshGroupsRef[meshIndex];
      const intersects = raycaster.intersectObject(instancedMesh);

      if (intersects.length > 0) {
        const intersection = intersects[0];
        const instanceId = intersection.instanceId;

        if (instanceId !== undefined) {
          if (classroomTypeRef === ClassroomTypeEnum.LARGE) {
            // 大型教室：一个模型对应四个座位，需要根据交点位置确定具体座位
            const seatsPerModel = 4;
            const modelIndex = instanceId; // instanceId就是模型索引

            // 获取模型的世界变换矩阵
            const modelMatrix = new THREE.Matrix4();
            instancedMesh.getMatrixAt(modelIndex, modelMatrix);
            modelMatrix.multiply(instancedMesh.matrixWorld);

            // 将交点从世界坐标转换到模型本地坐标（保留用于后续参考）
            const localPoint = intersection.point.clone();
            localPoint.applyMatrix4(new THREE.Matrix4().copy(modelMatrix).invert());

            // 获取模型的边界框（若无则计算）
            if (!instancedMesh.geometry.boundingBox) {
              instancedMesh.geometry.computeBoundingBox();
            }

            if (instancedMesh.geometry.boundingBox) {
              // 直接在世界空间对每个子座位的 box 进行精确射线相交检测，避免阈值偏移
              const geomBox = instancedMesh.geometry.boundingBox.clone(); // 本地坐标下的包围盒
              // 使用 Z 轴（模型深度）来左右并排分布座位
              const geomCenterZ = (geomBox.max.z + geomBox.min.z) / 2;
              const modelDepth = geomBox.max.z - geomBox.min.z;

              const seatSpacing = modelDepth / (seatsPerModel + 1);
              const seatDepth = modelDepth / seatsPerModel;
              const leftOffset = -modelDepth / 2;

              const tmpHit = new THREE.Vector3();
              let closestDist = Number.POSITIVE_INFINITY;
              let chosenSeat: number | null = null;

              // 遍历每个子座位，构建其在本地坐标系下的 Box（沿 Z 轴分割），然后变换到世界坐标系再检测射线相交
              for (let si = 0; si < seatsPerModel; si++) {
                const seatCenterLocalZ = geomCenterZ + leftOffset + seatSpacing * (si + 1);
                const halfDepth = seatDepth / 2;

                const seatLocalBox = new THREE.Box3(
                  new THREE.Vector3(geomBox.min.x, geomBox.min.y, seatCenterLocalZ - halfDepth),
                  new THREE.Vector3(geomBox.max.x, geomBox.max.y, seatCenterLocalZ + halfDepth)
                );

                // 将本地 box 变换到世界坐标系
                const seatWorldBox = seatLocalBox.clone();
                seatWorldBox.applyMatrix4(modelMatrix);

                // 射线与 box 相交测试
                const hitPoint = raycaster.ray.intersectBox(seatWorldBox, tmpHit);
                if (hitPoint) {
                  const dist = raycaster.ray.origin.distanceTo(tmpHit);
                  if (dist < closestDist) {
                    closestDist = dist;
                    chosenSeat = si;
                  }
                }
              }

              if (chosenSeat !== null) {
                const seatIndex = modelIndex * seatsPerModel + chosenSeat;
                return seatIndex;
              }

              // 如果没有命中任一子座位，退回到模型第一个子座位作为默认
              return modelIndex * seatsPerModel;
            }
          } else {
            // 小型/中型教室：一个模型对应一个座位，直接返回instanceId
            return instanceId;
          }
        }
      }
    }

    return null;
  };

  /**
   * 创建高亮边框
   */
  const createHighlightBorder = (seatIndex: number, _classroomXLength: number | null, _classroomZLength: number | null) => {
    // 高亮边框基于实际几何边界框计算，而不依赖教室尺寸参数
    if (!sceneRef || !instancedMeshGroupsRef.length) return;

    // 移除旧的高亮边框
    if (highlightBorder.value) {
      sceneRef.remove(highlightBorder.value);
      highlightBorder.value.geometry.dispose();
      if (Array.isArray(highlightBorder.value.material)) {
        highlightBorder.value.material.forEach(material => material.dispose());
      } else {
        highlightBorder.value.material.dispose();
      }
      highlightBorder.value = null;
    }
    // 移除旧的调试线框
    while (debugSeatWireframes.length > 0) {
      const wf = debugSeatWireframes.pop();
      if (wf && sceneRef) {
        sceneRef.remove(wf);
        wf.geometry.dispose();
        if (Array.isArray(wf.material)) {
          wf.material.forEach(m => m.dispose());
        } else {
          wf.material.dispose();
        }
      }
    }

    // 计算边界框
    const boundingBox = new THREE.Box3();
    const tempMatrix = new THREE.Matrix4();
    const tempBox = new THREE.Box3();

    if (classroomTypeRef === ClassroomTypeEnum.LARGE) {
      // 大型教室：计算单个座位的边界框
      // 一个模型对应4个座位，需要计算特定座位在模型中的位置
      const seatsPerModel = 4;
      const modelIndex = Math.floor(seatIndex / seatsPerModel);
      const seatInModel = seatIndex % seatsPerModel;

      // 遍历每个 instancedMesh，计算该实例对应的子座位 world-space box 并合并
      instancedMeshGroupsRef.forEach((instancedMesh) => {
        if (!instancedMesh.geometry) return;

        if (!instancedMesh.geometry.boundingBox) {
          instancedMesh.geometry.computeBoundingBox();
        }

        if (!instancedMesh.geometry.boundingBox) return;

        try {
          instancedMesh.getMatrixAt(modelIndex, tempMatrix);
        } catch (e) {
          return;
        }

        // modelMatrix = instance matrix * world matrix
        const modelMatrix = tempMatrix.clone().multiply(instancedMesh.matrixWorld);

        // local geometry bbox
        const geomBox = instancedMesh.geometry.boundingBox.clone();
        // 使用 Z 轴作为左右并排分布轴
        const geomCenterZ = (geomBox.max.z + geomBox.min.z) / 2;
        const modelDepth = geomBox.max.z - geomBox.min.z;

        const seatSpacing = modelDepth / (seatsPerModel + 1);
        const seatDepth = modelDepth / seatsPerModel;
        const leftOffset = -modelDepth / 2;

        // 计算当前 seatInModel 的本地 box（沿 Z 方向分割）
        const seatCenterLocalZ = geomCenterZ + leftOffset + seatSpacing * (seatInModel + 1);
        const halfDepth = seatDepth / 2;
        const seatLocalBox = new THREE.Box3(
          new THREE.Vector3(geomBox.min.x, geomBox.min.y, seatCenterLocalZ - halfDepth),
          new THREE.Vector3(geomBox.max.x, geomBox.max.y, seatCenterLocalZ + halfDepth)
        );

        // 将本地 box 变换到世界坐标系
        const seatWorldBox = seatLocalBox.clone();
        seatWorldBox.applyMatrix4(modelMatrix);

        boundingBox.union(seatWorldBox);

        // 调试：如果需要，渲染子座位线框
        if (debugShowSeatBoxes && sceneRef) {
          const boxSize = new THREE.Vector3();
          const boxCenter = new THREE.Vector3();
          seatWorldBox.getSize(boxSize);
          seatWorldBox.getCenter(boxCenter);

          const debugGeo = new THREE.EdgesGeometry(new THREE.BoxGeometry(boxSize.x, boxSize.y, boxSize.z));
          const debugMat = new THREE.LineBasicMaterial({ color: 0xff0000, transparent: true, opacity: 0.6 });
          const wire = markRaw(new THREE.LineSegments(debugGeo, debugMat));
          wire.position.copy(boxCenter);
          sceneRef.add(wire);
          debugSeatWireframes.push(wire);
        }
      });
    } else {
      // 小型/中型教室：计算整个桌椅模型的边界框
      instancedMeshGroupsRef.forEach((instancedMesh) => {
        if (!instancedMesh.geometry) return;

        if (!instancedMesh.geometry.boundingBox) {
          instancedMesh.geometry.computeBoundingBox();
        }

        if (!instancedMesh.geometry.boundingBox) return;

        try {
          instancedMesh.getMatrixAt(seatIndex, tempMatrix);
        } catch (e) {
          return;
        }

        tempMatrix.multiply(instancedMesh.matrixWorld);

        tempBox.copy(instancedMesh.geometry.boundingBox);
        tempBox.applyMatrix4(tempMatrix);

        boundingBox.union(tempBox);
      });
    }

    // 获取边界框尺寸和中心
    const size = new THREE.Vector3();
    const center = new THREE.Vector3();
    boundingBox.getSize(size);
    boundingBox.getCenter(center);

    // 创建边框几何体
    const padding = 0.1;
    const borderGeometry = new THREE.BoxGeometry(
      size.x + padding,
      size.y + padding,
      size.z + padding
    );

    const borderMaterial = new THREE.LineBasicMaterial({
      color: 0x00ff00,
      transparent: true,
      opacity: 0.8
    });

    const wireframeGeometry = new THREE.EdgesGeometry(borderGeometry);
    highlightBorder.value = markRaw(new THREE.LineSegments(wireframeGeometry, borderMaterial));
    highlightBorder.value.position.copy(center);

    sceneRef.add(highlightBorder.value);
  };

  /**
   * 鼠标悬浮处理器
   */
  const handleDeskHover = (event: MouseEvent) => {
    if (!canvasRef || !cameraRef || document.pointerLockElement === canvasRef) {
      return;
    }

    const seatIndex = detectSeatAtMouse(event);

    // 更新鼠标指针样式
    if (seatIndex !== null && !isCursorPointer.value) {
      canvasRef.style.cursor = 'pointer';
      isCursorPointer.value = true;
    } else if (seatIndex === null && isCursorPointer.value) {
      canvasRef.style.cursor = 'default';
      isCursorPointer.value = false;
    }

    // 处理高亮边框
    if (seatIndex !== lastHighlightedSeatIndex) {
      // 移除旧的高亮边框
      if (highlightBorder.value && sceneRef) {
        sceneRef.remove(highlightBorder.value);
        highlightBorder.value.geometry.dispose();
        if (Array.isArray(highlightBorder.value.material)) {
          highlightBorder.value.material.forEach(material => material.dispose());
        } else {
          highlightBorder.value.material.dispose();
        }
        highlightBorder.value = null;
      }

      // 如果有新的悬浮座位，创建高亮边框
      if (seatIndex !== null && instancedMeshGroupsRef.length > 0) {
        createHighlightBorder(seatIndex, classroomXLengthRef, classroomZLengthRef);
      }

      lastHighlightedSeatIndex = seatIndex;
    }

    // 调用外部回调
    if (onSeatHoverCallback) {
      onSeatHoverCallback(seatIndex, event);
    }
  };

  /**
   * 鼠标点击处理器
   */
  const handleDeskClick = (event: MouseEvent) => {
    if (!canvasRef || !cameraRef || document.pointerLockElement === canvasRef) return;

    const seatIndex = detectSeatAtMouse(event);
    if (seatIndex !== null && onSeatClickCallback) {
      onSeatClickCallback(seatIndex);
    }
  };

  /**
   * 鼠标右键处理器
   */
  const handleDeskContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    if (!canvasRef || !cameraRef || document.pointerLockElement === canvasRef) return;

    const seatIndex = detectSeatAtMouse(event);
    if (seatIndex !== null && onSeatContextMenuCallback) {
      onSeatContextMenuCallback(seatIndex);
    }
  };

  /**
   * 鼠标离开处理器
   */
  const handleMouseLeave = () => {
    if (isCursorPointer.value && canvasRef) {
      canvasRef.style.cursor = 'default';
      isCursorPointer.value = false;
    }

    // 清除高亮边框
    if (highlightBorder.value && sceneRef) {
      sceneRef.remove(highlightBorder.value);
      highlightBorder.value.geometry.dispose();
      if (Array.isArray(highlightBorder.value.material)) {
        highlightBorder.value.material.forEach(material => material.dispose());
      } else {
        highlightBorder.value.material.dispose();
      }
      highlightBorder.value = null;
    }
    // 清除调试线框
    while (debugSeatWireframes.length > 0) {
      const wf = debugSeatWireframes.pop();
      if (wf && sceneRef) {
        sceneRef.remove(wf);
        wf.geometry.dispose();
        if (Array.isArray(wf.material)) {
          wf.material.forEach(m => m.dispose());
        } else {
          wf.material.dispose();
        }
      }
    }

    // 重置高亮状态
    lastHighlightedSeatIndex = null;

    // 调用悬浮回调，清空悬浮状态
    if (onSeatHoverCallback) {
      onSeatHoverCallback(null, {} as MouseEvent);
    }
  };

  /**
   * 初始化交互
   */
  const initInteractions = (options: ClassroomInteractionOptions) => {
    const {
      canvas,
      camera,
      scene,
      classroomModel,
      instancedMeshGroups,
      classroomType,
      classroomXLength,
      classroomZLength,
      onSeatHover,
      onSeatClick,
      onSeatContextMenu
    } = options;

    // 保存引用
    canvasRef = canvas;
    cameraRef = camera;
    sceneRef = scene;
    instancedMeshGroupsRef = instancedMeshGroups;
    classroomTypeRef = classroomType || null;
    classroomXLengthRef = classroomXLength || null;
    classroomZLengthRef = classroomZLength || null;

    // 保存回调
    onSeatHoverCallback = onSeatHover;
    onSeatClickCallback = onSeatClick;
    onSeatContextMenuCallback = onSeatContextMenu;

    // 初始化射线投射器
    initRaycaster();

    // 初始化模型点击处理器
    const modelClickHandler = new ModelClickHandler();
    modelClickHandler.init(scene, camera, canvas);

    // 添加模型点击监听器
    if (classroomModel) {
      modelClickHandler.addClickListener(
        classroomModel,
        '大黑板',
        () => {
          // 这里可以添加黑板点击的处理逻辑
        }
      );
    }

    // 创建事件处理器
    deskHoverHandler = handleDeskHover;
    deskClickHandler = handleDeskClick;
    deskContextMenuHandler = handleDeskContextMenu;

    // 绑定事件监听器
    canvas.addEventListener('mousemove', deskHoverHandler);
    canvas.addEventListener('mouseleave', handleMouseLeave);
    canvas.addEventListener('click', deskClickHandler);
    canvas.addEventListener('contextmenu', deskContextMenuHandler);
  };

  /**
   * 清理资源
   */
  const dispose = () => {
    // 移除事件监听器
    if (canvasRef) {
      if (deskHoverHandler) {
        canvasRef.removeEventListener('mousemove', deskHoverHandler);
        canvasRef.style.cursor = 'default';
      }
      if (deskClickHandler) {
        canvasRef.removeEventListener('click', deskClickHandler);
      }
      if (deskContextMenuHandler) {
        canvasRef.removeEventListener('contextmenu', deskContextMenuHandler);
      }
      canvasRef.removeEventListener('mouseleave', handleMouseLeave);
    }

    // 清理高亮边框
    if (highlightBorder.value && sceneRef) {
      sceneRef.remove(highlightBorder.value);
      highlightBorder.value.geometry.dispose();
      if (Array.isArray(highlightBorder.value.material)) {
        highlightBorder.value.material.forEach(material => material.dispose());
      } else {
        highlightBorder.value.material.dispose();
      }
      highlightBorder.value = null;
    }

    // 清空引用
    canvasRef = null;
    cameraRef = null;
    sceneRef = null;
    instancedMeshGroupsRef = [];
    classroomTypeRef = null;
    classroomXLengthRef = null;
    classroomZLengthRef = null;
    lastHighlightedSeatIndex = null;
    onSeatHoverCallback = undefined;
    onSeatClickCallback = undefined;
    onSeatContextMenuCallback = undefined;
  };

  return {
    isCursorPointer: computed(() => isCursorPointer.value),
    highlightBorder: computed(() => highlightBorder.value),
    initInteractions,
    dispose
  };
};
