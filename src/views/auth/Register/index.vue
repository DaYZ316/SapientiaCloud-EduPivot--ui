<template>
  <div class="register-card">
    <div class="register-card-header">
      <n-steps :current="currentStep" :status="stepStatus" size="small">
        <n-step :title="t('auth.registerSteps.step1.title')"/>
        <n-step :title="t('auth.registerSteps.step2.title')"/>
        <n-step :title="t('auth.registerSteps.step3.title')"/>
      </n-steps>
    </div>

    <!-- 步骤1: 基本信息 -->
    <Transition :name="stepTransitionName" mode="out-in">
      <div v-if="currentStep === 1" key="step1" class="step-content">
        <n-form
            ref="step1FormRef"
            :model="registerForm"
            :rules="step1Rules"
            :show-label="false"
            size="large"
        >
          <n-form-item path="username">
            <n-input
                v-model:value="registerForm.username"
                :placeholder="t('auth.username')"
                clearable
            />
          </n-form-item>
          <n-form-item path="password">
            <n-input
                v-model:value="registerForm.password"
                :placeholder="t('auth.password')"
                clearable
                show-password-on="click"
                type="password"
            />
          </n-form-item>
          <n-form-item path="confirmPassword">
            <n-input
                v-model:value="registerForm.confirmPassword"
                :placeholder="t('auth.confirmPassword')"
                clearable
                show-password-on="click"
                type="password"
                @keyup.enter="handleNextStep"
            />
          </n-form-item>
          <n-form-item>
            <n-button
                block
                class="register-button"
                size="large"
                type="primary"
                @click="handleNextStep"
            >
              {{ t('auth.registerSteps.nextStep') }}
            </n-button>
          </n-form-item>
        </n-form>
      </div>

      <!-- 步骤2: 详细信息 -->
      <div v-else-if="currentStep === 2" key="step2" class="step-content">
        <n-form
            ref="step2FormRef"
            :model="registerForm"
            :rules="step2Rules"
            :show-label="false"
            size="large"
        >
          <n-form-item path="nickName">
            <n-input
                v-model:value="registerForm.nickName"
                :placeholder="t('auth.nickName')"
                clearable
            />
          </n-form-item>
          <n-form-item>
            <n-space :size="12" style="width: 100%">
              <n-button
                  block
                  class="register-button-secondary"
                  size="large"
                  @click="handlePrevStep"
              >
                {{ t('auth.registerSteps.prevStep') }}
              </n-button>
              <n-button
                  block
                  class="register-button"
                  size="large"
                  type="primary"
                  @click="handleNextStep"
              >
                {{ t('auth.registerSteps.nextStep') }}
              </n-button>
            </n-space>
          </n-form-item>
        </n-form>
      </div>

      <!-- 步骤3: 绑定手机号 -->
      <div v-else-if="currentStep === 3" key="step3" class="step-content">
        <n-form
            ref="step3FormRef"
            :model="registerForm"
            :rules="step3Rules"
            :show-label="false"
            size="large"
        >
          <n-form-item path="mobile">
            <n-input
                v-model:value="registerForm.mobile"
                :placeholder="t('auth.phone')"
                clearable
                maxlength="11"
            />
          </n-form-item>
          <n-form-item path="verificationCode">
            <div class="verification-code-wrapper">
              <n-input-otp
                  v-model:value="registerForm.verificationCode"
                  :length="6"
                  size="large"
                  @keyup.enter="handleRegister"
              />
              <n-button
                  :disabled="countdown > 0 || !registerForm.mobile || registerForm.mobile.length !== 11"
                  :loading="sendingCode"
                  size="large"
                  @click="sendVerificationCode"
              >
                {{
                  countdown > 0 ? `${countdown}${t('auth.verificationCodeCountdown')}` : t('auth.sendVerificationCode')
                }}
              </n-button>
            </div>
          </n-form-item>
          <n-form-item>
            <n-space :size="12" style="width: 100%">
              <n-button
                  block
                  class="register-button-secondary"
                  size="large"
                  @click="handlePrevStep"
              >
                {{ t('auth.registerSteps.prevStep') }}
              </n-button>
              <n-button
                  :loading="loading"
                  block
                  class="register-button"
                  size="large"
                  type="primary"
                  @click="handleRegister"
              >
                {{ t('auth.registerButton') }}
              </n-button>
            </n-space>
          </n-form-item>
        </n-form>
      </div>
    </Transition>
  </div>
</template>

