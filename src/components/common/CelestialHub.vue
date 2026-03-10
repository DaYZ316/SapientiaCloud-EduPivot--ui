<template>
  <div :style="{ width: props.size + 'px', height: props.size + 'px' }" class="book-3d-container">
    <!-- 3D画布 - 始终渲染以确保初始化时可获取 -->
    <canvas ref="canvasRef" class="webgl-canvas"></canvas>
  </div>
</template>

<script lang="ts" setup>
import {onBeforeUnmount, onMounted, ref, watch} from 'vue';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
// Props
const props = defineProps({
  isActive: {
    type: Boolean,
    default: false
  },
  // 支持外部传入尺寸（像素）
  size: {
    type: Number,
    default: 64
  }
});

// 组件状态
const canvasRef = ref<HTMLCanvasElement | null>(null);
const loading = ref(true);
const loadingText = ref('正在加载3D模型...');
const error = ref<string | null>(null);

// 3D模型路径配置
const modelUrl = import.meta.env.DEV
    ? new URL('@/assets/3Dmodel/celestail_hub/celestail_hub.gltf', import.meta.url).href
    : '/assets/celestail_hub.gltf';

// Three.js相关对象
let canvas: HTMLCanvasElement | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let controls: OrbitControls | null = null;
let bookModel: THREE.Group | null = null;
let loader: GLTFLoader | null = null;
let animationId: number | null = null;
let sizes = {
  width: 0,
  height: 0
};
let whiteLight: THREE.PointLight | null = null; // 主色光源

// 获取CSS变量中的primary-color
const getPrimaryColor = () => {
  const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--primary-color')
      .trim() || '#1890ff';
  // 将CSS颜色值转换为Three.js颜色
  return new THREE.Color(primaryColor);
};

// 鼠标追踪相关变量
let mouse = {
  x: 0,
  y: 0
};
let targetRotation = {
  x: 0,
  y: 0
};
let currentRotation = {
  x: 0,
  y: 0
};
const rotationSpeed = 0.05; // 旋转平滑速度

// 自动旋转相关变量
let autoRotateEnabled = true; // 是否启用自动旋转
let autoRotationSpeed = {
  x: 0.00025,
  y: 0.000375,
  z: 0.000125
}; // 自动旋转速度
let autoRotationTarget = {
  x: Math.random() * Math.PI * 2,
  y: Math.random() * Math.PI * 2,
  z: Math.random() * Math.PI * 2
}; // 自动旋转目标角度
let autoRotationChangeTimer = 0; // 自动旋转变化计时器
let autoRotationChangeInterval = 10000 + Math.random() * 10000; // 10-20秒随机改变旋转方向
let isMouseOver = false; // 鼠标是否在画布上

