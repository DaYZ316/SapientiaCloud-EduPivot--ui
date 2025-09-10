<template>
  <n-modal v-model:show="showModal" :title="modalTitle" preset="card" style="width: 600px">
    <n-form
        ref="formRef"
        :model="formData"
        :rules="formRules"
        :style="{ maxWidth: '540px' }"
    >
      <!-- 学生信息字段 -->
      <template v-if="type === 'student'">
        <n-form-item :label="t('settings.user.studentInfo.studentCode')" path="studentCode">
          <n-input
              v-model:value="(formData as StudentAddDTO).studentCode"
              :placeholder="t('settings.user.studentInfo.studentCodePlaceholder')"
          />
        </n-form-item>
        <n-form-item :label="t('settings.user.studentInfo.realName')" path="realName">
          <n-input
              v-model:value="formData.realName"
              :placeholder="t('settings.user.studentInfo.realNamePlaceholder')"
          />
        </n-form-item>
        <n-form-item :label="t('settings.user.studentInfo.birthDate')" path="birthDate">
          <n-date-picker
              v-model:value="formData.birthDate"
              :placeholder="t('settings.user.studentInfo.birthDatePlaceholder')"
              style="width: 100%"
              type="date"
          />
        </n-form-item>
        <n-form-item :label="t('settings.user.studentInfo.admissionYear')" path="admissionYear">
          <n-input-number
              v-model:value="(formData as StudentAddDTO).admissionYear"
              :placeholder="t('settings.user.studentInfo.admissionYearPlaceholder')"
              style="width: 100%"
          />
        </n-form-item>
        <n-form-item :label="t('settings.user.studentInfo.major')" path="major">
          <n-input
              v-model:value="(formData as StudentAddDTO).major"
              :placeholder="t('settings.user.studentInfo.majorPlaceholder')"
          />
        </n-form-item>
        <n-form-item :label="t('settings.user.studentInfo.academicStatus')" path="academicStatus">
          <n-select
              v-model:value="(formData as StudentAddDTO).academicStatus"
              :options="academicStatusOptions"
              :placeholder="t('settings.user.studentInfo.academicStatusPlaceholder')"
          />
        </n-form-item>
        <n-form-item :label="t('settings.user.studentInfo.description')" path="description">
          <n-input
              v-model:value="formData.description"
              :placeholder="t('settings.user.studentInfo.descriptionPlaceholder')"
              type="textarea"
          />
        </n-form-item>
      </template>

      <!-- 教师信息字段 -->
      <template v-else-if="type === 'teacher'">
        <n-form-item :label="t('settings.user.teacherInfo.teacherCode')" path="teacherCode">
          <n-input
              v-model:value="(formData as TeacherAddDTO).teacherCode"
              :placeholder="t('settings.user.teacherInfo.teacherCodePlaceholder')"
          />
        </n-form-item>
        <n-form-item :label="t('settings.user.teacherInfo.realName')" path="realName">
          <n-input
              v-model:value="formData.realName"
              :placeholder="t('settings.user.teacherInfo.realNamePlaceholder')"
          />
        </n-form-item>
        <n-form-item :label="t('settings.user.teacherInfo.birthDate')" path="birthDate">
          <n-date-picker
              v-model:value="formData.birthDate"
              :placeholder="t('settings.user.teacherInfo.birthDatePlaceholder')"
              style="width: 100%"
              type="date"
          />
        </n-form-item>
        <n-form-item :label="t('settings.user.teacherInfo.department')" path="department">
          <n-input
              v-model:value="(formData as TeacherAddDTO).department"
              :placeholder="t('settings.user.teacherInfo.departmentPlaceholder')"
          />
        </n-form-item>
        <n-form-item :label="t('settings.user.teacherInfo.education')" path="education">
          <n-select
              v-model:value="(formData as TeacherAddDTO).education"
              :options="educationOptions"
              :placeholder="t('settings.user.teacherInfo.educationPlaceholder')"
          />
        </n-form-item>
        <n-form-item :label="t('settings.user.teacherInfo.specialization')" path="specialization">
          <n-input
              v-model:value="(formData as TeacherAddDTO).specialization"
              :placeholder="t('settings.user.teacherInfo.specializationPlaceholder')"
          />
        </n-form-item>
        <n-form-item :label="t('settings.user.teacherInfo.description')" path="description">
          <n-input
              v-model:value="formData.description"
              :placeholder="t('settings.user.teacherInfo.descriptionPlaceholder')"
              type="textarea"
          />
        </n-form-item>
      </template>
    </n-form>

    <n-alert v-if="isDisplayMode" style="margin-top: 16px;" type="info">
      {{ confirmMessage }}
    </n-alert>

    <template #footer>
      <n-space justify="end">
        <n-button @click="handleCancel">{{ cancelText }}</n-button>
        <n-button :loading="submitting" type="primary" @click="handleSubmit">
          {{ submitText }}
        </n-button>
      </n-space>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue'
