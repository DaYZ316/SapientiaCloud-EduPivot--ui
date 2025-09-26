<template>
  <n-modal
      v-model:show="showModal"
      :positive-text="t('course.share.close')"
      :show-icon="false"
      :title="t('course.share.title')"
      preset="dialog"
      style="width: 400px"
      @positive-click="handleClose"
  >
    <div class="share-dialog-content">
      <div class="course-info">
        <div class="course-id-section">
          <div class="id-display">
            <span class="id-text">{{ courseId }}</span>
            <n-button
                :loading="copyLoading"
                circle
                class="copy-button"
                size="small"
                type="primary"
                @click="handleCopy"
            >
              <template #icon>
                <n-icon>
                  <CopyOutline/>
                </n-icon>
              </template>
            </n-button>
          </div>
        </div>
        <div class="share-tips">
          <span>{{ t('course.share.shareTips') }}</span>
        </div>
      </div>
    </div>
  </n-modal>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue'
import {useMessage} from 'naive-ui'
import {useI18n} from 'vue-i18n'
import {CopyOutline} from '@vicons/ionicons5'
import type {CourseVO} from '@/types/course'

// 定义组件属性
interface Props {
  visible: boolean
  courseInfo: CourseVO | null
}

// 定义事件
interface Emits {
  (e: 'update:visible', value: boolean): void
}

// 接收属性和事件
const props = defineProps<Props>()
const emit = defineEmits<Emits>()

// 响应式数据
const copyLoading = ref(false)
const message = useMessage()
const {t} = useI18n()

// 计算属性
const showModal = computed({
  get: () => props.visible,
  set: (value: boolean) => emit('update:visible', value)
})

const courseId = computed(() => props.courseInfo?.id || '')

// 方法
const handleCopy = async () => {
  if (!courseId.value) {
    return
  }

  copyLoading.value = true

  // 使用现代浏览器的 Clipboard API
  if (navigator.clipboard && window.isSecureContext) {
    await navigator.clipboard.writeText(courseId.value)
  } else {
    // 降级方案：使用传统的 document.execCommand
    const textArea = document.createElement('textarea')
    textArea.value = courseId.value
    textArea.style.position = 'fixed'
    textArea.style.left = '-999999px'
    textArea.style.top = '-999999px'
    document.body.appendChild(textArea)
    textArea.focus()
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }

  message.success(t('course.share.copySuccess'))
  copyLoading.value = false
}

const handleClose = () => {
  showModal.value = false
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index' as *;

.share-dialog-content {
  padding: 16px 0;

  .course-info {
    .course-id-section {
      margin-bottom: 20px;

      .id-display {
        display: flex;
        gap: 12px;
        align-items: center;
        padding: 12px 16px;
        background-color: var(--background-secondary-color);
        border: 1px solid var(--border-color);
        border-radius: 8px;

        .id-text {
          flex: 1;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 14px;
          color: var(--text-color);
          word-break: break-all;
          line-height: 1.4;
        }

        .copy-button {
          flex-shrink: 0;
          width: 32px;
          height: 32px;
        }
      }
    }

    .share-tips {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 8px 12px;
      background-color: var(--background-tertiary-color);
      border: 1px solid var(--primary-color);
      border-radius: 6px;
      font-size: 13px;
      color: var(--primary-color);

      span {
        line-height: 1.4;
      }
    }
  }
}
</style>
