<template>
  <div class="identity-select-container">
    <div class="identity-select-card">
      <div class="header">
        <div class="header-top">
          <n-button quaternary @click="handleLogout">
            <template #icon>
              <Icon :component="LogOutOutline"/>
            </template>
            {{ t('auth.logout') }}
          </n-button>
        </div>
        <h1 class="title">{{ t('info.select.title') }}</h1>
        <p class="description">{{ t('info.select.description') }}</p>
      </div>

      <!-- 流程步骤 -->
      <div class="flow-header">
        <n-steps :current="needsMobileBind ? currentStep : 2" :status="stepStatus" size="small">
          <n-step :status="needsMobileBind ? undefined : 'finish'" :title="t('info.select.step1.title')"/>
          <n-step :title="t('info.select.step2.title')"/>
        </n-steps>
      </div>

      <!-- 步骤内容 -->
      <Transition :name="stepTransitionName" mode="out-in">
        <!-- 步骤1: 手机号绑定 -->
        <div v-if="currentStep === 1 && needsMobileBind" key="step1" class="step-content">
          <n-card :bordered="false" class="mobile-bind-card">
            <n-alert :show-icon="true" :title="t('info.select.mobileBindRequired')" type="warning">
              <template #header>
                {{ t('info.select.mobileBindRequired') }}
              </template>
              <template #default>
                {{ t('info.select.mobileBindDescription') }}
              </template>
            </n-alert>
            <div class="mobile-bind-form">
              <n-form
                  ref="mobileBindFormRef"
                  :model="mobileBindForm"
                  :rules="mobileBindRules"
                  label-placement="left"
                  label-width="100"
              >
                <n-form-item :label="t('auth.phone')" path="mobile">
                  <n-input
                      v-model:value="mobileBindForm.mobile"
                      :placeholder="t('auth.phoneNumberHint')"
                      clearable
                      maxlength="11"
                  />
                </n-form-item>
                <n-form-item :label="t('auth.verificationCode')" path="verificationCode">
                  <div class="verification-code-wrapper">
                    <n-input-otp
                        v-model:value="mobileBindForm.verificationCode"
                        :length="6"
                    />
                    <n-button
                        :disabled="countdown > 0 || !mobileBindForm.mobile || mobileBindForm.mobile.length !== 11"
                        :loading="sendingCode"
                        @click="handleSendVerificationCode"
                    >
                      {{
                        countdown > 0 ? `${countdown}${t('auth.verificationCodeCountdown')}` : t('auth.sendVerificationCode')
                      }}
                    </n-button>
                  </div>
                </n-form-item>
                <n-form-item>
                  <n-button
                      :loading="bindingMobile"
                      block
                      type="primary"
                      @click="handleBindMobile"
                  >
                    {{ t('info.select.bindMobile') }}
                  </n-button>
                </n-form-item>
              </n-form>
            </div>
          </n-card>
        </div>

        <!-- 步骤2: 身份选择和信息填写 -->
        <div v-else-if="currentStep === 2 || (!needsMobileBind && currentStep === 1)" key="step2" class="step-content">
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
                          clearable
                          style="width: 100%"
                          type="date"
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
                          clearable
                          style="width: 100%"
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
                      clearable
                      type="textarea"
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
                          clearable
                          style="width: 100%"
                          type="date"
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
                      clearable
                      type="textarea"
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
      </Transition>
    </div>

    <!-- 手机号绑定确认对话框（保留用于处理账号冲突） -->
  </div>
</template>

<script lang="ts" setup>
import {computed, h, onMounted, onUnmounted, reactive, ref, watch} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRouter} from 'vue-router'
import type {FormInst} from 'naive-ui'
import {
  NAlert,
  NButton,
  NCard,
  NDatePicker,
  NForm,
  NFormItem,
  NGrid,
  NGridItem,
  NInput,
  NInputNumber,
  NInputOtp,
  NRadio,
  NRadioGroup,
  NSelect,
  NSpace,
  NStep,
  NSteps,
  NThing,
  useDialog,
  useMessage
} from 'naive-ui'
import {LogOutOutline} from '@vicons/ionicons5'
import {useUserStore} from '@/store'
import * as AuthApi from '@/api/auth/auth'
import {getAcademicStatusOptions} from '@/enum/student'
import {getEducationOptions} from '@/enum/teacher'
import type {StudentAddDTO} from '@/types/student'
import type {TeacherAddDTO} from '@/types/teacher'
import type {SysUserBasicInfoVO} from '@/types/auth'
import AvatarDisplay from '@/components/common/AvatarDisplay.vue'
import Icon from '@/components/common/Icon.vue'

