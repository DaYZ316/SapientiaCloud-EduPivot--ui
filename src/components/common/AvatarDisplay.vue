<template>
  <div class="avatar-container">
    <!-- 当有头像源时显示头像（包括加载中状态） -->
    <n-avatar
        v-if="props.avatarSrc"
        :class="[avatarClass, { 'large-avatar': isLargeSize }]"
        :round="round"
        :size="avatarSize"
        :src="shouldShowImage ? props.avatarSrc : undefined"
        :style="{ backgroundColor: avatarColor, fontSize: fontSize + 'px' }"
        @error="handleImageError"
        @load="handleImageLoad"
    >
      <!-- 在图片加载期间或加载失败时显示文字 -->
      <template v-if="!shouldShowImage">
        {{ userInitial }}
      </template>
    </n-avatar>

    <!-- 当没有头像源时显示文字头像 -->
    <n-avatar
        v-else
        :class="[avatarClass, { 'large-avatar': isLargeSize }]"
        :round="round"
        :size="avatarSize"
        :style="{ backgroundColor: avatarColor, fontSize: fontSize + 'px' }"
    >
      {{ userInitial }}
    </n-avatar>

    <!-- 图片加载中状态 -->
    <div v-if="imageLoading" class="loading-overlay">
      <n-spin size="small"/>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from 'vue'
import {NAvatar, NSpin} from 'naive-ui'

// 预定义的头像背景颜色数组
const avatarColors = [
  '#FF6B6B', // 珊瑚红
  '#4ECDC4', // 青绿色
  '#45B7D1', // 天蓝色
  '#96CEB4', // 薄荷绿
  '#FFEAA7', // 淡黄色
  '#DDA0DD', // 梅花紫
  '#98D8C8', // 海绿色
  '#F7DC6F', // 金黄色
  '#BB8FCE', // 淡紫色
  '#85C1E9', // 浅蓝色
  '#F8C471', // 橙色
  '#82E0AA', // 浅绿色
  '#F1948A', // 粉红色
  '#D7BDE2'  // 淡紫色
]

interface Props {
  // 头像图片地址
  avatarSrc?: string | null
  // 用户名（用于生成首字母和背景色）
  username?: string | null
  // 用户昵称
  nickName?: string | null
  // 学生真实姓名（优先级最高）
  studentRealName?: string | null
  // 教师真实姓名（优先级最高）
  teacherRealName?: string | null
  // 头像大小
  size?: 'small' | 'medium' | 'large' | number
  // 是否圆形
  round?: boolean
  // 自定义样式类
  avatarClass?: string
}

const props = withDefaults(defineProps<Props>(), {
  avatarSrc: undefined,
  username: undefined,
  nickName: undefined,
  studentRealName: undefined,
  teacherRealName: undefined,
  size: 'medium',
  round: true,
  avatarClass: ''
})

// 图片加载状态
const imageError = ref(false)
const imageLoading = ref(false)

// 根据用户信息生成稳定的随机颜色
const getAvatarColor = (text: string): string => {
  if (!text) return '#000000' // 默认黑色背景

  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash)
  }
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

// 获取用户名（优先级：角色真实姓名 > nickName > username）
const userName = computed(() => {
  // 优先使用角色对应的真实姓名
  if (props.studentRealName) return props.studentRealName
  if (props.teacherRealName) return props.teacherRealName
  // 其次使用用户昵称
  if (props.nickName) return props.nickName
  // 最后使用用户名
  return props.username || ''
})

// 获取用户名首字母作为头像fallback
const userInitial = computed(() => {
  return userName.value ? userName.value.charAt(0).toUpperCase() : ''
})

// 获取头像背景颜色
const avatarColor = computed(() => {
  return getAvatarColor(userName.value)
})

// 计算头像尺寸
const avatarSize = computed(() => {
  if (typeof props.size === 'number') {
    return props.size
  }
  const sizeMap = {
    small: 32,
    medium: 40,
    large: 48
  }
  return sizeMap[props.size] || 40
})

// 判断是否为最大尺寸
const isLargeSize = computed(() => {
  if (typeof props.size === 'number') {
    return props.size >= 48
  }
  return props.size === 'large'
})

// 计算文字大小（基于头像尺寸的百分比）
const fontSize = computed(() => {
  const size = avatarSize.value
  // 文字大小为头像尺寸的50%，让文字更清晰可见
  return Math.max(14, Math.round(size * 0.5))
})

// 处理图片加载失败
const handleImageError = () => {
  imageError.value = true
  imageLoading.value = false
}

// 处理图片加载成功
const handleImageLoad = () => {
  imageLoading.value = false
  imageError.value = false
}

// 判断是否应该显示图片
const shouldShowImage = computed(() => {
  // 如果有头像源且图片没有加载失败，则显示图片
  return !!(props.avatarSrc && !imageError.value)
})

// 监听头像源变化，重置加载状态
watch(() => props.avatarSrc, (newValue) => {
  if (newValue) {
    imageLoading.value = true
    imageError.value = false
  } else {
    imageLoading.value = false
    imageError.value = false
  }
}, {immediate: true})

</script>

<style lang="scss" scoped>
.avatar-container {
  display: inline-block;
  position: relative;
}

.loading-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  z-index: 1;
}

.large-avatar {
  border: 4px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
