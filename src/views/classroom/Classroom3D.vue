<template>
  <canvas ref="canvasRef" class="webgl_7"></canvas>
</template>
  
<script setup>
  import { onMounted, onBeforeUnmount, ref, computed } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import * as THREE from 'three';
  import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
  import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
  import { ModelClickHandler } from '@/utils/threeModelClickHandler';
  import { Sky } from 'three/examples/jsm/objects/Sky.js';

  const modelClickHandler = new ModelClickHandler();
  const router = useRouter();
  const route = useRoute();

  // 获取教室大小参数，默认为classroomMiddle
  const classroomSize = computed(() => {
    const sizeParam = route.query.size;
    return sizeParam ? String(sizeParam) : 'classroomMedium';
  });

  // classSide 使用与 classroomSize 相同的值，确保模型加载正确
  const classSide = computed(() => classroomSize.value);
  
  // 获取行数参数，默认为4，最大限制为12
  const rowCount = computed(() => {
    const rowParam = route.query.rowCount;
    const rowValue = rowParam ? parseInt(String(rowParam), 10) : 4;
    // 添加合理的边界检查，防止实例数量过大
    return Math.min(Math.max(rowValue, 1), 12);
  });
  
  // 获取列数参数，默认为3，最大限制为12
  const columnCount = computed(() => {
    const colParam = route.query.colCount;
    const colValue = colParam ? parseInt(String(colParam), 10) : 3;
    // 添加合理的边界检查，防止实例数量过大
    return Math.min(Math.max(colValue, 1), 12);
  });
  
  // 计算实例数量，添加上限检查（最大50个实例，进一步降低以避免类型化数组错误）
  const instanceCount = computed(() => {
    const count = rowCount.value * columnCount.value;
    // 进一步降低上限以避免类型化数组错误
    return Math.min(count, 50);
  });

  let canvas = null;
  let renderer = null;
  let scene = null;
  let camera = null;
  let controls = null;
  let classroomModel = null;
  let loader = null;
  let classroomXLenght = 1;
  let classroomZLenght = 1;

  
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
    canvas=document.querySelector('.webgl_7');
    // 场景
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0a0a1a);
    
    /**
     * 相机
     */
     camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 1000);
     camera.position.set(2, 4, 5); // 设置相机位置
     scene.add(camera);
     
    // 相机控制
    controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    
    // 设置视角限制，确保用户视野始终聚焦在模型上
    // 1. 设置最小和最大距离限制，防止用户拉得太远或太近
    controls.minDistance = 2; // 最小距离
    controls.maxDistance = 6; // 最大距离
    
    // 2. 设置垂直旋转角度限制（弧度）
    // 0 表示可以完全向下看，Math.PI 表示可以完全向上看
    // 这里限制为稍微向下和向上的范围
    controls.minPolarAngle = Math.PI * 0.05; // 最小垂直角度（稍微向下看）
    controls.maxPolarAngle = Math.PI * 0.5; // 最大垂直角度（稍微向上看）
    
    // 3. 设置水平旋转角度限制（弧度）
    // 限制用户只能在一定范围内水平旋转，比如180度（Math.PI）范围
    controls.minAzimuthAngle = -Math.PI * 0.5; // 最左角度
    controls.maxAzimuthAngle = Math.PI * 0.5; // 最右角度
    
    // 4. 设置目标点，确保相机始终围绕模型中心旋转
    controls.target.set(0, 1, 0); // 将目标点设置为教室中心
    
    // 5. 限制平移范围（如果启用了平移）
    controls.screenSpacePanning = false; // 使用轨道式平移而非屏幕空间平移
    controls.maxPanDistance = 2; // 最大平移距离限制

    // 渲染器
    renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const material = new THREE.MeshStandardMaterial({
      color: 0xe67e22,  // 温暖橙色
      metalness: 0.1,
      roughness: 0.7
    });

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

      renderer.toneMappingExposure = effectController.exposure;
    }    

    guiChanged();

    /**
   * 精灵模型管理类
   * 负责精灵模型的统一管理，包括位置管理、用户映射和纹理更新
   */
  class SpriteManager {
    /**
     * 构造函数
     */
    constructor() {
      // 精灵位置数组，私有属性
      this._positions = null;
      // 位置索引到用户ID的映射哈希表
      this._positionMap = new Map();
      // 默认纹理存储
      this._defaultTexture = null;
      // 初始化标志
      this._initialized = false;
      // 精灵实例数组
      this._sprites = [];
      // 精灵材质数组
      this._spriteMaterials = [];
      // 用户纹理映射
      this._userTextures = new Map();
      // 场景引用
      this._scene = null;
    }

    /**
     * 初始化函数
     * @param {number} spriteCount - 精灵数量，必须为正整数
     * @param {object} defaultTexture - 默认纹理对象
     * @throws {Error} 当参数类型或值无效时抛出错误
     */
    initialize(spriteCount, defaultTexture) {
      try {
        // 参数类型验证
        if (typeof spriteCount !== 'number' || !Number.isInteger(spriteCount) || spriteCount <= 0) {
          throw new Error('精灵数量必须是正整数');
        }
        
        if (typeof defaultTexture !== 'object' || defaultTexture === null) {
          throw new Error('默认纹理必须是有效的对象类型');
        }
        
        // 避免重复初始化
        if (this._initialized) {
          throw new Error('精灵管理器已经初始化');
        }
        
        // 初始化位置数组
        this._positions = new Array(spriteCount);
        
        // 初始化默认纹理
        this._defaultTexture = defaultTexture;
        
        // 初始化精灵实例数组
        this._sprites = [];
        // 初始化精灵材质数组
        this._spriteMaterials = [];
        // 初始化用户纹理映射
        this._userTextures = new Map();
        
        // 标记为已初始化
        this._initialized = true;
        
        console.log(`精灵管理器初始化完成，精灵数量：${spriteCount}`);
      } catch (error) {
        console.error('精灵管理器初始化失败:', error);
        // 重置状态以允许重新初始化
        this._positions = null;
        this._defaultTexture = null;
        this._sprites = [];
        this._spriteMaterials = [];
        this._userTextures = new Map();
        this._initialized = false;
        throw error;
      }
    }

    /**
     * 设置精灵位置数组
     * @param {Array<THREE.Vector3>} positions - 位置数组
     * @throws {Error} 当位置数组无效或已初始化时抛出错误
     */
    setPositions(positions) {
      try {
        // 验证初始化状态
        if (!this._initialized) {
          throw new Error('精灵管理器尚未初始化');
        }
        
        // 验证位置数组
        if (!Array.isArray(positions) || positions.length !== this._positions.length) {
          throw new Error('位置数组长度必须与精灵数量匹配');
        }
        
        // 复制位置数据
        for (let i = 0; i < positions.length; i++) {
          // 验证每个位置是否为有效的Vector3对象
          if (!(positions[i] instanceof THREE.Vector3)) {
            throw new Error(`位置索引 ${i} 必须是THREE.Vector3对象`);
          }
          // 深拷贝Vector3对象
          this._positions[i] = positions[i].clone();
        }
        
        // 冻结位置数组，使其不可变更
        Object.freeze(this._positions);
        
        console.log('精灵位置数组已设置并冻结');
      } catch (error) {
        console.error('设置精灵位置失败:', error);
        throw error;
      }
    }
    
    /**
     * 设置场景引用
     * @param {THREE.Scene} scene - Three.js场景对象
     */
    setScene(scene) {
      if (!(scene instanceof THREE.Scene)) {
        throw new Error('场景必须是有效的THREE.Scene对象');
      }
      this._scene = scene;
    }
    
    /**
     * 创建所有精灵模型实例
     * @returns {boolean} 创建是否成功
     */
    createSpriteInstances() {
      try {
        // 验证初始化状态
        if (!this._initialized) {
          throw new Error('精灵管理器尚未初始化');
        }
        
        // 验证场景引用
        if (!this._scene) {
          throw new Error('场景引用未设置');
        }
        
        // 验证位置数组
        if (!this._positions || this._positions.length === 0) {
          throw new Error('精灵位置数组未设置或为空');
        }
        
        // 清理现有的精灵实例
        this.clearSpriteInstances();
        
        // 为每个位置创建精灵实例
        for (let i = 0; i < this._positions.length; i++) {
          const position = this._positions[i];
          
          // 创建精灵材质，使用默认纹理
          const spriteMaterial = new THREE.SpriteMaterial({
            map: this._defaultTexture,
            transparent: true,
            opacity: 0.9,
            depthWrite: false, // 确保精灵总是正确渲染在3D模型前面
            blending: THREE.NormalBlending
          });
          
          // 创建精灵对象
          const sprite = new THREE.Sprite(spriteMaterial);
          
          // 设置精灵位置
          sprite.position.copy(position);
          
          // 设置精灵大小
          sprite.scale.set(0.5, 0.5, 1);
          
          // 设置精灵名称便于调试
          sprite.name = `sprite_${i}`;
          
          // 将精灵添加到场景
          this._scene.add(sprite);
          
          // 存储精灵和材质引用
          this._sprites[i] = sprite;
          this._spriteMaterials[i] = spriteMaterial;
        }
        
        console.log(`成功创建 ${this._sprites.length} 个精灵实例`);
        return true;
      } catch (error) {
        console.error('创建精灵实例失败:', error);
        // 清理已创建的精灵
        this.clearSpriteInstances();
        throw error;
      }
    }
    
    /**
     * 清理所有精灵实例
     */
    clearSpriteInstances() {
      if (this._scene) {
        for (const sprite of this._sprites) {
          if (sprite) {
            this._scene.remove(sprite);
          }
        }
      }
      
      // 清空数组
      this._sprites.length = 0;
      this._spriteMaterials.length = 0;
      console.log('精灵实例已清理');
    }

    /**
     * 获取精灵位置
     * @param {number} positionIndex - 位置索引
     * @returns {THREE.Vector3} 精灵位置
     * @throws {Error} 当位置索引无效时抛出错误
     */
    getPosition(positionIndex) {
      this._validatePositionIndex(positionIndex);
      return this._positions[positionIndex].clone();
    }

    /**
     * 精灵信息更新函数
     * @param {string|number} userId - 用户ID
     * @param {object} userTexture - 用户纹理对象
     * @param {number} positionIndex - 位置索引
     * @returns {boolean} 更新是否成功
     * @throws {Error} 当参数无效或位置已被占用时抛出错误
     */
    updateSpriteInfo(userId, userTexture, positionIndex) {
      try {
        // 验证初始化状态
        if (!this._initialized) {
          throw new Error('精灵管理器尚未初始化');
        }
        
        // 验证用户ID
        if (userId === undefined || userId === null || userId === '') {
          throw new Error('用户ID不能为空');
        }
        
        // 验证用户纹理
        if (typeof userTexture !== 'object' || userTexture === null) {
          throw new Error('用户纹理必须是有效的对象类型');
        }
        
        // 验证位置索引
        this._validatePositionIndex(positionIndex);
        
        // 检查用户ID是否已被其他位置索引映射
        for (const [index, id] of this._positionMap.entries()) {
          if (id === userId && index !== positionIndex) {
            // 如果用户已在其他位置，先清除原位置的数据
            this._updateSpriteTexture(index, this._defaultTexture, 0.9);
            this._userTextures.delete(index);
            console.log(`用户 ${userId} 已从位置索引 ${index} 移除`);
            break;
          }
        }
        
        // 检查位置索引是否已被占用
        if (this._positionMap.has(positionIndex)) {
          const existingUserId = this._positionMap.get(positionIndex);
          if (existingUserId !== userId) {
            // 如果位置已被其他用户占用，清除原用户数据
            this._userTextures.delete(positionIndex);
            console.log(`位置索引 ${positionIndex} 上的用户 ${existingUserId} 已移除`);
          }
        }
        
        // 更新哈希表和用户纹理映射
        this._positionMap.set(positionIndex, userId);
        this._userTextures.set(positionIndex, userTexture);
        
        // 更新精灵纹理
        if (this._sprites[positionIndex] && this._spriteMaterials[positionIndex]) {
          this._updateSpriteTexture(positionIndex, userTexture, 1.0);
        }
        
        console.log(`用户 ${userId} 已分配到位置索引 ${positionIndex}`);
        return true;
      } catch (error) {
        console.error(`更新精灵信息失败 (用户: ${userId}, 位置: ${positionIndex}):`, error);
        throw error;
      }
    }
    
    /**
     * 更新精灵纹理和可见性属性
     * @private
     */
    _updateSpriteTexture(positionIndex, texture, opacity) {
      if (this._sprites[positionIndex] && this._spriteMaterials[positionIndex]) {
        try {
          // 更新纹理
          this._spriteMaterials[positionIndex].map = texture;
          this._spriteMaterials[positionIndex].needsUpdate = true;
          
          // 更新透明度和可见性属性
          this._spriteMaterials[positionIndex].opacity = opacity;
          this._sprites[positionIndex].visible = opacity > 0;
          
          // 确保精灵总是面向相机
          this._sprites[positionIndex].lookAt(camera.position);
        } catch (error) {
          console.error(`更新位置 ${positionIndex} 的精灵纹理失败:`, error);
        }
      }
    }

    /**
     * 用户数据删除函数
     * @param {string|number} userId - 用户ID
     * @returns {boolean} 删除是否成功
     * @throws {Error} 当用户ID不存在时抛出错误
     */
    removeUserData(userId) {
      try {
        // 验证初始化状态
        if (!this._initialized) {
          throw new Error('精灵管理器尚未初始化');
        }
        
        // 查找用户ID对应的位置索引
        let positionIndex = -1;
        for (const [index, id] of this._positionMap.entries()) {
          if (id === userId) {
            positionIndex = index;
            break;
          }
        }
        
        // 验证用户ID是否存在
        if (positionIndex === -1) {
          throw new Error(`用户ID ${userId} 不存在`);
        }
        
        // 从哈希表和用户纹理映射中删除
        this._positionMap.delete(positionIndex);
        this._userTextures.delete(positionIndex);
        
        // 重置精灵纹理为默认纹理
        if (this._sprites[positionIndex] && this._spriteMaterials[positionIndex]) {
          this._updateSpriteTexture(positionIndex, this._defaultTexture, 0.9);
        }
        
        console.log(`用户 ${userId} 的数据已从位置索引 ${positionIndex} 删除`);
        return true;
      } catch (error) {
        console.error(`删除用户数据失败 (用户: ${userId}):`, error);
        throw error;
      }
    }

    /**
     * 获取用户ID对应的位置索引
     * @param {string|number} userId - 用户ID
     * @returns {number|null} 位置索引，如果不存在则返回null
     */
    getPositionIndexByUserId(userId) {
      for (const [index, id] of this._positionMap.entries()) {
        if (id === userId) {
          return index;
        }
      }
      return null;
    }

    /**
     * 获取位置索引对应的用户ID
     * @param {number} positionIndex - 位置索引
     * @returns {string|number|null} 用户ID，如果不存在则返回null
     */
    getUserIdByPositionIndex(positionIndex) {
      if (this._positionMap.has(positionIndex)) {
        return this._positionMap.get(positionIndex);
      }
      return null;
    }

    /**
     * 验证位置索引的有效性
     * @param {number} positionIndex - 位置索引
     * @throws {Error} 当位置索引无效时抛出错误
     * @private
     */
    _validatePositionIndex(positionIndex) {
      if (typeof positionIndex !== 'number' || !Number.isInteger(positionIndex)) {
        throw new Error('位置索引必须是整数');
      }
      
      if (this._positions === null || positionIndex < 0 || positionIndex >= this._positions.length) {
        throw new Error(`位置索引 ${positionIndex} 超出有效范围`);
      }
    }
    
    /**
     * 获取精灵数量
     * @returns {number} 精灵数量
     */
    get spriteCount() {
      return this._positions ? this._positions.length : 0;
    }
    
    /**
     * 获取初始化状态
     * @returns {boolean} 是否已初始化
     */
    get isInitialized() {
      return this._initialized;
    }
    
    /**
     * 获取默认纹理
     * @returns {object} 默认纹理
     */
    get defaultTexture() {
      return this._defaultTexture;
    }
  }
  
  // 创建精灵管理器实例
  const spriteManager = new SpriteManager();
  
  /**
   * 精灵模型
  */
  const spritePositions = [];

    /**
     * 加载教室模型
     */
    modelClickHandler.init(scene, camera, renderer.domElement);
    loader = new GLTFLoader();
    
    // 加载模型 - 顺序加载实现
    const loadModelsSequentially = async () => {
      try {
        // 加载第一个模型（教室）
      await new Promise((resolve, reject) => {
        loader.load(
          `/src/assets/3Dmodel/classroom/classroomMedium.gltf`,
            (gltf) => {
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
              classroomModel.traverse((child) => {
                // 检查是否为光源对象
                if (child.isLight) {
                  // 点光源增强处理
                  if (child.isPointLight) {
                    // 设置点光源的强度为0.2
                    child.intensity = 8;
                    // 设置合适的衰减
                    child.decay = 2;
                    // 增加光源范围
                    child.distance = Math.max(child.distance || 10, 15);
                  }
                }
              });

              /**
              * 射线选择
              */
              modelClickHandler.addClickListener(
                classroomModel,
                '大黑板',
                (element, event, intersection) => {
                  // 使用Vue Router跳转到'/html-forest'界面
                  console.log('大黑板已点击');
                }
              );

              scene.add(classroomModel);
              resolve(true);
            },
            (xhr) => {
              // console.log((xhr.loaded / xhr.total * 100) + '% loaded');
            },
            (error) => {
              console.error('An error happened1', error);
              reject(error);
            }
          );
        });

        // 第一个模型加载完成后，加载第二个模型（桌椅）
        await new Promise((resolve, reject) => {
          loader.load(
          '/src/assets/3Dmodel/desk_Chair/desk_Chair.glb',
            (gltf) => {
              const mesh = gltf.scene.children.find(child => child.isMesh);
              const geometry = mesh.geometry;

              // 添加安全检查，确保实例数量不会导致类型化数组错误
              const safeInstanceCount = Math.min(instanceCount.value, 50);
              const instancedMesh = new THREE.InstancedMesh(geometry, material, safeInstanceCount);

              classroomZLenght-=1;
              
              // 为每个实例设置不同的位置和旋转
              const matrix = new THREE.Matrix4();
              for (let i = 0; i < safeInstanceCount; i++) {
                // 计算位置
                const x = 1.5*Math.floor(i/columnCount.value)-2;
                const y = 0.25;
                const z = 3 - classroomZLenght/columnCount.value*(0.5 + i%columnCount.value);

                // 存储位置用于精灵更新
                spritePositions.push(new THREE.Vector3(x, y+1.25, z));

                // 更新矩阵
                matrix.compose(
                  new THREE.Vector3(x, y, z),
                  new THREE.Quaternion().setFromEuler(new THREE.Euler(0, Math.PI / 2, 0)),
                  new THREE.Vector3(1, 1, 1)
                );
                
                // 应用到实例
                instancedMesh.setMatrixAt(i, matrix);
              }
              instancedMesh.instanceMatrix.needsUpdate = true;

              // 添加到场景
              scene.add(instancedMesh);    
              
              /**
               * 为桌椅模型添加鼠标悬浮监听
               */
              modelClickHandler.addHoverListener(
                instancedMesh,
                (child) => child.isMesh || child.isInstancedMesh,
                // 悬浮进入回调函数
                (element, event, intersection) => {
                  // 保存实例原始变换信息的Map
                  if (!element._originalTransforms) {
                    element._originalTransforms = new Map();
                  }
                  
                  // 对于实例化网格，处理单个实例的变换
                  if (element.isInstancedMesh && intersection.instanceId !== undefined) {
                    const instanceId = intersection.instanceId;
                    
                    // 检查当前是否已经是悬浮状态
                    const isHovered = element._originalTransforms.has(instanceId);
                    
                    // 如果是新进入悬浮状态
                    if (!isHovered) {
                      // 保存原始变换信息
                      const originalMatrix = new THREE.Matrix4();
                      element.getMatrixAt(instanceId, originalMatrix);
                      element._originalTransforms.set(instanceId, originalMatrix.clone());
                       
                      // 创建矩阵和向量用于计算新变换
                      const position = new THREE.Vector3();
                      const quaternion = new THREE.Quaternion();
                      const scale = new THREE.Vector3();
                       
                      // 从原始矩阵中提取位置、旋转和缩放
                      originalMatrix.decompose(position, quaternion, scale);
                       
                      // 计算缩放后的Y轴偏移，使缩放后的模型底部保持在原位置附近
                      const yOffset = 0.05;
                       
                      // 更新位置和缩放
                      position.y += yOffset;
                      scale.set(1.2, 1.2, 1.2);
                       
                      // 创建新矩阵
                      const newMatrix = new THREE.Matrix4();
                      newMatrix.compose(position, quaternion, scale);
                       
                      // 应用到实例
                      element.setMatrixAt(instanceId, newMatrix);
                      element.instanceMatrix.needsUpdate = true;
                      
                    }
                  }
                },
                // 悬浮离开回调函数（第四个参数）
                (element, event) => {
                  // 对于实例化网格，恢复所有被修改的实例
                  if (element.isInstancedMesh && element._originalTransforms) {
                    // 遍历所有保存的实例
                    element._originalTransforms.forEach((originalMatrix, instanceId) => {
                      // 恢复原始变换信息
                      element.setMatrixAt(instanceId, originalMatrix);                    
                    });
                    
                    // 标记实例矩阵需要更新
                    element.instanceMatrix.needsUpdate = true;
                    
                    // 清空存储的原始变换信息
                    element._originalTransforms.clear();
                  }
                }
              );
  
              resolve(true);
            },
            undefined,
            (error) => {
              console.error('An error happened2', error);
              reject(error);
            }
          );
        });

        await new Promise((resolve) => {
          // 初始化精灵管理器
          // 创建默认纹理
          const defaultSpriteTextureLoader = new THREE.TextureLoader();
          const defaultSpriteTexture = defaultSpriteTextureLoader.load('/src/assets/image/anonymous-user.png');
          
          try {
            // 初始化精灵管理器
            spriteManager.initialize(spritePositions.length, defaultSpriteTexture);
            // 设置精灵位置数组
            spriteManager.setPositions(spritePositions);
            console.log('精灵管理器已成功配置');
            
            // 示例：更新精灵信息（在实际应用中，这些会根据用户加入事件触发）
            // 这里仅作为演示，实际使用时需要在合适的地方调用
            /*
            // 创建用户纹理（示例）
            const userTexture = new THREE.Texture();
            
            // 更新精灵信息
            try {
              spriteManager.updateSpriteInfo('student_1', userTexture, 0);
              spriteManager.updateSpriteInfo('student_2', userTexture, 1);
              console.log('示例用户已添加到精灵管理器');
            } catch (error) {
              console.error('添加用户示例失败:', error);
            }
            
            // 获取用户位置信息示例
            try {
              const positionIndex = spriteManager.getPositionIndexByUserId('student_1');
              if (positionIndex !== null) {
                const position = spriteManager.getPosition(positionIndex);
                console.log(`学生1的位置: ${position.x}, ${position.y}, ${position.z}`);
              }
            } catch (error) {
              console.error('获取用户位置失败:', error);
            }
            
            // 删除用户数据示例（在实际应用中，会根据用户离开事件触发）
            try {
              spriteManager.removeUserData('student_1');
              console.log('学生1的信息已删除');
            } catch (error) {
              console.error('删除用户示例失败:', error);
            }
            */
          } catch (error) {
            console.error('精灵管理器初始化失败:', error);
          }

          const userTextureLoader = new THREE.TextureLoader();
          const userTexture= userTextureLoader.load('/src/assets/image/zhuanruzijin.png');
          
          // 设置场景引用
          spriteManager.setScene(scene);
          
          // 创建精灵实例
          try {
            spriteManager.createSpriteInstances();
            console.log('精灵实例创建成功');
          } catch (error) {
            console.error('精灵实例创建失败:', error);
          }
          
          // 更新精灵信息
          try {
            spriteManager.updateSpriteInfo('student_1', userTexture, 0);
            console.log('精灵信息更新成功');
          } catch (error) {
            console.error('精灵信息更新失败:', error);
          }
        });
      } catch (error) {
        console.error('模型加载失败:', error);
      }
    };

    // 启动模型加载
    loadModelsSequentially()


    
    /**
     * 窗口大小调整
     */
    window.addEventListener('resize', () => {
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
     * 帧更新(动画)
     */
    const clock = new THREE.Clock();
    const tick = () => {
      const elapsedTime = clock.getElapsedTime();
      
      
      // 更新控制器
      controls.update();
      
      // 渲染
      renderer.render(scene, camera);
    
      // 继续调用 tick 函数
      requestAnimationFrame(tick);
    };
  
    // 启动动画循环
    tick();
  };
  
  onMounted(() => {
    initThree();
  });
  
  onBeforeUnmount(() => {
    
    // 清理点击处理器资源
    modelClickHandler.dispose();
  
    // 清理Three.js资源
    if (renderer) {
      renderer.dispose();
      renderer.domElement.remove();
    }
    
    // 清理场景中的对象
    if (scene) {
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
    }
    
    // 清理加载器
    if (loader) {
      if (loader.manager && typeof loader.manager.dispose === 'function') {
        loader.manager.dispose();
      }
    }
  });
  </script>
  