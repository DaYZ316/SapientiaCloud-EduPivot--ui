import {computed} from 'vue';
import type {ComputedRef, Ref} from 'vue';
import * as THREE from 'three';
import type {CourseRecordVO} from '@/types/classroom';
import {ClassroomTypeEnum} from '@/enum/classroom/classroomTypeEnum';

export interface SeatLayoutResult {
  enabled: ComputedRef<boolean>;
  rowCount: ComputedRef<number>;
  columnCount: ComputedRef<number>;
  instanceCount: ComputedRef<number>;
  calculateSeatPosition: (
      instanceId: number,
      position: THREE.Vector3,
      classroomXLength: number | null,
      classroomZLength: number | null
  ) => THREE.Vector3;
  calculateActualSeatPosition: (
      seatIndex: number,
      position: THREE.Vector3,
      classroomXLength: number | null,
      classroomZLength: number | null
  ) => THREE.Vector3;
  fillSpritePositions: (
      spritePositions: THREE.Vector3[],
      maxInstances: number,
      classroomXLength: number | null,
      classroomZLength: number | null
  ) => void;
}

export const useSeatLayout = (courseRecord: Ref<CourseRecordVO | null>): SeatLayoutResult => {
  const classroomType = computed(() => courseRecord.value?.classroomType ?? null);

  const enabled = computed(() => {
    const type = classroomType.value;
    // 小型 / 中型 / 大型教室启用座位排布
    return type === ClassroomTypeEnum.SMALL
        || type === ClassroomTypeEnum.MIDDLE
        || type === ClassroomTypeEnum.LARGE
        || type === ClassroomTypeEnum.EXTRA_LARGE;
  });

  const rowCount = computed(() => {
    if (!enabled.value) {
      return 0;
    }
    const rows = courseRecord.value?.layoutRows ?? null;
    if (rows === null) {
      return 4;
    }
    return Math.min(Math.max(rows, 1), 12);
  });

  const columnCount = computed(() => {
    if (!enabled.value) {
      return 0;
    }
    // 大型/超大型教室默认 4 列，但如果 DTO 中有显式 layoutColumns 则使用该值（允许自定义）
    if (classroomType.value === ClassroomTypeEnum.LARGE || classroomType.value === ClassroomTypeEnum.EXTRA_LARGE) {
      const columns = courseRecord.value?.layoutColumns ?? null;
      if (columns !== null) {
        return Math.min(Math.max(columns, 1), 12);
      }
      return 4;
    }
    const columns = courseRecord.value?.layoutColumns ?? null;
    if (columns === null) {
      return 3;
    }
    return Math.min(Math.max(columns, 1), 12);
  });

  const instanceCount = computed(() => {
    if (!enabled.value) {
      return 0;
    }
    let count = rowCount.value * columnCount.value;
    const type = classroomType.value;
    // 根据教室类型设置最大座位数量限制
    let maxSeats: number;
    if (type === ClassroomTypeEnum.SMALL) {
      maxSeats = 12; // 小型教室最多12张桌椅
    } else if (type === ClassroomTypeEnum.MIDDLE) {
      maxSeats = 80; // 中型教室最多54张
    } else if (type === ClassroomTypeEnum.LARGE) {
      maxSeats = 40; // 大型教室最多40张（桌椅更大所以数量少了）
      count = rowCount.value * (columnCount.value/4);
    } else {
      maxSeats = 50; // 默认值
    }
    return Math.min(count, maxSeats);
  });

  // 小型教室座位计算
  const calculateSmallSeatPosition = (
      instanceId: number,
      position: THREE.Vector3,
      _classroomXLength: number | null,
      classroomZLength: number | null
  ): THREE.Vector3 => {
    // 教室尺寸：左右宽6米，前后长10米
    const width = 6;
    const depth = classroomZLength && classroomZLength > 0 ? classroomZLength : 10;
    const columns = columnCount.value || 1;
    const maxColumns = 3; // 一排最多3张座位
    const actualColumns = Math.min(columns, maxColumns);

    // 当前坐标系：x 右、y 上、z 前
    // 以教室中心为原点，x 正向为右，z 正向为前
    const halfWidth = width / 2; // 3米
    const halfDepth = depth / 2; // 5米（深度10米时）

    // 左右方向：教室宽6米，右边1米用于摆放架子，剩余5米均匀分布座位
    const shelfWidth = 0.6; // 右边架子宽度0.6米
    const availableWidth = width - shelfWidth; // 5米
    const leftBound = -halfWidth + shelfWidth + 1; // -3米（左边界）

    // 计算列索引（0-based）
    const columnIndex = instanceId % actualColumns;
    // 3张座位均匀分布在5米内，间距 = 5 / (3+1) = 1.25米
    const spacing = availableWidth / (actualColumns + 1);
    position.x = leftBound + spacing * (columnIndex + 1);

    // 前后方向：第一排距离前墙3米，每排间隔2米
    const frontWallZ = halfDepth; // 前墙z坐标（5米）
    const firstRowOffset = 5; // 第一排距离前墙4.6米
    const rowSpacing = 1.8; // 每排间隔1.8米
    const rowIndex = Math.floor(instanceId / actualColumns);
    position.z = frontWallZ - firstRowOffset - rowIndex * rowSpacing - 0.8;

    // 上下方向：座位高度0.5米
    position.y = 0.5;

    return position;
  };

  // 中型教室座位计算
  const calculateMiddleSeatPosition = (
      instanceId: number,
      position: THREE.Vector3,
      classroomXLength: number | null,
      classroomZLength: number | null
  ): THREE.Vector3 => {
    let safeX = classroomXLength && classroomXLength > 0 ? classroomXLength : 20;
    const safeZ = classroomZLength && classroomZLength > 0 ? classroomZLength : 15;
    const columns = columnCount.value || 1;

    safeX-=2;

    // 当前坐标系：x 右、y 上、z 前
    // 中型教室：沿 x 方向分列，沿 z 方向分排
    position.x = safeX / 2 - safeX / columns * (0.5 + (instanceId % columns));
    position.y = 0.0;
    position.z = safeZ / 2 - 1.8 * Math.floor(instanceId / columns) - 5;

    return position;
  };

  // 大型教室座位计算
  const calculateLargeSeatPosition = (
      instanceId: number,
      position: THREE.Vector3,
      _classroomXLength: number | null,
      classroomZLength: number | null
  ): THREE.Vector3 => {
    // 使用 segment-based center mapping 保留 deskCenterSegments 的语义
    const width = _classroomXLength && _classroomXLength > 0 ? _classroomXLength : 20;
    const depth = classroomZLength && classroomZLength > 0 ? classroomZLength : 30;

    // 列数（组件数或座位列数视外层传入），使用 columnCount 作为实例每排列数
    const cols = (columnCount.value/4) || 1;
    const rowIndex = Math.floor(instanceId / cols);
    const columnIndex = instanceId % cols;

    // segmentCount 划分教室宽度为若干段，deskCenterSegments 表示每列实例对应的段索引
    const segmentCount = 10;
    const segmentWidth = width / segmentCount;

    // 生成 deskCenterSegments 映射：当 cols === 1 时希望使用索引 0（左侧）；否则均匀分布段索引从 0 到 segmentCount-1
    let deskCenterSegments = [ 0, 3, 5, 8];
    deskCenterSegments.length-=(4-cols);

    const centerSegment = deskCenterSegments[Math.min(columnIndex, deskCenterSegments.length - 1)];
    // 以段中心为参考计算 x 坐标（加上半个段宽使其位于段中心）
    const halfWidth = width / 2;
    position.x = -halfWidth + centerSegment * segmentWidth + segmentWidth / 2;

    // 前后方向：与之前相同
    const halfDepth = depth / 2;
    const frontZ = halfDepth;
    const startZ = frontZ - 8.4;
    const zStep = 2;
    let z = startZ - rowIndex * zStep;
    const backZ = -halfDepth;
    if (z < backZ) {
      z = backZ;
    }
    position.z = z;

    // 高度随行数增加
    position.y = 2.05 + rowIndex * 0.18;

    return position;
  };

  // 超大型教室座位计算（扇形弧形排布）
  const calculateExtraLargeSeatPosition = (
      instanceId: number,
      position: THREE.Vector3,
      _classroomXLength: number | null
  ): THREE.Vector3 => {
    // Parameters from user: outer diameter 30m, inner diameter 10m, angle span 142°
    const outerRadius = 60 / 2; // 15
    const innerRadius = 20 / 2; // 5
    const angleSpanDeg = 142;
    const angleSpan = (angleSpanDeg * Math.PI) / 180;

    // number of radial rows and a base seats-per-outer-ring
    const rows = Math.max(1, rowCount.value || 1);
    const outerSeatCount = Math.max(1, columnCount.value || 1);

    // compute radii for each ring
    const radii: number[] = [];
    for (let r = 0; r < rows; r++) {
      if (rows === 1) {
        radii.push((innerRadius + outerRadius) / 2);
      } else {
        const t = r / (rows - 1);
        radii.push(innerRadius + t * (outerRadius - innerRadius));
      }
    }

    // compute seats per ring proportional to circumference
    const seatsPerRing: number[] = radii.map((radius) => {
      const factor = radius / outerRadius;
      const seats = Math.max(1, Math.round(outerSeatCount * factor));
      return seats;
    });

    // find which ring this instanceId belongs to (instances ordered ring0..ringN)
    let remaining = instanceId;
    let ring = 0;
    while (ring < seatsPerRing.length && remaining >= seatsPerRing[ring]) {
      remaining -= seatsPerRing[ring];
      ring++;
    }
    if (ring >= seatsPerRing.length) {
      // clamp to last ring
      ring = seatsPerRing.length - 1;
      remaining = seatsPerRing[ring] - 1;
    }

    const seatsInThisRing = seatsPerRing[ring];
    const idxInRing = remaining;

    // Angular placement: centered at forward (Z axis), symmetric
    const startAngle = -angleSpan / 2;
    const step = seatsInThisRing > 0 ? angleSpan / seatsInThisRing : angleSpan;
    const angle = startAngle + (idxInRing + 0.5) * step;

    const radius = radii[ring];
    // convert polar to cartesian (x right, z forward)
    position.x = Math.sin(angle) * radius;
    position.z = -Math.cos(angle) * radius + 8;
    // small height offset per ring for perspective
    position.y = 1.8 + ring * 0.5;

    return position;
  };

  const calculateSeatPosition = (
      instanceId: number,
      position: THREE.Vector3,
      classroomXLength: number | null,
      classroomZLength: number | null
  ): THREE.Vector3 => {
    if (classroomType.value === ClassroomTypeEnum.EXTRA_LARGE) {
      return calculateExtraLargeSeatPosition(instanceId, position, classroomXLength);
    }
    if (classroomType.value === ClassroomTypeEnum.LARGE) {
      return calculateLargeSeatPosition(instanceId, position, classroomXLength, classroomZLength);
    }
    if (classroomType.value === ClassroomTypeEnum.SMALL) {
      return calculateSmallSeatPosition(instanceId, position, classroomXLength, classroomZLength);
    }
    // 默认中型教室逻辑
    return calculateMiddleSeatPosition(instanceId, position, classroomXLength, classroomZLength);
  };

  /**
   * 计算精灵模型的实际位置（考虑桌椅模型和座位位置的映射关系）
   * 小型/中型教室：一个桌椅模型对应一个座位，位置相同
   * 大型教室：一个桌椅模型对应四个座位，四个座位呈一排均匀分布
   */
  const calculateActualSeatPosition = (
      seatIndex: number,
      position: THREE.Vector3,
      classroomXLength: number | null,
      classroomZLength: number | null
  ): THREE.Vector3 => {
    if (classroomType.value === ClassroomTypeEnum.SMALL) {
      calculateSeatPosition(seatIndex, position, classroomXLength, classroomZLength);
      position.x -= 0.8;
      position.y += 0.7;
      return position;
    }
    if (classroomType.value === ClassroomTypeEnum.MIDDLE) {
      calculateSeatPosition(seatIndex, position, classroomXLength, classroomZLength);
      position.x += 0.4;
      position.y += 1.8;
      return position;
    }
    if (classroomType.value === ClassroomTypeEnum.LARGE) {
      // 大型教室：一个桌椅模型对应四个座位
      const seatsPerModel = 4; // 每个模型包含4个座位
      const modelIndex = Math.floor(seatIndex / seatsPerModel); // 计算所属的桌椅模型索引
      const seatInModel = seatIndex % seatsPerModel; // 在模型中的座位位置（0-3）

      // 先计算桌椅模型的位置
      calculateLargeSeatPosition(modelIndex, position, classroomXLength, classroomZLength);

      // 在桌椅模型位置基础上，计算座位在模型中的相对位置
      // 4个座位均匀分布，左右各两个座位
      const modelWidth = 4.0; // 假设桌椅模型宽度为4米
      const seatSpacing = modelWidth / (seatsPerModel + 1); // 座位间距
      const leftOffset = -modelWidth / 2; // 模型左边界

      // 计算座位在模型中的X偏移（从左到右：0, 1, 2, 3）
      position.x += leftOffset + seatSpacing * (seatInModel + 1);

      return position;
    } 
    if (classroomType.value === ClassroomTypeEnum.EXTRA_LARGE) {
      calculateSeatPosition(seatIndex, position, classroomXLength, classroomZLength);
      position.y += 0.5;
      return position;
    }
    return position;
  };

  const fillSpritePositions = (
      spritePositions: THREE.Vector3[],
      maxInstances: number,
      classroomXLength: number | null,
      classroomZLength: number | null
  ): void => {
    spritePositions.length = 0;
    spritePositions.length = maxInstances;

    const tempPosition = new THREE.Vector3();
    for (let i = 0; i < maxInstances; i++) {
      calculateActualSeatPosition(i, tempPosition, classroomXLength, classroomZLength);
      if (!spritePositions[i]) {
        spritePositions[i] = new THREE.Vector3();
      }
      spritePositions[i].set(tempPosition.x, tempPosition.y + 0.4, tempPosition.z);
    }
  };

  return {
    enabled,
    rowCount,
    columnCount,
    instanceCount,
    calculateSeatPosition,
    calculateActualSeatPosition,
    fillSpritePositions
  };
};


