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
import mainTextureImage from '@/assets/3Dmodel/celestail_hub/棱角球.002_Bake1_CyclesBake_COMBINED.png';

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
let textureLoader = null;
let loadedTextures = {};
let sizes = {
  width: 0,
  height: 0
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
  x: 0.002,
  y: 0.003,
  z: 0.001
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

    /**
     * 加载器设置
     */
    loader = new GLTFLoader();
    textureLoader = new THREE.TextureLoader();

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
  // logo尺寸：48x48像素
  sizes.width = 60;
  sizes.height = 60;
};

// 加载纹理
const loadTexture = (texturePath, textureName) => {
  return new Promise((resolve, reject) => {
    try {
      if (!textureLoader) {
        console.error('纹理加载器未初始化');
        reject(new Error('纹理加载器未初始化'));
        return;
      }

      // 检查路径格式，处理可能的模块导入情况
      let finalPath = texturePath;
      if (typeof texturePath !== 'string') {
        if (texturePath && typeof texturePath === 'object') {
          finalPath = texturePath.default || texturePath.src || texturePath;
        } else {
          console.error('无效的纹理路径:', texturePath);
          reject(new Error('无效的纹理路径'));
          return;
        }
      }

      if (!finalPath || typeof finalPath !== 'string') {
        console.error('无法解析纹理路径:', texturePath);
        reject(new Error('无法解析纹理路径'));
        return;
      }

      textureLoader.load(
          finalPath,
          (texture) => {
            if (!texture) {
              console.error(`${textureName} 纹理加载成功但返回空对象`);
              reject(new Error('纹理加载返回空对象'));
              return;
            }

            loadedTextures[textureName] = texture;
            resolve(texture);
          },
          (xhr) => {
            try {
              // 加载进度
              if (xhr && xhr.loaded !== undefined && xhr.total !== undefined && xhr.total > 0) {
                const percent = (xhr.loaded / xhr.total * 100).toFixed(0);
              }
            } catch (progressErr) {
              console.warn('获取加载进度时出错:', progressErr);
            }
          },
          (err) => {
            console.error(`${textureName} 纹理加载失败:`, err);

            // 尝试创建一个简单的占位纹理作为回退
            try {
              const fallbackTexture = createFallbackTexture();
              loadedTextures[textureName] = fallbackTexture;
              console.warn(`使用占位纹理替代 ${textureName}`);
              resolve(fallbackTexture);
            } catch (fallbackErr) {
              console.error('创建占位纹理失败:', fallbackErr);
              reject(err);
            }
          }
      );
    } catch (outerErr) {
      console.error(`加载 ${textureName} 纹理时发生未预期错误:`, outerErr);
      reject(outerErr);
    }
  });
};

// 创建简单的占位纹理作为回退
const createFallbackTexture = () => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const context = canvas.getContext('2d');

  if (context) {
    // 创建棋盘格图案
    const size = 32;
    for (let x = 0; x < canvas.width; x += size) {
      for (let y = 0; y < canvas.height; y += size) {
        const isEven = (x / size + y / size) % 2 === 0;
        context.fillStyle = isEven ? '#CCCCCC' : '#888888';
        context.fillRect(x, y, size, size);
      }
    }

    // 在中心添加标记
    context.fillStyle = '#FF0000';
    context.font = '14px Arial';
    context.textAlign = 'center';
    context.fillText('纹理缺失', canvas.width / 2, canvas.height / 2);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
};

