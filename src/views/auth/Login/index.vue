<template>
  <!-- 登录卡片 -->
  <div class="login-card">
    <!-- 登录标题 -->
    <div class="brand-section">
      <h1 class="brand-title">{{ $t('auth.login') }}</h1>
    </div>

    <!-- 登录表单 -->
    <n-form ref="formRef" :model="loginForm" :rules="rules" class="login-form" size="large"
      @keyup.enter="handleLogin">
      <n-form-item path="username" :show-label="false">
        <n-input v-model:value="loginForm.username" :placeholder="$t('auth.username')"
          clearable>
          <template #prefix>
            <n-icon>
              <Icon :component="PersonOutline" />
            </n-icon>
          </template>
        </n-input>
      </n-form-item>

      <n-form-item path="password" :show-label="false">
        <n-input v-model:value="loginForm.password" type="password" :placeholder="$t('auth.password')"
          show-password-on="click" clearable>
          <template #prefix>
            <n-icon>
              <Icon :component="LockClosedOutline" />
            </n-icon>
          </template>
        </n-input>
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
      <n-button type="primary" size="large" :loading="loading" @click="handleLogin">
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
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useMessage, type FormInst, type FormRules } from 'naive-ui'
import Icon from '@/components/common/Icon.vue'
import { PersonOutline, LockClosedOutline } from '@vicons/ionicons5'
import { useUserStore } from '@/store'
import { getDefaultSysUserLoginDTO } from '@/api/auth'
import type { SysUserLoginDTO } from '@/types/auth'

// 定义事件
defineEmits<{
  switchToRegister: []
}>()

// 获取必要的实例
const userStore = useUserStore()
const router = useRouter()
const message = useMessage()
const { t } = useI18n()

// 表单引用和状态
const formRef = ref<FormInst | null>(null)
const loading = ref(false)
const rememberMe = ref(false)

// 登录表单数据
const loginForm = reactive<SysUserLoginDTO>(getDefaultSysUserLoginDTO())

// 登录表单验证规则
const rules: FormRules = {
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

// 处理登录
const handleLogin = async () => {
  if (!formRef.value) return

  try {
    await formRef.value.validate()
    loading.value = true

    const success = await userStore.login(
      loginForm.username || '',
      loginForm.password || ''
    )

    if (success) {
      // 记住我功能
      if (rememberMe.value) {
        localStorage.setItem('rememberedUsername', loginForm.username || '')
      } else {
        localStorage.removeItem('rememberedUsername')
      }

      message.success(t('auth.loginSuccess'))
      // 跳转到首页
      router.push('/dashboard')
    } else {
      message.error(t('auth.loginFail'))
    }
  } catch (error: any) {
    message.error(error?.message || t('auth.loginFail'))
  } finally {
    loading.value = false
  }
}

// 初始化记住的用户名
const initRememberedUsername = () => {
  const rememberedUsername = localStorage.getItem('rememberedUsername')
  if (rememberedUsername) {
    loginForm.username = rememberedUsername
    rememberMe.value = true
  }
}

// 组件挂载时初始化
initRememberedUsername()
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
