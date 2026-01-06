<template>
  <div class="book-3d-container">
    <!-- 3D画布 - 始终渲染以确保初始化时可获取 -->
    <canvas ref="canvasRef" class="webgl-canvas"></canvas>
  </div>
</template>

<script lang="ts" setup>
import {onBeforeUnmount, onMounted, ref} from 'vue';
import * as THREE from 'three';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

// 组件状态
const canvasRef = ref<HTMLCanvasElement | null>(null);
const loading = ref(true);
const loadingText = ref('正在加载3D模型...');
const error = ref<string | null>(null);
// 使用静态路径，因为 3D 模型文件是通过插件直接复制到 dist/assets/3Dmodel/ 的
const modelUrl = import.meta.env.DEV
    ? new URL('@/assets/3Dmodel/book/ancient_books.gltf', import.meta.url).href
    : '/assets/3Dmodel/ancient_books.gltf';

// Three.js相关对象
let canvas: HTMLCanvasElement | null = null;
let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let bookModel: THREE.Group | null = null;
let loader: GLTFLoader | null = null;
let animationId: number | null = null;
let sizes = {
  width: 0,
  height: 0
};

// 旋转控制变量
let targetRotationY = Math.PI / 2; // 目标旋转角度 (90度)
let targetRotationX = Math.PI / 12; // 目标倾斜角度 (15度，向镜头倾斜)
let isRotating = true;
let rotationSpeed = 0.01; // 旋转速度

// 鼠标追踪相关变量
let mouse = {
  x: 0,
  y: 0
};
let targetMouseRotation = {
  x: 0,
  y: 0
};
let currentMouseRotation = {
  x: 0,
  y: 0
};
const mouseRotationSpeed = 0.05; // 鼠标旋转平滑速度
let isMouseOver = false; // 鼠标是否在画布上

// 回弹效果相关变量
let isBouncingBack = false; // 是否正在执行回弹动画
let bounceStartTime = 0; // 回弹开始时间
let bounceDuration = 800; // 回弹动画总时长（毫秒）
let bounceStartRotation = { x: 0, y: 0 }; // 回弹开始时的旋转角度

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
    camera.position.set(1, 1.5, 1); // 设置相机位置，从斜上方观察书本
    scene.add(camera);

    /**
     * 相机控制
     */

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
     * 灯光设置
     */
        // 温暖的黄色主灯光
    const keyLight = new THREE.PointLight(0xffe28a, 6);
    keyLight.position.set(0.6, 1.2, 1.6);
    scene.add(keyLight);

    // 柔和的填充灯光
    const fillLight = new THREE.AmbientLight(0xfff1c7, 0.3);
    scene.add(fillLight);

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
     * 添加鼠标事件监听
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

// 修复缺失的纹理
const fixMissingTextures = (object: THREE.Object3D) => {
  object.traverse((child: THREE.Object3D) => {
    if ((child as THREE.Mesh).isMesh) {
      const mesh = child as THREE.Mesh;
      if (mesh.material) {
        const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];

        materials.forEach((material: THREE.Material) => {
          if (material instanceof THREE.MeshStandardMaterial || material instanceof THREE.MeshBasicMaterial) {
            // 检查各种纹理类型
            const textureTypes = ['map', 'normalMap', 'roughnessMap', 'metalnessMap', 'emissiveMap', 'aoMap'];

            textureTypes.forEach((textureType) => {
              const texture = (material as any)[textureType];
              if (texture && texture.image === undefined) {
                console.warn(`修复缺失的${textureType}纹理`);
                // 创建默认纹理
                const defaultTexture = new THREE.Texture();
                const canvas = document.createElement('canvas');
                canvas.width = 1;
                canvas.height = 1;
                const context = canvas.getContext('2d');
                if (context) {
                  context.fillStyle = textureType === 'emissiveMap' ? '#000000' : '#ffffff';
                  context.fillRect(0, 0, 1, 1);
                }
                defaultTexture.image = canvas;
                defaultTexture.needsUpdate = true;
                (material as any)[textureType] = defaultTexture;
              }
            });
          }
        });
      }
    }
  });
};

// 计算画布尺寸
const calculateCanvasSize = () => {
  // 获取屏幕尺寸的70%
  sizes.width = window.innerWidth * 0.7;
  sizes.height = window.innerHeight * 0.95;
};


// 开始回弹动画
const startBounceBack = () => {
  if (!bookModel) return;

  isBouncingBack = true;
  bounceStartTime = Date.now();
  bounceStartRotation.x = bookModel.rotation.x;
  bounceStartRotation.y = bookModel.rotation.y;
};

