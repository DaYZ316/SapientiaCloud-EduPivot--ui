<template>
  <div class="question-requester-message">
    <div class="message-text">
      <div class="requester-content">
        <div class="content-header">
          <n-icon :component="DocumentTextOutline" class="header-icon" size="20"/>
          <span class="header-text">{{ headerText }}</span>
        </div>
        <div v-if="requestData" class="request-details">
          <div v-if="isPaperMode && requestData.paperName" class="detail-item">
            <span class="detail-label">{{ t('chat.toolsMenu.paperName') }}:</span>
            <span class="detail-value">{{ requestData.paperName }}</span>
          </div>
          <div v-if="isPaperMode && requestData.paperType" class="detail-item">
            <span class="detail-label">{{ t('chat.toolsMenu.paperType') }}:</span>
            <span class="detail-value">{{ requestData.paperType }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">{{ t('chat.toolsMenu.questionCount') }}:</span>
            <span class="detail-value">
              {{ requestData.questionCount || 0 }}
              {{ t('chat.toolsMenu.questionCountUnit') }}
            </span>
          </div>
          <div class="detail-item">
            <span class="detail-label">{{ t('chat.toolsMenu.questionType') }}:</span>
            <span class="detail-value">{{ getQuestionTypeText(requestData.questionType) }}</span>
          </div>
          <div class="detail-item">
            <span class="detail-label">{{ t('chat.toolsMenu.difficulty') }}:</span>
            <span class="detail-value">{{ getDifficultyText(requestData.difficulty) }}</span>
          </div>
          <div v-if="requestData.scorePerQuestion !== null && requestData.scorePerQuestion !== undefined" class="detail-item">
            <span class="detail-label">{{ t('chat.toolsMenu.scorePerQuestion') }}:</span>
            <span class="detail-value">{{ requestData.scorePerQuestion }} {{ t('common.points') }}</span>
          </div>
          <div v-if="isPaperMode && requestData.totalScore !== null && requestData.totalScore !== undefined" class="detail-item">
            <span class="detail-label">{{ t('chat.toolsMenu.totalScore') }}:</span>
            <span class="detail-value">{{ requestData.totalScore }} {{ t('common.points') }}</span>
          </div>
          <div v-if="isPaperMode && requestData.totalEstimatedTime !== null && requestData.totalEstimatedTime !== undefined" class="detail-item">
            <span class="detail-label">{{ t('chat.toolsMenu.totalEstimatedTime') }}:</span>
            <span class="detail-value">{{ requestData.totalEstimatedTime }} {{ t('common.minutes') }}</span>
          </div>
          <div v-if="isPaperMode && requestData.knowledgePoints?.length" class="detail-item detail-multiline">
            <span class="detail-label">{{ t('chat.toolsMenu.knowledgePoints') }}:</span>
            <span class="detail-value requirement-text">{{ formatList(requestData.knowledgePoints) }}</span>
          </div>
          <div v-if="isPaperMode && requestData.abilityGoals?.length" class="detail-item detail-multiline">
            <span class="detail-label">{{ t('chat.toolsMenu.abilityGoals') }}:</span>
            <span class="detail-value requirement-text">{{ formatList(requestData.abilityGoals) }}</span>
          </div>
          <div v-if="requestData.requirement" class="detail-item detail-multiline">
            <span class="detail-label">{{ t('chat.toolsMenu.requirement') }}:</span>
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
import {resolveQuestionGenerationMode} from '@/types/celestialHub/question'
import {getQuestionTypeLabel} from '@/enum/course/questionTypeEnum'
import {getQuestionBankDifficultyLabel} from '@/enum/course/questionBankDifficultyEnum'

const {t, locale} = useI18n()

const props = defineProps<{
  message: ChatMessage
}>()

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
const isPaperMode = computed(() => resolveQuestionGenerationMode(requestData.value) === 'paper')
const headerText = computed(() => t(
    isPaperMode.value ? 'chat.toolsMenu.paperRequestTitle' : 'chat.toolsMenu.questionRequestTitle'
))

const getQuestionTypeText = (type?: number | null) => {
  if (type === null || type === undefined) {
    return t('common.unknown')
  }
  if (type === 5) {
    return t('chat.toolsMenu.questionTypeMixed')
  }
  return getQuestionTypeLabel(type, isEnLocale.value)
}

const getDifficultyText = (difficulty?: number | null) => {
  if (difficulty === null || difficulty === undefined || difficulty === 0) {
    return t('chat.toolsMenu.difficultyRandom')
  }
  return getQuestionBankDifficultyLabel(difficulty, isEnLocale.value)
}

const formatList = (items?: string[] | null) => {
  return (items ?? []).join(' / ')
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
      min-width: 220px;
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

          &.detail-multiline {
            align-items: flex-start;
          }

          .detail-label {
            opacity: 0.9;
            white-space: nowrap;
          }

          .detail-value {
            font-weight: 500;
          }

          .requirement-text {
            padding: 8px 12px;
            border-radius: 8px;
            line-height: 1.5;
            background: rgba(255, 255, 255, 0.15);
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
