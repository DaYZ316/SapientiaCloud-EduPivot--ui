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
    return Math.min(count, 50);
  });

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
    position.x = safeX / 2 - safeX / columns * (0.25 + (instanceId % columns));
    position.y = 0.0;
    position.z = 2 * Math.floor(instanceId / columns) - safeZ / 2 + 5;

    return position;
  };

  // 大型教室座位计算
  const calculateLargeSeatPosition = (
      instanceId: number,
      position: THREE.Vector3,
      classroomXLength: number | null,
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
    // 默认中型教室逻辑（小型 / 中型）
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


