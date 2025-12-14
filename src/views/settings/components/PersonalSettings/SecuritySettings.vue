<template>
  <n-space vertical>
    <n-card :bordered="false" class="password-card" size="small">
      <template #header>
        <div class="flex-between">
          <span>{{ t('settings.personal.changePassword') }}</span>
          <n-button text type="primary" @click="showPasswordModal = true">
            {{ t('settings.personal.modify') }}
          </n-button>
        </div>
      </template>
      <div>{{ t('settings.personal.passwordDesc') }}</div>
    </n-card>

    <n-card :bordered="false" class="password-card" size="small">
      <template #header>
        <div class="flex-between">
          <span>{{ t('settings.personal.changePasswordByCode') }}</span>
          <n-button text type="primary" @click="showMobilePasswordModal = true">
            {{ t('settings.personal.modify') }}
          </n-button>
        </div>
      </template>
      <div>{{ t('settings.personal.passwordByCodeDesc') }}</div>
    </n-card>

    <n-card :bordered="false" class="security-card" size="small">
      <template #header>
        <div class="flex-between">
          <span>{{ t('settings.personal.accountStatus') }}</span>
          <n-tag :type="userInfo?.status === 0 ? 'success' : 'error'">
            {{
              userInfo?.status === 0 ? t('settings.personal.statusNormal') : t('settings.personal.statusDisabled')
            }}
          </n-tag>
        </div>
      </template>
      <div>{{ t('settings.personal.accountStatusDesc') }}</div>
    </n-card>

    <!-- 修改密码的弹?-->
    <n-modal v-model:show="showPasswordModal" :title="t('settings.personal.changePassword')" preset="card"
             style="width: 500px;">
      <n-form
          ref="passwordFormRef"
          :model="passwordForm"
          :rules="passwordRules"
          label-placement="left"
          label-width="140"
      >
        <n-form-item :label="t('settings.personal.currentPassword')" path="currentPassword">
          <n-input
              v-model:value="passwordForm.currentPassword"
              :placeholder="t('settings.personal.currentPasswordPlaceholder')"
              show-password-on="click"
              type="password"
          />
        </n-form-item>
        <n-form-item :label="t('settings.personal.newPassword')" path="newPassword">
          <n-input
              v-model:value="passwordForm.newPassword"
              :placeholder="t('settings.personal.newPasswordPlaceholder')"
              show-password-on="click"
              type="password"
          />
        </n-form-item>
        <n-form-item :label="t('settings.personal.confirmPassword')" path="confirmPassword">
          <n-input
              v-model:value="passwordForm.confirmPassword"
              :placeholder="t('settings.personal.confirmPasswordPlaceholder')"
              show-password-on="click"
              type="password"
          />
        </n-form-item>
        <div class="flex-center mt-4">
          <n-space>
            <n-button type="primary" @click="changePassword">
              {{ t('common.confirm') }}
            </n-button>
            <n-button @click="showPasswordModal = false">
              {{ t('common.cancel') }}
            </n-button>
          </n-space>
        </div>
      </n-form>
    </n-modal>

    <!-- 验证码修改密码的弹?-->
    <n-modal v-model:show="showMobilePasswordModal" :title="t('settings.personal.changePasswordByCode')"
             preset="card" style="width: 600px;">
      <n-form
          ref="mobilePasswordFormRef"
          :model="mobilePasswordForm"
          :rules="mobilePasswordRules"
          label-placement="left"
          label-width="140"
      >
        <n-form-item :label="t('settings.personal.phone')" path="mobile">
          <n-input
              v-model:value="mobilePasswordForm.mobile"
              :placeholder="t('settings.personal.phonePlaceholder')"
              maxlength="11"
          />
        </n-form-item>
        <n-form-item :label="t('settings.personal.verificationCode')" path="verificationCode">
          <div class="verification-code-wrapper">
            <n-input-otp
                v-model:value="mobilePasswordForm.verificationCode"
                :length="6"
            />
            <n-button
                :disabled="countdown > 0 || !mobilePasswordForm.mobile || mobilePasswordForm.mobile.length !== 11"
                :loading="sendingCode"
                @click="sendVerificationCode"
            >
              {{
                countdown > 0
                    ? `${countdown}${t('auth.verificationCodeCountdown')}`
                    : t('auth.sendVerificationCode')
              }}
            </n-button>
          </div>
        </n-form-item>
        <n-form-item :label="t('settings.personal.newPassword')" path="newPassword">
          <n-input
              v-model:value="mobilePasswordForm.newPassword"
              :placeholder="t('settings.personal.newPasswordPlaceholder')"
              show-password-on="click"
              type="password"
          />
        </n-form-item>
        <n-form-item :label="t('settings.personal.confirmPassword')" path="confirmPassword">
          <n-input
              v-model:value="mobilePasswordForm.confirmPassword"
              :placeholder="t('settings.personal.confirmPasswordPlaceholder')"
              show-password-on="click"
              type="password"
          />
        </n-form-item>
        <div class="flex-center mt-4">
          <n-space>
            <n-button type="primary" @click="changePasswordByMobile">
              {{ t('common.confirm') }}
            </n-button>
            <n-button @click="showMobilePasswordModal = false">
              {{ t('common.cancel') }}
            </n-button>
          </n-space>
        </div>
      </n-form>
    </n-modal>
  </n-space>