<script lang="ts" setup>
import {computed, onUnmounted, reactive, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import type {FormInst, FormRules} from 'naive-ui'
import {NButton, NForm, NFormItem, NInput, NInputOtp, NSpace, NStep, NSteps, useDialog} from 'naive-ui'
import {
  getDefaultSendVerificationCodeDTO,
  getDefaultSysUserRegisterDTO,
  register as registerApi,
  sendVerificationCode as sendVerificationCodeApi
} from '@/api/auth'
import type {SysUserRegisterDTO} from '@/types/auth'
import {getDiscreteApi} from '@/utils/naiveUIHelper'

const emit = defineEmits<{
  switchToLogin: []
}>()

const {t} = useI18n()
const message = getDiscreteApi().message
const dialog = useDialog()

const currentStep = ref(1)
const loading = ref(false)
const stepStatus = ref<'process' | 'finish' | 'error'>('process')
const sendingCode = ref(false)
const countdown = ref(0)
const stepDirection = ref<'next' | 'prev'>('next')
let countdownTimer: ReturnType<typeof setTimeout> | null = null

const stepTransitionName = computed(() => {
  return stepDirection.value === 'next' ? 'step-slide-next' : 'step-slide-prev'
})

const step1FormRef = ref<FormInst | null>(null)
const step2FormRef = ref<FormInst | null>(null)
const step3FormRef = ref<FormInst | null>(null)

interface RegisterForm extends Omit<SysUserRegisterDTO, 'verificationCode'> {
  verificationCode: string[] | null
}

const registerForm = reactive<RegisterForm>({
  ...getDefaultSysUserRegisterDTO(),
  verificationCode: null
})

const step1Rules: FormRules = {
  username: [
    {
      required: true,
      message: t('auth.usernameRequired'),
      trigger: ['input', 'blur']
    },
    {
      pattern: /^[a-zA-Z0-9]{4,20}$/,
      message: t('auth.usernameFormatError'),
      trigger: ['input', 'blur']
    }
  ],
  password: [
    {
      required: true,
      message: t('auth.passwordRequired'),
      trigger: ['input', 'blur']
    },
    {
      min: 6,
      max: 20,
      message: t('auth.passwordLengthError'),
      trigger: ['input', 'blur']
    }
  ],
  confirmPassword: [
    {
      required: true,
      message: t('auth.confirmPasswordRequired'),
      trigger: ['blur']
    },
    {
      validator: (_rule, value) => {
        if (value !== registerForm.password) {
          return new Error(t('auth.passwordMismatch'))
        }
        return true
      },
      trigger: ['input', 'blur']
    }
  ]
}

const step2Rules: FormRules = {
  nickName: [
    {
      required: true,
      message: t('auth.nickNameRequired'),
      trigger: ['input', 'blur']
    }
  ]
}

const step3Rules: FormRules = {
  mobile: [
    {
      required: true,
      message: t('auth.phoneRequired'),
      trigger: 'blur'
    },
    {
      pattern: /^1[3-9]\d{9}$/,
      message: t('auth.phoneFormatError'),
      trigger: 'blur'
    }
  ],
  verificationCode: [
    {
      required: true,
      message: t('auth.verificationCodeRequired'),
      trigger: 'blur',
      validator: (_rule, value) => {
        const code = Array.isArray(value) ? value.join('') : ''
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
}

const sendVerificationCode = async () => {
  if (!registerForm.mobile || registerForm.mobile.length !== 11 || sendingCode.value) {
    return
  }

  sendingCode.value = true

  const params = getDefaultSendVerificationCodeDTO()
  params.mobile = registerForm.mobile

  const result = await sendVerificationCodeApi(params).catch(() => null)

  if (result) {
    message.success(t('auth.verificationCodeSentSuccess'))
    startCountdown()
  }

  sendingCode.value = false
}

const startCountdown = () => {
  countdown.value = 60
  countdownTimer = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      if (countdownTimer) {
        clearInterval(countdownTimer)
        countdownTimer = null
      }
    }
  }, 1000)
}

const handleNextStep = async () => {
  if (currentStep.value === 1) {
    if (!step1FormRef.value) return
    const valid = await step1FormRef.value.validate().catch(() => false)
    if (!valid) {
      return
    }
    stepDirection.value = 'next'
    currentStep.value = 2
  } else if (currentStep.value === 2) {
    if (!step2FormRef.value) return
    const valid = await step2FormRef.value.validate().catch(() => false)
    if (!valid) {
      return
    }
    stepDirection.value = 'next'
    currentStep.value = 3
    stepStatus.value = 'finish'
  }
}

const handlePrevStep = () => {
  if (currentStep.value > 1) {
    stepDirection.value = 'prev'
    currentStep.value--
    if (currentStep.value < 3) {
      stepStatus.value = 'process'
    }
  }
}

const handleRegister = async () => {
  if (!step3FormRef.value || loading.value) return

  const valid = await step3FormRef.value.validate().catch(() => false)
  if (!valid) {
    return
  }

  loading.value = true

  const verificationCode = Array.isArray(registerForm.verificationCode)
      ? registerForm.verificationCode.join('')
      : ''

  const submitData: SysUserRegisterDTO = {
    ...registerForm,
    verificationCode
  }

  const res = await registerApi(submitData).catch(() => null)

  if (res && res.success && res.data === true) {
    message.success(t('auth.registerSuccess'))
    dialog.info({
      title: t('auth.registerSuccessTitle'),
      positiveText: t('common.confirm'),
      negativeText: t('common.cancel'),
      onPositiveClick: () => {
        emit('switchToLogin')
      }
    })
  }

  loading.value = false
}

onUnmounted(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
})
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>

