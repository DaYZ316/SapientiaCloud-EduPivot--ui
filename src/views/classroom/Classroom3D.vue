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
  import { getCourseRecordById } from '@/api/classroom/courseRecord';

  const modelClickHandler = new ModelClickHandler();
  const router = useRouter();
  const route = useRoute();
  // 课程记录状态
  const courseRecord = ref(null);
  const loadingRecord = ref(false);
  const recordError = ref(null);

  // 从课程记录获取教室大小
  const classroomSize = computed(() => {
    // 优先从课程记录获取，没有则使用默认值
    if (courseRecord.value && courseRecord.value.modelType) {
      return courseRecord.value.modelType;
    }
    return 'classroomMini';
  });
  
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
        console.warn('未提供课程记录ID，使用默认教室配置');
        return;
      }
      
      // 调用API获取课程记录
      const response = await getCourseRecordById(String(recordId));
      courseRecord.value = response?.data || null;
      
      if (!courseRecord.value) {
        console.warn('获取到的课程记录为空');
      }
    } catch (error) {
      console.error('获取课程记录失败:', error);
      recordError.value = '获取课程记录失败，使用默认配置';
      // 发生错误时不阻止组件继续加载，而是使用默认配置
    } finally {
      loadingRecord.value = false;
    }
  };

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

    // 渲染器
    renderer = new THREE.WebGLRenderer({ canvas });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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

    // 创建精灵管理器实例
    const spriteManager = new SpriteManager();

    /**
     * 精灵模型
    */
    const spritePositions = [];

    console.log(instanceCount);

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
          `/src/assets/3Dmodel/classroom/classroomPro.gltf`,
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
          const startTime = performance.now();
          console.log('开始批量实例化桌椅模型...');
          
          loader.load(
          '/src/assets/3Dmodel/desk_Chair/deskAndChair.gltf',
            (gltf) => {
              try {
                  console.log('桌椅模型加载成功', gltf.scene);
                  // 整体模型处理管理器 - 增强版
                  const modelInstanceManager = {
                    // 识别并保存模型的子组件结构
                    identifyModelStructure: function(object) {
                      const subComponents = [];
                      
                      // 假设模型的直接子节点是主要子组件
                      if (object.children.length > 0) {
                        console.log('识别到模型层级结构');
                        
                        // 遍历所有直接子节点
                        object.children.forEach((child, index) => {
                          if (child.isObject3D && !child.isMesh) { // 识别子组件（非网格对象）
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
                              console.log(`识别到子组件: ${componentInfo.name}，包含 ${componentInfo.meshes.length} 个网格`);
                            }
                          }
                        });
                      }
                      
                      // 如果没有识别到子组件结构，回退到原有的网格收集方式
                      if (subComponents.length === 0) {
                        console.log('未识别到子组件结构，使用默认网格收集方式');
                        const defaultMeshes = [];
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
                    collectMeshesInComponent: function(object, meshes = []) {
                      if (object.isMesh) {
                        if (object.visible && object.geometry) {
                          // 保存网格及其原始位置信息（相对于父组件）
                          meshes.push({
                            mesh: object,
                            originalPosition: object.position.clone(),
                            originalQuaternion: object.quaternion.clone(),
                            originalScale: object.scale.clone()
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
                    createGroupedInstancedMeshes: function(subComponents, count) {
                      const instancedMeshGroups = [];
                      
                      // 为每个子组件中的网格创建实例化网格
                      subComponents.forEach((component, componentIndex) => {
                        component.meshes.forEach((meshData, meshIndex) => {
                          const mesh = meshData.mesh;
                          try {
                            // 重用几何体
                            const geometry = mesh.geometry;
                            // 克隆材质
                            const material = mesh.material.clone ? mesh.material.clone() : mesh.material;
                            
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
                            console.warn(`创建实例化网格失败 (组件 ${component.name}, 索引 ${meshIndex}):`, err);
                          }
                        });
                      });
                      
                      return instancedMeshGroups;
                    },
                    
                    // 批量设置实例矩阵 - 保持模型内部相对位置
                    setInstanceMatricesAsGroup: function(instancedMeshGroups, startIndex, count, positionCallback) {
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
                        instancedMeshGroups.forEach(instancedMesh => {
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
                    disposeResources: function(instancedMeshGroups) {
                      instancedMeshGroups.forEach(mesh => {
                        if (mesh && mesh.dispose) {
                          mesh.dispose();
                        }
                      });
                    }
                  };
                  
                  // 性能监控开始
                  const findMeshesStartTime = performance.now();
                  
                  // 1. 识别模型结构并保存子组件和网格信息
                  const subComponents = modelInstanceManager.identifyModelStructure(gltf.scene);
                  const findMeshesEndTime = performance.now();
                  
                  // 计算总网格数量
                  const totalMeshCount = subComponents.reduce((sum, component) => sum + component.meshes.length, 0);
                  console.log(`识别到 ${subComponents.length} 个子组件，总计 ${totalMeshCount} 个网格对象 (耗时: ${(findMeshesEndTime - findMeshesStartTime).toFixed(2)}ms)`);
                  
                  if (totalMeshCount === 0) {
                    throw new Error('未在桌椅模型中找到任何网格对象');
                  }
                  
                  // 2. 智能计算安全的实例数量
                  const hardwareLimit = 65536; // WebGL 1.0 限制
                  const maxAllowedInstances = Math.min(instanceCount.value, 1000, hardwareLimit); // 综合限制
                  console.log(`批量实例化数量: ${maxAllowedInstances} (原始请求: ${instanceCount.value})`);
                  
                  // 3. 创建整体模型的实例化网格集合
                  const instancedMeshGroups = modelInstanceManager.createGroupedInstancedMeshes(subComponents, maxAllowedInstances);
                  const createMeshesEndTime = performance.now();
                  console.log(`创建实例化网格耗时: ${(createMeshesEndTime - findMeshesEndTime).toFixed(2)}ms`);
                  
                  // 4. 批量计算位置和设置矩阵（优化内存使用）
                  // classroomZLenght -= 1;
                  const matrixUpdateStartTime = performance.now();
                  
                  // 优化的位置计算函数 - 直接修改传入的向量
                  const calculatePosition = (instanceId, position) => {
                    position.x = 2 * Math.floor(instanceId / columnCount.value) - classroomXLenght/2 + 6;
                    position.y = 0.0;
                    position.z = classroomZLenght/2 - classroomZLenght / columnCount.value * (0.5 + instanceId % columnCount.value);
                    return position;
                  };
                  
                  // 批量设置矩阵 - 保持内部组件相对位置
                  modelInstanceManager.setInstanceMatricesAsGroup(instancedMeshGroups, 0, maxAllowedInstances, calculatePosition);
                  
                  const matrixUpdateEndTime = performance.now();
                  console.log(`矩阵更新耗时: ${(matrixUpdateEndTime - matrixUpdateStartTime).toFixed(2)}ms`);
                  
                  // 5. 批量存储精灵位置 - 优化内存分配
                  const spritePositionsStartTime = performance.now();
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
                  
                  const spritePositionsEndTime = performance.now();
                  console.log(`精灵位置计算耗时: ${(spritePositionsEndTime - spritePositionsStartTime).toFixed(2)}ms`);
                  
                  // 6. 批量添加到场景
                  const addToSceneStartTime = performance.now();
                  instancedMeshGroups.forEach(instancedMesh => {
                    scene.add(instancedMesh);
                  });
                  const addToSceneEndTime = performance.now();
                  console.log(`添加到场景耗时: ${(addToSceneEndTime - addToSceneStartTime).toFixed(2)}ms`);
                  
                  // 7. 存储实例化网格引用以便后续清理
                  if (!window.instancedObjects) {
                    window.instancedObjects = [];
                  }
                  window.instancedObjects.push(...instancedMeshGroups);
                  
                  const endTime = performance.now();
                  console.log(`批量实例化完成，总耗时: ${(endTime - startTime).toFixed(2)}ms`);
                  console.log(`成功创建 ${instancedMeshGroups.length} 个实例化网格，每个网格包含 ${maxAllowedInstances} 个实例`);
                  
                  // 资源使用统计
                  const estimatedMemoryUsage = (maxAllowedInstances * instancedMeshGroups.length * 64) / (1024 * 1024); // 粗略估计MB
                  console.log(`估计内存占用: ${estimatedMemoryUsage.toFixed(2)} MB`);
                  
                  resolve(true);
                } catch (error) {
                  console.error('批量实例化过程中发生严重错误:', error);
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
              console.error('模型加载失败:', error);
              // 确保即使加载失败也清理可能已创建的资源
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
  
  onMounted(async () => {
    // 先获取课程记录
    await fetchCourseRecord();
    // 然后初始化Three.js场景
    initThree();
  });
  
  onBeforeUnmount(() => {
    console.log('开始清理3D资源...');
    const cleanupStartTime = performance.now();
    
    // 清理点击处理器资源
    modelClickHandler.dispose();
  
    // 清理批量实例化的网格对象
    if (window.instancedObjects) {
      console.log(`清理 ${window.instancedObjects.length} 个实例化网格...`);
      window.instancedObjects.forEach(obj => {
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
          // 释放实例矩阵
          if (obj.instanceMatrix) {
            obj.instanceMatrix.dispose();
          }
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
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
        // 清理灯光和其他特殊对象
        if (object.isLight && object.dispose) {
          object.dispose();
        }
      });
    }
    
    // 清理加载器
    if (loader) {
      if (loader.manager && typeof loader.manager.dispose === 'function') {
        loader.manager.dispose();
      }
    }
    
    // 清理精灵位置数组
    if (spritePositions) {
      spritePositions.length = 0;
    }
    
    const cleanupEndTime = performance.now();
    console.log(`资源清理完成，耗时: ${(cleanupEndTime - cleanupStartTime).toFixed(2)}ms`);
  });
  </script>