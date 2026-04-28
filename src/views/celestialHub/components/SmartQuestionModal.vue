<template>
  <div
      v-show="innerShow"
      class="smart-question-panel"
  >
    <div class="smart-question-panel-header">
      <div class="smart-question-panel-title">
        <span class="smart-question-panel-text">
          {{ panelTitle }}
        </span>
        <n-tag :bordered="false" round size="small" type="info">
          {{ panelTag }}
        </n-tag>
      </div>
      <div class="smart-question-panel-actions">
        <n-button
            :title="t('common.cancel')"
            aria-label="close"
            circle
            class="smart-question-panel-close"
            size="small"
            tertiary
            @click="handleClose"
        >
          <template #icon>
            <n-icon :component="CloseOutline" size="16"/>
          </template>
        </n-button>
      </div>
    </div>
    <div class="smart-question-panel-body">
      <div class="smart-question-form-hint">
        {{ formHint }}
      </div>
      <n-form
          ref="questionFormRef"
          :model="questionForm"
          :rules="questionFormRules"
          label-placement="top"
      >
        <div v-if="isPaperMode" class="smart-question-form-grid paper-grid">
          <n-form-item :label="t('chat.toolsMenu.paperName')" path="paperName">
            <n-input
                v-model:value="questionForm.paperName"
                :maxlength="100"
                :placeholder="t('chat.toolsMenu.paperNamePlaceholder')"
            />
          </n-form-item>
          <n-form-item :label="t('chat.toolsMenu.paperType')" path="paperType">
            <n-input
                v-model:value="questionForm.paperType"
                :maxlength="50"
                :placeholder="t('chat.toolsMenu.paperTypePlaceholder')"
            />
          </n-form-item>
          <n-form-item :label="t('chat.toolsMenu.totalScore')" path="totalScore">
            <n-input-number
                v-model:value="questionForm.totalScore"
                :max="1000"
                :min="1"
                :precision="0"
                placeholder="1 - 1000"
            />
          </n-form-item>
          <n-form-item :label="t('chat.toolsMenu.totalEstimatedTime')" path="totalEstimatedTime">
            <n-input-number
                v-model:value="questionForm.totalEstimatedTime"
                :max="300"
                :min="1"
                :precision="0"
                placeholder="1 - 300"
            />
          </n-form-item>
        </div>

        <div class="smart-question-form-grid">
          <n-form-item :label="t('chat.toolsMenu.questionCount')" path="questionCount">
            <n-input-number
                v-model:value="questionForm.questionCount"
                :max="maxQuestionCount"
                :min="1"
                :precision="0"
                :placeholder="questionCountPlaceholder"
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

        <div v-if="isPaperMode" class="smart-question-form-grid paper-grid">
          <n-form-item :label="t('chat.toolsMenu.knowledgePoints')" path="knowledgePoints">
            <n-input
                v-model:value="knowledgePointsInput"
                :autosize="{ minRows: 2, maxRows: 4 }"
                :maxlength="500"
                :placeholder="t('chat.toolsMenu.tagsPlaceholder')"
                type="textarea"
            />
          </n-form-item>
          <n-form-item :label="t('chat.toolsMenu.abilityGoals')" path="abilityGoals">
            <n-input
                v-model:value="abilityGoalsInput"
                :autosize="{ minRows: 2, maxRows: 4 }"
                :maxlength="500"
                :placeholder="t('chat.toolsMenu.tagsPlaceholder')"
                type="textarea"
            />
          </n-form-item>
        </div>

        <n-form-item :label="t('chat.toolsMenu.requirement')" path="requirement">
          <n-input
              v-model:value="questionForm.requirement"
              :autosize="{ minRows: 4, maxRows: 8 }"
              :maxlength="1000"
              :placeholder="requirementPlaceholder"
              type="textarea"
          />
        </n-form-item>
        <div class="smart-question-panel-footer">
          <n-button quaternary @click="handleClose">
            {{ t('common.cancel') }}
          </n-button>
          <n-button type="primary" @click="handleGenerateQuestions">
            {{ panelTitle }}
          </n-button>
        </div>
      </n-form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import type {FormInst, FormRules} from 'naive-ui'
