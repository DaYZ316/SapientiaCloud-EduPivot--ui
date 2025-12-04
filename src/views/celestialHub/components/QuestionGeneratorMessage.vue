<template>
  <div
      :class="['question-generator-message', { 'is-active': isActive }]"
      :data-message-id="message.id || null"
  >
    <div class="message-text">
      <!-- 出题中状态：使用按钮样式 + 文案 + 右侧loading -->
      <div v-if="isPending" class="question-card pending-card">
        <n-icon :component="DocumentTextOutline" size="20" class="card-icon"/>
        <div class="card-content">
          <div class="card-title">{{ pendingTitle }}</div>
          <div class="card-time">{{ pendingSubTitle }}</div>
        </div>
        <n-spin size="small" class="card-loading"/>
      </div>
      <MarkdownRenderer
          v-else-if="message.content"
          :content="message.content"
          class="ai-content"
      />
      <!-- 题目卡片按钮 -->
      <div v-if="hasQuestions" class="question-card-group">
        <div
            v-for="(questionItem, questionIndex) in questionList"
            :key="questionItem.id ?? `question-card-${questionIndex}`"
            :data-question-index="questionIndex"
            :class="['question-card', { 'is-active': isActive && activeIndex === questionIndex }]"
            @click="handleCardClick(questionIndex)"
      >
        <n-icon :component="DocumentTextOutline" size="20" class="card-icon"/>
        <div class="card-content">
            <div class="card-title">{{ getQuestionCardTitle(questionItem, questionIndex) }}</div>
          <div class="card-time">{{ formattedTime }}</div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import {NIcon, NSpin} from 'naive-ui'
import {useI18n} from 'vue-i18n'
import {DocumentTextOutline} from '@vicons/ionicons5'
import type {ChatMessage} from '@/types/celestialHub/chatMessage'
import type {QuestionResponseDTO} from '@/types/celestialHub/question'
import MarkdownRenderer from '@/components/common/MarkdownRenderer.vue'

// Props
const props = defineProps<{
  message: ChatMessage
  isActive?: boolean
  activeIndex?: number | null
}>()

const emit = defineEmits<{
  (e: 'view-questions', payload: { messageId: string | null; questions: QuestionResponseDTO[]; activeIndex: number | null }): void
}>()

const {t} = useI18n()

const isPending = computed(() => {
  return props.message.metadata?.questionStatus === 'pending'
})

const pendingTitle = computed(() => {
  if (props.message.content) {
    return props.message.content
  }
  return t('chat.toolsMenu.generatingTitle')
})

const pendingSubTitle = computed(() => t('chat.toolsMenu.generatingSubTitle'))

// 解析出题响应数据
const questions = computed<QuestionResponseDTO[] | null>(() => {
  if (!props.message.questionResponse) {
    return null
  }
  try {
    return JSON.parse(props.message.questionResponse) as QuestionResponseDTO[]
  } catch {
    return null
  }
})

// 是否有题目数据
const questionList = computed<QuestionResponseDTO[]>(() => questions.value ?? [])

const hasQuestions = computed(() => questionList.value.length > 0)

// 格式化时间
const formattedTime = computed(() => {
  if (!props.message.createTime) {
    return ''
  }
  try {
    const date = new Date(props.message.createTime)
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
    const month = monthNames[date.getMonth()]
    const day = date.getDate()
    const hours = date.getHours()
    const minutes = date.getMinutes()
    const ampm = hours >= 12 ? 'PM' : 'AM'
    const displayHours = hours % 12 || 12
    const displayMinutes = minutes.toString().padStart(2, '0')
    return `${month} ${day}, ${displayHours}:${displayMinutes} ${ampm}`
  } catch {
    return ''
  }
})

// 处理卡片点击
const getQuestionCardTitle = (question: QuestionResponseDTO, index: number) => {
  if (question.questionTitle) {
    return question.questionTitle
  }
  if (question.questionContent) {
    return question.questionContent
  }
  return `题目 ${index + 1}`
}

const handleCardClick = (index: number) => {
  if (!questionList.value.length) {
    return
  }
  emit('view-questions', {
    messageId: props.message.id ?? null,
    questions: questionList.value,
    activeIndex: index
  })
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles' as *;

.question-generator-message {
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: background-color 0.2s ease;

  .message-text {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 12px;

      .pending-content {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 12px 16px;
        border-radius: 16px;
        background: var(--background-secondary-color);
        color: var(--text-secondary-color);

        .pending-text {
          font-size: 14px;
          line-height: 1.4;
        }
      }

    .ai-content {
      max-width: 100%;
      padding: 0;
      color: var(--text-color);
      line-height: 1.6;
      display: inline-block;
    }

    .question-card-group {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .question-card {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 12px 16px;
      background: var(--background-secondary-color);
      border: 1px solid var(--border-color);
      border-radius: 12px;
      cursor: pointer;
      transition: all 0.2s ease;
      max-width: 400px;

      &:hover {
        background: var(--background-tertiary-color);
        border-color: var(--color-primary);
      }

      .card-icon {
        color: var(--text-secondary-color);
        flex-shrink: 0;
        transition: color 0.2s ease;
      }

      .card-title {
        transition: color 0.2s ease;
      }

      &.is-active {
        border-color: var(--color-primary);
        box-shadow: 0 8px 20px var(--shadow-color);
        background: var(--background-color);

        .card-icon {
          color: var(--color-primary);
        }

        .card-content .card-title {
          color: var(--color-primary);
          font-weight: 600;
        }
      }

      .card-icon {
        color: var(--text-secondary-color);
        flex-shrink: 0;
      }

      .card-content {
        flex: 1;
        display: flex;
        flex-direction: column;
        gap: 4px;

        .card-title {
          font-size: 14px;
          font-weight: 500;
          color: var(--text-color);
          line-height: 1.4;
        }

        .card-time {
          font-size: 12px;
          color: var(--text-secondary-color);
          line-height: 1.4;
        }
      }

      .card-loading {
        flex-shrink: 0;
      }
    }
  }
}
</style>
