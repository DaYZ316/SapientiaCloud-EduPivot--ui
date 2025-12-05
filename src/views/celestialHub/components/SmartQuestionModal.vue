<template>
  <n-modal
      v-model:show="innerShow"
      :auto-focus="false"
      :close-on-esc="false"
      :mask-closable="false"
      :show-icon="false"
      :style="{ width: '80vw', maxWidth: '80vw', height: '80vh', maxHeight: '80vh' }"
      class="smart-question-modal"
      preset="dialog"
  >
    <template #header>
      {{ t('chat.toolsMenu.smartQuestion') }}
    </template>
    <div class="smart-question-placeholder">
      <n-form
          ref="questionFormRef"
          :model="questionForm"
          :rules="questionFormRules"
          label-placement="top"
      >
        <div class="smart-question-form-grid">
          <n-form-item :label="t('chat.toolsMenu.questionCount')" path="questionCount">
            <n-input-number
                v-model:value="questionForm.questionCount"
                :max="50"
                :min="1"
                :precision="0"
                placeholder="1 - 50"
            />
          </n-form-item>
          <n-form-item :label="t('chat.toolsMenu.questionType')" path="questionType">
            <n-select
                v-model:value="questionForm.questionType"
                :options="questionTypeOptions"
                clearable
            />
          </n-form-item>
          <n-form-item :label="t('chat.toolsMenu.difficulty')" path="difficulty">
            <n-select
                v-model:value="questionForm.difficulty"
                :options="difficultyOptions"
                clearable
            />
          </n-form-item>
          <n-form-item :label="t('chat.toolsMenu.scorePerQuestion')" path="scorePerQuestion">
            <n-input-number
                v-model:value="questionForm.scorePerQuestion"
                :max="100"
                :min="1"
                :precision="0"
                placeholder="1 - 100"
            />
          </n-form-item>
        </div>
        <n-form-item :label="t('chat.toolsMenu.requirement')" path="requirement">
          <n-input
              v-model:value="questionForm.requirement"
              :autosize="{ minRows: 4, maxRows: 8 }"
              :maxlength="1000"
              :placeholder="t('chat.toolsMenu.requirementPlaceholder')"
              type="textarea"
          />
        </n-form-item>
      </n-form>
    </div>
    <template #action>
      <n-button quaternary @click="handleClose">
        {{ t('common.cancel') }}
      </n-button>
      <n-button type="primary" @click="handleGenerateQuestions">
        {{ t('common.confirm') }}
      </n-button>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {getDefaultQuestionGenerateRequestDTO} from '@/api/celestialHub/question'
import type {QuestionGenerateRequestDTO} from '@/types/celestialHub/question'
import type {FormInst, FormRules} from 'naive-ui'

interface Props {
  show: boolean
  sessionId?: string | number | null
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  sessionId: null
})

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'question-request-success', payload: QuestionGenerateRequestDTO): void
}>()

const {t} = useI18n()

const innerShow = computed({
  get() {
    return props.show
  },
  set(value: boolean) {
    emit('update:show', value)
  }
})

const questionFormRef = ref<FormInst | null>(null)
const questionForm = ref<QuestionGenerateRequestDTO>(getDefaultQuestionGenerateRequestDTO())

const questionFormRules: FormRules = {
  questionCount: [
    {
      required: true,
      type: 'number',
      message: '',
      trigger: ['blur', 'change']
    }
  ],
  questionType: [
    {
      required: true,
      type: 'number',
      message: '',
      trigger: ['blur', 'change']
    }
  ],
  difficulty: [
    {
      required: true,
      type: 'number',
      message: '',
      trigger: ['blur', 'change']
    }
  ],
  requirement: [
    {
      required: true,
      type: 'string',
      message: '',
      trigger: ['blur', 'change']
    },
    {
      max: 1000,
      type: 'string',
      message: '',
      trigger: ['blur', 'change']
    }
  ]
}

const questionTypeOptions = computed(() => [
  {label: t('chat.toolsMenu.questionTypeSingle'), value: 0},
  {label: t('chat.toolsMenu.questionTypeMultiple'), value: 1},
  {label: t('chat.toolsMenu.questionTypeJudge'), value: 2},
  {label: t('chat.toolsMenu.questionTypeBlank'), value: 3},
  {label: t('chat.toolsMenu.questionTypeShort'), value: 4},
  {label: t('chat.toolsMenu.questionTypeMixed'), value: 5}
])

const difficultyOptions = computed(() => [
  {label: t('chat.toolsMenu.difficultyRandom'), value: 0},
  {label: t('chat.toolsMenu.difficultyEasy'), value: 1},
  {label: t('chat.toolsMenu.difficultyMedium'), value: 2},
  {label: t('chat.toolsMenu.difficultyHard'), value: 3}
])

if (questionForm.value.questionCount == null) {
  questionForm.value.questionCount = 1
}

watch(
    () => props.show,
    (value) => {
      if (!value) {
        return
      }
      const nextForm = getDefaultQuestionGenerateRequestDTO()
      if (nextForm.questionCount == null) {
        nextForm.questionCount = 1
      }
      if (props.sessionId) {
        nextForm.sessionId = String(props.sessionId)
      } else {
        nextForm.sessionId = null
      }
      questionForm.value = nextForm
      if (questionFormRef.value) {
        questionFormRef.value.restoreValidation()
      }
    }
)

watch(
    () => props.sessionId,
    (value) => {
      if (value) {
        questionForm.value.sessionId = String(value)
      } else {
        questionForm.value.sessionId = null
      }
    },
    {immediate: true}
)

const handleGenerateQuestions = () => {
  if (!questionFormRef.value) {
    return
  }
  questionFormRef.value.validate((errors) => {
    if (errors) {
      return
    }
    const requestPayload: QuestionGenerateRequestDTO = {
      ...questionForm.value
    }
    emit('question-request-success', requestPayload)
    innerShow.value = false
  })
}

const handleClose = () => {
  innerShow.value = false
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles' as *;

.smart-question-modal {
  :deep(.n-card) {
    display: flex;
    flex-direction: column;
    height: 100%;
    border-radius: 18px;
  }

  :deep(.n-card-header) {
    padding: 16px 24px;
    border-bottom: 1px solid var(--border-color);

    .n-card-header__main {
      font-size: 18px;
      font-weight: 600;
    }
  }

  :deep(.n-card__content) {
    flex: 1;
    overflow: auto;
    padding: 16px 24px 0 24px;
  }

  :deep(.n-card__footer) {
    padding: 12px 24px 16px 24px;
    border-top: 1px solid var(--border-color);
    display: flex;
    justify-content: flex-end;
    gap: 12px;
  }
}

.smart-question-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.smart-question-form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px 24px;
  margin-bottom: 16px;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
}

</style>