const {t, locale} = useI18n()
const router = useRouter()
const userStore = useUserStore()
const dialog = useDialog()
const message = useMessage()

const formRef = ref<FormInst | null>(null)
const submitting = ref(false)

// 流程步骤相关
const currentStep = ref(1)
const needsMobileBind = computed(() => !userStore.userInfo?.mobile)

// 手机号绑定相关
const mobileBindFormRef = ref<FormInst | null>(null)
const bindingMobile = ref(false)
const sendingCode = ref(false)
const countdown = ref(0)
const existingUserInfo = ref<SysUserBasicInfoVO | null>(null)
let countdownTimer: number | null = null

// n-input-otp 返回的是数组类型，但在提交时需要转换为字符串
const mobileBindForm = reactive({
  mobile: null as string | null,
  verificationCode: null as string[] | null
})

const mobileBindRules = computed(() => ({
  mobile: [
    {required: true, message: t('auth.phoneRequired'), trigger: 'blur'},
    {pattern: /^1[3-9]\d{9}$/, message: t('auth.phoneFormatError'), trigger: 'blur'}
  ],
  verificationCode: [
    {
      required: true,
      message: t('auth.verificationCodeRequired'),
      trigger: 'blur',
      validator: (_rule: any, value: any) => {
        const code = Array.isArray(value) ? value.join('') : value || ''
        if (!code || code.length === 0) {
          return new Error(t('auth.verificationCodeRequired'))
        }
        if (!/^\d{6}$/.test(code)) {
          return new Error(t('auth.verificationCodeFormatError'))
        }
        return true
      }
    }
  ]
}))

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

// 步骤状态
const stepStatus = computed(() => {
  if (needsMobileBind.value && currentStep.value === 1) {
    return 'process'
  }
  if (needsMobileBind.value && currentStep.value === 2) {
    return 'finish'
  }
  return 'process'
})

// 步骤切换动画名称（只允许前进）
const stepTransitionName = computed(() => 'step-slide-next')

// 进入下一步
const goToNextStep = () => {
  if (needsMobileBind.value) {
    currentStep.value = 2
  }
}

