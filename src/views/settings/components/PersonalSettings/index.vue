<template>
  <div class="personal-settings">
    <n-card :bordered="false" class="profile-card">
      <div class="profile-header">
        <div class="avatar-section">
          <AvatarUpload
              :model-value="personalForm.avatar || undefined"
              :size="80"
              @update:model-value="(value: string) => personalForm.avatar = value"
              @upload-success="handleAvatarUploadSuccess"
              @upload-error="handleAvatarUploadError"
          />
        </div>
        <div class="user-info-brief">
          <h3>{{ userInfo?.nickName || userInfo?.username }}</h3>
          <n-tag v-for="role in userRoles" :key="role.id" class="role-tag" size="small">
            {{ role.roleName }}
          </n-tag>
        </div>
      </div>
    </n-card>

    <n-card :bordered="false" class="info-card mt-4">
      <n-tabs animated type="line">
        <n-tab-pane :tab="t('settings.personal.basicInfo')" name="basic">
          <BasicInfo ref="basicInfoRef"/>
        </n-tab-pane>

        <n-tab-pane :tab="t('settings.personal.binding')" name="binding">
          <BindingSettings ref="bindingSettingsRef"/>
        </n-tab-pane>

        <n-tab-pane :tab="t('settings.personal.security')" name="security">
          <SecuritySettings/>
        </n-tab-pane>
      </n-tabs>
    </n-card>
  </div>
</template>

<script lang="ts" setup>
import {computed, onMounted, reactive, ref} from 'vue'
import {useUserStore} from '@/store'
import {useI18n} from 'vue-i18n'
import {getDefaultSysUserProfileDTO} from '@/api/system/user'
import type {SysUserProfileDTO} from '@/types/system/user'
import AvatarUpload from '@/components/common/AvatarUpload.vue'
import BasicInfo from './BasicInfo.vue'
import SecuritySettings from './SecuritySettings.vue'
import BindingSettings from './BindingSettings.vue'

const userStore = useUserStore()
const {t} = useI18n()
const basicInfoRef = ref()
const bindingSettingsRef = ref()

// 使用计算属性获取用户信息
const userInfo = computed(() => userStore.userInfo)
const userRoles = computed(() => userStore.userInfo?.roles || [])

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

// 头像上传成功处理
const handleAvatarUploadSuccess = (url: string) => {
  // 头像已经通过 v-model 更新到 personalForm.avatar
  // 同步更新BasicInfo组件中的头像数据
  if (basicInfoRef.value) {
    basicInfoRef.value.updateAvatar(url)
  }
}

// 头像上传失败处理
const handleAvatarUploadError = (error: Error) => {
}

// 初始化表单数据
onMounted(async () => {
  // 刷新用户信息，确保数据是最新的
  await userStore.refreshUserInfo()
  initFormData()
})
</script>

<style lang="scss" scoped>
@use './index.scss';
</style>