// 初始化Three.js场景
const initThree = () => {
  // 重置状态
  loading.value = true;
  error.value = null;

  try {
    // 计算画布尺寸（屏幕的50%）
    calculateCanvasSize();

    // 获取画布元素
    canvas = canvasRef.value;
    if (!canvas) {
      throw new Error('无法获取画布元素');
    }

    /**
     * 场景设置
     */
    scene = new THREE.Scene();
    scene.background = null; // 设置场景背景为透明

    /**
     * 相机设置
     */
    camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
    camera.position.set(0.17, 0.17, 0.17); // 设置相机位置，从斜上方观察（拉近）
    scene.add(camera);

    /**
     * 相机控制 - 禁用交互（logo不需要交互）
     */
    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = false;
    controls.enabled = false; // 完全禁用控制
    controls.target.set(0, 0, 0); // 目标点设置为模型中心

    /**
     * 渲染器设置
     */
    renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true, // 抗锯齿
      alpha: true // 启用透明度
    });
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    /**
     * 灯光设置 - 优化版
     */
        // 环境光 - 提供基础照明，避免完全黑暗的区域
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    // 主光源 - 模拟太阳光的方向光
    const mainLight = new THREE.DirectionalLight(0xffffff, 12);
    mainLight.position.set(3, 4, 5); // 从右上角照射
    mainLight.castShadow = true;
    mainLight.shadow.mapSize.width = 2048;
    mainLight.shadow.mapSize.height = 2048;
    mainLight.shadow.camera.near = 0.1;
    mainLight.shadow.camera.far = 10;
    scene.add(mainLight);
    scene.add(mainLight.target); // 添加光源目标

    // 填充光 - 减少阴影的深度
    const fillLight = new THREE.DirectionalLight(0x9090ff, 5); // 略微偏蓝色调
    fillLight.position.set(-4, 2, -3); // 从左侧下方照射
    scene.add(fillLight);

    // 点光源 - 增强模型细节和特定区域的照明
    const pointLight1 = new THREE.PointLight(0xfff0e0, 40); // 略微偏暖色调
    pointLight1.position.set(1, 1.5, 1);
    pointLight1.distance = 5; // 限制光照范围
    pointLight1.decay = 2; // 光照衰减
    scene.add(pointLight1);

    // 辅助光源 - 从另一侧提供补充照明
    const pointLight2 = new THREE.PointLight(0xe0f0ff, 15); // 略微偏冷色调
    pointLight2.position.set(-1, 1, -1);
    pointLight2.distance = 4;
    pointLight2.decay = 2;
    scene.add(pointLight2);

    // 点光源 - 增强模型细节和特定区域的照明
    const pointLight3 = new THREE.PointLight(0xfff0e0, 40); // 略微偏暖色调
    pointLight3.position.set(0, 0, 0);
    pointLight3.distance = 5; // 限制光照范围
    pointLight3.decay = 2; // 光照衰减
    scene.add(pointLight3);

    // 主色光源 - 用于AI页面时的发光效果（位置将在模型加载后设置）
    const primaryColor = getPrimaryColor();
    whiteLight = new THREE.PointLight(primaryColor, 0);
    whiteLight.position.set(0, 0, 0); // 临时位置，模型加载后会更新
    whiteLight.distance = 20; // 增加距离以扩大散射范围
    whiteLight.decay = 0.5; // 减小衰减以增加散射角度
    scene.add(whiteLight);

    // 如果当前在AI页面，启用主色光效果
    if (props.isActive) {
      enableWhiteLight();
    }

    /**
     * 加载器设置
     */
    loader = new GLTFLoader();
    // 设置 GLTFLoader 的基础路径，用于解析相对资源路径
    const modelDir = modelUrl.substring(0, modelUrl.lastIndexOf('/') + 1);
    loader.setPath(modelDir);

    /**
     * 加载3D模型
     */
    loadBookModel();

    /**
     * 开始动画循环
     */
    animate();

    /**
     * 添加窗口大小变化监听
     */
    window.addEventListener('resize', handleResize);

    /**
     * 添加鼠标移动监听
     */
    if (canvas) {
      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseenter', handleMouseEnter);
      canvas.addEventListener('mouseleave', handleMouseLeave);
    }

  } catch (err) {
    console.error('Three.js初始化失败:', err);
    error.value = '3D场景初始化失败';
    loading.value = false;
  }
};

// 计算画布尺寸
const calculateCanvasSize = () => {
  // 使用传入的尺寸，保证 Three 渲染器与 canvas 大小一致
  const targetSize = props.size || 48;
  sizes.width = targetSize;
  sizes.height = targetSize;
};


// 加载书本模型
const loadBookModel = () => {
  loadingText.value = '正在加载书本模型...';

  if (!loader) return;
  // 如果设置了 setPath，load 方法只需要文件名
  const modelFileName = modelUrl.substring(modelUrl.lastIndexOf('/') + 1);
  loader.load(
      modelFileName,
      (gltf: { scene: THREE.Group }) => {
        try {
          // 成功加载模型
          bookModel = gltf.scene;

          // 计算模型尺寸并调整
          const box = new THREE.Box3().setFromObject(bookModel);
          const size = new THREE.Vector3();
          box.getSize(size);

          // 计算模型中心点
          const center = new THREE.Vector3();
          box.getCenter(center);

          // 调整模型位置，使其居中
          bookModel.position.set(0, 0, 0);

          // 计算缩放比例，确保模型适合视图（缩小以适应logo尺寸）
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 0.3 / maxDim; // 调整缩放因子以适应小尺寸logo
          bookModel.scale.set(scale, scale, scale);

          // 添加到场景
          if (scene) {
            scene.add(bookModel);
          }

          // 根据模型尺寸设置主色光源位置（放在模型后面）
          if (whiteLight) {
            const scaledSize = new THREE.Vector3();
            box.getSize(scaledSize);
            scaledSize.multiplyScalar(scale);
            // 将光源放在模型后方（Z轴负方向），距离模型边缘约0.3单位
            const lightDistance = Math.max(scaledSize.x, scaledSize.y, scaledSize.z) * 0.5 + 0.3;
            whiteLight.position.set(0, 0, -lightDistance);
          }

          // GLTFLoader 会自动处理资源加载
          loading.value = false;
        } catch (err) {
          console.error('处理模型时出错:', err);
          error.value = '模型处理失败';
          loading.value = false;
        }
      },
      (xhr: ProgressEvent<EventTarget>) => {
        // 加载进度
        if (xhr.lengthComputable) {
          const percent = ((xhr.loaded / xhr.total) * 100).toFixed(0);
          loadingText.value = `正在加载书本模型... ${percent}%`;
        }
      },
      (err: unknown) => {
        // 加载错误
        console.error('模型加载失败:', err);
        error.value = '书本模型加载失败';
        loading.value = false;
      }
  );
};


