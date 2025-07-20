<template>
  <div class="login-container">
    <cloud-background v-if="!isDarkMode" />
    <galaxy-background v-else />
    <n-card class="login-card" :title="$t('app.name')" bordered>
      <n-form
        ref="formRef"
        label-placement="left"
        :model="formValue"
        :rules="rules"
        size="large"
      >
        <n-form-item :path="'username'" :label="$t('auth.username')">
          <n-input
            v-model:value="formValue.username"
            :placeholder="$t('auth.username')"
            @keyup.enter="handleSubmit"
          >
            <template #prefix>
              <n-icon><person-outline /></n-icon>
            </template>
          </n-input>
        </n-form-item>
        <n-form-item :path="'password'" :label="$t('auth.password')">
          <n-input
            v-model:value="formValue.password"
            type="password"
            :placeholder="$t('auth.password')"
            show-password-on="click"
            @keyup.enter="handleSubmit"
          >
            <template #prefix>
              <n-icon><lock-closed-outline /></n-icon>
            </template>
          </n-input>
        </n-form-item>
        <div class="login-options">
          <n-checkbox v-model:checked="rememberMe">{{ $t('auth.rememberMe') }}</n-checkbox>
          <a href="#" @click.prevent="handleForgetPassword">{{ $t('auth.forgotPassword') }}</a>
        </div>
        <n-button
          type="primary"
          size="large"
          block
          :loading="loading"
          @click="handleSubmit"
        >
          {{ $t('auth.login') }}
        </n-button>
        <div class="login-footer">
          <span>{{ $t('auth.noAccount') }}</span>
          <a href="#" @click.prevent="handleRegister">{{ $t('auth.register') }}</a>
        </div>
      </n-form>
      
      <div class="language-switch-container">
        <language-switch />
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMessage } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import {
  PersonOutline, LockClosedOutline
} from '@vicons/ionicons5'
import { useUserStore } from '@/store'
import { useThemeStore } from '@/store/modules/theme'
import LanguageSwitch from '@/components/common/LanguageSwitch.vue'
import CloudBackground from '@/components/common/CloudBackground.vue'
import GalaxyBackground from '@/components/common/GalaxyBackground.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const themeStore = useThemeStore()
const message = useMessage()
const { t } = useI18n()

// 获取当前主题模式
const isDarkMode = computed(() => themeStore.isDarkMode)

// 表单引用
const formRef = ref(null)

// 加载状态
const loading = ref(false)

// 记住我
const rememberMe = ref(false)

// 表单值
const formValue = reactive({
  username: '',
  password: ''
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: t('auth.usernameRequired'), trigger: ['blur', 'input'] }
  ],
  password: [
    { required: true, message: t('auth.passwordRequired'), trigger: ['blur', 'input'] }
  ]
}

// 登录处理
const handleSubmit = async () => {
  if (loading.value) return
  
  try {
    loading.value = true
    
    // 调用登录接口
    const success = await userStore.login(formValue.username, formValue.password)
    
    if (success) {
      message.success(t('auth.loginSuccess'))
      
      // 如果存在重定向，则跳转到该页面，否则跳转到首页
      const redirectPath = route.query.redirect as string
      router.replace(redirectPath || '/dashboard')
    }
    // 错误已经在HTTP模块中处理，不需要在这里重复处理
  } catch (error) {
    // 只处理未被HTTP模块捕获的错误
    message.error(t('auth.tryAgainLater'))
  } finally {
    loading.value = false
  }
}

// 注册处理
const handleRegister = () => {
  router.push('/register')
}

// 忘记密码处理
const handleForgetPassword = () => {
  message.info(t('auth.contactAdmin'))
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as vars;

.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  position: relative;
}

.login-card {
  width: 420px;
  max-width: 100%;
  padding: 16px;
  border-radius: 8px;
  background-color: var(--card-color);
  backdrop-filter: blur(8px);
  box-shadow: var(--box-shadow-card);
  position: relative;
  z-index: 1;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  
  a {
    color: var(--primary-color);
  }
}

.login-footer {
  margin-top: 24px;
  text-align: center;
  
  a {
    color: var(--primary-color);
    margin-left: 8px;
  }
}

.language-switch-container {
  position: absolute;
  top: 16px;
  right: 16px;
}
</style> 