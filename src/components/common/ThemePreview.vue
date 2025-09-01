<template>
  <div class="theme-preview">
    <div class="preview-header">
      <h3>{{ t('settings.theme.preview') }}</h3>
      <div class="theme-mode">
        <span class="mode-label">{{ t('settings.theme.currentMode') }}:</span>
        <span class="mode-value" :class="themeMode">
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
            <div class="color-block" :style="{ backgroundColor: colors.primary }">
              <span class="color-text" :style="{ color: getContrastTextColor(colors.primary) }">
                Primary
              </span>
            </div>
            <div class="color-info">
              <div class="color-name">{{ t('settings.theme.primary') }}</div>
              <div class="color-value">{{ colors.primary }}</div>
            </div>
          </div>
          <div class="color-item light">
            <div class="color-block" :style="{ backgroundColor: colors.primaryLight }">
              <span class="color-text" :style="{ color: getContrastTextColor(colors.primaryLight) }">
                Light
              </span>
            </div>
            <div class="color-info">
              <div class="color-name">{{ t('settings.theme.light') }}</div>
              <div class="color-value">{{ colors.primaryLight }}</div>
            </div>
          </div>
          <div class="color-item dark">
            <div class="color-block" :style="{ backgroundColor: colors.primaryDark }">
              <span class="color-text" :style="{ color: getContrastTextColor(colors.primaryDark) }">
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
            <div class="color-block" :style="{ backgroundColor: colors.success }">
              <span class="color-text" :style="{ color: getContrastTextColor(colors.success) }">
                Success
              </span>
            </div>
            <div class="color-info">
              <div class="color-name">{{ t('settings.theme.success') }}</div>
              <div class="color-value">{{ colors.success }}</div>
            </div>
          </div>
          <div class="color-item warning">
            <div class="color-block" :style="{ backgroundColor: colors.warning }">
              <span class="color-text" :style="{ color: getContrastTextColor(colors.warning) }">
                Warning
              </span>
            </div>
            <div class="color-info">
              <div class="color-name">{{ t('settings.theme.warning') }}</div>
              <div class="color-value">{{ colors.warning }}</div>
            </div>
          </div>
          <div class="color-item error">
            <div class="color-block" :style="{ backgroundColor: colors.error }">
              <span class="color-text" :style="{ color: getContrastTextColor(colors.error) }">
                Error
              </span>
            </div>
            <div class="color-info">
              <div class="color-name">{{ t('settings.theme.error') }}</div>
              <div class="color-value">{{ colors.error }}</div>
            </div>
          </div>
          <div class="color-item info">
            <div class="color-block" :style="{ backgroundColor: colors.info }">
              <span class="color-text" :style="{ color: getContrastTextColor(colors.info) }">
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
          <div class="preview-card" :style="{ backgroundColor: colors.background }">
            <div class="card-content">
              <h5 class="card-title" :style="{ color: colors.text }">
                {{ t('settings.theme.sampleTitle') }}
              </h5>
              <p class="card-text" :style="{ color: colors.textSecondary }">
                {{ t('settings.theme.sampleText') }}
              </p>
              <div class="card-actions">
                <button class="btn btn-primary" :style="{ backgroundColor: colors.primary, color: getContrastTextColor(colors.primary) }">
                  {{ t('common.confirm') }}
                </button>
                <button class="btn btn-secondary" :style="{ backgroundColor: colors.backgroundSecondary, color: colors.text, borderColor: colors.border }">
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
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useThemeStore } from '@/store'
import { getContrastRatio } from '@/utils/colorAlgorithm'

const { t } = useI18n()
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
