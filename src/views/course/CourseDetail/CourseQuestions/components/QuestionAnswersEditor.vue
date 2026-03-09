<template>
  <div class="question-answers-editor">
    <div class="answers-header">
      <h3>{{ t('course.question.answers') }}</h3>
      <n-button
          type="primary"
          @click="handleAddAnswer"
      >
        <template #icon>
          <n-icon>
            <PlusOutlined/>
          </n-icon>
        </template>
        {{ t('course.question.addAnswer') }}
      </n-button>
    </div>

    <div v-if="(answers?.length ?? 0) > 0" class="answers-list">
      <div
          v-for="(answer, index) in answers"
          :key="answer.id || index"
          class="answer-item"
      >
        <div class="answer-header">
          <n-tag size="medium" type="info">
            {{ `#${index + 1}` }}
          </n-tag>
          <n-button
              :disabled="answers.length <= 1"
              text
              type="error"
              @click="handleRemoveAnswer(index)"
          >
            <template #icon>
              <n-icon>
                <DeleteOutlined/>
              </n-icon>
            </template>
          </n-button>
        </div>

        <n-form-item
            :label="answerContentLabel"
        >
          <n-input
              v-model:value="answer.answerContent"
              :placeholder="answerContentPlaceholder"
              :rows="isShortAnswer ? 6 : 3"
              type="textarea"
          />
        </n-form-item>

        <n-row :gutter="16">
          <n-col :span="12">
            <n-form-item :label="t('course.question.answerScore')">
              <n-input-number
                  v-model:value="answer.score"
                  :max="100"
                  :min="0"
                  :placeholder="t('course.question.answerScorePlaceholder')"
                  style="width: 100%"
              />
            </n-form-item>
          </n-col>
          <n-col :span="12">
            <n-form-item :label="t('course.question.optionExplanation')">
              <n-input
                  v-model:value="answer.explanation"
                  :placeholder="t('course.question.optionExplanationPlaceholder')"
                  type="textarea"
              />
            </n-form-item>
          </n-col>
        </n-row>
      </div>
    </div>

    <n-empty
        v-else
        :description="t('course.question.noAnswers')"
        class="empty-answers"
    />
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import {useI18n} from 'vue-i18n'
import {DeleteOutlined, PlusOutlined} from '@vicons/antd'
import type {QuestionAnswerDTO} from '@/types/course/questionAnswer'
import {QuestionTypeEnum} from '@/enum/course'

interface Props {
  answers: QuestionAnswerDTO[]
  questionType: QuestionTypeEnum | number | null
}

interface Emits {
  (event: 'add-answer'): void

  (event: 'remove-answer', index: number): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const {t} = useI18n()

const answers = computed(() => props.answers ?? [])
const isShortAnswer = computed(() => Number(props.questionType) === QuestionTypeEnum.SHORT_ANSWER)

const answerContentLabel = computed(() =>
    isShortAnswer.value ? t('course.question.answerText') : t('course.question.answerContent')
)
const answerContentPlaceholder = computed(() =>
    isShortAnswer.value ? t('course.question.answerTextPlaceholder') : t('course.question.answerContentPlaceholder')
)

const handleAddAnswer = () => {
  emit('add-answer')
}

const handleRemoveAnswer = (index: number) => {
  emit('remove-answer', index)
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.question-answers-editor {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);

  .answers-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;

    h3 {
      margin: 0;
      font-size: 16px;
      font-weight: 600;
      color: var(--text-color);
    }
  }

  .answers-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .answer-item {
    padding: 16px;
    border: 1px solid var(--border-color);
    border-radius: 8px;

    .answer-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
  }

  .empty-answers {
    padding: 32px 0;
  }
}
</style>


