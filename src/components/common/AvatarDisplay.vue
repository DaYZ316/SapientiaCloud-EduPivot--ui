<template>
  <div class="avatar-container">
    <n-avatar
        :class="[avatarClass, { 'large-avatar': isLargeSize }]"
        :round="round"
        :size="avatarSize"
        :src="shouldRenderImage ? displaySrc : undefined"
        :style="avatarStyle"
        @error="handleImageError"
        @load="handleImageLoad"
    >
      {{ userInitial }}
    </n-avatar>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from 'vue'
import {NAvatar} from 'naive-ui'
import defaultAvatar from '@/assets/image/anonymous-user.png'
import type {AvatarDisplayProps} from '@/types/components/avatar'
import {
  getAvatarColor,
  getAvatarFontSize,
  getAvatarInitial,
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

// 图片加载失败状态
const imageError = ref(false)

const userName = computed(() => resolveUserName(props))
const userInitial = computed(() => getAvatarInitial(userName.value))
const avatarSize = computed(() => normalizeAvatarSize(props.size))
const isLargeSize = computed(() => avatarSize.value >= 48)
const avatarStyle = computed(() => ({
  backgroundColor: getAvatarColor(userName.value),
  fontSize: getAvatarFontSize(avatarSize.value)
}))

const fallbackSrc = computed(() => props.fallbackSrc || defaultAvatar)
const isPrimaryAvatarActive = computed(() => Boolean(props.avatarSrc) && !imageError.value)
const displaySrc = computed(() => {
  return isPrimaryAvatarActive.value ? props.avatarSrc : fallbackSrc.value
})
const shouldRenderImage = computed(() => Boolean(displaySrc.value))

const handleImageError = () => {
  if (isPrimaryAvatarActive.value) {
    imageError.value = true
  }
}

const handleImageLoad = () => {
  if (isPrimaryAvatarActive.value) {
    imageError.value = false
  }
}

watch(
    () => props.avatarSrc,
    () => {
      imageError.value = false
    }
)

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
