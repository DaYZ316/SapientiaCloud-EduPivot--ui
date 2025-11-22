<template>
  <n-modal
      v-model:show="show"
      :auto-focus="false"
      :bordered="false"
      :closable="true"
      :mask-closable="false"
      :style="{ width: '100vw', height: '100vh', maxWidth: 'none', maxHeight: 'none' }"
      :title="isCreateMode ? t('course.question.createQuestion') : t('course.question.editQuestion')"
      preset="card"
      size="huge"
      transform-origin="center"
  >
    <div class="modal-content">
      <n-form
          ref="formRef"
          :model="form"
          :rules="rules"
          class="fullscreen-form"
          label-placement="top"
          label-width="auto"
      >
        <div class="form-main-content">
          <n-form-item :label="t('course.question.questionTitle')" class="title-item" path="questionTitle">
            <n-input
                v-model:value="form.questionTitle"
                :placeholder="t('course.question.questionTitlePlaceholder')"
                size="large"
            />
          </n-form-item>

          <n-form-item :label="t('course.question.questionContent')" class="content-item" path="questionContent">
            <n-input
                v-model:value="form.questionContent"
                :placeholder="t('course.question.questionContentPlaceholder')"
                :rows="6"
                size="large"
                type="textarea"
            />
          </n-form-item>
        </div>

        <div class="form-settings">
          <n-row :gutter="24">
            <n-col :span="8">
              <n-form-item :label="t('course.question.questionType')" path="questionType">
                <n-select
                    v-model:value="form.questionType"
                    :options="questionTypeOptions"
                    :placeholder="t('course.question.questionTypePlaceholder')"
                    size="large"
                />
              </n-form-item>
            </n-col>
            <n-col :span="8">
              <n-form-item :label="t('course.question.difficulty')" path="difficulty">
                <n-select
                    v-model:value="form.difficulty"
                    :options="difficultyOptions"
                    :placeholder="t('course.question.difficultyPlaceholder')"
                    size="large"
                />
              </n-form-item>
            </n-col>
            <n-col :span="8">
              <n-form-item :label="t('course.question.score')" path="score">
                <n-input-number
                    v-model:value="form.score"
                    :max="100"
                    :min="0"
                    :placeholder="t('course.question.scorePlaceholder')"
                    size="large"
                    style="width: 100%"
                />
              </n-form-item>
            </n-col>
          </n-row>

          <n-row :gutter="24">
            <n-col :span="8">
              <n-form-item :label="t('course.question.estimatedTime')">
                <n-input-number
                    v-model:value="form.estimatedTime"
                    :max="120"
                    :min="1"
                    :placeholder="t('course.question.estimatedTimePlaceholder')"
                    size="large"
                    style="width: 100%"
                />
              </n-form-item>
            </n-col>
            <n-col :span="8">
              <n-form-item :label="t('course.question.allowPartialCredit')">
                <n-switch
                    v-model:value="form.allowPartialCredit as any"
                    :checked-value="1"
                    :unchecked-value="0"
                    size="large"
                />
              </n-form-item>
            </n-col>
          </n-row>

          <n-form-item :label="t('course.question.tags')">
            <n-dynamic-tags
                v-model:value="form.tags"
                :placeholder="t('course.question.tagsPlaceholder')"
                size="large"
            />
          </n-form-item>
        </div>

        <div v-if="form.questionType === 0 || form.questionType === 1 || form.questionType === 2">
          <QuestionOptionsEditor
              :options="options"
              :question-type="form.questionType"
              @add-option="addOption"
              @remove-option="removeOption"
          />
          <n-form-item v-if="optionsError" :show-feedback="true">
            <n-text style="font-size: 14px;" type="error">
              {{ optionsError }}
            </n-text>
          </n-form-item>
        </div>
        <div
            v-if="form.questionType === QuestionTypeEnum.FILL_BLANK || form.questionType === QuestionTypeEnum.SHORT_ANSWER">
          <QuestionAnswersEditor
              :answers="answers"
              :question-type="form.questionType"
              @add-answer="addAnswer"
              @remove-answer="removeAnswer"
          />
          <n-form-item v-if="answersError" :show-feedback="true">
            <n-text style="font-size: 14px;" type="error">
              {{ answersError }}
            </n-text>
          </n-form-item>
        </div>
      </n-form>

      <div class="modal-actions">
        <n-space justify="space-between" style="width: 100%">
          <div>
            <n-button
                v-if="showSaveDraftButton"
                :disabled="loading"
                @click="handleSaveDraft"
            >
              {{ t('course.question.saveDraft') }}
            </n-button>
          </div>
          <n-space>
            <n-button :disabled="loading" @click="handleCancel">
              {{ t('common.cancel') }}
            </n-button>
            <n-button
                :loading="loading"
                type="primary"
                @click="handleSubmit"
            >
              {{ isCreateMode ? t('common.confirm') : t('common.save') }}
            </n-button>
          </n-space>
        </n-space>
      </div>
    </div>
  </n-modal>
