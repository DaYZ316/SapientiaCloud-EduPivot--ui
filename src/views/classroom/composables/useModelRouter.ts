import type {CourseRecordVO} from '@/types/classroom';
import {ClassroomTypeEnum} from '@/enum/classroom/classroomTypeEnum';

// 模型文件名映射
const classroomModelFileMap: Record<ClassroomTypeEnum, string> = {
  [ClassroomTypeEnum.SMALL]: 'classroomMini.gltf',
  [ClassroomTypeEnum.MIDDLE]: 'classroomMiddle.gltf',
  [ClassroomTypeEnum.LARGE]: 'classroomPro.gltf',
  [ClassroomTypeEnum.EXTRA_LARGE]: 'classroomUltra.gltf'
};

const deskModelFileMap: Record<ClassroomTypeEnum, string> = {
  [ClassroomTypeEnum.SMALL]: 'deskChairMini.gltf',
  [ClassroomTypeEnum.MIDDLE]: 'deskChairMiddle.gltf',
  [ClassroomTypeEnum.LARGE]: 'deskChairPro.gltf',
  [ClassroomTypeEnum.EXTRA_LARGE]: 'deskChairUltra.gltf'
};

// 获取模型路径的辅助函数
const getModelPath = (fileName: string, modelType: 'classroom' | 'desk_chair'): string => {
  const modelPath = modelType === 'classroom'
    ? `@/assets/3Dmodel/classroom/${fileName}`
    : `@/assets/3Dmodel/desk_chair/${fileName}`;

  return import.meta.env.DEV
    ? new URL(modelPath, import.meta.url).href
    : `/assets/${fileName}`;
};

// 教室模型路径（根据课程记录的教室类型响应式切换）
export const getClassroomModelPathByRecord = (courseRecord: CourseRecordVO | null): string => {
  const type = courseRecord?.classroomType ?? ClassroomTypeEnum.LARGE;
  const fileName = classroomModelFileMap[type] || 'classroomPro.gltf';
  return getModelPath(fileName, 'classroom');
};

// 课桌椅模型路径（根据教室类型响应式切换）
export const getDeskModelPathByRecord = (courseRecord: CourseRecordVO | null): string => {
  const type = courseRecord?.classroomType ?? ClassroomTypeEnum.LARGE;
  const fileName = deskModelFileMap[type] || 'deskChairPro.gltf';
  return getModelPath(fileName, 'desk_chair');
};