// 应用自发光效果
const applyEmissiveEffect = (mesh: THREE.Mesh, emissiveIntensity: number = 0.3) => {
  if (!mesh || !mesh.isMesh) return;

  const primaryColor = getPrimaryColor();
  if (Array.isArray(mesh.material)) {
    mesh.material.forEach((mat: THREE.Material) => {
      if (mat && mat.isMaterial) {
        const stdMat = mat as THREE.MeshStandardMaterial;
        stdMat.emissive = primaryColor.clone();
        stdMat.emissiveIntensity = emissiveIntensity;
      }
    });
  } else if (mesh.material && mesh.material.isMaterial) {
    const stdMat = mesh.material as THREE.MeshStandardMaterial;
    stdMat.emissive = primaryColor.clone();
    stdMat.emissiveIntensity = emissiveIntensity;
  }
};

// 移除自发光效果
const removeEmissiveEffect = (mesh: THREE.Mesh) => {
  if (!mesh || !mesh.isMesh) return;

  if (Array.isArray(mesh.material)) {
    mesh.material.forEach((mat: THREE.Material) => {
      if (mat && mat.isMaterial) {
        const stdMat = mat as THREE.MeshStandardMaterial;
        stdMat.emissive = new THREE.Color(0x000000);
        stdMat.emissiveIntensity = 0;
      }
    });
  } else if (mesh.material && mesh.material.isMaterial) {
    const stdMat = mesh.material as THREE.MeshStandardMaterial;
    stdMat.emissive = new THREE.Color(0x000000);
    stdMat.emissiveIntensity = 0;
  }
};

// 启用主色光效果
const enableWhiteLight = (intensity: number = 50, emissiveIntensity: number = 0.3) => {
  if (whiteLight) {
    const primaryColor = getPrimaryColor();
    whiteLight.color = primaryColor;
    whiteLight.intensity = intensity;

    // 如果模型已加载，更新光源位置到模型后面
    if (bookModel) {
      const box = new THREE.Box3().setFromObject(bookModel);
      const size = new THREE.Vector3();
      box.getSize(size);
      // 计算缩放后的尺寸
      const scale = bookModel.scale.x;
      const scaledSize = new THREE.Vector3(
          size.x * scale,
          size.y * scale,
          size.z * scale
      );
      // 将光源放在模型后方（Z轴负方向），距离模型边缘约0.3单位
      const lightDistance = Math.max(scaledSize.x, scaledSize.y, scaledSize.z) * 0.5 + 0.3;
      whiteLight.position.set(0, 0, -lightDistance);
    }
  }
  if (bookModel) {
    bookModel.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        applyEmissiveEffect(child as THREE.Mesh, emissiveIntensity);
      }
    });
  }
};

// 禁用主色光效果
const disableWhiteLight = () => {
  if (whiteLight) {
    whiteLight.intensity = 0;
  }
  if (bookModel) {
    bookModel.traverse((child: THREE.Object3D) => {
      if ((child as THREE.Mesh).isMesh) {
        removeEmissiveEffect(child as THREE.Mesh);
      }
    });
  }
};

// 监听isActive变化
watch(() => props.isActive, (newValue) => {
  if (newValue) {
    enableWhiteLight();
  } else {
    disableWhiteLight();
  }
});


