<template>
  <div :class="{ disabled: props.disabled }" class="avatar-upload">
    <!-- 头像显示区域 -->
    <div
        :style="{ width: avatarSize + 'px', height: avatarSize + 'px' }"
        class="avatar-container"
        @click="handleAvatarClick"
    >
      <!-- 当有头像源时显示头像（包括加载中状态） -->
      <n-avatar
          v-if="props.modelValue"
          :class="props.avatarClass"
          :round="props.round"
          :size="avatarSize"
          :src="shouldShowImage ? props.modelValue : undefined"
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
          :class="props.avatarClass"
          :round="props.round"
          :size="avatarSize"
          :style="{ backgroundColor: avatarColor, fontSize: fontSize + 'px' }"
      >
        {{ userInitial }}
      </n-avatar>

      <!-- 上传遮罩层 -->
      <div v-if="!props.disabled && !imageLoading" class="upload-overlay">
        <n-icon color="white" size="20">
          <CameraIcon/>
        </n-icon>
        <span class="upload-text">{{ t('common.uploadAvatar') }}</span>
      </div>

      <!-- 图片加载中状态 -->
      <div v-if="imageLoading" class="loading-overlay">
        <n-spin size="small"/>
      </div>
    </div>

    <!-- 隐藏的文件输入 -->
    <input
        ref="fileInputRef"
        :accept="props.accept"
        style="display: none"
        type="file"
        @change="handleFileChange"
    />

    <!-- 图片裁剪模态框 -->
    <n-modal
        v-model:show="showCropModal"
        :mask-closable="false"
        :on-after-leave="resetCropModal"
        :title="t('common.cropImage')"
        preset="card"
        style="width: 900px"
    >
      <div class="crop-container">
        <div class="crop-preview">
          <img
              v-show="cropImageUrl"
              ref="cropImageRef"
              :src="cropImageUrl"
              class="cropper-image"
          />
        </div>
        <div class="crop-controls">
          <n-space vertical>
            <n-card :bordered="false" size="small">
              <template #header>
                <span>{{ t('common.cropPreview') }}</span>
              </template>
              <div class="crop-result-preview">
                <div :style="{ width: previewSize + 'px', height: previewSize + 'px' }" class="preview-container">
                  <canvas ref="previewCanvasRef" class="preview-canvas"/>
                </div>
              </div>
            </n-card>

            <!-- 控制按钮 - 对准预览头像下边 -->
            <div class="control-buttons">
              <n-button-group size="small">
                <n-button :disabled="!cropperInstance" :title="t('common.rotateLeft')" @click="rotateLeft">
                  <template #icon>
                    <Icon :component="RefreshOutline"/>
                  </template>
                </n-button>
                <n-button :disabled="!cropperInstance" :title="t('common.rotateRight')" @click="rotateRight">
                  <template #icon>
                    <Icon :component="RefreshOutline"/>
                  </template>
                </n-button>
                <n-button :disabled="!cropperInstance" :title="t('common.flipHorizontal')" @click="flipX">
                  <template #icon>
                    <Icon :component="SwapHorizontalOutline"/>
                  </template>
                </n-button>
                <n-button :disabled="!cropperInstance" :title="t('common.flipVertical')" @click="flipY">
                  <template #icon>
                    <Icon :component="SwapVerticalOutline"/>
                  </template>
                </n-button>
              </n-button-group>
            </div>
          </n-space>
        </div>
      </div>

      <!-- 确认和取消按钮 - 位于模态框右下角 -->
      <div class="modal-footer">
        <n-space>
          <n-button @click="showCropModal = false">
            {{ t('common.cancel') }}
          </n-button>
          <n-button :disabled="!cropperInstance" :loading="uploading" type="primary" @click="handleCropConfirm">
            <template #icon>
              <Icon :component="CheckmarkOutline"/>
            </template>
            {{ t('common.confirm') }}
          </n-button>
        </n-space>
      </div>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import {computed, nextTick, onUnmounted, ref, watch} from 'vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import {NAvatar, NButton, NButtonGroup, NCard, NIcon, NModal, NSpace, NSpin, useMessage} from 'naive-ui'
import {
  Camera as CameraIcon,
  CheckmarkOutline,
  RefreshOutline,
  SwapHorizontalOutline,
  SwapVerticalOutline
} from '@vicons/ionicons5'
import {useI18n} from 'vue-i18n'
import {uploadFile} from '@/api/minIO'
import type {AvatarUploadEmits, AvatarUploadProps} from '@/types/minIO/file'
import Icon from '@/components/common/Icon.vue'

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

