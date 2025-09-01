<template>
  <!-- 注册卡片 -->
  <div class="register-card">
    <div class="brand-section">
      <h1 class="brand-title">{{ $t('auth.register') }}</h1>
    </div>
    
    <n-carousel show-arrow>
      <!-- 第一页：基本信息 -->
      <n-form ref="registerFormRef" :model="registerForm" :rules="registerRules" size="large"
        @keyup.enter="handleRegister">
        <n-form-item path="username" :show-label="false">
          <n-input v-model:value="registerForm.username" :placeholder="$t('auth.username')"
            clearable>
            <template #prefix>
              <n-icon>
                <Icon :component="PersonOutline" />
              </n-icon>
            </template>
          </n-input>
        </n-form-item>

        <n-form-item path="password" :show-label="false">
          <n-input v-model:value="registerForm.password" type="password" :placeholder="$t('auth.password')"
            show-password-on="click" clearable>
            <template #prefix>
              <n-icon>
                <Icon :component="LockClosedOutline" />
              </n-icon>
            </template>
          </n-input>
        </n-form-item>

        <n-form-item path="confirmPassword" :show-label="false">
          <n-input v-model:value="registerForm.confirmPassword" type="password" :placeholder="$t('auth.confirmPassword')"
            show-password-on="click" clearable>
            <template #prefix>
              <n-icon>
                <Icon :component="LockClosedOutline" />
              </n-icon>
            </template>
          </n-input>
        </n-form-item>

        <n-form-item path="verificationCode" :show-label="false">
          <div style="display: flex; gap: 8px;">
            <n-input v-model:value="registerForm.verificationCode" :placeholder="$t('auth.verificationCode')"
              clearable>
              <template #prefix>
                <n-icon>
                  <Icon :component="PersonOutline" />
                </n-icon>
              </template>
            </n-input>
            <n-button type="primary" @click="handleVerificationCodeSent" :disabled="captchaDisabled">
              {{ captchaText }}
            </n-button>
          </div>
        </n-form-item>
      </n-form>

      <!-- 第二页：个人信息 -->
      <n-form ref="registerFormRef" :model="registerForm" :rules="registerRules" size="large"
        @keyup.enter="handleRegister">
        <n-form-item path="nickName" :show-label="false">
          <n-input v-model:value="registerForm.nickName" :placeholder="$t('auth.nickName')"
            clearable>
            <template #prefix>
              <n-icon>
                <Icon :component="PersonOutline" />
              </n-icon>
            </template>
          </n-input>
        </n-form-item>

        <n-form-item path="avatar" :show-label="false">
          <div style="text-align: center;">
            <n-avatar
              round
              :size="80"
              src="https://07akioni.oss-cn-beijing.aliyuncs.com/07akioni.jpeg"
            />
            <div style="margin-top: 8px;">
              <n-button text>上传头像</n-button>
            </div>
          </div>
        </n-form-item>
      </n-form>
    </n-carousel>

    <!-- 返回登录链接 -->
    <div class="register-section">
      <span>{{ $t('auth.haveAccount') }}</span>
      <n-button text @click="$emit('switchToLogin')">
        {{ $t('auth.backToLogin') }}
      </n-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useMessage, type FormInst, type FormRules } from 'naive-ui'
import Icon from '@/components/common/Icon.vue'
import { PersonOutline, LockClosedOutline } from '@vicons/ionicons5'

// 定义事件
const emit = defineEmits<{
  switchToLogin: []
}>()

// 获取必要的实例
const message = useMessage()
const { t } = useI18n()

// 表单引用和状态
const registerFormRef = ref<FormInst | null>(null)
const loading = ref(false)

// 注册表单数据
interface RegisterForm {
  username: string
  password: string
  confirmPassword: string
  verificationCode: string
  nickName: string
  avatar: string
}

const registerForm = ref<RegisterForm>({
  username: '',
  password: '',
  confirmPassword: '',
  verificationCode: '',
  nickName: '',
  avatar: ''
})

// 注册表单验证规则
const validatePasswordSame = (rule: any, value: string) => {
  return value === registerForm.value.password
}

const registerRules: FormRules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度在 3 到 20 个字符', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度在 6 到 20 个字符', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    { validator: validatePasswordSame, message: '两次输入密码不一致', trigger: 'blur' }
  ],
  verificationCode: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { len: 6, message: '验证码长度为 6 位', trigger: 'blur' }
  ],
  nickName: [
    { required: true, message: '请输入昵称', trigger: 'blur' }
  ]
}

// 验证码相关
const captchaDisabled = ref(false)
const captchaText = ref('发送验证码')

// 处理注册
const handleRegister = async () => {
  if (!registerFormRef.value) return

  try {
    await registerFormRef.value.validate()
    loading.value = true

    // 这里调用注册API
    // const success = await userStore.register(registerForm.value)
    
    // 模拟注册成功
    message.success('注册成功')
    // 注册成功后切换到登录页面
    emit('switchToLogin')
  } catch (error: any) {
    message.error('注册失败')
  } finally {
    loading.value = false
  }
}

// 发送验证码
const handleVerificationCodeSent = async () => {
  captchaDisabled.value = true
  captchaText.value = '60s'
  
  let countdown = 60
  const timer = setInterval(() => {
    countdown--
    captchaText.value = `${countdown}s`
    
    if (countdown <= 0) {
      clearInterval(timer)
      captchaDisabled.value = false
      captchaText.value = '发送验证码'
    }
  }, 1000)

  message.success('验证码已发送')
}
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
