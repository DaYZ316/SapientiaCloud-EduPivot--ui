<template>
  <div class="login-card">
    <div class="login-card-header">
      <n-button-group size="large">
        <n-button
            :type="loginType === 'password' ? 'primary' : 'default'"
            @click="loginType = 'password'; handleLoginTypeChange('password')"
        >
          {{ t('auth.passwordLogin') }}
        </n-button>
        <n-button
            :type="loginType === 'verification' ? 'primary' : 'default'"
            @click="loginType = 'verification'; handleLoginTypeChange('verification')"
        >
          {{ t('auth.verificationCodeLogin') }}
        </n-button>
      </n-button-group>
    </div>
    <!-- 密码登录表单 -->
    <n-form
        v-if="loginType === 'password'"
        ref="passwordFormRef"
        :model="passwordForm"
        :rules="passwordRules"
        :show-label="false"
        size="large"
    >
      <n-form-item path="username">
        <n-input
            v-model:value="passwordForm.username"
            :placeholder="t('auth.username')"
            clearable
        />
      </n-form-item>
      <n-form-item path="password">
        <n-input
            v-model:value="passwordForm.password"
            :placeholder="t('auth.password')"
            clearable
            show-password-on="click"
            type="password"
            @keyup.enter="handlePasswordLogin"
        />
      </n-form-item>
      <n-form-item>
        <div class="login-options">
          <n-checkbox v-model:checked="rememberMe">
            {{ t('auth.rememberMe') }}
          </n-checkbox>
          <n-button text type="primary">
            {{ t('auth.forgotPassword') }}
          </n-button>
        </div>
      </n-form-item>
      <n-form-item>
        <n-button
            :loading="loading"
            block
            class="login-button"
            size="large"
            type="primary"
            @click="handlePasswordLogin"
        >
          {{ t('auth.login') }}
        </n-button>
      </n-form-item>
      <n-form-item>
        <div class="social-login-divider">
          <span class="divider-line"></span>
          <span class="divider-text">{{ t('auth.orLoginWith') }}</span>
          <span class="divider-line"></span>
        </div>
      </n-form-item>
      <n-form-item>
        <n-button
            :disabled="loading"
            block
            class="github-login-button"
            size="large"
            @click="handleGithubLogin"
        >
          <template #icon>
            <n-icon>
              <Icon :component="LogoGithub"/>
            </n-icon>
          </template>
          {{ t('auth.githubLogin') }}
        </n-button>
      </n-form-item>
    </n-form>
    <!-- 验证码登录表单 -->
    <n-form
        v-else
        ref="verificationFormRef"
        :model="verificationForm"
        :rules="verificationRules"
        :show-label="false"
        size="large"
    >
      <n-form-item path="mobile">
        <n-input
            v-model:value="verificationForm.mobile"
            :placeholder="t('auth.phone')"
            clearable
            maxlength="11"
        />
      </n-form-item>
      <n-form-item path="verificationCode">
        <div class="verification-code-wrapper">
          <n-input-otp
              v-model:value="verificationForm.verificationCode"
              :length="6"
              size="large"
              @keyup.enter="handleVerificationLogin"
          />
          <n-button
              :disabled="countdown > 0 || !verificationForm.mobile || verificationForm.mobile.length !== 11"
              :loading="sendingCode"
              size="large"
              @click="sendVerificationCode"
          >
            {{ countdown > 0 ? `${countdown}${t('auth.verificationCodeCountdown')}` : t('auth.sendVerificationCode') }}
          </n-button>
        </div>
      </n-form-item>
      <n-form-item>
        <div class="login-options">
          <n-checkbox v-model:checked="rememberMe">
            {{ t('auth.rememberMe') }}
          </n-checkbox>
          <n-button text type="primary">
            {{ t('auth.forgotPassword') }}
          </n-button>
        </div>
      </n-form-item>
      <n-form-item>
        <n-button
            :loading="loading"
            block
            class="login-button"
            size="large"
            type="primary"
            @click="handleVerificationLogin"
        >
          {{ t('auth.login') }}
        </n-button>
      </n-form-item>
      <n-form-item>
        <div class="social-login-divider">
          <span class="divider-line"></span>
          <span class="divider-text">{{ t('auth.orLoginWith') }}</span>
          <span class="divider-line"></span>
        </div>
      </n-form-item>
      <n-form-item>
        <n-button
            :disabled="loading"
            block
            class="github-login-button"
            size="large"
            @click="handleGithubLogin"
        >
          <template #icon>
            <n-icon>
              <Icon :component="LogoGithub"/>
            </n-icon>
          </template>
          {{ t('auth.githubLogin') }}
        </n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
import {onUnmounted, reactive, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRouter} from 'vue-router'
import {type FormInst, type FormRules, useMessage} from 'naive-ui'
import Icon from '@/components/common/Icon.vue'
import {LogoGithub} from '@vicons/ionicons5'
import {useUserStore} from '@/store'
import {
  getDefaultSendVerificationCodeDTO,
  getDefaultSysUserLoginDTO,
  getDefaultSysUserMobileLoginDTO,
  sendVerificationCode as sendVerificationCodeAPI
} from '@/api/auth'
import type {SysUserLoginDTO, SysUserMobileLoginDTO} from '@/types/auth'
import {defaultServerConfig, getApiBaseUrl} from '@/config/server'

