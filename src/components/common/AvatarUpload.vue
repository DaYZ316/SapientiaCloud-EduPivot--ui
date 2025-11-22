<template>
  <div :class="{ disabled: props.disabled }" class="avatar-upload">
    <!-- 头像显示区域 -->
    <div
        :style="{ width: avatarSize + 'px', height: avatarSize + 'px' }"
        class="avatar-container"
        @click="handleAvatarClick"
    >
      <!-- 头像显示 -->
      <n-avatar
          :class="props.avatarClass"
          :round="props.round"
          :size="avatarSize"
          :src="shouldShowImage ? displayAvatarSrc : undefined"
          :style="avatarStyle"
          @error="handleImageError"
          @load="handleImageLoad"
      >
        {{ userInitial }}
      </n-avatar>

      <!-- 上传遮罩层 -->
      <div v-if="!props.disabled" class="upload-overlay">
        <n-icon color="white" size="20">
          <CameraIcon/>
        </n-icon>
        <span class="upload-text">{{ t('common.uploadAvatar') }}</span>
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
              v-if="cropImageUrl"
              ref="cropImageRef"
              :src="cropImageUrl || undefined"
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
import {NAvatar, NButton, NButtonGroup, NCard, NIcon, NModal, NSpace, useMessage} from 'naive-ui'
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
import {BusinessBucketCodeEnum} from '@/enum/minIO'
import Icon from '@/components/common/Icon.vue'
import defaultAvatar from '@/assets/image/anonymous-user.png'
import {
  getAvatarColor,
  getAvatarFontSize,
  getAvatarInitial,
  normalizeAvatarSize,
  resolveUserName
} from '@/utils/avatarUtil'

const props = withDefaults(defineProps<AvatarUploadProps>(), {
  modelValue: null,
  size: 'medium',
  cropSize: 200,
  maxFileSize: 2 * 1024 * 1024,
  accept: 'image/*',
  disabled: false,
  username: null,
  nickName: null,
  studentRealName: null,
  teacherRealName: null,
  fallbackSrc: null,
  round: true,
  avatarClass: '',
  bucketCode: BusinessBucketCodeEnum.USER_AVATAR
})

const emit = defineEmits<AvatarUploadEmits>()
const {t} = useI18n()
const message = useMessage()

const fileInputRef = ref<HTMLInputElement | null>(null)
const cropImageRef = ref<HTMLImageElement | null>(null)
const previewCanvasRef = ref<HTMLCanvasElement | null>(null)
const showCropModal = ref(false)
const cropImageUrl = ref<string | null>(null)
const uploading = ref(false)
const cropperInstance = ref<Cropper | null>(null)
const imageError = ref(false)

const previewSize = computed(() => {
  const baseSize = props.cropSize ?? 200
  return Math.max(80, Math.round(baseSize * 0.4))
})
const userName = computed(() => resolveUserName(props))
const userInitial = computed(() => getAvatarInitial(userName.value))
const avatarSize = computed(() => normalizeAvatarSize(props.size))
const avatarStyle = computed(() => ({
  backgroundColor: getAvatarColor(userName.value),
  fontSize: getAvatarFontSize(avatarSize.value)
}))
const fallbackSrc = computed<string | undefined>(() => {
  return props.fallbackSrc || defaultAvatar
})
const isPrimaryAvatarActive = computed(() => Boolean(props.modelValue) && !imageError.value)
const displayAvatarSrc = computed<string | undefined>(() => {
  if (isPrimaryAvatarActive.value && props.modelValue) {
    return props.modelValue
  }
  return fallbackSrc.value
})
const shouldShowImage = computed(() => Boolean(displayAvatarSrc.value))

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

const handleAvatarClick = () => {
  if (props.disabled) return
  fileInputRef.value?.click()
}

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]

  if (!file) {
    cropImageUrl.value = null
    resetFileInput()
    return
  }

  if (!file.type.startsWith('image/')) {
    cropImageUrl.value = null
    resetFileInput()
    return
  }

  const maxSize = props.maxFileSize ?? Number.POSITIVE_INFINITY
  if (file.size > maxSize) {
    cropImageUrl.value = null
    resetFileInput()
    return
  }

  const reader = new FileReader()
  reader.onload = (e) => {
    cropImageUrl.value = (e.target?.result as string) || null
    showCropModal.value = Boolean(cropImageUrl.value)
    if (showCropModal.value) {
      nextTick(() => {
        initCropper()
      })
    }
  }
  reader.readAsDataURL(file)
}

const initCropper = () => {
  if (!cropImageRef.value || !cropImageUrl.value) return

  if (cropperInstance.value) {
    cropperInstance.value.destroy()
    cropperInstance.value = null
  }

  cropperInstance.value = new Cropper(cropImageRef.value, {
    aspectRatio: 1,
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

  canvas.width = previewSize.value
  canvas.height = previewSize.value

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

const handleCropConfirm = () => {
  if (!cropperInstance.value || uploading.value) return

  uploading.value = true
  const croppedCanvas = cropperInstance.value.getCroppedCanvas({
    width: props.cropSize,
    height: props.cropSize,
    imageSmoothingQuality: 'high'
  })

  if (!croppedCanvas) {
    uploading.value = false
    return
  }

  croppedCanvas.toBlob((blob: Blob | null) => {
    if (!blob) {
      uploading.value = false
      return
    }

    uploadCroppedImage(blob).then(
        () => {
          uploading.value = false
        },
        () => {
          uploading.value = false
        }
    )
  }, 'image/jpeg', 0.8)
}

const uploadCroppedImage = async (blob: Blob) => {
  const fileName = `avatar_${Date.now()}.jpg`
  const file = new File([blob], fileName, {type: 'image/jpeg'})
  const response = await uploadFile(file, {directory: 'avatar', bucketCode: props.bucketCode}).then(
      (res) => res,
      (error) => {
        emit('upload-error', error instanceof Error ? error : new Error('avatar upload failed'))
        return null
      }
  )

  resetFileInput()

  if (!response || !response.data) {
    emit('upload-error', new Error('avatar upload failed'))
    return
  }

  const uploadResult = response.data
  const avatarUrl = uploadResult.url || uploadResult.objectName

  if (!avatarUrl) {
    emit('upload-error', new Error('avatar upload failed'))
    return
  }

  emit('update:modelValue', avatarUrl)
  emit('upload-success', avatarUrl)
  emit('update-avatar', avatarUrl)
  message.success(t('common.avatarUpdateSuccess'))
  showCropModal.value = false
}

const resetFileInput = () => {
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
}

const resetCropModal = () => {
  cropImageUrl.value = null

  if (cropperInstance.value) {
    cropperInstance.value.destroy()
    cropperInstance.value = null
  }
}

watch(
    () => showCropModal.value,
    (visible) => {
      if (!visible) {
        resetCropModal()
      } else {
        nextTick(() => {
          initCropper()
        })
      }
    }
)

watch(
    () => props.modelValue,
    () => {
      imageError.value = false
    }
)

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