// Props定义
const props = withDefaults(defineProps<AvatarUploadProps>(), {
  modelValue: undefined,
  size: 'medium',
  cropSize: 200,
  maxFileSize: 2 * 1024 * 1024, // 2MB
  accept: 'image/*',
  disabled: false,
  username: undefined,
  nickName: undefined,
  studentRealName: undefined,
  teacherRealName: undefined,
  round: true,
  avatarClass: ''
})

// Emits定义
const emit = defineEmits<AvatarUploadEmits>()

// 组合式API
const {t} = useI18n()
const message = useMessage()

// 响应式数据
const fileInputRef = ref<HTMLInputElement>()
const cropImageRef = ref<HTMLImageElement>()
const previewCanvasRef = ref<HTMLCanvasElement>()
const showCropModal = ref(false)
const cropImageUrl = ref('')
const uploading = ref(false)
const currentFile = ref<File | null>(null)
const cropperInstance = ref<Cropper | null>(null)
const imageError = ref(false)
const imageLoading = ref(false)

// 预览尺寸
const previewSize = computed(() => Math.max(80, Math.round(props.cropSize * 0.4)))

// 根据用户信息生成稳定的随机颜色
const getAvatarColor = (text: string): string => {
  if (!text) return avatarColors[0]

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
  return !!(props.modelValue && !imageError.value)
})

// 处理头像点击
const handleAvatarClick = () => {
  if (props.disabled) return
  fileInputRef.value?.click()
}

// 处理文件选择
const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) return

  // 验证文件类型
  if (!file.type.startsWith('image/')) {
    message.error(t('common.invalidImageType'))
    return
  }

  // 验证文件大小
  if (file.size > props.maxFileSize) {
    message.error(t('common.fileSizeExceeded', {maxSize: Math.round(props.maxFileSize / 1024 / 1024)}))
    return
  }

  currentFile.value = file

  // 创建预览URL
  const reader = new FileReader()
  reader.onload = (e) => {
    cropImageUrl.value = e.target?.result as string
    showCropModal.value = true
    nextTick(() => {
      initCropper()
    })
  }
  reader.readAsDataURL(file)
}

// 初始化裁剪器
const initCropper = () => {
  if (!cropImageRef.value || !cropImageUrl.value) return

  // 销毁之前的实例
  if (cropperInstance.value) {
    cropperInstance.value.destroy()
    cropperInstance.value = null
  }

  // 创建新的 Cropper 实例
  cropperInstance.value = new Cropper(cropImageRef.value, {
    aspectRatio: 1, // 头像使用1:1比例
    viewMode: 1,
    guides: true,
    center: true,
    highlight: false,
    background: true,
    autoCropArea: 0.8,
    movable: true,
    rotatable: true,
    scalable: true,
    zoomable: true,
    minContainerWidth: 400,
    minContainerHeight: 400,
    crop: updatePreview
  } as any)
}

// 更新预览
const updatePreview = () => {
  if (!cropperInstance.value || !previewCanvasRef.value) return

  const canvas = previewCanvasRef.value
  const context = canvas.getContext('2d')
  if (!context) return

  // 设置 canvas 尺寸
  canvas.width = previewSize.value
  canvas.height = previewSize.value

  // 获取裁剪区域的图像数据
  const croppedCanvas = cropperInstance.value.getCroppedCanvas({
    width: previewSize.value,
    height: previewSize.value,
    imageSmoothingQuality: 'high'
  })

  if (croppedCanvas) {
    context.clearRect(0, 0, canvas.width, canvas.height)
    context.drawImage(croppedCanvas, 0, 0)
  }
}

// 旋转和翻转功能
const rotateLeft = () => {
  cropperInstance.value?.rotate(-90)
}

const rotateRight = () => {
  cropperInstance.value?.rotate(90)
}

const flipX = () => {
  const scaleX = cropperInstance.value?.getData().scaleX || 1
  cropperInstance.value?.scaleX(-scaleX)
}

const flipY = () => {
  const scaleY = cropperInstance.value?.getData().scaleY || 1
  cropperInstance.value?.scaleY(-scaleY)
}

