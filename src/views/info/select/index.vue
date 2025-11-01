<template>
  <div class="identity-select-container">
    <div class="identity-select-card">
      <div class="header">
        <h1 class="title">{{ t('info.select.title') }}</h1>
        <p class="description">{{ t('info.select.description') }}</p>
      </div>

      <n-card :bordered="false" class="form-card">
        <n-form
          ref="formRef"
          :model="currentFormData"
          :rules="formRules"
          label-placement="left"
          label-width="120"
        >
          <n-form-item :label="t('info.select.identityType')" path="identityType">
            <n-radio-group v-model:value="formData.identityType">
              <n-radio value="student">{{ t('info.select.student') }}</n-radio>
              <n-radio value="teacher">{{ t('info.select.teacher') }}</n-radio>
            </n-radio-group>
          </n-form-item>

          <!-- 学生信息表单 -->
          <template v-if="formData.identityType === 'student'">
            <n-form-item :label="t('settings.user.studentInfo.studentCode')" path="studentCode">
              <n-input
                v-model:value="currentFormData.studentCode"
                :placeholder="t('settings.user.studentInfo.studentCodePlaceholder')"
                clearable
              />
            </n-form-item>
            <n-grid :cols="24" :x-gap="24">
              <n-grid-item :span="12">
                <n-form-item :label="t('settings.user.studentInfo.realName')" path="realName">
                  <n-input
                    v-model:value="currentFormData.realName"
                    :placeholder="t('settings.user.studentInfo.realNamePlaceholder')"
                    clearable
                  />
                </n-form-item>
              </n-grid-item>
              <n-grid-item :span="12">
                <n-form-item :label="t('settings.user.studentInfo.birthDate')" path="birthDate">
                  <n-date-picker
                    v-model:value="currentFormData.birthDate as any"
                    :placeholder="t('settings.user.studentInfo.birthDatePlaceholder')"
                    style="width: 100%"
                    type="date"
                    clearable
                  />
                </n-form-item>
              </n-grid-item>
            </n-grid>
            <n-grid :cols="24" :x-gap="24">
              <n-grid-item :span="12">
                <n-form-item :label="t('settings.user.studentInfo.admissionYear')" path="admissionYear">
                  <n-input-number
                    v-model:value="currentFormData.admissionYear"
                    :placeholder="t('settings.user.studentInfo.admissionYearPlaceholder')"
                    style="width: 100%"
                    clearable
                  />
                </n-form-item>
              </n-grid-item>
              <n-grid-item :span="12">
                <n-form-item :label="t('settings.user.studentInfo.academicStatus')" path="academicStatus">
                  <n-select
                    v-model:value="currentFormData.academicStatus"
                    :options="academicStatusOptions"
                    :placeholder="t('settings.user.studentInfo.academicStatusPlaceholder')"
                    clearable
                  />
                </n-form-item>
              </n-grid-item>
            </n-grid>
            <n-form-item :label="t('settings.user.studentInfo.major')" path="major">
              <n-input
                v-model:value="currentFormData.major"
                :placeholder="t('settings.user.studentInfo.majorPlaceholder')"
                clearable
              />
            </n-form-item>
            <n-form-item :label="t('settings.user.studentInfo.description')" path="description">
              <n-input
                v-model:value="currentFormData.description"
                :placeholder="t('settings.user.studentInfo.descriptionPlaceholder')"
                type="textarea"
                clearable
              />
            </n-form-item>
          </template>

          <!-- 教师信息表单 -->
          <template v-if="formData.identityType === 'teacher'">
            <n-form-item :label="t('settings.user.teacherInfo.teacherCode')" path="teacherCode">
              <n-input
                v-model:value="currentFormData.teacherCode"
                :placeholder="t('settings.user.teacherInfo.teacherCodePlaceholder')"
                clearable
              />
            </n-form-item>
            <n-grid :cols="24" :x-gap="24">
              <n-grid-item :span="12">
                <n-form-item :label="t('settings.user.teacherInfo.realName')" path="realName">
                  <n-input
                    v-model:value="currentFormData.realName"
                    :placeholder="t('settings.user.teacherInfo.realNamePlaceholder')"
                    clearable
                  />
                </n-form-item>
              </n-grid-item>
              <n-grid-item :span="12">
                <n-form-item :label="t('settings.user.teacherInfo.birthDate')" path="birthDate">
                  <n-date-picker
                    v-model:value="currentFormData.birthDate as any"
                    :placeholder="t('settings.user.teacherInfo.birthDatePlaceholder')"
                    style="width: 100%"
                    type="date"
                    clearable
                  />
                </n-form-item>
              </n-grid-item>
            </n-grid>
            <n-grid :cols="24" :x-gap="24">
              <n-grid-item :span="12">
                <n-form-item :label="t('settings.user.teacherInfo.department')" path="department">
                  <n-input
                    v-model:value="currentFormData.department"
                    :placeholder="t('settings.user.teacherInfo.departmentPlaceholder')"
                    clearable
                  />
                </n-form-item>
              </n-grid-item>
              <n-grid-item :span="12">
                <n-form-item :label="t('settings.user.teacherInfo.education')" path="education">
                  <n-select
                    v-model:value="currentFormData.education"
                    :options="educationOptions"
                    :placeholder="t('settings.user.teacherInfo.educationPlaceholder')"
                    clearable
                  />
                </n-form-item>
              </n-grid-item>
            </n-grid>
            <n-form-item :label="t('settings.user.teacherInfo.specialization')" path="specialization">
              <n-input
                v-model:value="currentFormData.specialization"
                :placeholder="t('settings.user.teacherInfo.specializationPlaceholder')"
                clearable
              />
            </n-form-item>
            <n-form-item :label="t('settings.user.teacherInfo.description')" path="description">
              <n-input
                v-model:value="currentFormData.description"
                :placeholder="t('settings.user.teacherInfo.descriptionPlaceholder')"
                type="textarea"
                clearable
              />
            </n-form-item>
          </template>
        </n-form>

        <div class="actions">
          <n-space justify="space-between">
            <n-button @click="handleLogout">{{ t('auth.logout') }}</n-button>
            <n-button :loading="submitting" type="primary" @click="handleSubmit">
              {{ t('info.select.submit') }}
            </n-button>
          </n-space>
        </div>
      </n-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, reactive, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRouter} from 'vue-router'
