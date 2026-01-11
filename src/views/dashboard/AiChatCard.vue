<template>
  <n-card class="ai-chat-card">
    <div class="celestial-hub-content">
      <!-- 天枢介绍 -->
      <div class="celestial-hub-intro">
        <div class="intro-header">
          <n-text
            size="24"
            class="intro-title"
            style="color: var(--primary-color);"
          >
            {{ t('dashboard.aiChat.title') }}
          </n-text>
          <n-text class="intro-subtitle" depth="2">
            {{ t('dashboard.aiChat.subtitle') }}
          </n-text>
        </div>
        <n-text class="intro-description" depth="3">
          {{ t('dashboard.aiChat.description') }}
        </n-text>
      </div>

      <!-- 功能列表 -->
      <div class="features-section">
        <n-grid :cols="2" :x-gap="16" :y-gap="12" class="features-grid">
          <!-- 天枢问答 -->
          <n-grid-item>
            <div class="feature-item" @click="goToAi">
              <n-icon size="32" class="feature-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.94-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
              </n-icon>
              <div class="feature-content">
                <n-text class="feature-name" strong>{{ t('dashboard.aiChat.features.qna.name') }}</n-text>
                <n-text class="feature-desc" depth="3">{{ t('dashboard.aiChat.features.qna.desc') }}</n-text>
              </div>
            </div>
          </n-grid-item>

          <!-- 天枢出题 -->
          <n-grid-item>
            <div class="feature-item" @click="goToQuestionGenerator">
              <n-icon size="32" class="feature-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zm2 16H8v-2h8v2zm0-4H8v-2h8v2zm-3-5V3.5L18.5 9H13z"/>
                </svg>
              </n-icon>
              <div class="feature-content">
                <n-text class="feature-name" strong>{{ t('dashboard.aiChat.features.question.name') }}</n-text>
                <n-text class="feature-desc" depth="3">{{ t('dashboard.aiChat.features.question.desc') }}</n-text>
              </div>
            </div>
          </n-grid-item>

          <!-- 天枢教案 -->
          <n-grid-item>
            <div class="feature-item" @click="showInfo('lesson')">
              <n-icon size="32" class="feature-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                </svg>
              </n-icon>
              <div class="feature-content">
                <n-text class="feature-name" strong>{{ t('dashboard.aiChat.features.lesson.name') }}</n-text>
                <n-text class="feature-desc" depth="3">{{ t('dashboard.aiChat.features.lesson.desc') }}</n-text>
              </div>
            </div>
          </n-grid-item>

          <!-- 天枢批阅 -->
          <n-grid-item>
            <div class="feature-item" @click="showInfo('grading')">
              <n-icon size="32" class="feature-icon">
                <svg viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 11H7v2h2v-2zm4 0h-2v2h2v-2zm4 0h-2v2h2v-2zm2-7h-1V2h-2v2H8V2H6v2H5c-1.1 0-1.99.9-1.99 2L3 20c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V9h14v11z"/>
                </svg>
              </n-icon>
              <div class="feature-content">
                <n-text class="feature-name" strong>{{ t('dashboard.aiChat.features.grading.name') }}</n-text>
                <n-text class="feature-desc" depth="3">{{ t('dashboard.aiChat.features.grading.desc') }}</n-text>
              </div>
            </div>
          </n-grid-item>
        </n-grid>
      </div>
    </div>
  </n-card>
</template>

<script lang="ts" setup>
import {
  NCard,
  NText,
  NGrid,
  NGridItem,
  NIcon,

} from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { getGlobalApis } from '@/utils/naiveUIHelper'
import { useRouter } from 'vue-router'
import eventBus from '@/utils/eventBus'
import { useTransitionStore } from '@/store'

const { t } = useI18n()
const { message } = getGlobalApis()
const transitionStore = useTransitionStore()

function showInfo(featureKey: string) {
  const name = t(`dashboard.aiChat.features.${featureKey}.name`)
  const text = `${String(name)} ${String(t('dashboard.aiChat.badge.comingSoon'))}`
  if (message && message.info) {
    message.info(text)
  }
}
const router = useRouter()
function goToAi() {
  router.push('/ai').then(() => {
    // 请求创建新会话（全局侧边栏会监听）
    eventBus.emit('aiNewChat')
  })
}

