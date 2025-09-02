<template>
  <div class="theme-preview">
    <div class="preview-header">
      <h3>{{ t('settings.theme.preview') }}</h3>
      <div class="theme-mode">
        <span class="mode-label">{{ t('settings.theme.currentMode') }}:</span>
        <span :class="themeMode" class="mode-value">
          {{ t(`settings.theme.${themeMode}`) }}
        </span>
      </div>
    </div>

    <div class="preview-content">
      <!-- 主色调预览 -->
      <div class="color-section">
        <h4>{{ t('settings.theme.primaryColors') }}</h4>
        <div class="color-row">
          <div class="color-item primary">
            <div :style="{ backgroundColor: colors.primary }" class="color-block">
              <span :style="{ color: getContrastTextColor(colors.primary) }" class="color-text">
                Primary
              </span>
            </div>
            <div class="color-info">
              <div class="color-name">{{ t('settings.theme.primary') }}</div>
              <div class="color-value">{{ colors.primary }}</div>
            </div>
          </div>
          <div class="color-item light">
            <div :style="{ backgroundColor: colors.primaryLight }" class="color-block">
              <span :style="{ color: getContrastTextColor(colors.primaryLight) }" class="color-text">
                Light
              </span>
            </div>
            <div class="color-info">
              <div class="color-name">{{ t('settings.theme.light') }}</div>
              <div class="color-value">{{ colors.primaryLight }}</div>
            </div>
          </div>
          <div class="color-item dark">
            <div :style="{ backgroundColor: colors.primaryDark }" class="color-block">
              <span :style="{ color: getContrastTextColor(colors.primaryDark) }" class="color-text">
                Dark
              </span>
            </div>
            <div class="color-info">
              <div class="color-name">{{ t('settings.theme.dark') }}</div>
              <div class="color-value">{{ colors.primaryDark }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 语义化颜色预览 -->
      <div class="color-section">
        <h4>{{ t('settings.theme.semanticColors') }}</h4>
        <div class="color-row">
          <div class="color-item success">
            <div :style="{ backgroundColor: colors.success }" class="color-block">
              <span :style="{ color: getContrastTextColor(colors.success) }" class="color-text">
                Success
              </span>
            </div>
            <div class="color-info">
              <div class="color-name">{{ t('settings.theme.success') }}</div>
              <div class="color-value">{{ colors.success }}</div>
            </div>
          </div>
          <div class="color-item warning">
            <div :style="{ backgroundColor: colors.warning }" class="color-block">
              <span :style="{ color: getContrastTextColor(colors.warning) }" class="color-text">
                Warning
              </span>
            </div>
            <div class="color-info">
              <div class="color-name">{{ t('settings.theme.warning') }}</div>
              <div class="color-value">{{ colors.warning }}</div>
            </div>
          </div>
          <div class="color-item error">
            <div :style="{ backgroundColor: colors.error }" class="color-block">
              <span :style="{ color: getContrastTextColor(colors.error) }" class="color-text">
                Error
              </span>
            </div>
            <div class="color-info">
              <div class="color-name">{{ t('settings.theme.error') }}</div>
              <div class="color-value">{{ colors.error }}</div>
            </div>
          </div>
          <div class="color-item info">
            <div :style="{ backgroundColor: colors.info }" class="color-block">
              <span :style="{ color: getContrastTextColor(colors.info) }" class="color-text">
                Info
              </span>
            </div>
            <div class="color-info">
              <div class="color-name">{{ t('settings.theme.info') }}</div>
              <div class="color-value">{{ colors.info }}</div>
            </div>
          </div>
        </div>
      </div>

      <!-- 文本和背景预览 -->
      <div class="color-section">
        <h4>{{ t('settings.theme.textAndBackground') }}</h4>
        <div class="preview-cards">
          <div :style="{ backgroundColor: colors.background }" class="preview-card">
            <div class="card-content">
              <h5 :style="{ color: colors.text }" class="card-title">
                {{ t('settings.theme.sampleTitle') }}
              </h5>
              <p :style="{ color: colors.textSecondary }" class="card-text">
                {{ t('settings.theme.sampleText') }}
              </p>
              <div class="card-actions">
                <button :style="{ backgroundColor: colors.primary, color: getContrastTextColor(colors.primary) }"
                        class="btn btn-primary">
                  {{ t('common.confirm') }}
                </button>
                <button :style="{ backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }"
                        class="btn btn-secondary">
                  {{ t('common.cancel') }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import {useI18n} from 'vue-i18n'
import {useThemeStore} from '@/store'
import {getContrastRatio} from '@/utils/colorAlgorithm'

const {t} = useI18n()
const themeStore = useThemeStore()

// 计算属性
const themeMode = computed(() => themeStore.themeMode)
const colors = computed(() => themeStore.colors)

// 方法
function getContrastTextColor(backgroundColor: string): string {
  const contrastWithWhite = getContrastRatio(backgroundColor, '#ffffff')
  const contrastWithBlack = getContrastRatio(backgroundColor, '#000000')

  return contrastWithWhite > contrastWithBlack ? '#ffffff' : '#000000'
}
</script>

<style lang="scss" scoped>
.theme-preview {
  padding: 24px;
  background-color: var(--background-secondary-color);
  border-radius: 8px;
  border: 1px solid var(--border-color);

  .preview-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 24px;

    h3 {
      margin: 0;
      color: var(--text-color);
      font-size: 18px;
      font-weight: 600;
    }

    .theme-mode {
      display: flex;
      align-items: center;
      gap: 8px;

      .mode-label {
        color: var(--text-secondary-color);
        font-size: 14px;
      }

      .mode-value {
        padding: 4px 12px;
        border-radius: 16px;
        font-size: 12px;
        font-weight: 500;

        &.light {
          background-color: #f0f0f0;
          color: #333333;
        }

        &.dark {
          background-color: #333333;
          color: #ffffff;
        }
      }
    }
  }

  .preview-content {
    .color-section {
      margin-bottom: 32px;

      h4 {
        margin: 0 0 16px 0;
        color: var(--text-color);
        font-size: 16px;
        font-weight: 500;
      }

      .color-row {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
        gap: 16px;

        .color-item {
          .color-block {
            height: 60px;
            border-radius: 8px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 8px;
            border: 1px solid var(--border-color);

            .color-text {
              font-size: 14px;
              font-weight: 600;
              text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
            }
          }

          .color-info {
            .color-name {
              font-size: 14px;
              font-weight: 500;
              color: var(--text-color);
              margin-bottom: 4px;
            }

            .color-value {
              font-size: 12px;
              color: var(--text-secondary-color);
              font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            }
          }
        }
      }

      .preview-cards {
        .preview-card {
          border: 1px solid var(--border-color);
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 2px 8px var(--shadow-secondary-color);

          .card-content {
            .card-title {
              margin: 0 0 12px 0;
              font-size: 16px;
              font-weight: 600;
            }

            .card-text {
              margin: 0 0 20px 0;
              font-size: 14px;
              line-height: 1.5;
            }

            .card-actions {
              display: flex;
              gap: 12px;

              .btn {
                padding: 8px 16px;
                border-radius: 6px;
                border: 1px solid transparent;
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.2s ease;

                &.btn-primary:hover {
                  opacity: 0.9;
                }

                &.btn-secondary:hover {
                  background-color: var(--background-tertiary-color);
                }
              }
            }
          }
        }
      }
    }
  }
}
</style>