import type {FormInst} from 'naive-ui'
import {useI18n} from 'vue-i18n'
import type {StudentAddDTO} from '@/types/student'
import type {TeacherAddDTO} from '@/types/teacher'

type InfoType = 'student' | 'teacher'
type InfoForm = StudentAddDTO | TeacherAddDTO

interface Props {
  show: boolean
  type: InfoType
  mode: 'input' | 'display'
  formData: InfoForm
  submitting: boolean
  academicStatusOptions?: Array<{ label: string; value: number }>
  educationOptions?: Array<{ label: string; value: number }>
}

interface Emits {
  (e: 'update:show', value: boolean): void

  (e: 'submit', formData: InfoForm): void

  (e: 'cancel'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const {t} = useI18n()

const formRef = ref<FormInst | null>(null)

const showModal = computed({
  get: () => props.show,
  set: (value) => emit('update:show', value)
})

const isDisplayMode = computed(() => props.mode === 'display')

const modalTitle = computed(() => {
  const prefix = props.type === 'student' ? 'studentInfo' : 'teacherInfo'
  const suffix = isDisplayMode.value ? 'Display' : ''
  return t(`settings.user.${prefix}${suffix}.title`)
})

const cancelText = computed(() => {
  const prefix = props.type === 'student' ? 'studentInfo' : 'teacherInfo'
  const suffix = isDisplayMode.value ? 'Display' : ''
  return t(`settings.user.${prefix}${suffix}.cancel`)
})

const submitText = computed(() => {
  const prefix = props.type === 'student' ? 'studentInfo' : 'teacherInfo'
  const suffix = isDisplayMode.value ? 'Display' : ''
  return t(`settings.user.${prefix}${suffix}.${isDisplayMode.value ? 'confirm' : 'submit'}`)
})

const confirmMessage = computed(() => {
  const prefix = props.type === 'student' ? 'studentInfo' : 'teacherInfo'
  return t(`settings.user.${prefix}Display.confirmMessage`)
})

// 动态表单验证规则
const formRules = computed(() => {
  const rules: any = {
    realName: [
      {required: true, message: t(`settings.user.${props.type}Info.realNameRequired`), trigger: 'blur'}
    ]
  }

  if (props.type === 'student') {
    rules.studentCode = [
      {required: true, message: t('settings.user.studentInfo.studentCodeRequired'), trigger: 'blur'}
    ]
    rules.academicStatus = [
      {
        required: true,
        type: 'number',
        message: t('settings.user.studentInfo.academicStatusRequired'),
        trigger: ['blur', 'change']
      }
    ]
  } else {
    rules.teacherCode = [
      {required: true, message: t('settings.user.teacherInfo.teacherCodeRequired'), trigger: 'blur'}
    ]
    rules.department = [
      {required: true, message: t('settings.user.teacherInfo.departmentRequired'), trigger: 'blur'}
    ]
    rules.education = [
      {
        required: true,
        type: 'number',
        message: t('settings.user.teacherInfo.educationRequired'),
        trigger: ['blur', 'change']
      }
    ]
  }

  return rules
})

function handleSubmit() {
  emit('submit', props.formData)
}

function handleCancel() {
  emit('cancel')
}
</script>

<style lang="scss" scoped>
</style>

