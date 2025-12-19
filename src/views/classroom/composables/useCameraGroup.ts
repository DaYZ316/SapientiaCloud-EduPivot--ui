import {ref} from 'vue';
import type {Ref} from 'vue';
import * as THREE from 'three';

interface CameraVector {
  x: number;
  y: number;
  z: number;
}

interface CameraConfig {
  position: CameraVector;
  initialRotation: THREE.Euler;
}

export interface ClassroomCameraPositions {
  front: CameraConfig;
  rightRear: CameraConfig;
  leftRear: CameraConfig;
}


export const classroomXLenghtRef: Ref<number | null> = ref<number | null>(null);
export const classroomYLenghtRef: Ref<number | null> = ref<number | null>(null);
export const classroomZLenghtRef: Ref<number | null> = ref<number | null>(null);



const createCameraRotationToCenter = (position: CameraVector, targetY: number): THREE.Euler => {
  const dx = 0 - position.x;
  const dy = targetY - position.y;
  const dz = 0 - position.z;

  const yaw = Math.atan2(dx, dz); // 围绕 y 轴
  const horizontalDist = Math.sqrt(dx * dx + dz * dz);
  const pitch = Math.atan2(dy, horizontalDist); // 围绕 x 轴

  return new THREE.Euler(pitch, yaw + Math.PI, 0, 'YXZ');
};

export const computeCameraPositionsBySize = (
  xLength: number | null,
  yLength: number | null,
  zLength: number | null
): ClassroomCameraPositions => {
  // x: 右, y: 上, z: 前
  const safeX = xLength && xLength > 0 ? xLength : 18; // 左右宽度
  const safeY = yLength && yLength > 0 ? yLength : 10; // 上下高度
  const safeZ = zLength && zLength > 0 ? zLength : 20; // 前后深度

  const halfX = safeX / 2;
  const halfZ = safeZ / 2;
  const wallOffset = 2;
  const lateralOffset = Math.max(4, safeX / 4);
  // 相机高度主要由教室高度决定，避免过低或过高
  const baseHeight = Math.max(4.5, safeY * 0.7);
  const targetY = safeY / 2;

  const frontPos: CameraVector = {
    x: 0,
    y: baseHeight,
    z: halfZ - wallOffset
  };

  const rightRearPos: CameraVector = {
    x: halfX - wallOffset,
    y: baseHeight,
    z: -(halfZ - wallOffset)
  };

  const leftRearPos: CameraVector = {
    x: -(halfX - wallOffset),
    y: baseHeight,
    z: -(halfZ - wallOffset)
  };

  return {
    front: {
      // 教室前部中上靠墙
      position: frontPos,
      initialRotation: createCameraRotationToCenter(frontPos, targetY)
    },
    rightRear: {
      // 教室后部右上
      position: rightRearPos,
      initialRotation: createCameraRotationToCenter(rightRearPos, targetY)
    },
    leftRear: {
      // 教室后部左上
      position: leftRearPos,
      initialRotation: createCameraRotationToCenter(leftRearPos, targetY)
    }
  };
};


