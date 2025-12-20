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
        || type === ClassroomTypeEnum.LARGE;
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
    // 大型教室固定 4 列
    if (classroomType.value === ClassroomTypeEnum.LARGE) {
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
    const count = rowCount.value * columnCount.value;
    const type = classroomType.value;
    // 根据教室类型设置最大座位数量限制
    let maxSeats: number;
    if (type === ClassroomTypeEnum.SMALL) {
      maxSeats = 12; // 小型教室最多12张桌椅
    } else if (type === ClassroomTypeEnum.MIDDLE) {
      maxSeats = 54; // 中型教室最多54张
    } else if (type === ClassroomTypeEnum.LARGE) {
      maxSeats = 40; // 大型教室最多40张（桌椅更大所以数量少了）
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
    const leftBound = -halfWidth; // -3米（左边界）

    // 计算列索引（0-based）
    const columnIndex = instanceId % actualColumns;
    // 3张座位均匀分布在5米内，间距 = 5 / (3+1) = 1.25米
    const spacing = availableWidth / (actualColumns + 1);
    position.x = leftBound + spacing * (columnIndex + 1) - 1;

    // 前后方向：第一排距离前墙3米，每排间隔2米
    const frontWallZ = halfDepth; // 前墙z坐标（5米）
    const firstRowOffset = 5; // 第一排距离前墙4.6米
    const rowSpacing = 1.8; // 每排间隔1.8米
    const rowIndex = Math.floor(instanceId / actualColumns);
    position.z = frontWallZ - firstRowOffset - rowIndex * rowSpacing;

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
    const safeX = classroomXLength && classroomXLength > 0 ? classroomXLength : 18;
    const safeZ = classroomZLength && classroomZLength > 0 ? classroomZLength : 12;
    const columns = columnCount.value || 1;

    // 当前坐标系：x 右、y 上、z 前
    // 中型教室：沿 x 方向分列，沿 z 方向分排
    position.x = safeX / 2 - safeX / columns * (0.5 + (instanceId % columns));
    position.y = 0.0;
    position.z = 2 * Math.floor(instanceId / columns) - safeZ / 2 + 5;

    return position;
  };

  // 大型教室座位计算
  const calculateLargeSeatPosition = (
      instanceId: number,
      position: THREE.Vector3,
      _classroomXLength: number | null,
      classroomZLength: number | null
  ): THREE.Vector3 => {
    // 左右方向：大型教室 20 米宽，分为 10 份，四张课桌椅各占两份，第 3、8 份为走廊
    const width = 20;
    const segmentCount = 10;
    const segmentWidth = width / segmentCount; // 每份 2 米
    const deskColumns = 4;
    const deskCenterSegments = [1, 4, 6, 9]; // 每张桌子的“中心”所在的份索引（0-based）

    const rowIndex = Math.floor(instanceId / deskColumns);
    const columnIndex = instanceId % deskColumns;
    const centerSegment = deskCenterSegments[Math.min(columnIndex, deskCenterSegments.length - 1)];

    // 以教室中心为原点，x 正向为右
    const halfWidth = width / 2;
    position.x = -halfWidth + centerSegment * segmentWidth - 14;

    // 前后方向：教室 30 米深，座位从距离前墙 8 米处开始，每排相隔 2 米，直到后墙
    const depth = classroomZLength && classroomZLength > 0 ? classroomZLength : 30;
    const halfDepth = depth / 2;
    const frontZ = halfDepth;          // 前墙 z
    const startZ = frontZ - 14.8;         // 第一排 z
    const zStep = 1.94;                   // 每排间隔

    let z = startZ - rowIndex * zStep;
    const backZ = -halfDepth;
    if (z < backZ) {
      z = backZ;
    }
    position.z = z;

    // 上下方向：第一排高度 0.5 米，之后每排 +0.7 米
    position.y = 0.3 + rowIndex * 0.15;

    return position;
  };

  const calculateSeatPosition = (
      instanceId: number,
      position: THREE.Vector3,
      classroomXLength: number | null,
      classroomZLength: number | null
  ): THREE.Vector3 => {
    if (classroomType.value === ClassroomTypeEnum.LARGE) {
      return calculateLargeSeatPosition(instanceId, position, classroomXLength, classroomZLength);
    }
    if (classroomType.value === ClassroomTypeEnum.SMALL) {
      return calculateSmallSeatPosition(instanceId, position, classroomXLength, classroomZLength);
    }
    // 默认中型教室逻辑
    return calculateMiddleSeatPosition(instanceId, position, classroomXLength, classroomZLength);
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
      calculateSeatPosition(i, tempPosition, classroomXLength, classroomZLength);
      if (!spritePositions[i]) {
        spritePositions[i] = new THREE.Vector3();
      }
      spritePositions[i].set(tempPosition.x, tempPosition.y + 2.0, tempPosition.z);
    }
  };

  return {
    enabled,
    rowCount,
    columnCount,
    instanceCount,
    calculateSeatPosition,
    fillSpritePositions
  };
};


