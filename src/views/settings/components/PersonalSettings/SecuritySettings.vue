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

    <!-- 修改密码的弹�?-->
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
  </n-space>
</template>

<script lang="ts" setup>
import {computed, reactive, ref, watch} from 'vue'
import type {FormInst, FormRules} from 'naive-ui'
import {useUserStore} from '@/store'
import {useRouter} from 'vue-router'
import {useI18n} from 'vue-i18n'
import {getDefaultSysUserPasswordDTO, logout, updatePassword} from '@/api/auth/auth'
import {getDiscreteApi} from '@/utils/naiveUIHelper'
import type {SysUserPasswordDTO} from '@/types/auth/auth'

const userStore = useUserStore()
const router = useRouter()
const {dialog, message} = getDiscreteApi()
const {t} = useI18n()
const passwordFormRef = ref<FormInst | null>(null)
const showPasswordModal = ref(false)

// 使用计算属性获取用户信�?
const userInfo = computed(() => userStore.userInfo)

// 修改密码表单
const passwordForm = reactive<SysUserPasswordDTO>(getDefaultSysUserPasswordDTO())

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

// 重置密码表单
const resetPasswordForm = () => {
  passwordForm.currentPassword = null
  passwordForm.newPassword = null
  passwordForm.confirmPassword = null
  if (passwordFormRef.value) {
    passwordFormRef.value.restoreValidation()
  }
}

// 监听对话框关闭事�?
watch(showPasswordModal, (newVal: boolean) => {
  if (!newVal) {
    // 当对话框关闭时重置表�?
    resetPasswordForm()
  }
})

// 修改密码
const changePassword = () => {
  passwordFormRef.value?.validate(async (errors: any) => {
    if (!errors) {
      try {
        const passwordData: SysUserPasswordDTO = {
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword,
          confirmPassword: passwordForm.confirmPassword
        }

        const res = await updatePassword(passwordData)
        if (res.success && res.data) {
          showPasswordModal.value = false

          // 显示成功对话�?
          dialog.success({
            title: t('settings.personal.passwordChangeSuccess'),
            content: t('settings.personal.passwordChangeRedirect'),
            positiveText: t('common.confirm'),
            onPositiveClick: async () => {
              try {
                // 登出当前用户
                await logout()

                // 清除用户状�?
                userStore.resetUserState()

                // 跳转到登录页
                router.push('/login')
              } catch (error) {
                // 即使登出失败也跳转到登录�?
                router.push('/login')
              }
            }
          })
        } else {
          message.error(res.message || t('settings.personal.passwordChangeFail'))
        }
      } catch (error) {
        message.error(t('settings.personal.passwordChangeFail'))
      }
    }
  })
}
</script>

<style lang="scss" scoped>
@use './SecuritySettings.scss';
</style>
