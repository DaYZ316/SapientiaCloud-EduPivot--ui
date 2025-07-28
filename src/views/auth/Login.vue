<template>
  <div class="login-container">
    <!-- 背景装饰 -->
    <div class="background-decoration">
      <div class="circle circle-1"></div>
      <div class="circle circle-2"></div>
      <div class="circle circle-3"></div>
    </div>

    <!-- 登录卡片 -->
    <div class="login-card">
      <!-- 头部标题 -->
      <div class="login-header">
        <div class="logo">
          <img alt="Vite" class="vite-logo" src="/vite.svg"/>
        </div>
        <h1 class="title">{{ t('auth.welcome') }}</h1>
        <p class="subtitle">{{ t('auth.loginToAccount') }}</p>
      </div>

      <!-- 登录表单 -->
      <n-form ref="formRef" :model="formValue" :rules="rules" class="login-form" size="large">
        <n-form-item :show-label="false" path="username">
          <n-input v-model:value="formValue.username" :disabled="loading" :placeholder="t('auth.username')" clearable>
            <template #prefix>
              <Icon>
                <PersonOutline/>
              </Icon>
            </template>
          </n-input>
        </n-form-item>

        <n-form-item :show-label="false" path="password">
          <n-input v-model:value="formValue.password" :disabled="loading" :placeholder="t('auth.password')"
                   clearable show-password-on="click" type="password" @keydown.enter="handleSubmit">
            <template #prefix>
              <Icon>
                <LockClosedOutline/>
              </Icon>
            </template>
          </n-input>
        </n-form-item>

        <!-- 记住我和忘记密码 -->
        <div class="form-options">
          <n-checkbox v-model:checked="rememberMe" :disabled="loading">
            {{ t('auth.rememberMe') }}
          </n-checkbox>
          <n-button :disabled="loading" text type="primary" @click="handleForgetPassword">
            {{ t('auth.forgetPassword') }}
          </n-button>
        </div>

        <!-- 登录按钮 -->
        <n-button :loading="loading" block class="login-button" size="large" type="primary" @click="handleSubmit">
          {{ loading ? t('auth.loginInProgress') : t('auth.login') }}
        </n-button>
      </n-form>

      <!-- 分割线 -->
      <n-divider class="divider">
        {{ t('auth.or') }}
      </n-divider>

      <!-- 注册链接 -->
      <div class="register-section">
        <span class="register-text">{{ t('auth.noAccount') }}</span>
        <n-button :disabled="loading" class="register-button" text type="primary" @click="handleRegister">
          {{ t('auth.register') }}
        </n-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {reactive, ref} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {useUserStore} from '@/store'
import {getDiscreteApi} from '@/utils/naiveUIHelper'
import {LockClosedOutline, PersonOutline} from '@vicons/ionicons5'
import Icon from '@/components/common/Icon.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()
const {message} = getDiscreteApi()
const {t} = useI18n()

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
    {required: true, message: t('auth.usernameRequired'), trigger: ['blur', 'input']}
  ],
  password: [
    {required: true, message: t('auth.passwordRequired'), trigger: ['blur', 'input']}
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
.login-container {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  overflow: hidden;
  padding: 20px;
}

.background-decoration {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 1;

  .circle {
    position: absolute;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    animation: float 6s ease-in-out infinite;

    &.circle-1 {
      width: 200px;
      height: 200px;
      top: 10%;
      left: 10%;
      animation-delay: 0s;
    }

    &.circle-2 {
      width: 150px;
      height: 150px;
      top: 60%;
      right: 10%;
      animation-delay: 2s;
    }

    &.circle-3 {
      width: 100px;
      height: 100px;
      bottom: 20%;
      left: 20%;
      animation-delay: 4s;
    }
  }
}

@keyframes float {

  0%,
  100% {
    transform: translateY(0px);
  }

  50% {
    transform: translateY(-20px);
  }
}

.login-card {
  position: relative;
  z-index: 2;
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  padding: 40px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);

  @media (max-width: 480px) {
    padding: 30px 20px;
    border-radius: 15px;
  }
}

.login-header {
  text-align: center;
  margin-bottom: 40px;

  .logo {
    margin-bottom: 20px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    background: linear-gradient(135deg, #1890ff, #40a9ff);
    border-radius: 20px;
    box-shadow: 0 8px 20px rgba(24, 144, 255, 0.3);

    .vite-logo {
      width: 45px;
      height: 45px;
      filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
    }
  }

  .title {
    font-size: 28px;
    font-weight: 700;
    color: #1a1a1a;
    margin: 0 0 8px 0;
    background: linear-gradient(135deg, #1890ff, #722ed1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .subtitle {
    font-size: 16px;
    color: #666;
    margin: 0;
    font-weight: 400;
  }
}

.login-form {
  .n-form-item {
    margin-bottom: 20px;

    :deep(.n-input) {
      border-radius: 12px;
      background: rgba(248, 250, 252, 0.8);
      border: 1px solid #e1e8ed;
      transition: all 0.3s ease;

      &:hover {
        border-color: #1890ff;
        background: rgba(255, 255, 255, 0.9);
      }

      &.n-input--focus {
        border-color: #1890ff;
        background: rgba(255, 255, 255, 1);
        box-shadow: 0 0 0 3px rgba(24, 144, 255, 0.1);
      }
    }
  }
}

.form-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;

  :deep(.n-checkbox) {
    font-size: 14px;
    color: #666;
  }

  :deep(.n-button--text) {
    font-size: 14px;
    padding: 0;
    height: auto;
  }
}

.login-button {
  margin-bottom: 20px;
  border-radius: 12px;
  height: 48px;
  font-size: 16px;
  font-weight: 600;
  background: linear-gradient(135deg, #1890ff, #40a9ff);
  border: none;
  box-shadow: 0 4px 15px rgba(24, 144, 255, 0.3);
  transition: all 0.3s ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(24, 144, 255, 0.4);
  }

  &:active:not(:disabled) {
    transform: translateY(0);
  }
}

.divider {
  margin: 24px 0;

  :deep(.n-divider__title) {
    font-size: 14px;
    color: #999;
  }
}

.register-section {
  text-align: center;

  .register-text {
    font-size: 14px;
    color: #666;
    margin-right: 8px;
  }

  .register-button {
    font-size: 14px;
    font-weight: 600;
    padding: 0;
    height: auto;
  }
}

// 响应式设计
@media (max-width: 768px) {
  .login-container {
    padding: 15px;
  }

  .login-header {
    .title {
      font-size: 24px;
    }

    .subtitle {
      font-size: 14px;
    }
  }

  .form-options {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }
}
</style>