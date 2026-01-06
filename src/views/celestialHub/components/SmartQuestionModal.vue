<template>
  <div
      v-show="innerShow"
      class="smart-question-panel"
  >
    <div class="smart-question-panel-header">
      <div class="smart-question-panel-title">
        <span class="smart-question-panel-text">
          {{ t('chat.toolsMenu.smartQuestion') }}
        </span>
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
        <div class="smart-question-panel-footer">
          <n-button quaternary @click="handleClose">
            {{ t('common.cancel') }}
          </n-button>
          <n-button type="primary" @click="handleGenerateQuestions">
            {{ t('common.confirm') }}
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
import {NButton, NIcon} from 'naive-ui'
import {CloseOutline} from '@vicons/ionicons5'
import {getDefaultQuestionGenerateRequestDTO} from '@/api/celestialHub/question'
import type {QuestionGenerateRequestDTO} from '@/types/celestialHub/question'
import {useTransitionStore} from '@/store'

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
const transitionStore = useTransitionStore()

const innerShow = ref(props.show)
const skipCloseAnimation = ref(false)

watch(() => props.show, (newValue) => {
  if (newValue) {
    // 等待过渡动画结束后再显示 SmartQuestionModal
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
  } else {
    if (skipCloseAnimation.value) {
      // 通过确定按钮关闭，立即隐藏，不使用退出动画
      innerShow.value = false
      skipCloseAnimation.value = false
    } else {
      // 延迟隐藏，确保关闭动画完成
      setTimeout(() => {
        innerShow.value = false
      }, 400)
    }
  }
}, {immediate: true})

const handleUpdateShow = (value: boolean, skipAnimation = false) => {
  if (skipAnimation) {
    skipCloseAnimation.value = true
  }
  // 立即更新状态，触发动画
  emit('update:show', value)
}

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
    // 通过确定按钮关闭，跳过退出动画
    handleUpdateShow(false, true)
  })
}

const handleClose = () => {
  handleUpdateShow(false)
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
        flex: 1;
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

    .smart-question-form-grid {
      display: grid;
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 16px 24px;
      margin-bottom: 16px;

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


