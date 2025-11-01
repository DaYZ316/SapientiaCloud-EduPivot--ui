<template>
  <div :class="{ disabled: props.disabled }" class="auth-avatar-upload">
    <!-- 头像显示区域 -->
    <div
      :class="['avatar-container', { 'no-avatar': !props.modelValue }]"
      :style="{ width: avatarSize + 'px', height: avatarSize + 'px' }"
      @click="handleAvatarClick"
    >
      <!-- 头像显示 -->
      <n-avatar
        :class="props.avatarClass"
        :round="props.round"
        :size="avatarSize"
        :src="props.modelValue"
      />

      <!-- 上传遮罩层 -->
      <div v-if="!props.disabled" class="upload-overlay">
        <n-icon color="white" size="20">
          <CameraIcon />
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
                  <canvas ref="previewCanvasRef" class="preview-canvas" />
                </div>
              </div>
            </n-card>

            <!-- 控制按钮 -->
            <div class="control-buttons">
              <n-button-group size="small">
                <n-button :disabled="!cropperInstance" :title="t('common.rotateLeft')" @click="rotateLeft">
                  <template #icon>
                    <Icon :component="RefreshOutline" />
                  </template>
                </n-button>
                <n-button :disabled="!cropperInstance" :title="t('common.rotateRight')" @click="rotateRight">
                  <template #icon>
                    <Icon :component="RefreshOutline" />
                  </template>
                </n-button>
                <n-button :disabled="!cropperInstance" :title="t('common.flipHorizontal')" @click="flipX">
                  <template #icon>
                    <Icon :component="SwapHorizontalOutline" />
                  </template>
                </n-button>
                <n-button :disabled="!cropperInstance" :title="t('common.flipVertical')" @click="flipY">
                  <template #icon>
                    <Icon :component="SwapVerticalOutline" />
                  </template>
                </n-button>
              </n-button-group>
            </div>
          </n-space>
        </div>
      </div>

      <!-- 确认和取消按钮 -->
      <div class="modal-footer">
        <n-space>
          <n-button @click="showCropModal = false">
            {{ t('common.cancel') }}
          </n-button>
          <n-button :disabled="!cropperInstance" :loading="uploading" type="primary" @click="handleCropConfirm">
            <template #icon>
              <Icon :component="CheckmarkOutline" />
            </template>
            {{ t('common.confirm') }}
          </n-button>
        </n-space>
      </div>
    </n-modal>
  </div>
</template>

<script lang="ts" setup>
import { computed, nextTick, onUnmounted, ref, watch } from 'vue'
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.css'
import { NAvatar, NButton, NButtonGroup, NCard, NIcon, NModal, NSpace, useMessage } from 'naive-ui'
import {
  Camera as CameraIcon,
  CheckmarkOutline,
  RefreshOutline,
  SwapHorizontalOutline,
  SwapVerticalOutline
} from '@vicons/ionicons5'
import { useI18n } from 'vue-i18n'
import { uploadFile } from '@/api/minIO'
import type { AvatarUploadEmits, AvatarUploadProps } from '@/types/minIO/file'
import Icon from '@/components/common/Icon.vue'

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
const { t } = useI18n()
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

// 预览尺寸
const previewSize = computed(() => Math.max(80, Math.round(props.cropSize * 0.4)))

// 计算头像尺寸
const avatarSize = computed(() => {
  if (typeof props.size === 'number') return props.size

  const sizeMap = { small: 32, medium: 40, large: 48 }
  return sizeMap[props.size] || 40
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
    return
  }

  // 验证文件大小
  if (file.size > props.maxFileSize) {
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

  uploading.value = true

  // 获取裁剪后的 canvas
  const croppedCanvas = cropperInstance.value.getCroppedCanvas({
    width: props.cropSize,
    height: props.cropSize,
    imageSmoothingQuality: 'high'
  })

  if (!croppedCanvas) {
    uploading.value = false
    return
  }

  // 转换为 blob
  croppedCanvas.toBlob(async (blob: Blob | null) => {
    if (!blob) {
      uploading.value = false
      return
    }

    await uploadCroppedImage(blob)
  }, 'image/jpeg', 0.8)
}

// 上传裁剪后的图片
const uploadCroppedImage = async (blob: Blob) => {
  // 创建File对象并上传
  const fileName = `avatar_${Date.now()}.jpg`
  const file = new File([blob], fileName, { type: 'image/jpeg' })
  const response = await uploadFile(file, 'avatar').catch(() => null)

  if (response && response.data) {
    const uploadResult = response.data
    const avatarUrl = uploadResult.url || uploadResult.objectName

    // 更新头像URL
    emit('update:modelValue', avatarUrl)
    emit('upload-success', avatarUrl)
    emit('update-avatar', avatarUrl)

    message.success(t('common.avatarUpdateSuccess'))
    showCropModal.value = false
  }

  uploading.value = false

  // 清空文件输入
  if (fileInputRef.value) {
    fileInputRef.value.value = ''
  }
  currentFile.value = null
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
@use './AuthAvatarUpload.scss';
</style>