// 处理鼠标进入
const handleMouseEnter = () => {
  isMouseOver = true;
  autoRotateEnabled = false; // 鼠标在画布上时禁用自动旋转
};

// 处理鼠标移动
const handleMouseMove = (event: MouseEvent) => {
  if (!canvas) return;

  isMouseOver = true;
  autoRotateEnabled = false; // 鼠标移动时禁用自动旋转

  const rect = canvas.getBoundingClientRect();
  // 计算鼠标在画布中的归一化位置 (-1 到 1)
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = ((event.clientY - rect.top) / rect.height) * 2 - 1; // 移除负号，修正上下方向

  // 计算目标旋转角度（根据鼠标位置）
  // 限制旋转范围，避免过度旋转
  targetRotation.y = mouse.x * Math.PI * 0.3; // 水平旋转（Y轴）
  targetRotation.x = mouse.y * Math.PI * 0.2; // 垂直旋转（X轴）
};

// 处理鼠标离开
const handleMouseLeave = () => {
  isMouseOver = false;
  autoRotateEnabled = true; // 鼠标离开时启用自动旋转

  // 重置鼠标追踪目标旋转
  targetRotation.x = 0;
  targetRotation.y = 0;

  // 设置新的随机旋转目标
  autoRotationTarget.x = Math.random() * Math.PI * 2;
  autoRotationTarget.y = Math.random() * Math.PI * 2;
  autoRotationTarget.z = Math.random() * Math.PI * 2;

  // 随机改变旋转速度，增加无规律性
  autoRotationSpeed.x = (0.000125 + Math.random() * 0.000375) * (Math.random() > 0.5 ? 1 : -1);
  autoRotationSpeed.y = (0.000125 + Math.random() * 0.000375) * (Math.random() > 0.5 ? 1 : -1);
  autoRotationSpeed.z = (0.0000625 + Math.random() * 0.00025) * (Math.random() > 0.5 ? 1 : -1);
};

// 动画循环
const animate = () => {
  animationId = requestAnimationFrame(animate);

  // 更新控制器
  if (controls) {
    controls.update();
  }

  // 更新模型旋转
  if (bookModel) {
    if (autoRotateEnabled && !isMouseOver) {
      // 自动旋转模式（无规律自转）
      autoRotationChangeTimer += 16; // 假设每帧约16ms

      // 定期随机改变旋转方向和速度，增加无规律性
      if (autoRotationChangeTimer >= autoRotationChangeInterval) {
        autoRotationChangeTimer = 0;
        autoRotationChangeInterval = 5000 + Math.random() * 5000; // 5-10秒随机间隔

        // 随机改变旋转目标
        autoRotationTarget.x = Math.random() * Math.PI * 2;
        autoRotationTarget.y = Math.random() * Math.PI * 2;
        autoRotationTarget.z = Math.random() * Math.PI * 2;

        // 随机改变旋转速度和方向
        autoRotationSpeed.x = (0.000125 + Math.random() * 0.000375) * (Math.random() > 0.5 ? 1 : -1);
        autoRotationSpeed.y = (0.000125 + Math.random() * 0.000375) * (Math.random() > 0.5 ? 1 : -1);
        autoRotationSpeed.z = (0.0000625 + Math.random() * 0.00025) * (Math.random() > 0.5 ? 1 : -1);
      }

      // 平滑过渡到目标旋转
      currentRotation.x += (autoRotationTarget.x - currentRotation.x) * 0.005;
      currentRotation.y += (autoRotationTarget.y - currentRotation.y) * 0.005;

      // 应用自动旋转
      bookModel.rotation.x += autoRotationSpeed.x;
      bookModel.rotation.y += autoRotationSpeed.y;
      bookModel.rotation.z += autoRotationSpeed.z;

      // 更新当前旋转值
      currentRotation.x = bookModel.rotation.x;
      currentRotation.y = bookModel.rotation.y;
    } else {
      // 鼠标追踪模式
      // 使用线性插值平滑旋转
      currentRotation.x += (targetRotation.x - currentRotation.x) * rotationSpeed;
      currentRotation.y += (targetRotation.y - currentRotation.y) * rotationSpeed;

      // 应用旋转到模型
      bookModel.rotation.x = currentRotation.x;
      bookModel.rotation.y = currentRotation.y;
      // Z轴保持当前值，不重置
    }
  }

  // 渲染场景
  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
};

