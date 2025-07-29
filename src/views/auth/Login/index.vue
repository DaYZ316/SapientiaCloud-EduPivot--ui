<template>
  <!-- 浅色主题显示云朵背景 -->
  <CloudBackground v-if="!themeStore.isDarkMode" />
  <!-- 暗色主题显示星空背景 -->
  <GalaxyBackground v-if="themeStore.isDarkMode" />

  <!-- 登录页面内容 -->
  <div class="login-page">
    <!-- 主内容区域 -->
    <main class="main-content">
      <!-- 项目名称 -->
      <div class="project-name">
        <h1 class="project-title">{{ $t('app.name') }}</h1>
      </div>

      <!-- 登录卡片 -->
      <div class="login-card gradient-border">
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
                  <Icon :component="PersonOutline" color="white" />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>

          <n-form-item path="password" :show-label="false">
            <n-input v-model:value="loginForm.password" type="password" :placeholder="$t('auth.password')"
              show-password-on="click" clearable>
              <template #prefix>
                <n-icon>
                  <Icon :component="LockClosedOutline" color="white" />
                </n-icon>
              </template>
            </n-input>
          </n-form-item>

          <!-- 记住我和忘记密码 -->
          <div class="form-options">
            <n-checkbox v-model:checked="rememberMe">
              {{ $t('auth.rememberMe') }}
            </n-checkbox>
            <n-button text class="text-type">
              {{ $t('auth.forgotPassword') }}
            </n-button>
          </div>

          <!-- 登录按钮 -->
          <n-button type="primary" size="large" class="primary-type" :loading="loading" @click="handleLogin">
            {{ loading ? $t('auth.loginInProgress') : $t('auth.login') }}
          </n-button>
        </n-form>

        <!-- 注册链接 -->
        <div class="register-section">
          <span>{{ $t('auth.noAccount') }}</span>
          <n-button text class="text-type">
            {{ $t('auth.register') }}
          </n-button>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useMessage, type FormInst, type FormRules } from 'naive-ui'
import CloudBackground from '@/components/background/CloudBackground.vue'
import GalaxyBackground from '@/components/background/GalaxyBackground.vue'
import Icon from '@/components/common/Icon.vue'
import { PersonOutline, LockClosedOutline } from '@vicons/ionicons5'
import { useThemeStore, useUserStore } from '@/store'
import { getDefaultSysUserLoginDTO } from '@/api/auth'
import type { SysUserLoginDTO } from '@/types/auth'

// 获取必要的实例
const themeStore = useThemeStore()
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

// 表单验证规则
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
      await router.push('/dashboard')
    } else {
      message.error(t('auth.loginFail'))
    }
  } catch (error: any) {
    console.error('Login error:', error)
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