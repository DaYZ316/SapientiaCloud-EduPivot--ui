import * as THREE from 'three';

const AVATAR_TEXTURE_SIZE = 256;
const isDomAvailable = typeof document !== 'undefined';

type AvatarImageSource = CanvasImageSource & {
    width?: number;
    height?: number;
    videoWidth?: number;
    videoHeight?: number;
};

const createAvatarCanvas = (): HTMLCanvasElement | null => {
    if (!isDomAvailable) {
        return null;
    }
    const canvas = document.createElement('canvas');
    canvas.width = AVATAR_TEXTURE_SIZE;
    canvas.height = AVATAR_TEXTURE_SIZE;
    return canvas;
};

const getSourceDimensions = (
    source: AvatarImageSource | null
): { width: number; height: number } | null => {
    if (!source) {
        return null;
    }
    const width = source.width ?? (source as HTMLVideoElement).videoWidth ?? 0;
    const height = source.height ?? (source as HTMLVideoElement).videoHeight ?? 0;
    if (!width || !height) {
        return null;
    }
    return {width, height};
};

const drawCircularImage = (
    context: CanvasRenderingContext2D,
    source: AvatarImageSource,
    dimensions: { width: number; height: number }
): void => {
    const size = AVATAR_TEXTURE_SIZE;
    const scale = Math.max(size / dimensions.width, size / dimensions.height);
    const drawWidth = dimensions.width * scale;
    const drawHeight = dimensions.height * scale;
    const dx = (size - drawWidth) / 2;
    const dy = (size - drawHeight) / 2;

    context.save();
    context.beginPath();
    context.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
    context.closePath();
    context.clip();
    context.drawImage(source, dx, dy, drawWidth, drawHeight);
    context.restore();
};

const createCircularTextureFromSource = (texture: THREE.Texture | null): THREE.Texture | null => {
    if (!texture) {
        return null;
    }
    const canvas = createAvatarCanvas();
    if (!canvas) {
        return texture;
    }
    const context = canvas.getContext('2d');
    const source = texture.image as AvatarImageSource | undefined;
    const dimensions = getSourceDimensions(source || null);
    if (!context || !source || !dimensions) {
        return null;
    }
    context.clearRect(0, 0, AVATAR_TEXTURE_SIZE, AVATAR_TEXTURE_SIZE);
    drawCircularImage(context, source, dimensions);

    const canvasTexture = new THREE.CanvasTexture(canvas);
    canvasTexture.needsUpdate = true;
    canvasTexture.colorSpace = texture.colorSpace;
    canvasTexture.anisotropy = texture.anisotropy;
    canvasTexture.minFilter = THREE.LinearFilter;
    canvasTexture.magFilter = THREE.LinearFilter;
    canvasTexture.wrapS = THREE.ClampToEdgeWrapping;
    canvasTexture.wrapT = THREE.ClampToEdgeWrapping;
    return canvasTexture;
};

/**
 * 精灵模型管理类
 * 负责精灵模型的统一管理，包括位置管理、用户映射和纹理更新
 */
export class SpriteManager {
    // 精灵位置数组，私有属性
    private _positions: THREE.Vector3[] | null = null;
    // 学生数组，长度与座位数量相同，数组元素为空时代表对应位置是空座位
    private _studentsArray: (string | number | null)[] | null = null;
    // 初始化标志
    private _initialized: boolean = false;
    // 精灵实例数组
    private _sprites: THREE.Sprite[] = [];
    // 精灵材质数组
    private _spriteMaterials: THREE.SpriteMaterial[] = [];
    // 用户纹理映射
    private _userTextures: Map<number, THREE.Texture> = new Map();
    // 场景引用
    private _scene: THREE.Scene | null = null;
    // 相机引用
    private _camera: THREE.Camera | null = null;

    /**
     * 构造函数
     */
    constructor() {
        // 初始化位置数组
        this._positions = null;
        // 初始化学生数组
        this._studentsArray = null;
        // 初始化默认纹理存储
        this._defaultTexture = null;
        // 初始化标志
        this._initialized = false;
        // 初始化精灵实例数组
        this._sprites = [];
        // 初始化精灵材质数组
        this._spriteMaterials = [];
        // 初始化用户纹理映射
        this._userTextures = new Map();
        // 初始化场景引用
        this._scene = null;
        // 初始化相机引用
        this._camera = null;
    }

    // 默认纹理存储
    private _defaultTexture: THREE.Texture | null = null;

    /**
     * 获取默认纹理
     * @returns 默认纹理
     */
    get defaultTexture(): THREE.Texture | null {
        return this._defaultTexture;
    }

    /**
     * 获取精灵数量
     * @returns 精灵数量
     */
    get spriteCount(): number {
        return this._positions ? this._positions.length : 0;
    }

    /**
     * 获取初始化状态
     * @returns 是否已初始化
     */
    get isInitialized(): boolean {
        return this._initialized;
    }

