<template>
  <div class="avatar-upload">
    <n-upload
        ref="uploadRef"
        v-model:file-list="fileList"
        :accept="accept"
        :custom-request="handleFileSelect"
        :disabled="disabled"
        :max="1"
        :show-file-list="false"
        @before-upload="beforeUpload"
    >
      <n-avatar
          :size="size"
          :src="modelValue || placeholder"
          class="avatar-trigger"
          round
      >
        <template #fallback>
          <Icon :component="PersonOutline" :size="size * 0.95"/>
        </template>
      </n-avatar>
      <div v-if="!disabled" class="upload-overlay">
        <Icon :component="CameraOutline" :size="24"/>
        <span class="upload-text">{{ t('common.uploadAvatar') }}</span>
      </div>
    </n-upload>

    <!-- 图片裁剪对话框 -->
    <n-modal
        v-model:show="showCropModal"
        :mask-closable="false"
        :on-after-leave="resetCropModal"
        :title="t('common.cropAvatar')"
        preset="card"
        style="width: 800px"
    >
      <div class="crop-container">
        <div class="crop-preview">
          <img
              v-show="imageUrl"
              ref="cropperImageRef"
              :src="imageUrl"
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

            <n-space vertical>
              <n-button-group size="small">
                <n-button :disabled="!cropperInstance" @click="rotateLeft">
                  <template #icon>
                    <Icon :component="RefreshOutline"/>
                  </template>
                </n-button>
                <n-button :disabled="!cropperInstance" @click="rotateRight">
                  <template #icon>
                    <Icon :component="RefreshOutline"/>
                  </template>
                </n-button>
                <n-button :disabled="!cropperInstance" @click="flipX">
                  <template #icon>
                    <Icon :component="SwapHorizontalOutline"/>
                  </template>
                </n-button>
                <n-button :disabled="!cropperInstance" @click="flipY">
                  <template #icon>
                    <Icon :component="SwapVerticalOutline"/>
                  </template>
                </n-button>
              </n-button-group>

              <n-space>
                <n-button :disabled="!cropperInstance" :loading="uploading" type="primary" @click="confirmCrop">
                  <template #icon>
                    <Icon :component="CheckmarkOutline"/>
                  </template>
                  {{ t('common.confirm') }}
                </n-button>
                <n-button @click="showCropModal = false">
                  {{ t('common.cancel') }}
                </n-button>
              </n-space>
            </n-space>
          </n-space>
        </div>
      </div>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import {computed, nextTick, onUnmounted, ref, watch} from 'vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import type {UploadCustomRequestOptions, UploadFileInfo} from '@/types/naive-ui'
import {uploadFile} from '@/api'
import {getDiscreteApi} from '@/utils/naiveUIHelper'
import {useI18n} from 'vue-i18n'
import {
  CameraOutline,
  CheckmarkOutline,
  PersonOutline,
  RefreshOutline,
  SwapHorizontalOutline,
  SwapVerticalOutline
} from '@vicons/ionicons5'
import Icon from './Icon.vue'
import type {AvatarUploadEmits, AvatarUploadProps} from '@/types'

// Props with defaults
const props = withDefaults(defineProps<AvatarUploadProps>(), {
  size: 80,
  cropSize: 200,
  maxFileSize: 2 * 1024 * 1024, // 2MB
  accept: '.jpg,.jpeg,.png',
  disabled: false,
  placeholder: '/default-avatar.png'
})

// Emits
const emit = defineEmits<AvatarUploadEmits>()

// Composables
const {message} = getDiscreteApi()
const {t} = useI18n()

// Refs
const uploadRef = ref()
const cropperImageRef = ref<HTMLImageElement>()
const previewCanvasRef = ref<HTMLCanvasElement>()
const fileList = ref<UploadFileInfo[]>([])

// Reactive data
const showCropModal = ref(false)
const uploading = ref(false)
const imageUrl = ref('')
const cropperInstance = ref<Cropper | null>(null)

// Computed
const modelValue = computed({
  get: () => props.modelValue,
  set: (value: string) => emit('update:modelValue', value)
})

const previewSize = computed(() => Math.min(props.cropSize * 0.6, 120))

// Methods
const beforeUpload = (data: { file: UploadFileInfo }): boolean => {
  const {file} = data

  // 验证文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg']
  if (!allowedTypes.includes(file.file?.type || '')) {
    message.error(t('common.avatarTypeError'))
    return false
  }

  // 验证文件大小
  if ((file.file?.size || 0) > props.maxFileSize) {
    message.error(t('common.avatarSizeError'))
    return false
  }

  return true
}

const handleFileSelect = ({file}: UploadCustomRequestOptions) => {
  if (!file.file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    imageUrl.value = e.target?.result as string
    showCropModal.value = true
    nextTick(() => {
      initCropper()
    })
  }
  reader.readAsDataURL(file.file)
}

const initCropper = () => {
  if (!cropperImageRef.value || !imageUrl.value) return

  // 销毁之前的实例
  if (cropperInstance.value) {
    cropperInstance.value.destroy()
    cropperInstance.value = null
  }

  // 创建新的 Cropper 实例
  cropperInstance.value = new Cropper(cropperImageRef.value, {
    aspectRatio: 1, // 正方形裁剪
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

const confirmCrop = async () => {
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
      message.error(t('common.avatarUploadFail'))
      return
    }

    // 转换为 blob
    croppedCanvas.toBlob(async (blob: Blob | null) => {
      if (!blob) {
        message.error(t('common.avatarUploadFail'))
        return
      }

      await uploadCroppedImage(blob)
    }, 'image/jpeg', 0.8)
  } catch (error) {
    console.error('头像裁剪失败:', error)
    emit('upload-error', error as Error)
    message.error(t('common.avatarUploadFail'))
  } finally {
    uploading.value = false
  }
}

const uploadCroppedImage = async (blob: Blob) => {
  try {
    // 创建File对象并上传
    const fileName = `avatar_${Date.now()}.jpg`
    const file = new File([blob], fileName, {type: 'image/jpeg'})
    const response = await uploadFile(file, 'avatars')

    if (response.success && response.data) {
      const avatarUrl = response.data.url
      modelValue.value = avatarUrl
      emit('upload-success', avatarUrl)
      message.success(t('common.avatarUploadSuccess'))
      showCropModal.value = false
    } else {
      emit('upload-error', new Error(response.message || 'Upload failed'))
      message.error(response.message || t('common.avatarUploadFail'))
    }
  } catch (error) {
    console.error('头像上传失败:', error)
    emit('upload-error', error as Error)
    message.error(t('common.avatarUploadFail'))
  }
}

const resetCropModal = () => {
  imageUrl.value = ''
  fileList.value = []

  // 销毁 cropper 实例
  if (cropperInstance.value) {
    cropperInstance.value.destroy()
    cropperInstance.value = null
  }
}

// 监听模态框显示状态
watch(showCropModal, (visible: boolean) => {
  if (!visible) {
    resetCropModal()
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
  position: relative;
  display: inline-block;

  .avatar-trigger {
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;

    &:hover {
      border-color: var(--n-border-color);
      transform: scale(1.05);
    }
  }

  .upload-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.6);
    border-radius: 50%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
    color: white;

    .upload-text {
      font-size: 12px;
      margin-top: 4px;
    }
  }

  &:hover .upload-overlay {
    opacity: 1;
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
        border: none;
        border-radius: 8px;
        overflow: hidden;
        background: var(--n-card-color);
        display: flex;
        align-items: center;
        justify-content: center;

        .preview-canvas {
          border-radius: 50%;
          max-width: 100%;
          max-height: 100%;
        }
      }
    }
  }
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