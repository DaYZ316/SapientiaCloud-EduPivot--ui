<template>
  <div class="color-picker">
    <!-- 预设颜色选择 -->
    <div class="preset-colors">
      <div class="preset-title">{{ t('settings.theme.presetColors') }}</div>
      <div class="color-grid">
        <div
            v-for="colorOption in presetColors"
            :key="colorOption.value"
            :class="{ active: modelValue === colorOption.value }"
            :style="{ backgroundColor: colorOption.value }"
            class="color-item"
            @click="selectPresetColor(colorOption)"
        >
          <div v-if="showVariants" class="color-variants">
            <div
                v-for="(shade, key) in colorOption.colors"
                :key="key"
                :style="{ backgroundColor: shade }"
                :title="`${colorOption.label} ${key}`"
                class="color-shade"
            ></div>
          </div>
          <div class="color-name">{{ colorOption.label }}</div>
        </div>
      </div>
    </div>

    <!-- 自定义颜色选择 -->
    <div class="custom-color">
      <div class="custom-title">{{ t('settings.theme.customColor') }}</div>
      <div class="custom-input">
        <n-color-picker
            v-model:value="customColor"
            :modes="['hex']"
            :show-alpha="false"
            :swatches="customSwatches"
            @update:value="handleCustomColorChange"
        />
        <n-input
            v-model:value="customColor"
            class="color-input"
            placeholder="#000000"
            @blur="validateAndApplyColor"
        />
      </div>
    </div>

    <!-- 颜色预览 -->
    <div v-if="showPreview" class="color-preview">
      <div class="preview-title">{{ t('settings.theme.colorPreview') }}</div>
      <div class="preview-content">
        <div class="preview-item">
          <div class="preview-label">主色</div>
          <div :style="{ backgroundColor: modelValue }" class="preview-color">
            <span :style="{ color: getContrastTextColor(modelValue) }" class="preview-text">
              {{ modelValue }}
            </span>
          </div>
        </div>
        <div class="preview-item">
          <div class="preview-label">浅色</div>
          <div :style="{ backgroundColor: lightColor }" class="preview-color">
            <span :style="{ color: getContrastTextColor(lightColor) }" class="preview-text">
              {{ lightColor }}
            </span>
          </div>
        </div>
        <div class="preview-item">
          <div class="preview-label">深色</div>
          <div :style="{ backgroundColor: darkColor }" class="preview-color">
            <span :style="{ color: getContrastTextColor(darkColor) }" class="preview-text">
              {{ darkColor }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- 颜色信息 -->
    <div v-if="showInfo" class="color-info">
      <div class="info-title">{{ t('settings.theme.colorInfo') }}</div>
      <div class="info-content">
        <div class="info-item">
          <span class="info-label">HEX:</span>
          <span class="info-value">{{ modelValue }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">RGB:</span>
          <span class="info-value">{{ rgbColor }}</span>
        </div>
        <div class="info-item">
          <span class="info-label">{{ t('settings.theme.contrastRatio') }}:</span>
          <span :class="{ 'good': contrastRatio >= 4.5, 'poor': contrastRatio < 4.5 }" class="info-value">
            {{ contrastRatio.toFixed(2) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {
  ColorUtils,
  generateColorVariants,
  getContrastRatio,
  getPresetColorOptions,
  isValidColor
} from '@/utils/colorAlgorithm'

interface Props {
  modelValue: string
  showVariants?: boolean
  showPreview?: boolean
  showInfo?: boolean
}

interface Emits {
  (e: 'update:modelValue', value: string): void

  (e: 'change', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  showVariants: true,
  showPreview: true,
  showInfo: true
})

const emit = defineEmits<Emits>()

const {t} = useI18n()

// 响应式数据
const customColor = ref(props.modelValue)
const customSwatches = ref<string[]>([])

// 计算属性
const presetColors = computed(() => getPresetColorOptions())

const lightColor = computed(() => {
  const variants = generateColorVariants(props.modelValue)
  return variants.light
})

const darkColor = computed(() => {
  const variants = generateColorVariants(props.modelValue)
  return variants.dark
})

const rgbColor = computed(() => {
  const rgb = ColorUtils.hexToRgb(props.modelValue)
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
})

const contrastRatio = computed(() => {
  return getContrastRatio(props.modelValue, '#ffffff')
})

// 方法
function selectPresetColor(colorOption: any) {
  emit('update:modelValue', colorOption.value)
  emit('change', colorOption.value)
  customColor.value = colorOption.value
}

function handleCustomColorChange(color: string) {
  if (isValidColor(color)) {
    emit('update:modelValue', color)
    emit('change', color)
  }
}

function validateAndApplyColor() {
  if (isValidColor(customColor.value)) {
    emit('update:modelValue', customColor.value)
    emit('change', customColor.value)
  } else {
    customColor.value = props.modelValue
  }
}

function getContrastTextColor(backgroundColor: string): string {
  const contrastWithWhite = getContrastRatio(backgroundColor, '#ffffff')
  const contrastWithBlack = getContrastRatio(backgroundColor, '#000000')

  return contrastWithWhite > contrastWithBlack ? '#ffffff' : '#000000'
}

// 监听器
watch(() => props.modelValue, (newValue) => {
  customColor.value = newValue
})

// 初始化自定义色板
watch(() => props.modelValue, (newValue) => {
  if (isValidColor(newValue)) {
    const variants = generateColorVariants(newValue)
    customSwatches.value = Object.values(variants)
  }
}, {immediate: true})
</script>

<style lang="scss" scoped>
.color-picker {
  .preset-colors {
    margin-bottom: 24px;

    .preset-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-color);
      margin-bottom: 12px;
    }

    .color-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
      gap: 12px;

      .color-item {
        position: relative;
        width: 80px;
        height: 80px;
        border-radius: 8px;
        cursor: pointer;
        border: 2px solid transparent;
        transition: all 0.2s ease;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        overflow: hidden;

        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        }

        &.active {
          border-color: var(--primary-color);
          box-shadow: 0 0 0 2px rgba(24, 160, 88, 0.2);
        }

        .color-variants {
          display: flex;
          gap: 2px;
          margin-bottom: 4px;

          .color-shade {
            width: 12px;
            height: 12px;
            border-radius: 2px;
            border: 1px solid rgba(255, 255, 255, 0.3);
          }
        }

        .color-name {
          font-size: 12px;
          color: #ffffff;
          text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
          font-weight: 500;
        }
      }
    }
  }

  .custom-color {
    margin-bottom: 24px;

    .custom-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-color);
      margin-bottom: 12px;
    }

    .custom-input {
      display: flex;
      gap: 12px;
      align-items: center;

      .color-input {
        width: 120px;
      }
    }
  }

  .color-preview {
    margin-bottom: 24px;

    .preview-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-color);
      margin-bottom: 12px;
    }

    .preview-content {
      display: flex;
      gap: 16px;

      .preview-item {
        .preview-label {
          font-size: 12px;
          color: var(--text-secondary-color);
          margin-bottom: 8px;
        }

        .preview-color {
          width: 80px;
          height: 40px;
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border: 1px solid var(--border-color);

          .preview-text {
            font-size: 12px;
            font-weight: 500;
          }
        }
      }
    }
  }

  .color-info {
    .info-title {
      font-size: 14px;
      font-weight: 500;
      color: var(--text-color);
      margin-bottom: 12px;
    }

    .info-content {
      .info-item {
        display: flex;
        justify-content: space-between;
        margin-bottom: 8px;
        font-size: 14px;

        .info-label {
          color: var(--text-secondary-color);
        }

        .info-value {
          color: var(--text-color);
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;

          &.good {
            color: var(--success-color);
          }

          &.poor {
            color: var(--warning-color);
          }
        }
      }
    }
  }
}
</style>