import {NButton, NCard, NDatePicker, NForm, NFormItem, NGrid, NGridItem, NInput, NInputNumber, NRadio, NRadioGroup, NSelect, NSpace, useDialog, useMessage} from 'naive-ui'
import {useUserStore} from '@/store'
import * as AuthApi from '@/api/auth/auth'
import {getAcademicStatusOptions} from '@/enum/student'
import {getEducationOptions} from '@/enum/teacher'
import type {FormInst} from 'naive-ui'
import type {StudentAddDTO} from '@/types/student'
import type {TeacherAddDTO} from '@/types/teacher'

const {t, locale} = useI18n()
const router = useRouter()
const userStore = useUserStore()
const dialog = useDialog()
const message = useMessage()

const formRef = ref<FormInst | null>(null)
const submitting = ref(false)

const formData = reactive({
  identityType: null as string | null
})

const studentForm = reactive<StudentAddDTO>({
  studentCode: null,
  realName: null,
  birthDate: null,
  admissionYear: null,
  major: null,
  academicStatus: null,
  description: null,
  sysUserId: null
})

const teacherForm = reactive<TeacherAddDTO>({
  teacherCode: null,
  realName: null,
  birthDate: null,
  department: null,
  education: null,
  specialization: null,
  description: null,
  sysUserId: null
})

const academicStatusOptions = computed(() => getAcademicStatusOptions(locale.value === 'en-US'))
const educationOptions = computed(() => getEducationOptions(locale.value === 'en-US'))

// 合并的表单数据对象，用于表单验证和双向绑定
const currentFormData = reactive({
  identityType: null as string | null,
  // 学生字段
  studentCode: null as string | null,
  realName: null as string | null,
  birthDate: null as number | null,
  admissionYear: null as number | null,
  major: null as string | null,
  academicStatus: null as number | null,
  description: null as string | null,
  // 教师字段
  teacherCode: null as string | null,
  department: null as string | null,
  education: null as number | null,
  specialization: null as string | null
})

// 同步 identityType
watch(() => formData.identityType, (newVal) => {
  currentFormData.identityType = newVal
  // 切换身份类型时，从对应的表单对象同步数据到 currentFormData
  if (newVal === 'student') {
    currentFormData.studentCode = studentForm.studentCode ?? null
    currentFormData.realName = studentForm.realName ?? null
    currentFormData.birthDate = (studentForm.birthDate as number | null) ?? null
    currentFormData.admissionYear = studentForm.admissionYear ?? null
    currentFormData.major = studentForm.major ?? null
    currentFormData.academicStatus = studentForm.academicStatus ?? null
    currentFormData.description = studentForm.description ?? null
  } else if (newVal === 'teacher') {
    currentFormData.teacherCode = teacherForm.teacherCode ?? null
    currentFormData.realName = teacherForm.realName ?? null
    currentFormData.birthDate = (teacherForm.birthDate as number | null) ?? null
    currentFormData.department = teacherForm.department ?? null
    currentFormData.education = teacherForm.education ?? null
    currentFormData.specialization = teacherForm.specialization ?? null
    currentFormData.description = teacherForm.description ?? null
  }
}, {immediate: true})

// 同步：当选择学生身份时，currentFormData -> studentForm（用于提交数据）
watch(
  () => [
    currentFormData.studentCode,
    currentFormData.realName,
    currentFormData.birthDate,
    currentFormData.admissionYear,
    currentFormData.major,
    currentFormData.academicStatus,
    currentFormData.description
  ],
  () => {
    if (formData.identityType === 'student') {
      studentForm.studentCode = currentFormData.studentCode ?? null
      studentForm.realName = currentFormData.realName ?? null
      studentForm.birthDate = currentFormData.birthDate as any
      studentForm.admissionYear = currentFormData.admissionYear ?? null
      studentForm.major = currentFormData.major ?? null
      studentForm.academicStatus = currentFormData.academicStatus ?? null
      studentForm.description = currentFormData.description ?? null
    }
  },
  {deep: true}
)

