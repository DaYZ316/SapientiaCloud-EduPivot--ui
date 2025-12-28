import type {CourseRecordVO} from '@/types/classroom';
import {ClassroomTypeEnum} from '@/enum/classroom/classroomTypeEnum';

// 存储文件名（不包含路径），根据运行环境再拼接完整 URL 或生产静态路径
const classroomModelFileMap: Record<ClassroomTypeEnum, string> = {
  [ClassroomTypeEnum.SMALL]: `classroomMini.gltf`,
  [ClassroomTypeEnum.MIDDLE]: `classroomMiddle.gltf`,
  [ClassroomTypeEnum.LARGE]: `classroomPro.gltf`,
  [ClassroomTypeEnum.EXTRA_LARGE]: `classroomPro.gltf`
};

const deskModelFileMap: Record<ClassroomTypeEnum, string> = {
  [ClassroomTypeEnum.SMALL]: `deskChairMini.gltf`,
  [ClassroomTypeEnum.MIDDLE]: `deskChairMiddle.gltf`,
  [ClassroomTypeEnum.LARGE]: `deskChairPro.gltf`,
  [ClassroomTypeEnum.EXTRA_LARGE]: `deskChairPro.gltf`
};

// 教室模型路径（根据课程记录的教室类型返回 dev/prod 可用路径）
export const getClassroomModelPathByRecord = (courseRecord: CourseRecordVO | null): string => {
  const type = courseRecord?.classroomType ?? ClassroomTypeEnum.LARGE;
  const fileName = classroomModelFileMap[type] || 'classroomPro.gltf';
  if (import.meta.env.DEV) {
    return new URL(`@/assets/3Dmodel/classroom/${fileName}`, import.meta.url).href;
  }
  return `/assets/3Dmodel/classroom/${fileName}`;
};

// 课桌椅模型路径（根据教室类型返回 dev/prod 可用路径）
export const getDeskModelPathByRecord = (courseRecord: CourseRecordVO | null): string => {
  const type = courseRecord?.classroomType ?? ClassroomTypeEnum.LARGE;
  const fileName = deskModelFileMap[type] || 'deskChairPro.gltf';
  if (import.meta.env.DEV) {
    return new URL(`@/assets/3Dmodel/desk_chair/${fileName}`, import.meta.url).href;
  }
  return `/assets/3Dmodel/desk_chair/${fileName}`;
};