// 处理裁剪确认
const handleCropConfirm = async () => {
  if (!cropperInstance.value) return

  try {
    uploading.value = true

    // 获取裁剪后的 canvas
    const croppedCanvas = cropperInstance.value.getCroppedCanvas({
      width: props.cropSize,
      height: props.cropSize,
      imageSmoothingQuality: 'high'
    })

    if (!croppedCanvas) {
      message.error(t('common.uploadFailed'))
      return
    }

    // 转换为 blob
    croppedCanvas.toBlob(async (blob: Blob | null) => {
      if (!blob) {
        message.error(t('common.uploadFailed'))
        return
      }

      await uploadCroppedImage(blob)
    }, 'image/jpeg', 0.8)
  } catch (error) {
    emit('upload-error', error as Error)
    message.error(t('common.uploadFailed'))
  } finally {
    uploading.value = false
  }
}

// 上传裁剪后的图片
const uploadCroppedImage = async (blob: Blob) => {
  try {
    // 创建File对象并上传
    const fileName = `avatar_${Date.now()}.jpg`
    const file = new File([blob], fileName, {type: 'image/jpeg'})
    const response = await uploadFile(file, 'avatar')

    if (response && response.data) {
      const uploadResult = response.data
      const avatarUrl = uploadResult.url || uploadResult.objectName

      // 更新头像URL
      emit('update:modelValue', avatarUrl)
      emit('upload-success', avatarUrl)
      emit('update-avatar', avatarUrl)

      message.success(t('common.avatarUpdateSuccess'))
      showCropModal.value = false
    } else {
      throw new Error('Upload response is invalid')
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Upload failed'
    message.error(t('common.uploadFailed') + ': ' + errorMessage)
    emit('upload-error', error instanceof Error ? error : new Error(errorMessage))
  } finally {
    // 清空文件输入
    if (fileInputRef.value) {
      fileInputRef.value.value = ''
    }
    currentFile.value = null
  }
}

// 重置裁剪模态框
const resetCropModal = () => {
  cropImageUrl.value = ''

  // 销毁 cropper 实例
  if (cropperInstance.value) {
    cropperInstance.value.destroy()
    cropperInstance.value = null
  }
}

// 监听头像URL变化，重置图片错误状态
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    imageLoading.value = true
    imageError.value = false
  } else {
    imageLoading.value = false
    imageError.value = false
  }
}, {immediate: true})

// 监听模态框显示状态
watch(showCropModal, (visible: boolean) => {
  if (!visible) {
    resetCropModal()
  } else {
    // 模态框显示后初始化裁剪器
    nextTick(() => {
      initCropper()
    })
  }
})

// 组件卸载时清理
onUnmounted(() => {
  if (cropperInstance.value) {
    cropperInstance.value.destroy()
    cropperInstance.value = null
  }
})
</script>

<style lang="scss" scoped>

.avatar-upload {
  display: inline-block;
  position: relative;

  &.disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .avatar-container {
    position: relative;
    cursor: pointer;
    border-radius: 50%;
    overflow: hidden;
    transition: all 0.3s ease;

    &:hover:not(.disabled) {
      .upload-overlay {
        opacity: 1;
      }
    }

    .upload-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      border-radius: 50%;

      .upload-text {
        color: white;
        font-size: 12px;
        margin-top: 4px;
        text-align: center;
      }
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
      z-index: 2;
    }
  }

}

.crop-container {
  display: flex;
  gap: 24px;

  .crop-preview {
    flex: 1;
    height: 400px;

    .cropper-image {
      max-width: 100%;
      max-height: 100%;
      display: block;
    }
  }

  .crop-controls {
    width: 240px;

    .crop-result-preview {
      display: flex;
      justify-content: center;
      padding: 16px;

      .preview-container {
        border: 1px solid var(--n-border-color);
        border-radius: 50%;
        overflow: hidden;
        background: var(--n-card-color);
        display: flex;
        align-items: center;
        justify-content: center;

        .preview-canvas {
          max-width: 100%;
          max-height: 100%;
        }
      }
    }

    .control-buttons {
      display: flex;
      justify-content: center;
      margin-top: 16px;
    }
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  margin-top: 24px;
  padding-top: 16px;
  border-top: 1px solid var(--n-border-color);
}

@media (max-width: 768px) {
  .crop-container {
    flex-direction: column;

    .crop-controls {
      width: 100%;
    }

    .crop-preview {
      height: 300px;
    }
  }
}
</style>