function goToQuestionGenerator() {
  transitionStore.show()
  router.push('/ai?openSmartQuestion=true').then(() => {
    // 请求创建新会话（全局侧边栏会监听）
    eventBus.emit('aiNewChat')
  })
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.ai-chat-card {
  height: 500px;
  z-index: 10;
  width: 45%;
  margin-top: 16px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--background-color) 85%, transparent);
  --ai-feature-height: 120px;
  backdrop-filter: blur(25px);
  -webkit-backdrop-filter: blur(25px);
  box-shadow:
    0 8px 32px var(--shadow-color),
    0 4px 16px var(--shadow-secondary-color);
  user-select: none;
  transition: all 0.3s ease;

  .celestial-hub-content {
    padding: 32px;
    height: 100%;
    display: flex;
    flex-direction: column;

    .celestial-hub-intro {
      margin-bottom: 32px;

      .intro-header {
        margin-bottom: 16px;

        .intro-title {
          font-size: 28px;
          font-weight: 700;
          margin-bottom: 8px;
          display: block;
        }

        .intro-subtitle {
          font-size: 16px;
          font-weight: 500;
          color: var(--text-secondary-color);
        }
      }

      .intro-description {
        font-size: 14px;
        line-height: 1.6;
        color: var(--text-color);
        opacity: 0.85;
      }
    }

    .features-section {
      flex: 1;
      display: flex;
      flex-direction: column;

      .features-title {
        font-size: 18px;
        margin-bottom: 20px;
        color: var(--text-color);
        display: block;
      }

      .features-grid {
        flex: 1;

        .feature-item {
          display: flex;
          align-items: center;
          gap: 16px;
          padding: 22px;
          border-radius: 14px;
          background: color-mix(in srgb, var(--background-secondary-color) 6%, var(--background-color));
          border: 1px solid var(--border-secondary-color);
          transition: transform 0.22s ease, box-shadow 0.22s ease, background 0.22s ease;
          cursor: pointer;
          position: relative;
          height: var(--ai-feature-height);
          box-sizing: border-box;

          &:hover {
            transform: translateY(-6px);
            box-shadow:
              0 12px 30px var(--shadow-secondary-color),
              0 6px 18px var(--shadow-color);
            background: color-mix(in srgb, var(--background-secondary-color) 8%, var(--background-color));
          }

          /* icon circle */
          .feature-icon {
            width: 48px;
            height: 48px;
            border-radius: 50%;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            background: color-mix(in srgb, var(--primary-color) 10%, var(--background-color));
            color: var(--primary-color);
            flex-shrink: 0;
            transition: transform 0.22s ease, box-shadow 0.22s ease;
          }

          .feature-content {
            flex: 1;
            min-width: 0;

            .feature-name {
              font-size: 16px;
              margin-bottom: 6px;
              color: var(--text-color);
              display: block;
            }

            .feature-desc {
              font-size: 13px;
              color: var(--text-secondary-color);
              line-height: 1.45;
              display: block;
              opacity: 0.95;
            }
          }

 
        }
      }
    }
  }
}

// 响应式设计
@media (max-width: 768px) {
  .ai-chat-card {
    height: auto;
    min-height: 400px;
    margin-top: 12px;
    box-shadow:
      0 6px 24px var(--shadow-color),
      0 3px 12px var(--shadow-secondary-color);

    .celestial-hub-content {
      padding: 24px;

      .celestial-hub-intro {
        margin-bottom: 24px;

        .intro-header {
          .intro-title {
            font-size: 24px;
          }

          .intro-subtitle {
            font-size: 14px;
          }
        }

        .intro-description {
          font-size: 13px;
        }
      }

      .features-section {
        .features-title {
          font-size: 16px;
          margin-bottom: 16px;
        }

        .features-grid {
          :deep(.n-grid) {
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          .feature-item {
            padding: 16px;
            height: 92px;

            .feature-icon {
              width: 28px;
              height: 28px;
              margin-right: 12px;
            }

            .feature-content {
              .feature-name {
                font-size: 14px;
                margin-bottom: 4px;
              }

              .feature-desc {
                font-size: 12px;
              }
            }

            .feature-badge {
              top: 8px;
              right: 8px;
              font-size: 9px;
            }
          }
        }
      }
    }
  }
}
</style>
