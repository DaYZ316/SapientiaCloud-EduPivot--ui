<template>
  <div class="image-upload">
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
      <div :class="{ 'round': round }" :style="{ width: size + 'px', height: size + 'px' }" class="upload-trigger">
        <img
            v-if="modelValue"
            :alt="t('common.imagePreview')"
            :src="modelValue"
            class="uploaded-image"
        />
        <div v-else class="placeholder">
          <Icon :component="ImageOutline" :size="size * 0.4"/>
          <span class="placeholder-text">{{ t('common.selectImage') }}</span>
        </div>
        <div v-if="!disabled" class="upload-overlay">
          <Icon :component="CameraOutline" :size="24"/>
          <span class="upload-text">{{ t('common.uploadImage') }}</span>
        </div>
      </div>
    </n-upload>

    <!-- 图片裁剪对话框 -->
    <n-modal
        v-if="showCrop"
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
  ImageOutline,
  RefreshOutline,
  SwapHorizontalOutline,
  SwapVerticalOutline
} from '@vicons/ionicons5'
import Icon from '@/components/common/Icon.vue'
import type {ImageUploadEmits, ImageUploadProps} from '@/types/components/imageUpload'

// Props with defaults
const props = withDefaults(defineProps<ImageUploadProps>(), {
  size: 120,
  cropSize: 300,
  maxFileSize: 5 * 1024 * 1024, // 5MB
  accept: '.jpg,.jpeg,.png,.gif,.webp',
  disabled: false,
  placeholder: '/src/assets/image/default-course.png',
  uploadDir: 'images',
  showCrop: true,
  aspectRatio: 1,
  round: false,
  previewSize: 150
})

// Emits
const emit = defineEmits<ImageUploadEmits>()

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
  set: (value: string | null) => emit('update:modelValue', value)
})

// Methods
const beforeUpload = (data: { file: UploadFileInfo }): boolean => {
  const {file} = data

  // 验证文件类型
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp']
  if (!allowedTypes.includes(file.file?.type || '')) {
    return false
  }

  // 验证文件大小
  if ((file.file?.size || 0) > props.maxFileSize) {
    return false
  }

  // 触发before-upload事件
  const result = emit('before-upload', file)
  return result !== false
}

const handleFileSelect = ({file}: UploadCustomRequestOptions) => {
  if (!file.file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    imageUrl.value = e.target?.result as string

    if (props.showCrop) {
      showCropModal.value = true
      nextTick(() => {
        initCropper()
      })
    } else {
      // 直接上传，不进行裁剪
      uploadImageDirectly(file.file!)
    }
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
    aspectRatio: props.aspectRatio,
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
  canvas.width = props.previewSize
  canvas.height = props.previewSize

  // 获取裁剪区域的图像数据
  const croppedCanvas = cropperInstance.value.getCroppedCanvas({
    width: props.previewSize,
    height: props.previewSize,
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
      return
    }

    // 转换为 blob
    croppedCanvas.toBlob(async (blob: Blob | null) => {
      if (!blob) {
        return
      }

      await uploadCroppedImage(blob)
    }, 'image/jpeg', 0.8)
  } catch (error) {
    emit('upload-error', error as Error)
    message.error(t('common.imageUploadFail'))
  } finally {
    uploading.value = false
  }
}

const uploadImageDirectly = async (file: File) => {
  try {
    uploading.value = true
    const response = await uploadFile(file, props.uploadDir)

    if (response.success && response.data) {
      const imageUrl = response.data.url
      modelValue.value = imageUrl
      emit('upload-success', imageUrl)
      message.success(t('common.imageUploadSuccess'))
    }
  } finally {
    uploading.value = false
  }
}

const uploadCroppedImage = async (blob: Blob) => {
  // 创建File对象并上传
  const fileName = `image_${Date.now()}.jpg`
  const file = new File([blob], fileName, {type: 'image/jpeg'})
  const response = await uploadFile(file, props.uploadDir)

  if (response.success && response.data) {
    const imageUrl = response.data.url
    modelValue.value = imageUrl
    emit('upload-success', imageUrl)
    message.success(t('common.imageUploadSuccess'))
    showCropModal.value = false
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
.image-upload {
  position: relative;
  display: inline-block;

  .upload-trigger {
    position: relative;
    border: 2px dashed var(--n-border-color);
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--n-card-color);

    &.round {
      border-radius: 50%;
    }

    &:hover {
      border-color: var(--n-primary-color);
      transform: scale(1.02);
    }

    .uploaded-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .placeholder {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: var(--n-text-color-disabled);
      text-align: center;
      padding: 16px;

      .placeholder-text {
        font-size: 12px;
        margin-top: 8px;
        line-height: 1.4;
      }
    }

    .upload-overlay {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.6);
      border-radius: inherit;
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
        border-radius: 8px;
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