</template>

<script lang="ts" setup>
import {computed, onBeforeUnmount, reactive, ref, watch} from 'vue'
import type {FormInst, FormRules} from 'naive-ui'
import {useUserStore} from '@/store'
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {
  getDefaultSendVerificationCodeDTO,
  getDefaultSysUserMobilePasswordDTO,
  getDefaultSysUserPasswordDTO,
  logout,
  sendVerificationCode as sendVerificationCodeAPI,
  updatePassword,
  updatePasswordByMobile
} from '@/api/auth/auth'
import {getDiscreteApi} from '@/utils/naiveUIHelper'
import type {SendVerificationCodeDTO, SysUserMobilePasswordDTO, SysUserPasswordDTO} from '@/types/auth/auth'

const userStore = useUserStore()
const router = useRouter()
const {dialog, message} = getDiscreteApi()
const {t} = useI18n()
const passwordFormRef = ref<FormInst | null>(null)
const mobilePasswordFormRef = ref<FormInst | null>(null)
const showPasswordModal = ref(false)
const showMobilePasswordModal = ref(false)
const countdown = ref(0)
const sendingCode = ref(false)
let countdownTimer: ReturnType<typeof setInterval> | null = null

// 使用计算属性获取用户信?
const userInfo = computed(() => userStore.userInfo)

// 修改密码表单
const passwordForm = reactive<SysUserPasswordDTO>(getDefaultSysUserPasswordDTO())

// 验证码修改密码表单
const mobilePasswordForm = reactive<SysUserMobilePasswordDTO>(getDefaultSysUserMobilePasswordDTO())

// 密码表单验证规则
const passwordRules: FormRules = {
  currentPassword: [
    {required: true, message: t('settings.personal.currentPasswordRequired'), trigger: 'blur'}
  ],
  newPassword: [
    {required: true, message: t('settings.personal.newPasswordRequired'), trigger: 'blur'},
    {min: 6, message: t('settings.personal.passwordLengthInvalid'), trigger: 'blur'}
  ],
  confirmPassword: [
    {required: true, message: t('settings.personal.confirmPasswordRequired'), trigger: 'blur'},
    {
      validator: (_: any, value: any) => value === passwordForm.newPassword,
      message: t('settings.personal.passwordsNotMatch'),
      trigger: 'blur'
    }
  ]
}

// 验证码修改密码表单验证规则
const mobilePasswordRules: FormRules = {
  mobile: [
    {required: true, message: t('settings.personal.phoneRequired'), trigger: 'blur'},
    {pattern: /^1[3-9]\d{9}$/, message: t('settings.personal.phoneInvalid'), trigger: 'blur'}
  ],
  verificationCode: [
    {
      required: true,
      message: t('settings.personal.verificationCodeRequired'),
      trigger: 'blur',
      validator: (_: any, value: any) => {
        const code = Array.isArray(value) ? value.join('') : value || ''
        if (!code || code.length === 0) {
          return new Error(t('settings.personal.verificationCodeRequired'))
        }
        if (!/^\d{6}$/.test(code)) {
          return new Error(t('settings.personal.verificationCodeFormatError'))
        }
        return true
      }
    }
  ],
  newPassword: [
    {required: true, message: t('settings.personal.newPasswordRequired'), trigger: 'blur'},
    {min: 6, message: t('settings.personal.passwordLengthInvalid'), trigger: 'blur'}
  ],
  confirmPassword: [
    {required: true, message: t('settings.personal.confirmPasswordRequired'), trigger: 'blur'},
    {
      validator: (_: any, value: any) => value === mobilePasswordForm.newPassword,
      message: t('settings.personal.passwordsNotMatch'),
      trigger: 'blur'
    }
  ]
}

