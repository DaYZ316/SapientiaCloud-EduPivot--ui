<template>
  <div class="question-requester-message">
    <div class="message-text">
      <div class="requester-content">
        <div class="content-header">
          <n-icon :component="DocumentTextOutline" class="header-icon" size="20"/>
          <span class="header-text">{{ t('chat.toolsMenu.requirement') }}</span>
        </div>
        <div v-if="requestData" class="request-details">
          <div class="detail-item">
            <span class="detail-label">{{ t('chat.toolsMenu.questionCount') }}：</span>
            <span class="detail-value">
              {{ requestData.questionCount || 0 }}
              {{ t('chat.toolsMenu.questionCountUnit') }}
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">{{ t('chat.toolsMenu.questionType') }}：</span>
            <span class="detail-value">{{ getQuestionTypeText(requestData.questionType) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">{{ t('chat.toolsMenu.difficulty') }}：</span>
            <span class="detail-value">{{ getDifficultyText(requestData.difficulty) }}</span>
          </div>
          <div v-if="requestData.requirement" class="detail-item requirement-item">
            <span class="detail-label">{{ t('chat.toolsMenu.requirement') }}：</span>
            <span class="detail-value requirement-text">{{ requestData.requirement }}</span>
          </div>
        </div>
        <div v-else class="request-fallback">
          {{ message.content }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import {NIcon} from 'naive-ui'
import {useI18n} from 'vue-i18n'
import {DocumentTextOutline} from '@vicons/ionicons5'
import type {ChatMessage} from '@/types/celestialHub/chatMessage'
import type {QuestionGenerateRequestDTO} from '@/types/celestialHub/question'
import {getQuestionTypeLabel} from '@/enum/course/questionTypeEnum'
import {getQuestionBankDifficultyLabel} from '@/enum/course/questionBankDifficultyEnum'

// 国际化
const {t, locale} = useI18n()

// Props
const props = defineProps<{
  message: ChatMessage
}>()

// 解析出题请求数据
const requestData = computed<QuestionGenerateRequestDTO | null>(() => {
  if (!props.message.questionRequest) {
    return null
  }
  try {
    return JSON.parse(props.message.questionRequest) as QuestionGenerateRequestDTO
  } catch {
    return null
  }
})

const isEnLocale = computed(() => locale.value === 'en-US')

// 获取题目类型文本（从枚举工具中获取，并根据当前语言返回中/英文）
const getQuestionTypeText = (type?: number | null) => {
  if (type === null || type === undefined) {
    return t('common.unknown')
  }
  if (type === 5) {
    return t('chat.toolsMenu.questionTypeMixed')
  }
  return getQuestionTypeLabel(type, isEnLocale.value)
}

// 获取难度文本（从枚举工具中获取，并根据当前语言返回中/英文）
const getDifficultyText = (difficulty?: number | null) => {
  if (difficulty === null || difficulty === undefined || difficulty === 0) {
    return t('chat.toolsMenu.difficultyRandom')
  }
  return getQuestionBankDifficultyLabel(difficulty, isEnLocale.value)
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles' as *;

.question-requester-message {
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-end;

  .message-text {
    display: flex;
    justify-content: flex-end;
    width: 100%;

    .requester-content {
      max-width: 70%;
      min-width: 200px;
      padding: 12px 16px;
      background: var(--color-primary);
      color: white;
      border-radius: 16px 4px 16px 16px;
      word-break: break-word;
      line-height: 1.6;

      .content-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 12px;
        font-weight: 600;
        font-size: 14px;

        .header-icon {
          flex-shrink: 0;
        }

        .header-text {
          flex: 1;
        }
      }

      .request-details {
        display: flex;
        flex-direction: column;
        gap: 8px;

        .detail-item {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 13px;

          .detail-label {
            opacity: 0.9;
            white-space: nowrap;
          }

          .detail-value {
            font-weight: 500;
          }

          &.requirement-item {
            margin-top: 4px;

            .requirement-text {
              padding: 8px 12px;
              background: transparent;
              border-radius: 8px;
              width: auto;
              line-height: 1.5;
              background: rgba(255, 255, 255, 0.15);
            }
          }
        }
      }

      .request-fallback {
        font-size: 13px;
        line-height: 1.6;
      }
    }
  }
}
</style>

