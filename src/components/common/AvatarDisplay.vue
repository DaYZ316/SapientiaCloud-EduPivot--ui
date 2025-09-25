<template>
  <div class="avatar-container">
    <n-avatar
        :class="[avatarClass, { 'large-avatar': isLargeSize }]"
        :round="round"
        :size="avatarSize"
        :src="shouldShowImage ? (props.avatarSrc || undefined) : undefined"
        :style="avatarStyle"
        @error="handleImageError"
        @load="handleImageLoad"
    >
      {{ userInitial }}
    </n-avatar>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue'
import {NAvatar} from 'naive-ui'

// 预定义的头像背景颜色数组
const avatarColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD',
  '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA',
  '#F1948A', '#D7BDE2'
]

interface Props {
  avatarSrc?: string | null
  username?: string | null
  nickName?: string | null
  studentRealName?: string | null
  teacherRealName?: string | null
  size?: 'small' | 'medium' | 'large' | number
  round?: boolean
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

// 图片加载失败状态
const imageError = ref(false)

// 根据用户信息生成稳定的随机颜色
const getAvatarColor = (text: string): string => {
  if (!text) return '#000000'

  let hash = 0
  for (let i = 0; i < text.length; i++) {
    hash = text.charCodeAt(i) + ((hash << 5) - hash)
  }
  return avatarColors[Math.abs(hash) % avatarColors.length]
}

// 获取用户名（优先级：角色真实姓名 > nickName > username）
const userName = computed(() => {
  return props.studentRealName || props.teacherRealName || props.nickName || props.username || ''
})

// 获取用户名首字母作为头像fallback
const userInitial = computed(() => {
  return userName.value ? userName.value.charAt(0).toUpperCase() : ''
})

// 计算头像尺寸
const avatarSize = computed(() => {
  if (typeof props.size === 'number') return props.size

  const sizeMap = {small: 32, medium: 40, large: 48}
  return sizeMap[props.size] || 40
})

// 判断是否为最大尺寸
const isLargeSize = computed(() => {
  return typeof props.size === 'number' ? props.size >= 48 : props.size === 'large'
})

// 头像样式
const avatarStyle = computed(() => ({
  backgroundColor: getAvatarColor(userName.value),
  fontSize: Math.max(14, Math.round(avatarSize.value * 0.5)) + 'px'
}))

// 判断是否应该显示图片
const shouldShowImage = computed(() => {
  return !!(props.avatarSrc && !imageError.value)
})

// 处理图片加载失败
const handleImageError = () => {
  imageError.value = true
}

// 处理图片加载成功
const handleImageLoad = () => {
  imageError.value = false
}

</script>

<style lang="scss" scoped>
.avatar-container {
  display: inline-block;
}

.large-avatar {
  border: 4px solid white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