import {NButton, NIcon, NTag} from 'naive-ui'
import {CloseOutline} from '@vicons/ionicons5'
import {getDefaultQuestionGenerateRequestDTO} from '@/api/celestialHub/question'
import type {
  QuestionGenerateRequestDTO,
  QuestionGenerationMode,
  QuestionGenerationSuccessPayload
} from '@/types/celestialHub/question'
import {useTransitionStore} from '@/store'

interface Props {
  show: boolean
  sessionId?: string | number | null
  mode?: QuestionGenerationMode
}

const props = withDefaults(defineProps<Props>(), {
  show: false,
  sessionId: null,
  mode: 'question'
})

const emit = defineEmits<{
  (e: 'update:show', value: boolean): void
  (e: 'question-request-success', payload: QuestionGenerationSuccessPayload): void
}>()

const {t} = useI18n()
const transitionStore = useTransitionStore()

const innerShow = ref(props.show)
const skipCloseAnimation = ref(false)
const questionFormRef = ref<FormInst | null>(null)
const questionForm = ref<QuestionGenerateRequestDTO>(buildInitialForm(props.mode))
const knowledgePointsInput = ref('')
const abilityGoalsInput = ref('')

const isPaperMode = computed(() => props.mode === 'paper')
const maxQuestionCount = computed(() => isPaperMode.value ? 50 : 10)
const panelTitle = computed(() => t(isPaperMode.value ? 'chat.toolsMenu.smartPaper' : 'chat.toolsMenu.smartQuestion'))
const panelTag = computed(() => t(isPaperMode.value ? 'chat.toolsMenu.paperRequestTitle' : 'chat.toolsMenu.questionRequestTitle'))
const questionCountPlaceholder = computed(() => `1 - ${maxQuestionCount.value}`)
const requirementPlaceholder = computed(() => t(
    isPaperMode.value
        ? 'chat.toolsMenu.paperRequirementPlaceholder'
        : 'chat.toolsMenu.requirementPlaceholder'
))
const formHint = computed(() => t(
    isPaperMode.value
        ? 'chat.toolsMenu.paperFormHint'
        : 'chat.toolsMenu.questionFormHint'
))

