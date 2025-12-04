<template>
  <div class="book-3d-container">
    <!-- 3D画布 - 始终渲染以确保初始化时可获取 -->
    <canvas ref="canvasRef" class="webgl-canvas"></canvas>
  </div>
</template>

<script setup>
import {onMounted, onBeforeUnmount, ref, onUnmounted} from 'vue';
import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';

// 组件状态
const canvasRef = ref(null);
const loading = ref(true);
const loadingText = ref('正在加载3D模型...');
const error = ref(null);
const modelUrl = new URL('@/assets/3Dmodel/book/ancient_books.gltf', import.meta.url).href;

// Three.js相关对象
let canvas = null;
let renderer = null;
let scene = null;
let camera = null;
let controls = null;
let bookModel = null;
let loader = null;
let animationId = null;
let sizes = {
  width: 0,
  height: 0
};

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
    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.target.set(0, 0, 0); // 目标点设置为模型中心

    // 设置视角限制
    controls.minDistance = 0.1;
    controls.maxDistance = 3;
    controls.minPolarAngle = 0; // 允许向下看
    controls.maxPolarAngle = Math.PI / 2; // 最大只能水平看

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

  } catch (err) {
    console.error('Three.js初始化失败:', err);
    error.value = '3D场景初始化失败';
    loading.value = false;
  }
};

// 计算画布尺寸
const calculateCanvasSize = () => {
  // 获取屏幕尺寸的50%
  sizes.width = window.innerWidth * 0.5;
  sizes.height = window.innerHeight * 0.9;
};

// 加载书本模型
const loadBookModel = () => {
  loadingText.value = '正在加载书本模型...';

  loader.load(
      modelUrl,
      (gltf) => {
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
          bookModel.position.set(-0.4, 0, -0.4);

          // 计算缩放比例，确保模型适合视图
          const maxDim = Math.max(size.x, size.y, size.z);
          const scale = 1.5 / maxDim; // 调整缩放因子以合适显示
          bookModel.scale.set(scale, scale, scale);

          // 添加到场景
          scene.add(bookModel);

          loadingText.value = '书本模型加载完成';
          loading.value = false;
        } catch (err) {
          console.error('处理模型或纹理时出错:', err);
          error.value = '模型或纹理处理失败';
          loading.value = false;
        }
      },
      (xhr) => {
        // 加载进度
        const percent = (xhr.loaded / xhr.total * 100).toFixed(0);
        loadingText.value = `正在加载书本模型... ${percent}%`;
      },
      (err) => {
        // 加载错误
        console.error('模型加载失败:', err);
        error.value = '书本模型加载失败';
        loading.value = false;
      }
  );
};

// 动画循环
const animate = () => {
  animationId = requestAnimationFrame(animate);

  // 更新控制器
  if (controls) {
    controls.update();
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

  // 清理Three.js资源
  try {
    // 清理控制器
    if (controls) {
      try {
        controls.dispose();
        console.log('控制器已清理');
      } catch (err) {
        console.warn('清理控制器时出错:', err);
      }
    }

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
        const disposeObject = (object) => {
          // 清理几何体
          if (object.geometry) {
            try {
              object.geometry.dispose();
            } catch (err) {
              console.warn('清理几何体时出错:', err);
            }
          }

          // 清理材质
          if (object.material) {
            try {
              if (Array.isArray(object.material)) {
                object.material.forEach(material => {
                  if (material && typeof material.dispose === 'function') {
                    try {
                      material.dispose();
                    } catch (err) {
                      console.warn('清理材质时出错:', err);
                    }
                  }
                });
              } else if (typeof object.material.dispose === 'function') {
                object.material.dispose();
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
        const sceneChildren = [...scene.children]; // 创建副本以避免循环问题
        sceneChildren.forEach(child => {
          scene.remove(child);
          disposeObject(child);
        });

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
  controls = null;
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
  width: 50vw;
  height: 50vh;
  display: block;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
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
    width: 90vw;
    height: 45vh;
  }
}

@media (max-width: 480px) {
  .webgl-canvas,
  .loading-overlay,
  .error-overlay {
    width: 95vw;
    height: 40vh;
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