// 监听手机号绑定状态，自动进入下一步
watch(
    () => userStore.userInfo?.mobile,
    (mobile) => {
      if (mobile && needsMobileBind.value && currentStep.value === 1) {
        goToNextStep()
      }
    }
)

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

    const res = await AuthApi.selectIdentity(selectIdentityDTO).catch(() => null)

    if (res && res.success) {
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

// 监听路由变化，如果用户已经不需要填写信息且有手机号，重定向到主页
watch(
    () => [userStore.needsIdentityInfo, userStore.userInfo?.mobile],
    ([needsInfo, mobile]) => {
      if (!needsInfo && mobile && userStore.isLogin) {
        router.push('/dashboard')
      }
    }
)

// 发送验证码
const handleSendVerificationCode = async () => {
  if (!mobileBindForm.mobile || mobileBindForm.mobile.length !== 11) {
    return
  }

  sendingCode.value = true
  const sendCodeDTO = AuthApi.getDefaultSendVerificationCodeDTO()
  sendCodeDTO.mobile = mobileBindForm.mobile

  const res = await AuthApi.sendVerificationCode(sendCodeDTO).catch(() => null)
  sendingCode.value = false

  if (res && res.success) {
    message.success(t('auth.verificationCodeSentSuccess'))
    countdown.value = 60
    countdownTimer = window.setInterval(() => {
      countdown.value--
      if (countdown.value <= 0) {
        if (countdownTimer) {
          clearInterval(countdownTimer)
          countdownTimer = null
        }
      }
    }, 1000)
  }
}

// 绑定手机号
const handleBindMobile = async () => {
  if (!mobileBindFormRef.value) return

  mobileBindFormRef.value.validate(async (errors) => {
    if (errors) return

    bindingMobile.value = true

    // 检查手机号是否可用
    const checkRes = await AuthApi.checkMobile(mobileBindForm.mobile!).catch(() => null)

    if (!checkRes) {
      bindingMobile.value = false
      return
    }

    const bindResult = checkRes.data
    const isAvailable = checkRes.success && bindResult && bindResult.success

    if (!isAvailable && bindResult && bindResult.existingUserInfo) {
      // 手机号已被占用，保存用户信息并询问用户
      existingUserInfo.value = bindResult.existingUserInfo
      bindingMobile.value = false

      // 判断是否为同一账号
      const isSameAccount = existingUserInfo.value?.id === userStore.userInfo?.id

      dialog.warning({
        title: t('info.select.mobileAlreadyBound'),
        content: () => h('div', {class: 'existing-user-dialog-content'}, [
          h('p', {class: 'dialog-message'}, t('info.select.mobileAlreadyBoundMessage')),
          h('div', {class: 'user-info-card'}, [
            h(NThing, {
              class: 'user-info-item'
            }, {
              avatar: () => h(AvatarDisplay, {
                avatarSrc: existingUserInfo.value?.avatar,
                username: existingUserInfo.value?.username,
                nickName: existingUserInfo.value?.nickName,
                size: 'medium',
                round: true
              }),
              header: () => h('div', {class: 'user-info-header'}, [
                h('div', {class: 'user-name'}, existingUserInfo.value?.nickName || existingUserInfo.value?.username),
                h('div', {class: 'user-username'}, `@${existingUserInfo.value?.username}`)
              ]),
              description: () => h('div', {class: 'user-info-description'}, [
                h('div', {class: 'user-id'}, `${t('info.select.userId')}: ${existingUserInfo.value?.id}`),
                existingUserInfo.value?.createTime ? h('div', {class: 'user-create-time'}, `${t('info.select.createTime')}: ${existingUserInfo.value.createTime}`) : null
              ])
            })
          ]),
          // 如果不是同一账号，显示警告文字
          !isSameAccount ? h('p', {
            class: 'dialog-warning',
            style: {color: 'var(--error-color)', marginTop: '16px', fontWeight: 'bold'}
          }, t('info.select.accountDeleteWarning')) : null
        ]),
        positiveText: t('info.select.mergeAccount'),
        negativeText: t('info.select.overwriteBind'),
        onPositiveClick: async () => {
          // 合并账号：调用 bindMobileConfirm，如果是合并操作，返回true
          await performBindMobileConfirm(true)
        },
        onNegativeClick: async () => {
          // 覆盖绑定：调用 bindMobileConfirm，判断是否为同一账号
          await performBindMobileConfirm(false)
        }
      })
      return
    }

    // 手机号可用，直接绑定
    await performBindMobile()
  })
}

// 执行绑定手机号确认
const performBindMobileConfirm = async (isMerge: boolean = false) => {
  bindingMobile.value = true

  // 判断是否为同一账号
  // 如果 existingUserInfo.value?.id 等于 userStore.userInfo?.id，则为同一账号
  // 如果是合并操作，返回true而不是false
  const isSameAccount = isMerge ? true : (existingUserInfo.value?.id === userStore.userInfo?.id)

  const confirmDTO = AuthApi.getDefaultBindMobileConfirmDTO()
  confirmDTO.mobile = mobileBindForm.mobile
  confirmDTO.userId = userStore.userInfo?.id || null
  confirmDTO.isSameAccount = isSameAccount

  const res = await AuthApi.bindMobileConfirm(confirmDTO).catch(() => null)
  bindingMobile.value = false

  if (res && res.success) {
    // 如果是合并账号操作，显示提示并让用户重新登录
    if (isMerge) {
      dialog.warning({
        title: t('info.select.mergeAccountSuccess'),
        content: '',
        positiveText: t('auth.login'),
        onPositiveClick: () => {
          router.push('/login')
        }
      })
      return
    }

    message.success(t('info.select.bindMobileSuccess'))
    mobileBindForm.mobile = null
    mobileBindForm.verificationCode = null
    existingUserInfo.value = null
    await userStore.refreshUserInfo(true)
    // 绑定成功后自动进入下一步
    goToNextStep()
  }
}

// 执行绑定手机号
const performBindMobile = async () => {
  bindingMobile.value = true

  const bindDTO = AuthApi.getDefaultBindMobileDTO()
  bindDTO.mobile = mobileBindForm.mobile
  bindDTO.userId = userStore.userInfo?.id || null

  // n-input-otp 返回的是数组类型，需要转换为字符串
  const verificationCode = Array.isArray(mobileBindForm.verificationCode)
      ? mobileBindForm.verificationCode.join('')
      : mobileBindForm.verificationCode || ''
  bindDTO.verificationCode = verificationCode

  const res = await AuthApi.bindMobile(bindDTO).catch(() => null)
  bindingMobile.value = false

  if (res && res.success) {
    message.success(t('info.select.bindMobileSuccess'))
    mobileBindForm.mobile = null
    mobileBindForm.verificationCode = null
    existingUserInfo.value = null
    await userStore.refreshUserInfo(true)
    // 绑定成功后自动进入下一步
    goToNextStep()
  }
}

// 组件挂载时检查用户状态
onMounted(async () => {
  // 路由守卫已经处理了用户信息刷新，这里只检查状态
  // 如果用户已经不需要填写信息且有手机号，重定向到主页
  if (userStore.isLogin && !userStore.needsIdentityInfo && userStore.userInfo?.mobile) {
    router.push('/dashboard')
    return
  }

  // 如果用户未登录，重定向到登录页
  if (!userStore.isLogin) {
    router.push('/login')
    return
  }

  // 初始化步骤：如果不需要绑定手机号，直接进入第二步
  if (!needsMobileBind.value) {
    currentStep.value = 2
  }
})

// 组件卸载时清理定时器
onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
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
  background: color-mix(in srgb, var(--background-secondary-color) 95%, transparent);
  border: 1px solid color-mix(in srgb, var(--border-color) 20%, transparent);
  border-radius: 36px;
  padding: 24px 36px;
  box-shadow: 0 8px 32px 0 var(--shadow-secondary-color);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  transition: box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;
}