// 处理窗口大小变化
const handleResize = () => {
  // 重新计算画布尺寸
  calculateCanvasSize();

  // 更新相机
  if (camera) {
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();
  }

  // 更新渲染器
  if (renderer) {
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  }
};

// 清理资源
const cleanup = () => {
  // 取消动画循环
  if (animationId) {
    cancelAnimationFrame(animationId);
  }

  // 移除事件监听
  window.removeEventListener('resize', handleResize);

  // 移除鼠标事件监听
  if (canvas) {
    canvas.removeEventListener('mousemove', handleMouseMove);
    canvas.removeEventListener('mouseenter', handleMouseEnter);
    canvas.removeEventListener('mouseleave', handleMouseLeave);
  }

  // 清理Three.js资源
  try {
    // 清理控制器
    if (controls) {
      try {
        controls.dispose();
      } catch (err) {
        console.warn('清理控制器时出错:', err);
      }
    }

    // 清理渲染器
    if (renderer) {
      try {
        renderer.dispose();
      } catch (err) {
        console.warn('清理渲染器时出错:', err);
      }
    }

    // 清理主色光源
    if (whiteLight && scene) {
      try {
        scene.remove(whiteLight);
        whiteLight = null;
      } catch (err) {
        console.warn('清理主色光源时出错:', err);
      }
    }


    // 清理场景中的对象
    if (scene) {
      try {
        // 递归清理函数
        const disposeObject = (object: THREE.Object3D) => {
          const mesh = object as THREE.Mesh;
          // 清理几何体
          if (mesh.geometry) {
            try {
              mesh.geometry.dispose();
            } catch (err) {
              console.warn('清理几何体时出错:', err);
            }
          }

          // 清理材质
          if (mesh.material) {
            try {
              if (Array.isArray(mesh.material)) {
                mesh.material.forEach((material: THREE.Material) => {
                  if (material && typeof material.dispose === 'function') {
                    try {
                      material.dispose();
                    } catch (err) {
                      console.warn('清理材质时出错:', err);
                    }
                  }
                });
              } else if (typeof mesh.material.dispose === 'function') {
                mesh.material.dispose();
              }
            } catch (err) {
              console.warn('处理材质时出错:', err);
            }
          }

          // 递归清理子对象
          if (object.children && object.children.length > 0) {
            const children = [...object.children]; // 创建副本以避免循环问题
            children.forEach(child => {
              disposeObject(child);
            });
          }
        };

        // 清理场景中的所有对象
        if (scene) {
          const sceneChildren = [...scene.children]; // 创建副本以避免循环问题
          sceneChildren.forEach(child => {
            if (scene) {
              scene.remove(child);
            }
            disposeObject(child);
          });
        }

      } catch (err) {
        console.warn('清理场景时出错:', err);
      }
    }

    // 清理加载器
    if (loader) {
      // GLTFLoader没有dispose方法，但我们将其设为null
      loader = null;
    }

  } catch (err) {
    console.error('清理资源时发生错误:', err);
  }

  // 重置变量
  canvas = null;
  renderer = null;
  scene = null;
  camera = null;
  controls = null;
  bookModel = null;
  loader = null;
  animationId = null;
  whiteLight = null;
};

// 组件挂载时初始化
onMounted(() => {
  initThree();
});

// 组件卸载前清理
onBeforeUnmount(() => {
  cleanup();
});

// 暴露发光控制方法给父组件
defineExpose({
  enableWhiteLight,
  disableWhiteLight
});
</script>

<style scoped>
.book-3d-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.webgl-canvas {
  width: 100%;
  height: 100%;
  display: block;
}

.loading-overlay,
.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 174px;
  height: 174px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  z-index: 10;
}

.loading-spinner {
  width: 174px;
  height: 174px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-overlay p,
.error-message {
  font-size: 16px;
  color: #333;
  margin: 0;
  text-align: center;
}

.error-message {
  color: #e74c3c;
  margin-bottom: 16px;
}

.retry-button {
  padding: 8px 16px;
  background-color: #3498db;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background-color 0.3s;
}

.retry-button:hover {
  background-color: #2980b9;
}

</style>