</template>

<script lang="ts" setup>
import {computed, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {getDefaultQuestionOptionDTO} from '@/api/course/questionOption'
import {getDefaultQuestionAnswerDTO} from '@/api/course/questionAnswer'
import {addQuestion, updateQuestion} from '@/api/course/question'
import {useUserStore} from '@/store'
import {QuestionTypeEnum} from '@/enum/course/questionTypeEnum'
import {QuestionStatusEnum} from '@/enum/course/questionStatusEnum'
import type {QuestionAddDTO, QuestionAnswerDTO, QuestionDTO} from '@/types/course'
import type {QuestionOptionDTO} from '@/types/course/questionOption'
import type {FormInst, FormRules, SelectOption} from 'naive-ui'
import {useMessage} from 'naive-ui'
import QuestionOptionsEditor from './components/QuestionOptionsEditor.vue'
import QuestionAnswersEditor from './components/QuestionAnswersEditor.vue'

interface Props {
  mode: 'create' | 'edit'
  rules: FormRules
  questionTypeOptions: SelectOption[]
  difficultyOptions: SelectOption[]
}

interface Emits {
  (event: 'cancel'): void

  (event: 'confirm'): void

  (event: 'save'): void

  (event: 'success'): void

  (event: 'error', error: any): void
}

const props = defineProps<Props>()

const show = defineModel<boolean>('show', {default: false})
const form = defineModel<QuestionAddDTO | QuestionDTO>('form', {required: true})
const options = defineModel<QuestionOptionDTO[]>('options', {default: () => []})
const answers = defineModel<QuestionAnswerDTO[]>('answers', {default: () => []})
const loading = defineModel<boolean | null>('loading', {default: null})

const emit = defineEmits<Emits>()

const {t} = useI18n()
const userStore = useUserStore()
const message = useMessage()

const formRef = ref<FormInst | null>(null)
const optionsError = ref<string | null>(null)
const answersError = ref<string | null>(null)

const isCreateMode = computed(() => props.mode === 'create')

const showSaveDraftButton = computed(() => {
  if (isCreateMode.value) {
    return true
  }
  return form.value.status !== QuestionStatusEnum.PUBLISHED
})

const addOption = () => {
  if (form.value.questionType === QuestionTypeEnum.TRUE_FALSE && options.value.length >= 2) {
    optionsError.value = t('course.question.optionsMaxRequired', {max: 2})
    return
  }
  const option = getDefaultQuestionOptionDTO()
  option.optionLabel = String.fromCharCode(65 + options.value.length)
  options.value.push(option)
  optionsError.value = null
}

const removeOption = (index: number) => {
  if (form.value.questionType === QuestionTypeEnum.TRUE_FALSE && options.value.length <= 2) {
    optionsError.value = t('course.question.optionsMinRequired', {min: 2})
    return
  }
  options.value.splice(index, 1)
  options.value.forEach((item, idx) => {
    item.optionLabel = String.fromCharCode(65 + idx)
  })
  optionsError.value = null
}

const ensureMinimumAnswers = () => {
  if (
      (form.value.questionType === QuestionTypeEnum.FILL_BLANK ||
          form.value.questionType === QuestionTypeEnum.SHORT_ANSWER) &&
      answers.value.length === 0
  ) {
    addAnswer()
  }
}

const addAnswer = () => {
  const answer = getDefaultQuestionAnswerDTO()
  answer.sortOrder = answers.value.length + 1
  answers.value.push(answer)
  answersError.value = null
}

const removeAnswer = (index: number) => {
  if (answers.value.length <= 1) {
    answersError.value = t('course.question.answersMinRequired', {min: 1})
    return
  }
  answers.value.splice(index, 1)
  answers.value.forEach((item, idx) => {
    item.sortOrder = idx + 1
  })
  answersError.value = null
}

const buildOptionPayload = (): QuestionOptionDTO[] | null => {
  if (!options.value || options.value.length === 0) {
    return null
  }
  return options.value.map(option => ({
    ...option,
    questionId: option.questionId ?? null,
    optionContent: option.optionContent ?? null,
    optionLabel: option.optionLabel ?? null,
    isCorrect: option.isCorrect ?? 0,
    score: option.score ?? null,
    imageUrls: option.imageUrls ?? null,
    explanation: option.explanation ?? null
  }))
}

const buildAnswerPayload = (): QuestionAnswerDTO[] | null => {
  if (!answers.value || answers.value.length === 0) {
    return null
  }
  return answers.value.map((answer, index) => ({
    ...answer,
    questionId: answer.questionId ?? null,
    answerContent: answer.answerContent ?? null,
    explanation: answer.explanation ?? null,
    score: answer.score ?? null,
    sortOrder: answer.sortOrder ?? index + 1
  }))
}

watch(() => form.value.questionType, (questionType) => {
  optionsError.value = null
  answersError.value = null
  if (
      questionType === QuestionTypeEnum.FILL_BLANK ||
      questionType === QuestionTypeEnum.SHORT_ANSWER
  ) {
    ensureMinimumAnswers()
  }
  if (questionType === QuestionTypeEnum.TRUE_FALSE) {
    if (options.value.length < 2) {
      while (options.value.length < 2) {
        const option = getDefaultQuestionOptionDTO()
        option.optionLabel = String.fromCharCode(65 + options.value.length)
        options.value.push(option)
      }
    } else if (options.value.length > 2) {
      options.value = options.value.slice(0, 2)
      options.value.forEach((item, idx) => {
        item.optionLabel = String.fromCharCode(65 + idx)
      })
    }
  }
}, {immediate: true})

watch(() => options.value.map(opt => opt.isCorrect), () => {
  const hasCorrectOption = options.value.some(option => option.isCorrect === 1)
  if (hasCorrectOption && optionsError.value === t('course.question.atLeastOneCorrectRequired')) {
    optionsError.value = null
  }
}, {deep: true})

watch(() => answers.value.length, (length) => {
  answers.value.forEach((item, idx) => {
    item.sortOrder = idx + 1
  })
  if (length >= 1 && answersError.value === t('course.question.answersMinRequired', {min: 1})) {
    answersError.value = null
  }
})

watch(() => answers.value.map(answer => (answer.answerContent ?? '').trim()), (contents) => {
  const allFilled = contents.every(content => content.length > 0)
  if (allFilled && answersError.value === t('course.question.answerContentRequired')) {
    answersError.value = null
  }
}, {deep: true})

const handleCancel = () => {
  emit('cancel')
}

const handleSubmit = async () => {
  if (isCreateMode.value) {
    await handleCreate()
  } else {
    await formRef.value?.validate()
    if (!validateQuestionConfiguration()) {
      return
    }
    form.value.options = buildOptionPayload()
    form.value.answers = buildAnswerPayload()
    emit('save')
  }
}

const validateQuestionConfiguration = (): boolean => {
  optionsError.value = null
  answersError.value = null
  const questionType = form.value.questionType
  const optionsCount = options.value.length

  if (
      questionType === QuestionTypeEnum.SINGLE_CHOICE ||
      questionType === QuestionTypeEnum.MULTIPLE_CHOICE ||
      questionType === QuestionTypeEnum.TRUE_FALSE
  ) {
    if (optionsCount < 2) {
      optionsError.value = t('course.question.optionsMinRequired', {min: 2})
      return false
    }
    if (questionType === QuestionTypeEnum.TRUE_FALSE && optionsCount > 2) {
      optionsError.value = t('course.question.optionsMaxRequired', {max: 2})
      return false
    }
    const hasCorrectOption = options.value.some(option => option.isCorrect === 1)
    if (!hasCorrectOption) {
      optionsError.value = t('course.question.atLeastOneCorrectRequired')
      return false
    }
  }

  if (
      questionType === QuestionTypeEnum.FILL_BLANK ||
      questionType === QuestionTypeEnum.SHORT_ANSWER
  ) {
    if (answers.value.length < 1) {
      answersError.value = t('course.question.answersMinRequired', {min: 1})
      return false
    }
    const hasValidContent = answers.value.every(answer => {
      return typeof answer.answerContent === 'string' && answer.answerContent.trim().length > 0
    })
    if (!hasValidContent) {
      answersError.value = t('course.question.answerContentRequired')
      return false
    }
  }

  return true
}

const handleCreate = async () => {
  await formRef.value?.validate()

  if (!validateQuestionConfiguration()) {
    return
  }

  const userInfo = userStore.userInfo
  if (!userInfo || !userInfo.id) {
    emit('error', new Error(t('course.question.userNotLoggedIn')))
    return
  }

  loading.value = true

  const optionPayload = buildOptionPayload()
  const answerPayload = buildAnswerPayload()

  const questionData: QuestionAddDTO = {
    ...form.value,
    sysUserId: userInfo.id,
    options: optionPayload,
    answers: answerPayload
  } as QuestionAddDTO

  form.value.options = optionPayload
  form.value.answers = answerPayload

  const response = await addQuestion(questionData)
      .catch((error) => {
        loading.value = false
        emit('error', error)
        return null
      })

  if (!response) {
    return
  }

  loading.value = false

  if (response.code === 200 && response.data) {
    emit('success')
    emit('confirm')
    return
  }

  emit('error', response.message || t('course.question.createFailed'))
}

const handleSaveDraft = async () => {
  const userInfo = userStore.userInfo
  if (!userInfo || !userInfo.id) {
    emit('error', new Error(t('course.question.userNotLoggedIn')))
    return
  }

  loading.value = true

  const optionPayload = buildOptionPayload()
  const answerPayload = buildAnswerPayload()

  if (isCreateMode.value) {
    const questionData: QuestionAddDTO = {
      ...form.value,
      sysUserId: userInfo.id,
      status: QuestionStatusEnum.DRAFT,
      options: optionPayload,
      answers: answerPayload
    } as QuestionAddDTO

    const response = await addQuestion(questionData)
        .catch((error) => {
          loading.value = false
          emit('error', error)
          return null
        })

    if (!response) {
      return
    }

    loading.value = false

    if (response.code === 200 && response.data) {
      message.success(t('course.question.saveDraftSuccess'))
      emit('success')
      show.value = false
      return
    }

    emit('error', response.message || t('course.question.saveDraftFailed'))
  } else {
    const questionData: QuestionDTO = {
      ...form.value,
      status: QuestionStatusEnum.DRAFT,
      options: optionPayload,
      answers: answerPayload
    } as QuestionDTO

    const response = await updateQuestion(questionData)
        .catch((error) => {
          loading.value = false
          emit('error', error)
          return null
        })

    if (!response) {
      return
    }

    loading.value = false

    if (response.code === 200 && response.data) {
      message.success(t('course.question.saveDraftSuccess'))
      emit('success')
      show.value = false
      return
    }

    emit('error', response.message || t('course.question.saveDraftFailed'))
  }
}

const validate = async (): Promise<void> => {
  await formRef.value?.validate()
  if (!validateQuestionConfiguration()) {
    throw new Error(optionsError.value || answersError.value || '')
  }
}

const restoreValidation = (): void => {
  formRef.value?.restoreValidation()
}

interface Exposed {
  validate: () => Promise<void>
  restoreValidation: () => void
}

defineExpose<Exposed>({
  validate,
  restoreValidation
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.modal-content {
  height: calc(100vh - 120px);
  display: flex;
  flex-direction: column;

  .fullscreen-form {
    flex: 1;
    overflow-y: auto;
    padding: 0 24px;

    .form-main-content {
      margin-bottom: 32px;

      .title-item {
        margin-bottom: 24px;
      }

      .content-item {
        margin-bottom: 24px;
      }

      .n-form-item-label {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-color);
        margin-bottom: 12px;
      }
    }

    .form-settings {
      border-top: 1px solid var(--border-color);
      padding-top: 24px;

      .n-form-item-label {
        font-size: 14px;
        font-weight: 500;
        color: var(--text-color);
        margin-bottom: 8px;
      }

      .n-row {
        margin-bottom: 16px;
      }
    }
  }

  .modal-actions {
    padding: 16px 24px;
    border-top: 1px solid var(--border-color);
    background: var(--card-color);

    .n-space {
      .n-button {
        min-width: 100px;
        height: 40px;
        font-size: 14px;
        font-weight: 500;
      }
    }
  }
}

.n-modal {
  &.n-modal--fullscreen {
    .n-card {
      border-radius: 0;
      box-shadow: none;
      height: 100vh;
      max-height: 100vh;

      .n-card-header {
        padding: 24px 24px 16px 24px;
        border-bottom: 1px solid var(--border-color);
        background: var(--card-color);

        .n-card-header__main {
          font-size: 20px;
          font-weight: 600;
          color: var(--text-color);
        }
      }

      .n-card__content {
        padding: 0;
        height: calc(100vh - 80px);
        overflow: hidden;
      }
    }
  }
}
</style>