    /**
     * 初始化函数
     * @param spriteCount - 精灵数量，必须为正整数
     * @param defaultTexture - 默认纹理对象
     * @throws {Error} 当参数类型或值无效时抛出错误
     */
    initialize(spriteCount: number, defaultTexture: THREE.Texture): void {
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

            // 初始化学生数组，长度与座位数量相同，所有元素初始化为null表示空座位
            this._studentsArray = new Array(spriteCount).fill(null);

            // 初始化默认纹理
            this._defaultTexture = this._createCircularTexture(defaultTexture) || defaultTexture;

            // 初始化精灵实例数组
            this._sprites = [];
            // 初始化精灵材质数组
            this._spriteMaterials = [];
            // 初始化用户纹理映射
            this._userTextures = new Map();

            // 标记为已初始化
            this._initialized = true;
        } catch (error) {
            console.error('精灵管理器初始化失败:', error);
            // 重置状态以允许重新初始化
            this._positions = null;
            this._studentsArray = null;
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
     * @param positions - 位置数组
     * @throws {Error} 当位置数组无效或已初始化时抛出错误
     */
    setPositions(positions: THREE.Vector3[]): void {
        try {
            // 验证初始化状态
            if (!this._initialized) {
                throw new Error('精灵管理器尚未初始化');
            }

            // 验证位置数组
            if (!Array.isArray(positions) || positions.length !== this._positions!.length) {
                throw new Error('位置数组长度必须与精灵数量匹配');
            }

            // 复制位置数据
            for (let i = 0; i < positions.length; i++) {
                // 验证每个位置是否为有效的Vector3对象
                if (!(positions[i] instanceof THREE.Vector3)) {
                    throw new Error(`位置索引 ${i} 必须是THREE.Vector3对象`);
                }
                // 深拷贝Vector3对象
                this._positions![i] = positions[i].clone();
            }

            // 冻结位置数组，使其不可变更
            Object.freeze(this._positions);
        } catch (error) {
            console.error('设置精灵位置失败:', error);
            throw error;
        }
    }

    /**
     * 设置场景引用
     * @param scene - Three.js场景对象
     */
    setScene(scene: THREE.Scene): void {
        if (!(scene instanceof THREE.Scene)) {
            throw new Error('场景必须是有效的THREE.Scene对象');
        }
        this._scene = scene;
    }

    /**
     * 设置相机引用
     * @param camera - Three.js相机对象
     */
    setCamera(camera: THREE.Camera): void {
        if (!(camera instanceof THREE.Camera)) {
            throw new Error('相机必须是有效的THREE.Camera对象');
        }
        this._camera = camera;
    }

    /**
     * 创建所有精灵模型实例
     * @returns 创建是否成功
     */
    createSpriteInstances(): boolean {
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

                // 检查该位置是否有学生，如果有学生则显示精灵模型，否则不显示
                const hasStudent = this._studentsArray![i] !== null && this._studentsArray![i] !== undefined;

                // 创建精灵材质，使用默认纹理
                const spriteMaterial = new THREE.SpriteMaterial({
                    map: this._defaultTexture!,
                    transparent: true,
                    opacity: hasStudent ? 0.9 : 0, // 如果有学生，透明度设为0.9，否则为0
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

                // 如果有学生，则显示精灵模型，否则不显示
                sprite.visible = hasStudent;

                // 将精灵添加到场景
                this._scene.add(sprite);

                // 存储精灵和材质引用
                this._sprites[i] = sprite;
                this._spriteMaterials[i] = spriteMaterial;
            }

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
    clearSpriteInstances(): void {
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
    }

    /**
     * 获取精灵位置
     * @param positionIndex - 位置索引
     * @returns 精灵位置
     * @throws {Error} 当位置索引无效时抛出错误
     */
    getPosition(positionIndex: number): THREE.Vector3 {
        this._validatePositionIndex(positionIndex);
        return this._positions![positionIndex].clone();
    }

    /**
     * 精灵信息更新函数
     * @param userId - 用户ID
     * @param userTexture - 用户纹理对象
     * @param positionIndex - 位置索引
     * @returns 更新是否成功
     * @throws {Error} 当参数无效或位置已被占用时抛出错误
     */
    updateSpriteInfo(userId: string | number, userTexture: THREE.Texture, positionIndex: number): boolean {
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

            // 检查用户ID是否已被其他位置索引占用
            for (let i = 0; i < this._studentsArray!.length; i++) {
                if (this._studentsArray![i] === userId && i !== positionIndex) {
                    // 如果用户已在其他位置，先清除原位置的数据
                    this._studentsArray![i] = null;
                    this._updateSpriteTexture(i, this._defaultTexture!, 0);
                    this._cleanupPositionTexture(i);
                    break;
                }
            }

            // 检查位置索引是否已被占用
            if (this._studentsArray![positionIndex] !== null && this._studentsArray![positionIndex] !== undefined) {
                const existingUserId = this._studentsArray![positionIndex];
                if (existingUserId !== userId) {
                    // 如果位置已被其他用户占用，清除原用户数据
                    this._cleanupPositionTexture(positionIndex);
                }
            }

            // 更新学生数组和用户纹理映射
            this._studentsArray![positionIndex] = userId;
            const circularTexture = this._createCircularTexture(userTexture) || userTexture;
            this._cleanupPositionTexture(positionIndex);
            this._userTextures.set(positionIndex, circularTexture);

            // 更新精灵纹理，显示精灵模型
            if (this._sprites[positionIndex] && this._spriteMaterials[positionIndex]) {
                this._updateSpriteTexture(
                    positionIndex,
                    circularTexture || this._defaultTexture!,
                    1.0
                );
            }

            return true;
        } catch (error) {
            console.error(`更新精灵信息失败 (用户: ${userId}, 位置: ${positionIndex}):`, error);
            throw error;
        }
    }

    /**
     * 用户数据删除函数
     * @param userId - 用户ID
     * @returns 删除是否成功
     * @throws {Error} 当用户ID不存在时抛出错误
     */
    removeUserData(userId: string | number): boolean {
        try {
            // 验证初始化状态
            if (!this._initialized) {
                throw new Error('精灵管理器尚未初始化');
            }

            // 查找用户ID对应的位置索引
            let positionIndex = -1;
            for (let i = 0; i < this._studentsArray!.length; i++) {
                if (this._studentsArray![i] === userId) {
                    positionIndex = i;
                    break;
                }
            }

            // 验证用户ID是否存在
            if (positionIndex === -1) {
                throw new Error(`用户ID ${userId} 不存在`);
            }

            // 从学生数组和用户纹理映射中删除
            this._studentsArray![positionIndex] = null;
            this._cleanupPositionTexture(positionIndex);

            // 隐藏精灵模型（空座位不显示）
            if (this._sprites[positionIndex] && this._spriteMaterials[positionIndex]) {
                this._updateSpriteTexture(positionIndex, this._defaultTexture!, 0);
            }

            return true;
        } catch (error) {
            console.error(`删除用户数据失败 (用户: ${userId}):`, error);
            throw error;
        }
    }

    /**
     * 获取用户ID对应的位置索引
     * @param userId - 用户ID
     * @returns 位置索引，如果不存在则返回null
     */
    getPositionIndexByUserId(userId: string | number): number | null {
        for (let i = 0; i < this._studentsArray!.length; i++) {
            if (this._studentsArray![i] === userId) {
                return i;
            }
        }
        return null;
    }

    /**
     * 获取位置索引对应的用户ID
     * @param positionIndex - 位置索引
     * @returns 用户ID，如果不存在则返回null
     */
    getUserIdByPositionIndex(positionIndex: number): string | number | null {
        this._validatePositionIndex(positionIndex);
        const userId = this._studentsArray![positionIndex];
        return userId !== null && userId !== undefined ? userId : null;
    }

    /**
     * 更新精灵纹理和可见性属性
     * @private
     */
    private _updateSpriteTexture(positionIndex: number, texture: THREE.Texture, opacity: number): void {
        if (this._sprites[positionIndex] && this._spriteMaterials[positionIndex]) {
            try {
                // 检查该位置是否有学生
                const hasStudent = this._studentsArray![positionIndex] !== null && this._studentsArray![positionIndex] !== undefined;

                // 更新纹理
                this._spriteMaterials[positionIndex].map = texture;
                this._spriteMaterials[positionIndex].needsUpdate = true;

                // 更新透明度和可见性属性
                // 如果有学生，使用传入的opacity，否则设为0并隐藏
                if (hasStudent) {
                    this._spriteMaterials[positionIndex].opacity = opacity;
                    this._sprites[positionIndex].visible = opacity > 0;
                } else {
                    this._spriteMaterials[positionIndex].opacity = 0;
                    this._sprites[positionIndex].visible = false;
                }

                // 确保精灵总是面向相机
                if (this._camera) {
                    this._sprites[positionIndex].lookAt(this._camera.position);
                }
            } catch (error) {
                console.error(`更新位置 ${positionIndex} 的精灵纹理失败:`, error);
            }
        }
    }

    /**
     * 验证位置索引的有效性
     * @param positionIndex - 位置索引
     * @throws {Error} 当位置索引无效时抛出错误
     * @private
     */
    private _validatePositionIndex(positionIndex: number): void {
        if (typeof positionIndex !== 'number' || !Number.isInteger(positionIndex)) {
            throw new Error('位置索引必须是整数');
        }

        if (this._positions === null || positionIndex < 0 || positionIndex >= this._positions.length) {
            throw new Error(`位置索引 ${positionIndex} 超出有效范围`);
        }
    }

    /**
     * 统一的圆形纹理创建函数
     * @param texture - 原始纹理
     * @returns 处理后的圆形纹理
     */
    private _createCircularTexture(texture: THREE.Texture | null): THREE.Texture | null {
        return createCircularTextureFromSource(texture);
    }

    /**
     * 清理指定位置存储的纹理，避免内存泄漏
     * @param positionIndex - 座位索引
     */
    private _cleanupPositionTexture(positionIndex: number): void {
        const storedTexture = this._userTextures.get(positionIndex);
        if (storedTexture && storedTexture !== this._defaultTexture) {
            storedTexture.dispose();
        }
        this._userTextures.delete(positionIndex);
    }
}

