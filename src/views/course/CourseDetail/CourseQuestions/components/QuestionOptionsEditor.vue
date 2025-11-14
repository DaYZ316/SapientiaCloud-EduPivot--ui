<template>
  <div class="question-options-editor">
    <div class="options-header">
      <h3>{{ t('course.question.options') }}</h3>
      <n-button
          :disabled="isAddButtonDisabled"
          type="primary"
          @click="handleAddOption"
      >
        <template #icon>
          <n-icon>
            <PlusOutlined/>
          </n-icon>
        </template>
        {{ t('course.question.addOption') }}
      </n-button>
    </div>

    <div v-if="options.length > 0" class="options-list">
      <div
          v-for="(option, index) in options"
          :key="index"
          class="option-item"
      >
        <div class="option-header">
          <n-tag type="info" size="medium">
            {{ option.optionLabel }}
          </n-tag>
          <n-space>
            <n-checkbox
                v-model:checked="option.isCorrect"
                :checked-value="1"
                :unchecked-value="0"
            >
              {{ t('course.question.correct') }}
            </n-checkbox>
            <n-button
                :disabled="isRemoveButtonDisabled"
                text
                type="error"
                @click="handleRemoveOption(index)"
            >
              <template #icon>
                <n-icon>
                  <DeleteOutlined/>
                </n-icon>
              </template>
            </n-button>
          </n-space>
        </div>

        <n-form-item
            :label="t('course.question.optionContent')"
        >
          <n-input
              v-model:value="option.optionContent"
              :placeholder="t('course.question.optionContentPlaceholder')"
              type="textarea"
              :rows="4"
          />
        </n-form-item>

        <n-row :gutter="16">
          <n-col :span="12">
            <n-form-item :label="t('course.question.optionScore')">
              <n-input-number
                  v-model:value="option.score"
                  :max="100"
                  :min="0"
                  :placeholder="t('course.question.optionScorePlaceholder')"
                  style="width: 100%"
              />
            </n-form-item>
          </n-col>
          <n-col :span="12">
            <n-form-item :label="t('course.question.optionExplanation')">
              <n-input
                  v-model:value="option.explanation"
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
        :description="t('course.question.noOptions')"
        class="empty-options"
    />
  </div>
</template>

<script lang="ts" setup>
import {computed} from 'vue'
import {useI18n} from 'vue-i18n'
import {DeleteOutlined, PlusOutlined} from '@vicons/antd'
import type {QuestionOptionDTO} from '@/types/course/questionOption'
import {QuestionTypeEnum} from '@/enum/course/questionTypeEnum'

interface Props {
  options: QuestionOptionDTO[]
  questionType?: number
}

interface Emits {
  (event: 'add-option'): void
  (event: 'remove-option', index: number): void
  (event: 'update:options', options: QuestionOptionDTO[]): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const {t} = useI18n()

const options = computed({
  get: () => props.options,
  set: (value) => emit('update:options', value)
})

const isAddButtonDisabled = computed(() => {
  return props.questionType === QuestionTypeEnum.TRUE_FALSE && props.options.length >= 2
})

const isRemoveButtonDisabled = computed(() => {
  return props.questionType === QuestionTypeEnum.TRUE_FALSE && props.options.length <= 2
})

const handleAddOption = () => {
  emit('add-option')
}

const handleRemoveOption = (index: number) => {
  emit('remove-option', index)
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.question-options-editor {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);

  .options-header {
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

  .options-list {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .option-item {
    padding: 16px;
    border: 1px solid var(--border-color);
    border-radius: 8px;

    .option-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 16px;
    }
  }

  .empty-options {
    padding: 32px 0;
  }
}
</style>