// 定义事件
defineEmits<{
  switchToRegister: []
}>()

// 获取必要的实例
const userStore = useUserStore()
const router = useRouter()
const message = useMessage()
const {t} = useI18n()

// 登录方式
const loginType = ref<'password' | 'verification'>('password')

// 表单引用和状态
const passwordFormRef = ref<FormInst | null>(null)
const verificationFormRef = ref<FormInst | null>(null)
const loading = ref(false)
const sendingCode = ref(false)
const rememberMe = ref(false)
const countdown = ref(0)
let countdownTimer: ReturnType<typeof setTimeout> | null = null

// 密码登录表单数据
const passwordForm = reactive<SysUserLoginDTO>(getDefaultSysUserLoginDTO())

// 验证码登录表单数据
// n-input-otp 返回的是数组类型，但在提交时需要转换为字符串
interface VerificationForm extends Omit<SysUserMobileLoginDTO, 'verificationCode'> {
  verificationCode: string | string[] | null
}

const verificationForm = reactive<VerificationForm>({
  ...getDefaultSysUserMobileLoginDTO(),
  verificationCode: null
})

// 密码登录表单验证规则
const passwordRules: FormRules = {
  username: [
    {
      required: true,
      message: t('auth.usernameRequired'),
      trigger: ['input', 'blur']
    }
  ],
  password: [
    {
      required: true,
      message: t('auth.passwordRequired'),
      trigger: ['input', 'blur']
    }
  ]
}

// 验证码登录表单验证规则
const verificationRules: FormRules = {
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
}

// 发送验证码
const sendVerificationCode = async () => {
  if (!verificationForm.mobile || verificationForm.mobile.length !== 11 || sendingCode.value) {
    return
  }

  sendingCode.value = true

  const params = getDefaultSendVerificationCodeDTO()
  params.mobile = verificationForm.mobile

  const result = await sendVerificationCodeAPI(params).catch(() => null)

  if (result) {
    message.success(t('auth.verificationCodeSentSuccess'))
    startCountdown()
  }

  sendingCode.value = false
}

// 开始倒计时
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

// 处理密码登录
const handlePasswordLogin = async () => {
  if (!passwordFormRef.value || loading.value) return

  const valid = await passwordFormRef.value.validate().catch(() => false)
  if (!valid) {
    return
  }

  if (loading.value) return

  loading.value = true

  const success = await userStore.login(
      passwordForm.username || '',
      passwordForm.password || ''
  ).catch(() => false)

  if (success) {
    if (rememberMe.value) {
      localStorage.setItem('rememberedUsername', passwordForm.username || '')
    } else {
      localStorage.removeItem('rememberedUsername')
    }

    message.success(t('auth.loginSuccess'))
    router.push('/dashboard')
  }

  loading.value = false
}

// 处理验证码登录
const handleVerificationLogin = async () => {
  if (!verificationFormRef.value || loading.value) return

  const valid = await verificationFormRef.value.validate().catch(() => false)
  if (!valid) {
    return
  }

  if (loading.value) return

  loading.value = true

  const verificationCode = Array.isArray(verificationForm.verificationCode)
      ? verificationForm.verificationCode.join('')
      : verificationForm.verificationCode || ''

  const success = await userStore.loginWithVerificationCode(
      verificationForm.mobile || '',
      verificationCode
  ).catch(() => false)

  if (success) {
    if (rememberMe.value) {
      localStorage.setItem('rememberedPhone', verificationForm.mobile || '')
    } else {
      localStorage.removeItem('rememberedPhone')
    }

    message.success(t('auth.verificationCodeLoginSuccess'))
    router.push('/dashboard')
  }

  loading.value = false
}

// 初始化记住的用户名
const initRememberedUsername = () => {
  const rememberedUsername = localStorage.getItem('rememberedUsername')
  if (rememberedUsername) {
    passwordForm.username = rememberedUsername
    rememberMe.value = true
  }
}

// 初始化记住的手机号
const initRememberedPhone = () => {
  const rememberedPhone = localStorage.getItem('rememberedPhone')
  if (rememberedPhone) {
    verificationForm.mobile = rememberedPhone
    rememberMe.value = true
  }
}

// 监听登录方式切换
const handleLoginTypeChange = (value: 'password' | 'verification') => {
  if (value === 'password') {
    initRememberedUsername()
  } else {
    initRememberedPhone()
  }
}

// 处理GitHub登录
const handleGithubLogin = () => {
  const baseUrl = import.meta.env.DEV ? '/api' : getApiBaseUrl(defaultServerConfig)
  window.location.href = `${baseUrl}/auth/oauth2/authorize/github`
}

// 组件挂载时初始化
initRememberedUsername()

// 组件卸载时清理定时器
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