// 同步：当选择教师身份时，currentFormData -> teacherForm（用于提交数据）
watch(
  () => [
    currentFormData.teacherCode,
    currentFormData.realName,
    currentFormData.birthDate,
    currentFormData.department,
    currentFormData.education,
    currentFormData.specialization,
    currentFormData.description
  ],
  () => {
    if (formData.identityType === 'teacher') {
      teacherForm.teacherCode = currentFormData.teacherCode ?? null
      teacherForm.realName = currentFormData.realName ?? null
      teacherForm.birthDate = currentFormData.birthDate as any
      teacherForm.department = currentFormData.department ?? null
      teacherForm.education = currentFormData.education ?? null
      teacherForm.specialization = currentFormData.specialization ?? null
      teacherForm.description = currentFormData.description ?? null
    }
  },
  {deep: true}
)

const formRules = computed(() => {
  const rules: any = {}

  if (formData.identityType === 'student') {
    rules.realName = [
      {required: true, message: t('settings.user.studentInfo.realNameRequired'), trigger: 'blur'}
    ]
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
  } else if (formData.identityType === 'teacher') {
    rules.realName = [
      {required: true, message: t('settings.user.teacherInfo.realNameRequired'), trigger: 'blur'}
    ]
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

// 将时间戳转换为日期字符串
const formatDateForAPI = (timestamp: number | null): string | null => {
  if (!timestamp) return null
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const handleSubmit = async () => {
  if (!formRef.value) return

  formRef.value.validate(async (errors) => {
    if (errors) return

    submitting.value = true

    const selectIdentityDTO = AuthApi.getDefaultSelectIdentityDTO()
    selectIdentityDTO.identityType = formData.identityType

    if (formData.identityType === 'student') {
      studentForm.sysUserId = userStore.userInfo?.id || null
      selectIdentityDTO.studentInfo = {
        ...studentForm,
        birthDate: typeof studentForm.birthDate === 'number' 
          ? formatDateForAPI(studentForm.birthDate) 
          : studentForm.birthDate
      }
    } else if (formData.identityType === 'teacher') {
      teacherForm.sysUserId = userStore.userInfo?.id || null
      selectIdentityDTO.teacherInfo = {
        ...teacherForm,
        birthDate: typeof teacherForm.birthDate === 'number' 
          ? formatDateForAPI(teacherForm.birthDate) 
          : teacherForm.birthDate
      }
    }

    const res = await AuthApi.selectIdentity(selectIdentityDTO)

    if (res.success) {
      message.success(t('info.select.submitSuccess'))
      // 强制刷新用户信息，因为刚刚提交了身份信息
      await userStore.refreshUserInfo(true)
      router.push('/dashboard')
    } else {
      message.error(t('info.select.submitFailed'))
    }

    submitting.value = false
  })
}

const handleLogout = () => {
  dialog.warning({
    title: t('auth.logoutConfirm'),
    content: t('auth.logoutConfirmMessage'),
    positiveText: t('common.confirm'),
    negativeText: t('common.cancel'),
    onPositiveClick: async () => {
      await userStore.logout()
      message.success(t('auth.logoutSuccess'))
      router.push('/login')
    }
  })
}

// 监听路由变化，如果用户已经不需要填写信息，重定向到主页
watch(
  () => userStore.needsIdentityInfo,
  (needsInfo) => {
    if (!needsInfo && userStore.isLogin) {
      router.push('/dashboard')
    }
  }
)

// 组件挂载时检查用户状态
onMounted(async () => {
  // 路由守卫已经处理了用户信息刷新，这里只检查状态
  // 如果用户已经不需要填写信息，重定向到主页
  if (userStore.isLogin && !userStore.needsIdentityInfo) {
    router.push('/dashboard')
    return
  }
  
  // 如果用户未登录，重定向到登录页
  if (!userStore.isLogin) {
    router.push('/login')
  }
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/index.scss' as *;

.identity-select-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: var(--background-color);
}

.identity-select-card {
  width: 100%;
  max-width: 800px;
}

.header {
  text-align: center;
  margin-bottom: 32px;

  .title {
    font-size: 28px;
    font-weight: 600;
    color: var(--text-color);
    margin-bottom: 12px;
  }

  .description {
    font-size: 16px;
    color: var(--text-secondary-color);
    line-height: 1.6;
  }
}

.form-card {
  background: var(--background-secondary-color);
  border-radius: 8px;
  box-shadow: 0 2px 8px var(--shadow-color);
}

.actions {
  margin-top: 24px;
  padding-top: 24px;
  border-top: 1px solid var(--border-color);
}

:deep(.n-form-item) {
  margin-bottom: 20px;
}

:deep(.n-form-item-label) {
  font-weight: 500;
  color: var(--text-color);
}
</style>