// 重置密码表单
const resetPasswordForm = () => {
  passwordForm.currentPassword = null
  passwordForm.newPassword = null
  passwordForm.confirmPassword = null
  if (passwordFormRef.value) {
    passwordFormRef.value.restoreValidation()
  }
}

// 重置验证码修改密码表单
const resetMobilePasswordForm = () => {
  mobilePasswordForm.mobile = null
  mobilePasswordForm.verificationCode = null
  mobilePasswordForm.newPassword = null
  mobilePasswordForm.confirmPassword = null
  if (mobilePasswordFormRef.value) {
    mobilePasswordFormRef.value.restoreValidation()
  }
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
    countdown.value = 0
  }
}

// 监听对话框关闭事?
watch(showPasswordModal, (newVal: boolean) => {
  if (!newVal) {
    // 当对话框关闭时重置表?
    resetPasswordForm()
  }
})

watch(showMobilePasswordModal, (newVal: boolean) => {
  if (!newVal) {
    // 当对话框关闭时重置表单
    resetMobilePasswordForm()
  } else {
    // 打开对话框时，自动填充当前用户的手机号
    if (userInfo.value?.mobile) {
      mobilePasswordForm.mobile = userInfo.value.mobile
    }
  }
})

// 发送验证码
const sendVerificationCode = async () => {
  if (!mobilePasswordForm.mobile || mobilePasswordForm.mobile.length !== 11 || sendingCode.value) {
    return
  }

  sendingCode.value = true

  const params: SendVerificationCodeDTO = getDefaultSendVerificationCodeDTO()
  params.mobile = mobilePasswordForm.mobile

  const result = await sendVerificationCodeAPI(params).catch(() => null)

  if (result && result.success) {
    message.success(t('auth.verificationCodeSentSuccess'))
    startCountdown()
  }

  sendingCode.value = false
}

// 开始倒计时
const startCountdown = () => {
  countdown.value = 60
  if (countdownTimer) {
    clearInterval(countdownTimer)
  }
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

// 修改密码
const changePassword = () => {
  passwordFormRef.value?.validate(async (errors: any) => {
    if (!errors) {
      const passwordData: SysUserPasswordDTO = {
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword,
        confirmPassword: passwordForm.confirmPassword
      }

      const res = await updatePassword(passwordData).catch(() => null)
      if (res && res.success && res.data) {
        showPasswordModal.value = false

        // 显示成功对话?
        dialog.success({
          title: t('settings.personal.passwordChangeSuccess'),
          content: t('settings.personal.passwordChangeRedirect'),
          positiveText: t('common.confirm'),
          onPositiveClick: async () => {
            await logout().catch(() => null)
            // 清除用户状?
            userStore.resetUserState()
            // 跳转到登录页
            router.push('/login')
          }
        })
      }
    }
  })
}

// 通过验证码修改密码
const changePasswordByMobile = () => {
  mobilePasswordFormRef.value?.validate(async (errors: any) => {
    if (!errors) {
      const code = Array.isArray(mobilePasswordForm.verificationCode)
          ? mobilePasswordForm.verificationCode.join('')
          : mobilePasswordForm.verificationCode || ''

      const passwordData: SysUserMobilePasswordDTO = {
        mobile: mobilePasswordForm.mobile,
        verificationCode: code,
        newPassword: mobilePasswordForm.newPassword,
        confirmPassword: mobilePasswordForm.confirmPassword
      }

      const res = await updatePasswordByMobile(passwordData).catch(() => null)
      if (res && res.success && res.data) {
        showMobilePasswordModal.value = false

        // 显示成功对话?
        dialog.success({
          title: t('settings.personal.passwordChangeSuccess'),
          content: t('settings.personal.passwordChangeRedirect'),
          positiveText: t('common.confirm'),
          onPositiveClick: async () => {
            await logout().catch(() => null)
            // 清除用户状?
            userStore.resetUserState()
            // 跳转到登录页
            router.push('/login')
          }
        })
      }
    }
  })
}

// 清理倒计时
onBeforeUnmount(() => {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
})
</script>

<style lang="scss" scoped>
@use './SecuritySettings.scss';
</style>
