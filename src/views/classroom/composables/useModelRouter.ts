import type {CourseRecordVO} from '@/types/classroom';
import {ClassroomTypeEnum} from '@/enum/classroom/classroomTypeEnum';

const CLASSROOM_MODEL_BASE_PATH = '/assets';
const DESK_MODEL_BASE_PATH = '/assets';

const classroomTypeModelPathMap: Record<ClassroomTypeEnum, string> = {
  [ClassroomTypeEnum.SMALL]: `${CLASSROOM_MODEL_BASE_PATH}/classroomMini.gltf`,
  [ClassroomTypeEnum.MIDDLE]: `${CLASSROOM_MODEL_BASE_PATH}/classroomMiddle.gltf`,
  [ClassroomTypeEnum.LARGE]: `${CLASSROOM_MODEL_BASE_PATH}/classroomPro.gltf`,
  [ClassroomTypeEnum.EXTRA_LARGE]: `${CLASSROOM_MODEL_BASE_PATH}/classroomUltra.gltf`
};

const deskTypeModelPathMap: Record<ClassroomTypeEnum, string> = {
  [ClassroomTypeEnum.SMALL]: `${DESK_MODEL_BASE_PATH}/deskChairMini.gltf`,
  [ClassroomTypeEnum.MIDDLE]: `${DESK_MODEL_BASE_PATH}/deskChairMiddle.gltf`,
  [ClassroomTypeEnum.LARGE]: `${DESK_MODEL_BASE_PATH}/deskChairPro.gltf`,
  [ClassroomTypeEnum.EXTRA_LARGE]: `${DESK_MODEL_BASE_PATH}/deskChairUltra.gltf`
};

// 教室模型路径（根据课程记录的教室类型响应式切换）
export const getClassroomModelPathByRecord = (courseRecord: CourseRecordVO | null): string => {
  const type = courseRecord?.classroomType ?? ClassroomTypeEnum.LARGE;
  return classroomTypeModelPathMap[type] || `${CLASSROOM_MODEL_BASE_PATH}/classroomPro.gltf`;
};

// 课桌椅模型路径（根据教室类型响应式切换）
export const getDeskModelPathByRecord = (courseRecord: CourseRecordVO | null): string => {
  const type = courseRecord?.classroomType ?? ClassroomTypeEnum.LARGE;
  return deskTypeModelPathMap[type] || `${DESK_MODEL_BASE_PATH}/deskChairPro.gltf`;
};