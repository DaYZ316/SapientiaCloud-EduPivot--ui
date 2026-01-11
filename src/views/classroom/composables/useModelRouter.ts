import type {CourseRecordVO} from '@/types/classroom';
import {ClassroomTypeEnum} from '@/enum/classroom/classroomTypeEnum';

// 动态导入3D模型文件，Vite会处理路径解析
const classroomModelImports = {
  [ClassroomTypeEnum.SMALL]: () => import('@/assets/3Dmodel/classroom/classroomMini.gltf?url'),
  [ClassroomTypeEnum.MIDDLE]: () => import('@/assets/3Dmodel/classroom/classroomMiddle.gltf?url'),
  [ClassroomTypeEnum.LARGE]: () => import('@/assets/3Dmodel/classroom/classroomPro.gltf?url'),
  [ClassroomTypeEnum.EXTRA_LARGE]: () => import('@/assets/3Dmodel/classroom/classroomUltra.gltf?url')
};

const deskModelImports = {
  [ClassroomTypeEnum.SMALL]: () => import('@/assets/3Dmodel/desk_chair/deskChairMini.gltf?url'),
  [ClassroomTypeEnum.MIDDLE]: () => import('@/assets/3Dmodel/desk_chair/deskChairMiddle.gltf?url'),
  [ClassroomTypeEnum.LARGE]: () => import('@/assets/3Dmodel/desk_chair/deskChairPro.gltf?url'),
  [ClassroomTypeEnum.EXTRA_LARGE]: () => import('@/assets/3Dmodel/desk_chair/deskChairUltra.gltf?url')
};

// 缓存已解析的URL
const urlCache: Map<string, string> = new Map();

// 教室模型路径（根据课程记录的教室类型返回 dev/prod 可用路径）
export const getClassroomModelPathByRecord = async (courseRecord: CourseRecordVO | null): Promise<string> => {
  const type = courseRecord?.classroomType ?? ClassroomTypeEnum.LARGE;
  const cacheKey = `classroom_${type}`;

  if (urlCache.has(cacheKey)) {
    return urlCache.get(cacheKey)!;
  }

  try {
    const importFn = classroomModelImports[type] || classroomModelImports[ClassroomTypeEnum.LARGE];
    const module = await importFn();
    const url = module.default;
    urlCache.set(cacheKey, url);
    return url;
  } catch (error) {
    console.error('Failed to load classroom model:', error);
    // 返回默认路径作为fallback
    return `/assets/3Dmodel/classroom/classroomPro.gltf`;
  }
};

// 课桌椅模型路径（根据教室类型返回 dev/prod 可用路径）
export const getDeskModelPathByRecord = async (courseRecord: CourseRecordVO | null): Promise<string> => {
  const type = courseRecord?.classroomType ?? ClassroomTypeEnum.LARGE;
  const cacheKey = `desk_${type}`;

  if (urlCache.has(cacheKey)) {
    return urlCache.get(cacheKey)!;
  }

  try {
    const importFn = deskModelImports[type] || deskModelImports[ClassroomTypeEnum.LARGE];
    const module = await importFn();
    const url = module.default;
    urlCache.set(cacheKey, url);
    return url;
  } catch (error) {
    console.error('Failed to load desk model:', error);
    // 返回默认路径作为fallback
    return `/assets/3Dmodel/desk_chair/deskChairPro.gltf`;
  }
};