// 加载书本模型
const loadBookModel = () => {
  loadingText.value = '正在加载书本模型...';

  loader.load(
      '/src/assets/3Dmodel/celestail_hub/celestail_hub.gltf',
      async (gltf) => {
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
          scene.add(bookModel);

          // 加载纹理
          loadingText.value = '正在加载纹理...';
          // 确保纹理路径是字符串（处理 Vite/webpack 导入的情况）
          const mainTexturePath = typeof mainTextureImage === 'string'
              ? mainTextureImage
              : mainTextureImage.default || mainTextureImage;

          try {
            await loadTexture(mainTexturePath, 'mainTexture');

            // 应用纹理到模型
            applyTexturesToModel();
          } catch (textureErr) {
            console.error('纹理加载或应用失败，但继续显示模型:', textureErr);
            loadingText.value = '纹理加载失败，但模型已加载';
            // 仍然继续，模型会以默认材质显示
          }

          // 完成加载
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

// 应用纹理到模型
const applyTexturesToModel = () => {
  if (!bookModel || !loadedTextures.mainTexture) {
    console.error('无法应用纹理：模型或纹理不可用');
    return;
  }

  // 设置纹理属性
  const texture = loadedTextures.mainTexture;
  texture.flipY = false; // GLTF模型通常不需要翻转Y轴
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.magFilter = THREE.LinearFilter;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.needsUpdate = true; // 确保纹理更新

  // 遍历模型中的所有网格对象并应用纹理
  bookModel.traverse((child) => {
    if (child.isMesh) {
      // 确保材质存在
      if (!child.material) {
        // 如果没有材质，创建一个新的基础材质
        child.material = new THREE.MeshStandardMaterial({
          map: texture,
          metalness: 0.3,
          roughness: 0.7
        });
      } else if (Array.isArray(child.material)) {
        // 如果材质是数组，为每个材质应用纹理
        child.material = child.material.map((mat) => {
          if (mat.isMaterial) {
            const newMat = mat.clone();
            newMat.map = texture;
            // 优化材质属性
            newMat.metalness = Math.max(newMat.metalness || 0, 0.3);
            newMat.roughness = Math.min(newMat.roughness || 1, 0.7);
            return newMat;
          }
          return mat;
        });
      } else {
        // 单个材质的情况
        try {
          // 克隆材质以避免修改原始材质
          const newMat = child.material.clone();
          newMat.map = texture;
          // 优化材质属性
          newMat.metalness = Math.max(newMat.metalness || 0, 0.3);
          newMat.roughness = Math.min(newMat.roughness || 1, 0.7);
          child.material = newMat;
        } catch (error) {
          console.warn('无法克隆材质，创建新材质:', error);
          // 如果克隆失败，创建一个新的材质
          child.material = new THREE.MeshStandardMaterial({
            map: texture,
            metalness: 0.3,
            roughness: 0.7
          });
        }
      }

      // 确保几何体的UV属性存在
      if (child.geometry && !child.geometry.attributes.uv) {
        console.warn('网格缺少UV映射，创建简单的平面UV');
        createSimpleUVs(child.geometry);
      }

      // 更新材质
      if (child.material) {
        if (Array.isArray(child.material)) {
          child.material.forEach(mat => {
            if (mat.needsUpdate) {
              mat.needsUpdate = true;
            }
          });
        } else if (child.material.needsUpdate !== undefined) {
          child.material.needsUpdate = true;
        }
      }
    }
  });

};

// 为缺少UV的几何体创建简单的UV映射
const createSimpleUVs = (geometry) => {
  try {
    const positions = geometry.attributes.position.array;
    const uvs = new Float32Array(positions.length / 3 * 2);

    // 计算包围盒以归一化UV
    const box = new THREE.Box3().setFromBufferAttribute(geometry.attributes.position);
    const size = new THREE.Vector3();
    box.getSize(size);
    const center = new THREE.Vector3();
    box.getCenter(center);

    // 为每个顶点创建UV坐标（基于X和Y坐标归一化）
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];

      // 归一化到0-1范围
      const u = ((x - box.min.x) / size.x);
      const v = ((y - box.min.y) / size.y);

      // 设置UV坐标
      const uvIndex = (i / 3) * 2;
      uvs[uvIndex] = u;
      uvs[uvIndex + 1] = v;
    }

    // 添加UV属性到几何体
    geometry.setAttribute('uv', new THREE.BufferAttribute(uvs, 2));
  } catch (error) {
    console.error('创建UV映射时出错:', error);
  }
};

// 处理鼠标进入
const handleMouseEnter = () => {
  isMouseOver = true;
  autoRotateEnabled = false; // 鼠标在画布上时禁用自动旋转
};

// 处理鼠标移动
const handleMouseMove = (event) => {
  if (!canvas) return;

  isMouseOver = true;
  autoRotateEnabled = false; // 鼠标移动时禁用自动旋转

  const rect = canvas.getBoundingClientRect();
  // 计算鼠标在画布中的归一化位置 (-1 到 1)
  mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
  mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

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
  autoRotationSpeed.x = (0.001 + Math.random() * 0.003) * (Math.random() > 0.5 ? 1 : -1);
  autoRotationSpeed.y = (0.001 + Math.random() * 0.003) * (Math.random() > 0.5 ? 1 : -1);
  autoRotationSpeed.z = (0.0005 + Math.random() * 0.002) * (Math.random() > 0.5 ? 1 : -1);
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
        autoRotationSpeed.x = (0.001 + Math.random() * 0.003) * (Math.random() > 0.5 ? 1 : -1);
        autoRotationSpeed.y = (0.001 + Math.random() * 0.003) * (Math.random() > 0.5 ? 1 : -1);
        autoRotationSpeed.z = (0.0005 + Math.random() * 0.002) * (Math.random() > 0.5 ? 1 : -1);
      }

      // 平滑过渡到目标旋转
      currentRotation.x += (autoRotationTarget.x - currentRotation.x) * 0.01;
      currentRotation.y += (autoRotationTarget.y - currentRotation.y) * 0.01;

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

    // 清理纹理
    try {
      Object.values(loadedTextures).forEach(texture => {
        if (texture && typeof texture.dispose === 'function') {
          try {
            texture.dispose();
          } catch (err) {
            console.warn('清理纹理时出错:', err);
          }
        }
      });
      loadedTextures = {};
    } catch (err) {
      console.warn('清理纹理集合时出错:', err);
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

      } catch (err) {
        console.warn('清理场景时出错:', err);
      }
    }

    // 清理加载器
    if (textureLoader) {
      // TextureLoader没有dispose方法，但我们将其设为null
      textureLoader = null;
    }

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
  width: 48px;
  height: 48px;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
}

.webgl-canvas {
  width: 48px;
  height: 48px;
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