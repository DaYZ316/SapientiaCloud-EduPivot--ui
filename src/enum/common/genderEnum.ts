/**
 * 性别枚举
 */
export enum GenderEnum {
  /** 未知 */
  UNKNOWN = 0,
  /** 男 */
  MALE = 1,
  /** 女 */
  FEMALE = 2
}

/**
 * 性别枚举中文标签
 */
export const genderLabelMap = {
  [GenderEnum.UNKNOWN]: '未知',
  [GenderEnum.MALE]: '男',
  [GenderEnum.FEMALE]: '女',
};

/**
 * 性别枚举英文标签
 */
export const genderEnLabelMap = {
  [GenderEnum.UNKNOWN]: 'Unknown',
  [GenderEnum.MALE]: 'Male',
  [GenderEnum.FEMALE]: 'Female',
};

/**
 * 性别枚举选项数组（中文）
 */
export const genderOptions = [
  { label: '未知', value: GenderEnum.UNKNOWN },
  { label: '男', value: GenderEnum.MALE },
  { label: '女', value: GenderEnum.FEMALE }
];

/**
 * 性别枚举选项数组（英文）
 */
export const genderEnOptions = [
  { label: 'Unknown', value: GenderEnum.UNKNOWN },
  { label: 'Male', value: GenderEnum.MALE },
  { label: 'Female', value: GenderEnum.FEMALE }
];

/**
 * 根据当前语言获取性别枚举选项
 * @param isEn 是否为英文
 * @returns 性别枚举选项数组
 */
export function getGenderOptions(isEn: boolean = false) {
  return isEn ? genderEnOptions : genderOptions;
}

/**
 * 获取性别标签
 * @param value 性别枚举值
 * @param isEn 是否为英文
 * @returns 性别标签
 */
export function getGenderLabel(value: GenderEnum | number | string, isEn: boolean = false): string {
  // 确保value是数字类型
  const numValue = (typeof value === 'string') ? parseInt(value, 10) : value;
  
  // 转换为GenderEnum类型
  const enumValue = numValue as GenderEnum;
  
  // 获取对应语言的标签
  const map = isEn ? genderEnLabelMap : genderLabelMap;
  
  // 如果映射中存在该值，则返回对应标签，否则返回未知
  return map[enumValue] || map[GenderEnum.UNKNOWN];
} 