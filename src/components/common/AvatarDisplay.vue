<template>
  <n-avatar
      :class="props.avatarClass"
      :round="props.round"
      :size="avatarSize"
      :src="displayAvatarSrc"
      @error="handleImageError"
      @load="handleImageLoad"
  />
</template>

<script lang="ts" setup>
import {computed, ref, watch} from 'vue'
import {NAvatar} from 'naive-ui'
import {createAvatar} from '@dicebear/core'
import * as avatarCollection from '@dicebear/collection'
import type {AvatarDisplayProps} from '@/types/components/avatar'
import {
  getGradientColors,
  normalizeAvatarSize,
  resolveUserName
} from '@/utils/avatarUtil'

const props = withDefaults(defineProps<AvatarDisplayProps>(), {
  avatarSrc: null,
  username: null,
  nickName: null,
  studentRealName: null,
  teacherRealName: null,
  fallbackSrc: null,
  size: 'medium',
  round: true,
  avatarClass: ''
})

const imageError = ref(false)
const dicebearAvatarUrl = ref<string | null>(null)

const userName = computed(() => resolveUserName(props))
const avatarSize = computed(() => normalizeAvatarSize(props.size))

// 生成DiceBear头像URL（缓存）
const generateDicebearAvatar = () => {
  if (!userName.value) {
    dicebearAvatarUrl.value = null
    return
  }
  try {
    // 根据用户名生成稳定的渐变颜色组合
    const [color1, color2, color3] = getGradientColors(userName.value)
    const gradientId = `gradient-${userName.value.replace(/[^a-zA-Z0-9]/g, '')}-${avatarSize.value}`
    
    const avatar = createAvatar(avatarCollection.bottts, {
      seed: userName.value,
      size: avatarSize.value
    })
    
    // 获取 SVG 字符串并添加渐变背景和动画
    const svgString = avatar.toString()
    
    // 创建渐变定义和动画
    const gradientDef = `
      <defs>
        <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${color1};stop-opacity:1">
            <animate attributeName="stop-color" values="${color1};${color2};${color3};${color1}" dur="8s" repeatCount="indefinite"/>
          </stop>
          <stop offset="50%" style="stop-color:${color2};stop-opacity:1">
            <animate attributeName="stop-color" values="${color2};${color3};${color1};${color2}" dur="8s" repeatCount="indefinite"/>
          </stop>
          <stop offset="100%" style="stop-color:${color3};stop-opacity:1">
            <animate attributeName="stop-color" values="${color3};${color1};${color2};${color3}" dur="8s" repeatCount="indefinite"/>
          </stop>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#${gradientId})"/>
    `
    
    // 在 SVG 开头添加渐变背景
    const svgWithBackground = svgString.replace(
      /<svg([^>]*)>/,
      `<svg$1>${gradientDef}`
    )
    
    // 转换为 data URI（使用 URL 编码）
    dicebearAvatarUrl.value = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svgWithBackground)}`
  } catch {
    dicebearAvatarUrl.value = null
  }
}

// 计算最终显示的头像源
const displayAvatarSrc = computed<string | undefined>(() => {
  // 优先使用传入的头像源（如果存在且未出错）
  if (props.avatarSrc && !imageError.value) {
    return props.avatarSrc
  }

  // 如果头像src加载失败或不存在，使用DiceBear生成的头像作为后备
  return dicebearAvatarUrl.value || undefined
})

const handleImageError = () => {
  if (props.avatarSrc) {
    imageError.value = true
  }
}

const handleImageLoad = () => {
  if (props.avatarSrc) {
    imageError.value = false
  }
}

// 监听userName和avatarSize变化，生成DiceBear头像
watch(
    [userName, avatarSize],
    () => {
      if (userName.value) {
        generateDicebearAvatar()
      }
    },
    {immediate: true}
)

// 监听avatarSrc变化，重置错误状态
watch(
    () => props.avatarSrc,
    () => {
      imageError.value = false
    }
)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;
</style>