.header {
  text-align: center;
  margin-bottom: 32px;
  position: relative;

  .header-top {
    position: absolute;
    left: 0;
    top: 0;
  }

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

.flow-header {
  margin-bottom: 32px;
  padding-bottom: 20px;
  border-bottom: 1px solid color-mix(in srgb, var(--border-color) 20%, transparent);

  :deep(.n-steps) {
    .n-step-header {
      .n-step-header__title {
        font-size: 14px;
        font-weight: 500;
        color: var(--text-color);
      }

      .n-step-header__indicator {
        .n-step-header__indicator-wrapper {
          border-color: var(--border-color);
        }

        &.n-step-header__indicator--active {
          .n-step-header__indicator-wrapper {
            border-color: var(--primary-color);
            background-color: var(--primary-color);
          }
        }

        &.n-step-header__indicator--finish {
          .n-step-header__indicator-wrapper {
            border-color: var(--success-color);
            background-color: var(--success-color);
          }
        }
      }
    }
  }
}

// 步骤切换动画 - 前进（从右滑入）
.step-slide-next-enter-active,
.step-slide-next-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.step-slide-next-enter-from {
  opacity: 0;
  transform: translateX(30px) scale(0.95);
}

.step-slide-next-enter-to {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.step-slide-next-leave-from {
  opacity: 1;
  transform: translateX(0) scale(1);
}

.step-slide-next-leave-to {
  opacity: 0;
  transform: translateX(-30px) scale(0.95);
}

.step-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.mobile-bind-card {
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
}

.mobile-bind-form {
  margin-top: 24px;
}

.form-card {
  background: transparent;
  border: none;
  box-shadow: none;
  padding: 0;
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


.verification-code-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;

  :deep(.n-input-otp) {
    flex: 1;
  }
}
</style>

<style lang="scss">
@use '@/assets/styles/index.scss' as *;

.existing-user-dialog-content {
  .dialog-message {
    margin: 0 0 16px 0;
    color: var(--text-color);
    font-size: 14px;
    line-height: 1.6;
  }

  .user-info-card {
    margin-top: 16px;
    padding: 16px;
    background: var(--background-secondary-color);
    border-radius: 8px;
    border: 1px solid var(--border-color);

    .user-info-item {
      :deep(.n-thing) {
        .n-thing-main {
          .n-thing-header {
            .user-info-header {
              display: flex;
              flex-direction: column;
              gap: 4px;

              .user-name {
                font-size: 16px;
                font-weight: 600;
                color: var(--text-color);
              }

              .user-username {
                font-size: 14px;
                color: var(--text-secondary-color);
              }
            }
          }

          .n-thing-main__content {
            .user-info-description {
              display: flex;
              flex-direction: column;
              gap: 8px;
              margin-top: 12px;

              .user-id,
              .user-create-time {
                font-size: 13px;
                color: var(--text-secondary-color);
                line-height: 1.5;
              }
            }
          }
        }
      }
    }
  }
}
</style>