const questionFormRules = computed<FormRules>(() => ({
  questionCount: [
    {
      required: true,
      type: 'number',
      message: '',
      trigger: ['blur', 'change']
    },
    {
      validator: (_rule, value: number | null) => {
        if (typeof value !== 'number') {
          return true
        }
        return value >= 1 && value <= maxQuestionCount.value
      },
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
  ],
  paperName: isPaperMode.value ? [
    {
      required: true,
      type: 'string',
      message: '',
      trigger: ['blur', 'change']
    },
    {
      max: 100,
      type: 'string',
      message: '',
      trigger: ['blur', 'change']
    }
  ] : [],
  paperType: [
    {
      max: 50,
      type: 'string',
      message: '',
      trigger: ['blur', 'change']
    }
  ]
}))

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

watch(() => props.show, (newValue) => {
  if (newValue) {
    if (transitionStore.showTransition) {
      const unwatch = watch(() => transitionStore.showTransition, (transitioning) => {
        if (!transitioning) {
          unwatch()
          innerShow.value = true
          skipCloseAnimation.value = false
        }
      })
    } else {
      innerShow.value = true
      skipCloseAnimation.value = false
    }
  } else if (skipCloseAnimation.value) {
    innerShow.value = false
    skipCloseAnimation.value = false
  } else {
    setTimeout(() => {
      innerShow.value = false
    }, 400)
  }
}, {immediate: true})

watch(
    () => [props.show, props.mode, props.sessionId],
    ([show]) => {
      if (!show) {
        return
      }
      resetForm()
    },
    {immediate: true}
)

watch(
    () => props.sessionId,
    (value) => {
      questionForm.value.sessionId = value ? String(value) : null
    },
    {immediate: true}
)

const handleUpdateShow = (value: boolean, skipAnimation = false) => {
  if (skipAnimation) {
    skipCloseAnimation.value = true
  }
  emit('update:show', value)
}

const handleGenerateQuestions = () => {
  if (!questionFormRef.value) {
    return
  }

  questionFormRef.value.validate((errors) => {
    if (errors) {
      return
    }

    const requestPayload = buildRequestPayload()
    emit('question-request-success', {
      mode: props.mode,
      request: requestPayload
    })
    handleUpdateShow(false, true)
  })
}

const handleClose = () => {
  handleUpdateShow(false)
}

function buildInitialForm(mode: QuestionGenerationMode): QuestionGenerateRequestDTO {
  const nextForm = getDefaultQuestionGenerateRequestDTO()
  nextForm.sessionId = props.sessionId ? String(props.sessionId) : null
  nextForm.generationMode = mode
  nextForm.questionCount = mode === 'paper' ? 10 : 1
  nextForm.questionType = mode === 'paper' ? 5 : null
  nextForm.difficulty = mode === 'paper' ? 2 : null
  return nextForm
}

function resetForm() {
  questionForm.value = buildInitialForm(props.mode)
  knowledgePointsInput.value = ''
  abilityGoalsInput.value = ''
  questionFormRef.value?.restoreValidation()
}

function buildRequestPayload(): QuestionGenerateRequestDTO {
  const knowledgePoints = normalizeListInput(knowledgePointsInput.value)
  const abilityGoals = normalizeListInput(abilityGoalsInput.value)

  return {
    ...questionForm.value,
    generationMode: props.mode,
    paperName: isPaperMode.value ? normalizeText(questionForm.value.paperName) : null,
    paperType: isPaperMode.value ? normalizeText(questionForm.value.paperType) : null,
    totalScore: isPaperMode.value ? questionForm.value.totalScore ?? null : null,
    totalEstimatedTime: isPaperMode.value ? questionForm.value.totalEstimatedTime ?? null : null,
    knowledgePoints: isPaperMode.value ? knowledgePoints : null,
    abilityGoals: isPaperMode.value ? abilityGoals : null,
    requirement: normalizeText(questionForm.value.requirement),
    useRag: questionForm.value.useRag ?? null
  }
}

function normalizeText(value?: string | null) {
  const trimmed = value?.trim()
  return trimmed ? trimmed : null
}

function normalizeListInput(value: string) {
  const items = value
      .split(/[\n,，]/)
      .map(item => item.trim())
      .filter(Boolean)

  return items.length ? items : null
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles' as *;

.smart-question-panel {
  display: flex;
  flex-direction: column;
  width: calc(100% - 48px);
  height: calc(100% - 48px);
  overflow: hidden;
  background: var(--background-color);
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  margin: 24px;
  border: 1px solid var(--border-color);

  .smart-question-panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 24px;
    border-bottom: 1px solid var(--border-color);

    .smart-question-panel-title {
      font-size: 18px;
      font-weight: 600;
      color: var(--color-primary);
      display: flex;
      align-items: center;
      gap: 10px;
      flex: 1;
      min-width: 0;

      .smart-question-panel-text {
        line-height: 1.2;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        flex: 0 1 auto;
        min-width: 0;
      }
    }

    .smart-question-panel-actions {
      display: flex;
      align-items: center;
      gap: 8px;

      .smart-question-panel-close {
        width: 32px;
        height: 32px;
        padding: 0;
      }
    }
  }

  .smart-question-panel-body {
    flex: 1;
    min-height: 0;
    padding: 24px;
    overflow-y: auto;
    background: var(--background-color);

    .smart-question-form-hint {
      margin-bottom: 20px;
      padding: 12px 16px;
      color: var(--text-color-2);
      font-size: 14px;
      line-height: 1.6;
      background: color-mix(in srgb, var(--color-primary) 10%, var(--background-color) 90%);
      border: 1px solid color-mix(in srgb, var(--color-primary) 20%, transparent);
      border-radius: 14px;
    }

    .smart-question-form-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px 24px;
      margin-bottom: 16px;

      &.paper-grid {
        margin-bottom: 8px;
      }

      @media (max-width: 960px) {
        grid-template-columns: 1fr;
      }
    }

    .smart-question-panel-footer {
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      margin-top: 24px;
      padding-top: 16px;
      border-top: 1px solid var(--border-color);
    }
  }
}
</style>
