<template>
  <n-form
      ref="formRef"
      :model="personalForm"
      :rules="rules"
      label-placement="left"
      label-width="120"
  >
    <n-grid :cols="24" :x-gap="24">
      <n-grid-item :span="12">
        <n-form-item :label="t('auth.username')" path="username">
          <n-input
              v-model:value="personalForm.username"
              :placeholder="t('settings.personal.usernamePlaceholder')"
              disabled
          />
        </n-form-item>
      </n-grid-item>
      <n-grid-item :span="12">
        <n-form-item :label="t('settings.personal.nickname')" path="nickName">
          <n-input
              v-model:value="personalForm.nickName"
              :placeholder="t('settings.personal.nicknamePlaceholder')"
          />
        </n-form-item>
      </n-grid-item>
    </n-grid>

    <n-grid :cols="24" :x-gap="24">
      <n-grid-item :span="12">
        <n-form-item :label="t('settings.personal.email')" path="email">
          <n-input
              v-model:value="personalForm.email"
              :placeholder="t('settings.personal.emailPlaceholder')"
          />
        </n-form-item>
      </n-grid-item>
      <n-grid-item :span="12">
        <n-form-item :label="t('settings.personal.phone')" path="mobile">
          <n-input
              v-model:value="personalForm.mobile"
              :disabled="!!userInfo?.mobile"
              :placeholder="t('settings.personal.phonePlaceholder')"
          />
        </n-form-item>
      </n-grid-item>
    </n-grid>

    <n-form-item :label="t('settings.personal.gender')" path="gender">
      <n-radio-group v-model:value="personalForm.gender">
        <n-space>
          <n-radio :value="0">{{ t('settings.personal.genderUnknown') }}</n-radio>
          <n-radio :value="1">{{ t('settings.personal.genderMale') }}</n-radio>
          <n-radio :value="2">{{ t('settings.personal.genderFemale') }}</n-radio>
        </n-space>
      </n-radio-group>
    </n-form-item>

    <n-form-item :label="t('settings.personal.lastLoginTime')">
      <span>{{ formatDateTime(userInfo?.lastLoginTime) }}</span>
    </n-form-item>

    <n-form-item>
      <n-space>
        <n-button type="primary" @click="savePersonalSettings">
          {{ t('common.save') }}
        </n-button>
        <n-button @click="resetForm">
          {{ t('common.reset') }}
        </n-button>
      </n-space>
    </n-form-item>
  </n-form>
</template>

<script lang="ts" setup>
import {computed, reactive, ref} from 'vue'
import type {FormInst, FormRules} from 'naive-ui'
import {useUserStore} from '@/store'
import {useI18n} from 'vue-i18n'
import {getDefaultSysUserProfileDTO, updateUserProfile} from '@/api/system/user'
import {getDiscreteApi} from '@/utils/naiveUIHelper'
import type {SysUserProfileDTO} from '@/types/system/user'

const userStore = useUserStore()
const {message} = getDiscreteApi()
const {t} = useI18n()
const formRef = ref<FormInst | null>(null)

// 使用计算属性获取用户信息
const userInfo = computed(() => userStore.userInfo)

// 表单数据
const personalForm = reactive<SysUserProfileDTO>(getDefaultSysUserProfileDTO())

// 初始化表单数据
const initFormData = () => {
  if (userInfo.value) {
    personalForm.username = userInfo.value.username || ''
    personalForm.nickName = userInfo.value.nickName || ''
    personalForm.email = userInfo.value.email || ''
    personalForm.mobile = userInfo.value.mobile || ''
    personalForm.gender = userInfo.value.gender || 0
    personalForm.avatar = userInfo.value.avatar || ''
  }
}

// 表单验证规则
const rules: FormRules = {
  nickName: [
    {required: true, message: t('settings.personal.nicknameRequired'), trigger: 'blur'}
  ],
  email: [
    {required: true, message: t('settings.personal.emailRequired'), trigger: 'blur'},
    {type: 'email', message: t('settings.personal.emailInvalid'), trigger: 'blur'}
  ],
  mobile: [
    {required: true, message: t('settings.personal.phoneRequired'), trigger: 'blur'},
    {pattern: /^1[3-9]\d{9}$/, message: t('settings.personal.phoneInvalid'), trigger: 'blur'}
  ]
}

// 格式化日期时间
function formatDateTime(dateStr?: string): string {
  if (!dateStr) return '-'
  try {
    const date = new Date(dateStr)
    return date.toLocaleString()
  } catch (e) {
    return dateStr
  }
}

// 保存个人设置
const savePersonalSettings = () => {
  formRef.value?.validate(async (errors: any) => {
    if (!errors) {
      try {
        if (!userInfo.value) {
          message.error(t('settings.personal.updateFail'))
          return
        }

        // 调用API更新用户个人信息
        const userData: SysUserProfileDTO = {
          username: personalForm.username,
          nickName: personalForm.nickName,
          email: personalForm.email,
          mobile: personalForm.mobile,
          gender: personalForm.gender,
          avatar: personalForm.avatar
        }

        const res = await updateUserProfile(userData)
        if (res.success && res.data) {
          message.success(t('settings.personal.updateSuccess'))

          // 更新本地存储的用户信息
          await userStore.refreshUserInfo()
        } else {
          message.error(res.message || t('settings.personal.updateFail'))
        }
      } catch (error) {
        console.error('更新用户信息失败:', error)
        message.error(t('settings.personal.updateFail'))
      }
    }
  })
}

// 重置表单
const resetForm = () => {
  initFormData()
}

// 暴露方法给父组件
defineExpose({
  initFormData,
  resetForm
})

// 初始化表单数据
initFormData()
</script>
