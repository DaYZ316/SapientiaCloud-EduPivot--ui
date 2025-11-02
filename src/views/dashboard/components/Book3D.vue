<template>
  <div class="book-3d-container">
    <!-- 3D画布 - 始终渲染以确保初始化时可获取 -->
    <canvas ref="canvasRef" class="webgl-canvas"></canvas>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, onUnmounted } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

// 组件状态
const canvasRef = ref(null);
const loading = ref(true);
const loadingText = ref('正在加载3D模型...');
const error = ref(null);

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
    const fixedDistance = 1.5; // 固定距离
    controls.minDistance = fixedDistance;
    controls.maxDistance = fixedDistance;
    controls.enableZoom = false; // 禁用缩放，锁定前后距离
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
    const pointLight = new THREE.PointLight(0xffffff, 10);
    pointLight.position.set(0,0, 2);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
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
    '/src/assets/3Dmodel/book/Book.gltf',
    (gltf) => {
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
      
      // 完成加载
      loading.value = false;
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
  if (controls) {
    controls.dispose();
  }
  
  if (renderer) {
    renderer.dispose();
  }
  
  // 清理场景中的对象
  if (scene) {
    while(scene.children.length > 0) {
      const object = scene.children[0];
      scene.remove(object);
      
      // 递归清理子对象
      if (object.children && object.children.length > 0) {
        while(object.children.length > 0) {
          const child = object.children[0];
          object.remove(child);
          
          // 清理几何体和材质
          if (child.geometry) {
            child.geometry.dispose();
          }
          if (child.material) {
            if (Array.isArray(child.material)) {
              child.material.forEach(material => material.dispose());
            } else {
              child.material.dispose();
            }
          }
        }
      }
      
      // 清理几何体和材质
      if (object.geometry) {
        object.geometry.dispose();
      }
      if (object.material) {
        if (Array.isArray(object.material)) {
          object.material.forEach(material => material.dispose());
        } else {
          object.material.dispose();
        }
      }
    }
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

<style lang="scss" scoped>
.book-3d-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  
  .webgl-canvas {
    display: block;
    width: 100%;
    height: 100%;
  }
}
</style>