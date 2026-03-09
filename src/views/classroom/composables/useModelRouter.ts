import type {CourseRecordVO} from '@/types/classroom';
import {ClassroomTypeEnum} from '@/enum/classroom/classroomTypeEnum';

const isLocalhost = window.location.hostname === 'localhost';

const CLASSROOM_MODEL_BASE_PATH = isLocalhost ? '/src/assets/3Dmodel/classroom' : '/assets';
const CLASSROOM_MODEL_TEXTURE_PATH = isLocalhost ? '/src/assets/3Dmodel/classroom/texture' : '/assets';
const DESK_MODEL_BASE_PATH = isLocalhost ? '/src/assets/3Dmodel/desk_chair' : '/assets';
const DESKCHAIR_MODEL_TEXTURE_PATH = isLocalhost ? '/src/assets/3Dmodel/desk_chair/texture' : '/assets';

const classroomTypeModelPathMap: Record<ClassroomTypeEnum, string> = {
  [ClassroomTypeEnum.SMALL]: `${CLASSROOM_MODEL_BASE_PATH}/classroomMini.gltf`,
  [ClassroomTypeEnum.MIDDLE]: `${CLASSROOM_MODEL_BASE_PATH}/classroomMiddle.gltf`,
  [ClassroomTypeEnum.LARGE]: `${CLASSROOM_MODEL_BASE_PATH}/classroomPro.gltf`,
  [ClassroomTypeEnum.EXTRA_LARGE]: `${CLASSROOM_MODEL_BASE_PATH}/classroomUltra.gltf`
};

const classroomModelTexturePathMap: Record<ClassroomTypeEnum, string> = {
  [ClassroomTypeEnum.SMALL]: `${CLASSROOM_MODEL_TEXTURE_PATH}/classroomMini_baked.jpg`,
  [ClassroomTypeEnum.MIDDLE]: `${CLASSROOM_MODEL_TEXTURE_PATH}/classroomMiddle_baked.jpg`,
  [ClassroomTypeEnum.LARGE]: `${CLASSROOM_MODEL_TEXTURE_PATH}/classroomPro_baked.jpg`,
  [ClassroomTypeEnum.EXTRA_LARGE]: `${CLASSROOM_MODEL_TEXTURE_PATH}/classroomUltra_baked.jpg`
};

const deskTypeModelPathMap: Record<ClassroomTypeEnum, string> = {
  [ClassroomTypeEnum.SMALL]: `${DESK_MODEL_BASE_PATH}/deskChairMini.gltf`,
  [ClassroomTypeEnum.MIDDLE]: `${DESK_MODEL_BASE_PATH}/deskChairMiddle.gltf`,
  [ClassroomTypeEnum.LARGE]: `${DESK_MODEL_BASE_PATH}/deskChairPro.gltf`,
  [ClassroomTypeEnum.EXTRA_LARGE]: `${DESK_MODEL_BASE_PATH}/deskChairUltra.gltf`
};

const deskChairModelTexturePathMap: Record<ClassroomTypeEnum, string> = {
  [ClassroomTypeEnum.SMALL]: `${DESKCHAIR_MODEL_TEXTURE_PATH}/deskChairMini_baked.jpg`,
  [ClassroomTypeEnum.MIDDLE]: `${DESKCHAIR_MODEL_TEXTURE_PATH}/deskChairMiddle_baked.jpg`,
  [ClassroomTypeEnum.LARGE]: `${DESKCHAIR_MODEL_TEXTURE_PATH}/deskChairPro_baked.jpg`,
  [ClassroomTypeEnum.EXTRA_LARGE]: `${DESKCHAIR_MODEL_TEXTURE_PATH}/deskChairUltra_baked.jpg`
};

// 教室模型路径（根据课程记录的教室类型响应式切换）
export const getClassroomModelPathByRecord = (courseRecord: CourseRecordVO | null): string => {
  const type = courseRecord?.classroomType ?? ClassroomTypeEnum.LARGE;
  return classroomTypeModelPathMap[type] || `${CLASSROOM_MODEL_BASE_PATH}/classroomPro.gltf`;
};

// 教室模型纹理路径（根据课程记录的教室类型响应式切换）
export const getClassroomModelTexturePathByRecord = (courseRecord: CourseRecordVO | null): string => {
  const type = courseRecord?.classroomType ?? ClassroomTypeEnum.LARGE;
  return classroomModelTexturePathMap[type] || `${CLASSROOM_MODEL_TEXTURE_PATH}/classroomPro_baked.jpg`;
};

// 课桌椅模型路径（根据教室类型响应式切换）
export const getDeskModelPathByRecord = (courseRecord: CourseRecordVO | null): string => {
  const type = courseRecord?.classroomType ?? ClassroomTypeEnum.LARGE;
  return deskTypeModelPathMap[type] || `${DESK_MODEL_BASE_PATH}/deskChairPro.gltf`;
};

// 桌椅模型纹理路径（根据课程记录的教室类型响应式切换）
export const getdeskChairModelTexturePathByRecord = (courseRecord: CourseRecordVO | null): string => {
  const type = courseRecord?.classroomType ?? ClassroomTypeEnum.LARGE;
  return deskChairModelTexturePathMap[type] || `${DESKCHAIR_MODEL_TEXTURE_PATH}/deskChairPro_baked.jpg`;
};