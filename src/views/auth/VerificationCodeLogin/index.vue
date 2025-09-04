<template>
  <!-- 验证码登录卡片 -->
  <div class="verification-login-card">
    <!-- 登录标题 -->
    <div class="brand-section">
      <h1 class="brand-title">{{ $t('auth.verificationCodeLogin') }}</h1>
    </div>

    <!-- 验证码登录表单 -->
    <n-form ref="formRef" :model="loginForm" :rules="rules" class="login-form" size="large"
            @keyup.enter="handleLogin">
      <n-form-item :show-label="false" path="mobile">
        <n-input v-model:value="loginForm.mobile" :placeholder="$t('auth.phone')"
                 clearable maxlength="11">
          <template #prefix>
            <n-icon>
              <Icon :component="CallOutline"/>
            </n-icon>
          </template>
        </n-input>
      </n-form-item>

      <n-form-item :show-label="false" path="verificationCode">
        <div class="verification-code-input">
          <n-input v-model:value="loginForm.verificationCode" :placeholder="$t('auth.verificationCode')"
                   clearable maxlength="6">
            <template #prefix>
              <n-icon>
                <Icon :component="ShieldCheckmarkOutline"/>
              </n-icon>
            </template>
          </n-input>
          <n-button
              :disabled="countdown > 0 || !loginForm.mobile || loginForm.mobile.length !== 11"
              :loading="sendingCode"
              size="large"
              @click="sendVerificationCode"
          >
            {{ countdown > 0 ? `${countdown}s` : $t('auth.sendVerificationCode') }}
          </n-button>
        </div>
      </n-form-item>

      <!-- 记住我和忘记密码 -->
      <div class="form-options">
        <n-checkbox v-model:checked="rememberMe">
          {{ $t('auth.rememberMe') }}
        </n-checkbox>
        <n-button text>
          {{ $t('auth.forgotPassword') }}
        </n-button>
      </div>

      <!-- 登录按钮 -->
      <n-button :loading="loading" size="large" style="width: 100%;" type="primary" @click="handleLogin">
        {{ loading ? $t('auth.loginInProgress') : $t('auth.login') }}
      </n-button>
    </n-form>

    <!-- 注册链接 -->
    <div class="register-section">
      <span>{{ $t('auth.noAccount') }}</span>
      <n-button text @click="$emit('switchToRegister')">
        {{ $t('auth.register') }}
      </n-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {onUnmounted, reactive, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useRouter} from 'vue-router'
import {type FormInst, type FormRules, useMessage} from 'naive-ui'
import Icon from '@/components/common/Icon.vue'
import {CallOutline, ShieldCheckmarkOutline} from '@vicons/ionicons5'
import {useUserStore} from '@/store'
import {getDefaultSysUserMobileLoginDTO} from '@/api/auth'
import type {SysUserMobileLoginDTO} from '@/types/auth'

// 定义事件
defineEmits<{
  switchToRegister: []
}>()

// 获取必要的实例
const userStore = useUserStore()
const router = useRouter()
const message = useMessage()
const {t} = useI18n()

// 表单引用和状态
const formRef = ref<FormInst | null>(null)
const loading = ref(false)
const sendingCode = ref(false)
const rememberMe = ref(false)
const countdown = ref(0)
let countdownTimer: NodeJS.Timeout | null = null

// 登录表单数据
const loginForm = reactive<SysUserMobileLoginDTO>(getDefaultSysUserMobileLoginDTO())

// 登录表单验证规则
const rules: FormRules = {
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
      trigger: 'blur'
    },
    {
      pattern: /^\d{6}$/,
      message: t('auth.verificationCodeFormatError'),
      trigger: 'blur'
    }
  ]
}

// 发送验证码
const sendVerificationCode = async () => {
  if (!loginForm.mobile || loginForm.mobile.length !== 11) {
    message.warning(t('auth.pleaseEnterPhoneFirst'))
    return
  }

  try {
    sendingCode.value = true
    // TODO: 调用发送验证码API
    // await sendVerificationCodeAPI(loginForm.phone)

    message.success(t('auth.verificationCodeSentSuccess'))
    startCountdown()
  } catch (error: any) {
    message.error(error?.message || t('auth.sendVerificationCodeFailed'))
  } finally {
    sendingCode.value = false
  }
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

// 处理登录
const handleLogin = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    // 调用验证码登录API
    const success = await userStore.loginWithVerificationCode(
        loginForm.mobile || '',
        loginForm.verificationCode || ''
    )

    if (success) {
      // 记住我功能
      if (rememberMe.value) {
        localStorage.setItem('rememberedPhone', loginForm.mobile || '')
      } else {
        localStorage.removeItem('rememberedPhone')
      }

      message.success(t('auth.verificationCodeLoginSuccess'))
      // 跳转到首页
      router.push('/dashboard')
    } else {
      message.error(t('auth.verificationCodeLoginFailed'))
    }
  } catch (error: any) {
    message.error(error?.message || t('auth.verificationCodeLoginFailed'))
  } finally {
    loading.value = false
  }
}

// 初始化记住的手机号
const initRememberedPhone = () => {
  const rememberedPhone = localStorage.getItem('rememberedPhone')
  if (rememberedPhone) {
    loginForm.mobile = rememberedPhone
    rememberMe.value = true
  }
}

// 组件挂载时初始化
initRememberedPhone()

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
