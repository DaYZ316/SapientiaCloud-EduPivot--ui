<template>
  <!-- 登录页面内容 -->
  <div class="login-container">
    <!-- 主题切换按钮 -->
    <div class="theme-toggle">
      <n-button circle quaternary size="small" @click="toggleTheme">
        <template #icon>
          <n-icon>
            <Icon :component="getThemeIcon()"/>
          </n-icon>
        </template>
      </n-button>
    </div>

    <!-- 主内容区域 -->
    <main class="main-content">
      <!-- 项目名称 -->
      <div class="project-name">
        <h1 class="project-title">{{ $t('app.name') }}</h1>
      </div>

      <!-- 登录方式切换 -->
      <div class="login-methods-toggle">
        <n-button-group>
          <n-button
              :type="currentLoginMethod === 'password' ? 'primary' : 'default'"
              @click="currentLoginMethod = 'password'"
          >
            {{ $t('auth.passwordLogin') }}
          </n-button>
          <n-button
              :type="currentLoginMethod === 'verificationCode' ? 'primary' : 'default'"
              @click="currentLoginMethod = 'verificationCode'"
          >
            {{ $t('auth.verificationCodeLogin') }}
          </n-button>
        </n-button-group>
      </div>

      <!-- 密码登录组件 -->
      <Login
          v-if="currentLoginMethod === 'password' && !isRegister"
          @switch-to-register="isRegister = true"
          @switch-to-verification-code-login="currentLoginMethod = 'verificationCode'"
      />

      <!-- 验证码登录组件 -->
      <VerificationCodeLogin
          v-else-if="currentLoginMethod === 'verificationCode' && !isRegister"
          @switch-to-password-login="currentLoginMethod = 'password'"
          @switch-to-register="isRegister = true"
      />

      <!-- 注册组件 -->
      <Register v-else @switch-to-login="isRegister = false"/>
    </main>
  </div>
</template>

<script lang="ts" setup>
import {computed, ref} from 'vue'
import {useI18n} from 'vue-i18n'
import {useThemeStore} from '@/store'
import {NButton, NButtonGroup, NIcon} from 'naive-ui'
import Icon from '@/components/common/Icon.vue'
import {DesktopOutline, Moon, Sunny} from '@vicons/ionicons5'
import Login from './Login/index.vue'
import VerificationCodeLogin from './VerificationCodeLogin/index.vue'
import Register from './Register/index.vue'

const {t} = useI18n()
const themeStore = useThemeStore()

// 控制显示登录还是注册
const isRegister = ref(false)
// 控制当前登录方式：password 或 verificationCode
const currentLoginMethod = ref<'password' | 'verificationCode'>('password')

// 计算属性：是否为暗色模式
const isDarkMode = computed(() => themeStore.isDarkMode)

// 获取主题图标
const getThemeIcon = () => {
  switch (themeStore.themeMode) {
    case 'light':
      return Sunny
    case 'dark':
      return Moon
    case 'system':
      return DesktopOutline
    default:
      return Sunny
  }
}

// 切换主题
const toggleTheme = () => {
  // 循环切换：light -> dark -> system -> light
  const modes: ('light' | 'dark' | 'system')[] = ['light', 'dark', 'system']
  const currentIndex = modes.indexOf(themeStore.themeMode)
  const nextIndex = (currentIndex + 1) % modes.length
  themeStore.setThemeMode(modes[nextIndex])
}
</script>

<style lang="scss" scoped>
@use './index.scss';

.login-methods-toggle {
  display: flex;
  justify-content: center;
  margin-bottom: 24px;

  .n-button-group {
    .n-button {
      min-width: 120px;
      border-radius: 8px;
      font-weight: 500;
    }
  }
}

// 响应式设计
@media (max-width: 480px) {
  .login-methods-toggle {
    margin-bottom: 16px;

    .n-button-group {
      .n-button {
        min-width: 100px;
        font-size: 14px;
      }
    }
  }
}
</style>