// 加载书本模型
const loadBookModel = () => {
  loadingText.value = '正在加载书本模型...';

  if (!loader) return;

  // 创建自定义的LoadingManager来处理纹理加载失败
  const loadingManager = new THREE.LoadingManager();
  loadingManager.onError = (url: string) => {
    console.warn('资源加载失败:', url);
    // 对于纹理加载失败，不抛出错误，让加载继续
    if (url.includes('.jpg') || url.includes('.png') || url.includes('.jpeg')) {
      console.warn('纹理文件缺失，使用默认纹理');
    }
  };

  // 如果设置了 setPath，load 方法只需要文件名
  const modelFileName = modelUrl.substring(modelUrl.lastIndexOf('/') + 1);
  loader.load(
      modelFileName,
      (gltf: { scene: THREE.Group }) => {
        try {
          // 成功加载模型
          bookModel = gltf.scene;

          // 重置旋转状态
          isRotating = true;
          bookModel.rotation.y = 0; // 从0度开始Y轴旋转
          bookModel.rotation.x = 0; // 从0度开始X轴旋转

          // 计算模型尺寸并调整
          const box = new THREE.Box3().setFromObject(bookModel);
          const size = new THREE.Vector3();
          box.getSize(size);

          // 计算模型中心点
          const center = new THREE.Vector3();
          box.getCenter(center);

          // 调整模型位置，使其偏向画面右上角（注意：这是模型在场景中的坐标，不移动画布）
          bookModel.position.set(1, 1.25, -0.4);

          // 计算缩放比例，确保模型适合视图
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 1.5 / maxDim; // 调整缩放因子以合适显示
          bookModel.scale.set(scale, scale, scale);

          // 修复缺失的纹理
          fixMissingTextures(bookModel);

          // 添加到场景
          if (scene) {
            scene.add(bookModel);
          }

          loadingText.value = '书本模型加载完成';
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
        const errorMessage = err instanceof Error ? err.message : String(err);
        if (errorMessage.includes('texture') || errorMessage.includes('Texture')) {
          console.warn('纹理加载失败，但模型仍可使用:', errorMessage);
          // 即使纹理加载失败，也尝试继续加载模型的其他部分
          loadingText.value = '纹理加载失败，使用默认材质...';
          setTimeout(() => {
            loading.value = false;
          }, 1000);
        } else {
          console.error('模型加载失败:', err);
          error.value = '书本模型加载失败';
          loading.value = false;
        }
      }
  );
};

// 动画循环
const animate = () => {
  animationId = requestAnimationFrame(animate);

  // 更新模型旋转
  if (bookModel) {
    if (isMouseOver) {
      // 鼠标追踪模式 - 基础旋转 + 鼠标旋转
      if (isRotating) {
        // 继续完成初始旋转动画
        const angleDiffY = targetRotationY - bookModel.rotation.y;
        const angleDiffX = targetRotationX - bookModel.rotation.x;

        if (Math.abs(angleDiffY) < 0.001 && Math.abs(angleDiffX) < 0.001) {
          isRotating = false;
        } else {
          if (Math.abs(angleDiffY) >= 0.001) {
            const rotationStepY = Math.sign(angleDiffY) * Math.min(Math.abs(angleDiffY), rotationSpeed);
            bookModel.rotation.y += rotationStepY;
          }
          if (Math.abs(angleDiffX) >= 0.001) {
            const rotationStepX = Math.sign(angleDiffX) * Math.min(Math.abs(angleDiffX), rotationSpeed);
            bookModel.rotation.x += rotationStepX;
          }
        }
      }

      // 应用鼠标旋转（在基础旋转之上叠加）
      currentMouseRotation.x += (targetMouseRotation.x - currentMouseRotation.x) * mouseRotationSpeed;
      currentMouseRotation.y += (targetMouseRotation.y - currentMouseRotation.y) * mouseRotationSpeed;

      bookModel.rotation.x = targetRotationX + currentMouseRotation.x;
      bookModel.rotation.y = targetRotationY + currentMouseRotation.y;
    } else {
      // 正常旋转模式（鼠标不在画布上时）- 确保回到基础旋转状态
      if (isBouncingBack) {
        // 回弹动画逻辑 - 分两个阶段
        const elapsed = Date.now() - bounceStartTime;
        const progress = Math.min(elapsed / bounceDuration, 1);

        if (progress >= 1) {
          // 回弹动画结束，设置最终位置
          bookModel.rotation.y = targetRotationY;
          bookModel.rotation.x = targetRotationX;
          isBouncingBack = false;
          isRotating = false;
        } else {
          // 第一阶段（0-0.6）：快速接近目标并稍微超出
          // 第二阶段（0.6-1.0）：回到目标位置
          let targetX, targetY;

          if (progress < 0.6) {
            // 第一阶段：快速移动并超出目标
            const phaseProgress = progress / 0.6;
            const overshoot = 1.1; // 超出目标10%
            targetX = bounceStartRotation.x + (targetRotationX - bounceStartRotation.x) * phaseProgress * overshoot;
            targetY = bounceStartRotation.y + (targetRotationY - bounceStartRotation.y) * phaseProgress * overshoot;
          } else {
            // 第二阶段：回到目标位置
            const phaseProgress = (progress - 0.6) / 0.4;
            const overshootX = bounceStartRotation.x + (targetRotationX - bounceStartRotation.x) * 1.1;
            const overshootY = bounceStartRotation.y + (targetRotationY - bounceStartRotation.y) * 1.1;
            targetX = overshootX + (targetRotationX - overshootX) * phaseProgress;
            targetY = overshootY + (targetRotationY - overshootY) * phaseProgress;
          }

          bookModel.rotation.x = targetX;
          bookModel.rotation.y = targetY;
        }
      } else {
        // 普通平滑过渡（当没有回弹动画时）
        const angleDiffY = targetRotationY - bookModel.rotation.y;
        const angleDiffX = targetRotationX - bookModel.rotation.x;

        if (Math.abs(angleDiffY) < 0.001 && Math.abs(angleDiffX) < 0.001) {
          // 已经回到基础状态
          bookModel.rotation.y = targetRotationY;
          bookModel.rotation.x = targetRotationX;
          isRotating = false;
        } else {
          // 平滑过渡回基础状态
          if (Math.abs(angleDiffY) >= 0.001) {
            const rotationStepY = Math.sign(angleDiffY) * Math.min(Math.abs(angleDiffY), rotationSpeed);
            bookModel.rotation.y += rotationStepY;
          }
          if (Math.abs(angleDiffX) >= 0.001) {
            const rotationStepX = Math.sign(angleDiffX) * Math.min(Math.abs(angleDiffX), rotationSpeed);
            bookModel.rotation.x += rotationStepX;
          }
        }
      }
    }
  }

  // 渲染场景
  if (renderer && scene && camera) {
    renderer.render(scene, camera);
  }
};

// 处理鼠标进入画布
const handleMouseEnter = () => {
  isMouseOver = true;
};

// 处理鼠标移动
const handleMouseMove = (event: MouseEvent) => {
  if (!canvas) return;

  const rect = canvas.getBoundingClientRect();
  // 计算鼠标在画布中的归一化位置 (-1 到 1)
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = ((event.clientY - rect.top) / rect.height) * 2 - 1; // 移除负号，修正上下方向

  // 计算目标旋转角度（根据鼠标位置）
  // 限制旋转范围，避免过度旋转
  targetMouseRotation.y = mouse.x * Math.PI * 0.1; // 水平旋转（Y轴），减小范围
  targetMouseRotation.x = mouse.y * Math.PI * 0.08; // 垂直旋转（X轴），减小范围
};

// 处理鼠标离开画布
const handleMouseLeave = () => {
  isMouseOver = false;

  // 重置鼠标追踪目标旋转
  targetMouseRotation.x = 0;
  targetMouseRotation.y = 0;

  // 重置当前鼠标旋转状态，为平滑过渡做准备
  currentMouseRotation.x = 0;
  currentMouseRotation.y = 0;

  // 开始回弹动画
  startBounceBack();
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

    // 清理渲染器
    if (renderer) {
      try {
        renderer.dispose();
        console.log('渲染器已清理');
      } catch (err) {
        console.warn('清理渲染器时出错:', err);
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

        console.log('场景对象已清理');
      } catch (err) {
        console.warn('清理场景时出错:', err);
      }
    }

    if (loader) {
      // GLTFLoader没有dispose方法，但我们将其设为null
      loader = null;
      console.log('模型加载器已清理');
    }

  } catch (err) {
    console.error('清理资源时发生错误:', err);
  }

  // 重置变量
  canvas = null;
  renderer = null;
  scene = null;
  camera = null;
  bookModel = null;
  loader = null;
  animationId = null;
};

// 组件挂载时初始化
onMounted(() => {
  initThree();
});

// 组件卸载前清理
onBeforeUnmount(() => {
  cleanup();
});
</script>

<style scoped>
.book-3d-container {
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.webgl-canvas {
  width: 100%;
  height: 100%;
  display: block;
  /* 移除背景色以保持透明 */
}

.loading-overlay,
.error-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 50vw;
  height: 50vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.9);
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  z-index: 10;
}

.loading-spinner {
  width: 40px;
  height: 40px;
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

/* 响应式设计 */
@media (max-width: 768px) {
  .webgl-canvas,
  .loading-overlay,
  .error-overlay {
    width: 100%;
    height: 100%;
  }
}

@media (max-width: 480px) {
  .webgl-canvas,
  .loading-overlay,
  .error-overlay {
    width: 100%;
    height: 100%;
  }

  .loading-overlay p,
  .error-message {
    font-size: 14px;
  }

  .retry-button {
    font-size: 12px;
    padding: 6px 12px;
  }
}
</style>